from __future__ import annotations

from fastapi import Header

from ...runtime import *  # noqa: F403


def unified_auth_session(request: Request, response: Response) -> dict[str, Any]:
	if not account_auth_configured():
		return {
			"authenticated": False,
			"user": None,
			"configured": False,
			"emailConfigured": bool(AUTH_EMAIL_API_KEY and AUTH_EMAIL_FROM),
			"tosVersion": AUTH_TOS_VERSION,
		}
	finalize_due_account_deletions()
	d1_query("DELETE FROM sessions WHERE expires_at <= ?", [utc_now()])
	user = get_account_user(request)
	if not user:
		clear_account_cookie(response)
		return {
			"authenticated": False,
			"user": None,
			"configured": True,
			"emailConfigured": bool(AUTH_EMAIL_API_KEY and AUTH_EMAIL_FROM),
			"tosVersion": AUTH_TOS_VERSION,
		}
	token = request.cookies.get(ACCOUNT_SESSION_COOKIE, "")
	return {
		"authenticated": True,
		"user": account_user_payload(user),
		"configured": True,
		"emailConfigured": bool(AUTH_EMAIL_API_KEY and AUTH_EMAIL_FROM),
		"tosVersion": AUTH_TOS_VERSION,
		"csrf": account_csrf_token(token),
	}


def auth_return_url(return_url: str = "") -> dict[str, str]:
	return {"return_url": sanitize_return_url(return_url)}


