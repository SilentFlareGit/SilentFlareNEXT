from __future__ import annotations

import json
import math
import time
import uuid
from typing import Any

from .blocking import ban_subject_display, normalize_ban_subject
from .database import Database, stable_hash


SUBJECT_TYPES = {
	"account",
	"session",
	"device",
	"ip",
	"cidr",
	"asn",
	"email",
	"email_domain",
	"api_key",
	"country",
	"region",
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
		if not display:
			display = ban_subject_display(subject_type, normalized)
		self.database.execute(
			"""INSERT INTO risk_subjects(subject_type, subject_hash, display_value, first_seen_at,
			last_seen_at, last_changed_at) VALUES (?, ?, ?, ?, ?, ?)
			ON CONFLICT(subject_type, subject_hash) DO UPDATE SET
			display_value=excluded.display_value, last_seen_at=excluded.last_seen_at""",
			(subject_type, digest, display[:160], now, now, now),
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
			after = max(0, min(100, before + int(delta)))
			applied_delta = after - before
			connection.execute(
				"""INSERT INTO risk_ledger(id, subject_id, created_at, delta, score_before, score_after,
				reason_code, reason, source, source_ref, actor, expires_at, parent_entry_id, metadata_json)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
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
	) -> dict[str, Any]:
		subject = self.ensure_subject(subject_type, value, display=display)
		baseline = max(0, min(100, int(baseline)))
		previous = int(subject["base_score"])
		delta = baseline - previous
		if delta:
			entry = self._apply(
				int(subject["id"]),
				delta,
				reason_code="ACCOUNT_POSTURE_CHANGED",
				reason="; ".join(reasons)[:300] or "Account security posture changed",
				source="account_sync",
				source_ref=source_ref,
				actor="shield-worker",
				metadata={"baselineBefore": previous, "baselineAfter": baseline},
			)
		else:
			entry = {"delta": 0, "score_after": int(subject["current_score"])}
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
	) -> dict[str, Any]:
		if override_type not in {"adjustment", "score_cap", "score_floor", "rule_exemption", "response_exemption"}:
			raise ValueError("Unsupported override type")
		now = int(time.time())
		expires_at = now + duration_seconds if duration_seconds else None
		ledger_entry_id = None
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
		override_id = self.database.execute(
			"""INSERT INTO risk_overrides(subject_id, override_type, value_integer, scope_host,
			scope_path, scope_rule_id, reason, created_at, created_by, expires_at, ledger_entry_id)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
			(subject_id, override_type, value, scope_host, scope_path, scope_rule_id, reason, now, actor, expires_at, ledger_entry_id),
		)
		return self.database.query("SELECT * FROM risk_overrides WHERE id = ?", (override_id,))[0]

	def revoke_override(self, override_id: int, actor: str, reason: str) -> dict[str, Any]:
		rows = self.database.query(
			"SELECT * FROM risk_overrides WHERE id = ? AND revoked_at IS NULL LIMIT 1", (override_id,)
		)
		if not rows:
			raise ValueError("Active risk override not found")
		override = rows[0]
		now = int(time.time())
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
		return self.database.query("SELECT * FROM risk_overrides WHERE id = ?", (override_id,))[0]

	def active_override(self, subject_id: int, override_type: str, host: str = "", path: str = "") -> dict[str, Any] | None:
		now = int(time.time())
		rows = self.database.query(
			"""SELECT * FROM risk_overrides WHERE subject_id = ? AND override_type = ?
			AND revoked_at IS NULL AND (expires_at IS NULL OR expires_at > ?)
			AND (scope_host IS NULL OR scope_host = ?)
			AND (scope_path IS NULL OR ? GLOB scope_path)
			ORDER BY id DESC LIMIT 1""",
			(subject_id, override_type, now, host, path),
		)
		return rows[0] if rows else None

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

	def effective_score(self, subject: dict[str, Any], host: str = "", path: str = "") -> int:
		score = int(subject["current_score"])
		cap = self.active_override(int(subject["id"]), "score_cap", host, path)
		floor = self.active_override(int(subject["id"]), "score_floor", host, path)
		if cap and cap["value_integer"] is not None:
			score = min(score, int(cap["value_integer"]))
		if floor and floor["value_integer"] is not None:
			score = max(score, int(floor["value_integer"]))
		return max(0, min(100, score))

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
		conditions = ["current_score >= ?"]
		parameters: list[Any] = [minimum_score]
		if subject_type:
			conditions.append("subject_type = ?")
			parameters.append(subject_type)
		if query:
			conditions.append("LOWER(display_value) LIKE ?")
			parameters.append(f"%{query.lower()}%")
		parameters.append(min(500, max(1, limit)))
		return self.database.query(
			f"""SELECT id, subject_type AS subjectType, display_value AS displayValue,
			current_score AS currentScore, risk_level AS riskLevel, first_seen_at AS firstSeenAt,
			last_seen_at AS lastSeenAt, last_changed_at AS lastChangedAt, version
			FROM risk_subjects WHERE {' AND '.join(conditions)}
			ORDER BY current_score DESC, last_changed_at DESC LIMIT ?""",
			parameters,
		)

	def detail(self, subject_id: int) -> dict[str, Any] | None:
		subject = self.subject_by_public_id(subject_id)
		if not subject:
			return None
		ledger = self.database.query(
			"""SELECT id, created_at AS createdAt, delta, score_before AS scoreBefore,
			score_after AS scoreAfter, reason_code AS reasonCode, reason, source, source_ref AS sourceRef,
			actor, expires_at AS expiresAt FROM risk_ledger WHERE subject_id = ?
			ORDER BY created_at DESC, rowid DESC LIMIT 200""",
			(subject_id,),
		)
		overrides = self.database.query(
			"""SELECT id, override_type AS overrideType, value_integer AS value, scope_host AS scopeHost,
			scope_path AS scopePath, reason, created_at AS createdAt, created_by AS createdBy,
			expires_at AS expiresAt, revoked_at AS revokedAt FROM risk_overrides
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
		return {
			"id": subject["id"],
			"subjectType": subject["subject_type"],
			"displayValue": subject["display_value"],
			"currentScore": subject["current_score"],
			"effectiveScore": self.effective_score(subject),
			"riskLevel": subject["risk_level"],
			"firstSeenAt": subject["first_seen_at"],
			"lastSeenAt": subject["last_seen_at"],
			"lastChangedAt": subject["last_changed_at"],
			"ledger": ledger,
			"overrides": overrides,
			"relations": relations,
		}

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
