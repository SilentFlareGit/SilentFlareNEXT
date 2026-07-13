CREATE TABLE IF NOT EXISTS account_projections (
	account_id_hash TEXT PRIMARY KEY,
	account_label TEXT NOT NULL,
	role TEXT NOT NULL DEFAULT 'user',
	country_code TEXT,
	email_verified INTEGER NOT NULL DEFAULT 0,
	two_factor_enabled INTEGER NOT NULL DEFAULT 0,
	disabled INTEGER NOT NULL DEFAULT 0,
	created_at INTEGER NOT NULL,
	last_seen_at INTEGER,
	active_session_count INTEGER NOT NULL DEFAULT 0,
	comment_count INTEGER NOT NULL DEFAULT 0,
	risk_score INTEGER NOT NULL DEFAULT 0,
	risk_level TEXT NOT NULL DEFAULT 'normal',
	risk_reasons_json TEXT NOT NULL DEFAULT '[]',
	last_synced_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_account_projections_risk
	ON account_projections(risk_score DESC, last_seen_at DESC);

CREATE TABLE IF NOT EXISTS sync_runs (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	source TEXT NOT NULL,
	started_at INTEGER NOT NULL,
	completed_at INTEGER,
	status TEXT NOT NULL,
	record_count INTEGER NOT NULL DEFAULT 0,
	detail TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_sync_runs_source
	ON sync_runs(source, started_at DESC);
