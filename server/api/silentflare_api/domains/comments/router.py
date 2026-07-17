from __future__ import annotations

from fastapi import APIRouter, Header, Request

from ...runtime import *
from . import service

router = APIRouter()


@router.get("/comments")
def comments(postSlug: str, cursor: str | None = None, limit: int = 200) -> dict[str, Any]:
	return service.comments(postSlug, cursor, limit)


@router.post("/comments/create")
def comment_create(
	payload: CommentCreatePayload, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	return service.comment_create(payload, request, x_csrf_token)


@router.delete("/comments/{comment_id}")
def comment_delete(
	comment_id: str, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	return service.comment_delete(comment_id, request, x_csrf_token)


@router.patch("/comments/{comment_id}")
def comment_update(
	comment_id: str,
	payload: CommentUpdatePayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.comment_update(comment_id, payload, request, x_csrf_token)
