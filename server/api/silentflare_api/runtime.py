"""Shared compatibility runtime while domain services are extracted."""

from __future__ import annotations

import base64
import binascii
import hashlib
import hmac
import ipaddress
import json
import os
import secrets
import sqlite3
import struct
import subprocess
import threading
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import quote, unquote, urlencode, urlparse
from urllib.request import Request as UrlRequest
from urllib.request import urlopen
from zoneinfo import ZoneInfo

from fastapi import HTTPException, Request, Response
from pydantic import BaseModel

from .core.config import get_settings
from .db.bot_state import BotStateRepository
from .db.database import Database, DatabaseError
from .db.migrations import MigrationError, migrate_database
from .integrations.email import EmailClient
from .integrations.geo import GeoClient
from .integrations.http import IntegrationError, JsonHttpClient
from .integrations.telegram import TelegramClient
from .integrations.turnstile import TurnstileClient
from .jobs.repository import JobRepository

SETTINGS = get_settings()

_ACCOUNT_DB_READY = False
_ACCOUNT_DB_READY_LOCK = threading.Lock()

APP_NAME = SETTINGS.app_name

TELEGRAM_OWNER_ID = SETTINGS.telegram_owner_id

BACKUP_SCRIPT = SETTINGS.backup_script

BACKUP_DIR = SETTINGS.backup_dir

BACKUP_ENV_FILE = SETTINGS.backup_env_file

BACKUP_TIMER_NAME = "silentflare-ghost-db-backup.timer"

BACKUP_TIMER_OVERRIDE = SETTINGS.backup_timer_override

CHAT_BOT_WEB_URL = SETTINGS.chat_bot_web_url.rstrip("/")

CHAT_BOT_APP_DIR = SETTINGS.chat_bot_app_dir

CHAT_BOT_ENV_FILE = SETTINGS.chat_bot_env_file or f"{CHAT_BOT_APP_DIR}/.env"

CHAT_BOT_WEB_SERVICE = SETTINGS.chat_bot_web_service

CHAT_BOT_BOT_SERVICE = SETTINGS.chat_bot_bot_service

CHAT_BOT_CONTROL_MODE = SETTINGS.chat_bot_control_mode

CHAT_BOT_SSH_TARGET = SETTINGS.chat_bot_ssh_target

CHAT_BOT_SSH_KEY = SETTINGS.chat_bot_ssh_key

ADMIN_TOKEN = SETTINGS.api_admin_token

TELEGRAM_BOT_TOKEN = SETTINGS.telegram_bot_token

TELEGRAM_CHAT_ID = SETTINGS.telegram_chat_id

TELEGRAM_WEBHOOK_SECRET = SETTINGS.telegram_webhook_secret

DB_BACKUP_TELEGRAM_BOT_TOKEN = SETTINGS.db_backup_telegram_bot_token or TELEGRAM_BOT_TOKEN

DB_BACKUP_TELEGRAM_CHAT_ID = SETTINGS.db_backup_telegram_chat_id or TELEGRAM_CHAT_ID

DB_BACKUP_TELEGRAM_WEBHOOK_SECRET = (
	SETTINGS.db_backup_telegram_webhook_secret or TELEGRAM_WEBHOOK_SECRET
)

DB_BACKUP_TELEGRAM_OWNER_ID = SETTINGS.db_backup_telegram_owner_id or TELEGRAM_OWNER_ID

CHAT_BOT_TELEGRAM_BOT_TOKEN = SETTINGS.chat_bot_telegram_bot_token

CHAT_BOT_TELEGRAM_CHAT_ID = SETTINGS.chat_bot_telegram_chat_id

CHAT_BOT_TELEGRAM_WEBHOOK_SECRET = SETTINGS.chat_bot_telegram_webhook_secret

CHAT_BOT_TELEGRAM_OWNER_ID = SETTINGS.chat_bot_telegram_owner_id or TELEGRAM_OWNER_ID

API_ENV_FILE = SETTINGS.api_env_file

CONSOLE_AUTH_ID = "console"

CONSOLE_TOTP_SECRET = SETTINGS.console_totp_secret or SETTINGS.legacy_web_totp_secret

WEB_SESSION_TTL = SETTINGS.web_session_ttl

ADMIN_SESSION_TTL = 3600

WEB_COOKIE_SECURE = SETTINGS.web_cookie_secure

WEB_LOGIN_ATTEMPTS = SETTINGS.web_login_attempts

WEB_LOGIN_WINDOW_SECONDS = SETTINGS.web_login_window_seconds

WEB_LOGIN_SESSION_EPOCH = SETTINGS.web_login_session_epoch

ADMIN_WEB_LOGIN_STATE_PATH = SETTINGS.admin_web_login_state_path

TELEGRAM_API_TIMEOUT_SECONDS = max(3, SETTINGS.telegram_api_timeout_seconds)

SESSION_COOKIE = "sf_bot_session"

BOT_COOKIE_DOMAIN = SETTINGS.bot_cookie_domain

ACCOUNT_SESSION_COOKIE = SETTINGS.account_session_cookie

ACCOUNT_SESSION_SECRET = SETTINGS.account_session_secret or SETTINGS.legacy_account_session_secret
BOT_STATE_SECRET = SETTINGS.bot_session_secret or ACCOUNT_SESSION_SECRET or ADMIN_TOKEN

ACCOUNT_COOKIE_DOMAIN = SETTINGS.account_cookie_domain

