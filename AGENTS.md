# Repository Guidelines

SilentFlareNEXT is an Astro/Fuwari front end for a Ghost Headless CMS. Treat this repository as the final source of truth for the public blog front end. Ghost is external infrastructure and must stay outside this repository.

## Project Structure & Ownership

- `src/components`: Astro/Svelte UI components.
- `src/pages`: public routes, including `/`, `/posts/[slug]/`, `/tags/[tag]/`, `/authors/[author]/`, `/archive/`, `/cms/`, `rss.xml`, and `robots.txt`.
- `src/layouts`: page layout shells and shared front-end scripts.
- `src/lib`: Ghost types, adapter, and Content API client.
- `src/utils`: shared data and URL utilities. Blog data should go through `src/utils/content-utils.ts`, not raw Ghost objects in pages.
- `src/content`: local content schemas and fallback content for UI-only development.
- `src/assets`: imported build-time assets.
- `public`: static public files served as-is.
- `docs`: operational documentation and setup notes.
- `scripts`: local verification and authoring helpers.
- `server/api`: FastAPI custom API used by management surfaces such as Telegram bot management. This is deployed manually to FNS1 under `/opt/silentflare/api`; it is not bundled into the Astro static site.
- `dist`: generated output. Do not edit by hand.
- `ghost-cms`: local Ghost artifacts may exist for experimentation. Do not treat this as production Ghost source and do not wire it into the front end.

## Core Architecture

- Public blog content source: Ghost Content API.
- Public blog renderer: Astro static build.
- Production CMS/admin domain: `cms.silentflare.com`.
- Production public blog domain: `blog.silentflare.com`.
- Ghost owns content only: posts, tags, authors, cover images, SEO metadata, and media under `/content/`.
- Astro owns public rendering, RSS, sitemap, layout, search index, and public route shape.
- Custom management UI route: `/bots/`, also served from `tgbot.silentflare.com` and `tgbotmanagement.silentflare.com`.
- Custom API domain: `api.silentflare.com`, backed by FastAPI on FNS1.
- Ghost Admin API keys are forbidden in this repo. The front end may only use a Ghost Content API key.
- `GHOST_ALLOW_EMPTY=true` is a local or CI fallback for layout/build checks. It must not be used to prove production content integration.

## Custom API And Bot Management

The bot management surface is split across this repo and FNS1 infrastructure:

- Front end source: `src/pages/bots/index.astro`.
- Main bot UI component: `src/components/bots/BotApp.svelte`.
- API source: `server/api/app.py`.
- API requirements: `server/api/requirements.txt`.
- Production API service: `silentflare-api.service`.
- Production API app directory: `/opt/silentflare/api`.
- Production API env file: `/opt/silentflare/api/api.env`.
- Production API bind address: `127.0.0.1:9010`.
- Public API domain: `api.silentflare.com`.
- Bot management domains: `tgbot.silentflare.com` and `tgbotmanagement.silentflare.com`.

The `/bots/` UI is a standalone management console, not the public blog layout. Do not wrap it in `MainGridLayout`, do not show blog nav/sidebar/footer there, and do not add global username/password login.

Current product state:

- `SilentFlare DB Backup` is considered feature-complete for the current phase.
- Future work should default to operations, monitoring, verification, small UI polish, and reliability improvements.
- Avoid large auth, backup, or layout rewrites unless explicitly requested.
- Keep changes to this surface narrowly scoped to `src/components/bots/BotApp.svelte`, `src/pages/bots/index.astro`, `server/api/app.py`, and directly related tests or docs.
- The production UI is intentionally a bot-scoped owner console, not a general multi-user dashboard.

Current bot auth model:

