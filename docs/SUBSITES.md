# SilentFlare Subsites

SilentFlare uses separate hostnames for separate responsibilities.

| Host | Current role | Implementation |
| --- | --- | --- |
| `blog.silentflare.com` | Public blog front end | This Astro/Fuwari app |
| `cms.silentflare.com` | Ghost CMS and Ghost Admin | External Ghost service |
| `api.silentflare.com` | Custom business API | FastAPI backend for account, admin, and bot-management surfaces |
| `accounts.silentflare.com` | Public user accounts center | `/accounts/` login, registration, avatar, and profile UI |
| `admin.silentflare.com` | SilentFlare custom admin | `/admin/` owner console for public users and comments |

## Local Mapping

Use these local equivalents while developing:

```text
http://localhost:4321/        -> blog front end
http://localhost:4321/cms/    -> CMS connection status page
http://localhost:4321/api/    -> API placeholder page
http://localhost:4321/accounts/ -> public accounts center
http://localhost:4321/admin/  -> custom API admin console
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

Keep `GHOST_ADMIN_API_KEY` in a server-side API service only. Do not expose it through this Astro front end.
