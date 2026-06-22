import { ensureDb } from "../../_lib/db";
import { errorJson, json, requireMethod } from "../../_lib/json";
import { getSessionUser } from "../../_lib/session";
import type { PagesContext } from "../../_lib/types";
import { cleanString } from "../../_lib/validators";

type CommentOwnerRow = {
	id: string;
	user_id: string;
	status: string;
	deleted_at: string | null;
};

export const onRequest = (context: PagesContext) =>
	requireMethod(context, "DELETE", handleDeleteComment);

async function handleDeleteComment(context: PagesContext) {
	ensureDb(context.env);
	const session = await getSessionUser(context);
	if (!session.user) {
		return errorJson("Login required", 401);
	}

	const idParam = context.params.id;
	const id = cleanString(Array.isArray(idParam) ? idParam[0] : idParam);
	if (!id) {
		return errorJson("Comment id is required", 400);
	}

	const comment = await context.env.DB.prepare(
		"SELECT id, user_id, status, deleted_at FROM comments WHERE id = ? LIMIT 1",
	)
		.bind(id)
		.first<CommentOwnerRow>();

	if (!comment || comment.deleted_at || comment.status === "deleted") {
		return errorJson("Comment not found", 404);
	}

	if (comment.user_id !== session.user.id && session.user.role !== "admin") {
		return errorJson("Forbidden", 403);
	}

	const now = new Date().toISOString();
	await context.env.DB.prepare(
		"UPDATE comments SET status = 'deleted', deleted_at = ?, updated_at = ? WHERE id = ?",
	)
		.bind(now, now, id)
		.run();

	return json({ ok: true });
}
