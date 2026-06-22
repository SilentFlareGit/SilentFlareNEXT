from __future__ import annotations

import importlib.util
import gc
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

		def get(self, *_args: object, **_kwargs: object):
			return lambda func: func

		def post(self, *_args: object, **_kwargs: object):
			return lambda func: func

		def delete(self, *_args: object, **_kwargs: object):
			return lambda func: func

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


class MockTurnstileResponse:
	def __init__(self, payload: dict[str, object]) -> None:
		self.payload = payload

	def __enter__(self) -> "MockTurnstileResponse":
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
			"TURNSTILE_EXPECTED_HOSTNAMES": (
				"accounts.silentflare.com,silentflare.com,www.silentflare.com"
			),
			"SESSION_SECRET": "x" * 32,
			"ACCOUNT_COOKIE_DOMAIN": ".silentflare.com",
			"WEB_COOKIE_SECURE": "0",
		}
	)
	spec = importlib.util.spec_from_file_location("silentflare_api_smoke", ROOT / "server/api/app.py")
	if spec is None or spec.loader is None:
		raise RuntimeError("Unable to load FastAPI app")
	module = importlib.util.module_from_spec(spec)
	spec.loader.exec_module(module)
	return module


def install_turnstile_mock(module) -> None:
	token_actions = {
		"register-ok": "register",
		"login-ok": "login",
		"comment-ok": "comment",
	}

	def mock_urlopen(request, timeout=15):
		data = parse_qs((request.data or b"").decode("utf-8"))
		token = data.get("response", [""])[0]
		action = token_actions.get(token, "")
		return MockTurnstileResponse(
			{
				"success": bool(action),
				"hostname": "accounts.silentflare.com",
				"action": action,
			}
		)

	module.urlopen = mock_urlopen


def assert_http_exception(exc: Exception, expected: int, label: str) -> None:
	status_code = getattr(exc, "status_code", None)
	if status_code != expected:
		raise AssertionError(f"{label}: expected HTTP {expected}, got {status_code}: {exc}") from exc


def main() -> None:
	with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as tmpdir:
		db_path = Path(tmpdir) / "account-comments.db"
		module = load_api_module(db_path)
		install_turnstile_mock(module)

		try:
			module.account_register(
				module.AccountRegisterPayload(
					email="smoke@example.com",
					username="smokeuser",
					password="password123",
					turnstileToken="",
				),
				StubRequest(),
				StubResponse(),
			)
			raise AssertionError("register without Turnstile unexpectedly succeeded")
		except Exception as exc:
			assert_http_exception(exc, 403, "register without Turnstile")

		register_response = StubResponse()
		module.account_register(
			module.AccountRegisterPayload(
				email="smoke@example.com",
				username="smokeuser",
				password="password123",
				turnstileToken="register-ok",
			),
			StubRequest(),
			register_response,
		)

		register_cookie = register_response.cookies.get(module.ACCOUNT_SESSION_COOKIE)
		if not register_cookie:
			raise AssertionError("register did not set an account session cookie")

		logout_response = StubResponse()
		module.account_logout(
			StubRequest({module.ACCOUNT_SESSION_COOKIE: register_cookie}),
			logout_response,
		)

		login_response = StubResponse()
		module.account_login(
			module.AccountLoginPayload(
				email="smoke@example.com",
				password="password123",
				turnstileToken="login-ok",
			),
			StubRequest(),
			login_response,
		)

		login_cookie = login_response.cookies.get(module.ACCOUNT_SESSION_COOKIE)
		if not login_cookie:
			raise AssertionError("login did not set an account session cookie")

		module.comment_create(
			module.CommentCreatePayload(
				postSlug="smoke-post",
				content="Smoke comment",
				turnstileToken="comment-ok",
			),
			StubRequest({module.ACCOUNT_SESSION_COOKIE: login_cookie}),
		)

		with sqlite3.connect(db_path) as connection:
			comment_count = connection.execute("SELECT COUNT(*) FROM comments").fetchone()[0]
		if comment_count != 1:
			raise AssertionError(f"expected 1 local DB comment, got {comment_count}")
		del module
		gc.collect()

	print("account-comments smoke ok")


if __name__ == "__main__":
	main()
