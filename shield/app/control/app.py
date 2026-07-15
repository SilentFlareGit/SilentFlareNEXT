from __future__ import annotations

from ..runtime import create_role_app


def _control_route(path: str) -> bool:
	return path.startswith("/__shield/api/admin/") or path in {
		"/__shield/admin",
		"/__shield/static/{filename}",
		"/__shield/health/live",
		"/__shield/health/ready",
	}


app = create_role_app("control", _control_route)
