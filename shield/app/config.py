from __future__ import annotations

import json
import os
from dataclasses import dataclass, field
from pathlib import Path


DEFAULT_UPSTREAMS = {
	"blog.silentflare.com": "http://host.docker.internal:4321",
	"accounts.silentflare.com": "http://host.docker.internal:4321",
	"api.silentflare.com": "http://host.docker.internal:9010",
	"admin.silentflare.com": "http://host.docker.internal:4321",
	"cms.silentflare.com": "http://host.docker.internal:2368",
}

CLOUDFLARE_PROXY_CIDRS = (
	"173.245.48.0/20", "103.21.244.0/22", "103.22.200.0/22", "103.31.4.0/22",
	"141.101.64.0/18", "108.162.192.0/18", "190.93.240.0/20", "188.114.96.0/20",
	"197.234.240.0/22", "198.41.128.0/17", "162.158.0.0/15", "104.16.0.0/13",
	"104.24.0.0/14", "172.64.0.0/13", "131.0.72.0/22", "2400:cb00::/32",
	"2606:4700::/32", "2803:f800::/32", "2405:b500::/32", "2405:8100::/32",
	"2a06:98c0::/29", "2c0f:f248::/32",
)


def _boolean(name: str, default: bool) -> bool:
	value = os.getenv(name)
	return default if value is None else value.strip().lower() in {"1", "true", "yes", "on"}


def _integer(name: str, default: int) -> int:
	try:
		return int(os.getenv(name, str(default)))
	except ValueError:
		return default


def _upstreams() -> dict[str, str]:
	raw = os.getenv("SHIELD_UPSTREAMS_JSON")
	if not raw:
		return DEFAULT_UPSTREAMS.copy()
	parsed = json.loads(raw)
	if not isinstance(parsed, dict) or not parsed:
		raise ValueError("SHIELD_UPSTREAMS_JSON must be a non-empty JSON object")
	return {str(host).lower(): str(url).rstrip("/") for host, url in parsed.items()}


def _host_set(name: str, default: str) -> frozenset[str]:
	return frozenset(value.strip().lower() for value in os.getenv(name, default).split(",") if value.strip())


@dataclass(frozen=True)
class Settings:
	mode: str = field(default_factory=lambda: os.getenv("SHIELD_MODE", "observe").lower())
	fail_policy: str = field(default_factory=lambda: os.getenv("SHIELD_FAIL_POLICY", "route").lower())
	database_path: Path = field(
		default_factory=lambda: Path(os.getenv("SHIELD_DATABASE_PATH", "./data/shield.db"))
	)
	internal_signing_key: str = field(
		default_factory=lambda: os.getenv("SHIELD_INTERNAL_SIGNING_KEY", "")
	)
	admin_introspection_url: str = field(
		default_factory=lambda: os.getenv(
			"SHIELD_ADMIN_INTROSPECTION_URL",
			"http://host.docker.internal:9010/auth/me",
		)
	)
	admin_cookie_name: str = field(
		default_factory=lambda: os.getenv("SHIELD_ADMIN_COOKIE_NAME", "sf_bot_session")
	)
	account_snapshot_url: str = field(
		default_factory=lambda: os.getenv(
			"SHIELD_ACCOUNT_SNAPSHOT_URL",
			"http://host.docker.internal:9010/internal/shield/accounts",
		)
	)
	account_session_url: str = field(
		default_factory=lambda: os.getenv(
			"SHIELD_ACCOUNT_SESSION_URL",
			"http://host.docker.internal:9010/internal/shield/session",
		)
	)
	account_response_url: str = field(
		default_factory=lambda: os.getenv(
			"SHIELD_ACCOUNT_RESPONSE_URL",
			"http://host.docker.internal:9010/internal/shield/respond",
		)
	)
	sync_secret: str = field(default_factory=lambda: os.getenv("SHIELD_SYNC_SECRET", ""))
	account_sync_interval: int = field(
		default_factory=lambda: _integer("SHIELD_ACCOUNT_SYNC_INTERVAL", 60)
	)
	account_session_cache_ttl: int = field(
		default_factory=lambda: _integer("SHIELD_ACCOUNT_SESSION_CACHE_TTL", 300)
	)
	cookie_secure: bool = field(default_factory=lambda: _boolean("SHIELD_COOKIE_SECURE", True))
	turnstile_site_key: str = field(default_factory=lambda: os.getenv("SHIELD_TURNSTILE_SITE_KEY", ""))
	turnstile_secret_key: str = field(default_factory=lambda: os.getenv("SHIELD_TURNSTILE_SECRET_KEY", ""))
	turnstile_verify_url: str = field(
		default_factory=lambda: os.getenv(
			"SHIELD_TURNSTILE_VERIFY_URL",
			"https://challenges.cloudflare.com/turnstile/v0/siteverify",
		)
	)
	geo_url_template: str = field(
		default_factory=lambda: os.getenv("SHIELD_GEO_URL_TEMPLATE", "https://ipwho.is/{ip}")
	)
	routing_url_template: str = field(
		default_factory=lambda: os.getenv(
			"SHIELD_ROUTING_URL_TEMPLATE",
			"https://stat.ripe.net/data/network-info/data.json?resource={ip}",
		)
	)
	geo_cache_ttl: int = field(default_factory=lambda: _integer("SHIELD_GEO_CACHE_TTL", 86400))
	proxy_timeout_seconds: int = field(default_factory=lambda: _integer("SHIELD_PROXY_TIMEOUT_SECONDS", 10))
	max_body_bytes: int = field(default_factory=lambda: _integer("SHIELD_MAX_BODY_BYTES", 4_194_304))
	trusted_proxy_cidrs: tuple[str, ...] = field(
		default_factory=lambda: tuple(
			x.strip() for x in os.getenv("SHIELD_TRUSTED_PROXY_CIDRS", "127.0.0.1/32,::1/128").split(",") if x.strip()
		)
	)
	cloudflare_proxy_cidrs: tuple[str, ...] = CLOUDFLARE_PROXY_CIDRS
	upstreams: dict[str, str] = field(default_factory=_upstreams)
	connected_hosts: frozenset[str] = field(
		default_factory=lambda: _host_set("SHIELD_CONNECTED_HOSTS", "api.silentflare.com")
	)
	alert_webhook_url: str = field(default_factory=lambda: os.getenv("SHIELD_ALERT_WEBHOOK_URL", ""))
	allow_private_geo: bool = field(default_factory=lambda: _boolean("SHIELD_ALLOW_PRIVATE_GEO", False))
	public_url: str = field(
		default_factory=lambda: os.getenv(
			"SHIELD_PUBLIC_URL", "https://shield.silentflare.com"
		).rstrip("/")
	)

	def validate(self) -> None:
		if self.mode not in {"bypass", "observe", "enforce"}:
			raise ValueError("SHIELD_MODE must be bypass, observe, or enforce")
		if self.fail_policy not in {"open", "closed", "route"}:
			raise ValueError("SHIELD_FAIL_POLICY must be open, closed, or route")
		if self.mode != "bypass" and len(self.internal_signing_key) < 32:
			raise ValueError("SHIELD_INTERNAL_SIGNING_KEY must be at least 32 characters")


settings = Settings()
