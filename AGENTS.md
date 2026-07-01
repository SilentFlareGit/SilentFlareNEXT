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
- Production authentication domain: `auth.silentflare.com`.
- Production account domain: `accounts.silentflare.com`.
- Production custom admin domain: `admin.silentflare.com`.
- Ghost owns content only: posts, tags, authors, cover images, SEO metadata, and media under `/content/`.
- Astro owns public rendering, RSS, sitemap, layout, search index, and public route shape.
- Public login UI route: `/auth/`, served from `auth.silentflare.com`.
- Public account UI route: `/accounts/`, served from `accounts.silentflare.com` for registration, profile, and security settings only.
- Custom admin UI route: `/admin/`, also served from `admin.silentflare.com`.
- Custom management UI route: `/bots/`, also served from `tgbot.silentflare.com` and `tgbotmanagement.silentflare.com`.
- Custom API domain: `api.silentflare.com`, backed by FastAPI on FNS1.
- FastAPI is the only authority allowed to verify credentials, access the account database, issue sessions, refresh sessions, or destroy sessions. Frontends only call API routes.
- Public users share one opaque API-issued session cookie across `.silentflare.com`; bot/admin Owner sessions remain separate and must not be merged with public account sessions.
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

SilentFlare authentication, account, and admin features are split by audience:

- `auth.silentflare.com`: the canonical public-user authentication frontend. It accepts a server-validated `return_url`, runs email-code/password/2FA login, and returns the browser to an allowed SilentFlare subdomain.
- `accounts.silentflare.com`: the only public-user registration frontend, plus authenticated profile and security settings. A normal unauthenticated visit must redirect to Auth; Accounts may render registration only for the explicit `?register=1` entry or an email verification link.
- `admin.silentflare.com`: owner/admin console for public user management and comment management only.
- `api.silentflare.com`: FastAPI backend that supports both surfaces.
- `blog.silentflare.com`: public blog renderer. Do not put account forms or admin data management directly into the blog layout.

Front end sources:

- Auth page: `src/pages/auth/index.astro`.
- Auth app: `src/components/auth/AuthApp.svelte` and `src/components/auth/panels/`.
- Accounts registration shell: `src/components/account/RegistrationApp.svelte`.
- Registration flow: `src/components/auth/panels/RegistrationPanel.svelte`; it is rendered only on Accounts even though it lives with the shared authentication panel primitives.
- Accounts page: `src/pages/accounts/index.astro`.
- Accounts app: `src/components/account/AccountApp.svelte`.
- Accounts is a standalone account workspace. Do not restore the public blog navbar/banner above it; navigation back to the blog should remain a compact in-workspace wordmark.
- Admin page: `src/pages/admin/index.astro`.
- Admin app: `src/components/admin/AdminApp.svelte`.
- Blog navbar account entry: `src/components/auth/UserMenu.svelte`.
- Blog comment login redirect: `src/components/comments/CommentSection.svelte`.

Current account behavior:

