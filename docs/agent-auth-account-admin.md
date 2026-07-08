# Agent Auth, Accounts, Admin, And Comments Runbook

Use this when changing public authentication, accounts, profiles, comments, public-user sessions, or the owner admin user/comment console.

## Surface Boundaries

- `auth.silentflare.com`: canonical public-user authentication frontend.
- `accounts.silentflare.com`: only public-user registration frontend, plus authenticated profile and security settings.
- `admin.silentflare.com`: owner/admin console for public user management and comment management only.
- `api.silentflare.com`: FastAPI backend for these surfaces.
- `blog.silentflare.com`: public blog renderer. Do not put account forms or admin data management directly into the blog layout.

FastAPI is the only authority allowed to verify credentials, access the account database, issue sessions, refresh sessions, or destroy sessions. Frontends only call API routes.

Public users share one opaque API-issued session cookie across `.silentflare.com`. Bot/admin Owner sessions are separate and must not be merged with public account sessions.

## Front-End Sources

- Auth page: `src/pages/auth/index.astro`.
- Auth app: `src/components/auth/AuthApp.svelte` and `src/components/auth/panels/`.
- Accounts registration shell: `src/components/account/RegistrationApp.svelte`.
- Registration flow: `src/components/auth/panels/RegistrationPanel.svelte`; rendered only on Accounts even though it lives with shared authentication panel primitives.
- Accounts page: `src/pages/accounts/index.astro`.
- Accounts app: `src/components/account/AccountApp.svelte`.
- Admin page: `src/pages/admin/index.astro`.
- Admin app: `src/components/admin/AdminApp.svelte`.
- Blog navbar account entry: `src/components/auth/UserMenu.svelte`.
- Blog comment login redirect: `src/components/comments/CommentSection.svelte`.

Accounts is a standalone account workspace. Do not restore the public blog navbar/banner above it. Admin is a standalone, light-only owner workspace and must not show bot backup, chat, health-dashboard, or unrelated operational controls.

## Current Account Behavior

- The blog navbar queries `GET /auth/session`.
- Unauthenticated users go to `auth.silentflare.com` with the current URL as `return_url`.
- Authenticated users go to `accounts.silentflare.com`.
- When unauthenticated, the blog navbar shows separate `Sign in` and `Join` entries.
- `Sign in` preserves the current blog URL as Auth `return_url`; `Join` goes directly to `https://accounts.silentflare.com/?register=1`.
- Direct unauthenticated visits to Accounts redirect to Auth with Accounts as the safe `return_url`.
- Auth's create-account command navigates to Accounts registration. Auth must not render registration itself.
- Comment prompts use the same auth redirect. Comment writes require the all-site session, Turnstile, and `X-CSRF-Token`.

`return_url` must be HTTPS and its hostname must be exactly `silentflare.com` or end with `.silentflare.com`; credentials, explicit ports, lookalike suffixes, and external hosts fall back to Accounts.

## Login, Registration, And Session Rules

- Login supports email code, email/password, and username/password.
- Google, GitHub, and Telegram have reserved UI entries and API routes but are unavailable until provider credentials and callback handling are implemented.
- Registration is email-first and runs only on Accounts.
- Registration may keep email-code-only login or set a password and may enable or skip 2FA.
- Registration completion redirects to Auth so the new user explicitly signs in; registration never issues a session.
- Users with 2FA enter a database-backed pending login. The API signs the all-site session only after TOTP succeeds.
- Account sessions use an opaque random token in an `HttpOnly`, `Secure`, `SameSite=Lax`, `Domain=.silentflare.com` cookie.
- The database stores only an HMAC digest. Do not store account tokens in web storage.
- Session-backed writes require the derived CSRF token from `GET /auth/session`.
- Logout deletes the database session and clears the domain cookie.
- Verification emails contain both a six-digit code and an opaque one-time verification link. Both consume the same verification record, expire together, and cannot be reused.
- Codes and link tokens are stored only as keyed hashes; never log or return either secret.
- Passwords use PBKDF2-SHA256 with random salts and the iteration count embedded in the stored hash.
- TOTP secrets are encrypted and authenticated at rest with a key derived from `SESSION_SECRET`.
- TOS acceptance is versioned and written to `tos_acceptances` with timestamp plus hashed request metadata.

## Profile And Region Rules

- Account profile avatar upload goes directly to FastAPI as PNG, JPEG, or WebP, limited to 2 MB.
- The browser must not create a data URL session or write a filesystem/database path itself.
- Managed avatars live under `ACCOUNT_AVATAR_DIR`; the database stores the public API URL.
- Replacing or deleting a managed avatar removes the previous managed file.
- `display_region`, `display_region_code`, and `display_region_updated_at` are API-owned profile display data.
- The UI renders region read-only with the country flag and city/country label.
- Region is refreshed from the current request IP when Accounts loads.
- Prefer Cloudflare location headers; when city/country names are absent, the API may use the configured HTTPS geolocation endpoint.
- Never accept a user-entered region value.
- IP-derived region must never be used as an authentication, authorization, 2FA, or risk decision.

## Important Account FastAPI Endpoints

