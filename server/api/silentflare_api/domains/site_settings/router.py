from __future__ import annotations

from fastapi import APIRouter, Header, Request

from ...runtime import *
from . import service

router = APIRouter()


@router.get("/site/settings")
def site_settings_public() -> dict[str, Any]:
	return service.site_settings_public()


@router.get("/site-assets/{filename}")
def site_asset_file(filename: str) -> FileResponse:
	return service.site_asset_file(filename)


@router.get("/admin/site-settings")
def admin_site_settings(request: Request) -> dict[str, Any]:
	return service.admin_site_settings(request)


@router.put("/admin/site-settings")
def admin_site_settings_update(
	payload: SiteSettingsPayload, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	return service.admin_site_settings_update(payload, request, x_csrf_token)


@router.post("/admin/site-assets")
async def admin_site_asset_upload(
	request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	return await service.admin_site_asset_upload(request, x_csrf_token)
