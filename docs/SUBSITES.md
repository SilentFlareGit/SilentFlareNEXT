# SilentFlare Subsites

SilentFlare uses separate hostnames for separate responsibilities.

| Host | Current role | Implementation |
| --- | --- | --- |
| `blog.silentflare.com` | Public blog front end | This Astro/Fuwari app |
| `cms.silentflare.com` | Owner-only publishing workspace | Astro/Svelte CMS using the FastAPI CMS BFF; Ghost remains the private content engine |
| `api.silentflare.com` | Custom business API | FastAPI backend for account, admin, and bot-management surfaces |
| `auth.silentflare.com` | Unified public sign-in | `/auth/` UI with same-origin FastAPI proxy |
| `accounts.silentflare.com` | Public user accounts center | `/accounts/` login, registration, avatar, and profile UI |
| `admin.silentflare.com` | SilentFlare custom admin | `/admin/` owner console for public users and comments |
| `tgbot.silentflare.com`, `tgbotmanagement.silentflare.com` | Bot owner console | `/bots/` Telegram approval, chat, and backup UI |

## Local Mapping

Use these local equivalents while developing:

```text
http://localhost:4321/        -> blog front end
http://localhost:4321/cms/    -> SilentFlare CMS publishing workspace
http://localhost:4321/api/    -> API boundary/status page
http://localhost:4321/auth/   -> unified public sign-in
http://localhost:4321/accounts/ -> public accounts center
http://localhost:4321/admin/  -> custom API admin console
http://localhost:4321/bots/   -> bot owner console
http://localhost:2368/ghost/  -> local Ghost recovery access only
```

## Boundaries

Ghost owns article content only: posts, pages, tags, authors, cover images, and SEO metadata. The Astro `/cms/` route renders the Owner-only publishing workspace. Its browser calls same-origin `/cms-api/`; FastAPI validates the separate Owner session and CSRF proof before using a server-side Ghost Admin API integration.

SilentFlare-owned services should own users, comments, likes, bookmarks, analytics, automations, AI features, and any custom business data. The `/accounts/` center owns public user login, registration, logout, avatar, and bio/profile updates. The `/admin/` console currently exposes only public user and comment management. Bot, backup, and chat operations stay under `/bots/`.

Production `accounts.silentflare.com` and `admin.silentflare.com` should serve the static Astro output and proxy API calls to FastAPI with prefix stripping:

```text
accounts.silentflare.com/accounts-api/* -> api.silentflare.com/*
admin.silentflare.com/admin-api/*     -> api.silentflare.com/*
cms.silentflare.com/cms-api/*         -> api.silentflare.com/*
```

No browser bundle may contain a Ghost Admin API key. Public rendering uses only the Ghost Content API key. The CMS BFF is the only Ghost Admin API caller and reads its integration key from the production FastAPI secret environment. Public `/ghost/` and `/ghost/api/admin/` access is closed; emergency Ghost Staff access is available only through an SSH loopback tunnel.
