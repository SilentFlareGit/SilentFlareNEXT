# Agent FNS1 Deployment Runbook

Use this only when changing deployment, GitHub Actions, Nginx routing, webhooks, production verification, or rollback. For ordinary UI/code edits, prefer the lightweight validation commands in `AGENTS.md`.

## Production Deployment: FNS1

Production static deployment runs on FNS1.

Known server context:

- Host: `167.233.129.17`.
- SSH user: `root`.
- SSH key on the Windows machine: `%USERPROFILE%\.ssh\hetzner_cx23`.
- App source checkout: `/opt/silentflare/app`.
- Deploy config/scripts: `/opt/silentflare/deploy`.
- Deploy env: `/opt/silentflare/deploy/deploy.env`.
- Deploy script: `/opt/silentflare/deploy/deploy.sh`.
- Webhook service: `/opt/silentflare/deploy/webhook-server.mjs`.
- Static releases: `/opt/silentflare/blog/releases`.
- Active site symlink: `/opt/silentflare/blog/current`.
- API releases: `/opt/silentflare/api/releases`.
- Active API symlink: `/opt/silentflare/api/current`.
- Deploy log: `/var/log/silentflare-deploy.log`.

SSH pattern:

```powershell
$key = Join-Path $env:USERPROFILE '.ssh\hetzner_cx23'
ssh -i $key root@167.233.129.17 '...'
```

The server app directory must be a Git checkout of:

```text
https://github.com/SilentFlareGit/SilentFlareNEXT.git
```

The deploy script must sync GitHub source before every build:

```sh
git fetch --prune origin main
git reset --hard origin/main
```

Then it should load deploy env, install dependencies with Corepack/pnpm, run `corepack pnpm verify:ghost`, copy `dist` into a timestamped release, atomically update `/opt/silentflare/blog/current`, keep only recent releases, and append details to `/var/log/silentflare-deploy.log`.

The deploy script deploys the Astro static site and should invoke the versioned API release installer after syncing the checkout. Do not copy individual Python files into production. Install updated systemd units, then deploy the checked-out commit atomically:

```bash
bash /opt/silentflare/app/server/api/deploy/install-systemd.sh /opt/silentflare/app
bash /opt/silentflare/app/server/api/deploy/install-release.sh \
  /opt/silentflare/app "$(git -C /opt/silentflare/app rev-parse HEAD)"
```

The installer creates an online SQLite backup, applies checksummed migrations, activates `/opt/silentflare/api/current`, restarts the API and durable worker, and waits up to 30 seconds for health. It restores the previous symlink and restarts both services on failure. On the first release-based deployment, an existing real `current` directory is archived as `legacy-current-<timestamp>`. Expected status for both `silentflare-api.service` and `silentflare-api-worker.service`: `active`.

Do not source `/opt/silentflare/api/api.env` in Bash. Secret and password-derived values may contain `$` and must remain literal. The migration CLI accepts `--env-file` and uses dotenv parsing; systemd reads the same file through `EnvironmentFile=`. Because each release venv is built under a temporary path and moved atomically, the API unit must use `current/venv/bin/python -m uvicorn`, not the generated `bin/uvicorn` entry script.

When Blog comment publishing is added or moved to a new hostname, audit `TURNSTILE_EXPECTED_HOSTNAMES` in `/opt/silentflare/api/api.env` without printing secrets or tokens. `blog.silentflare.com` must be allowed for the production Discussion widget, alongside every Auth or Accounts hostname that renders Turnstile. Back up `api.env`, update only the hostname list, restart `silentflare-api.service`, and verify a real authenticated browser publication. A successful widget followed by `Human verification failed` usually means the returned hostname is missing from this allowlist.

Comment changes can span both deployment units. Deploy the backward-compatible API release before activating a client that depends on its endpoint contract. Verify create, edit, reply, folding, and delete only after both versions are active; remove any production test comment when finished.

The deploy script also does not manage Nginx subsite configuration. When account/admin routing changes, update these files manually on FNS1 and test/reload Nginx:

```text
/etc/nginx/sites-available/silentflare-auth
/etc/nginx/sites-available/silentflare-account
/etc/nginx/sites-available/silentflare-admin
```

Expected proxy pattern:

```nginx
location /auth-api/ {
    proxy_pass http://127.0.0.1:9010/;
}

location /accounts-api/ {
    proxy_pass http://127.0.0.1:9010/;
}

location /admin-api/ {
    proxy_pass http://127.0.0.1:9010/;
}
```

After editing Nginx:

```powershell
$key = Join-Path $env:USERPROFILE '.ssh\hetzner_cx23'
ssh -i $key root@167.233.129.17 'nginx -t && systemctl reload nginx'
```

