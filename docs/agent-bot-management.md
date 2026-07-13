# Agent Bot Management Runbook

Use this when changing `/bots/`, Telegram approval, Telegram Chat Bot console, DB backup bot controls, or bot-management API behavior.

## Surface Ownership

The bot management surface is split across this repo and FNS1 infrastructure:

- Front end source: `src/pages/bots/index.astro`.
- Main bot UI component: `src/components/bots/BotApp.svelte`.
- Shared document shell and visual foundations: `src/layouts/SubsiteLayout.astro`, `src/styles/tokens.css`, and `src/styles/subsites.css`.
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
- Keep changes narrowly scoped to `src/components/bots/`, `src/pages/bots/index.astro`, `server/api/app.py`, and directly related tests or docs.
- Keep the `/bots/` front end componentized. `BotApp.svelte` coordinates API state, sessions, and view routing; feature-specific UI should live in focused components such as `ChatBotConsole.svelte` and `GitHubStatusCard.svelte`.
- The production UI is a bot-scoped owner console, not a general multi-user dashboard.

## Bot Auth Model

- The UI first loads public bot metadata from `GET /bots`.
- The user selects one bot.
- Each bot has its own auth method via `auth_method`.
- `SilentFlare DB Backup` uses `auth_method=telegram` in production.
- `Telegram Chat Bot` also uses `auth_method=telegram` in production, but it must use its own Telegram bot token and webhook secret. Do not reuse the DB Backup Telegram bot token for this bot.
- `SilentFlare DB Backup` is the user-facing and canonical bot id. `ghost-db-backup` may still be accepted by the API only as a backwards-compatible alias.
- `Telegram Chat Bot` is the user-facing bot id for the MessagesHelperBot service. `telegram-chat-bot` and `messages-helper-bot` may be accepted only as backwards-compatible aliases.
- Telegram authorization creates a one-time pending challenge.
- The fixed Owner may send `/allowweblogin` to enable Admin web login and `/denyweblogin` to disable it. Commands are accepted only from the configured Owner ID, including Telegram's `/command@botname` form. Disabling immediately revokes all Admin sessions and pending Admin challenges.
- Admin web-login state is process-local and defaults to disabled whenever `silentflare-api.service` starts or restarts. The Owner must send `/allowweblogin` again after a restart.
- The bot replies after either command. Failure to send that optional confirmation must not undo the state change or make the webhook fail.
- Admin sessions use the same opaque bot-session cookie family but are bound to `SilentFlare Admin`, expire absolutely after one hour, and are never sliding sessions.
- The Telegram bot sends an inline approval button to the fixed Owner account.
- After Owner approval, the API should edit the same Telegram message to show approval success and link expiry.
- If Telegram `editMessageText` or `answerCallbackQuery` fails, the webhook must still return `200` after applying the approval state.
- The web UI polls challenge status and receives a bot-scoped session after approval.
- Sessions are bound to `bot_id`; a session for one bot must not authorize another bot.
- Write operations require the session cookie plus `X-CSRF-Token`.

Do not generalize Owner ID or share auth across bots unless explicitly requested.

## Important FastAPI Endpoints

- `GET /health`: public health check.
- `GET /bots`: public bot list used before login.
- `GET /auth/options?bot_id=...`: public auth capabilities. For `SilentFlare Admin`, it also returns `web_login_enabled` and suppresses login methods while disabled.
- `GET /auth/me`: current session and CSRF, requires session. Disabled or revoked Admin sessions are rejected.
- `POST /auth/telegram/start`: starts a Telegram approval challenge for a selected bot.
- `GET /auth/telegram/status/{challenge_id}?bot_id=...`: polls approval and creates the session when approved.
- `POST /telegram/update?token=...`: Telegram webhook receiver for inline approval callbacks and the Owner-only `/allowweblogin` and `/denyweblogin` commands.
- `GET /bots/{bot_id}/backup/status`: bot-scoped session required.
- `GET /bots/{bot_id}/checks/unified`: bot-scoped session required. Returns status for API service, bot registry, Telegram auth, backup timer, backup directory, recent backup files, GitHub releases, and optional 2FA.
- `POST /bots/{bot_id}/backup/run`: bot-scoped session and CSRF required, or server-only `X-Admin-Token` fallback.
- `POST /bots/{bot_id}/backup/schedule`: bot-scoped session and CSRF required, or server-only `X-Admin-Token` fallback.
- `GET /bots/{bot_id}/chat/state?selected=...`: Telegram Chat Bot console state, bot-scoped session required.
- `POST /bots/{bot_id}/chat/read`: mark a Telegram Chat Bot conversation read.
- `POST /bots/{bot_id}/chat/send`: send a text reply through Telegram Chat Bot.
- `POST /bots/{bot_id}/chat/upload`: send a photo or document through Telegram Chat Bot.
- `GET /bots/{bot_id}/chat/media?message_id=...`: fetch Telegram Chat Bot message media.
- `POST /bots/{bot_id}/chat/command`: run Telegram Chat Bot web commands such as `/status`, `/help`, `/blocked`, `/ban`, and `/reply`.
- `POST /bots/{bot_id}/chat/action`: run contact actions such as ban, pardon, exempt, and unexempt.
- `POST /bots/{bot_id}/chat/settings/bot-notifications`: toggle owner preview notifications for Telegram Chat Bot.

