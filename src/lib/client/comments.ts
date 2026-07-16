export type CommentAuthor = {
	id: string;
	username: string;
	displayName: string;
	avatarUrl: string;
};

export type CommentRecord = {
	id: string;
	postSlug: string;
	userId: string;
	parentId: string | null;
	rootId: string | null;
	content: string;
	createdAt: string;
	updatedAt: string;
	username: string;
	author: CommentAuthor;
	isDeleted: boolean;
	replies: CommentRecord[];
};

export type CommentPage = {
	items: CommentRecord[];
	totalCount: number;
	threadCount: number;
	nextCursor: string | null;
};

export type CreateCommentPayload = {
	postSlug: string;
	content: string;
	turnstileToken: string;
	parentId?: string | null;
};

class CommentApiError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.name = "CommentApiError";
		this.status = status;
	}
}

let cachedCsrf = "";

function apiUrl(path: string) {
	if (typeof window === "undefined") return path;
	if (window.location.hostname.endsWith(".silentflare.com")) {
		return `https://api.silentflare.com${path}`;
	}
	return path;
}

async function fetchJson<T>(url: string, init: RequestInit = {}): Promise<T> {
	const response = await fetch(url, {
		...init,
		credentials: "include",
		headers: {
			Accept: "application/json",
			...(init.body ? { "content-type": "application/json" } : {}),
			...(init.headers ?? {}),
		},
	});
	const data = (await response.json().catch(() => ({}))) as {
		detail?: string;
		error?: string;
	};
	if (!response.ok) {
		throw new CommentApiError(
			data.detail || data.error || "Request failed",
			response.status,
		);
	}
	return data as T;
}

export function setCommentCsrf(csrf = "") {
	cachedCsrf = csrf;
}

async function getCommentCsrf(force = false) {
	if (cachedCsrf && !force) return cachedCsrf;
	const session = await fetchJson<{ csrf?: string }>(apiUrl("/auth/session"));
	cachedCsrf = session.csrf ?? "";
	return cachedCsrf;
}

async function mutateComment<T>(path: string, init: RequestInit) {
	const send = async (forceCsrf = false) => {
		const csrf = await getCommentCsrf(forceCsrf);
		return fetchJson<T>(apiUrl(path), {
			...init,
			headers: {
				...(csrf ? { "X-CSRF-Token": csrf } : {}),
				...(init.headers ?? {}),
			},
		});
	};
	try {
		return await send();
	} catch (error) {
		if (
			error instanceof CommentApiError &&
			error.status === 403 &&
			error.message === "Invalid CSRF token"
		) {
			return send(true);
		}
		throw error;
	}
}

function normalizeComment(comment: CommentRecord): CommentRecord {
	return {
		...comment,
		rootId: comment.rootId ?? null,
		author: comment.author ?? {
			id: comment.userId,
			username: comment.username,
			displayName: "",
			avatarUrl: "",
		},
		isDeleted: comment.isDeleted ?? false,
		replies: (comment.replies ?? []).map(normalizeComment),
	};
}

export async function getComments(
	postSlug: string,
	options: { cursor?: string | null; limit?: number } = {},
) {
	const params = new URLSearchParams({
		postSlug,
		limit: String(options.limit ?? 20),
	});
	if (options.cursor) params.set("cursor", options.cursor);
	const page = await fetchJson<{
		items?: CommentRecord[];
		comments?: CommentRecord[];
		totalCount?: number;
		threadCount?: number;
		nextCursor?: string | null;
	}>(apiUrl(`/comments?${params}`), { method: "GET" });
	const items = (page.items ?? page.comments ?? []).map(normalizeComment);
	return {
		items,
		totalCount: page.totalCount ?? items.length,
		threadCount: page.threadCount ?? items.length,
		nextCursor: page.nextCursor ?? null,
	} satisfies CommentPage;
}

export async function createComment(payload: CreateCommentPayload) {
	return mutateComment<{ comment: CommentRecord }>("/comments/create", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function updateComment(id: string, content: string) {
	return mutateComment<{ comment: CommentRecord }>(
		`/comments/${encodeURIComponent(id)}`,
		{
			method: "PATCH",
			body: JSON.stringify({ content }),
		},
	);
}

export async function deleteComment(id: string) {
	return mutateComment<{ ok: true; commentId: string; deletedAt: string }>(
		`/comments/${encodeURIComponent(id)}`,
		{ method: "DELETE" },
	);
}
