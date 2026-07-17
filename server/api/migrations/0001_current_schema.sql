PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
	id TEXT PRIMARY KEY,
	email TEXT UNIQUE NOT NULL,
	username TEXT UNIQUE NOT NULL,
	password_hash TEXT NOT NULL,
	password_salt TEXT NOT NULL,
	role TEXT NOT NULL DEFAULT 'user',
	created_at TEXT NOT NULL,
	updated_at TEXT NOT NULL,
	disabled_at TEXT,
	display_name TEXT,
	avatar_url TEXT,
	bio TEXT,
	email_verified_at TEXT,
	totp_secret TEXT,
	totp_enabled INTEGER NOT NULL DEFAULT 0,
	display_region TEXT,
	display_region_code TEXT,
	display_region_updated_at TEXT,
	tos_version TEXT,
	tos_accepted_at TEXT,
	registration_ip TEXT,
	last_seen_ip TEXT,
	last_seen_at TEXT,
	last_user_agent TEXT,
	deletion_requested_at TEXT,
	deletion_review_status TEXT,
	deletion_approved_at TEXT,
	deletion_scheduled_for TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
	id TEXT PRIMARY KEY,
	user_id TEXT NOT NULL,
	session_hash TEXT UNIQUE NOT NULL,
	created_at TEXT NOT NULL,
	expires_at TEXT NOT NULL,
	user_agent TEXT,
	ip_hash TEXT,
	last_seen_at TEXT,
	display_region TEXT,
	display_region_code TEXT,
	FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS comments (
	id TEXT PRIMARY KEY,
	post_slug TEXT NOT NULL,
	user_id TEXT NOT NULL,
	parent_id TEXT,
	root_id TEXT,
	content TEXT NOT NULL,
	status TEXT NOT NULL DEFAULT 'published',
	created_at TEXT NOT NULL,
	updated_at TEXT NOT NULL,
	deleted_at TEXT,
	created_ip TEXT,
	FOREIGN KEY(user_id) REFERENCES users(id),
	FOREIGN KEY(parent_id) REFERENCES comments(id),
	FOREIGN KEY(root_id) REFERENCES comments(id)
);

CREATE TABLE IF NOT EXISTS comment_revisions (
	id TEXT PRIMARY KEY,
	comment_id TEXT NOT NULL,
	actor_user_id TEXT NOT NULL,
	content TEXT NOT NULL,
	created_at TEXT NOT NULL,
	FOREIGN KEY(comment_id) REFERENCES comments(id),
	FOREIGN KEY(actor_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS comment_moderation_events (
	id TEXT PRIMARY KEY,
	comment_id TEXT NOT NULL,
	actor_type TEXT NOT NULL,
	actor_id TEXT NOT NULL,
	action TEXT NOT NULL,
	reason TEXT NOT NULL,
	created_at TEXT NOT NULL,
	FOREIGN KEY(comment_id) REFERENCES comments(id)
);

CREATE TABLE IF NOT EXISTS shield_commands (
	id TEXT PRIMARY KEY,
	account_id TEXT NOT NULL,
	action TEXT NOT NULL,
	reason TEXT NOT NULL,
	created_at TEXT NOT NULL,
	status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS site_settings (
	id INTEGER PRIMARY KEY CHECK (id = 1),
	settings_json TEXT NOT NULL,
	updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS email_verifications (
	id TEXT PRIMARY KEY,
	email TEXT NOT NULL,
	code TEXT NOT NULL DEFAULT '',
	code_hash TEXT,
	purpose TEXT NOT NULL,
	created_at TEXT,
	expires_at TEXT NOT NULL,
	used_at TEXT,
	attempts INTEGER NOT NULL DEFAULT 0,
	request_ip_hash TEXT
);

CREATE TABLE IF NOT EXISTS auth_flows (
	id TEXT PRIMARY KEY,
	token_hash TEXT UNIQUE NOT NULL,
	flow_type TEXT NOT NULL,
	user_id TEXT,
	email TEXT,
	return_url TEXT,
	metadata_json TEXT NOT NULL DEFAULT '{}',
	attempts INTEGER NOT NULL DEFAULT 0,
	created_at TEXT NOT NULL,
	expires_at TEXT NOT NULL,
	consumed_at TEXT,
	FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS tos_acceptances (
	id TEXT PRIMARY KEY,
	user_id TEXT NOT NULL,
	version TEXT NOT NULL,
	accepted_at TEXT NOT NULL,
	ip_hash TEXT,
	user_agent TEXT,
	FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS auth_rate_limits (
	action TEXT NOT NULL,
	key_hash TEXT NOT NULL,
	window_started_at INTEGER NOT NULL,
	count INTEGER NOT NULL,
	PRIMARY KEY(action, key_hash)
);

CREATE TABLE IF NOT EXISTS account_preferences (
	user_id TEXT PRIMARY KEY,
	profile_public INTEGER NOT NULL DEFAULT 1,
	show_region INTEGER NOT NULL DEFAULT 1,
	show_comments INTEGER NOT NULL DEFAULT 1,
	allow_search INTEGER NOT NULL DEFAULT 1,
	allow_data_export INTEGER NOT NULL DEFAULT 1,
	security_email INTEGER NOT NULL DEFAULT 1,
	comment_replies INTEGER NOT NULL DEFAULT 1,
	system_email INTEGER NOT NULL DEFAULT 1,
	marketing_email INTEGER NOT NULL DEFAULT 0,
	updated_at TEXT NOT NULL,
	FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS security_events (
	id TEXT PRIMARY KEY,
	user_id TEXT NOT NULL,
	event_type TEXT NOT NULL,
	detail TEXT NOT NULL DEFAULT '',
	created_at TEXT NOT NULL,
	FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_session_hash ON sessions(session_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_comments_post_slug ON comments(post_slug);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);
CREATE INDEX IF NOT EXISTS idx_comments_thread_page
	ON comments(post_slug, root_id, status, created_at, id);
CREATE INDEX IF NOT EXISTS idx_comments_root_id
	ON comments(root_id, created_at, id);
CREATE INDEX IF NOT EXISTS idx_comment_revisions_comment
	ON comment_revisions(comment_id, created_at);
CREATE INDEX IF NOT EXISTS idx_comment_moderation_comment
	ON comment_moderation_events(comment_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ev_email ON email_verifications(email);
CREATE INDEX IF NOT EXISTS idx_ev_expires ON email_verifications(expires_at);
CREATE INDEX IF NOT EXISTS idx_auth_flows_token ON auth_flows(token_hash);
CREATE INDEX IF NOT EXISTS idx_auth_flows_expires ON auth_flows(expires_at);
