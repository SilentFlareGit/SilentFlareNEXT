export type CurrentUser = {
	id: string;
	email: string;
	username: string;
	role: string;
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
	if (window.location.hostname === "accounts.silentflare.com") {
		return `/accounts-api${path}`;
	}
	if (window.location.hostname.endsWith(".silentflare.com")) {
		return `https://api.silentflare.com${path}`;
	}
	return path;
}

export async function getCurrentUser() {
	return fetchJson<{ user: CurrentUser | null }>(
		accountApiUrl("/account/auth/me"),
		{
			method: "GET",
		},
	);
}

export async function login(payload: AuthPayload) {
	return fetchJson<{ user: CurrentUser }>(
		accountApiUrl("/account/auth/login"),
		{
			method: "POST",
			body: JSON.stringify(payload),
		},
	);
}

export async function register(payload: RegisterPayload) {
	return fetchJson<{ user: CurrentUser }>(
		accountApiUrl("/account/auth/register"),
		{
			method: "POST",
			body: JSON.stringify(payload),
		},
	);
}

export async function logout() {
	return fetchJson<{ ok: true }>(accountApiUrl("/account/auth/logout"), {
		method: "POST",
		body: JSON.stringify({}),
	});
}

export function notifyAuthChanged() {
	document.dispatchEvent(new CustomEvent("silentflare-auth-change"));
}
