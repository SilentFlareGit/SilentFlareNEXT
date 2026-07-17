from __future__ import annotations

from fastapi import APIRouter, Header, Request

from ...runtime import *
from . import service

router = APIRouter()


@router.get("/admin/status")
def admin_status(request: Request) -> dict[str, Any]:
	return service.admin_status(request)


@router.get("/admin/users")
def admin_users(request: Request) -> dict[str, Any]:
	return service.admin_users(request)


@router.get("/admin/users/{user_id}")
def admin_user_detail(user_id: str, request: Request) -> dict[str, Any]:
	return service.admin_user_detail(user_id, request)


@router.post("/admin/users/{user_id}/disable")
def admin_user_disable(
	user_id: str, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	return service.admin_user_disable(user_id, request, x_csrf_token)


@router.post("/admin/users/{user_id}/enable")
def admin_user_enable(
	user_id: str, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	return service.admin_user_enable(user_id, request, x_csrf_token)


@router.post("/admin/users/{user_id}/role")
def admin_user_role(
	user_id: str,
	payload: UserRolePayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.admin_user_role(user_id, payload, request, x_csrf_token)


@router.get("/admin/comments")
def admin_comments(
	request: Request,
	post_slug: str | None = None,
	status: str = "all",
	user_id: str | None = None,
	cursor: str | None = None,
	limit: int = 200,
) -> dict[str, Any]:
	return service.admin_comments(request, post_slug, status, user_id, cursor, limit)


@router.post("/admin/comments/{comment_id}/delete")
def admin_comment_delete(
	comment_id: str,
	request: Request,
	payload: CommentModerationPayload | None = None,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.admin_comment_delete(comment_id, request, payload, x_csrf_token)


@router.post("/admin/comments/{comment_id}/restore")
def admin_comment_restore(
	comment_id: str,
	request: Request,
	payload: CommentModerationPayload | None = None,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.admin_comment_restore(comment_id, request, payload, x_csrf_token)


@router.post("/admin/users/{user_id}/deletion/approve")
def admin_user_deletion_approve(
	user_id: str, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	return service.admin_user_deletion_approve(user_id, request, x_csrf_token)


@router.post("/admin/users/{user_id}/deletion/reject")
def admin_user_deletion_reject(
	user_id: str, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	return service.admin_user_deletion_reject(user_id, request, x_csrf_token)
