# SilentFlareNEXT

SilentFlareNEXT is an Astro blog front end based on the Fuwari template. Ghost runs as an external Headless CMS and is not part of this repository.

## Architecture

- Front end: Astro + Fuwari UI.
- Content source: Ghost Content API.
- Custom backend: modular FastAPI with SQLite migrations and a durable job worker.
- Deployment model: immutable Astro and API releases on FNS1, deployed separately from Ghost.
- Secret rule: never put a Ghost Admin API key or Staff password in browser or build-time code. Public rendering uses only the Ghost Content API key; native Ghost Admin uses its own Staff session behind the SilentFlare Owner Auth gate.

## Subsites

SilentFlare uses separate hostnames for separate responsibilities:

- `blog.silentflare.com`: public Astro/Fuwari front end, served by this app.
- `cms.silentflare.com`: native Ghost Admin publishing workspace behind SilentFlare Owner Auth and Ghost Staff authentication.
- `api.silentflare.com`: production FastAPI for public identity, comments, Admin data, and Bot management.
- `admin.silentflare.com`: SilentFlare custom admin dashboard for public users and comments.

The Astro app also provides subsite shells and boundary routes:

- `/cms/`: responsive CMS publishing workspace for posts, tags, images, drafts, and publication.
- `/api/`: API boundary/status page.
- `/admin/`: production Admin console for public users and comments.

See [docs/SUBSITES.md](docs/SUBSITES.md) for the current subsite map.

## Public Accounts And Comments

The public blog uses the FNS1 FastAPI backend for account registration, login, logout, current-user lookup, and post comments. User data, sessions, profiles, and comments are stored in the FNS1 local account database; blog post content still comes from Ghost.

Implemented API routes:

- `GET /auth/session`
- `POST /auth/login/password`
- `POST /auth/login/email/request`
- `POST /auth/login/email/verify`
- `POST /auth/session/logout`
- `POST /accounts/register/email/request`
- `POST /accounts/register/email/verify`
- `POST /accounts/register/complete`
- `GET/PATCH /accounts/profile`
- `GET /comments?postSlug=...`
- `POST /comments/create`
- `PATCH /comments/{comment_id}`
- `DELETE /comments/{comment_id}`

Registration, login, and comment creation require Cloudflare Turnstile. Sessions use HttpOnly Secure SameSite=Lax cookies; raw session tokens are never stored in the local database.

See [docs/AUTH_COMMENTS.md](docs/AUTH_COMMENTS.md) for FNS1 FastAPI variables, Turnstile hostname allowlists, the local smoke test, and manual test steps.

Backend code lives under `server/api/silentflare_api`. `server/api/app.py` is a compatibility entry point; domain routers/services, integrations, database migrations, and the durable worker are separate modules. See [docs/agent-api-backend.md](docs/agent-api-backend.md) for architecture, validation, and release operations.

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
- Documented that Ghost runs externally and that Ghost Admin API keys must never enter browser or build-time code.

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

Account/comment smoke test:

```cmd
corepack pnpm test:smoke:account-comments
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
- `/api/` shows the custom API boundary and status.
- `/admin/` hosts the public-account Admin console.
- `/posts/[slug]/` reads a Ghost post by slug.
- `/tags/[slug]/` reads Ghost posts filtered by tag.
- `/authors/[slug]/` reads Ghost posts filtered by author.
- `/archive/` lists Ghost posts grouped by year.
- `/rss.xml` is generated from Ghost posts.
- `sitemap.xml` is generated by Astro from the built routes.
