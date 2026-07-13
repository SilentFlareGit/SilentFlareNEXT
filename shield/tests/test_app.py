from __future__ import annotations

import os
import sqlite3
import tempfile
import time
import unittest


_temporary = tempfile.TemporaryDirectory()
os.environ["SHIELD_MODE"] = "observe"
os.environ["SHIELD_DATABASE_PATH"] = os.path.join(_temporary.name, "shield.db")
os.environ["SHIELD_INTERNAL_SIGNING_KEY"] = "integration-signing-key-that-is-longer-than-thirty-two-characters"
os.environ["SHIELD_ADMIN_INTROSPECTION_URL"] = "http://admin-session.test/auth/me"
os.environ["SHIELD_ACCOUNT_SNAPSHOT_URL"] = "http://account-snapshot.test/admin/users"
os.environ["SHIELD_ACCOUNT_RESPONSE_URL"] = "http://account-snapshot.test/internal/shield/respond"
os.environ["SHIELD_SYNC_SECRET"] = "integration-sync-key-that-is-longer-than-thirty-two-characters"
os.environ["SHIELD_COOKIE_SECURE"] = "false"

from fastapi.testclient import TestClient
import httpx

from app.config import settings
from app.main import _automatic_ban, app
from app.rate_limit import RateHit
from app.rules import RequestContext
from app.security import verify_headers


