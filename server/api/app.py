from __future__ import annotations

import json
import base64
import binascii
import hashlib
import hmac
import ipaddress
import os
import secrets
import sqlite3
import struct
import subprocess
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.error import HTTPError
from urllib.parse import quote, unquote, urlencode, urlparse
from urllib.request import Request as UrlRequest, urlopen
from zoneinfo import ZoneInfo

from fastapi import FastAPI, Header, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

APP_NAME = "SilentFlare Bot API"
TELEGRAM_OWNER_ID = int(os.getenv("TELEGRAM_OWNER_ID", "8737100423"))
BACKUP_SCRIPT = Path(
	os.getenv("BACKUP_SCRIPT", "/opt/silentflare/deploy/ghost-db-backup.sh")
)
BACKUP_DIR = Path(os.getenv("BACKUP_DIR", "/opt/silentflare/backups/ghost-db"))
BACKUP_ENV_FILE = Path(
	os.getenv("BACKUP_ENV_FILE", "/opt/silentflare/deploy/ghost-db-backup.env")
)
BACKUP_TIMER_NAME = "silentflare-ghost-db-backup.timer"
BACKUP_TIMER_OVERRIDE = Path(
	os.getenv(
		"BACKUP_TIMER_OVERRIDE",
		f"/etc/systemd/system/{BACKUP_TIMER_NAME}.d/override.conf",
	)
)
CHAT_BOT_WEB_URL = os.getenv("CHAT_BOT_WEB_URL", "https://tg.silentflare.com").rstrip("/")
CHAT_BOT_APP_DIR = os.getenv("CHAT_BOT_APP_DIR", "/root/messages_helper_bot")
CHAT_BOT_ENV_FILE = os.getenv("CHAT_BOT_ENV_FILE", f"{CHAT_BOT_APP_DIR}/.env")
CHAT_BOT_WEB_SERVICE = os.getenv("CHAT_BOT_WEB_SERVICE", "messages-helper-web")
CHAT_BOT_BOT_SERVICE = os.getenv("CHAT_BOT_BOT_SERVICE", "messages-helper-bot")
CHAT_BOT_CONTROL_MODE = os.getenv("CHAT_BOT_CONTROL_MODE", "disabled")
CHAT_BOT_SSH_TARGET = os.getenv("CHAT_BOT_SSH_TARGET", "")
CHAT_BOT_SSH_KEY = os.getenv("CHAT_BOT_SSH_KEY", "")
ADMIN_TOKEN = os.getenv("API_ADMIN_TOKEN", "")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")
TELEGRAM_WEBHOOK_SECRET = os.getenv("TELEGRAM_WEBHOOK_SECRET", "")
DB_BACKUP_TELEGRAM_BOT_TOKEN = os.getenv(
	"SILENTFLARE_DB_BACKUP_TELEGRAM_BOT_TOKEN",
	TELEGRAM_BOT_TOKEN,
)
DB_BACKUP_TELEGRAM_CHAT_ID = os.getenv(
	"SILENTFLARE_DB_BACKUP_TELEGRAM_CHAT_ID",
	TELEGRAM_CHAT_ID,
)
DB_BACKUP_TELEGRAM_WEBHOOK_SECRET = os.getenv(
	"SILENTFLARE_DB_BACKUP_TELEGRAM_WEBHOOK_SECRET",
	TELEGRAM_WEBHOOK_SECRET,
)
DB_BACKUP_TELEGRAM_OWNER_ID = int(
	os.getenv("SILENTFLARE_DB_BACKUP_TELEGRAM_OWNER_ID", str(TELEGRAM_OWNER_ID))
)
CHAT_BOT_TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_CHAT_BOT_TOKEN", "")
CHAT_BOT_TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_BOT_CHAT_ID", "")
CHAT_BOT_TELEGRAM_WEBHOOK_SECRET = os.getenv("TELEGRAM_CHAT_BOT_WEBHOOK_SECRET", "")
CHAT_BOT_TELEGRAM_OWNER_ID = int(
	os.getenv("TELEGRAM_CHAT_BOT_OWNER_ID", str(TELEGRAM_OWNER_ID))
)
API_ENV_FILE = Path(os.getenv("API_ENV_FILE", "/opt/silentflare/api/api.env"))
CONSOLE_AUTH_ID = "console"
CONSOLE_TOTP_SECRET = os.getenv("BOT_CONSOLE_TOTP_SECRET", os.getenv("WEB_TOTP_SECRET", ""))
WEB_SESSION_TTL = int(os.getenv("WEB_SESSION_TTL", "43200"))
WEB_COOKIE_SECURE = os.getenv("WEB_COOKIE_SECURE", "1") != "0"
WEB_LOGIN_ATTEMPTS = int(os.getenv("WEB_LOGIN_ATTEMPTS", "5"))
WEB_LOGIN_WINDOW_SECONDS = int(os.getenv("WEB_LOGIN_WINDOW_SECONDS", "900"))
WEB_LOGIN_SESSION_EPOCH = os.getenv("WEB_LOGIN_SESSION_EPOCH", "")
SESSION_COOKIE = "sf_bot_session"
ACCOUNT_SESSION_COOKIE = os.getenv("ACCOUNT_SESSION_COOKIE_NAME", "sf_account_session")
ACCOUNT_SESSION_SECRET = os.getenv("SESSION_SECRET") or os.getenv("ACCOUNT_SESSION_SECRET", "")
ACCOUNT_COOKIE_DOMAIN = os.getenv("ACCOUNT_COOKIE_DOMAIN", "")
ACCOUNT_DB_PATH = Path(os.getenv("ACCOUNT_DB_PATH", "/opt/silentflare/api/account.db"))
ACCOUNT_AVATAR_DIR = Path(
	os.getenv("ACCOUNT_AVATAR_DIR", "/opt/silentflare/api/uploads/avatars")
)
ACCOUNT_AVATAR_PUBLIC_BASE = os.getenv(
	"ACCOUNT_AVATAR_PUBLIC_BASE", "https://api.silentflare.com/account-avatars"
).rstrip("/")
ACCOUNT_AVATAR_MAX_BYTES = int(os.getenv("ACCOUNT_AVATAR_MAX_BYTES", str(2 * 1024 * 1024)))
IP_GEOLOCATION_URL_TEMPLATE = os.getenv(
	"IP_GEOLOCATION_URL_TEMPLATE", "https://ipwho.is/{ip}"
)
IP_GEO_CACHE_TTL = int(os.getenv("IP_GEO_CACHE_TTL", "86400"))
LOGIN_CHALLENGE_TTL = 5 * 60
PBKDF2_PREFIX = "pbkdf2_sha256"
ACCOUNT_PBKDF2_PREFIX = "pbkdf2-sha256"
ACCOUNT_PBKDF2_ITERATIONS = int(os.getenv("ACCOUNT_PBKDF2_ITERATIONS", "600000"))
ACCOUNT_SESSION_TTL = int(os.getenv("ACCOUNT_SESSION_TTL", "2592000"))
TURNSTILE_SECRET_KEY = os.getenv("TURNSTILE_SECRET_KEY", "")
TURNSTILE_EXPECTED_HOSTNAME = os.getenv("TURNSTILE_EXPECTED_HOSTNAME", "")
TURNSTILE_EXPECTED_HOSTNAMES = os.getenv("TURNSTILE_EXPECTED_HOSTNAMES", "")
AUTH_EMAIL_API_KEY = os.getenv("AUTH_EMAIL_API_KEY", "")
AUTH_EMAIL_FROM = os.getenv("AUTH_EMAIL_FROM", "")
AUTH_EMAIL_API_URL = os.getenv("AUTH_EMAIL_API_URL", "https://api.resend.com/emails")
AUTH_TOS_VERSION = os.getenv("AUTH_TOS_VERSION", "2026-06-28")
AUTH_EMAIL_CODE_TTL = int(os.getenv("AUTH_EMAIL_CODE_TTL", "600"))
AUTH_EMAIL_SEND_COOLDOWN = int(os.getenv("AUTH_EMAIL_SEND_COOLDOWN", "60"))
AUTH_EMAIL_SEND_LIMIT = int(os.getenv("AUTH_EMAIL_SEND_LIMIT", "5"))
AUTH_CODE_ATTEMPT_LIMIT = int(os.getenv("AUTH_CODE_ATTEMPT_LIMIT", "5"))
AUTH_FLOW_TTL = int(os.getenv("AUTH_FLOW_TTL", "1200"))
IP_GEO_CACHE: dict[str, dict[str, Any]] = {}

app = FastAPI(title=APP_NAME)
app.add_middleware(
	CORSMiddleware,
	allow_origins=[
		"https://blog.silentflare.com",
		"https://admin.silentflare.com",
		"https://accounts.silentflare.com",
		"https://tgbot.silentflare.com",
		"https://tgbotmanagement.silentflare.com",
		"http://blog.silentflare.com",
		"http://admin.silentflare.com",
		"http://accounts.silentflare.com",
		"http://tgbot.silentflare.com",
		"http://tgbotmanagement.silentflare.com",
		"https://auth.silentflare.com",
		"http://auth.silentflare.com",
	],
	allow_credentials=True,
	allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
	allow_headers=["Content-Type", "X-Admin-Token", "X-CSRF-Token"],
)

BACKUP_BOT_ID = "SilentFlare DB Backup"
BACKUP_BOT_ALIASES = {"ghost-db-backup", "silentflare-db-backup"}
BACKUP_BOT_DESCRIPTION = (
	"Complete all-database backup that remains valid across schema changes."
)
CHAT_BOT_ID = "Telegram Chat Bot"
ADMIN_AUTH_ID = "SilentFlare Admin"
ADMIN_AUTH_BOT = {
	"id": ADMIN_AUTH_ID,
	"name": "SilentFlare Admin",
	"purpose": "Owner console for public users and comments.",
	"status": "active",
	"auth_method": "telegram",
}

BOTS = [
	{
		"id": BACKUP_BOT_ID,
		"name": "SilentFlare DB Backup",
		"purpose": BACKUP_BOT_DESCRIPTION,
		"status": "active",
		"auth_method": os.getenv(
			"SILENTFLARE_DB_BACKUP_AUTH_METHOD",
			os.getenv("GHOST_DB_BACKUP_AUTH_METHOD", "telegram"),
		),
	},
]
AUTH_TARGETS = [*BOTS, ADMIN_AUTH_BOT]

SESSIONS: dict[str, dict[str, Any]] = {}
LOGIN_CHALLENGES: dict[str, dict[str, Any]] = {}
LOGIN_FAILURES: dict[str, list[float]] = {}


class LoginPayload(BaseModel):
	method: str
	code: str
	bot_id: str | None = None


class TelegramStartPayload(BaseModel):
	bot_id: str | None = None


class TelegramCancelPayload(BaseModel):
	challenge_id: str
	bot_id: str | None = None


class ChatStatePayload(BaseModel):
	selected: int | None = None


class ChatReadPayload(BaseModel):
	user_id: int


class ChatSendPayload(BaseModel):
	user_id: int
	text: str


class ChatActionPayload(BaseModel):
	user_id: int
	action: str
	minutes: int | None = None


class ChatCommandPayload(BaseModel):
	user_id: int | None = None
	text: str


class ChatNotificationPayload(BaseModel):
	enabled: bool


class TotpEnablePayload(BaseModel):
	secret: str
	code: str


class BackupSchedulePayload(BaseModel):
	interval_hours: int


class UserRolePayload(BaseModel):
	role: str


class AccountRegisterPayload(BaseModel):
	email: str
	username: str
	password: str
	turnstileToken: str | None = None


class AccountLoginPayload(BaseModel):
	email: str
	password: str
	turnstileToken: str | None = None


class AccountProfilePayload(BaseModel):
	display_name: str | None = None
	avatar_url: str | None = None
	bio: str | None = None


class UnifiedLoginPasswordPayload(BaseModel):
	email_or_username: str = ""
	password: str = ""
	turnstile_token: str = ""
	return_url: str = ""


class EmailCodeRequestPayload(BaseModel):
	email: str = ""
	turnstile_token: str = ""


class EmailCodeVerifyPayload(BaseModel):
	email: str = ""
	code: str = ""
	return_url: str = ""


class TwoFAVerifyPayload(BaseModel):
	pending_id: str = ""
	code: str = ""


class RegisterEmailRequestPayload(BaseModel):
	email: str = ""
	turnstile_token: str = ""


class RegisterEmailVerifyPayload(BaseModel):
	email: str = ""
	code: str = ""


class RegisterCompletePayload(BaseModel):
	reg_token: str = ""
	username: str = ""
	password: str | None = None
	tos_accepted: bool = False
	tos_version: str = ""
	display_name: str = ""
	display_region: str = ""


class TwoFASetupVerifyPayload(BaseModel):
	code: str = ""
	setup_token: str = ""


class RegistrationTwoFAPayload(BaseModel):
	onboarding_token: str = ""
	code: str = ""
	setup_token: str = ""


class UnifiedProfilePayload(BaseModel):
	display_name: str = ""
	avatar_url: str = ""
	bio: str = ""
	display_region: str = ""


class SessionRefreshPayload(BaseModel):
	return_url: str = ""


class CommentCreatePayload(BaseModel):
	postSlug: str
	content: str
	turnstileToken: str | None = None


def cleanup_sessions() -> None:
	now = time.time()
	expired = [
		session_id
		for session_id, session in SESSIONS.items()
		if session["expires_at"] <= now
		or session.get("login_epoch") != WEB_LOGIN_SESSION_EPOCH
	]
	for session_id in expired:
		SESSIONS.pop(session_id, None)
	expired_challenges = [
		challenge_id
		for challenge_id, challenge in LOGIN_CHALLENGES.items()
		if challenge["expires_at"] <= now
	]
	for challenge_id in expired_challenges:
		LOGIN_CHALLENGES.pop(challenge_id, None)


def create_session(response: Response, bot_id: str) -> dict[str, str]:
	cleanup_sessions()
	session_id = secrets.token_urlsafe(32)
	csrf = secrets.token_urlsafe(32)
	SESSIONS[session_id] = {
		"bot_id": bot_id,
		"csrf": csrf,
		"expires_at": time.time() + WEB_SESSION_TTL,
		"login_epoch": WEB_LOGIN_SESSION_EPOCH,
	}
	response.set_cookie(
		SESSION_COOKIE,
		session_id,
		httponly=True,
		secure=WEB_COOKIE_SECURE,
		samesite="none" if WEB_COOKIE_SECURE else "lax",
		max_age=WEB_SESSION_TTL,
		path="/",
	)
	return {"bot_id": bot_id, "csrf": csrf}


def normalize_bot_id(bot_id: str) -> str:
	normalized = bot_id.strip()
	if normalized == BACKUP_BOT_ID or normalized in BACKUP_BOT_ALIASES:
		return BACKUP_BOT_ID
	return normalized


def destroy_session(request: Request, response: Response) -> None:
	session_id = request.cookies.get(SESSION_COOKIE, "")
	if session_id:
		SESSIONS.pop(session_id, None)
	response.delete_cookie(
		SESSION_COOKIE,
		secure=WEB_COOKIE_SECURE,
		samesite="none" if WEB_COOKIE_SECURE else "lax",
		path="/",
	)


def get_session(request: Request) -> dict[str, Any]:
	cleanup_sessions()
	session_id = request.cookies.get(SESSION_COOKIE, "")
	session = SESSIONS.get(session_id)
	if not session:
		raise HTTPException(status_code=401, detail="Login required")
	session["expires_at"] = time.time() + WEB_SESSION_TTL
	return session


def require_session(
	request: Request,
	bot_id: str | None = None,
	x_csrf_token: str | None = None,
	require_csrf: bool = False,
) -> dict[str, Any]:
	session = get_session(request)
	if bot_id is not None and session.get("bot_id") != normalize_bot_id(bot_id):
		raise HTTPException(status_code=403, detail="Session is not authorized for this bot")
	if require_csrf and (
		not x_csrf_token or not hmac.compare_digest(x_csrf_token, session["csrf"])
	):
		raise HTTPException(status_code=403, detail="Invalid CSRF token")
	return session


def client_key(request: Request) -> str:
	forwarded = request.headers.get("x-forwarded-for", "")
	if forwarded:
		return forwarded.split(",", 1)[0].strip()
	return request.client.host if request.client else "unknown"


def check_login_rate_limit(request: Request) -> None:
	now = time.time()
	key = client_key(request)
	failures = [
		item
		for item in LOGIN_FAILURES.get(key, [])
		if now - item < WEB_LOGIN_WINDOW_SECONDS
	]
	LOGIN_FAILURES[key] = failures
	if len(failures) >= WEB_LOGIN_ATTEMPTS:
		raise HTTPException(status_code=429, detail="Too many login attempts")


def record_login_failure(request: Request) -> None:
	key = client_key(request)
	LOGIN_FAILURES.setdefault(key, []).append(time.time())


def public_bot(bot: dict[str, str]) -> dict[str, str]:
	return {
		"id": bot["id"],
		"name": bot["name"],
		"purpose": bot["purpose"],
		"status": bot["status"],
		"auth_method": bot["auth_method"],
	}


def is_admin_auth_id(bot_id: str) -> bool:
	return normalize_bot_id(bot_id) == ADMIN_AUTH_ID


