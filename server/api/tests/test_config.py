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
