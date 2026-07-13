from __future__ import annotations

import fnmatch
import time
from dataclasses import dataclass
from typing import Any

from .database import Database, stable_hash
from .rules import RequestContext


@dataclass
class RateHit:
	policy_id: int
	policy_name: str
	dimension: str
	action: str
	retry_after: int
	cooldown_seconds: int


class RateLimiter:
	def __init__(self, database: Database, hash_key: str):
		self.database = database
		self.hash_key = hash_key

	def _identity(self, policy: dict[str, Any], context: RequestContext) -> str:
		dimension = policy["dimension"]
		values = {
			"ip": context.ip,
			"account": context.account_id or context.session_id or context.ip,
			"session": context.session_id or context.ip,
			"device": context.device_id or context.ip,
			"email": context.email.lower() or context.ip,
			"country": context.country or "unknown",
			"asn": context.asn or "unknown",
			"host": context.host,
			"path": context.path,
			"method": context.method,
		}
		return stable_hash(values.get(dimension, context.ip), self.hash_key)

	def _matches(self, policy: dict[str, Any], context: RequestContext) -> bool:
		return (
			(not policy["host"] or policy["host"].lower() == context.host)
			and fnmatch.fnmatch(context.path, policy["path_pattern"])
			and (not policy["method"] or policy["method"].upper() == context.method)
		)

	def _consume(self, policy: dict[str, Any], identity_hash: str, now: int) -> tuple[bool, int]:
		limit_value = int(policy["limit_value"])
		window = int(policy["window_seconds"])
		algorithm = policy["algorithm"]

		def operation(connection):
			if algorithm == "token_bucket":
				row = connection.execute(
					"SELECT * FROM rate_counters WHERE policy_id = ? AND identity_hash = ? AND window_start = 0",
					(policy["id"], identity_hash),
				).fetchone()
				capacity = limit_value + int(policy["burst"])
				tokens = float(row["tokens"]) if row else float(capacity)
				updated_at = int(row["updated_at"]) if row else now
				tokens = min(capacity, tokens + max(0, now - updated_at) * (limit_value / window))
				allowed = tokens >= 1
				tokens = tokens - 1 if allowed else tokens
				connection.execute(
					"""INSERT INTO rate_counters(policy_id, identity_hash, window_start, count, tokens, updated_at)
					VALUES (?, ?, 0, 1, ?, ?) ON CONFLICT(policy_id, identity_hash, window_start)
					DO UPDATE SET count=count+1, tokens=excluded.tokens, updated_at=excluded.updated_at""",
					(policy["id"], identity_hash, tokens, now),
				)
				retry = max(1, int((1 - tokens) / (limit_value / window))) if not allowed else 0
				return allowed, retry

			window_start = now - (now % window)
			row = connection.execute(
				"SELECT count FROM rate_counters WHERE policy_id = ? AND identity_hash = ? AND window_start = ?",
				(policy["id"], identity_hash, window_start),
			).fetchone()
			count = int(row["count"]) if row else 0
			if algorithm == "sliding_window":
				previous = connection.execute(
					"SELECT count FROM rate_counters WHERE policy_id = ? AND identity_hash = ? AND window_start = ?",
					(policy["id"], identity_hash, window_start - window),
				).fetchone()
				weight = 1 - ((now - window_start) / window)
				effective = count + (int(previous["count"]) if previous else 0) * weight
			else:
				effective = count
			connection.execute(
				"""INSERT INTO rate_counters(policy_id, identity_hash, window_start, count, updated_at)
				VALUES (?, ?, ?, 1, ?) ON CONFLICT(policy_id, identity_hash, window_start)
				DO UPDATE SET count=count+1, updated_at=excluded.updated_at""",
				(policy["id"], identity_hash, window_start, now),
			)
			return effective < limit_value, max(1, window - (now - window_start))

		return self.database.transaction(operation)

	def check(self, context: RequestContext, response_status: int | None = None) -> list[RateHit]:
		now = int(time.time())
		hits: list[RateHit] = []
		policies = self.database.query("SELECT * FROM rate_policies WHERE enabled = 1")
		for policy in policies:
			status_code = policy.get("status_code")
			if response_status is None and status_code is not None:
				continue
			if response_status is not None and status_code != response_status:
				continue
			if not self._matches(policy, context):
				continue
			allowed, retry_after = self._consume(policy, self._identity(policy, context), now)
			if not allowed:
				hits.append(RateHit(policy["id"], policy["name"], policy["dimension"], policy["action"], retry_after, int(policy["cooldown_seconds"] or 0)))
		return hits