## Shield Perimeter Routing

The five Shield-protected hosts use the versioned FNS1 files under `shield/nginx/fns1`. Public Nginx forwards ordinary traffic to Shield on `127.0.0.1:9080`. Shield forwards blog, accounts, Admin, and CMS HTTP traffic to the internal Nginx origin on `127.0.0.1:9081`, and API traffic to FastAPI on `127.0.0.1:9010`. Never point a Shield upstream at public port 80 or 443; that creates a proxy loop once the edge route is active.

`shield.silentflare.com` is the separate public decision portal. Its versioned Nginx host is `shield/nginx/fns1/silentflare-shield-portal.conf`; it proxies only to the portal role on `127.0.0.1:9083` and must not be added to `SHIELD_UPSTREAMS_JSON` or `SHIELD_CONNECTED_HOSTS`. Admin Shield APIs and assets use the control role on `127.0.0.1:9082`; ordinary protected traffic uses the gateway on `127.0.0.1:9080`. The worker has no listening port. The routing installer enables these routes and rolls them back together if `nginx -t` fails.

After the repository checkout has the intended commit, configure and install with:

```bash
bash /opt/silentflare/app/shield/scripts/configure-fns1-env.sh
bash -lc 'docker compose -f /opt/silentflare/app/shield/docker-compose.split.prod.yml -p silentflare-shield up -d --build --remove-orphans'
bash /opt/silentflare/app/shield/scripts/install-fns1-routing.sh
```

The environment script copies existing host Turnstile settings without printing them. The routing script creates timestamped backups under `/etc/nginx/shield-backups`, runs `nginx -t`, reloads only on success, and restores the previous files on error. Public blog reads have the only process-down fail-open route. Account, API, Admin, and CMS requests fail closed. The custom CMS does not expose Ghost Staff WebSockets, so every public CMS request remains behind Shield.

The routing bundle also installs a recovery-only Ghost Staff proxy on `127.0.0.1:9443`. It is deliberately absent from Shield's host map and every public listener. Operators may reach it only through an authenticated SSH local forward plus a temporary local hostname override for `cms.silentflare.com`; verify the socket remains loopback-bound after every routing install. The public `https://cms.silentflare.com/ghost/` route must continue returning `404`.

When the FastAPI `/internal/shield/*` contract changes, deploy the compatible API release before enabling Shield account-response buttons. Then deploy/rebuild Shield so the signed-command implementation and Shield migrations are active together. Shield 2.0 requires migrations `0009_entity_risk_ledger.sql`, `0010_risk_signal_queue.sql`, and `0011_complete_risk_ledger.sql`; retain an online SQLite backup before applying them.

## GitHub Actions Deployment

Workflow: `.github/workflows/build.yml`

Expected pipeline:

```text
push main -> build job -> Deploy FNS1 job -> webhook -> FNS1 git reset origin/main -> API release -> verify:ghost -> static release
```

The deploy job only runs on `push` to `main`, after the build job succeeds.

Required repository secret:

```text
DEPLOY_WEBHOOK_URL
```

This secret must contain a deploy webhook URL whose query string still carries the current `token=...` value. Do not write the real value to docs, logs, PRs, issues, or committed files.

GitHub Actions API status check from Windows:

```powershell
curl.exe --ssl-no-revoke -sS "https://api.github.com/repos/SilentFlareGit/SilentFlareNEXT/actions/runs?branch=main&per_page=3"
```

Use `--ssl-no-revoke` on this machine when Windows certificate revocation checking blocks `curl.exe`.

If GitHub Actions build fails:

1. Check job step names first.
2. If `Run Biome checks` fails, run `corepack pnpm lint` locally.
3. If `Run Astro check` fails, run `corepack pnpm check` locally.
4. If `Build site and search index` fails, run `corepack pnpm build`.
5. If `Verify required build outputs` fails, inspect `scripts/check-built-routes.js` expectations.
6. If `Deploy FNS1` fails after build succeeded, fetch the failed job log, confirm whether `DEPLOY_WEBHOOK_URL` still carries the live token, then check webhook service health and deploy logs.

## Production Verification

Verify local Git state:

```powershell
git fetch origin main
git status -sb
git rev-parse HEAD
git rev-parse origin/main
```

Expected: local `HEAD` equals `origin/main`, and worktree status is clean unless intentionally carrying local edits.

Verify FNS1 source and active release:

```powershell
$key = Join-Path $env:USERPROFILE '.ssh\hetzner_cx23'
ssh -i $key root@167.233.129.17 'set -Eeuo pipefail; echo HEAD=$(git -C /opt/silentflare/app rev-parse --short HEAD); echo STATUS=$(git -C /opt/silentflare/app status --short | wc -l); echo BLOG_CURRENT=$(readlink -f /opt/silentflare/blog/current); echo API_CURRENT=$(readlink -f /opt/silentflare/api/current)'
```