def telegram_auth_config(bot_id: str) -> dict[str, Any]:
	normalized = normalize_bot_id(bot_id)
	if normalized == ADMIN_AUTH_ID:
		return {
			"bot_id": ADMIN_AUTH_ID,
			"token": DB_BACKUP_TELEGRAM_BOT_TOKEN,
			"chat_id": DB_BACKUP_TELEGRAM_CHAT_ID,
			"webhook_secret": DB_BACKUP_TELEGRAM_WEBHOOK_SECRET,
			"owner_id": DB_BACKUP_TELEGRAM_OWNER_ID,
		}
	if normalized == BACKUP_BOT_ID:
		return {
			"bot_id": BACKUP_BOT_ID,
			"token": DB_BACKUP_TELEGRAM_BOT_TOKEN,
			"chat_id": DB_BACKUP_TELEGRAM_CHAT_ID,
			"webhook_secret": DB_BACKUP_TELEGRAM_WEBHOOK_SECRET,
			"owner_id": DB_BACKUP_TELEGRAM_OWNER_ID,
		}
	if normalized == CHAT_BOT_ID:
		return {
			"bot_id": CHAT_BOT_ID,
			"token": CHAT_BOT_TELEGRAM_BOT_TOKEN,
			"chat_id": CHAT_BOT_TELEGRAM_CHAT_ID,
			"webhook_secret": CHAT_BOT_TELEGRAM_WEBHOOK_SECRET,
			"owner_id": CHAT_BOT_TELEGRAM_OWNER_ID,
		}
	return {
		"bot_id": normalized,
		"token": "",
		"chat_id": "",
		"webhook_secret": "",
		"owner_id": TELEGRAM_OWNER_ID,
	}


def telegram_config_from_webhook_token(token: str) -> dict[str, Any] | None:
	for bot in AUTH_TARGETS:
		config = telegram_auth_config(bot["id"])
		secret = str(config.get("webhook_secret") or "")
		if secret and hmac.compare_digest(token, secret):
			return config
	if not token and not any(
		telegram_auth_config(bot["id"]).get("webhook_secret") for bot in AUTH_TARGETS
	):
		return telegram_auth_config(BACKUP_BOT_ID)
	return None


def ensure_telegram_auth_bot(bot: dict[str, str]) -> None:
	if bot["auth_method"] != "telegram":
		raise HTTPException(status_code=400, detail="This bot does not use Telegram authorization")
	if not telegram_auth_config(bot["id"])["token"]:
		raise HTTPException(status_code=503, detail="Telegram bot token is not configured")


def create_login_challenge(bot_id: str, client: str) -> dict[str, Any]:
	cleanup_sessions()
	challenge_id = secrets.token_urlsafe(18)
	challenge = {
		"id": challenge_id,
		"bot_id": bot_id,
		"client": client,
		"status": "pending",
		"created_at": time.time(),
		"expires_at": time.time() + LOGIN_CHALLENGE_TTL,
	}
	LOGIN_CHALLENGES[challenge_id] = challenge
	return challenge


def get_login_challenge(challenge_id: str, bot_id: str, client: str) -> dict[str, Any]:
	cleanup_sessions()
	challenge = LOGIN_CHALLENGES.get(challenge_id)
	if not challenge:
		raise HTTPException(status_code=404, detail="Login request expired")
	if challenge["bot_id"] != bot_id or not hmac.compare_digest(challenge["client"], client):
		raise HTTPException(status_code=403, detail="Login request is not valid for this client")
	return challenge


def telegram_api(config: dict[str, Any], method: str, payload: dict[str, Any]) -> dict[str, Any]:
	token = str(config.get("token") or "")
	if not token:
		raise HTTPException(status_code=503, detail="Telegram bot token is not configured")
	data = json.dumps(payload).encode()
	request = UrlRequest(
		f"https://api.telegram.org/bot{token}/{method}",
		data=data,
		method="POST",
	)
	request.add_header("Content-Type", "application/json")
	with urlopen(request, timeout=20) as response:
		body = json.loads(response.read().decode("utf-8"))
	if not body.get("ok"):
		raise HTTPException(status_code=502, detail="Telegram API request failed")
	return body


def send_login_approval(bot: dict[str, str], challenge: dict[str, Any]) -> dict[str, Any]:
	config = telegram_auth_config(bot["id"])
	chat_id = config["chat_id"] or config["owner_id"]
	return telegram_api(
		config,
		"sendMessage",
		{
			"chat_id": chat_id,
			"text": (
				"SilentFlare owner-console login requested.\n"
				f"Bot: {bot['name']} ({bot['id']})\n"
				"Approve only if this was you."
			),
			"reply_markup": {
				"inline_keyboard": [
					[
						{
							"text": "Approve login",
							"callback_data": f"sf_login:{challenge['id']}",
						}
					]
				]
			},
		},
	)


def edit_login_approval_message(
	challenge: dict[str, Any],
	approved: bool,
	config: dict[str, Any] | None = None,
) -> None:
	config = config or telegram_auth_config(str(challenge.get("bot_id", "")))
	message_id = challenge.get("telegram_message_id")
	chat_id = challenge.get("telegram_chat_id") or config.get("chat_id") or config.get("owner_id")
	if not message_id:
		return
	if approved:
		text = (
			"SilentFlare owner-console login approved.\n"
			f"Bot: {challenge['bot_id']}\n"
			"This approval link is now expired."
		)
	else:
		text = (
			"SilentFlare owner-console login request is expired or unauthorized.\n"
			f"Bot: {challenge.get('bot_id', 'Unknown')}\n"
			"This approval link is no longer valid."
		)
	try:
		telegram_api(
			config,
			"editMessageText",
			{
				"chat_id": chat_id,
				"message_id": message_id,
				"text": text,
				"reply_markup": {"inline_keyboard": []},
			},
		)
	except Exception:
		pass


def answer_callback(
	config: dict[str, Any],
	callback_id: str,
	text: str,
	alert: bool = False,
) -> None:
	try:
		telegram_api(
			config,
			"answerCallbackQuery",
			{
				"callback_query_id": callback_id,
				"text": text,
				"show_alert": alert,
			},
		)
	except Exception:
		pass


def approve_login_challenge(challenge_id: str, telegram_user_id: int) -> bool:
	challenge = LOGIN_CHALLENGES.get(challenge_id)
	if not challenge or challenge["expires_at"] <= time.time():
		LOGIN_CHALLENGES.pop(challenge_id, None)
		return False
	config = telegram_auth_config(str(challenge.get("bot_id", "")))
	if telegram_user_id != int(config["owner_id"]):
		return False
	if challenge["status"] == "approved":
		return True
	challenge["status"] = "approved"
	challenge["approved_at"] = time.time()
	return True


def bot_totp_env_name(bot_id: str) -> str:
	env_key = "".join(ch if ch.isalnum() else "_" for ch in bot_id.upper())
	return f"BOT_{env_key}_TOTP_SECRET"


def bot_totp_secret(bot_id: str) -> str:
	return os.getenv(
		bot_totp_env_name(bot_id),
		os.getenv("BOT_GHOST_DB_BACKUP_TOTP_SECRET", ""),
	)


def console_totp_secret() -> str:
	return CONSOLE_TOTP_SECRET


def generate_totp_secret() -> str:
	return base64.b32encode(secrets.token_bytes(20)).decode("ascii")


def console_totp_uri(secret: str) -> str:
	label = quote("SilentFlare Bot Management:Owner")
	issuer = quote("silentflare.com")
	return (
		f"otpauth://totp/{label}?secret={quote(secret)}&issuer={issuer}"
		"&algorithm=SHA1&digits=6&period=30"
	)


def set_api_env_value(key: str, value: str) -> None:
	if key != "BOT_CONSOLE_TOTP_SECRET":
		raise ValueError("environment key is not writable")
	if not API_ENV_FILE.exists():
		raise HTTPException(status_code=503, detail="API env file is not available")
	lines = []
	found = False
	for line in API_ENV_FILE.read_text(encoding="utf-8").splitlines(True):
		if line.startswith(f"{key}="):
			lines.append(f"{key}={value}\n")
			found = True
		else:
			lines.append(line)
	if not found:
		lines.append(f"{key}={value}\n")
	tmp_path = API_ENV_FILE.with_suffix(f"{API_ENV_FILE.suffix}.tmp")
	tmp_path.write_text("".join(lines), encoding="utf-8")
	os.replace(tmp_path, API_ENV_FILE)
	try:
		API_ENV_FILE.chmod(0o600)
	except OSError:
		pass


def totp_code(secret: str, counter: int) -> str:
	try:
		key = base64.b32decode(secret.upper(), casefold=True)
	except (binascii.Error, ValueError):
		return ""
	digest = hmac.new(key, struct.pack(">Q", counter), hashlib.sha1).digest()
	offset = digest[-1] & 0x0F
	value = struct.unpack(">I", digest[offset : offset + 4])[0] & 0x7FFFFFFF
	return f"{value % 1000000:06d}"


