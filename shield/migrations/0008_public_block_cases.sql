ALTER TABLE bans ADD COLUMN public_id TEXT;

UPDATE bans
SET public_id = 'SFB-' || UPPER(HEX(RANDOMBLOB(8)))
WHERE public_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_bans_public_id ON bans(public_id);
