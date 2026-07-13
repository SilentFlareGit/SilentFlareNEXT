from __future__ import annotations

import asyncio
import hmac
import ipaddress
import json
import sqlite3
import time
import uuid
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any
from urllib.parse import quote

import httpx
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse, RedirectResponse, StreamingResponse
from pydantic import BaseModel, Field
from starlette.background import BackgroundTask

from .config import Settings, settings
from .database import Database, mask_ip, stable_hash
from .geo import GeoService, IpIntel
from .rate_limit import RateHit, RateLimiter
from .risk import DEFAULT_THRESHOLDS, DEFAULT_WEIGHTS, RiskResult, score_request
from .rules import AccessListService, RequestContext, RuleDecision, RuleEngine, matches_expression
from .security import SHIELD_HEADERS, issue_token, read_token, sign_headers


ROOT = Path(__file__).resolve().parents[1]
HOP_BY_HOP = {"connection", "keep-alive", "proxy-authenticate", "proxy-authorization", "te", "trailers", "transfer-encoding", "upgrade"}
SENSITIVE_PATHS = ("/auth/", "/accounts/register/", "/admin", "/comments/create")


class AccessListInput(BaseModel):
	kind: str = Field(pattern=r"^(allow|deny)$")
	subject_type: str = Field(pattern=r"^(ip|cidr|asn|country|region|account)$")
	subject_value: str
	scope_host: str | None = None
	scope_path: str | None = None
	scope_method: str | None = None
	note: str = ""
	expires_at: int | None = None


class RuleInput(BaseModel):
	name: str
	description: str = ""
	priority: int = 100
	enabled: bool = True
	mode: str = Field(default="enforce", pattern=r"^(observe|enforce)$")
	conditions: dict[str, Any]
	actions: list[str]


class BanInput(BaseModel):
	subject_type: str = Field(pattern=r"^(account|ip|cidr|asn|country|region|device|session|email|email_domain|api_key)$")
	subject_value: str
	restriction: str = "all"
	reason: str
	expires_at: int | None = None


def build_services(config: Settings):
	database = Database(config.database_path, ROOT / "migrations")
	database.migrate()
	key = config.internal_signing_key or "bypass-development-key"
	return (
		database,
		GeoService(database, key, config.geo_url_template, config.geo_cache_ttl, config.allow_private_geo),
		RuleEngine(database),
		AccessListService(database, key),
		RateLimiter(database, key),
	)


@asynccontextmanager
async def lifespan(app: FastAPI):
	settings.validate()
	database, geo, rules, access, limiter = build_services(settings)
	app.state.database = database
	app.state.geo = geo
	app.state.rules = rules
	app.state.access = access
	app.state.limiter = limiter
	app.state.client = httpx.AsyncClient(timeout=settings.proxy_timeout_seconds, follow_redirects=False)
	app.state.degraded_counters = {}
	app.state.degraded_events = []
	yield
	await app.state.client.aclose()


app = FastAPI(title="SilentFlare Shield", version="0.1.0", docs_url=None, redoc_url=None, lifespan=lifespan)


def _trusted_peer(request: Request) -> bool:
	try:
		peer = ipaddress.ip_address(request.client.host if request.client else "127.0.0.1")
		return any(peer in ipaddress.ip_network(cidr, strict=False) for cidr in settings.trusted_proxy_cidrs)
	except ValueError:
		return False


def _client_ip(request: Request) -> str:
	peer = request.client.host if request.client else "127.0.0.1"
	if not _trusted_peer(request):
		return peer
	for candidate in (request.headers.get("cf-connecting-ip"), (request.headers.get("x-forwarded-for") or "").split(",")[0].strip()):
		try:
			if candidate:
				return str(ipaddress.ip_address(candidate))
		except ValueError:
			continue
	return peer


def _host(request: Request) -> str:
	return request.headers.get("host", "").split(":", 1)[0].lower()


def _device_id(request: Request, ip: str) -> str:
	cookie = request.cookies.get("sf_shield_device", "")
	payload = read_token(cookie, settings.internal_signing_key) if cookie else None
	if payload and payload.get("purpose") == "device":
		return str(payload.get("id", ""))
	seed = f"{request.headers.get('user-agent', '')}|{request.headers.get('accept-language', '')}|{ip}"
	return stable_hash(seed, settings.internal_signing_key)[:32]


