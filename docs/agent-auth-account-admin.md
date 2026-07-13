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
- Shared subsite document shell: `src/layouts/SubsiteLayout.astro`.
- Shared identity shell: `src/components/shells/IdentityShell.svelte`.
- Shared Auth, registration, Accounts, and Admin-owner-login theme command: `src/components/ui/ThemeToggle.svelte`.
- Accounts registration shell: `src/components/account/RegistrationApp.svelte`.
- Registration flow: `src/components/auth/panels/RegistrationPanel.svelte`; rendered only on Accounts even though it lives with shared authentication panel primitives.
- Accounts page: `src/pages/accounts/index.astro`.
- Accounts app: `src/components/account/AccountApp.svelte`.
- Admin page: `src/pages/admin/index.astro`.
- Admin app: `src/components/admin/AdminApp.svelte`.
- Blog navbar account entry: `src/components/auth/UserMenu.svelte`.
- Blog comment login redirect: `src/components/comments/CommentSection.svelte`.

Accounts is a standalone account workspace. Do not restore the public blog navbar/banner above it. Admin is a standalone, light-only owner workspace and must not show bot backup, chat, health-dashboard, or unrelated operational controls.

## Auth And Account Theme Behavior

- Auth, Accounts registration, the authenticated Accounts workspace, and the Admin Owner login surface expose one compact icon-only theme command. The authenticated Admin management workspace remains light-only.
- The command toggles directly between light and dark, updates the document immediately, and stores the explicit choice as `localStorage.theme` so later visits restore it before rendering.
- The icon shows the available action: moon while light is active and sun while dark is active. Keep its tooltip and accessible label synchronized with that action.
- The control is at least `44px` square, uses shared `--sf-*` tokens, and must remain outside the login form so changing the theme cannot submit, reset, or shift the authentication flow.
- When no explicit preference exists, `SubsiteLayout` initially follows `prefers-color-scheme`. Once the user clicks the command, the saved explicit preference takes precedence.
- Auth text and panels must use semantic theme tokens instead of conflicting light-only surfaces and `dark:text-*` utilities.

## Account Center UI Contract

- Keep the Google Account-inspired information architecture, but use SilentFlare's pale blue, white, compact radius, border, and typography tokens.
- Do not add a top product bar, oversized Hero card, top-right logout icon, account-center eyebrow, or page-level protection/session badges.
- Desktop uses a fixed-width identity/navigation column and a fluid content column. The sidebar contains avatar, display name, username, read-only region, section navigation, and a text `Sign out` command below the navigation.
- Mobile replaces the persistent sidebar navigation with the account summary and drawer menu. Controls stack to one column, preserve at least 44 px targets, and must not create document-level horizontal scrolling.
- Public Profile, Security, Sessions, Privacy, Notifications, and Danger Zone remain separate navigation destinations. The active functional card supplies its own concise heading; do not restore the removed page-level heading band above the card.
- The Accounts workspace is centered in the available viewport. Its theme command aligns with the workspace edge rather than the browser edge on wide screens.
- Profile fields include the API-owned region as a read-only field. Upload and remove-avatar commands use equal-width, single-line icon-and-text controls.
- Do not show placeholder controls for unsupported features such as recovery codes. Sessions must render an explicit empty state when the API returns no devices.
- Session rows must show a device icon, device/platform, region, activity timestamps, and current-session or revoke controls. `Sign out all` is a direct CSRF-protected session action and does not open an email-verification modal.
- Danger Zone exposes only `Delete account`. Profile clearing, comment clearing, and account deactivation must not be restored to this UI.
- The delete button is disabled until 2FA is enabled. The modal sequence is email-code request, email-code verification, current authenticator code plus exact `DELETE ACCOUNT` confirmation, then request submission.
- A submitted deletion is a review request, not an immediate delete. Show pending/approved state and allow cancellation before the scheduled deletion runs.

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
- `POST /accounts/security/email/request`, `POST /accounts/security/email/verify`: issue a short-lived, action-bound proof before password, email, 2FA, export, or danger-zone changes.
- `POST /accounts/security/password`, `PATCH /accounts/security/email`, `POST /accounts/security/export`: verified sensitive account changes and private data export.
- `GET/DELETE /accounts/sessions`, `POST /accounts/sessions/logout-all`, `POST /accounts/sessions/logout-others`: device review and revocation. Logout-all requires the authenticated session and CSRF, but no email proof.
- `GET/PATCH /accounts/preferences/*`: privacy and notification preferences.
- `POST /accounts/danger/delete`: deletion requests require action-bound email verification, enabled 2FA, a valid current authenticator code, and confirmation text. Requests wait for administrator approval; approval starts the seven-day cooling period. Users can cancel before deletion runs.
- `POST /accounts/danger/delete/cancel`: clears pending or approved deletion-review state before final deletion.
- Legacy `POST /account/auth/register` and `POST /account/auth/login` return `410`; do not re-enable them.
- `GET /comments?postSlug=...`: public comment list for a Ghost post slug.
- `POST /comments/create`: authenticated public-user comment creation with Turnstile and CSRF.
- `DELETE /comments/{comment_id}`: authenticated public-user soft delete with CSRF for the author or a local `admin` role user.

