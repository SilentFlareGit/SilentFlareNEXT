import { ensureDb } from "../../_lib/db";
import { json, requireMethod } from "../../_lib/json";
import { destroySession } from "../../_lib/session";
import type { PagesContext } from "../../_lib/types";

export const onRequest = (context: PagesContext) =>
	requireMethod(context, "POST", handleLogout);

async function handleLogout(context: PagesContext) {
	ensureDb(context.env);
	const clearCookie = await destroySession(context.env, context.request);
	return json({ ok: true }, { headers: { "set-cookie": clearCookie } });
}
