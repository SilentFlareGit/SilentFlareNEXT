from __future__ import annotations

from typing import Any

from .http import JsonHttpClient


class GeoClient:
	def __init__(self, http: JsonHttpClient | None = None) -> None:
		self.http = http or JsonHttpClient(timeout_seconds=8, retries=1)

	def lookup(self, url: str) -> dict[str, Any]:
		return self.http.request("GET", url)
