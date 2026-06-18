# Repository Guidelines

SilentFlareNEXT is an Astro/Fuwari front end for a Ghost Headless CMS. Treat this repository as the final source of truth for the public blog front end. Ghost is external infrastructure and must stay outside this repository.

## Project Structure & Ownership

- `src/components`: Astro/Svelte UI components.
- `src/pages`: public routes, including `/`, `/posts/[slug]/`, `/tags/[tag]/`, `/authors/[author]/`, `/archive/`, `/cms/`, `rss.xml`, and `robots.txt`.
- `src/layouts`: page layout shells and shared front-end scripts.
- `src/lib`: Ghost types, adapter, and Content API client.
- `src/utils`: shared data and URL utilities. Blog data should go through `src/utils/content-utils.ts`, not raw Ghost objects in pages.
- `src/content`: local content schemas and fallback content for UI-only development.
- `src/assets`: imported build-time assets.
- `public`: static public files served as-is.
- `docs`: operational documentation and setup notes.
- `scripts`: local verification and authoring helpers.
- `dist`: generated output. Do not edit by hand.
- `ghost-cms`: local Ghost artifacts may exist for experimentation. Do not treat this as production Ghost source and do not wire it into the front end.

## Core Architecture

- Public blog content source: Ghost Content API.
- Public blog renderer: Astro static build.
- Production CMS/admin domain: `cms.silentflare.com`.
- Production public blog domain: `blog.silentflare.com`.
- Ghost owns content only: posts, tags, authors, cover images, SEO metadata, and media under `/content/`.
- Astro owns public rendering, RSS, sitemap, layout, search index, and public route shape.
- Ghost Admin API keys are forbidden in this repo. The front end may only use a Ghost Content API key.
- `GHOST_ALLOW_EMPTY=true` is a local or CI fallback for layout/build checks. It must not be used to prove production content integration.

## Environment Variables

Use `.env.example` as the template. Never commit `.env`.

Required production variables:

```env
GHOST_URL=https://cms.silentflare.com
GHOST_CONTENT_API_KEY=<content-api-key>
GHOST_API_VERSION=v5.0
SITE_URL=https://blog.silentflare.com
```

Optional build-time override variables:

```env
GHOST_REQUEST_HOST=cms.silentflare.com
GHOST_REQUEST_PROTO=https
```

Use these when `GHOST_URL` points at a tunnel or local origin during server-side builds but Ghost still expects its public host/proto headers.

Local UI-only fallback:

```cmd
set GHOST_ALLOW_EMPTY=true
```

When `GHOST_ALLOW_EMPTY=true`, the app may render from local fallback content or empty Ghost responses. That is acceptable for UI checks only.

## Build, Test, And Development Commands

Use pnpm. `preinstall` enforces pnpm.

- `pnpm install`: install dependencies from `pnpm-lock.yaml`.
- `pnpm dev`: start Astro dev server.
- `pnpm lint`: run Biome checks over `src`.
- `pnpm typecheck` or `pnpm check`: run `astro check`.
- `pnpm build`: build static site and Pagefind search index into `dist`.
- `pnpm test:smoke`: verify required generated files exist.
- `pnpm test:smoke:content`: verify generated post, tag, and author routes exist.
- `pnpm verify:ghost`: strict production-style Ghost build plus content route verification.
- `pnpm preview`: preview `dist` locally.
- `pnpm new-post`: run `scripts/new-post.js`.

On this Windows machine, `pnpm` may be missing from PATH. Prefer Corepack:

```cmd
corepack pnpm lint
corepack pnpm check
corepack pnpm build
corepack pnpm test:smoke
```

Standard local validation without real Ghost:

```cmd
cmd /c "set GHOST_ALLOW_EMPTY=true&& set GHOST_URL=https://cms.silentflare.com&& set GHOST_CONTENT_API_KEY=placeholder&& set SITE_URL=https://blog.silentflare.com&& corepack pnpm lint&& corepack pnpm check&& corepack pnpm build&& corepack pnpm test:smoke"
```

Strict Ghost validation:

```cmd
corepack pnpm verify:ghost
```

