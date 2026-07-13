ALTER TABLE rate_policies ADD COLUMN status_code INTEGER;

UPDATE rate_policies
SET status_code = 404,
	name = '404 scanner per IP',
	limit_value = 30,
	window_seconds = 60,
	cooldown_seconds = 900,
	action = 'temporary_ban'
WHERE name = '404 scanner per IP';
