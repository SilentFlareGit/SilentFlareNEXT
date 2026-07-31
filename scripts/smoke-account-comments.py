from __future__ import annotations

import asyncio
import gc
import html
import importlib
import json
import os
import sqlite3
import sys
import tempfile
import time
from pathlib import Path
from urllib.parse import parse_qs, urlparse

ROOT = Path(__file__).resolve().parents[1]


class StubClient:
	host = "127.0.0.1"


class StubBackgroundTasks:
	def __init__(self) -> None:
		self.tasks: list[tuple[object, tuple[object, ...], dict[str, object]]] = []

	def add_task(self, function, *args: object, **kwargs: object) -> None:
		self.tasks.append((function, args, kwargs))


class StubRequest:
	def __init__(
		self,
		cookies: dict[str, str] | None = None,
		headers: dict[str, str] | None = None,
		body: bytes = b"",
	) -> None:
		self.headers = {"user-agent": "silentflare-smoke", **(headers or {})}
		self.cookies = cookies or {}
		self.client = StubClient()
		self._body = body

	async def body(self) -> bytes:
		return self._body

	async def json(self) -> dict[str, object]:
		return json.loads(self._body.decode("utf-8"))


class StubResponse:
	def __init__(self) -> None:
		self.cookies: dict[str, str] = {}

	def set_cookie(self, key: str, value: str, **_kwargs: object) -> None:
		self.cookies[key] = value

	def delete_cookie(self, key: str, **_kwargs: object) -> None:
		self.cookies.pop(key, None)


class MockResponse:
	def __init__(self, payload: dict[str, object] | None = None, status: int = 200) -> None:
		self.payload = payload or {}
		self.status = status

	def __enter__(self) -> "MockResponse":
		return self

	def __exit__(self, *_args: object) -> None:
		return None

	def read(self) -> bytes:
		return json.dumps(self.payload).encode("utf-8")


def load_api_module(db_path: Path):
	os.environ.update(
		{
			"ACCOUNT_DB_PATH": str(db_path),
			"ACCOUNT_AVATAR_DIR": str(db_path.parent / "avatars"),
			"ADMIN_WEB_LOGIN_STATE_PATH": str(db_path.parent / "admin-web-login-state.json"),
			"ACCOUNT_AVATAR_PUBLIC_BASE": "https://api.silentflare.com/account-avatars",
			"TURNSTILE_SECRET_KEY": "test-turnstile-secret",
			"TURNSTILE_EXPECTED_HOSTNAMES": "auth.silentflare.com,accounts.silentflare.com",
			"SESSION_SECRET": "x" * 32,
			"ACCOUNT_COOKIE_DOMAIN": ".silentflare.com",
			"WEB_COOKIE_SECURE": "0",
			"AUTH_EMAIL_API_KEY": "test-email-key",
			"AUTH_EMAIL_FROM": "SilentFlare <auth@example.com>",
			"AUTH_TOS_VERSION": "test-v1",
			"SILENTFLARE_DB_BACKUP_TELEGRAM_BOT_TOKEN": "test-telegram-token",
			"SILENTFLARE_DB_BACKUP_TELEGRAM_WEBHOOK_SECRET": "test-webhook-secret",
			"SILENTFLARE_DB_BACKUP_TELEGRAM_OWNER_ID": "8737100423",
		},
	)
	if str(ROOT) not in sys.path:
		sys.path.insert(0, str(ROOT))
	for name in list(sys.modules):
		if name == "server.api.app" or name.startswith("server.api.silentflare_api"):
			del sys.modules[name]
	module = importlib.import_module("server.api.app")
	module._runtime = importlib.import_module("server.api.silentflare_api.runtime")
	module._admin_service = importlib.import_module(
		"server.api.silentflare_api.domains.admin.service"
	)
	module._bots_service = importlib.import_module(
		"server.api.silentflare_api.domains.bots.service"
	)
	return module


