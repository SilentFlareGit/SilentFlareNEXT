"""Optional verification helper for SilentFlare FastAPI.

Copy this tiny adapter into the API deployment only when an endpoint needs a Shield
decision. It does not make Shield a FastAPI middleware and it never authenticates a
user by itself.
"""

from __future__ import annotations

import hashlib
import hmac
import time
from collections.abc import Mapping


HEADER_NAMES = (
	"x-sf-shield-request-id",
	"x-sf-shield-risk-score",
	"x-sf-shield-risk-level",
	"x-sf-shield-country",
	"x-sf-shield-asn",
	"x-sf-shield-ip-type",
	"x-sf-shield-device-id",
	"x-sf-shield-action",
	"x-sf-shield-timestamp",
)


def verify_shield_headers(headers: Mapping[str, str], method: str, path: str, signing_key: str, max_age_seconds: int = 30) -> bool:
	normalized = {name.lower(): value for name, value in headers.items()}
	try:
		timestamp = int(normalized["x-sf-shield-timestamp"])
		provided = normalized["x-sf-shield-signature"]
	except (KeyError, ValueError):
		return False
	if abs(int(time.time()) - timestamp) > max_age_seconds:
		return False
	payload = "\n".join([method.upper(), path, *(f"{name}:{normalized.get(name, '')}" for name in HEADER_NAMES)])
	expected = hmac.new(signing_key.encode(), payload.encode(), hashlib.sha256).hexdigest()
	return hmac.compare_digest(provided, expected)
