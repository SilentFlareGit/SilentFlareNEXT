CREATE TABLE IF NOT EXISTS risk_subjects (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	subject_type TEXT NOT NULL CHECK (subject_type IN (
		'account', 'session', 'device', 'ip', 'cidr', 'asn', 'email',
		'email_domain', 'api_key', 'country', 'region'
	)),
	subject_hash TEXT NOT NULL,
	display_value TEXT NOT NULL,
	base_score INTEGER NOT NULL DEFAULT 0 CHECK (base_score BETWEEN 0 AND 100),
	current_score INTEGER NOT NULL DEFAULT 0 CHECK (current_score BETWEEN 0 AND 100),
	risk_level TEXT NOT NULL DEFAULT 'normal',
	first_seen_at INTEGER NOT NULL,
	last_seen_at INTEGER NOT NULL,
	last_changed_at INTEGER NOT NULL,
	version INTEGER NOT NULL DEFAULT 1,
	UNIQUE(subject_type, subject_hash)
);

CREATE INDEX IF NOT EXISTS idx_risk_subjects_rank
	ON risk_subjects(subject_type, current_score DESC, last_changed_at DESC);

CREATE TABLE IF NOT EXISTS risk_ledger (
	id TEXT PRIMARY KEY,
	subject_id INTEGER NOT NULL REFERENCES risk_subjects(id),
	created_at INTEGER NOT NULL,
	delta INTEGER NOT NULL CHECK (delta BETWEEN -100 AND 100),
	score_before INTEGER NOT NULL CHECK (score_before BETWEEN 0 AND 100),
	score_after INTEGER NOT NULL CHECK (score_after BETWEEN 0 AND 100),
	reason_code TEXT NOT NULL,
	reason TEXT NOT NULL,
	source TEXT NOT NULL,
	source_ref TEXT,
	actor TEXT NOT NULL,
	expires_at INTEGER,
	parent_entry_id TEXT REFERENCES risk_ledger(id),
	metadata_json TEXT NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_risk_ledger_subject
	ON risk_ledger(subject_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_risk_ledger_reason
	ON risk_ledger(reason_code, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_risk_ledger_idempotency
	ON risk_ledger(subject_id, reason_code, source, source_ref)
	WHERE source_ref IS NOT NULL;

CREATE TRIGGER IF NOT EXISTS risk_ledger_no_update
BEFORE UPDATE ON risk_ledger BEGIN SELECT RAISE(ABORT, 'risk_ledger is append-only'); END;

CREATE TRIGGER IF NOT EXISTS risk_ledger_no_delete
BEFORE DELETE ON risk_ledger BEGIN SELECT RAISE(ABORT, 'risk_ledger is append-only'); END;

CREATE TABLE IF NOT EXISTS risk_effects (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	subject_id INTEGER NOT NULL REFERENCES risk_subjects(id),
	source_entry_id TEXT NOT NULL UNIQUE REFERENCES risk_ledger(id),
	remaining_delta INTEGER NOT NULL,
	decay_step INTEGER NOT NULL DEFAULT 0,
	next_decay_at INTEGER,
	expires_at INTEGER,
	status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'revoked')),
	updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_risk_effects_due
	ON risk_effects(status, next_decay_at, expires_at);

CREATE TABLE IF NOT EXISTS risk_overrides (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	subject_id INTEGER NOT NULL REFERENCES risk_subjects(id),
	override_type TEXT NOT NULL CHECK (override_type IN (
		'adjustment', 'score_cap', 'score_floor', 'rule_exemption', 'response_exemption'
	)),
	value_integer INTEGER,
	scope_host TEXT,
	scope_path TEXT,
	scope_rule_id INTEGER,
	reason TEXT NOT NULL,
	created_at INTEGER NOT NULL,
	created_by TEXT NOT NULL,
	expires_at INTEGER,
	revoked_at INTEGER,
	revoked_by TEXT,
	revoke_reason TEXT,
	ledger_entry_id TEXT REFERENCES risk_ledger(id)
);

CREATE INDEX IF NOT EXISTS idx_risk_overrides_active
	ON risk_overrides(subject_id, override_type, expires_at, revoked_at);

CREATE TABLE IF NOT EXISTS risk_relations (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	left_subject_id INTEGER NOT NULL REFERENCES risk_subjects(id),
	right_subject_id INTEGER NOT NULL REFERENCES risk_subjects(id),
	relation_type TEXT NOT NULL,
	confidence INTEGER NOT NULL DEFAULT 100 CHECK (confidence BETWEEN 0 AND 100),
	first_seen_at INTEGER NOT NULL,
	last_seen_at INTEGER NOT NULL,
	expires_at INTEGER,
	UNIQUE(left_subject_id, right_subject_id, relation_type)
);

CREATE INDEX IF NOT EXISTS idx_risk_relations_left ON risk_relations(left_subject_id, last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_risk_relations_right ON risk_relations(right_subject_id, last_seen_at DESC);

CREATE TABLE IF NOT EXISTS risk_cases (
	public_id TEXT PRIMARY KEY,
	risk_code TEXT NOT NULL CHECK (length(risk_code) = 3),
	subject_type TEXT,
	subject_hash TEXT,
	ban_public_id TEXT,
	host TEXT NOT NULL,
	return_path TEXT NOT NULL DEFAULT '/',
	created_at INTEGER NOT NULL,
	expires_at INTEGER,
	status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'released', 'expired')),
	released_at INTEGER,
	request_id TEXT NOT NULL,
	internal_reason TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_risk_cases_active
	ON risk_cases(status, expires_at, created_at DESC);

CREATE TABLE IF NOT EXISTS risk_actions (
	id TEXT PRIMARY KEY,
	subject_id INTEGER REFERENCES risk_subjects(id),
	action TEXT NOT NULL,
	status TEXT NOT NULL CHECK (status IN ('queued', 'running', 'completed', 'failed', 'reversed')),
	reason TEXT NOT NULL,
	created_at INTEGER NOT NULL,
	created_by TEXT NOT NULL,
	started_at INTEGER,
	completed_at INTEGER,
	expires_at INTEGER,
	attempt_count INTEGER NOT NULL DEFAULT 0,
	next_attempt_at INTEGER,
	detail TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_risk_actions_queue
	ON risk_actions(status, next_attempt_at, created_at);

CREATE TABLE IF NOT EXISTS automation_runs (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	job_name TEXT NOT NULL,
	started_at INTEGER NOT NULL,
	completed_at INTEGER,
	status TEXT NOT NULL,
	processed_count INTEGER NOT NULL DEFAULT 0,
	detail TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_automation_runs_job
	ON automation_runs(job_name, started_at DESC);