Important: strict Ghost validation requires a reachable `GHOST_URL` and a real Content API key. If local `.env` points to `http://localhost:2368` and local Ghost is not running, `verify:ghost` will fail with `fetch failed`. That is an environment failure, not necessarily a code failure.

## Coding Style

- Biome is the source of truth for formatting and linting.
- Biome expects tabs and double quotes for JavaScript/TypeScript.
- Keep imports sorted. CI fails on unsorted imports.
- Use PascalCase for Astro/Svelte components.
- Use kebab-case for route directories and URL slugs.
- Use descriptive camelCase for functions and variables.
- Keep typed exports in `src/lib` and `src/types`.
- Prefer the existing adapter layer over raw Ghost fields in route/components.
- Avoid broad refactors during deployment/debug tasks. Keep changes scoped.
- Remove debug `console.log` from production front-end paths. Keep `console.error`/`console.warn` only when it reports actionable runtime failure.

## Ghost Data Layer Rules

- `src/lib/ghost.ts` defines normalized Ghost and blog-facing types.
- `src/lib/ghost-client.ts` is the only place that should know Ghost Content API request details.
- `src/lib/ghost-adapter.ts` maps raw Ghost response fields into front-end shapes.
- `src/utils/content-utils.ts` is the public data access layer used by pages and widgets.
- Public routes should call `content-utils`, not Ghost client internals.
- When changing Ghost integration, verify:
  - pagination still works,
  - post routes build,
  - tag routes build,
  - author routes build,
  - RSS still builds,
  - `/cms/` status route still renders,
  - fallback mode still builds with `GHOST_ALLOW_EMPTY=true`.

## Production Deployment: FNS1

Production static deployment runs on FNS1.

Known server:

- Host: `167.233.129.17`
- SSH user: `root`
- SSH key on this Windows machine: `%USERPROFILE%\.ssh\hetzner_cx23`
- App source checkout: `/opt/silentflare/app`
- Deploy config/scripts: `/opt/silentflare/deploy`
- Deploy env: `/opt/silentflare/deploy/deploy.env`
- Deploy script: `/opt/silentflare/deploy/deploy.sh`
- Webhook service: `/opt/silentflare/deploy/webhook-server.mjs`
- Static releases: `/opt/silentflare/blog/releases`
- Active site symlink: `/opt/silentflare/blog/current`
- Deploy log: `/var/log/silentflare-deploy.log`

SSH pattern:

```powershell
$key = Join-Path $env:USERPROFILE '.ssh\hetzner_cx23'
ssh -i $key root@167.233.129.17 '...'
```

The server app directory must be a Git checkout of:

```text
https://github.com/SilentFlareGit/SilentFlareNEXT.git
```

The deploy script must sync GitHub source before every build:

```sh
git fetch --prune origin main
git reset --hard origin/main
```

Then it should:

1. load `/opt/silentflare/deploy/deploy.env`,
2. install dependencies with Corepack/pnpm,
3. run `corepack pnpm verify:ghost`,
4. copy `dist` into a timestamped release directory,
5. atomically update `/opt/silentflare/blog/current`,
6. keep only recent releases,
7. append details to `/var/log/silentflare-deploy.log`.

Do not print or commit values from:

- `/opt/silentflare/deploy/deploy.env`
- `/opt/silentflare/deploy/hook-url.txt`
- `/opt/silentflare/deploy/hook-url-origin.txt`
- Ghost Content API key
- deploy webhook token

Reading variable names is acceptable. Printing values is not.

## GitHub Actions Deployment

Workflow: `.github/workflows/build.yml`

Expected pipeline:

```text
push main -> build job -> Deploy FNS1 job -> webhook -> FNS1 git reset origin/main -> verify:ghost -> static release
```

The deploy job only runs on `push` to `main`, after the build job succeeds.

Required repository secret:

```text
DEPLOY_WEBHOOK_URL
```

This secret must contain the full origin webhook URL, including token. Do not write the real value to docs, logs, PRs, issues, or committed files.

If GitHub Actions build fails:

1. Check job step names first.
2. If `Run Biome checks` fails, run `corepack pnpm lint` locally.
3. If `Run Astro check` fails, run `corepack pnpm check` locally.
4. If `Build site and search index` fails, run `corepack pnpm build`.
5. If `Verify required build outputs` fails, inspect `scripts/check-built-routes.js` expectations.
6. If `Deploy FNS1` fails after build succeeded, check `DEPLOY_WEBHOOK_URL`, webhook service health, and deploy logs.

