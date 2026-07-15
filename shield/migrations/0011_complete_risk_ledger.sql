ALTER TABLE risk_ledger
	ADD COLUMN score_kind TEXT NOT NULL DEFAULT 'raw'
	CHECK (score_kind IN ('raw', 'effective'));

CREATE INDEX IF NOT EXISTS idx_risk_ledger_subject_kind
	ON risk_ledger(subject_id, score_kind, created_at DESC);

CREATE TABLE IF NOT EXISTS risk_baseline_factors (
	subject_id INTEGER NOT NULL REFERENCES risk_subjects(id),
	factor_key TEXT NOT NULL,
	value_integer INTEGER NOT NULL CHECK (value_integer BETWEEN -100 AND 100),
	reason TEXT NOT NULL,
	updated_at INTEGER NOT NULL,
	PRIMARY KEY(subject_id, factor_key)
);
