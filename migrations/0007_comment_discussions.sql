PRAGMA foreign_keys = ON;

-- Applied idempotently by ensure_account_db() in production.
ALTER TABLE comments ADD COLUMN root_id TEXT REFERENCES comments(id);

CREATE TABLE IF NOT EXISTS comment_revisions (
	id TEXT PRIMARY KEY,
	comment_id TEXT NOT NULL,
	actor_user_id TEXT NOT NULL,
	content TEXT NOT NULL,
	created_at TEXT NOT NULL,
	FOREIGN KEY(comment_id) REFERENCES comments(id),
	FOREIGN KEY(actor_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS comment_moderation_events (
	id TEXT PRIMARY KEY,
	comment_id TEXT NOT NULL,
	actor_type TEXT NOT NULL,
	actor_id TEXT NOT NULL,
	action TEXT NOT NULL,
	reason TEXT NOT NULL,
	created_at TEXT NOT NULL,
	FOREIGN KEY(comment_id) REFERENCES comments(id)
);

CREATE INDEX IF NOT EXISTS idx_comments_thread_page
	ON comments(post_slug, root_id, status, created_at, id);
CREATE INDEX IF NOT EXISTS idx_comments_root_id
	ON comments(root_id, created_at, id);
CREATE INDEX IF NOT EXISTS idx_comment_revisions_comment
	ON comment_revisions(comment_id, created_at);
CREATE INDEX IF NOT EXISTS idx_comment_moderation_comment
	ON comment_moderation_events(comment_id, created_at);
