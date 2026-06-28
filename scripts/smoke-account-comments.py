from __future__ import annotations

import gc
import importlib.util
import json
import os
import sqlite3
import sys
import tempfile
import types
from pathlib import Path
from urllib.parse import parse_qs

ROOT = Path(__file__).resolve().parents[1]


def install_api_import_stubs() -> None:
	if "fastapi" in sys.modules:
		return

	class HTTPException(Exception):
		def __init__(self, status_code: int, detail: str = "") -> None:
			super().__init__(detail)
			self.status_code = status_code
			self.detail = detail

	class FastAPI:
		def __init__(self, *_args: object, **_kwargs: object) -> None:
			pass

		def add_middleware(self, *_args: object, **_kwargs: object) -> None:
			pass

		def route(self, *_args: object, **_kwargs: object):
			return lambda func: func

		get = post = patch = delete = route

	class BaseModel:
		def __init__(self, **kwargs: object) -> None:
			for key, value in kwargs.items():
				setattr(self, key, value)

	def Header(default=None, **_kwargs: object):
		return default

	fastapi_module = types.ModuleType("fastapi")
	fastapi_module.FastAPI = FastAPI
	fastapi_module.Header = Header
	fastapi_module.HTTPException = HTTPException
	fastapi_module.Request = object
	fastapi_module.Response = object
	cors_module = types.ModuleType("fastapi.middleware.cors")
	cors_module.CORSMiddleware = object
	middleware_module = types.ModuleType("fastapi.middleware")
	pydantic_module = types.ModuleType("pydantic")
	pydantic_module.BaseModel = BaseModel
	sys.modules["fastapi"] = fastapi_module
	sys.modules["fastapi.middleware"] = middleware_module
	sys.modules["fastapi.middleware.cors"] = cors_module
	sys.modules["pydantic"] = pydantic_module


class StubClient:
	host = "127.0.0.1"


class StubRequest:
	def __init__(self, cookies: dict[str, str] | None = None) -> None:
		self.headers = {"user-agent": "silentflare-smoke"}
		self.cookies = cookies or {}
		self.client = StubClient()


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
	install_api_import_stubs()
	os.environ.update(
		{
			"ACCOUNT_DB_PATH": str(db_path),
			"TURNSTILE_SECRET_KEY": "test-turnstile-secret",
			"TURNSTILE_EXPECTED_HOSTNAMES": "auth.silentflare.com,accounts.silentflare.com",
			"SESSION_SECRET": "x" * 32,
			"ACCOUNT_COOKIE_DOMAIN": ".silentflare.com",
			"WEB_COOKIE_SECURE": "0",
			"AUTH_EMAIL_API_KEY": "test-email-key",
			"AUTH_EMAIL_FROM": "SilentFlare <auth@example.com>",
			"AUTH_TOS_VERSION": "test-v1",
		},
	)
	spec = importlib.util.spec_from_file_location("silentflare_api_smoke", ROOT / "server/api/app.py")
	if spec is None or spec.loader is None:
		raise RuntimeError("Unable to load FastAPI app")
	module = importlib.util.module_from_spec(spec)
	spec.loader.exec_module(module)
	return module


def install_network_mock(module) -> None:
	token_actions = {"register-ok": "register", "login-ok": "login", "comment-ok": "comment"}

	def mock_urlopen(request, timeout=15):
		if "turnstile" not in request.full_url:
			return MockResponse(status=200)
		data = parse_qs((request.data or b"").decode("utf-8"))
		action = token_actions.get(data.get("response", [""])[0], "")
		return MockResponse({"success": bool(action), "hostname": "accounts.silentflare.com", "action": action})

	module.urlopen = mock_urlopen


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
			module.RegisterEmailRequestPayload(email="smoke@example.com", turnstile_token="register-ok"),
			StubRequest(),
		)
		verified = module.register_email_verify_code(
			module.RegisterEmailVerifyPayload(email="smoke@example.com", code="123456"),
			StubRequest(),
		)
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
			StubRequest(),
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

		session = module.unified_auth_session(
			StubRequest({module.ACCOUNT_SESSION_COOKIE: cookie}), StubResponse()
		)
		if not session["authenticated"] or not session.get("csrf"):
			raise AssertionError("unified session status did not expose authenticated state and CSRF")

		module.comment_create(
			module.CommentCreatePayload(postSlug="smoke-post", content="Smoke comment", turnstileToken="comment-ok"),
			StubRequest({module.ACCOUNT_SESSION_COOKIE: cookie}),
			session["csrf"],
		)

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
			code, code_hash = connection.execute("SELECT code, code_hash FROM email_verifications LIMIT 1").fetchone()
			comment_count = connection.execute("SELECT COUNT(*) FROM comments").fetchone()[0]
			tos_count = connection.execute("SELECT COUNT(*) FROM tos_acceptances").fetchone()[0]
			if code or not code_hash:
				raise AssertionError("verification code was not stored hash-only")
			if comment_count != 1 or tos_count != 1:
				raise AssertionError("comment or TOS audit record was not persisted")

		del module
		gc.collect()

	print("unified auth and account-comments smoke ok")


if __name__ == "__main__":
	main()
