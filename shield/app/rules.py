from __future__ import annotations

import fnmatch
import ipaddress
import json
import time
from dataclasses import dataclass, field
from typing import Any

from .blocking import normalize_ban_subject
from .database import Database, stable_hash


@dataclass
class RequestContext:
	request_id: str
	host: str
	path: str
	method: str
	ip: str
	country: str = ""
	region: str = ""
	region_code: str = ""
	asn: str = ""
	ip_type: str = "unknown"
	account_id: str = ""
	session_id: str = ""
	device_id: str = ""
	email: str = ""
	api_key: str = ""
	user_agent: str = ""
	risk_score: int = 0
	rate_exceeded: bool = False
	extra: dict[str, Any] = field(default_factory=dict)

	def value(self, name: str) -> Any:
		mapping = {
			"host": self.host,
			"path": self.path,
			"method": self.method,
			"ip": self.ip,
			"country": self.country,
			"region": self.region,
			"region_code": self.region_code,
			"asn": self.asn,
			"ip_type": self.ip_type,
			"account_id": self.account_id,
			"session_id": self.session_id,
			"device_id": self.device_id,
			"email": self.email,
			"api_key": self.api_key,
			"user_agent": self.user_agent,
			"risk_score": self.risk_score,
			"rate_exceeded": self.rate_exceeded,
		}
		return mapping.get(name, self.extra.get(name))


@dataclass
class RuleDecision:
	actions: list[str] = field(default_factory=list)
	matched_rules: list[dict[str, Any]] = field(default_factory=list)


def _compare(actual: Any, operator: str, expected: Any) -> bool:
	if operator == "eq":
		return str(actual).lower() == str(expected).lower()
	if operator == "neq":
		return str(actual).lower() != str(expected).lower()
	if operator == "in":
		return str(actual).lower() in {str(value).lower() for value in expected}
	if operator == "not_in":
		return str(actual).lower() not in {str(value).lower() for value in expected}
	if operator == "contains":
		return str(expected).lower() in str(actual).lower()
	if operator == "glob":
		return fnmatch.fnmatch(str(actual).lower(), str(expected).lower())
	if operator == "gte":
		return float(actual or 0) >= float(expected)
	if operator == "lte":
		return float(actual or 0) <= float(expected)
	if operator == "exists":
		return bool(actual) is bool(expected)
	raise ValueError(f"Unsupported rule operator: {operator}")


def matches_expression(expression: dict[str, Any], context: RequestContext) -> bool:
	if "all" in expression:
		return all(matches_expression(item, context) for item in expression["all"])
	if "any" in expression:
		return any(matches_expression(item, context) for item in expression["any"])
	return _compare(context.value(str(expression["field"])), str(expression.get("op", "eq")), expression.get("value"))


class RuleEngine:
	def __init__(self, database: Database):
		self.database = database
		self._last_good_rules: list[dict[str, Any]] = []
		self._loaded_at = 0.0

	def rules(self) -> list[dict[str, Any]]:
		if time.monotonic() - self._loaded_at < 5 and self._last_good_rules:
			return self._last_good_rules
		try:
			rules = self.database.query("SELECT * FROM rules WHERE enabled = 1 ORDER BY priority ASC, id ASC")
			for rule in rules:
				rule["conditions"] = json.loads(rule.pop("conditions_json"))
				rule["actions"] = json.loads(rule.pop("actions_json"))
			self._last_good_rules = rules
			self._loaded_at = time.monotonic()
			return rules
		except (ValueError, json.JSONDecodeError):
			return self._last_good_rules

	def evaluate(self, context: RequestContext, global_mode: str) -> RuleDecision:
		decision = RuleDecision()
		for rule in self.rules():
			try:
				matched = matches_expression(rule["conditions"], context)
			except (KeyError, TypeError, ValueError):
				continue
			if not matched:
				continue
			self.database.execute("UPDATE rules SET hit_count = hit_count + 1 WHERE id = ?", (rule["id"],))
			decision.matched_rules.append({"id": rule["id"], "name": rule["name"], "version": rule["version"]})
			actions = [str(action) for action in rule["actions"]]
			if global_mode == "observe" or rule["mode"] == "observe":
				actions = ["log"]
			for action in actions:
				if action not in decision.actions:
					decision.actions.append(action)
			if "allow" in actions:
				break
		return decision


