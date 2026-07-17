from __future__ import annotations

from ...runtime import *  # noqa: F403


def health() -> dict[str, Any]:
	return {"ok": True, "service": APP_NAME}
