from __future__ import annotations

from fastapi import Header

from ...runtime import *  # noqa: F403


def site_settings_public() -> dict[str, Any]:
	return {"ok": True, "settings": read_site_settings()}


def site_asset_file(filename: str) -> FileResponse:
	if Path(filename).name != filename:
		raise HTTPException(status_code=404, detail="Asset not found")
	path = SITE_ASSET_DIR / filename
	if not path.is_file():
		raise HTTPException(status_code=404, detail="Asset not found")
	return FileResponse(path, headers={"Cache-Control": "public, max-age=31536000, immutable"})


def admin_site_settings(request: Request) -> dict[str, Any]:
	require_admin_console_session(request)
	return {"ok": True, "settings": read_site_settings()}


def admin_site_settings_update(
	payload: SiteSettingsPayload, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	require_admin_console_session(request, x_csrf_token=x_csrf_token, require_csrf=True)
	settings = payload.model_dump()
	settings["name"] = settings["name"].strip()[:80]
	settings["bio"] = settings["bio"].strip()[:300]
	settings["about_markdown"] = settings["about_markdown"].strip()[:30000]
	settings["backgrounds"] = settings["backgrounds"][:12]
	if not settings["name"] or not settings["backgrounds"]:
		raise HTTPException(status_code=400, detail="Name and at least one background are required")
	for background in settings["backgrounds"]:
		if background["type"] not in {"image", "video"}:
			raise HTTPException(status_code=400, detail="Background type must be image or video")
		if not background["url"].startswith(("https://", "/")):
			raise HTTPException(status_code=400, detail="Background URL must use HTTPS")
	now = utc_now()
	local_db_query(
		"INSERT INTO site_settings (id, settings_json, updated_at) VALUES (1, ?, ?) ON CONFLICT(id) DO UPDATE SET settings_json = excluded.settings_json, updated_at = excluded.updated_at",
		[json.dumps(settings, ensure_ascii=False), now],
	)
	return {"ok": True, "settings": {**settings, "updated_at": now}}


async def admin_site_asset_upload(
	request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	require_admin_console_session(request, x_csrf_token=x_csrf_token, require_csrf=True)
	content_type = request.headers.get("content-type", "").split(";", 1)[0].lower()
	extensions = {
		"image/png": ".png",
		"image/jpeg": ".jpg",
		"image/webp": ".webp",
		"image/gif": ".gif",
		"video/mp4": ".mp4",
		"video/webm": ".webm",
	}
	if content_type not in extensions:
		raise HTTPException(status_code=415, detail="Use PNG, JPEG, WebP, GIF, MP4, or WebM")
	data = await request.body()
	if not data or len(data) > SITE_ASSET_MAX_BYTES:
		raise HTTPException(status_code=413, detail="Asset is empty or exceeds the upload limit")
	SITE_ASSET_DIR.mkdir(parents=True, exist_ok=True)
	filename = f"{uuid.uuid4().hex}{extensions[content_type]}"
	(SITE_ASSET_DIR / filename).write_bytes(data)
	return {
		"ok": True,
		"url": f"{SITE_ASSET_PUBLIC_BASE}/{filename}",
		"type": "video" if content_type.startswith("video/") else "image",
	}
