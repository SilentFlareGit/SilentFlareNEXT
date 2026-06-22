# Auth, Turnstile, And Comments

SilentFlare accounts and comments are served by the FNS1 FastAPI app. Ghost still owns blog content. The FNS1 local account database stores public users, sessions, profiles, and comments keyed by Ghost post slug.

## Environment

Frontend-safe:

```env
PUBLIC_TURNSTILE_SITE_KEY=
```

Backend-only values for `/opt/silentflare/api/api.env`:

```env
TURNSTILE_SECRET_KEY=
TURNSTILE_EXPECTED_HOSTNAMES=accounts.silentflare.com,silentflare.com,www.silentflare.com
# Legacy fallback if TURNSTILE_EXPECTED_HOSTNAMES is unset:
# TURNSTILE_EXPECTED_HOSTNAME=accounts.silentflare.com
SESSION_SECRET=
ACCOUNT_SESSION_COOKIE_NAME=sf_account_session
ACCOUNT_COOKIE_DOMAIN=.silentflare.com
ACCOUNT_SESSION_TTL=2592000
ACCOUNT_DB_PATH=/opt/silentflare/api/account.db
```

`TURNSTILE_SECRET_KEY`, `SESSION_SECRET`, `ACCOUNT_COOKIE_DOMAIN`, and a Turnstile hostname allowlist are required for account runtime configuration. Do not print secrets, raw cookies, or Turnstile tokens.

`CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_D1_DATABASE_ID`, and `CLOUDFLARE_API_TOKEN` are not required for production accounts or comments. The production database is local to FNS1.

## API Surface

The FNS1 FastAPI account and comment endpoints are:

```text
POST /account/auth/register
POST /account/auth/login
POST /account/auth/logout
GET  /account/auth/me
GET  /account/profile
POST /account/profile
GET  /comments?postSlug=...
POST /comments/create
DELETE /comments/{comment_id}
```

`accounts.silentflare.com` calls these through the same-origin `/accounts-api/` proxy. Blog pages call comments through the public API path. `ACCOUNT_COOKIE_DOMAIN=.silentflare.com` lets the HttpOnly account session work across SilentFlare subdomains when needed.

Registration, login, and comment creation must submit a Turnstile token. After Cloudflare siteverify succeeds, the API validates the returned `hostname` against the configured allowlist.

## Local Smoke Test

Run the account/comment smoke test without real Turnstile or production data:

```cmd
corepack pnpm test:smoke:account-comments
```

The test uses a temporary SQLite database and a mocked successful Turnstile response. It verifies:

- registration without Turnstile returns `403`;
- mocked successful Turnstile allows registration and login to proceed;
- mocked successful Turnstile allows authenticated comment creation;
- the comment is written to the local database.

## Manual API Checks

Without a Turnstile token these must fail with `403`:

```cmd
curl.exe --ssl-no-revoke -i -X POST https://accounts.silentflare.com/accounts-api/account/auth/register -H "content-type: application/json" --data "{\"email\":\"a@example.com\",\"username\":\"tester\",\"password\":\"password123\",\"turnstileToken\":\"\"}"
curl.exe --ssl-no-revoke -i -X POST https://accounts.silentflare.com/accounts-api/account/auth/login -H "content-type: application/json" --data "{\"email\":\"a@example.com\",\"password\":\"password123\",\"turnstileToken\":\"\"}"
curl.exe --ssl-no-revoke -i -X POST https://api.silentflare.com/comments/create -H "content-type: application/json" --data "{\"postSlug\":\"123123\",\"content\":\"test\",\"turnstileToken\":\"\"}"
```

Browser test flow:

1. Open a post page.
2. Use the navbar Accounts link, or open `https://accounts.silentflare.com/`.
3. Register or log in through the accounts center.
4. Confirm `/accounts-api/account/auth/me` returns `{ "user": ... }` in the browser network tab on the accounts subsite.
5. Publish a comment from the post comment form.
6. Refresh comments and confirm the comment appears without exposing email.
7. Delete your own comment and confirm it disappears.
8. Log out from the accounts center and confirm `/accounts-api/account/auth/me` returns `{ "user": null }`.

## Security Notes

- Passwords use PBKDF2-SHA256 with random salt.
- Session cookies are HttpOnly, Secure, SameSite=Lax in production.
- The database stores only `session_hash`, never the raw cookie token.
- Comments are stored and rendered as plain text; the frontend does not use unsafe HTML.
- Keep `/opt/silentflare/api/account.db` and `/opt/silentflare/api/api.env` out of the repository.
