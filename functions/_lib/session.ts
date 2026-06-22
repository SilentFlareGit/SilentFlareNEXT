import { clearSessionCookieHeader, getSessionCookieName, readCookie, sessionCookieHeader } from "./cookies";
import { hmacSha256Base64, randomId, randomToken, sha256Base64 } from "./crypto";
import type { Env, PagesContext, PublicUser, SessionUserRow } from "./types";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

export function publicUserFromRow(row: PublicUser): PublicUser {
	return {
		id: row.id,
		email: row.email,
		username: row.username,
		role: row.role,
	};
}

export async function hashSessionToken(env: Env, token: string) {
	const secret = env.SESSION_SECRET?.trim();
	if (!secret || secret.length < 32) {
		throw new Error("SESSION_SECRET must be configured with at least 32 characters");
	}
	return hmacSha256Base64(secret, token);
}

export async function createSession(
	env: Env,
	request: Request,
	userId: string,
) {
	const token = randomToken();
	const sessionHash = await hashSessionToken(env, token);
	const now = new Date();
	const expires = new Date(now.getTime() + SESSION_TTL_MS);
	const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for") ?? "";
	const ipHash = ip ? await sha256Base64(ip) : null;

	await env.DB.prepare(
		`INSERT INTO sessions (id, user_id, session_hash, created_at, expires_at, user_agent, ip_hash)
		VALUES (?, ?, ?, ?, ?, ?, ?)`,
	)
		.bind(
			randomId("sess_"),
			userId,
			sessionHash,
			now.toISOString(),
			expires.toISOString(),
			request.headers.get("user-agent")?.slice(0, 512) ?? null,
			ipHash,
		)
		.run();

	return {
		token,
		expires,
		cookie: sessionCookieHeader(env, token, expires),
	};
}

export async function getSessionUser(context: PagesContext) {
	const token = readCookie(context.request, getSessionCookieName(context.env));
	if (!token) {
		return { user: null, clearCookie: false };
	}

	const sessionHash = await hashSessionToken(context.env, token);
	const row = await context.env.DB.prepare(
		`SELECT
			users.id,
			users.email,
			users.username,
			users.role,
			sessions.id AS session_id,
			sessions.expires_at
		FROM sessions
		INNER JOIN users ON users.id = sessions.user_id
		WHERE sessions.session_hash = ?
			AND users.disabled_at IS NULL
		LIMIT 1`,
	)
		.bind(sessionHash)
		.first<SessionUserRow>();

	if (!row) {
		return { user: null, clearCookie: true };
	}

	if (new Date(row.expires_at).getTime() <= Date.now()) {
		await context.env.DB.prepare("DELETE FROM sessions WHERE id = ?")
			.bind(row.session_id)
			.run();
		return { user: null, clearCookie: true };
	}

	return {
		user: publicUserFromRow(row),
		sessionId: row.session_id,
		clearCookie: false,
	};
}

export async function destroySession(env: Env, request: Request) {
	const token = readCookie(request, getSessionCookieName(env));
	if (token) {
		const sessionHash = await hashSessionToken(env, token);
		await env.DB.prepare("DELETE FROM sessions WHERE session_hash = ?")
			.bind(sessionHash)
			.run();
	}
	return clearSessionCookieHeader(env);
}

export async function cleanupExpiredSessions(env: Env) {
	await env.DB.prepare("DELETE FROM sessions WHERE expires_at <= ?")
		.bind(new Date().toISOString())
		.run();
}
