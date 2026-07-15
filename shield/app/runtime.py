from __future__ import annotations

from collections.abc import Callable

from fastapi import FastAPI
from fastapi.routing import APIRoute

from . import main


RouteFilter = Callable[[str], bool]


def create_role_app(role: str, route_filter: RouteFilter) -> FastAPI:
	application = FastAPI(
		title=f"SilentFlare Shield {role.title()}",
		version=main.app.version,
		docs_url=None,
		redoc_url=None,
		lifespan=main.lifespan,
	)
	application.state.shield_role = role
	for route in main.app.routes:
		if isinstance(route, APIRoute) and route_filter(route.path):
			application.router.routes.append(route)
	return application
