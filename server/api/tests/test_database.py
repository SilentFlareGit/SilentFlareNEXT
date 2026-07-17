from __future__ import annotations

from pathlib import Path

import pytest

from server.api.silentflare_api.db.database import Database, DatabaseError


def test_database_uses_wal_and_rolls_back_transactions(tmp_path: Path) -> None:
	database = Database(tmp_path / "account.db")
	database.query("CREATE TABLE sample(id INTEGER PRIMARY KEY, value TEXT NOT NULL)")
	database.execute_many([("INSERT INTO sample(value) VALUES (?)", ("kept",))])

	with pytest.raises(DatabaseError):
		database.execute_many(
			[
				("INSERT INTO sample(value) VALUES (?)", ("rolled-back",)),
				("INSERT INTO missing(value) VALUES (?)", ("failure",)),
			]
		)

	assert database.query("SELECT value FROM sample") == [{"value": "kept"}]
	assert database.health() == {"ok": True, "journalMode": "wal"}