GitHub Actions API status check from Windows:

```powershell
curl.exe --ssl-no-revoke -sS "https://api.github.com/repos/SilentFlareGit/SilentFlareNEXT/actions/runs?branch=main&per_page=3"
```

Use `--ssl-no-revoke` on this machine when Windows certificate revocation checking blocks `curl.exe`.

## Production Verification

Verify local Git state:

```powershell
git fetch origin main
git status -sb
git rev-parse HEAD
git rev-parse origin/main
```

Expected: local `HEAD` equals `origin/main`, and worktree status is clean unless you are intentionally carrying local edits.

Verify FNS1 source and active release:

```powershell
$key = Join-Path $env:USERPROFILE '.ssh\hetzner_cx23'
ssh -i $key root@167.233.129.17 'set -Eeuo pipefail; echo HEAD=$(git -C /opt/silentflare/app rev-parse --short HEAD); echo STATUS=$(git -C /opt/silentflare/app status --short | wc -l); echo CURRENT=$(readlink -f /opt/silentflare/blog/current)'
```

Expected:

- `HEAD` matches latest pushed commit.
- `STATUS=0`.
- `CURRENT` points to a release under `/opt/silentflare/blog/releases`.

Verify origin Nginx without Cloudflare:

```powershell
$key = Join-Path $env:USERPROFILE '.ssh\hetzner_cx23'
ssh -i $key root@167.233.129.17 'curl -sS -o /dev/null -w HOME=%{http_code} -H Host:blog.silentflare.com http://127.0.0.1/; echo; curl -sS -o /dev/null -w POST=%{http_code} -H Host:blog.silentflare.com http://127.0.0.1/posts/123123/; echo'
```

Expected: `HOME=200`, `POST=200`.

Verify Cloudflare/public edge:

```powershell
curl.exe --ssl-no-revoke -L -sS -o NUL -w "PUBLIC_HOME=%{http_code}\n" https://blog.silentflare.com/
curl.exe --ssl-no-revoke -L -sS -o NUL -w "PUBLIC_POST=%{http_code}\n" https://blog.silentflare.com/posts/123123/
```

Expected: both `200`.

## Webhook And Ghost Automation

Ghost webhooks should call the origin webhook URL, not the Cloudflare-proxied URL, if Cloudflare challenges block webhook delivery.

Current pattern:

- webhook service listens on `127.0.0.1:9000`,
- Nginx proxies `/hooks/rebuild`,
- Ghost integration webhooks target origin IP URL with token,
- webhook returns `202` for queued deploy.

Trigger from FNS1 without printing token:

```sh
set -a
. /opt/silentflare/deploy/deploy.env
set +a
curl -fsS -o /tmp/silentflare-hook-response.txt -w 'HTTP=%{http_code}\n' "http://127.0.0.1:9000/hooks/rebuild?token=${DEPLOY_HOOK_TOKEN}"
cat /tmp/silentflare-hook-response.txt
```

Do not run this in a way that prints the token.

## Rollback

Rollback is symlink-only. Do not delete releases while diagnosing.

```sh
ln -sfn /opt/silentflare/blog/releases/<release-id> /opt/silentflare/blog/current.next
mv -Tf /opt/silentflare/blog/current.next /opt/silentflare/blog/current
```

After rollback, verify:

```sh
readlink -f /opt/silentflare/blog/current
curl -sS -o /dev/null -w 'HOME=%{http_code}\n' -H Host:blog.silentflare.com http://127.0.0.1/
```

## Known Local Machine Notes

