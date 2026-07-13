# Agent Security And Secrets Runbook

Use this whenever a task touches credentials, environment variables, webhook URLs, sessions, CSRF, Telegram auth, email auth, TOTP, deployment config, or production logs.

## Security Rules

- Never commit `.env`.
- Never commit deploy webhook URLs with tokens.
- Never print Ghost Content API keys.
- Never add a Ghost Admin API key to this front end.
- Never expose `DEPLOY_HOOK_TOKEN`.
- Never expose Telegram bot tokens, Telegram webhook secrets, API admin tokens, session cookies, CSRF values, verification codes, TOTP secrets, password hashes, salts, or raw account tokens.
- Do not paste secrets into GitHub issues, PR comments, logs, docs, or final responses.
- If a command would print a secret, rewrite it to print only key names, masked values, boolean presence, status codes, or file existence.
- Treat Cloudflare challenge pages and webhook URLs as sensitive when tokens are present.
- Reading variable names and checking whether a key is present is acceptable.

## Production Environment Locations

Production FastAPI variables live on FNS1 in `/opt/silentflare/api/api.env`, not in this repo.

Production deploy variables live on FNS1 in `/opt/silentflare/deploy/deploy.env`, not in this repo.

Do not print values from:

- `/opt/silentflare/deploy/deploy.env`
- `/opt/silentflare/api/api.env`
- `/opt/silentflare/deploy/hook-url.txt`
- `/opt/silentflare/deploy/hook-url-origin.txt`
- Ghost Content API key
- deploy webhook token
- Telegram bot token
- Telegram webhook secret
- API admin token

Status-only checks may print whether variable names are present.

## Required Build-Time Public Variables

Use `.env.example` as the template. Never commit `.env`.

```env
GHOST_URL=https://cms.silentflare.com
GHOST_CONTENT_API_KEY=<content-api-key>
GHOST_API_VERSION=v5.0
SITE_URL=https://blog.silentflare.com
```

## Known FastAPI Variable Names

The following names may be present in `/opt/silentflare/api/api.env`. They are documented for status checks and wiring only; never print their actual values.

```env
API_ADMIN_TOKEN=<server-only fallback admin token>
TELEGRAM_BOT_TOKEN=<bot token>
TELEGRAM_OWNER_ID=<owner-id>
TELEGRAM_WEBHOOK_SECRET=<webhook receiver token>
SILENTFLARE_DB_BACKUP_TELEGRAM_BOT_TOKEN=<db-backup-bot-token>
SILENTFLARE_DB_BACKUP_TELEGRAM_CHAT_ID=<optional-owner-chat-id>
SILENTFLARE_DB_BACKUP_TELEGRAM_WEBHOOK_SECRET=<db-backup-webhook-secret>
SILENTFLARE_DB_BACKUP_TELEGRAM_OWNER_ID=<owner-id>
TELEGRAM_CHAT_BOT_TOKEN=<messages-helper-bot-token>
TELEGRAM_CHAT_BOT_CHAT_ID=<optional-owner-chat-id>
TELEGRAM_CHAT_BOT_WEBHOOK_SECRET=<messages-helper-webhook-secret>
TELEGRAM_CHAT_BOT_OWNER_ID=<owner-id>
SILENTFLARE_DB_BACKUP_AUTH_METHOD=telegram
TELEGRAM_CHAT_BOT_AUTH_METHOD=telegram
GHOST_DB_BACKUP_AUTH_METHOD=telegram
WEB_COOKIE_SECURE=1
WEB_SESSION_TTL=43200
WEB_LOGIN_ATTEMPTS=5
WEB_LOGIN_WINDOW_SECONDS=900
TURNSTILE_SECRET_KEY=<turnstile-secret>
TURNSTILE_EXPECTED_HOSTNAMES=auth.silentflare.com,accounts.silentflare.com,silentflare.com,www.silentflare.com
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
AUTH_TOS_VERSION=<current-version>
AUTH_EMAIL_CODE_TTL=600
AUTH_EMAIL_SEND_COOLDOWN=60
AUTH_EMAIL_SEND_LIMIT=5
AUTH_CODE_ATTEMPT_LIMIT=5
AUTH_FLOW_TTL=1200
CHAT_BOT_WEB_URL=https://tg.silentflare.com
CHAT_BOT_APP_DIR=/root/messages_helper_bot
CHAT_BOT_ENV_FILE=/root/messages_helper_bot/.env
CHAT_BOT_WEB_SERVICE=messages-helper-web
CHAT_BOT_BOT_SERVICE=messages-helper-bot
CHAT_BOT_CONTROL_MODE=ssh
CHAT_BOT_SSH_TARGET=<ssh-target>
CHAT_BOT_SSH_KEY=/opt/silentflare/api/chatbot_vps_key
BOT_SILENTFLARE_DB_BACKUP_TOTP_SECRET=<totp-secret>
BOT_GHOST_DB_BACKUP_TOTP_SECRET=<totp-secret>
```

`WEB_SESSION_TTL` applies to ordinary bot-management sessions. Admin Owner sessions are intentionally hard-coded to an absolute 3600-second lifetime and do not slide on activity. Admin web login is process-local, starts disabled after every API restart, and can only be toggled by the configured Telegram Owner through `/allowweblogin` and `/denyweblogin`; there is no environment variable that bypasses this gate.

`CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_D1_DATABASE_ID`, and `CLOUDFLARE_API_TOKEN` are not required for production account persistence or admin user/comment management. Production accounts/comments use the FNS1 local account database.

## Safe Secret Presence Check Pattern

Prefer commands that reveal only whether variables exist:

```sh
python3 - <<'PY'
from pathlib import Path
names = ["SESSION_SECRET", "AUTH_EMAIL_API_KEY", "TURNSTILE_SECRET_KEY"]
text = Path("/opt/silentflare/api/api.env").read_text()
for name in names:
    print(f"{name}_PRESENT=" + str(any(line.startswith(name + "=") for line in text.splitlines())))
PY
```

Do not print matching lines or full env files.

## Real Email Readiness

`emailConfigured:true` only proves API variables are present. A custom Resend sender such as `verify@auth.silentflare.com` also requires the exact sending domain to be verified in Resend with SPF and DKIM DNS records. Verify real delivery before declaring email ready.
