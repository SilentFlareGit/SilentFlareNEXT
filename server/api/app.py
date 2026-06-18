from __future__ import annotations

import hashlib
import os
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware

APP_NAME = "SilentFlare Bot API"
BACKUP_SCRIPT = Path(
	os.getenv("BACKUP_SCRIPT", "/opt/silentflare/deploy/ghost-db-backup.sh")
)
BACKUP_DIR = Path(os.getenv("BACKUP_DIR", "/opt/silentflare/backups/ghost-db"))
ADMIN_TOKEN = os.getenv("API_ADMIN_TOKEN", "")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")

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
	allow_methods=["GET", "POST", "OPTIONS"],
	allow_headers=["Content-Type", "X-Admin-Token"],
)

BOTS = [
	{
		"id": "ghost-db-backup",
		"name": "Ghost database backup bot",
		"purpose": "Database backup",
		"status": "active",
	}
]


def require_admin(x_admin_token: str | None) -> None:
	if not ADMIN_TOKEN:
		raise HTTPException(status_code=503, detail="Admin token is not configured")
	if not x_admin_token or not hashlib.compare_digest(x_admin_token, ADMIN_TOKEN):
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


def notify_telegram(text: str) -> None:
	if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
		return
	data = urlencode({"chat_id": TELEGRAM_CHAT_ID, "text": text}).encode()
	request = Request(
		f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
		data=data,
		method="POST",
	)
	with urlopen(request, timeout=20) as response:
		response.read()


@app.get("/health")
def health() -> dict[str, Any]:
	return {"ok": True, "service": APP_NAME}


@app.get("/bots")
def bots() -> dict[str, Any]:
	return {"bots": BOTS}


@app.get("/bots/{bot_id}")
def bot(bot_id: str) -> dict[str, Any]:
	return ensure_bot(bot_id)


@app.get("/bots/{bot_id}/backup/status")
def backup_status(bot_id: str) -> dict[str, Any]:
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
	bot_id: str, x_admin_token: str | None = Header(default=None)
) -> dict[str, Any]:
	require_admin(x_admin_token)
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
	bot_id: str, x_admin_token: str | None = Header(default=None)
) -> dict[str, Any]:
	require_admin(x_admin_token)
	ensure_bot(bot_id)
	if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
		raise HTTPException(
			status_code=503,
			detail="Telegram token or chat id is not configured",
		)
	notify_telegram("SilentFlare Bot Management test notification.")
	return {"ok": True, "message": "Telegram test notification sent."}
