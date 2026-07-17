from __future__ import annotations

from pathlib import Path

from server.api.silentflare_api.db.database import Database
from server.api.silentflare_api.jobs.repository import JobRepository
from server.api.silentflare_api.jobs.worker import Worker


def test_job_worker_completes_and_deduplicates_jobs(tmp_path: Path) -> None:
	repository = JobRepository(Database(tmp_path / "jobs.db"))
	first = repository.enqueue(
		"example",
		{"value": 3},
		idempotency_key="same-operation",
	)
	second = repository.enqueue(
		"example",
		{"value": 99},
		idempotency_key="same-operation",
	)
	worker = Worker(
		repository,
		{"example": lambda payload: {"result": int(payload["value"]) * 2}},
		"test-worker",
	)

	assert first.id == second.id
	assert worker.run_once(job_id=first.id) is not None
	completed = repository.get(first.id)
	assert completed is not None
	assert completed.status == "completed"
	assert completed.result == {"result": 6}


def test_failed_job_is_released_for_retry(tmp_path: Path) -> None:
	repository = JobRepository(Database(tmp_path / "jobs.db"))
	job = repository.enqueue("failure", {}, max_attempts=2)
	worker = Worker(
		repository,
		{"failure": lambda _payload: (_ for _ in ()).throw(RuntimeError("secret detail"))},
		"test-worker",
	)

	worker.run_once(job_id=job.id)
	failed = repository.get(job.id)
	assert failed is not None
	assert failed.status == "pending"
	assert failed.attempts == 1
	assert failed.last_error == "RuntimeError"
