from __future__ import annotations

import argparse
import sqlite3
from contextlib import closing
from pathlib import Path

from ..core.config import Settings
from .migrations import migrate_database


def backup_database(source: Path, destination: Path) -> None:
	destination.parent.mkdir(parents=True, exist_ok=True)
	with (
		closing(sqlite3.connect(source)) as source_connection,
		closing(sqlite3.connect(destination)) as destination_connection,
	):
		source_connection.backup(destination_connection)


def main() -> None:
	parser = argparse.ArgumentParser(description="SilentFlare API database operations")
	parser.add_argument("--env-file", type=Path)
	subparsers = parser.add_subparsers(dest="command", required=True)
	subparsers.add_parser("migrate")
	backup = subparsers.add_parser("backup")
	backup.add_argument("destination", type=Path)
	args = parser.parse_args()
	settings = Settings(_env_file=args.env_file) if args.env_file else Settings()
	path = settings.account_db_path
	if args.command == "migrate":
		applied = migrate_database(path)
		print("MIGRATIONS_APPLIED=" + (",".join(applied) if applied else "none"))
	elif args.command == "backup":
		if not path.is_file():
			raise SystemExit("Account database does not exist")
		backup_database(path, args.destination)
		print("BACKUP_OK=true")


if __name__ == "__main__":
	main()
