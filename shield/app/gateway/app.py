from __future__ import annotations

from ..runtime import create_role_app


def _gateway_route(path: str) -> bool:
	return (
		path in {"/", "/__shield/health/live", "/__shield/health/ready", "/__shield/challenge/verify"}
		or path == "/{path:path}"
	)


app = create_role_app("gateway", _gateway_route)
