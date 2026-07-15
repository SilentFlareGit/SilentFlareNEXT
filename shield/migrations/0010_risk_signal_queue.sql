CREATE TABLE IF NOT EXISTS risk_signal_queue (
	id TEXT PRIMARY KEY,
	subject_id INTEGER NOT NULL REFERENCES risk_subjects(id),
	created_at INTEGER NOT NULL,
	delta INTEGER NOT NULL CHECK (delta BETWEEN -100 AND 100),
	reason_code TEXT NOT NULL,
	reason TEXT NOT NULL,
	source_ref TEXT NOT NULL,
	duration_seconds INTEGER,
	decay_steps INTEGER NOT NULL DEFAULT 0,
	status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
	attempt_count INTEGER NOT NULL DEFAULT 0,
	processed_at INTEGER,
	detail TEXT NOT NULL DEFAULT '',
	UNIQUE(subject_id, reason_code, source_ref)
);

CREATE INDEX IF NOT EXISTS idx_risk_signal_queue_status
	ON risk_signal_queue(status, created_at);
