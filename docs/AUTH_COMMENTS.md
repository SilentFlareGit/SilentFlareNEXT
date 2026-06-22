# Auth, Turnstile, And Comments

This repo now includes Cloudflare Pages Functions for account sessions and post comments. Ghost still owns blog content; D1 only stores public-site users, sessions, and comments keyed by Ghost post slug.

## Environment

Frontend-safe:

```env
PUBLIC_TURNSTILE_SITE_KEY=
```

Backend-only:

```env
TURNSTILE_SECRET_KEY=
TURNSTILE_EXPECTED_HOSTNAME=blog.silentflare.com
SESSION_COOKIE_NAME=sf_session
SESSION_SECRET=
ACCOUNT_SESSION_COOKIE_NAME=sf_account_session
ACCOUNT_COOKIE_DOMAIN=.silentflare.com
```

Cloudflare binding:

```text
DB -> D1 database silentflare-next
```

Optional FNS1 FastAPI admin-console variables:

```env
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_D1_DATABASE_ID=
CLOUDFLARE_API_TOKEN=
```

These are backend-only. They allow `account.silentflare.com` to handle user accounts and `admin.silentflare.com` to manage public users and comments through `api.silentflare.com` without exposing D1 credentials to the browser.

The FNS1 FastAPI account endpoints are:

```text
POST /account/auth/register
POST /account/auth/login
POST /account/auth/logout
GET  /account/auth/me
GET  /account/profile
POST /account/profile
```

`account.silentflare.com` should call these through the same-origin `/account-api/` proxy. `ACCOUNT_COOKIE_DOMAIN=.silentflare.com` lets the HttpOnly account session survive across SilentFlare subdomains when needed.

Do not commit `.env`, `.dev.vars`, Turnstile secrets, session secrets, or D1 production credentials.

## Local D1

Create the D1 database once in Cloudflare if it does not exist:

```cmd
npx wrangler d1 create silentflare-next
```

Copy the returned `database_id` into `wrangler.jsonc`, then run migrations:

```cmd
corepack pnpm db:migrate:local
corepack pnpm db:migrate:remote
```

For local Pages Functions development, put backend-only values in `.dev.vars`:

```env
TURNSTILE_SECRET_KEY=your_turnstile_secret
TURNSTILE_EXPECTED_HOSTNAME=localhost
SESSION_COOKIE_NAME=sf_session
SESSION_SECRET=replace_with_at_least_32_random_characters
```

## Cloudflare Pages

Configure in the Pages project settings:

- D1 binding: `DB` pointing to the production D1 database.
- Variable: `PUBLIC_TURNSTILE_SITE_KEY`.
- Variable: `TURNSTILE_EXPECTED_HOSTNAME=blog.silentflare.com`.
- Variable: `SESSION_COOKIE_NAME=sf_session`.
- Secret: `TURNSTILE_SECRET_KEY`.
- Secret: `SESSION_SECRET`.

For the FNS1 account/admin API, add the Cloudflare D1 REST variables, `TURNSTILE_SECRET_KEY`, `SESSION_SECRET`, and optional `ACCOUNT_COOKIE_DOMAIN` to `/opt/silentflare/api/api.env`, then restart `silentflare-api.service`. Do not print their values.

## Manual API Checks

Without a Turnstile token these must fail with `403`:

```cmd
curl.exe --ssl-no-revoke -i -X POST https://blog.silentflare.com/api/auth/register -H "content-type: application/json" --data "{\"email\":\"a@example.com\",\"username\":\"tester\",\"password\":\"password123\",\"turnstileToken\":\"\"}"
curl.exe --ssl-no-revoke -i -X POST https://blog.silentflare.com/api/auth/login -H "content-type: application/json" --data "{\"email\":\"a@example.com\",\"password\":\"password123\",\"turnstileToken\":\"\"}"
curl.exe --ssl-no-revoke -i -X POST https://blog.silentflare.com/api/comments/create -H "content-type: application/json" --data "{\"postSlug\":\"123123\",\"content\":\"test\",\"turnstileToken\":\"\"}"
```

Browser test flow:

1. Open a post page.
2. Use the navbar Account link, or open `https://account.silentflare.com/`.
3. Register or log in through the account center.
4. Confirm `/account-api/account/auth/me` returns `{ "user": ... }` in the browser network tab on the account subsite.
5. Publish a comment from the post comment form.
6. Refresh comments and confirm the comment appears without exposing email.
7. Delete your own comment and confirm it disappears.
8. Log out from the account center and confirm `/account-api/account/auth/me` returns `{ "user": null }`.

## Security Notes

- Passwords use Workers-compatible PBKDF2-SHA256 with random salt.
- Session cookies are HttpOnly, Secure, SameSite=Lax.
- D1 stores only `session_hash`, never the raw cookie token.
- Comments are stored and rendered as plain text; the frontend does not use unsafe HTML.
- Login, registration, and comment creation have a `checkRateLimit` placeholder in `functions/_lib/validators.ts`. Replace it with a D1 or KV sliding-window limiter before high-traffic launch.
