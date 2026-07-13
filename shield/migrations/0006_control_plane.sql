CREATE TABLE IF NOT EXISTS service_controls (
	host TEXT PRIMARY KEY,
	protection_enabled INTEGER NOT NULL DEFAULT 0,
	mode TEXT NOT NULL DEFAULT 'observe' CHECK (mode IN ('observe', 'enforce')),
	fail_policy TEXT NOT NULL DEFAULT 'route' CHECK (fail_policy IN ('open', 'closed', 'route')),
	updated_at INTEGER NOT NULL,
	updated_by TEXT NOT NULL
);

INSERT OR IGNORE INTO service_controls(host, protection_enabled, mode, fail_policy, updated_at, updated_by)
VALUES
	('api.silentflare.com', 1, 'observe', 'route', unixepoch(), 'migration'),
	('blog.silentflare.com', 0, 'observe', 'open', unixepoch(), 'migration'),
	('accounts.silentflare.com', 0, 'observe', 'route', unixepoch(), 'migration'),
	('admin.silentflare.com', 0, 'observe', 'closed', unixepoch(), 'migration'),
	('cms.silentflare.com', 0, 'observe', 'closed', unixepoch(), 'migration');

CREATE TABLE IF NOT EXISTS geo_policies (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	country_code TEXT NOT NULL,
	region TEXT,
	scope_host TEXT,
	action TEXT NOT NULL CHECK (action IN ('block', 'turnstile', 'read_only', 'block_login', 'block_register', 'block_comment', 'block_api', 'block_admin')),
	enabled INTEGER NOT NULL DEFAULT 1,
	note TEXT NOT NULL DEFAULT '',
	created_at INTEGER NOT NULL,
	created_by TEXT NOT NULL,
	updated_at INTEGER NOT NULL,
	expires_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_geo_policies_match
	ON geo_policies(country_code, region, scope_host, enabled, expires_at);

CREATE TABLE IF NOT EXISTS account_risk_adjustments (
	account_id_hash TEXT PRIMARY KEY,
	delta INTEGER NOT NULL CHECK (delta BETWEEN -100 AND 100),
	reason TEXT NOT NULL,
	created_at INTEGER NOT NULL,
	created_by TEXT NOT NULL,
	expires_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_account_risk_adjustments_expiry
	ON account_risk_adjustments(expires_at);
