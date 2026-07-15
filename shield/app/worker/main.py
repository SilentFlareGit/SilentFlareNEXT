from __future__ import annotations

import asyncio
from types import SimpleNamespace

import httpx

from ..config import settings
from ..main import _account_sync_loop, _operations_loop, _risk_signal_loop, build_services


async def run() -> None:
	settings.validate()
	database, geo, rules, access, limiter, entities = build_services(settings)
	application = SimpleNamespace(
		state=SimpleNamespace(
			database=database,
			geo=geo,
			rules=rules,
			access=access,
			limiter=limiter,
			entities=entities,
			client=httpx.AsyncClient(timeout=settings.proxy_timeout_seconds, follow_redirects=False),
		)
	)
	try:
		await asyncio.gather(
			_account_sync_loop(application),
			_operations_loop(application),
			_risk_signal_loop(application),
		)
	finally:
		await application.state.client.aclose()


if __name__ == "__main__":
	asyncio.run(run())
