# Repository Guidelines

SilentFlareNEXT is an Astro/Fuwari front end for a Ghost Headless CMS. Treat this repository as the final source of truth for the public blog front end. Ghost is external infrastructure and must stay outside this repository.

## Project Structure & Ownership

- `src/components`: Astro/Svelte UI components.
- `src/pages`: public routes, including `/`, `/posts/[slug]/`, `/tags/[tag]/`, `/authors/[author]/`, `/archive/`, `/cms/`, `/accounts/`, `/admin/`, `/bots/`, `rss.xml`, and `robots.txt`.
- `src/layouts`: page layout shells and shared front-end scripts.
- `src/lib`: Ghost types, adapter, and Content API client.
- `src/utils`: shared data and URL utilities. Blog data should go through `src/utils/content-utils.ts`, not raw Ghost objects in pages.
- `src/content`: local content schemas and fallback content for UI-only development.
- `src/assets`: imported build-time assets.
- `public`: static public files served as-is.
- `docs`: operational documentation and setup notes.
- `scripts`: local verification and authoring helpers.
- `migrations`: historical schema references for SilentFlare-owned users, sessions, comments, and account profile fields. Production accounts/comments use the FNS1 local API database, not Cloudflare D1.
- `server/api`: FastAPI custom API used by account, admin, and bot-management surfaces. This is deployed manually to FNS1 under `/opt/silentflare/api`; it is not bundled into the Astro static site.
- `dist`: generated output. Do not edit by hand.
- `ghost-cms`: local Ghost artifacts may exist for experimentation. Do not treat this as production Ghost source and do not wire it into the front end.

## Core Architecture

- Public blog content source: Ghost Content API.
- Public blog renderer: Astro static build.
- Production CMS/admin domain: `cms.silentflare.com`.
- Production public blog domain: `blog.silentflare.com`.
- Production account domain: `accounts.silentflare.com`.
- Production custom admin domain: `admin.silentflare.com`.
- Ghost owns content only: posts, tags, authors, cover images, SEO metadata, and media under `/content/`.
- Astro owns public rendering, RSS, sitemap, layout, search index, and public route shape.
- Public account UI route: `/accounts/`, also served from `accounts.silentflare.com`.
- Custom admin UI route: `/admin/`, also served from `admin.silentflare.com`.
- Custom management UI route: `/bots/`, also served from `tgbot.silentflare.com` and `tgbotmanagement.silentflare.com`.
- Custom API domain: `api.silentflare.com`, backed by FastAPI on FNS1.
- The FNS1 local account database owns SilentFlare public users, sessions, comments, and account profile fields. Ghost does not own this data.
- Second managed bot: `Telegram Chat Bot`, backed by the separate MessagesHelperBot service on the Telegram Chat VPS.
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
- Keep changes to this surface narrowly scoped to `src/components/bots/`, `src/pages/bots/index.astro`, `server/api/app.py`, and directly related tests or docs.
- Keep the `/bots/` front end componentized. `BotApp.svelte` should coordinate API state, sessions, and view routing; feature-specific UI should live in smaller components such as `ChatBotConsole.svelte` and `GitHubStatusCard.svelte`.
- The production UI is intentionally a bot-scoped owner console, not a general multi-user dashboard.

Current bot auth model:

