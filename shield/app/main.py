from __future__ import annotations

import asyncio
import hashlib
import hmac
import ipaddress
import json
import sqlite3
import time
import uuid
from contextlib import asynccontextmanager
from datetime import datetime
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
STATIC_ROOT = ROOT / "static"
STATIC_VERSION = hashlib.sha256(
	b"".join((STATIC_ROOT / filename).read_bytes() for filename in ("app.css", "app.js"))
).hexdigest()[:12]
ADMIN_HTML = (STATIC_ROOT / "index.html").read_text(encoding="utf-8").replace(
	"__SHIELD_ASSET_VERSION__", STATIC_VERSION
)
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


class EventActionInput(BaseModel):
	action: str = Field(pattern=r"^(block_ip|block_account|dismiss)$")
	duration_seconds: int = Field(default=21600, ge=300, le=2592000)


class ServiceControlInput(BaseModel):
	protection_enabled: bool
	mode: str = Field(pattern=r"^(observe|enforce)$")
	fail_policy: str = Field(default="route", pattern=r"^(open|closed|route)$")


class GeoPolicyInput(BaseModel):
	country_code: str = Field(min_length=2, max_length=2)
	region: str | None = Field(default=None, max_length=120)
	scope_host: str | None = None
	action: str = Field(pattern=r"^(block|turnstile|read_only|block_login|block_register|block_comment|block_api|block_admin)$")
	note: str = Field(default="", max_length=300)
	expires_at: int | None = None


class RatePolicyUpdate(BaseModel):
	enabled: bool
	limit_value: int = Field(ge=1, le=100000)
	window_seconds: int = Field(ge=10, le=2592000)
	action: str = Field(pattern=r"^(log|delay|turnstile|rate_limit|temporary_ban|block)$")
	cooldown_seconds: int = Field(default=60, ge=0, le=2592000)


class AccountRiskInput(BaseModel):
	delta: int = Field(ge=-100, le=100)
	reason: str = Field(min_length=3, max_length=300)
	duration_seconds: int = Field(default=86400, ge=300, le=2592000)


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
	app.state.account_sync_task = asyncio.create_task(_account_sync_loop(app))
	yield
	app.state.account_sync_task.cancel()
	try:
		await app.state.account_sync_task
	except asyncio.CancelledError:
		pass
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


def _timestamp(value: Any, default: int = 0) -> int:
	if not value:
		return default
	try:
		return int(datetime.fromisoformat(str(value).replace("Z", "+00:00")).timestamp())
	except (TypeError, ValueError):
		return default


def _account_risk(user: dict[str, Any], now: int) -> tuple[int, str, list[str]]:
	score = 0
	reasons: list[str] = []
	created_at = _timestamp(user.get("created_at"), now)
	if now - created_at < 86400:
		score += 15
		reasons.append("Account created within 24 hours")
	if not user.get("email_verified_at"):
		score += 15
		reasons.append("Email is not verified")
	if not user.get("totp_enabled"):
		score += 5
		reasons.append("Two-factor authentication is not enabled")
	if user.get("role") == "admin" and not user.get("totp_enabled"):
		score += 20
		reasons.append("Privileged account has no two-factor authentication")
	if int(user.get("active_session_count") or 0) > 5:
		score += 10
		reasons.append("Account has more than five active sessions")
	if user.get("disabled_at"):
		score += 60
		reasons.append("Account is disabled")
	score = min(score, 100)
	level = "block" if score >= 80 else "restrict" if score >= 60 else "verify" if score >= 40 else "observe" if score >= 20 else "normal"
	return score, level, reasons