- `GET /auth/session`: public-user session status, profile, CSRF token, runtime flags, and current TOS version.
- `GET /auth/return-url?return_url=...`: server-side safe return URL normalization.
- `POST /auth/login/password`: email-or-username password login with Turnstile; returns pending 2FA instead of a session when required.
- `POST /auth/login/email/request`, `POST /auth/login/email/verify`, `POST /auth/login/email/verify-link`: rate-limited email login by code or one-time link.
- `POST /auth/2fa/verify`: consumes pending login after TOTP and issues the domain session.
- `POST /auth/session/refresh`: rotates the opaque session and CSRF token.
- `POST /auth/logout`: destroys either the public account session or the separate bot/admin session according to the presented cookie and CSRF token.
- `GET /auth/oauth/{provider}/start` and `GET /auth/oauth/{provider}/callback`: reserved provider routes. They must not issue sessions until a provider is implemented.
- `POST /accounts/register/email/request`, `POST /accounts/register/email/verify`, `POST /accounts/register/email/verify-link`, `POST /accounts/register/complete`: verified email-first registration.
- `POST /accounts/register/2fa/start`, `POST /accounts/register/2fa/verify`, `POST /accounts/register/2fa/skip`: registration onboarding security choice; no session is issued.
- `GET/PATCH /accounts/profile`: read/update authenticated profile. PATCH requires CSRF.
- `POST /accounts/profile/avatar`: upload avatar with CSRF.
- `DELETE /accounts/profile/avatar`: clear the profile avatar and remove previous managed file when applicable.
- `GET /account-avatars/{filename}`: immutable public delivery for managed avatars.
- `POST /accounts/2fa/setup/start`, `POST /accounts/2fa/setup/verify`, `POST /accounts/2fa/disable`: authenticated 2FA management with CSRF.
- Legacy `POST /account/auth/register` and `POST /account/auth/login` return `410`; do not re-enable them.
- `GET /comments?postSlug=...`: public comment list for a Ghost post slug.
- `POST /comments/create`: authenticated public-user comment creation with Turnstile and CSRF.
- `DELETE /comments/{comment_id}`: authenticated public-user soft delete with CSRF for the author or a local `admin` role user.

## Current Admin Behavior

- Admin login uses the existing bot-style owner auth surface through `SilentFlare Admin`.
- Admin supports Telegram bot approval and optional 2FA only.
- If 2FA is not configured, the UI should show it as unavailable instead of presenting a usable 2FA form.
- Admin must stay light-only and match the Blog's pale blue/white visual language.
- `src/pages/admin/index.astro` must not add the `dark` class, read the Blog theme preference, or apply a dark body background.
- The unauthenticated Admin screen uses one responsive owner-console shell.
- The authenticated workspace provides compact Users and Comments navigation, account totals, active-session and disabled-user metrics, search/filter controls, responsive user table, comment moderation rows, and user-detail drawer.
- On narrow screens, tables may scroll inside bounded containers, but the document itself must not overflow horizontally.
- Admin data actions require admin session plus `X-CSRF-Token`.
- Raw audit IP values are restricted to the owner-only Admin API.
- Public account/session/comment responses must never expose raw audit IP values.
- Admin responses must never include password hashes, salts, TOTP secrets, session hashes, cookies, or verification secrets.
- Telegram approval polling must be serialized. Once an approved response is received, stop the interval before loading Admin data so overlapping requests cannot consume the already-finished challenge and replace a successful login with `Login request expired`.

## Important Admin FastAPI Endpoints

- `GET /admin/status`: admin session and local account/comment database status.
- `GET /admin/users`: list public users with owner-only profile, security-state, audit, session-count, and comment-count fields, excluding authentication secrets.
- `GET /admin/users/{user_id}`: owner-only user record plus up to 100 recent comments.
- `POST /admin/users/{user_id}/disable`: soft-disable a user.
- `POST /admin/users/{user_id}/enable`: re-enable a user.
- `POST /admin/users/{user_id}/role`: set `user` or `admin`.
- `GET /admin/comments`: list comments with username, display name, email, post slug, moderation state, timestamps, content, and available creation IP audit data.
- `POST /admin/comments/{comment_id}/delete`: soft-delete a comment.
- `POST /admin/comments/{comment_id}/restore`: restore a soft-deleted comment.

## Runtime And Migration Context

- Production accounts/comments use the FNS1 local account database, not Cloudflare D1.
- `migrations/0003_unified_auth.sql` is the unified auth schema reference; `ensure_account_db()` applies equivalent idempotent runtime changes.
- `migrations/0004_account_avatar_region.sql` covers API-owned avatar/region metadata.
- `migrations/0005_admin_user_audit.sql` is the schema reference for admin audit fields; `ensure_account_db()` applies equivalent idempotent runtime changes.

Production readiness caveat: `GET https://auth.silentflare.com/auth-api/auth/session` must return `configured:true`. `emailConfigured:false` means password/session flows may work but email-code login and registration cannot send mail. Real email flows require the email API variables on FNS1 and a verified sender domain; verify real inbox delivery before declaring email ready.