Expected:

- `HEAD` matches latest pushed commit.
- `STATUS=0`.
- `BLOG_CURRENT` points to a release under `/opt/silentflare/blog/releases`.
- `API_CURRENT` points to the same commit under `/opt/silentflare/api/releases`.
- `silentflare-api.service` and `silentflare-api-worker.service` are active.

Verify migration checksums without exposing environment values:

```powershell
$key = Join-Path $env:USERPROFILE '.ssh\hetzner_cx23'
ssh -i $key root@167.233.129.17 'cd /opt/silentflare/api/current && ./venv/bin/python -m server.api.silentflare_api.db.cli --env-file /opt/silentflare/api/api.env migrate'
```

Expected after a completed release: `MIGRATIONS_APPLIED=none`. This means all known migrations are already recorded and their checksums match.

For cross-origin Blog comments, preflight must return the exact Blog origin plus credentials:

```sh
curl -sS -D - -o /dev/null -X OPTIONS \
  -H 'Origin: https://blog.silentflare.com' \
  -H 'Access-Control-Request-Method: GET' \
  -H 'Access-Control-Request-Headers: X-CSRF-Token' \
  http://127.0.0.1:9010/comments
```

Expected headers include `access-control-allow-origin: https://blog.silentflare.com` and `access-control-allow-credentials: true`.

Verify origin Nginx without Cloudflare:

```powershell
$key = Join-Path $env:USERPROFILE '.ssh\hetzner_cx23'
ssh -i $key root@167.233.129.17 'curl -sS -o /dev/null -w HOME=%{http_code} -H Host:blog.silentflare.com http://127.0.0.1/; echo; curl -sS -o /dev/null -w POST=%{http_code} -H Host:blog.silentflare.com http://127.0.0.1/posts/123123/; echo'
```

Expected: `HOME=200`, `POST=200`.

Verify Cloudflare/public edge:

```powershell
curl.exe --ssl-no-revoke -L -sS -o NUL -w "PUBLIC_HOME=%{http_code}\n" https://blog.silentflare.com/
curl.exe --ssl-no-revoke -L -sS -o NUL -w "PUBLIC_POST=%{http_code}\n" https://blog.silentflare.com/posts/123123/
```

Expected: both `200`.

Verify auth/account/admin origin and public edge only when that surface changed. `AUTH_SESSION` must return `configured:true`; `emailConfigured:true` is additionally required for real email-code login and registration.

Verify bot management origin and API only when `/bots/` or API bot behavior changed. Expected public bot endpoints return `200`, while unauthenticated protected bot status returns `401`.

## Webhook And Ghost Automation

Ghost webhooks should call the origin webhook URL, not the Cloudflare-proxied URL, if Cloudflare challenges block webhook delivery.

Current pattern:

- webhook service listens on `127.0.0.1:9000`,
- Nginx proxies `/hooks/rebuild`,
- Ghost integration webhooks target origin IP URL with token,
- GitHub Actions uses the raw origin IP with `Host: blog.silentflare.com` and the token extracted from `DEPLOY_WEBHOOK_URL`,
- webhook returns `202` for queued deploy.

Trigger from FNS1 without printing token:

```sh
set -a
. /opt/silentflare/deploy/deploy.env
set +a
curl -fsS -o /tmp/silentflare-hook-response.txt -w 'HTTP=%{http_code}\n' "http://127.0.0.1:9000/hooks/rebuild?token=${DEPLOY_HOOK_TOKEN}"
cat /tmp/silentflare-hook-response.txt
```

Do not run this in a way that prints the token.

## Rollback

Static and API rollback are independent symlink operations. Do not delete releases while diagnosing. After changing the API symlink, restart both API units and verify readiness.

```sh
ln -sfn /opt/silentflare/blog/releases/<release-id> /opt/silentflare/blog/current.next
mv -Tf /opt/silentflare/blog/current.next /opt/silentflare/blog/current

ln -sfn /opt/silentflare/api/releases/<commit> /opt/silentflare/api/current.next
mv -Tf /opt/silentflare/api/current.next /opt/silentflare/api/current
systemctl restart silentflare-api.service silentflare-api-worker.service
```

After rollback, verify:

```sh
readlink -f /opt/silentflare/blog/current
curl -sS -o /dev/null -w 'HOME=%{http_code}\n' -H Host:blog.silentflare.com http://127.0.0.1/
readlink -f /opt/silentflare/api/current
systemctl is-active silentflare-api.service silentflare-api-worker.service
curl -fsS http://127.0.0.1:9010/health/ready
```
