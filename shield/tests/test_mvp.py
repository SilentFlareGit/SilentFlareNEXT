from __future__ import annotations

import asyncio
import sqlite3
import tempfile
import time
import unittest
from pathlib import Path

import httpx

from app.blocking import ban_error_code, ban_subject_display, normalize_ban_subject
from app.database import Database
from app.entity_risk import EntityRiskService
from app.geo import GeoService, IpIntel
from app.rate_limit import RateLimiter
from app.risk import score_request
from app.rules import AccessListService, RequestContext, matches_expression
from app.security import sign_headers, verify_headers


ROOT = Path(__file__).resolve().parents[1]
KEY = "test-signing-key-that-is-longer-than-thirty-two-characters"


class ShieldMvpTests(unittest.TestCase):
	def setUp(self):
		self.temporary = tempfile.TemporaryDirectory()
		self.database = Database(Path(self.temporary.name) / "shield.db", ROOT / "migrations")
		self.database.migrate()

	def tearDown(self):
		self.temporary.cleanup()

	def test_signed_headers_are_bound_to_method_path_and_timestamp(self):
		headers = {
			"x-sf-shield-request-id": "request-1",
			"x-sf-shield-risk-score": "42",
			"x-sf-shield-risk-level": "verify",
			"x-sf-shield-country": "TW",
			"x-sf-shield-asn": "AS123",
			"x-sf-shield-ip-type": "residential",
			"x-sf-shield-device-id": "device-1",
			"x-sf-shield-action": "turnstile",
			"x-sf-shield-timestamp": str(int(time.time())),
		}
		headers["x-sf-shield-signature"] = sign_headers(headers, "POST", "/auth/login/password", KEY)
		self.assertTrue(verify_headers(headers, "POST", "/auth/login/password", KEY))
		self.assertFalse(verify_headers(headers, "GET", "/auth/login/password", KEY))

	def test_cidr_deny_list_matches_ipv4(self):
		self.database.execute(
			"INSERT INTO access_lists(kind, subject_type, subject_value, note, created_by, created_at) VALUES ('deny', 'cidr', '203.0.113.0/24', '', 'test', ?)",
			(int(time.time()),),
		)
		context = RequestContext("request", "api.silentflare.com", "/", "GET", "203.0.113.8")
		status, row = AccessListService(self.database, KEY).match(context)
		self.assertEqual(status, "deny")
		self.assertEqual(row["subject_type"], "cidr")

	def test_ban_error_codes_distinguish_subject_and_duration(self):
		self.assertEqual(
			ban_error_code({"subject_type": "country", "expires_at": None}),
			"SF-BAN-P130",
		)
		self.assertEqual(
			ban_error_code({"subject_type": "device", "expires_at": int(time.time()) + 60}),
			"SF-BAN-T220",
		)
		self.assertEqual(normalize_ban_subject("asn", "64512"), "AS64512")
		self.assertEqual(normalize_ban_subject("cidr", "203.0.113.9/24"), "203.0.113.0/24")
		self.assertEqual(ban_subject_display("ip", "203.0.113.9"), "203.0.113.9")
		self.assertEqual(ban_subject_display("ip", "2001:db8::9"), "2001:db8::9")
		self.assertEqual(ban_subject_display("cidr", "203.0.113.0/24"), "203.0.113.0/24")

	def test_cidr_ban_matches_address_without_storing_each_ip(self):
		now = int(time.time())
		self.database.execute(
			"""INSERT INTO bans(public_id, subject_type, subject_hash, subject_display, restriction,
			reason, created_by, created_at) VALUES ('SFB-ABCDEF0123456789', 'cidr', 'not-used-for-range',
			'203.0.113.0/24', 'all', 'Network restriction', 'test', ?)""",
			(now,),
		)
		context = RequestContext("request", "blog.silentflare.com", "/", "GET", "203.0.113.44")
		ban = AccessListService(self.database, KEY).active_ban(context)
		self.assertIsNotNone(ban)
		self.assertEqual(ban["public_id"], "SFB-ABCDEF0123456789")

	def test_risk_score_combines_network_and_automation_signals(self):
		intel = IpIntel("203.0.113.8", ip_type="datacenter", is_vpn=True, is_proxy=True)
		result = score_request(intel, {"user-agent": "Playwright Headless", "accept": "*/*"}, {})
		self.assertGreaterEqual(result.score, 60)
		self.assertEqual(result.level, "restrict")

	def test_geo_intel_requires_source_agreement_for_high_confidence(self):
		service = GeoService(
			self.database,
			KEY,
			"https://geo.test/{ip}",
			"https://routing.test/{ip}",
			3600,
			False,
		)
		cloudflare = IpIntel(
			"8.8.8.8",
			country_code="US",
			region="California",
			region_code="CA",
		)
		provider = IpIntel(
			"8.8.8.8",
			country_code="US",
			region="California",
			asn="AS15169",
			country_source="ipwho",
			region_source="ipwho",
			asn_source="ipwho",
		)
		intel = service._merge("8.8.8.8", cloudflare, provider, ["AS15169"], "8.8.8.0/24")
		self.assertEqual(intel.country_confidence, "high")
		self.assertEqual(intel.region_confidence, "high")
		self.assertEqual(intel.asn_confidence, "high")
		self.assertEqual(intel.network_prefix, "8.8.8.0/24")
		self.assertEqual(intel.conflict_fields, [])

	def test_geo_intel_exposes_conflicts_and_prefers_routing_asn(self):
		service = GeoService(
			self.database,
			KEY,
			"https://geo.test/{ip}",
			"https://routing.test/{ip}",
			3600,
			False,
		)
		cloudflare = IpIntel("8.8.8.8", country_code="US", region="California")
		provider = IpIntel("8.8.8.8", country_code="CA", region="Ontario", asn="AS64500")
		intel = service._merge("8.8.8.8", cloudflare, provider, ["AS15169"], "8.8.8.0/24")
		self.assertEqual(intel.country_code, "US")
		self.assertEqual(intel.asn, "AS15169")
		self.assertEqual(intel.country_confidence, "medium")
		self.assertCountEqual(intel.conflict_fields, ["country", "region", "asn"])

	def test_geo_provider_persists_valid_map_coordinates(self):
		service = GeoService(
			self.database,
			KEY,
			"https://geo.test/{ip}",
			"https://routing.test/{ip}",
			3600,
			False,
		)

		async def lookup():
			def provider(_request: httpx.Request) -> httpx.Response:
				return httpx.Response(
					200,
					json={
						"success": True,
						"country_code": "US",
						"region": "California",
						"city": "Mountain View",
						"latitude": 37.386,
						"longitude": -122.0838,
						"connection": {"asn": 15169},
					},
				)

			async with httpx.AsyncClient(transport=httpx.MockTransport(provider)) as client:
				return await service._provider(client, "8.8.8.8")

		intel, raw = asyncio.run(lookup())
		self.assertIsNotNone(intel)
		assert intel is not None
		self.assertEqual((intel.latitude, intel.longitude), (37.386, -122.0838))
		service._store(intel, raw)
		cached = service._cached("8.8.8.8")
		self.assertIsNotNone(cached)
		assert cached is not None
		self.assertEqual((cached.latitude, cached.longitude), (37.386, -122.0838))

	def test_risk_thresholds_are_configurable(self):
		intel = IpIntel("203.0.113.8", is_proxy=True)
		result = score_request(intel, {"user-agent": "Browser", "accept": "*/*"}, {}, {"observe": 5, "verify": 15, "restrict": 30, "block": 50})
		self.assertEqual(result.score, 20)
		self.assertEqual(result.level, "verify")

	def test_nested_rule_expression(self):
		context = RequestContext("request", "api.silentflare.com", "/v1/items", "POST", "203.0.113.8", country="TW", risk_score=65)
		expression = {"all": [{"field": "host", "op": "eq", "value": "api.silentflare.com"}, {"any": [{"field": "country", "op": "eq", "value": "TW"}, {"field": "risk_score", "op": "gte", "value": 80}]}]}
		self.assertTrue(matches_expression(expression, context))

	def test_default_login_rate_policy_blocks_eleventh_request(self):
		limiter = RateLimiter(self.database, KEY)
		context = RequestContext("request", "api.silentflare.com", "/auth/login/password", "POST", "203.0.113.8")
		for _ in range(10):
			self.assertEqual(limiter.check(context), [])
		hits = limiter.check(context)
		self.assertEqual(len(hits), 1)
		self.assertEqual(hits[0].policy_name, "Login per IP")

	def test_account_subdomain_registration_prefix_is_rate_limited(self):
		limiter = RateLimiter(self.database, KEY)
		context = RequestContext("request", "accounts.silentflare.com", "/accounts-api/accounts/register/complete", "POST", "203.0.113.8")
		for _ in range(3):
			self.assertEqual(limiter.check(context), [])
		hits = limiter.check(context)
		self.assertEqual(hits[0].policy_name, "Registration per IP")
		self.assertEqual(hits[0].action, "temporary_ban")

	def test_404_scanner_policy_only_counts_404_responses(self):
		limiter = RateLimiter(self.database, KEY)
		context = RequestContext("request", "blog.silentflare.com", "/missing", "GET", "203.0.113.8")
		for _ in range(40):
			self.assertEqual(limiter.check(context), [])
		for _ in range(30):
			self.assertEqual(limiter.check(context, response_status=404), [])
		hits = limiter.check(context, response_status=404)
		self.assertEqual(hits[0].policy_name, "404 scanner per IP")

	def test_audit_log_is_append_only(self):
		self.database.audit("owner", "mode.change", "system", "global", {"mode": "observe"})
		with self.assertRaises(sqlite3.DatabaseError):
			self.database.execute("DELETE FROM audit_log")

	def test_entity_risk_ledger_records_adjustment_and_automatic_decay(self):
		service = EntityRiskService(self.database, KEY)
		subject = service.ensure_subject("asn", "AS64512")
		entry = service.adjust(
			int(subject["id"]),
			20,
			reason_code="ASN_ATTACK_CLUSTER",
			reason="Multiple hostile sources",
			source="test",
			actor="shield",
			duration_seconds=3600,
			decay_steps=2,
		)
		self.assertEqual(entry["score_after"], 20)
		processed = service.run_due_decay(int(time.time()) + 1801)
		self.assertEqual(processed, 1)
		detail = service.detail(int(subject["id"]))
		self.assertEqual(detail["currentScore"], 10)
		self.assertEqual(detail["ledger"][0]["reasonCode"], "AUTO_DECAY")
		self.assertEqual(detail["ledger"][0]["scoreBefore"], 20)
		self.assertEqual(detail["ledger"][0]["scoreAfter"], 10)

	def test_manual_entity_exemption_caps_effective_score_and_is_audited(self):
		service = EntityRiskService(self.database, KEY)
		subject = service.ensure_subject("ip", "203.0.113.20")
		service.adjust(
			int(subject["id"]),
			80,
			reason_code="THREAT_INTELLIGENCE",
			reason="Test threat signal",
			source="test",
			actor="shield",
		)
		override = service.add_override(
			int(subject["id"]),
			override_type="score_cap",
			value=30,
			reason="Verified trusted source",
			actor="owner",
			duration_seconds=3600,
		)
		updated = service.subject_by_public_id(int(subject["id"]))
		self.assertEqual(service.effective_score(updated), 30)
		service.revoke_override(int(override["id"]), "owner", "Trust window ended")
		self.assertEqual(service.effective_score(updated), 80)

	def test_effective_score_controls_record_apply_revoke_and_expiry(self):
		service = EntityRiskService(self.database, KEY)
		subject = service.ensure_subject("ip", "203.0.113.45")
		service.adjust(
			int(subject["id"]),
			80,
			reason_code="TEST_BASELINE",
			reason="Establish test score",
			source="test",
			actor="test",
		)
		cap = service.add_override(
			int(subject["id"]),
			override_type="score_cap",
			value=25,
			reason="Verified temporary source",
			actor="owner",
			duration_seconds=60,
		)
		detail = service.detail(int(subject["id"]))
		self.assertEqual(detail["ledger"][0]["scoreKind"], "effective")
		self.assertEqual(detail["ledger"][0]["reasonCode"], "SCORE_CAP_APPLIED")
		self.assertEqual((detail["ledger"][0]["scoreBefore"], detail["ledger"][0]["scoreAfter"]), (80, 25))
		service.revoke_override(int(cap["id"]), "owner", "Temporary trust ended")
		detail = service.detail(int(subject["id"]))
		self.assertEqual(detail["ledger"][0]["reasonCode"], "SCORE_CAP_REVOKED")
		self.assertEqual((detail["ledger"][0]["scoreBefore"], detail["ledger"][0]["scoreAfter"]), (25, 80))

		expiring = service.add_override(
			int(subject["id"]),
			override_type="score_cap",
			value=30,
			reason="Short verification window",
			actor="owner",
			duration_seconds=60,
		)
		self.assertEqual(service.expire_due_overrides(int(expiring["expires_at"]) + 1), 1)
		detail = service.detail(int(subject["id"]))
		self.assertEqual(detail["ledger"][0]["reasonCode"], "SCORE_CAP_EXPIRED")
		self.assertEqual((detail["ledger"][0]["scoreBefore"], detail["ledger"][0]["scoreAfter"]), (30, 80))

	def test_exact_score_and_permanent_allowlist_keep_score_at_zero(self):
		service = EntityRiskService(self.database, KEY)
		subject = service.ensure_subject("ip", "203.0.113.46")
		subject_id = int(subject["id"])

		service.set_score(subject_id, 47, reason="Custom review score", actor="owner")
		self.assertEqual(service.detail(subject_id)["currentScore"], 47)
		service.set_score(subject_id, 100, reason="Escalate confirmed threat", actor="owner")
		self.assertEqual(service.detail(subject_id)["currentScore"], 100)
		service.set_score(subject_id, 0, reason="Clear false positive", actor="owner")
		self.assertEqual(service.detail(subject_id)["currentScore"], 0)

		service.set_score(subject_id, 65, reason="Prepare allowlist test", actor="owner")
		allowlist = service.add_override(
			subject_id,
			override_type="score_cap",
			value=0,
			reason="Permanently trusted service",
			actor="owner",
			duration_seconds=None,
		)
		detail = service.detail(subject_id)
		self.assertEqual((detail["currentScore"], detail["effectiveScore"]), (0, 0))
		self.assertTrue(service.is_permanently_allowlisted(subject_id))
		self.assertIsNone(allowlist["expires_at"])

		service.set_score(subject_id, 100, reason="Attempted escalation", actor="owner")
		service.adjust(
			subject_id,
			50,
			reason_code="TEST_SIGNAL",
			reason="Risk signal while allowlisted",
			source="test",
			actor="shield",
		)
		detail = service.detail(subject_id)
		self.assertEqual((detail["currentScore"], detail["effectiveScore"]), (0, 0))

		service.revoke_override(int(allowlist["id"]), "owner", "Permanent trust revoked")
		self.assertEqual(service.detail(subject_id)["effectiveScore"], 65)
		service.set_score(subject_id, 100, reason="Escalation after revocation", actor="owner")
		self.assertEqual(service.detail(subject_id)["effectiveScore"], 100)

	def test_gateway_signal_queue_is_applied_idempotently_by_worker(self):
		service = EntityRiskService(self.database, KEY)
		subject = service.ensure_subject("device", "device-reference")
		for _ in range(2):
			service.enqueue_signal(
				int(subject["id"]),
				delta=18,
				reason_code="AUTOMATION_SIGNATURE",
				reason="Automation browser signature",
				source_ref="request-1",
				duration_seconds=43200,
				decay_steps=4,
			)
		self.assertEqual(service.process_signal_queue(), 1)
		self.assertEqual(service.process_signal_queue(), 0)
		self.assertEqual(service.detail(int(subject["id"]))["currentScore"], 18)

	def test_complete_ledger_is_available_through_cursor_pages(self):
		service = EntityRiskService(self.database, KEY)
		subject = service.ensure_subject("session", "ledger-pagination-session")
		for index in range(205):
			service.adjust(
				int(subject["id"]),
				1 if index % 2 == 0 else -1,
				reason_code="PAGINATED_CHANGE",
				reason=f"Score change {index}",
				source="test",
				actor="test",
			)
		detail = service.detail(int(subject["id"]))
		self.assertEqual(detail["ledgerTotal"], 205)
		self.assertEqual(len(detail["ledger"]), 100)
		self.assertTrue(detail["ledgerHasMore"])
		second = service.ledger_page(
			int(subject["id"]),
			before=detail["ledgerNextCursor"],
			limit=100,
		)
		self.assertEqual(len(second["items"]), 100)
		self.assertTrue(second["hasMore"])
		third = service.ledger_page(
			int(subject["id"]),
			before=second["nextCursor"],
			limit=100,
		)
		self.assertEqual(len(third["items"]), 5)
		self.assertFalse(third["hasMore"])

	def test_account_baseline_records_each_factor_increase_and_resolution(self):
		service = EntityRiskService(self.database, KEY)
		service.set_baseline(
			"account",
			"factor-ledger-account",
			display="factor-ledger-account",
			baseline=65,
			reasons=["Two-factor authentication is not enabled", "Account is disabled"],
			source_ref="posture:first",
			factors={
				"no_2fa": (5, "Two-factor authentication is not enabled"),
				"disabled_account": (60, "Account is disabled"),
			},
		)
		subject = service.ensure_subject("account", "factor-ledger-account")
		detail = service.detail(int(subject["id"]))
		self.assertEqual(detail["currentScore"], 65)
		self.assertEqual(
			{entry["reasonCode"] for entry in detail["ledger"]},
			{"ACCOUNT_NO_2FA", "ACCOUNT_DISABLED_ACCOUNT"},
		)
		service.set_baseline(
			"account",
			"factor-ledger-account",
			display="factor-ledger-account",
			baseline=60,
			reasons=["Account is disabled"],
			source_ref="posture:second",
			factors={"disabled_account": (60, "Account is disabled")},
		)
		detail = service.detail(int(subject["id"]))
		self.assertEqual(detail["currentScore"], 60)
		self.assertEqual(detail["ledger"][0]["reasonCode"], "ACCOUNT_NO_2FA")
		self.assertEqual(detail["ledger"][0]["delta"], -5)
		self.assertTrue(detail["ledger"][0]["reason"].startswith("Resolved:"))


if __name__ == "__main__":
	unittest.main()
