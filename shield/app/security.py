from __future__ import annotations

import base64
import hashlib
import hmac
import json
import struct
import time
from typing import Any


SHIELD_HEADERS = (
	"x-sf-shield-request-id",
	"x-sf-shield-risk-score",
	"x-sf-shield-risk-level",
	"x-sf-shield-country",
	"x-sf-shield-asn",
	"x-sf-shield-ip-type",
	"x-sf-shield-device-id",
	"x-sf-shield-action",
	"x-sf-shield-timestamp",
	"x-sf-shield-signature",
)


def signature_payload(headers: dict[str, str], method: str, path: str) -> bytes:
	lines = [method.upper(), path]
	lines.extend(f"{name}:{headers.get(name, '')}" for name in SHIELD_HEADERS[:-1])
	return "\n".join(lines).encode("utf-8")


def sign_headers(headers: dict[str, str], method: str, path: str, key: str) -> str:
	return hmac.new(key.encode("utf-8"), signature_payload(headers, method, path), hashlib.sha256).hexdigest()


def verify_headers(headers: dict[str, str], method: str, path: str, key: str, max_age: int = 30) -> bool:
	try:
		timestamp = int(headers["x-sf-shield-timestamp"])
		provided = headers["x-sf-shield-signature"]
	except (KeyError, ValueError):
		return False
	if abs(int(time.time()) - timestamp) > max_age:
		return False
	expected = sign_headers(headers, method, path, key)
	return hmac.compare_digest(provided, expected)


def _b64encode(value: bytes) -> str:
	return base64.urlsafe_b64encode(value).rstrip(b"=").decode("ascii")


def _b64decode(value: str) -> bytes:
	return base64.urlsafe_b64decode(value + "=" * (-len(value) % 4))


def issue_token(payload: dict[str, Any], key: str, ttl: int) -> str:
	body = dict(payload)
	body["exp"] = int(time.time()) + ttl
	encoded = _b64encode(json.dumps(body, separators=(",", ":"), sort_keys=True).encode("utf-8"))
	signature = _b64encode(hmac.new(key.encode("utf-8"), encoded.encode("ascii"), hashlib.sha256).digest())
	return f"{encoded}.{signature}"


def read_token(token: str, key: str) -> dict[str, Any] | None:
	try:
		encoded, provided = token.split(".", 1)
		expected = _b64encode(hmac.new(key.encode("utf-8"), encoded.encode("ascii"), hashlib.sha256).digest())
		if not hmac.compare_digest(provided, expected):
			return None
		payload = json.loads(_b64decode(encoded))
		if int(payload.get("exp", 0)) < int(time.time()):
			return None
		return payload
	except (ValueError, TypeError, json.JSONDecodeError):
		return None


def verify_totp(secret: str, code: str, now: int | None = None, window: int = 1) -> bool:
	if not secret or not code.isdigit() or len(code) != 6:
		return False
	try:
		key = base64.b32decode(secret.upper().replace(" ", "") + "=" * (-len(secret) % 8))
	except (ValueError, TypeError):
		return False
	counter = int(now or time.time()) // 30
	for offset in range(-window, window + 1):
		digest = hmac.new(key, struct.pack(">Q", counter + offset), hashlib.sha1).digest()
		index = digest[-1] & 0x0F
		value = (struct.unpack(">I", digest[index : index + 4])[0] & 0x7FFFFFFF) % 1_000_000
		if hmac.compare_digest(f"{value:06d}", code):
			return True
	return False
