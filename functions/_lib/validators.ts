export function cleanString(value: unknown) {
	return typeof value === "string" ? value.trim() : "";
}

export function validateEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

export function normalizeEmail(value: unknown) {
	return cleanString(value).toLowerCase();
}

export function validateUsername(username: string) {
	return /^[A-Za-z0-9_-]{3,24}$/.test(username);
}

export function validatePassword(password: string) {
	return password.length >= 8 && password.length <= 256;
}

export function validatePostSlug(slug: string) {
	return /^[A-Za-z0-9][A-Za-z0-9/_-]{0,180}$/.test(slug);
}

export function validateCommentContent(value: unknown) {
	const content = cleanString(value);
	if (!content) {
		return { ok: false as const, reason: "Comment cannot be empty" };
	}
	if (content.length > 1000) {
		return { ok: false as const, reason: "Comment must be 1000 characters or less" };
	}

	const linkMatches = content.match(/https?:\/\/\S+/gi) ?? [];
	const withoutLinks = content.replace(/https?:\/\/\S+/gi, "").trim();
	if (linkMatches.length > 0 && withoutLinks.length < 8) {
		return { ok: false as const, reason: "Comment needs more than a link" };
	}

	return { ok: true as const, content };
}

export async function checkRateLimit(_key: string, _action: string) {
	// TODO: replace this placeholder with a D1/KV-backed sliding-window limiter.
	return { ok: true as const };
}