async def _sync_account_projections(application: FastAPI, session_token: str = "", force: bool = False) -> dict[str, Any]:
	db = application.state.database
	now = int(time.time())
	last = db.query("SELECT completed_at, record_count, status FROM sync_runs WHERE source = 'fastapi_accounts' ORDER BY id DESC LIMIT 1")
	if not force and last and last[0]["status"] == "completed" and now - int(last[0]["completed_at"] or 0) < settings.account_sync_interval:
		return {"status": "fresh", "recordCount": last[0]["record_count"], "completedAt": last[0]["completed_at"]}
	run_id = db.execute("INSERT INTO sync_runs(source, started_at, status) VALUES ('fastapi_accounts', ?, 'running')", (now,))
	try:
		headers = {"Accept": "application/json", "Host": "api.silentflare.com"}
		if settings.sync_secret:
			timestamp = str(int(time.time()))
			message = f"GET\n/internal/shield/accounts\n{timestamp}"
			headers["X-SF-Shield-Timestamp"] = timestamp
			headers["X-SF-Shield-Signature"] = hmac.new(settings.sync_secret.encode("utf-8"), message.encode("utf-8"), hashlib.sha256).hexdigest()
		elif session_token:
			headers["Cookie"] = f"{settings.admin_cookie_name}={session_token}"
		response = await application.state.client.get(
			settings.account_snapshot_url,
			headers=headers,
		)
		response.raise_for_status()
		users = response.json().get("users", [])
		if not isinstance(users, list):
			raise ValueError("Account snapshot is malformed")

		def write(connection):
			connection.execute("DELETE FROM account_projections")
			for user in users:
				account_hash = stable_hash(str(user.get("id", "")), settings.internal_signing_key)
				score, level, reasons = _account_risk(user, now)
				connection.execute(
					"""INSERT INTO account_projections(account_id_hash, account_label, role, country_code,
					email_verified, two_factor_enabled, disabled, created_at, last_seen_at, active_session_count,
					comment_count, risk_score, risk_level, risk_reasons_json, last_synced_at)
					VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
					ON CONFLICT(account_id_hash) DO UPDATE SET account_label=excluded.account_label,
					role=excluded.role, country_code=excluded.country_code, email_verified=excluded.email_verified,
					two_factor_enabled=excluded.two_factor_enabled, disabled=excluded.disabled,
					created_at=excluded.created_at, last_seen_at=excluded.last_seen_at,
					active_session_count=excluded.active_session_count, comment_count=excluded.comment_count,
					risk_score=excluded.risk_score, risk_level=excluded.risk_level,
					risk_reasons_json=excluded.risk_reasons_json, last_synced_at=excluded.last_synced_at""",
					(account_hash, str(user.get("username") or user.get("id") or "Unknown")[:100], str(user.get("role") or "user"),
					str(user.get("display_region_code") or "")[:8], int(bool(user.get("email_verified_at"))),
					int(bool(user.get("totp_enabled"))), int(bool(user.get("disabled_at"))),
					_timestamp(user.get("created_at"), now), _timestamp(user.get("last_seen_at")) or None,
					int(user.get("active_session_count") or 0), int(user.get("comment_count") or 0), score, level,
					json.dumps(reasons, separators=(",", ":")), now),
				)
		db.transaction(write)
		db.execute("UPDATE sync_runs SET completed_at = ?, status = 'completed', record_count = ? WHERE id = ?", (int(time.time()), len(users), run_id))
		return {"status": "completed", "recordCount": len(users), "completedAt": int(time.time())}
	except (httpx.HTTPError, ValueError, json.JSONDecodeError) as error:
		db.execute("UPDATE sync_runs SET completed_at = ?, status = 'failed', detail = ? WHERE id = ?", (int(time.time()), type(error).__name__, run_id))
		return {"status": "failed", "recordCount": 0, "completedAt": int(time.time())}


async def _account_sync_loop(application: FastAPI) -> None:
	while True:
		try:
			await _sync_account_projections(application, force=True)
		except Exception:
			pass
		await asyncio.sleep(max(30, settings.account_sync_interval))


def _mode(database: Database) -> str:
	mode = database.setting("global_mode", settings.mode)
	return mode if mode in {"bypass", "observe", "enforce"} else settings.mode


def _service_mode(database: Database, host: str) -> str:
	global_mode = _mode(database)
	if global_mode == "bypass":
		return "bypass"
	rows = database.query("SELECT protection_enabled, mode FROM service_controls WHERE host = ? LIMIT 1", (host,))
	if not rows:
		return global_mode
	if not rows[0]["protection_enabled"]:
		return "bypass"
	return rows[0]["mode"] if rows[0]["mode"] in {"observe", "enforce"} else global_mode