class ShieldApplicationTests(unittest.TestCase):
	@classmethod
	def setUpClass(cls):
		cls.client_context = TestClient(app)
		cls.client = cls.client_context.__enter__()
		cls.upstream_requests = []
		cls.account_response_requests = []
		class MockStream(httpx.AsyncByteStream):
			def __init__(self, content):
				self.content = content

			async def __aiter__(self):
				yield self.content

		def upstream(request):
			cls.upstream_requests.append(request)
			if request.url.host == "admin-session.test":
				if request.headers.get("cookie") == "sf_bot_session=valid-admin":
					return httpx.Response(200, json={"authenticated": True, "bot": {"id": "SilentFlare Admin"}, "csrf": "admin-csrf"})
				return httpx.Response(401, json={"detail": "Login required"})
			if request.url.host == "account-snapshot.test":
				if request.url.path == "/internal/shield/respond":
					cls.account_response_requests.append(request)
					return httpx.Response(200, json={"ok": True, "status": "completed"})
				return httpx.Response(200, json={"users": [{"id": "user-1", "username": "risk-user", "role": "user", "created_at": "2020-01-01T00:00:00+00:00", "email_verified_at": None, "totp_enabled": 0, "active_session_count": 2, "comment_count": 4}]})
			if request.url.path == "/missing":
				return httpx.Response(404, stream=MockStream(b"missing"), headers={"Content-Type": "text/plain"})
			return httpx.Response(200, stream=MockStream(b"upstream-ok"), headers={"Content-Type": "text/plain"})

		app.state.client._transport = httpx.MockTransport(upstream)

	@classmethod
	def tearDownClass(cls):
		cls.client_context.__exit__(None, None, None)
		_temporary.cleanup()

	def test_health_probes(self):
		self.assertEqual(self.client.get("/__shield/health/live").status_code, 200)
		ready = self.client.get("/__shield/health/ready")
		self.assertEqual(ready.status_code, 200)
		self.assertEqual(ready.json()["mode"], "observe")

	def test_admin_requires_authentication(self):
		self.assertEqual(self.client.get("/__shield/api/admin/overview").status_code, 401)

	def test_existing_silentflare_admin_session_grants_access(self):
		response = self.client.get(
			"/__shield/api/admin/session",
			headers={"Cookie": "sf_bot_session=valid-admin"},
		)
		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.json()["actor"], "SilentFlare Admin")
		self.assertEqual(response.json()["csrfToken"], "admin-csrf")

	def test_admin_mutation_reuses_existing_admin_csrf(self):
		headers = {"Cookie": "sf_bot_session=valid-admin", "X-CSRF-Token": "admin-csrf"}
		response = self.client.post("/__shield/api/admin/mode", headers=headers, json={"mode": "observe"})
		self.assertEqual(response.status_code, 200)

	def test_dashboard_synchronizes_real_account_projection(self):
		response = self.client.get("/__shield/api/admin/dashboard", headers={"Cookie": "sf_bot_session=valid-admin"})
		self.assertEqual(response.status_code, 200)
		payload = response.json()
		self.assertEqual(payload["sync"]["recordCount"], 1)
		self.assertEqual(payload["riskyAccounts"][0]["label"], "risk-user")
		self.assertIn("metrics", payload)
		self.assertIn("series", payload)

	def test_event_action_uses_event_context_without_manual_value(self):
		now = int(time.time())
		self.client.app.state.database.execute(
			"""INSERT INTO risk_events(id, created_at, trace_id, risk_level, risk_score, host, path, method,
			ip_hash, ip_masked, matched_rules_json, reasons_json, actions_json, request_summary_json)
			VALUES ('action-event', ?, 'trace', 'restrict', 70, 'api.silentflare.com', '/auth/login/password',
			'POST', 'hashed-ip', '203.0.113.0/24', '[]', '[\"Login abuse\"]', '[\"log\"]', '{}')""",
			(now,),
		)
		response = self.client.post(
			"/__shield/api/admin/events/action-event/action",
			headers={"Cookie": "sf_bot_session=valid-admin", "X-CSRF-Token": "admin-csrf"},
			json={"action": "block_ip", "duration_seconds": 3600},
		)
		self.assertEqual(response.status_code, 200)
		ban = self.client.app.state.database.query("SELECT subject_hash FROM bans WHERE reason LIKE 'Created from risk event%'")[-1]
		self.assertEqual(ban["subject_hash"], "hashed-ip")

	def test_control_plane_manages_services_automation_geography_and_account_risk(self):
		headers = {"Cookie": "sf_bot_session=valid-admin", "X-CSRF-Token": "admin-csrf"}
		service = self.client.put(
			"/__shield/api/admin/services/api.silentflare.com",
			headers=headers,
			json={"protection_enabled": True, "mode": "observe", "fail_policy": "route"},
		)
		self.assertEqual(service.status_code, 200)
		policy = self.client.put(
			"/__shield/api/admin/rate-policies/4",
			headers=headers,
			json={"enabled": True, "limit_value": 8, "window_seconds": 60, "action": "temporary_ban", "cooldown_seconds": 21600},
		)
		self.assertEqual(policy.status_code, 200)
		geo = self.client.post(
			"/__shield/api/admin/geo-policies",
			headers=headers,
			json={"country_code": "US", "scope_host": "api.silentflare.com", "action": "turnstile"},
		)
		self.assertEqual(geo.status_code, 200)
		dashboard = self.client.get("/__shield/api/admin/dashboard", headers={"Cookie": "sf_bot_session=valid-admin"}).json()
		account_id = dashboard["riskyAccounts"][0]["id"]
		adjustment = self.client.put(
			f"/__shield/api/admin/accounts/{account_id}/risk",
			headers=headers,
			json={"delta": 20, "reason": "Administrator risk escalation", "duration_seconds": 86400},
		)
		self.assertEqual(adjustment.status_code, 200)
		updated = self.client.get("/__shield/api/admin/dashboard", headers={"Cookie": "sf_bot_session=valid-admin"}).json()
		self.assertEqual(updated["policies"][3]["action"], "temporary_ban")
		self.assertEqual(updated["geoPolicies"][0]["countryCode"], "US")
		self.assertEqual(updated["riskyAccounts"][0]["manualDelta"], 20)

	def test_account_response_is_signed_and_recorded_without_exposing_account_reference(self):
		headers = {"Cookie": "sf_bot_session=valid-admin", "X-CSRF-Token": "admin-csrf"}
		dashboard = self.client.get("/__shield/api/admin/dashboard", headers=headers).json()
		account_id = dashboard["riskyAccounts"][0]["id"]
		response = self.client.post(
			f"/__shield/api/admin/accounts/{account_id}/response",
			headers=headers,
			json={"action": "revoke_sessions", "reason": "Integration test"},
		)
		self.assertEqual(response.status_code, 200)
		forwarded = self.account_response_requests[-1]
		self.assertTrue(forwarded.headers.get("x-sf-shield-signature"))
		self.assertTrue(forwarded.headers.get("x-sf-shield-timestamp"))
		self.assertEqual(forwarded.url.path, "/internal/shield/respond")
		command = self.client.app.state.database.query("SELECT status, action FROM response_commands ORDER BY created_at DESC LIMIT 1")[0]
		self.assertEqual(command, {"status": "completed", "action": "revoke_sessions"})
		self.assertNotIn("account_ref", str(dashboard))

	def test_risk_model_simulation_versioning_and_rollback(self):
		headers = {"Cookie": "sf_bot_session=valid-admin", "X-CSRF-Token": "admin-csrf"}
		model = self.client.get("/__shield/api/admin/settings/risk", headers=headers).json()
		payload = {"weights": model["weights"], "thresholds": model["thresholds"], "note": "Integration version"}
		simulation = self.client.post("/__shield/api/admin/settings/risk/simulate", headers=headers, json=payload)
		self.assertEqual(simulation.status_code, 200)
		self.assertIn("projectedAverage", simulation.json())
		published = self.client.put("/__shield/api/admin/settings/risk", headers=headers, json=payload)
		self.assertEqual(published.status_code, 200)
		version = published.json()["version"]
		rollback = self.client.post(f"/__shield/api/admin/settings/risk/rollback/{version}", headers=headers, json={})
		self.assertEqual(rollback.status_code, 200)
		self.assertEqual(rollback.json()["version"], version)

	def test_alert_policy_test_alert_and_daily_report_are_operational(self):
		headers = {"Cookie": "sf_bot_session=valid-admin", "X-CSRF-Token": "admin-csrf"}
		config = self.client.put(
			"/__shield/api/admin/alerts/config",
			headers=headers,
			json={"enabled": True, "minimum_score": 75, "high_risk_per_5m": 5, "blocked_per_5m": 7, "daily_report_hour": 4},
		)
		self.assertEqual(config.status_code, 200)
		created = self.client.post("/__shield/api/admin/alerts/test", headers=headers, json={})
		self.assertEqual(created.status_code, 200)
		alert_id = created.json()["id"]
		dismissed = self.client.post(f"/__shield/api/admin/alerts/{alert_id}/dismiss", headers=headers, json={})
		self.assertEqual(dismissed.status_code, 200)
		report = self.client.get("/__shield/api/admin/reports/daily", headers=headers)
		self.assertEqual(report.status_code, 200)
		self.assertIn("requests", report.json())

	def test_dashboard_exposes_connected_operations_without_manual_targets(self):
		response = self.client.get("/__shield/api/admin/dashboard", headers={"Cookie": "sf_bot_session=valid-admin"})
		self.assertEqual(response.status_code, 200)
		payload = response.json()
		for key in ("networkIntel", "accessLists", "bans", "alerts", "alertConfig", "riskModel", "dailyReport"):
			self.assertIn(key, payload)
		self.assertTrue(next(item for item in payload["services"] if item["host"] == "api.silentflare.com")["connected"])

	def test_automatic_account_policy_bans_correlated_session_once(self):
		context = RequestContext(
			request_id="automatic-ban-test",
			host="api.silentflare.com",
			path="/comments",
			method="POST",
			ip="203.0.113.22",
			session_id="opaque-test-session",
		)
		hit = RateHit(4, "Comments per account", "account", "temporary_ban", 30, 21600)
		_automatic_ban(app.state.database, context, [hit])
		_automatic_ban(app.state.database, context, [hit])
		rows = app.state.database.query(
			"SELECT subject_type, subject_display, reason, expires_at FROM bans WHERE reason = ?",
			("Automatic policy: Comments per account",),
		)
		self.assertEqual(len(rows), 1)
		self.assertEqual(rows[0]["subject_type"], "session")
		self.assertEqual(rows[0]["subject_display"], "Correlated session")
		self.assertGreaterEqual(rows[0]["expires_at"], int(time.time()) + 21590)

	def test_unknown_host_is_rejected_before_proxying(self):
		response = self.client.get("/not-an-upstream", headers={"Host": "unlisted.example"})
		self.assertEqual(response.status_code, 421)

	def test_proxy_strips_spoofed_headers_and_adds_signed_decision(self):
		response = self.client.get(
			"/proxied",
			headers={"Host": "blog.silentflare.com", "X-SF-Shield-Risk-Score": "100", "X-SF-Shield-Signature": "forged"},
		)
		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.text, "upstream-ok")
		forwarded = {name.lower(): value for name, value in self.upstream_requests[-1].headers.items()}
		self.assertNotEqual(forwarded["x-sf-shield-signature"], "forged")
		self.assertTrue(verify_headers(forwarded, "GET", "/proxied", settings.internal_signing_key))

	def test_repeated_404_responses_create_scan_event(self):
		app.state.database.execute("UPDATE rate_policies SET limit_value = 1 WHERE name = '404 scanner per IP'")
		self.assertEqual(self.client.get("/missing", headers={"Host": "blog.silentflare.com"}).status_code, 404)
		self.assertEqual(self.client.get("/missing", headers={"Host": "blog.silentflare.com"}).status_code, 404)
		rows = app.state.database.query("SELECT reasons_json, actions_json FROM risk_events WHERE path = '/missing' ORDER BY created_at DESC")
		self.assertTrue(rows)
		self.assertTrue(any("Repeated 404" in row["reasons_json"] for row in rows))

	def test_database_outage_uses_memory_for_public_read_and_closes_sensitive_route(self):
		original_query = app.state.database.query

		def unavailable(*_args, **_kwargs):
			raise sqlite3.OperationalError("database unavailable")

		app.state.database.query = unavailable
		try:
			public_response = self.client.get("/degraded", headers={"Host": "blog.silentflare.com"})
			self.assertEqual(public_response.status_code, 200)
			self.assertTrue(app.state.degraded_events)
			sensitive_response = self.client.post("/auth/login/password", headers={"Host": "api.silentflare.com"}, json={})
			self.assertEqual(sensitive_response.status_code, 503)
		finally:
			app.state.database.query = original_query

	def test_admin_application_is_served_independently(self):
		response = self.client.get(
			"/__shield/admin",
			headers={"Cookie": "sf_bot_session=valid-admin"},
		)
		self.assertEqual(response.status_code, 200)
		self.assertIn("SilentFlare Shield", response.text)
		self.assertNotIn('type="password"', response.text)
		self.assertNotIn("__SHIELD_ASSET_VERSION__", response.text)
		self.assertRegex(response.text, r'/__shield/static/app\.js\?v=[0-9a-f]{12}')
		self.assertEqual(response.headers["cache-control"], "no-store")

	def test_admin_assets_are_not_cached_across_releases(self):
		response = self.client.get("/__shield/static/app.js")
		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.headers["cache-control"], "no-store")
		stylesheet = self.client.get("/__shield/static/app.css")
		self.assertIn("[hidden] { display: none !important; }", stylesheet.text)

	def test_admin_page_redirects_without_existing_admin_session(self):
		response = self.client.get("/__shield/admin", follow_redirects=False)
		self.assertEqual(response.status_code, 302)
		self.assertTrue(response.headers["location"].startswith("https://auth.silentflare.com/?audience=admin"))


if __name__ == "__main__":
	unittest.main()
