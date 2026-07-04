-- Runtime-managed public blog identity and appearance.
-- The FastAPI ensure_account_db() path applies this idempotently in production.
CREATE TABLE IF NOT EXISTS site_settings (
	id INTEGER PRIMARY KEY CHECK (id = 1),
	settings_json TEXT NOT NULL,
	updated_at TEXT NOT NULL
);
