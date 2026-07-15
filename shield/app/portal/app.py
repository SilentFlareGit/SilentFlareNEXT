from __future__ import annotations

from ..runtime import create_role_app


def _portal_route(path: str) -> bool:
	return path in {
		"/",
		"/blocked",
		"/assets/{filename}",
		"/__shield/health/live",
		"/__shield/health/ready",
	}


app = create_role_app("portal", _portal_route)
