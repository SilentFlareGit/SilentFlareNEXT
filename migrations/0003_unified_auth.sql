PRAGMA foreign_keys = ON;

ALTER TABLE users ADD COLUMN email_verified_at TEXT;
ALTER TABLE users ADD COLUMN totp_secret TEXT;
ALTER TABLE users ADD COLUMN totp_enabled INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN display_region TEXT;
ALTER TABLE users ADD COLUMN tos_version TEXT;
ALTER TABLE users ADD COLUMN tos_accepted_at TEXT;

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

CREATE INDEX IF NOT EXISTS idx_ev_email ON email_verifications(email);
CREATE INDEX IF NOT EXISTS idx_ev_expires ON email_verifications(expires_at);

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

CREATE INDEX IF NOT EXISTS idx_auth_flows_token ON auth_flows(token_hash);
CREATE INDEX IF NOT EXISTS idx_auth_flows_expires ON auth_flows(expires_at);

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
