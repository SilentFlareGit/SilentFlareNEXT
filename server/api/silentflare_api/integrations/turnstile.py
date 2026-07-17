from __future__ import annotations

from .http import JsonHttpClient


class TurnstileClient:
	VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

	def __init__(self, http: JsonHttpClient | None = None) -> None:
		self.http = http or JsonHttpClient(timeout_seconds=15, retries=1)

	def verify(self, secret: str, token: str, remote_ip: str) -> dict[str, object]:
		return self.http.request(
			"POST",
			self.VERIFY_URL,
			data={"secret": secret, "response": token, "remoteip": remote_ip},
		)
