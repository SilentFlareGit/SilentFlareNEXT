from __future__ import annotations

import hashlib
import hmac
import threading
import time
from typing import Any

from .database import Database
from .migrations import migrate_database


class BotStateRepository:
	"""Durable, hash-only storage for bot sessions and login challenges."""

	def __init__(self, database: Database, secret: str) -> None:
		self.database = database
		self.secret = secret
		self._migrated = False
		self._migration_lock = threading.Lock()

	def _digest(self, purpose: str, value: str) -> str:
		if len(self.secret) < 32:
			raise RuntimeError("Bot state secret is not configured")
		return hmac.new(
			self.secret.encode("utf-8"),
			f"{purpose}:{value}".encode("utf-8"),
			hashlib.sha256,
		).hexdigest()

	def _ready(self) -> None:
		if self._migrated:
			return
		with self._migration_lock:
			if not self._migrated:
				migrate_database(self.database.path)
				self._migrated = True

	def csrf_token(self, session_id: str) -> str:
		return self._digest("bot-csrf", session_id)

	def cleanup(self, now: int | None = None) -> None:
		self._ready()
		current = now or int(time.time())
		self.database.execute_many(
			[
				("DELETE FROM bot_sessions WHERE expires_at <= ?", (current,)),
				("DELETE FROM bot_login_challenges WHERE expires_at <= ?", (current,)),
				("DELETE FROM bot_login_failures WHERE failed_at < ?", (current - 86_400,)),
			]
		)

	def create_session(
		self,
		session_id: str,
		bot_id: str,
		expires_at: int,
		login_epoch: str,
	) -> dict[str, Any]:
		self._ready()
		csrf = self.csrf_token(session_id)
		self.database.query(
			"""
			INSERT INTO bot_sessions
				(id_hash, bot_id, csrf_hash, created_at, expires_at, login_epoch)
			VALUES (?, ?, ?, ?, ?, ?)
			""",
			(
				self._digest("bot-session", session_id),
				bot_id,
				self._digest("bot-csrf-value", csrf),
				int(time.time()),
				expires_at,
				login_epoch,
			),
		)
		return {
			"bot_id": bot_id,
			"csrf": csrf,
			"expires_at": expires_at,
			"login_epoch": login_epoch,
		}

	def session(self, session_id: str) -> dict[str, Any] | None:
		self._ready()
		rows = self.database.query(
			"""
			SELECT bot_id, expires_at, login_epoch
			FROM bot_sessions
			WHERE id_hash = ? AND expires_at > ?
			LIMIT 1
			""",
			(self._digest("bot-session", session_id), int(time.time())),
		)
		if not rows:
			return None
		return {**rows[0], "csrf": self.csrf_token(session_id)}

	def touch_session(self, session_id: str, expires_at: int) -> None:
		self._ready()
		self.database.query(
			"UPDATE bot_sessions SET expires_at = ? WHERE id_hash = ?",
			(expires_at, self._digest("bot-session", session_id)),
		)

	def delete_session(self, session_id: str) -> None:
		self._ready()
		self.database.query(
			"DELETE FROM bot_sessions WHERE id_hash = ?",
			(self._digest("bot-session", session_id),),
		)

	def revoke_bot(self, bot_id: str) -> None:
		self._ready()
		self.database.execute_many(
			[
				("DELETE FROM bot_sessions WHERE bot_id = ?", (bot_id,)),
				("DELETE FROM bot_login_challenges WHERE bot_id = ?", (bot_id,)),
			]
		)

	def create_challenge(
		self,
		challenge_id: str,
		bot_id: str,
		client: str,
		created_at: int,
		expires_at: int,
	) -> dict[str, Any]:
		self._ready()
		self.database.query(
			"""
			INSERT INTO bot_login_challenges
				(id_hash, bot_id, client_hash, status, created_at, expires_at)
			VALUES (?, ?, ?, 'pending', ?, ?)
			""",
			(
				self._digest("bot-challenge", challenge_id),
				bot_id,
				self._digest("bot-client", client),
				created_at,
				expires_at,
			),
		)
		return {
			"id": challenge_id,
			"bot_id": bot_id,
			"client": client,
			"status": "pending",
			"created_at": created_at,
			"expires_at": expires_at,
		}

	def challenge(self, challenge_id: str, client: str | None = None) -> dict[str, Any] | None:
		self._ready()
		params: list[Any] = [self._digest("bot-challenge", challenge_id), int(time.time())]
		client_clause = ""
		if client is not None:
			client_clause = " AND client_hash = ?"
			params.append(self._digest("bot-client", client))
		rows = self.database.query(
			f"""
			SELECT bot_id, status, created_at, expires_at, message_chat_id, message_id
			FROM bot_login_challenges
			WHERE id_hash = ? AND expires_at > ?{client_clause}
			LIMIT 1
			""",
			params,
		)
		if not rows:
			return None
		row = rows[0]
		return {
			"id": challenge_id,
			"bot_id": row["bot_id"],
			"status": row["status"],
			"created_at": row["created_at"],
			"expires_at": row["expires_at"],
			"telegram_chat_id": row.get("message_chat_id"),
			"telegram_message_id": row.get("message_id"),
		}

	def set_challenge_message(self, challenge_id: str, chat_id: Any, message_id: Any) -> None:
		self._ready()
		self.database.query(
			"""
			UPDATE bot_login_challenges
			SET message_chat_id = ?, message_id = ?
			WHERE id_hash = ?
			""",
			(
				str(chat_id or ""),
				str(message_id or ""),
				self._digest("bot-challenge", challenge_id),
			),
		)

	def approve_challenge(self, challenge_id: str) -> bool:
		self._ready()
		with self.database.transaction(immediate=True) as connection:
			cursor = connection.execute(
				"""
				UPDATE bot_login_challenges
				SET status = 'approved'
				WHERE id_hash = ? AND status = 'pending' AND expires_at > ?
				""",
				(self._digest("bot-challenge", challenge_id), int(time.time())),
			)
			return cursor.rowcount == 1

	def delete_challenge(self, challenge_id: str) -> None:
		self._ready()
		self.database.query(
			"DELETE FROM bot_login_challenges WHERE id_hash = ?",
			(self._digest("bot-challenge", challenge_id),),
		)

	def failure_count(self, client: str, window_seconds: int) -> int:
		self._ready()
		cutoff = int(time.time()) - window_seconds
		rows = self.database.query(
			"SELECT COUNT(*) AS count FROM bot_login_failures WHERE client_hash = ? AND failed_at >= ?",
			(self._digest("bot-client", client), cutoff),
		)
		return int(rows[0]["count"] if rows else 0)

	def record_failure(self, client: str) -> None:
		self._ready()
		self.database.query(
			"INSERT INTO bot_login_failures(client_hash, failed_at) VALUES (?, ?)",
			(self._digest("bot-client", client), int(time.time())),
		)

	def clear_failures(self, client: str) -> None:
		self._ready()
		self.database.query(
			"DELETE FROM bot_login_failures WHERE client_hash = ?",
			(self._digest("bot-client", client),),
		)