- The UI first loads public bot metadata from `GET /bots`.
- The user selects one bot.
- Each bot has its own auth method via `auth_method`.
- `SilentFlare DB Backup` uses `auth_method=telegram` in production.
- `SilentFlare DB Backup` is the user-facing and canonical bot id. `ghost-db-backup` may still be accepted by the API only as a backwards-compatible alias for older links and checks.
- This bot backs up all databases, not only Ghost content tables. The backup must remain update-proof: schema changes, new tables, new Ghost internals, and future database additions should be fully covered by the same all-database dump path.
- Telegram authorization creates a one-time pending challenge.
- The Telegram bot sends an inline approval button to the fixed Owner account.
- After the Owner approves a login, the API should edit the same Telegram message to show that the approval succeeded and the link is expired. If Telegram's `editMessageText` or `answerCallbackQuery` fails, the webhook must still return `200` after applying the approval state.
- The web UI polls challenge status and receives a bot-scoped session after approval.
- Sessions are bound to `bot_id`; a session for one bot must not authorize another bot.
- Write operations require the session cookie plus `X-CSRF-Token`.

Current fixed Telegram Owner ID:

```text
8737100423
```

Do not generalize Owner ID or share auth across bots unless explicitly requested.

Important FastAPI endpoints:

- `GET /health`: public health check.
- `GET /bots`: public bot list used before login.
- `GET /auth/me`: current session and CSRF, requires session.
- `POST /auth/telegram/start`: starts a Telegram approval challenge for a selected bot.
- `GET /auth/telegram/status/{challenge_id}?bot_id=...`: polls approval and creates the session when approved.
- `POST /telegram/update?token=...`: Telegram webhook receiver for inline button callbacks.
- `GET /bots/{bot_id}/backup/status`: bot-scoped session required.
- `GET /bots/{bot_id}/checks/unified`: bot-scoped session required. Returns a single status payload for API service, bot registry, Telegram auth, backup timer, backup directory, recent backup files, GitHub releases, and optional 2FA.
- `POST /bots/{bot_id}/backup/run`: bot-scoped session and CSRF required, or server-only `X-Admin-Token` fallback.
- `POST /bots/{bot_id}/backup/schedule`: bot-scoped session and CSRF required, or server-only `X-Admin-Token` fallback. Updates the systemd timer interval.

Do not print values from `/opt/silentflare/api/api.env`. Reading variable names and checking whether a key is present is acceptable.

## Environment Variables

Use `.env.example` as the template. Never commit `.env`.

Required production variables:

```env
GHOST_URL=https://cms.silentflare.com
GHOST_CONTENT_API_KEY=<content-api-key>
GHOST_API_VERSION=v5.0
SITE_URL=https://blog.silentflare.com
```

Production FastAPI variables live on FNS1 in `/opt/silentflare/api/api.env`, not in this repo. Known variable names include:

```env
API_ADMIN_TOKEN=<server-only fallback admin token>
TELEGRAM_BOT_TOKEN=<bot token>
TELEGRAM_OWNER_ID=8737100423
TELEGRAM_WEBHOOK_SECRET=<webhook receiver token>
SILENTFLARE_DB_BACKUP_AUTH_METHOD=telegram
# Backwards-compatible legacy name if already present:
GHOST_DB_BACKUP_AUTH_METHOD=telegram
WEB_COOKIE_SECURE=1
WEB_SESSION_TTL=43200
WEB_LOGIN_ATTEMPTS=5
WEB_LOGIN_WINDOW_SECONDS=900
```

Optional per-bot TOTP fallback variables may exist, for example:

```env
BOT_SILENTFLARE_DB_BACKUP_TOTP_SECRET=<totp-secret>
# Backwards-compatible legacy name if already present:
BOT_GHOST_DB_BACKUP_TOTP_SECRET=<totp-secret>
```

Never commit or print any actual values from FastAPI env files.

Optional build-time override variables:

```env
GHOST_REQUEST_HOST=cms.silentflare.com
GHOST_REQUEST_PROTO=https
```

Use these when `GHOST_URL` points at a tunnel or local origin during server-side builds but Ghost still expects its public host/proto headers.

Local UI-only fallback:

```cmd
set GHOST_ALLOW_EMPTY=true
```

When `GHOST_ALLOW_EMPTY=true`, the app may render from local fallback content or empty Ghost responses. That is acceptable for UI checks only.

## Build, Test, And Development Commands

Use pnpm. `preinstall` enforces pnpm.

