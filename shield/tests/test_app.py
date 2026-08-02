from __future__ import annotations

import asyncio
import os
import sqlite3
import tempfile
import time
import unittest
from unittest.mock import patch
from urllib.parse import parse_qs, urlsplit


_temporary = tempfile.TemporaryDirectory()
os.environ["SHIELD_MODE"] = "observe"
os.environ["SHIELD_DATABASE_PATH"] = os.path.join(_temporary.name, "shield.db")
os.environ["SHIELD_INTERNAL_SIGNING_KEY"] = "integration-signing-key-that-is-longer-than-thirty-two-characters"
os.environ["SHIELD_ADMIN_INTROSPECTION_URL"] = "http://admin-session.test/auth/me"
os.environ["SHIELD_ACCOUNT_SNAPSHOT_URL"] = "http://account-snapshot.test/admin/users"
os.environ["SHIELD_ACCOUNT_SESSION_URL"] = "http://account-snapshot.test/internal/shield/session"
os.environ["SHIELD_ACCOUNT_RESPONSE_URL"] = "http://account-snapshot.test/internal/shield/respond"
os.environ["SHIELD_SYNC_SECRET"] = "integration-sync-key-that-is-longer-than-thirty-two-characters"
os.environ["SHIELD_COOKIE_SECURE"] = "false"

from fastapi.testclient import TestClient
import httpx
from starlette.requests import Request

