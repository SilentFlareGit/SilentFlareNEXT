from __future__ import annotations

from fastapi import Header

from ...runtime import *  # noqa: F403


def comments(postSlug: str, cursor: str | None = None, limit: int = 200) -> dict[str, Any]:
	if not d1_configured():
		return {
			"ok": True,
			"comments": [],
			"items": [],
			"totalCount": 0,
			"threadCount": 0,
			"nextCursor": None,
			"configured": False,
		}
	post_slug = normalize_post_slug(postSlug)
	page_limit = normalize_comment_page_limit(limit)
	decoded_cursor = decode_comment_cursor(cursor)
	cursor_sql = ""
	params: list[Any] = [post_slug]
	if decoded_cursor:
		cursor_sql = (
			"AND (comments.created_at > ? OR (comments.created_at = ? AND comments.id > ?))"
		)
		params.extend([decoded_cursor[0], decoded_cursor[0], decoded_cursor[1]])
	params.append(page_limit + 1)
	root_rows = d1_query(
		f"\n\t\tSELECT\n\t\t\tcomments.id,\n\t\t\tcomments.post_slug,\n\t\t\tcomments.user_id,\n\t\t\tcomments.parent_id,\n\t\t\tcomments.root_id,\n\t\t\tusers.username,\n\t\t\tusers.display_name,\n\t\t\tusers.avatar_url,\n\t\t\tcomments.content,\n\t\t\tcomments.status,\n\t\t\tcomments.created_at,\n\t\t\tcomments.updated_at,\n\t\t\tcomments.deleted_at\n\t\tFROM comments\n\t\tINNER JOIN users ON users.id = comments.user_id\n\t\tWHERE comments.post_slug = ?\n\t\t\tAND comments.root_id IS NULL\n\t\t\tAND (\n\t\t\t\t(comments.status = 'published' AND comments.deleted_at IS NULL)\n\t\t\t\tOR EXISTS (\n\t\t\t\t\tSELECT 1\n\t\t\t\t\tFROM comments AS child\n\t\t\t\t\tWHERE child.root_id = comments.id\n\t\t\t\t\t\tAND child.status = 'published'\n\t\t\t\t\t\tAND child.deleted_at IS NULL\n\t\t\t\t)\n\t\t\t)\n\t\t\t{cursor_sql}\n\t\tORDER BY comments.created_at ASC, comments.id ASC\n\t\tLIMIT ?\n\t\t",
		params,
	)
	has_more = len(root_rows) > page_limit
	root_rows = root_rows[:page_limit]
	root_ids = [str(row["id"]) for row in root_rows]
	reply_rows: list[dict[str, Any]] = []
	if root_ids:
		placeholders = ",".join(("?" for _ in root_ids))
		reply_rows = d1_query(
			f"\n\t\t\tSELECT\n\t\t\t\tcomments.id, comments.post_slug, comments.user_id,\n\t\t\t\tcomments.parent_id, comments.root_id, users.username,\n\t\t\t\tusers.display_name, users.avatar_url, comments.content,\n\t\t\t\tcomments.status, comments.created_at, comments.updated_at,\n\t\t\t\tcomments.deleted_at\n\t\t\tFROM comments\n\t\t\tINNER JOIN users ON users.id = comments.user_id\n\t\t\tWHERE comments.root_id IN ({placeholders})\n\t\t\t\tAND (\n\t\t\t\t\t(comments.status = 'published' AND comments.deleted_at IS NULL)\n\t\t\t\t\tOR comments.status = 'deleted'\n\t\t\t\t\tOR comments.deleted_at IS NOT NULL\n\t\t\t\t)\n\t\t\tORDER BY comments.created_at ASC, comments.id ASC\n\t\t\t",
			root_ids,
		)
	reply_rows_by_root: dict[str, list[dict[str, Any]]] = {root_id: [] for root_id in root_ids}
	for reply_row in reply_rows:
		reply_rows_by_root.setdefault(str(reply_row["root_id"]), []).append(reply_row)
	items: list[dict[str, Any]] = []
	for row in root_rows:
		root = comment_payload(row)
		root_id = str(row["id"])
		replies = comment_reply_tree(root_id, reply_rows_by_root.get(root_id, []))
		items.append({**root, "replies": replies})
	flat_comments = flatten_comment_tree(items)
	total_rows = d1_query(
		"\n\t\tSELECT COUNT(*) AS count\n\t\tFROM comments\n\t\tWHERE post_slug = ? AND status = 'published' AND deleted_at IS NULL\n\t\t",
		[post_slug],
	)
	thread_rows = d1_query(
		"\n\t\tSELECT COUNT(*) AS count\n\t\tFROM comments\n\t\tWHERE post_slug = ? AND root_id IS NULL\n\t\t\tAND (\n\t\t\t\t(status = 'published' AND deleted_at IS NULL)\n\t\t\t\tOR EXISTS (\n\t\t\t\t\tSELECT 1 FROM comments AS child\n\t\t\t\t\tWHERE child.root_id = comments.id\n\t\t\t\t\t\tAND child.status = 'published'\n\t\t\t\t\t\tAND child.deleted_at IS NULL\n\t\t\t\t)\n\t\t\t)\n\t\t",
		[post_slug],
	)
	next_cursor = None
	if has_more and root_rows:
		last = root_rows[-1]
		next_cursor = encode_comment_cursor(str(last["created_at"]), str(last["id"]))
	return {
		"ok": True,
		"comments": flat_comments,
		"items": items,
		"totalCount": int(total_rows[0]["count"] if total_rows else 0),
		"threadCount": int(thread_rows[0]["count"] if thread_rows else 0),
		"nextCursor": next_cursor,
		"configured": True,
	}


