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
TURNSTILE_EXPECTED_HOSTNAMES=auth.silentflare.com,accounts.silentflare.com,blog.silentflare.com,silentflare.com,www.silentflare.com
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

Authentication uses the unified `/auth/*` routes. Account Center uses `/accounts/*`; comments remain under `/comments`:

```text
GET  /auth/session
POST /auth/login/email/request
POST /auth/login/email/verify
POST /auth/login/password
POST /auth/2fa/verify
POST /auth/session/refresh
POST /auth/logout

POST /accounts/register/email/request
POST /accounts/register/email/verify
POST /accounts/register/complete
GET  /accounts/profile
PATCH /accounts/profile
GET  /accounts/sessions
DELETE /accounts/sessions/{session_id}
POST /accounts/sessions/logout-all
POST /accounts/danger/delete
POST /accounts/danger/delete/cancel

GET  /comments?postSlug=...
POST /comments/create
PATCH /comments/{comment_id}
DELETE /comments/{comment_id}
```

`auth.silentflare.com` and `accounts.silentflare.com` call FastAPI through their same-origin `/auth-api/` and `/accounts-api/` proxies. Blog pages call comments through the public API path. `ACCOUNT_COOKIE_DOMAIN=.silentflare.com` lets the HttpOnly account session work across SilentFlare subdomains.

Registration, password login, and comment creation must submit a Turnstile token. After Cloudflare siteverify succeeds, the API validates the returned `hostname` against the configured allowlist. Every hostname that renders one of those widgets must be present; in particular, Blog comment publishing requires `blog.silentflare.com`. Legacy `/account/auth/register` and `/account/auth/login` return `410` and must not be used by new clients.

## Blog Discussion And Markdown

- `CommentSection.svelte` loads the public account session and the comments for the current Ghost post slug. It owns the count, refresh command, authenticated/unauthenticated state, and list refresh lifecycle.
- `MarkdownEditor.svelte` provides Write and Preview modes, a 1000-character limit, and formatting commands for bold, italic, inline code, quotes, bulleted lists, and links. The same editor is used to create and edit comments.
- `CommentMarkdown.svelte` renders stored Markdown source through `src/lib/client/comment-markdown.ts`. Raw HTML and images are disabled. Links open in a new tab with `nofollow noopener noreferrer`.
- The API stores normalized Markdown source, not rendered HTML. Comment content must contain 1-1000 characters after normalization.
- Creation requires an authenticated account session, CSRF, and Turnstile. Editing and soft deletion require the account session and CSRF.
- `PATCH /comments/{comment_id}` is allowed only for the author or a local public-account `admin`, and only while the comment is published and not deleted. It returns the updated public comment payload.
- The UI marks a comment as edited when its update timestamp differs from its creation timestamp.
- Create, edit, and delete callbacks await a fresh comment-list request before clearing their busy state. This prevents a successful mutation from leaving stale content on screen.

## Account Center And Deletion

- Account Center is a standalone responsive workspace with a left identity/navigation column on desktop and an account-summary drawer on mobile.
- It has no top product bar or oversized Hero. The navigation destinations are Public Profile, Security, Sessions, Privacy, Notifications, and Danger Zone.
- The sidebar `Sign out` command destroys the current session. Session-level `Sign out all` requires the authenticated cookie and CSRF token, but does not require an email code.
- Danger Zone contains only account deletion. The frontend disables deletion until 2FA is configured.
- A deletion request requires an action-bound email verification proof, the exact `DELETE ACCOUNT` text, and a valid current authenticator code in the same final request.
- Submission sets the review state to `pending`; it does not immediately delete or start the cooling period.
- Owner Admin may approve or reject a pending request. Approval starts a seven-day cooling period and sets the final schedule. Rejection clears the request.
- Users may cancel a pending or approved request before finalization. Automatic finalization processes only approved requests whose scheduled timestamp is due.

## Local Smoke Test

Run the account/comment smoke test without real Turnstile or production data:

```cmd
corepack pnpm test:smoke:account-comments
```

The test uses a temporary SQLite database and a mocked successful Turnstile response. It verifies:

- registration without Turnstile returns `403`;
- mocked successful Turnstile allows registration and login to proceed;
- mocked successful Turnstile allows authenticated comment creation;
- Markdown source is written to the local database;
- an authenticated Markdown edit persists and is returned by the comment API.

## Manual API Checks

Without a Turnstile token these must fail with `403`:

```cmd
curl.exe --ssl-no-revoke -i -X POST https://accounts.silentflare.com/accounts-api/account/auth/register -H "content-type: application/json" --data "{\"email\":\"a@example.com\",\"username\":\"tester\",\"password\":\"password123\",\"turnstileToken\":\"\"}"
curl.exe --ssl-no-revoke -i -X POST https://accounts.silentflare.com/accounts-api/account/auth/login -H "content-type: application/json" --data "{\"email\":\"a@example.com\",\"password\":\"password123\",\"turnstileToken\":\"\"}"
curl.exe --ssl-no-revoke -i -X POST https://api.silentflare.com/comments/create -H "content-type: application/json" --data "{\"postSlug\":\"123123\",\"content\":\"test\",\"turnstileToken\":\"\"}"
```

Browser test flow:

1. Open a post page.
2. Use `Sign in`, or open `https://auth.silentflare.com/`.
3. Register through Accounts when needed, then sign in through Auth.
4. Confirm `/auth-api/auth/session` returns `configured: true` and an authenticated user in the browser network tab.
5. Publish Markdown containing bold text, a quote, a list, and a safe link from the post Discussion form.
6. Confirm the comment appears automatically, renders the supported Markdown, and does not expose email or raw audit data.
7. Edit the comment inline, save it, and confirm the rendered content and `Edited` marker update without pressing the manual refresh command.
8. Test the editor at desktop and mobile widths; the toolbar must wrap without horizontal overflow and icon actions must remain usable.
9. Delete your own comment and confirm the count and empty state update automatically.
10. Log out from Account Center and confirm `/auth-api/auth/session` returns `user: null`.
11. In Sessions, confirm individual revocation works and `Sign out all` does not request an email code.
12. In Danger Zone, confirm deletion is disabled without 2FA; with 2FA enabled, complete email verification, authenticator verification, and confirmation text, then verify Admin shows a pending review request.

## Security Notes

- Passwords use PBKDF2-SHA256 with random salt.
- Session cookies are HttpOnly, Secure, SameSite=Lax in production.
- The database stores only `session_hash`, never the raw cookie token.
- Sensitive email proofs are action-bound, short-lived, single-use, and stored only as keyed hashes.
- TOTP secrets are encrypted and authenticated at rest. Never expose them through account or admin responses.
- Deletion review state is administrative metadata; email codes, proof tokens, and TOTP codes must never be stored with the review request.
- Comments are stored as Markdown source. The renderer disables raw HTML and images and never injects the source directly as HTML.
- Keep `/opt/silentflare/api/account.db` and `/opt/silentflare/api/api.env` out of the repository.
