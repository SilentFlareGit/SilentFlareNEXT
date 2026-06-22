import { ensureDb, findUserByEmailOrUsername } from "../../_lib/db";
import { hashPassword, randomId, randomSalt } from "../../_lib/crypto";
import { errorJson, json, readJsonBody, requireMethod } from "../../_lib/json";
import { createSession, publicUserFromRow } from "../../_lib/session";
import type { PagesContext, PublicUser } from "../../_lib/types";
import { getRemoteIp, verifyTurnstile } from "../../_lib/turnstile";
import {
	checkRateLimit,
	cleanString,
	normalizeEmail,
	validateEmail,
	validatePassword,
	validateUsername,
} from "../../_lib/validators";

export const onRequest = (context: PagesContext) =>
	requireMethod(context, "POST", handleRegister);

async function handleRegister(context: PagesContext) {
	ensureDb(context.env);
	const parsed = await readJsonBody(context.request);
	if (!parsed.ok) return parsed.response;

	const email = normalizeEmail(parsed.body.email);
	const username = cleanString(parsed.body.username);
	const password = typeof parsed.body.password === "string" ? parsed.body.password : "";

	const rateLimit = await checkRateLimit(
		`${getRemoteIp(context.request) ?? "unknown"}:${email}`,
		"register",
	);
	if (!rateLimit.ok) return errorJson("Too many attempts", 429);

	const turnstile = await verifyTurnstile(
		context.env,
		parsed.body.turnstileToken,
		getRemoteIp(context.request),
		"register",
	);
	if (!turnstile.ok) {
		return errorJson("Human verification failed", 403);
	}

	if (!validateEmail(email)) {
		return errorJson("Enter a valid email address", 400);
	}
	if (!validateUsername(username)) {
		return errorJson("Username must be 3-24 characters using letters, numbers, underscores, or hyphens", 400);
	}
	if (!validatePassword(password)) {
		return errorJson("Password must be at least 8 characters", 400);
	}

	const existing = await findUserByEmailOrUsername(context.env, email, username);
	if (existing) {
		return errorJson("Email or username is already registered", 409);
	}

	const now = new Date().toISOString();
	const salt = randomSalt();
	const passwordHash = await hashPassword(password, salt);
	const user: PublicUser = {
		id: randomId("user_"),
		email,
		username,
		role: "user",
	};

	await context.env.DB.prepare(
		`INSERT INTO users (id, email, username, password_hash, password_salt, role, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
	)
		.bind(
			user.id,
			user.email,
			user.username,
			passwordHash,
			salt,
			user.role,
			now,
			now,
		)
		.run();

	const session = await createSession(context.env, context.request, user.id);
	return json(
		{ user: publicUserFromRow(user) },
		{ status: 201, headers: { "set-cookie": session.cookie } },
	);
}
