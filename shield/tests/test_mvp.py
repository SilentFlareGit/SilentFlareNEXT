from __future__ import annotations

import base64
import hashlib
import hmac
import sqlite3
import struct
import tempfile
import time
import unittest
from pathlib import Path

from app.database import Database
from app.geo import IpIntel
from app.rate_limit import RateLimiter
from app.risk import score_request
from app.rules import AccessListService, RequestContext, matches_expression
from app.security import sign_headers, verify_headers, verify_totp


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

	def test_totp_verification(self):
		secret_bytes = b"12345678901234567890"
		secret = base64.b32encode(secret_bytes).decode()
		now = 1_234_567_890
		counter = now // 30
		digest = hmac.new(secret_bytes, struct.pack(">Q", counter), hashlib.sha1).digest()
		offset = digest[-1] & 15
		code = f"{(struct.unpack('>I', digest[offset:offset + 4])[0] & 0x7fffffff) % 1000000:06d}"
		self.assertTrue(verify_totp(secret, code, now=now, window=0))

	def test_cidr_deny_list_matches_ipv4(self):
		self.database.execute(
			"INSERT INTO access_lists(kind, subject_type, subject_value, note, created_by, created_at) VALUES ('deny', 'cidr', '203.0.113.0/24', '', 'test', ?)",
			(int(time.time()),),
		)
		context = RequestContext("request", "api.silentflare.com", "/", "GET", "203.0.113.8")
		status, row = AccessListService(self.database, KEY).match(context)
		self.assertEqual(status, "deny")
		self.assertEqual(row["subject_type"], "cidr")

	def test_risk_score_combines_network_and_automation_signals(self):
		intel = IpIntel("203.0.113.8", ip_type="datacenter", is_vpn=True, is_proxy=True)
		result = score_request(intel, {"user-agent": "Playwright Headless", "accept": "*/*"}, {})
		self.assertGreaterEqual(result.score, 60)
		self.assertEqual(result.level, "restrict")

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


if __name__ == "__main__":
	unittest.main()
