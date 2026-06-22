import type { Env } from "./types";

const DEFAULT_SESSION_COOKIE = "sf_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export function getSessionCookieName(env: Env) {
	return env.SESSION_COOKIE_NAME?.trim() || DEFAULT_SESSION_COOKIE;
}

export function readCookie(request: Request, name: string) {
	const cookieHeader = request.headers.get("cookie");
	if (!cookieHeader) return null;

	for (const part of cookieHeader.split(";")) {
		const [rawName, ...valueParts] = part.trim().split("=");
		if (rawName === name) {
			return decodeURIComponent(valueParts.join("="));
		}
	}

	return null;
}

export function sessionCookieHeader(env: Env, token: string, expires: Date) {
	const name = getSessionCookieName(env);
	return `${name}=${encodeURIComponent(token)}; Path=/; Expires=${expires.toUTCString()}; Max-Age=${SESSION_MAX_AGE_SECONDS}; HttpOnly; Secure; SameSite=Lax`;
}

export function clearSessionCookieHeader(env: Env) {
	const name = getSessionCookieName(env);
	return `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}