def install_network_mock(module) -> None:
	token_actions = {
		"register-ok": "register",
		"login-ok": "login",
		"comment-ok": "comment",
	}
	email_payloads: list[dict[str, object]] = []

	class FakeEmailClient:
		def send(self, **payload):
			email_payloads.append(
				{
					"from": payload["sender"],
					"to": [payload["recipient"]],
					"subject": payload["subject"],
					"html": payload["html"],
					"text": payload["text"],
				}
			)
			return {"id": "smoke-email-id"}

	class FakeTurnstileClient:
		def verify(self, _secret, token, _remote_ip):
			action = token_actions.get(token, "")
			return {
				"success": bool(action),
				"hostname": "accounts.silentflare.com",
				"action": action,
			}

	class FakeGeoClient:
		def lookup(self, _url):
			return {
				"success": True,
				"country_code": "CN",
				"country": "China",
				"region": "Shanghai",
				"city": "Shanghai",
			}

	def mock_urlopen(request, timeout=15):
		if "ipwho.is" in request.full_url:
			return MockResponse(
				{
					"success": True,
					"country_code": "CN",
					"country": "China",
					"region": "Shanghai",
					"city": "Shanghai",
				}
			)
		if "api.resend.com" in request.full_url:
			email_payloads.append(json.loads((request.data or b"{}").decode("utf-8")))
			return MockResponse({"id": "smoke-email-id"}, status=200)
		if "turnstile" not in request.full_url:
			return MockResponse(status=200)
		data = parse_qs((request.data or b"").decode("utf-8"))
		action = token_actions.get(data.get("response", [""])[0], "")
		return MockResponse(
			{
				"success": bool(action),
				"hostname": "accounts.silentflare.com",
				"action": action,
			}
		)

	module._runtime.urlopen = mock_urlopen
	module._runtime.EMAIL_CLIENT = FakeEmailClient()
	module._runtime.TURNSTILE_CLIENT = FakeTurnstileClient()
	module._runtime.GEO_CLIENT = FakeGeoClient()
	module._smoke_email_payloads = email_payloads


def email_link_token(payload: dict[str, object]) -> str:
	text = html.unescape(str(payload.get("text") or ""))
	line = next((item for item in text.splitlines() if item.startswith("Verify securely: ")), "")
	query = parse_qs(urlparse(line.removeprefix("Verify securely: ")).query)
	return query.get("verify_token", [""])[0]


def assert_http_exception(exc: Exception, expected: int, label: str) -> None:
	if getattr(exc, "status_code", None) != expected:
		raise AssertionError(f"{label}: expected HTTP {expected}, got {exc}") from exc


