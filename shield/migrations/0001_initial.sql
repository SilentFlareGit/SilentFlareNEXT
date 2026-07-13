CREATE TABLE IF NOT EXISTS schema_migrations (
	version TEXT PRIMARY KEY,
	applied_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
	key TEXT PRIMARY KEY,
	value_json TEXT NOT NULL,
	updated_at INTEGER NOT NULL,
	updated_by TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS access_lists (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	kind TEXT NOT NULL CHECK (kind IN ('allow', 'deny')),
	subject_type TEXT NOT NULL CHECK (subject_type IN ('ip', 'cidr', 'asn', 'country', 'region', 'account')),
	subject_value TEXT NOT NULL,
	scope_host TEXT,
	scope_path TEXT,
	scope_method TEXT,
	note TEXT NOT NULL DEFAULT '',
	created_by TEXT NOT NULL,
	created_at INTEGER NOT NULL,
	expires_at INTEGER,
	disabled_at INTEGER,
	UNIQUE(kind, subject_type, subject_value, scope_host, scope_path, scope_method)
);

CREATE TABLE IF NOT EXISTS rules (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	description TEXT NOT NULL DEFAULT '',
	priority INTEGER NOT NULL DEFAULT 100,
	enabled INTEGER NOT NULL DEFAULT 1,
	mode TEXT NOT NULL DEFAULT 'enforce' CHECK (mode IN ('observe', 'enforce')),
	conditions_json TEXT NOT NULL,
	actions_json TEXT NOT NULL,
	version INTEGER NOT NULL DEFAULT 1,
	hit_count INTEGER NOT NULL DEFAULT 0,
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL,
	created_by TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS rule_versions (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	rule_id INTEGER NOT NULL REFERENCES rules(id),
	version INTEGER NOT NULL,
	snapshot_json TEXT NOT NULL,
	created_at INTEGER NOT NULL,
	created_by TEXT NOT NULL,
	UNIQUE(rule_id, version)
);

CREATE TABLE IF NOT EXISTS rate_policies (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL UNIQUE,
	host TEXT,
	path_pattern TEXT NOT NULL,
	method TEXT,
	dimension TEXT NOT NULL,
	algorithm TEXT NOT NULL CHECK (algorithm IN ('fixed_window', 'sliding_window', 'token_bucket')),
	limit_value INTEGER NOT NULL,
	window_seconds INTEGER NOT NULL,
	burst INTEGER NOT NULL DEFAULT 0,
	cooldown_seconds INTEGER NOT NULL DEFAULT 0,
	action TEXT NOT NULL DEFAULT 'rate_limit',
	enabled INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS rate_counters (
	policy_id INTEGER NOT NULL REFERENCES rate_policies(id) ON DELETE CASCADE,
	identity_hash TEXT NOT NULL,
	window_start INTEGER NOT NULL,
	count INTEGER NOT NULL,
	tokens REAL,
	updated_at INTEGER NOT NULL,
	PRIMARY KEY(policy_id, identity_hash, window_start)
);

CREATE TABLE IF NOT EXISTS ip_intel (
	ip_hash TEXT PRIMARY KEY,
	ip_masked TEXT NOT NULL,
	country_code TEXT,
	region TEXT,
	city TEXT,
	timezone TEXT,
	asn TEXT,
	isp TEXT,
	organization TEXT,
	ip_type TEXT NOT NULL DEFAULT 'unknown',
	is_vpn INTEGER NOT NULL DEFAULT 0,
	is_proxy INTEGER NOT NULL DEFAULT 0,
	is_tor INTEGER NOT NULL DEFAULT 0,
	is_crawler INTEGER NOT NULL DEFAULT 0,
	is_malicious INTEGER NOT NULL DEFAULT 0,
	risk_score INTEGER NOT NULL DEFAULT 0,
	first_seen_at INTEGER NOT NULL,
	last_seen_at INTEGER NOT NULL,
	cache_expires_at INTEGER NOT NULL,
	raw_json TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS bans (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	subject_type TEXT NOT NULL,
	subject_hash TEXT NOT NULL,
	subject_display TEXT NOT NULL,
	restriction TEXT NOT NULL DEFAULT 'all',
	reason TEXT NOT NULL,
	created_by TEXT NOT NULL,
	created_at INTEGER NOT NULL,
	expires_at INTEGER,
	revoked_at INTEGER,
	revoked_by TEXT,
	revoke_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_bans_active ON bans(subject_type, subject_hash, expires_at, revoked_at);

CREATE TABLE IF NOT EXISTS risk_events (
	id TEXT PRIMARY KEY,
	created_at INTEGER NOT NULL,
	trace_id TEXT NOT NULL,
	risk_level TEXT NOT NULL,
	risk_score INTEGER NOT NULL,
	host TEXT NOT NULL,
	path TEXT NOT NULL,
	method TEXT NOT NULL,
	ip_hash TEXT NOT NULL,
	ip_masked TEXT NOT NULL,
	country_code TEXT,
	region TEXT,
	asn TEXT,
	ip_type TEXT,
	account_id_hash TEXT,
	device_id_hash TEXT,
	session_id_hash TEXT,
	matched_rules_json TEXT NOT NULL,
	reasons_json TEXT NOT NULL,
	actions_json TEXT NOT NULL,
	request_summary_json TEXT NOT NULL,
	review_status TEXT NOT NULL DEFAULT 'open',
	reviewed_by TEXT,
	reviewed_at INTEGER,
	admin_note TEXT
);

CREATE INDEX IF NOT EXISTS idx_risk_events_created ON risk_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_risk_events_score ON risk_events(risk_score DESC, created_at DESC);

CREATE TABLE IF NOT EXISTS audit_log (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	created_at INTEGER NOT NULL,
	actor TEXT NOT NULL,
	action TEXT NOT NULL,
	target_type TEXT NOT NULL,
	target_id TEXT,
	details_json TEXT NOT NULL,
	trace_id TEXT
);

CREATE TRIGGER IF NOT EXISTS audit_log_no_update
BEFORE UPDATE ON audit_log BEGIN SELECT RAISE(ABORT, 'audit_log is append-only'); END;

CREATE TRIGGER IF NOT EXISTS audit_log_no_delete
BEFORE DELETE ON audit_log BEGIN SELECT RAISE(ABORT, 'audit_log is append-only'); END;

INSERT OR IGNORE INTO rate_policies
	(name, host, path_pattern, method, dimension, algorithm, limit_value, window_seconds, burst, cooldown_seconds, action)
VALUES
	('Login per IP', NULL, '/auth/login/*', 'POST', 'ip', 'fixed_window', 10, 60, 0, 60, 'turnstile'),
	('Registration per IP', NULL, '/accounts/register/*', 'POST', 'ip', 'fixed_window', 3, 86400, 0, 21600, 'temporary_ban'),
	('Email verification per email', NULL, '*/email/request', 'POST', 'email', 'fixed_window', 1, 60, 0, 60, 'rate_limit'),
	('Comments per account', NULL, '/comments/create', 'POST', 'account', 'token_bucket', 5, 60, 2, 60, 'rate_limit'),
	('API per account', 'api.silentflare.com', '/*', NULL, 'account', 'token_bucket', 100, 60, 20, 60, 'rate_limit'),
	('404 scanner per IP', NULL, '/*', NULL, 'ip', 'fixed_window', 120, 60, 0, 300, 'temporary_ban');
