from __future__ import annotations

from pathlib import Path

from fastapi.testclient import TestClient

from server.api.silentflare_api.core.config import Settings
from server.api.silentflare_api.main import create_app


def test_health_endpoints_use_real_lifespan(tmp_path: Path) -> None:
	settings = Settings(
		ACCOUNT_DB_PATH=tmp_path / "health.db",
		SESSION_SECRET="s" * 32,
		ACCOUNT_COOKIE_DOMAIN=".silentflare.com",
		TURNSTILE_SECRET_KEY="configured",
		TURNSTILE_EXPECTED_HOSTNAMES="blog.silentflare.com",
	)
	with TestClient(create_app(settings)) as client:
		live = client.get("/health/live", headers={"X-Request-ID": "health-test"})
		ready = client.get("/health/ready")

	assert live.status_code == 200
	assert live.headers["X-Request-ID"] == "health-test"
	assert live.json()["ok"] is True
	assert ready.status_code == 200
	assert ready.json()["ok"] is True
	assert ready.json()["database"]["journalMode"] == "wal"
