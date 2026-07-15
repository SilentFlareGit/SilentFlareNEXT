ALTER TABLE geo_policies ADD COLUMN region_code TEXT;

CREATE INDEX IF NOT EXISTS idx_geo_policies_region_code
	ON geo_policies(country_code, region_code, scope_host, enabled, expires_at);
