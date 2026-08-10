from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from fastapi import Header, HTTPException, Request, UploadFile

from ...integrations.ghost_admin import GhostAdminClient, GhostAdminError
from ...runtime import require_admin_console_session
from .schemas import CmsPostWritePayload

ALLOWED_POST_STATUSES = {"all", "draft", "published", "scheduled"}
ALLOWED_IMAGE_TYPES = {"image/gif", "image/jpeg", "image/png", "image/webp"}
MAX_IMAGE_BYTES = 12 * 1024 * 1024


def _session(
	request: Request,
	x_csrf_token: str | None = None,
	*,
	write: bool = False,
) -> dict[str, Any]:
	return require_admin_console_session(
		request,
		x_csrf_token=x_csrf_token,
		require_csrf=write,
	)


def _client(request: Request) -> GhostAdminClient:
	client = request.app.state.ghost_admin
	if not client.configured:
		raise HTTPException(status_code=503, detail="CMS publishing integration is not configured")
	return client


def _ghost(call: Any) -> dict[str, Any]:
	try:
		return call()
	except GhostAdminError as exc:
		raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


def _post(item: dict[str, Any]) -> dict[str, Any]:
	return {
		"id": str(item.get("id") or ""),
		"uuid": str(item.get("uuid") or ""),
		"title": str(item.get("title") or ""),
		"slug": str(item.get("slug") or ""),
		"status": str(item.get("status") or "draft"),
		"html": str(item.get("html") or ""),
		"customExcerpt": str(item.get("custom_excerpt") or ""),
		"featureImage": str(item.get("feature_image") or ""),
		"createdAt": str(item.get("created_at") or ""),
		"updatedAt": str(item.get("updated_at") or ""),
		"publishedAt": str(item.get("published_at") or ""),
		"url": str(item.get("url") or ""),
		"tags": [
			{
				"id": str(tag.get("id") or ""),
				"name": str(tag.get("name") or ""),
				"slug": str(tag.get("slug") or ""),
			}
			for tag in item.get("tags") or []
			if isinstance(tag, dict)
		],
		"authors": [
			{
				"id": str(author.get("id") or ""),
				"name": str(author.get("name") or ""),
			}
			for author in item.get("authors") or []
			if isinstance(author, dict)
		],
	}


def _audit(
	request: Request,
	actor: str,
	action: str,
	resource_type: str,
	resource_id: str,
	detail: dict[str, Any],
) -> None:
	request.app.state.database.query(
		"""INSERT INTO cms_audit_log(actor, action, resource_type, resource_id,
		detail_json, created_at) VALUES (?, ?, ?, ?, ?, ?)""",
		(
			actor,
			action,
			resource_type,
			resource_id,
			json.dumps(detail, separators=(",", ":"), ensure_ascii=True),
			datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
		),
	)


def _write_payload(payload: CmsPostWritePayload, *, include_updated: bool) -> dict[str, Any]:
	post: dict[str, Any] = {
		"title": payload.title.strip() or "Untitled",
		"html": payload.html,
		"status": payload.status,
		"tags": [tag.strip() for tag in payload.tags if tag.strip()][:50],
		"custom_excerpt": payload.custom_excerpt.strip() or None,
		"feature_image": payload.feature_image.strip() or None,
	}
	if payload.slug.strip():
		post["slug"] = payload.slug.strip()
	if include_updated:
		if not payload.updated_at.strip():
			raise HTTPException(status_code=422, detail="The latest updated_at value is required")
		post["updated_at"] = payload.updated_at.strip()
	return post


def cms_session(request: Request) -> dict[str, Any]:
	session = _session(request)
	client = request.app.state.ghost_admin
	return {
		"authenticated": True,
		"actor": str(session["bot_id"]),
		"csrf": str(session["csrf"]),
		"configured": bool(client.configured),
	}


def cms_overview(request: Request) -> dict[str, Any]:
	_session(request)
	client = _client(request)
	counts: dict[str, int] = {}
	for status in ("draft", "published", "scheduled"):
		payload = _ghost(
			lambda status=status: client.request(
				"GET",
				"posts/",
				params={"limit": 1, "page": 1, "filter": f"status:{status}"},
			)
		)
		counts[status] = int(
			((payload.get("meta") or {}).get("pagination") or {}).get("total") or 0
		)
	return {"ok": True, "counts": counts, "total": sum(counts.values())}


