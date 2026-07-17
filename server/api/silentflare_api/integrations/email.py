from __future__ import annotations

from .http import JsonHttpClient


class EmailClient:
	def __init__(self, http: JsonHttpClient | None = None) -> None:
		self.http = http or JsonHttpClient(timeout_seconds=15, retries=1)

	def send(
		self,
		*,
		api_url: str,
		api_key: str,
		sender: str,
		recipient: str,
		subject: str,
		html: str,
		text: str,
		idempotency_key: str,
	) -> dict[str, object]:
		return self.http.request(
			"POST",
			api_url,
			headers={
				"Authorization": f"Bearer {api_key}",
				"Content-Type": "application/json",
				"Idempotency-Key": idempotency_key,
			},
			json={
				"from": sender,
				"to": [recipient],
				"subject": subject,
				"html": html,
				"text": text,
			},
		)