def verify_totp(secret: str, code: str, window: int = 1) -> bool:
	if not secret:
		raise HTTPException(status_code=503, detail="2FA is not configured for this bot")
	normalized = "".join(ch for ch in code if ch.isdigit())
	if len(normalized) != 6:
		return False
	counter = int(time.time() // 30)
	return any(
		hmac.compare_digest(totp_code(secret, counter + drift), normalized)
		for drift in range(-window, window + 1)
	)


def verify_bot_login(bot: dict[str, str], payload: LoginPayload) -> None:
	method = bot["auth_method"]
	if payload.method != method:
		raise HTTPException(status_code=400, detail="Invalid authentication method")
	if method == "totp":
		if not verify_totp(bot_totp_secret(bot["id"]), payload.code):
			raise HTTPException(status_code=401, detail="Invalid authentication code")
		return
	if method == "telegram":
		raise HTTPException(status_code=400, detail="Use Telegram authorization")
	raise HTTPException(status_code=503, detail="Authentication method is not available")


def verify_console_login(payload: LoginPayload) -> None:
	if payload.method != "totp":
		raise HTTPException(status_code=400, detail="Invalid authentication method")
	if not verify_totp(console_totp_secret(), payload.code):
		raise HTTPException(status_code=401, detail="Invalid authentication code")


def require_admin(x_admin_token: str | None) -> None:
	if not ADMIN_TOKEN:
		raise HTTPException(status_code=503, detail="Admin token is not configured")
	if not x_admin_token or not hmac.compare_digest(x_admin_token, ADMIN_TOKEN):
		raise HTTPException(status_code=401, detail="Invalid admin token")


def require_admin_console_session(
	request: Request,
	x_csrf_token: str | None = None,
	require_csrf: bool = False,
) -> dict[str, Any]:
	return require_session(
		request,
		bot_id=ADMIN_AUTH_ID,
		x_csrf_token=x_csrf_token,
		require_csrf=require_csrf,
	)


def ensure_bot(bot_id: str) -> dict[str, str]:
	bot_id = normalize_bot_id(bot_id)
	for bot in AUTH_TARGETS:
		if bot["id"] == bot_id:
			return bot
	raise HTTPException(status_code=404, detail="Bot not found")


def service_active(service_name: str) -> bool | None:
	result = subprocess.run(
		["systemctl", "is-active", service_name],
		check=False,
		capture_output=True,
		text=True,
		timeout=10,
	)
	if result.returncode == 4:
		return None
	return result.stdout.strip() == "active"


def public_json_health(url: str) -> dict[str, Any]:
	try:
		request = UrlRequest(url, headers={"User-Agent": "SilentFlareBotAPI/1.0"})
		with urlopen(request, timeout=15) as response:
			body = response.read().decode("utf-8", "replace")
		try:
			payload = json.loads(body) if body else {}
		except json.JSONDecodeError:
			payload = {}
		return {"ok": response.status < 400, "status": response.status, "payload": payload}
	except HTTPError as exc:
		return {"ok": False, "status": exc.code, "error": exc.__class__.__name__}
	except Exception as exc:
		return {"ok": False, "status": 0, "error": exc.__class__.__name__}


def expected_turnstile_hostnames() -> set[str]:
	raw = TURNSTILE_EXPECTED_HOSTNAMES or TURNSTILE_EXPECTED_HOSTNAME
	return {hostname.strip().lower() for hostname in raw.split(",") if hostname.strip()}


def local_db_configured() -> bool:
	return True


def account_runtime_configured() -> bool:
	return (
		bool(TURNSTILE_SECRET_KEY)
		and len(ACCOUNT_SESSION_SECRET) >= 32
		and bool(ACCOUNT_COOKIE_DOMAIN)
		and bool(expected_turnstile_hostnames())
	)


def ensure_account_db() -> None:
	ACCOUNT_DB_PATH.parent.mkdir(parents=True, exist_ok=True)
	with sqlite3.connect(ACCOUNT_DB_PATH) as connection:
		connection.execute("PRAGMA foreign_keys = ON")
		connection.executescript(
			"""
			CREATE TABLE IF NOT EXISTS users (
				id TEXT PRIMARY KEY,
				email TEXT UNIQUE NOT NULL,
				username TEXT UNIQUE NOT NULL,
				password_hash TEXT NOT NULL,
				password_salt TEXT NOT NULL,
				role TEXT NOT NULL DEFAULT 'user',
				created_at TEXT NOT NULL,
				updated_at TEXT NOT NULL,
				disabled_at TEXT,
				display_name TEXT,
				avatar_url TEXT,
				bio TEXT
			);

			CREATE TABLE IF NOT EXISTS sessions (
				id TEXT PRIMARY KEY,
				user_id TEXT NOT NULL,
				session_hash TEXT NOT NULL,
				created_at TEXT NOT NULL,
				expires_at TEXT NOT NULL,
				user_agent TEXT,
				ip_hash TEXT,
				FOREIGN KEY(user_id) REFERENCES users(id)
			);

			CREATE TABLE IF NOT EXISTS comments (
				id TEXT PRIMARY KEY,
				post_slug TEXT NOT NULL,
				user_id TEXT NOT NULL,
				parent_id TEXT,
				content TEXT NOT NULL,
				status TEXT NOT NULL DEFAULT 'published',
				created_at TEXT NOT NULL,
				updated_at TEXT NOT NULL,
				deleted_at TEXT,
				FOREIGN KEY(user_id) REFERENCES users(id),
				FOREIGN KEY(parent_id) REFERENCES comments(id)
			);

			CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
			CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
			CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
			CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
			CREATE INDEX IF NOT EXISTS idx_sessions_session_hash ON sessions(session_hash);
			CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
			CREATE INDEX IF NOT EXISTS idx_comments_post_slug ON comments(post_slug);
			CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
			CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);
			"""
		)
		for column_name, column_type in (
			("display_name", "TEXT"),
			("avatar_url", "TEXT"),
			("bio", "TEXT"),
		):
			try:
				connection.execute(f"ALTER TABLE users ADD COLUMN {column_name} {column_type}")
			except sqlite3.OperationalError as exc:
				if "duplicate column name" not in str(exc).lower():
					raise
		# Add email_verifications table for OTP login and registration
		connection.executescript("""
			CREATE TABLE IF NOT EXISTS email_verifications (
				id TEXT PRIMARY KEY,
				email TEXT NOT NULL,
				code TEXT NOT NULL DEFAULT '',
				code_hash TEXT,
				purpose TEXT NOT NULL,
				created_at TEXT,
				expires_at TEXT NOT NULL,
				used_at TEXT,
				attempts INTEGER NOT NULL DEFAULT 0,
				request_ip_hash TEXT
			);
			CREATE INDEX IF NOT EXISTS idx_ev_email ON email_verifications(email);
			CREATE INDEX IF NOT EXISTS idx_ev_expires ON email_verifications(expires_at);

			CREATE TABLE IF NOT EXISTS auth_flows (
				id TEXT PRIMARY KEY,
				token_hash TEXT UNIQUE NOT NULL,
				flow_type TEXT NOT NULL,
				user_id TEXT,
				email TEXT,
				return_url TEXT,
				metadata_json TEXT NOT NULL DEFAULT '{}',
				attempts INTEGER NOT NULL DEFAULT 0,
				created_at TEXT NOT NULL,
				expires_at TEXT NOT NULL,
				consumed_at TEXT,
				FOREIGN KEY(user_id) REFERENCES users(id)
			);
			CREATE INDEX IF NOT EXISTS idx_auth_flows_token ON auth_flows(token_hash);
			CREATE INDEX IF NOT EXISTS idx_auth_flows_expires ON auth_flows(expires_at);

			CREATE TABLE IF NOT EXISTS tos_acceptances (
				id TEXT PRIMARY KEY,
				user_id TEXT NOT NULL,
				version TEXT NOT NULL,
				accepted_at TEXT NOT NULL,
				ip_hash TEXT,
				user_agent TEXT,
				FOREIGN KEY(user_id) REFERENCES users(id)
			);

			CREATE TABLE IF NOT EXISTS auth_rate_limits (
				action TEXT NOT NULL,
				key_hash TEXT NOT NULL,
				window_started_at INTEGER NOT NULL,
				count INTEGER NOT NULL,
				PRIMARY KEY(action, key_hash)
			);
		""")
		for column_name, column_type in (
			("code_hash", "TEXT"),
			("created_at", "TEXT"),
			("attempts", "INTEGER NOT NULL DEFAULT 0"),
			("request_ip_hash", "TEXT"),
		):
			try:
				connection.execute(f"ALTER TABLE email_verifications ADD COLUMN {column_name} {column_type}")
			except sqlite3.OperationalError as exc:
				if "duplicate column name" not in str(exc).lower():
					raise
		# Add new user columns
		for column_name, column_type in (
			("email_verified_at", "TEXT"),
			("totp_secret", "TEXT"),
			("totp_enabled", "INTEGER"),
			("display_region", "TEXT"),
			("display_region_code", "TEXT"),
			("display_region_updated_at", "TEXT"),
			("tos_version", "TEXT"),
			("tos_accepted_at", "TEXT"),
		):
			try:
				connection.execute(f"ALTER TABLE users ADD COLUMN {column_name} {column_type}")
			except sqlite3.OperationalError as exc:
				if "duplicate column name" not in str(exc).lower():
					raise
		connection.commit()


def local_db_query(sql: str, params: list[Any] | None = None) -> list[dict[str, Any]]:
	try:
		ensure_account_db()
		with sqlite3.connect(ACCOUNT_DB_PATH) as connection:
			connection.row_factory = sqlite3.Row
			connection.execute("PRAGMA foreign_keys = ON")
			cursor = connection.execute(sql, params or [])
			try:
				if cursor.description is None:
					connection.commit()
					return []
				rows = [dict(row) for row in cursor.fetchall()]
				connection.commit()
				return rows
			finally:
				cursor.close()
	except sqlite3.Error as exc:
		raise HTTPException(status_code=500, detail="Local account database query failed") from exc


def d1_configured() -> bool:
	return local_db_configured()


def d1_query(sql: str, params: list[Any] | None = None) -> list[dict[str, Any]]:
	return local_db_query(sql, params)


def admin_data_status() -> dict[str, Any]:
	return {
		"d1_configured": local_db_configured(),
		"users_available": local_db_configured(),
		"comments_available": local_db_configured(),
		"storage": "local",
	}


def utc_now() -> str:
	return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def account_auth_configured() -> bool:
	return account_runtime_configured()


def future_iso(seconds: int) -> str:
	return datetime.fromtimestamp(time.time() + seconds, tz=timezone.utc).isoformat().replace(
		"+00:00", "Z"
	)


def auth_secret_hash(value: str) -> str:
	if len(ACCOUNT_SESSION_SECRET) < 32:
		raise HTTPException(status_code=503, detail="Account session secret is not configured")
	return base64.urlsafe_b64encode(
		hmac.new(
			ACCOUNT_SESSION_SECRET.encode("utf-8"), value.encode("utf-8"), hashlib.sha256
		).digest()
	).decode("ascii")


def request_public_ip(request: Request) -> str:
	raw_ip = (request.headers.get("cf-connecting-ip") or "").strip()
	if not raw_ip and request.client:
		raw_ip = str(request.client.host or "").strip()
	try:
		address = ipaddress.ip_address(raw_ip)
	except ValueError:
		return ""
	if address.is_private or address.is_loopback or address.is_reserved:
		return ""
	return str(address)


def clean_geo_value(value: Any, limit: int = 100) -> str:
	return unquote(str(value or "")).strip()[:limit]


def lookup_ip_region(request: Request) -> dict[str, str]:
	country_code = clean_geo_value(request.headers.get("cf-ipcountry"), 2).upper()
	city = clean_geo_value(request.headers.get("cf-ipcity"))
	region = clean_geo_value(request.headers.get("cf-region"))
	country = clean_geo_value(request.headers.get("cf-country"))
	if country_code and city and country:
		return {
			"country_code": country_code,
			"country": country,
			"region": region,
			"city": city,
		}
	public_ip = request_public_ip(request)
	if not public_ip:
		return {
			"country_code": country_code,
			"country": country,
			"region": region,
			"city": city,
		}
	cache_key = auth_secret_hash(f"geo:{public_ip}")
	cached = IP_GEO_CACHE.get(cache_key)
	if cached and float(cached.get("expires_at", 0)) > time.time():
		return dict(cached["value"])
	try:
		url = IP_GEOLOCATION_URL_TEMPLATE.format(ip=quote(public_ip, safe=""))
		geo_request = UrlRequest(url, headers={"User-Agent": "SilentFlareAccountAPI/1.0"})
		with urlopen(geo_request, timeout=5) as response:
			payload = json.loads(response.read().decode("utf-8"))
		if payload.get("success") is False:
			raise ValueError("geolocation lookup rejected")
		value = {
			"country_code": clean_geo_value(
				payload.get("country_code") or payload.get("countryCode") or country_code,
				2,
			).upper(),
			"country": clean_geo_value(payload.get("country") or country),
			"region": clean_geo_value(payload.get("region") or payload.get("regionName") or region),
			"city": clean_geo_value(payload.get("city") or city),
		}
		IP_GEO_CACHE[cache_key] = {
			"value": value,
			"expires_at": time.time() + IP_GEO_CACHE_TTL,
		}
		return value
	except Exception:
		return {
			"country_code": country_code,
			"country": country,
			"region": region,
			"city": city,
		}


def display_region_value(region: dict[str, str]) -> str:
	parts: list[str] = []
	for value in (region.get("city", ""), region.get("region", ""), region.get("country", "")):
		if value and value.casefold() not in {part.casefold() for part in parts}:
			parts.append(value)
	return ", ".join(parts)[:200]


def refresh_account_region(user: dict[str, Any], request: Request) -> dict[str, Any]:
	region = lookup_ip_region(request)
	display_region = display_region_value(region)
	country_code = region.get("country_code", "")[:2].upper()
	if not display_region and not country_code:
		return user
	if (
		display_region == str(user.get("display_region") or "")
		and country_code == str(user.get("display_region_code") or "")
	):
		return user
	now = utc_now()
	d1_query(
		"""
		UPDATE users
		SET display_region = ?, display_region_code = ?, display_region_updated_at = ?, updated_at = ?
		WHERE id = ?
		""",
		[display_region, country_code, now, now, str(user["id"])],
	)
	return {
		**user,
		"display_region": display_region,
		"display_region_code": country_code,
		"display_region_updated_at": now,
	}


def sanitize_return_url(value: str | None) -> str:
	default = "https://accounts.silentflare.com/"
	if not value:
		return default
	try:
		parsed = urlparse(value.strip())
	except ValueError:
		return default
	if parsed.scheme != "https" or parsed.username or parsed.password or parsed.port:
		return default
	hostname = (parsed.hostname or "").lower().rstrip(".")
	if hostname != "silentflare.com" and not hostname.endswith(".silentflare.com"):
		return default
	return parsed.geturl()


def enforce_auth_rate_limit(
	action: str,
	key: str,
	limit: int,
	window_seconds: int,
) -> None:
	now = int(time.time())
	key_hash = auth_secret_hash(f"rate:{action}:{key}")
	rows = d1_query(
		"SELECT window_started_at, count FROM auth_rate_limits WHERE action = ? AND key_hash = ?",
		[action, key_hash],
	)
	if not rows or now - int(rows[0]["window_started_at"]) >= window_seconds:
		d1_query(
			"INSERT OR REPLACE INTO auth_rate_limits (action, key_hash, window_started_at, count) VALUES (?, ?, ?, 1)",
			[action, key_hash, now],
		)
		return
	if int(rows[0]["count"]) >= limit:
		raise HTTPException(status_code=429, detail="Too many attempts. Try again later.")
	d1_query(
		"UPDATE auth_rate_limits SET count = count + 1 WHERE action = ? AND key_hash = ?",
		[action, key_hash],
	)


def send_email_code(email: str, code: str, purpose: str) -> None:
	if not AUTH_EMAIL_API_KEY or not AUTH_EMAIL_FROM:
		raise HTTPException(status_code=503, detail="Email delivery is not configured")
	subject = "Your SilentFlare sign-in code" if purpose == "login" else "Verify your SilentFlare email"
	payload = json.dumps(
		{
			"from": AUTH_EMAIL_FROM,
			"to": [email],
			"subject": subject,
			"html": (
				"<div style='font-family:ui-sans-serif,sans-serif;color:#172033'>"
				f"<h2>{subject}</h2><p>Your verification code is "
				f"<strong style='font-size:24px;letter-spacing:4px'>{code}</strong>.</p>"
				f"<p>It expires in {AUTH_EMAIL_CODE_TTL // 60} minutes. If you did not request it, ignore this email.</p>"
				"</div>"
			),
		}
	).encode("utf-8")
	request = UrlRequest(AUTH_EMAIL_API_URL, data=payload, method="POST")
	request.add_header("Authorization", f"Bearer {AUTH_EMAIL_API_KEY}")
	request.add_header("Content-Type", "application/json")
	request.add_header("User-Agent", "SilentFlare-Auth/1.0")
	try:
		with urlopen(request, timeout=15) as response:
			if response.status >= 300:
				raise HTTPException(status_code=503, detail="Email delivery failed")
	except HTTPException:
		raise
	except Exception as exc:
		raise HTTPException(status_code=503, detail="Email delivery failed") from exc


def create_email_verification(email: str, purpose: str, request: Request) -> None:
	clean_email = normalize_email(email)
	enforce_auth_rate_limit("email-ip", client_key(request), AUTH_EMAIL_SEND_LIMIT * 2, 3600)
	enforce_auth_rate_limit("email-address", clean_email, AUTH_EMAIL_SEND_LIMIT, 3600)
	latest = d1_query(
		"SELECT created_at FROM email_verifications WHERE email = ? AND purpose = ? ORDER BY created_at DESC LIMIT 1",
		[clean_email, purpose],
	)
	if latest and latest[0].get("created_at"):
		last_sent = datetime.fromisoformat(str(latest[0]["created_at"]).replace("Z", "+00:00")).timestamp()
		if time.time() - last_sent < AUTH_EMAIL_SEND_COOLDOWN:
			raise HTTPException(status_code=429, detail="Wait before requesting another code")
	code = f"{secrets.randbelow(1000000):06d}"
	now = utc_now()
	d1_query(
		"""
		INSERT INTO email_verifications
			(id, email, code, code_hash, purpose, created_at, expires_at, attempts, request_ip_hash)
		VALUES (?, ?, '', ?, ?, ?, ?, 0, ?)
		""",
		[
			str(uuid.uuid4()),
			clean_email,
			auth_secret_hash(f"code:{purpose}:{clean_email}:{code}"),
			purpose,
			now,
			future_iso(AUTH_EMAIL_CODE_TTL),
			auth_secret_hash(f"ip:{client_key(request)}"),
		],
	)
	try:
		send_email_code(clean_email, code, purpose)
	except Exception:
		d1_query(
			"UPDATE email_verifications SET used_at = ? WHERE email = ? AND purpose = ? AND created_at = ?",
			[utc_now(), clean_email, purpose, now],
		)
		raise


def verify_email_code(email: str, code: str, purpose: str) -> bool:
	clean_email = normalize_email(email)
	rows = d1_query(
		"""
		SELECT id, code_hash, attempts FROM email_verifications
		WHERE email = ? AND purpose = ? AND expires_at > ? AND used_at IS NULL
		ORDER BY created_at DESC LIMIT 1
		""",
		[clean_email, purpose, utc_now()],
	)
	if not rows or int(rows[0].get("attempts") or 0) >= AUTH_CODE_ATTEMPT_LIMIT:
		return False
	expected = auth_secret_hash(f"code:{purpose}:{clean_email}:{(code or '').strip()}")
	if not hmac.compare_digest(str(rows[0].get("code_hash") or ""), expected):
		d1_query("UPDATE email_verifications SET attempts = attempts + 1 WHERE id = ?", [rows[0]["id"]])
		return False
	d1_query("UPDATE email_verifications SET used_at = ? WHERE id = ?", [utc_now(), rows[0]["id"]])
	return True


def create_auth_flow(
	flow_type: str,
	*,
	user_id: str | None = None,
	email: str | None = None,
	return_url: str = "",
	metadata: dict[str, Any] | None = None,
) -> str:
	token = secrets.token_urlsafe(32)
	d1_query(
		"""
		INSERT INTO auth_flows
			(id, token_hash, flow_type, user_id, email, return_url, metadata_json, created_at, expires_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
		""",
		[
			str(uuid.uuid4()),
			auth_secret_hash(f"flow:{token}"),
			flow_type,
			user_id,
			email,
			sanitize_return_url(return_url),
			json.dumps(metadata or {}, separators=(",", ":")),
			utc_now(),
			future_iso(AUTH_FLOW_TTL),
		],
	)
	return token


def get_auth_flow(token: str, flow_type: str) -> dict[str, Any]:
	rows = d1_query(
		"""
		SELECT * FROM auth_flows
		WHERE token_hash = ? AND flow_type = ? AND expires_at > ? AND consumed_at IS NULL
		LIMIT 1
		""",
		[auth_secret_hash(f"flow:{token}"), flow_type, utc_now()],
	)
	if not rows:
		raise HTTPException(status_code=401, detail="Authentication flow expired or invalid")
	return rows[0]


def consume_auth_flow(flow_id: str) -> None:
	d1_query("UPDATE auth_flows SET consumed_at = ? WHERE id = ? AND consumed_at IS NULL", [utc_now(), flow_id])


def seal_totp_secret(secret: str) -> str:
	nonce = secrets.token_bytes(16)
	key = hashlib.sha256((ACCOUNT_SESSION_SECRET + ":totp").encode("utf-8")).digest()
	stream = bytearray()
	counter = 0
	while len(stream) < len(secret.encode("utf-8")):
		stream.extend(hmac.new(key, nonce + counter.to_bytes(4, "big"), hashlib.sha256).digest())
		counter += 1
	plain = secret.encode("utf-8")
	cipher = bytes(value ^ stream[index] for index, value in enumerate(plain))
	mac = hmac.new(key, nonce + cipher, hashlib.sha256).digest()
	return "v1:" + ":".join(base64.urlsafe_b64encode(part).decode("ascii") for part in (nonce, cipher, mac))


def open_totp_secret(value: str) -> str:
	try:
		version, nonce_raw, cipher_raw, mac_raw = value.split(":", 3)
		nonce, cipher, supplied_mac = (base64.urlsafe_b64decode(part) for part in (nonce_raw, cipher_raw, mac_raw))
		key = hashlib.sha256((ACCOUNT_SESSION_SECRET + ":totp").encode("utf-8")).digest()
		expected_mac = hmac.new(key, nonce + cipher, hashlib.sha256).digest()
		if version != "v1" or not hmac.compare_digest(supplied_mac, expected_mac):
			raise ValueError("invalid encrypted secret")
		stream = bytearray()
		counter = 0
		while len(stream) < len(cipher):
			stream.extend(hmac.new(key, nonce + counter.to_bytes(4, "big"), hashlib.sha256).digest())
			counter += 1
		return bytes(value ^ stream[index] for index, value in enumerate(cipher)).decode("utf-8")
	except Exception as exc:
		raise HTTPException(status_code=500, detail="Stored 2FA secret is invalid") from exc


def lookup_user_by_email_or_username(value: str) -> dict | None:
	"""Find user row by email or username."""
	clean = value.strip()
	is_email = "@" in clean
	if is_email:
		rows = d1_query(
			"""
			SELECT id, email, username, password_hash, password_salt, role,
				   display_name, avatar_url, bio, display_region, disabled_at,
				   totp_secret, totp_enabled
			FROM users WHERE email = ? LIMIT 1
			""",
			[normalize_email(clean)],
		)
	else:
		rows = d1_query(
			"""
			SELECT id, email, username, password_hash, password_salt, role,
				   display_name, avatar_url, bio, display_region, disabled_at,
				   totp_secret, totp_enabled
			FROM users WHERE username = ? LIMIT 1
			""",
			[normalize_username(clean)],
		)
	return rows[0] if rows else None


def verify_turnstile_token(token: str | None, remote_ip: str, expected_action: str) -> None:
	clean_token = (token or "").strip()
	if not clean_token:
		raise HTTPException(status_code=403, detail="Human verification is required")
	if len(clean_token) > 2048:
		raise HTTPException(status_code=403, detail="Human verification failed")
	if not TURNSTILE_SECRET_KEY:
		raise HTTPException(status_code=503, detail="Human verification is not configured")
	payload = urlencode(
		{
			"secret": TURNSTILE_SECRET_KEY,
			"response": clean_token,
			"remoteip": remote_ip,
		}
	).encode()
	request = UrlRequest(
		"https://challenges.cloudflare.com/turnstile/v0/siteverify",
		data=payload,
		method="POST",
	)
	request.add_header("Content-Type", "application/x-www-form-urlencoded")
	try:
		with urlopen(request, timeout=15) as response:
			body = json.loads(response.read().decode("utf-8"))
	except Exception as exc:
		raise HTTPException(status_code=403, detail="Human verification failed") from exc
	if not body.get("success"):
		raise HTTPException(status_code=403, detail="Human verification failed")
	if body.get("action") and body.get("action") != expected_action:
		raise HTTPException(status_code=403, detail="Human verification failed")
	expected_hostnames = expected_turnstile_hostnames()
	if not expected_hostnames:
		raise HTTPException(
			status_code=503,
			detail="Human verification hostname allowlist is not configured",
		)
	hostname = str(body.get("hostname") or "").strip().lower()
	if hostname not in expected_hostnames:
		raise HTTPException(status_code=403, detail="Human verification failed")


def require_account_turnstile(
	token: str | None,
	request: Request,
	expected_action: str,
) -> None:
	try:
		verify_turnstile_token(
			token,
			request.headers.get("cf-connecting-ip") or client_key(request),
			expected_action,
		)
	except HTTPException as exc:
		if exc.status_code == 403:
			record_login_failure(request)
		raise


def normalize_email(email: str) -> str:
	value = email.strip().lower()
	if (
		not value
		or len(value) > 254
		or "@" not in value
		or value.startswith("@")
		or value.endswith("@")
		or "." not in value.rsplit("@", 1)[-1]
	):
		raise HTTPException(status_code=400, detail="Enter a valid email address")
	return value


def normalize_username(username: str) -> str:
	value = username.strip()
	if len(value) < 3 or len(value) > 24:
		raise HTTPException(status_code=400, detail="Username must be 3-24 characters")
	if not all(char.isalnum() or char in {"_", "-"} for char in value):
		raise HTTPException(
			status_code=400,
			detail="Username can only contain letters, numbers, underscores, and hyphens",
		)
	return value


def validate_account_password(password: str) -> str:
	if len(password) < 8:
		raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
	if len(password) > 256:
		raise HTTPException(status_code=400, detail="Password is too long")
	return password


def hash_account_password(password: str, salt: str | None = None) -> tuple[str, str]:
	password_salt = salt or base64.b64encode(secrets.token_bytes(16)).decode("ascii")
	key = hashlib.pbkdf2_hmac(
		"sha256",
		password.encode("utf-8"),
		base64.b64decode(password_salt),
		ACCOUNT_PBKDF2_ITERATIONS,
		32,
	)
	return (
		f"{ACCOUNT_PBKDF2_PREFIX}:{ACCOUNT_PBKDF2_ITERATIONS}:{base64.b64encode(key).decode('ascii')}",
		password_salt,
	)


def verify_account_password(password: str, password_hash: str, salt: str) -> bool:
	try:
		prefix, iterations, stored_hash = password_hash.split(":", 2)
	except ValueError:
		return False
	if prefix != ACCOUNT_PBKDF2_PREFIX:
		return False
	try:
		iteration_count = int(iterations)
		key = hashlib.pbkdf2_hmac(
			"sha256",
			password.encode("utf-8"),
			base64.b64decode(salt),
			iteration_count,
			32,
		)
	except Exception:
		return False
	return hmac.compare_digest(base64.b64encode(key).decode("ascii"), stored_hash)


def account_session_hash(token: str) -> str:
	if len(ACCOUNT_SESSION_SECRET) < 32:
		raise HTTPException(status_code=503, detail="Account session secret is not configured")
	return base64.b64encode(
		hmac.new(
			ACCOUNT_SESSION_SECRET.encode("utf-8"),
			token.encode("utf-8"),
			hashlib.sha256,
		).digest()
	).decode("ascii")


def account_user_payload(row: dict[str, Any]) -> dict[str, Any]:
	return {
		"id": row["id"],
		"email": row["email"],
		"username": row["username"],
		"role": row.get("role", "user"),
		"displayName": row.get("display_name") or "",
		"avatarUrl": row.get("avatar_url") or "",
		"bio": row.get("bio") or "",
		"displayRegion": row.get("display_region") or "",
		"displayRegionCode": row.get("display_region_code") or "",
		"twoFactorEnabled": bool(row.get("totp_enabled")),
		"hasPassword": bool(row.get("password_hash")),
	}


def account_csrf_token(token: str) -> str:
	return auth_secret_hash(f"csrf:{token}")


def create_account_session(response: Response, request: Request, user_id: str) -> str:
	if not account_auth_configured():
		raise HTTPException(status_code=503, detail="Account API is not configured")
	now = utc_now()
	expires_at = datetime.fromtimestamp(
		time.time() + ACCOUNT_SESSION_TTL,
		tz=timezone.utc,
	).isoformat().replace("+00:00", "Z")
	token = secrets.token_urlsafe(32)
	d1_query(
		"""
		INSERT INTO sessions
			(id, user_id, session_hash, created_at, expires_at, user_agent, ip_hash)
		VALUES (?, ?, ?, ?, ?, ?, ?)
		""",
		[
			str(uuid.uuid4()),
			user_id,
			account_session_hash(token),
			now,
			expires_at,
			(request.headers.get("user-agent") or "")[:500],
			hashlib.sha256(client_key(request).encode("utf-8")).hexdigest(),
		],
	)
	response.set_cookie(
		ACCOUNT_SESSION_COOKIE,
		token,
		httponly=True,
		secure=WEB_COOKIE_SECURE,
		samesite="lax",
		max_age=ACCOUNT_SESSION_TTL,
		path="/",
		domain=ACCOUNT_COOKIE_DOMAIN or None,
	)
	return account_csrf_token(token)


def clear_account_cookie(response: Response) -> None:
	response.delete_cookie(
		ACCOUNT_SESSION_COOKIE,
		secure=WEB_COOKIE_SECURE,
		samesite="lax",
		path="/",
		domain=ACCOUNT_COOKIE_DOMAIN or None,
	)


def get_account_user(request: Request) -> dict[str, Any] | None:
	token = request.cookies.get(ACCOUNT_SESSION_COOKIE, "")
	if not token:
		return None
	now = utc_now()
	rows = d1_query(
		"""
		SELECT
			users.id,
			users.email,
			users.username,
			users.role,
			users.display_name,
			users.avatar_url,
			users.bio,
			users.display_region,
			users.display_region_code,
			users.display_region_updated_at,
			users.totp_enabled,
			users.password_hash,
			users.disabled_at
		FROM sessions
		INNER JOIN users ON users.id = sessions.user_id
		WHERE sessions.session_hash = ?
			AND sessions.expires_at > ?
			AND users.disabled_at IS NULL
		LIMIT 1
		""",
		[account_session_hash(token), now],
	)
	if not rows:
		return None
	return rows[0]


def require_account_user(request: Request) -> dict[str, Any]:
	user = get_account_user(request)
	if not user:
		raise HTTPException(status_code=401, detail="Login required")
	return user


def require_account_csrf(request: Request, x_csrf_token: str | None) -> dict[str, Any]:
	token = request.cookies.get(ACCOUNT_SESSION_COOKIE, "")
	user = require_account_user(request)
	if not token or not x_csrf_token or not hmac.compare_digest(
		x_csrf_token, account_csrf_token(token)
	):
		raise HTTPException(status_code=403, detail="Invalid CSRF token")
	return user


def normalize_profile_payload(payload: AccountProfilePayload) -> dict[str, str]:
	display_name = (payload.display_name or "").strip()
	avatar_url = (payload.avatar_url or "").strip()
	bio = (payload.bio or "").strip()
	if len(display_name) > 80:
		raise HTTPException(status_code=400, detail="Display name is too long")
	if len(avatar_url) > 500:
		raise HTTPException(status_code=400, detail="Avatar URL is too long")
	if avatar_url and not avatar_url.startswith(("https://", "http://")):
		raise HTTPException(status_code=400, detail="Avatar URL must start with http:// or https://")
	if len(bio) > 500:
		raise HTTPException(status_code=400, detail="Bio is too long")
	return {"display_name": display_name, "avatar_url": avatar_url, "bio": bio}


def avatar_media_type(data: bytes, supplied_type: str) -> tuple[str, str]:
	if data.startswith(b"\x89PNG\r\n\x1a\n"):
		return "png", "image/png"
	if data.startswith(b"\xff\xd8\xff"):
		return "jpg", "image/jpeg"
	if len(data) >= 12 and data[:4] == b"RIFF" and data[8:12] == b"WEBP":
		return "webp", "image/webp"
	raise HTTPException(
		status_code=415,
		detail=f"Unsupported avatar image type: {supplied_type or 'unknown'}",
	)


def managed_avatar_path(avatar_url: str) -> Path | None:
	if not avatar_url.startswith(f"{ACCOUNT_AVATAR_PUBLIC_BASE}/"):
		return None
	filename = avatar_url.rsplit("/", 1)[-1]
	if not filename or Path(filename).name != filename:
		return None
	return ACCOUNT_AVATAR_DIR / filename


def delete_managed_avatar(avatar_url: str) -> None:
	path = managed_avatar_path(avatar_url)
	if path and path.is_file():
		try:
			path.unlink()
		except OSError:
			pass


def normalize_comment_content(content: str) -> str:
	normalized = content.strip()
	if not normalized:
		raise HTTPException(status_code=400, detail="Comment content is required")
	if len(normalized) > 1000:
		raise HTTPException(status_code=400, detail="Comment must be 1000 characters or less")
	return normalized


def normalize_post_slug(post_slug: str) -> str:
	normalized = post_slug.strip().strip("/")
	if not normalized:
		raise HTTPException(status_code=400, detail="Post slug is required")
	if len(normalized) > 200:
		raise HTTPException(status_code=400, detail="Post slug is too long")
	return normalized


def comment_payload(row: dict[str, Any]) -> dict[str, Any]:
	return {
		"id": row["id"],
		"postSlug": row["post_slug"],
		"userId": row["user_id"],
		"parentId": row.get("parent_id"),
		"content": row["content"],
		"createdAt": row["created_at"],
		"updatedAt": row["updated_at"],
		"username": row["username"],
	}


def chat_bot_control_configured() -> bool:
	if CHAT_BOT_CONTROL_MODE == "local":
		return True
	if CHAT_BOT_CONTROL_MODE == "ssh":
		return bool(CHAT_BOT_SSH_TARGET and CHAT_BOT_SSH_KEY)
	return False


def chat_bot_remote_script(action: str) -> str:
	if action == "takeover":
		updates = {
			"WEB_OPERATIONS_ENABLED": "0",
			"OWNER_TG_ADMIN_ENABLED": "1",
			"OWNER_TG_FORWARD_ENABLED": "1",
			"OWNER_TG_NOTIFY_ENABLED": "0",
		}
	elif action == "resume-web":
		updates = {
			"WEB_OPERATIONS_ENABLED": "1",
			"OWNER_TG_ADMIN_ENABLED": "0",
			"OWNER_TG_FORWARD_ENABLED": "0",
			"OWNER_TG_NOTIFY_ENABLED": "1",
		}
	else:
		raise HTTPException(status_code=400, detail="Unsupported chat bot action")
	update_lines = "\n".join(
		f"set_env {json.dumps(key)} {json.dumps(value)}"
		for key, value in updates.items()
	)
	return f"""
set -Eeuo pipefail
env_file={json.dumps(CHAT_BOT_ENV_FILE)}
set_env() {{
  key="$1"
  value="$2"
  if grep -q "^${{key}}=" "$env_file"; then
    sed -i "s/^${{key}}=.*/${{key}}=${{value}}/" "$env_file"
  else
    printf '%s=%s\\n' "$key" "$value" >> "$env_file"
  fi
}}
{update_lines}
systemctl restart {json.dumps(CHAT_BOT_WEB_SERVICE)}
systemctl is-active {json.dumps(CHAT_BOT_WEB_SERVICE)}
"""


def run_chat_bot_command(script: str, timeout: int = 45) -> subprocess.CompletedProcess[str]:
	if CHAT_BOT_CONTROL_MODE == "disabled":
		raise HTTPException(status_code=503, detail="Chat Bot remote control is not configured")
	if CHAT_BOT_CONTROL_MODE == "local":
		command = ["bash", "-lc", script]
	elif CHAT_BOT_CONTROL_MODE == "ssh":
		if not CHAT_BOT_SSH_TARGET or not CHAT_BOT_SSH_KEY:
			raise HTTPException(status_code=503, detail="Chat Bot SSH control is not configured")
		command = [
			"ssh",
			"-i",
			CHAT_BOT_SSH_KEY,
			"-o",
			"BatchMode=yes",
			"-o",
			"StrictHostKeyChecking=accept-new",
			CHAT_BOT_SSH_TARGET,
			script,
		]
	else:
		raise HTTPException(status_code=503, detail="Unsupported Chat Bot control mode")
	return subprocess.run(
		command,
		check=False,
		capture_output=True,
		text=True,
		timeout=timeout,
	)


def run_chat_bot_control(action: str) -> dict[str, Any]:
	result = run_chat_bot_command(chat_bot_remote_script(action))
	if result.returncode != 0:
		raise HTTPException(status_code=502, detail="Chat Bot control command failed")
	return {"ok": True, "action": action, "service_state": result.stdout.strip().splitlines()[-1:]}


def chat_bot_remote_status() -> dict[str, Any] | None:
	if CHAT_BOT_CONTROL_MODE == "disabled" or not chat_bot_control_configured():
		return None
	script = f"""
set -Eeuo pipefail
python3 - <<'PY'
import json
import subprocess
from pathlib import Path

env_file = Path({json.dumps(CHAT_BOT_ENV_FILE)})
web_service = {json.dumps(CHAT_BOT_WEB_SERVICE)}
bot_service = {json.dumps(CHAT_BOT_BOT_SERVICE)}
flag_keys = [
    "WEB_OPERATIONS_ENABLED",
    "OWNER_TG_ADMIN_ENABLED",
    "OWNER_TG_FORWARD_ENABLED",
    "OWNER_TG_NOTIFY_ENABLED",
]

def service_active(name):
    result = subprocess.run(["systemctl", "is-active", name], capture_output=True, text=True)
    if result.returncode == 4:
        return None
    return result.stdout.strip() == "active"

def env_flags():
    values = {{}}
    if not env_file.exists():
        return values
    for raw in env_file.read_text().splitlines():
        if not raw or raw.lstrip().startswith("#") or "=" not in raw:
            continue
        key, value = raw.split("=", 1)
        if key in flag_keys:
            values[key] = value
    return values

print(json.dumps({{
    "web_service_active": service_active(web_service),
    "bot_service_active": service_active(bot_service),
    "flags": env_flags(),
}}))
PY
"""
	try:
		result = run_chat_bot_command(script, timeout=20)
	except Exception:
		return None
	if result.returncode != 0:
		return None
	try:
		return json.loads(result.stdout.strip().splitlines()[-1])
	except (IndexError, json.JSONDecodeError):
		return None


def chat_bot_status_payload() -> dict[str, Any]:
	health = public_json_health(f"{CHAT_BOT_WEB_URL}/healthz")
	remote_status = chat_bot_remote_status()
	web_service = (
		remote_status.get("web_service_active")
		if remote_status is not None
		else service_active(CHAT_BOT_WEB_SERVICE)
	)
	bot_service = (
		remote_status.get("bot_service_active")
		if remote_status is not None
		else service_active(CHAT_BOT_BOT_SERVICE)
	)
	flag_values = remote_status.get("flags", {}) if remote_status else {}
	return {
		"web_url": CHAT_BOT_WEB_URL,
		"health": health,
		"services": {
			"web": {
				"name": CHAT_BOT_WEB_SERVICE,
				"active": web_service,
				"status": "unknown" if web_service is None else ("active" if web_service else "inactive"),
			},
			"bot": {
				"name": CHAT_BOT_BOT_SERVICE,
				"active": bot_service,
				"status": "unknown" if bot_service is None else ("active" if bot_service else "inactive"),
			},
		},
		"control": {
			"mode": CHAT_BOT_CONTROL_MODE,
			"configured": chat_bot_control_configured(),
			"actions": ["takeover", "resume-web"],
		},
		"flags": [
			{
				"key": "WEB_OPERATIONS_ENABLED",
				"normal": "1",
				"takeover": "0",
				"current": flag_values.get("WEB_OPERATIONS_ENABLED", "unset"),
			},
			{
				"key": "OWNER_TG_ADMIN_ENABLED",
				"normal": "0",
				"takeover": "1",
				"current": flag_values.get("OWNER_TG_ADMIN_ENABLED", "unset"),
			},
			{
				"key": "OWNER_TG_FORWARD_ENABLED",
				"normal": "0",
				"takeover": "1",
				"current": flag_values.get("OWNER_TG_FORWARD_ENABLED", "unset"),
			},
			{
				"key": "OWNER_TG_NOTIFY_ENABLED",
				"normal": "1",
				"takeover": "0",
				"current": flag_values.get("OWNER_TG_NOTIFY_ENABLED", "unset"),
			},
		],
	}


CHAT_PROXY_SCRIPT = r'''
import base64
import json
import os
import sys

import web

web.load_env_file()

payload = json.loads(base64.b64decode(os.environ["CHAT_PROXY_PAYLOAD_B64"]).decode("utf-8"))
action = payload.get("action")
data = payload.get("data") or {}
bot_config = web.Config.load()
web_config = web.WebConfig.load()
store = web.WebStore(bot_config.db_path, bot_config.owner_id)
store.init()
api = web.TelegramAPI(bot_config.token, bot_config.request_timeout)


def state_payload(selected=None):
    contacts = [web.contact_payload(row) for row in store.contacts_for_web()]
    if selected is None and contacts:
        selected = int(contacts[0]["user_id"])
    selected_contact = store.get_contact(selected) if selected is not None else None
    messages = (
        [web.message_payload(row) for row in store.conversation_for_web(selected)]
        if selected_contact and selected is not None
        else []
    )
    profile = (
        next((contact for contact in contacts if int(contact["user_id"]) == selected), None)
        if selected_contact and selected is not None
        else None
    )
    if selected_contact and profile:
        ban = store.get_ban(int(selected_contact["user_id"]))
        pending = store.get_pending(int(selected_contact["user_id"]))
        exemption = store.get_exemption(int(selected_contact["user_id"]))
        profile.update(
            {
                "ban_text": web.ban_until_text(ban) if ban else "",
                "pending_since": web.fmt_ts(pending["created_at"]) if pending else "",
                "exempt_since": web.fmt_ts(exemption["created_at"]) if exemption else "",
            }
        )
    return {
        "ok": True,
        "owner_id": bot_config.owner_id,
        "settings": {
            "admin_username": web_config.admin_username,
            "totp_enabled": web_config.totp_enabled,
            "totp_configured": bool(web_config.totp_secret),
            "operations_enabled": web_config.operations_enabled,
            "bot_notifications_enabled": bot_config.owner_tg_notify_enabled,
            "upload_policy": web.upload_policy_payload(
                web_config.max_upload_bytes,
                web_config.blocked_upload_suffixes,
            ),
            "commands": [web.web_command_payload(spec) for spec in web.WEB_COMMAND_SPECS],
        },
        "contacts": contacts,
        "unread_total": sum(int(contact.get("unread_count", 0)) for contact in contacts),
        "selected": selected,
        "profile": profile,
        "messages": messages,
    }


def require_writable():
    if not web_config.operations_enabled:
        raise RuntimeError("web_operations_disabled")


def parse_int(value):
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def send_message(user_id, text):
    require_writable()
    user_id = parse_int(user_id)
    text = str(text or "").strip()
    if user_id is None or not text:
        raise RuntimeError("bad_request")
    contact = store.get_contact(user_id)
    if not contact:
        raise RuntimeError("contact_not_found")
    ban = store.get_ban(user_id)
    if ban:
        raise RuntimeError("user_banned:" + web.ban_until_text(ban))
    sent = api.send_message(int(contact["chat_id"]), text)
    store.clear_pending(user_id)
    store.log_message(
        "outbound",
        user_id=user_id,
        chat_id=int(contact["chat_id"]),
        text=text,
        message_type="text",
        telegram_message_id=int(sent["message_id"]),
    )
    return state_payload(user_id)


def apply_action(user_id, action_name, minutes=None):
    require_writable()
    user_id = parse_int(user_id)
    if user_id is None:
        raise RuntimeError("bad_user_id")
    contact = store.get_contact(user_id)
    if action_name == "ban":
        minutes_value = parse_int(minutes) if minutes not in (None, "") else None
        ban = store.ban(user_id, minutes_value)
        store.log_message(
            "ban",
            user_id=user_id,
            chat_id=ban["chat_id"] if ban else None,
            text=f"web ban minutes={minutes_value if minutes_value is not None else 'permanent'}",
            message_type="admin",
        )
        if ban and ban["chat_id"]:
            try:
                api.send_message(int(ban["chat_id"]), web.ban_notice(ban))
            except Exception:
                pass
        result = web.ban_until_text(ban) if ban else "Ban failed"
    elif action_name == "pardon":
        removed = store.pardon(user_id)
        store.log_message(
            "pardon",
            user_id=user_id,
            chat_id=contact["chat_id"] if contact else None,
            text="web pardon",
            message_type="admin",
        )
        if removed and contact:
            try:
                api.send_message(int(contact["chat_id"]), "你已被解除封禁，可以重新发送消息。")
            except Exception:
                pass
        result = "已解封" if removed else "未找到封禁记录"
    elif action_name == "exempt":
        exemption = store.exempt_pending_limit(user_id)
        store.log_message(
            "exempt",
            user_id=user_id,
            chat_id=exemption["chat_id"] if exemption else None,
            text="web pending limit exempted",
            message_type="admin",
        )
        result = "已豁免"
    elif action_name == "unexempt":
        removed = store.remove_pending_exemption(user_id)
        store.log_message(
            "unexempt",
            user_id=user_id,
            chat_id=contact["chat_id"] if contact else None,
            text="web pending limit exemption removed",
            message_type="admin",
        )
        result = "已取消豁免" if removed else "未找到豁免记录"
    else:
        raise RuntimeError("unsupported_action")
    output = state_payload(user_id)
    output["notice"] = result
    return output


def global_command_text(command):
    if command == "/status":
        return "\n".join(
            [
                "MessagesHelperBot status:",
                "Web operations: " + ("enabled" if web_config.operations_enabled else "disabled"),
                "Telegram owner admin: " + ("enabled" if bot_config.owner_tg_admin_enabled else "disabled"),
                "Telegram forwarding: " + ("enabled" if bot_config.owner_tg_forward_enabled else "disabled"),
                "2FA: " + ("enabled" if web_config.totp_enabled else "disabled"),
                f"Owner ID: {bot_config.owner_id}",
            ]
        )
    if command == "/help":
        return web.web_help_text()
    if command == "/banlist":
        rows = store.active_bans()
        if not rows:
            return "当前没有封禁用户。"
        lines = ["封禁列表："]
        for row in rows[:80]:
            lines.append(
                f"{row['user_id']} | {web.username_text(row['username'])} | "
                f"{web.region_text(row['language_code'])} | Premium {web.premium_text(row['is_premium'])} | "
                f"{web.ban_until_text(row)}"
            )
        return "\n".join(lines)
    if command == "/exemptlist":
        rows = store.list_pending_exemptions()
        if not rows:
            return "当前没有待回复限制豁免用户。"
        lines = ["待回复限制豁免列表："]
        for row in rows[:80]:
            lines.append(
                f"{row['user_id']} | {web.username_text(row['username'])} | "
                f"{web.region_text(row['language_code'])} | Premium {web.premium_text(row['is_premium'])} | "
                f"添加时间 {web.fmt_ts(row['created_at'])}"
            )
        return "\n".join(lines)
    return "未知指令。"


def command(payload):
    text = str(payload.get("text") or "").strip()
    user_id = parse_int(payload.get("user_id"))
    if not text:
        raise RuntimeError("bad_request")
    parsed = web.parse_web_command_text(text)
    if parsed is None:
        return send_message(user_id, text)
    command_name, args = parsed
    if command_name in {"/status", "/help", "/banlist", "/exemptlist"}:
        output = state_payload(user_id)
        output["command_result"] = global_command_text(command_name)
        output["notice"] = command_name
        return output
    if user_id is None:
        raise RuntimeError("bad_user_id")
    if command_name == "/ban":
        return apply_action(user_id, "ban", args[0] if args else None)
    if command_name == "/pardon":
        return apply_action(user_id, "pardon")
    if command_name == "/exempt":
        return apply_action(user_id, "exempt")
    if command_name == "/unexempt":
        return apply_action(user_id, "unexempt")
    if command_name == "/blocked":
        output = state_payload(user_id)
        output["blocked"] = [web.blocked_payload(row) for row in store.blocked_messages(user_id, limit=20)]
        return output
    if command_name == "/user":
        return state_payload(user_id)
    if command_name == "/reply":
        reply_text = " ".join(args).strip()
        if not reply_text:
            raise RuntimeError("empty_reply")
        return send_message(user_id, reply_text)
    raise RuntimeError("unsupported_command")


def media(message_id):
    message_id = parse_int(message_id)
    if message_id is None:
        raise RuntimeError("bad_message_id")
    row = store.message_log_for_web(message_id)
    if not row:
        raise RuntimeError("media_not_found")
    _display_text, media_info = web.parse_media_log_text(str(row["text"] or ""))
    if not media_info:
        raise RuntimeError("media_not_found")
    file_info = api.call("getFile", file_id=str(media_info["file_id"]))
    file_path = str(file_info.get("file_path") or "")
    if not file_path or file_path.startswith("/") or ".." in file_path.split("/"):
        raise RuntimeError("invalid_media_path")
    response = api.session.get(
        f"https://api.telegram.org/file/bot{bot_config.token}/{file_path}",
        timeout=(3.05, bot_config.request_timeout),
    )
    response.raise_for_status()
    return {
        "ok": True,
        "filename": web.safe_download_filename(str(media_info.get("filename") or "file")),
        "mime_type": web.safe_media_type(str(media_info.get("mime_type") or "application/octet-stream")),
        "body_b64": base64.b64encode(response.content).decode("ascii"),
    }


def upload_raw(payload):
    require_writable()
    content_type = str(payload.get("content_type") or "")
    body = base64.b64decode(str(payload.get("body_b64") or ""))
    upload_limit = min(web_config.max_body_bytes, web_config.max_upload_bytes)
    if not body or len(body) > upload_limit:
        raise RuntimeError("upload_too_large")
    if not content_type.startswith("multipart/form-data"):
        raise RuntimeError("multipart_required")
    form = web.parse_multipart_form(body, content_type, max_payload_bytes=upload_limit)
    user_id = parse_int(form.get("user_id"))
    caption = str(form.get("caption") or "").strip()
    upload = form.get("file")
    if user_id is None or not isinstance(upload, web.UploadedFile) or not upload.filename:
        raise RuntimeError("bad_upload")
    contact = store.get_contact(user_id)
    if not contact:
        raise RuntimeError("contact_not_found")
    ban = store.get_ban(user_id)
    if ban:
        raise RuntimeError("user_banned:" + web.ban_until_text(ban))
    if not upload.data:
        raise RuntimeError("empty_file")
    filename = web.sanitize_upload_filename(upload.filename)
    if web.is_blocked_upload_filename(filename, web_config.blocked_upload_suffixes):
        raise RuntimeError("blocked_file_type")
    content_type = upload.content_type or "application/octet-stream"
    is_photo = content_type.startswith("image/")
    method = "sendPhoto" if is_photo else "sendDocument"
    field_name = "photo" if is_photo else "document"
    files = {field_name: (filename, upload.data, content_type)}
    data = {"chat_id": int(contact["chat_id"])}
    if caption:
        data["caption"] = caption
    response = api.session.post(
        api.base + "/" + method,
        data=data,
        files=files,
        timeout=(3.05, bot_config.request_timeout),
    )
    try:
        result = response.json()
    except Exception:
        result = {}
    if response.status_code >= 400 or not result.get("ok"):
        raise RuntimeError("telegram_upload_failed")
    sent_message = result["result"]
    store.clear_pending(user_id)
    store.log_message(
        "outbound",
        message=sent_message,
        user_id=user_id,
        chat_id=int(contact["chat_id"]),
        text=caption,
        message_type="photo" if is_photo else "document",
        telegram_message_id=int(sent_message["message_id"]),
    )
    return state_payload(user_id)


try:
    if action == "state":
        result = state_payload(data.get("selected"))
    elif action == "read":
        user_id = parse_int(data.get("user_id"))
        if user_id is None or not store.get_contact(user_id):
            raise RuntimeError("bad_user_id")
        store.mark_conversation_read(user_id)
        result = state_payload(user_id)
    elif action == "send":
        result = send_message(data.get("user_id"), data.get("text"))
    elif action == "action":
        result = apply_action(data.get("user_id"), data.get("action"), data.get("minutes"))
    elif action == "command":
        result = command(data)
    elif action == "bot_notifications":
        require_writable()
        enabled = bool(data.get("enabled"))
        web.set_env_file_value("OWNER_TG_NOTIFY_ENABLED", "1" if enabled else "0")
        result = state_payload(None)
        result["notice"] = "Bot message previews enabled." if enabled else "Bot message previews disabled."
    elif action == "media":
        result = media(data.get("message_id"))
    elif action == "upload_raw":
        result = upload_raw(data)
    else:
        raise RuntimeError("unsupported_proxy_action")
    print(json.dumps(result, ensure_ascii=False))
except Exception as exc:
    print(json.dumps({"ok": False, "error": str(exc)}, ensure_ascii=False))
    sys.exit(2)
finally:
    store.conn.close()
'''


def run_chat_proxy(action: str, data: dict[str, Any] | None = None, timeout: int = 60) -> dict[str, Any]:
	payload = {
		"action": action,
		"data": data or {},
	}
	payload_b64 = base64.b64encode(json.dumps(payload).encode("utf-8")).decode("ascii")
	script = f"""
set -Eeuo pipefail
cd {json.dumps(CHAT_BOT_APP_DIR)}
export CHAT_PROXY_PAYLOAD_B64={json.dumps(payload_b64)}
python3 - <<'PY'
{CHAT_PROXY_SCRIPT}
PY
"""
	result = run_chat_bot_command(script, timeout=timeout)
	if result.returncode != 0:
		try:
			body = json.loads(result.stdout.strip().splitlines()[-1])
			detail = body.get("error") or "Chat Bot proxy command failed"
		except Exception:
			detail = "Chat Bot proxy command failed"
		raise HTTPException(status_code=502, detail=detail)
	try:
		body = json.loads(result.stdout.strip().splitlines()[-1])
	except (IndexError, json.JSONDecodeError):
		raise HTTPException(status_code=502, detail="Invalid Chat Bot proxy response")
	if not body.get("ok", False):
		raise HTTPException(status_code=502, detail=body.get("error", "Chat Bot proxy failed"))
	return body


def sha256_file(path: Path) -> str:
	digest = hashlib.sha256()
	with path.open("rb") as handle:
		for chunk in iter(lambda: handle.read(1024 * 1024), b""):
			digest.update(chunk)
	return digest.hexdigest()


def file_info(path: Path, *, include_sha256: bool = True) -> dict[str, Any]:
	stat = path.stat()
	created = datetime.fromtimestamp(stat.st_mtime, tz=timezone.utc)
	created_de = created.astimezone(ZoneInfo("Europe/Berlin"))
	created_beijing = created.astimezone(ZoneInfo("Asia/Shanghai"))
	info = {
		"filename": path.name,
		"size": stat.st_size,
		"created_at": created.isoformat().replace("+00:00", "Z"),
		"created_at_de": created_de.strftime("%Y-%m-%d %H:%M:%S %Z"),
		"created_at_beijing": created_beijing.strftime("%Y-%m-%d %H:%M:%S CST"),
	}
	if include_sha256:
		info["sha256"] = sha256_file(path)
	return info


def list_backups() -> list[dict[str, Any]]:
	if not BACKUP_DIR.exists():
		return []
	files = sorted(
		[
			*BACKUP_DIR.glob("SilentFLare-DB-Backup-*.sql.gz.age"),
			*BACKUP_DIR.glob("SilentFLare-DB-Backup-*.sql.gz"),
			*BACKUP_DIR.glob("ghost-db-*.sql.gz.age"),
			*BACKUP_DIR.glob("ghost-db-*.sql.gz"),
		],
		key=lambda item: item.stat().st_mtime,
		reverse=True,
	)
	return [
		file_info(path, include_sha256=index == 0)
		for index, path in enumerate(files[:20])
	]


def backup_timer_unit_name() -> str:
	return BACKUP_TIMER_NAME


def timer_schedule_options() -> list[dict[str, Any]]:
	return [
		{"interval_hours": 1, "label": "Every hour", "on_calendar": "*-*-* *:00:00"},
		{"interval_hours": 3, "label": "Every 3 hours", "on_calendar": "*-*-* 00/3:00:00"},
		{"interval_hours": 6, "label": "Every 6 hours", "on_calendar": "*-*-* 00/6:00:00"},
		{"interval_hours": 12, "label": "Every 12 hours", "on_calendar": "*-*-* 00/12:00:00"},
		{"interval_hours": 24, "label": "Daily", "on_calendar": "*-*-* 00:00:00"},
	]


def schedule_option_for_interval(interval_hours: int) -> dict[str, Any]:
	for option in timer_schedule_options():
		if option["interval_hours"] == interval_hours:
			return option
	raise HTTPException(status_code=400, detail="Unsupported backup interval")


def parse_timer_value(raw: str) -> str:
	value = raw.strip()
	if not value or value == "n/a":
		return ""
	return value


def read_timer_schedule() -> dict[str, Any]:
	unit = backup_timer_unit_name()
	result = subprocess.run(
		[
			"systemctl",
			"show",
			unit,
			"-p",
			"ActiveState",
			"-p",
			"NextElapseUSecRealtime",
			"-p",
			"LastTriggerUSec",
			"-p",
			"LastTriggerUSecRealtime",
		],
		check=False,
		capture_output=True,
		text=True,
		timeout=10,
	)
	values: dict[str, str] = {}
	for line in result.stdout.splitlines():
		key, _, value = line.partition("=")
		values[key] = value
	cat = subprocess.run(
		["systemctl", "cat", unit],
		check=False,
		capture_output=True,
		text=True,
		timeout=10,
	)
	on_calendar = ""
	for line in cat.stdout.splitlines():
		if line.startswith("OnCalendar=") and line != "OnCalendar=":
			on_calendar = line.partition("=")[2].strip()
	interval_hours = None
	for option in timer_schedule_options():
		if option["on_calendar"] == on_calendar:
			interval_hours = option["interval_hours"]
			break
	return {
		"active": values.get("ActiveState") == "active",
		"unit": unit,
		"interval_hours": interval_hours,
		"on_calendar": on_calendar,
		"next_run": parse_timer_value(values.get("NextElapseUSecRealtime", "")),
		"last_run": parse_timer_value(
			values.get("LastTriggerUSecRealtime", "")
			or values.get("LastTriggerUSec", "")
		),
		"options": timer_schedule_options(),
	}


def write_timer_schedule(interval_hours: int) -> dict[str, Any]:
	option = schedule_option_for_interval(interval_hours)
	BACKUP_TIMER_OVERRIDE.parent.mkdir(parents=True, exist_ok=True)
	BACKUP_TIMER_OVERRIDE.write_text(
		"\n".join(
			[
				"[Timer]",
				"OnCalendar=",
				f"OnCalendar={option['on_calendar']}",
				"",
			]
		),
		encoding="utf-8",
	)
	for command in (
		["systemctl", "daemon-reload"],
		["systemctl", "restart", backup_timer_unit_name()],
	):
		result = subprocess.run(
			command,
			check=False,
			capture_output=True,
			text=True,
			timeout=20,
		)
		if result.returncode != 0:
			raise HTTPException(status_code=500, detail="Unable to update backup timer")
	return read_timer_schedule()


def timer_active() -> bool:
	result = subprocess.run(
		["systemctl", "is-active", backup_timer_unit_name()],
		check=False,
		capture_output=True,
		text=True,
	)
	return result.stdout.strip() == "active"


def github_backup_status() -> dict[str, Any]:
	if not BACKUP_ENV_FILE.exists():
		return {"configured": False, "latest": None, "error": "Backup env file is missing"}
	script = f"""
set -Eeuo pipefail
set -a
. {BACKUP_ENV_FILE}
set +a
if [ "${{BACKUP_REMOTE:-}}" != "github_release" ] || [ -z "${{GH_TOKEN:-}}" ] || [ -z "${{GITHUB_REPO:-}}" ]; then
  printf '{{"configured":false,"latest":null}}'
  exit 0
fi
tag="$(GH_TOKEN="$GH_TOKEN" gh release list --repo "$GITHUB_REPO" --limit 20 --json tagName,publishedAt --jq '[.[] | select(.tagName | test("^(SilentFLare-DB-Backup|ghost-db)-[0-9]{{8}}T[0-9]{{6}}Z$"))] | sort_by(.publishedAt) | reverse | .[0].tagName')"
if [ -z "$tag" ] || [ "$tag" = "null" ]; then
  printf '{{"configured":true,"latest":null}}'
  exit 0
fi
GH_TOKEN="$GH_TOKEN" gh release view "$tag" --repo "$GITHUB_REPO" --json tagName,name,publishedAt,url --jq '{{configured:true,latest:.}}'
"""
	result = subprocess.run(
		["bash", "-lc", script],
		check=False,
		capture_output=True,
		text=True,
		timeout=30,
	)
	if result.returncode != 0:
		return {"configured": True, "latest": None, "error": "Unable to read GitHub backup releases"}
	try:
		return json.loads(result.stdout)
	except json.JSONDecodeError:
		return {"configured": True, "latest": None, "error": "Invalid GitHub release response"}


def resolve_telegram_chat_id(bot_id: str = BACKUP_BOT_ID) -> str:
	config = telegram_auth_config(bot_id)
	if config["chat_id"]:
		return str(config["chat_id"])
	if config["owner_id"]:
		return str(config["owner_id"])
	if not config["token"]:
		return ""
	with urlopen(
		f"https://api.telegram.org/bot{config['token']}/getUpdates",
		timeout=20,
	) as response:
		data = json.loads(response.read().decode("utf-8"))
	for update in reversed(data.get("result", [])):
		message = (
			update.get("message")
			or update.get("channel_post")
			or update.get("edited_message")
		)
		chat = (message or {}).get("chat", {})
		if chat.get("id") is not None:
			return str(chat["id"])
	return ""


def notify_telegram(text: str, bot_id: str = BACKUP_BOT_ID) -> bool:
	config = telegram_auth_config(bot_id)
	chat_id = resolve_telegram_chat_id(bot_id)
	if not config["token"] or not chat_id:
		return False
	data = urlencode({"chat_id": chat_id, "text": text}).encode()
	request = UrlRequest(
		f"https://api.telegram.org/bot{config['token']}/sendMessage",
		data=data,
		method="POST",
	)
	try:
		with urlopen(request, timeout=20) as response:
			response.read()
	except Exception:
		return False
	return True


@app.get("/health")
def health() -> dict[str, Any]:
	return {"ok": True, "service": APP_NAME}


@app.get("/auth/options")
def auth_options() -> dict[str, Any]:
	telegram_ready = any(bool(telegram_auth_config(bot["id"])["token"]) for bot in AUTH_TARGETS)
	return {
		"methods": {
			"telegram": telegram_ready,
			"totp": bool(console_totp_secret()),
		},
		"owner_id": TELEGRAM_OWNER_ID,
	}


@app.get("/auth/me")
def auth_me(request: Request) -> dict[str, Any]:
	session = get_session(request)
	bot = ensure_bot(str(session["bot_id"]))
	return {
		"authenticated": True,
		"bot": public_bot(bot),
		"csrf": session["csrf"],
		"totp_enabled": bool(console_totp_secret()),
	}


@app.post("/auth/login")
def auth_login(
	payload: LoginPayload,
	request: Request,
	response: Response,
) -> dict[str, Any]:
	check_login_rate_limit(request)
	bot = ensure_bot(str(payload.bot_id or ""))
	try:
		verify_console_login(payload)
	except HTTPException:
		record_login_failure(request)
		raise
	LOGIN_FAILURES.pop(client_key(request), None)
	session = create_session(response, bot["id"])
	return {
		"ok": True,
		"bot": public_bot(bot),
		"totp_enabled": bool(console_totp_secret()),
		**session,
	}


@app.post("/auth/telegram/start")
def auth_telegram_start(payload: TelegramStartPayload, request: Request) -> dict[str, Any]:
	check_login_rate_limit(request)
	bot = ensure_bot(str(payload.bot_id or ""))
	ensure_telegram_auth_bot(bot)
	challenge = create_login_challenge(bot["id"], client_key(request))
	try:
		message = send_login_approval(bot, challenge)
		result = message.get("result") or {}
		challenge["telegram_message_id"] = result.get("message_id")
		challenge["telegram_chat_id"] = (result.get("chat") or {}).get("id")
	except HTTPException:
		LOGIN_CHALLENGES.pop(challenge["id"], None)
		record_login_failure(request)
		raise
	return {
		"ok": True,
		"bot": public_bot(bot),
		"challenge_id": challenge["id"],
		"expires_at": datetime.fromtimestamp(
			challenge["expires_at"],
			tz=timezone.utc,
		)
		.isoformat()
		.replace("+00:00", "Z"),
	}


@app.get("/auth/telegram/status/{challenge_id}")
def auth_telegram_status(
	challenge_id: str,
	bot_id: str,
	request: Request,
	response: Response,
) -> dict[str, Any]:
	bot = ensure_bot(bot_id)
	challenge = get_login_challenge(challenge_id, bot["id"], client_key(request))
	if challenge["status"] != "approved":
		return {"ok": True, "status": "pending"}
	LOGIN_CHALLENGES.pop(challenge_id, None)
	LOGIN_FAILURES.pop(client_key(request), None)
	session = create_session(response, bot["id"])
	return {
		"ok": True,
		"status": "approved",
		"bot": public_bot(bot),
		"totp_enabled": bool(console_totp_secret()),
		**session,
	}


@app.post("/auth/telegram/cancel")
def auth_telegram_cancel(payload: TelegramCancelPayload, request: Request) -> dict[str, Any]:
	bot = ensure_bot(str(payload.bot_id or ""))
	challenge = get_login_challenge(
		payload.challenge_id,
		bot["id"],
		client_key(request),
	)
	if challenge["status"] == "pending":
		LOGIN_CHALLENGES.pop(payload.challenge_id, None)
	return {"ok": True}


@app.post("/auth/logout")
def auth_logout(
	request: Request,
	response: Response,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	if request.cookies.get(SESSION_COOKIE):
		require_session(request, x_csrf_token=x_csrf_token, require_csrf=True)
		destroy_session(request, response)
	elif request.cookies.get(ACCOUNT_SESSION_COOKIE):
		require_account_csrf(request, x_csrf_token)
		token = request.cookies.get(ACCOUNT_SESSION_COOKIE, "")
		d1_query("DELETE FROM sessions WHERE session_hash = ?", [account_session_hash(token)])
		clear_account_cookie(response)
	else:
		clear_account_cookie(response)
	return {"ok": True}


@app.post("/account/auth/register")
def account_register(
	payload: AccountRegisterPayload,
	request: Request,
	response: Response,
) -> dict[str, Any]:
	raise HTTPException(
		status_code=410,
		detail="Registration moved to the verified email flow on accounts.silentflare.com",
	)


@app.post("/account/auth/login")
def account_login(
	payload: AccountLoginPayload,
	request: Request,
	response: Response,
) -> dict[str, Any]:
	raise HTTPException(
		status_code=410,
		detail="Login moved to auth.silentflare.com",
	)


@app.post("/account/auth/logout")
def account_logout(
	request: Request,
	response: Response,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	token = request.cookies.get(ACCOUNT_SESSION_COOKIE, "")
	if token and account_auth_configured():
		require_account_csrf(request, x_csrf_token)
		d1_query("DELETE FROM sessions WHERE session_hash = ?", [account_session_hash(token)])
	clear_account_cookie(response)
	return {"ok": True}


@app.get("/account/auth/me")
def account_me(request: Request, response: Response) -> dict[str, Any]:
	if not account_auth_configured():
		return {"user": None, "configured": False}
	d1_query("DELETE FROM sessions WHERE expires_at <= ?", [utc_now()])
	user = get_account_user(request)
	if not user:
		clear_account_cookie(response)
		return {"user": None, "configured": True}
	return {
		"user": account_user_payload(user),
		"configured": True,
		"csrf": account_csrf_token(request.cookies.get(ACCOUNT_SESSION_COOKIE, "")),
	}


@app.get("/account/profile")
def account_profile(request: Request) -> dict[str, Any]:
	user = require_account_user(request)
	return {"ok": True, "user": account_user_payload(user)}


@app.post("/account/profile")
def account_profile_update(
	payload: AccountProfilePayload,
	request: Request,
) -> dict[str, Any]:
	raise HTTPException(status_code=410, detail="Use PATCH /accounts/profile")


@app.get("/comments")
def comments(postSlug: str) -> dict[str, Any]:
	if not d1_configured():
		return {"ok": True, "comments": [], "configured": False}
	post_slug = normalize_post_slug(postSlug)
	rows = d1_query(
		"""
		SELECT
			comments.id,
			comments.post_slug,
			comments.user_id,
			comments.parent_id,
			users.username,
			comments.content,
			comments.created_at,
			comments.updated_at
		FROM comments
		INNER JOIN users ON users.id = comments.user_id
		WHERE comments.post_slug = ?
			AND comments.status = 'published'
			AND comments.deleted_at IS NULL
		ORDER BY comments.created_at ASC
		LIMIT 200
		""",
		[post_slug],
	)
	return {"ok": True, "comments": [comment_payload(row) for row in rows], "configured": True}


@app.post("/comments/create")
def comment_create(
	payload: CommentCreatePayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	verify_turnstile_token(
		payload.turnstileToken,
		request.headers.get("cf-connecting-ip") or client_key(request),
		"comment",
	)
	user = require_account_csrf(request, x_csrf_token)
	post_slug = normalize_post_slug(payload.postSlug)
	content = normalize_comment_content(payload.content)
	now = utc_now()
	comment_id = str(uuid.uuid4())
	d1_query(
		"""
		INSERT INTO comments
			(id, post_slug, user_id, parent_id, content, status, created_at, updated_at)
		VALUES (?, ?, ?, NULL, ?, 'published', ?, ?)
		""",
		[comment_id, post_slug, user["id"], content, now, now],
	)
	return {
		"ok": True,
		"comment": {
			"id": comment_id,
			"postSlug": post_slug,
			"userId": user["id"],
			"parentId": None,
			"content": content,
			"createdAt": now,
			"updatedAt": now,
			"username": user["username"],
		},
	}


@app.delete("/comments/{comment_id}")
def comment_delete(
	comment_id: str,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	rows = d1_query(
		"SELECT id, user_id FROM comments WHERE id = ? LIMIT 1",
		[comment_id],
	)
	if not rows:
		raise HTTPException(status_code=404, detail="Comment not found")
	if rows[0]["user_id"] != user["id"] and user.get("role") != "admin":
		raise HTTPException(status_code=403, detail="Comment delete is not allowed")
	now = utc_now()
	d1_query(
		"UPDATE comments SET status = 'deleted', deleted_at = ?, updated_at = ? WHERE id = ?",
		[now, now, comment_id],
	)
	return {"ok": True}


@app.get("/admin/status")
def admin_status(request: Request) -> dict[str, Any]:
	session = require_admin_console_session(request)
	return {
		"ok": True,
		"bot_id": session["bot_id"],
		"totp_enabled": bool(console_totp_secret()),
		**admin_data_status(),
	}


@app.get("/admin/users")
def admin_users(request: Request) -> dict[str, Any]:
	require_admin_console_session(request)
	users = d1_query(
		"""
		SELECT id, email, username, role, created_at, updated_at, disabled_at
		FROM users
		ORDER BY created_at DESC
		LIMIT 200
		"""
	)
	return {"ok": True, "users": users, **admin_data_status()}


@app.post("/admin/users/{user_id}/disable")
def admin_user_disable(
	user_id: str,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	require_admin_console_session(request, x_csrf_token=x_csrf_token, require_csrf=True)
	now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
	d1_query(
		"UPDATE users SET disabled_at = ?, updated_at = ? WHERE id = ?",
		[now, now, user_id],
	)
	return {"ok": True}


@app.post("/admin/users/{user_id}/enable")
def admin_user_enable(
	user_id: str,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	require_admin_console_session(request, x_csrf_token=x_csrf_token, require_csrf=True)
	now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
	d1_query(
		"UPDATE users SET disabled_at = NULL, updated_at = ? WHERE id = ?",
		[now, user_id],
	)
	return {"ok": True}


@app.post("/admin/users/{user_id}/role")
def admin_user_role(
	user_id: str,
	payload: UserRolePayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	require_admin_console_session(request, x_csrf_token=x_csrf_token, require_csrf=True)
	role = payload.role.strip().lower()
	if role not in {"user", "admin"}:
		raise HTTPException(status_code=400, detail="Role must be user or admin")
	now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
	d1_query("UPDATE users SET role = ?, updated_at = ? WHERE id = ?", [role, now, user_id])
	return {"ok": True}


@app.get("/admin/comments")
def admin_comments(request: Request, post_slug: str | None = None) -> dict[str, Any]:
	require_admin_console_session(request)
	params: list[Any] = []
	where = ""
	if post_slug:
		where = "WHERE comments.post_slug = ?"
		params.append(post_slug)
	comments = d1_query(
		f"""
		SELECT
			comments.id,
			comments.post_slug,
			comments.user_id,
			users.username,
			comments.content,
			comments.status,
			comments.created_at,
			comments.updated_at,
			comments.deleted_at
		FROM comments
		INNER JOIN users ON users.id = comments.user_id
		{where}
		ORDER BY comments.created_at DESC
		LIMIT 200
		""",
		params,
	)
	return {"ok": True, "comments": comments, **admin_data_status()}


@app.post("/admin/comments/{comment_id}/delete")
def admin_comment_delete(
	comment_id: str,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	require_admin_console_session(request, x_csrf_token=x_csrf_token, require_csrf=True)
	now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
	d1_query(
		"UPDATE comments SET status = 'deleted', deleted_at = ?, updated_at = ? WHERE id = ?",
		[now, now, comment_id],
	)
	return {"ok": True}


@app.post("/admin/comments/{comment_id}/restore")
def admin_comment_restore(
	comment_id: str,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	require_admin_console_session(request, x_csrf_token=x_csrf_token, require_csrf=True)
	now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
	d1_query(
		"UPDATE comments SET status = 'published', deleted_at = NULL, updated_at = ? WHERE id = ?",
		[now, comment_id],
	)
	return {"ok": True}


@app.post("/telegram/update")
async def telegram_update(request: Request, token: str = "") -> dict[str, Any]:
	webhook_config = telegram_config_from_webhook_token(token)
	if not webhook_config:
		raise HTTPException(status_code=401, detail="Invalid webhook token")
	update = await request.json()
	callback = update.get("callback_query") or {}
	data = callback.get("data") or ""
	if not data.startswith("sf_login:"):
		return {"ok": True}
	challenge_id = data.removeprefix("sf_login:")
	from_user = callback.get("from") or {}
	user_id = int(from_user.get("id") or 0)
	callback_id = callback.get("id") or ""
	challenge = LOGIN_CHALLENGES.get(challenge_id, {"id": challenge_id})
	challenge_config = telegram_auth_config(str(challenge.get("bot_id", webhook_config["bot_id"])))
	if challenge_config["bot_id"] != webhook_config["bot_id"]:
		approved = False
	else:
		approved = approve_login_challenge(challenge_id, user_id)
	edit_login_approval_message(challenge, approved, webhook_config)
	if callback_id:
		answer_callback(
			webhook_config,
			callback_id,
			"Login approved. Return to the web page." if approved else "Login request expired or unauthorized.",
			alert=not approved,
		)
	return {"ok": True, "approved": approved}


@app.get("/bots")
def bots() -> dict[str, Any]:
	return {"bots": [public_bot(bot) for bot in BOTS]}


@app.get("/bots/{bot_id}")
def bot(bot_id: str, request: Request) -> dict[str, Any]:
	require_session(request, bot_id=bot_id)
	return public_bot(ensure_bot(bot_id))


@app.get("/bots/{bot_id}/checks/unified")
def unified_checks(bot_id: str, request: Request) -> dict[str, Any]:
	require_session(request, bot_id=bot_id)
	bot = ensure_bot(bot_id)
	if bot["id"] == CHAT_BOT_ID:
		status = chat_bot_status_payload()
		checks = [
			{
				"key": "public_health",
				"label": "Public health",
				"ok": bool(status["health"]["ok"]),
				"status": str(status["health"]["status"]),
				"detail": status["web_url"],
			},
			{
				"key": "web_service",
				"label": "Web service",
				"ok": status["services"]["web"]["active"] is not False,
				"status": status["services"]["web"]["status"],
				"detail": status["services"]["web"]["name"],
			},
			{
				"key": "bot_service",
				"label": "Bot service",
				"ok": status["services"]["bot"]["active"] is not False,
				"status": status["services"]["bot"]["status"],
				"detail": status["services"]["bot"]["name"],
			},
			{
				"key": "remote_control",
				"label": "Remote control",
				"ok": bool(status["control"]["configured"]),
				"status": "Configured" if status["control"]["configured"] else "Disabled",
				"detail": status["control"]["mode"],
			},
		]
		return {
			"ok": bool(status["health"]["ok"]),
			"bot_id": bot["id"],
			"checked_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
			"checks": checks,
		}
	checks: list[dict[str, Any]] = []

	def add_check(key: str, label: str, ok: bool, status: str, detail: str = "") -> None:
		checks.append(
			{
				"key": key,
				"label": label,
				"ok": ok,
				"status": status,
				"detail": detail,
			}
		)

	add_check("api", "FastAPI service", True, "OK", APP_NAME)
	add_check("bot", "Bot registry", bot["id"] == BACKUP_BOT_ID, "OK", bot["id"])
	telegram_config = telegram_auth_config(bot["id"])
	add_check(
		"telegram",
		"Telegram authorization",
		bool(telegram_config["token"] and telegram_config["owner_id"]),
		"OK" if telegram_config["token"] and telegram_config["owner_id"] else "Missing",
		"Owner approval path",
	)
	try:
		active = timer_active()
		add_check(
			"timer",
			"Backup timer",
			active,
			"Active" if active else "Inactive",
			backup_timer_unit_name(),
		)
	except Exception:
		add_check("timer", "Backup timer", False, "Error", backup_timer_unit_name())
	add_check(
		"backup_dir",
		"Backup directory",
		BACKUP_DIR.exists(),
		"OK" if BACKUP_DIR.exists() else "Missing",
		str(BACKUP_DIR),
	)
	backups = list_backups()
	add_check(
		"backup_files",
		"Backup files",
		bool(backups),
		f"{len(backups[:5])} recent",
		"Latest five local backup files",
	)
	github = github_backup_status()
	add_check(
		"github",
		"GitHub releases",
		bool(github.get("configured")) and not github.get("error"),
		"Connected"
		if github.get("configured") and not github.get("error")
		else "Check",
		github.get("error", "Release upload status"),
	)
	add_check(
		"totp",
		"Authenticator 2FA",
		bool(console_totp_secret()),
		"Configured" if console_totp_secret() else "Disabled",
		"Optional fallback login",
	)
	return {
		"ok": all(item["ok"] for item in checks if item["key"] != "totp"),
		"bot_id": bot["id"],
		"checked_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
		"checks": checks,
	}


@app.get("/bots/{bot_id}/chat/status")
def chat_status(bot_id: str, request: Request) -> dict[str, Any]:
	require_session(request, bot_id=bot_id)
	bot = ensure_bot(bot_id)
	if bot["id"] != CHAT_BOT_ID:
		raise HTTPException(status_code=404, detail="Chat status is not available for this bot")
	return {"ok": True, "bot_id": bot["id"], **chat_bot_status_payload()}


@app.post("/bots/{bot_id}/chat/takeover")
def chat_takeover(
	bot_id: str,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	require_session(request, bot_id=bot_id, x_csrf_token=x_csrf_token, require_csrf=True)
	bot = ensure_bot(bot_id)
	if bot["id"] != CHAT_BOT_ID:
		raise HTTPException(status_code=404, detail="Chat control is not available for this bot")
	return {"bot_id": bot["id"], **run_chat_bot_control("takeover")}


@app.post("/bots/{bot_id}/chat/resume-web")
def chat_resume_web(
	bot_id: str,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	require_session(request, bot_id=bot_id, x_csrf_token=x_csrf_token, require_csrf=True)
	bot = ensure_bot(bot_id)
	if bot["id"] != CHAT_BOT_ID:
		raise HTTPException(status_code=404, detail="Chat control is not available for this bot")
	return {"bot_id": bot["id"], **run_chat_bot_control("resume-web")}


def ensure_chat_bot_session(
	bot_id: str,
	request: Request,
	x_csrf_token: str | None = None,
	require_csrf: bool = False,
) -> dict[str, str]:
	require_session(
		request,
		bot_id=bot_id,
		x_csrf_token=x_csrf_token,
		require_csrf=require_csrf,
	)
	bot = ensure_bot(bot_id)
	if bot["id"] != CHAT_BOT_ID:
		raise HTTPException(status_code=404, detail="Chat console is not available for this bot")
	return bot


def model_payload(model: BaseModel) -> dict[str, Any]:
	if hasattr(model, "model_dump"):
		return model.model_dump()
	return model.dict()


@app.get("/bots/{bot_id}/chat/state")
def chat_state(
	bot_id: str,
	request: Request,
	selected: int | None = None,
) -> dict[str, Any]:
	bot = ensure_chat_bot_session(bot_id, request)
	return {"bot_id": bot["id"], **run_chat_proxy("state", {"selected": selected})}


@app.post("/bots/{bot_id}/chat/read")
def chat_read(
	bot_id: str,
	payload: ChatReadPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	bot = ensure_chat_bot_session(bot_id, request, x_csrf_token, True)
	return {"bot_id": bot["id"], **run_chat_proxy("read", model_payload(payload))}


@app.post("/bots/{bot_id}/chat/send")
def chat_send(
	bot_id: str,
	payload: ChatSendPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	bot = ensure_chat_bot_session(bot_id, request, x_csrf_token, True)
	return {"bot_id": bot["id"], **run_chat_proxy("send", model_payload(payload))}


@app.post("/bots/{bot_id}/chat/action")
def chat_user_action(
	bot_id: str,
	payload: ChatActionPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	bot = ensure_chat_bot_session(bot_id, request, x_csrf_token, True)
	return {"bot_id": bot["id"], **run_chat_proxy("action", model_payload(payload))}


@app.post("/bots/{bot_id}/chat/command")
def chat_command(
	bot_id: str,
	payload: ChatCommandPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	bot = ensure_chat_bot_session(bot_id, request, x_csrf_token, True)
	return {"bot_id": bot["id"], **run_chat_proxy("command", model_payload(payload))}


@app.post("/bots/{bot_id}/chat/settings/bot-notifications")
def chat_bot_notifications(
	bot_id: str,
	payload: ChatNotificationPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	bot = ensure_chat_bot_session(bot_id, request, x_csrf_token, True)
	return {"bot_id": bot["id"], **run_chat_proxy("bot_notifications", model_payload(payload))}


@app.get("/bots/{bot_id}/chat/media")
def chat_media(
	bot_id: str,
	message_id: int,
	request: Request,
) -> Response:
	ensure_chat_bot_session(bot_id, request)
	media = run_chat_proxy("media", {"message_id": message_id}, timeout=90)
	body = base64.b64decode(str(media.get("body_b64") or ""))
	filename = quote(str(media.get("filename") or "file"))
	return Response(
		content=body,
		media_type=str(media.get("mime_type") or "application/octet-stream"),
		headers={
			"Content-Disposition": f"attachment; filename*=UTF-8''{filename}",
			"Cache-Control": "no-store",
		},
	)


@app.post("/bots/{bot_id}/chat/upload")
async def chat_upload(
	bot_id: str,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	bot = ensure_chat_bot_session(bot_id, request, x_csrf_token, True)
	body = await request.body()
	if not body:
		raise HTTPException(status_code=400, detail="Upload body is empty")
	return {
		"bot_id": bot["id"],
		**run_chat_proxy(
			"upload_raw",
			{
				"content_type": request.headers.get("content-type", ""),
				"body_b64": base64.b64encode(body).decode("ascii"),
			},
			timeout=120,
		),
	}


@app.post("/settings/totp/generate")
def settings_totp_generate(
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	require_session(request, x_csrf_token=x_csrf_token, require_csrf=True)
	secret = generate_totp_secret()
	return {
		"ok": True,
		"secret": secret,
		"otpauth_uri": console_totp_uri(secret),
	}


@app.post("/settings/totp/enable")
def settings_totp_enable(
	payload: TotpEnablePayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	global CONSOLE_TOTP_SECRET
	require_session(request, x_csrf_token=x_csrf_token, require_csrf=True)
	if not verify_totp(payload.secret, payload.code):
		raise HTTPException(status_code=401, detail="Invalid authentication code")
	set_api_env_value("BOT_CONSOLE_TOTP_SECRET", payload.secret)
	CONSOLE_TOTP_SECRET = payload.secret
	return {"ok": True, "totp_enabled": True}


@app.get("/bots/{bot_id}/backup/status")
def backup_status(
	bot_id: str,
	request: Request,
	x_admin_token: str | None = Header(default=None),
) -> dict[str, Any]:
	if x_admin_token:
		require_admin(x_admin_token)
	else:
		require_session(request, bot_id=bot_id)
	bot = ensure_bot(bot_id)
	backups = list_backups()
	return {
		"bot_id": bot["id"],
		"timer_active": timer_active(),
		"schedule": read_timer_schedule(),
		"github": github_backup_status(),
		"latest": backups[0] if backups else None,
		"backups": backups[:5],
		"message": "Complete SilentFlare database backups are available."
		if backups
		else "No local backups found.",
	}


@app.post("/bots/{bot_id}/backup/schedule")
def backup_schedule_update(
	bot_id: str,
	payload: BackupSchedulePayload,
	request: Request,
	x_admin_token: str | None = Header(default=None),
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	if x_admin_token:
		require_admin(x_admin_token)
	else:
		require_session(
			request,
			bot_id=bot_id,
			x_csrf_token=x_csrf_token,
			require_csrf=True,
		)
	bot = ensure_bot(bot_id)
	return {
		"ok": True,
		"bot_id": bot["id"],
		"schedule": write_timer_schedule(payload.interval_hours),
	}


@app.post("/bots/{bot_id}/backup/run")
def backup_run(
	bot_id: str,
	request: Request,
	x_admin_token: str | None = Header(default=None),
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	if x_admin_token:
		require_admin(x_admin_token)
	else:
		require_session(
			request,
			bot_id=bot_id,
			x_csrf_token=x_csrf_token,
			require_csrf=True,
		)
	bot = ensure_bot(bot_id)
	if not BACKUP_SCRIPT.exists():
		raise HTTPException(status_code=500, detail="Backup script is missing")
	result = subprocess.run(
		[str(BACKUP_SCRIPT)],
		check=False,
		capture_output=True,
		text=True,
		timeout=180,
	)
	if result.returncode != 0:
		raise HTTPException(status_code=500, detail="Backup script failed")
	backups = list_backups()
	latest = backups[0] if backups else None
	notification_sent = False
	if latest:
		notification_sent = notify_telegram(
			"SilentFlare DB Backup completed an update-proof all-database backup: "
			f"{latest['filename']} sha256={latest['sha256']} size={latest['size']}"
		)
	message = "SilentFlare DB Backup completed and local encrypted all-database backup was created."
	if "upload=uploaded" in result.stdout:
		message = "SilentFlare DB Backup completed and encrypted all-database GitHub Release asset was uploaded."
	if latest and not notification_sent:
		message += " Telegram notification was not sent."
	return {
		"ok": True,
		"bot_id": bot["id"],
		"latest": latest,
		"notification_sent": notification_sent,
		"message": message,
	}


# ──────────────────────────────────────────────────────────────────────────────
# Unified auth session
# ──────────────────────────────────────────────────────────────────────────────

@app.get("/auth/session")
def unified_auth_session(request: Request, response: Response) -> dict[str, Any]:
	if not account_auth_configured():
		return {
			"authenticated": False,
			"user": None,
			"configured": False,
			"emailConfigured": bool(AUTH_EMAIL_API_KEY and AUTH_EMAIL_FROM),
			"tosVersion": AUTH_TOS_VERSION,
		}
	d1_query("DELETE FROM sessions WHERE expires_at <= ?", [utc_now()])
	user = get_account_user(request)
	if not user:
		clear_account_cookie(response)
		return {
			"authenticated": False,
			"user": None,
			"configured": True,
			"emailConfigured": bool(AUTH_EMAIL_API_KEY and AUTH_EMAIL_FROM),
			"tosVersion": AUTH_TOS_VERSION,
		}
	token = request.cookies.get(ACCOUNT_SESSION_COOKIE, "")
	return {
		"authenticated": True,
		"user": account_user_payload(user),
		"configured": True,
		"emailConfigured": bool(AUTH_EMAIL_API_KEY and AUTH_EMAIL_FROM),
		"tosVersion": AUTH_TOS_VERSION,
		"csrf": account_csrf_token(token),
	}


@app.get("/auth/return-url")
def auth_return_url(return_url: str = "") -> dict[str, str]:
	return {"return_url": sanitize_return_url(return_url)}


@app.post("/auth/session/refresh")
def unified_session_refresh(
	payload: SessionRefreshPayload,
	request: Request,
	response: Response,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	old_token = request.cookies.get(ACCOUNT_SESSION_COOKIE, "")
	d1_query("DELETE FROM sessions WHERE session_hash = ?", [account_session_hash(old_token)])
	csrf = create_account_session(response, request, str(user["id"]))
	return {
		"ok": True,
		"csrf": csrf,
		"return_url": sanitize_return_url(payload.return_url),
	}


# ──────────────────────────────────────────────────────────────────────────────
# Unified auth — password login (email or username)
# ──────────────────────────────────────────────────────────────────────────────

@app.post("/auth/login/password")
def unified_login_password(
	payload: UnifiedLoginPasswordPayload,
	request: Request,
	response: Response,
) -> dict[str, Any]:
	check_login_rate_limit(request)
	enforce_auth_rate_limit("password-login", client_key(request), 10, 900)
	require_account_turnstile(payload.turnstile_token, request, "login")
	if not account_auth_configured():
		raise HTTPException(status_code=503, detail="Account API is not configured")
	row = lookup_user_by_email_or_username(payload.email_or_username)
	if (
		not row
		or row.get("disabled_at")
		or not verify_account_password(
			payload.password,
			str(row.get("password_hash") or ""),
			str(row.get("password_salt") or ""),
		)
	):
		record_login_failure(request)
		raise HTTPException(status_code=401, detail="Invalid credentials")
	LOGIN_FAILURES.pop(client_key(request), None)
	# Check for 2FA
	return_url = sanitize_return_url(payload.return_url)
	if row.get("totp_enabled") and row.get("totp_secret"):
		pending_id = create_auth_flow(
			"pending-login", user_id=str(row["id"]), return_url=return_url
		)
		return {
			"ok": True,
			"requires_2fa": True,
			"pending_id": pending_id,
			"return_url": return_url,
		}
	csrf = create_account_session(response, request, str(row["id"]))
	return {
		"ok": True,
		"requires_2fa": False,
		"user": account_user_payload(row),
		"csrf": csrf,
		"return_url": return_url,
	}


# ──────────────────────────────────────────────────────────────────────────────
# Unified auth — email OTP login
# ──────────────────────────────────────────────────────────────────────────────

@app.post("/auth/login/email/request")
@app.post("/auth/login/email/request-code")
def unified_login_email_request_code(
	payload: EmailCodeRequestPayload,
	request: Request,
) -> dict[str, Any]:
	check_login_rate_limit(request)
	require_account_turnstile(payload.turnstile_token, request, "login")
	if not account_auth_configured():
		raise HTTPException(status_code=503, detail="Account API is not configured")
	email = normalize_email(payload.email)
	rows = d1_query("SELECT id FROM users WHERE email = ? AND disabled_at IS NULL LIMIT 1", [email])
	if rows:
		create_email_verification(email, "login", request)
	return {"ok": True, "message": "If the account exists, a code has been sent."}


@app.post("/auth/login/email/verify")
@app.post("/auth/login/email/verify-code")
def unified_login_email_verify_code(
	payload: EmailCodeVerifyPayload,
	request: Request,
	response: Response,
) -> dict[str, Any]:
	if not account_auth_configured():
		raise HTTPException(status_code=503, detail="Account API is not configured")
	email = normalize_email(payload.email)
	enforce_auth_rate_limit("email-code-verify", client_key(request), 20, 900)
	if not verify_email_code(email, payload.code, "login"):
		record_login_failure(request)
		raise HTTPException(status_code=401, detail="Invalid or expired verification code")
	rows = d1_query(
		"""
		SELECT id, email, username, role, display_name, avatar_url, bio,
			   display_region, disabled_at, password_hash, totp_secret, totp_enabled
		FROM users WHERE email = ? AND disabled_at IS NULL LIMIT 1
		""",
		[email],
	)
	if not rows:
		raise HTTPException(status_code=404, detail="Account not found")
	row = rows[0]
	LOGIN_FAILURES.pop(client_key(request), None)
	return_url = sanitize_return_url(payload.return_url)
	if row.get("totp_enabled") and row.get("totp_secret"):
		pending_id = create_auth_flow(
			"pending-login", user_id=str(row["id"]), return_url=return_url
		)
		return {
			"ok": True,
			"requires_2fa": True,
			"pending_id": pending_id,
			"return_url": return_url,
		}
	csrf = create_account_session(response, request, str(row["id"]))
	return {
		"ok": True,
		"requires_2fa": False,
		"user": account_user_payload(row),
		"csrf": csrf,
		"return_url": return_url,
	}


# ──────────────────────────────────────────────────────────────────────────────
# Unified auth — 2FA verification
# ──────────────────────────────────────────────────────────────────────────────

@app.post("/auth/2fa/verify")
def unified_2fa_verify(
	payload: TwoFAVerifyPayload,
	request: Request,
	response: Response,
) -> dict[str, Any]:
	if not account_auth_configured():
		raise HTTPException(status_code=503, detail="Account API is not configured")
	flow = get_auth_flow(payload.pending_id, "pending-login")
	if int(flow.get("attempts") or 0) >= AUTH_CODE_ATTEMPT_LIMIT:
		raise HTTPException(status_code=429, detail="Too many 2FA attempts")
	user_id = str(flow.get("user_id") or "")
	rows = d1_query(
		"""
		SELECT id, email, username, role, display_name, avatar_url, bio,
			   display_region, disabled_at, password_hash, totp_secret, totp_enabled
		FROM users WHERE id = ? AND disabled_at IS NULL LIMIT 1
		""",
		[user_id],
	)
	if not rows or not rows[0].get("totp_secret"):
		raise HTTPException(status_code=401, detail="2FA not configured for this account")
	if not verify_totp(open_totp_secret(str(rows[0]["totp_secret"])), payload.code):
		d1_query("UPDATE auth_flows SET attempts = attempts + 1 WHERE id = ?", [flow["id"]])
		raise HTTPException(status_code=401, detail="Invalid 2FA code")
	consume_auth_flow(str(flow["id"]))
	csrf = create_account_session(response, request, user_id)
	return {
		"ok": True,
		"user": account_user_payload(rows[0]),
		"csrf": csrf,
		"return_url": sanitize_return_url(str(flow.get("return_url") or "")),
	}


# ──────────────────────────────────────────────────────────────────────────────
# Unified auth — logout
# ──────────────────────────────────────────────────────────────────────────────

@app.post("/auth/session/logout")
def unified_logout(
	request: Request,
	response: Response,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	token = request.cookies.get(ACCOUNT_SESSION_COOKIE, "")
	if token and account_auth_configured():
		require_account_csrf(request, x_csrf_token)
		d1_query("DELETE FROM sessions WHERE session_hash = ?", [account_session_hash(token)])
	clear_account_cookie(response)
	return {"ok": True}


# ──────────────────────────────────────────────────────────────────────────────
# Registration — email-first flow
# ──────────────────────────────────────────────────────────────────────────────

@app.post("/accounts/register/email/request")
@app.post("/accounts/register/email/request-code")
def register_email_request_code(
	payload: RegisterEmailRequestPayload,
	request: Request,
) -> dict[str, Any]:
	check_login_rate_limit(request)
	require_account_turnstile(payload.turnstile_token, request, "register")
	if not account_auth_configured():
		raise HTTPException(status_code=503, detail="Account API is not configured")
	email = normalize_email(payload.email)
	existing = d1_query("SELECT id FROM users WHERE email = ? LIMIT 1", [email])
	if not existing:
		create_email_verification(email, "register", request)
	return {"ok": True, "message": "If the email is available, a code has been sent."}


@app.post("/accounts/register/email/verify")
@app.post("/accounts/register/email/verify-code")
def register_email_verify_code(
	payload: RegisterEmailVerifyPayload,
	request: Request,
) -> dict[str, Any]:
	if not account_auth_configured():
		raise HTTPException(status_code=503, detail="Account API is not configured")
	email = normalize_email(payload.email)
	enforce_auth_rate_limit("register-code-verify", client_key(request), 20, 900)
	if not verify_email_code(email, payload.code, "register"):
		record_login_failure(request)
		raise HTTPException(status_code=401, detail="Invalid or expired verification code")
	if d1_query("SELECT id FROM users WHERE email = ? LIMIT 1", [email]):
		raise HTTPException(status_code=409, detail="An account with this email already exists")
	reg_token = create_auth_flow("registration", email=email)
	LOGIN_FAILURES.pop(client_key(request), None)
	return {"ok": True, "reg_token": reg_token, "tos_version": AUTH_TOS_VERSION}


@app.post("/accounts/register/complete")
def register_complete(
	payload: RegisterCompletePayload,
	request: Request,
) -> dict[str, Any]:
	if not account_auth_configured():
		raise HTTPException(status_code=503, detail="Account API is not configured")
	flow = get_auth_flow(payload.reg_token, "registration")
	email = str(flow.get("email") or "")
	username = normalize_username(payload.username)
	if not payload.tos_accepted or payload.tos_version != AUTH_TOS_VERSION:
		raise HTTPException(status_code=400, detail="Current Terms of Service must be accepted")
	password = validate_account_password(payload.password) if payload.password else ""
	existing = d1_query(
		"SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1",
		[email, username],
	)
	if existing:
		raise HTTPException(status_code=409, detail="Email or username is already in use")
	password_hash, salt = hash_account_password(password) if password else ("", "")
	now = utc_now()
	user_id = str(uuid.uuid4())
	display_name = payload.display_name.strip()[:80]
	region = lookup_ip_region(request)
	display_region = display_region_value(region)
	display_region_code = region.get("country_code", "")[:2].upper()
	try:
		ensure_account_db()
		with sqlite3.connect(ACCOUNT_DB_PATH) as connection:
			connection.execute("PRAGMA foreign_keys = ON")
			connection.execute(
				"""
				INSERT INTO users
					(id, email, username, password_hash, password_salt, role,
					 email_verified_at, display_name, display_region, display_region_code,
					 display_region_updated_at, tos_version, tos_accepted_at, created_at, updated_at)
				VALUES (?, ?, ?, ?, ?, 'user', ?, ?, ?, ?, ?, ?, ?, ?, ?)
				""",
				[
					user_id, email, username, password_hash, salt, now, display_name,
					display_region, display_region_code, now, AUTH_TOS_VERSION, now, now, now,
				],
			)
			connection.execute(
				"""
				INSERT INTO tos_acceptances
					(id, user_id, version, accepted_at, ip_hash, user_agent)
				VALUES (?, ?, ?, ?, ?, ?)
				""",
				[
					str(uuid.uuid4()), user_id, AUTH_TOS_VERSION, now,
					auth_secret_hash(f"ip:{client_key(request)}"),
					(request.headers.get("user-agent") or "")[:500],
				],
			)
	except sqlite3.IntegrityError as exc:
		raise HTTPException(status_code=409, detail="Email or username is already in use") from exc
	consume_auth_flow(str(flow["id"]))
	onboarding_token = create_auth_flow("registration-onboarding", user_id=user_id, email=email)
	return {
		"ok": True,
		"onboarding_token": onboarding_token,
		"has_password": bool(password),
		"message": "Account created. Configure or skip 2FA, then sign in.",
	}


@app.post("/accounts/register/2fa/start")
def registration_2fa_start(payload: RegistrationTwoFAPayload) -> dict[str, Any]:
	flow = get_auth_flow(payload.onboarding_token, "registration-onboarding")
	secret = generate_totp_secret()
	setup_token = create_auth_flow(
		"registration-2fa-setup",
		user_id=str(flow.get("user_id") or ""),
		email=str(flow.get("email") or ""),
		metadata={"secret": seal_totp_secret(secret), "onboarding_flow_id": flow["id"]},
	)
	label = quote(f"SilentFlare:{flow.get('email') or 'account'}")
	uri = f"otpauth://totp/{label}?secret={secret}&issuer=SilentFlare&algorithm=SHA1&digits=6&period=30"
	return {"ok": True, "setup_token": setup_token, "secret": secret, "uri": uri}


@app.post("/accounts/register/2fa/verify")
def registration_2fa_verify(payload: RegistrationTwoFAPayload) -> dict[str, Any]:
	flow = get_auth_flow(payload.setup_token, "registration-2fa-setup")
	metadata = json.loads(str(flow.get("metadata_json") or "{}"))
	secret_encrypted = str(metadata.get("secret") or "")
	if not verify_totp(open_totp_secret(secret_encrypted), payload.code):
		d1_query("UPDATE auth_flows SET attempts = attempts + 1 WHERE id = ?", [flow["id"]])
		raise HTTPException(status_code=401, detail="Invalid 2FA code")
	d1_query(
		"UPDATE users SET totp_secret = ?, totp_enabled = 1, updated_at = ? WHERE id = ?",
		[secret_encrypted, utc_now(), flow["user_id"]],
	)
	consume_auth_flow(str(flow["id"]))
	consume_auth_flow(str(metadata.get("onboarding_flow_id") or ""))
	return {"ok": True, "login_url": "https://auth.silentflare.com/"}


@app.post("/accounts/register/2fa/skip")
def registration_2fa_skip(payload: RegistrationTwoFAPayload) -> dict[str, Any]:
	flow = get_auth_flow(payload.onboarding_token, "registration-onboarding")
	consume_auth_flow(str(flow["id"]))
	return {"ok": True, "login_url": "https://auth.silentflare.com/"}


# ──────────────────────────────────────────────────────────────────────────────
# 2FA setup (requires account session)
# ──────────────────────────────────────────────────────────────────────────────

@app.post("/accounts/2fa/setup/start")
def accounts_2fa_setup_start(
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	secret = generate_totp_secret()
	email = str(user.get("email", ""))
	setup_token = create_auth_flow(
		"account-2fa-setup",
		user_id=str(user["id"]),
		email=email,
		metadata={"secret": seal_totp_secret(secret)},
	)
	uri = f"otpauth://totp/SilentFlare:{quote(email)}?secret={secret}&issuer=SilentFlare&algorithm=SHA1&digits=6&period=30"
	return {"ok": True, "setup_token": setup_token, "secret": secret, "uri": uri}


@app.post("/accounts/2fa/setup/verify")
def accounts_2fa_setup_verify(
	payload: TwoFASetupVerifyPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	flow = get_auth_flow(payload.setup_token, "account-2fa-setup")
	if str(flow.get("user_id") or "") != str(user["id"]):
		raise HTTPException(status_code=403, detail="2FA setup is not authorized")
	metadata = json.loads(str(flow.get("metadata_json") or "{}"))
	secret_encrypted = str(metadata.get("secret") or "")
	if not verify_totp(open_totp_secret(secret_encrypted), payload.code):
		raise HTTPException(status_code=401, detail="Invalid 2FA code")
	now = utc_now()
	d1_query(
		"UPDATE users SET totp_secret = ?, totp_enabled = 1, updated_at = ? WHERE id = ?",
		[secret_encrypted, now, str(user["id"])],
	)
	consume_auth_flow(str(flow["id"]))
	return {"ok": True}


@app.post("/accounts/2fa/disable")
def accounts_2fa_disable(
	payload: TwoFASetupVerifyPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	rows = d1_query("SELECT totp_secret FROM users WHERE id = ? LIMIT 1", [user["id"]])
	if not rows or not rows[0].get("totp_secret") or not verify_totp(
		open_totp_secret(str(rows[0]["totp_secret"])), payload.code
	):
		raise HTTPException(status_code=401, detail="Invalid 2FA code")
	now = utc_now()
	d1_query(
		"UPDATE users SET totp_secret = NULL, totp_enabled = 0, updated_at = ? WHERE id = ?",
		[now, str(user["id"])],
	)
	return {"ok": True}


# ──────────────────────────────────────────────────────────────────────────────
# Accounts profile (new unified routes)
# ──────────────────────────────────────────────────────────────────────────────

@app.get("/accounts/profile")
def accounts_profile_get(request: Request) -> dict[str, Any]:
	user = refresh_account_region(require_account_user(request), request)
	return {"ok": True, "user": account_user_payload(user)}


@app.patch("/accounts/profile")
def accounts_profile_patch(
	payload: UnifiedProfilePayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	user = refresh_account_region(require_account_csrf(request, x_csrf_token), request)
	profile = normalize_profile_payload(
		AccountProfilePayload(
			display_name=payload.display_name,
			avatar_url=str(user.get("avatar_url") or ""),
			bio=payload.bio,
		)
	)
	display_name = profile["display_name"]
	avatar_url = profile["avatar_url"]
	bio = profile["bio"]
	now = utc_now()
	d1_query(
		"""
		UPDATE users
		SET display_name = ?, avatar_url = ?, bio = ?, updated_at = ?
		WHERE id = ?
		""",
		[display_name, avatar_url, bio, now, str(user["id"])],
	)
	updated = {**user, "display_name": display_name, "avatar_url": avatar_url, "bio": bio}
	return {"ok": True, "user": account_user_payload(updated)}


@app.post("/accounts/profile/avatar")
async def accounts_profile_avatar_upload(
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	content_length = request.headers.get("content-length", "")
	if content_length.isdigit() and int(content_length) > ACCOUNT_AVATAR_MAX_BYTES:
		raise HTTPException(status_code=413, detail="Avatar image must be 2 MB or smaller")
	data = await request.body()
	if not data:
		raise HTTPException(status_code=400, detail="Avatar image is required")
	if len(data) > ACCOUNT_AVATAR_MAX_BYTES:
		raise HTTPException(status_code=413, detail="Avatar image must be 2 MB or smaller")
	extension, media_type = avatar_media_type(data, request.headers.get("content-type", ""))
	ACCOUNT_AVATAR_DIR.mkdir(parents=True, exist_ok=True)
	filename = f"{secrets.token_urlsafe(24)}.{extension}"
	path = ACCOUNT_AVATAR_DIR / filename
	path.write_bytes(data)
	avatar_url = f"{ACCOUNT_AVATAR_PUBLIC_BASE}/{filename}"
	old_avatar_url = str(user.get("avatar_url") or "")
	try:
		d1_query(
			"UPDATE users SET avatar_url = ?, updated_at = ? WHERE id = ?",
			[avatar_url, utc_now(), str(user["id"])],
		)
	except Exception:
		try:
			path.unlink()
		except OSError:
			pass
		raise
	delete_managed_avatar(old_avatar_url)
	updated = {**user, "avatar_url": avatar_url}
	return {
		"ok": True,
		"mediaType": media_type,
		"user": account_user_payload(updated),
	}


@app.delete("/accounts/profile/avatar")
def accounts_profile_avatar_delete(
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	old_avatar_url = str(user.get("avatar_url") or "")
	d1_query(
		"UPDATE users SET avatar_url = '', updated_at = ? WHERE id = ?",
		[utc_now(), str(user["id"])],
	)
	delete_managed_avatar(old_avatar_url)
	return {"ok": True, "user": account_user_payload({**user, "avatar_url": ""})}


@app.get("/account-avatars/{filename}")
def account_avatar_file(filename: str) -> Response:
	if Path(filename).name != filename or not filename.endswith((".png", ".jpg", ".webp")):
		raise HTTPException(status_code=404, detail="Avatar not found")
	path = ACCOUNT_AVATAR_DIR / filename
	if not path.is_file():
		raise HTTPException(status_code=404, detail="Avatar not found")
	data = path.read_bytes()
	media_type = {
		".png": "image/png",
		".jpg": "image/jpeg",
		".webp": "image/webp",
	}[path.suffix]
	return Response(
		content=data,
		media_type=media_type,
		headers={"Cache-Control": "public, max-age=31536000, immutable"},
	)


@app.get("/auth/oauth/{provider}/start")
def oauth_start(provider: str, return_url: str = "") -> dict[str, Any]:
	if provider not in {"google", "github", "telegram"}:
		raise HTTPException(status_code=404, detail="OAuth provider not found")
	return {
		"ok": False,
		"provider": provider,
		"available": False,
		"return_url": sanitize_return_url(return_url),
		"detail": "OAuth provider is reserved but not configured",
	}


@app.get("/auth/oauth/{provider}/callback")
def oauth_callback(provider: str) -> dict[str, Any]:
	if provider not in {"google", "github", "telegram"}:
		raise HTTPException(status_code=404, detail="OAuth provider not found")
	raise HTTPException(status_code=501, detail="OAuth provider is not configured")


# ──────────────────────────────────────────────────────────────────────────────
@app.post("/bots/{bot_id}/telegram/test")
def telegram_test(
	bot_id: str,
	request: Request,
	x_admin_token: str | None = Header(default=None),
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	if x_admin_token:
		require_admin(x_admin_token)
	else:
		require_session(
			request,
			bot_id=bot_id,
			x_csrf_token=x_csrf_token,
			require_csrf=True,
		)
	bot = ensure_bot(bot_id)
	config = telegram_auth_config(bot["id"])
	if not config["token"] or not resolve_telegram_chat_id(bot["id"]):
		raise HTTPException(
			status_code=503,
			detail="Telegram token is not configured or no chat has messaged the bot",
		)
	if not notify_telegram("SilentFlare Bot Management test notification.", bot["id"]):
		raise HTTPException(status_code=503, detail="Telegram notification could not be sent")
	return {
		"ok": True,
		"bot_id": bot["id"],
		"message": "Telegram test notification sent.",
	}
