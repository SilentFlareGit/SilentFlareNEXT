from __future__ import annotations

from pathlib import Path

from .config import settings
from .database import Database


def main() -> None:
	settings.validate()
	root = Path(__file__).resolve().parents[1]
	Database(settings.database_path, root / "migrations").migrate()


if __name__ == "__main__":
	main()
