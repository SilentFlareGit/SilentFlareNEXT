import type { CommentRow, Env, UserRow } from "./types";

export function ensureDb(env: Env) {
	if (!env.DB) {
		throw new Error("D1 DB binding is not configured");
	}
	return env.DB;
}

export async function findUserByEmail(env: Env, email: string) {
	return env.DB.prepare(
		`SELECT id, email, username, password_hash, password_salt, role, disabled_at
		FROM users
		WHERE email = ?
		LIMIT 1`,
	)
		.bind(email)
		.first<UserRow>();
}

export async function findUserByEmailOrUsername(
	env: Env,
	email: string,
	username: string,
) {
	return env.DB.prepare(
		`SELECT id, email, username, password_hash, password_salt, role, disabled_at
		FROM users
		WHERE email = ? OR username = ?
		LIMIT 1`,
	)
		.bind(email, username)
		.first<UserRow>();
}

export async function getPublishedComments(env: Env, postSlug: string) {
	const result = await env.DB.prepare(
		`SELECT
			comments.id,
			comments.post_slug,
			comments.user_id,
			comments.parent_id,
			comments.content,
			comments.status,
			comments.created_at,
			comments.updated_at,
			comments.deleted_at,
			users.username
		FROM comments
		INNER JOIN users ON users.id = comments.user_id
		WHERE comments.post_slug = ?
			AND comments.status = 'published'
			AND comments.deleted_at IS NULL
		ORDER BY comments.created_at ASC`,
	)
		.bind(postSlug)
		.all<CommentRow>();

	return result.results ?? [];
}
