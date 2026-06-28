export type CurrentUser = {
	id: string;
	email: string;
	username: string;
	role: string;
	displayName?: string;
	avatarUrl?: string;
};

export type AuthPayload = {
	email: string;
	password: string;
	turnstileToken: string;
};

export type RegisterPayload = AuthPayload & {
	username: string;
};

async function fetchJson<T>(url: string, init: RequestInit = {}): Promise<T> {
	const response = await fetch(url, {
		...init,
		credentials: "include",
		headers: {
			"content-type": "application/json",
			...(init.headers ?? {}),
		},
	});
	const data = (await response.json().catch(() => ({}))) as {
		detail?: string;
		error?: string;
	};
	if (!response.ok) {
		throw new Error(data.detail || data.error || "Request failed");
	}
	return data as T;
}

function accountApiUrl(path: string) {
	if (typeof window === "undefined") return path;
	if (window.location.hostname.endsWith(".silentflare.com")) {
		return `https://api.silentflare.com${path}`;
	}
	return path;
}

export async function getCurrentUser() {
	return fetchJson<{
		user: CurrentUser | null;
		authenticated: boolean;
		csrf?: string;
	}>(accountApiUrl("/auth/session"), {
		method: "GET",
	});
}

export async function login(payload: AuthPayload) {
	return fetchJson<{ user: CurrentUser }>(
		accountApiUrl("/auth/login/password"),
		{
			method: "POST",
			body: JSON.stringify({
				email_or_username: payload.email,
				password: payload.password,
				turnstile_token: payload.turnstileToken,
			}),
		},
	);
}

export async function register(payload: RegisterPayload) {
	void payload;
	throw new Error("Registration is available at accounts.silentflare.com");
}

export async function logout() {
	const session = await getCurrentUser();
	return fetchJson<{ ok: true }>(accountApiUrl("/auth/logout"), {
		method: "POST",
		headers: session.csrf ? { "X-CSRF-Token": session.csrf } : {},
		body: JSON.stringify({}),
	});
}

export function notifyAuthChanged() {
	document.dispatchEvent(new CustomEvent("silentflare-auth-change"));
}
