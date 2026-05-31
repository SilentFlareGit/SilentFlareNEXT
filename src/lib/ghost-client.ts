import type {
	BlogAuthor,
	BlogPost,
	BlogTag,
	GhostAuthor,
	GhostListResponse,
	GhostPage,
	GhostPost,
	GhostTag,
} from "./ghost";
import {
	adaptGhostAuthor,
	adaptGhostPost,
	adaptGhostTag,
	withAdjacentPosts,
} from "./ghost-adapter";

type GhostResource = "posts" | "tags" | "authors";

interface RequestOptions {
	page?: number;
	limit?: number | "all";
	filter?: string;
	include?: string;
	fields?: string;
	order?: string;
}

const DEFAULT_API_VERSION = "v5.0";
const POSTS_INCLUDE = "tags,authors";
const POSTS_ORDER = "published_at desc";

function readEnv(name: string): string | boolean | undefined {
	const astroEnv = (import.meta.env as Record<string, string | undefined>)[
		name
	];
	const processEnv = process.env[name];
	return astroEnv || processEnv;
}

function readEnvString(name: string): string | undefined {
	const value = readEnv(name);
	return typeof value === "string" ? value : undefined;
}

function normalizeGhostUrl(url: string): string {
	return url.trim().replace(/\/+$/, "");
}

function allowEmptyData(): boolean {
	const value = readEnv("GHOST_ALLOW_EMPTY");
	return value === true || value === "true";
}

function getGhostConfig() {
	const ghostUrl = readEnvString("GHOST_URL");
	const key = readEnvString("GHOST_CONTENT_API_KEY");
	const version = readEnvString("GHOST_API_VERSION") || DEFAULT_API_VERSION;

	if (!ghostUrl || !key) {
		const message =
			"Missing Ghost Content API config. Set GHOST_URL and GHOST_CONTENT_API_KEY, or set GHOST_ALLOW_EMPTY=true for local UI-only previews.";
		if (allowEmptyData()) {
			console.warn(`[ghost] ${message}`);
			return null;
		}
		throw new Error(message);
	}

	return {
		url: normalizeGhostUrl(ghostUrl),
		key,
		version,
	};
}

function encodeParams(key: string, options: RequestOptions): string {
	const params = new URLSearchParams();
	params.set("key", key);
	for (const [key, value] of Object.entries(options)) {
		if (value !== undefined && value !== null && value !== "") {
			params.set(key, String(value));
		}
	}
	return params.toString();
}

async function requestGhost<T>(
	resource: GhostResource,
	options: RequestOptions = {},
): Promise<GhostListResponse<T>> {
	const config = getGhostConfig();
	if (!config) {
		return {
			data: [],
			meta: {
				pagination: {
					page: Number(options.page ?? 1),
					limit: Number(options.limit === "all" ? 0 : (options.limit ?? 0)),
					pages: 0,
					total: 0,
					next: null,
					prev: null,
				},
			},
		};
	}

	const endpoint = `${config.url}/ghost/api/content/${resource}/`;
	const response = await fetch(
		`${endpoint}?${encodeParams(config.key, {
			limit: "all",
			...options,
		})}`,
		{
			headers: {
				"Accept-Version": config.version,
			},
		},
	);

	if (!response.ok) {
		throw new Error(
			`Ghost Content API request failed: ${response.status} ${response.statusText} for ${resource}. Check GHOST_URL and GHOST_CONTENT_API_KEY.`,
		);
	}

	const json = (await response.json()) as {
		posts?: T[];
		tags?: T[];
		authors?: T[];
		meta: GhostListResponse<T>["meta"];
	};

	return {
		data: json[resource] ?? [],
		meta: json.meta,
	};
}

export async function getPosts(
	options: RequestOptions = {},
): Promise<GhostPage<BlogPost>> {
	const response = await requestGhost<GhostPost>("posts", {
		include: POSTS_INCLUDE,
		order: POSTS_ORDER,
		...options,
	});

	return {
		items: withAdjacentPosts(response.data.map(adaptGhostPost)),
		pagination: response.meta.pagination,
	};
}

export async function getPostBySlug(
	slug: string,
): Promise<BlogPost | undefined> {
	const response = await getPosts({
		limit: 1,
		filter: `slug:${slug}`,
	});
	return response.items[0];
}

export async function getTags(
	options: RequestOptions = {},
): Promise<GhostPage<BlogTag>> {
	const response = await requestGhost<GhostTag>("tags", {
		include: "count.posts",
		order: "name asc",
		...options,
	});
	return {
		items: response.data.map(adaptGhostTag),
		pagination: response.meta.pagination,
	};
}

export async function getPostsByTag(
	slug: string,
	options: RequestOptions = {},
): Promise<GhostPage<BlogPost>> {
	return getPosts({
		...options,
		filter: `tag:${slug}`,
	});
}

export async function getAuthors(
	options: RequestOptions = {},
): Promise<GhostPage<BlogAuthor>> {
	const response = await requestGhost<GhostAuthor>("authors", {
		include: "count.posts",
		order: "name asc",
		...options,
	});
	return {
		items: response.data.map(adaptGhostAuthor),
		pagination: response.meta.pagination,
	};
}

export async function getPostsByAuthor(
	slug: string,
	options: RequestOptions = {},
): Promise<GhostPage<BlogPost>> {
	return getPosts({
		...options,
		filter: `author:${slug}`,
	});
}
