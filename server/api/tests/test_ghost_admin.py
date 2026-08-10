from __future__ import annotations

import base64
import hashlib
import hmac
import json

from server.api.silentflare_api.core.config import Settings
from server.api.silentflare_api.integrations.ghost_admin import GhostAdminClient


def _decode(value: str) -> dict[str, object]:
	padding = "=" * (-len(value) % 4)
	return json.loads(base64.urlsafe_b64decode(value + padding))


def test_ghost_admin_token_is_short_lived_and_correctly_signed() -> None:
	key_id = "ab" * 12
	secret = "cd" * 32
	client = GhostAdminClient(
		Settings(GHOST_ADMIN_API_KEY=f"{key_id}:{secret}")
	)

	assert client.configured is True
	header_value, payload_value, signature = client._token().split(".")
	header = _decode(header_value)
	payload = _decode(payload_value)
	expected = hmac.new(
		bytes.fromhex(secret),
		f"{header_value}.{payload_value}".encode("ascii"),
		hashlib.sha256,
	).digest()
	actual = base64.urlsafe_b64decode(signature + "=" * (-len(signature) % 4))

	assert header == {"alg": "HS256", "kid": key_id, "typ": "JWT"}
	assert payload["aud"] == "/admin/"
	assert int(payload["exp"]) - int(payload["iat"]) == 300
	assert hmac.compare_digest(actual, expected)


def test_ghost_admin_rejects_malformed_integration_key() -> None:
	client = GhostAdminClient(Settings(GHOST_ADMIN_API_KEY="not-an-admin-key"))
	assert client.configured is False
