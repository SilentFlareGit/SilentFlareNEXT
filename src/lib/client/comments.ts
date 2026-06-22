export type CommentRecord = {
	id: string;
	postSlug: string;
	userId: string;
	parentId: string | null;
	content: string;
	createdAt: string;
	updatedAt: string;
	username: string;
};

export type CreateCommentPayload = {
	postSlug: string;
	content: string;
	turnstileToken: string;
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

function apiUrl(path: string) {
	if (typeof window === "undefined") return path;
	if (window.location.hostname.endsWith(".silentflare.com")) {
		return `https://api.silentflare.com${path}`;
	}
	return path;
}

export async function getComments(postSlug: string) {
	const params = new URLSearchParams({ postSlug });
	return fetchJson<{ comments: CommentRecord[] }>(
		apiUrl(`/comments?${params}`),
		{
			method: "GET",
		},
	);
}

export async function createComment(payload: CreateCommentPayload) {
	return fetchJson<{ comment: CommentRecord }>(apiUrl("/comments/create"), {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function deleteComment(id: string) {
	return fetchJson<{ ok: true }>(
		apiUrl(`/comments/${encodeURIComponent(id)}`),
		{
			method: "DELETE",
		},
	);
}