ACCOUNT_DB_PATH = SETTINGS.account_db_path
DATABASE = Database(ACCOUNT_DB_PATH)
BOT_STATE = BotStateRepository(DATABASE, BOT_STATE_SECRET)
JOBS = JobRepository(DATABASE)
EMAIL_CLIENT = EmailClient()
GEO_CLIENT = GeoClient()
TELEGRAM_CLIENT = TelegramClient()
TURNSTILE_CLIENT = TurnstileClient()
PUBLIC_HTTP_CLIENT = JsonHttpClient(timeout_seconds=15, retries=1)

SHIELD_SYNC_SECRET = SETTINGS.shield_sync_secret

ACCOUNT_AVATAR_DIR = SETTINGS.account_avatar_dir

ACCOUNT_AVATAR_PUBLIC_BASE = SETTINGS.account_avatar_public_base.rstrip("/")

ACCOUNT_AVATAR_MAX_BYTES = SETTINGS.account_avatar_max_bytes

SITE_ASSET_DIR = SETTINGS.site_asset_dir

SITE_ASSET_PUBLIC_BASE = SETTINGS.site_asset_public_base.rstrip("/")

SITE_ASSET_MAX_BYTES = SETTINGS.site_asset_max_bytes

IP_GEOLOCATION_URL_TEMPLATE = SETTINGS.ip_geolocation_url_template

IP_GEO_CACHE_TTL = SETTINGS.ip_geo_cache_ttl

LOGIN_CHALLENGE_TTL = 5 * 60

PBKDF2_PREFIX = "pbkdf2_sha256"

ACCOUNT_PBKDF2_PREFIX = "pbkdf2-sha256"

ACCOUNT_PBKDF2_ITERATIONS = SETTINGS.account_pbkdf2_iterations

ACCOUNT_SESSION_TTL = SETTINGS.account_session_ttl

TURNSTILE_SECRET_KEY = SETTINGS.turnstile_secret_key

TURNSTILE_EXPECTED_HOSTNAME = SETTINGS.turnstile_expected_hostname

TURNSTILE_EXPECTED_HOSTNAMES = SETTINGS.turnstile_expected_hostnames

AUTH_EMAIL_API_KEY = SETTINGS.auth_email_api_key

AUTH_EMAIL_FROM = SETTINGS.auth_email_from

AUTH_EMAIL_API_URL = SETTINGS.auth_email_api_url

AUTH_LOGIN_VERIFY_URL = SETTINGS.auth_login_verify_url

AUTH_REGISTER_VERIFY_URL = SETTINGS.auth_register_verify_url

AUTH_TOS_VERSION = SETTINGS.auth_tos_version

AUTH_EMAIL_CODE_TTL = SETTINGS.auth_email_code_ttl

AUTH_EMAIL_SEND_COOLDOWN = SETTINGS.auth_email_send_cooldown

AUTH_EMAIL_SEND_LIMIT = SETTINGS.auth_email_send_limit

AUTH_CODE_ATTEMPT_LIMIT = SETTINGS.auth_code_attempt_limit

AUTH_FLOW_TTL = SETTINGS.auth_flow_ttl

COMMENT_CREATE_USER_LIMIT = SETTINGS.comment_create_user_limit

COMMENT_CREATE_IP_LIMIT = SETTINGS.comment_create_ip_limit

COMMENT_CREATE_WINDOW_SECONDS = SETTINGS.comment_create_window_seconds

IP_GEO_CACHE: dict[str, dict[str, Any]] = {}

BACKUP_BOT_ID = "SilentFlare DB Backup"

BACKUP_BOT_ALIASES = {"ghost-db-backup", "silentflare-db-backup"}

BACKUP_BOT_DESCRIPTION = "Complete all-database backup that remains valid across schema changes."

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
		"auth_method": SETTINGS.db_backup_auth_method or SETTINGS.legacy_ghost_backup_auth_method,
	},
]

AUTH_TARGETS = [*BOTS, ADMIN_AUTH_BOT]


def load_admin_web_login_state() -> bool:
	try:
		state = json.loads(ADMIN_WEB_LOGIN_STATE_PATH.read_text(encoding="utf-8"))
	except (FileNotFoundError, OSError, json.JSONDecodeError, TypeError):
		return False
	return state.get("enabled") is True if isinstance(state, dict) else False


def persist_admin_web_login_state(enabled: bool) -> None:
	ADMIN_WEB_LOGIN_STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
	temporary_path = ADMIN_WEB_LOGIN_STATE_PATH.with_name(
		f".{ADMIN_WEB_LOGIN_STATE_PATH.name}.{os.getpid()}.{secrets.token_hex(4)}.tmp"
	)
	try:
		temporary_path.write_text(
			json.dumps(
				{
					"enabled": enabled,
					"updated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
				},
				separators=(",", ":"),
			)
			+ "\n",
			encoding="utf-8",
		)
		os.chmod(temporary_path, 0o600)
		os.replace(temporary_path, ADMIN_WEB_LOGIN_STATE_PATH)
	finally:
		if temporary_path.exists():
			temporary_path.unlink()


ADMIN_WEB_LOGIN_ENABLED = load_admin_web_login_state()


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


class ShieldResponsePayload(BaseModel):
	command_id: str
	account_id: str
	action: str
	reason: str


class SiteBackgroundPayload(BaseModel):
	id: str
	type: str
	url: str
	position: str = "center"
	credit_text: str = ""
	credit_url: str = ""


