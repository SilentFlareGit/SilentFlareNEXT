ALTER TABLE account_projections ADD COLUMN account_ref TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_account_projections_ref
	ON account_projections(account_ref);

CREATE TABLE IF NOT EXISTS risk_config_versions (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	version INTEGER NOT NULL UNIQUE,
	weights_json TEXT NOT NULL,
	thresholds_json TEXT NOT NULL,
	created_at INTEGER NOT NULL,
	created_by TEXT NOT NULL,
	note TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS response_commands (
	id TEXT PRIMARY KEY,
	account_id_hash TEXT NOT NULL,
	action TEXT NOT NULL,
	reason TEXT NOT NULL,
	status TEXT NOT NULL,
	created_at INTEGER NOT NULL,
	created_by TEXT NOT NULL,
	completed_at INTEGER,
	detail TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS alert_config (
	id INTEGER PRIMARY KEY CHECK (id = 1),
	enabled INTEGER NOT NULL DEFAULT 1,
	minimum_score INTEGER NOT NULL DEFAULT 80,
	high_risk_per_5m INTEGER NOT NULL DEFAULT 10,
	blocked_per_5m INTEGER NOT NULL DEFAULT 20,
	daily_report_hour INTEGER NOT NULL DEFAULT 0,
	updated_at INTEGER NOT NULL,
	updated_by TEXT NOT NULL
);

INSERT OR IGNORE INTO alert_config(
	id, enabled, minimum_score, high_risk_per_5m, blocked_per_5m,
	daily_report_hour, updated_at, updated_by
) VALUES (1, 1, 80, 10, 20, 0, unixepoch(), 'migration');

CREATE TABLE IF NOT EXISTS alert_events (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	created_at INTEGER NOT NULL,
	kind TEXT NOT NULL,
	severity TEXT NOT NULL,
	title TEXT NOT NULL,
	detail TEXT NOT NULL,
	risk_event_id TEXT,
	status TEXT NOT NULL DEFAULT 'open',
	delivered_at INTEGER,
	delivery_detail TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_alert_events_status
	ON alert_events(status, created_at DESC);

CREATE TABLE IF NOT EXISTS daily_reports (
	report_date TEXT PRIMARY KEY,
	created_at INTEGER NOT NULL,
	requests INTEGER NOT NULL,
	blocked INTEGER NOT NULL,
	high_risk INTEGER NOT NULL,
	unique_ips INTEGER NOT NULL,
	top_country TEXT,
	top_asn TEXT,
	detail_json TEXT NOT NULL
);

UPDATE service_controls
SET protection_enabled = 1, mode = 'observe', updated_at = unixepoch(), updated_by = 'migration'
WHERE host IN (
	'blog.silentflare.com', 'accounts.silentflare.com', 'api.silentflare.com',
	'admin.silentflare.com', 'cms.silentflare.com'
);

UPDATE rate_policies
SET action = 'temporary_ban', cooldown_seconds = 21600
WHERE name = 'Comments per account' AND action = 'rate_limit';

UPDATE rate_policies SET path_pattern = '*/auth/login*'
WHERE name = 'Login per IP';

UPDATE rate_policies SET path_pattern = '*/accounts/register/complete'
WHERE name = 'Registration per IP';

UPDATE rate_policies SET path_pattern = '*/comments/create'
WHERE name = 'Comments per account';
