from __future__ import annotations

from fastapi import Header

from ...runtime import *  # noqa: F403


def account_register(
	payload: AccountRegisterPayload, request: Request, response: Response
) -> dict[str, Any]:
	raise HTTPException(
		status_code=410,
		detail="Registration moved to the verified email flow on accounts.silentflare.com",
	)


def account_login(
	payload: AccountLoginPayload, request: Request, response: Response
) -> dict[str, Any]:
	raise HTTPException(status_code=410, detail="Login moved to auth.silentflare.com")


def account_logout(
	request: Request, response: Response, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	token = request.cookies.get(ACCOUNT_SESSION_COOKIE, "")
	if token and account_auth_configured():
		require_account_csrf(request, x_csrf_token)
		d1_query("DELETE FROM sessions WHERE session_hash = ?", [account_session_hash(token)])
	clear_account_cookie(response)
	return {"ok": True}


def account_me(request: Request, response: Response) -> dict[str, Any]:
	if not account_auth_configured():
		return {"user": None, "configured": False}
	finalize_due_account_deletions()
	d1_query("DELETE FROM sessions WHERE expires_at <= ?", [utc_now()])
	user = get_account_user(request)
	if not user:
		clear_account_cookie(response)
		return {"user": None, "configured": True}
	return {
		"user": account_user_payload(user),
		"configured": True,
		"csrf": account_csrf_token(request.cookies.get(ACCOUNT_SESSION_COOKIE, "")),
	}


def account_profile(request: Request) -> dict[str, Any]:
	user = require_account_user(request)
	return {"ok": True, "user": account_user_payload(user)}


def account_profile_update(payload: AccountProfilePayload, request: Request) -> dict[str, Any]:
	raise HTTPException(status_code=410, detail="Use PATCH /accounts/profile")


def register_email_request_code(
	payload: RegisterEmailRequestPayload, request: Request
) -> dict[str, Any]:
	check_login_rate_limit(request)
	require_account_turnstile(payload.turnstile_token, request, "register")
	if not account_auth_configured():
		raise HTTPException(status_code=503, detail="Account API is not configured")
	email = normalize_email(payload.email)
	existing = d1_query("SELECT id FROM users WHERE email = ? LIMIT 1", [email])
	if not existing:
		create_email_verification(email, "register", request)
	return {"ok": True, "message": "If the email is available, a code has been sent."}


def register_email_verify_code(
	payload: RegisterEmailVerifyPayload, request: Request
) -> dict[str, Any]:
	if not account_auth_configured():
		raise HTTPException(status_code=503, detail="Account API is not configured")
	email = normalize_email(payload.email)
	enforce_auth_rate_limit("register-code-verify", client_key(request), 20, 900)
	if not verify_email_code(email, payload.code, "register"):
		record_login_failure(request)
		raise HTTPException(status_code=401, detail="Invalid or expired verification code")
	if d1_query("SELECT id FROM users WHERE email = ? LIMIT 1", [email]):
		raise HTTPException(status_code=409, detail="An account with this email already exists")
	reg_token = create_auth_flow("registration", email=email)
	BOT_STATE.clear_failures(client_key(request))
	return {"ok": True, "reg_token": reg_token, "tos_version": AUTH_TOS_VERSION}


def register_email_verify_link(payload: EmailLinkVerifyPayload, request: Request) -> dict[str, Any]:
	if not account_auth_configured():
		raise HTTPException(status_code=503, detail="Account API is not configured")
	enforce_auth_rate_limit("register-link-verify", client_key(request), 20, 900)
	flow = consume_email_link(payload.token, "register")
	email = normalize_email(str(flow.get("email") or ""))
	if d1_query("SELECT id FROM users WHERE email = ? LIMIT 1", [email]):
		raise HTTPException(status_code=409, detail="An account with this email already exists")
	reg_token = create_auth_flow("registration", email=email)
	BOT_STATE.clear_failures(client_key(request))
	return {"ok": True, "email": email, "reg_token": reg_token, "tos_version": AUTH_TOS_VERSION}


def register_complete(payload: RegisterCompletePayload, request: Request) -> dict[str, Any]:
	if not account_auth_configured():
		raise HTTPException(status_code=503, detail="Account API is not configured")
	flow = get_auth_flow(payload.reg_token, "registration")
	email = str(flow.get("email") or "")
	username = normalize_username(payload.username)
	if not payload.tos_accepted or payload.tos_version != AUTH_TOS_VERSION:
		raise HTTPException(status_code=400, detail="Current Terms of Service must be accepted")
	password = validate_account_password(payload.password) if payload.password else ""
	existing = d1_query(
		"SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1", [email, username]
	)
	if existing:
		raise HTTPException(status_code=409, detail="Email or username is already in use")
	password_hash, salt = hash_account_password(password) if password else ("", "")
	now = utc_now()
	user_id = str(uuid.uuid4())
	display_name = payload.display_name.strip()[:80]
	region = lookup_ip_region(request)
	display_region = display_region_value(region)
	display_region_code = region.get("country_code", "")[:2].upper()
	try:
		ensure_account_db()
		with sqlite3.connect(ACCOUNT_DB_PATH) as connection:
			connection.execute("PRAGMA foreign_keys = ON")
			connection.execute(
				"\n\t\t\t\tINSERT INTO users\n\t\t\t\t\t(id, email, username, password_hash, password_salt, role,\n\t\t\t\t\t email_verified_at, display_name, display_region, display_region_code,\n\t\t\t\t\t display_region_updated_at, tos_version, tos_accepted_at, created_at, updated_at,\n\t\t\t\t\t registration_ip, last_seen_ip, last_seen_at, last_user_agent)\n\t\t\t\tVALUES (?, ?, ?, ?, ?, 'user', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n\t\t\t\t",
				[
					user_id,
					email,
					username,
					password_hash,
					salt,
					now,
					display_name,
					display_region,
					display_region_code,
					now,
					AUTH_TOS_VERSION,
					now,
					now,
					now,
					request_public_ip(request),
					request_public_ip(request),
					now,
					(request.headers.get("user-agent") or "")[:500],
				],
			)
			connection.execute(
				"\n\t\t\t\tINSERT INTO tos_acceptances\n\t\t\t\t\t(id, user_id, version, accepted_at, ip_hash, user_agent)\n\t\t\t\tVALUES (?, ?, ?, ?, ?, ?)\n\t\t\t\t",
				[
					str(uuid.uuid4()),
					user_id,
					AUTH_TOS_VERSION,
					now,
					auth_secret_hash(f"ip:{client_key(request)}"),
					(request.headers.get("user-agent") or "")[:500],
				],
			)
	except sqlite3.IntegrityError as exc:
		raise HTTPException(status_code=409, detail="Email or username is already in use") from exc
	consume_auth_flow(str(flow["id"]))
	onboarding_token = create_auth_flow("registration-onboarding", user_id=user_id, email=email)
	return {
		"ok": True,
		"onboarding_token": onboarding_token,
		"has_password": bool(password),
		"message": "Account created. Configure or skip 2FA, then sign in.",
	}


def registration_2fa_start(payload: RegistrationTwoFAPayload) -> dict[str, Any]:
	flow = get_auth_flow(payload.onboarding_token, "registration-onboarding")
	secret = generate_totp_secret()
	setup_token = create_auth_flow(
		"registration-2fa-setup",
		user_id=str(flow.get("user_id") or ""),
		email=str(flow.get("email") or ""),
		metadata={"secret": seal_totp_secret(secret), "onboarding_flow_id": flow["id"]},
	)
	label = quote(f"SilentFlare:{flow.get('email') or 'account'}")
	uri = f"otpauth://totp/{label}?secret={secret}&issuer=SilentFlare&algorithm=SHA1&digits=6&period=30"
	return {"ok": True, "setup_token": setup_token, "secret": secret, "uri": uri}


def registration_2fa_verify(payload: RegistrationTwoFAPayload) -> dict[str, Any]:
	flow = get_auth_flow(payload.setup_token, "registration-2fa-setup")
	metadata = json.loads(str(flow.get("metadata_json") or "{}"))
	secret_encrypted = str(metadata.get("secret") or "")
	if not verify_totp(open_totp_secret(secret_encrypted), payload.code):
		d1_query("UPDATE auth_flows SET attempts = attempts + 1 WHERE id = ?", [flow["id"]])
		raise HTTPException(status_code=401, detail="Invalid 2FA code")
	d1_query(
		"UPDATE users SET totp_secret = ?, totp_enabled = 1, updated_at = ? WHERE id = ?",
		[secret_encrypted, utc_now(), flow["user_id"]],
	)
	consume_auth_flow(str(flow["id"]))
	consume_auth_flow(str(metadata.get("onboarding_flow_id") or ""))
	return {"ok": True, "login_url": "https://auth.silentflare.com/"}


def registration_2fa_skip(payload: RegistrationTwoFAPayload) -> dict[str, Any]:
	flow = get_auth_flow(payload.onboarding_token, "registration-onboarding")
	consume_auth_flow(str(flow["id"]))
	return {"ok": True, "login_url": "https://auth.silentflare.com/"}


def accounts_2fa_setup_start(
	payload: AccountTwoFAStartPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	proof = get_sensitive_proof(payload.verification_token, str(user["id"]), "enable-2fa")
	secret = generate_totp_secret()
	email = str(user.get("email", ""))
	setup_token = create_auth_flow(
		"account-2fa-setup",
		user_id=str(user["id"]),
		email=email,
		metadata={"secret": seal_totp_secret(secret)},
	)
	consume_auth_flow(str(proof["id"]))
	uri = f"otpauth://totp/SilentFlare:{quote(email)}?secret={secret}&issuer=SilentFlare&algorithm=SHA1&digits=6&period=30"
	return {"ok": True, "setup_token": setup_token, "secret": secret, "uri": uri}


def accounts_2fa_setup_verify(
	payload: TwoFASetupVerifyPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	flow = get_auth_flow(payload.setup_token, "account-2fa-setup")
	if str(flow.get("user_id") or "") != str(user["id"]):
		raise HTTPException(status_code=403, detail="2FA setup is not authorized")
	metadata = json.loads(str(flow.get("metadata_json") or "{}"))
	secret_encrypted = str(metadata.get("secret") or "")
	if not verify_totp(open_totp_secret(secret_encrypted), payload.code):
		raise HTTPException(status_code=401, detail="Invalid 2FA code")
	now = utc_now()
	d1_query(
		"UPDATE users SET totp_secret = ?, totp_enabled = 1, updated_at = ? WHERE id = ?",
		[secret_encrypted, now, str(user["id"])],
	)
	consume_auth_flow(str(flow["id"]))
	return {"ok": True}


def accounts_2fa_disable(
	payload: AccountTwoFADisablePayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	proof = get_sensitive_proof(payload.verification_token, str(user["id"]), "disable-2fa")
	rows = d1_query("SELECT totp_secret FROM users WHERE id = ? LIMIT 1", [user["id"]])
	if (
		not rows
		or not rows[0].get("totp_secret")
		or (not verify_totp(open_totp_secret(str(rows[0]["totp_secret"])), payload.code))
	):
		raise HTTPException(status_code=401, detail="Invalid 2FA code")
	now = utc_now()
	d1_query(
		"UPDATE users SET totp_secret = NULL, totp_enabled = 0, updated_at = ? WHERE id = ?",
		[now, str(user["id"])],
	)
	consume_auth_flow(str(proof["id"]))
	record_security_event(
		str(user["id"]), "two_factor_disabled", "Two-factor authentication disabled"
	)
	return {"ok": True}


def accounts_profile_get(request: Request) -> dict[str, Any]:
	user = refresh_account_region(require_account_user(request), request)
	return {"ok": True, "user": account_user_payload(user)}


def accounts_public_profile(username: str) -> dict[str, Any]:
	try:
		normalized_username = normalize_username(username)
	except HTTPException as exc:
		raise HTTPException(status_code=404, detail="Public profile not found") from exc
	rows = d1_query(
		"""
		SELECT
			users.id, users.username, users.display_name, users.avatar_url,
			users.bio, users.display_region, users.display_region_code, users.created_at,
			COALESCE(account_preferences.profile_public, 1) AS profile_public,
			COALESCE(account_preferences.show_region, 1) AS show_region,
			COALESCE(account_preferences.show_comments, 1) AS show_comments
		FROM users
		LEFT JOIN account_preferences ON account_preferences.user_id = users.id
		WHERE users.username = ? COLLATE NOCASE
			AND users.disabled_at IS NULL
			AND users.deletion_requested_at IS NULL
		LIMIT 1
		""",
		[normalized_username],
	)
	if not rows or not bool(rows[0].get("profile_public")):
		raise HTTPException(status_code=404, detail="Public profile not found")
	user = rows[0]
	show_comments = bool(user.get("show_comments"))
	comments: list[dict[str, Any]] = []
	comment_count: int | None = None
	if show_comments:
		count_rows = d1_query(
			"""
			SELECT COUNT(*) AS count
			FROM comments
			WHERE user_id = ? AND status = 'published' AND deleted_at IS NULL
			""",
			[str(user["id"])],
		)
		comment_count = int(count_rows[0]["count"] if count_rows else 0)
		comment_rows = d1_query(
			"""
			SELECT id, post_slug, content, created_at, updated_at
			FROM comments
			WHERE user_id = ? AND status = 'published' AND deleted_at IS NULL
			ORDER BY created_at DESC, id DESC
			LIMIT 20
			""",
			[str(user["id"])],
		)
		comments = [
			{
				"id": row["id"],
				"postSlug": row["post_slug"],
				"content": row["content"],
				"createdAt": row["created_at"],
				"updatedAt": row["updated_at"],
			}
			for row in comment_rows
		]
	return {
		"ok": True,
		"profile": {
			"username": user["username"],
			"displayName": user.get("display_name") or "",
			"avatarUrl": user.get("avatar_url") or "",
			"bio": user.get("bio") or "",
			"displayRegion": (
				user.get("display_region") or "" if bool(user.get("show_region")) else ""
			),
			"displayRegionCode": (
				user.get("display_region_code") or ""
				if bool(user.get("show_region"))
				else ""
			),
			"createdAt": user["created_at"],
			"commentsVisible": show_comments,
			"commentCount": comment_count,
		},
		"comments": comments,
	}


def accounts_profile_patch(
	payload: UnifiedProfilePayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	user = refresh_account_region(require_account_csrf(request, x_csrf_token), request)
	profile = normalize_profile_payload(
		AccountProfilePayload(
			display_name=payload.display_name,
			avatar_url=str(user.get("avatar_url") or ""),
			bio=payload.bio,
		)
	)
	display_name = profile["display_name"]
	avatar_url = profile["avatar_url"]
	bio = profile["bio"]
	now = utc_now()
	d1_query(
		"\n\t\tUPDATE users\n\t\tSET display_name = ?, avatar_url = ?, bio = ?, updated_at = ?\n\t\tWHERE id = ?\n\t\t",
		[display_name, avatar_url, bio, now, str(user["id"])],
	)
	updated = {**user, "display_name": display_name, "avatar_url": avatar_url, "bio": bio}
	return {"ok": True, "user": account_user_payload(updated)}


async def accounts_profile_avatar_upload(
	request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	content_length = request.headers.get("content-length", "")
	if content_length.isdigit() and int(content_length) > ACCOUNT_AVATAR_MAX_BYTES:
		raise HTTPException(status_code=413, detail="Avatar image must be 2 MB or smaller")
	data = await request.body()
	if not data:
		raise HTTPException(status_code=400, detail="Avatar image is required")
	if len(data) > ACCOUNT_AVATAR_MAX_BYTES:
		raise HTTPException(status_code=413, detail="Avatar image must be 2 MB or smaller")
	extension, media_type = avatar_media_type(data, request.headers.get("content-type", ""))
	ACCOUNT_AVATAR_DIR.mkdir(parents=True, exist_ok=True)
	filename = f"{secrets.token_urlsafe(24)}.{extension}"
	path = ACCOUNT_AVATAR_DIR / filename
	path.write_bytes(data)
	avatar_url = f"{ACCOUNT_AVATAR_PUBLIC_BASE}/{filename}"
	old_avatar_url = str(user.get("avatar_url") or "")
	try:
		d1_query(
			"UPDATE users SET avatar_url = ?, updated_at = ? WHERE id = ?",
			[avatar_url, utc_now(), str(user["id"])],
		)
	except Exception:
		try:
			path.unlink()
		except OSError:
			pass
		raise
	delete_managed_avatar(old_avatar_url)
	updated = {**user, "avatar_url": avatar_url}
	return {"ok": True, "mediaType": media_type, "user": account_user_payload(updated)}


def accounts_profile_avatar_delete(
	request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	old_avatar_url = str(user.get("avatar_url") or "")
	d1_query(
		"UPDATE users SET avatar_url = '', updated_at = ? WHERE id = ?",
		[utc_now(), str(user["id"])],
	)
	delete_managed_avatar(old_avatar_url)
	return {"ok": True, "user": account_user_payload({**user, "avatar_url": ""})}


def accounts_sensitive_email_request(
	payload: AccountSensitiveRequestPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	if payload.action not in ACCOUNT_SENSITIVE_ACTIONS:
		raise HTTPException(status_code=400, detail="Unsupported account action")
	create_email_verification(
		str(user["email"]), f"account-{payload.action}", request, user_id=str(user["id"])
	)
	return {"ok": True}


def accounts_sensitive_email_verify(
	payload: AccountSensitiveVerifyPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	if payload.action not in ACCOUNT_SENSITIVE_ACTIONS:
		raise HTTPException(status_code=400, detail="Unsupported account action")
	purpose = f"account-{payload.action}"
	if not verify_email_code(str(user["email"]), payload.code, purpose):
		raise HTTPException(status_code=401, detail="Invalid or expired verification code")
	verification_token = create_auth_flow(
		"account-sensitive-proof",
		user_id=str(user["id"]),
		email=str(user["email"]),
		metadata={"action": payload.action},
		ttl_seconds=600,
	)
	record_security_event(str(user["id"]), "email_verified", f"Verified for {payload.action}")
	return {"ok": True, "verificationToken": verification_token}


def accounts_security_get(request: Request) -> dict[str, Any]:
	user = require_account_user(request)
	events = d1_query(
		"\n\t\tSELECT event_type, detail, created_at\n\t\tFROM security_events\n\t\tWHERE user_id = ?\n\t\tORDER BY created_at DESC\n\t\tLIMIT 20\n\t\t",
		[str(user["id"])],
	)
	return {
		"ok": True,
		"emailVerified": True,
		"hasPassword": bool(user.get("password_hash")),
		"twoFactorEnabled": bool(user.get("totp_enabled")),
		"recoveryCodesAvailable": False,
		"events": events,
	}


def accounts_password_update(
	payload: AccountPasswordPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	proof = get_sensitive_proof(payload.verification_token, str(user["id"]), "change-password")
	rows = d1_query(
		"SELECT password_hash, password_salt FROM users WHERE id = ? LIMIT 1", [str(user["id"])]
	)
	if not rows:
		raise HTTPException(status_code=404, detail="Account not found")
	current_hash = str(rows[0].get("password_hash") or "")
	current_salt = str(rows[0].get("password_salt") or "")
	if current_hash and (
		not verify_account_password(payload.current_password, current_hash, current_salt)
	):
		raise HTTPException(status_code=401, detail="Current password is incorrect")
	password = validate_account_password(payload.new_password)
	password_hash, password_salt = hash_account_password(password)
	consume_auth_flow(str(proof["id"]))
	d1_query(
		"UPDATE users SET password_hash = ?, password_salt = ?, updated_at = ? WHERE id = ?",
		[password_hash, password_salt, utc_now(), str(user["id"])],
	)
	record_security_event(str(user["id"]), "password_updated", "Password changed from Accounts")
	cleanup_token = create_auth_flow(
		"account-password-cleanup", user_id=str(user["id"]), ttl_seconds=600
	)
	return {"ok": True, "sessionCleanupToken": cleanup_token}


def accounts_email_update(
	payload: AccountEmailUpdatePayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	proof = get_sensitive_proof(payload.verification_token, str(user["id"]), "change-email")
	new_email = normalize_email(payload.new_email)
	if new_email == normalize_email(str(user["email"])):
		raise HTTPException(status_code=400, detail="Enter a different email address")
	if d1_query(
		"SELECT id FROM users WHERE email = ? AND id != ? LIMIT 1", [new_email, str(user["id"])]
	):
		raise HTTPException(status_code=409, detail="Email is already in use")
	consume_auth_flow(str(proof["id"]))
	d1_query(
		"UPDATE users SET email = ?, email_verified_at = ?, updated_at = ? WHERE id = ?",
		[new_email, utc_now(), utc_now(), str(user["id"])],
	)
	record_security_event(str(user["id"]), "email_updated", "Account email changed")
	return {"ok": True, "email": new_email}


def accounts_data_export(
	payload: AccountSensitiveActionPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	proof = get_sensitive_proof(payload.verification_token, str(user["id"]), "export-data")
	preferences = preference_payload(ensure_account_preferences(str(user["id"])))
	comments = d1_query(
		"SELECT post_slug, content, status, created_at, updated_at FROM comments WHERE user_id = ? ORDER BY created_at DESC",
		[str(user["id"])],
	)
	consume_auth_flow(str(proof["id"]))
	record_security_event(str(user["id"]), "data_exported", "Account data export created")
	return {
		"ok": True,
		"exportedAt": utc_now(),
		"profile": account_user_payload(user),
		"preferences": preferences,
		"comments": comments,
	}


def accounts_sessions_get(request: Request) -> dict[str, Any]:
	user = require_account_user(request)
	current_session_id = str(user.get("session_id") or "")
	rows = d1_query(
		"\n\t\tSELECT id, created_at, expires_at, user_agent, last_seen_at, display_region, display_region_code\n\t\tFROM sessions\n\t\tWHERE user_id = ? AND expires_at > ?\n\t\tORDER BY last_seen_at DESC, created_at DESC\n\t\t",
		[str(user["id"]), utc_now()],
	)
	return {"ok": True, "sessions": [session_payload(row, current_session_id) for row in rows]}


def accounts_session_delete(
	session_id: str,
	request: Request,
	response: Response,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	d1_query("DELETE FROM sessions WHERE id = ? AND user_id = ?", [session_id, str(user["id"])])
	if hmac.compare_digest(session_id, str(user.get("session_id") or "")):
		clear_account_cookie(response)
	record_security_event(str(user["id"]), "session_revoked", "A session was signed out")
	return {"ok": True}


def accounts_sessions_logout_all(
	request: Request, response: Response, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	d1_query("DELETE FROM sessions WHERE user_id = ?", [str(user["id"])])
	clear_account_cookie(response)
	record_security_event(str(user["id"]), "sessions_cleared", "All sessions were signed out")
	return {"ok": True}


def accounts_preferences_get(request: Request) -> dict[str, Any]:
	user = require_account_user(request)
	return {"ok": True, **preference_payload(ensure_account_preferences(str(user["id"])))}


def accounts_privacy_update(
	payload: AccountPrivacyPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	now = utc_now()
	ensure_account_preferences(str(user["id"]))
	d1_query(
		"\n\t\tUPDATE account_preferences\n\t\tSET profile_public = ?, show_region = ?, show_comments = ?, allow_search = ?,\n\t\t\tallow_data_export = ?, updated_at = ?\n\t\tWHERE user_id = ?\n\t\t",
		[
			int(payload.profile_public),
			int(payload.show_region),
			int(payload.show_comments),
			int(payload.allow_search),
			int(payload.allow_data_export),
			now,
			str(user["id"]),
		],
	)
	return {"ok": True, **preference_payload(ensure_account_preferences(str(user["id"])))}


def accounts_notifications_update(
	payload: AccountNotificationSettingsPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	now = utc_now()
	ensure_account_preferences(str(user["id"]))
	d1_query(
		"\n\t\tUPDATE account_preferences\n\t\tSET security_email = ?, comment_replies = ?, system_email = ?, marketing_email = ?,\n\t\t\tupdated_at = ?\n\t\tWHERE user_id = ?\n\t\t",
		[
			int(payload.security_email),
			int(payload.comment_replies),
			int(payload.system_email),
			int(payload.marketing_email),
			now,
			str(user["id"]),
		],
	)
	return {"ok": True, **preference_payload(ensure_account_preferences(str(user["id"])))}


def accounts_clear_profile(
	payload: AccountDangerPayload, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	if payload.confirmation != "CLEAR PROFILE":
		raise HTTPException(status_code=400, detail="Confirmation text is required")
	proof = get_sensitive_proof(payload.verification_token, str(user["id"]), "clear-profile")
	consume_auth_flow(str(proof["id"]))
	delete_managed_avatar(str(user.get("avatar_url") or ""))
	d1_query(
		"UPDATE users SET display_name = '', avatar_url = '', bio = '', updated_at = ? WHERE id = ?",
		[utc_now(), str(user["id"])],
	)
	record_security_event(str(user["id"]), "profile_cleared", "Public profile was cleared")
	return {"ok": True}


def accounts_clear_comments(
	payload: AccountDangerPayload, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	if payload.confirmation != "CLEAR COMMENTS":
		raise HTTPException(status_code=400, detail="Confirmation text is required")
	proof = get_sensitive_proof(payload.verification_token, str(user["id"]), "clear-comments")
	consume_auth_flow(str(proof["id"]))
	now = utc_now()
	d1_query(
		"UPDATE comments SET status = 'deleted', deleted_at = ?, updated_at = ? WHERE user_id = ? AND deleted_at IS NULL",
		[now, now, str(user["id"])],
	)
	record_security_event(str(user["id"]), "comments_cleared", "Comments were soft-deleted")
	return {"ok": True}


def accounts_deactivate(
	payload: AccountDangerPayload,
	request: Request,
	response: Response,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	if payload.confirmation != "DEACTIVATE":
		raise HTTPException(status_code=400, detail="Confirmation text is required")
	proof = get_sensitive_proof(payload.verification_token, str(user["id"]), "deactivate-account")
	consume_auth_flow(str(proof["id"]))
	now = utc_now()
	d1_query(
		"UPDATE users SET disabled_at = ?, updated_at = ? WHERE id = ?", [now, now, str(user["id"])]
	)
	d1_query("DELETE FROM sessions WHERE user_id = ?", [str(user["id"])])
	clear_account_cookie(response)
	record_security_event(str(user["id"]), "account_deactivated", "Account was deactivated")
	return {"ok": True}


def accounts_delete(
	payload: AccountDangerPayload, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	if payload.confirmation != "DELETE ACCOUNT":
		raise HTTPException(status_code=400, detail="Confirmation text is required")
	proof = get_sensitive_proof(payload.verification_token, str(user["id"]), "delete-account")
	rows = d1_query(
		"SELECT totp_enabled, totp_secret FROM users WHERE id = ? LIMIT 1", [str(user["id"])]
	)
	if not rows or not rows[0].get("totp_enabled") or (not rows[0].get("totp_secret")):
		raise HTTPException(
			status_code=403,
			detail="Two-factor authentication must be enabled before requesting deletion",
		)
	if not verify_totp(open_totp_secret(str(rows[0]["totp_secret"])), payload.two_factor_code):
		raise HTTPException(status_code=401, detail="Invalid authenticator code")
	consume_auth_flow(str(proof["id"]))
	now = utc_now()
	d1_query(
		"\n\t\tUPDATE users SET deletion_requested_at = ?, deletion_review_status = 'pending',\n\t\t\tdeletion_approved_at = NULL, deletion_scheduled_for = NULL, updated_at = ?\n\t\tWHERE id = ?\n\t\t",
		[now, now, str(user["id"])],
	)
	record_security_event(
		str(user["id"]),
		"account_deletion_requested",
		"Deletion request is pending administrator review",
	)
	return {"ok": True, "reviewStatus": "pending"}


def accounts_delete_cancel(
	request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	d1_query(
		"\n\t\tUPDATE users SET deletion_requested_at = NULL, deletion_review_status = NULL,\n\t\t\tdeletion_approved_at = NULL, deletion_scheduled_for = NULL, updated_at = ?\n\t\tWHERE id = ?\n\t\t",
		[utc_now(), str(user["id"])],
	)
	record_security_event(
		str(user["id"]), "account_deletion_cancelled", "Deletion request cancelled"
	)
	return {"ok": True}


def accounts_sessions_logout_others(
	payload: AccountSensitiveActionPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	flow = get_auth_flow(payload.verification_token, "account-password-cleanup")
	if str(flow.get("user_id") or "") != str(user["id"]):
		raise HTTPException(status_code=403, detail="Session cleanup is not authorized")
	d1_query(
		"DELETE FROM sessions WHERE user_id = ? AND id != ?",
		[str(user["id"]), str(user.get("session_id") or "")],
	)
	consume_auth_flow(str(flow["id"]))
	record_security_event(
		str(user["id"]),
		"other_sessions_cleared",
		"Other sessions were signed out after password change",
	)
	return {"ok": True}


def account_avatar_file(filename: str) -> Response:
	if Path(filename).name != filename or not filename.endswith((".png", ".jpg", ".webp")):
		raise HTTPException(status_code=404, detail="Avatar not found")
	path = ACCOUNT_AVATAR_DIR / filename
	if not path.is_file():
		raise HTTPException(status_code=404, detail="Avatar not found")
	data = path.read_bytes()
	media_type = {".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp"}[path.suffix]
	return Response(
		content=data,
		media_type=media_type,
		headers={"Cache-Control": "public, max-age=31536000, immutable"},
	)