- The blog navbar queries `GET /auth/session`; unauthenticated users go to `auth.silentflare.com` with the current URL as `return_url`, while authenticated users go to Accounts.
- Direct unauthenticated visits to Accounts redirect to `auth.silentflare.com` with Accounts as the safe `return_url`. Auth's create-account command navigates to `accounts.silentflare.com/?register=1`; Auth must not render registration itself.
- Comment prompts use the same auth redirect. Comment writes require the all-site session, Turnstile, and `X-CSRF-Token`.
- `return_url` must be HTTPS and its hostname must be exactly `silentflare.com` or end with `.silentflare.com`; credentials, explicit ports, lookalike suffixes, and external hosts fall back to Accounts.
- Login supports email code, email/password, and username/password. Google, GitHub, and Telegram have reserved UI entries and API routes but are unavailable until provider credentials and callback handling are implemented.
- Registration is email-first and runs only on Accounts. A user may keep email-code-only login or set a password and may enable or skip 2FA. Completion redirects to Auth so the new user explicitly signs in; registration never issues a session.
- Users with 2FA enter a database-backed pending login. The API signs the all-site session only after TOTP succeeds.
- Account sessions use an opaque random token in an `HttpOnly`, `Secure`, `SameSite=Lax`, `Domain=.silentflare.com` cookie. The database stores only an HMAC digest. Do not store account tokens in web storage.
- Session-backed writes require the derived CSRF token from `GET /auth/session`. Logout deletes the database session and clears the domain cookie.
- Verification emails contain both a six-digit code and an opaque one-time verification link. Both consume the same verification record, expire together, and cannot be reused. Codes and link tokens are stored only as keyed hashes; never log or return either secret.
- Passwords use PBKDF2-SHA256 with random salts and the iteration count embedded in the stored hash. TOTP secrets are encrypted and authenticated at rest with a key derived from `SESSION_SECRET`.
- TOS acceptance is versioned and written to `tos_acceptances` with timestamp plus hashed request metadata.
- The Accounts profile avatar is uploaded directly to FastAPI as PNG, JPEG, or WebP, limited to 2 MB. The browser must not create a data URL session or write a filesystem/database path itself.
- Managed avatars live under `ACCOUNT_AVATAR_DIR`; the database stores the public API URL. Replacing or deleting a managed avatar removes the previous managed file.
- `display_region`, `display_region_code`, and `display_region_updated_at` are API-owned profile display data. The UI must render them read-only with the country flag and city/country label.
- Region is refreshed from the current request IP when Accounts loads. Prefer Cloudflare location headers; when city/country names are absent, the API may use the configured HTTPS geolocation endpoint. Never accept a user-entered region value.
- IP-derived region must never be used as an authentication, authorization, 2FA, or risk decision.
- Account profile content is stored in local user columns: `display_name`, `avatar_url`, `bio`, `display_region`, and `display_region_code`.

Current admin behavior:

- Admin login uses the existing bot-style owner auth surface through `SilentFlare Admin`.
- Admin supports Telegram bot approval and optional 2FA only.
- If 2FA is not configured, the UI should show it as unavailable instead of presenting a usable 2FA form.
- Admin must not show bot backup, chat, health-dashboard, or unrelated operational controls.
- Admin data actions require the admin session plus `X-CSRF-Token`.
- Admin user records include profile, security-state flags, registration/last-seen timestamps, admin-only registration and last-seen IP audit values, active-session counts, and comment counts. Historical rows show unavailable values until a new login or comment supplies them.
- Raw audit IP values are restricted to the owner-only Admin API. Public account/session/comment responses must never expose them, and Admin responses must never include password hashes, salts, TOTP secrets, session hashes, cookies, or verification secrets.
- `SilentFlare Admin` may intentionally share the DB Backup Telegram bot credentials. Webhook approval must compare the credential set rather than reject a challenge merely because its logical `bot_id` differs.

Important account FastAPI endpoints:

- `GET /auth/session`: public-user session status, profile, CSRF token, runtime flags, and current TOS version.
- `GET /auth/return-url?return_url=...`: server-side safe return URL normalization.
- `POST /auth/login/password`: email-or-username password login with Turnstile; returns pending 2FA instead of a session when required.
- `POST /auth/login/email/request`, `POST /auth/login/email/verify`, and `POST /auth/login/email/verify-link`: rate-limited email login by code or opaque one-time link.
- `POST /auth/2fa/verify`: consume a pending login after TOTP and then issue the domain session.
- `POST /auth/session/refresh`: rotate the opaque session and CSRF token.
- `POST /auth/logout`: destroy either the public account session or the separate bot/admin session according to the presented cookie and CSRF token.
- `GET /auth/oauth/{provider}/start` and `GET /auth/oauth/{provider}/callback`: reserved Google, GitHub, and Telegram routes. They must not issue sessions until a provider is implemented.
- `POST /accounts/register/email/request`, `POST /accounts/register/email/verify`, `POST /accounts/register/email/verify-link`, and `POST /accounts/register/complete`: verified email-first registration by code or opaque one-time link, with optional password and mandatory current TOS acceptance.
- `POST /accounts/register/2fa/start`, `POST /accounts/register/2fa/verify`, and `POST /accounts/register/2fa/skip`: registration onboarding security choice; no session is issued.
- `GET/PATCH /accounts/profile`: read/update authenticated profile. PATCH requires CSRF.
- `POST /accounts/profile/avatar`: upload a CSRF-protected raw PNG/JPEG/WebP avatar, maximum 2 MB.
- `DELETE /accounts/profile/avatar`: clear the profile avatar and remove the previous managed file when applicable.
- `GET /account-avatars/{filename}`: immutable public delivery for managed avatar files.
- `POST /accounts/2fa/setup/start`, `POST /accounts/2fa/setup/verify`, and `POST /accounts/2fa/disable`: authenticated 2FA management with CSRF.
- Legacy `POST /account/auth/register` and `POST /account/auth/login` return `410`; do not re-enable them because they bypass the unified flow.
- `GET /comments?postSlug=...`: public comment list for a Ghost post slug.
- `POST /comments/create`: authenticated public-user comment creation with Turnstile and CSRF.
- `DELETE /comments/{comment_id}`: authenticated public-user soft delete with CSRF for the author or a local `admin` role user.

