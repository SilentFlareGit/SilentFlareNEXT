CREATE TABLE IF NOT EXISTS cms_audit_log (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	actor TEXT NOT NULL,
	action TEXT NOT NULL,
	resource_type TEXT NOT NULL,
	resource_id TEXT,
	detail_json TEXT NOT NULL DEFAULT '{}',
	created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cms_audit_created
	ON cms_audit_log(created_at DESC);