class SiteSettingsPayload(BaseModel):
	name: str
	bio: str
	avatar_url: str
	about_markdown: str
	backgrounds: list[SiteBackgroundPayload]


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
	return_url: str = ""


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


class EmailLinkVerifyPayload(BaseModel):
	token: str = ""


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


class AccountPasswordPayload(BaseModel):
	current_password: str = ""
	new_password: str = ""
	verification_token: str = ""


class AccountSensitiveRequestPayload(BaseModel):
	action: str = ""


class AccountSensitiveVerifyPayload(BaseModel):
	action: str = ""
	code: str = ""


class AccountSensitiveActionPayload(BaseModel):
	verification_token: str = ""


class AccountEmailUpdatePayload(BaseModel):
	new_email: str = ""
	verification_token: str = ""


class AccountTwoFAStartPayload(BaseModel):
	verification_token: str = ""


class AccountTwoFADisablePayload(BaseModel):
	code: str = ""
	verification_token: str = ""


class AccountPrivacyPayload(BaseModel):
	profile_public: bool = True
	show_region: bool = True
	show_comments: bool = True
	allow_search: bool = True
	allow_data_export: bool = True


class AccountNotificationSettingsPayload(BaseModel):
	security_email: bool = True
	comment_replies: bool = True
	system_email: bool = True
	marketing_email: bool = False


class AccountDangerPayload(BaseModel):
	confirmation: str = ""
	verification_token: str = ""
	two_factor_code: str = ""


class SessionRefreshPayload(BaseModel):
	return_url: str = ""


class CommentCreatePayload(BaseModel):
	postSlug: str
	content: str
	turnstileToken: str | None = None
	parentId: str | None = None


class CommentUpdatePayload(BaseModel):
	content: str


class CommentModerationPayload(BaseModel):
	reason: str = ""


def cleanup_sessions() -> None:
	BOT_STATE.cleanup()


def create_session(response: Response, bot_id: str) -> dict[str, str]:
	cleanup_sessions()
	normalized_bot_id = normalize_bot_id(bot_id)
	if normalized_bot_id == ADMIN_AUTH_ID and not ADMIN_WEB_LOGIN_ENABLED:
		raise HTTPException(status_code=403, detail="Web login is disabled")
	session_ttl = ADMIN_SESSION_TTL if normalized_bot_id == ADMIN_AUTH_ID else WEB_SESSION_TTL
	session_id = secrets.token_urlsafe(32)
	try:
		session = BOT_STATE.create_session(
			session_id,
			normalized_bot_id,
			int(time.time()) + session_ttl,
			WEB_LOGIN_SESSION_EPOCH,
		)
	except RuntimeError as exc:
		raise HTTPException(
			status_code=503, detail="Bot session storage is not configured"
		) from exc
	response.set_cookie(
		SESSION_COOKIE,
		session_id,
		httponly=True,
		secure=WEB_COOKIE_SECURE,
		samesite="none" if WEB_COOKIE_SECURE else "lax",
		max_age=session_ttl,
		path="/",
		domain=BOT_COOKIE_DOMAIN or None,
	)
	return {"bot_id": normalized_bot_id, "csrf": str(session["csrf"])}


def normalize_bot_id(bot_id: str) -> str:
	normalized = bot_id.strip()
	if normalized == BACKUP_BOT_ID or normalized in BACKUP_BOT_ALIASES:
		return BACKUP_BOT_ID
	return normalized


def destroy_session(request: Request, response: Response) -> None:
	session_id = request.cookies.get(SESSION_COOKIE, "")
	if session_id:
		BOT_STATE.delete_session(session_id)
	response.delete_cookie(
		SESSION_COOKIE,
		secure=WEB_COOKIE_SECURE,
		samesite="none" if WEB_COOKIE_SECURE else "lax",
		path="/",
		domain=BOT_COOKIE_DOMAIN or None,
	)


def get_session(request: Request) -> dict[str, Any]:
	cleanup_sessions()
	session_id = request.cookies.get(SESSION_COOKIE, "")
	try:
		session = BOT_STATE.session(session_id) if session_id else None
	except RuntimeError as exc:
		raise HTTPException(
			status_code=503, detail="Bot session storage is not configured"
		) from exc
	if not session:
		raise HTTPException(status_code=401, detail="Login required")
	if session.get("bot_id") == ADMIN_AUTH_ID and not ADMIN_WEB_LOGIN_ENABLED:
		BOT_STATE.delete_session(session_id)
		raise HTTPException(status_code=403, detail="Web login is disabled")
	if session.get("bot_id") != ADMIN_AUTH_ID:
		expires_at = int(time.time()) + WEB_SESSION_TTL
		BOT_STATE.touch_session(session_id, expires_at)
		session["expires_at"] = expires_at
	return session


def set_admin_web_login(enabled: bool) -> None:
	global ADMIN_WEB_LOGIN_ENABLED
	persist_admin_web_login_state(enabled)
	ADMIN_WEB_LOGIN_ENABLED = enabled
	if enabled:
		return
	BOT_STATE.revoke_bot(ADMIN_AUTH_ID)


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
	key = client_key(request)
	if BOT_STATE.failure_count(key, WEB_LOGIN_WINDOW_SECONDS) >= WEB_LOGIN_ATTEMPTS:
		raise HTTPException(status_code=429, detail="Too many login attempts")


def record_login_failure(request: Request) -> None:
	BOT_STATE.record_failure(client_key(request))


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


