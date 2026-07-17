from __future__ import annotations

import logging
import os
import socket
import time
from collections.abc import Callable
from typing import Any

from ..core.config import get_settings
from ..db.database import Database
from .repository import Job, JobRepository

Handler = Callable[[dict[str, Any]], dict[str, Any]]


class Worker:
	def __init__(
		self, repository: JobRepository, handlers: dict[str, Handler], worker_id: str
	) -> None:
		self.repository = repository
		self.handlers = handlers
		self.worker_id = worker_id

	def run_once(self, *, job_id: str | None = None) -> Job | None:
		job = self.repository.claim(self.worker_id, job_id=job_id)
		if not job:
			return None
		handler = self.handlers.get(job.job_type)
		if not handler:
			self.repository.fail(job, f"No handler registered for {job.job_type}")
			return job
		try:
			result = handler(job.payload)
		except Exception as exc:
			logging.getLogger("silentflare.jobs").exception("job failed", extra={"job_id": job.id})
			self.repository.fail(job, exc.__class__.__name__)
		else:
			self.repository.complete(job.id, result)
		return job

	def run_forever(self, poll_seconds: float = 1.0) -> None:
		self.repository.recover_stale()
		while True:
			if self.run_once() is None:
				time.sleep(poll_seconds)


def default_handlers() -> dict[str, Handler]:
	from ..domains.bots.service import execute_backup_job

	return {"backup.run": execute_backup_job}


def main() -> None:
	settings = get_settings()
	repository = JobRepository(Database(settings.account_db_path))
	worker_id = f"{socket.gethostname()}:{os.getpid()}"
	Worker(repository, default_handlers(), worker_id).run_forever()


if __name__ == "__main__":
	main()