async def _admin(request: Request, csrf: bool = False) -> tuple[str, str]:
	session_token = request.cookies.get(settings.admin_cookie_name, "")
	if not session_token:
		raise HTTPException(status_code=401, detail="SilentFlare Admin authentication required")
	try:
		response = await request.app.state.client.get(
			settings.admin_introspection_url,
			headers={
				"Accept": "application/json",
				"Cookie": f"{settings.admin_cookie_name}={session_token}",
				"Host": "api.silentflare.com",
			},
		)
	except httpx.HTTPError as error:
		raise HTTPException(status_code=503, detail="Admin session validation unavailable") from error
	if response.status_code in {401, 403}:
		raise HTTPException(status_code=response.status_code, detail="SilentFlare Admin session is not valid")
	if response.status_code != 200:
		raise HTTPException(status_code=503, detail="Admin session validation unavailable")
	try:
		payload = response.json()
	except json.JSONDecodeError as error:
		raise HTTPException(status_code=503, detail="Admin session validation unavailable") from error
	if (payload.get("bot") or {}).get("id") != "SilentFlare Admin":
		raise HTTPException(status_code=403, detail="SilentFlare Admin role required")
	upstream_csrf = str(payload.get("csrf", ""))
	if not upstream_csrf:
		raise HTTPException(status_code=503, detail="Admin session validation unavailable")
	if csrf and not hmac.compare_digest(request.headers.get("x-csrf-token", ""), upstream_csrf):
		raise HTTPException(status_code=403, detail="CSRF validation failed")
	return "SilentFlare Admin", upstream_csrf


def _mode(database: Database) -> str:
	mode = database.setting("global_mode", settings.mode)
	return mode if mode in {"bypass", "observe", "enforce"} else settings.mode


def _is_sensitive(host: str, path: str, method: str) -> bool:
	return host in {"admin.silentflare.com", "cms.silentflare.com"} or method != "GET" or any(path.startswith(prefix) for prefix in SENSITIVE_PATHS)


def _failure_response(host: str, path: str, method: str, request_id: str) -> Response | None:
	closed = settings.fail_policy == "closed" or (settings.fail_policy == "route" and _is_sensitive(host, path, method))
	if closed:
		return JSONResponse({"detail": "Security gateway temporarily unavailable", "requestId": request_id}, status_code=503, headers={"Retry-After": "5"})
	return None


def _memory_degraded_context(request: Request, request_id: str, host: str) -> tuple[RequestContext, RiskResult, bool]:
	now = int(time.time())
	ip = _client_ip(request)
	window = now // 60
	key = (stable_hash(ip, settings.internal_signing_key), host, request.url.path, request.method, window)
	counters = request.app.state.degraded_counters
	counters[key] = counters.get(key, 0) + 1
	if len(counters) > 10_000:
		request.app.state.degraded_counters = {item: count for item, count in counters.items() if item[-1] >= window - 1}
	limit = 10 if request.url.path.startswith("/auth/login/") else 3 if request.url.path.startswith("/accounts/register/") else 100
	exceeded = counters[key] > limit
	headers = {name.lower(): value for name, value in request.headers.items()}
	risk = score_request(IpIntel(ip=ip), headers, {}, rate_exceeded=exceeded)
	context = RequestContext(request_id, host, request.url.path, request.method, ip, device_id=_device_id(request, ip), risk_score=risk.score, rate_exceeded=exceeded)
	events = request.app.state.degraded_events
	events.append({"createdAt": now, "requestId": request_id, "host": host, "path": request.url.path, "method": request.method, "ipMasked": mask_ip(ip), "riskScore": risk.score, "reason": "database_unavailable"})
	del events[:-1000]
	return context, risk, exceeded


def _safe_request_summary(request: Request, body: bytes) -> dict[str, Any]:
	return {
		"contentType": request.headers.get("content-type", "")[:100],
		"contentLength": len(body),
		"originHost": (request.headers.get("origin", "").split("//")[-1].split("/")[0])[:200],
		"refererHost": (request.headers.get("referer", "").split("//")[-1].split("/")[0])[:200],
		"userAgent": request.headers.get("user-agent", "")[:300],
	}


def _email_from_body(body: bytes, content_type: str) -> str:
	if "application/json" not in content_type or len(body) > 64_000:
		return ""
	try:
		value = json.loads(body).get("email", "")
		return str(value).strip().lower()[:320]
	except (json.JSONDecodeError, AttributeError):
		return ""


