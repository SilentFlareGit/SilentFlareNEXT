from __future__ import annotations

from fastapi import APIRouter, Header, Request, Response

from ...runtime import *
from . import service

router = APIRouter()


@router.get("/auth/session")
def unified_auth_session(request: Request, response: Response) -> dict[str, Any]:
	return service.unified_auth_session(request, response)


@router.get("/auth/return-url")
def auth_return_url(return_url: str = "") -> dict[str, str]:
	return service.auth_return_url(return_url)


@router.post("/auth/session/refresh")
def unified_session_refresh(
	payload: SessionRefreshPayload,
	request: Request,
	response: Response,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.unified_session_refresh(payload, request, response, x_csrf_token)


@router.post("/auth/login/password")
def unified_login_password(
	payload: UnifiedLoginPasswordPayload, request: Request, response: Response
) -> dict[str, Any]:
	return service.unified_login_password(payload, request, response)


@router.post("/auth/login/email/request")
@router.post("/auth/login/email/request-code")
def unified_login_email_request_code(
	payload: EmailCodeRequestPayload, request: Request
) -> dict[str, Any]:
	return service.unified_login_email_request_code(payload, request)


@router.post("/auth/login/email/verify")
@router.post("/auth/login/email/verify-code")
def unified_login_email_verify_code(
	payload: EmailCodeVerifyPayload, request: Request, response: Response
) -> dict[str, Any]:
	return service.unified_login_email_verify_code(payload, request, response)


@router.post("/auth/login/email/verify-link")
def unified_login_email_verify_link(
	payload: EmailLinkVerifyPayload, request: Request, response: Response
) -> dict[str, Any]:
	return service.unified_login_email_verify_link(payload, request, response)


@router.post("/auth/2fa/verify")
def unified_2fa_verify(
	payload: TwoFAVerifyPayload, request: Request, response: Response
) -> dict[str, Any]:
	return service.unified_2fa_verify(payload, request, response)


@router.post("/auth/session/logout")
def unified_logout(
	request: Request, response: Response, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	return service.unified_logout(request, response, x_csrf_token)


@router.get("/auth/oauth/{provider}/start")
def oauth_start(provider: str, return_url: str = "") -> dict[str, Any]:
	return service.oauth_start(provider, return_url)


@router.get("/auth/oauth/{provider}/callback")
def oauth_callback(provider: str) -> dict[str, Any]:
	return service.oauth_callback(provider)
