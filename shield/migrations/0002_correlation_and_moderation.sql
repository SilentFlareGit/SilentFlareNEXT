CREATE TABLE IF NOT EXISTS device_risk (
	device_id_hash TEXT PRIMARY KEY,
	browser_family TEXT,
	browser_version TEXT,
	os_family TEXT,
	language TEXT,
	timezone TEXT,
	screen_class TEXT,
	cookies_enabled INTEGER,
	automation_signals_json TEXT NOT NULL DEFAULT '[]',
	account_count INTEGER NOT NULL DEFAULT 0,
	first_seen_at INTEGER NOT NULL,
	last_seen_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS identity_relations (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	ip_hash TEXT,
	account_id_hash TEXT,
	device_id_hash TEXT,
	session_id_hash TEXT,
	first_seen_at INTEGER NOT NULL,
	last_seen_at INTEGER NOT NULL,
	request_count INTEGER NOT NULL DEFAULT 1,
	UNIQUE(ip_hash, account_id_hash, device_id_hash, session_id_hash)
);

CREATE INDEX IF NOT EXISTS idx_identity_relations_ip ON identity_relations(ip_hash);
CREATE INDEX IF NOT EXISTS idx_identity_relations_account ON identity_relations(account_id_hash);
CREATE INDEX IF NOT EXISTS idx_identity_relations_device ON identity_relations(device_id_hash);

CREATE TABLE IF NOT EXISTS content_reviews (
	id TEXT PRIMARY KEY,
	created_at INTEGER NOT NULL,
	content_type TEXT NOT NULL,
	content_hash TEXT NOT NULL,
	account_id_hash TEXT,
	risk_score INTEGER NOT NULL,
	signals_json TEXT NOT NULL,
	action TEXT NOT NULL,
	status TEXT NOT NULL DEFAULT 'open',
	reviewed_at INTEGER,
	reviewed_by TEXT,
	note TEXT
);

CREATE TABLE IF NOT EXISTS alert_configs (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	channel TEXT NOT NULL,
	endpoint_encrypted TEXT NOT NULL,
	minimum_score INTEGER NOT NULL DEFAULT 80,
	enabled INTEGER NOT NULL DEFAULT 1,
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL
);
