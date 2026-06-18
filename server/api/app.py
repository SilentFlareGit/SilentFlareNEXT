from __future__ import annotations

import json
import hashlib
import hmac
import os
import secrets
import subprocess
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urlencode
from urllib.request import Request as UrlRequest, urlopen

from fastapi import FastAPI, Header, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

APP_NAME = "SilentFlare Bot API"
BACKUP_SCRIPT = Path(
	os.getenv("BACKUP_SCRIPT", "/opt/silentflare/deploy/ghost-db-backup.sh")
)
BACKUP_DIR = Path(os.getenv("BACKUP_DIR", "/opt/silentflare/backups/ghost-db"))
ADMIN_TOKEN = os.getenv("API_ADMIN_TOKEN", "")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")
WEB_ADMIN_USERNAME = os.getenv("WEB_ADMIN_USERNAME", "admin")
WEB_ADMIN_PASSWORD_HASH = os.getenv("WEB_ADMIN_PASSWORD_HASH", "")
WEB_SESSION_TTL = int(os.getenv("WEB_SESSION_TTL", "43200"))
WEB_COOKIE_SECURE = os.getenv("WEB_COOKIE_SECURE", "1") != "0"
WEB_LOGIN_ATTEMPTS = int(os.getenv("WEB_LOGIN_ATTEMPTS", "5"))
WEB_LOGIN_WINDOW_SECONDS = int(os.getenv("WEB_LOGIN_WINDOW_SECONDS", "900"))
WEB_LOGIN_SESSION_EPOCH = os.getenv("WEB_LOGIN_SESSION_EPOCH", "")
SESSION_COOKIE = "sf_bot_session"
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
	}
]

SESSIONS: dict[str, dict[str, Any]] = {}
LOGIN_FAILURES: dict[str, list[float]] = {}


class LoginPayload(BaseModel):
	username: str
	password: str


def make_password_hash(password: str, iterations: int = 260000) -> str:
	salt = secrets.token_hex(16)
	digest = hashlib.pbkdf2_hmac(
		"sha256",
		password.encode("utf-8"),
		salt.encode("utf-8"),
		iterations,
	)
	return f"{PBKDF2_PREFIX}${iterations}${salt}${digest.hex()}"


def verify_password(password: str, password_hash: str) -> bool:
	try:
		prefix, iterations, salt, digest = password_hash.split("$", 3)
	except ValueError:
		return False
	if prefix != PBKDF2_PREFIX:
		return False
	candidate = hashlib.pbkdf2_hmac(
		"sha256",
		password.encode("utf-8"),
		salt.encode("utf-8"),
		int(iterations),
	).hex()
	return hmac.compare_digest(candidate, digest)


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


def create_session(response: Response) -> dict[str, str]:
	cleanup_sessions()
	session_id = secrets.token_urlsafe(32)
	csrf = secrets.token_urlsafe(32)
	SESSIONS[session_id] = {
		"csrf": csrf,
		"expires_at": time.time() + WEB_SESSION_TTL,
		"login_epoch": WEB_LOGIN_SESSION_EPOCH,
		"username": WEB_ADMIN_USERNAME,
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
	return {"csrf": csrf, "username": WEB_ADMIN_USERNAME}


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
	x_csrf_token: str | None = None,
	require_csrf: bool = False,
) -> dict[str, Any]:
	session = get_session(request)
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


def notify_telegram(text: str) -> None:
	chat_id = resolve_telegram_chat_id()
	if not TELEGRAM_BOT_TOKEN or not chat_id:
		return
	data = urlencode({"chat_id": chat_id, "text": text}).encode()
	request = UrlRequest(
		f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
		data=data,
		method="POST",
	)
	with urlopen(request, timeout=20) as response:
		response.read()


@app.get("/health")
def health() -> dict[str, Any]:
	return {"ok": True, "service": APP_NAME}


@app.get("/auth/me")
def auth_me(request: Request) -> dict[str, Any]:
	session = get_session(request)
	return {
		"authenticated": True,
		"username": session["username"],
		"csrf": session["csrf"],
	}


@app.post("/auth/login")
def auth_login(
	payload: LoginPayload,
	request: Request,
	response: Response,
) -> dict[str, Any]:
	check_login_rate_limit(request)
	if not WEB_ADMIN_PASSWORD_HASH:
		raise HTTPException(status_code=503, detail="Login password is not configured")
	if payload.username != WEB_ADMIN_USERNAME or not verify_password(
		payload.password,
		WEB_ADMIN_PASSWORD_HASH,
	):
		record_login_failure(request)
		raise HTTPException(status_code=401, detail="Invalid username or password")
	LOGIN_FAILURES.pop(client_key(request), None)
	session = create_session(response)
	return {"ok": True, **session}


@app.post("/auth/logout")
def auth_logout(
	request: Request,
	response: Response,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	require_session(request, x_csrf_token, require_csrf=True)
	destroy_session(request, response)
	return {"ok": True}


@app.get("/bots")
def bots(request: Request) -> dict[str, Any]:
	require_session(request)
	return {"bots": BOTS}


@app.get("/bots/{bot_id}")
def bot(bot_id: str, request: Request) -> dict[str, Any]:
	require_session(request)
	return ensure_bot(bot_id)


@app.get("/bots/{bot_id}/backup/status")
def backup_status(bot_id: str, request: Request) -> dict[str, Any]:
	require_session(request)
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
		require_session(request, x_csrf_token, require_csrf=True)
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
	if latest:
		notify_telegram(
			"SilentFlare Ghost DB backup completed: "
			f"{latest['filename']} sha256={latest['sha256']} size={latest['size']}"
		)
	return {
		"ok": True,
		"latest": latest,
		"message": "Backup completed and local file was created.",
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
		require_session(request, x_csrf_token, require_csrf=True)
	ensure_bot(bot_id)
	if not TELEGRAM_BOT_TOKEN or not resolve_telegram_chat_id():
		raise HTTPException(
			status_code=503,
			detail="Telegram token is not configured or no chat has messaged the bot",
		)
	notify_telegram("SilentFlare Bot Management test notification.")
	return {"ok": True, "message": "Telegram test notification sent."}