- `pnpm install`: install dependencies from `pnpm-lock.yaml`.
- `pnpm dev`: start Astro dev server.
- `pnpm lint`: run Biome checks over `src`.
- `pnpm typecheck` or `pnpm check`: run `astro check`.
- `pnpm build`: build static site and Pagefind search index into `dist`.
- `pnpm test:smoke`: verify required generated files exist.
- `pnpm test:smoke:content`: verify generated post, tag, and author routes exist.
- `pnpm verify:ghost`: strict production-style Ghost build plus content route verification.
- `pnpm preview`: preview `dist` locally.
- `pnpm new-post`: run `scripts/new-post.js`.
- `python -m py_compile server\api\app.py`: validate FastAPI syntax locally.

On this Windows machine, `pnpm` may be missing from PATH. Prefer Corepack:

```cmd
corepack pnpm lint
corepack pnpm check
corepack pnpm build
corepack pnpm test:smoke
```

Standard local validation without real Ghost:

```cmd
cmd /c "set GHOST_ALLOW_EMPTY=true&& set GHOST_URL=https://cms.silentflare.com&& set GHOST_CONTENT_API_KEY=placeholder&& set SITE_URL=https://blog.silentflare.com&& corepack pnpm lint&& corepack pnpm check&& corepack pnpm build&& corepack pnpm test:smoke"
```

Strict Ghost validation:

```cmd
corepack pnpm verify:ghost
```

Important: strict Ghost validation requires a reachable `GHOST_URL` and a real Content API key. If local `.env` points to `http://localhost:2368` and local Ghost is not running, `verify:ghost` will fail with `fetch failed`. That is an environment failure, not necessarily a code failure.

## Coding Style

- Biome is the source of truth for formatting and linting.
- Biome expects tabs and double quotes for JavaScript/TypeScript.
- Keep imports sorted. CI fails on unsorted imports.
- Use PascalCase for Astro/Svelte components.
- Use kebab-case for route directories and URL slugs.
- Use descriptive camelCase for functions and variables.
- Keep typed exports in `src/lib` and `src/types`.
- Prefer the existing adapter layer over raw Ghost fields in route/components.
- Avoid broad refactors during deployment/debug tasks. Keep changes scoped.
- Remove debug `console.log` from production front-end paths. Keep `console.error`/`console.warn` only when it reports actionable runtime failure.

## Ghost Data Layer Rules

- `src/lib/ghost.ts` defines normalized Ghost and blog-facing types.
- `src/lib/ghost-client.ts` is the only place that should know Ghost Content API request details.
- `src/lib/ghost-adapter.ts` maps raw Ghost response fields into front-end shapes.
- `src/utils/content-utils.ts` is the public data access layer used by pages and widgets.
- Public routes should call `content-utils`, not Ghost client internals.
- When changing Ghost integration, verify:
  - pagination still works,
  - post routes build,
  - tag routes build,
  - author routes build,
  - RSS still builds,
  - `/cms/` status route still renders,
  - fallback mode still builds with `GHOST_ALLOW_EMPTY=true`.

## Production Deployment: FNS1

Production static deployment runs on FNS1.

Known server:

- Host: `167.233.129.17`
- SSH user: `root`
- SSH key on this Windows machine: `%USERPROFILE%\.ssh\hetzner_cx23`
- App source checkout: `/opt/silentflare/app`
- Deploy config/scripts: `/opt/silentflare/deploy`
- Deploy env: `/opt/silentflare/deploy/deploy.env`
- Deploy script: `/opt/silentflare/deploy/deploy.sh`
- Webhook service: `/opt/silentflare/deploy/webhook-server.mjs`
- Static releases: `/opt/silentflare/blog/releases`
- Active site symlink: `/opt/silentflare/blog/current`
- Deploy log: `/var/log/silentflare-deploy.log`

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

Then it should:

1. load `/opt/silentflare/deploy/deploy.env`,
2. install dependencies with Corepack/pnpm,
3. run `corepack pnpm verify:ghost`,
4. copy `dist` into a timestamped release directory,
5. atomically update `/opt/silentflare/blog/current`,
6. keep only recent releases,
7. append details to `/var/log/silentflare-deploy.log`.

The deploy script only deploys the Astro static site. It does not copy `server/api/app.py` into `/opt/silentflare/api`. When changing `server/api/app.py`, explicitly copy it to FNS1 and restart the API service:

```powershell
$key = Join-Path $env:USERPROFILE '.ssh\hetzner_cx23'
scp -i $key server\api\app.py root@167.233.129.17:/opt/silentflare/api/app.py
ssh -i $key root@167.233.129.17 'systemctl restart silentflare-api.service; systemctl is-active silentflare-api.service'
```

Expected API service status: `active`.

Do not print or commit values from:

- `/opt/silentflare/deploy/deploy.env`
- `/opt/silentflare/api/api.env`
- `/opt/silentflare/deploy/hook-url.txt`
- `/opt/silentflare/deploy/hook-url-origin.txt`
- Ghost Content API key
- deploy webhook token
- Telegram bot token
- Telegram webhook secret
- API admin token

Reading variable names is acceptable. Printing values is not.

## GitHub Actions Deployment

Workflow: `.github/workflows/build.yml`

Expected pipeline:

```text
push main -> build job -> Deploy FNS1 job -> webhook -> FNS1 git reset origin/main -> verify:ghost -> static release
```

The deploy job only runs on `push` to `main`, after the build job succeeds.

Required repository secret:

```text
DEPLOY_WEBHOOK_URL
```

This secret must contain the full origin webhook URL, including token. Do not write the real value to docs, logs, PRs, issues, or committed files.

If GitHub Actions build fails:

1. Check job step names first.
2. If `Run Biome checks` fails, run `corepack pnpm lint` locally.
3. If `Run Astro check` fails, run `corepack pnpm check` locally.
4. If `Build site and search index` fails, run `corepack pnpm build`.
5. If `Verify required build outputs` fails, inspect `scripts/check-built-routes.js` expectations.
6. If `Deploy FNS1` fails after build succeeded, check `DEPLOY_WEBHOOK_URL`, webhook service health, and deploy logs.

GitHub Actions API status check from Windows:

```powershell
curl.exe --ssl-no-revoke -sS "https://api.github.com/repos/SilentFlareGit/SilentFlareNEXT/actions/runs?branch=main&per_page=3"
```

Use `--ssl-no-revoke` on this machine when Windows certificate revocation checking blocks `curl.exe`.

## Production Verification

Verify local Git state:

```powershell
git fetch origin main
git status -sb
git rev-parse HEAD
git rev-parse origin/main
```

Expected: local `HEAD` equals `origin/main`, and worktree status is clean unless you are intentionally carrying local edits.

Verify FNS1 source and active release:

```powershell
$key = Join-Path $env:USERPROFILE '.ssh\hetzner_cx23'
ssh -i $key root@167.233.129.17 'set -Eeuo pipefail; echo HEAD=$(git -C /opt/silentflare/app rev-parse --short HEAD); echo STATUS=$(git -C /opt/silentflare/app status --short | wc -l); echo CURRENT=$(readlink -f /opt/silentflare/blog/current)'
```

Expected:

- `HEAD` matches latest pushed commit.
- `STATUS=0`.
- `CURRENT` points to a release under `/opt/silentflare/blog/releases`.

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

Verify bot management origin and API:

```powershell
$key = Join-Path $env:USERPROFILE '.ssh\hetzner_cx23'
ssh -i $key root@167.233.129.17 'set -Eeuo pipefail; echo HEAD=$(git -C /opt/silentflare/app rev-parse --short HEAD); echo STATUS=$(git -C /opt/silentflare/app status --short | wc -l); echo CURRENT=$(readlink -f /opt/silentflare/blog/current); test -f /opt/silentflare/blog/current/bots/index.html && echo BOTS_FILE=present; curl -sS -o /dev/null -w TGBOT=%{http_code} -H Host:tgbot.silentflare.com http://127.0.0.1/; echo; curl -sS -o /dev/null -w TGBOTMGMT=%{http_code} -H Host:tgbotmanagement.silentflare.com http://127.0.0.1/; echo; curl -sS -o /dev/null -w API_BOTS=%{http_code} -H Host:api.silentflare.com http://127.0.0.1/bots; echo; curl -sS -o /dev/null -w API_STATUS_UNAUTH=%{http_code} -H Host:api.silentflare.com "http://127.0.0.1/bots/SilentFlare%20DB%20Backup/backup/status"; echo'
```

Expected:

