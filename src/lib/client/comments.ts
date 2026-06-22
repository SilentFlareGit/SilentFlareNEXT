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
		error?: string;
	};
	if (!response.ok) {
		throw new Error(data.error || "Request failed");
	}
	return data as T;
}

export async function getComments(postSlug: string) {
	const params = new URLSearchParams({ postSlug });
	return fetchJson<{ comments: CommentRecord[] }>(`/api/comments?${params}`, {
		method: "GET",
	});
}

export async function createComment(payload: CreateCommentPayload) {
	return fetchJson<{ comment: CommentRecord }>("/api/comments/create", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function deleteComment(id: string) {
	return fetchJson<{ ok: true }>(`/api/comments/${encodeURIComponent(id)}`, {
		method: "DELETE",
	});
}