Important admin FastAPI endpoints:

- `GET /admin/status`: admin session and local account/comment database status.
- `GET /admin/users`: list public users without password hashes or salts.
- `GET /admin/users/{user_id}`: return an owner-only user record plus up to 100 recent comments, including available audit IP metadata but excluding all authentication secrets.
- `POST /admin/users/{user_id}/disable`: soft-disable a user.
- `POST /admin/users/{user_id}/enable`: re-enable a user.
- `POST /admin/users/{user_id}/role`: set `user` or `admin`.
- `GET /admin/comments`: list comments with usernames but not user emails.
- `POST /admin/comments/{comment_id}/delete`: soft-delete a comment.
- `POST /admin/comments/{comment_id}/restore`: restore a soft-deleted comment.

Production Nginx subsite routing on FNS1:

- `auth.silentflare.com/` serves `/opt/silentflare/blog/current/auth/index.html`.
- `accounts.silentflare.com/` serves `/opt/silentflare/blog/current/accounts/index.html`.
- `admin.silentflare.com/` serves `/opt/silentflare/blog/current/admin/index.html`.
- `auth.silentflare.com/auth-api/*` proxies to `http://127.0.0.1:9010/*`.
- `accounts.silentflare.com/accounts-api/*` proxies to `http://127.0.0.1:9010/*`.
- `admin.silentflare.com/admin-api/*` proxies to `http://127.0.0.1:9010/*`.
- All proxy locations should strip their frontend prefix by using `proxy_pass http://127.0.0.1:9010/;`.

Unified-auth deployment additionally requires:

- `migrations/0003_unified_auth.sql` as the schema reference; `ensure_account_db()` applies equivalent idempotent runtime schema changes.
- `migrations/0004_account_avatar_region.sql` for IP-derived region metadata; avatar files stay outside SQLite.
- `/etc/nginx/sites-available/silentflare-auth` with `/auth-api/` proxy.
- `/etc/nginx/sites-available/silentflare-account`.
- `/etc/nginx/sites-available/silentflare-admin` with `/admin-api/` proxy.

Production readiness caveat:

- `GET https://auth.silentflare.com/auth-api/auth/session` must return `configured:true`. `emailConfigured:false` means password/session flows can work but email-code login and registration cannot send mail.
- Real email flows require `AUTH_EMAIL_API_KEY` and `AUTH_EMAIL_FROM` in `/opt/silentflare/api/api.env`. Never substitute log output or a response field for mail delivery.
- A custom Resend sender such as `verify@auth.silentflare.com` also requires the exact sending domain to be verified in Resend with its SPF and DKIM DNS records. `emailConfigured:true` only proves that the API variables are present; verify a real delivery before declaring email ready.

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
TURNSTILE_EXPECTED_HOSTNAMES=auth.silentflare.com,accounts.silentflare.com,silentflare.com,www.silentflare.com
# Backwards-compatible legacy name if TURNSTILE_EXPECTED_HOSTNAMES is unset:
TURNSTILE_EXPECTED_HOSTNAME=accounts.silentflare.com
SESSION_SECRET=<at-least-32-random-characters>
ACCOUNT_SESSION_COOKIE_NAME=sf_account_session
ACCOUNT_COOKIE_DOMAIN=.silentflare.com
ACCOUNT_SESSION_TTL=2592000
ACCOUNT_DB_PATH=/opt/silentflare/api/account.db
ACCOUNT_AVATAR_DIR=/opt/silentflare/api/uploads/avatars
ACCOUNT_AVATAR_PUBLIC_BASE=https://api.silentflare.com/account-avatars
ACCOUNT_AVATAR_MAX_BYTES=2097152
IP_GEOLOCATION_URL_TEMPLATE=https://ipwho.is/{ip}
IP_GEO_CACHE_TTL=86400
AUTH_EMAIL_API_KEY=<resend-compatible-server-key>
AUTH_EMAIL_FROM=verify@auth.silentflare.com
AUTH_EMAIL_API_URL=https://api.resend.com/emails
AUTH_LOGIN_VERIFY_URL=https://auth.silentflare.com/
AUTH_REGISTER_VERIFY_URL=https://accounts.silentflare.com/
AUTH_TOS_VERSION=2026-06-28
AUTH_EMAIL_CODE_TTL=600
AUTH_EMAIL_SEND_COOLDOWN=60
AUTH_EMAIL_SEND_LIMIT=5
AUTH_CODE_ATTEMPT_LIMIT=5
AUTH_FLOW_TTL=1200
```

Legacy `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, and `TELEGRAM_WEBHOOK_SECRET` are DB Backup compatibility fallbacks only. New multi-bot work should use the explicit per-bot variables above.

`CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_D1_DATABASE_ID`, and `CLOUDFLARE_API_TOKEN` are not required for production account persistence or admin user/comment management. Production accounts/comments use the FNS1 local account database. Do not print `TURNSTILE_SECRET_KEY`, `SESSION_SECRET`, `AUTH_EMAIL_API_KEY`, raw cookies, verification codes, TOTP secrets, or tokens. Status-only checks may print whether variable names are present.

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

This secret must contain a deploy webhook URL whose query string still carries the current `token=...` value. GitHub Actions extracts that token and calls the raw origin IP `167.233.129.17` with `Host: blog.silentflare.com` plus the token query parameter so deploys do not depend on stale public/origin URL files or Cloudflare behavior. Do not write the real value to docs, logs, PRs, issues, or committed files.

If GitHub Actions build fails:

1. Check job step names first.
2. If `Run Biome checks` fails, run `corepack pnpm lint` locally.
3. If `Run Astro check` fails, run `corepack pnpm check` locally.
4. If `Build site and search index` fails, run `corepack pnpm build`.
5. If `Verify required build outputs` fails, inspect `scripts/check-built-routes.js` expectations.
6. If `Deploy FNS1` fails after build succeeded, fetch the failed job log, confirm whether `DEPLOY_WEBHOOK_URL` still carries the live token, then check webhook service health and deploy logs.

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

Verify auth/account/admin origin:

```powershell
$key = Join-Path $env:USERPROFILE '.ssh\hetzner_cx23'
ssh -i $key root@167.233.129.17 'set -Eeuo pipefail; test -f /opt/silentflare/blog/current/auth/index.html && echo AUTH_FILE=present; test -f /opt/silentflare/blog/current/accounts/index.html && echo ACCOUNT_FILE=present; test -f /opt/silentflare/blog/current/admin/index.html && echo ADMIN_FILE=present; curl -sS -o /dev/null -w AUTH=%{http_code} -H Host:auth.silentflare.com http://127.0.0.1/; echo; curl -sS -o /dev/null -w ACCOUNT=%{http_code} -H Host:accounts.silentflare.com http://127.0.0.1/; echo; curl -sS -o /dev/null -w ADMIN=%{http_code} -H Host:admin.silentflare.com http://127.0.0.1/; echo; curl -sS -o /tmp/auth-session.txt -w AUTH_SESSION=%{http_code} -H Host:auth.silentflare.com http://127.0.0.1/auth-api/auth/session; echo; cat /tmp/auth-session.txt; echo; curl -sS -o /dev/null -w ADMIN_OPTIONS=%{http_code} -H Host:admin.silentflare.com http://127.0.0.1/admin-api/auth/options; echo'
```