from app.config import settings
from app.database import stable_hash
from app.geo import IpIntel
from app.main import _apply_entity_score, _apply_geo_policy_risk, _apply_permanent_allowlist, _automatic_ban, _client_identity, _cloudflare_edge, _enforcement_risk, _entity_subjects, _geo_policy_action, _reconcile_entity_bans, _record_entity_signals, _resolve_account, app
from app.rate_limit import RateHit
from app.risk import RiskResult
from app.rules import RequestContext, RuleDecision
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
				if request.url.path == "/internal/shield/session":
					account_id = "user-1" if "sf_account_session=valid-account" in request.headers.get("cookie", "") else None
					return httpx.Response(200, json={"ok": True, "account_id": account_id})
				return httpx.Response(200, json={"users": [{"id": "user-1", "username": "risk-user", "role": "user", "created_at": "2020-01-01T00:00:00+00:00", "email_verified_at": None, "totp_enabled": 0, "active_session_count": 2, "comment_count": 4}]})
			if request.url.path == "/missing":
				return httpx.Response(404, stream=MockStream(b"missing"), headers={"Content-Type": "text/plain"})
			if request.url.path == "/cookies":
				return httpx.Response(
					200,
					stream=MockStream(b"cookies"),
					headers=[
						("Content-Type", "text/plain"),
						("Set-Cookie", "first=one; Path=/; HttpOnly"),
						("Set-Cookie", "second=two; Path=/; Secure"),
						("X-SF-Shield-Request-ID", "spoofed-upstream-id"),
					],
				)
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

	def test_account_session_resolution_links_only_account_and_ip_roots(self):
		account_ref = asyncio.run(_resolve_account(app, "valid-account"))
		self.assertEqual(account_ref, "user-1")
		app.state.entities.ensure_subject("ip", "203.0.113.199", display="203.0.113.0/24")
		context = RequestContext(
			request_id="account-ip-relation",
			host="blog.silentflare.com",
			path="/linked",
			method="GET",
			ip="203.0.113.199",
			account_id=account_ref,
			session_id="valid-account",
			device_id="linked-device",
			asn="AS64599",
			country="US",
			region="California",
		)
		subjects = _entity_subjects(app.state.entities, context)
		self.assertEqual(set(subjects), {"account", "ip"})
		self.assertEqual(subjects["ip"]["display_value"], "203.0.113.199")
		detail = app.state.entities.detail(int(subjects["account"]["id"]))
		self.assertEqual(detail["linkedSubjects"][0]["id"], subjects["ip"]["id"])
		self.assertEqual(
			{"session", "device", "asn", "country", "region"},
			{item["evidenceType"] for item in detail["evidence"]} & {"session", "device", "asn", "country", "region"},
		)
		cache = app.state.database.query(
			"SELECT session_hash, account_ref FROM session_account_cache WHERE account_ref = ?",
			(account_ref,),
		)
		self.assertTrue(cache)
		self.assertNotEqual(cache[0]["session_hash"], "valid-account")

	def test_trusted_edge_header_is_the_only_forwarded_client_identity(self):
		request = Request(
			{
				"type": "http",
				"method": "GET",
				"path": "/",
				"headers": [
					(b"x-sf-client-ip", b"8.8.8.8"),
					(b"x-sf-proxy-ip", b"172.64.10.20"),
					(b"x-forwarded-for", b"1.1.1.1"),
				],
				"client": ("127.0.0.1", 12345),
				"server": ("127.0.0.1", 9080),
				"scheme": "http",
			}
		)
		identity = _client_identity(request)
		self.assertEqual(identity.ip, "8.8.8.8")
		self.assertEqual(identity.source, "cloudflare_edge")
		self.assertTrue(_cloudflare_edge(request))

	def test_direct_origin_request_cannot_supply_cloudflare_geo_evidence(self):
		request = Request(
			{
				"type": "http",
				"method": "GET",
				"path": "/",
				"headers": [
					(b"x-sf-client-ip", b"203.0.113.10"),
					(b"x-sf-proxy-ip", b"203.0.113.10"),
					(b"cf-ipcountry", b"US"),
				],
				"client": ("127.0.0.1", 12345),
				"server": ("127.0.0.1", 9080),
				"scheme": "http",
			}
		)
		self.assertFalse(_cloudflare_edge(request))
		self.assertEqual(_client_identity(request).source, "trusted_nginx")

	def test_untrusted_peer_cannot_spoof_edge_identity(self):
		request = Request(
			{
				"type": "http",
				"method": "GET",
				"path": "/",
				"headers": [(b"x-sf-client-ip", b"8.8.8.8")],
				"client": ("203.0.113.10", 12345),
				"server": ("127.0.0.1", 9080),
				"scheme": "http",
			}
		)
		identity = _client_identity(request)
		self.assertEqual(identity.ip, "203.0.113.10")
		self.assertEqual(identity.source, "direct_peer")

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
		subject = self.client.app.state.entities.ensure_subject("ip", "203.0.113.45")
		self.client.app.state.database.execute(
			"""INSERT INTO risk_events(id, created_at, trace_id, risk_level, risk_score, host, path, method,
			ip_hash, ip_masked, matched_rules_json, reasons_json, actions_json, request_summary_json)
			VALUES ('action-event', ?, 'trace', 'restrict', 70, 'api.silentflare.com', '/auth/login/password',
			'POST', ?, '203.0.113.0/24', '[]', '[\"Login abuse\"]', '[\"log\"]', '{}')""",
			(now, subject["subject_hash"]),
		)
		response = self.client.post(
			"/__shield/api/admin/events/action-event/action",
			headers={"Cookie": "sf_bot_session=valid-admin", "X-CSRF-Token": "admin-csrf"},
			json={"action": "block_ip", "duration_seconds": 3600},
		)
		self.assertEqual(response.status_code, 200)
		ban = self.client.app.state.database.query("SELECT subject_hash, subject_display FROM bans WHERE reason LIKE 'Created from risk event%'")[-1]
		self.assertEqual(ban["subject_hash"], subject["subject_hash"])
		self.assertEqual(ban["subject_display"], "203.0.113.45")

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

	def test_geography_catalog_restriction_scores_request_and_roots_at_100(self):
		headers = {"Cookie": "sf_bot_session=valid-admin", "X-CSRF-Token": "admin-csrf"}
		catalog = self.client.get(
			"/__shield/api/admin/geography/restrictions",
			headers=headers,
		)
		self.assertEqual(catalog.status_code, 200)
		countries = catalog.json()["countries"]
		self.assertEqual(len(countries), 249)
		self.assertTrue({"TW", "US"}.issubset({country["code"] for country in countries}))

		regions = self.client.get(
			"/__shield/api/admin/geography/restrictions?country_code=US",
			headers=headers,
		)
		self.assertEqual(regions.status_code, 200)
		self.assertIn("US-CA", {region["code"] for region in regions.json()["regions"]})

		ip = "203.0.113.221"
		account_id = "geography-account"
		ip_subject = app.state.entities.ensure_subject("ip", ip)
		account_subject = app.state.entities.ensure_subject("account", account_id)
		app.state.entities.set_score(
			int(ip_subject["id"]),
			23,
			reason="Establish IP score before geography restriction",
			actor="test-suite",
		)
		app.state.entities.set_score(
			int(account_subject["id"]),
			11,
			reason="Establish account score before geography restriction",
			actor="test-suite",
		)
		app.state.geo._store(
			IpIntel(
				ip,
				country_code="US",
				region="California",
				region_code="CA",
			),
			{},
		)
		app.state.entities.relate_account_ip(
			int(account_subject["id"]), int(ip_subject["id"])
		)

		restriction = {
			"country_code": "US",
			"region_code": "US-CA",
			"restricted": True,
			"reason": "Integration regional restriction",
		}
		created = self.client.put(
			"/__shield/api/admin/geography/restrictions",
			headers=headers,
			json=restriction,
		)
		self.assertEqual(created.status_code, 200)
		self.assertEqual(created.json()["affectedSubjects"], 2)
		subjects = {"ip": ip_subject, "account": account_subject}
		restored = False
		try:
			for subject, raw_score in ((ip_subject, 23), (account_subject, 11)):
				detail = app.state.entities.detail(int(subject["id"]))
				self.assertEqual(detail["currentScore"], raw_score)
				self.assertEqual(detail["effectiveScore"], 100)
				self.assertEqual(detail["riskLevel"], "block")
				control = next(
					item
					for item in detail["overrides"]
					if item["controlSource"] == "geo_policy" and not item["revokedAt"]
				)
				self.assertEqual((control["overrideType"], control["value"]), ("score_floor", 100))
				entry = next(
					item
					for item in detail["ledger"]
					if item["reasonCode"] == "GEOGRAPHY_RESTRICTION_APPLIED"
				)
				self.assertEqual((entry["scoreAfter"], entry["scoreKind"]), (100, "effective"))

			listing = self.client.get(
				"/__shield/api/admin/entities?minimum_score=80",
				headers=headers,
			)
			self.assertEqual(listing.status_code, 200)
			listed = {item["id"]: item for item in listing.json()["items"]}
			for subject in subjects.values():
				self.assertEqual(listed[int(subject["id"])]["effectiveScore"], 100)

			context = RequestContext(
				request_id="geography-restriction-request",
				host="blog.silentflare.com",
				path="/restricted-region",
				method="GET",
				ip=ip,
				country="US",
				region="California",
				region_code="CA",
				account_id=account_id,
			)
			action, reason = _geo_policy_action(app.state.database, context)
			self.assertEqual(action, "block")
			risk = RiskResult(15, "observe", [])
			_apply_geo_policy_risk(context, risk, reason)
			self.assertEqual((risk.score, risk.level, context.risk_score), (100, "block", 100))

			subjects = _entity_subjects(app.state.entities, context)
			_record_entity_signals(
				app.state.entities,
				context,
				risk,
				[],
				RuleDecision(),
				subjects,
				{},
			)
			for subject in subjects.values():
				detail = app.state.entities.detail(int(subject["id"]))
				self.assertEqual(detail["effectiveScore"], 100)
				self.assertFalse(
					any(item["reasonCode"] == "GEOGRAPHY_RESTRICTION" for item in detail["ledger"])
				)

			restriction["restricted"] = False
			restriction["reason"] = "Integration restriction cleanup"
			restore_response = self.client.put(
				"/__shield/api/admin/geography/restrictions",
				headers=headers,
				json=restriction,
			)
			self.assertEqual(restore_response.status_code, 200)
			self.assertEqual(restore_response.json()["restoredSubjects"], 2)
			restored = True
			for subject, raw_score in ((ip_subject, 23), (account_subject, 11)):
				detail = app.state.entities.detail(int(subject["id"]))
				self.assertEqual((detail["currentScore"], detail["effectiveScore"]), (raw_score, raw_score))
				self.assertTrue(
					any(
						item["reasonCode"] == "GEOGRAPHY_RESTRICTION_REVOKED"
						for item in detail["ledger"]
					)
				)
		finally:
			if not restored:
				restriction["restricted"] = False
				restriction["reason"] = "Integration restriction cleanup"
				self.client.put(
					"/__shield/api/admin/geography/restrictions",
					headers=headers,
					json=restriction,
				)
			for subject in subjects.values():
				current_score = int(
					app.state.entities.detail(int(subject["id"]))["currentScore"]
				)
				if current_score:
					app.state.entities.adjust(
						int(subject["id"]),
						-current_score,
						reason_code="TEST_CLEANUP",
						reason="Integration geography score cleanup",
						source="test",
						actor="test-suite",
					)

		audit = app.state.database.query(
			"SELECT action FROM audit_log WHERE target_id = 'US-CA' ORDER BY id DESC LIMIT 1"
		)
		self.assertEqual(audit[0]["action"], "geo_restriction.update")

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
		custom = self.client.put(
			f"/__shield/api/admin/entities/{subject['id']}/score",
			headers=headers,
			json={"score": 37, "reason": "Exact integration score"},
		)
		self.assertEqual(custom.status_code, 200)
		self.assertEqual(custom.json()["subject"]["currentScore"], 37)
		set_high = self.client.put(
			f"/__shield/api/admin/entities/{subject['id']}/score",
			headers=headers,
			json={"score": 100, "reason": "Integration escalation"},
		)
		self.assertEqual(set_high.json()["subject"]["effectiveScore"], 100)
		set_zero = self.client.put(
			f"/__shield/api/admin/entities/{subject['id']}/score",
			headers=headers,
			json={"score": 0, "reason": "Integration reset"},
		)
		self.assertEqual(set_zero.json()["subject"]["effectiveScore"], 0)
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
		allowlisted = self.client.post(
			f"/__shield/api/admin/entities/{subject['id']}/overrides",
			headers=headers,
			json={
				"override_type": "score_cap",
				"value": 0,
				"reason": "Permanent integration allowlist",
				"duration_seconds": None,
			},
		)
		self.assertEqual(allowlisted.status_code, 200)
		self.assertEqual(
			(
				allowlisted.json()["subject"]["currentScore"],
				allowlisted.json()["subject"]["effectiveScore"],
			),
			(0, 0),
		)
		blocked_raise = self.client.put(
			f"/__shield/api/admin/entities/{subject['id']}/score",
			headers=headers,
			json={"score": 100, "reason": "Allowlist must stay zero"},
		)
		self.assertEqual(blocked_raise.json()["subject"]["effectiveScore"], 0)
		listing = self.client.get("/__shield/api/admin/entities?subject_type=ip", headers=headers)
		self.assertEqual(listing.status_code, 200)
		self.assertTrue(any(item["id"] == subject["id"] for item in listing.json()["items"]))
		self.assertEqual(len(listing.json()["types"]), 2)
		self.assertEqual(
			{item["key"] for item in listing.json()["types"]},
			{"account", "ip"},
		)

	def test_ip_entity_detail_exposes_country_name_and_map_coordinates(self):
		headers = {"Cookie": "sf_bot_session=valid-admin"}
		ip = "8.8.4.4"
		subject = app.state.entities.ensure_subject("ip", ip)
		app.state.geo._store(
			IpIntel(
				ip,
				country_code="US",
				region="California",
				city="Mountain View",
				latitude=37.386,
				longitude=-122.0838,
			),
			{},
		)
		response = self.client.get(
			f"/__shield/api/admin/entities/{subject['id']}", headers=headers
		)
		self.assertEqual(response.status_code, 200)
		intelligence = response.json()["intelligence"]
		self.assertEqual(intelligence["countryName"], "United States")
		self.assertEqual(
			(intelligence["latitude"], intelligence["longitude"]),
			(37.386, -122.0838),
		)

	def test_ip_entity_detail_refreshes_legacy_intel_without_coordinates(self):
		headers = {"Cookie": "sf_bot_session=valid-admin"}
		ip = "198.51.100.42"
		subject = app.state.entities.ensure_subject("ip", ip)
		app.state.geo._store(
			IpIntel(ip, country_code="BE", region="Bruxelles-Capitale", city="Brussels"),
			{},
		)

		async def refresh(ip_address, request_headers):
			self.assertEqual(ip_address, ip)
			self.assertEqual(request_headers, {})
			intel = IpIntel(
				ip,
				country_code="BE",
				region="Bruxelles-Capitale",
				city="Brussels",
				latitude=50.8503,
				longitude=4.3517,
			)
			app.state.geo._store(intel, {})
			return intel, "provider"

		with patch.object(app.state.geo, "refresh", side_effect=refresh) as mocked_refresh:
			response = self.client.get(
				f"/__shield/api/admin/entities/{subject['id']}", headers=headers
			)

		mocked_refresh.assert_awaited_once()
		self.assertEqual(response.status_code, 200)
		intelligence = response.json()["intelligence"]
		self.assertEqual(intelligence["countryName"], "Belgium")
		self.assertEqual(
			(intelligence["latitude"], intelligence["longitude"]),
			(50.8503, 4.3517),
		)

	def test_permanent_allowlist_forces_gateway_risk_to_zero_and_allow(self):
		context = RequestContext(
			request_id="permanent-allowlist-request",
			host="blog.silentflare.com",
			path="/allowlisted",
			method="GET",
			ip="203.0.113.71",
		)
		subject = app.state.entities.ensure_subject("ip", context.ip)
		app.state.entities.set_score(
			int(subject["id"]), 90, reason="Establish hostile score", actor="test"
		)
		app.state.entities.add_override(
			int(subject["id"]),
			override_type="score_cap",
			value=0,
			reason="Permanent trusted integration source",
			actor="owner",
			duration_seconds=None,
		)
		risk = RiskResult(100, "block", ["Explicit deny list"])
		_apply_entity_score(app.state.entities, context, risk, {})
		self.assertTrue(context.extra["permanent_allowlisted"])
		self.assertEqual(risk.score, 0)
		self.assertEqual(
			_apply_permanent_allowlist(context, risk, ["block", "temporary_ban"]),
			["allow"],
		)
		self.assertEqual((context.risk_score, risk.score, risk.level), (0, 0, "normal"))

		admin_context = RequestContext(
			request_id="protected-admin-request",
			host="admin.silentflare.com",
			path="/",
			method="GET",
			ip=context.ip,
			extra={"permanent_allowlisted": True},
		)
		admin_risk = RiskResult(100, "block", ["Protected administration"])
		self.assertEqual(
			_apply_permanent_allowlist(admin_context, admin_risk, ["block"]),
			["block"],
		)
		self.assertEqual(admin_risk.score, 100)

	def test_revoking_geography_policy_restores_legacy_timed_signal(self):
		subject = app.state.entities.ensure_subject("ip", "203.0.113.222")
		app.state.entities.set_score(
			int(subject["id"]),
			14,
			reason="Establish score before legacy geography signal",
			actor="test-suite",
		)
		app.state.entities.adjust(
			int(subject["id"]),
			86,
			reason_code="GEOGRAPHY_RESTRICTION",
			reason="Legacy restricted geography matched",
			source="gateway",
			source_ref="geo-policy:4242:legacy",
			actor="shield-worker",
			duration_seconds=86400,
			decay_steps=1,
		)
		self.assertEqual(app.state.entities.detail(int(subject["id"]))["currentScore"], 100)

		revoked = app.state.entities.revoke_geo_policy_signals(
			[4242],
			actor="test-suite",
			reason="Legacy geography restriction removed",
		)
		self.assertEqual(revoked, {int(subject["id"])})
		detail = app.state.entities.detail(int(subject["id"]))
		self.assertEqual((detail["currentScore"], detail["effectiveScore"]), (14, 14))
		self.assertTrue(
			any(
				item["reasonCode"] == "GEOGRAPHY_RESTRICTION_REVOKED"
				for item in detail["ledger"]
			)
		)

		app.state.entities.set_score(
			int(subject["id"]),
			0,
			reason="Legacy geography test cleanup",
			actor="test-suite",
		)

	def test_every_gateway_factor_writes_subject_ledger_changes(self):
		context = RequestContext(
			request_id="all-factor-ledger-request",
			host="blog.silentflare.com",
			path="/ledger-test",
			method="GET",
			ip="203.0.113.171",
			country="US",
			region="California",
			asn="AS64571",
			account_id="ledger-account",
			session_id="ledger-session",
			device_id="ledger-device",
			email="ledger@example.com",
			api_key="ledger-api-key",
		)
		subjects = _entity_subjects(app.state.entities, context)
		self.assertEqual(set(subjects), {"account", "ip"})
		risk = RiskResult(
			20,
			"observe",
			[
				"VPN network",
				"Proxy network",
				"Data center network",
				"Expected browser headers missing",
				"Abnormal request origin",
				"New device observed",
				"Automation browser signature",
				"Known malicious IP",
				"Tor exit node",
			],
		)
		weights = {
			"vpn": 2,
			"proxy": 2,
			"datacenter": 2,
			"missing_headers": 2,
			"abnormal_origin": 2,
			"new_device": 2,
			"automation": 2,
			"malicious_ip": 2,
			"tor": 2,
			"rule_match": 2,
			"deny_list": 2,
		}
		_record_entity_signals(
			app.state.entities,
			context,
			risk,
			[RateHit(73, "Email verification per email", "email", "rate_limit", 60, 60)],
			RuleDecision(matched_rules=[{"id": 71, "name": "Ledger rule"}]),
			subjects,
			weights,
			{"id": 72, "kind": "deny", "subject_type": "ip"},
		)
		self.assertGreater(app.state.entities.process_signal_queue(), 0)
		codes_by_type = {
			subject_type: {
				entry["reasonCode"]
				for entry in app.state.entities.detail(int(subject["id"]))["ledger"]
			}
			for subject_type, subject in subjects.items()
		}
		self.assertTrue(
			{"VPN_NETWORK", "PROXY_NETWORK", "DATACENTER_NETWORK", "MISSING_BROWSER_HEADERS", "ABNORMAL_ORIGIN", "AUTOMATION_SIGNATURE", "THREAT_INTELLIGENCE", "TOR_NETWORK", "DENY_LIST_MATCH", "RULE_MATCH"}.issubset(codes_by_type["ip"])
		)
		self.assertTrue(
			{"NEW_DEVICE", "MISSING_BROWSER_HEADERS", "ABNORMAL_ORIGIN", "AUTOMATION_SIGNATURE", "RATE_LIMIT_EXCEEDED"}.issubset(codes_by_type["account"])
		)
		evidence_types = {
			row["evidence_type"]
			for row in app.state.database.query(
				"SELECT evidence_type FROM risk_evidence WHERE root_subject_id = ?",
				(subjects["account"]["id"],),
			)
		}
		self.assertTrue({"session", "device", "cidr", "asn", "email", "email_domain", "api_key", "country", "region"}.issubset(evidence_types))

	def test_simplified_console_updates_factor_versions_and_site_protection(self):
		headers = {"Cookie": "sf_bot_session=valid-admin", "X-CSRF-Token": "admin-csrf"}
		factor_response = self.client.get("/__shield/api/admin/risk-factors", headers=headers)
		self.assertEqual(factor_response.status_code, 200)
		factor_payload = factor_response.json()
		weights = {item["key"]: item["weight"] for item in factor_payload["factors"]}
		self.assertIn("no_2fa", weights)
		original = dict(weights)
		weights["no_2fa"] = 11
		published = self.client.put(
			"/__shield/api/admin/risk-factors",
			headers=headers,
			json={"weights": weights, "reason": "Integration factor change"},
		)
		self.assertEqual(published.status_code, 200)
		self.assertGreater(published.json()["currentVersion"], factor_payload["currentVersion"])
		audit = app.state.database.query(
			"SELECT action FROM audit_log WHERE action = 'risk_factors.update' ORDER BY id DESC LIMIT 1"
		)
		self.assertEqual(audit[0]["action"], "risk_factors.update")
		self.client.put(
			"/__shield/api/admin/risk-factors",
			headers=headers,
			json={"weights": original, "reason": "Restore integration factor values"},
		)

		sites = self.client.get("/__shield/api/admin/sites", headers=headers)
		self.assertEqual(sites.status_code, 200)
		self.assertEqual(len(sites.json()["sites"]), 5)
		original_site = app.state.database.query(
			"SELECT protection_enabled, mode FROM service_controls WHERE host = 'api.silentflare.com'"
		)[0]
		app.state.database.execute("UPDATE rate_policies SET action = 'log' WHERE action = 'turnstile'")
		try:
			enabled = self.client.put(
				"/__shield/api/admin/sites/api.silentflare.com",
				headers=headers,
				json={"enabled": True, "reason": "Integration site enable"},
			)
			self.assertEqual(enabled.status_code, 200)
			control = app.state.database.query(
				"SELECT protection_enabled, mode FROM service_controls WHERE host = 'api.silentflare.com'"
			)[0]
			self.assertEqual(control, {"protection_enabled": 1, "mode": "enforce"})
		finally:
			app.state.database.execute("UPDATE rate_policies SET action = 'turnstile' WHERE name = 'Login per IP'")
			app.state.database.execute(
				"UPDATE service_controls SET protection_enabled = ?, mode = ? WHERE host = 'api.silentflare.com'",
				(original_site["protection_enabled"], original_site["mode"]),
			)

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

	def test_split_gateway_handles_trusted_api_cors_before_risk_scoring(self):
		from app.gateway.app import app as gateway_app

		with TestClient(gateway_app) as gateway_client:
			response = gateway_client.options(
				"/auth/session",
				headers={
					"Host": "api.silentflare.com",
					"Origin": "https://blog.silentflare.com",
					"Access-Control-Request-Method": "GET",
					"Access-Control-Request-Headers": "content-type",
				},
			)
			self.assertEqual(response.status_code, 200)
			self.assertEqual(
				response.headers["access-control-allow-origin"],
				"https://blog.silentflare.com",
			)
			self.assertEqual(response.headers["access-control-allow-credentials"], "true")

	def test_public_api_reads_do_not_enforce_accumulated_subject_risk(self):
		request_risk = RiskResult(0, "normal", [])
		combined_risk = RiskResult(50, "verify", ["Existing subject risk score"])
		for path in ("/auth/session", "/comments", "/site/settings"):
			context = RequestContext(
				request_id="public-read-risk",
				host="api.silentflare.com",
				path=path,
				method="GET",
				ip="203.0.113.80",
			)
			self.assertIs(_enforcement_risk(context, request_risk, combined_risk), request_risk)

		mutation = RequestContext(
			request_id="comment-mutation-risk",
			host="api.silentflare.com",
			path="/comments/create",
			method="POST",
			ip="203.0.113.80",
		)
		self.assertIs(_enforcement_risk(mutation, request_risk, combined_risk), combined_risk)

	def test_automatic_account_policy_bans_account_root_once(self):
		context = RequestContext(
			request_id="automatic-ban-test",
			host="api.silentflare.com",
			path="/comments",
			method="POST",
			ip="203.0.113.22",
			account_id="account-ban-test",
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
		self.assertEqual(rows[0]["subject_type"], "account")
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
		self.assertEqual(active[0]["subject_display"], "203.0.113.88")
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

	def test_proxy_preserves_duplicate_cookies_and_replaces_upstream_shield_headers(self):
		response = self.client.get("/cookies", headers={"Host": "blog.silentflare.com"})
		self.assertEqual(response.status_code, 200)
		self.assertEqual(
			response.headers.get_list("set-cookie"),
			["first=one; Path=/; HttpOnly", "second=two; Path=/; Secure"],
		)
		self.assertNotEqual(response.headers["x-sf-shield-request-id"], "spoofed-upstream-id")

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