- `HEAD` matches latest pushed commit.
- `STATUS=0`.
- `BOTS_FILE=present`.
- `TGBOT=200`.
- `TGBOTMGMT=200`.
- `API_BOTS=200`.
- `API_STATUS_UNAUTH=401`.

Verify bot management public edge:

```powershell
curl.exe --ssl-no-revoke -L -sS -o NUL -w "TGBOT_PUBLIC=%{http_code}\n" https://tgbot.silentflare.com/
curl.exe --ssl-no-revoke -L -sS -o NUL -w "TGBOTMGMT_PUBLIC=%{http_code}\n" https://tgbotmanagement.silentflare.com/
curl.exe --ssl-no-revoke -L -sS -o NUL -w "API_BOTS_PUBLIC=%{http_code}\n" https://api.silentflare.com/bots
```

Expected: all `200`.

Verify deployed `/bots/` content without dumping secrets:

```powershell
$key = Join-Path $env:USERPROFILE '.ssh\hetzner_cx23'
ssh -i $key root@167.233.129.17 @'
python3 - <<'PY'
import json
import urllib.request

html = urllib.request.urlopen(urllib.request.Request("http://127.0.0.1/", headers={"Host": "tgbot.silentflare.com"}), timeout=30).read().decode("utf-8", "replace")
for needle in ["Owner-approved operations", "Send approval request", "login-username", "console"]:
    print(f"PAGE_{needle}=" + str(needle in html))

bots = json.loads(urllib.request.urlopen(urllib.request.Request("http://127.0.0.1/bots", headers={"Host": "api.silentflare.com"}), timeout=30).read().decode())
print("AUTH_METHOD=" + bots["bots"][0]["auth_method"])
PY
'@
```

Expected:

- `PAGE_Owner-approved operations=True`.
- `PAGE_Send approval request=True`.
- `PAGE_login-username=False`.
- `PAGE_console=True`.
- `AUTH_METHOD=telegram`.

To test Telegram approval request creation without printing tokens:

```powershell
$key = Join-Path $env:USERPROFILE '.ssh\hetzner_cx23'
ssh -i $key root@167.233.129.17 @'
python3 - <<'PY'
import json
import urllib.request

payload = json.dumps({"bot_id": "SilentFlare DB Backup"}).encode()
req = urllib.request.Request("http://127.0.0.1:9010/auth/telegram/start", data=payload, method="POST")
req.add_header("Content-Type", "application/json")
with urllib.request.urlopen(req, timeout=60) as resp:
    body = json.loads(resp.read().decode())
print("TG_START=" + str(resp.status) + " CHALLENGE=" + str(bool(body.get("challenge_id"))))
PY
'@
```

Expected: `TG_START=200 CHALLENGE=True`. This sends an approval message to the fixed Owner account.

## Webhook And Ghost Automation

Ghost webhooks should call the origin webhook URL, not the Cloudflare-proxied URL, if Cloudflare challenges block webhook delivery.

Current pattern:

- webhook service listens on `127.0.0.1:9000`,
- Nginx proxies `/hooks/rebuild`,
- Ghost integration webhooks target origin IP URL with token,
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

## Telegram Webhook Automation

Telegram bot login approval depends on a Bot API webhook:

- FastAPI receiver: `POST /telegram/update?token=<TELEGRAM_WEBHOOK_SECRET>`.
- Public receiver URL: `https://api.silentflare.com/telegram/update?token=<TELEGRAM_WEBHOOK_SECRET>`.
- Nginx routes `api.silentflare.com` to FastAPI on `127.0.0.1:9010`.
- Callback data prefix: `sf_login:`.
- Only callback queries from `TELEGRAM_OWNER_ID=8737100423` may approve a challenge.

To check webhook configuration without printing secrets, prefer status-only scripts. Do not paste bot tokens or webhook URLs with tokens into logs or final replies.

If the API app changes and Telegram authorization breaks:

