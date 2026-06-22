import { ensureDb, getPublishedComments } from "../../_lib/db";
import { errorJson, json, requireMethod } from "../../_lib/json";
import type { PagesContext } from "../../_lib/types";
import { cleanString, validatePostSlug } from "../../_lib/validators";

export const onRequest = (context: PagesContext) =>
	requireMethod(context, "GET", handleGetComments);

async function handleGetComments(context: PagesContext) {
	ensureDb(context.env);
	const url = new URL(context.request.url);
	const postSlug = cleanString(url.searchParams.get("postSlug"));
	if (!postSlug || !validatePostSlug(postSlug)) {
		return errorJson("Valid postSlug is required", 400);
	}

	const comments = await getPublishedComments(context.env, postSlug);
	return json({
		comments: comments.map((comment) => ({
			id: comment.id,
			postSlug: comment.post_slug,
			userId: comment.user_id,
			parentId: comment.parent_id,
			content: comment.content,
			createdAt: comment.created_at,
			updatedAt: comment.updated_at,
			username: comment.username,
		})),
	});
}
