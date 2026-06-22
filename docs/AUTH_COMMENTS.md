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
```

Cloudflare binding:

```text
DB -> D1 database silentflare-next
```

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

## Manual API Checks

Without a Turnstile token these must fail with `403`:

```cmd
curl.exe --ssl-no-revoke -i -X POST https://blog.silentflare.com/api/auth/register -H "content-type: application/json" --data "{\"email\":\"a@example.com\",\"username\":\"tester\",\"password\":\"password123\",\"turnstileToken\":\"\"}"
curl.exe --ssl-no-revoke -i -X POST https://blog.silentflare.com/api/auth/login -H "content-type: application/json" --data "{\"email\":\"a@example.com\",\"password\":\"password123\",\"turnstileToken\":\"\"}"
curl.exe --ssl-no-revoke -i -X POST https://blog.silentflare.com/api/comments/create -H "content-type: application/json" --data "{\"postSlug\":\"123123\",\"content\":\"test\",\"turnstileToken\":\"\"}"
```

Browser test flow:

1. Open a post page.
2. Use `Login / Register` in the navbar to create an account.
3. Confirm `/api/auth/me` returns `{ "user": ... }` in the browser network tab.
4. Publish a comment from the post comment form.
5. Refresh comments and confirm the comment appears without exposing email.
6. Delete your own comment and confirm it disappears.
7. Log out and confirm `/api/auth/me` returns `{ "user": null }`.

## Security Notes

- Passwords use Workers-compatible PBKDF2-SHA256 with random salt.
- Session cookies are HttpOnly, Secure, SameSite=Lax.
- D1 stores only `session_hash`, never the raw cookie token.
- Comments are stored and rendered as plain text; the frontend does not use unsafe HTML.
- Login, registration, and comment creation have a `checkRateLimit` placeholder in `functions/_lib/validators.ts`. Replace it with a D1 or KV sliding-window limiter before high-traffic launch.
