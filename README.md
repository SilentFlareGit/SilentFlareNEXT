# SilentFlareNEXT

SilentFlareNEXT is an Astro blog front end based on the Fuwari template. Ghost runs as an external Headless CMS and is not part of this repository.

## Architecture

- Front end: Astro + Fuwari UI.
- Content source: Ghost Content API.
- Deployment model: deploy this Astro app separately from Ghost.
- Secret rule: never put a Ghost Admin API Key in this front end. Only use the Ghost Content API Key.

## Subsites

SilentFlare uses separate hostnames for separate responsibilities:

- `blog.silentflare.com`: public Astro/Fuwari front end, served by this app.
- `cms.silentflare.com`: external Ghost CMS and Ghost Admin at `/ghost`.
- `api.silentflare.com`: reserved for the future SilentFlare custom API.
- `admin.silentflare.com`: SilentFlare custom admin dashboard for non-article operations.

Placeholder and status routes are available in this app until the external services are built:

- `/cms/`: Ghost CMS boundary and Content API connection status.
- `/api/`: custom API boundary placeholder.
- `/admin/`: custom API admin console for accounts, comments, bots, backups, and health checks.

See [docs/SUBSITES.md](docs/SUBSITES.md) for the current subsite map.

## Public Accounts And Comments

The public blog includes Cloudflare Pages Functions for account registration, login, logout, current-user lookup, and post comments. User data, sessions, and comments are stored in Cloudflare D1; blog post content still comes from Ghost.

Implemented API routes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/comments?postSlug=...`
- `POST /api/comments/create`
- `DELETE /api/comments/:id`

Registration, login, and comment creation require Cloudflare Turnstile. Sessions use HttpOnly Secure SameSite=Lax cookies; raw session tokens are never stored in D1.

See [docs/AUTH_COMMENTS.md](docs/AUTH_COMMENTS.md) for D1 migration commands, Cloudflare Pages variables, and manual test steps.

## What Was Initialized

This repository was initialized from the Fuwari Astro template at `https://github.com/saicaca/fuwari.git`. The template was cloned only as a temporary source, then its project files were copied into SilentFlareNEXT as a new independent repository. No Fuwari Git history and no Ghost source code were merged into this repo.

The migrated front-end foundation includes:

- Astro, Svelte, Tailwind, Biome, Pagefind, RSS, sitemap, and related config files.
- Fuwari UI structure under `src/components`, `src/layouts`, `src/styles`, `src/i18n`, `src/plugins`, and `public`.
- The pnpm lockfile and package scripts for local development, build, lint, and typecheck.

The original markdown/content-collection blog data path was replaced for the public blog routes with a Ghost Headless CMS data layer:

- `src/lib/ghost.ts` defines normalized Ghost and blog types.
- `src/lib/ghost-client.ts` reads Ghost Content API posts, tags, and authors with pagination and `tags,authors` includes.
- `src/lib/ghost-adapter.ts` converts raw Ghost fields into the front-end `BlogPost`, `BlogTag`, and `BlogAuthor` shapes.
- `src/utils/content-utils.ts` now delegates blog data reads to the Ghost layer so pages/components do not depend on raw Ghost fields directly.

The public route chain now uses Ghost consistently:

- `/` reads paginated Ghost posts.
- `/posts/[slug]/` renders Ghost post HTML, metadata, cover image, tags, authors, adjacent post links, and JSON-LD.
- `/tags/[...slug]/` lists Ghost posts for a Ghost tag.
- `/authors/[...slug]/` lists Ghost posts for a Ghost author.
- `/archive/` groups Ghost posts by year.
- `/rss.xml` is generated from Ghost posts.
- Astro sitemap generation is enabled from built routes.

Environment and safety work completed:

- Added `.env.example` with Ghost Content API variables and `SITE_URL`.
- Kept `.env` ignored.
- Added explicit missing-config errors.
- Added `GHOST_ALLOW_EMPTY=true` as a local UI-only fallback for development without real Ghost credentials.
- Documented that Ghost runs externally and that Ghost Admin API keys must not be used in this front end.

Validation performed during initialization:

- `cmd /c "set CI=true&& corepack pnpm install --frozen-lockfile"` passed.
- `corepack pnpm lint` passed.
- `cmd /c "set GHOST_ALLOW_EMPTY=true&& corepack pnpm typecheck"` passed.
- `cmd /c "set GHOST_ALLOW_EMPTY=true&& corepack pnpm build"` passed.

## Local Setup

Copy the example environment file:

```cmd
copy .env.example .env
```

Edit `.env`:

```env
GHOST_URL=https://cms.silentflare.com
GHOST_CONTENT_API_KEY=your_content_api_key
GHOST_API_VERSION=v5.0
SITE_URL=https://blog.silentflare.com
PUBLIC_API_BASE_URL=https://api.silentflare.com
PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
```

Install and run:

```cmd
pnpm install
pnpm dev
```

If `pnpm` is not available globally, use Corepack:

```cmd
corepack pnpm install
corepack pnpm dev
```

Build:

```cmd
pnpm build
```

Lint and typecheck:

```cmd
pnpm lint
pnpm typecheck
```

Cloudflare D1 migrations:

```cmd
corepack pnpm db:migrate:local
corepack pnpm db:migrate:remote
```

For UI-only local previews without Ghost credentials:

```cmd
set GHOST_ALLOW_EMPTY=true
pnpm dev
```

That fallback returns empty content lists. The public blog route chain still uses Ghost.

## Ghost Integration

See [docs/GHOST_HEADLESS.md](docs/GHOST_HEADLESS.md) for Ghost setup, deployment notes, RSS/sitemap behavior, and troubleshooting.

## Main Routes

- `/` reads paginated posts from Ghost.
- `/cms/` shows the Ghost CMS connection status and latest content summary.
- `/api/` shows the custom API placeholder.
- `/admin/` shows the custom admin placeholder.
- `/posts/[slug]/` reads a Ghost post by slug.
- `/tags/[slug]/` reads Ghost posts filtered by tag.
- `/authors/[slug]/` reads Ghost posts filtered by author.
- `/archive/` lists Ghost posts grouped by year.
- `/rss.xml` is generated from Ghost posts.
- `sitemap.xml` is generated by Astro from the built routes.