def _service_fail_policy(database: Database, host: str) -> str:
	rows = database.query("SELECT fail_policy FROM service_controls WHERE host = ? LIMIT 1", (host,))
	if rows and rows[0]["fail_policy"] in {"open", "closed", "route"}:
		return rows[0]["fail_policy"]
	return settings.fail_policy


def _geo_policy_action(database: Database, context: RequestContext) -> tuple[str | None, str | None]:
	if not context.country:
		return None, None
	now = int(time.time())
	rows = database.query(
		"""SELECT id, action, country_code, region FROM geo_policies
		WHERE enabled = 1 AND country_code = ?
		AND (region IS NULL OR LOWER(region) = LOWER(?))
		AND (scope_host IS NULL OR scope_host = ?)
		AND (expires_at IS NULL OR expires_at > ?)
		ORDER BY CASE WHEN region IS NULL THEN 1 ELSE 0 END,
			CASE WHEN scope_host IS NULL THEN 1 ELSE 0 END, id DESC""",
		(context.country.upper(), context.region or "", context.host, now),
	)
	for row in rows:
		action = row["action"]
		applies = (
			action in {"block", "turnstile"}
			or (action == "read_only" and context.method not in {"GET", "HEAD", "OPTIONS"})
			or (action == "block_login" and context.path.startswith("/auth/login"))
			or (action == "block_register" and context.path.startswith("/accounts/register"))
			or (action == "block_comment" and context.path.startswith("/comments"))
			or (action == "block_api" and context.host == "api.silentflare.com")
			or (action == "block_admin" and context.host == "admin.silentflare.com")
		)
		if applies:
			resolved = "block" if action.startswith("block_") or action == "read_only" else action
			label = row["country_code"] + (f" / {row['region']}" if row["region"] else "")
			return resolved, f"Geographic policy {row['id']} matched {label}: {action.replace('_', ' ')}"
	return None, None


def _is_sensitive(host: str, path: str, method: str) -> bool:
	return host in {"admin.silentflare.com", "cms.silentflare.com"} or method != "GET" or any(path.startswith(prefix) for prefix in SENSITIVE_PATHS)


def _failure_response(host: str, path: str, method: str, request_id: str, fail_policy: str) -> Response | None:
	closed = fail_policy == "closed" or (fail_policy == "route" and _is_sensitive(host, path, method))
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


def _actions(mode: str, risk: RiskResult, list_status: str | None, ban: dict | None, rates: list[RateHit], rules: RuleDecision, challenge_passed: bool, policy_actions: list[str] | None = None) -> list[str]:
	if mode == "bypass":
		return ["bypass"]
	actions = list(rules.actions)
	actions.extend(policy_actions or [])
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


