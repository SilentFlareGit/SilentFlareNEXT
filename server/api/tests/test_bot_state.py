from __future__ import annotations

import time
from pathlib import Path

from server.api.silentflare_api.db.bot_state import BotStateRepository
from server.api.silentflare_api.db.database import Database


def test_bot_sessions_and_challenges_survive_repository_restart(tmp_path: Path) -> None:
	database = Database(tmp_path / "bot-state.db")
	first = BotStateRepository(database, "s" * 32)
	now = int(time.time())
	first.create_session("session-token", "Telegram Chat Bot", now + 300, "epoch")
	first.create_challenge(
		"challenge-token",
		"Telegram Chat Bot",
		"203.0.113.10",
		now,
		now + 300,
	)

	second = BotStateRepository(Database(database.path), "s" * 32)
	session = second.session("session-token")
	challenge = second.challenge("challenge-token", "203.0.113.10")

	assert session is not None
	assert session["bot_id"] == "Telegram Chat Bot"
	assert session["csrf"] == first.csrf_token("session-token")
	assert challenge is not None
	assert challenge["status"] == "pending"
	assert second.approve_challenge("challenge-token") is True
	assert second.challenge("challenge-token")["status"] == "approved"


def test_bot_state_never_stores_raw_tokens(tmp_path: Path) -> None:
	path = tmp_path / "bot-state.db"
	repository = BotStateRepository(Database(path), "s" * 32)
	repository.create_session("raw-session-token", "SilentFlare Admin", int(time.time()) + 60, "")
	repository.create_challenge(
		"raw-challenge-token",
		"SilentFlare Admin",
		"198.51.100.10",
		int(time.time()),
		int(time.time()) + 60,
	)

	assert b"raw-session-token" not in path.read_bytes()
	assert b"raw-challenge-token" not in path.read_bytes()