def telegram_configs_share_credentials(left: dict[str, Any], right: dict[str, Any]) -> bool:
	"""Allow multiple auth surfaces to share one Telegram approval bot safely."""
	return all(
		hmac.compare_digest(str(left.get(key) or ""), str(right.get(key) or ""))
		for key in ("token", "webhook_secret", "owner_id")
	)


def ensure_telegram_auth_bot(bot: dict[str, str]) -> None:
	if bot["auth_method"] != "telegram":
		raise HTTPException(status_code=400, detail="This bot does not use Telegram authorization")
	if not telegram_auth_config(bot["id"])["token"]:
		raise HTTPException(status_code=503, detail="Telegram bot token is not configured")


def create_login_challenge(bot_id: str, client: str) -> dict[str, Any]:
	cleanup_sessions()
	challenge_id = secrets.token_urlsafe(18)
	created_at = int(time.time())
	return BOT_STATE.create_challenge(
		challenge_id,
		bot_id,
		client,
		created_at,
		created_at + LOGIN_CHALLENGE_TTL,
	)


def get_login_challenge(challenge_id: str, bot_id: str, client: str) -> dict[str, Any]:
	cleanup_sessions()
	challenge = BOT_STATE.challenge(challenge_id, client)
	if not challenge:
		raise HTTPException(status_code=404, detail="Login request expired")
	if challenge["bot_id"] != bot_id:
		raise HTTPException(status_code=403, detail="Login request is not valid for this client")
	return challenge


def get_login_challenge_by_id(challenge_id: str) -> dict[str, Any] | None:
	cleanup_sessions()
	return BOT_STATE.challenge(challenge_id)


def telegram_api(config: dict[str, Any], method: str, payload: dict[str, Any]) -> dict[str, Any]:
	token = str(config.get("token") or "")
	if not token:
		raise HTTPException(status_code=503, detail="Telegram bot token is not configured")
	try:
		body = TELEGRAM_CLIENT.call(token, method, payload)
	except IntegrationError as exc:
		raise HTTPException(status_code=502, detail="Telegram API request failed") from exc
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


def send_admin_web_login_confirmation(config: dict[str, Any], chat_id: Any, enabled: bool) -> None:
	try:
		telegram_api(
			config,
			"sendMessage",
			{
				"chat_id": chat_id,
				"text": (
					"Admin web login enabled until you send /denyweblogin. "
					"Each approved session expires after one hour."
					if enabled
					else "Admin web login disabled. All Admin sessions were revoked."
				),
			},
		)
	except Exception:
		pass


def approve_login_challenge(challenge_id: str, telegram_user_id: int) -> bool:
	challenge = get_login_challenge_by_id(challenge_id)
	if not challenge:
		BOT_STATE.delete_challenge(challenge_id)
		return False
	config = telegram_auth_config(str(challenge.get("bot_id", "")))
	if telegram_user_id != int(config["owner_id"]):
		return False
	if challenge["status"] == "approved":
		return True
	return BOT_STATE.approve_challenge(challenge_id)


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
		payload = PUBLIC_HTTP_CLIENT.request(
			"GET",
			url,
			headers={"User-Agent": "SilentFlareBotAPI/1.0"},
		)
		return {"ok": True, "status": 200, "payload": payload}
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
	global _ACCOUNT_DB_READY
	if _ACCOUNT_DB_READY:
		return
	with _ACCOUNT_DB_READY_LOCK:
		if _ACCOUNT_DB_READY:
			return
		try:
			migrate_database(ACCOUNT_DB_PATH)
		except MigrationError as exc:
			raise HTTPException(
				status_code=500, detail="Local account database migration failed"
			) from exc
		_ACCOUNT_DB_READY = True


def local_db_query(sql: str, params: list[Any] | None = None) -> list[dict[str, Any]]:
	ensure_account_db()
	try:
		return DATABASE.query(sql, params or [])
	except DatabaseError as exc:
		raise HTTPException(status_code=500, detail="Local account database query failed") from exc


def local_db_transaction(
	statements: list[tuple[str, list[Any]]],
) -> None:
	ensure_account_db()
	try:
		DATABASE.execute_many(statements)
	except DatabaseError as exc:
		raise HTTPException(
			status_code=500,
			detail="Local account database transaction failed",
		) from exc


def d1_configured() -> bool:
	return local_db_configured()