def comment_create(
	payload: CommentCreatePayload, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	verify_turnstile_token(
		payload.turnstileToken,
		request.headers.get("cf-connecting-ip") or client_key(request),
		"comment",
	)
	user = require_account_csrf(request, x_csrf_token)
	post_slug = normalize_post_slug(payload.postSlug)
	content = normalize_comment_content(payload.content)
	enforce_auth_rate_limit(
		"comment-create-user",
		str(user["id"]),
		COMMENT_CREATE_USER_LIMIT,
		COMMENT_CREATE_WINDOW_SECONDS,
	)
	enforce_auth_rate_limit(
		"comment-create-ip",
		client_key(request),
		COMMENT_CREATE_IP_LIMIT,
		COMMENT_CREATE_WINDOW_SECONDS,
	)
	parent_id: str | None = None
	root_id: str | None = None
	if payload.parentId:
		requested_parent_id = payload.parentId.strip()
		parent_rows = d1_query(
			"\n\t\t\tSELECT id, post_slug, root_id, status, deleted_at\n\t\t\tFROM comments WHERE id = ? LIMIT 1\n\t\t\t",
			[requested_parent_id],
		)
		if (
			not parent_rows
			or parent_rows[0]["post_slug"] != post_slug
			or parent_rows[0].get("deleted_at")
			or (parent_rows[0].get("status") != "published")
		):
			raise HTTPException(status_code=404, detail="Parent comment not found")
		root_id = str(parent_rows[0].get("root_id") or parent_rows[0]["id"])
		parent_id = requested_parent_id
	now = utc_now()
	comment_id = str(uuid.uuid4())
	d1_query(
		"\n\t\tINSERT INTO comments\n\t\t\t(id, post_slug, user_id, parent_id, root_id, content, status,\n\t\t\t created_at, updated_at, created_ip)\n\t\tVALUES (?, ?, ?, ?, ?, ?, 'published', ?, ?, ?)\n\t\t",
		[
			comment_id,
			post_slug,
			user["id"],
			parent_id,
			root_id,
			content,
			now,
			now,
			request_public_ip(request),
		],
	)
	return {
		"ok": True,
		"comment": {
			"id": comment_id,
			"postSlug": post_slug,
			"userId": user["id"],
			"parentId": parent_id,
			"rootId": root_id,
			"content": content,
			"createdAt": now,
			"updatedAt": now,
			"username": user["username"],
			"author": {
				"id": user["id"],
				"username": user["username"],
				"displayName": user.get("display_name") or "",
				"avatarUrl": user.get("avatar_url") or "",
			},
			"isDeleted": False,
		},
	}


def comment_delete(
	comment_id: str, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	rows = d1_query(
		"SELECT id, user_id, status, deleted_at FROM comments WHERE id = ? LIMIT 1", [comment_id]
	)
	if not rows or rows[0].get("deleted_at") or rows[0].get("status") == "deleted":
		raise HTTPException(status_code=404, detail="Comment not found")
	if rows[0]["user_id"] != user["id"] and user.get("role") != "admin":
		raise HTTPException(status_code=403, detail="Comment delete is not allowed")
	now = utc_now()
	action = "self_delete" if rows[0]["user_id"] == user["id"] else "local_admin_delete"
	local_db_transaction(
		[
			(
				"UPDATE comments SET status = 'deleted', deleted_at = ?, updated_at = ? WHERE id = ?",
				[now, now, comment_id],
			),
			(
				"\n\t\t\t\tINSERT INTO comment_moderation_events\n\t\t\t\t\t(id, comment_id, actor_type, actor_id, action, reason, created_at)\n\t\t\t\tVALUES (?, ?, 'account', ?, ?, ?, ?)\n\t\t\t\t",
				[
					str(uuid.uuid4()),
					comment_id,
					str(user["id"]),
					action,
					"Deleted by comment author"
					if action == "self_delete"
					else "Deleted by local admin",
					now,
				],
			),
		]
	)
	return {"ok": True, "commentId": comment_id, "deletedAt": now}


def comment_update(
	comment_id: str,
	payload: CommentUpdatePayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	user = require_account_csrf(request, x_csrf_token)
	rows = d1_query(
		"SELECT id, user_id, content, status, deleted_at FROM comments WHERE id = ? LIMIT 1",
		[comment_id],
	)
	if not rows or rows[0].get("deleted_at") or rows[0].get("status") != "published":
		raise HTTPException(status_code=404, detail="Comment not found")
	if rows[0]["user_id"] != user["id"] and user.get("role") != "admin":
		raise HTTPException(status_code=403, detail="Comment edit is not allowed")
	content = normalize_comment_content(payload.content)
	now = utc_now()
	local_db_transaction(
		[
			(
				"\n\t\t\t\tINSERT INTO comment_revisions\n\t\t\t\t\t(id, comment_id, actor_user_id, content, created_at)\n\t\t\t\tVALUES (?, ?, ?, ?, ?)\n\t\t\t\t",
				[str(uuid.uuid4()), comment_id, str(user["id"]), str(rows[0]["content"]), now],
			),
			(
				"UPDATE comments SET content = ?, updated_at = ? WHERE id = ?",
				[content, now, comment_id],
			),
		]
	)
	updated = d1_query(
		"\n\t\tSELECT comments.id, comments.post_slug, comments.user_id, comments.parent_id,\n\t\t\tcomments.root_id, users.username, users.display_name, users.avatar_url,\n\t\t\tcomments.content, comments.status, comments.created_at, comments.updated_at,\n\t\t\tcomments.deleted_at\n\t\tFROM comments\n\t\tINNER JOIN users ON users.id = comments.user_id\n\t\tWHERE comments.id = ?\n\t\tLIMIT 1\n\t\t",
		[comment_id],
	)[0]
	return {"ok": True, "comment": comment_payload(updated)}
