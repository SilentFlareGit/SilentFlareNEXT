# Agent Debugging And Local Validation Runbook

Use this when asked to "global debug", investigate repo health, diagnose validation failures, or find existing fixable issues.

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
- `python -m py_compile server\api\app.py`: validate FastAPI syntax locally.

On the Windows machine, `pnpm` may be missing from PATH. Prefer Corepack:

```cmd
corepack pnpm lint
corepack pnpm check
corepack pnpm build
corepack pnpm test:smoke
```

Account/comment local smoke test:

```cmd
corepack pnpm test:smoke:account-comments
```

This uses a temporary local database and mocked Turnstile success. It must verify missing Turnstile returns `403` and mocked successful Turnstile can proceed through registration, login, and comment creation.

Standard local validation without real Ghost:

```cmd
cmd /c "set GHOST_ALLOW_EMPTY=true&& set GHOST_URL=https://cms.silentflare.com&& set GHOST_CONTENT_API_KEY=placeholder&& set SITE_URL=https://blog.silentflare.com&& corepack pnpm lint&& corepack pnpm check&& corepack pnpm build&& corepack pnpm test:smoke"
```

Strict Ghost validation:

```cmd
corepack pnpm verify:ghost
```

If local `.env` points to `http://localhost:2368` and local Ghost is not running, `verify:ghost` will fail with `fetch failed`. That is an environment failure, not necessarily a code failure.

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
   - warnings from latest validation output.
6. Fix only clear, low-risk issues unless the user asks for broader refactoring.
7. Re-run validation after each fix set.
8. Commit and push only after checks pass and no secrets are included.

Useful scoped search:

```powershell
Get-ChildItem -Recurse -File src,scripts,.github,docs | Select-String -Pattern 'TODO|FIXME|HACK|XXX|console\.log|debugger|@ts-ignore|@ts-expect-error' -CaseSensitive:$false
```

## Known Local Machine Notes

- This is a Windows/PowerShell workspace.
- `rg` may not be installed. Use PowerShell `Select-String` or `Get-ChildItem` when needed.
- Avoid recursive scans through `ghost-cms/current/node_modules`; it produces noise and can time out.
- `corepack pnpm` works even when `pnpm` is not on PATH.
- `gh` CLI may be absent. A portable GitHub CLI was previously downloaded under `D:\tmp\bin\gh.exe`; do not assume it is permanent.
- Windows `curl.exe` may fail with certificate revocation errors. Use `--ssl-no-revoke` for status checks.
- PowerShell `Start-Process` can fail because of duplicate `Path/PATH` environment keys. Prefer direct foreground commands for short checks.
- Background preview servers may be unreliable in the sandbox. If `pnpm preview` is needed, verify that `http://127.0.0.1:4321/` actually responds before claiming browser QA.
- Git writes to `.git` may require elevated approval in restricted mode.
- Browser/IAB may be unavailable. If rendered UI verification is needed and Browser cannot connect, use the best available fallback and clearly state the limitation.

## Known Non-Blocking Warnings

- Browserslist may report stale `caniuse-lite`. This is a maintenance warning, not a deploy blocker.
- Svelte may print `https://svelte.dev/e/experimental_async_ssr` during static generation. It has not blocked builds, but it should be investigated separately if it becomes noisy in CI or masks real errors.
- Local `GHOST_ALLOW_EMPTY=true` builds intentionally print Ghost fallback warnings if Ghost is unreachable.
