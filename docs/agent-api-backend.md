# Agent API Backend Runbook

Use this runbook for the FastAPI application, account database, migrations, background jobs, and API deployment. Shield remains an independent service; preserve the `/internal/shield/*` contract but do not move Shield policy or gateway logic into this package.

## Architecture

- `server/api/app.py` is a compatibility entry point only.
- `server/api/silentflare_api/main.py` owns the application factory, lifespan, middleware, router registration, and health endpoints.
- `server/api/silentflare_api/core` owns validated environment settings and structured logging.
- `server/api/silentflare_api/db` owns SQLite connections, transactions, migrations, online backup, bot state, and durable job persistence.
- `server/api/silentflare_api/domains/<domain>/router.py` binds HTTP requests and responses.
- `server/api/silentflare_api/domains/<domain>/service.py` owns domain behavior.
- `server/api/silentflare_api/integrations` owns outbound HTTP, email, Turnstile, Telegram, and geolocation adapters.
- `server/api/silentflare_api/jobs` owns the persistent job queue and worker.
- `server/api/silentflare_api/runtime.py` is a temporary compatibility layer for shared legacy helpers. Do not add routes, direct environment reads, or new persistence behavior there.

FastAPI remains the only authority for public credentials, sessions, profiles, comments, Admin actions, and Bot management. Ghost remains external and content-only. Cloudflare D1 and Pages Functions are not production persistence or runtime paths.

## Database Rules

SQL files under `server/api/migrations` are the canonical forward-only schema history. Startup and the deployment installer apply pending migrations under a SQLite write lock and record each migration checksum in `schema_migrations`. Never edit an already deployed migration; add a new numbered migration.

Use the shared database helpers so every connection receives WAL mode, a busy timeout, foreign-key enforcement, and deterministic close/rollback behavior. Store only hashes of public and Bot session tokens. Jobs and interactive Bot challenges must survive API and worker restarts.

## Local Validation

From the repository root:

```powershell
server\api\.venv\Scripts\python.exe -m ruff check --config server\api\pyproject.toml server\api\app.py server\api\silentflare_api server\api\tests scripts\smoke-account-comments.py scripts\test-admin-web-login.py
server\api\.venv\Scripts\python.exe -m compileall -q server\api\app.py server\api\silentflare_api
server\api\.venv\Scripts\python.exe -m pytest -c server\api\pyproject.toml server\api\tests
server\api\.venv\Scripts\python.exe scripts\smoke-account-comments.py
server\api\.venv\Scripts\python.exe scripts\test-admin-web-login.py
```

The tests must cover migration upgrade, health/readiness, public Auth and comment contracts, hashed Bot state across restart, job retry/state transitions, and integration failure behavior.

## Production Deployment

API releases are immutable directories under `/opt/silentflare/api/releases/<commit>`. `/opt/silentflare/api/current` is changed atomically only after dependencies install, an online database backup succeeds, and migrations complete.

Install or update the systemd units once per unit-file change:

```bash
bash /opt/silentflare/app/server/api/deploy/install-systemd.sh /opt/silentflare/app
```

Deploy the checked-out commit:

```bash
bash /opt/silentflare/app/server/api/deploy/install-release.sh \
  /opt/silentflare/app "$(git -C /opt/silentflare/app rev-parse HEAD)"
```

The installer restarts both `silentflare-api.service` and `silentflare-api-worker.service`, checks liveness and readiness, and restores the previous `current` symlink if activation fails. It never prints environment values.

Verify `/health/live`, `/health/ready`, both systemd units, the active `REVISION`, and representative public/unauthenticated contracts after deployment.