Telegram Chat Bot console in `/bots/` should use the Astro/Svelte management UI, not the legacy `web_static` frontend. The API may reuse existing MessagesHelperBot Python modules on the Chat VPS, but browser access should stay under the tgbot management surface.

Do not print values from `/opt/silentflare/api/api.env`. Reading variable names and checking whether a key is present is acceptable.

## UI Expectations

- Telegram approval is the primary login path.
- Authenticator 2FA should only show an input form when 2FA is configured; otherwise show a disabled/not-configured state.
- Optimize the Telegram Chat Bot console first when improving `/bots/` UI, then improve GitHub/backup status cards.
- Keep management UI structurally layered. Do not turn `BotApp.svelte` back into one large file for all markup.
- Loading states, click feedback, and responsive touch targets are part of the UI contract.
- Prefer lightweight CSS/Svelte interactions; avoid new animation dependencies unless explicitly requested.
- Keep buttons at mobile-friendly hit sizes.
- Do not use green success panels for idle/informational states. Reserve green for completed successful operations or transient success toasts.
- Dashboard priority: backup controls and schedule first, GitHub/API checks second, latest files below.
- Latest backup files should show both Germany/VPS time and Beijing time.
- Settings page should keep Authenticator setup under Account security, not as a detached sibling panel.
- API unified check card should remain available in the dashboard for operations troubleshooting.

## SilentFlare DB Backup Bot

- Bot id/display name: `SilentFlare DB Backup`.
- Legacy API alias: `ghost-db-backup`.
- Scope: complete all-database backup.
- Backup must dump all databases with routines, events, triggers, and schema so future Ghost/database updates are covered without changing the backup selector.
- Backup script: `/opt/silentflare/deploy/ghost-db-backup.sh`.
- Backup dir: `/opt/silentflare/backups/ghost-db`.
- Timer: `silentflare-ghost-db-backup.timer`.
- API status endpoint: `GET /bots/SilentFlare%20DB%20Backup/backup/status`.
- API unified check endpoint: `GET /bots/SilentFlare%20DB%20Backup/checks/unified`.
- API trigger endpoint: `POST /bots/SilentFlare%20DB%20Backup/backup/run`.
- API schedule endpoint: `POST /bots/SilentFlare%20DB%20Backup/backup/schedule`.

Backup trigger requires a bot-scoped web session plus CSRF, unless using the server-only `X-Admin-Token` fallback. The fallback is for internal checks only and must not be exposed in the front end.

Server-side status-only backup check:

```powershell
$key = Join-Path $env:USERPROFILE '.ssh\hetzner_cx23'
ssh -i $key root@167.233.129.17 'set -Eeuo pipefail; systemctl is-active silentflare-ghost-db-backup.timer; ls -1 /opt/silentflare/backups/ghost-db | tail -n 5'
```

## Telegram Webhook Automation

Telegram bot login approval depends on Bot API webhooks. In multi-bot mode each managed Telegram bot must use its own bot token and webhook secret:

- FastAPI receiver: `POST /telegram/update?token=<TELEGRAM_WEBHOOK_SECRET>`.
- Public receiver URL shape: `https://api.silentflare.com/telegram/update?token=<TELEGRAM_WEBHOOK_SECRET>`.
- Nginx routes `api.silentflare.com` to FastAPI on `127.0.0.1:9010`.
- Callback data prefix: `sf_login:`.
- Only callbacks from the configured Owner ID may approve a challenge.

For `Telegram Chat Bot`, use `TELEGRAM_CHAT_BOT_TOKEN` and `TELEGRAM_CHAT_BOT_WEBHOOK_SECRET`. For `SilentFlare DB Backup`, prefer `SILENTFLARE_DB_BACKUP_TELEGRAM_BOT_TOKEN` and `SILENTFLARE_DB_BACKUP_TELEGRAM_WEBHOOK_SECRET`, while older global variables remain compatibility fallbacks.

If Telegram authorization breaks:

1. Confirm `silentflare-api.service` is active.
2. Confirm `/opt/silentflare/api/api.env` contains the required variable names without printing values.
3. Confirm `GET https://api.silentflare.com/bots` returns `auth_method=telegram`.
4. Confirm `POST /auth/telegram/start` returns a challenge.
5. Confirm the Owner Telegram account receives the approval message.
6. Confirm clicking `Approve login` moves the web UI into the management view.
7. Check API logs for `/telegram/update` failures without printing secrets.
8. If `/telegram/update` returns `500` after approval, inspect optional Telegram calls; approval state should be applied before optional Telegram feedback.
9. If the API service restarted during a login attempt, refresh and start a new Telegram challenge because login challenges are in memory.

Do not use browser username/password login for this surface.
