import { ensureDb, findUserByEmail } from "../../_lib/db";
import { verifyPassword } from "../../_lib/crypto";
import { errorJson, json, readJsonBody, requireMethod } from "../../_lib/json";
import { createSession, publicUserFromRow } from "../../_lib/session";
import type { PagesContext } from "../../_lib/types";
import { getRemoteIp, verifyTurnstile } from "../../_lib/turnstile";
import { checkRateLimit, normalizeEmail } from "../../_lib/validators";

export const onRequest = (context: PagesContext) =>
	requireMethod(context, "POST", handleLogin);

async function handleLogin(context: PagesContext) {
	ensureDb(context.env);
	const parsed = await readJsonBody(context.request);
	if (!parsed.ok) return parsed.response;

	const email = normalizeEmail(parsed.body.email);
	const password = typeof parsed.body.password === "string" ? parsed.body.password : "";

	const rateLimit = await checkRateLimit(
		`${getRemoteIp(context.request) ?? "unknown"}:${email}`,
		"login",
	);
	if (!rateLimit.ok) return errorJson("Too many attempts", 429);

	const turnstile = await verifyTurnstile(
		context.env,
		parsed.body.turnstileToken,
		getRemoteIp(context.request),
		"login",
	);
	if (!turnstile.ok) {
		return errorJson("Human verification failed", 403);
	}

	const user = await findUserByEmail(context.env, email);
	if (!user || user.disabled_at) {
		return errorJson("Invalid email or password", 401);
	}

	const passwordOk = await verifyPassword(
		password,
		user.password_salt,
		user.password_hash,
	);
	if (!passwordOk) {
		return errorJson("Invalid email or password", 401);
	}

	const session = await createSession(context.env, context.request, user.id);
	return json(
		{ user: publicUserFromRow(user) },
		{ headers: { "set-cookie": session.cookie } },
	);
}
