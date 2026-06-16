# Ghost Headless CMS Setup

SilentFlareNEXT uses Astro/Fuwari as the front end and Ghost as an external Headless CMS. Ghost is deployed separately. Do not copy Ghost source code into this repository.

## Create a Ghost Custom Integration

1. Open Ghost Admin.
2. Go to `Settings` -> `Integrations`.
3. Create a custom integration for this Astro front end.
4. Copy the `Content API Key`.
5. Do not use the `Admin API Key` in this project.

The Content API Key reads public content. The Admin API Key can manage content and must only be used in trusted server-side admin tools, never in this browser-facing front end.

## Environment Variables

Create `.env` from `.env.example`:

```cmd
copy .env.example .env
```

Use these values:

```env
GHOST_URL=https://your-ghost-domain.com
GHOST_CONTENT_API_KEY=your_content_api_key
GHOST_API_VERSION=v5.0
SITE_URL=https://your-blog-domain.com
```

`GHOST_URL` should be the public origin of Ghost, without `/ghost` and without `/ghost/api/content`. A trailing slash is okay; the app normalizes it.

`SITE_URL` should be the final Astro front-end URL. RSS and sitemap use this URL during production builds.

## Local Commands

```cmd
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
```

If `pnpm` is not on PATH, use the same commands through Corepack:

```cmd
corepack pnpm install
corepack pnpm dev
corepack pnpm build
corepack pnpm lint
corepack pnpm typecheck
```

## Verify Real Ghost Content

Use the strict verification command before a production deployment:

```cmd
pnpm verify:ghost
```

This command builds with the configured Ghost Content API and then requires the generated output to contain at least one post route, one tag route, and one author route. It fails when Ghost is unreachable, credentials are invalid, or the build silently falls back to empty content.

Keep `GHOST_ALLOW_EMPTY=false` for this check. The empty-data switch is only for UI and CI fallback validation.

If you need to preview layout before Ghost is configured:

```cmd
set GHOST_ALLOW_EMPTY=true
pnpm dev
```

## Deployment

Set these environment variables in your hosting platform:

```env
GHOST_URL=https://your-ghost-domain.com
GHOST_CONTENT_API_KEY=your_content_api_key
GHOST_API_VERSION=v5.0
SITE_URL=https://your-blog-domain.com
```

Then run:

```cmd
pnpm install
pnpm build
```

Deploy the generated `dist` directory if your platform expects static output.

### FNS1 Static Deployment

The production blog currently deploys to the FNS1 server as a static Astro site:

- Source checkout: `/opt/silentflare/app`
- Deploy script: `/opt/silentflare/deploy/deploy.sh`
- Deploy environment: `/opt/silentflare/deploy/deploy.env`
- Static releases: `/opt/silentflare/blog/releases`
- Live symlink: `/opt/silentflare/blog/current`
- Deploy log: `/var/log/silentflare-deploy.log`

The deploy script keeps `/opt/silentflare/app` aligned with GitHub before every build:

```sh
git fetch --prune origin main
git reset --hard origin/main
```

It then installs dependencies, runs the strict Ghost build verification, publishes a timestamped release, and atomically moves the `current` symlink.

GitHub Actions triggers the FNS1 deploy webhook after the `Build and Check` workflow passes on `main`. Configure the repository secret with the full origin webhook URL:

```text
DEPLOY_WEBHOOK_URL=http://<origin-ip>/hooks/rebuild?token=<deploy-token>
```

Do not commit this URL or token. Keep it in GitHub repository secrets only.

To verify the live site from the server:

```sh
curl -sS -o /dev/null -w 'HOME=%{http_code}\n' -H Host:blog.silentflare.com http://127.0.0.1/
curl -sS -o /dev/null -w 'POST=%{http_code}\n' -H Host:blog.silentflare.com http://127.0.0.1/posts/coming-soon/
```

To inspect the active release:

```sh
git -C /opt/silentflare/app rev-parse --short HEAD
readlink -f /opt/silentflare/blog/current
tail -n 120 /var/log/silentflare-deploy.log
```

To roll back, point `current` to an earlier release and keep the change atomic:

```sh
ln -sfn /opt/silentflare/blog/releases/<release-id> /opt/silentflare/blog/current.next
mv -Tf /opt/silentflare/blog/current.next /opt/silentflare/blog/current
```

## Avoid Duplicate Indexing

If Ghost's default front end is reachable at the same public content URLs as Astro, search engines may index duplicates. Prefer one of these approaches:

- Put Ghost Admin/API on a private or CMS-only subdomain such as `cms.example.com`.
- Let Astro own the public blog domain such as `example.com`.
- In Ghost, avoid linking the default Ghost front end as the canonical public site when Astro is the public front end.
- If Ghost must stay public, configure robots or reverse proxy rules so only the Astro front end is indexed.

## Content Mapping

The adapter maps Ghost posts into the front-end `BlogPost` type:

- `title`
- `slug`
- `html`
- `excerpt` and `custom_excerpt`
- `feature_image`
- `published_at`
- `updated_at`
- `reading_time`
- `tags`
- `authors`
- `primary_tag`
- `primary_author`
- `meta_title`
- `meta_description`

Pages and components should use the adapter type instead of raw Ghost fields.

## Troubleshooting

### Posts Do Not Load

Check that `GHOST_URL` is reachable and `GHOST_CONTENT_API_KEY` is the Content API Key from a custom integration.

### Ghost URL Slash

Both `https://cms.example.com` and `https://cms.example.com/` work. Do not set `GHOST_URL` to `https://cms.example.com/ghost/api/content`.

### Images Are Broken

Ghost returns absolute image URLs. Make sure the Ghost domain is public and image hotlinking or proxy rules are not blocking `/content/images`.

### Mixed Content

If the Astro site is HTTPS, Ghost image and API URLs must also be HTTPS.

### Build Fails Without Ghost Config

Production builds fetch Ghost content at build time. Set `GHOST_URL` and `GHOST_CONTENT_API_KEY`. For local UI-only checks, use:

```cmd
set GHOST_ALLOW_EMPTY=true
pnpm build
```

### RSS And Sitemap URLs

RSS is available at `/rss.xml`. The sitemap is generated by Astro at build time. Set `SITE_URL` to the final Astro domain before deployment.
