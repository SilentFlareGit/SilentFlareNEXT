# SilentFlare SEO Runbook

This document is the source of truth for public search indexing. The public content origin is `https://blog.silentflare.com`. Ghost owns editorial SEO fields; Astro normalizes them and renders the canonical public document.

## Index Policy

Indexable routes:

- `/` and valid home pagination.
- `/posts/{slug}/` unless Ghost declares an external canonical URL.
- `/tags/{tag}/` and pagination only when the tag has at least two posts and a unique description.
- `/authors/{author}/` and pagination only when the author has posts and a public biography.
- `/about/` and `/archive/`.

Routes that must remain `noindex` and outside every sitemap:

- `/auth/`, `/accounts/`, `/admin/`, `/bots/`, and `/cms/`.
- `404.html`, search results, previews, and query-string filter variants.

Do not disallow a public `noindex` HTML page in `robots.txt`; crawlers need to fetch it to observe the directive. Assets under `/_astro/` remain crawlable.

## Canonical And Redirect Rules

- Every indexable HTML document has one absolute self-referencing canonical URL.
- Pagination pages use their own canonical URL, not page one.
- Canonical public URLs use HTTPS, `blog.silentflare.com`, lowercase Ghost slugs, and trailing slashes.
- Ghost `canonical_url` is an explicit editorial override. Pages with an external canonical are excluded from the sitemap.
- HTTP, alternate public hosts, and non-trailing-slash variants permanently redirect to the canonical URL.
- Slug changes require an entry in `docs/seo-redirects.csv`. Use `301` for a replacement and `410` only when content is permanently removed without a substitute.

Nginx must serve the static error document with a real 404 status:

```nginx
error_page 404 /404.html;

location / {
    try_files $uri $uri/ =404;
}

location = /404.html {
    internal;
}
```

Host redirects and CMS duplicate-content handling are production Nginx responsibilities. Keep `/ghost/`, `/ghost/api/content/`, and `/content/` available on the CMS host; redirect or noindex any Ghost-rendered public post duplicate.

## Ghost Editorial Requirements

Before publishing a post:

- Set one or more authors and provide each author with a public biography.
- Set a concise SEO title and unique meta description when the default title or excerpt is insufficient.
- Set feature image alt text and an optional caption.
- Use an OG or Twitter override only when the feature image or copy is unsuitable for sharing.
- Use a custom canonical URL only when the Astro article is intentionally a duplicate of another source.
- Keep tags thematic. A tag needs a unique description and at least two posts before it becomes indexable.
- Use descriptive H2/H3 headings and contextual internal links to related SilentFlare content.

Site identity and About content are fetched from the public site-settings API during the static build. After changing them in Admin, trigger the normal static rebuild so crawlers receive the updated HTML snapshot.

## Generated Metadata

`SeoHead.astro` owns title, description, canonical, robots, Open Graph, Twitter cards, RSS discovery, and site-level JSON-LD. Pages may supply route-specific JSON-LD through `SeoData`.

Article pages publish `BlogPosting`, visible author links, complete ISO publication/update times, and `BreadcrumbList`. Author pages publish `ProfilePage`; tag and author listings publish `CollectionPage` with `ItemList`.

## Sitemap Policy

`/sitemap-index.xml` references separate page, post, tag, and author sitemaps. Sitemap URLs must be absolute, return 200, match the document canonical, and remain indexable. Article `lastmod` comes from Ghost `updated_at`.

Do not manually edit `dist`. All sitemap output is generated from `src/pages/sitemaps`.

## Validation

Run the complete public-content gate before deployment:

```cmd
corepack pnpm lint
corepack pnpm check
corepack pnpm verify:ghost
corepack pnpm test:seo
```

`test:seo` rejects missing metadata, invalid JSON-LD, bad canonicals, sitemap/index conflicts, broken internal links, missing author routes, incorrect pagination, and placeholder domains.

After deployment, verify the public edge and origin agree on redirects and status codes. Validate representative home, post, tag, author, pagination, noindex, sitemap, RSS, and missing URLs. Monitor Google Search Console indexing, canonical selection, rich results, and Core Web Vitals after releases.