async def _read_body(request: Request) -> bytes:
	declared = request.headers.get("content-length")
	if declared:
		try:
			if int(declared) > settings.max_body_bytes:
				raise HTTPException(status_code=413, detail="Request body exceeds Shield limit")
		except ValueError:
			raise HTTPException(status_code=400, detail="Invalid Content-Length") from None
	body = bytearray()
	async for chunk in request.stream():
		body.extend(chunk)
		if len(body) > settings.max_body_bytes:
			raise HTTPException(status_code=413, detail="Request body exceeds Shield limit")
	return bytes(body)


def _actions(mode: str, risk: RiskResult, list_status: str | None, ban: dict | None, rates: list[RateHit], rules: RuleDecision, challenge_passed: bool) -> list[str]:
	if mode == "bypass":
		return ["bypass"]
	actions = list(rules.actions)
	if list_status == "allow":
		return ["allow"]
	if ban and ban.get("restriction") == "review":
		actions.append("manual_review")
	elif ban or list_status == "deny" or risk.level == "block":
		actions.append("block")
	elif risk.level == "restrict":
		actions.append("rate_limit")
	elif risk.level == "verify" and not challenge_passed:
		actions.append("turnstile")
	for hit in rates:
		actions.append(hit.action)
	if mode == "observe":
		return ["log"]
	return list(dict.fromkeys(actions or ["allow"]))


