CREATE TABLE IF NOT EXISTS bot_sessions (
	id_hash TEXT PRIMARY KEY,
	bot_id TEXT NOT NULL,
	csrf_hash TEXT NOT NULL,
	created_at INTEGER NOT NULL,
	expires_at INTEGER NOT NULL,
	login_epoch TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bot_login_challenges (
	id_hash TEXT PRIMARY KEY,
	bot_id TEXT NOT NULL,
	client_hash TEXT NOT NULL,
	status TEXT NOT NULL,
	created_at INTEGER NOT NULL,
	expires_at INTEGER NOT NULL,
	message_chat_id TEXT,
	message_id TEXT
);

CREATE TABLE IF NOT EXISTS bot_login_failures (
	client_hash TEXT NOT NULL,
	failed_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS jobs (
	id TEXT PRIMARY KEY,
	job_type TEXT NOT NULL,
	payload_json TEXT NOT NULL,
	status TEXT NOT NULL DEFAULT 'pending',
	idempotency_key TEXT,
	attempts INTEGER NOT NULL DEFAULT 0,
	max_attempts INTEGER NOT NULL DEFAULT 3,
	available_at TEXT NOT NULL,
	locked_at TEXT,
	locked_by TEXT,
	last_error TEXT,
	result_json TEXT,
	created_at TEXT NOT NULL,
	updated_at TEXT NOT NULL,
	finished_at TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_jobs_idempotency
	ON jobs(job_type, idempotency_key)
	WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_jobs_claim
	ON jobs(status, available_at, created_at);
CREATE INDEX IF NOT EXISTS idx_bot_sessions_expires
	ON bot_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_bot_challenges_expires
	ON bot_login_challenges(expires_at);
CREATE INDEX IF NOT EXISTS idx_bot_failures_client_time
	ON bot_login_failures(client_hash, failed_at);
