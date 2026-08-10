# SilentFlare Subsites

SilentFlare uses separate hostnames for separate responsibilities.

| Host | Current role | Implementation |
| --- | --- | --- |
| `blog.silentflare.com` | Public blog front end | This Astro/Fuwari app |
| `cms.silentflare.com` | Owner-only publishing workspace | Native Ghost Admin behind SilentFlare Owner Auth and Ghost Staff authentication |
| `api.silentflare.com` | Custom business API | FastAPI backend for account, admin, and bot-management surfaces |
| `auth.silentflare.com` | Unified public sign-in | `/auth/` UI with same-origin FastAPI proxy |
| `accounts.silentflare.com` | Public user accounts center | `/accounts/` login, registration, avatar, and profile UI |
| `admin.silentflare.com` | SilentFlare custom admin | `/admin/` owner console for public users and comments |
| `tgbot.silentflare.com`, `tgbotmanagement.silentflare.com` | Bot owner console | `/bots/` Telegram approval, chat, and backup UI |

## Local Mapping

Use these local equivalents while developing:

```text
http://localhost:4321/        -> blog front end
http://localhost:4321/cms/    -> legacy SilentFlare CMS UI for rollback testing
http://localhost:4321/api/    -> API boundary/status page
http://localhost:4321/auth/   -> unified public sign-in
http://localhost:4321/accounts/ -> public accounts center
http://localhost:4321/admin/  -> custom API admin console
http://localhost:4321/bots/   -> bot owner console
http://localhost:2368/ghost/  -> local native Ghost Admin
```

## Boundaries

Ghost owns article content only: posts, pages, tags, authors, cover images, and SEO metadata. Production publishing uses native Ghost Admin. Nginx first validates the separate `SilentFlare Admin` Owner session through FastAPI, then Ghost independently requires its Staff session.

SilentFlare-owned services should own users, comments, likes, bookmarks, analytics, automations, AI features, and any custom business data. The `/accounts/` center owns public user login, registration, logout, avatar, and bio/profile updates. The `/admin/` console currently exposes only public user and comment management. Bot, backup, and chat operations stay under `/bots/`.

Production `accounts.silentflare.com` and `admin.silentflare.com` should serve the static Astro output and proxy API calls to FastAPI with prefix stripping:

```text
accounts.silentflare.com/accounts-api/* -> api.silentflare.com/*
admin.silentflare.com/admin-api/*     -> api.silentflare.com/*
cms.silentflare.com/ghost/*           -> Owner Auth gate -> native Ghost Admin
```

No browser bundle may contain a Ghost Admin API key or Staff password. Public rendering uses only the Ghost Content API key. The legacy CMS BFF remains unrouted for rollback. Public `/ghost/` and `/ghost/api/admin/` requests reach Ghost only when the one-hour SilentFlare Owner session is valid, and Ghost Staff authentication remains mandatory afterward.

Emergency Ghost Staff recovery is available only on the FNS1 loopback TLS listener at `127.0.0.1:9443`. Open an authenticated SSH local forward to that port, temporarily resolve `cms.silentflare.com` to `127.0.0.1` on the operator machine, and visit `https://cms.silentflare.com:9443/ghost/`. The recovery certificate is origin/self-signed and therefore requires an explicit local browser exception. Close the tunnel and remove the temporary host override immediately after recovery. Port `9443` must never be published by Cloudflare, the host firewall, or a public Nginx listener.