def cms_posts(request: Request, *, status: str, page: int, limit: int) -> dict[str, Any]:
	_session(request)
	status = status.strip().lower()
	if status not in ALLOWED_POST_STATUSES:
		raise HTTPException(status_code=422, detail="Unsupported post status")
	params: dict[str, Any] = {
		"include": "tags,authors",
		"formats": "html",
		"limit": max(1, min(100, limit)),
		"page": max(1, page),
		"order": "updated_at desc",
	}
	if status != "all":
		params["filter"] = f"status:{status}"
	payload = _ghost(lambda: _client(request).request("GET", "posts/", params=params))
	return {
		"items": [_post(item) for item in payload.get("posts") or [] if isinstance(item, dict)],
		"pagination": (payload.get("meta") or {}).get("pagination") or {},
	}


def cms_post(request: Request, post_id: str) -> dict[str, Any]:
	_session(request)
	payload = _ghost(
		lambda: _client(request).request(
			"GET",
			f"posts/{post_id}/",
			params={"include": "tags,authors", "formats": "html"},
		)
	)
	posts = payload.get("posts") or []
	if not posts:
		raise HTTPException(status_code=404, detail="Post not found")
	return {"post": _post(posts[0])}


def cms_post_create(
	request: Request,
	payload: CmsPostWritePayload,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	session = _session(request, x_csrf_token, write=True)
	ghost_payload = _ghost(
		lambda: _client(request).request(
			"POST",
			"posts/",
			params={"source": "html"},
			json_payload={"posts": [_write_payload(payload, include_updated=False)]},
		)
	)
	post = _post((ghost_payload.get("posts") or [])[0])
	_audit(
		request,
		str(session["bot_id"]),
		"post.create",
		"post",
		post["id"],
		{"title": post["title"], "status": post["status"]},
	)
	return {"ok": True, "post": post}


def cms_post_update(
	request: Request,
	post_id: str,
	payload: CmsPostWritePayload,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	session = _session(request, x_csrf_token, write=True)
	ghost_payload = _ghost(
		lambda: _client(request).request(
			"PUT",
			f"posts/{post_id}/",
			params={"source": "html", "save_revision": "true"},
			json_payload={"posts": [_write_payload(payload, include_updated=True)]},
		)
	)
	post = _post((ghost_payload.get("posts") or [])[0])
	_audit(
		request,
		str(session["bot_id"]),
		"post.update",
		"post",
		post["id"],
		{"title": post["title"], "status": post["status"]},
	)
	return {"ok": True, "post": post}


def cms_post_delete(
	request: Request,
	post_id: str,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	session = _session(request, x_csrf_token, write=True)
	_ghost(lambda: _client(request).request("DELETE", f"posts/{post_id}/"))
	_audit(request, str(session["bot_id"]), "post.delete", "post", post_id, {})
	return {"ok": True}


def cms_tags(request: Request) -> dict[str, Any]:
	_session(request)
	payload = _ghost(
		lambda: _client(request).request(
			"GET",
			"tags/",
			params={"limit": "all", "order": "name asc"},
		)
	)
	return {
		"tags": [
			{
				"id": str(tag.get("id") or ""),
				"name": str(tag.get("name") or ""),
				"slug": str(tag.get("slug") or ""),
				"count": int(((tag.get("count") or {}).get("posts")) or 0),
			}
			for tag in payload.get("tags") or []
			if isinstance(tag, dict)
		]
	}


def cms_image_upload(
	request: Request,
	file: UploadFile,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	session = _session(request, x_csrf_token, write=True)
	content_type = (file.content_type or "").lower()
	if content_type not in ALLOWED_IMAGE_TYPES:
		raise HTTPException(status_code=415, detail="Upload a PNG, JPEG, GIF, or WebP image")
	content = file.file.read(MAX_IMAGE_BYTES + 1)
	if not content or len(content) > MAX_IMAGE_BYTES:
		raise HTTPException(status_code=413, detail="Image must be between 1 byte and 12 MB")
	filename = Path(file.filename or "upload").name[:180]
	payload = _ghost(
		lambda: _client(request).request(
			"POST",
			"images/upload/",
			files={"file": (filename, content, content_type)},
			data={"purpose": "image", "ref": filename},
		)
	)
	images = payload.get("images") or []
	if not images:
		raise HTTPException(status_code=502, detail="Ghost did not return the uploaded image")
	image = {
		"url": str(images[0].get("url") or ""),
		"ref": str(images[0].get("ref") or filename),
	}
	_audit(
		request,
		str(session["bot_id"]),
		"image.upload",
		"image",
		image["url"],
		{"filename": filename, "contentType": content_type, "bytes": len(content)},
	)
	return {"ok": True, "image": image}