def d1_query(sql: str, params: list[Any] | None = None) -> list[dict[str, Any]]:
	"""Compatibility alias for the former D1-backed persistence function."""
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
	return (
		datetime.fromtimestamp(time.time() + seconds, tz=timezone.utc)
		.isoformat()
		.replace("+00:00", "Z")
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
		payload = GEO_CLIENT.lookup(url)
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
	if display_region == str(user.get("display_region") or "") and country_code == str(
		user.get("display_region_code") or ""
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


def email_verification_html(subject: str, code: str, verify_url: str) -> str:
	expires_minutes = max(1, AUTH_EMAIL_CODE_TTL // 60)
	return f"""<!doctype html>
<html lang="en">
<body style="margin:0;background:#edf3f8;color:#182230;font-family:Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#edf3f8;padding:32px 16px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #dbe6ef;border-radius:8px;overflow:hidden">
<tr><td style="padding:28px 32px 20px;border-bottom:1px solid #e4edf4">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="width:36px;height:36px;background:#4b9fe8;color:#ffffff;text-align:center;font-weight:800;border-radius:8px">S</td>
<td style="padding-left:12px;font-size:18px;font-weight:800">SilentFlare</td>
</tr></table>
</td></tr>
<tr><td style="padding:36px 32px 32px">
<p style="margin:0 0 10px;color:#428ed1;font-size:12px;font-weight:800;text-transform:uppercase">Secure verification</p>
<h1 style="margin:0 0 14px;font-size:28px;line-height:1.2;font-weight:800">{subject}</h1>
<p style="margin:0 0 24px;color:#607184;font-size:15px;line-height:1.7">Use either the six-digit code or the secure verification link below. Both are one-time and expire in {expires_minutes} minutes.</p>
<div style="margin:0 0 24px;padding:18px;text-align:center;background:#f3f8fc;border:1px solid #d9e7f2;border-radius:8px">
<p style="margin:0 0 8px;color:#74869a;font-size:11px;font-weight:800;text-transform:uppercase">Verification code</p>
<p style="margin:0;font-family:'Courier New',monospace;font-size:32px;font-weight:800;color:#176db8">{code}</p>
</div>
<table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center">
<a href="{verify_url}" style="display:inline-block;padding:14px 22px;background:#176db8;color:#ffffff;text-decoration:none;font-size:15px;font-weight:800;border-radius:8px">Verify securely</a>
</td></tr></table>
<p style="margin:26px 0 0;padding-top:22px;border-top:1px solid #e4edf4;color:#74869a;font-size:13px;line-height:1.6">If you did not request this email, you can safely ignore it. Never share this code or forward this email.</p>
</td></tr>
</table>
<p style="margin:18px 0 0;color:#8291a1;font-size:12px">SilentFlare Identity · auth.silentflare.com</p>
</td></tr></table>
</body>
</html>"""


def send_email_code(email: str, code: str, purpose: str, verify_url: str) -> None:
	if not AUTH_EMAIL_API_KEY or not AUTH_EMAIL_FROM:
		raise HTTPException(status_code=503, detail="Email delivery is not configured")
	subject = (
		"Your SilentFlare sign-in code" if purpose == "login" else "Verify your SilentFlare email"
	)
	expires_minutes = max(1, AUTH_EMAIL_CODE_TTL // 60)
	text = (
		f"{subject}\n\nVerification code: {code}\n\n"
		f"Verify securely: {verify_url}\n\n"
		f"This code and link expire in {expires_minutes} minutes."
	)
	try:
		EMAIL_CLIENT.send(
			api_url=AUTH_EMAIL_API_URL,
			api_key=AUTH_EMAIL_API_KEY,
			sender=AUTH_EMAIL_FROM,
			recipient=email,
			subject=subject,
			html=email_verification_html(subject, code, verify_url),
			text=text,
			idempotency_key=auth_secret_hash(f"email:{purpose}:{email}:{code}:{verify_url}"),
		)
	except IntegrationError as exc:
		raise HTTPException(status_code=503, detail="Email delivery failed") from exc


def create_email_verification(
	email: str,
	purpose: str,
	request: Request,
	*,
	user_id: str | None = None,
	return_url: str = "",
) -> None:
	clean_email = normalize_email(email)
	enforce_auth_rate_limit("email-ip", client_key(request), AUTH_EMAIL_SEND_LIMIT * 2, 3600)
	enforce_auth_rate_limit("email-address", clean_email, AUTH_EMAIL_SEND_LIMIT, 3600)
	latest = d1_query(
		"SELECT created_at FROM email_verifications WHERE email = ? AND purpose = ? ORDER BY created_at DESC LIMIT 1",
		[clean_email, purpose],
	)
	if latest and latest[0].get("created_at"):
		last_sent = datetime.fromisoformat(
			str(latest[0]["created_at"]).replace("Z", "+00:00")
		).timestamp()
		if time.time() - last_sent < AUTH_EMAIL_SEND_COOLDOWN:
			raise HTTPException(status_code=429, detail="Wait before requesting another code")
	code = f"{secrets.randbelow(1000000):06d}"
	now = utc_now()
	verification_id = str(uuid.uuid4())
	link_token = create_auth_flow(
		f"email-link-{purpose}",
		user_id=user_id,
		email=clean_email,
		return_url=return_url,
		metadata={"verification_id": verification_id},
		ttl_seconds=AUTH_EMAIL_CODE_TTL,
	)
	verify_base = AUTH_LOGIN_VERIFY_URL if purpose == "login" else AUTH_REGISTER_VERIFY_URL
	separator = "&" if "?" in verify_base else "?"
	verify_url = f"{verify_base}{separator}{urlencode({'verify_token': link_token})}"
	d1_query(
		"""
		INSERT INTO email_verifications
			(id, email, code, code_hash, purpose, created_at, expires_at, attempts, request_ip_hash)
		VALUES (?, ?, '', ?, ?, ?, ?, 0, ?)
		""",
		[
			verification_id,
			clean_email,
			auth_secret_hash(f"code:{purpose}:{clean_email}:{code}"),
			purpose,
			now,
			future_iso(AUTH_EMAIL_CODE_TTL),
			auth_secret_hash(f"ip:{client_key(request)}"),
		],
	)
	try:
		send_email_code(clean_email, code, purpose, verify_url)
	except Exception:
		d1_query(
			"UPDATE email_verifications SET used_at = ? WHERE email = ? AND purpose = ? AND created_at = ?",
			[utc_now(), clean_email, purpose, now],
		)
		d1_query(
			"UPDATE auth_flows SET consumed_at = ? WHERE token_hash = ?",
			[utc_now(), auth_secret_hash(f"flow:{link_token}")],
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
		d1_query(
			"UPDATE email_verifications SET attempts = attempts + 1 WHERE id = ?", [rows[0]["id"]]
		)
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
	ttl_seconds: int = AUTH_FLOW_TTL,
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
			future_iso(ttl_seconds),
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
	d1_query(
		"UPDATE auth_flows SET consumed_at = ? WHERE id = ? AND consumed_at IS NULL",
		[utc_now(), flow_id],
	)


def consume_email_link(token: str, purpose: str) -> dict[str, Any]:
	if not token or len(token) > 256:
		raise HTTPException(status_code=401, detail="Verification link expired or invalid")
	ensure_account_db()
	now = utc_now()
	with sqlite3.connect(ACCOUNT_DB_PATH) as connection:
		connection.row_factory = sqlite3.Row
		connection.execute("PRAGMA foreign_keys = ON")
		connection.execute("BEGIN IMMEDIATE")
		flow = connection.execute(
			"""
			SELECT * FROM auth_flows
			WHERE token_hash = ? AND flow_type = ? AND expires_at > ? AND consumed_at IS NULL
			LIMIT 1
			""",
			[auth_secret_hash(f"flow:{token}"), f"email-link-{purpose}", now],
		).fetchone()
		if not flow:
			raise HTTPException(status_code=401, detail="Verification link expired or invalid")
		try:
			metadata = json.loads(str(flow["metadata_json"] or "{}"))
		except json.JSONDecodeError as exc:
			raise HTTPException(
				status_code=401, detail="Verification link expired or invalid"
			) from exc
		verification_id = str(metadata.get("verification_id") or "")
		verification = connection.execute(
			"""
			SELECT id FROM email_verifications
			WHERE id = ? AND email = ? AND purpose = ? AND expires_at > ? AND used_at IS NULL
			LIMIT 1
			""",
			[verification_id, str(flow["email"] or ""), purpose, now],
		).fetchone()
		if not verification:
			raise HTTPException(status_code=401, detail="Verification link expired or invalid")
		verification_update = connection.execute(
			"UPDATE email_verifications SET used_at = ? WHERE id = ? AND used_at IS NULL",
			[now, verification_id],
		)
		flow_update = connection.execute(
			"UPDATE auth_flows SET consumed_at = ? WHERE id = ? AND consumed_at IS NULL",
			[now, str(flow["id"])],
		)
		if verification_update.rowcount != 1 or flow_update.rowcount != 1:
			raise HTTPException(status_code=401, detail="Verification link expired or invalid")
		connection.commit()
		return dict(flow)


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
	return "v1:" + ":".join(
		base64.urlsafe_b64encode(part).decode("ascii") for part in (nonce, cipher, mac)
	)


def open_totp_secret(value: str) -> str:
	try:
		version, nonce_raw, cipher_raw, mac_raw = value.split(":", 3)
		nonce, cipher, supplied_mac = (
			base64.urlsafe_b64decode(part) for part in (nonce_raw, cipher_raw, mac_raw)
		)
		key = hashlib.sha256((ACCOUNT_SESSION_SECRET + ":totp").encode("utf-8")).digest()
		expected_mac = hmac.new(key, nonce + cipher, hashlib.sha256).digest()
		if version != "v1" or not hmac.compare_digest(supplied_mac, expected_mac):
			raise ValueError("invalid encrypted secret")
		stream = bytearray()
		counter = 0
		while len(stream) < len(cipher):
			stream.extend(
				hmac.new(key, nonce + counter.to_bytes(4, "big"), hashlib.sha256).digest()
			)
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
	try:
		body = TURNSTILE_CLIENT.verify(TURNSTILE_SECRET_KEY, clean_token, remote_ip)
	except IntegrationError as exc:
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
		"deletionRequestedAt": row.get("deletion_requested_at") or "",
		"deletionReviewStatus": row.get("deletion_review_status") or "",
		"deletionScheduledFor": row.get("deletion_scheduled_for") or "",
	}


def account_csrf_token(token: str) -> str:
	return auth_secret_hash(f"csrf:{token}")


def create_account_session(response: Response, request: Request, user_id: str) -> str:
	if not account_auth_configured():
		raise HTTPException(status_code=503, detail="Account API is not configured")
	now = utc_now()
	region = lookup_ip_region(request)
	display_region = display_region_value(region)
	display_region_code = region.get("country_code", "")[:2].upper()
	expires_at = (
		datetime.fromtimestamp(
			time.time() + ACCOUNT_SESSION_TTL,
			tz=timezone.utc,
		)
		.isoformat()
		.replace("+00:00", "Z")
	)
	token = secrets.token_urlsafe(32)
	d1_query(
		"""
		INSERT INTO sessions
			(id, user_id, session_hash, created_at, expires_at, user_agent, ip_hash,
			 last_seen_at, display_region, display_region_code)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		""",
		[
			str(uuid.uuid4()),
			user_id,
			account_session_hash(token),
			now,
			expires_at,
			(request.headers.get("user-agent") or "")[:500],
			hashlib.sha256(client_key(request).encode("utf-8")).hexdigest(),
			now,
			display_region,
			display_region_code,
		],
	)
	d1_query(
		"UPDATE users SET last_seen_ip = ?, last_seen_at = ?, last_user_agent = ? WHERE id = ?",
		[
			request_public_ip(request),
			now,
			(request.headers.get("user-agent") or "")[:500],
			user_id,
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
			users.disabled_at,
			users.deletion_requested_at,
			users.deletion_review_status,
			users.deletion_scheduled_for,
			sessions.id AS session_id
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
	d1_query(
		"UPDATE sessions SET last_seen_at = ? WHERE id = ?", [utc_now(), rows[0]["session_id"]]
	)
	return rows[0]


def require_account_user(request: Request) -> dict[str, Any]:
	user = get_account_user(request)
	if not user:
		raise HTTPException(status_code=401, detail="Login required")
	return user


def require_account_csrf(request: Request, x_csrf_token: str | None) -> dict[str, Any]:
	token = request.cookies.get(ACCOUNT_SESSION_COOKIE, "")
	user = require_account_user(request)
	if (
		not token
		or not x_csrf_token
		or not hmac.compare_digest(x_csrf_token, account_csrf_token(token))
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
		raise HTTPException(
			status_code=400, detail="Avatar URL must start with http:// or https://"
		)
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


def normalize_comment_page_limit(limit: int, maximum: int = 200) -> int:
	return max(1, min(limit, maximum))


def encode_comment_cursor(created_at: str, comment_id: str) -> str:
	payload = json.dumps(
		{"createdAt": created_at, "id": comment_id},
		separators=(",", ":"),
	).encode("utf-8")
	return base64.urlsafe_b64encode(payload).decode("ascii").rstrip("=")


def decode_comment_cursor(cursor: str | None) -> tuple[str, str] | None:
	clean = (cursor or "").strip()
	if not clean:
		return None
	try:
		padding = "=" * (-len(clean) % 4)
		payload = json.loads(base64.urlsafe_b64decode(clean + padding))
		created_at = str(payload["createdAt"])
		comment_id = str(payload["id"])
	except (ValueError, KeyError, TypeError, json.JSONDecodeError, binascii.Error) as exc:
		raise HTTPException(status_code=400, detail="Invalid comment cursor") from exc
	if not created_at or not comment_id:
		raise HTTPException(status_code=400, detail="Invalid comment cursor")
	return created_at, comment_id


def normalize_moderation_reason(reason: str, fallback: str = "Owner moderation") -> str:
	clean = reason.strip() or fallback
	if len(clean) > 300:
		raise HTTPException(status_code=400, detail="Moderation reason is too long")
	return clean


def comment_payload(row: dict[str, Any]) -> dict[str, Any]:
	is_deleted = bool(row.get("deleted_at")) or row.get("status") == "deleted"
	author = {
		"id": row["user_id"],
		"username": row["username"],
		"displayName": row.get("display_name") or "",
		"avatarUrl": row.get("avatar_url") or "",
	}
	return {
		"id": row["id"],
		"postSlug": row["post_slug"],
		"userId": row["user_id"],
		"parentId": row.get("parent_id"),
		"rootId": row.get("root_id"),
		"content": "" if is_deleted else row["content"],
		"createdAt": row["created_at"],
		"updatedAt": row["updated_at"],
		"username": row["username"],
		"author": author,
		"isDeleted": is_deleted,
	}


def comment_reply_tree(
	root_id: str,
	reply_rows: list[dict[str, Any]],
) -> list[dict[str, Any]]:
	rows_by_parent: dict[str, list[dict[str, Any]]] = {}
	for row in reply_rows:
		parent_id = str(row.get("parent_id") or "")
		rows_by_parent.setdefault(parent_id, []).append(row)

	def children(parent_id: str, ancestors: frozenset[str]) -> list[dict[str, Any]]:
		items: list[dict[str, Any]] = []
		for row in rows_by_parent.get(parent_id, []):
			comment_id = str(row["id"])
			if comment_id in ancestors:
				continue
			replies = children(comment_id, ancestors | {comment_id})
			item = comment_payload(row)
			if item["isDeleted"] and not replies:
				continue
			items.append({**item, "replies": replies})
		return items

	return children(root_id, frozenset({root_id}))


def flatten_comment_tree(items: list[dict[str, Any]]) -> list[dict[str, Any]]:
	flat: list[dict[str, Any]] = []
	stack = list(reversed(items))
	while stack:
		item = stack.pop()
		replies = item.get("replies", [])
		flat.append({key: value for key, value in item.items() if key != "replies"})
		stack.extend(reversed(replies))
	return flat


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
		f"set_env {json.dumps(key)} {json.dumps(value)}" for key, value in updates.items()
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
				"status": "unknown"
				if web_service is None
				else ("active" if web_service else "inactive"),
			},
			"bot": {
				"name": CHAT_BOT_BOT_SERVICE,
				"active": bot_service,
				"status": "unknown"
				if bot_service is None
				else ("active" if bot_service else "inactive"),
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


CHAT_PROXY_SCRIPT = r"""
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
"""


def run_chat_proxy(
	action: str, data: dict[str, Any] | None = None, timeout: int = 60
) -> dict[str, Any]:
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
	except (IndexError, json.JSONDecodeError) as exc:
		raise HTTPException(status_code=502, detail="Invalid Chat Bot proxy response") from exc
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
	return [file_info(path, include_sha256=index == 0) for index, path in enumerate(files[:20])]


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
			values.get("LastTriggerUSecRealtime", "") or values.get("LastTriggerUSec", "")
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
		return {
			"configured": True,
			"latest": None,
			"error": "Unable to read GitHub backup releases",
		}
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
			update.get("message") or update.get("channel_post") or update.get("edited_message")
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


def default_site_settings() -> dict[str, Any]:
	return {
		"name": "SilentFlare",
		"bio": "Technical practice, product thinking, and sustainable building.",
		"avatar_url": "/assets/images/demo-avatar.png",
		"about_markdown": "# About SilentFlare\n\nSilentFlare records technical practice, product thinking, and sustainable building.",
		"backgrounds": [
			{
				"id": "default-banner",
				"type": "image",
				"url": "/assets/images/demo-banner-online.webp",
				"position": "center",
				"credit_text": "",
				"credit_url": "",
			}
		],
	}


def read_site_settings() -> dict[str, Any]:
	rows = local_db_query("SELECT settings_json, updated_at FROM site_settings WHERE id = 1")
	if not rows:
		return {**default_site_settings(), "updated_at": None}
	try:
		settings = json.loads(rows[0]["settings_json"])
	except (TypeError, json.JSONDecodeError):
		settings = default_site_settings()
	return {**default_site_settings(), **settings, "updated_at": rows[0]["updated_at"]}


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


def ensure_account_preferences(user_id: str) -> dict[str, Any]:
	rows = d1_query("SELECT * FROM account_preferences WHERE user_id = ? LIMIT 1", [user_id])
	if rows:
		return rows[0]
	now = utc_now()
	d1_query(
		"INSERT INTO account_preferences (user_id, updated_at) VALUES (?, ?)",
		[user_id, now],
	)
	return d1_query("SELECT * FROM account_preferences WHERE user_id = ? LIMIT 1", [user_id])[0]


def preference_payload(row: dict[str, Any]) -> dict[str, Any]:
	return {
		"privacy": {
			"profilePublic": bool(row.get("profile_public", 1)),
			"showRegion": bool(row.get("show_region", 1)),
			"showComments": bool(row.get("show_comments", 1)),
			"allowSearch": bool(row.get("allow_search", 1)),
			"allowDataExport": bool(row.get("allow_data_export", 1)),
		},
		"notifications": {
			"securityEmail": bool(row.get("security_email", 1)),
			"commentReplies": bool(row.get("comment_replies", 1)),
			"systemEmail": bool(row.get("system_email", 1)),
			"marketingEmail": bool(row.get("marketing_email", 0)),
		},
		"updatedAt": row.get("updated_at") or "",
	}


def record_security_event(user_id: str, event_type: str, detail: str = "") -> None:
	d1_query(
		"""
		INSERT INTO security_events (id, user_id, event_type, detail, created_at)
		VALUES (?, ?, ?, ?, ?)
		""",
		[str(uuid.uuid4()), user_id, event_type, detail[:240], utc_now()],
	)


def finalize_due_account_deletions() -> None:
	now = utc_now()
	rows = d1_query(
		"SELECT id, avatar_url FROM users WHERE deletion_review_status = 'approved' AND deletion_scheduled_for IS NOT NULL AND deletion_scheduled_for <= ?",
		[now],
	)
	for row in rows:
		user_id = str(row["id"])
		delete_managed_avatar(str(row.get("avatar_url") or ""))
		d1_query(
			"""
			UPDATE users
			SET disabled_at = ?, deletion_requested_at = NULL, deletion_review_status = NULL,
				deletion_approved_at = NULL, deletion_scheduled_for = NULL, display_name = '', avatar_url = '', bio = '',
				email = ?, username = ?, updated_at = ?
			WHERE id = ?
			""",
			[
				now,
				f"deleted-{user_id}@silentflare.local",
				f"deleted-{user_id.replace('-', '')[:24]}",
				now,
				user_id,
			],
		)
		d1_query("DELETE FROM sessions WHERE user_id = ?", [user_id])


ACCOUNT_SENSITIVE_ACTIONS = {
	"clear-profile",
	"change-password",
	"change-email",
	"enable-2fa",
	"disable-2fa",
	"export-data",
	"clear-comments",
	"deactivate-account",
	"delete-account",
}


def get_sensitive_proof(token: str, user_id: str, action: str) -> dict[str, Any]:
	if action not in ACCOUNT_SENSITIVE_ACTIONS:
		raise HTTPException(status_code=400, detail="Unsupported account action")
	flow = get_auth_flow(token, "account-sensitive-proof")
	if str(flow.get("user_id") or "") != user_id:
		raise HTTPException(status_code=403, detail="Email verification is not authorized")
	metadata = json.loads(str(flow.get("metadata_json") or "{}"))
	if not hmac.compare_digest(str(metadata.get("action") or ""), action):
		raise HTTPException(status_code=403, detail="Email verification does not match this action")
	return flow


def session_payload(row: dict[str, Any], current_session_id: str) -> dict[str, Any]:
	user_agent = str(row.get("user_agent") or "")
	device = "Browser session"
	for marker, label in (
		("Edg/", "Microsoft Edge"),
		("Chrome/", "Chrome"),
		("Firefox/", "Firefox"),
		("Safari/", "Safari"),
	):
		if marker in user_agent:
			device = label
			break
	platform = "Unknown device"
	for marker, label in (
		("Windows", "Windows"),
		("Mac OS", "macOS"),
		("iPhone", "iPhone"),
		("Android", "Android"),
		("Linux", "Linux"),
	):
		if marker in user_agent:
			platform = label
			break
	return {
		"id": row["id"],
		"device": device,
		"platform": platform,
		"region": row.get("display_region") or "Region unavailable",
		"regionCode": row.get("display_region_code") or "",
		"createdAt": row.get("created_at") or "",
		"lastActiveAt": row.get("last_seen_at") or row.get("created_at") or "",
		"expiresAt": row.get("expires_at") or "",
		"current": hmac.compare_digest(str(row["id"]), current_session_id),
	}
