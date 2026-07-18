# SilentFlare Subsites

SilentFlare uses separate hostnames for separate responsibilities.

| Host | Current role | Implementation |
| --- | --- | --- |
| `blog.silentflare.com` | Public blog front end | This Astro/Fuwari app |
| `cms.silentflare.com` | Ghost CMS and Ghost Admin | External Ghost service |
| `api.silentflare.com` | Custom business API | FastAPI backend for account, admin, and bot-management surfaces |
| `auth.silentflare.com` | Unified public sign-in | `/auth/` UI with same-origin FastAPI proxy |
| `accounts.silentflare.com` | Public user accounts center | `/accounts/` login, registration, avatar, and profile UI |
| `admin.silentflare.com` | SilentFlare custom admin | `/admin/` owner console for public users and comments |
| `tgbot.silentflare.com`, `tgbotmanagement.silentflare.com` | Bot owner console | `/bots/` Telegram approval, chat, and backup UI |

## Local Mapping

Use these local equivalents while developing:

```text
http://localhost:4321/        -> blog front end
http://localhost:4321/cms/    -> CMS connection status page
http://localhost:4321/api/    -> API boundary/status page
http://localhost:4321/auth/   -> unified public sign-in
http://localhost:4321/accounts/ -> public accounts center
http://localhost:4321/admin/  -> custom API admin console
http://localhost:4321/bots/   -> bot owner console
http://localhost:2368/ghost/  -> Ghost Admin, when Ghost is running locally
```

## Boundaries

Ghost owns article content only: posts, pages, tags, authors, cover images, and SEO metadata. The Astro `/cms/` route reads Ghost settings and content counts through the Ghost Content API to verify that the blog front end can reach the CMS.

SilentFlare-owned services should own users, comments, likes, bookmarks, analytics, automations, AI features, and any custom business data. The `/accounts/` center owns public user login, registration, logout, avatar, and bio/profile updates. The `/admin/` console currently exposes only public user and comment management. Bot, backup, and chat operations stay under `/bots/`.

Production `accounts.silentflare.com` and `admin.silentflare.com` should serve the static Astro output and proxy API calls to FastAPI with prefix stripping:

```text
accounts.silentflare.com/accounts-api/* -> api.silentflare.com/*
admin.silentflare.com/admin-api/*     -> api.silentflare.com/*
```

This repository must not use a Ghost Admin API key. Public rendering uses only the Ghost Content API key; Ghost administration remains external infrastructure.
