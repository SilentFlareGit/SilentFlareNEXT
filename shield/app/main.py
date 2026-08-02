from __future__ import annotations

import asyncio
import hashlib
import hmac
import html
import ipaddress
import json
import sqlite3
import time
import uuid
from contextlib import asynccontextmanager
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import quote, urlparse

import httpx
import pycountry
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse, RedirectResponse, StreamingResponse
from pydantic import BaseModel, Field
from starlette.background import BackgroundTask

from .blocking import (
	ban_subject_display,
	new_public_ban_id,
	normalize_ban_subject,
	safe_public_ban_id,
)
from .config import Settings, settings
from .database import Database, mask_ip, stable_hash
from .domain.risk_codes import is_public_risk_code, risk_code_for
from .entity_risk import SUBJECT_TYPE_CATALOG, EntityRiskService, entity_level
from .geo import GeoService, IpIntel
from .rate_limit import RateHit, RateLimiter
from .risk import DEFAULT_THRESHOLDS, DEFAULT_WEIGHTS, RISK_FACTOR_CATALOG, RiskResult, score_request
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
BLOCK_ASSET_VERSION = hashlib.sha256(
	(STATIC_ROOT / "blocked.css").read_bytes()
).hexdigest()[:12]
BLOCK_HTML = (STATIC_ROOT / "blocked.html").read_text(encoding="utf-8").replace(
	"__BLOCK_ASSET_VERSION__", BLOCK_ASSET_VERSION
)
HOP_BY_HOP = {"connection", "keep-alive", "proxy-authenticate", "proxy-authorization", "te", "trailers", "transfer-encoding", "upgrade"}
EDGE_IDENTITY_HEADERS = {"x-sf-client-ip", "x-sf-proxy-ip", "cf-connecting-ip"}
SENSITIVE_PATHS = ("/auth/", "/accounts/register/", "/admin", "/comments/create")
API_CORS_ALLOWED_ORIGINS = (
	"https://blog.silentflare.com",
	"https://admin.silentflare.com",
	"https://accounts.silentflare.com",
	"https://tgbot.silentflare.com",
	"https://tgbotmanagement.silentflare.com",
	"https://auth.silentflare.com",
	"http://blog.silentflare.com",
	"http://admin.silentflare.com",
	"http://accounts.silentflare.com",
	"http://tgbot.silentflare.com",
	"http://tgbotmanagement.silentflare.com",
	"http://auth.silentflare.com",
)
PUBLIC_API_READ_PATHS = frozenset({"/auth/session", "/comments", "/site/settings"})


def add_gateway_cors(application: FastAPI) -> None:
	application.add_middleware(
		CORSMiddleware,
		allow_origins=API_CORS_ALLOWED_ORIGINS,
		allow_credentials=True,
		allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allow_headers=["Content-Type", "X-Admin-Token", "X-CSRF-Token"],
	)


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
	region_code: str | None = Field(default=None, max_length=16)
	scope_host: str | None = None
	action: str = Field(pattern=r"^(block|turnstile|read_only|block_login|block_register|block_comment|block_api|block_admin)$")
	note: str = Field(default="", max_length=300)
	expires_at: int | None = None


class GeoRestrictionInput(BaseModel):
	country_code: str = Field(min_length=2, max_length=2)
	region_code: str | None = Field(default=None, max_length=16)
	restricted: bool
	reason: str = Field(min_length=3, max_length=300)


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


class AccountResponseInput(BaseModel):
	action: str = Field(pattern=r"^(reauthenticate|revoke_sessions|freeze_account|manual_review|notify_admin)$")
	reason: str = Field(min_length=3, max_length=300)


class RiskModelInput(BaseModel):
	weights: dict[str, int]
	thresholds: dict[str, int]
	note: str = Field(default="", max_length=300)


class RiskFactorsInput(BaseModel):
	weights: dict[str, int]
	reason: str = Field(min_length=3, max_length=300)


class SiteProtectionInput(BaseModel):
	enabled: bool
	reason: str = Field(min_length=3, max_length=300)


class AlertConfigInput(BaseModel):
	enabled: bool
	minimum_score: int = Field(ge=40, le=100)
	high_risk_per_5m: int = Field(ge=1, le=100000)
	blocked_per_5m: int = Field(ge=1, le=100000)
	daily_report_hour: int = Field(ge=0, le=23)


class EntityAdjustmentInput(BaseModel):
	delta: int = Field(ge=-100, le=100)
	reason: str = Field(min_length=3, max_length=300)
	duration_seconds: int | None = Field(default=86400, ge=300, le=31536000)


class EntityScoreInput(BaseModel):
	score: int = Field(ge=0, le=100)
	reason: str = Field(min_length=3, max_length=300)


class EntityOverrideInput(BaseModel):
	override_type: str = Field(pattern=r"^(score_cap|score_floor|rule_exemption|response_exemption)$")
	value: int | None = Field(default=None, ge=0, le=100)
	reason: str = Field(min_length=3, max_length=300)
	duration_seconds: int | None = Field(default=86400, ge=300, le=31536000)
	scope_host: str | None = Field(default=None, max_length=255)
	scope_path: str | None = Field(default=None, max_length=500)
	scope_rule_id: int | None = None


class OverrideRevokeInput(BaseModel):
	reason: str = Field(default="Administrator revoked the override", min_length=3, max_length=300)


def build_services(config: Settings, *, migrate: bool = True):
	database = Database(config.database_path, ROOT / "migrations")
	if migrate:
		database.migrate()
	key = config.internal_signing_key or "bypass-development-key"
	return (
		database,
		GeoService(
			database,
			key,
			config.geo_url_template,
			config.routing_url_template,
			config.geo_cache_ttl,
			config.allow_private_geo,
		),
		RuleEngine(database),
		AccessListService(database, key),
		RateLimiter(database, key),
		EntityRiskService(database, key),
	)


@asynccontextmanager
async def lifespan(app: FastAPI):
	settings.validate()
	role = getattr(app.state, "shield_role", "unified")
	database, geo, rules, access, limiter, entities = build_services(settings, migrate=role == "unified")
	app.state.database = database
	app.state.geo = geo
	app.state.rules = rules
	app.state.access = access
	app.state.limiter = limiter
	app.state.entities = entities
	app.state.client = httpx.AsyncClient(timeout=settings.proxy_timeout_seconds, follow_redirects=False)
	app.state.degraded_counters = {}
	app.state.degraded_events = []
	app.state.account_sync_task = asyncio.create_task(_account_sync_loop(app)) if role == "unified" else None
	app.state.operations_task = asyncio.create_task(_operations_loop(app)) if role == "unified" else None
	app.state.risk_signal_task = asyncio.create_task(_risk_signal_loop(app)) if role == "unified" else None
	yield
	for task in (app.state.account_sync_task, app.state.operations_task, app.state.risk_signal_task):
		if not task:
			continue
		task.cancel()
		try:
			await task
		except asyncio.CancelledError:
			pass
	await app.state.client.aclose()


app = FastAPI(title="SilentFlare Shield", version="0.1.0", docs_url=None, redoc_url=None, lifespan=lifespan)
add_gateway_cors(app)


def _trusted_peer(request: Request) -> bool:
	try:
		peer = ipaddress.ip_address(request.client.host if request.client else "127.0.0.1")
		return any(peer in ipaddress.ip_network(cidr, strict=False) for cidr in settings.trusted_proxy_cidrs)
	except ValueError:
		return False


@dataclass(frozen=True)
class ClientIdentity:
	ip: str
	source: str


def _cloudflare_edge(request: Request) -> bool:
	if not _trusted_peer(request):
		return False
	try:
		peer = ipaddress.ip_address(request.headers.get("x-sf-proxy-ip", ""))
		return any(
			peer in ipaddress.ip_network(cidr, strict=False)
			for cidr in settings.cloudflare_proxy_cidrs
		)
	except ValueError:
		return False


def _client_identity(request: Request) -> ClientIdentity:
	peer = request.client.host if request.client else "127.0.0.1"
	if not _trusted_peer(request):
		return ClientIdentity(peer, "direct_peer")
	candidates = [
		("x-sf-client-ip", "cloudflare_edge" if _cloudflare_edge(request) else "trusted_nginx"),
	]
	if _cloudflare_edge(request):
		candidates.append(("cf-connecting-ip", "cloudflare_legacy"))
	for header, source in candidates:
		candidate = request.headers.get(header, "").strip()
		try:
			if candidate:
				return ClientIdentity(str(ipaddress.ip_address(candidate)), source)
		except ValueError:
			continue
	return ClientIdentity(peer, "trusted_proxy_peer")


def _client_ip(request: Request) -> str:
	return _client_identity(request).ip


def _host(request: Request) -> str:
	return request.headers.get("host", "").split(":", 1)[0].lower()


def _device_id(request: Request, ip: str) -> str:
	cookie = request.cookies.get("sf_shield_device", "")
	payload = read_token(cookie, settings.internal_signing_key) if cookie else None
	if payload and payload.get("purpose") == "device":
		return str(payload.get("id", ""))
	seed = f"{request.headers.get('user-agent', '')}|{request.headers.get('accept-language', '')}|{ip}"
	return stable_hash(seed, settings.internal_signing_key)[:32]


def _api_key(request: Request) -> str:
	value = request.headers.get("x-api-key", "").strip()
	if value:
		return value[:1024]
	authorization = request.headers.get("authorization", "").strip()
	if authorization.lower().startswith("bearer "):
		return authorization[7:1031]
	return ""


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


def _account_risk(
	user: dict[str, Any],
	now: int,
	weights: dict[str, int] | None = None,
) -> tuple[int, str, list[str], dict[str, tuple[int, str]]]:
	values = DEFAULT_WEIGHTS | (weights or {})
	score = 0
	reasons: list[str] = []
	factors: dict[str, tuple[int, str]] = {}

	def add(condition: bool, key: str, reason: str) -> None:
		nonlocal score
		if not condition:
			return
		before = max(0, min(100, score))
		score = max(0, min(100, score + int(values[key])))
		applied = score - before
		reasons.append(reason)
		if applied:
			factors[key] = (applied, reason)

	created_at = _timestamp(user.get("created_at"), now)
	add(now - created_at < 86400, "new_account", "Account created within 24 hours")
	add(not user.get("email_verified_at"), "unverified_email", "Email is not verified")
	add(not user.get("totp_enabled"), "no_2fa", "Two-factor authentication is not enabled")
	add(
		user.get("role") == "admin" and not user.get("totp_enabled"),
		"privileged_no_2fa",
		"Privileged account has no two-factor authentication",
	)
	add(int(user.get("active_session_count") or 0) > 5, "many_sessions", "Account has more than five active sessions")
	add(bool(user.get("disabled_at")), "disabled_account", "Account is disabled")
	level = "block" if score >= 80 else "restrict" if score >= 60 else "verify" if score >= 40 else "observe" if score >= 20 else "normal"
	return score, level, reasons, factors


async def _sync_account_projections(application: FastAPI, session_token: str = "", force: bool = False) -> dict[str, Any]:
	db = application.state.database
	now = int(time.time())
	weights = db.setting("risk_weights", {})
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
				score, level, reasons, _factors = _account_risk(user, now, weights)
				connection.execute(
					"""INSERT INTO account_projections(account_id_hash, account_ref, account_label, role, country_code,
					email_verified, two_factor_enabled, disabled, created_at, last_seen_at, active_session_count,
					comment_count, risk_score, risk_level, risk_reasons_json, last_synced_at)
					VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
					ON CONFLICT(account_id_hash) DO UPDATE SET account_ref=excluded.account_ref, account_label=excluded.account_label,
					role=excluded.role, country_code=excluded.country_code, email_verified=excluded.email_verified,
					two_factor_enabled=excluded.two_factor_enabled, disabled=excluded.disabled,
					created_at=excluded.created_at, last_seen_at=excluded.last_seen_at,
					active_session_count=excluded.active_session_count, comment_count=excluded.comment_count,
					risk_score=excluded.risk_score, risk_level=excluded.risk_level,
					risk_reasons_json=excluded.risk_reasons_json, last_synced_at=excluded.last_synced_at""",
					(account_hash, str(user.get("id") or "")[:100], str(user.get("username") or user.get("id") or "Unknown")[:100], str(user.get("role") or "user"),
					str(user.get("display_region_code") or "")[:8], int(bool(user.get("email_verified_at"))),
					int(bool(user.get("totp_enabled"))), int(bool(user.get("disabled_at"))),
					_timestamp(user.get("created_at"), now), _timestamp(user.get("last_seen_at")) or None,
					int(user.get("active_session_count") or 0), int(user.get("comment_count") or 0), score, level,
					json.dumps(reasons, separators=(",", ":")), now),
				)
		db.transaction(write)
		for user in users:
			account_ref = str(user.get("id") or "")
			if not account_ref:
				continue
			score, _level, reasons, factors = _account_risk(user, now, weights)
			posture = stable_hash(
				json.dumps(
					{
						"score": score,
						"verified": bool(user.get("email_verified_at")),
						"twoFactor": bool(user.get("totp_enabled")),
						"disabled": bool(user.get("disabled_at")),
						"sessions": int(user.get("active_session_count") or 0),
						"factors": {key: value for key, (value, _reason) in factors.items()},
					},
					sort_keys=True,
				),
				settings.internal_signing_key,
			)[:20]
			application.state.entities.set_baseline(
				"account",
				account_ref,
				display=str(user.get("username") or user.get("id") or "Unknown")[:100],
				baseline=score,
				reasons=reasons,
				source_ref=f"posture:{posture}",
				factors=factors,
			)
		db.execute("UPDATE sync_runs SET completed_at = ?, status = 'completed', record_count = ? WHERE id = ?", (int(time.time()), len(users), run_id))
		return {"status": "completed", "recordCount": len(users), "completedAt": int(time.time())}
	except (httpx.HTTPError, ValueError, json.JSONDecodeError) as error:
		db.execute("UPDATE sync_runs SET completed_at = ?, status = 'failed', detail = ? WHERE id = ?", (int(time.time()), type(error).__name__, run_id))
		return {"status": "failed", "recordCount": 0, "completedAt": int(time.time())}


