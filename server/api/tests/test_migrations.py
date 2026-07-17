from __future__ import annotations

import sqlite3
from pathlib import Path

from server.api.silentflare_api.db.migrations import migrate_database


def table_columns(path: Path, table: str) -> set[str]:
	with sqlite3.connect(path) as connection:
		return {str(row[1]) for row in connection.execute(f'PRAGMA table_info("{table}")')}


def test_migrations_create_current_schema_and_are_idempotent(tmp_path: Path) -> None:
	path = tmp_path / "fresh.db"
	assert migrate_database(path) == ["0001", "0002"]
	assert migrate_database(path) == []
	assert {"root_id", "created_ip"} <= table_columns(path, "comments")
	assert {"deletion_requested_at", "deletion_scheduled_for"} <= table_columns(path, "users")
	assert {"id", "job_type", "idempotency_key", "status"} <= table_columns(path, "jobs")


def test_migrations_normalize_legacy_database(tmp_path: Path) -> None:
	path = tmp_path / "legacy.db"
	with sqlite3.connect(path) as connection:
		connection.executescript(
			"""
			CREATE TABLE users (
				id TEXT PRIMARY KEY,
				email TEXT UNIQUE NOT NULL,
				username TEXT UNIQUE NOT NULL,
				password_hash TEXT NOT NULL,
				password_salt TEXT NOT NULL,
				role TEXT NOT NULL,
				created_at TEXT NOT NULL,
				updated_at TEXT NOT NULL,
				disabled_at TEXT
			);
			CREATE TABLE comments (
				id TEXT PRIMARY KEY,
				post_slug TEXT NOT NULL,
				user_id TEXT NOT NULL,
				parent_id TEXT,
				content TEXT NOT NULL,
				status TEXT NOT NULL,
				created_at TEXT NOT NULL,
				updated_at TEXT NOT NULL,
				deleted_at TEXT
			);
			"""
		)

	assert migrate_database(path) == ["0001", "0002"]
	assert {"root_id", "created_ip"} <= table_columns(path, "comments")
	assert {"display_name", "totp_enabled", "deletion_review_status"} <= table_columns(
		path, "users"
	)