## Current Admin Behavior

- Admin login uses the existing bot-style owner auth surface through `SilentFlare Admin`.
- Admin web login is disabled by default after an API restart. The fixed Telegram Owner enables it with `/allowweblogin` and disables it with `/denyweblogin`.
- Admin sessions have a fixed one-hour lifetime. `/denyweblogin` immediately revokes every Admin session and pending Admin login challenge.
- The authenticated Admin workspace checks its session every 15 seconds and when the page becomes visible again.
- Admin session expiry is absolute, not sliding. Ordinary bot-management sessions may still use the configured sliding `WEB_SESSION_TTL`.
- `GET /auth/options?bot_id=SilentFlare%20Admin` exposes `web_login_enabled`. When false, Telegram and TOTP methods are reported unavailable and the Auth frontend renders only the centered `Web login is disabled` state.
- The disabled state must query `/auth/options` before `/auth/me`, so a deliberately disabled login page does not create a noisy expected `401` request.
- Admin Owner login on `auth.silentflare.com` supports the shared light/dark theme and must use `--sf-*` semantic tokens. This does not change the authenticated `admin.silentflare.com` workspace, which stays light-only.
- Admin supports Telegram bot approval and optional 2FA only.
- If 2FA is not configured, the UI should show it as unavailable instead of presenting a usable 2FA form.
- Admin must stay light-only and match the Blog's pale blue/white visual language.
- `src/pages/admin/index.astro` must not add the `dark` class, read the Blog theme preference, or apply a dark body background.
- The unauthenticated Admin screen uses one responsive owner-console shell.
- The authenticated workspace provides compact Users and Comments navigation, account totals, active-session and disabled-user metrics, search/filter controls, responsive user table, comment moderation rows, and user-detail drawer.
- User rows and the detail drawer expose deletion-review state without exposing verification material. Pending requests provide explicit owner-only approve and reject actions.
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
- `POST /admin/users/{user_id}/deletion/approve` and `/reject`: review pending deletion requests. Approval starts the seven-day cooling period.
- `GET /admin/comments`: list comments with username, display name, email, post slug, moderation state, timestamps, content, and available creation IP audit data.
- `POST /admin/comments/{comment_id}/delete`: soft-delete a comment.
- `POST /admin/comments/{comment_id}/restore`: restore a soft-deleted comment.

## Runtime And Migration Context

- Production accounts/comments use the FNS1 local account database, not Cloudflare D1.
- `migrations/0003_unified_auth.sql` is the unified auth schema reference; `ensure_account_db()` applies equivalent idempotent runtime changes.
- `migrations/0004_account_avatar_region.sql` covers API-owned avatar/region metadata.
- `migrations/0005_admin_user_audit.sql` is the schema reference for admin audit fields; `ensure_account_db()` applies equivalent idempotent runtime changes.
- `ensure_account_db()` also maintains `deletion_requested_at`, `deletion_review_status`, `deletion_approved_at`, and `deletion_scheduled_for`. Only rows with approved status and a due schedule may be finalized.

Production readiness caveat: `GET https://auth.silentflare.com/auth-api/auth/session` must return `configured:true`. `emailConfigured:false` means password/session flows may work but email-code login and registration cannot send mail. Real email flows require the email API variables on FNS1 and a verified sender domain; verify real inbox delivery before declaring email ready.
