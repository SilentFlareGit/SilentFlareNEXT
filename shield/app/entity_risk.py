from __future__ import annotations

import json
import math
import sqlite3
import time
import uuid
from typing import Any

from .blocking import ban_subject_display, normalize_ban_subject
from .database import Database, stable_hash


SUBJECT_TYPE_CATALOG = (
	("account", "Accounts"),
	("ip", "IP addresses"),
)
ROOT_SUBJECT_TYPES = {key for key, _label in SUBJECT_TYPE_CATALOG}
SUBJECT_TYPES = ROOT_SUBJECT_TYPES | {
	"session", "device", "cidr", "asn", "email", "email_domain", "api_key", "country", "region",
}


def entity_level(score: int) -> str:
	if score < 30:
		return "normal"
	if score < 50:
		return "observe"
	if score < 65:
		return "verify"
	if score < 80:
		return "restrict"
	return "block"


class EntityRiskService:
	def __init__(self, database: Database, hash_key: str):
		self.database = database
		self.hash_key = hash_key

	def _normalized(self, subject_type: str, value: str) -> str:
		if subject_type not in SUBJECT_TYPES:
			raise ValueError("Unsupported risk subject type")
		if subject_type in {"ip", "cidr", "asn", "country", "region", "email", "email_domain"}:
			return normalize_ban_subject(subject_type, value)
		value = value.strip()
		if not value:
			raise ValueError("Risk subject cannot be empty")
		return value

	def subject_hash(self, subject_type: str, value: str) -> str:
		return stable_hash(self._normalized(subject_type, value), self.hash_key)

	def ensure_subject(
		self,
		subject_type: str,
		value: str,
		*,
		display: str = "",
	) -> dict[str, Any]:
		normalized = self._normalized(subject_type, value)
		digest = stable_hash(normalized, self.hash_key)
		now = int(time.time())
		explicit_display = bool(display)
		if not display:
			display = ban_subject_display(subject_type, normalized)
		self.database.execute(
			"""INSERT INTO risk_subjects(subject_type, subject_hash, display_value, first_seen_at,
			last_seen_at, last_changed_at) VALUES (?, ?, ?, ?, ?, ?)
			ON CONFLICT(subject_type, subject_hash) DO UPDATE SET
			display_value=CASE WHEN ? THEN excluded.display_value ELSE risk_subjects.display_value END,
			last_seen_at=excluded.last_seen_at,
			provenance_status='verified'""",
			(subject_type, digest, display[:160], now, now, now, int(explicit_display)),
		)
		return self.database.query(
			"SELECT * FROM risk_subjects WHERE subject_type = ? AND subject_hash = ? LIMIT 1",
			(subject_type, digest),
		)[0]

	def subject_by_public_id(self, subject_id: int) -> dict[str, Any] | None:
		rows = self.database.query("SELECT * FROM risk_subjects WHERE id = ? LIMIT 1", (subject_id,))
		return rows[0] if rows else None

	def subject_by_hash(self, subject_type: str, digest: str) -> dict[str, Any] | None:
		rows = self.database.query(
			"SELECT * FROM risk_subjects WHERE subject_type = ? AND subject_hash = ? LIMIT 1",
			(subject_type, digest),
		)
		return rows[0] if rows else None

	def _apply(
		self,
		subject_id: int,
		delta: int,
		*,
		reason_code: str,
		reason: str,
		source: str,
		source_ref: str | None,
		actor: str,
		expires_at: int | None = None,
		parent_entry_id: str | None = None,
		metadata: dict[str, Any] | None = None,
	) -> dict[str, Any]:
		now = int(time.time())
		entry_id = uuid.uuid4().hex

		def operation(connection):
			if source_ref:
				existing = connection.execute(
					"""SELECT risk_ledger.* FROM risk_ledger WHERE subject_id = ? AND reason_code = ?
					AND source = ? AND source_ref = ? LIMIT 1""",
					(subject_id, reason_code, source, source_ref),
				).fetchone()
				if existing:
					return dict(existing)
			subject = connection.execute(
				"SELECT current_score FROM risk_subjects WHERE id = ? LIMIT 1", (subject_id,)
			).fetchone()
			if not subject:
				raise ValueError("Risk subject not found")
			before = int(subject["current_score"])
			permanent_allowlist = connection.execute(
				"""SELECT 1 FROM risk_overrides WHERE subject_id = ?
				AND override_type = 'score_cap' AND value_integer = 0
				AND expires_at IS NULL AND revoked_at IS NULL
				AND scope_host IS NULL AND scope_path IS NULL LIMIT 1""",
				(subject_id,),
			).fetchone()
			after = 0 if permanent_allowlist else max(0, min(100, before + int(delta)))
			applied_delta = after - before
			if applied_delta == 0:
				return {
					"id": None,
					"subject_id": subject_id,
					"created_at": now,
					"delta": 0,
					"score_before": before,
					"score_after": after,
					"reason_code": reason_code,
					"reason": reason,
					"source": source,
					"source_ref": source_ref,
					"actor": actor,
					"expires_at": expires_at,
				}
			connection.execute(
				"""INSERT INTO risk_ledger(id, subject_id, created_at, delta, score_before, score_after,
				reason_code, reason, source, source_ref, actor, expires_at, parent_entry_id, metadata_json,
				score_kind) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'raw')""",
				(
					entry_id,
					subject_id,
					now,
					applied_delta,
					before,
					after,
					reason_code[:80],
					reason[:300],
					source[:40],
					source_ref,
					actor[:120],
					expires_at,
					parent_entry_id,
					json.dumps(metadata or {}, separators=(",", ":")),
				),
			)
			connection.execute(
				"""UPDATE risk_subjects SET current_score = ?, risk_level = ?, last_changed_at = ?,
				last_seen_at = ?, version = version + 1 WHERE id = ?""",
				(after, entity_level(after), now, now, subject_id),
			)
			return {
				"id": entry_id,
				"subject_id": subject_id,
				"created_at": now,
				"delta": applied_delta,
				"score_before": before,
				"score_after": after,
				"reason_code": reason_code,
				"reason": reason,
				"source": source,
				"source_ref": source_ref,
				"actor": actor,
				"expires_at": expires_at,
			}

		return self.database.transaction(operation)

	def _record_effective_change(
		self,
		subject_id: int,
		before: int,
		after: int,
		*,
		reason_code: str,
		reason: str,
		source_ref: str,
		actor: str,
		source: str = "admin",
		metadata: dict[str, Any] | None = None,
	) -> dict[str, Any] | None:
		before = max(0, min(100, int(before)))
		after = max(0, min(100, int(after)))
		if before == after:
			return None
		now = int(time.time())
		entry_id = uuid.uuid4().hex

		def operation(connection):
			existing = connection.execute(
				"""SELECT * FROM risk_ledger WHERE subject_id = ? AND reason_code = ?
				AND source = ? AND source_ref = ? LIMIT 1""",
				(subject_id, reason_code, source, source_ref),
			).fetchone()
			if existing:
				return dict(existing)
			connection.execute(
				"""INSERT INTO risk_ledger(id, subject_id, created_at, delta, score_before, score_after,
				reason_code, reason, source, source_ref, actor, metadata_json, score_kind)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'effective')""",
				(
					entry_id,
					subject_id,
					now,
					after - before,
					before,
					after,
					reason_code[:80],
					reason[:300],
					source[:40],
					source_ref,
					actor[:120],
					json.dumps(metadata or {}, separators=(",", ":")),
				),
			)
			connection.execute(
				"UPDATE risk_subjects SET last_changed_at = ?, version = version + 1 WHERE id = ?",
				(now, subject_id),
			)
			return {
				"id": entry_id,
				"subject_id": subject_id,
				"created_at": now,
				"delta": after - before,
				"score_before": before,
				"score_after": after,
				"reason_code": reason_code,
				"reason": reason,
				"source": source,
				"source_ref": source_ref,
				"actor": actor,
				"score_kind": "effective",
			}

		return self.database.transaction(operation)

	def adjust(
		self,
		subject_id: int,
		delta: int,
		*,
		reason_code: str,
		reason: str,
		source: str,
		actor: str,
		source_ref: str | None = None,
		duration_seconds: int | None = None,
		decay_steps: int = 0,
		metadata: dict[str, Any] | None = None,
	) -> dict[str, Any]:
		now = int(time.time())
		expires_at = now + duration_seconds if duration_seconds else None
		entry = self._apply(
			subject_id,
			delta,
			reason_code=reason_code,
			reason=reason,
			source=source,
			source_ref=source_ref,
			actor=actor,
			expires_at=expires_at,
			metadata=metadata,
		)
		if entry["delta"] and (duration_seconds or decay_steps):
			steps = max(1, decay_steps or 1)
			interval = max(60, (duration_seconds or 3600) // steps)
			step = max(1, math.ceil(abs(int(entry["delta"])) / steps))
			self.database.execute(
				"""INSERT OR IGNORE INTO risk_effects(subject_id, source_entry_id, remaining_delta,
				decay_step, next_decay_at, expires_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)""",
				(subject_id, entry["id"], entry["delta"], step, now + interval, expires_at, now),
			)
		return entry

	def set_score(
		self,
		subject_id: int,
		score: int,
		*,
		reason: str,
		actor: str,
		reason_code: str = "MANUAL_SCORE_SET",
	) -> dict[str, Any]:
		subject = self.subject_by_public_id(subject_id)
		if not subject:
			raise ValueError("Risk subject not found")
		target = max(0, min(100, int(score)))
		return self._apply(
			subject_id,
			target - int(subject["current_score"]),
			reason_code=reason_code,
			reason=reason,
			source="admin",
			source_ref=None,
			actor=actor,
		)

	def record_signal(
		self,
		subject_type: str,
		value: str,
		*,
		display: str = "",
		delta: int,
		reason_code: str,
		reason: str,
		source_ref: str,
		duration_seconds: int = 86400,
		decay_steps: int = 4,
	) -> dict[str, Any]:
		subject = self.ensure_subject(subject_type, value, display=display)
		return self.adjust(
			int(subject["id"]),
			delta,
			reason_code=reason_code,
			reason=reason,
			source="gateway",
			source_ref=source_ref,
			actor="shield",
			duration_seconds=duration_seconds,
			decay_steps=decay_steps,
		)

	def enqueue_signal(
		self,
		subject_id: int,
		*,
		delta: int,
		reason_code: str,
		reason: str,
		source_ref: str,
		duration_seconds: int,
		decay_steps: int,
	) -> str:
		signal_id = uuid.uuid4().hex
		self.database.execute(
			"""INSERT OR IGNORE INTO risk_signal_queue(id, subject_id, created_at, delta,
			reason_code, reason, source_ref, duration_seconds, decay_steps)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
			(
				signal_id,
				subject_id,
				int(time.time()),
				delta,
				reason_code[:80],
				reason[:300],
				source_ref,
				duration_seconds,
				decay_steps,
			),
		)
		return signal_id

	def process_signal_queue(self, limit: int = 200) -> int:
		self.database.execute(
			"""UPDATE risk_signal_queue SET status = 'queued', detail = 'recovered'
			WHERE status = 'processing' AND created_at < ?""",
			(int(time.time()) - 60,),
		)
		rows = self.database.query(
			"SELECT * FROM risk_signal_queue WHERE status = 'queued' ORDER BY created_at, id LIMIT ?",
			(limit,),
		)
		processed = 0
		for row in rows:
			self.database.execute(
				"UPDATE risk_signal_queue SET status = 'processing', attempt_count = attempt_count + 1 WHERE id = ? AND status = 'queued'",
				(row["id"],),
			)
			try:
				self.adjust(
					int(row["subject_id"]),
					int(row["delta"]),
					reason_code=row["reason_code"],
					reason=row["reason"],
					source="gateway",
					source_ref=row["source_ref"],
					actor="shield-worker",
					duration_seconds=int(row["duration_seconds"]) if row["duration_seconds"] else None,
					decay_steps=int(row["decay_steps"] or 0),
				)
				self.database.execute(
					"UPDATE risk_signal_queue SET status = 'completed', processed_at = ?, detail = '' WHERE id = ?",
					(int(time.time()), row["id"]),
				)
				processed += 1
			except (ValueError, RuntimeError) as error:
				self.database.execute(
					"UPDATE risk_signal_queue SET status = 'failed', processed_at = ?, detail = ? WHERE id = ?",
					(int(time.time()), type(error).__name__, row["id"]),
				)
		return processed

	def set_baseline(
		self,
		subject_type: str,
		value: str,
		*,
		display: str,
		baseline: int,
		reasons: list[str],
		source_ref: str,
		factors: dict[str, tuple[int, str]] | None = None,
	) -> dict[str, Any]:
		subject = self.ensure_subject(subject_type, value, display=display)
		baseline = max(0, min(100, int(baseline)))
		previous = int(subject["base_score"])
		factor_rows = self.database.query(
			"SELECT factor_key, value_integer, reason FROM risk_baseline_factors WHERE subject_id = ?",
			(subject["id"],),
		)
		current_factors = {row["factor_key"]: row for row in factor_rows}
		factor_values = factors or {}
		entry: dict[str, Any] = {"delta": 0, "score_after": int(subject["current_score"])}
		if not current_factors and previous:
			delta = baseline - previous
			if delta:
				entry = self._apply(
					int(subject["id"]),
					delta,
					reason_code="ACCOUNT_POSTURE_RECONCILED",
					reason="; ".join(reasons)[:300] or "Account security posture changed",
					source="account_sync",
					source_ref=source_ref,
					actor="shield-worker",
					metadata={"baselineBefore": previous, "baselineAfter": baseline},
				)
		else:
			for key in sorted(set(current_factors) | set(factor_values)):
				old_value = int(current_factors.get(key, {}).get("value_integer") or 0)
				new_value, new_reason = factor_values.get(
					key,
					(0, str(current_factors.get(key, {}).get("reason") or f"Account factor cleared: {key}")),
				)
				delta = int(new_value) - old_value
				if not delta:
					continue
				entry = self._apply(
					int(subject["id"]),
					delta,
					reason_code=f"ACCOUNT_{key.upper()}",
					reason=new_reason if new_value else f"Resolved: {new_reason}",
					source="account_sync",
					source_ref=f"{source_ref}:{key}",
					actor="shield-worker",
					metadata={"factorKey": key, "factorBefore": old_value, "factorAfter": int(new_value)},
				)
		now = int(time.time())
		for key, (factor_value, factor_reason) in factor_values.items():
			self.database.execute(
				"""INSERT INTO risk_baseline_factors(subject_id, factor_key, value_integer, reason, updated_at)
				VALUES (?, ?, ?, ?, ?) ON CONFLICT(subject_id, factor_key) DO UPDATE SET
				value_integer=excluded.value_integer, reason=excluded.reason, updated_at=excluded.updated_at""",
				(subject["id"], key, int(factor_value), factor_reason[:300], now),
			)
		if factor_values:
			placeholders = ",".join("?" for _key in factor_values)
			self.database.execute(
				f"DELETE FROM risk_baseline_factors WHERE subject_id = ? AND factor_key NOT IN ({placeholders})",
				(subject["id"], *factor_values.keys()),
			)
		else:
			self.database.execute("DELETE FROM risk_baseline_factors WHERE subject_id = ?", (subject["id"],))
		self.database.execute(
			"UPDATE risk_subjects SET base_score = ? WHERE id = ?",
			(baseline, subject["id"]),
		)
		return entry

	def add_override(
		self,
		subject_id: int,
		*,
		override_type: str,
		value: int | None,
		reason: str,
		actor: str,
		duration_seconds: int | None,
		scope_host: str | None = None,
		scope_path: str | None = None,
		scope_rule_id: int | None = None,
		control_source: str = "manual",
		control_ref: str | None = None,
		effective_reason_code: str | None = None,
	) -> dict[str, Any]:
		if override_type not in {"adjustment", "score_cap", "score_floor", "rule_exemption", "response_exemption"}:
			raise ValueError("Unsupported override type")
		if control_source not in {"manual", "geo_policy"}:
			raise ValueError("Unsupported score control source")
		if control_source == "geo_policy" and not control_ref:
			raise ValueError("Geography policy control requires a reference")
		now = int(time.time())
		subject = self.subject_by_public_id(subject_id)
		if not subject:
			raise ValueError("Risk subject not found")
		before_effective = self.effective_score(subject)
		expires_at = now + duration_seconds if duration_seconds else None
		ledger_entry_id = None
		permanent_allowlist = (
			override_type == "score_cap"
			and value == 0
			and duration_seconds is None
			and scope_host is None
			and scope_path is None
		)
		if permanent_allowlist and self.is_permanently_allowlisted(subject_id):
			raise ValueError("Risk subject is already permanently allowlisted")
		if override_type == "adjustment":
			if value is None or value == 0:
				raise ValueError("Adjustment requires a non-zero value")
			entry = self.adjust(
				subject_id,
				value,
				reason_code="MANUAL_ADJUSTMENT",
				reason=reason,
				source="admin",
				actor=actor,
				duration_seconds=duration_seconds,
			)
			ledger_entry_id = entry["id"]
		elif permanent_allowlist:
			entry = self.set_score(
				subject_id,
				0,
				reason=reason,
				actor=actor,
				reason_code="PERMANENT_ALLOWLIST_APPLIED",
			)
			ledger_entry_id = entry["id"]
		override_id = self.database.execute(
			"""INSERT INTO risk_overrides(subject_id, override_type, value_integer, scope_host,
			scope_path, scope_rule_id, reason, created_at, created_by, expires_at, ledger_entry_id,
			control_source, control_ref)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
			(subject_id, override_type, value, scope_host, scope_path, scope_rule_id, reason, now, actor, expires_at, ledger_entry_id, control_source, control_ref),
		)
		if override_type in {"score_cap", "score_floor"} and not permanent_allowlist:
			after_effective = self.effective_score(self.subject_by_public_id(subject_id) or subject)
			self._record_effective_change(
				subject_id,
				before_effective,
				after_effective,
				reason_code=effective_reason_code or ("SCORE_CAP_APPLIED" if override_type == "score_cap" else "SCORE_FLOOR_APPLIED"),
				reason=reason,
				source_ref=f"override:{override_id}:apply",
				actor=actor,
				metadata={"overrideId": override_id, "overrideType": override_type, "value": value},
			)
		return self.database.query("SELECT * FROM risk_overrides WHERE id = ?", (override_id,))[0]

	def ensure_geo_policy_floor(
		self,
		subject_id: int,
		policy_id: int,
		*,
		label: str,
		reason: str,
		actor: str,
	) -> tuple[dict[str, Any], bool]:
		control_ref = str(policy_id)
		existing = self.database.query(
			"""SELECT * FROM risk_overrides WHERE subject_id = ? AND override_type = 'score_floor'
			AND control_source = 'geo_policy' AND control_ref = ? AND revoked_at IS NULL LIMIT 1""",
			(subject_id, control_ref),
		)
		if existing:
			return existing[0], False
		try:
			return self.add_override(
				subject_id,
				override_type="score_floor",
				value=100,
				reason=f"Restricted geography: {label}. {reason}"[:300],
				actor=actor,
				duration_seconds=None,
				control_source="geo_policy",
				control_ref=control_ref,
				effective_reason_code="GEOGRAPHY_RESTRICTION_APPLIED",
			), True
		except sqlite3.IntegrityError:
			existing = self.database.query(
				"""SELECT * FROM risk_overrides WHERE subject_id = ? AND override_type = 'score_floor'
				AND control_source = 'geo_policy' AND control_ref = ? AND revoked_at IS NULL LIMIT 1""",
				(subject_id, control_ref),
			)
			if existing:
				return existing[0], False
			raise

	def revoke_geo_policy_floors(
		self,
		policy_ids: list[int],
		*,
		actor: str,
		reason: str,
	) -> set[int]:
		if not policy_ids:
			return set()
		placeholders = ",".join("?" for _ in policy_ids)
		rows = self.database.query(
			f"""SELECT id, subject_id FROM risk_overrides WHERE control_source = 'geo_policy'
			AND control_ref IN ({placeholders}) AND revoked_at IS NULL ORDER BY id""",
			[str(policy_id) for policy_id in policy_ids],
		)
		for row in rows:
			self.revoke_override(
				int(row["id"]),
				actor,
				reason,
				allow_managed=True,
			)
		return {int(row["subject_id"]) for row in rows}

	def revoke_geo_policy_signals(
		self,
		policy_ids: list[int],
		*,
		actor: str,
		reason: str,
	) -> set[int]:
		now = int(time.time())
		processed: set[int] = set()
		for policy_id in policy_ids:
			prefix = f"geo-policy:{policy_id}:%"
			self.database.execute(
				"""UPDATE risk_signal_queue SET status = 'failed', processed_at = ?,
				detail = 'geography restriction revoked' WHERE reason_code = 'GEOGRAPHY_RESTRICTION'
				AND source_ref LIKE ? AND status IN ('queued', 'processing')""",
				(now, prefix),
			)
			effects = self.database.query(
				"""SELECT risk_effects.id, risk_effects.subject_id, risk_effects.source_entry_id,
				risk_effects.remaining_delta FROM risk_effects JOIN risk_ledger
				ON risk_ledger.id = risk_effects.source_entry_id
				WHERE risk_effects.status = 'active'
				AND risk_ledger.reason_code = 'GEOGRAPHY_RESTRICTION'
				AND risk_ledger.source_ref LIKE ?""",
				(prefix,),
			)
			for effect in effects:
				remaining = int(effect["remaining_delta"])
				if remaining:
					self._apply(
						int(effect["subject_id"]),
						-remaining,
						reason_code="GEOGRAPHY_RESTRICTION_REVOKED",
						reason=reason,
						source="admin",
						source_ref=f"geo-policy:{policy_id}:revoke:{effect['id']}",
						actor=actor,
						parent_entry_id=effect["source_entry_id"],
					)
				self.database.execute(
					"UPDATE risk_effects SET status = 'revoked', remaining_delta = 0, updated_at = ? WHERE id = ?",
					(now, effect["id"]),
				)
				processed.add(int(effect["subject_id"]))
		return processed

	def revoke_override(
		self,
		override_id: int,
		actor: str,
		reason: str,
		*,
		allow_managed: bool = False,
	) -> dict[str, Any]:
		rows = self.database.query(
			"SELECT * FROM risk_overrides WHERE id = ? AND revoked_at IS NULL LIMIT 1", (override_id,)
		)
		if not rows:
			raise ValueError("Active risk override not found")
		override = rows[0]
		if override.get("control_source") != "manual" and not allow_managed:
			raise ValueError("Managed controls must be changed from their policy workspace")
		now = int(time.time())
		subject = self.subject_by_public_id(int(override["subject_id"]))
		before_effective = self.effective_score(subject) if subject else 0
		if override["override_type"] == "adjustment" and override["ledger_entry_id"]:
			entry = self.database.query(
				"SELECT delta FROM risk_ledger WHERE id = ? LIMIT 1", (override["ledger_entry_id"],)
			)
			if entry:
				self._apply(
					int(override["subject_id"]),
					-int(entry[0]["delta"]),
					reason_code="MANUAL_OVERRIDE_REVOKED",
					reason=reason,
					source="admin",
					source_ref=f"override:{override_id}",
					actor=actor,
					parent_entry_id=override["ledger_entry_id"],
				)
		self.database.execute(
			"UPDATE risk_overrides SET revoked_at = ?, revoked_by = ?, revoke_reason = ? WHERE id = ?",
			(now, actor, reason, override_id),
		)
		self.database.execute(
			"UPDATE risk_effects SET status = 'revoked', updated_at = ? WHERE source_entry_id = ?",
			(now, override["ledger_entry_id"]),
		)
		permanent_allowlist = bool(
			override["override_type"] == "score_cap"
			and override["value_integer"] is not None
			and int(override["value_integer"]) == 0
			and override["expires_at"] is None
			and override["scope_host"] is None
			and override["scope_path"] is None
		)
		if subject and permanent_allowlist and override["ledger_entry_id"]:
			entries = self.database.query(
				"SELECT score_before FROM risk_ledger WHERE id = ? LIMIT 1",
				(override["ledger_entry_id"],),
			)
			if entries:
				restore_score = int(entries[0]["score_before"])
				if subject["subject_type"] == "account":
					restore_score = int(subject["base_score"])
				self.set_score(
					int(subject["id"]),
					restore_score,
					reason=reason,
					actor=actor,
					reason_code="PERMANENT_ALLOWLIST_REVOKED",
				)
		if (
			subject
			and override["override_type"] in {"score_cap", "score_floor"}
			and not permanent_allowlist
		):
			after_effective = self.effective_score(self.subject_by_public_id(int(subject["id"])) or subject)
			self._record_effective_change(
				int(subject["id"]),
				before_effective,
				after_effective,
				reason_code=(
					"GEOGRAPHY_RESTRICTION_REVOKED"
					if override.get("control_source") == "geo_policy"
					else "SCORE_CAP_REVOKED" if override["override_type"] == "score_cap" else "SCORE_FLOOR_REVOKED"
				),
				reason=reason,
				source_ref=f"override:{override_id}:revoke",
				actor=actor,
				metadata={"overrideId": override_id, "overrideType": override["override_type"]},
			)
		return self.database.query("SELECT * FROM risk_overrides WHERE id = ?", (override_id,))[0]

	def active_override(
		self,
		subject_id: int,
		override_type: str,
		host: str = "",
		path: str = "",
		at: int | None = None,
	) -> dict[str, Any] | None:
		now = at if at is not None else int(time.time())
		rows = self.database.query(
			"""SELECT * FROM risk_overrides WHERE subject_id = ? AND override_type = ?
			AND revoked_at IS NULL AND (expires_at IS NULL OR expires_at > ?)
			AND (scope_host IS NULL OR scope_host = ?)
			AND (scope_path IS NULL OR ? GLOB scope_path)
			ORDER BY id DESC LIMIT 1""",
			(subject_id, override_type, now, host, path),
		)
		return rows[0] if rows else None

	def is_permanently_allowlisted(
		self,
		subject_id: int,
		host: str = "",
		path: str = "",
	) -> bool:
		rows = self.database.query(
			"""SELECT 1 FROM risk_overrides WHERE subject_id = ?
			AND override_type = 'score_cap' AND value_integer = 0
			AND expires_at IS NULL AND revoked_at IS NULL
			AND (scope_host IS NULL OR scope_host = ?)
			AND (scope_path IS NULL OR ? GLOB scope_path) LIMIT 1""",
			(subject_id, host, path),
		)
		return bool(rows)

	def matching_rule_exemption(
		self,
		subject_id: int,
		rule_ids: list[int],
		host: str,
		path: str,
	) -> dict[str, Any] | None:
		now = int(time.time())
		rows = self.database.query(
			"""SELECT * FROM risk_overrides WHERE subject_id = ?
			AND override_type = 'rule_exemption' AND revoked_at IS NULL
			AND (expires_at IS NULL OR expires_at > ?)
			AND (scope_host IS NULL OR scope_host = ?)
			AND (scope_path IS NULL OR ? GLOB scope_path)
			ORDER BY id DESC""",
			(subject_id, now, host, path),
		)
		for row in rows:
			if row["scope_rule_id"] is None or int(row["scope_rule_id"]) in rule_ids:
				return row
		return None

	def effective_score(
		self,
		subject: dict[str, Any],
		host: str = "",
		path: str = "",
		at: int | None = None,
	) -> int:
		score = int(subject["current_score"])
		now = at if at is not None else int(time.time())
		overrides = self.database.query(
			"""SELECT override_type, value_integer, expires_at, scope_host, scope_path
			FROM risk_overrides WHERE subject_id = ?
			AND override_type IN ('score_cap', 'score_floor') AND revoked_at IS NULL
			AND (expires_at IS NULL OR expires_at > ?)
			AND (scope_host IS NULL OR scope_host = ?)
			AND (scope_path IS NULL OR ? GLOB scope_path)""",
			(subject["id"], now, host, path),
		)
		if any(
			row["override_type"] == "score_cap"
			and row["value_integer"] is not None
			and int(row["value_integer"]) == 0
			and row["expires_at"] is None
			and row["scope_host"] is None
			and row["scope_path"] is None
			for row in overrides
		):
			return 0
		caps = [
			int(row["value_integer"])
			for row in overrides
			if row["override_type"] == "score_cap" and row["value_integer"] is not None
		]
		floors = [
			int(row["value_integer"])
			for row in overrides
			if row["override_type"] == "score_floor" and row["value_integer"] is not None
		]
		if caps:
			score = min(score, min(caps))
		if floors:
			score = max(score, max(floors))
		return max(0, min(100, score))

	def effective_score_map(
		self,
		subjects: list[dict[str, Any]],
		*,
		at: int | None = None,
	) -> dict[int, int]:
		now = at if at is not None else int(time.time())
		overrides: dict[tuple[int, str], list[dict[str, Any]]] = {}
		ids = [int(subject["id"]) for subject in subjects]
		for offset in range(0, len(ids), 800):
			chunk = ids[offset : offset + 800]
			if not chunk:
				continue
			placeholders = ",".join("?" for _ in chunk)
			rows = self.database.query(
				f"""SELECT * FROM risk_overrides WHERE subject_id IN ({placeholders})
				AND override_type IN ('score_cap', 'score_floor') AND revoked_at IS NULL
				AND (expires_at IS NULL OR expires_at > ?)
				AND scope_host IS NULL AND scope_path IS NULL ORDER BY id DESC""",
				(*chunk, now),
			)
			for row in rows:
				overrides.setdefault(
					(int(row["subject_id"]), str(row["override_type"])), []
				).append(row)
		scores: dict[int, int] = {}
		for subject in subjects:
			subject_id = int(subject["id"])
			score = int(subject.get("current_score", subject.get("currentScore", 0)))
			caps = overrides.get((subject_id, "score_cap"), [])
			floors = overrides.get((subject_id, "score_floor"), [])
			permanent_allowlist = any(
				cap["value_integer"] is not None
				and int(cap["value_integer"]) == 0
				and cap["expires_at"] is None
				for cap in caps
			)
			if permanent_allowlist:
				scores[subject_id] = 0
				continue
			cap_values = [
				int(cap["value_integer"])
				for cap in caps
				if cap["value_integer"] is not None
			]
			floor_values = [
				int(floor["value_integer"])
				for floor in floors
				if floor["value_integer"] is not None
			]
			if cap_values:
				score = min(score, min(cap_values))
			if floor_values:
				score = max(score, max(floor_values))
			scores[subject_id] = max(0, min(100, score))
		return scores

	def expire_due_overrides(self, now: int | None = None, limit: int = 500) -> int:
		now = now or int(time.time())
		rows = self.database.query(
			"""SELECT * FROM risk_overrides WHERE revoked_at IS NULL AND expires_at IS NOT NULL
			AND expires_at <= ? AND override_type IN ('score_cap', 'score_floor')
			ORDER BY expires_at, id LIMIT ?""",
			(now, limit),
		)
		processed = 0
		for override in rows:
			subject = self.subject_by_public_id(int(override["subject_id"]))
			if not subject:
				continue
			before = self.effective_score(subject, at=max(0, int(override["expires_at"]) - 1))
			self.database.execute(
				"""UPDATE risk_overrides SET revoked_at = ?, revoked_by = 'shield-worker',
				revoke_reason = 'Manual score control expired' WHERE id = ? AND revoked_at IS NULL""",
				(int(override["expires_at"]), override["id"]),
			)
			after = self.effective_score(self.subject_by_public_id(int(subject["id"])) or subject, at=now)
			self._record_effective_change(
				int(subject["id"]),
				before,
				after,
				reason_code="SCORE_CAP_EXPIRED" if override["override_type"] == "score_cap" else "SCORE_FLOOR_EXPIRED",
				reason="Manual score control expired",
				source_ref=f"override:{override['id']}:expire",
				actor="shield-worker",
				source="worker",
				metadata={"overrideId": override["id"], "overrideType": override["override_type"]},
			)
			processed += 1
		return processed

	def run_due_decay(self, now: int | None = None, limit: int = 500) -> int:
		now = now or int(time.time())
		effects = self.database.query(
			"""SELECT * FROM risk_effects WHERE status = 'active'
			AND ((next_decay_at IS NOT NULL AND next_decay_at <= ?)
			OR (expires_at IS NOT NULL AND expires_at <= ?)) ORDER BY id LIMIT ?""",
			(now, now, limit),
		)
		processed = 0
		for effect in effects:
			remaining = int(effect["remaining_delta"])
			if not remaining:
				self.database.execute("UPDATE risk_effects SET status = 'completed', updated_at = ? WHERE id = ?", (now, effect["id"]))
				continue
			expired = effect["expires_at"] is not None and int(effect["expires_at"]) <= now
			amount = abs(remaining) if expired else min(abs(remaining), int(effect["decay_step"]))
			delta = -amount if remaining > 0 else amount
			self._apply(
				int(effect["subject_id"]),
				delta,
				reason_code="AUTO_EXPIRE" if expired else "AUTO_DECAY",
				reason="Timed risk adjustment expired" if expired else "Risk reduced by automatic decay",
				source="worker",
				source_ref=f"effect:{effect['id']}:{remaining}",
				actor="shield-worker",
				parent_entry_id=effect["source_entry_id"],
			)
			new_remaining = remaining + delta
			status = "completed" if new_remaining == 0 else "active"
			interval = max(60, int(effect["next_decay_at"] or now) - int(effect["updated_at"]))
			self.database.execute(
				"""UPDATE risk_effects SET remaining_delta = ?, status = ?, next_decay_at = ?,
				updated_at = ? WHERE id = ?""",
				(new_remaining, status, now + interval if status == "active" else None, now, effect["id"]),
			)
			processed += 1
		return processed

	def list_subjects(
		self,
		*,
		subject_type: str | None = None,
		minimum_score: int = 0,
		query: str = "",
		limit: int = 100,
	) -> list[dict[str, Any]]:
		conditions = ["provenance_status = 'verified'", "subject_type IN ('account', 'ip')"]
		parameters: list[Any] = []
		if subject_type:
			conditions.append("subject_type = ?")
			parameters.append(subject_type)
		if query:
			conditions.append(
				"(LOWER(display_value) LIKE ? OR EXISTS (SELECT 1 FROM risk_evidence "
				"WHERE root_subject_id = risk_subjects.id AND LOWER(display_value) LIKE ?))"
			)
			needle = f"%{query.lower()}%"
			parameters.extend((needle, needle))
		rows = self.database.query(
			f"""SELECT id, subject_type, display_value, current_score, risk_level,
			first_seen_at, last_seen_at, last_changed_at, version
			FROM risk_subjects WHERE {' AND '.join(conditions)}""",
			parameters,
		)
		scores = self.effective_score_map(rows)
		items = [
			{
				"id": row["id"],
				"subjectType": row["subject_type"],
				"displayValue": row["display_value"],
				"currentScore": row["current_score"],
				"effectiveScore": scores[int(row["id"])],
				"riskLevel": entity_level(scores[int(row["id"])]),
				"firstSeenAt": row["first_seen_at"],
				"lastSeenAt": row["last_seen_at"],
				"lastChangedAt": row["last_changed_at"],
				"version": row["version"],
			}
			for row in rows
			if scores[int(row["id"])] >= minimum_score
		]
		items.sort(
			key=lambda item: (int(item["effectiveScore"]), int(item["lastChangedAt"])),
			reverse=True,
		)
		return items[: min(500, max(1, limit))]

	def subject_type_statistics(self) -> list[dict[str, Any]]:
		rows = self.database.query(
			"""SELECT id, subject_type, current_score FROM risk_subjects
			WHERE provenance_status = 'verified' AND subject_type IN ('account', 'ip')"""
		)
		scores = self.effective_score_map(rows)
		statistics: dict[str, dict[str, Any]] = {}
		for row in rows:
			subject_type = str(row["subject_type"])
			score = scores[int(row["id"])]
			item = statistics.setdefault(
				subject_type,
				{"subjectType": subject_type, "total": 0, "elevated": 0, "maximumScore": 0},
			)
			item["total"] += 1
			item["elevated"] += int(score >= 50)
			item["maximumScore"] = max(int(item["maximumScore"]), score)
		return [statistics[key] for key, _label in SUBJECT_TYPE_CATALOG if key in statistics]

	def ledger_page(
		self,
		subject_id: int,
		*,
		before: int | None = None,
		limit: int = 100,
	) -> dict[str, Any]:
		limit = min(200, max(1, int(limit)))
		conditions = ["subject_id = ?"]
		parameters: list[Any] = [subject_id]
		if before is not None:
			conditions.append("rowid < ?")
			parameters.append(max(1, int(before)))
		parameters.append(limit + 1)
		rows = self.database.query(
			f"""SELECT rowid AS cursor, id, created_at AS createdAt, delta,
			score_before AS scoreBefore, score_after AS scoreAfter, reason_code AS reasonCode,
			reason, source, source_ref AS sourceRef, actor, expires_at AS expiresAt,
			score_kind AS scoreKind FROM risk_ledger WHERE {' AND '.join(conditions)}
			ORDER BY rowid DESC LIMIT ?""",
			parameters,
		)
		has_more = len(rows) > limit
		items = rows[:limit]
		return {
			"items": items,
			"hasMore": has_more,
			"nextCursor": int(items[-1]["cursor"]) if has_more and items else None,
		}

	def detail(self, subject_id: int) -> dict[str, Any] | None:
		subject = self.subject_by_public_id(subject_id)
		if not subject:
			return None
		ledger_page = self.ledger_page(subject_id, limit=100)
		ledger_total = self.database.query(
			"SELECT COUNT(*) AS value FROM risk_ledger WHERE subject_id = ?",
			(subject_id,),
		)[0]["value"]
		overrides = self.database.query(
			"""SELECT id, override_type AS overrideType, value_integer AS value, scope_host AS scopeHost,
			scope_path AS scopePath, reason, created_at AS createdAt, created_by AS createdBy,
			expires_at AS expiresAt, revoked_at AS revokedAt,
			control_source AS controlSource, control_ref AS controlRef FROM risk_overrides
			WHERE subject_id = ? ORDER BY id DESC LIMIT 100""",
			(subject_id,),
		)
		relations = self.database.query(
			"""SELECT relation_type AS relationType, confidence, last_seen_at AS lastSeenAt,
			CASE WHEN left_subject_id = ? THEN right_subject_id ELSE left_subject_id END AS relatedId
			FROM risk_relations WHERE left_subject_id = ? OR right_subject_id = ?
			ORDER BY last_seen_at DESC LIMIT 100""",
			(subject_id, subject_id, subject_id),
		)
		evidence = self.database.query(
			"""SELECT id, evidence_type AS evidenceType, display_value AS displayValue,
			first_seen_at AS firstSeenAt, last_seen_at AS lastSeenAt,
			observation_count AS observationCount, confidence, metadata_json AS metadata
			FROM risk_evidence WHERE root_subject_id = ?
			ORDER BY last_seen_at DESC, observation_count DESC LIMIT 300""",
			(subject_id,),
		)
		for item in evidence:
			try:
				item["metadata"] = json.loads(item["metadata"] or "{}")
			except (TypeError, json.JSONDecodeError):
				item["metadata"] = {}
		if subject["subject_type"] == "account":
			linked_subjects = self.database.query(
				"""SELECT ip.id, ip.subject_type AS subjectType, ip.display_value AS displayValue,
				ip.current_score AS currentScore, ip.risk_level AS riskLevel,
				relation.first_seen_at AS firstSeenAt, relation.last_seen_at AS lastSeenAt,
				relation.request_count AS requestCount, relation.authenticated_count AS authenticatedCount,
				relation.confidence
				FROM account_ip_relations AS relation JOIN risk_subjects AS ip ON ip.id = relation.ip_subject_id
				WHERE relation.account_subject_id = ? AND ip.provenance_status = 'verified'
				ORDER BY relation.last_seen_at DESC LIMIT 200""",
				(subject_id,),
			)
		elif subject["subject_type"] == "ip":
			linked_subjects = self.database.query(
				"""SELECT account.id, account.subject_type AS subjectType,
				account.display_value AS displayValue, account.current_score AS currentScore,
				account.risk_level AS riskLevel, relation.first_seen_at AS firstSeenAt,
				relation.last_seen_at AS lastSeenAt, relation.request_count AS requestCount,
				relation.authenticated_count AS authenticatedCount, relation.confidence
				FROM account_ip_relations AS relation
				JOIN risk_subjects AS account ON account.id = relation.account_subject_id
				WHERE relation.ip_subject_id = ? AND account.provenance_status = 'verified'
				ORDER BY relation.last_seen_at DESC LIMIT 200""",
				(subject_id,),
			)
		else:
			linked_subjects = []
		linked_scores = self.effective_score_map(linked_subjects)
		for linked in linked_subjects:
			linked_score = linked_scores[int(linked["id"])]
			linked["effectiveScore"] = linked_score
			linked["riskLevel"] = entity_level(linked_score)
		effective_score = self.effective_score(subject)
		return {
			"id": subject["id"],
			"subjectType": subject["subject_type"],
			"displayValue": subject["display_value"],
			"currentScore": subject["current_score"],
			"effectiveScore": effective_score,
			"riskLevel": entity_level(effective_score),
			"firstSeenAt": subject["first_seen_at"],
			"lastSeenAt": subject["last_seen_at"],
			"lastChangedAt": subject["last_changed_at"],
			"ledger": ledger_page["items"],
			"ledgerTotal": int(ledger_total),
			"ledgerHasMore": ledger_page["hasMore"],
			"ledgerNextCursor": ledger_page["nextCursor"],
			"overrides": overrides,
			"relations": relations,
			"evidence": evidence,
			"linkedSubjects": linked_subjects,
		}

	def observe_evidence(
		self,
		root_subject_id: int,
		evidence_type: str,
		value: str,
		*,
		display: str = "",
		confidence: int = 100,
		metadata: dict[str, Any] | None = None,
	) -> dict[str, Any] | None:
		value = value.strip()
		if not value or evidence_type in ROOT_SUBJECT_TYPES:
			return None
		root = self.subject_by_public_id(root_subject_id)
		if not root or root["subject_type"] not in ROOT_SUBJECT_TYPES:
			return None
		now = int(time.time())
		digest = stable_hash(value, self.hash_key)
		rows = self.database.query(
			"SELECT id, first_seen_at FROM risk_evidence WHERE root_subject_id = ? AND evidence_type = ? AND evidence_hash = ? LIMIT 1",
			(root_subject_id, evidence_type[:60], digest),
		)
		is_new = not rows
		self.database.execute(
			"""INSERT INTO risk_evidence(root_subject_id, evidence_type, evidence_hash, display_value,
			first_seen_at, last_seen_at, observation_count, confidence, metadata_json)
			VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
			ON CONFLICT(root_subject_id, evidence_type, evidence_hash) DO UPDATE SET
			display_value=excluded.display_value, last_seen_at=excluded.last_seen_at,
			observation_count=risk_evidence.observation_count + 1,
			confidence=MAX(risk_evidence.confidence, excluded.confidence),
			metadata_json=excluded.metadata_json""",
			(
				root_subject_id, evidence_type[:60], digest, display[:160], now, now,
				max(0, min(100, confidence)), json.dumps(metadata or {}, separators=(",", ":")),
			),
		)
		item = self.database.query(
			"SELECT id, first_seen_at AS firstSeenAt, last_seen_at AS lastSeenAt, observation_count AS observationCount FROM risk_evidence WHERE root_subject_id = ? AND evidence_type = ? AND evidence_hash = ? LIMIT 1",
			(root_subject_id, evidence_type[:60], digest),
		)[0]
		item["isNew"] = is_new
		return item

	def relate_account_ip(self, account_subject_id: int, ip_subject_id: int, *, authenticated: bool = True) -> None:
		account = self.subject_by_public_id(account_subject_id)
		ip = self.subject_by_public_id(ip_subject_id)
		if not account or not ip or account["subject_type"] != "account" or ip["subject_type"] != "ip":
			return
		now = int(time.time())
		self.database.execute(
			"""INSERT INTO account_ip_relations(account_subject_id, ip_subject_id, first_seen_at,
			last_seen_at, request_count, authenticated_count, confidence)
			VALUES (?, ?, ?, ?, 1, ?, 100)
			ON CONFLICT(account_subject_id, ip_subject_id) DO UPDATE SET
			last_seen_at=excluded.last_seen_at, request_count=account_ip_relations.request_count + 1,
			authenticated_count=account_ip_relations.authenticated_count + excluded.authenticated_count,
			confidence=MAX(account_ip_relations.confidence, excluded.confidence)""",
			(account_subject_id, ip_subject_id, now, now, 1 if authenticated else 0),
		)

	def relate(self, left_id: int, right_id: int, relation_type: str, confidence: int = 100) -> None:
		if left_id == right_id:
			return
		left_id, right_id = sorted((left_id, right_id))
		now = int(time.time())
		self.database.execute(
			"""INSERT INTO risk_relations(left_subject_id, right_subject_id, relation_type, confidence,
			first_seen_at, last_seen_at) VALUES (?, ?, ?, ?, ?, ?)
			ON CONFLICT(left_subject_id, right_subject_id, relation_type) DO UPDATE SET
			confidence=MAX(confidence, excluded.confidence), last_seen_at=excluded.last_seen_at""",
			(left_id, right_id, relation_type[:60], max(0, min(100, confidence)), now, now),
		)