async def _resolve_account(application: FastAPI, session_token: str) -> str:
	if not session_token or len(settings.sync_secret) < 32:
		return ""
	db = application.state.database
	now = int(time.time())
	session_hash = stable_hash(session_token, settings.internal_signing_key)
	cached = db.query(
		"SELECT account_ref, expires_at FROM session_account_cache WHERE session_hash = ? LIMIT 1",
		(session_hash,),
	)
	if cached and int(cached[0]["expires_at"]) > now:
		return str(cached[0]["account_ref"] or "")
	timestamp = str(now)
	canonical = f"GET\n/internal/shield/session\n{timestamp}"
	signature = hmac.new(
		settings.sync_secret.encode("utf-8"), canonical.encode("utf-8"), hashlib.sha256
	).hexdigest()
	account_ref = ""
	try:
		response = await application.state.client.get(
			settings.account_session_url,
			headers={
				"Accept": "application/json",
				"Cookie": f"sf_account_session={session_token}",
				"Host": "api.silentflare.com",
				"X-SF-Shield-Timestamp": timestamp,
				"X-SF-Shield-Signature": signature,
			},
		)
		if response.status_code == 200:
			account_ref = str(response.json().get("account_id") or "")[:100]
	except (httpx.HTTPError, json.JSONDecodeError, ValueError):
		return ""
	ttl = max(30, min(3600, settings.account_session_cache_ttl))
	db.execute(
		"""INSERT INTO session_account_cache(session_hash, account_ref, account_id_hash, expires_at, last_seen_at)
		VALUES (?, ?, ?, ?, ?) ON CONFLICT(session_hash) DO UPDATE SET account_ref=excluded.account_ref,
		account_id_hash=excluded.account_id_hash, expires_at=excluded.expires_at, last_seen_at=excluded.last_seen_at""",
		(
			session_hash,
			account_ref or None,
			stable_hash(account_ref, settings.internal_signing_key) if account_ref else None,
			now + ttl,
			now,
		),
	)
	return account_ref


async def _account_sync_loop(application: FastAPI) -> None:
	while True:
		try:
			await _sync_account_projections(application, force=True)
		except Exception:
			pass
		await asyncio.sleep(max(30, settings.account_sync_interval))


async def _risk_signal_loop(application: FastAPI) -> None:
	while True:
		try:
			processed = application.state.entities.process_signal_queue()
		except Exception:
			processed = 0
		await asyncio.sleep(0.1 if processed else 0.75)


def _daily_report(database: Database) -> dict[str, Any]:
	now = int(time.time())
	report_date = datetime.fromtimestamp(now, timezone.utc).strftime("%Y-%m-%d")
	since = now - 86400
	counts = database.query(
		"""SELECT COUNT(*) AS requests,
		SUM(CASE WHEN actions_json LIKE '%block%' OR actions_json LIKE '%temporary_ban%' THEN 1 ELSE 0 END) AS blocked,
		SUM(CASE WHEN risk_score >= 60 THEN 1 ELSE 0 END) AS high_risk,
		COUNT(DISTINCT ip_hash) AS unique_ips FROM risk_events WHERE created_at >= ?""",
		(since,),
	)[0]
	top_country = database.query("SELECT COALESCE(country_code, 'Unknown') AS value FROM risk_events WHERE created_at >= ? GROUP BY country_code ORDER BY COUNT(*) DESC LIMIT 1", (since,))
	top_asn = database.query("SELECT COALESCE(asn, 'Unknown') AS value FROM risk_events WHERE created_at >= ? GROUP BY asn ORDER BY COUNT(*) DESC LIMIT 1", (since,))
	report = {
		"reportDate": report_date,
		"requests": counts["requests"] or 0,
		"blocked": counts["blocked"] or 0,
		"highRisk": counts["high_risk"] or 0,
		"uniqueIps": counts["unique_ips"] or 0,
		"topCountry": top_country[0]["value"] if top_country else "Unknown",
		"topAsn": top_asn[0]["value"] if top_asn else "Unknown",
	}
	database.execute(
		"""INSERT INTO daily_reports(report_date, created_at, requests, blocked, high_risk, unique_ips,
		top_country, top_asn, detail_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
		ON CONFLICT(report_date) DO UPDATE SET created_at=excluded.created_at, requests=excluded.requests,
		blocked=excluded.blocked, high_risk=excluded.high_risk, unique_ips=excluded.unique_ips,
		top_country=excluded.top_country, top_asn=excluded.top_asn, detail_json=excluded.detail_json""",
		(report_date, now, report["requests"], report["blocked"], report["highRisk"], report["uniqueIps"], report["topCountry"], report["topAsn"], json.dumps(report, separators=(",", ":"))),
	)
	return report


def _queue_daily_report_alert(database: Database, report: dict[str, Any]) -> None:
	config = database.query("SELECT enabled, daily_report_hour FROM alert_config WHERE id = 1")
	now = datetime.now(timezone.utc)
	if not config or not config[0]["enabled"] or now.hour != int(config[0]["daily_report_hour"]):
		return
	day_start = int(now.replace(hour=0, minute=0, second=0, microsecond=0).timestamp())
	detail = (
		f"{report['requests']} requests, {report['highRisk']} high risk, "
		f"{report['blocked']} blocked, {report['uniqueIps']} unique sources"
	)
	database.execute(
		"""INSERT INTO alert_events(created_at, kind, severity, title, detail)
		SELECT ?, 'daily_report', 'info', ?, ? WHERE NOT EXISTS (
			SELECT 1 FROM alert_events WHERE kind = 'daily_report' AND created_at >= ?
		)""",
		(int(now.timestamp()), f"Shield daily report: {report['reportDate']}", detail, day_start),
	)


async def _deliver_alerts(application: FastAPI) -> None:
	if not settings.alert_webhook_url:
		return
	rows = application.state.database.query("SELECT id, created_at, kind, severity, title, detail FROM alert_events WHERE delivered_at IS NULL ORDER BY id LIMIT 20")
	for row in rows:
		try:
			response = await application.state.client.post(settings.alert_webhook_url, json=row)
			response.raise_for_status()
			application.state.database.execute("UPDATE alert_events SET delivered_at = ?, delivery_detail = 'delivered' WHERE id = ?", (int(time.time()), row["id"]))
		except httpx.HTTPError as error:
			application.state.database.execute("UPDATE alert_events SET delivery_detail = ? WHERE id = ?", (type(error).__name__, row["id"]))


def _aggregate_alerts(database: Database) -> None:
	config = database.query("SELECT * FROM alert_config WHERE id = 1")
	if not config or not config[0]["enabled"]:
		return
	now = int(time.time())
	bucket = now - (now % 300)
	counts = database.query(
		"""SELECT SUM(CASE WHEN risk_score >= 60 THEN 1 ELSE 0 END) AS high_risk,
		SUM(CASE WHEN actions_json LIKE '%block%' OR actions_json LIKE '%temporary_ban%' THEN 1 ELSE 0 END) AS blocked
		FROM risk_events WHERE created_at >= ?""",
		(now - 300,),
	)[0]
	for kind, value, threshold, title in (
		("high_risk_surge", counts["high_risk"] or 0, config[0]["high_risk_per_5m"], "High-risk traffic surge"),
		("blocked_surge", counts["blocked"] or 0, config[0]["blocked_per_5m"], "Blocked traffic surge"),
	):
		if value >= threshold:
			database.execute(
				"""INSERT INTO alert_events(created_at, kind, severity, title, detail)
				SELECT ?, ?, 'critical', ?, ? WHERE NOT EXISTS (
					SELECT 1 FROM alert_events WHERE kind = ? AND created_at >= ?
				)""",
				(now, kind, title, f"{value} events in the last five minutes (threshold {threshold})", kind, bucket),
			)


def _reconcile_entity_bans(database: Database, entities: EntityRiskService | None = None) -> int:
	now = int(time.time())
	changed = 0
	entities = entities or EntityRiskService(database, settings.internal_signing_key)
	eligible = database.query(
		"""SELECT id, subject_type, subject_hash, display_value, current_score FROM risk_subjects
		WHERE subject_type IN ('account', 'ip')
		AND provenance_status = 'verified'
		AND (current_score >= 80 OR EXISTS (
			SELECT 1 FROM risk_overrides WHERE risk_overrides.subject_id = risk_subjects.id
			AND override_type = 'score_floor' AND value_integer >= 80 AND revoked_at IS NULL
			AND (expires_at IS NULL OR expires_at > ?)
		)) ORDER BY current_score DESC LIMIT 500""",
		(now,),
	)
	for subject in eligible:
		effective_score = entities.effective_score(subject)
		if effective_score < 80 or entities.active_override(int(subject["id"]), "response_exemption"):
			continue
		active = database.query(
			"""SELECT id FROM bans WHERE subject_type = ? AND subject_hash = ? AND revoked_at IS NULL
			AND (expires_at IS NULL OR expires_at > ?) LIMIT 1""",
			(subject["subject_type"], subject["subject_hash"], now),
		)
		if active:
			continue
		recent = database.query(
			"""SELECT COUNT(*) AS value FROM bans WHERE subject_type = ? AND subject_hash = ?
			AND created_by = 'shield-worker' AND created_at >= ?""",
			(subject["subject_type"], subject["subject_hash"], now - 86400),
		)[0]["value"]
		durations = (900, 3600, 21600, 86400)
		duration = durations[min(int(recent or 0), len(durations) - 1)]
		if effective_score >= 90:
			duration = max(duration, 21600)
		public_id = new_public_ban_id()
		database.execute(
			"""INSERT INTO bans(public_id, subject_type, subject_hash, subject_display, restriction,
			reason, created_by, created_at, expires_at) VALUES (?, ?, ?, ?, 'all', ?, 'shield-worker', ?, ?)""",
			(
				public_id,
				subject["subject_type"],
				subject["subject_hash"],
				subject["display_value"],
				f"Automatic entity response at risk {effective_score}",
				now,
				now + duration,
			),
		)
		database.execute(
			"""INSERT INTO risk_actions(id, subject_id, action, status, reason, created_at,
			created_by, completed_at, expires_at, attempt_count, detail)
			VALUES (?, ?, 'temporary_ban', 'completed', ?, ?, 'shield-worker', ?, ?, 1, ?)""",
			(
				uuid.uuid4().hex,
				subject["id"],
				f"Risk score reached {effective_score}",
				now,
				now,
				now + duration,
				public_id,
			),
		)
		changed += 1
	resolved = database.query(
		"""SELECT bans.id AS ban_id, risk_subjects.* FROM bans JOIN risk_subjects
		ON risk_subjects.subject_type = bans.subject_type AND risk_subjects.subject_hash = bans.subject_hash
		WHERE bans.created_by = 'shield-worker' AND bans.revoked_at IS NULL"""
	)
	for ban in resolved:
		if (
			entities.effective_score(ban) >= 50
			and not entities.active_override(int(ban["id"]), "response_exemption")
		):
			continue
		database.execute(
			"""UPDATE bans SET revoked_at = ?, revoked_by = 'shield-worker',
			revoke_reason = 'Entity risk recovered below release threshold' WHERE id = ?""",
			(now, ban["ban_id"]),
		)
		changed += 1
	return changed


async def _reconcile_account_responses(application: FastAPI) -> int:
	if len(settings.sync_secret) < 32:
		return 0
	now = int(time.time())
	rows = application.state.database.query(
		"""SELECT risk_subjects.id AS subject_id, risk_subjects.subject_hash,
		risk_subjects.current_score, account_projections.account_ref
		FROM risk_subjects JOIN account_projections
		ON account_projections.account_id_hash = risk_subjects.subject_hash
		WHERE risk_subjects.subject_type = 'account' AND (risk_subjects.current_score >= 80 OR EXISTS (
			SELECT 1 FROM risk_overrides WHERE risk_overrides.subject_id = risk_subjects.id
			AND override_type = 'score_floor' AND value_integer >= 80 AND revoked_at IS NULL
			AND (expires_at IS NULL OR expires_at > ?)
		))
		AND account_projections.account_ref IS NOT NULL LIMIT 100"""
		,
		(now,),
	)
	processed = 0
	for subject in rows:
		score_subject = dict(subject)
		score_subject["id"] = subject["subject_id"]
		effective_score = application.state.entities.effective_score(score_subject)
		if effective_score < 80 or application.state.entities.active_override(
			int(subject["subject_id"]), "response_exemption"
		):
			continue
		action = "revoke_sessions" if effective_score >= 90 else "reauthenticate"
		recent = application.state.database.query(
			"""SELECT 1 FROM risk_actions WHERE subject_id = ? AND action = ?
			AND created_at >= ? AND status IN ('queued', 'running', 'completed') LIMIT 1""",
			(subject["subject_id"], action, now - 21600),
		)
		if recent:
			continue
		command_id = uuid.uuid4().hex
		reason = f"Automatic Shield response at risk {effective_score}"
		application.state.database.execute(
			"""INSERT INTO risk_actions(id, subject_id, action, status, reason, created_at,
			created_by, attempt_count) VALUES (?, ?, ?, 'running', ?, ?, 'shield-worker', 1)""",
			(command_id, subject["subject_id"], action, reason, now),
		)
		timestamp = str(now)
		canonical = f"POST\n/internal/shield/respond\n{timestamp}\n{command_id}\n{action}\n{subject['account_ref']}"
		signature = hmac.new(settings.sync_secret.encode("utf-8"), canonical.encode("utf-8"), hashlib.sha256).hexdigest()
		try:
			response = await application.state.client.post(
				settings.account_response_url,
				headers={
					"Host": "api.silentflare.com",
					"X-SF-Shield-Timestamp": timestamp,
					"X-SF-Shield-Signature": signature,
				},
				json={
					"command_id": command_id,
					"action": action,
					"account_id": subject["account_ref"],
					"reason": reason,
				},
			)
			response.raise_for_status()
			application.state.database.execute(
				"UPDATE risk_actions SET status = 'completed', completed_at = ?, detail = 'delivered' WHERE id = ?",
				(int(time.time()), command_id),
			)
			processed += 1
		except httpx.HTTPError as error:
			application.state.database.execute(
				"UPDATE risk_actions SET status = 'failed', completed_at = ?, detail = ? WHERE id = ?",
				(int(time.time()), type(error).__name__, command_id),
			)
	return processed


