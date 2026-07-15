CREATE TABLE IF NOT EXISTS risk_evidence (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	root_subject_id INTEGER NOT NULL REFERENCES risk_subjects(id),
	evidence_type TEXT NOT NULL,
	evidence_hash TEXT NOT NULL,
	display_value TEXT NOT NULL DEFAULT '',
	first_seen_at INTEGER NOT NULL,
	last_seen_at INTEGER NOT NULL,
	observation_count INTEGER NOT NULL DEFAULT 1,
	confidence INTEGER NOT NULL DEFAULT 100 CHECK (confidence BETWEEN 0 AND 100),
	metadata_json TEXT NOT NULL DEFAULT '{}',
	UNIQUE(root_subject_id, evidence_type, evidence_hash)
);

CREATE INDEX IF NOT EXISTS idx_risk_evidence_root
	ON risk_evidence(root_subject_id, last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_risk_evidence_lookup
	ON risk_evidence(evidence_type, evidence_hash);

CREATE TABLE IF NOT EXISTS account_ip_relations (
	account_subject_id INTEGER NOT NULL REFERENCES risk_subjects(id),
	ip_subject_id INTEGER NOT NULL REFERENCES risk_subjects(id),
	first_seen_at INTEGER NOT NULL,
	last_seen_at INTEGER NOT NULL,
	request_count INTEGER NOT NULL DEFAULT 1,
	authenticated_count INTEGER NOT NULL DEFAULT 0,
	confidence INTEGER NOT NULL DEFAULT 100 CHECK (confidence BETWEEN 0 AND 100),
	PRIMARY KEY(account_subject_id, ip_subject_id)
);

CREATE INDEX IF NOT EXISTS idx_account_ip_ip
	ON account_ip_relations(ip_subject_id, last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_account_ip_account
	ON account_ip_relations(account_subject_id, last_seen_at DESC);

CREATE TABLE IF NOT EXISTS session_account_cache (
	session_hash TEXT PRIMARY KEY,
	account_ref TEXT,
	account_id_hash TEXT,
	expires_at INTEGER NOT NULL,
	last_seen_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_session_account_cache_expiry
	ON session_account_cache(expires_at);

INSERT OR IGNORE INTO risk_evidence(
	root_subject_id, evidence_type, evidence_hash, display_value,
	first_seen_at, last_seen_at, observation_count, confidence, metadata_json
)
SELECT
	CASE WHEN root.id = relation.left_subject_id THEN relation.left_subject_id ELSE relation.right_subject_id END,
	legacy.subject_type,
	legacy.subject_hash,
	legacy.display_value,
	legacy.first_seen_at,
	legacy.last_seen_at,
	1,
	relation.confidence,
	'{"source":"legacy_relation"}'
FROM risk_relations AS relation
JOIN risk_subjects AS root
	ON root.id IN (relation.left_subject_id, relation.right_subject_id)
	AND root.subject_type IN ('account', 'ip')
JOIN risk_subjects AS legacy
	ON legacy.id = CASE WHEN root.id = relation.left_subject_id THEN relation.right_subject_id ELSE relation.left_subject_id END
	AND legacy.subject_type NOT IN ('account', 'ip');

INSERT OR IGNORE INTO account_ip_relations(
	account_subject_id, ip_subject_id, first_seen_at, last_seen_at,
	request_count, authenticated_count, confidence
)
SELECT
	account.id,
	ip.id,
	relation.first_seen_at,
	relation.last_seen_at,
	1,
	1,
	relation.confidence
FROM risk_relations AS relation
JOIN risk_subjects AS account
	ON account.id IN (relation.left_subject_id, relation.right_subject_id)
	AND account.subject_type = 'account'
JOIN risk_subjects AS ip
	ON ip.id = CASE WHEN account.id = relation.left_subject_id THEN relation.right_subject_id ELSE relation.left_subject_id END
	AND ip.subject_type = 'ip';

UPDATE risk_subjects
	SET provenance_status = 'legacy_folded'
	WHERE subject_type NOT IN ('account', 'ip')
		AND provenance_status = 'verified';