1. Confirm `silentflare-api.service` is active.
2. Confirm `/opt/silentflare/api/api.env` contains the required variable names.
3. Confirm `GET https://api.silentflare.com/bots` returns `auth_method=telegram`.
4. Confirm `POST /auth/telegram/start` returns a challenge.
5. Confirm the Owner Telegram account receives the approval message.
6. Confirm clicking `Approve login` makes the web UI move into the management view.
7. Check API logs for `/telegram/update` failures:
   ```powershell
   $key = Join-Path $env:USERPROFILE '.ssh\hetzner_cx23'
   ssh -i $key root@167.233.129.17 'journalctl -u silentflare-api.service --since=-20min --no-pager | tail -n 160'
   ```
8. If `/telegram/update` returns `500` after approval, inspect whether optional Telegram calls such as `answerCallbackQuery` or `editMessageText` are raising. Those calls must be non-blocking; approval state should be applied before any optional Telegram feedback.
9. If the API service was restarted during a login attempt, refresh the web page and start a new Telegram challenge. Login challenges are in memory and are lost on API restart.

Do not use browser username/password login for this surface.

## SilentFlare DB Backup Bot

The current bot management surface controls SilentFlare DB Backup:

- Bot id/display name: `SilentFlare DB Backup`.
- Legacy API alias: `ghost-db-backup`.
- Scope: complete all-database backup. It must dump all databases with routines, events, triggers, and schema so future Ghost/database updates are covered without changing the backup selector.
- Backup script: `/opt/silentflare/deploy/ghost-db-backup.sh`.
- Backup dir: `/opt/silentflare/backups/ghost-db`.
- Timer: `silentflare-ghost-db-backup.timer`.
- API status endpoint: `GET /bots/SilentFlare%20DB%20Backup/backup/status`.
- API unified check endpoint: `GET /bots/SilentFlare%20DB%20Backup/checks/unified`.
- API trigger endpoint: `POST /bots/SilentFlare%20DB%20Backup/backup/run`.
- API schedule endpoint: `POST /bots/SilentFlare%20DB%20Backup/backup/schedule`.

Current UI expectations:

- The login flow should show Telegram approval as the primary path.
- Authenticator 2FA should only show an input form when 2FA is configured; otherwise show a disabled/not-configured state.
- Do not use green success panels for idle/informational states. Green should be reserved for completed successful operations or transient success toasts.
- The dashboard should be layered by priority: backup controls and schedule first, GitHub/API checks second, latest files below.
- Latest backup files should show both Germany/VPS time and Beijing time.
- The Settings page should keep Authenticator setup under Account security, not as a detached sibling panel.
- The API unified check card should remain available in the dashboard for operations troubleshooting.

Backup trigger requires a bot-scoped web session plus CSRF, unless using the server-only `X-Admin-Token` fallback. The fallback is for internal checks only and must not be exposed in the front end.

To inspect backup status from the server after web login is not available, use status-only checks and avoid printing secrets:

```powershell
$key = Join-Path $env:USERPROFILE '.ssh\hetzner_cx23'
ssh -i $key root@167.233.129.17 'set -Eeuo pipefail; systemctl is-active silentflare-ghost-db-backup.timer; ls -1 /opt/silentflare/backups/ghost-db | tail -n 5'
```

## Rollback

Rollback is symlink-only. Do not delete releases while diagnosing.

```sh
ln -sfn /opt/silentflare/blog/releases/<release-id> /opt/silentflare/blog/current.next
mv -Tf /opt/silentflare/blog/current.next /opt/silentflare/blog/current
```

After rollback, verify:

```sh
readlink -f /opt/silentflare/blog/current
curl -sS -o /dev/null -w 'HOME=%{http_code}\n' -H Host:blog.silentflare.com http://127.0.0.1/
```

## Known Local Machine Notes

- This is a Windows/PowerShell workspace.
- `rg` may not be installed. Use PowerShell `Select-String` or `Get-ChildItem` when needed.
- Avoid recursive scans through `ghost-cms/current/node_modules`; it produces noise and can time out.
- `corepack pnpm` works even when `pnpm` is not on PATH.
- `gh` CLI may be absent. A portable GitHub CLI was previously downloaded under `D:\tmp\bin\gh.exe`; do not assume it is permanent.
- Windows `curl.exe` may fail with certificate revocation errors. Use `--ssl-no-revoke` for status checks.
- PowerShell `Start-Process` can fail in this environment because of duplicate `Path/PATH` environment keys. Prefer direct foreground commands for short checks.
- Background preview servers may be unreliable in the sandbox. If `pnpm preview` is needed, verify that `http://127.0.0.1:4321/` actually responds before claiming browser QA.
- Git writes to `.git` may require elevated approval in restricted mode.
- Browser/IAB may be unavailable. If rendered UI verification is needed and Browser cannot connect, use the best available fallback and clearly state the limitation.

