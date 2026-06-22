import type { Env } from "./types";

type TurnstileSuccess = {
	success: true;
	challenge_ts?: string;
	hostname?: string;
	action?: string;
};

type TurnstileResponse = TurnstileSuccess & {
	success: boolean;
};

export async function verifyTurnstile(
	env: Env,
	token: unknown,
	remoteIp: string | null,
	expectedAction: "register" | "login" | "comment",
): Promise<{ ok: true; data: TurnstileResponse } | { ok: false; reason: string }> {
	if (typeof token !== "string" || token.trim() === "") {
		return { ok: false, reason: "missing-token" };
	}

	const normalizedToken = token.trim();
	if (normalizedToken.length > 2048) {
		return { ok: false, reason: "invalid-token" };
	}

	const secret = env.TURNSTILE_SECRET_KEY?.trim();
	if (!secret) {
		return { ok: false, reason: "turnstile-not-configured" };
	}

	const body = new FormData();
	body.set("secret", secret);
	body.set("response", normalizedToken);
	if (remoteIp) {
		body.set("remoteip", remoteIp);
	}

	let response: Response;
	try {
		response = await fetch(
			"https://challenges.cloudflare.com/turnstile/v0/siteverify",
			{
				method: "POST",
				body,
			},
		);
	} catch {
		return { ok: false, reason: "verification-unavailable" };
	}

	if (!response.ok) {
		return { ok: false, reason: "verification-failed" };
	}

	const data = (await response.json()) as TurnstileResponse;
	if (!data.success) {
		return { ok: false, reason: "verification-failed" };
	}

	if (data.action && data.action !== expectedAction) {
		return { ok: false, reason: "action-mismatch" };
	}

	const expectedHostname = env.TURNSTILE_EXPECTED_HOSTNAME?.trim();
	if (expectedHostname && data.hostname && data.hostname !== expectedHostname) {
		return { ok: false, reason: "hostname-mismatch" };
	}

	return { ok: true, data };
}

export function getRemoteIp(request: Request) {
	return (
		request.headers.get("cf-connecting-ip") ??
		request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
		null
	);
}
