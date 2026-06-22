# SilentFlare Subsites

SilentFlare uses separate hostnames for separate responsibilities.

| Host | Current role | Implementation |
| --- | --- | --- |
| `blog.silentflare.com` | Public blog front end | This Astro/Fuwari app |
| `cms.silentflare.com` | Ghost CMS and Ghost Admin | External Ghost service |
| `api.silentflare.com` | Custom business API | FastAPI management backend plus Cloudflare Pages Functions for public auth/comments |
| `admin.silentflare.com` | SilentFlare custom admin | `/admin/` management console for non-article operations |

## Local Mapping

Use these local equivalents while developing:

```text
http://localhost:4321/        -> blog front end
http://localhost:4321/cms/    -> CMS connection status page
http://localhost:4321/api/    -> API placeholder page
http://localhost:4321/admin/  -> custom API admin console
http://localhost:2368/ghost/  -> Ghost Admin, when Ghost is running locally
```

## Boundaries

Ghost owns article content only: posts, pages, tags, authors, cover images, and SEO metadata. The Astro `/cms/` route reads Ghost settings and content counts through the Ghost Content API to verify that the blog front end can reach the CMS.

SilentFlare-owned services should own users, comments, likes, bookmarks, analytics, automations, AI features, and any custom business data. The `/admin/` console is the operator-facing entry point for these non-article surfaces.

Keep `GHOST_ADMIN_API_KEY` in a server-side API service only. Do not expose it through this Astro front end.