## Known Non-Blocking Warnings

- Browserslist may report stale `caniuse-lite`. This is a maintenance warning, not a deploy blocker.
- Svelte may print `https://svelte.dev/e/experimental_async_ssr` during static generation. It has not blocked builds, but it should be investigated separately if it becomes noisy in CI or masks real errors.
- Local `GHOST_ALLOW_EMPTY=true` builds intentionally print Ghost fallback warnings if Ghost is unreachable.

## Debugging Playbook

When asked to "global debug" or find existing fixable issues:

1. Confirm Git state first:
   - `git status --short`
   - `git fetch origin main`
   - compare `HEAD` and `origin/main`
2. Confirm production state if relevant:
   - FNS1 Git HEAD,
   - active release symlink,
   - origin HTTP status,
   - public Cloudflare status.
3. Run local validation:
   - `corepack pnpm lint`
   - `corepack pnpm check`
   - `corepack pnpm build`
   - `corepack pnpm test:smoke`
4. Search only useful directories:
   - `src`
   - `scripts`
   - `.github`
   - `docs`
5. Look for:
   - `TODO`
   - `FIXME`
   - `console.log`
   - `debugger`
   - `@ts-ignore`
   - stale `@ts-expect-error`
   - warnings from the latest validation output.
6. Fix only clear, low-risk issues unless the user asks for broader refactoring.
7. Re-run validation after each fix set.
8. Commit and push only after checks pass and no secrets are included.

Useful scoped search:

```powershell
Get-ChildItem -Recurse -File src,scripts,.github,docs | Select-String -Pattern 'TODO|FIXME|HACK|XXX|console\.log|debugger|@ts-ignore|@ts-expect-error' -CaseSensitive:$false
```

## Current Debug Cleanup Context

A recent debug pass intentionally made these code cleanups:

- removed production `console.log` noise from Pagefind/search related code,
- removed GitHub card success logging from generated client script,
- changed `Search.svelte` reactive async calls from async IIFEs to `void search(...)`,
- removed an unnecessary `_cssVar` parameter and stale `@ts-expect-error` in the Expressive Code language badge plugin.

If these changes are still uncommitted when you start, do not overwrite them. Validate with:

```cmd
cmd /c "set GHOST_ALLOW_EMPTY=true&& set GHOST_URL=https://cms.silentflare.com&& set GHOST_CONTENT_API_KEY=placeholder&& set SITE_URL=https://blog.silentflare.com&& corepack pnpm lint&& corepack pnpm check&& corepack pnpm build&& corepack pnpm test:smoke"
```

Then commit with:

```text
fix: reduce frontend debug noise
```

## Commit And Pull Request Guidelines

- Follow Conventional Commits, for example:
  - `feat: add Ghost tag archive`
  - `fix: handle empty author metadata`
  - `ci: trigger FNS1 deploy after build`
  - `test: verify generated Ghost content routes`
- Keep each commit scoped to one purpose.
- Before pushing, run the relevant validation set.
- For UI-visible changes, include screenshot evidence when practical.
- For deployment changes, include:
  - commit SHA,
  - GitHub Actions run status,
  - FNS1 HEAD,
  - active release path,
  - origin/public HTTP status.

## Security Rules

- Never commit `.env`.
- Never commit deploy webhook URLs with tokens.
- Never print Ghost Content API keys.
- Never add a Ghost Admin API key to this front end.
- Never expose `DEPLOY_HOOK_TOKEN`.
- Never expose `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, `API_ADMIN_TOKEN`, session cookies, CSRF values, or TOTP secrets.
- Do not paste secrets into GitHub issues, PR comments, logs, docs, or final responses.
- If a command would print a secret, rewrite it to print only key names, masked values, status codes, or file existence.
- Treat Cloudflare challenge pages and webhook URLs as sensitive when tokens are present.
