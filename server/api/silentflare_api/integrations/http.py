from __future__ import annotations

import time
from typing import Any

import httpx


class IntegrationError(RuntimeError):
	pass


class JsonHttpClient:
	"""Synchronous HTTP adapter for FastAPI's thread-pooled sync endpoints."""

	def __init__(self, timeout_seconds: float = 10, retries: int = 1) -> None:
		self.timeout_seconds = timeout_seconds
		self.retries = retries

	def request(
		self,
		method: str,
		url: str,
		*,
		headers: dict[str, str] | None = None,
		json: dict[str, Any] | None = None,
		data: dict[str, str] | None = None,
	) -> dict[str, Any]:
		last_error: Exception | None = None
		for attempt in range(self.retries + 1):
			try:
				with httpx.Client(timeout=self.timeout_seconds, follow_redirects=False) as client:
					response = client.request(
						method,
						url,
						headers=headers,
						json=json,
						data=data,
					)
				response.raise_for_status()
				payload = response.json()
				if not isinstance(payload, dict):
					raise IntegrationError("Upstream returned a non-object response")
				return payload
			except (httpx.HTTPError, ValueError, IntegrationError) as exc:
				last_error = exc
				if attempt < self.retries:
					time.sleep(0.2 * (attempt + 1))
		raise IntegrationError("Upstream request failed") from last_error
