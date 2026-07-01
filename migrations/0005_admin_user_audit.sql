-- Admin-only audit metadata. Raw IP values must never be returned by public APIs.
ALTER TABLE users ADD COLUMN registration_ip TEXT;
ALTER TABLE users ADD COLUMN last_seen_ip TEXT;
ALTER TABLE users ADD COLUMN last_seen_at TEXT;
ALTER TABLE users ADD COLUMN last_user_agent TEXT;
ALTER TABLE comments ADD COLUMN created_ip TEXT;
