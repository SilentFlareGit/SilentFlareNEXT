import { clearSessionCookieHeader } from "../../_lib/cookies";
import { ensureDb } from "../../_lib/db";
import { json, requireMethod } from "../../_lib/json";
import { cleanupExpiredSessions, getSessionUser } from "../../_lib/session";
import type { PagesContext } from "../../_lib/types";

export const onRequest = (context: PagesContext) =>
	requireMethod(context, "GET", handleMe);

async function handleMe(context: PagesContext) {
	ensureDb(context.env);
	const session = await getSessionUser(context);
	await cleanupExpiredSessions(context.env);

	if (session.clearCookie) {
		return json(
			{ user: null },
			{ headers: { "set-cookie": clearSessionCookieHeader(context.env) } },
		);
	}

	return json({ user: session.user });
}
