from __future__ import annotations

from typing import Annotated, Any

from fastapi import APIRouter, File, Header, Request, UploadFile

from . import service
from .schemas import CmsPostWritePayload

router = APIRouter(prefix="/cms", tags=["cms"])


@router.get("/session")
def cms_session(request: Request) -> dict[str, Any]:
	return service.cms_session(request)


@router.get("/overview")
def cms_overview(request: Request) -> dict[str, Any]:
	return service.cms_overview(request)


@router.get("/posts")
def cms_posts(
	request: Request,
	status: str = "all",
	page: int = 1,
	limit: int = 50,
) -> dict[str, Any]:
	return service.cms_posts(request, status=status, page=page, limit=limit)


@router.get("/posts/{post_id}")
def cms_post(post_id: str, request: Request) -> dict[str, Any]:
	return service.cms_post(request, post_id)


@router.post("/posts")
def cms_post_create(
	payload: CmsPostWritePayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.cms_post_create(request, payload, x_csrf_token)


@router.put("/posts/{post_id}")
def cms_post_update(
	post_id: str,
	payload: CmsPostWritePayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.cms_post_update(request, post_id, payload, x_csrf_token)


@router.delete("/posts/{post_id}")
def cms_post_delete(
	post_id: str,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.cms_post_delete(request, post_id, x_csrf_token)


@router.get("/tags")
def cms_tags(request: Request) -> dict[str, Any]:
	return service.cms_tags(request)


@router.post("/images")
def cms_image_upload(
	request: Request,
	file: Annotated[UploadFile, File()],
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.cms_image_upload(request, file, x_csrf_token)
