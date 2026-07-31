from __future__ import annotations

from fastapi import APIRouter, Header, Request, Response

from ...runtime import *
from . import service

router = APIRouter()


@router.post("/account/auth/register")
def account_register(
	payload: AccountRegisterPayload, request: Request, response: Response
) -> dict[str, Any]:
	return service.account_register(payload, request, response)


@router.post("/account/auth/login")
def account_login(
	payload: AccountLoginPayload, request: Request, response: Response
) -> dict[str, Any]:
	return service.account_login(payload, request, response)


@router.post("/account/auth/logout")
def account_logout(
	request: Request, response: Response, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	return service.account_logout(request, response, x_csrf_token)


@router.get("/account/auth/me")
def account_me(request: Request, response: Response) -> dict[str, Any]:
	return service.account_me(request, response)


@router.get("/account/profile")
def account_profile(request: Request) -> dict[str, Any]:
	return service.account_profile(request)


@router.post("/account/profile")
def account_profile_update(payload: AccountProfilePayload, request: Request) -> dict[str, Any]:
	return service.account_profile_update(payload, request)


@router.post("/accounts/register/email/request")
@router.post("/accounts/register/email/request-code")
def register_email_request_code(
	payload: RegisterEmailRequestPayload, request: Request
) -> dict[str, Any]:
	return service.register_email_request_code(payload, request)


@router.post("/accounts/register/email/verify")
@router.post("/accounts/register/email/verify-code")
def register_email_verify_code(
	payload: RegisterEmailVerifyPayload, request: Request
) -> dict[str, Any]:
	return service.register_email_verify_code(payload, request)


@router.post("/accounts/register/email/verify-link")
def register_email_verify_link(payload: EmailLinkVerifyPayload, request: Request) -> dict[str, Any]:
	return service.register_email_verify_link(payload, request)


@router.post("/accounts/register/complete")
def register_complete(payload: RegisterCompletePayload, request: Request) -> dict[str, Any]:
	return service.register_complete(payload, request)


@router.post("/accounts/register/2fa/start")
def registration_2fa_start(payload: RegistrationTwoFAPayload) -> dict[str, Any]:
	return service.registration_2fa_start(payload)


@router.post("/accounts/register/2fa/verify")
def registration_2fa_verify(payload: RegistrationTwoFAPayload) -> dict[str, Any]:
	return service.registration_2fa_verify(payload)


@router.post("/accounts/register/2fa/skip")
def registration_2fa_skip(payload: RegistrationTwoFAPayload) -> dict[str, Any]:
	return service.registration_2fa_skip(payload)


@router.post("/accounts/2fa/setup/start")
def accounts_2fa_setup_start(
	payload: AccountTwoFAStartPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.accounts_2fa_setup_start(payload, request, x_csrf_token)


@router.post("/accounts/2fa/setup/verify")
def accounts_2fa_setup_verify(
	payload: TwoFASetupVerifyPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.accounts_2fa_setup_verify(payload, request, x_csrf_token)


@router.post("/accounts/2fa/disable")
def accounts_2fa_disable(
	payload: AccountTwoFADisablePayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.accounts_2fa_disable(payload, request, x_csrf_token)


@router.get("/accounts/profile")
def accounts_profile_get(request: Request) -> dict[str, Any]:
	return service.accounts_profile_get(request)


@router.get("/accounts/public/{username}")
def accounts_public_profile(username: str) -> dict[str, Any]:
	return service.accounts_public_profile(username)


@router.patch("/accounts/profile")
def accounts_profile_patch(
	payload: UnifiedProfilePayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.accounts_profile_patch(payload, request, x_csrf_token)


@router.post("/accounts/profile/avatar")
async def accounts_profile_avatar_upload(
	request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	return await service.accounts_profile_avatar_upload(request, x_csrf_token)


@router.delete("/accounts/profile/avatar")
def accounts_profile_avatar_delete(
	request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	return service.accounts_profile_avatar_delete(request, x_csrf_token)


@router.post("/accounts/security/email/request")
def accounts_sensitive_email_request(
	payload: AccountSensitiveRequestPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.accounts_sensitive_email_request(payload, request, x_csrf_token)


@router.post("/accounts/security/email/verify")
def accounts_sensitive_email_verify(
	payload: AccountSensitiveVerifyPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.accounts_sensitive_email_verify(payload, request, x_csrf_token)


@router.get("/accounts/security")
def accounts_security_get(request: Request) -> dict[str, Any]:
	return service.accounts_security_get(request)


@router.post("/accounts/security/password")
def accounts_password_update(
	payload: AccountPasswordPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.accounts_password_update(payload, request, x_csrf_token)


@router.patch("/accounts/security/email")
def accounts_email_update(
	payload: AccountEmailUpdatePayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.accounts_email_update(payload, request, x_csrf_token)


@router.post("/accounts/security/export")
def accounts_data_export(
	payload: AccountSensitiveActionPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.accounts_data_export(payload, request, x_csrf_token)


@router.get("/accounts/sessions")
def accounts_sessions_get(request: Request) -> dict[str, Any]:
	return service.accounts_sessions_get(request)


@router.delete("/accounts/sessions/{session_id}")
def accounts_session_delete(
	session_id: str,
	request: Request,
	response: Response,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.accounts_session_delete(session_id, request, response, x_csrf_token)


@router.post("/accounts/sessions/logout-all")
def accounts_sessions_logout_all(
	request: Request, response: Response, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	return service.accounts_sessions_logout_all(request, response, x_csrf_token)


@router.get("/accounts/preferences")
def accounts_preferences_get(request: Request) -> dict[str, Any]:
	return service.accounts_preferences_get(request)


@router.patch("/accounts/preferences/privacy")
def accounts_privacy_update(
	payload: AccountPrivacyPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.accounts_privacy_update(payload, request, x_csrf_token)


@router.patch("/accounts/preferences/notifications")
def accounts_notifications_update(
	payload: AccountNotificationSettingsPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.accounts_notifications_update(payload, request, x_csrf_token)


@router.post("/accounts/danger/clear-profile")
def accounts_clear_profile(
	payload: AccountDangerPayload, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	return service.accounts_clear_profile(payload, request, x_csrf_token)


@router.post("/accounts/danger/clear-comments")
def accounts_clear_comments(
	payload: AccountDangerPayload, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	return service.accounts_clear_comments(payload, request, x_csrf_token)


@router.post("/accounts/danger/deactivate")
def accounts_deactivate(
	payload: AccountDangerPayload,
	request: Request,
	response: Response,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.accounts_deactivate(payload, request, response, x_csrf_token)


@router.post("/accounts/danger/delete")
def accounts_delete(
	payload: AccountDangerPayload, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	return service.accounts_delete(payload, request, x_csrf_token)


@router.post("/accounts/danger/delete/cancel")
def accounts_delete_cancel(
	request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	return service.accounts_delete_cancel(request, x_csrf_token)


@router.post("/accounts/sessions/logout-others")
def accounts_sessions_logout_others(
	payload: AccountSensitiveActionPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.accounts_sessions_logout_others(payload, request, x_csrf_token)


@router.get("/account-avatars/{filename}")
def account_avatar_file(filename: str) -> Response:
	return service.account_avatar_file(filename)