Expected:

- `AUTH_FILE=present`.
- `ACCOUNT_FILE=present`.
- `ADMIN_FILE=present`.
- `AUTH=200`.
- `ACCOUNT=200`.
- `ADMIN=200`.
- `AUTH_SESSION=200`.
- `ADMIN_OPTIONS=200`.
- `AUTH_SESSION` returns `configured:true`; `emailConfigured:true` is additionally required for real email-code login and registration.

Verify auth/account/admin public edge:

```powershell
curl.exe --ssl-no-revoke -L -sS -o NUL -w "AUTH_PUBLIC=%{http_code}\n" https://auth.silentflare.com/
curl.exe --ssl-no-revoke -L -sS -o NUL -w "ACCOUNT_PUBLIC=%{http_code}\n" https://accounts.silentflare.com/
curl.exe --ssl-no-revoke -L -sS -o NUL -w "ADMIN_PUBLIC=%{http_code}\n" https://admin.silentflare.com/
curl.exe --ssl-no-revoke -L -sS -o NUL -w "AUTH_SESSION_PUBLIC=%{http_code}\n" https://auth.silentflare.com/auth-api/auth/session
curl.exe --ssl-no-revoke -L -sS -o NUL -w "ADMIN_OPTIONS_PUBLIC=%{http_code}\n" https://admin.silentflare.com/admin-api/auth/options
```

Expected: all `200`.

Verify unified auth Turnstile failure priority:

```powershell
Set-Content -Path D:\tmp\auth-email-no-turnstile.json -Value '{"email":"a@example.com","turnstile_token":""}' -NoNewline
Set-Content -Path D:\tmp\auth-login-no-turnstile.json -Value '{"email_or_username":"tester","password":"password123","turnstile_token":"","return_url":"https://blog.silentflare.com/"}' -NoNewline
curl.exe --ssl-no-revoke -sS -o NUL -w "REGISTER_EMAIL_NO_TURNSTILE=%{http_code}\n" -X POST "https://accounts.silentflare.com/accounts-api/accounts/register/email/request" -H "content-type: application/json" --data-binary "@D:\tmp\auth-email-no-turnstile.json"
curl.exe --ssl-no-revoke -sS -o NUL -w "AUTH_LOGIN_NO_TURNSTILE=%{http_code}\n" -X POST "https://auth.silentflare.com/auth-api/auth/login/password" -H "content-type: application/json" --data-binary "@D:\tmp\auth-login-no-turnstile.json"
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
- GitHub Actions uses the raw origin IP `167.233.129.17` with `Host: blog.silentflare.com` and the token extracted from `DEPLOY_WEBHOOK_URL`,
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

## Current Unified Auth/Account/Admin Context

Current architecture intentionally makes these changes:

- adds `/auth/` as the only login frontend and keeps `/accounts/` for registration/profile/security;
- routes blog navbar and comment login prompts to Auth with a safe `return_url`;
- makes FastAPI the only session and credential authority and shares one public-user cookie across `.silentflare.com`;
- persists verification, pending-login, onboarding, rate-limit, and TOS state in the FNS1 local database;
- keeps public-user auth separate from bot/admin Owner auth;
- narrowed `admin.silentflare.com` to user and comment management only;
- requires same-origin `auth-api`, `accounts-api`, and `admin-api` proxies;
- adds `migrations/0003_unified_auth.sql` for unified authentication metadata and `migrations/0004_account_avatar_region.sql` for API-owned profile location metadata;

Do not copy the older June 22 deployment identifiers below as current evidence. For each deployment, replace them with fresh checks for:

- pushed commit and successful GitHub Actions run;
- FNS1 source HEAD and active static release;
- active `silentflare-api.service` and direct `/health`;
- Auth/Accounts/Admin origin and public HTTP 200;
- `/auth/session` reports `configured:true`, and `emailConfigured:true` before claiming email login/registration is operational;
- no-token registration and login requests return 403;
- a real inbox delivery plus email verification can complete only when an authorized test address is available. Never expose the code while testing.

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