def _event(database: Database, context: RequestContext, risk: RiskResult, rules: RuleDecision, actions: list[str], request: Request, body: bytes) -> None:
	if risk.level == "normal" and actions == ["allow"] and not rules.matched_rules:
		return
	database.execute(
		"""INSERT INTO risk_events(id, created_at, trace_id, risk_level, risk_score, host, path, method,
		ip_hash, ip_masked, country_code, region, asn, ip_type, account_id_hash, device_id_hash,
		session_id_hash, matched_rules_json, reasons_json, actions_json, request_summary_json)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
		(
			context.request_id, int(time.time()), context.request_id, risk.level, risk.score, context.host,
			context.path, context.method, stable_hash(context.ip, settings.internal_signing_key), mask_ip(context.ip),
			context.country, context.region, context.asn, context.ip_type,
			stable_hash(context.account_id, settings.internal_signing_key) if context.account_id else None,
			stable_hash(context.device_id, settings.internal_signing_key) if context.device_id else None,
			stable_hash(context.session_id, settings.internal_signing_key) if context.session_id else None,
			json.dumps(rules.matched_rules, separators=(",", ":")), json.dumps(risk.reasons, separators=(",", ":")),
			json.dumps(actions, separators=(",", ":")), json.dumps(_safe_request_summary(request, body), separators=(",", ":")),
		),
	)


async def _proxy(request: Request, body: bytes, upstream: str, context: RequestContext | None, risk: RiskResult | None, action: str) -> Response:
	url = f"{upstream}{request.url.path}"
	if request.url.query:
		url += f"?{request.url.query}"
	headers = {name.lower(): value for name, value in request.headers.items() if name.lower() not in HOP_BY_HOP and name.lower() not in SHIELD_HEADERS}
	headers["host"] = _host(request)
	headers["x-forwarded-proto"] = request.headers.get("x-forwarded-proto", request.url.scheme)
	headers["x-forwarded-for"] = context.ip if context else _client_ip(request)
	headers["x-real-ip"] = headers["x-forwarded-for"]
	if context and risk and settings.internal_signing_key:
		shield_headers = {
			"x-sf-shield-request-id": context.request_id,
			"x-sf-shield-risk-score": str(risk.score),
			"x-sf-shield-risk-level": risk.level,
			"x-sf-shield-country": context.country,
			"x-sf-shield-asn": context.asn,
			"x-sf-shield-ip-type": context.ip_type,
			"x-sf-shield-device-id": context.device_id,
			"x-sf-shield-action": action,
			"x-sf-shield-timestamp": str(int(time.time())),
		}
		shield_headers["x-sf-shield-signature"] = sign_headers(shield_headers, request.method, request.url.path, settings.internal_signing_key)
		headers.update(shield_headers)
	proxy_request = app.state.client.build_request(request.method, url, headers=headers, content=body)
	proxy_response = await app.state.client.send(proxy_request, stream=True)
	if context and proxy_response.status_code == 404:
		try:
			response_hits = request.app.state.limiter.check(context, response_status=404)
			if response_hits:
				now = int(time.time())
				event_id = uuid.uuid4().hex
				actions = ["log"] if _mode(request.app.state.database) == "observe" else ["temporary_ban"]
				request.app.state.database.execute(
					"""INSERT INTO risk_events(id, created_at, trace_id, risk_level, risk_score, host, path, method,
					ip_hash, ip_masked, country_code, region, asn, ip_type, device_id_hash, matched_rules_json,
					reasons_json, actions_json, request_summary_json) VALUES (?, ?, ?, 'restrict', 65, ?, ?, ?, ?, ?,
					?, ?, ?, ?, ?, '[]', ?, ?, ?)""",
					(event_id, now, context.request_id, context.host, context.path, context.method,
					stable_hash(context.ip, settings.internal_signing_key), mask_ip(context.ip), context.country,
					context.region, context.asn, context.ip_type,
					stable_hash(context.device_id, settings.internal_signing_key) if context.device_id else None,
					json.dumps(["Repeated 404 responses indicate path scanning"]), json.dumps(actions),
					json.dumps(_safe_request_summary(request, body), separators=(",", ":"))),
				)
				if "temporary_ban" in actions:
					expires_at = now + max(hit.retry_after for hit in response_hits)
					request.app.state.database.execute(
						"INSERT INTO bans(subject_type, subject_hash, subject_display, restriction, reason, created_by, created_at, expires_at) VALUES ('ip', ?, ?, 'all', 'Automatic 404 scan policy', 'shield', ?, ?)",
						(stable_hash(context.ip, settings.internal_signing_key), mask_ip(context.ip), now, expires_at),
					)
		except sqlite3.Error:
			request.app.state.degraded_events.append({"createdAt": int(time.time()), "requestId": context.request_id, "host": context.host, "path": context.path, "method": context.method, "ipMasked": mask_ip(context.ip), "riskScore": 0, "reason": "response_telemetry_database_unavailable"})
	response_headers = {name: value for name, value in proxy_response.headers.items() if name.lower() not in HOP_BY_HOP}
	if context:
		response_headers["X-SF-Shield-Request-ID"] = context.request_id
	return StreamingResponse(proxy_response.aiter_raw(), status_code=proxy_response.status_code, headers=response_headers, background=BackgroundTask(proxy_response.aclose))


@app.get("/__shield/health/live")
async def liveness():
	return {"status": "live", "version": app.version}


@app.get("/__shield/health/ready")
async def readiness(request: Request):
	try:
		request.app.state.database.query("SELECT 1")
		return {"status": "ready", "mode": _mode(request.app.state.database)}
	except Exception:
		return JSONResponse({"status": "degraded", "mode": settings.mode}, status_code=503)


@app.get("/__shield/admin", include_in_schema=False)
async def admin_page(request: Request):
	try:
		await _admin(request)
	except HTTPException as error:
		if error.status_code not in {401, 403}:
			raise
		return_url = quote(str(request.url), safe="")
		return RedirectResponse(f"https://auth.silentflare.com/?audience=admin&return_url={return_url}", status_code=302)
	return FileResponse(ROOT / "static" / "index.html")


@app.get("/__shield/static/{filename}", include_in_schema=False)
async def admin_asset(filename: str):
	if filename not in {"app.css", "app.js"}:
		raise HTTPException(status_code=404)
	return FileResponse(ROOT / "static" / filename)


@app.get("/__shield/api/admin/session")
async def admin_session(request: Request):
	actor, csrf = await _admin(request)
	return {"authenticated": True, "actor": actor, "csrfToken": csrf, "mode": _mode(request.app.state.database)}


@app.get("/__shield/api/admin/overview")
async def admin_overview(request: Request):
	await _admin(request)
	db = request.app.state.database
	now = int(time.time())
	day = now - 86400
	counts = db.query("SELECT COUNT(*) AS events, SUM(CASE WHEN risk_score >= 80 THEN 1 ELSE 0 END) AS blocked, SUM(CASE WHEN risk_score >= 40 AND risk_score < 80 THEN 1 ELSE 0 END) AS challenged FROM risk_events WHERE created_at >= ?", (day,))[0]
	active_bans = db.query("SELECT COUNT(*) AS value FROM bans WHERE revoked_at IS NULL AND (expires_at IS NULL OR expires_at > ?)", (now,))[0]["value"]
	top_countries = db.query("SELECT COALESCE(country_code, 'Unknown') AS label, COUNT(*) AS value FROM risk_events WHERE created_at >= ? GROUP BY country_code ORDER BY value DESC LIMIT 5", (day,))
	top_rules = db.query("SELECT name AS label, hit_count AS value FROM rules ORDER BY hit_count DESC LIMIT 5")
	return {"mode": _mode(db), "events": counts["events"] or 0, "blocked": counts["blocked"] or 0, "challenged": counts["challenged"] or 0, "activeBans": active_bans, "topCountries": top_countries, "topRules": top_rules, "hosts": sorted(settings.upstreams)}


@app.get("/__shield/api/admin/events")
async def admin_events(request: Request, limit: int = 100, minimum_score: int = 0):
	await _admin(request)
	return request.app.state.database.query("SELECT id, created_at, risk_level, risk_score, host, path, method, ip_masked, country_code, asn, ip_type, matched_rules_json, reasons_json, actions_json, review_status FROM risk_events WHERE risk_score >= ? ORDER BY created_at DESC LIMIT ?", (max(0, minimum_score), min(500, max(1, limit))))


@app.get("/__shield/api/admin/intel")
async def admin_intel(request: Request, limit: int = 200):
	await _admin(request)
	return request.app.state.database.query("SELECT ip_masked, country_code, region, city, timezone, asn, isp, organization, ip_type, is_vpn, is_proxy, is_tor, is_crawler, is_malicious, risk_score, first_seen_at, last_seen_at FROM ip_intel ORDER BY last_seen_at DESC LIMIT ?", (min(500, max(1, limit)),))


@app.get("/__shield/api/admin/rate-policies")
async def admin_rate_policies(request: Request):
	await _admin(request)
	return request.app.state.database.query("SELECT * FROM rate_policies ORDER BY id")


@app.get("/__shield/api/admin/settings/risk")
async def admin_risk_settings(request: Request):
	await _admin(request)
	db = request.app.state.database
	return {
		"weights": DEFAULT_WEIGHTS | db.setting("risk_weights", {}),
		"thresholds": DEFAULT_THRESHOLDS | db.setting("risk_thresholds", {}),
	}


@app.put("/__shield/api/admin/settings/risk")
async def update_risk_settings(request: Request):
	actor, _ = await _admin(request, csrf=True)
	payload = await request.json()
	weights = payload.get("weights")
	thresholds = payload.get("thresholds")
	if not isinstance(weights, dict) or set(weights) != set(DEFAULT_WEIGHTS):
		raise HTTPException(status_code=422, detail="Every risk weight is required")
	if not isinstance(thresholds, dict) or set(thresholds) != set(DEFAULT_THRESHOLDS):
		raise HTTPException(status_code=422, detail="Every risk threshold is required")
	try:
		weights = {key: int(value) for key, value in weights.items()}
		thresholds = {key: int(value) for key, value in thresholds.items()}
	except (TypeError, ValueError) as error:
		raise HTTPException(status_code=422, detail="Weights and thresholds must be integers") from error
	if any(value < -100 or value > 100 for value in weights.values()):
		raise HTTPException(status_code=422, detail="Weights must be between -100 and 100")
	ordered = [thresholds[name] for name in ("observe", "verify", "restrict", "block")]
	if ordered != sorted(ordered) or len(set(ordered)) != 4 or ordered[0] < 1 or ordered[-1] > 100:
		raise HTTPException(status_code=422, detail="Thresholds must be strictly increasing between 1 and 100")
	db = request.app.state.database
	db.set_setting("risk_weights", weights, actor)
	db.set_setting("risk_thresholds", thresholds, actor)
	db.audit(actor, "risk_settings.update", "system", "risk", {"weights": weights, "thresholds": thresholds})
	return {"weights": weights, "thresholds": thresholds}


@app.get("/__shield/api/admin/lists")
async def admin_lists(request: Request):
	await _admin(request)
	return request.app.state.database.query("SELECT * FROM access_lists ORDER BY id DESC")


@app.post("/__shield/api/admin/lists")
async def create_list(payload: AccessListInput, request: Request):
	actor, _ = await _admin(request, csrf=True)
	if payload.subject_type in {"ip", "cidr"}:
		try:
			ipaddress.ip_network(payload.subject_value, strict=False)
		except ValueError as error:
			raise HTTPException(status_code=422, detail="Invalid IP or CIDR") from error
	value = stable_hash(payload.subject_value, settings.internal_signing_key) if payload.subject_type == "account" else payload.subject_value
	now = int(time.time())
	id_value = request.app.state.database.execute("INSERT INTO access_lists(kind, subject_type, subject_value, scope_host, scope_path, scope_method, note, created_by, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (payload.kind, payload.subject_type, value, payload.scope_host, payload.scope_path, payload.scope_method.upper() if payload.scope_method else None, payload.note, actor, now, payload.expires_at))
	request.app.state.database.audit(actor, "access_list.create", "access_list", str(id_value), payload.model_dump(exclude={"subject_value"}) | {"subjectValueMasked": payload.subject_value[:8]})
	return {"id": id_value}


@app.delete("/__shield/api/admin/lists/{item_id}")
async def disable_list(item_id: int, request: Request):
	actor, _ = await _admin(request, csrf=True)
	request.app.state.database.execute("UPDATE access_lists SET disabled_at = ? WHERE id = ?", (int(time.time()), item_id))
	request.app.state.database.audit(actor, "access_list.disable", "access_list", str(item_id), {})
	return {"disabled": True}


@app.get("/__shield/api/admin/rules")
async def admin_rules(request: Request):
	await _admin(request)
	rows = request.app.state.database.query("SELECT * FROM rules ORDER BY priority, id")
	for row in rows:
		row["conditions"] = json.loads(row.pop("conditions_json"))
		row["actions"] = json.loads(row.pop("actions_json"))
	return rows


@app.post("/__shield/api/admin/rules")
async def create_rule(payload: RuleInput, request: Request):
	actor, _ = await _admin(request, csrf=True)
	test_context = RequestContext("test", "example.com", "/", "GET", "127.0.0.1")
	try:
		matches_expression(payload.conditions, test_context)
	except (KeyError, TypeError, ValueError) as error:
		raise HTTPException(status_code=422, detail=f"Invalid rule expression: {error}") from error
	if "block" in payload.actions and payload.conditions == {"field": "host", "op": "exists", "value": True}:
		raise HTTPException(status_code=422, detail="A global block rule requires simulation and cannot be published through this endpoint")
	now = int(time.time())
	db = request.app.state.database
	id_value = db.execute("INSERT INTO rules(name, description, priority, enabled, mode, conditions_json, actions_json, created_at, updated_at, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (payload.name, payload.description, payload.priority, int(payload.enabled), payload.mode, json.dumps(payload.conditions, separators=(",", ":")), json.dumps(payload.actions, separators=(",", ":")), now, now, actor))
	snapshot = payload.model_dump()
	db.execute("INSERT INTO rule_versions(rule_id, version, snapshot_json, created_at, created_by) VALUES (?, 1, ?, ?, ?)", (id_value, json.dumps(snapshot, separators=(",", ":")), now, actor))
	db.audit(actor, "rule.create", "rule", str(id_value), {"name": payload.name})
	return {"id": id_value, "version": 1}


@app.post("/__shield/api/admin/rules/test")
async def test_rule(payload: RuleInput, request: Request):
	await _admin(request)
	contexts = request.app.state.database.query("SELECT host, path, method, country_code, region, asn, ip_type, risk_score FROM risk_events ORDER BY created_at DESC LIMIT 500")
	hits = 0
	for index, row in enumerate(contexts):
		context = RequestContext(str(index), row["host"], row["path"], row["method"], "0.0.0.0", row["country_code"] or "", row["region"] or "", row["asn"] or "", row["ip_type"] or "unknown", risk_score=row["risk_score"])
		if matches_expression(payload.conditions, context):
			hits += 1
	return {"sampleSize": len(contexts), "matches": hits, "matchRate": hits / len(contexts) if contexts else 0}


@app.get("/__shield/api/admin/bans")
async def admin_bans(request: Request):
	await _admin(request)
	return request.app.state.database.query("SELECT id, subject_type, subject_display, restriction, reason, created_by, created_at, expires_at, revoked_at, revoked_by, revoke_reason FROM bans ORDER BY id DESC LIMIT 500")


@app.post("/__shield/api/admin/bans")
async def create_ban(payload: BanInput, request: Request):
	actor, _ = await _admin(request, csrf=True)
	now = int(time.time())
	subject_hash = stable_hash(payload.subject_value.lower(), settings.internal_signing_key)
	display = mask_ip(payload.subject_value) if payload.subject_type == "ip" else payload.subject_value[:4] + "..."
	id_value = request.app.state.database.execute("INSERT INTO bans(subject_type, subject_hash, subject_display, restriction, reason, created_by, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (payload.subject_type, subject_hash, display, payload.restriction, payload.reason, actor, now, payload.expires_at))
	request.app.state.database.audit(actor, "ban.create", "ban", str(id_value), {"subjectType": payload.subject_type, "restriction": payload.restriction, "reason": payload.reason})
	return {"id": id_value}


@app.post("/__shield/api/admin/bans/{ban_id}/revoke")
async def revoke_ban(ban_id: int, request: Request):
	actor, _ = await _admin(request, csrf=True)
	payload = await request.json()
	reason = str(payload.get("reason", "Manual revocation"))[:500]
	request.app.state.database.execute("UPDATE bans SET revoked_at = ?, revoked_by = ?, revoke_reason = ? WHERE id = ? AND revoked_at IS NULL", (int(time.time()), actor, reason, ban_id))
	request.app.state.database.audit(actor, "ban.revoke", "ban", str(ban_id), {"reason": reason})
	return {"revoked": True}


@app.get("/__shield/api/admin/audit")
async def admin_audit(request: Request, limit: int = 100):
	await _admin(request)
	return request.app.state.database.query("SELECT * FROM audit_log ORDER BY id DESC LIMIT ?", (min(500, max(1, limit)),))


@app.post("/__shield/api/admin/mode")
async def change_mode(request: Request):
	actor, _ = await _admin(request, csrf=True)
	payload = await request.json()
	mode = str(payload.get("mode", ""))
	if mode not in {"bypass", "observe", "enforce"}:
		raise HTTPException(status_code=422, detail="Invalid mode")
	request.app.state.database.set_setting("global_mode", mode, actor)
	request.app.state.database.audit(actor, "mode.change", "system", "global", {"mode": mode})
	return {"mode": mode}


@app.post("/__shield/challenge/verify")
async def verify_challenge(request: Request):
	payload = await request.json()
	token = str(payload.get("token", ""))
	return_url = str(payload.get("returnUrl", "/"))
	if not token or not settings.turnstile_secret_key:
		raise HTTPException(status_code=503, detail="Turnstile is not configured")
	data = {"secret": settings.turnstile_secret_key, "response": token, "remoteip": _client_ip(request)}
	async with httpx.AsyncClient(timeout=5) as client:
		response = await client.post(settings.turnstile_verify_url, data=data)
		result = response.json()
	if not result.get("success"):
		raise HTTPException(status_code=403, detail="Challenge verification failed")
	binding = stable_hash(f"{_client_ip(request)}|{request.headers.get('user-agent', '')}", settings.internal_signing_key)
	proof = issue_token({"purpose": "challenge", "binding": binding}, settings.internal_signing_key, 600)
	response = JSONResponse({"verified": True, "returnUrl": return_url if return_url.startswith("/") else "/"})
	response.set_cookie("sf_shield_challenge", proof, max_age=600, httponly=True, secure=settings.cookie_secure, samesite="lax", path="/")
	return response


def _challenge_response(request: Request, request_id: str, retry_after: int = 0) -> Response:
	accept = request.headers.get("accept", "")
	if "text/html" not in accept or request.method != "GET":
		return JSONResponse({"detail": "Additional verification required", "action": "turnstile", "siteKey": settings.turnstile_site_key, "requestId": request_id}, status_code=403, headers={"Retry-After": str(retry_after)} if retry_after else None)
	page = (ROOT / "static" / "challenge.html").read_text(encoding="utf-8").replace("{{SITE_KEY}}", settings.turnstile_site_key).replace("{{RETURN_URL}}", json.dumps(request.url.path + (f"?{request.url.query}" if request.url.query else "")))
	return HTMLResponse(page, status_code=403, headers={"X-SF-Shield-Request-ID": request_id})


@app.api_route("/{path:path}", methods=["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])
async def gateway(path: str, request: Request):
	request_id = uuid.uuid4().hex
	host = _host(request)
	upstream = settings.upstreams.get(host)
	if not upstream:
		return JSONResponse({"detail": "Unknown protected host", "requestId": request_id}, status_code=421)
	body = await _read_body(request)
	mode = settings.mode
	try:
		mode = _mode(request.app.state.database)
		if mode == "bypass":
			context = RequestContext(request_id, host, request.url.path, request.method, _client_ip(request))
			return await _proxy(request, body, upstream, context, RiskResult(0, "normal", []), "bypass")
		ip = _client_ip(request)
		headers = {name.lower(): value for name, value in request.headers.items()}
		if not _trusted_peer(request):
			headers = {name: value for name, value in headers.items() if not name.startswith("cf-")}
		intel, _source = await request.app.state.geo.lookup(ip, headers)
		context = RequestContext(
			request_id=request_id,
			host=host,
			path=request.url.path,
			method=request.method,
			ip=ip,
			country=intel.country_code,
			region=intel.region,
			asn=intel.asn,
			ip_type=intel.ip_type,
			session_id=request.cookies.get("sf_account_session", ""),
			device_id=_device_id(request, ip),
			email=_email_from_body(body, request.headers.get("content-type", "")),
			user_agent=request.headers.get("user-agent", ""),
		)
		list_status, _list_match = request.app.state.access.match(context)
		ban = request.app.state.access.active_ban(context)
		rates = request.app.state.limiter.check(context)
		context.rate_exceeded = bool(rates)
		weights = request.app.state.database.setting("risk_weights", {})
		thresholds = request.app.state.database.setting("risk_thresholds", {})
		risk = score_request(intel, headers, weights, thresholds, list_status, bool(rates))
		context.risk_score = risk.score
		rule_decision = request.app.state.rules.evaluate(context, mode)
		binding = stable_hash(f"{ip}|{request.headers.get('user-agent', '')}", settings.internal_signing_key)
		challenge = read_token(request.cookies.get("sf_shield_challenge", ""), settings.internal_signing_key)
		challenge_passed = bool(challenge and challenge.get("purpose") == "challenge" and hmac.compare_digest(str(challenge.get("binding", "")), binding))
		actions = _actions(mode, risk, list_status, ban, rates, rule_decision, challenge_passed)
		_event(request.app.state.database, context, risk, rule_decision, actions, request, body)
		if "temporary_ban" in actions and mode == "enforce":
			now = int(time.time())
			request.app.state.database.execute("INSERT INTO bans(subject_type, subject_hash, subject_display, restriction, reason, created_by, created_at, expires_at) VALUES ('ip', ?, ?, 'all', 'Automatic rate policy', 'shield', ?, ?)", (stable_hash(ip, settings.internal_signing_key), mask_ip(ip), now, now + max([hit.retry_after for hit in rates] or [300])))
		if "delay" in actions:
			await asyncio.sleep(1)
		if "block" in actions or "temporary_ban" in actions:
			return JSONResponse({"detail": "Request blocked by SilentFlare Shield", "requestId": request_id}, status_code=403, headers={"X-SF-Shield-Request-ID": request_id})
		if "turnstile" in actions and not challenge_passed:
			return _challenge_response(request, request_id, max([hit.retry_after for hit in rates] or [0]))
		if "rate_limit" in actions:
			retry_after = max([hit.retry_after for hit in rates] or [60])
			return JSONResponse({"detail": "Rate limit exceeded", "requestId": request_id}, status_code=429, headers={"Retry-After": str(retry_after), "X-SF-Shield-Request-ID": request_id})
		return await _proxy(request, body, upstream, context, risk, actions[0])
	except sqlite3.Error:
		context, risk, exceeded = _memory_degraded_context(request, request_id, host)
		failure = _failure_response(host, request.url.path, request.method, request_id)
		if failure:
			return failure
		if exceeded and settings.mode == "enforce":
			return JSONResponse({"detail": "Rate limit exceeded in degraded mode", "requestId": request_id}, status_code=429, headers={"Retry-After": "60"})
		return await _proxy(request, body, upstream, context, risk, "degraded_fail_open")
	except (OSError, ValueError, RuntimeError, httpx.HTTPError):
		failure = _failure_response(host, request.url.path, request.method, request_id)
		if failure:
			return failure
		return await _proxy(request, body, upstream, None, None, "fail_open")
