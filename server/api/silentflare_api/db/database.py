from __future__ import annotations

import sqlite3
from collections.abc import Iterator, Sequence
from contextlib import closing, contextmanager
from pathlib import Path
from typing import Any


class DatabaseError(RuntimeError):
	pass


class Database:
	"""Small SQLite unit-of-work wrapper shared by domain repositories."""

	def __init__(self, path: Path, *, busy_timeout_ms: int = 5_000) -> None:
		self.path = path
		self.busy_timeout_ms = busy_timeout_ms

	def connect(self) -> sqlite3.Connection:
		self.path.parent.mkdir(parents=True, exist_ok=True)
		connection = sqlite3.connect(self.path, timeout=self.busy_timeout_ms / 1000)
		connection.row_factory = sqlite3.Row
		connection.execute("PRAGMA foreign_keys = ON")
		connection.execute(f"PRAGMA busy_timeout = {self.busy_timeout_ms}")
		connection.execute("PRAGMA journal_mode = WAL")
		return connection

	@contextmanager
	def transaction(self, *, immediate: bool = False) -> Iterator[sqlite3.Connection]:
		connection = self.connect()
		try:
			connection.execute("BEGIN IMMEDIATE" if immediate else "BEGIN")
			yield connection
			connection.commit()
		except sqlite3.Error as exc:
			connection.rollback()
			raise DatabaseError("SQLite transaction failed") from exc
		finally:
			connection.close()

	def query(self, sql: str, params: Sequence[Any] = ()) -> list[dict[str, Any]]:
		try:
			with closing(self.connect()) as connection:
				cursor = connection.execute(sql, params)
				if cursor.description is None:
					connection.commit()
					return []
				return [dict(row) for row in cursor.fetchall()]
		except sqlite3.Error as exc:
			raise DatabaseError("SQLite query failed") from exc

	def execute_many(self, statements: Sequence[tuple[str, Sequence[Any]]]) -> None:
		with self.transaction(immediate=True) as connection:
			for sql, params in statements:
				connection.execute(sql, params)

	def health(self) -> dict[str, Any]:
		try:
			with closing(self.connect()) as connection:
				connection.execute("SELECT 1").fetchone()
				journal_mode = connection.execute("PRAGMA journal_mode").fetchone()[0]
			return {"ok": True, "journalMode": str(journal_mode).lower()}
		except sqlite3.Error:
			return {"ok": False, "journalMode": "unknown"}