- The UI first loads public bot metadata from `GET /bots`.
- The user selects one bot.
- Each bot has its own auth method via `auth_method`.
- `SilentFlare DB Backup` uses `auth_method=telegram` in production.
- `Telegram Chat Bot` also uses `auth_method=telegram` in production, but it must use its own Telegram bot token and webhook secret. Do not reuse the DB Backup Telegram bot token for this bot.
- `SilentFlare DB Backup` is the user-facing and canonical bot id. `ghost-db-backup` may still be accepted by the API only as a backwards-compatible alias for older links and checks.
- `Telegram Chat Bot` is the user-facing bot id for the MessagesHelperBot service. `telegram-chat-bot` and `messages-helper-bot` may be accepted only as backwards-compatible aliases.
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
- `GET /bots/{bot_id}/chat/state?selected=...`: Telegram Chat Bot console state, bot-scoped session required.
- `POST /bots/{bot_id}/chat/read`: mark a Telegram Chat Bot conversation read, bot-scoped session and CSRF required.
- `POST /bots/{bot_id}/chat/send`: send a text reply through Telegram Chat Bot, bot-scoped session and CSRF required.
- `POST /bots/{bot_id}/chat/upload`: send a photo or document through Telegram Chat Bot, bot-scoped session and CSRF required.
- `GET /bots/{bot_id}/chat/media?message_id=...`: fetch Telegram Chat Bot message media, bot-scoped session required.
- `POST /bots/{bot_id}/chat/command`: run Telegram Chat Bot web commands such as `/status`, `/help`, `/blocked`, `/ban`, and `/reply`, bot-scoped session and CSRF required.
- `POST /bots/{bot_id}/chat/action`: run contact actions such as ban, pardon, exempt, and unexempt, bot-scoped session and CSRF required.
- `POST /bots/{bot_id}/chat/settings/bot-notifications`: toggle owner preview notifications for Telegram Chat Bot, bot-scoped session and CSRF required.

The Telegram Chat Bot console in `/bots/` should use the Astro/Svelte management UI, not the legacy `web_static` frontend. The API may reuse the existing MessagesHelperBot Python modules on the Chat VPS, but browser access should stay under the tgbot management surface.

Do not print values from `/opt/silentflare/api/api.env`. Reading variable names and checking whether a key is present is acceptable.

## Account And Admin Surfaces

SilentFlare account and admin features are split by audience:

- `accounts.silentflare.com`: public user accounts center for login, registration, logout, avatar URL, display name, and bio/profile updates.
- `admin.silentflare.com`: owner/admin console for public user management and comment management only.
- `api.silentflare.com`: FastAPI backend that supports both surfaces.
- `blog.silentflare.com`: public blog renderer. Do not put account forms or admin data management directly into the blog layout.

Front end sources:

- Accounts page: `src/pages/accounts/index.astro`.
- Accounts app: `src/components/account/AccountApp.svelte`.
- Admin page: `src/pages/admin/index.astro`.
- Admin app: `src/components/admin/AdminApp.svelte`.
- Blog navbar account entry: `src/components/auth/UserMenu.svelte`.
- Blog comment login redirect: `src/components/comments/CommentSection.svelte`.

Current account behavior:

- The blog navbar shows an Accounts link, not an inline login/register modal.
- Comment prompts link to `/accounts/?next=<current-path>` so account login/registration can return users to the article.
- Account login and registration require Cloudflare Turnstile.
- Account sessions use HttpOnly cookies. Do not store account tokens in `localStorage`.
- Account passwords use PBKDF2-SHA256 and random salts. Do not add bcrypt, native SQLite, or Node-only password packages.
- Account profile content is stored in local user columns: `display_name`, `avatar_url`, and `bio`.

Current admin behavior:

- Admin login uses the existing bot-style owner auth surface through `SilentFlare Admin`.
- Admin supports Telegram bot approval and optional 2FA only.
- If 2FA is not configured, the UI should show it as unavailable instead of presenting a usable 2FA form.
- Admin must not show bot backup, chat, health-dashboard, or unrelated operational controls.
- Admin data actions require the admin session plus `X-CSRF-Token`.

Important account FastAPI endpoints:

- `POST /account/auth/register`: register a public user, verify Turnstile action `register`, create a local session, set HttpOnly account cookie.
- `POST /account/auth/login`: verify Turnstile action `login`, validate password, create a local session, set HttpOnly account cookie.
- `POST /account/auth/logout`: delete the local session hash when possible and clear the account cookie.
- `GET /account/auth/me`: return `{ "user": null }` or the current user. If FNS1 account runtime config is incomplete, returns `configured:false`.
- `GET /account/profile`: current authenticated user profile.
- `POST /account/profile`: update `display_name`, `avatar_url`, and `bio`.
- `GET /comments?postSlug=...`: public comment list for a Ghost post slug.
- `POST /comments/create`: authenticated public-user comment creation with Turnstile action `comment`.
- `DELETE /comments/{comment_id}`: authenticated public-user soft delete for the author or a local `admin` role user.