async def _operations_loop(application: FastAPI) -> None:
	while True:
		run_id = None
		try:
			run_id = application.state.database.execute(
				"INSERT INTO automation_runs(job_name, started_at, status) VALUES ('operations.minute', ?, 'running')",
				(int(time.time()),),
			)
			report = _daily_report(application.state.database)
			_queue_daily_report_alert(application.state.database, report)
			_aggregate_alerts(application.state.database)
			await _deliver_alerts(application)
			decayed = application.state.entities.run_due_decay()
			decayed += application.state.entities.expire_due_overrides()
			geo_controls = _reconcile_geo_policy_scores(
				application.state.database,
				application.state.entities,
			)
			automated = _reconcile_entity_bans(application.state.database, application.state.entities)
			automated += await _reconcile_account_responses(application)
			application.state.database.execute("DELETE FROM rate_counters WHERE updated_at < ?", (int(time.time()) - 2592000,))
			application.state.database.execute(
				"DELETE FROM session_account_cache WHERE expires_at < ?", (int(time.time()) - 86400,)
			)
			application.state.database.execute(
				"UPDATE automation_runs SET completed_at = ?, status = 'completed', processed_count = ? WHERE id = ?",
				(int(time.time()), decayed + geo_controls + automated, run_id),
			)
		except Exception as error:
			if run_id:
				try:
					application.state.database.execute(
						"UPDATE automation_runs SET completed_at = ?, status = 'failed', detail = ? WHERE id = ?",
						(int(time.time()), type(error).__name__, run_id),
					)
				except Exception:
					pass
		await asyncio.sleep(60)


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
	region_code = context.region_code.strip().upper()
	full_region_code = (
		region_code if "-" in region_code else f"{context.country.upper()}-{region_code}"
	) if region_code else ""
	rows = database.query(
		"""SELECT id, action, country_code, region, region_code AS regionCode FROM geo_policies
		WHERE enabled = 1 AND country_code = ?
		AND (region IS NULL OR LOWER(region) = LOWER(?)
			OR (region_code IS NOT NULL AND UPPER(region_code) IN (?, ?)))
		AND (scope_host IS NULL OR scope_host = ?)
		AND (expires_at IS NULL OR expires_at > ?)
		ORDER BY CASE WHEN region IS NULL THEN 1 ELSE 0 END,
			CASE WHEN scope_host IS NULL THEN 1 ELSE 0 END, id DESC""",
		(context.country.upper(), context.region or "", region_code, full_region_code, context.host, now),
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
			if action == "block":
				context.extra["geo_restriction_policy_id"] = int(row["id"])
				context.extra["geo_restriction_label"] = label
			return resolved, f"Geographic policy {row['id']} matched {label}: {action.replace('_', ' ')}"
	return None, None


def _apply_geo_policy_risk(context: RequestContext, risk: RiskResult, reason: str | None) -> None:
	if reason:
		risk.reasons.append(reason)
	if context.extra.get("geo_restriction_policy_id"):
		risk.score = 100
		risk.level = "block"
		context.risk_score = 100


def _is_sensitive(host: str, path: str, method: str) -> bool:
	return host in {"admin.silentflare.com", "cms.silentflare.com"} or method != "GET" or any(path.startswith(prefix) for prefix in SENSITIVE_PATHS)


def _failure_response(host: str, path: str, method: str, request_id: str, fail_policy: str) -> Response | None:
	closed = fail_policy == "closed" or (fail_policy == "route" and _is_sensitive(host, path, method))
	if closed:
		return JSONResponse({"detail": "Security gateway temporarily unavailable", "requestId": request_id}, status_code=503, headers={"Retry-After": "5"})
	return None


def _memory_degraded_context(request: Request, request_id: str, host: str) -> tuple[RequestContext, RiskResult, bool]:
	now = int(time.time())
	identity = _client_identity(request)
	ip = identity.ip
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
	context = RequestContext(request_id, host, request.url.path, request.method, ip, device_id=_device_id(request, ip), risk_score=risk.score, rate_exceeded=exceeded, extra={"client_ip_source": identity.source, "geo_source": "degraded", "geo_confidence": "unknown"})
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


def _ban_public_id(database: Database, ban: dict[str, Any]) -> str:
	public_id = safe_public_ban_id(str(ban.get("public_id") or ""))
	if public_id:
		return public_id
	for _attempt in range(3):
		candidate = new_public_ban_id()
		try:
			database.execute(
				"UPDATE bans SET public_id = ? WHERE id = ? AND public_id IS NULL",
				(candidate, ban["id"]),
			)
		except sqlite3.IntegrityError:
			continue
		rows = database.query("SELECT public_id FROM bans WHERE id = ?", (ban["id"],))
		if rows:
			public_id = safe_public_ban_id(str(rows[0].get("public_id") or ""))
			if public_id:
				ban["public_id"] = public_id
				return public_id
	raise RuntimeError("Unable to allocate a public ban identifier")


def _block_case_url(
	request: Request,
	request_id: str,
	risk_code: str,
	ban: dict[str, Any] | None,
	database: Database,
	context: RequestContext | None,
) -> tuple[str, str]:
	public_ban_id = _ban_public_id(database, ban) if ban else new_public_ban_id()
	host = _host(request)
	now = int(time.time())
	expires_at = int(ban["expires_at"]) if ban and ban.get("expires_at") else None if ban else now + 900
	subject_type = str(ban.get("subject_type") or "") if ban else ""
	subject_hash = str(ban.get("subject_hash") or "") if ban else ""
	if not subject_type and context:
		for candidate, value in (
			("account", context.account_id),
			("ip", context.ip),
		):
			if value:
				subject_type = candidate
				subject_hash = request.app.state.entities.subject_hash(candidate, value)
				break
	return_path = request.url.path if request.url.path.startswith("/") else "/"
	database.execute(
		"""INSERT INTO risk_cases(public_id, risk_code, subject_type, subject_hash, ban_public_id,
		host, return_path, created_at, expires_at, status, request_id, internal_reason)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
		ON CONFLICT(public_id) DO UPDATE SET risk_code=excluded.risk_code, host=excluded.host,
		return_path=excluded.return_path, request_id=excluded.request_id,
		expires_at=COALESCE(excluded.expires_at, risk_cases.expires_at), status='active'""",
		(
			public_ban_id,
			risk_code,
			subject_type or None,
			subject_hash or None,
			public_ban_id if ban else None,
			host,
			return_path,
			now,
			expires_at,
			request_id,
			"Persistent ban" if ban else "Request decision",
		),
	)
	token = issue_token({"purpose": "public_case", "id": public_ban_id}, settings.internal_signing_key, 86400)
	return f"{settings.public_url}/blocked?id={quote(public_ban_id)}&token={quote(token)}", public_ban_id


def _block_error_code(
	ban: dict[str, Any] | None,
	list_status: str | None,
	geo_reason: str | None,
	rules: RuleDecision,
	risk: RiskResult,
	actions: list[str],
) -> str:
	if ban:
		return risk_code_for(ban)
	if list_status == "deny":
		return "403"
	if geo_reason:
		return "204"
	if rules.matched_rules:
		return "403"
	if risk.level == "block":
		return "404"
	if "temporary_ban" in actions:
		return "304"
	return "404"


def _blocked_response(
	request: Request,
	request_id: str,
	host: str,
	error_code: str,
	ban: dict[str, Any] | None,
	context: RequestContext | None = None,
) -> Response:
	case_url, public_ban_id = _block_case_url(
		request,
		request_id,
		error_code,
		ban,
		request.app.state.database,
		context,
	)
	headers = {
		"Cache-Control": "no-store",
		"Location": case_url,
		"Referrer-Policy": "no-referrer",
		"X-SF-Shield-Error-Code": error_code,
		"X-SF-Shield-Request-ID": request_id,
	}
	if public_ban_id:
		headers["X-SF-Shield-Ban-ID"] = public_ban_id
	if request.method in {"GET", "HEAD"} and "text/html" in request.headers.get("accept", ""):
		return RedirectResponse(case_url, status_code=303, headers=headers)
	return JSONResponse(
		{
			"detail": "Request blocked by SilentFlare Shield",
			"errorCode": error_code,
			"banId": public_ban_id or None,
			"requestId": request_id,
			"supportUrl": case_url,
		},
		status_code=403,
		headers=headers,
	)


def _portal_headers() -> dict[str, str]:
	return {
		"Cache-Control": "no-store",
		"Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'self'; base-uri 'none'; frame-ancestors 'none'",
		"Referrer-Policy": "no-referrer",
		"X-Content-Type-Options": "nosniff",
	}


def _render_block_portal(request: Request, generic: bool = False) -> Response:
	if generic:
		return HTMLResponse(
			"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>SilentFlare Shield</title></head><body><main><h1>Shield protection is active</h1></main></body></html>""",
			headers=_portal_headers(),
		)
	public_id = safe_public_ban_id(str(request.query_params.get("id", "")))
	token = read_token(str(request.query_params.get("token", "")), settings.internal_signing_key)
	valid = bool(public_id and token and token.get("purpose") == "public_case" and token.get("id") == public_id)
	case = None
	if valid:
		rows = request.app.state.database.query("SELECT * FROM risk_cases WHERE public_id = ? LIMIT 1", (public_id,))
		case = rows[0] if rows else None
	if case:
		now = int(time.time())
		released = case["status"] != "active" or (case["expires_at"] is not None and int(case["expires_at"]) <= now)
		if case["ban_public_id"]:
			active = request.app.state.database.query(
				"""SELECT 1 FROM bans WHERE public_id = ? AND revoked_at IS NULL
				AND (expires_at IS NULL OR expires_at > ?) LIMIT 1""",
				(case["ban_public_id"], now),
			)
			released = not bool(active)
		elif case["subject_type"] and case["subject_hash"]:
			subject = request.app.state.entities.subject_by_hash(case["subject_type"], case["subject_hash"])
			if subject and request.app.state.entities.effective_score(subject, case["host"], case["return_path"]) < 50:
				released = True
		if released and case["host"] in settings.upstreams:
			request.app.state.database.execute(
				"UPDATE risk_cases SET status = 'released', released_at = ? WHERE public_id = ? AND status = 'active'",
				(now, public_id),
			)
			response = RedirectResponse(f"https://{case['host']}{case['return_path']}", status_code=303)
			clearance = issue_token(
				{"purpose": "clearance", "case": public_id, "host": case["host"], "path": case["return_path"]},
				settings.internal_signing_key,
				60,
			)
			response.set_cookie("sf_shield_clearance", clearance, max_age=60, secure=settings.cookie_secure, httponly=True, samesite="lax", domain=".silentflare.com")
			return response
	page_values = {
		"RISK_CODE": case["risk_code"] if case and is_public_risk_code(case["risk_code"]) else "404",
		"BAN_ID": public_id if case else "SFB-UNAVAILABLE",
	}
	page = BLOCK_HTML
	for key, value in page_values.items():
		page = page.replace(f"{{{{{key}}}}}", html.escape(str(value)))
	return HTMLResponse(page, headers=_portal_headers())


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


def _entity_subjects(service: EntityRiskService, context: RequestContext) -> dict[str, dict[str, Any]]:
	try:
		address = ipaddress.ip_address(context.ip)
		cidr = str(ipaddress.ip_network(f"{address}/{24 if address.version == 4 else 48}", strict=False))
		ip_display = str(address)
	except ValueError:
		cidr = ""
		ip_display = context.ip
	email_domain = context.email.rsplit("@", 1)[-1] if "@" in context.email else ""
	subjects: dict[str, dict[str, Any]] = {}
	try:
		subjects["ip"] = service.ensure_subject("ip", context.ip, display=ip_display)
	except ValueError:
		return subjects
	if context.account_id:
		try:
			subjects["account"] = service.ensure_subject("account", context.account_id)
		except ValueError:
			pass
	account = subjects.get("account")
	ip = subjects["ip"]
	if account:
		service.relate_account_ip(int(account["id"]), int(ip["id"]), authenticated=True)
	facets = (
		("session", context.session_id, "Correlated session", 100),
		("device", context.device_id, "Correlated device", 90),
		("cidr", cidr, cidr, 100),
		("asn", context.asn, context.asn, 90),
		("email", context.email, "Observed email", 100),
		("email_domain", email_domain, email_domain, 100),
		("api_key", context.api_key, "Correlated API key", 100),
		("country", context.country, context.country, 85),
		("region", context.region, context.region, 75),
	)
	for evidence_type, value, display, confidence in facets:
		if not value:
			continue
		metadata = {"requestId": context.request_id, "host": context.host}
		observed = service.observe_evidence(
			int(ip["id"]), evidence_type, value, display=display, confidence=confidence, metadata=metadata
		)
		if evidence_type == "device" and observed and observed["isNew"]:
			context.extra["new_device_evidence_id"] = int(observed["id"])
		if account:
			service.observe_evidence(
				int(account["id"]), evidence_type, value, display=display,
				confidence=confidence, metadata=metadata,
			)
	return subjects


def _apply_entity_score(
	service: EntityRiskService,
	context: RequestContext,
	risk: RiskResult,
	weights: dict[str, int],
) -> dict[str, dict[str, Any]]:
	subjects = _entity_subjects(service, context)
	if context.extra.get("new_device_evidence_id"):
		new_device_weight = int((DEFAULT_WEIGHTS | weights)["new_device"])
		if new_device_weight:
			risk.score = max(0, min(100, risk.score + new_device_weight))
			risk.level = entity_level(risk.score)
			risk.reasons.append("New device observed")
	permanently_allowlisted = any(
		service.is_permanently_allowlisted(
			int(subject["id"]), context.host, context.path
		)
		for subject in subjects.values()
	)
	if permanently_allowlisted:
		risk.score = 0
		risk.level = entity_level(0)
		risk.reasons.append("Permanent entity allowlist")
		context.extra["permanent_allowlisted"] = True
		return subjects
	root_scores = [
		service.effective_score(subject, context.host, context.path)
		for subject in subjects.values()
	]
	entity_score = max(root_scores or [0])
	if entity_score > risk.score:
		risk.score = entity_score
		risk.level = entity_level(entity_score)
		risk.reasons.append("Existing subject risk score")
	return subjects


def _enforcement_risk(
	context: RequestContext,
	request_risk: RiskResult,
	combined_risk: RiskResult,
) -> RiskResult:
	if (
		context.host == "api.silentflare.com"
		and context.method in {"GET", "HEAD"}
		and context.path in PUBLIC_API_READ_PATHS
	):
		return request_risk
	return combined_risk


def _apply_permanent_allowlist(
	context: RequestContext,
	risk: RiskResult,
	actions: list[str],
) -> list[str]:
	if not context.extra.get("permanent_allowlisted") or context.host in {
		"admin.silentflare.com",
		"cms.silentflare.com",
	}:
		return actions
	risk.score = 0
	risk.level = entity_level(0)
	context.risk_score = 0
	return ["allow"]


def _record_entity_signals(
	service: EntityRiskService,
	context: RequestContext,
	risk: RiskResult,
	rates: list[RateHit],
	rules: RuleDecision,
	subjects: dict[str, dict[str, Any]],
	weights: dict[str, int],
	list_match: dict[str, Any] | None = None,
) -> None:
	values = DEFAULT_WEIGHTS | weights

	def weighted(key: str, ratio: float = 1) -> int:
		value = int(round(values[key] * ratio))
		if value == 0 and values[key] != 0:
			return 1 if values[key] > 0 else -1
		return value

	def signal(
		subject_type: str,
		delta: int,
		code: str,
		reason: str,
		duration: int,
		steps: int = 4,
		source_ref: str | None = None,
	) -> None:
		if delta == 0:
			return
		if subject_type not in {"account", "ip"} or subject_type not in subjects:
			return
		service.enqueue_signal(
			int(subjects[subject_type]["id"]),
			delta=delta,
			reason_code=code,
			reason=reason,
			source_ref=source_ref or context.request_id,
			duration_seconds=duration,
			decay_steps=steps,
		)

	def signal_roots(
		delta: int,
		code: str,
		reason: str,
		duration: int,
		steps: int = 4,
		source_ref: str | None = None,
		account_ratio: float = 0.3,
	) -> None:
		signal("ip", delta, code, reason, duration, steps, source_ref)
		if subjects.get("account") and account_ratio:
			account_delta = int(round(delta * account_ratio))
			if account_delta == 0 and delta:
				account_delta = 1 if delta > 0 else -1
			signal(
				"account", account_delta, code, f"{reason} (linked IP)", duration, steps, source_ref
			)

	reasons = set(risk.reasons)
	geo_policy_id = context.extra.get("geo_restriction_policy_id")
	if geo_policy_id:
		label = str(context.extra.get("geo_restriction_label") or context.country)
		for subject in subjects.values():
			service.ensure_geo_policy_floor(
				int(subject["id"]),
				int(geo_policy_id),
				label=label,
				reason="Restricted geography matched",
				actor="shield",
			)
	if "VPN network" in reasons:
		signal_roots(weighted("vpn", 0.5), "VPN_NETWORK", "VPN network observed", 86400, account_ratio=0.2)
	if "Proxy network" in reasons:
		signal_roots(weighted("proxy", 0.5), "PROXY_NETWORK", "Proxy network observed", 86400, account_ratio=0.2)
	if "Data center network" in reasons:
		signal_roots(weighted("datacenter", 0.5), "DATACENTER_NETWORK", "Data center network observed", 86400, account_ratio=0.2)
	if "Expected browser headers missing" in reasons:
		signal_roots(weighted("missing_headers", 0.7), "MISSING_BROWSER_HEADERS", "Expected browser headers missing (device evidence)", 21600, account_ratio=0.5)
	if "Abnormal request origin" in reasons:
		signal_roots(weighted("abnormal_origin", 0.7), "ABNORMAL_ORIGIN", "Abnormal request origin (session evidence)", 43200, account_ratio=0.5)
	if "New device observed" in reasons and context.extra.get("new_device_evidence_id"):
		signal_roots(
			weighted("new_device"), "NEW_DEVICE", "New device evidence observed", 86400, 4,
			f"new-device:{context.extra['new_device_evidence_id']}", 0.5,
		)
	if rates:
		for hit in rates:
			reference = f"{context.request_id}:rate:{hit.policy_id}"
			signal_roots(
				weighted("rate_exceeded", 0.4), "RATE_LIMIT_EXCEEDED", hit.policy_name,
				86400, 4, reference, 0.8 if hit.dimension == "account" else 0.35,
			)
	if "Automation browser signature" in reasons:
		signal_roots(weighted("automation", 0.82), "AUTOMATION_SIGNATURE", "Automation browser signature (device evidence)", 43200, account_ratio=0.5)
	if "Known malicious IP" in reasons:
		signal_roots(weighted("malicious_ip", 0.8), "THREAT_INTELLIGENCE", "Known malicious IP intelligence", 604800, 7, account_ratio=0.15)
	if "Tor exit node" in reasons:
		signal_roots(weighted("tor", 0.43), "TOR_NETWORK", "Tor exit node", 86400, account_ratio=0.2)
	if list_match:
		list_subject_type = str(list_match.get("subject_type") or "")
		if list_match.get("kind") in {"allow", "deny"}:
			kind = str(list_match["kind"])
			signal_roots(
				weighted("allow_list" if kind == "allow" else "deny_list"),
				"ALLOW_LIST_MATCH" if kind == "allow" else "DENY_LIST_MATCH",
				f"Matched {list_subject_type or 'request'} {kind} list evidence",
				86400,
				1,
				account_ratio=1 if list_subject_type == "account" else 0.3,
			)
	if rules.matched_rules:
		signal_roots(weighted("rule_match"), "RULE_MATCH", f"Matched rule {rules.matched_rules[0]['name']}", 86400, account_ratio=0.625)


def _event(database: Database, context: RequestContext, risk: RiskResult, rules: RuleDecision, actions: list[str], request: Request, body: bytes) -> None:
	if risk.level == "normal" and actions == ["allow"] and not rules.matched_rules:
		return
	database.execute(
		"""INSERT INTO risk_events(id, created_at, trace_id, risk_level, risk_score, host, path, method,
		ip_hash, ip_masked, country_code, region, asn, ip_type, account_id_hash, device_id_hash,
		session_id_hash, matched_rules_json, reasons_json, actions_json, request_summary_json,
		client_ip_source, geo_source, geo_confidence)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
		(
			context.request_id, int(time.time()), context.request_id, risk.level, risk.score, context.host,
			context.path, context.method, stable_hash(context.ip, settings.internal_signing_key), mask_ip(context.ip),
			context.country, context.region, context.asn, context.ip_type,
			stable_hash(context.account_id, settings.internal_signing_key) if context.account_id else None,
			stable_hash(context.device_id, settings.internal_signing_key) if context.device_id else None,
			stable_hash(context.session_id, settings.internal_signing_key) if context.session_id else None,
			json.dumps(rules.matched_rules, separators=(",", ":")), json.dumps(risk.reasons, separators=(",", ":")),
			json.dumps(actions, separators=(",", ":")), json.dumps(_safe_request_summary(request, body), separators=(",", ":")),
			context.extra.get("client_ip_source", "unknown"), context.extra.get("geo_source", "unknown"),
			context.extra.get("geo_confidence", "unknown"),
		),
	)
	config = database.query("SELECT enabled, minimum_score FROM alert_config WHERE id = 1")
	if config and config[0]["enabled"] and risk.score >= int(config[0]["minimum_score"]):
		database.execute(
			"""INSERT INTO alert_events(created_at, kind, severity, title, detail, risk_event_id)
			SELECT ?, 'high_risk_request', ?, 'High-risk request detected', ?, ?
			WHERE NOT EXISTS (SELECT 1 FROM alert_events WHERE risk_event_id = ?)""",
			(int(time.time()), "critical" if risk.score >= 80 else "high", f"{context.method} {context.host}{context.path} scored {risk.score}", context.request_id, context.request_id),
		)


def _automatic_ban(database: Database, context: RequestContext, hits: list[RateHit]) -> None:
	ban_hits = [hit for hit in hits if hit.action == "temporary_ban"]
	if not ban_hits:
		return
	hit = max(ban_hits, key=lambda item: max(item.retry_after, item.cooldown_seconds))
	if hit.dimension == "account" and context.account_id:
		subject_type, raw_value = "account", context.account_id
	else:
		subject_type, raw_value = "ip", context.ip
	normalized = normalize_ban_subject(subject_type, raw_value)
	display = ban_subject_display(subject_type, normalized)
	subject_hash = stable_hash(normalized, settings.internal_signing_key)
	now = int(time.time())
	expires_at = now + max(hit.retry_after, hit.cooldown_seconds, 300)
	database.execute(
		"""INSERT INTO bans(public_id, subject_type, subject_hash, subject_display, restriction, reason, created_by, created_at, expires_at)
		SELECT ?, ?, ?, ?, 'all', ?, 'shield', ?, ? WHERE NOT EXISTS (
			SELECT 1 FROM bans WHERE subject_type = ? AND subject_hash = ? AND revoked_at IS NULL
			AND (expires_at IS NULL OR expires_at > ?)
		)""",
		(new_public_ban_id(), subject_type, subject_hash, display, f"Automatic policy: {hit.policy_name}", now, expires_at, subject_type, subject_hash, now),
	)


async def _proxy(request: Request, body: bytes, upstream: str, context: RequestContext | None, risk: RiskResult | None, action: str) -> Response:
	url = f"{upstream}{request.url.path}"
	if request.url.query:
		url += f"?{request.url.query}"
	headers = {
		name.lower(): value
		for name, value in request.headers.items()
		if name.lower() not in HOP_BY_HOP
		and name.lower() not in SHIELD_HEADERS
		and name.lower() not in EDGE_IDENTITY_HEADERS
	}
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
	proxy_request = request.app.state.client.build_request(request.method, url, headers=headers, content=body)
	proxy_response = await request.app.state.client.send(proxy_request, stream=True)
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
					reasons_json, actions_json, request_summary_json, client_ip_source, geo_source, geo_confidence)
					VALUES (?, ?, ?, 'restrict', 65, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', ?, ?, ?, ?, ?, ?)""",
					(event_id, now, context.request_id, context.host, context.path, context.method,
					stable_hash(context.ip, settings.internal_signing_key), mask_ip(context.ip), context.country,
					context.region, context.asn, context.ip_type,
					stable_hash(context.device_id, settings.internal_signing_key) if context.device_id else None,
					json.dumps(["Repeated 404 responses indicate path scanning"]), json.dumps(actions),
					json.dumps(_safe_request_summary(request, body), separators=(",", ":")),
					context.extra.get("client_ip_source", "unknown"), context.extra.get("geo_source", "unknown"),
					context.extra.get("geo_confidence", "unknown")),
				)
				if "temporary_ban" in actions:
					expires_at = now + max(hit.retry_after for hit in response_hits)
					normalized_ip = normalize_ban_subject("ip", context.ip)
					subject_hash = stable_hash(normalized_ip, settings.internal_signing_key)
					request.app.state.database.execute(
						"""INSERT INTO bans(public_id, subject_type, subject_hash, subject_display, restriction, reason, created_by, created_at, expires_at)
						SELECT ?, 'ip', ?, ?, 'all', 'Automatic 404 scan policy', 'shield', ?, ?
						WHERE NOT EXISTS (SELECT 1 FROM bans WHERE subject_type = 'ip' AND subject_hash = ?
						AND revoked_at IS NULL AND (expires_at IS NULL OR expires_at > ?))""",
						(new_public_ban_id(), subject_hash, ban_subject_display("ip", normalized_ip), now, expires_at, subject_hash, now),
					)
		except sqlite3.Error:
			request.app.state.degraded_events.append({"createdAt": int(time.time()), "requestId": context.request_id, "host": context.host, "path": context.path, "method": context.method, "ipMasked": mask_ip(context.ip), "riskScore": 0, "reason": "response_telemetry_database_unavailable"})
	response = StreamingResponse(
		proxy_response.aiter_raw(),
		status_code=proxy_response.status_code,
		background=BackgroundTask(proxy_response.aclose),
	)
	response.raw_headers = [
		(name, value)
		for name, value in proxy_response.headers.raw
		if name.decode("latin-1").lower() not in HOP_BY_HOP
		and name.decode("latin-1").lower() not in SHIELD_HEADERS
	]
	if context:
		response.raw_headers.append((b"x-sf-shield-request-id", context.request_id.encode("latin-1")))
	return response


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
		service["connected"] = service["host"] in settings.connected_hosts
		service["status"] = "protected" if service["connected"] and service["protectionEnabled"] else "bypassed" if service["connected"] else "staged" if service["protectionEnabled"] else "configured"
	geo_policies = db.query("SELECT id, country_code AS countryCode, region, region_code AS regionCode, scope_host AS scopeHost, action, enabled, note, created_at AS createdAt, expires_at AS expiresAt FROM geo_policies ORDER BY enabled DESC, id DESC")
	geo_options = db.query("SELECT country_code AS countryCode, region, COUNT(*) AS observations FROM ip_intel WHERE country_code IS NOT NULL GROUP BY country_code, region ORDER BY country_code, observations DESC")
	network_intel = db.query("SELECT ip_masked AS ipMasked, country_code AS countryCode, region, city, asn, isp, organization, ip_type AS ipType, is_vpn AS isVpn, is_proxy AS isProxy, is_tor AS isTor, is_crawler AS isCrawler, is_malicious AS isMalicious, risk_score AS riskScore, first_seen_at AS firstSeenAt, last_seen_at AS lastSeenAt FROM ip_intel ORDER BY risk_score DESC, last_seen_at DESC LIMIT 100")
	access_lists = db.query("SELECT id, kind, subject_type AS subjectType, subject_value AS subjectValue, scope_host AS scopeHost, note, created_at AS createdAt, expires_at AS expiresAt, disabled_at AS disabledAt FROM access_lists ORDER BY id DESC LIMIT 100")
	bans = db.query("SELECT id, public_id AS publicId, subject_type AS subjectType, subject_display AS subjectDisplay, restriction, reason, created_by AS createdBy, created_at AS createdAt, expires_at AS expiresAt, revoked_at AS revokedAt FROM bans ORDER BY id DESC LIMIT 100")
	alerts = db.query("SELECT id, created_at AS createdAt, kind, severity, title, detail, status, delivered_at AS deliveredAt, delivery_detail AS deliveryDetail FROM alert_events ORDER BY id DESC LIMIT 50")
	alert_config = db.query("SELECT enabled, minimum_score AS minimumScore, high_risk_per_5m AS highRiskPer5m, blocked_per_5m AS blockedPer5m, daily_report_hour AS dailyReportHour FROM alert_config WHERE id = 1")[0]
	risk_model = {"weights": DEFAULT_WEIGHTS | db.setting("risk_weights", {}), "thresholds": DEFAULT_THRESHOLDS | db.setting("risk_thresholds", {}), "versions": db.query("SELECT version, created_at AS createdAt, created_by AS createdBy, note FROM risk_config_versions ORDER BY version DESC LIMIT 10")}
	daily_report = _daily_report(db)
	entity_metrics = db.query(
		"""SELECT COUNT(*) AS total,
		SUM(CASE WHEN current_score >= 50 THEN 1 ELSE 0 END) AS elevated,
		SUM(CASE WHEN current_score >= 80 THEN 1 ELSE 0 END) AS blocking
		FROM risk_subjects"""
	)[0]
	queue_metrics = db.query(
		"""SELECT SUM(CASE WHEN status = 'queued' THEN 1 ELSE 0 END) AS queued,
		SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failed FROM risk_signal_queue"""
	)[0]
	automation_runs = db.query(
		"""SELECT id, job_name AS jobName, started_at AS startedAt, completed_at AS completedAt,
		status, processed_count AS processedCount, detail FROM automation_runs
		ORDER BY id DESC LIMIT 20"""
	)
	return {
		"mode": _mode(db),
		"rangeHours": range_hours,
		"metrics": {"requests": counts["requests"] or 0, "blocked": counts["blocked"] or 0, "challenged": counts["challenged"] or 0, "highRisk": counts["high_risk"] or 0, "uniqueIps": counts["unique_ips"] or 0, "activeBans": active_bans, "accounts": account_counts["total"] or 0, "riskyAccounts": account_counts["risky"] or 0, "riskEntities": entity_metrics["total"] or 0, "elevatedEntities": entity_metrics["elevated"] or 0, "blockingEntities": entity_metrics["blocking"] or 0},
		"series": series,
		"topCountries": top_countries,
		"topAsns": top_asns,
		"recentEvents": recent,
		"riskyAccounts": risky_accounts,
		"policies": policies,
		"services": services,
		"geoPolicies": geo_policies,
		"geoOptions": geo_options,
		"networkIntel": network_intel,
		"accessLists": access_lists,
		"bans": bans,
		"alerts": alerts,
		"alertConfig": alert_config,
		"riskModel": risk_model,
		"dailyReport": daily_report,
		"automation": {"queuedSignals": queue_metrics["queued"] or 0, "failedSignals": queue_metrics["failed"] or 0, "runs": automation_runs},
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
		if subject_type == "ip":
			subject = request.app.state.entities.subject_by_hash("ip", subject_hash)
			if subject:
				display = subject["display_value"]
		db.execute("INSERT INTO bans(public_id, subject_type, subject_hash, subject_display, restriction, reason, created_by, created_at, expires_at) VALUES (?, ?, ?, ?, 'all', ?, ?, ?, ?)", (new_public_ban_id(), subject_type, subject_hash, display, f"Created from risk event {event_id}", actor, now, now + payload.duration_seconds))
		db.execute("UPDATE risk_events SET review_status = 'actioned', reviewed_by = ?, reviewed_at = ? WHERE id = ?", (actor, now, event_id))
	db.audit(actor, f"risk_event.{payload.action}", "risk_event", event_id, {"durationSeconds": payload.duration_seconds})
	return {"ok": True, "eventId": event_id, "action": payload.action}


def _risk_factors_payload(database: Database) -> dict[str, Any]:
	weights = DEFAULT_WEIGHTS | database.setting("risk_weights", {})
	factors = []
	for key, (label, category, subject_types) in RISK_FACTOR_CATALOG.items():
		factors.append(
			{
				"key": key,
				"label": label,
				"category": category,
				"subjectTypes": list(subject_types),
				"weight": int(weights[key]),
				"defaultWeight": int(DEFAULT_WEIGHTS[key]),
			}
		)
	versions = database.query(
		"""SELECT version, created_at AS createdAt, created_by AS createdBy, note
		FROM risk_config_versions ORDER BY version DESC LIMIT 10"""
	)
	return {"factors": factors, "versions": versions, "currentVersion": versions[0]["version"] if versions else 0}


@app.get("/__shield/api/admin/risk-factors")
async def admin_risk_factors(request: Request):
	await _admin(request)
	return _risk_factors_payload(request.app.state.database)


@app.put("/__shield/api/admin/risk-factors")
async def admin_risk_factors_update(payload: RiskFactorsInput, request: Request):
	actor, _ = await _admin(request, csrf=True)
	if set(payload.weights) != set(RISK_FACTOR_CATALOG):
		raise HTTPException(status_code=422, detail="Every visible risk factor must be supplied")
	if any(not isinstance(value, int) or value < -100 or value > 100 for value in payload.weights.values()):
		raise HTTPException(status_code=422, detail="Risk factor weights must be integers from -100 to 100")
	db = request.app.state.database
	weights = DEFAULT_WEIGHTS | db.setting("risk_weights", {})
	weights.update(payload.weights)
	thresholds = DEFAULT_THRESHOLDS | db.setting("risk_thresholds", {})
	simulation = _risk_model_simulation(db, weights, thresholds)
	if not simulation["safeToPublish"]:
		raise HTTPException(status_code=422, detail="This change would block more than 80% of sampled traffic")
	latest = int(db.query("SELECT COALESCE(MAX(version), 0) AS value FROM risk_config_versions")[0]["value"])
	version = latest + 1
	db.set_setting("risk_weights", weights, actor)
	db.execute(
		"""INSERT INTO risk_config_versions(version, weights_json, thresholds_json, created_at,
		created_by, note) VALUES (?, ?, ?, ?, ?, ?)""",
		(
			version,
			json.dumps(weights, separators=(",", ":")),
			json.dumps(thresholds, separators=(",", ":")),
			int(time.time()),
			actor,
			payload.reason,
		),
	)
	db.audit(
		actor,
		"risk_factors.update",
		"risk_factor_set",
		str(version),
		{"reason": payload.reason, "weights": payload.weights, "simulation": simulation},
	)
	return {**_risk_factors_payload(db), "simulation": simulation}


@app.get("/__shield/api/admin/sites")
async def admin_sites(request: Request):
	await _admin(request)
	stored = request.app.state.database.query(
		"""SELECT host, protection_enabled AS protectionEnabled, mode,
		updated_at AS updatedAt, updated_by AS updatedBy FROM service_controls ORDER BY host"""
	)
	controls = {row["host"]: row for row in stored}
	rows = []
	for host in sorted(settings.upstreams):
		row = controls.get(
			host,
			{
				"host": host,
				"protectionEnabled": 0,
				"mode": "observe",
				"updatedAt": 0,
				"updatedBy": "",
			},
		)
		row["connected"] = host in settings.connected_hosts
		row["enabled"] = bool(row.pop("protectionEnabled") and row["mode"] == "enforce")
		rows.append(row)
	return {"sites": rows}


@app.put("/__shield/api/admin/sites/{host}")
async def admin_site_protection(host: str, payload: SiteProtectionInput, request: Request):
	actor, _ = await _admin(request, csrf=True)
	host = host.lower()
	if host not in settings.upstreams:
		raise HTTPException(status_code=404, detail="Protected site is not configured")
	if payload.enabled and host not in settings.connected_hosts:
		raise HTTPException(status_code=422, detail="This site is not connected to the Shield edge")
	if payload.enabled:
		turnstile_active = request.app.state.database.query(
			"SELECT 1 FROM rate_policies WHERE enabled = 1 AND action = 'turnstile' LIMIT 1"
		)
		if turnstile_active and (not settings.turnstile_site_key or not settings.turnstile_secret_key):
			raise HTTPException(status_code=422, detail="Turnstile must be configured before protection is enabled")
	db = request.app.state.database
	now = int(time.time())
	current = db.query("SELECT fail_policy FROM service_controls WHERE host = ? LIMIT 1", (host,))
	fail_policy = current[0]["fail_policy"] if current else settings.fail_policy
	if payload.enabled and _mode(db) == "bypass":
		db.set_setting("global_mode", "observe", actor)
	db.execute(
		"""INSERT INTO service_controls(host, protection_enabled, mode, fail_policy, updated_at, updated_by)
		VALUES (?, ?, 'enforce', ?, ?, ?) ON CONFLICT(host) DO UPDATE SET
		protection_enabled=excluded.protection_enabled, mode='enforce',
		updated_at=excluded.updated_at, updated_by=excluded.updated_by""",
		(host, int(payload.enabled), fail_policy, now, actor),
	)
	db.audit(
		actor,
		"site_protection.enabled" if payload.enabled else "site_protection.disabled",
		"service",
		host,
		{"enabled": payload.enabled, "reason": payload.reason},
	)
	return {
		"host": host,
		"enabled": payload.enabled,
		"connected": host in settings.connected_hosts,
		"updatedAt": now,
	}


@app.put("/__shield/api/admin/services/{host}")
async def admin_service_control(host: str, payload: ServiceControlInput, request: Request):
	actor, _ = await _admin(request, csrf=True)
	host = host.lower()
	if host not in settings.upstreams:
		raise HTTPException(status_code=404, detail="Protected service is not configured")
	if payload.mode == "enforce" and host not in settings.connected_hosts:
		raise HTTPException(status_code=422, detail="This service is not connected at the edge and cannot enter enforce mode")
	turnstile_active = request.app.state.database.query("SELECT 1 FROM rate_policies WHERE enabled = 1 AND action = 'turnstile' LIMIT 1")
	if payload.mode == "enforce" and turnstile_active and (not settings.turnstile_site_key or not settings.turnstile_secret_key):
		raise HTTPException(status_code=422, detail="Turnstile must be configured before enforcement")
	now = int(time.time())
	request.app.state.database.execute(
		"""INSERT INTO service_controls(host, protection_enabled, mode, fail_policy, updated_at, updated_by)
		VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(host) DO UPDATE SET
		protection_enabled=excluded.protection_enabled, mode=excluded.mode,
		fail_policy=excluded.fail_policy, updated_at=excluded.updated_at, updated_by=excluded.updated_by""",
		(host, int(payload.protection_enabled), payload.mode, payload.fail_policy, now, actor),
	)
	request.app.state.database.audit(actor, "service_control.update", "service", host, payload.model_dump())
	return {"host": host, **payload.model_dump(), "connected": host in settings.connected_hosts}


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
		"INSERT INTO geo_policies(country_code, region, region_code, scope_host, action, note, created_at, created_by, updated_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		(country, payload.region or None, payload.region_code or None, payload.scope_host or None, payload.action, payload.note, now, actor, now, payload.expires_at),
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
	restored_subject_ids = request.app.state.entities.revoke_geo_policy_floors(
		[policy_id], actor=actor, reason="Geographic policy disabled"
	)
	restored_subject_ids |= request.app.state.entities.revoke_geo_policy_signals(
		[policy_id], actor=actor, reason="Geographic policy disabled"
	)
	_reconcile_entity_bans(db, request.app.state.entities)
	db.audit(actor, "geo_policy.disable", "geo_policy", str(policy_id), {})
	return {"disabled": True, "restoredSubjects": len(restored_subject_ids)}


def _active_geo_restrictions(database: Database) -> list[dict[str, Any]]:
	return database.query(
		"""SELECT id, country_code AS countryCode, region, region_code AS regionCode,
		created_at AS createdAt, created_by AS createdBy, note
		FROM geo_policies WHERE enabled = 1 AND action = 'block' AND scope_host IS NULL
		AND (expires_at IS NULL OR expires_at > ?)
		ORDER BY id DESC""",
		(int(time.time()),),
	)


def _geo_policy_subject_ids(
	database: Database,
	*,
	country_code: str,
	region_code: str | None,
	region_name: str | None,
) -> list[int]:
	region_suffix = region_code.rsplit("-", 1)[-1] if region_code else ""
	region_clause = ""
	region_parameters: tuple[Any, ...] = ()
	if region_code:
		region_clause = """AND (UPPER(intel.region_code) IN (?, ?)
		OR LOWER(intel.region) = LOWER(?))"""
		region_parameters = (region_code, region_suffix, region_name or "")
	elif region_name:
		region_clause = "AND LOWER(intel.region) = LOWER(?)"
		region_parameters = (region_name,)
	ip_rows = database.query(
		f"""SELECT subject.id FROM risk_subjects AS subject JOIN ip_intel AS intel
		ON intel.ip_hash = subject.subject_hash WHERE subject.subject_type = 'ip'
		AND subject.provenance_status = 'verified' AND intel.provenance_status = 'verified'
		AND UPPER(intel.country_code) = ? {region_clause}""",
		(country_code, *region_parameters),
	)
	account_rows = database.query(
		f"""SELECT DISTINCT account.id FROM risk_subjects AS account
		JOIN account_ip_relations AS relation ON relation.account_subject_id = account.id
		JOIN risk_subjects AS ip ON ip.id = relation.ip_subject_id
		JOIN ip_intel AS intel ON intel.ip_hash = ip.subject_hash
		WHERE account.subject_type = 'account' AND account.provenance_status = 'verified'
		AND ip.provenance_status = 'verified' AND intel.provenance_status = 'verified'
		AND UPPER(intel.country_code) = ? {region_clause}""",
		(country_code, *region_parameters),
	)
	if not region_code and not region_name:
		account_rows.extend(
			database.query(
				"""SELECT account.id FROM risk_subjects AS account
				JOIN account_projections AS projection
				ON projection.account_id_hash = account.subject_hash
				WHERE account.subject_type = 'account' AND account.provenance_status = 'verified'
				AND UPPER(projection.country_code) = ?""",
				(country_code,),
			)
		)
	return sorted({int(row["id"]) for row in [*ip_rows, *account_rows]})


def _ensure_geo_policy_scores(
	database: Database,
	entities: EntityRiskService,
	policy: dict[str, Any],
	*,
	actor: str,
) -> int:
	country_code = str(policy.get("countryCode") or policy.get("country_code") or "").upper()
	region_code = str(policy.get("regionCode") or policy.get("region_code") or "").upper() or None
	region_name = str(policy.get("region") or "") or None
	label = region_name or region_code or country_code
	reason = str(policy.get("note") or "Geography restriction enabled")
	created = 0
	for subject_id in _geo_policy_subject_ids(
		database,
		country_code=country_code,
		region_code=region_code,
		region_name=region_name,
	):
		_override, added = entities.ensure_geo_policy_floor(
			subject_id,
			int(policy["id"]),
			label=label,
			reason=reason,
			actor=actor,
		)
		created += int(added)
	return created


def _reconcile_geo_policy_scores(
	database: Database,
	entities: EntityRiskService,
	*,
	actor: str = "shield-worker",
) -> int:
	return sum(
		_ensure_geo_policy_scores(database, entities, policy, actor=actor)
		for policy in _active_geo_restrictions(database)
	)


@app.get("/__shield/api/admin/geography/restrictions")
async def admin_geo_restrictions(request: Request, country_code: str = ""):
	await _admin(request)
	db = request.app.state.database
	policies = _active_geo_restrictions(db)
	country_policies: dict[str, dict[str, Any]] = {}
	region_policy_counts: dict[str, int] = {}
	for policy in policies:
		code = str(policy["countryCode"] or "").upper()
		if not policy.get("region") and not policy.get("regionCode"):
			country_policies.setdefault(code, policy)
		else:
			region_policy_counts[code] = region_policy_counts.get(code, 0) + 1
	observations = {
		str(row["countryCode"] or "").upper(): int(row["observations"] or 0)
		for row in db.query(
			"""SELECT country_code AS countryCode, COUNT(*) AS observations
			FROM ip_intel WHERE provenance_status = 'verified' AND country_code <> ''
			GROUP BY country_code"""
		)
	}
	countries = []
	for country in sorted(pycountry.countries, key=lambda item: item.name.casefold()):
		policy = country_policies.get(country.alpha_2)
		regions = pycountry.subdivisions.get(country_code=country.alpha_2) or []
		countries.append(
			{
				"code": country.alpha_2,
				"name": country.name,
				"restricted": bool(policy),
				"policyId": int(policy["id"]) if policy else None,
				"regionCount": len(regions),
				"restrictedRegionCount": region_policy_counts.get(country.alpha_2, 0),
				"observations": observations.get(country.alpha_2, 0),
			}
		)
	requested_code = country_code.strip().upper()
	regions_payload: list[dict[str, Any]] = []
	if requested_code:
		country = pycountry.countries.get(alpha_2=requested_code)
		if not country:
			raise HTTPException(status_code=422, detail="Unknown ISO country code")
		policy_by_code: dict[str, dict[str, Any]] = {}
		policy_by_name: dict[str, dict[str, Any]] = {}
		for policy in policies:
			if str(policy["countryCode"] or "").upper() != requested_code:
				continue
			if policy.get("regionCode"):
				policy_by_code.setdefault(str(policy["regionCode"]).upper(), policy)
			if policy.get("region"):
				policy_by_name.setdefault(str(policy["region"]).casefold(), policy)
		observed_regions: dict[str, int] = {}
		for row in db.query(
			"""SELECT region, region_code AS regionCode, COUNT(*) AS observations
			FROM ip_intel WHERE provenance_status = 'verified' AND country_code = ?
			GROUP BY region, region_code""",
			(requested_code,),
		):
			count = int(row["observations"] or 0)
			if row.get("regionCode"):
				code = str(row["regionCode"]).upper()
				observed_regions[code] = observed_regions.get(code, 0) + count
				observed_regions[f"{requested_code}-{code}"] = observed_regions.get(f"{requested_code}-{code}", 0) + count
			if row.get("region"):
				name = str(row["region"]).casefold()
				observed_regions[name] = observed_regions.get(name, 0) + count
		for subdivision in sorted(
			pycountry.subdivisions.get(country_code=requested_code) or [],
			key=lambda item: item.name.casefold(),
		):
			policy = policy_by_code.get(subdivision.code.upper()) or policy_by_code.get(
				subdivision.code.rsplit("-", 1)[-1].upper()
			) or policy_by_name.get(subdivision.name.casefold())
			regions_payload.append(
				{
					"code": subdivision.code,
					"name": subdivision.name,
					"type": subdivision.type,
					"restricted": bool(policy),
					"policyId": int(policy["id"]) if policy else None,
					"observations": max(
						observed_regions.get(subdivision.code.upper(), 0),
						observed_regions.get(subdivision.code.rsplit("-", 1)[-1].upper(), 0),
						observed_regions.get(subdivision.name.casefold(), 0),
					),
				}
			)
	return {"countries": countries, "regions": regions_payload, "generatedAt": int(time.time())}


@app.put("/__shield/api/admin/geography/restrictions")
async def admin_geo_restriction_update(payload: GeoRestrictionInput, request: Request):
	actor, _ = await _admin(request, csrf=True)
	db = request.app.state.database
	country_code = payload.country_code.strip().upper()
	country = pycountry.countries.get(alpha_2=country_code)
	if not country:
		raise HTTPException(status_code=422, detail="Unknown ISO country code")
	region_code: str | None = None
	region_name: str | None = None
	if payload.region_code:
		region_code = payload.region_code.strip().upper()
		if "-" not in region_code:
			region_code = f"{country_code}-{region_code}"
		subdivision = pycountry.subdivisions.get(code=region_code)
		if not subdivision or subdivision.country_code != country_code:
			raise HTTPException(status_code=422, detail="Unknown ISO subdivision code")
		region_name = subdivision.name
	now = int(time.time())
	if region_code:
		active = db.query(
			"""SELECT id FROM geo_policies WHERE enabled = 1 AND action = 'block'
			AND country_code = ? AND scope_host IS NULL
			AND (UPPER(region_code) = ? OR LOWER(region) = LOWER(?))
			AND (expires_at IS NULL OR expires_at > ?) ORDER BY id DESC""",
			(country_code, region_code, region_name, now),
		)
	else:
		active = db.query(
			"""SELECT id FROM geo_policies WHERE enabled = 1 AND action = 'block'
			AND country_code = ? AND region IS NULL AND region_code IS NULL
			AND scope_host IS NULL AND (expires_at IS NULL OR expires_at > ?) ORDER BY id DESC""",
			(country_code, now),
		)
	policy_id = int(active[0]["id"]) if active else None
	affected_subjects = 0
	restored_subjects = 0
	if payload.restricted and policy_id:
		db.execute(
			"UPDATE geo_policies SET note = ?, updated_at = ? WHERE id = ?",
			(payload.reason, now, policy_id),
		)
	elif payload.restricted:
		policy_id = db.execute(
			"""INSERT INTO geo_policies(country_code, region, region_code, scope_host,
			action, enabled, note, created_at, created_by, updated_at)
			VALUES (?, ?, ?, NULL, 'block', 1, ?, ?, ?, ?)""",
			(country_code, region_name, region_code, payload.reason, now, actor, now),
		)
	elif active:
		ids = [int(row["id"]) for row in active]
		placeholders = ",".join("?" for _ in ids)
		db.execute(
			f"UPDATE geo_policies SET enabled = 0, note = ?, updated_at = ? WHERE id IN ({placeholders})",
			(payload.reason, now, *ids),
		)
		restored_subject_ids = request.app.state.entities.revoke_geo_policy_floors(
			ids,
			actor=actor,
			reason=f"Geography restriction restored: {payload.reason}",
		)
		restored_subject_ids |= request.app.state.entities.revoke_geo_policy_signals(
			ids,
			actor=actor,
			reason=f"Geography restriction restored: {payload.reason}",
		)
		restored_subjects = len(restored_subject_ids)
		_reconcile_entity_bans(db, request.app.state.entities)
	if payload.restricted and policy_id:
		policy = db.query(
			"""SELECT id, country_code AS countryCode, region, region_code AS regionCode, note
			FROM geo_policies WHERE id = ? LIMIT 1""",
			(policy_id,),
		)[0]
		affected_subjects = _ensure_geo_policy_scores(
			db,
			request.app.state.entities,
			policy,
			actor=actor,
		)
	db.audit(
		actor,
		"geo_restriction.update",
		"geo_restriction",
		region_code or country_code,
		{
			"countryCode": country_code,
			"regionCode": region_code,
			"restricted": payload.restricted,
			"reason": payload.reason,
		},
	)
	return {
		"ok": True,
		"countryCode": country_code,
		"regionCode": region_code,
		"restricted": payload.restricted,
		"policyId": policy_id if payload.restricted else None,
		"affectedSubjects": affected_subjects,
		"restoredSubjects": restored_subjects,
	}


@app.put("/__shield/api/admin/accounts/{account_id_hash}/risk")
async def admin_account_risk(account_id_hash: str, payload: AccountRiskInput, request: Request):
	actor, _ = await _admin(request, csrf=True)
	db = request.app.state.database
	projections = db.query("SELECT account_id_hash, account_ref, account_label FROM account_projections WHERE account_id_hash = ?", (account_id_hash,))
	if not projections:
		raise HTTPException(status_code=404, detail="Account projection not found")
	subject = request.app.state.entities.subject_by_hash("account", account_id_hash)
	if not subject and projections[0]["account_ref"]:
		subject = request.app.state.entities.ensure_subject(
			"account", projections[0]["account_ref"], display=projections[0]["account_label"]
		)
	if subject:
		active_adjustments = db.query(
			"""SELECT id FROM risk_overrides WHERE subject_id = ? AND override_type = 'adjustment'
			AND revoked_at IS NULL AND (expires_at IS NULL OR expires_at > ?)""",
			(subject["id"], int(time.time())),
		)
		for adjustment in active_adjustments:
			request.app.state.entities.revoke_override(
				int(adjustment["id"]), actor, "Replaced from account risk control"
			)
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
		if subject:
			request.app.state.entities.add_override(
				int(subject["id"]),
				override_type="adjustment",
				value=payload.delta,
				reason=payload.reason,
				actor=actor,
				duration_seconds=payload.duration_seconds,
			)
	db.audit(actor, "account_risk.adjust", "account", account_id_hash[:12], {"delta": payload.delta, "reason": payload.reason, "durationSeconds": payload.duration_seconds})
	return {"accountId": account_id_hash, **payload.model_dump()}


@app.post("/__shield/api/admin/accounts/{account_id_hash}/response")
async def admin_account_response(account_id_hash: str, payload: AccountResponseInput, request: Request):
	actor, _ = await _admin(request, csrf=True)
	if len(settings.sync_secret) < 32:
		raise HTTPException(status_code=503, detail="Account response integration is not configured")
	db = request.app.state.database
	rows = db.query("SELECT account_ref, account_label FROM account_projections WHERE account_id_hash = ?", (account_id_hash,))
	if not rows or not rows[0]["account_ref"]:
		raise HTTPException(status_code=404, detail="Account response reference is unavailable; synchronize accounts first")
	command_id = uuid.uuid4().hex
	timestamp = str(int(time.time()))
	canonical = f"POST\n/internal/shield/respond\n{timestamp}\n{command_id}\n{payload.action}\n{rows[0]['account_ref']}"
	signature = hmac.new(settings.sync_secret.encode("utf-8"), canonical.encode("utf-8"), hashlib.sha256).hexdigest()
	db.execute("INSERT INTO response_commands(id, account_id_hash, action, reason, status, created_at, created_by) VALUES (?, ?, ?, ?, 'pending', ?, ?)", (command_id, account_id_hash, payload.action, payload.reason, int(time.time()), actor))
	try:
		response = await request.app.state.client.post(
			settings.account_response_url,
			headers={"Host": "api.silentflare.com", "X-SF-Shield-Timestamp": timestamp, "X-SF-Shield-Signature": signature},
			json={"command_id": command_id, "account_id": rows[0]["account_ref"], "action": payload.action, "reason": payload.reason},
		)
		response.raise_for_status()
		db.execute("UPDATE response_commands SET status = 'completed', completed_at = ?, detail = 'accepted' WHERE id = ?", (int(time.time()), command_id))
	except httpx.HTTPError as error:
		db.execute("UPDATE response_commands SET status = 'failed', completed_at = ?, detail = ? WHERE id = ?", (int(time.time()), type(error).__name__, command_id))
		raise HTTPException(status_code=503, detail="Account response service is unavailable") from error
	db.audit(actor, "account_response.execute", "account", account_id_hash[:12], {"commandId": command_id, "action": payload.action, "reason": payload.reason})
	return {"commandId": command_id, "status": "completed", "action": payload.action}


@app.get("/__shield/api/admin/events")
async def admin_events(request: Request, limit: int = 100, minimum_score: int = 0):
	await _admin(request)
	return request.app.state.database.query("SELECT id, created_at, risk_level, risk_score, host, path, method, ip_masked, country_code, asn, ip_type, client_ip_source, geo_source, geo_confidence, matched_rules_json, reasons_json, actions_json, review_status FROM risk_events WHERE risk_score >= ? ORDER BY created_at DESC LIMIT ?", (max(0, minimum_score), min(500, max(1, limit))))


@app.get("/__shield/api/admin/intel")
async def admin_intel(request: Request, limit: int = 200):
	await _admin(request)
	return request.app.state.database.query("SELECT ip_masked, country_code, region, region_code, city, timezone, asn, network_prefix, isp, organization, ip_type, is_vpn, is_proxy, is_tor, is_crawler, is_malicious, risk_score, country_source, region_source, asn_source, country_confidence, region_confidence, asn_confidence, conflict_fields, first_seen_at, last_seen_at FROM ip_intel WHERE provenance_status = 'verified' ORDER BY last_seen_at DESC LIMIT ?", (min(500, max(1, limit)),))


def _root_risk_subject(request: Request, subject_id: int) -> dict[str, Any] | None:
	subject = request.app.state.entities.subject_by_public_id(subject_id)
	if not subject or subject["subject_type"] not in {"account", "ip"}:
		return None
	if subject.get("provenance_status") != "verified":
		return None
	return subject


@app.get("/__shield/api/admin/entities")
async def admin_entities(
	request: Request,
	subject_type: str | None = None,
	minimum_score: int = 0,
	query: str = "",
	limit: int = 100,
):
	await _admin(request)
	allowed_types = {key for key, _label in SUBJECT_TYPE_CATALOG}
	if subject_type and subject_type not in allowed_types:
		raise HTTPException(status_code=422, detail="Unsupported risk subject type")
	items = request.app.state.entities.list_subjects(
		subject_type=subject_type,
		minimum_score=max(0, min(100, minimum_score)),
		query=query[:160],
		limit=limit,
	)
	count_rows = request.app.state.entities.subject_type_statistics()
	counts_by_type = {row["subjectType"]: row for row in count_rows}
	types = []
	for key, label in SUBJECT_TYPE_CATALOG:
		row = counts_by_type.get(key, {})
		types.append(
			{
				"key": key,
				"label": label,
				"total": int(row.get("total") or 0),
				"elevated": int(row.get("elevated") or 0),
				"maximumScore": int(row.get("maximumScore") or 0),
			}
		)
	return {"items": items, "types": types, "counts": count_rows, "generatedAt": int(time.time())}


@app.get("/__shield/api/admin/entities/{subject_id}")
async def admin_entity_detail(subject_id: int, request: Request):
	await _admin(request)
	subject = _root_risk_subject(request, subject_id)
	if not subject:
		raise HTTPException(status_code=404, detail="Risk subject not found")
	detail = request.app.state.entities.detail(subject_id)
	if not detail:
		raise HTTPException(status_code=404, detail="Risk subject not found")
	if subject and subject["subject_type"] == "ip":
		def intelligence_rows():
			return request.app.state.database.query(
			"""SELECT country_code AS countryCode, region, region_code AS regionCode, city,
			latitude, longitude, asn,
			network_prefix AS networkPrefix, country_source AS countrySource,
			region_source AS regionSource, asn_source AS asnSource,
			country_confidence AS countryConfidence, region_confidence AS regionConfidence,
			asn_confidence AS asnConfidence, conflict_fields AS conflictFields,
			last_seen_at AS lastSeenAt FROM ip_intel WHERE ip_hash = ? LIMIT 1""",
			(subject["subject_hash"],),
		)

		rows = intelligence_rows()
		if not rows or rows[0]["latitude"] is None or rows[0]["longitude"] is None:
			await request.app.state.geo.refresh(str(subject["display_value"]), {})
			rows = intelligence_rows()
		if rows:
			rows[0]["conflictFields"] = json.loads(rows[0]["conflictFields"] or "[]")
			country = pycountry.countries.get(alpha_2=str(rows[0]["countryCode"] or "").upper())
			rows[0]["countryName"] = country.name if country else ""
			detail["intelligence"] = rows[0]
	elif subject and subject["subject_type"] == "account":
		rows = request.app.state.database.query(
			"""SELECT account_label AS accountLabel, role, country_code AS countryCode,
			email_verified AS emailVerified, two_factor_enabled AS twoFactorEnabled,
			disabled, active_session_count AS activeSessionCount, comment_count AS commentCount,
			last_seen_at AS lastSeenAt, last_synced_at AS lastSyncedAt
			FROM account_projections WHERE account_id_hash = ? LIMIT 1""",
			(subject["subject_hash"],),
		)
		if rows:
			detail["posture"] = rows[0]
	return detail


@app.get("/__shield/api/admin/entities/{subject_id}/ledger")
async def admin_entity_ledger(subject_id: int, request: Request, before: int | None = None, limit: int = 100):
	await _admin(request)
	if not _root_risk_subject(request, subject_id):
		raise HTTPException(status_code=404, detail="Risk subject not found")
	return request.app.state.entities.ledger_page(subject_id, before=before, limit=limit)


@app.put("/__shield/api/admin/entities/{subject_id}/score")
async def admin_entity_score(subject_id: int, payload: EntityScoreInput, request: Request):
	actor, _ = await _admin(request, csrf=True)
	if not _root_risk_subject(request, subject_id):
		raise HTTPException(status_code=404, detail="Risk subject not found")
	try:
		entry = request.app.state.entities.set_score(
			subject_id,
			payload.score,
			reason=payload.reason,
			actor=actor,
		)
	except ValueError as error:
		raise HTTPException(status_code=422, detail=str(error)) from error
	request.app.state.database.audit(
		actor,
		"risk_subject.score_set",
		"risk_subject",
		str(subject_id),
		{
			"score": payload.score,
			"appliedScore": entry["score_after"],
			"reason": payload.reason,
		},
	)
	return {"ok": True, "entryId": entry["id"], "subject": request.app.state.entities.detail(subject_id)}


@app.post("/__shield/api/admin/entities/{subject_id}/adjust")
async def admin_entity_adjust(subject_id: int, payload: EntityAdjustmentInput, request: Request):
	actor, _ = await _admin(request, csrf=True)
	if not _root_risk_subject(request, subject_id):
		raise HTTPException(status_code=404, detail="Risk subject not found")
	try:
		override = request.app.state.entities.add_override(
			subject_id,
			override_type="adjustment",
			value=payload.delta,
			reason=payload.reason,
			actor=actor,
			duration_seconds=payload.duration_seconds,
		)
	except ValueError as error:
		raise HTTPException(status_code=422, detail=str(error)) from error
	request.app.state.database.audit(
		actor,
		"risk_subject.adjust",
		"risk_subject",
		str(subject_id),
		{"delta": payload.delta, "durationSeconds": payload.duration_seconds, "reason": payload.reason},
	)
	return {"ok": True, "overrideId": override["id"], "subject": request.app.state.entities.detail(subject_id)}


@app.post("/__shield/api/admin/entities/{subject_id}/overrides")
async def admin_entity_override(subject_id: int, payload: EntityOverrideInput, request: Request):
	actor, _ = await _admin(request, csrf=True)
	if not _root_risk_subject(request, subject_id):
		raise HTTPException(status_code=404, detail="Risk subject not found")
	if payload.override_type in {"score_cap", "score_floor"} and payload.value is None:
		raise HTTPException(status_code=422, detail="Score cap and floor require a value")
	if payload.scope_host and payload.scope_host not in settings.upstreams:
		raise HTTPException(status_code=422, detail="Override host is not protected by Shield")
	try:
		override = request.app.state.entities.add_override(
			subject_id,
			override_type=payload.override_type,
			value=payload.value,
			reason=payload.reason,
			actor=actor,
			duration_seconds=payload.duration_seconds,
			scope_host=payload.scope_host,
			scope_path=payload.scope_path,
			scope_rule_id=payload.scope_rule_id,
		)
	except ValueError as error:
		raise HTTPException(status_code=422, detail=str(error)) from error
	request.app.state.database.audit(
		actor,
		"risk_override.create",
		"risk_subject",
		str(subject_id),
		{"overrideType": payload.override_type, "value": payload.value, "durationSeconds": payload.duration_seconds},
	)
	if payload.override_type == "score_cap" and payload.value == 0 and payload.duration_seconds is None:
		_reconcile_entity_bans(request.app.state.database, request.app.state.entities)
	return {"ok": True, "overrideId": override["id"], "subject": request.app.state.entities.detail(subject_id)}


@app.post("/__shield/api/admin/overrides/{override_id}/revoke")
async def admin_override_revoke(override_id: int, payload: OverrideRevokeInput, request: Request):
	actor, _ = await _admin(request, csrf=True)
	try:
		override = request.app.state.entities.revoke_override(override_id, actor, payload.reason)
	except ValueError as error:
		raise HTTPException(status_code=404, detail=str(error)) from error
	request.app.state.database.audit(
		actor,
		"risk_override.revoke",
		"risk_override",
		str(override_id),
		{"reason": payload.reason},
	)
	return {"ok": True, "subject": request.app.state.entities.detail(int(override["subject_id"]))}


@app.get("/__shield/api/admin/risk-codes")
async def admin_risk_codes(request: Request):
	await _admin(request)
	return {
		"codes": {
			"101": "Account", "102": "Session", "103": "Device", "104": "Email",
			"201": "IP", "202": "CIDR", "203": "ASN", "204": "Geography",
			"301": "Login or registration", "302": "Comment or content", "303": "API rate",
			"304": "Scanning", "401": "Automation", "402": "Threat intelligence",
			"403": "Rule decision", "404": "Combined risk", "501": "Protected administration",
		}
	}


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
		"versions": db.query("SELECT version, created_at AS createdAt, created_by AS createdBy, note FROM risk_config_versions ORDER BY version DESC LIMIT 20"),
	}


def _validated_risk_model(payload: RiskModelInput) -> tuple[dict[str, int], dict[str, int]]:
	if set(payload.weights) != set(DEFAULT_WEIGHTS):
		raise HTTPException(status_code=422, detail="Every risk weight is required")
	if set(payload.thresholds) != set(DEFAULT_THRESHOLDS):
		raise HTTPException(status_code=422, detail="Every risk threshold is required")
	weights = {key: int(value) for key, value in payload.weights.items()}
	thresholds = {key: int(value) for key, value in payload.thresholds.items()}
	if any(value < -100 or value > 100 for value in weights.values()):
		raise HTTPException(status_code=422, detail="Weights must be between -100 and 100")
	ordered = [thresholds[name] for name in ("observe", "verify", "restrict", "block")]
	if ordered != sorted(ordered) or len(set(ordered)) != 4 or ordered[0] < 1 or ordered[-1] > 100:
		raise HTTPException(status_code=422, detail="Thresholds must be strictly increasing between 1 and 100")
	return weights, thresholds


def _risk_model_simulation(database: Database, weights: dict[str, int], thresholds: dict[str, int]) -> dict[str, Any]:
	rows = database.query("SELECT risk_score, reasons_json FROM risk_events ORDER BY created_at DESC LIMIT 1000")
	current_weights = DEFAULT_WEIGHTS | database.setting("risk_weights", {})
	reason_signals = {
		"VPN network": "vpn",
		"Proxy network": "proxy",
		"Tor exit node": "tor",
		"Data center network": "datacenter",
		"Known malicious IP": "malicious_ip",
		"Automation browser signature": "automation",
		"Expected browser headers missing": "missing_headers",
		"Rate policy exceeded": "rate_exceeded",
		"Matched deny list": "deny_list",
		"Matched allow list": "allow_list",
	}
	bands = {"normal": 0, "observe": 0, "verify": 0, "restrict": 0, "block": 0}
	projected_total = 0
	for row in rows:
		score = int(row["risk_score"])
		try:
			reasons = json.loads(row["reasons_json"] or "[]")
		except json.JSONDecodeError:
			reasons = []
		for reason in reasons:
			signal = reason_signals.get(str(reason))
			if signal:
				score += int(weights[signal]) - int(current_weights[signal])
		score = max(0, min(100, score))
		projected_total += score
		level = "normal" if score < thresholds["observe"] else "observe" if score < thresholds["verify"] else "verify" if score < thresholds["restrict"] else "restrict" if score < thresholds["block"] else "block"
		bands[level] += 1
	block_rate = bands["block"] / len(rows) if rows else 0
	return {
		"sampleSize": len(rows),
		"bands": bands,
		"blockRate": block_rate,
		"projectedAverage": round(projected_total / len(rows), 1) if rows else 0,
		"safeToPublish": len(rows) < 20 or block_rate <= 0.8,
	}


@app.post("/__shield/api/admin/settings/risk/simulate")
async def simulate_risk_settings(payload: RiskModelInput, request: Request):
	await _admin(request)
	weights, thresholds = _validated_risk_model(payload)
	return _risk_model_simulation(request.app.state.database, weights, thresholds)


@app.put("/__shield/api/admin/settings/risk")
async def update_risk_settings(payload: RiskModelInput, request: Request):
	actor, _ = await _admin(request, csrf=True)
	db = request.app.state.database
	weights, thresholds = _validated_risk_model(payload)
	simulation = _risk_model_simulation(db, weights, thresholds)
	if not simulation["safeToPublish"]:
		raise HTTPException(status_code=422, detail="Simulation rejected a model that would block more than 80% of sampled traffic")
	latest = db.query("SELECT COALESCE(MAX(version), 0) AS value FROM risk_config_versions")[0]["value"]
	version = int(latest) + 1
	db.set_setting("risk_weights", weights, actor)
	db.set_setting("risk_thresholds", thresholds, actor)
	db.execute("INSERT INTO risk_config_versions(version, weights_json, thresholds_json, created_at, created_by, note) VALUES (?, ?, ?, ?, ?, ?)", (version, json.dumps(weights, separators=(",", ":")), json.dumps(thresholds, separators=(",", ":")), int(time.time()), actor, payload.note))
	db.audit(actor, "risk_settings.update", "system", "risk", {"weights": weights, "thresholds": thresholds})
	return {"weights": weights, "thresholds": thresholds, "version": version, "simulation": simulation}


@app.post("/__shield/api/admin/settings/risk/rollback/{version}")
async def rollback_risk_settings(version: int, request: Request):
	actor, _ = await _admin(request, csrf=True)
	db = request.app.state.database
	rows = db.query("SELECT weights_json, thresholds_json FROM risk_config_versions WHERE version = ?", (version,))
	if not rows:
		raise HTTPException(status_code=404, detail="Risk model version not found")
	weights, thresholds = json.loads(rows[0]["weights_json"]), json.loads(rows[0]["thresholds_json"])
	db.set_setting("risk_weights", weights, actor)
	db.set_setting("risk_thresholds", thresholds, actor)
	db.audit(actor, "risk_settings.rollback", "system", "risk", {"version": version})
	return {"weights": weights, "thresholds": thresholds, "version": version}


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
	return request.app.state.database.query("SELECT id, public_id, subject_type, subject_display, restriction, reason, created_by, created_at, expires_at, revoked_at, revoked_by, revoke_reason FROM bans ORDER BY id DESC LIMIT 500")


@app.post("/__shield/api/admin/bans")
async def create_ban(payload: BanInput, request: Request):
	actor, _ = await _admin(request, csrf=True)
	now = int(time.time())
	try:
		normalized = normalize_ban_subject(payload.subject_type, payload.subject_value)
	except ValueError as error:
		raise HTTPException(status_code=422, detail=str(error)) from None
	public_id = new_public_ban_id()
	subject_hash = stable_hash(normalized, settings.internal_signing_key)
	display = ban_subject_display(payload.subject_type, normalized)
	id_value = request.app.state.database.execute("INSERT INTO bans(public_id, subject_type, subject_hash, subject_display, restriction, reason, created_by, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", (public_id, payload.subject_type, subject_hash, display, payload.restriction, payload.reason, actor, now, payload.expires_at))
	request.app.state.database.audit(actor, "ban.create", "ban", str(id_value), {"subjectType": payload.subject_type, "restriction": payload.restriction, "reason": payload.reason})
	return {"id": id_value, "publicId": public_id}


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


@app.put("/__shield/api/admin/alerts/config")
async def update_alert_config(payload: AlertConfigInput, request: Request):
	actor, _ = await _admin(request, csrf=True)
	now = int(time.time())
	request.app.state.database.execute(
		"""UPDATE alert_config SET enabled = ?, minimum_score = ?, high_risk_per_5m = ?,
		blocked_per_5m = ?, daily_report_hour = ?, updated_at = ?, updated_by = ? WHERE id = 1""",
		(int(payload.enabled), payload.minimum_score, payload.high_risk_per_5m, payload.blocked_per_5m, payload.daily_report_hour, now, actor),
	)
	request.app.state.database.audit(actor, "alert_config.update", "system", "alerts", payload.model_dump())
	return payload.model_dump()


@app.post("/__shield/api/admin/alerts/test")
async def test_alert(request: Request):
	actor, _ = await _admin(request, csrf=True)
	alert_id = request.app.state.database.execute("INSERT INTO alert_events(created_at, kind, severity, title, detail) VALUES (?, 'test', 'info', 'Shield alert test', 'Created from SilentFlare Admin')", (int(time.time()),))
	request.app.state.database.audit(actor, "alert.test", "alert", str(alert_id), {})
	await _deliver_alerts(request.app)
	return {"id": alert_id, "queued": True, "webhookConfigured": bool(settings.alert_webhook_url)}


@app.post("/__shield/api/admin/alerts/{alert_id}/dismiss")
async def dismiss_alert(alert_id: int, request: Request):
	actor, _ = await _admin(request, csrf=True)
	request.app.state.database.execute("UPDATE alert_events SET status = 'dismissed' WHERE id = ?", (alert_id,))
	request.app.state.database.audit(actor, "alert.dismiss", "alert", str(alert_id), {})
	return {"dismissed": True}


@app.get("/__shield/api/admin/reports/daily")
async def admin_daily_report(request: Request):
	await _admin(request)
	return _daily_report(request.app.state.database)


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
	signal_ref = f"challenge:{stable_hash(token, settings.internal_signing_key)[:20]}"
	weights = DEFAULT_WEIGHTS | request.app.state.database.setting("risk_weights", {})
	factor_key = "challenge_passed" if result.get("success") else "challenge_failed"
	ip_value = _client_ip(request)
	session_token = request.cookies.get("sf_account_session", "")
	account_ref = await _resolve_account(request.app, session_token)
	root_subjects = [request.app.state.entities.ensure_subject("ip", ip_value, display=mask_ip(ip_value))]
	if account_ref:
		account = request.app.state.entities.ensure_subject("account", account_ref)
		root_subjects.append(account)
		request.app.state.entities.relate_account_ip(int(account["id"]), int(root_subjects[0]["id"]))
	for evidence_type, value, display in (
		("device", _device_id(request, ip_value), "Correlated device"),
		("session", session_token, "Correlated session"),
	):
		if value:
			for subject in root_subjects:
				request.app.state.entities.observe_evidence(
					int(subject["id"]), evidence_type, value, display=display,
					metadata={"source": "challenge"},
				)
	for index, subject in enumerate(root_subjects):
		delta = int(round(weights[factor_key] * (1 if index == 0 else 0.65)))
		if delta == 0:
			continue
		request.app.state.entities.enqueue_signal(
			int(subject["id"]),
			delta=delta,
			reason_code="CHALLENGE_PASSED" if result.get("success") else "CHALLENGE_FAILED",
			reason="Successfully completed security challenge" if result.get("success") else "Security challenge verification failed",
			source_ref=signal_ref,
			duration_seconds=86400 if result.get("success") else 43200,
			decay_steps=1 if result.get("success") else 4,
		)
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


def _is_public_portal(request: Request) -> bool:
	return _host(request) == (urlparse(settings.public_url).hostname or "")


@app.api_route("/", methods=["GET", "HEAD"], include_in_schema=False)
async def public_portal_home(request: Request):
	if not _is_public_portal(request):
		return await gateway("", request)
	return _render_block_portal(request, generic=True)


@app.api_route("/blocked", methods=["GET", "HEAD"], include_in_schema=False)
async def public_block_case(request: Request):
	if not _is_public_portal(request):
		return await gateway("blocked", request)
	return _render_block_portal(request)


@app.api_route("/assets/{filename}", methods=["GET", "HEAD"], include_in_schema=False)
async def public_portal_asset(filename: str, request: Request):
	if not _is_public_portal(request):
		return await gateway(f"assets/{filename}", request)
	if filename not in {"blocked.css", "shield-mark.png"}:
		raise HTTPException(status_code=404)
	return FileResponse(
		STATIC_ROOT / filename,
		headers={
			"Cache-Control": "public, max-age=86400, immutable",
			"X-Content-Type-Options": "nosniff",
		},
	)


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
		identity = _client_identity(request)
		ip = identity.ip
		if mode == "bypass":
			context = RequestContext(
				request_id,
				host,
				request.url.path,
				request.method,
				ip,
				extra={"client_ip_source": identity.source, "geo_source": "bypass", "geo_confidence": "unknown"},
			)
			return await _proxy(request, body, upstream, context, RiskResult(0, "normal", []), "bypass")
		headers = {name.lower(): value for name, value in request.headers.items()}
		if not _cloudflare_edge(request):
			headers = {name: value for name, value in headers.items() if not name.startswith("cf-")}
		intel, geo_source = await request.app.state.geo.lookup(ip, headers)
		session_token = request.cookies.get("sf_account_session", "")
		context = RequestContext(
			request_id=request_id,
			host=host,
			path=request.url.path,
			method=request.method,
			ip=ip,
			country=intel.country_code,
			region=intel.region,
			region_code=intel.region_code,
			asn=intel.asn,
			ip_type=intel.ip_type,
			session_id=session_token,
			device_id=_device_id(request, ip),
			email=_email_from_body(body, request.headers.get("content-type", "")),
			api_key=_api_key(request),
			user_agent=request.headers.get("user-agent", ""),
			extra={
				"client_ip_source": identity.source,
				"geo_source": geo_source,
				"geo_confidence": intel.country_confidence,
			},
		)
		context.account_id = await _resolve_account(request.app, session_token)
		list_status, list_match = request.app.state.access.match(context)
		ban = request.app.state.access.active_ban(context)
		rates = request.app.state.limiter.check(context)
		context.rate_exceeded = bool(rates)
		weights = request.app.state.database.setting("risk_weights", {})
		thresholds = request.app.state.database.setting("risk_thresholds", {})
		risk = score_request(intel, headers, weights, thresholds, list_status, bool(rates))
		request_risk = RiskResult(risk.score, risk.level, list(risk.reasons))
		entity_subjects = _apply_entity_score(request.app.state.entities, context, risk, weights)
		context.risk_score = risk.score
		rule_decision = request.app.state.rules.evaluate(context, mode)
		matched_rule_ids = [int(item["id"]) for item in rule_decision.matched_rules]
		rule_exempt = bool(
			matched_rule_ids
			and host not in {"admin.silentflare.com", "cms.silentflare.com"}
			and any(
				request.app.state.entities.matching_rule_exemption(
					int(subject["id"]), matched_rule_ids, context.host, context.path
				)
				for subject in entity_subjects.values()
			)
		)
		if rule_exempt:
			rule_decision.actions = ["log"]
			risk.reasons.append("Administrator rule exemption")
		geo_action, geo_reason = _geo_policy_action(request.app.state.database, context)
		_apply_geo_policy_risk(context, risk, geo_reason)
		binding = stable_hash(f"{ip}|{request.headers.get('user-agent', '')}", settings.internal_signing_key)
		challenge = read_token(request.cookies.get("sf_shield_challenge", ""), settings.internal_signing_key)
		challenge_passed = bool(challenge and challenge.get("purpose") == "challenge" and hmac.compare_digest(str(challenge.get("binding", "")), binding))
		clearance = read_token(request.cookies.get("sf_shield_clearance", ""), settings.internal_signing_key)
		clearance_passed = bool(
			clearance
			and clearance.get("purpose") == "clearance"
			and clearance.get("host") == host
			and clearance.get("path") == request.url.path
		)
		challenge_passed = challenge_passed or clearance_passed
		actions = _actions(
			mode,
			_enforcement_risk(context, request_risk, risk),
			list_status,
			ban,
			rates,
			rule_decision,
			challenge_passed,
			[geo_action] if geo_action else [],
		)
		actions = _apply_permanent_allowlist(context, risk, actions)
		response_exempt = any(
			request.app.state.entities.active_override(
				int(subject["id"]), "response_exemption", context.host, context.path
			)
			for subject in entity_subjects.values()
		)
		if response_exempt and not ban and list_status != "deny" and host not in {"admin.silentflare.com", "cms.silentflare.com"}:
			actions = ["allow"]
			risk.reasons.append("Administrator response exemption")
		_event(request.app.state.database, context, risk, rule_decision, actions, request, body)
		_record_entity_signals(
			request.app.state.entities,
			context,
			risk,
			rates,
			rule_decision,
			entity_subjects,
			weights,
			list_match,
		)
		if "temporary_ban" in actions and mode == "enforce":
			_automatic_ban(request.app.state.database, context, rates)
			ban = request.app.state.access.active_ban(context)
		if "delay" in actions:
			await asyncio.sleep(1)
		if "block" in actions or "temporary_ban" in actions:
			error_code = _block_error_code(ban, list_status, geo_reason, rule_decision, risk, actions)
			return _blocked_response(request, request_id, host, error_code, ban, context)
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
