from __future__ import annotations

import json
import logging
import time
import uuid
from collections.abc import Awaitable, Callable

from fastapi import Request, Response

SENSITIVE_KEYS = {
	"authorization",
	"cookie",
	"csrf",
	"password",
	"secret",
	"token",
	"totp",
	"verification_code",
}


class JsonFormatter(logging.Formatter):
	def format(self, record: logging.LogRecord) -> str:
		payload = {
			"timestamp": self.formatTime(record, "%Y-%m-%dT%H:%M:%S%z"),
			"level": record.levelname,
			"logger": record.name,
			"message": record.getMessage(),
		}
		for key in ("request_id", "method", "path", "status", "duration_ms"):
			value = getattr(record, key, None)
			if value is not None:
				payload[key] = value
		return json.dumps(payload, ensure_ascii=True, separators=(",", ":"))


def configure_logging(level: str = "INFO") -> None:
	handler = logging.StreamHandler()
	handler.setFormatter(JsonFormatter())
	root = logging.getLogger()
	root.handlers.clear()
	root.addHandler(handler)
	root.setLevel(level.upper())


async def request_context_middleware(
	request: Request,
	call_next: Callable[[Request], Awaitable[Response]],
) -> Response:
	request_id = request.headers.get("x-request-id", "")[:128] or str(uuid.uuid4())
	started = time.perf_counter()
	status = 500
	try:
		response = await call_next(request)
		status = response.status_code
		response.headers["X-Request-ID"] = request_id
		return response
	finally:
		logging.getLogger("silentflare.request").info(
			"request",
			extra={
				"request_id": request_id,
				"method": request.method,
				"path": request.url.path,
				"status": status,
				"duration_ms": round((time.perf_counter() - started) * 1000, 2),
			},
		)
