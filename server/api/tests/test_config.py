from __future__ import annotations

from server.api.silentflare_api.core.config import Settings


def test_settings_parse_boolean_and_redact_secret() -> None:
	settings = Settings(
		WEB_COOKIE_SECURE="0",
		SESSION_SECRET="s" * 32,
		ACCOUNT_COOKIE_DOMAIN=".silentflare.com",
		TURNSTILE_SECRET_KEY="turnstile-secret",
		TURNSTILE_EXPECTED_HOSTNAMES="Auth.SilentFlare.com, blog.silentflare.com ",
	)

	assert settings.web_cookie_secure is False
	assert settings.expected_turnstile_hostnames == {
		"auth.silentflare.com",
		"blog.silentflare.com",
	}
	assert all(settings.production_readiness().values())
	assert "turnstile-secret" not in repr(settings)


def test_settings_env_file_does_not_expand_dollar_values(tmp_path) -> None:
	env_file = tmp_path / "api.env"
	env_file.write_text(
		"SESSION_SECRET=prefix$literal$value\nACCOUNT_DB_PATH=/tmp/account.db\n",
		encoding="utf-8",
	)

	settings = Settings(_env_file=env_file)

	assert settings.account_session_secret == "prefix$literal$value"
	assert settings.account_db_path.name == "account.db"
