import { ensureDb } from "../../_lib/db";
import { randomId } from "../../_lib/crypto";
import { errorJson, json, readJsonBody, requireMethod } from "../../_lib/json";
import { getSessionUser } from "../../_lib/session";
import type { PagesContext } from "../../_lib/types";
import { getRemoteIp, verifyTurnstile } from "../../_lib/turnstile";
import {
	checkRateLimit,
	cleanString,
	validateCommentContent,
	validatePostSlug,
} from "../../_lib/validators";

export const onRequest = (context: PagesContext) =>
	requireMethod(context, "POST", handleCreateComment);

async function handleCreateComment(context: PagesContext) {
	ensureDb(context.env);
	const session = await getSessionUser(context);
	if (!session.user) {
		return errorJson("Login required", 401);
	}

	const parsed = await readJsonBody(context.request);
	if (!parsed.ok) return parsed.response;

	const rateLimit = await checkRateLimit(session.user.id, "comment");
	if (!rateLimit.ok) return errorJson("Too many attempts", 429);

	const turnstile = await verifyTurnstile(
		context.env,
		parsed.body.turnstileToken,
		getRemoteIp(context.request),
		"comment",
	);
	if (!turnstile.ok) {
		return errorJson("Human verification failed", 403);
	}

	const postSlug = cleanString(parsed.body.postSlug);
	if (!postSlug || !validatePostSlug(postSlug)) {
		return errorJson("Valid postSlug is required", 400);
	}

	const contentValidation = validateCommentContent(parsed.body.content);
	if (!contentValidation.ok) {
		return errorJson(contentValidation.reason, 400);
	}

	const now = new Date().toISOString();
	const id = randomId("comment_");
	await context.env.DB.prepare(
		`INSERT INTO comments (id, post_slug, user_id, parent_id, content, status, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, 'published', ?, ?)`,
	)
		.bind(id, postSlug, session.user.id, null, contentValidation.content, now, now)
		.run();

	return json(
		{
			comment: {
				id,
				postSlug,
				userId: session.user.id,
				parentId: null,
				content: contentValidation.content,
				createdAt: now,
				updatedAt: now,
				username: session.user.username,
			},
		},
		{ status: 201 },
	);
}
