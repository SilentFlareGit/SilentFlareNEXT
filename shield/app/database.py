from __future__ import annotations

import hashlib
import json
import sqlite3
import threading
import time
from contextlib import closing
from pathlib import Path
from typing import Any, Iterable


class Database:
	def __init__(self, path: Path, migration_dir: Path):
		self.path = path
		self.migration_dir = migration_dir
		self._lock = threading.RLock()
		self.path.parent.mkdir(parents=True, exist_ok=True)

	def connect(self) -> sqlite3.Connection:
		connection = sqlite3.connect(self.path, timeout=5, check_same_thread=False)
		connection.row_factory = sqlite3.Row
		connection.execute("PRAGMA foreign_keys = ON")
		connection.execute("PRAGMA busy_timeout = 5000")
		return connection

	def migrate(self) -> None:
		with self._lock, closing(self.connect()) as connection, connection:
			connection.execute("PRAGMA journal_mode = WAL")
			connection.execute(
				"CREATE TABLE IF NOT EXISTS schema_migrations (version TEXT PRIMARY KEY, applied_at INTEGER NOT NULL)"
			)
			applied = {row[0] for row in connection.execute("SELECT version FROM schema_migrations")}
			for path in sorted(self.migration_dir.glob("*.sql")):
				if path.name in applied:
					continue
				version = path.name.replace("'", "''")
				script = (
					"BEGIN IMMEDIATE;\n"
					+ path.read_text(encoding="utf-8")
					+ f"\nINSERT INTO schema_migrations(version, applied_at) VALUES ('{version}', {int(time.time())});\nCOMMIT;"
				)
				try:
					connection.executescript(script)
				except Exception:
					if connection.in_transaction:
						connection.rollback()
					raise

	def query(self, sql: str, parameters: Iterable[Any] = ()) -> list[dict[str, Any]]:
		with closing(self.connect()) as connection:
			return [dict(row) for row in connection.execute(sql, tuple(parameters)).fetchall()]

	def execute(self, sql: str, parameters: Iterable[Any] = ()) -> int:
		with self._lock, closing(self.connect()) as connection, connection:
			cursor = connection.execute(sql, tuple(parameters))
			return int(cursor.lastrowid)

	def transaction(self, callback):
		with self._lock, closing(self.connect()) as connection, connection:
			connection.execute("BEGIN IMMEDIATE")
			return callback(connection)

	def setting(self, key: str, default: Any) -> Any:
		rows = self.query("SELECT value_json FROM settings WHERE key = ?", (key,))
		return json.loads(rows[0]["value_json"]) if rows else default

	def set_setting(self, key: str, value: Any, actor: str) -> None:
		now = int(time.time())
		self.execute(
			"""
			INSERT INTO settings(key, value_json, updated_at, updated_by) VALUES (?, ?, ?, ?)
			ON CONFLICT(key) DO UPDATE SET value_json=excluded.value_json, updated_at=excluded.updated_at,
			updated_by=excluded.updated_by
			""",
			(key, json.dumps(value, separators=(",", ":")), now, actor),
		)

	def audit(self, actor: str, action: str, target_type: str, target_id: str | None, details: Any, trace_id: str | None = None) -> None:
		self.execute(
			"INSERT INTO audit_log(created_at, actor, action, target_type, target_id, details_json, trace_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
			(int(time.time()), actor, action, target_type, target_id, json.dumps(details, separators=(",", ":")), trace_id),
		)


def stable_hash(value: str, key: str) -> str:
	return hashlib.sha256(f"{key}:{value}".encode("utf-8")).hexdigest()


def mask_ip(ip: str) -> str:
	if ":" in ip:
		parts = ip.split(":")
		return ":".join(parts[:3]) + "::/48"
	parts = ip.split(".")
	return ".".join(parts[:3] + ["0/24"]) if len(parts) == 4 else "unknown"
