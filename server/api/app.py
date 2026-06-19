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
from urllib.parse import quote, urlencode
from urllib.request import Request as UrlRequest, urlopen

from fastapi import FastAPI, Header, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

APP_NAME = "SilentFlare Bot API"
TELEGRAM_OWNER_ID = int(os.getenv("TELEGRAM_OWNER_ID", "8737100423"))
BACKUP_SCRIPT = Path(
	os.getenv("BACKUP_SCRIPT", "/opt/silentflare/deploy/ghost-db-backup.sh")
)
BACKUP_DIR = Path(os.getenv("BACKUP_DIR", "/opt/silentflare/backups/ghost-db"))
ADMIN_TOKEN = os.getenv("API_ADMIN_TOKEN", "")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")
TELEGRAM_WEBHOOK_SECRET = os.getenv("TELEGRAM_WEBHOOK_SECRET", "")
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

BOTS = [
	{
		"id": "ghost-db-backup",
		"name": "Ghost database backup bot",
		"purpose": "Database backup",
		"status": "active",
		"auth_method": os.getenv("GHOST_DB_BACKUP_AUTH_METHOD", "telegram"),
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


class TotpEnablePayload(BaseModel):
	secret: str
	code: str


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
	if bot_id is not None and session.get("bot_id") != bot_id:
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


def ensure_telegram_auth_bot(bot: dict[str, str]) -> None:
	if bot["auth_method"] != "telegram":
		raise HTTPException(status_code=400, detail="This bot does not use Telegram authorization")
	if not TELEGRAM_BOT_TOKEN:
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


def telegram_api(method: str, payload: dict[str, Any]) -> dict[str, Any]:
	if not TELEGRAM_BOT_TOKEN:
		raise HTTPException(status_code=503, detail="Telegram bot token is not configured")
	data = json.dumps(payload).encode()
	request = UrlRequest(
		f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/{method}",
		data=data,
		method="POST",
	)
	request.add_header("Content-Type", "application/json")
	with urlopen(request, timeout=20) as response:
		body = json.loads(response.read().decode("utf-8"))
	if not body.get("ok"):
		raise HTTPException(status_code=502, detail="Telegram API request failed")
	return body


def send_login_approval(bot: dict[str, str], challenge: dict[str, Any]) -> None:
	telegram_api(
		"sendMessage",
		{
			"chat_id": TELEGRAM_OWNER_ID,
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


def answer_callback(callback_id: str, text: str, alert: bool = False) -> None:
	telegram_api(
		"answerCallbackQuery",
		{
			"callback_query_id": callback_id,
			"text": text,
			"show_alert": alert,
		},
	)


def approve_login_challenge(challenge_id: str, telegram_user_id: int) -> bool:
	challenge = LOGIN_CHALLENGES.get(challenge_id)
	if not challenge or challenge["expires_at"] <= time.time():
		LOGIN_CHALLENGES.pop(challenge_id, None)
		return False
	if telegram_user_id != TELEGRAM_OWNER_ID:
		return False
	if challenge["status"] == "approved":
		return True
	challenge["status"] = "approved"
	challenge["approved_at"] = time.time()
	return True


def bot_totp_env_name(bot_id: str) -> str:
	return f"BOT_{bot_id.upper().replace('-', '_')}_TOTP_SECRET"


def bot_totp_secret(bot_id: str) -> str:
	return os.getenv(bot_totp_env_name(bot_id), "")


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
	for bot in BOTS:
		if bot["id"] == bot_id:
			return bot
	raise HTTPException(status_code=404, detail="Bot not found")


def sha256_file(path: Path) -> str:
	digest = hashlib.sha256()
	with path.open("rb") as handle:
		for chunk in iter(lambda: handle.read(1024 * 1024), b""):
			digest.update(chunk)
	return digest.hexdigest()


def file_info(path: Path) -> dict[str, Any]:
	stat = path.stat()
	created = datetime.fromtimestamp(stat.st_mtime, tz=timezone.utc)
	return {
		"filename": path.name,
		"size": stat.st_size,
		"created_at": created.isoformat().replace("+00:00", "Z"),
		"sha256": sha256_file(path),
	}


def list_backups() -> list[dict[str, Any]]:
	if not BACKUP_DIR.exists():
		return []
	files = sorted(
		BACKUP_DIR.glob("ghost-db-*.sql.gz"),
		key=lambda item: item.stat().st_mtime,
		reverse=True,
	)
	return [file_info(path) for path in files[:20]]


def timer_active() -> bool:
	result = subprocess.run(
		["systemctl", "is-active", "silentflare-ghost-db-backup.timer"],
		check=False,
		capture_output=True,
		text=True,
	)
	return result.stdout.strip() == "active"


def resolve_telegram_chat_id() -> str:
	if TELEGRAM_CHAT_ID:
		return TELEGRAM_CHAT_ID
	if TELEGRAM_OWNER_ID:
		return str(TELEGRAM_OWNER_ID)
	if not TELEGRAM_BOT_TOKEN:
		return ""
	with urlopen(
		f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getUpdates",
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


def notify_telegram(text: str) -> bool:
	chat_id = resolve_telegram_chat_id()
	if not TELEGRAM_BOT_TOKEN or not chat_id:
		return False
	data = urlencode({"chat_id": chat_id, "text": text}).encode()
	request = UrlRequest(
		f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
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
	return {
		"methods": {
			"telegram": bool(TELEGRAM_BOT_TOKEN),
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
		send_login_approval(bot, challenge)
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
	challenge = get_login_challenge(
		payload.challenge_id,
		str(payload.bot_id or ""),
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
	if TELEGRAM_WEBHOOK_SECRET and not hmac.compare_digest(token, TELEGRAM_WEBHOOK_SECRET):
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
	approved = approve_login_challenge(challenge_id, user_id)
	if callback_id:
		answer_callback(
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
def backup_status(bot_id: str, request: Request) -> dict[str, Any]:
	require_session(request, bot_id=bot_id)
	ensure_bot(bot_id)
	backups = list_backups()
	return {
		"bot_id": bot_id,
		"timer_active": timer_active(),
		"latest": backups[0] if backups else None,
		"backups": backups,
		"message": "Local Ghost database backups are available."
		if backups
		else "No local backups found.",
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
	ensure_bot(bot_id)
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
			"SilentFlare full MySQL backup completed: "
			f"{latest['filename']} sha256={latest['sha256']} size={latest['size']}"
		)
	message = "Backup completed and local file was created."
	if latest and not notification_sent:
		message += " Telegram notification was not sent."
	return {
		"ok": True,
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
	ensure_bot(bot_id)
	if not TELEGRAM_BOT_TOKEN or not resolve_telegram_chat_id():
		raise HTTPException(
			status_code=503,
			detail="Telegram token is not configured or no chat has messaged the bot",
		)
	if not notify_telegram("SilentFlare Bot Management test notification."):
		raise HTTPException(status_code=503, detail="Telegram notification could not be sent")
	return {"ok": True, "message": "Telegram test notification sent."}