Important admin FastAPI endpoints:

- `GET /admin/status`: admin session and local account/comment database status.
- `GET /admin/users`: list public users without password hashes or salts.
- `POST /admin/users/{user_id}/disable`: soft-disable a user.
- `POST /admin/users/{user_id}/enable`: re-enable a user.
- `POST /admin/users/{user_id}/role`: set `user` or `admin`.
- `GET /admin/comments`: list comments with usernames but not user emails.
- `POST /admin/comments/{comment_id}/delete`: soft-delete a comment.
- `POST /admin/comments/{comment_id}/restore`: restore a soft-deleted comment.

Production Nginx subsite routing on FNS1:

- `accounts.silentflare.com/` serves `/opt/silentflare/blog/current/accounts/index.html`.
- `admin.silentflare.com/` serves `/opt/silentflare/blog/current/admin/index.html`.
- `accounts.silentflare.com/accounts-api/*` proxies to `http://127.0.0.1:9010/*`.
- `admin.silentflare.com/admin-api/*` proxies to `http://127.0.0.1:9010/*`.
- Both proxy locations should strip the prefix by using `proxy_pass http://127.0.0.1:9010/;`.

The latest known account/admin deployment added:

- `migrations/0002_user_profile.sql`.
- `/etc/nginx/sites-available/silentflare-account`.
- `/etc/nginx/sites-available/silentflare-admin` with `/admin-api/` proxy.

Known current production caveat:

- If `GET https://accounts.silentflare.com/accounts-api/account/auth/me` returns `{"user":null,"configured":false}`, FNS1 is missing account runtime configuration in `/opt/silentflare/api/api.env`.
- In that state, Accounts pages and proxies are live, and no-token Turnstile checks still return `403`, but real registration/login/profile persistence cannot work until Turnstile, session, cookie-domain, and hostname allowlist variables are configured.

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
SILENTFLARE_DB_BACKUP_TELEGRAM_BOT_TOKEN=<db-backup-bot-token>
SILENTFLARE_DB_BACKUP_TELEGRAM_CHAT_ID=<optional-owner-chat-id>
SILENTFLARE_DB_BACKUP_TELEGRAM_WEBHOOK_SECRET=<db-backup-webhook-secret>
SILENTFLARE_DB_BACKUP_TELEGRAM_OWNER_ID=8737100423
TELEGRAM_CHAT_BOT_TOKEN=<messages-helper-bot-token>
TELEGRAM_CHAT_BOT_CHAT_ID=<optional-owner-chat-id>
TELEGRAM_CHAT_BOT_WEBHOOK_SECRET=<messages-helper-webhook-secret>
TELEGRAM_CHAT_BOT_OWNER_ID=8737100423
SILENTFLARE_DB_BACKUP_AUTH_METHOD=telegram
TELEGRAM_CHAT_BOT_AUTH_METHOD=telegram
# Backwards-compatible legacy name if already present:
GHOST_DB_BACKUP_AUTH_METHOD=telegram
WEB_COOKIE_SECURE=1
WEB_SESSION_TTL=43200
WEB_LOGIN_ATTEMPTS=5
WEB_LOGIN_WINDOW_SECONDS=900

# Account/admin local database and Turnstile support for FNS1 FastAPI:
TURNSTILE_SECRET_KEY=<turnstile-secret>
TURNSTILE_EXPECTED_HOSTNAMES=accounts.silentflare.com,silentflare.com,www.silentflare.com
# Backwards-compatible legacy name if TURNSTILE_EXPECTED_HOSTNAMES is unset:
TURNSTILE_EXPECTED_HOSTNAME=accounts.silentflare.com
SESSION_SECRET=<at-least-32-random-characters>
ACCOUNT_SESSION_COOKIE_NAME=sf_account_session
ACCOUNT_COOKIE_DOMAIN=.silentflare.com
ACCOUNT_SESSION_TTL=2592000
ACCOUNT_DB_PATH=/opt/silentflare/api/account.db
```

Legacy `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, and `TELEGRAM_WEBHOOK_SECRET` are DB Backup compatibility fallbacks only. New multi-bot work should use the explicit per-bot variables above.

`CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_D1_DATABASE_ID`, and `CLOUDFLARE_API_TOKEN` are not required for production account persistence or admin user/comment management. Production accounts/comments use the FNS1 local account database. Do not print `TURNSTILE_SECRET_KEY`, `SESSION_SECRET`, raw cookies, or tokens. Status-only checks may print whether variable names are present.

Telegram Chat Bot remote-control variables for FNS1 API:

```env
CHAT_BOT_WEB_URL=https://tg.silentflare.com
CHAT_BOT_APP_DIR=/root/messages_helper_bot
CHAT_BOT_ENV_FILE=/root/messages_helper_bot/.env
CHAT_BOT_WEB_SERVICE=messages-helper-web
CHAT_BOT_BOT_SERVICE=messages-helper-bot
CHAT_BOT_CONTROL_MODE=ssh
CHAT_BOT_SSH_TARGET=root@82.139.205.79
CHAT_BOT_SSH_KEY=/opt/silentflare/api/chatbot_vps_key
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

Account/comment local smoke test:

```cmd
corepack pnpm test:smoke:account-comments
```

This uses a temporary local database and mocked Turnstile success. It must verify that missing Turnstile returns `403` and mocked successful Turnstile can proceed through registration, login, and comment creation.

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

The deploy script also does not manage Nginx subsite configuration. When account/admin routing changes, update these files manually on FNS1 and test/reload Nginx:

```text
/etc/nginx/sites-available/silentflare-account
/etc/nginx/sites-available/silentflare-admin
```

Expected account/admin routing:

```nginx
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

Verify account/admin origin:

```powershell
$key = Join-Path $env:USERPROFILE '.ssh\hetzner_cx23'
ssh -i $key root@167.233.129.17 'set -Eeuo pipefail; test -f /opt/silentflare/blog/current/accounts/index.html && echo ACCOUNT_FILE=present; test -f /opt/silentflare/blog/current/admin/index.html && echo ADMIN_FILE=present; curl -sS -o /dev/null -w ACCOUNT=%{http_code} -H Host:accounts.silentflare.com http://127.0.0.1/; echo; curl -sS -o /dev/null -w ADMIN=%{http_code} -H Host:admin.silentflare.com http://127.0.0.1/; echo; curl -sS -o /tmp/account-me.txt -w ACCOUNT_ME=%{http_code} -H Host:accounts.silentflare.com http://127.0.0.1/accounts-api/account/auth/me; echo; cat /tmp/account-me.txt; echo; curl -sS -o /dev/null -w ADMIN_OPTIONS=%{http_code} -H Host:admin.silentflare.com http://127.0.0.1/admin-api/auth/options; echo'
```

Expected:

- `ACCOUNT_FILE=present`.
- `ADMIN_FILE=present`.
- `ACCOUNT=200`.
- `ADMIN=200`.
- `ACCOUNT_ME=200`.
- `ADMIN_OPTIONS=200`.
- `ACCOUNT_ME` returns `configured:true` once FNS1 has Turnstile/session/cookie-domain/hostname variables; `configured:false` means the page/proxy is up but account runtime configuration is incomplete.

Verify account/admin public edge:

```powershell
curl.exe --ssl-no-revoke -L -sS -o NUL -w "ACCOUNT_PUBLIC=%{http_code}\n" https://accounts.silentflare.com/
curl.exe --ssl-no-revoke -L -sS -o NUL -w "ADMIN_PUBLIC=%{http_code}\n" https://admin.silentflare.com/
curl.exe --ssl-no-revoke -L -sS -o NUL -w "ACCOUNT_ME_PUBLIC=%{http_code}\n" https://accounts.silentflare.com/accounts-api/account/auth/me
curl.exe --ssl-no-revoke -L -sS -o NUL -w "ADMIN_OPTIONS_PUBLIC=%{http_code}\n" https://admin.silentflare.com/admin-api/auth/options
```

Expected: all `200`.

Verify account Turnstile failure priority:

```powershell
Set-Content -Path D:\tmp\account-register-no-turnstile.json -Value '{"email":"a@example.com","username":"tester","password":"password123","turnstileToken":""}' -NoNewline
Set-Content -Path D:\tmp\account-login-no-turnstile.json -Value '{"email":"a@example.com","password":"password123","turnstileToken":""}' -NoNewline
curl.exe --ssl-no-revoke -sS -o NUL -w "ACCOUNT_REGISTER_NO_TURNSTILE=%{http_code}\n" -X POST "https://accounts.silentflare.com/accounts-api/account/auth/register" -H "content-type: application/json" --data-binary "@D:\tmp\account-register-no-turnstile.json"
curl.exe --ssl-no-revoke -sS -o NUL -w "ACCOUNT_LOGIN_NO_TURNSTILE=%{http_code}\n" -X POST "https://accounts.silentflare.com/accounts-api/account/auth/login" -H "content-type: application/json" --data-binary "@D:\tmp\account-login-no-turnstile.json"
```

Expected: both `403`, even if account runtime configuration is incomplete.

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

Telegram bot login approval depends on Bot API webhooks. In multi-bot mode each managed Telegram bot must use its own bot token and webhook secret:

- FastAPI receiver: `POST /telegram/update?token=<TELEGRAM_WEBHOOK_SECRET>`.
- Public receiver URL: `https://api.silentflare.com/telegram/update?token=<TELEGRAM_WEBHOOK_SECRET>`.
- Nginx routes `api.silentflare.com` to FastAPI on `127.0.0.1:9010`.
- Callback data prefix: `sf_login:`.
- Only callback queries from `TELEGRAM_OWNER_ID=8737100423` may approve a challenge.

For `Telegram Chat Bot`, use `TELEGRAM_CHAT_BOT_TOKEN` and `TELEGRAM_CHAT_BOT_WEBHOOK_SECRET`; the webhook URL shape stays the same but the token query parameter must be that bot's own webhook secret. For `SilentFlare DB Backup`, prefer `SILENTFLARE_DB_BACKUP_TELEGRAM_BOT_TOKEN` and `SILENTFLARE_DB_BACKUP_TELEGRAM_WEBHOOK_SECRET`, while the older global variables remain compatibility fallbacks.

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
- Optimize the Telegram Chat Bot console first when improving `/bots/` UI, then improve GitHub/backup status cards.
- Keep the management UI structurally layered. Do not turn `BotApp.svelte` back into a single large file for all markup; add focused components under `src/components/bots/` for distinct surfaces.
- Loading states, click feedback, and responsive touch targets are part of the UI contract. Prefer lightweight CSS/Svelte interactions, avoid new animation dependencies unless explicitly requested, and keep buttons at mobile-friendly hit sizes.
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

## Current Account/Admin Context

Recent account/admin work intentionally made these changes:

- added the `/accounts/` standalone Svelte accounts center and `accounts.silentflare.com` routing;
- moved blog navbar login/registration entry points to the Accounts link instead of the old inline auth modal;
- changed comment unauthenticated prompts to link to `/accounts/?next=<current-path>`;
- deleted the old `AuthModal.svelte`, `LoginForm.svelte`, and `RegisterForm.svelte` components;
- added FNS1 FastAPI account endpoints under `/account/auth/*` and `/account/profile`;
- narrowed `admin.silentflare.com` to user and comment management only;
- added same-origin `accounts-api` and `admin-api` proxy expectations;
- added `migrations/0002_user_profile.sql` for `display_name`, `avatar_url`, and `bio`.

Known live state after the last deployment:

- GitHub Actions run `27933470944` completed successfully for `f4f9583`.
- FNS1 static checkout was manually deployed to `f4f9583`.
- Active release was `/opt/silentflare/blog/releases/20260622T061853Z`.
- `accounts.silentflare.com`, `admin.silentflare.com`, `blog.silentflare.com`, and `api.silentflare.com/health` returned public `200`.
- `accounts.silentflare.com/accounts-api/account/auth/me` returned `configured:false` because FNS1 still lacked account runtime variables in `/opt/silentflare/api/api.env`.
- No-token account register/login checks returned `403`.

If continuing this work, first add the missing Turnstile/session/cookie-domain/hostname variables to FNS1 without printing values. After that, retest real account registration, login, profile save, admin user listing, and admin comment listing.

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
