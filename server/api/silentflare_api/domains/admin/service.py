from __future__ import annotations

from fastapi import Header

from ...runtime import *  # noqa: F403


def admin_status(request: Request) -> dict[str, Any]:
	session = require_admin_console_session(request)
	return {
		"ok": True,
		"bot_id": session["bot_id"],
		"totp_enabled": bool(console_totp_secret()),
		**admin_data_status(),
	}


def admin_users(request: Request) -> dict[str, Any]:
	require_admin_console_session(request)
	users = d1_query(
		"\n\t\tSELECT users.id, users.email, users.username, users.role, users.display_name,\n\t\t\tusers.avatar_url, users.bio, users.display_region, users.display_region_code,\n\t\t\tusers.email_verified_at, users.totp_enabled, users.tos_version,\n\t\t\tusers.tos_accepted_at, users.registration_ip, users.last_seen_ip,\n\t\t\tusers.last_seen_at, users.last_user_agent, users.created_at, users.updated_at,\n\t\t\tusers.disabled_at, users.deletion_requested_at, users.deletion_review_status,\n\t\t\tusers.deletion_approved_at, users.deletion_scheduled_for,\n\t\t\tCASE WHEN users.password_hash != '' THEN 1 ELSE 0 END AS has_password,\n\t\t\taccount_preferences.profile_public, account_preferences.show_region,\n\t\t\taccount_preferences.show_comments, account_preferences.allow_search,\n\t\t\taccount_preferences.security_email, account_preferences.comment_replies,\n\t\t\tCOUNT(DISTINCT comments.id) AS comment_count,\n\t\t\tCOUNT(DISTINCT sessions.id) AS active_session_count,\n\t\t\tMAX(comments.created_at) AS latest_comment_at\n\t\tFROM users\n\t\tLEFT JOIN comments ON comments.user_id = users.id\n\t\tLEFT JOIN sessions ON sessions.user_id = users.id AND sessions.expires_at > ?\n\t\tLEFT JOIN account_preferences ON account_preferences.user_id = users.id\n\t\tGROUP BY users.id\n\t\tORDER BY users.created_at DESC\n\t\tLIMIT 200\n\t\t",
		[utc_now()],
	)
	return {"ok": True, "users": users, **admin_data_status()}


def admin_user_detail(user_id: str, request: Request) -> dict[str, Any]:
	require_admin_console_session(request)
	rows = d1_query(
		"\n\t\tSELECT id, email, username, role, display_name, avatar_url, bio,\n\t\t\tdisplay_region, display_region_code, email_verified_at, totp_enabled,\n\t\t\ttos_version, tos_accepted_at, registration_ip, last_seen_ip,\n\t\t\tlast_seen_at, last_user_agent, created_at, updated_at, disabled_at,\n\t\t\tdeletion_requested_at, deletion_review_status, deletion_approved_at,\n\t\t\tdeletion_scheduled_for,\n\t\t\tCASE WHEN password_hash != '' THEN 1 ELSE 0 END AS has_password\n\t\tFROM users WHERE id = ? LIMIT 1\n\t\t",
		[user_id],
	)
	if not rows:
		raise HTTPException(status_code=404, detail="User not found")
	comments = d1_query(
		"\n\t\tSELECT id, post_slug, content, status, created_at, updated_at, deleted_at, created_ip\n\t\tFROM comments WHERE user_id = ? ORDER BY created_at DESC LIMIT 100\n\t\t",
		[user_id],
	)
	preferences = preference_payload(ensure_account_preferences(user_id))
	sessions = d1_query(
		"\n\t\tSELECT id, created_at, expires_at, user_agent, last_seen_at, display_region, display_region_code\n\t\tFROM sessions\n\t\tWHERE user_id = ? AND expires_at > ?\n\t\tORDER BY last_seen_at DESC, created_at DESC\n\t\tLIMIT 20\n\t\t",
		[user_id, utc_now()],
	)
	security_events = d1_query(
		"\n\t\tSELECT event_type, detail, created_at\n\t\tFROM security_events\n\t\tWHERE user_id = ?\n\t\tORDER BY created_at DESC\n\t\tLIMIT 20\n\t\t",
		[user_id],
	)
	return {
		"ok": True,
		"user": rows[0],
		"comments": comments,
		"sessions": [session_payload(row, "") for row in sessions],
		"preferences": preferences,
		"securityEvents": security_events,
	}


