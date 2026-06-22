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
		error?: string;
	};
	if (!response.ok) {
		throw new Error(data.error || "Request failed");
	}
	return data as T;
}

export async function getCurrentUser() {
	return fetchJson<{ user: CurrentUser | null }>("/api/auth/me", {
		method: "GET",
	});
}

export async function login(payload: AuthPayload) {
	return fetchJson<{ user: CurrentUser }>("/api/auth/login", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function register(payload: RegisterPayload) {
	return fetchJson<{ user: CurrentUser }>("/api/auth/register", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function logout() {
	return fetchJson<{ ok: true }>("/api/auth/logout", {
		method: "POST",
		body: JSON.stringify({}),
	});
}

export function notifyAuthChanged() {
	document.dispatchEvent(new CustomEvent("silentflare-auth-change"));
}