def main() -> None:
	with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as tmpdir:
		db_path = Path(tmpdir) / "unified-auth.db"
		module = load_api_module(db_path)
		install_network_mock(module)
		module.secrets.randbelow = lambda _limit: 123456

		try:
			module.register_email_request_code(
				module.RegisterEmailRequestPayload(email="smoke@example.com", turnstile_token=""),
				StubRequest(),
			)
			raise AssertionError("register without Turnstile unexpectedly succeeded")
		except Exception as exc:
			assert_http_exception(exc, 403, "register without Turnstile")

		module.register_email_request_code(
			module.RegisterEmailRequestPayload(
				email="smoke@example.com", turnstile_token="register-ok"
			),
			StubRequest(headers={"cf-connecting-ip": "8.8.8.8"}),
		)
		registration_email = module._smoke_email_payloads[-1]
		registration_link_token = email_link_token(registration_email)
		if (
			"123456" not in str(registration_email.get("html") or "")
			or "Verify securely" not in str(registration_email.get("html") or "")
			or not registration_link_token
		):
			raise AssertionError(
				"verification email did not include the code and secure link template"
			)
		verified = module.register_email_verify_code(
			module.RegisterEmailVerifyPayload(email="smoke@example.com", code="123456"),
			StubRequest(headers={"cf-connecting-ip": "8.8.8.8"}),
		)
		try:
			module.register_email_verify_link(
				module.EmailLinkVerifyPayload(token=registration_link_token),
				StubRequest(),
			)
			raise AssertionError("verification link remained valid after code consumption")
		except Exception as exc:
			assert_http_exception(exc, 401, "registration link after code consumption")
		completed = module.register_complete(
			module.RegisterCompletePayload(
				reg_token=verified["reg_token"],
				username="smokeuser",
				password="password123",
				tos_accepted=True,
				tos_version="test-v1",
				display_name="Smoke User",
				display_region="Test Region",
			),
			StubRequest(headers={"cf-connecting-ip": "8.8.8.8"}),
		)
		module.registration_2fa_skip(
			module.RegistrationTwoFAPayload(onboarding_token=completed["onboarding_token"])
		)

		login_response = StubResponse()
		login = module.unified_login_password(
			module.UnifiedLoginPasswordPayload(
				email_or_username="smokeuser",
				password="password123",
				turnstile_token="login-ok",
				return_url="https://evil.example/phish",
			),
			StubRequest(),
			login_response,
		)
		cookie = login_response.cookies.get(module.ACCOUNT_SESSION_COOKIE)
		if not cookie or login["return_url"] != "https://accounts.silentflare.com/":
			raise AssertionError("session cookie or safe return URL validation failed")

		module.unified_login_email_request_code(
			module.EmailCodeRequestPayload(
				email="smoke@example.com",
				turnstile_token="login-ok",
				return_url="https://blog.silentflare.com/posts/smoke-post/",
			),
			StubRequest(),
		)
		login_link_token = email_link_token(module._smoke_email_payloads[-1])
		link_response = StubResponse()
		link_login = module.unified_login_email_verify_link(
			module.EmailLinkVerifyPayload(token=login_link_token),
			StubRequest(),
			link_response,
		)
		if (
			module.ACCOUNT_SESSION_COOKIE not in link_response.cookies
			or link_login["return_url"] != "https://blog.silentflare.com/posts/smoke-post/"
		):
			raise AssertionError("email verification link did not issue the expected session")
		if module.verify_email_code("smoke@example.com", "123456", "login"):
			raise AssertionError("email code remained valid after link consumption")

		session = module.unified_auth_session(
			StubRequest({module.ACCOUNT_SESSION_COOKIE: cookie}), StubResponse()
		)
		if not session["authenticated"] or not session.get("csrf"):
			raise AssertionError(
				"unified session status did not expose authenticated state and CSRF"
			)

		profile_request = StubRequest(
			{module.ACCOUNT_SESSION_COOKIE: cookie},
			{"cf-connecting-ip": "8.8.8.8", "cf-ipcountry": "CN"},
		)
		profile = module.accounts_profile_get(profile_request)
		if profile["user"].get("displayRegion") != "Shanghai, China":
			raise AssertionError("IP-derived city and country were not forced into the profile")
		if profile["user"].get("displayRegionCode") != "CN":
			raise AssertionError("IP-derived country code was not persisted")

		avatar_request = StubRequest(
			{module.ACCOUNT_SESSION_COOKIE: cookie},
			{"content-type": "image/png"},
			b"\x89PNG\r\n\x1a\n" + b"avatar-smoke",
		)
		avatar = asyncio.run(
			module.accounts_profile_avatar_upload(
				avatar_request,
				session["csrf"],
			)
		)
		if not avatar["user"]["avatarUrl"].endswith(".png"):
			raise AssertionError("avatar upload did not persist a managed image URL")
		if len(list((db_path.parent / "avatars").glob("*.png"))) != 1:
			raise AssertionError("avatar upload did not create exactly one managed file")
		patched_profile = module.accounts_profile_patch(
			module.UnifiedProfilePayload(
				display_name="Updated Smoke User",
				avatar_url="https://attacker.example/avatar.png",
				bio="Updated bio",
				display_region="Forged Region",
			),
			StubRequest({module.ACCOUNT_SESSION_COOKIE: cookie}),
			session["csrf"],
		)
		if patched_profile["user"]["avatarUrl"] != avatar["user"]["avatarUrl"]:
			raise AssertionError("profile PATCH bypassed managed avatar upload")
		if patched_profile["user"]["displayRegion"] != "Shanghai, China":
			raise AssertionError("profile PATCH bypassed IP-derived region")

		created_comment = module.comment_create(
			module.CommentCreatePayload(
				postSlug="smoke-post",
				content="**Smoke comment**",
				turnstileToken="comment-ok",
			),
			StubRequest({module.ACCOUNT_SESSION_COOKIE: cookie}, {"cf-connecting-ip": "8.8.4.4"}),
			session["csrf"],
		)
		public_profile = module.accounts_public_profile("SMOKEUSER")
		if (
			public_profile["profile"]["username"] != "smokeuser"
			or public_profile["profile"]["commentCount"] != 1
			or public_profile["comments"][0]["id"] != created_comment["comment"]["id"]
			or "email" in public_profile["profile"]
		):
			raise AssertionError("public profile did not expose the safe comment identity contract")
		updated_comment = module.comment_update(
			created_comment["comment"]["id"],
			module.CommentUpdatePayload(content="**Updated smoke comment**\n\n- item"),
			StubRequest({module.ACCOUNT_SESSION_COOKIE: cookie}),
			session["csrf"],
		)
		if updated_comment["comment"]["content"] != "**Updated smoke comment**\n\n- item":
			raise AssertionError("comment Markdown update was not persisted")
		reply = module.comment_create(
			module.CommentCreatePayload(
				postSlug="smoke-post",
				content="Threaded reply",
				turnstileToken="comment-ok",
				parentId=created_comment["comment"]["id"],
			),
			StubRequest(
				{module.ACCOUNT_SESSION_COOKIE: cookie},
				{"cf-connecting-ip": "8.8.4.4"},
			),
			session["csrf"],
		)
		if reply["comment"]["rootId"] != created_comment["comment"]["id"]:
			raise AssertionError("comment reply was not attached to its root thread")
		nested_reply = module.comment_create(
			module.CommentCreatePayload(
				postSlug="smoke-post",
				content="Nested threaded reply",
				turnstileToken="comment-ok",
				parentId=reply["comment"]["id"],
			),
			StubRequest(
				{module.ACCOUNT_SESSION_COOKIE: cookie},
				{"cf-connecting-ip": "8.8.4.4"},
			),
			session["csrf"],
		)
		if (
			nested_reply["comment"]["parentId"] != reply["comment"]["id"]
			or nested_reply["comment"]["rootId"] != created_comment["comment"]["id"]
		):
			raise AssertionError("nested reply ancestry was not preserved")
		second_root = module.comment_create(
			module.CommentCreatePayload(
				postSlug="smoke-post",
				content="Second root comment",
				turnstileToken="comment-ok",
			),
			StubRequest(
				{module.ACCOUNT_SESSION_COOKIE: cookie},
				{"cf-connecting-ip": "8.8.4.4"},
			),
			session["csrf"],
		)
		first_page = module.comments("smoke-post", limit=1)
		if (
			first_page["totalCount"] != 4
			or len(first_page["items"]) != 1
			or not first_page["nextCursor"]
		):
			raise AssertionError("comment count or first cursor page was incorrect")
		second_page = module.comments(
			"smoke-post",
			cursor=first_page["nextCursor"],
			limit=1,
		)
		if (
			len(second_page["items"]) != 1
			or second_page["items"][0]["id"] != second_root["comment"]["id"]
		):
			raise AssertionError("comment cursor did not return the next root thread")

		module.comment_delete(
			created_comment["comment"]["id"],
			StubRequest({module.ACCOUNT_SESSION_COOKIE: cookie}),
			session["csrf"],
		)
		module.comment_delete(
			reply["comment"]["id"],
			StubRequest({module.ACCOUNT_SESSION_COOKIE: cookie}),
			session["csrf"],
		)
		thread_page = module.comments("smoke-post", limit=10)
		deleted_root = next(
			item for item in thread_page["items"] if item["id"] == created_comment["comment"]["id"]
		)
		if not deleted_root["isDeleted"] or deleted_root["content"]:
			raise AssertionError("deleted thread root did not become a safe tombstone")
		if (
			deleted_root["replies"][0]["id"] != reply["comment"]["id"]
			or not deleted_root["replies"][0]["isDeleted"]
		):
			raise AssertionError("deleted reply ancestor did not remain as a tombstone")
		if deleted_root["replies"][0]["replies"][0]["id"] != nested_reply["comment"]["id"]:
			raise AssertionError("nested reply disappeared from its parent branch")

		admin_id = module.ADMIN_AUTH_ID
		module._admin_service.require_admin_console_session = lambda *_args, **_kwargs: {
			"bot_id": admin_id
		}
		module.admin_comment_restore(
			created_comment["comment"]["id"],
			StubRequest(),
			module.CommentModerationPayload(reason="Smoke restore audit"),
		)
		moderated = module.admin_comments(StubRequest(), status="all")
		moderated_root = next(
			item for item in moderated["comments"] if item["id"] == created_comment["comment"]["id"]
		)
		if (
			moderated_root["revision_count"] != 1
			or moderated_root["last_moderation_reason"] != "Smoke restore audit"
		):
			raise AssertionError("comment revision or moderation audit was not exposed")
		admin_users = module.admin_users(StubRequest())["users"]
		if admin_users[0].get("registration_ip") != "8.8.8.8":
			raise AssertionError("admin user audit did not expose the registration IP")
		detail = module.admin_user_detail(admin_users[0]["id"], StubRequest())
		if detail["comments"][0].get("created_ip") != "8.8.4.4":
			raise AssertionError("admin user detail did not include comment IP audit")
		if "password_hash" in detail["user"] or "totp_secret" in detail["user"]:
			raise AssertionError("admin detail exposed authentication secrets")

		module._bots_service.telegram_api = lambda *_args, **_kwargs: {"ok": True}
		allow_result = asyncio.run(
			module.telegram_update(
				StubRequest(
					body=json.dumps(
						{
							"message": {
								"text": "/allowweblogin",
								"from": {"id": 8737100423},
								"chat": {"id": 8737100423},
							}
						}
					).encode("utf-8")
				),
				StubBackgroundTasks(),
				"test-webhook-secret",
			)
		)
		if not allow_result.get("web_login_enabled"):
			raise AssertionError("Owner command did not enable Admin web login")
		admin_response = StubResponse()
		module.create_session(admin_response, module.ADMIN_AUTH_ID)
		admin_session_id = admin_response.cookies[module.SESSION_COOKIE]
		admin_session = module.BOT_STATE.session(admin_session_id)
		if not admin_session:
			raise AssertionError("Admin session was not persisted")
		admin_remaining = admin_session["expires_at"] - time.time()
		if not 3590 <= admin_remaining <= 3600:
			raise AssertionError("Admin session does not have a fixed one-hour lifetime")

		challenge = module.create_login_challenge(module.ADMIN_AUTH_ID, "smoke-client")
		module._bots_service.edit_login_approval_message = lambda *_args, **_kwargs: None
		module._bots_service.answer_callback = lambda *_args, **_kwargs: None
		telegram_result = asyncio.run(
			module.telegram_update(
				StubRequest(
					body=json.dumps(
						{
							"callback_query": {
								"id": "callback-smoke",
								"data": f"sf_login:{challenge['id']}",
								"from": {"id": 8737100423},
							}
						}
					).encode("utf-8")
				),
				StubBackgroundTasks(),
				"test-webhook-secret",
			)
		)
		if not telegram_result.get("approved"):
			raise AssertionError("shared Telegram bot could not approve the admin challenge")
		deny_result = asyncio.run(
			module.telegram_update(
				StubRequest(
					body=json.dumps(
						{
							"message": {
								"text": "/denyweblogin",
								"from": {"id": 8737100423},
								"chat": {"id": 8737100423},
							}
						}
					).encode("utf-8")
				),
				StubBackgroundTasks(),
				"test-webhook-secret",
			)
		)
		if deny_result.get("web_login_enabled") is not False:
			raise AssertionError("Owner command did not disable Admin web login")
		if module.BOT_STATE.session(admin_session_id) is not None:
			raise AssertionError("Disabling web login did not revoke Admin sessions")
		if module.BOT_STATE.challenge(challenge["id"]) is not None:
			raise AssertionError("Disabling web login did not revoke Admin challenges")

		secret = module.generate_totp_secret()
		module.d1_query(
			"UPDATE users SET totp_secret = ?, totp_enabled = 1 WHERE username = ?",
			[module.seal_totp_secret(secret), "smokeuser"],
		)
		pending_response = StubResponse()
		pending = module.unified_login_password(
			module.UnifiedLoginPasswordPayload(
				email_or_username="smoke@example.com",
				password="password123",
				turnstile_token="login-ok",
				return_url="https://blog.silentflare.com/posts/smoke-post/",
			),
			StubRequest(),
			pending_response,
		)
		if not pending["requires_2fa"] or pending_response.cookies:
			raise AssertionError("2FA login issued a session before TOTP verification")
		verified_2fa_response = StubResponse()
		module.unified_2fa_verify(
			module.TwoFAVerifyPayload(
				pending_id=pending["pending_id"],
				code=module.totp_code(secret, int(module.time.time() // 30)),
			),
			StubRequest(),
			verified_2fa_response,
		)
		if module.ACCOUNT_SESSION_COOKIE not in verified_2fa_response.cookies:
			raise AssertionError("2FA verification did not issue the final session")

		with sqlite3.connect(db_path) as connection:
			code, code_hash = connection.execute(
				"SELECT code, code_hash FROM email_verifications LIMIT 1"
			).fetchone()
			comment_count = connection.execute("SELECT COUNT(*) FROM comments").fetchone()[0]
			tos_count = connection.execute("SELECT COUNT(*) FROM tos_acceptances").fetchone()[0]
			if code or not code_hash:
				raise AssertionError("verification code was not stored hash-only")
			if comment_count != 4 or tos_count != 1:
				raise AssertionError("comment or TOS audit record was not persisted")

		del module
		gc.collect()

	print("unified auth and account-comments smoke ok")


if __name__ == "__main__":
	main()