def admin_user_disable(
	user_id: str, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	require_admin_console_session(request, x_csrf_token=x_csrf_token, require_csrf=True)
	now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
	d1_query("UPDATE users SET disabled_at = ?, updated_at = ? WHERE id = ?", [now, now, user_id])
	return {"ok": True}


def admin_user_enable(
	user_id: str, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	require_admin_console_session(request, x_csrf_token=x_csrf_token, require_csrf=True)
	now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
	d1_query("UPDATE users SET disabled_at = NULL, updated_at = ? WHERE id = ?", [now, user_id])
	return {"ok": True}


def admin_user_role(
	user_id: str,
	payload: UserRolePayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	require_admin_console_session(request, x_csrf_token=x_csrf_token, require_csrf=True)
	role = payload.role.strip().lower()
	if role not in {"user", "admin"}:
		raise HTTPException(status_code=400, detail="Role must be user or admin")
	now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
	d1_query("UPDATE users SET role = ?, updated_at = ? WHERE id = ?", [role, now, user_id])
	return {"ok": True}


def admin_comments(
	request: Request,
	post_slug: str | None = None,
	status: str = "all",
	user_id: str | None = None,
	cursor: str | None = None,
	limit: int = 200,
) -> dict[str, Any]:
	require_admin_console_session(request)
	where_parts: list[str] = []
	params: list[Any] = []
	if post_slug:
		where_parts.append("comments.post_slug = ?")
		params.append(normalize_post_slug(post_slug))
	clean_status = status.strip().lower()
	if clean_status not in {"all", "published", "deleted"}:
		raise HTTPException(status_code=400, detail="Invalid comment status filter")
	if clean_status != "all":
		where_parts.append("comments.status = ?")
		params.append(clean_status)
	if user_id:
		where_parts.append("comments.user_id = ?")
		params.append(user_id.strip())
	decoded_cursor = decode_comment_cursor(cursor)
	if decoded_cursor:
		where_parts.append(
			"(comments.created_at < ? OR (comments.created_at = ? AND comments.id < ?))"
		)
		params.extend([decoded_cursor[0], decoded_cursor[0], decoded_cursor[1]])
	where = f"WHERE {' AND '.join(where_parts)}" if where_parts else ""
	page_limit = normalize_comment_page_limit(limit)
	query_params = [*params, page_limit + 1]
	comments = d1_query(
		f"\n\t\tSELECT\n\t\t\tcomments.id,\n\t\t\tcomments.post_slug,\n\t\t\tcomments.user_id,\n\t\t\tusers.username,\n\t\t\tusers.email,\n\t\t\tusers.display_name,\n\t\t\tcomments.content,\n\t\t\tcomments.status,\n\t\t\tcomments.created_at,\n\t\t\tcomments.updated_at,\n\t\t\tcomments.deleted_at,\n\t\t\tcomments.created_ip,\n\t\t\tcomments.parent_id,\n\t\t\tcomments.root_id,\n\t\t\t(\n\t\t\t\tSELECT event.action FROM comment_moderation_events AS event\n\t\t\t\tWHERE event.comment_id = comments.id\n\t\t\t\tORDER BY event.created_at DESC LIMIT 1\n\t\t\t) AS last_moderation_action,\n\t\t\t(\n\t\t\t\tSELECT event.reason FROM comment_moderation_events AS event\n\t\t\t\tWHERE event.comment_id = comments.id\n\t\t\t\tORDER BY event.created_at DESC LIMIT 1\n\t\t\t) AS last_moderation_reason,\n\t\t\t(\n\t\t\t\tSELECT COUNT(*) FROM comment_revisions AS revision\n\t\t\t\tWHERE revision.comment_id = comments.id\n\t\t\t) AS revision_count\n\t\tFROM comments\n\t\tINNER JOIN users ON users.id = comments.user_id\n\t\t{where}\n\t\tORDER BY comments.created_at DESC, comments.id DESC\n\t\tLIMIT ?\n\t\t",
		query_params,
	)
	has_more = len(comments) > page_limit
	comments = comments[:page_limit]
	count_where_parts = [part for part in where_parts if "created_at" not in part]
	count_params = params[:-3] if decoded_cursor else params
	count_where = f"WHERE {' AND '.join(count_where_parts)}" if count_where_parts else ""
	count_rows = d1_query(f"SELECT COUNT(*) AS count FROM comments {count_where}", count_params)
	next_cursor = None
	if has_more and comments:
		last = comments[-1]
		next_cursor = encode_comment_cursor(str(last["created_at"]), str(last["id"]))
	return {
		"ok": True,
		"comments": comments,
		"totalCount": int(count_rows[0]["count"] if count_rows else 0),
		"nextCursor": next_cursor,
		**admin_data_status(),
	}


def admin_comment_delete(
	comment_id: str,
	request: Request,
	payload: CommentModerationPayload | None = None,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	require_admin_console_session(request, x_csrf_token=x_csrf_token, require_csrf=True)
	rows = d1_query("SELECT id, deleted_at FROM comments WHERE id = ? LIMIT 1", [comment_id])
	if not rows:
		raise HTTPException(status_code=404, detail="Comment not found")
	if rows[0].get("deleted_at"):
		return {"ok": True}
	reason = normalize_moderation_reason(payload.reason if payload else "")
	now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
	local_db_transaction(
		[
			(
				"UPDATE comments SET status = 'deleted', deleted_at = ?, updated_at = ? WHERE id = ?",
				[now, now, comment_id],
			),
			(
				"\n\t\t\t\tINSERT INTO comment_moderation_events\n\t\t\t\t\t(id, comment_id, actor_type, actor_id, action, reason, created_at)\n\t\t\t\tVALUES (?, ?, 'owner', ?, 'delete', ?, ?)\n\t\t\t\t",
				[str(uuid.uuid4()), comment_id, ADMIN_AUTH_ID, reason, now],
			),
		]
	)
	return {"ok": True}


def admin_comment_restore(
	comment_id: str,
	request: Request,
	payload: CommentModerationPayload | None = None,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	require_admin_console_session(request, x_csrf_token=x_csrf_token, require_csrf=True)
	rows = d1_query("SELECT id, deleted_at FROM comments WHERE id = ? LIMIT 1", [comment_id])
	if not rows:
		raise HTTPException(status_code=404, detail="Comment not found")
	if not rows[0].get("deleted_at"):
		return {"ok": True}
	reason = normalize_moderation_reason(payload.reason if payload else "", "Owner restore")
	now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
	local_db_transaction(
		[
			(
				"UPDATE comments SET status = 'published', deleted_at = NULL, updated_at = ? WHERE id = ?",
				[now, comment_id],
			),
			(
				"\n\t\t\t\tINSERT INTO comment_moderation_events\n\t\t\t\t\t(id, comment_id, actor_type, actor_id, action, reason, created_at)\n\t\t\t\tVALUES (?, ?, 'owner', ?, 'restore', ?, ?)\n\t\t\t\t",
				[str(uuid.uuid4()), comment_id, ADMIN_AUTH_ID, reason, now],
			),
		]
	)
	return {"ok": True}


def admin_user_deletion_approve(
	user_id: str, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	require_admin_console_session(request, x_csrf_token=x_csrf_token, require_csrf=True)
	rows = d1_query("SELECT deletion_review_status FROM users WHERE id = ? LIMIT 1", [user_id])
	if not rows:
		raise HTTPException(status_code=404, detail="User not found")
	if rows[0].get("deletion_review_status") != "pending":
		raise HTTPException(status_code=409, detail="No pending deletion request")
	now = utc_now()
	scheduled_for = (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()
	d1_query(
		"\n\t\tUPDATE users SET deletion_review_status = 'approved', deletion_approved_at = ?,\n\t\t\tdeletion_scheduled_for = ?, updated_at = ? WHERE id = ?\n\t\t",
		[now, scheduled_for, now, user_id],
	)
	record_security_event(
		user_id,
		"account_deletion_approved",
		"Administrator approved deletion; 7-day cooling period started",
	)
	return {"ok": True, "scheduledFor": scheduled_for}


def admin_user_deletion_reject(
	user_id: str, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	require_admin_console_session(request, x_csrf_token=x_csrf_token, require_csrf=True)
	rows = d1_query("SELECT deletion_review_status FROM users WHERE id = ? LIMIT 1", [user_id])
	if not rows:
		raise HTTPException(status_code=404, detail="User not found")
	if rows[0].get("deletion_review_status") != "pending":
		raise HTTPException(status_code=409, detail="No pending deletion request")
	now = utc_now()
	d1_query(
		"\n\t\tUPDATE users SET deletion_requested_at = NULL, deletion_review_status = NULL,\n\t\t\tdeletion_approved_at = NULL, deletion_scheduled_for = NULL, updated_at = ?\n\t\tWHERE id = ?\n\t\t",
		[now, user_id],
	)
	record_security_event(
		user_id, "account_deletion_rejected", "Administrator rejected deletion request"
	)
	return {"ok": True}
