from __future__ import annotations

import os
import sqlite3
import tempfile
import time
import unittest
from urllib.parse import parse_qs, urlsplit


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
from app.database import stable_hash
from app.main import _automatic_ban, _reconcile_entity_bans, app
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

	def test_public_shield_portal_is_host_scoped(self):
		home = self.client.get("/", headers={"Host": "shield.silentflare.com"})
		self.assertEqual(home.status_code, 200)
		self.assertIn("Shield protection is active", home.text)
		self.assertNotIn("{{", home.text)
		self.assertEqual(
			self.client.get(
				"/assets/blocked.css", headers={"Host": "shield.silentflare.com"}
			).status_code,
			200,
		)

	def test_active_ban_redirects_browser_to_signed_public_case(self):
		database = self.client.app.state.database
		now = int(time.time())
		public_id = "SFB-0123456789ABCDEF"
		database.set_setting("global_mode", "enforce", "test")
		database.execute(
			"UPDATE service_controls SET protection_enabled = 1, mode = 'enforce' WHERE host = 'blog.silentflare.com'"
		)
		database.execute(
			"""INSERT INTO bans(public_id, subject_type, subject_hash, subject_display, restriction,
			reason, created_by, created_at, expires_at) VALUES (?, 'session', ?, 'Correlated session',
			'all', 'Portal integration test', 'test', ?, ?)""",
			(public_id, stable_hash("blocked-session", settings.internal_signing_key), now, now + 3600),
		)
		try:
			response = self.client.get(
				"/private",
				headers={
					"Host": "blog.silentflare.com",
					"Accept": "text/html",
					"Cookie": "sf_account_session=blocked-session",
				},
				follow_redirects=False,
			)
			self.assertEqual(response.status_code, 303)
			location = response.headers["location"]
			parts = urlsplit(location)
			query = parse_qs(parts.query)
			self.assertEqual(parts.netloc, "shield.silentflare.com")
			self.assertEqual(query["id"], [public_id])
			self.assertTrue(query["token"][0])
			self.assertEqual(response.headers["x-sf-shield-ban-id"], public_id)

			portal = self.client.get(
				f"{parts.path}?{parts.query}",
				headers={"Host": "shield.silentflare.com"},
			)
			self.assertEqual(portal.status_code, 200)
			self.assertIn(public_id, portal.text)
			self.assertIn(">102<", portal.text)
			self.assertIn("Unable to access this website", portal.text)
			self.assertNotIn("Portal integration test", portal.text)

			api_response = self.client.get(
				"/private",
				headers={
					"Host": "blog.silentflare.com",
					"Accept": "application/json",
					"Cookie": "sf_account_session=blocked-session",
				},
			)
			self.assertEqual(api_response.status_code, 403)
			self.assertEqual(api_response.json()["errorCode"], "102")
			self.assertEqual(api_response.json()["banId"], public_id)
			self.assertEqual(api_response.headers["location"], api_response.json()["supportUrl"])

			tampered = self.client.get(
				f"{parts.path}?id={public_id}&token=tampered",
				headers={"Host": "shield.silentflare.com"},
			)
			self.assertIn("SFB-UNAVAILABLE", tampered.text)

			database.execute("UPDATE bans SET revoked_at = ? WHERE public_id = ?", (int(time.time()), public_id))
			released = self.client.get(
				f"{parts.path}?{parts.query}",
				headers={"Host": "shield.silentflare.com"},
				follow_redirects=False,
			)
			self.assertEqual(released.status_code, 303)
			self.assertEqual(released.headers["location"], "https://blog.silentflare.com/private")
		finally:
			database.execute("UPDATE bans SET revoked_at = ? WHERE public_id = ?", (int(time.time()), public_id))
			database.set_setting("global_mode", "observe", "test")
			database.execute(
				"UPDATE service_controls SET mode = 'observe' WHERE host = 'blog.silentflare.com'"
			)

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

	def test_entity_dashboard_supports_custom_adjustment_and_score_cap(self):
		headers = {"Cookie": "sf_bot_session=valid-admin", "X-CSRF-Token": "admin-csrf"}
		subject = app.state.entities.ensure_subject("ip", "203.0.113.70")
		adjusted = self.client.post(
			f"/__shield/api/admin/entities/{subject['id']}/adjust",
			headers=headers,
			json={"delta": 72, "reason": "Integration risk increase", "duration_seconds": 3600},
		)
		self.assertEqual(adjusted.status_code, 200)
		self.assertEqual(adjusted.json()["subject"]["currentScore"], 72)
		exempted = self.client.post(
			f"/__shield/api/admin/entities/{subject['id']}/overrides",
			headers=headers,
			json={"override_type": "score_cap", "value": 25, "reason": "Temporary trusted source", "duration_seconds": 3600},
		)
		self.assertEqual(exempted.status_code, 200)
		self.assertEqual(exempted.json()["subject"]["effectiveScore"], 25)
		listing = self.client.get("/__shield/api/admin/entities?subject_type=ip", headers=headers)
		self.assertEqual(listing.status_code, 200)
		self.assertTrue(any(item["id"] == subject["id"] for item in listing.json()["items"]))

	def test_split_role_apps_expose_only_their_route_surface(self):
		from app.control.app import app as control_app
		from app.gateway.app import app as gateway_app
		from app.portal.app import app as portal_app

		gateway_paths = {route.path for route in gateway_app.routes}
		control_paths = {route.path for route in control_app.routes}
		portal_paths = {route.path for route in portal_app.routes}
		self.assertIn("/{path:path}", gateway_paths)
		self.assertNotIn("/__shield/api/admin/entities", gateway_paths)
		self.assertIn("/__shield/api/admin/entities", control_paths)
		self.assertNotIn("/{path:path}", control_paths)
		self.assertIn("/blocked", portal_paths)
		self.assertNotIn("/__shield/api/admin/entities", portal_paths)

	def test_split_gateway_uses_its_own_runtime_services(self):
		from app.gateway.app import app as gateway_app

		class SplitMockStream(httpx.AsyncByteStream):
			async def __aiter__(self):
				yield b"split-gateway-ok"

		with TestClient(gateway_app) as gateway_client:
			gateway_app.state.client._transport = httpx.MockTransport(
				lambda _request: httpx.Response(200, stream=SplitMockStream())
			)
			response = gateway_client.get("/split-runtime", headers={"Host": "blog.silentflare.com"})
			self.assertEqual(response.status_code, 200)
			self.assertEqual(response.text, "split-gateway-ok")

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

	def test_high_risk_entity_is_automatically_banned_and_released(self):
		subject = app.state.entities.ensure_subject("ip", "203.0.113.88")
		app.state.entities.adjust(
			int(subject["id"]),
			85,
			reason_code="AUTOMATION_TEST",
			reason="Automated response integration test",
			source="test",
			actor="test",
		)
		exemption = app.state.entities.add_override(
			int(subject["id"]),
			override_type="score_cap",
			value=25,
			reason="Verified maintenance source",
			actor="owner",
			duration_seconds=3600,
		)
		self.assertEqual(_reconcile_entity_bans(app.state.database), 0)
		app.state.entities.revoke_override(int(exemption["id"]), "owner", "Maintenance completed")
		self.assertEqual(_reconcile_entity_bans(app.state.database), 1)
		active = app.state.database.query(
			"SELECT * FROM bans WHERE subject_hash = ? AND created_by = 'shield-worker' AND revoked_at IS NULL",
			(subject["subject_hash"],),
		)
		self.assertEqual(len(active), 1)
		app.state.entities.adjust(
			int(subject["id"]),
			-45,
			reason_code="FALSE_POSITIVE",
			reason="Confirmed safe source",
			source="test",
			actor="owner",
		)
		self.assertEqual(_reconcile_entity_bans(app.state.database), 1)
		released = app.state.database.query("SELECT revoked_at FROM bans WHERE id = ?", (active[0]["id"],))[0]
		self.assertIsNotNone(released["revoked_at"])

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
