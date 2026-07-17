from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import Settings, get_settings
from .core.logging import configure_logging, request_context_middleware
from .db.database import Database
from .db.migrations import migrate_database
from .domains.accounts import router as accounts_router
from .domains.admin import router as admin_router
from .domains.auth import router as auth_router
from .domains.bots import router as bots_router
from .domains.comments import router as comments_router
from .domains.health import router as health_router
from .domains.internal_shield import router as internal_shield_router
from .domains.site_settings import router as site_settings_router

ALLOWED_ORIGINS = [
	*(
		f"https://{host}"
		for host in (
			"blog.silentflare.com",
			"admin.silentflare.com",
			"accounts.silentflare.com",
			"auth.silentflare.com",
			"tgbot.silentflare.com",
			"tgbotmanagement.silentflare.com",
		)
	),
	*(
		f"http://{host}"
		for host in (
			"blog.silentflare.com",
			"admin.silentflare.com",
			"accounts.silentflare.com",
			"auth.silentflare.com",
			"tgbot.silentflare.com",
			"tgbotmanagement.silentflare.com",
		)
	),
]


def create_app(settings: Settings | None = None) -> FastAPI:
	settings = settings or get_settings()
	configure_logging(settings.log_level)

	@asynccontextmanager
	async def lifespan(application: FastAPI) -> AsyncIterator[None]:
		migrate_database(settings.account_db_path)
		yield

	application = FastAPI(title=settings.app_name, lifespan=lifespan)
	application.state.settings = settings
	application.state.database = Database(settings.account_db_path)
	application.middleware("http")(request_context_middleware)
	application.add_middleware(
		CORSMiddleware,
		allow_origins=ALLOWED_ORIGINS,
		allow_credentials=True,
		allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allow_headers=["Content-Type", "X-Admin-Token", "X-CSRF-Token", "X-Request-ID"],
	)
	for router in (
		health_router,
		auth_router,
		accounts_router,
		comments_router,
		site_settings_router,
		admin_router,
		bots_router,
		internal_shield_router,
	):
		application.include_router(router)

	@application.get("/health/live", tags=["health"])
	def liveness() -> dict[str, object]:
		return {"ok": True, "service": settings.app_name}

	@application.get("/health/ready", tags=["health"])
	def readiness() -> dict[str, object]:
		database = application.state.database.health()
		checks = settings.production_readiness()
		return {
			"ok": database["ok"] and all(checks.values()),
			"database": database,
			"configured": checks,
		}

	return application


app = create_app()
