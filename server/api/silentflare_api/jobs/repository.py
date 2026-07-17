from __future__ import annotations

import json
import sqlite3
import threading
import uuid
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from typing import Any

from ..db.database import Database
from ..db.migrations import migrate_database


def utc_now() -> str:
	return datetime.now(UTC).isoformat().replace("+00:00", "Z")


@dataclass(frozen=True)
class Job:
	id: str
	job_type: str
	payload: dict[str, Any]
	status: str
	attempts: int
	max_attempts: int
	result: dict[str, Any] | None = None
	last_error: str = ""


class JobRepository:
	def __init__(self, database: Database) -> None:
		self.database = database
		self._migrated = False
		self._migration_lock = threading.Lock()

	def _ready(self) -> None:
		if self._migrated:
			return
		with self._migration_lock:
			if not self._migrated:
				migrate_database(self.database.path)
				self._migrated = True

	@staticmethod
	def _job(row: dict[str, Any]) -> Job:
		return Job(
			id=str(row["id"]),
			job_type=str(row["job_type"]),
			payload=json.loads(str(row["payload_json"] or "{}")),
			status=str(row["status"]),
			attempts=int(row["attempts"]),
			max_attempts=int(row["max_attempts"]),
			result=json.loads(str(row["result_json"])) if row.get("result_json") else None,
			last_error=str(row.get("last_error") or ""),
		)

	def enqueue(
		self,
		job_type: str,
		payload: dict[str, Any],
		*,
		idempotency_key: str | None = None,
		max_attempts: int = 3,
	) -> Job:
		self._ready()
		job_id = str(uuid.uuid4())
		now = utc_now()
		try:
			self.database.query(
				"""
				INSERT INTO jobs
					(id, job_type, payload_json, status, idempotency_key, attempts,
					 max_attempts, available_at, created_at, updated_at)
				VALUES (?, ?, ?, 'pending', ?, 0, ?, ?, ?, ?)
				""",
				(
					job_id,
					job_type,
					json.dumps(payload, separators=(",", ":")),
					idempotency_key,
					max_attempts,
					now,
					now,
					now,
				),
			)
		except Exception as exc:
			if not idempotency_key or not isinstance(exc.__cause__, sqlite3.IntegrityError):
				raise
			rows = self.database.query(
				"SELECT * FROM jobs WHERE job_type = ? AND idempotency_key = ? LIMIT 1",
				(job_type, idempotency_key),
			)
			if not rows:
				raise
			return self._job(rows[0])
		return self.get(job_id)  # type: ignore[return-value]

	def get(self, job_id: str) -> Job | None:
		self._ready()
		rows = self.database.query("SELECT * FROM jobs WHERE id = ? LIMIT 1", (job_id,))
		return self._job(rows[0]) if rows else None

	def claim(self, worker_id: str, *, job_id: str | None = None) -> Job | None:
		self._ready()
		with self.database.transaction(immediate=True) as connection:
			params: list[Any] = [utc_now()]
			job_clause = ""
			if job_id:
				job_clause = " AND id = ?"
				params.append(job_id)
			row = connection.execute(
				f"""
				SELECT * FROM jobs
				WHERE status = 'pending' AND available_at <= ?{job_clause}
				ORDER BY created_at
				LIMIT 1
				""",
				params,
			).fetchone()
			if not row:
				return None
			now = utc_now()
			updated = connection.execute(
				"""
				UPDATE jobs
				SET status = 'running', attempts = attempts + 1,
					locked_at = ?, locked_by = ?, updated_at = ?
				WHERE id = ? AND status = 'pending'
				""",
				(now, worker_id, now, str(row["id"])),
			)
			if updated.rowcount != 1:
				return None
			claimed = connection.execute(
				"SELECT * FROM jobs WHERE id = ?", (str(row["id"]),)
			).fetchone()
			return self._job(dict(claimed)) if claimed else None

	def complete(self, job_id: str, result: dict[str, Any]) -> None:
		now = utc_now()
		self.database.query(
			"""
			UPDATE jobs
			SET status = 'completed', result_json = ?, last_error = NULL,
				finished_at = ?, updated_at = ?, locked_at = NULL, locked_by = NULL
			WHERE id = ?
			""",
			(json.dumps(result, separators=(",", ":")), now, now, job_id),
		)

	def fail(self, job: Job, error: str) -> None:
		now = utc_now()
		terminal = job.attempts >= job.max_attempts
		available = (
			(datetime.now(UTC) + timedelta(seconds=min(300, 2 ** max(0, job.attempts - 1))))
			.isoformat()
			.replace("+00:00", "Z")
		)
		self.database.query(
			"""
			UPDATE jobs
			SET status = ?, last_error = ?, available_at = ?, updated_at = ?,
				finished_at = ?, locked_at = NULL, locked_by = NULL
			WHERE id = ?
			""",
			(
				"failed" if terminal else "pending",
				error[:1000],
				available,
				now,
				now if terminal else None,
				job.id,
			),
		)

	def recover_stale(self, stale_after_seconds: int = 600) -> int:
		self._ready()
		cutoff = (
			(datetime.now(UTC) - timedelta(seconds=stale_after_seconds))
			.isoformat()
			.replace("+00:00", "Z")
		)
		with self.database.transaction(immediate=True) as connection:
			cursor = connection.execute(
				"""
				UPDATE jobs
				SET status = 'pending', locked_at = NULL, locked_by = NULL, updated_at = ?
				WHERE status = 'running' AND locked_at < ?
				""",
				(utc_now(), cutoff),
			)
			return cursor.rowcount
