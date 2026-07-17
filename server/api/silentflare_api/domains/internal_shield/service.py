from __future__ import annotations

from fastapi import Header

from ...runtime import *  # noqa: F403


def shield_account_snapshot(
	x_sf_shield_timestamp: str | None = Header(default=None),
	x_sf_shield_signature: str | None = Header(default=None),
) -> dict[str, Any]:
	if len(SHIELD_SYNC_SECRET) < 32:
		raise HTTPException(status_code=503, detail="Shield synchronization is not configured")
	try:
		timestamp = int(x_sf_shield_timestamp or "")
	except ValueError as error:
		raise HTTPException(
			status_code=401, detail="Invalid Shield synchronization signature"
		) from error
	if abs(int(time.time()) - timestamp) > 60:
		raise HTTPException(status_code=401, detail="Expired Shield synchronization signature")
	message = f"GET\n/internal/shield/accounts\n{timestamp}"
	expected = hmac.new(
		SHIELD_SYNC_SECRET.encode("utf-8"), message.encode("utf-8"), hashlib.sha256
	).hexdigest()
	if not x_sf_shield_signature or not hmac.compare_digest(x_sf_shield_signature, expected):
		raise HTTPException(status_code=401, detail="Invalid Shield synchronization signature")
	users = d1_query(
		"\n\t\tSELECT users.id, users.username, users.role, users.display_region_code,\n\t\t\tusers.email_verified_at, users.totp_enabled, users.created_at,\n\t\t\tusers.last_seen_at, users.disabled_at,\n\t\t\tCOUNT(DISTINCT comments.id) AS comment_count,\n\t\t\tCOUNT(DISTINCT sessions.id) AS active_session_count\n\t\tFROM users\n\t\tLEFT JOIN comments ON comments.user_id = users.id\n\t\tLEFT JOIN sessions ON sessions.user_id = users.id AND sessions.expires_at > ?\n\t\tGROUP BY users.id\n\t\tORDER BY users.created_at DESC\n\t\tLIMIT 500\n\t\t",
		[utc_now()],
	)
	return {"ok": True, "users": users, "generated_at": utc_now()}


def shield_account_session(
	request: Request,
	x_sf_shield_timestamp: str | None = Header(default=None),
	x_sf_shield_signature: str | None = Header(default=None),
) -> dict[str, Any]:
	if len(SHIELD_SYNC_SECRET) < 32:
		raise HTTPException(status_code=503, detail="Shield synchronization is not configured")
	try:
		timestamp = int(x_sf_shield_timestamp or "")
	except ValueError as error:
		raise HTTPException(
			status_code=401, detail="Invalid Shield synchronization signature"
		) from error
	if abs(int(time.time()) - timestamp) > 60:
		raise HTTPException(status_code=401, detail="Expired Shield synchronization signature")
	message = f"GET\n/internal/shield/session\n{timestamp}"
	expected = hmac.new(
		SHIELD_SYNC_SECRET.encode("utf-8"), message.encode("utf-8"), hashlib.sha256
	).hexdigest()
	if not x_sf_shield_signature or not hmac.compare_digest(x_sf_shield_signature, expected):
		raise HTTPException(status_code=401, detail="Invalid Shield synchronization signature")
	user = get_account_user(request)
	return {"ok": True, "account_id": str(user["id"]) if user else None}


def shield_account_response(
	payload: ShieldResponsePayload,
	x_sf_shield_timestamp: str | None = Header(default=None),
	x_sf_shield_signature: str | None = Header(default=None),
) -> dict[str, Any]:
	if len(SHIELD_SYNC_SECRET) < 32:
		raise HTTPException(status_code=503, detail="Shield response integration is not configured")
	try:
		timestamp = int(x_sf_shield_timestamp or "")
	except ValueError as error:
		raise HTTPException(status_code=401, detail="Invalid Shield response signature") from error
	if abs(int(time.time()) - timestamp) > 60:
		raise HTTPException(status_code=401, detail="Expired Shield response signature")
	action = payload.action.strip().lower()
	if action not in {
		"reauthenticate",
		"revoke_sessions",
		"freeze_account",
		"manual_review",
		"notify_admin",
	}:
		raise HTTPException(status_code=422, detail="Unsupported Shield response action")
	canonical = f"POST\n/internal/shield/respond\n{timestamp}\n{payload.command_id}\n{action}\n{payload.account_id}"
	expected = hmac.new(
		SHIELD_SYNC_SECRET.encode("utf-8"), canonical.encode("utf-8"), hashlib.sha256
	).hexdigest()
	if not x_sf_shield_signature or not hmac.compare_digest(x_sf_shield_signature, expected):
		raise HTTPException(status_code=401, detail="Invalid Shield response signature")
	if not payload.command_id or len(payload.command_id) > 100 or len(payload.reason) > 300:
		raise HTTPException(status_code=422, detail="Invalid Shield response command")
	if d1_query("SELECT id FROM shield_commands WHERE id = ? LIMIT 1", [payload.command_id]):
		return {"ok": True, "command_id": payload.command_id, "status": "already_applied"}
	users = d1_query("SELECT id FROM users WHERE id = ? LIMIT 1", [payload.account_id])
	if not users:
		raise HTTPException(status_code=404, detail="Account not found")
	now = utc_now()
	if action in {"reauthenticate", "revoke_sessions", "freeze_account"}:
		d1_query("DELETE FROM sessions WHERE user_id = ?", [payload.account_id])
	if action == "freeze_account":
		d1_query(
			"UPDATE users SET disabled_at = ?, updated_at = ? WHERE id = ?",
			[now, now, payload.account_id],
		)
	record_security_event(payload.account_id, f"shield_{action}", payload.reason)
	d1_query(
		"INSERT INTO shield_commands(id, account_id, action, reason, created_at, status) VALUES (?, ?, ?, ?, ?, 'completed')",
		[payload.command_id, payload.account_id, action, payload.reason, now],
	)
	return {"ok": True, "command_id": payload.command_id, "status": "completed", "action": action}
