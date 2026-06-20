from __future__ import annotations

import json
import base64
import binascii
import hashlib
import hmac
import os
import secrets
import struct
import subprocess
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.error import HTTPError
from urllib.parse import quote, urlencode
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
LOGIN_CHALLENGE_TTL = 5 * 60
PBKDF2_PREFIX = "pbkdf2_sha256"

app = FastAPI(title=APP_NAME)
app.add_middleware(
	CORSMiddleware,
	allow_origins=[
		"https://blog.silentflare.com",
		"https://tgbot.silentflare.com",
		"https://tgbotmanagement.silentflare.com",
		"http://blog.silentflare.com",
		"http://tgbot.silentflare.com",
		"http://tgbotmanagement.silentflare.com",
	],
	allow_credentials=True,
	allow_methods=["GET", "POST", "OPTIONS"],
	allow_headers=["Content-Type", "X-Admin-Token", "X-CSRF-Token"],
)

BACKUP_BOT_ID = "SilentFlare DB Backup"
BACKUP_BOT_ALIASES = {"ghost-db-backup", "silentflare-db-backup"}
BACKUP_BOT_DESCRIPTION = (
	"Complete all-database backup that remains valid across schema changes."
)
CHAT_BOT_ID = "Telegram Chat Bot"
CHAT_BOT_ALIASES = {"telegram-chat-bot", "messages-helper-bot"}
CHAT_BOT_DESCRIPTION = "Owner-controlled Telegram chat relay and web operations console."

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
	{
		"id": CHAT_BOT_ID,
		"name": "Telegram Chat Bot",
		"purpose": CHAT_BOT_DESCRIPTION,
		"status": "active",
		"auth_method": os.getenv("TELEGRAM_CHAT_BOT_AUTH_METHOD", "telegram"),
	}
]

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
	if normalized == CHAT_BOT_ID or normalized in CHAT_BOT_ALIASES:
		return CHAT_BOT_ID
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


def telegram_auth_config(bot_id: str) -> dict[str, Any]:
	normalized = normalize_bot_id(bot_id)
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
	for bot in BOTS:
		config = telegram_auth_config(bot["id"])
		secret = str(config.get("webhook_secret") or "")
		if secret and hmac.compare_digest(token, secret):
			return config
	if not token and not any(
		telegram_auth_config(bot["id"]).get("webhook_secret") for bot in BOTS
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
				"SilentFlare Bot Management login requested.\n"
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
			"SilentFlare Bot Management login approved.\n"
			f"Bot: {challenge['bot_id']}\n"
			"This approval link is now expired."
		)
	else:
		text = (
			"SilentFlare Bot Management login request is expired or unauthorized.\n"
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


def ensure_bot(bot_id: str) -> dict[str, str]:
	bot_id = normalize_bot_id(bot_id)
	for bot in BOTS:
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
	telegram_ready = any(bool(telegram_auth_config(bot["id"])["token"]) for bot in BOTS)
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
	require_session(request, x_csrf_token=x_csrf_token, require_csrf=True)
	destroy_session(request, response)
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
