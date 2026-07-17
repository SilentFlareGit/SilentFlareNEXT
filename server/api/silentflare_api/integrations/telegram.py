from __future__ import annotations

from typing import Any

from .http import JsonHttpClient


class TelegramClient:
	def __init__(self, http: JsonHttpClient | None = None) -> None:
		self.http = http or JsonHttpClient(timeout_seconds=10, retries=1)

	def call(self, token: str, method: str, payload: dict[str, Any]) -> dict[str, Any]:
		return self.http.request(
			"POST",
			f"https://api.telegram.org/bot{token}/{method}",
			json=payload,
		)