class AccessListService:
	def __init__(self, database: Database, hash_key: str):
		self.database = database
		self.hash_key = hash_key

	def match(self, context: RequestContext) -> tuple[str | None, dict[str, Any] | None]:
		now = int(time.time())
		rows = self.database.query(
			"""
			SELECT * FROM access_lists
			WHERE disabled_at IS NULL AND (expires_at IS NULL OR expires_at > ?)
			ORDER BY CASE kind WHEN 'allow' THEN 0 ELSE 1 END, id DESC
			""",
			(now,),
		)
		for row in rows:
			if row["scope_host"] and row["scope_host"].lower() != context.host:
				continue
			if row["scope_path"] and not fnmatch.fnmatch(context.path, row["scope_path"]):
				continue
			if row["scope_method"] and row["scope_method"].upper() != context.method:
				continue
			type_name, value = row["subject_type"], row["subject_value"]
			matched = False
			try:
				if type_name == "ip":
					matched = ipaddress.ip_address(context.ip) == ipaddress.ip_address(value)
				elif type_name == "cidr":
					matched = ipaddress.ip_address(context.ip) in ipaddress.ip_network(value, strict=False)
				elif type_name == "asn":
					matched = context.asn.lower().removeprefix("as") == value.lower().removeprefix("as")
				elif type_name == "country":
					matched = context.country.lower() == value.lower()
				elif type_name == "region":
					matched = context.region.lower() == value.lower()
				elif type_name == "account":
					matched = bool(context.account_id) and stable_hash(context.account_id, self.hash_key) == value
			except ValueError:
				matched = False
			if matched:
				return row["kind"], row
		return None, None

	def active_ban(self, context: RequestContext) -> dict[str, Any] | None:
		now = int(time.time())
		email_domain = context.email.rsplit("@", 1)[-1] if "@" in context.email else ""
		identities = (
			("account", context.account_id),
			("session", context.session_id),
			("device", context.device_id),
			("email", context.email),
			("api_key", context.api_key),
			("ip", context.ip),
			("asn", context.asn),
			("region", context.region),
			("country", context.country),
			("email_domain", email_domain),
		)

		def applies(row: dict[str, Any]) -> bool:
			restriction = row["restriction"]
			return (
				restriction == "all"
				or (restriction == "login" and (context.path.startswith("/auth/login/") or context.host == "admin.silentflare.com"))
				or (restriction == "register" and context.path.startswith("/accounts/register/"))
				or (restriction == "comment" and context.path.startswith("/comments"))
				or (restriction == "api" and context.host == "api.silentflare.com")
				or (restriction == "read_only" and context.method not in {"GET", "HEAD", "OPTIONS"})
				or (restriction == "review" and context.method not in {"GET", "HEAD", "OPTIONS"})
			)

		for subject_type, value in identities:
			if not value:
				continue
			try:
				normalized = normalize_ban_subject(subject_type, value)
			except ValueError:
				continue
			rows = self.database.query(
				"""SELECT * FROM bans WHERE subject_type = ? AND subject_hash = ? AND revoked_at IS NULL
				AND (expires_at IS NULL OR expires_at > ?) ORDER BY id DESC LIMIT 1""",
				(subject_type, stable_hash(normalized, self.hash_key), now),
			)
			for row in rows:
				if applies(row):
					return row

		try:
			address = ipaddress.ip_address(context.ip)
		except ValueError:
			return None
		rows = self.database.query(
			"""SELECT * FROM bans WHERE subject_type = 'cidr' AND revoked_at IS NULL
			AND (expires_at IS NULL OR expires_at > ?) ORDER BY id DESC""",
			(now,),
		)
		for row in rows:
			try:
				matched = address in ipaddress.ip_network(row["subject_display"], strict=False)
			except ValueError:
				continue
			if matched and applies(row):
				return row
		return None
