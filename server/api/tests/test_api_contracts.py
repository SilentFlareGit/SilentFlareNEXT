from __future__ import annotations

import importlib
import sys
from pathlib import Path

from fastapi.testclient import TestClient


class FakeEmailClient:
	def __init__(self) -> None:
		self.messages: list[dict[str, object]] = []

	def send(self, **payload: object) -> dict[str, str]:
		self.messages.append(payload)
		return {"id": "test-message"}


class FakeTurnstileClient:
	def verify(self, _secret: str, token: str, _remote_ip: str) -> dict[str, object]:
		actions = {
			"register-token": "register",
			"login-token": "login",
			"comment-token": "comment",
		}
		action = actions.get(token, "")
		return {
			"success": bool(action),
			"hostname": "accounts.silentflare.com",
			"action": action,
		}


class FakeGeoClient:
	def lookup(self, _url: str) -> dict[str, object]:
		return {
			"success": True,
			"country_code": "TW",
			"country": "Taiwan",
			"region": "Taipei",
			"city": "Taipei",
		}


def load_test_app(monkeypatch, tmp_path: Path):
	monkeypatch.setenv("ACCOUNT_DB_PATH", str(tmp_path / "account.db"))
	monkeypatch.setenv("ADMIN_WEB_LOGIN_STATE_PATH", str(tmp_path / "admin-login.json"))
	monkeypatch.setenv("ACCOUNT_AVATAR_DIR", str(tmp_path / "avatars"))
	monkeypatch.setenv("SITE_ASSET_DIR", str(tmp_path / "site-assets"))
	monkeypatch.setenv("SESSION_SECRET", "s" * 32)
	monkeypatch.setenv("ACCOUNT_COOKIE_DOMAIN", ".silentflare.com")
	monkeypatch.setenv("WEB_COOKIE_SECURE", "0")
	monkeypatch.setenv("TURNSTILE_SECRET_KEY", "configured")
	monkeypatch.setenv(
		"TURNSTILE_EXPECTED_HOSTNAMES",
		"accounts.silentflare.com,blog.silentflare.com",
	)
	monkeypatch.setenv("AUTH_EMAIL_API_KEY", "configured")
	monkeypatch.setenv("AUTH_EMAIL_FROM", "SilentFlare <auth@example.com>")
	monkeypatch.setenv("AUTH_TOS_VERSION", "test-v1")
	for name in list(sys.modules):
		if name == "server.api.app" or name.startswith("server.api.silentflare_api"):
			del sys.modules[name]
	main = importlib.import_module("server.api.silentflare_api.main")
	runtime = importlib.import_module("server.api.silentflare_api.runtime")
	email = FakeEmailClient()
	runtime.EMAIL_CLIENT = email
	runtime.TURNSTILE_CLIENT = FakeTurnstileClient()
	runtime.GEO_CLIENT = FakeGeoClient()
	runtime.secrets.randbelow = lambda _limit: 123456
	return main.app, runtime, email


def test_registration_login_and_comment_contract_through_asgi(monkeypatch, tmp_path: Path) -> None:
	app, _runtime, email = load_test_app(monkeypatch, tmp_path)
	with TestClient(app, base_url="https://api.silentflare.com") as client:
		requested = client.post(
			"/accounts/register/email/request",
			json={"email": "asgi@example.com", "turnstile_token": "register-token"},
			headers={"CF-Connecting-IP": "8.8.8.8"},
		)
		assert requested.status_code == 200
		assert email.messages and "123456" in str(email.messages[-1]["html"])

		verified = client.post(
			"/accounts/register/email/verify",
			json={"email": "asgi@example.com", "code": "123456"},
		)
		assert verified.status_code == 200
		completed = client.post(
			"/accounts/register/complete",
			json={
				"reg_token": verified.json()["reg_token"],
				"username": "asgiuser",
				"password": "password123",
				"tos_accepted": True,
				"tos_version": "test-v1",
				"display_name": "ASGI User",
			},
			headers={"CF-Connecting-IP": "8.8.8.8"},
		)
		assert completed.status_code == 200
		assert (
			client.post(
				"/accounts/register/2fa/skip",
				json={"onboarding_token": completed.json()["onboarding_token"]},
			).status_code
			== 200
		)

		login = client.post(
			"/auth/login/password",
			json={
				"email_or_username": "asgiuser",
				"password": "password123",
				"turnstile_token": "login-token",
				"return_url": "https://blog.silentflare.com/posts/asgi/",
			},
			headers={"CF-Connecting-IP": "8.8.8.8"},
		)
		assert login.status_code == 200
		assert login.json()["return_url"] == "https://blog.silentflare.com/posts/asgi/"
		session = client.get("/auth/session")
		assert session.status_code == 200
		csrf = session.json()["csrf"]

		created = client.post(
			"/comments/create",
			json={
				"postSlug": "asgi",
				"content": "**Real ASGI comment**",
				"turnstileToken": "comment-token",
			},
			headers={"X-CSRF-Token": csrf, "CF-Connecting-IP": "8.8.4.4"},
		)
		assert created.status_code == 200
		listed = client.get("/comments", params={"postSlug": "asgi"})
		assert listed.status_code == 200
		assert listed.json()["totalCount"] == 1
		assert listed.json()["items"][0]["content"] == "**Real ASGI comment**"

		public_profile = client.get("/accounts/public/ASGIUSER")
		assert public_profile.status_code == 200
		public_payload = public_profile.json()
		assert public_payload["profile"]["username"] == "asgiuser"
		assert public_payload["profile"]["displayName"] == "ASGI User"
		assert public_payload["profile"]["commentCount"] == 1
		assert public_payload["comments"][0]["content"] == "**Real ASGI comment**"
		assert "email" not in public_payload["profile"]

		privacy = client.patch(
			"/accounts/preferences/privacy",
			json={
				"profile_public": True,
				"show_region": False,
				"show_comments": False,
				"allow_search": False,
				"allow_data_export": True,
			},
			headers={"X-CSRF-Token": csrf},
		)
		assert privacy.status_code == 200
		private_activity = client.get("/accounts/public/asgiuser")
		assert private_activity.status_code == 200
		assert private_activity.json()["profile"]["displayRegion"] == ""
		assert private_activity.json()["profile"]["commentsVisible"] is False
		assert private_activity.json()["profile"]["commentCount"] is None
		assert private_activity.json()["comments"] == []

		privacy = client.patch(
			"/accounts/preferences/privacy",
			json={
				"profile_public": False,
				"show_region": False,
				"show_comments": False,
				"allow_search": False,
				"allow_data_export": True,
			},
			headers={"X-CSRF-Token": csrf},
		)
		assert privacy.status_code == 200
		assert client.get("/accounts/public/asgiuser").status_code == 404


def test_blog_cors_preflight_allows_credentials(monkeypatch, tmp_path: Path) -> None:
	app, _runtime, _email = load_test_app(monkeypatch, tmp_path)
	with TestClient(app, base_url="https://api.silentflare.com") as client:
		response = client.options(
			"/comments",
			headers={
				"Origin": "https://blog.silentflare.com",
				"Access-Control-Request-Method": "GET",
				"Access-Control-Request-Headers": "X-CSRF-Token",
			},
		)

	assert response.status_code == 200
	assert response.headers["access-control-allow-origin"] == "https://blog.silentflare.com"
	assert response.headers["access-control-allow-credentials"] == "true"
