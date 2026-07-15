ALTER TABLE ip_intel ADD COLUMN region_code TEXT NOT NULL DEFAULT '';
ALTER TABLE ip_intel ADD COLUMN network_prefix TEXT NOT NULL DEFAULT '';
ALTER TABLE ip_intel ADD COLUMN country_source TEXT NOT NULL DEFAULT 'legacy';
ALTER TABLE ip_intel ADD COLUMN region_source TEXT NOT NULL DEFAULT 'legacy';
ALTER TABLE ip_intel ADD COLUMN asn_source TEXT NOT NULL DEFAULT 'legacy';
ALTER TABLE ip_intel ADD COLUMN country_confidence TEXT NOT NULL DEFAULT 'unknown';
ALTER TABLE ip_intel ADD COLUMN region_confidence TEXT NOT NULL DEFAULT 'unknown';
ALTER TABLE ip_intel ADD COLUMN asn_confidence TEXT NOT NULL DEFAULT 'unknown';
ALTER TABLE ip_intel ADD COLUMN conflict_fields TEXT NOT NULL DEFAULT '[]';
ALTER TABLE ip_intel ADD COLUMN provenance_status TEXT NOT NULL DEFAULT 'verified';

ALTER TABLE risk_subjects ADD COLUMN provenance_status TEXT NOT NULL DEFAULT 'verified';

UPDATE ip_intel SET provenance_status = 'legacy_edge_contaminated';
UPDATE risk_subjects SET provenance_status = 'legacy_edge_contaminated'
	WHERE subject_type IN ('device', 'ip', 'cidr', 'asn', 'country', 'region');

ALTER TABLE risk_events ADD COLUMN client_ip_source TEXT NOT NULL DEFAULT 'legacy';
ALTER TABLE risk_events ADD COLUMN geo_source TEXT NOT NULL DEFAULT 'legacy';
ALTER TABLE risk_events ADD COLUMN geo_confidence TEXT NOT NULL DEFAULT 'unknown';