def unified_session_refresh(
	payload: SessionRefreshPayload,
	request: Request,
	response: Response,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	old_token = request.cookies.get(ACCOUNT_SESSION_COOKIE, "")
	d1_query("DELETE FROM sessions WHERE session_hash = ?", [account_session_hash(old_token)])
	csrf = create_account_session(response, request, str(user["id"]))
	return {"ok": True, "csrf": csrf, "return_url": sanitize_return_url(payload.return_url)}


def unified_login_password(
	payload: UnifiedLoginPasswordPayload, request: Request, response: Response
) -> dict[str, Any]:
	check_login_rate_limit(request)
	enforce_auth_rate_limit("password-login", client_key(request), 10, 900)
	require_account_turnstile(payload.turnstile_token, request, "login")
	if not account_auth_configured():
		raise HTTPException(status_code=503, detail="Account API is not configured")
	row = lookup_user_by_email_or_username(payload.email_or_username)
	if (
		not row
		or row.get("disabled_at")
		or (
			not verify_account_password(
				payload.password,
				str(row.get("password_hash") or ""),
				str(row.get("password_salt") or ""),
			)
		)
	):
		record_login_failure(request)
		raise HTTPException(status_code=401, detail="Invalid credentials")
	BOT_STATE.clear_failures(client_key(request))
	return_url = sanitize_return_url(payload.return_url)
	if row.get("totp_enabled") and row.get("totp_secret"):
		pending_id = create_auth_flow(
			"pending-login", user_id=str(row["id"]), return_url=return_url
		)
		return {
			"ok": True,
			"requires_2fa": True,
			"pending_id": pending_id,
			"return_url": return_url,
		}
	csrf = create_account_session(response, request, str(row["id"]))
	return {
		"ok": True,
		"requires_2fa": False,
		"user": account_user_payload(row),
		"csrf": csrf,
		"return_url": return_url,
	}


def unified_login_email_request_code(
	payload: EmailCodeRequestPayload, request: Request
) -> dict[str, Any]:
	check_login_rate_limit(request)
	require_account_turnstile(payload.turnstile_token, request, "login")
	if not account_auth_configured():
		raise HTTPException(status_code=503, detail="Account API is not configured")
	email = normalize_email(payload.email)
	rows = d1_query("SELECT id FROM users WHERE email = ? AND disabled_at IS NULL LIMIT 1", [email])
	if rows:
		create_email_verification(
			email,
			"login",
			request,
			user_id=str(rows[0]["id"]),
			return_url=getattr(payload, "return_url", ""),
		)
	return {"ok": True, "message": "If the account exists, a code has been sent."}


def unified_login_email_verify_code(
	payload: EmailCodeVerifyPayload, request: Request, response: Response
) -> dict[str, Any]:
	if not account_auth_configured():
		raise HTTPException(status_code=503, detail="Account API is not configured")
	email = normalize_email(payload.email)
	enforce_auth_rate_limit("email-code-verify", client_key(request), 20, 900)
	if not verify_email_code(email, payload.code, "login"):
		record_login_failure(request)
		raise HTTPException(status_code=401, detail="Invalid or expired verification code")
	rows = d1_query(
		"\n\t\tSELECT id, email, username, role, display_name, avatar_url, bio,\n\t\t\t   display_region, disabled_at, password_hash, totp_secret, totp_enabled\n\t\tFROM users WHERE email = ? AND disabled_at IS NULL LIMIT 1\n\t\t",
		[email],
	)
	if not rows:
		raise HTTPException(status_code=404, detail="Account not found")
	row = rows[0]
	BOT_STATE.clear_failures(client_key(request))
	return_url = sanitize_return_url(payload.return_url)
	if row.get("totp_enabled") and row.get("totp_secret"):
		pending_id = create_auth_flow(
			"pending-login", user_id=str(row["id"]), return_url=return_url
		)
		return {
			"ok": True,
			"requires_2fa": True,
			"pending_id": pending_id,
			"return_url": return_url,
		}
	csrf = create_account_session(response, request, str(row["id"]))
	return {
		"ok": True,
		"requires_2fa": False,
		"user": account_user_payload(row),
		"csrf": csrf,
		"return_url": return_url,
	}


def unified_login_email_verify_link(
	payload: EmailLinkVerifyPayload, request: Request, response: Response
) -> dict[str, Any]:
	if not account_auth_configured():
		raise HTTPException(status_code=503, detail="Account API is not configured")
	enforce_auth_rate_limit("email-link-verify", client_key(request), 20, 900)
	flow = consume_email_link(payload.token, "login")
	user_id = str(flow.get("user_id") or "")
	row = lookup_user_by_email_or_username(str(flow.get("email") or ""))
	if not row or str(row.get("id") or "") != user_id or row.get("disabled_at"):
		raise HTTPException(status_code=404, detail="Account not found")
	BOT_STATE.clear_failures(client_key(request))
	return_url = sanitize_return_url(str(flow.get("return_url") or ""))
	if row.get("totp_enabled") and row.get("totp_secret"):
		pending_id = create_auth_flow("pending-login", user_id=user_id, return_url=return_url)
		return {
			"ok": True,
			"requires_2fa": True,
			"pending_id": pending_id,
			"return_url": return_url,
		}
	csrf = create_account_session(response, request, user_id)
	return {
		"ok": True,
		"requires_2fa": False,
		"user": account_user_payload(row),
		"csrf": csrf,
		"return_url": return_url,
	}


def unified_2fa_verify(
	payload: TwoFAVerifyPayload, request: Request, response: Response
) -> dict[str, Any]:
	if not account_auth_configured():
		raise HTTPException(status_code=503, detail="Account API is not configured")
	flow = get_auth_flow(payload.pending_id, "pending-login")
	if int(flow.get("attempts") or 0) >= AUTH_CODE_ATTEMPT_LIMIT:
		raise HTTPException(status_code=429, detail="Too many 2FA attempts")
	user_id = str(flow.get("user_id") or "")
	rows = d1_query(
		"\n\t\tSELECT id, email, username, role, display_name, avatar_url, bio,\n\t\t\t   display_region, disabled_at, password_hash, totp_secret, totp_enabled\n\t\tFROM users WHERE id = ? AND disabled_at IS NULL LIMIT 1\n\t\t",
		[user_id],
	)
	if not rows or not rows[0].get("totp_secret"):
		raise HTTPException(status_code=401, detail="2FA not configured for this account")
	if not verify_totp(open_totp_secret(str(rows[0]["totp_secret"])), payload.code):
		d1_query("UPDATE auth_flows SET attempts = attempts + 1 WHERE id = ?", [flow["id"]])
		raise HTTPException(status_code=401, detail="Invalid 2FA code")
	consume_auth_flow(str(flow["id"]))
	csrf = create_account_session(response, request, user_id)
	return {
		"ok": True,
		"user": account_user_payload(rows[0]),
		"csrf": csrf,
		"return_url": sanitize_return_url(str(flow.get("return_url") or "")),
	}


def unified_logout(
	request: Request, response: Response, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	token = request.cookies.get(ACCOUNT_SESSION_COOKIE, "")
	if token and account_auth_configured():
		require_account_csrf(request, x_csrf_token)
		d1_query("DELETE FROM sessions WHERE session_hash = ?", [account_session_hash(token)])
	clear_account_cookie(response)
	return {"ok": True}


def oauth_start(provider: str, return_url: str = "") -> dict[str, Any]:
	if provider not in {"google", "github", "telegram"}:
		raise HTTPException(status_code=404, detail="OAuth provider not found")
	return {
		"ok": False,
		"provider": provider,
		"available": False,
		"return_url": sanitize_return_url(return_url),
		"detail": "OAuth provider is reserved but not configured",
	}


def oauth_callback(provider: str) -> dict[str, Any]:
	if provider not in {"google", "github", "telegram"}:
		raise HTTPException(status_code=404, detail="OAuth provider not found")
	raise HTTPException(status_code=501, detail="OAuth provider is not configured")
