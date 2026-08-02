ALTER TABLE risk_overrides
	ADD COLUMN control_source TEXT NOT NULL DEFAULT 'manual'
	CHECK (control_source IN ('manual', 'geo_policy'));

ALTER TABLE risk_overrides ADD COLUMN control_ref TEXT;

CREATE INDEX IF NOT EXISTS idx_risk_overrides_control
	ON risk_overrides(control_source, control_ref, revoked_at);

CREATE UNIQUE INDEX IF NOT EXISTS idx_risk_overrides_geo_policy_active
	ON risk_overrides(subject_id, control_source, control_ref)
	WHERE revoked_at IS NULL AND control_source = 'geo_policy';
