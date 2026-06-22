import type { PagesContext } from "./types";

export type JsonResponseInit = ResponseInit & {
	headers?: HeadersInit;
};

export function json(data: unknown, init: JsonResponseInit = {}) {
	const headers = new Headers(init.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	headers.set("cache-control", "no-store");
	return new Response(JSON.stringify(data), {
		...init,
		headers,
	});
}

export function errorJson(message: string, status = 400, init: JsonResponseInit = {}) {
	return json({ error: message }, { ...init, status });
}

export async function readJsonBody<T extends Record<string, unknown>>(
	request: Request,
): Promise<{ ok: true; body: T } | { ok: false; response: Response }> {
	const contentType = request.headers.get("content-type") ?? "";
	if (!contentType.toLowerCase().includes("application/json")) {
		return { ok: false, response: errorJson("Expected JSON request body", 400) };
	}

	try {
		const body = (await request.json()) as unknown;
		if (!body || typeof body !== "object" || Array.isArray(body)) {
			return { ok: false, response: errorJson("Invalid JSON request body", 400) };
		}
		return { ok: true, body: body as T };
	} catch {
		return { ok: false, response: errorJson("Invalid JSON request body", 400) };
	}
}

export async function requireMethod(
	context: PagesContext,
	method: string,
	handler: (context: PagesContext) => Promise<Response>,
) {
	if (context.request.method !== method) {
		return errorJson("Method not allowed", 405, {
			headers: { allow: method },
		});
	}

	try {
		return await handler(context);
	} catch {
		return errorJson("Internal server error", 500);
	}
}
