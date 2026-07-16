# Agent Architecture Runbook

Use this when changing public blog routes, Ghost integration, layouts, content utilities, or general front-end code.

## Core Architecture

- Public blog content source: Ghost Content API.
- Public blog renderer: Astro static build.
- Production CMS/admin domain: `cms.silentflare.com`.
- Production public blog domain: `blog.silentflare.com`.
- Production authentication domain: `auth.silentflare.com`.
- Production account domain: `accounts.silentflare.com`.
- Production custom admin domain: `admin.silentflare.com`.
- Custom API domain: `api.silentflare.com`, backed by FastAPI on FNS1.

Ghost owns content only: posts, tags, authors, cover images, SEO metadata, and media under `/content/`. Astro owns public rendering, RSS, sitemap, layout, search index, and public route shape.

The front end may only use a Ghost Content API key. Ghost Admin API keys are forbidden in this repo.

## Route Ownership

- `/auth/`: public login UI, served from `auth.silentflare.com`.
- `/accounts/`: registration, profile, and security settings, served from `accounts.silentflare.com`.
- `/admin/`: owner/admin console for public user and comment management, served from `admin.silentflare.com`.
- `/bots/`: bot-management console, served from `tgbot.silentflare.com` and `tgbotmanagement.silentflare.com`.
- Blog routes stay public-renderer routes and must not directly host account forms or admin data management.
- Ghost post pages may embed the SilentFlare-owned Discussion client. Ghost supplies the post slug only; FastAPI owns comment storage and mutations, while the Svelte client owns Markdown editing, safe rendering, and responsive interaction.

## Data Layer Rules

- `src/lib/ghost.ts` defines normalized Ghost and blog-facing types.
- `src/lib/ghost-client.ts` is the only place that should know Ghost Content API request details.
- `src/lib/ghost-adapter.ts` maps raw Ghost response fields into front-end shapes.
- `src/utils/content-utils.ts` is the public data access layer used by pages and widgets.
- Public routes should call `content-utils`, not Ghost client internals.

When changing Ghost integration, verify that pagination, post/tag/author route builds, RSS, `/cms/`, and fallback mode still work.

## Local Fallback And Strict Validation

`GHOST_ALLOW_EMPTY=true` is a local or CI fallback for layout/build checks. It must not be used to prove production content integration.

```cmd
set GHOST_ALLOW_EMPTY=true
set GHOST_URL=https://cms.silentflare.com
set GHOST_CONTENT_API_KEY=placeholder
set SITE_URL=https://blog.silentflare.com
```

Strict production-style validation requires reachable Ghost and a real Content API key:

```cmd
corepack pnpm verify:ghost
```

If local `.env` points to `http://localhost:2368` and local Ghost is not running, `verify:ghost` may fail with `fetch failed`; treat that as an environment failure unless code changes clearly caused it.

## Optional Build-Time Overrides

Use these only when `GHOST_URL` points at a tunnel or local origin during server-side builds but Ghost still expects public host/proto headers:

```env
GHOST_REQUEST_HOST=cms.silentflare.com
GHOST_REQUEST_PROTO=https
```

## Blog Navigation And Theme Behavior

- Swup accessibility remains enabled.
- After navigation, the `content:focus` hook must focus `#swup-container`, which has `tabindex="-1"`, rather than focusing `body`.
- The temporary `#page-height-extend` element is shown only while a Swup visit is active and must be hidden again on `page:view` and after `visit:end`.
- Both `html` and `body` use `var(--page-bg)`. Do not leave `body` transparent or hard-code a light background, or the absolutely positioned blog layout can expose a light band in dark mode.

## Shared Subsite Front End

- Auth, Accounts, Admin, and Bots use `src/layouts/SubsiteLayout.astro` for shared document metadata, Roboto font loading, favicon links, Blog-derived tokens, foundations, and subsite reset styles.
- Shared semantic colors and dimensions live in `src/styles/tokens.css`; shared subsite document behavior lives in `src/styles/subsites.css`. Prefer `--sf-*` semantic tokens over new hard-coded colors.
- Interactive shared primitives live in `src/components/ui/`. `IdentityShell.svelte` is the standalone identity layout used by public Auth, Accounts registration, and Admin Owner login; it must not be replaced with the public Blog navbar or `MainGridLayout`.
- Adaptive subsites restore the saved `localStorage.theme` value before rendering. Explicit `light` and `dark` choices are supported; when no choice is stored, the initial theme follows the system preference.
- The authenticated Admin workspace remains the exception: its `SubsiteLayout` uses `theme="light"` and must not read or apply the saved Blog theme. The Admin Owner login is rendered on adaptive `auth.silentflare.com` and supports the shared theme toggle.
- Dark mode must update the complete semantic surface set (`--sf-page`, `--sf-surface`, `--sf-surface-subtle`, `--sf-surface-muted`, and `--sf-text`) together. Do not combine a light semantic surface with Tailwind `dark:text-*` utilities, which can produce invisible light text on a light panel.

## Coding Style

- Biome is the source of truth for formatting and linting.
- Biome expects tabs and double quotes for JavaScript/TypeScript.
- Keep imports sorted. CI fails on unsorted imports.
- Use PascalCase for Astro/Svelte components.
- Use kebab-case for route directories and URL slugs.
- Use descriptive camelCase for functions and variables.
- Keep typed exports in `src/lib` and `src/types`.
- Prefer the adapter/content utility layer over raw Ghost fields in pages/components.
- Avoid broad refactors during deployment/debug tasks.
- Remove debug `console.log` from production front-end paths.
