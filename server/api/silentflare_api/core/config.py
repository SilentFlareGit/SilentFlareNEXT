from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
	"""Validated process configuration with secret-safe representations."""

	model_config = SettingsConfigDict(
		env_file=None,
		extra="ignore",
		case_sensitive=True,
	)

	app_name: str = "SilentFlare API"
	environment: str = Field(default="production", alias="APP_ENV")
	telegram_owner_id: int = Field(default=8737100423, alias="TELEGRAM_OWNER_ID")
	backup_script: Path = Field(
		default=Path("/opt/silentflare/deploy/ghost-db-backup.sh"), alias="BACKUP_SCRIPT"
	)
	backup_dir: Path = Field(default=Path("/opt/silentflare/backups/ghost-db"), alias="BACKUP_DIR")
	backup_env_file: Path = Field(
		default=Path("/opt/silentflare/deploy/ghost-db-backup.env"), alias="BACKUP_ENV_FILE"
	)
	backup_timer_override: Path = Field(
		default=Path("/etc/systemd/system/silentflare-ghost-db-backup.timer.d/override.conf"),
		alias="BACKUP_TIMER_OVERRIDE",
	)
	chat_bot_web_url: str = Field(default="https://tg.silentflare.com", alias="CHAT_BOT_WEB_URL")
	chat_bot_app_dir: str = Field(default="/root/messages_helper_bot", alias="CHAT_BOT_APP_DIR")
	chat_bot_env_file: str = Field(default="", alias="CHAT_BOT_ENV_FILE")
	chat_bot_web_service: str = Field(default="messages-helper-web", alias="CHAT_BOT_WEB_SERVICE")
	chat_bot_bot_service: str = Field(default="messages-helper-bot", alias="CHAT_BOT_BOT_SERVICE")
	chat_bot_control_mode: str = Field(default="disabled", alias="CHAT_BOT_CONTROL_MODE")
	chat_bot_ssh_target: str = Field(default="", alias="CHAT_BOT_SSH_TARGET")
	chat_bot_ssh_key: str = Field(default="", alias="CHAT_BOT_SSH_KEY")
	api_admin_token: str = Field(default="", alias="API_ADMIN_TOKEN", repr=False)
	telegram_bot_token: str = Field(default="", alias="TELEGRAM_BOT_TOKEN", repr=False)
	telegram_chat_id: str = Field(default="", alias="TELEGRAM_CHAT_ID")
	telegram_webhook_secret: str = Field(default="", alias="TELEGRAM_WEBHOOK_SECRET", repr=False)
	db_backup_telegram_bot_token: str = Field(
		default="", alias="SILENTFLARE_DB_BACKUP_TELEGRAM_BOT_TOKEN", repr=False
	)
	db_backup_telegram_chat_id: str = Field(
		default="", alias="SILENTFLARE_DB_BACKUP_TELEGRAM_CHAT_ID"
	)
	db_backup_telegram_webhook_secret: str = Field(
		default="", alias="SILENTFLARE_DB_BACKUP_TELEGRAM_WEBHOOK_SECRET", repr=False
	)
	db_backup_telegram_owner_id: int | None = Field(
		default=None, alias="SILENTFLARE_DB_BACKUP_TELEGRAM_OWNER_ID"
	)
	chat_bot_telegram_bot_token: str = Field(
		default="", alias="TELEGRAM_CHAT_BOT_TOKEN", repr=False
	)
	chat_bot_telegram_chat_id: str = Field(default="", alias="TELEGRAM_CHAT_BOT_CHAT_ID")
	chat_bot_telegram_webhook_secret: str = Field(
		default="", alias="TELEGRAM_CHAT_BOT_WEBHOOK_SECRET", repr=False
	)
	chat_bot_telegram_owner_id: int | None = Field(default=None, alias="TELEGRAM_CHAT_BOT_OWNER_ID")
	api_env_file: Path = Field(default=Path("/opt/silentflare/api/api.env"), alias="API_ENV_FILE")
	console_totp_secret: str = Field(default="", alias="BOT_CONSOLE_TOTP_SECRET", repr=False)
	legacy_web_totp_secret: str = Field(default="", alias="WEB_TOTP_SECRET", repr=False)
	web_session_ttl: int = Field(default=43_200, alias="WEB_SESSION_TTL")
	web_login_attempts: int = Field(default=5, alias="WEB_LOGIN_ATTEMPTS")
	web_login_window_seconds: int = Field(default=900, alias="WEB_LOGIN_WINDOW_SECONDS")
	web_login_session_epoch: str = Field(default="", alias="WEB_LOGIN_SESSION_EPOCH")
	admin_web_login_state_path: Path = Field(
		default=Path("/opt/silentflare/api/admin-web-login-state.json"),
		alias="ADMIN_WEB_LOGIN_STATE_PATH",
	)
	telegram_api_timeout_seconds: int = Field(default=8, alias="TELEGRAM_API_TIMEOUT_SECONDS")
	account_db_path: Path = Field(
		default=Path("/opt/silentflare/api/account.db"),
		alias="ACCOUNT_DB_PATH",
	)
	account_avatar_dir: Path = Field(
		default=Path("/opt/silentflare/api/uploads/avatars"),
		alias="ACCOUNT_AVATAR_DIR",
	)
	site_asset_dir: Path = Field(
		default=Path("/opt/silentflare/api/uploads/site"),
		alias="SITE_ASSET_DIR",
	)
	account_session_secret: str = Field(default="", alias="SESSION_SECRET", repr=False)
	legacy_account_session_secret: str = Field(
		default="", alias="ACCOUNT_SESSION_SECRET", repr=False
	)
	bot_session_secret: str = Field(default="", alias="BOT_SESSION_SECRET", repr=False)
	account_cookie_domain: str = Field(default="", alias="ACCOUNT_COOKIE_DOMAIN")
	account_session_cookie: str = Field(
		default="sf_account_session",
		alias="ACCOUNT_SESSION_COOKIE_NAME",
	)
	bot_cookie_domain: str = Field(default=".silentflare.com", alias="BOT_COOKIE_DOMAIN")
	web_cookie_secure: bool = Field(default=True, alias="WEB_COOKIE_SECURE")
	turnstile_secret_key: str = Field(default="", alias="TURNSTILE_SECRET_KEY", repr=False)
	turnstile_expected_hostnames: str = Field(
		default="",
		alias="TURNSTILE_EXPECTED_HOSTNAMES",
	)
	turnstile_expected_hostname: str = Field(
		default="",
		alias="TURNSTILE_EXPECTED_HOSTNAME",
	)
	shield_sync_secret: str = Field(default="", alias="SHIELD_SYNC_SECRET", repr=False)
	account_avatar_public_base: str = Field(
		default="https://api.silentflare.com/account-avatars",
		alias="ACCOUNT_AVATAR_PUBLIC_BASE",
	)
	account_avatar_max_bytes: int = Field(default=2 * 1024 * 1024, alias="ACCOUNT_AVATAR_MAX_BYTES")
	site_asset_public_base: str = Field(
		default="https://api.silentflare.com/site-assets", alias="SITE_ASSET_PUBLIC_BASE"
	)
	site_asset_max_bytes: int = Field(default=12 * 1024 * 1024, alias="SITE_ASSET_MAX_BYTES")
	ip_geolocation_url_template: str = Field(
		default="https://ipwho.is/{ip}", alias="IP_GEOLOCATION_URL_TEMPLATE"
	)
	ip_geo_cache_ttl: int = Field(default=86_400, alias="IP_GEO_CACHE_TTL")
	account_pbkdf2_iterations: int = Field(default=600_000, alias="ACCOUNT_PBKDF2_ITERATIONS")
	account_session_ttl: int = Field(default=2_592_000, alias="ACCOUNT_SESSION_TTL")
	auth_email_api_key: str = Field(default="", alias="AUTH_EMAIL_API_KEY", repr=False)
	auth_email_from: str = Field(default="", alias="AUTH_EMAIL_FROM")
	auth_email_api_url: str = Field(
		default="https://api.resend.com/emails", alias="AUTH_EMAIL_API_URL"
	)
	auth_login_verify_url: str = Field(
		default="https://auth.silentflare.com/", alias="AUTH_LOGIN_VERIFY_URL"
	)
	auth_register_verify_url: str = Field(
		default="https://accounts.silentflare.com/", alias="AUTH_REGISTER_VERIFY_URL"
	)
	auth_tos_version: str = Field(default="2026-06-28", alias="AUTH_TOS_VERSION")
	auth_email_code_ttl: int = Field(default=600, alias="AUTH_EMAIL_CODE_TTL")
	auth_email_send_cooldown: int = Field(default=60, alias="AUTH_EMAIL_SEND_COOLDOWN")
	auth_email_send_limit: int = Field(default=5, alias="AUTH_EMAIL_SEND_LIMIT")
	auth_code_attempt_limit: int = Field(default=5, alias="AUTH_CODE_ATTEMPT_LIMIT")
	auth_flow_ttl: int = Field(default=1_200, alias="AUTH_FLOW_TTL")
	comment_create_user_limit: int = Field(default=12, alias="COMMENT_CREATE_USER_LIMIT")
	comment_create_ip_limit: int = Field(default=24, alias="COMMENT_CREATE_IP_LIMIT")
	comment_create_window_seconds: int = Field(default=300, alias="COMMENT_CREATE_WINDOW_SECONDS")
	db_backup_auth_method: str = Field(default="", alias="SILENTFLARE_DB_BACKUP_AUTH_METHOD")
	legacy_ghost_backup_auth_method: str = Field(
		default="telegram", alias="GHOST_DB_BACKUP_AUTH_METHOD"
	)
	ghost_admin_url: str = Field(
		default="http://127.0.0.1:2368", alias="GHOST_ADMIN_URL"
	)
	ghost_admin_host: str = Field(default="cms.silentflare.com", alias="GHOST_ADMIN_HOST")
	ghost_admin_api_key: str = Field(default="", alias="GHOST_ADMIN_API_KEY", repr=False)
	ghost_admin_api_version: str = Field(default="v6.0", alias="GHOST_ADMIN_API_VERSION")
	ghost_admin_timeout_seconds: int = Field(default=20, alias="GHOST_ADMIN_TIMEOUT_SECONDS")
	log_level: str = Field(default="INFO", alias="LOG_LEVEL")

	@field_validator("web_cookie_secure", mode="before")
	@classmethod
	def parse_boolean(cls, value: object) -> object:
		if isinstance(value, str):
			return value.strip().lower() not in {"0", "false", "no", "off"}
		return value

	@property
	def expected_turnstile_hostnames(self) -> set[str]:
		raw = self.turnstile_expected_hostnames or self.turnstile_expected_hostname
		return {item.strip().lower() for item in raw.split(",") if item.strip()}

	def production_readiness(self) -> dict[str, bool]:
		return {
			"sessionSecret": len(self.account_session_secret) >= 32,
			"cookieDomain": bool(self.account_cookie_domain),
			"turnstileSecret": bool(self.turnstile_secret_key),
			"turnstileHostnames": bool(self.expected_turnstile_hostnames),
		}


@lru_cache(maxsize=1)
def get_settings() -> Settings:
	return Settings()


def reset_settings_cache() -> None:
	"""Allow isolated tests to load a fresh environment."""

	get_settings.cache_clear()
