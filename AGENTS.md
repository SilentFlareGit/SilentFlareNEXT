# Repository Guidelines

## Project Structure & Module Organization

SilentFlareNEXT is an Astro front end for a Ghost Headless CMS. Main source lives in `src/`: UI components in `src/components`, page routes in `src/pages`, layouts in `src/layouts`, Ghost data access in `src/lib`, shared utilities in `src/utils`, styles in `src/styles`, and content/schema support in `src/content`. Static assets belong in `public`; imported assets belong in `src/assets`. Project docs live in `docs`, automation scripts in `scripts`, and generated output in `dist`.

## Build, Test, and Development Commands

Use pnpm; `preinstall` enforces it.

- `pnpm install`: install dependencies from `pnpm-lock.yaml`.
- `pnpm dev`: start the local Astro dev server.
- `pnpm typecheck` or `pnpm check`: run `astro check`.
- `pnpm lint`: run Biome checks over `src`.
- `pnpm format`: format `src` with Biome.
- `pnpm build`: build the site and generate Pagefind search indexes in `dist`.
- `pnpm preview`: preview the production build locally.
- `pnpm new-post`: run the helper in `scripts/new-post.js`.

For local UI-only work without Ghost credentials, set `GHOST_ALLOW_EMPTY=true` before running dev or build.

## Coding Style & Naming Conventions

Biome is the source of truth for formatting and linting. It uses tabs for indentation and double quotes in JavaScript/TypeScript. Prefer focused modules, typed exports from `src/lib` and `src/types`, and self-closing elements where possible. Use PascalCase for Astro/Svelte components, kebab-case for route directories and URL slugs, and descriptive camelCase for functions and variables.

## Testing Guidelines

There is no separate unit-test command configured yet. Treat `pnpm typecheck`, `pnpm lint`, and `pnpm build` as the required validation set. When changing Ghost integration, validate with real `GHOST_URL` and `GHOST_CONTENT_API_KEY` when possible; otherwise use `GHOST_ALLOW_EMPTY=true` only for UI fallback checks.

## Commit & Pull Request Guidelines

Follow Conventional Commits where possible, for example `feat: add Ghost tag archive` or `fix: handle empty author metadata`. Keep commits and PRs scoped to one purpose. Pull requests should include a concise change summary, related issue when applicable, validation commands run, and screenshots for UI-visible changes. Before opening a PR, run the relevant checks and confirm no new warnings.

## Security & Configuration Tips

Never commit `.env` or secrets. This front end must use the Ghost Content API key only; do not add or expose a Ghost Admin API key. Keep deployment-facing values such as `SITE_URL`, `GHOST_URL`, and `GHOST_API_VERSION` in environment configuration.