- This is a Windows/PowerShell workspace.
- `rg` may not be installed. Use PowerShell `Select-String` or `Get-ChildItem` when needed.
- Avoid recursive scans through `ghost-cms/current/node_modules`; it produces noise and can time out.
- `corepack pnpm` works even when `pnpm` is not on PATH.
- `gh` CLI may be absent. A portable GitHub CLI was previously downloaded under `D:\tmp\bin\gh.exe`; do not assume it is permanent.
- Windows `curl.exe` may fail with certificate revocation errors. Use `--ssl-no-revoke` for status checks.
- PowerShell `Start-Process` can fail in this environment because of duplicate `Path/PATH` environment keys. Prefer direct foreground commands for short checks.
- Background preview servers may be unreliable in the sandbox. If `pnpm preview` is needed, verify that `http://127.0.0.1:4321/` actually responds before claiming browser QA.
- Git writes to `.git` may require elevated approval in restricted mode.

## Known Non-Blocking Warnings

- Browserslist may report stale `caniuse-lite`. This is a maintenance warning, not a deploy blocker.
- Svelte may print `https://svelte.dev/e/experimental_async_ssr` during static generation. It has not blocked builds, but it should be investigated separately if it becomes noisy in CI or masks real errors.
- Local `GHOST_ALLOW_EMPTY=true` builds intentionally print Ghost fallback warnings if Ghost is unreachable.

## Debugging Playbook

When asked to "global debug" or find existing fixable issues:

1. Confirm Git state first:
   - `git status --short`
   - `git fetch origin main`
   - compare `HEAD` and `origin/main`
2. Confirm production state if relevant:
   - FNS1 Git HEAD,
   - active release symlink,
   - origin HTTP status,
   - public Cloudflare status.
3. Run local validation:
   - `corepack pnpm lint`
   - `corepack pnpm check`
   - `corepack pnpm build`
   - `corepack pnpm test:smoke`
4. Search only useful directories:
   - `src`
   - `scripts`
   - `.github`
   - `docs`
5. Look for:
   - `TODO`
   - `FIXME`
   - `console.log`
   - `debugger`
   - `@ts-ignore`
   - stale `@ts-expect-error`
   - warnings from the latest validation output.
6. Fix only clear, low-risk issues unless the user asks for broader refactoring.
7. Re-run validation after each fix set.
8. Commit and push only after checks pass and no secrets are included.

Useful scoped search:

```powershell
Get-ChildItem -Recurse -File src,scripts,.github,docs | Select-String -Pattern 'TODO|FIXME|HACK|XXX|console\.log|debugger|@ts-ignore|@ts-expect-error' -CaseSensitive:$false
```

## Current Debug Cleanup Context

A recent debug pass intentionally made these code cleanups:

- removed production `console.log` noise from Pagefind/search related code,
- removed GitHub card success logging from generated client script,
- changed `Search.svelte` reactive async calls from async IIFEs to `void search(...)`,
- removed an unnecessary `_cssVar` parameter and stale `@ts-expect-error` in the Expressive Code language badge plugin.

If these changes are still uncommitted when you start, do not overwrite them. Validate with:

```cmd
cmd /c "set GHOST_ALLOW_EMPTY=true&& set GHOST_URL=https://cms.silentflare.com&& set GHOST_CONTENT_API_KEY=placeholder&& set SITE_URL=https://blog.silentflare.com&& corepack pnpm lint&& corepack pnpm check&& corepack pnpm build&& corepack pnpm test:smoke"
```

Then commit with:

```text
fix: reduce frontend debug noise
```

## Commit And Pull Request Guidelines

- Follow Conventional Commits, for example:
  - `feat: add Ghost tag archive`
  - `fix: handle empty author metadata`
  - `ci: trigger FNS1 deploy after build`
  - `test: verify generated Ghost content routes`
- Keep each commit scoped to one purpose.
- Before pushing, run the relevant validation set.
- For UI-visible changes, include screenshot evidence when practical.
- For deployment changes, include:
  - commit SHA,
  - GitHub Actions run status,
  - FNS1 HEAD,
  - active release path,
  - origin/public HTTP status.

## Security Rules

- Never commit `.env`.
- Never commit deploy webhook URLs with tokens.
- Never print Ghost Content API keys.
- Never add a Ghost Admin API key to this front end.
- Never expose `DEPLOY_HOOK_TOKEN`.
- Do not paste secrets into GitHub issues, PR comments, logs, docs, or final responses.
- If a command would print a secret, rewrite it to print only key names, masked values, status codes, or file existence.
- Treat Cloudflare challenge pages and webhook URLs as sensitive when tokens are present.
