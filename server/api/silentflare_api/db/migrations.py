from __future__ import annotations

import hashlib
import hmac
import sqlite3
from contextlib import closing
from pathlib import Path

MIGRATIONS_DIR = Path(__file__).resolve().parents[2] / "migrations"

LEGACY_COLUMNS: dict[str, tuple[tuple[str, str], ...]] = {
	"users": (
		("display_name", "TEXT"),
		("avatar_url", "TEXT"),
		("bio", "TEXT"),
		("email_verified_at", "TEXT"),
		("totp_secret", "TEXT"),
		("totp_enabled", "INTEGER NOT NULL DEFAULT 0"),
		("display_region", "TEXT"),
		("display_region_code", "TEXT"),
		("display_region_updated_at", "TEXT"),
		("tos_version", "TEXT"),
		("tos_accepted_at", "TEXT"),
		("registration_ip", "TEXT"),
		("last_seen_ip", "TEXT"),
		("last_seen_at", "TEXT"),
		("last_user_agent", "TEXT"),
		("deletion_requested_at", "TEXT"),
		("deletion_review_status", "TEXT"),
		("deletion_approved_at", "TEXT"),
		("deletion_scheduled_for", "TEXT"),
	),
	"sessions": (
		("last_seen_at", "TEXT"),
		("display_region", "TEXT"),
		("display_region_code", "TEXT"),
	),
	"comments": (
		("root_id", "TEXT REFERENCES comments(id)"),
		("created_ip", "TEXT"),
	),
	"email_verifications": (
		("code_hash", "TEXT"),
		("created_at", "TEXT"),
		("attempts", "INTEGER NOT NULL DEFAULT 0"),
		("request_ip_hash", "TEXT"),
	),
}


class MigrationError(RuntimeError):
	pass


def _table_exists(connection: sqlite3.Connection, table: str) -> bool:
	return (
		connection.execute(
			"SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?",
			(table,),
		).fetchone()
		is not None
	)


def _upgrade_legacy_columns(connection: sqlite3.Connection) -> None:
	for table, definitions in LEGACY_COLUMNS.items():
		if not _table_exists(connection, table):
			continue
		existing = {str(row[1]) for row in connection.execute(f'PRAGMA table_info("{table}")')}
		for column, definition in definitions:
			if column not in existing:
				connection.execute(f'ALTER TABLE "{table}" ADD COLUMN "{column}" {definition}')


def migrate_database(path: Path, migrations_dir: Path = MIGRATIONS_DIR) -> list[str]:
	"""Apply checksummed SQL migrations, including one-time legacy normalization."""

	path.parent.mkdir(parents=True, exist_ok=True)
	applied_now: list[str] = []
	try:
		with closing(sqlite3.connect(path, timeout=30)) as connection:
			connection.execute("PRAGMA foreign_keys = ON")
			connection.execute("PRAGMA busy_timeout = 30000")
			connection.execute("PRAGMA journal_mode = WAL")
			connection.execute(
				"""
				CREATE TABLE IF NOT EXISTS schema_migrations (
					version TEXT PRIMARY KEY,
					checksum TEXT NOT NULL,
					applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
				)
				"""
			)
			applied = {
				str(row[0]): str(row[1])
				for row in connection.execute("SELECT version, checksum FROM schema_migrations")
			}
			for migration in sorted(migrations_dir.glob("[0-9][0-9][0-9][0-9]_*.sql")):
				version = migration.stem.split("_", 1)[0]
				sql = migration.read_text(encoding="utf-8")
				checksum = hashlib.sha256(sql.encode("utf-8")).hexdigest()
				if version in applied:
					if not hmac.compare_digest(applied[version], checksum):
						raise MigrationError(f"Migration {version} checksum changed")
					continue
				if version == "0001":
					_upgrade_legacy_columns(connection)
				connection.executescript(sql)
				if version == "0001":
					_upgrade_legacy_columns(connection)
				connection.execute(
					"INSERT INTO schema_migrations(version, checksum) VALUES (?, ?)",
					(version, checksum),
				)
				connection.commit()
				applied_now.append(version)
	except (OSError, sqlite3.Error) as exc:
		raise MigrationError(f"Unable to migrate SQLite database at {path}") from exc
	return applied_now
