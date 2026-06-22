export type D1Result<T = unknown> = {
	results?: T[];
	success?: boolean;
	meta?: unknown;
	error?: string;
};

export type D1PreparedStatement = {
	bind: (...values: unknown[]) => D1PreparedStatement;
	first: <T = unknown>(columnName?: string) => Promise<T | null>;
	all: <T = unknown>() => Promise<D1Result<T>>;
	run: () => Promise<D1Result>;
};

export type D1Database = {
	prepare: (query: string) => D1PreparedStatement;
};

export type Env = {
	DB: D1Database;
	PUBLIC_TURNSTILE_SITE_KEY?: string;
	TURNSTILE_SECRET_KEY?: string;
	TURNSTILE_EXPECTED_HOSTNAME?: string;
	SESSION_COOKIE_NAME?: string;
	SESSION_SECRET?: string;
};

export type PagesContext = {
	request: Request;
	env: Env;
	params: Record<string, string | string[]>;
};

export type PublicUser = {
	id: string;
	email: string;
	username: string;
	role: string;
};

export type UserRow = PublicUser & {
	password_hash: string;
	password_salt: string;
	disabled_at: string | null;
};

export type SessionUserRow = PublicUser & {
	session_id: string;
	expires_at: string;
};

export type CommentRow = {
	id: string;
	post_slug: string;
	user_id: string;
	parent_id: string | null;
	content: string;
	status: string;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	username: string;
};
