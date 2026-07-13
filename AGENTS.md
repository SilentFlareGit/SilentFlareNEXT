# Agent Guide

SilentFlareNEXT is an Astro/Fuwari public blog front end for a Ghost Headless CMS. Treat this repository as the final source of truth for the public blog renderer. Ghost is external infrastructure and must stay outside this repository.

This file is the lightweight entry point for AI agents and maintainers. Read only the extra runbook that matches the task.

## Read The Right Runbook

| Task area | Read next |
| --- | --- |
| Public blog routes, Ghost Content API, layouts, content utilities, coding style | `docs/agent-architecture.md` |
| Auth, Accounts, public sessions, profile, comments, Admin users/comments | `docs/agent-auth-account-admin.md` |
| `/bots/`, Telegram approval, Telegram Chat Bot console, DB backup bot | `docs/agent-bot-management.md` |
| Independent SilentFlare Shield gateway, rules, risk events, deployment | `docs/SILENTFLARE_SHIELD.md` |
| FNS1 deployment, GitHub Actions, webhooks, production verification, rollback | `docs/agent-deployment-fns1.md` |
| Secrets, environment-variable handling, allowed status checks | `docs/agent-security.md` |
| Global debugging, local validation, Windows-machine caveats | `docs/agent-debug-playbook.md` |

Do not load the deployment or bot runbooks for small UI/content changes unless the task touches those surfaces.

## Non-Negotiable Rules

- Never commit `.env`, deploy webhook URLs with tokens, API keys, session cookies, CSRF values, TOTP secrets, Telegram tokens, or raw verification codes.
- Never print values from `/opt/silentflare/deploy/deploy.env`, `/opt/silentflare/api/api.env`, webhook URL files, Ghost keys, Telegram credentials, or account/session secrets. Print only variable names, masked values, file existence, or boolean status.
- Ghost owns content only: posts, tags, authors, cover images, SEO metadata, and media under `/content/`. This front end may use only a Ghost Content API key, never a Ghost Admin API key.
- FastAPI is the only authority for credentials, account sessions, CSRF, account/profile data, comments, admin data actions, and bot-management writes.
- Production public users share one opaque API-issued cookie across `.silentflare.com`. Bot/Admin Owner sessions are separate and must not be merged with public account sessions.
- Do not edit generated `dist` by hand.
- Do not broaden auth, backup, layout, or deployment rewrites unless explicitly requested. Keep fixes narrowly scoped to the affected surface.

## Project Structure

- `src/components`: Astro/Svelte UI components.
- `src/pages`: public routes, including `/`, `/posts/[slug]/`, `/tags/[tag]/`, `/authors/[author]/`, `/archive/`, `/cms/`, `/auth/`, `/accounts/`, `/admin/`, `/bots/`, `rss.xml`, and `robots.txt`.
- `src/layouts`: page layout shells and shared front-end scripts.
- `src/lib`: Ghost types, adapter, and Content API client.
- `src/utils`: shared data and URL utilities. Blog data should go through `src/utils/content-utils.ts`.
- `src/content`: local content schemas and fallback content for UI-only development.
- `src/assets`: imported build-time assets.
- `public`: static files served as-is.
- `docs`: operational documentation and setup notes.
- `scripts`: local verification and authoring helpers.
- `migrations`: historical schema references for SilentFlare-owned account/comment data.
- `server/api`: FastAPI custom API deployed manually to FNS1 under `/opt/silentflare/api`; it is not bundled into the Astro static site.
- `ghost-cms`: local Ghost experiments only. Do not treat it as production Ghost source.

## Common Commands

Use pnpm. `preinstall` enforces pnpm. On the Windows workspace, prefer Corepack when `pnpm` is not on PATH.

```cmd
corepack pnpm lint
corepack pnpm check
corepack pnpm build
corepack pnpm test:smoke
```

Local UI-only fallback without real Ghost:

```cmd
cmd /c "set GHOST_ALLOW_EMPTY=true&& set GHOST_URL=https://cms.silentflare.com&& set GHOST_CONTENT_API_KEY=placeholder&& set SITE_URL=https://blog.silentflare.com&& corepack pnpm lint&& corepack pnpm check&& corepack pnpm build&& corepack pnpm test:smoke"
```

Strict Ghost validation requires a reachable `GHOST_URL` and a real Content API key:

```cmd
corepack pnpm verify:ghost
```

FastAPI syntax check:

```cmd
python -m py_compile server\api\app.py
```

Account/comment smoke test:

```cmd
corepack pnpm test:smoke:account-comments
```

## Development Style

- Biome is the formatting/linting source of truth.
- Biome expects tabs and double quotes for JavaScript/TypeScript.
- Keep imports sorted.
- Use PascalCase for Astro/Svelte components.
- Use kebab-case for route directories and URL slugs.
- Use descriptive camelCase for functions and variables.
- Keep typed exports in `src/lib` and `src/types`.
- Prefer the existing Ghost adapter/content utility layer over raw Ghost fields in pages/components.
- Remove debug `console.log` from production front-end paths. Keep `console.error`/`console.warn` only for actionable runtime failures.

## Commit And PR Expectations

- Follow Conventional Commits, for example `docs: split agent runbooks` or `fix: handle empty author metadata`.
- Keep each commit scoped to one purpose.
- Before pushing, run the relevant validation set or explain why it was not applicable.
- For UI-visible changes, include screenshot evidence when practical.
- For deployment changes, include commit SHA, GitHub Actions status, FNS1 HEAD, active release path, and origin/public HTTP status.