def _automatic_ban(database: Database, context: RequestContext, hits: list[RateHit]) -> None:
	ban_hits = [hit for hit in hits if hit.action == "temporary_ban"]
	if not ban_hits:
		return
	hit = max(ban_hits, key=lambda item: max(item.retry_after, item.cooldown_seconds))
	if hit.dimension in {"account", "session"} and context.session_id:
		subject_type, raw_value, display = "session", context.session_id, "Correlated session"
	elif hit.dimension == "device" and context.device_id:
		subject_type, raw_value, display = "device", context.device_id, "Correlated device"
	elif hit.dimension == "email" and context.email:
		subject_type, raw_value, display = "email", context.email.lower(), "Correlated email"
	else:
		subject_type, raw_value, display = "ip", context.ip, mask_ip(context.ip)
	subject_hash = stable_hash(raw_value, settings.internal_signing_key)
	now = int(time.time())
	expires_at = now + max(hit.retry_after, hit.cooldown_seconds, 300)
	database.execute(
		"""INSERT INTO bans(subject_type, subject_hash, subject_display, restriction, reason, created_by, created_at, expires_at)
		SELECT ?, ?, ?, 'all', ?, 'shield', ?, ? WHERE NOT EXISTS (
			SELECT 1 FROM bans WHERE subject_type = ? AND subject_hash = ? AND revoked_at IS NULL
			AND (expires_at IS NULL OR expires_at > ?)
		)""",
		(subject_type, subject_hash, display, f"Automatic policy: {hit.policy_name}", now, expires_at, subject_type, subject_hash, now),
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
	return HTMLResponse(ADMIN_HTML, headers={"Cache-Control": "no-store"})


@app.get("/__shield/static/{filename}", include_in_schema=False)
async def admin_asset(filename: str):
	if filename not in {"app.css", "app.js"}:
		raise HTTPException(status_code=404)
	return FileResponse(STATIC_ROOT / filename, headers={"Cache-Control": "no-store"})


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


@app.get("/__shield/api/admin/dashboard")
async def admin_dashboard(request: Request, range_hours: int = 24):
	await _admin(request)
	db = request.app.state.database
	range_hours = min(168, max(6, range_hours))
	now = int(time.time())
	since = now - range_hours * 3600
	sync = await _sync_account_projections(request.app, request.cookies.get(settings.admin_cookie_name, ""))
	counts = db.query(
		"""SELECT COUNT(*) AS requests,
		SUM(CASE WHEN risk_score >= 80 OR actions_json LIKE '%block%' THEN 1 ELSE 0 END) AS blocked,
		SUM(CASE WHEN actions_json LIKE '%turnstile%' THEN 1 ELSE 0 END) AS challenged,
		SUM(CASE WHEN risk_score >= 60 THEN 1 ELSE 0 END) AS high_risk,
		COUNT(DISTINCT ip_hash) AS unique_ips
		FROM risk_events WHERE created_at >= ?""",
		(since,),
	)[0]
	active_bans = db.query("SELECT COUNT(*) AS value FROM bans WHERE revoked_at IS NULL AND (expires_at IS NULL OR expires_at > ?)", (now,))[0]["value"]
	account_counts = db.query("""SELECT COUNT(*) AS total,
		SUM(CASE WHEN MIN(100, MAX(0, account_projections.risk_score + COALESCE(account_risk_adjustments.delta, 0))) >= 40 THEN 1 ELSE 0 END) AS risky
		FROM account_projections LEFT JOIN account_risk_adjustments
		ON account_risk_adjustments.account_id_hash = account_projections.account_id_hash
		AND (account_risk_adjustments.expires_at IS NULL OR account_risk_adjustments.expires_at > ?)""", (now,))[0]
	series_rows = db.query(
		"""SELECT (created_at / 3600) * 3600 AS bucket, COUNT(*) AS requests,
		SUM(CASE WHEN risk_score >= 60 THEN 1 ELSE 0 END) AS high_risk,
		SUM(CASE WHEN actions_json LIKE '%rate_limit%' OR actions_json LIKE '%temporary_ban%' THEN 1 ELSE 0 END) AS limited
		FROM risk_events WHERE created_at >= ? GROUP BY bucket ORDER BY bucket""",
		(since,),
	)
	series_map = {int(row["bucket"]): row for row in series_rows}
	start_bucket = (since // 3600) * 3600
	series = []
	for bucket in range(start_bucket, (now // 3600) * 3600 + 1, 3600):
		row = series_map.get(bucket, {})
		series.append({"timestamp": bucket, "requests": row.get("requests", 0), "highRisk": row.get("high_risk", 0) or 0, "limited": row.get("limited", 0) or 0})
	top_countries = db.query("SELECT COALESCE(country_code, 'Unknown') AS label, COUNT(*) AS value, ROUND(AVG(risk_score), 1) AS averageRisk FROM risk_events WHERE created_at >= ? GROUP BY country_code ORDER BY value DESC LIMIT 6", (since,))
	top_asns = db.query("SELECT COALESCE(asn, 'Unknown') AS label, COUNT(*) AS value, MAX(risk_score) AS maximumRisk FROM risk_events WHERE created_at >= ? GROUP BY asn ORDER BY maximumRisk DESC, value DESC LIMIT 6", (since,))
	recent = db.query("SELECT id, created_at, risk_level, risk_score, host, path, method, ip_masked, country_code, asn, ip_type, reasons_json, actions_json, review_status FROM risk_events ORDER BY created_at DESC LIMIT 12")
	for event in recent:
		event["reasons"] = json.loads(event.pop("reasons_json"))
		event["actions"] = json.loads(event.pop("actions_json"))
	risky_accounts = db.query("""SELECT account_projections.account_id_hash AS id, account_label AS label, role,
		country_code AS country, email_verified AS emailVerified, two_factor_enabled AS twoFactorEnabled,
		disabled, active_session_count AS activeSessions, comment_count AS comments,
		account_projections.risk_score AS baseRisk, COALESCE(account_risk_adjustments.delta, 0) AS manualDelta,
		account_risk_adjustments.reason AS adjustmentReason, account_risk_adjustments.expires_at AS adjustmentExpiresAt,
		risk_reasons_json AS riskReasons, last_seen_at AS lastSeenAt
		FROM account_projections LEFT JOIN account_risk_adjustments
		ON account_risk_adjustments.account_id_hash = account_projections.account_id_hash
		AND (account_risk_adjustments.expires_at IS NULL OR account_risk_adjustments.expires_at > ?)
		ORDER BY MIN(100, MAX(0, account_projections.risk_score + COALESCE(account_risk_adjustments.delta, 0))) DESC,
		last_seen_at DESC LIMIT 50""", (now,))
	for account in risky_accounts:
		account["riskReasons"] = json.loads(account["riskReasons"])
		account["riskScore"] = min(100, max(0, int(account.pop("baseRisk")) + int(account["manualDelta"])))
		account["riskLevel"] = "block" if account["riskScore"] >= 80 else "restrict" if account["riskScore"] >= 60 else "verify" if account["riskScore"] >= 40 else "observe" if account["riskScore"] >= 20 else "normal"
		if account["manualDelta"] and account["adjustmentReason"]:
			account["riskReasons"].insert(0, f"Manual adjustment {account['manualDelta']:+d}: {account['adjustmentReason']}")
	policies = db.query("SELECT id, name, host, path_pattern AS path, method, dimension, algorithm, limit_value AS limitValue, window_seconds AS windowSeconds, cooldown_seconds AS cooldownSeconds, action, enabled FROM rate_policies ORDER BY id")
	services = db.query("SELECT host, protection_enabled AS protectionEnabled, mode, fail_policy AS failPolicy, updated_at AS updatedAt FROM service_controls ORDER BY host")
	for service in services:
		service["connected"] = service["host"] == "api.silentflare.com"
		service["status"] = "protected" if service["connected"] and service["protectionEnabled"] else "bypassed" if service["connected"] else "staged" if service["protectionEnabled"] else "configured"
	geo_policies = db.query("SELECT id, country_code AS countryCode, region, scope_host AS scopeHost, action, enabled, note, created_at AS createdAt, expires_at AS expiresAt FROM geo_policies ORDER BY enabled DESC, id DESC")
	geo_options = db.query("SELECT country_code AS countryCode, region, COUNT(*) AS observations FROM ip_intel WHERE country_code IS NOT NULL GROUP BY country_code, region ORDER BY country_code, observations DESC")
	return {
		"mode": _mode(db),
		"rangeHours": range_hours,
		"metrics": {"requests": counts["requests"] or 0, "blocked": counts["blocked"] or 0, "challenged": counts["challenged"] or 0, "highRisk": counts["high_risk"] or 0, "uniqueIps": counts["unique_ips"] or 0, "activeBans": active_bans, "accounts": account_counts["total"] or 0, "riskyAccounts": account_counts["risky"] or 0},
		"series": series,
		"topCountries": top_countries,
		"topAsns": top_asns,
		"recentEvents": recent,
		"riskyAccounts": risky_accounts,
		"policies": policies,
		"services": services,
		"geoPolicies": geo_policies,
		"geoOptions": geo_options,
		"sync": sync,
		"generatedAt": now,
	}


@app.post("/__shield/api/admin/sync/accounts")
async def admin_sync_accounts(request: Request):
	actor, _ = await _admin(request, csrf=True)
	result = await _sync_account_projections(request.app, request.cookies.get(settings.admin_cookie_name, ""), force=True)
	request.app.state.database.audit(actor, "accounts.sync", "account_projection", None, result)
	return result


@app.post("/__shield/api/admin/events/{event_id}/action")
async def admin_event_action(event_id: str, payload: EventActionInput, request: Request):
	actor, _ = await _admin(request, csrf=True)
	db = request.app.state.database
	rows = db.query("SELECT id, ip_hash, ip_masked, account_id_hash, review_status FROM risk_events WHERE id = ? LIMIT 1", (event_id,))
	if not rows:
		raise HTTPException(status_code=404, detail="Risk event not found")
	event = rows[0]
	now = int(time.time())
	if payload.action == "dismiss":
		db.execute("UPDATE risk_events SET review_status = 'dismissed', reviewed_by = ?, reviewed_at = ? WHERE id = ?", (actor, now, event_id))
	else:
		subject_type = "ip" if payload.action == "block_ip" else "account"
		subject_hash = event["ip_hash"] if subject_type == "ip" else event["account_id_hash"]
		if not subject_hash:
			raise HTTPException(status_code=422, detail=f"Event has no correlated {subject_type}")
		display = event["ip_masked"] if subject_type == "ip" else "Correlated account"
		db.execute("INSERT INTO bans(subject_type, subject_hash, subject_display, restriction, reason, created_by, created_at, expires_at) VALUES (?, ?, ?, 'all', ?, ?, ?, ?)", (subject_type, subject_hash, display, f"Created from risk event {event_id}", actor, now, now + payload.duration_seconds))
		db.execute("UPDATE risk_events SET review_status = 'actioned', reviewed_by = ?, reviewed_at = ? WHERE id = ?", (actor, now, event_id))
	db.audit(actor, f"risk_event.{payload.action}", "risk_event", event_id, {"durationSeconds": payload.duration_seconds})
	return {"ok": True, "eventId": event_id, "action": payload.action}


@app.put("/__shield/api/admin/services/{host}")
async def admin_service_control(host: str, payload: ServiceControlInput, request: Request):
	actor, _ = await _admin(request, csrf=True)
	host = host.lower()
	if host not in settings.upstreams:
		raise HTTPException(status_code=404, detail="Protected service is not configured")
	now = int(time.time())
	request.app.state.database.execute(
		"""INSERT INTO service_controls(host, protection_enabled, mode, fail_policy, updated_at, updated_by)
		VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(host) DO UPDATE SET
		protection_enabled=excluded.protection_enabled, mode=excluded.mode,
		fail_policy=excluded.fail_policy, updated_at=excluded.updated_at, updated_by=excluded.updated_by""",
		(host, int(payload.protection_enabled), payload.mode, payload.fail_policy, now, actor),
	)
	request.app.state.database.audit(actor, "service_control.update", "service", host, payload.model_dump())
	return {"host": host, **payload.model_dump(), "connected": host == "api.silentflare.com"}


@app.put("/__shield/api/admin/rate-policies/{policy_id}")
async def admin_rate_policy_update(policy_id: int, payload: RatePolicyUpdate, request: Request):
	actor, _ = await _admin(request, csrf=True)
	db = request.app.state.database
	if not db.query("SELECT id FROM rate_policies WHERE id = ?", (policy_id,)):
		raise HTTPException(status_code=404, detail="Automation policy not found")
	db.execute("UPDATE rate_policies SET enabled = ?, limit_value = ?, window_seconds = ?, action = ?, cooldown_seconds = ? WHERE id = ?", (int(payload.enabled), payload.limit_value, payload.window_seconds, payload.action, payload.cooldown_seconds, policy_id))
	db.audit(actor, "rate_policy.update", "rate_policy", str(policy_id), payload.model_dump())
	return {"id": policy_id, **payload.model_dump()}


@app.post("/__shield/api/admin/geo-policies")
async def admin_geo_policy_create(payload: GeoPolicyInput, request: Request):
	actor, _ = await _admin(request, csrf=True)
	country = payload.country_code.upper()
	if not country.isalpha():
		raise HTTPException(status_code=422, detail="Country must be a two-letter ISO code")
	if payload.scope_host and payload.scope_host not in settings.upstreams:
		raise HTTPException(status_code=422, detail="Unknown service host")
	now = int(time.time())
	policy_id = request.app.state.database.execute(
		"INSERT INTO geo_policies(country_code, region, scope_host, action, note, created_at, created_by, updated_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
		(country, payload.region or None, payload.scope_host or None, payload.action, payload.note, now, actor, now, payload.expires_at),
	)
	request.app.state.database.audit(actor, "geo_policy.create", "geo_policy", str(policy_id), payload.model_dump())
	return {"id": policy_id}


@app.delete("/__shield/api/admin/geo-policies/{policy_id}")
async def admin_geo_policy_disable(policy_id: int, request: Request):
	actor, _ = await _admin(request, csrf=True)
	db = request.app.state.database
	if not db.query("SELECT id FROM geo_policies WHERE id = ?", (policy_id,)):
		raise HTTPException(status_code=404, detail="Geographic policy not found")
	db.execute("UPDATE geo_policies SET enabled = 0, updated_at = ? WHERE id = ?", (int(time.time()), policy_id))
	db.audit(actor, "geo_policy.disable", "geo_policy", str(policy_id), {})
	return {"disabled": True}


@app.put("/__shield/api/admin/accounts/{account_id_hash}/risk")
async def admin_account_risk(account_id_hash: str, payload: AccountRiskInput, request: Request):
	actor, _ = await _admin(request, csrf=True)
	db = request.app.state.database
	if not db.query("SELECT account_id_hash FROM account_projections WHERE account_id_hash = ?", (account_id_hash,)):
		raise HTTPException(status_code=404, detail="Account projection not found")
	if payload.delta == 0:
		db.execute("DELETE FROM account_risk_adjustments WHERE account_id_hash = ?", (account_id_hash,))
	else:
		now = int(time.time())
		db.execute(
			"""INSERT INTO account_risk_adjustments(account_id_hash, delta, reason, created_at, created_by, expires_at)
			VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(account_id_hash) DO UPDATE SET delta=excluded.delta,
			reason=excluded.reason, created_at=excluded.created_at, created_by=excluded.created_by,
			expires_at=excluded.expires_at""",
			(account_id_hash, payload.delta, payload.reason, now, actor, now + payload.duration_seconds),
		)
	db.audit(actor, "account_risk.adjust", "account", account_id_hash[:12], {"delta": payload.delta, "reason": payload.reason, "durationSeconds": payload.duration_seconds})
	return {"accountId": account_id_hash, **payload.model_dump()}


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
	fail_policy = settings.fail_policy
	try:
		mode = _service_mode(request.app.state.database, host)
		fail_policy = _service_fail_policy(request.app.state.database, host)
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
		geo_action, geo_reason = _geo_policy_action(request.app.state.database, context)
		if geo_reason:
			risk.reasons.append(geo_reason)
		binding = stable_hash(f"{ip}|{request.headers.get('user-agent', '')}", settings.internal_signing_key)
		challenge = read_token(request.cookies.get("sf_shield_challenge", ""), settings.internal_signing_key)
		challenge_passed = bool(challenge and challenge.get("purpose") == "challenge" and hmac.compare_digest(str(challenge.get("binding", "")), binding))
		actions = _actions(mode, risk, list_status, ban, rates, rule_decision, challenge_passed, [geo_action] if geo_action else [])
		_event(request.app.state.database, context, risk, rule_decision, actions, request, body)
		if "temporary_ban" in actions and mode == "enforce":
			_automatic_ban(request.app.state.database, context, rates)
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
		failure = _failure_response(host, request.url.path, request.method, request_id, fail_policy)
		if failure:
			return failure
		if exceeded and mode == "enforce":
			return JSONResponse({"detail": "Rate limit exceeded in degraded mode", "requestId": request_id}, status_code=429, headers={"Retry-After": "60"})
		return await _proxy(request, body, upstream, context, risk, "degraded_fail_open")
	except (OSError, ValueError, RuntimeError, httpx.HTTPError):
		failure = _failure_response(host, request.url.path, request.method, request_id, fail_policy)
		if failure:
			return failure
		return await _proxy(request, body, upstream, None, None, "fail_open")
