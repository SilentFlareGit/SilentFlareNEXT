from __future__ import annotations

import base64
import hashlib
import hmac
import json
import time
from typing import Any

import httpx

from ..core.config import Settings


class GhostAdminError(RuntimeError):
	def __init__(self, detail: str, *, status_code: int = 502) -> None:
		super().__init__(detail)
		self.detail = detail
		self.status_code = status_code


def _base64url(value: bytes) -> str:
	return base64.urlsafe_b64encode(value).rstrip(b"=").decode("ascii")


class GhostAdminClient:
	"""Server-only adapter for the Ghost Admin API."""

	def __init__(self, settings: Settings) -> None:
		self.base_url = settings.ghost_admin_url.rstrip("/")
		self.host = settings.ghost_admin_host.strip()
		self.api_key = settings.ghost_admin_api_key.strip()
		self.api_version = settings.ghost_admin_api_version.strip() or "v6.0"
		self.timeout_seconds = max(5, min(60, settings.ghost_admin_timeout_seconds))

	@property
	def configured(self) -> bool:
		if not self.base_url or ":" not in self.api_key:
			return False
		key_id, secret = self.api_key.split(":", 1)
		if len(key_id) != 24 or len(secret) != 64:
			return False
		try:
			bytes.fromhex(key_id)
			bytes.fromhex(secret)
		except ValueError:
			return False
		return True

	def _token(self) -> str:
		if not self.configured:
			raise GhostAdminError("CMS publishing integration is not configured", status_code=503)
		key_id, secret = self.api_key.split(":", 1)
		now = int(time.time())
		header = _base64url(
			json.dumps(
				{"alg": "HS256", "kid": key_id, "typ": "JWT"},
				separators=(",", ":"),
			).encode("utf-8")
		)
		payload = _base64url(
			json.dumps(
				{"iat": now, "exp": now + 300, "aud": "/admin/"},
				separators=(",", ":"),
			).encode("utf-8")
		)
		unsigned = f"{header}.{payload}"
		signature = hmac.new(
			bytes.fromhex(secret), unsigned.encode("ascii"), hashlib.sha256
		).digest()
		return f"{unsigned}.{_base64url(signature)}"

	def request(
		self,
		method: str,
		path: str,
		*,
		params: dict[str, Any] | None = None,
		json_payload: dict[str, Any] | None = None,
		files: dict[str, tuple[str, bytes, str]] | None = None,
		data: dict[str, str] | None = None,
	) -> dict[str, Any]:
		url = f"{self.base_url}/ghost/api/admin/{path.lstrip('/')}"
		headers = {
			"Accept": "application/json",
			"Accept-Version": self.api_version,
			"Authorization": f"Ghost {self._token()}",
			"Host": self.host,
			"X-Forwarded-Proto": "https",
		}
		try:
			with httpx.Client(timeout=self.timeout_seconds, follow_redirects=False) as client:
				response = client.request(
					method,
					url,
					headers=headers,
					params=params,
					json=json_payload,
					files=files,
					data=data,
				)
		except httpx.HTTPError as exc:
			raise GhostAdminError("Ghost publishing service is unavailable") from exc
		if response.status_code >= 400:
			detail = "Ghost rejected the publishing request"
			try:
				payload = response.json()
				errors = payload.get("errors") if isinstance(payload, dict) else None
				if isinstance(errors, list) and errors and isinstance(errors[0], dict):
					detail = str(errors[0].get("message") or detail)[:240]
			except ValueError:
				pass
			status = (
				404
				if response.status_code == 404
				else 409
				if response.status_code == 409
				else 422
				if response.status_code == 400
				else 502
			)
			raise GhostAdminError(detail, status_code=status)
		if response.status_code == 204 or not response.content:
			return {"ok": True}
		try:
			payload = response.json()
		except ValueError as exc:
			raise GhostAdminError("Ghost returned an invalid response") from exc
		if not isinstance(payload, dict):
			raise GhostAdminError("Ghost returned an invalid response")
		return payload
