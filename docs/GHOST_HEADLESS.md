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

### FNS1 SilentFlare DB Backup

FNS1 creates encrypted all-database backups through the `SilentFlare DB Backup` bot and `/opt/silentflare/deploy/ghost-db-backup.sh`. Runtime settings live in `/opt/silentflare/deploy/ghost-db-backup.env`, which must stay `0600 root root`. Do not copy that env file into this repository and do not print its values in logs.

The backup is intentionally update-proof: it dumps all databases with schema, routines, events, and triggers so future Ghost updates, new tables, and database layout changes remain covered without selecting individual tables.

The backup chain is intentionally conservative:

- `BACKUP_REMOTE=local` is the default behavior. It creates `/opt/silentflare/backups/ghost-db/SilentFLare-DB-Backup-<timestamp>.sql.gz.age` and does not upload to GitHub.
- `BACKUP_REMOTE=github_release` uploads only the encrypted `.sql.gz.age` file to the configured private GitHub repository as a Release asset.
- The server stores only the age public recipient in `BACKUP_AGE_RECIPIENT`.
- The age private key must stay on the user's local machine and must not be uploaded to FNS1, GitHub, Telegram, or this repository.
- Telegram notifications contain metadata only: status, filename, path, release tag, sha256, size, cleanup summaries, timestamp, and hostname.

Before enabling production GitHub uploads, run the dummy Release test from FNS1. It uploads an encrypted non-sensitive text file, verifies the Release asset, then deletes its own test release and tag:

```sh
/opt/silentflare/deploy/ghost-db-backup.sh github-dummy-test
```

Run a local-only production backup:

```sh
BACKUP_REMOTE=local /opt/silentflare/deploy/ghost-db-backup.sh backup
```

To enable GitHub Release uploads, set `BACKUP_REMOTE=github_release` in `/opt/silentflare/deploy/ghost-db-backup.env` after the dummy test succeeds. Required env names are:

```env
BACKUP_REMOTE=github_release
GH_TOKEN=<github-token>
GITHUB_REPO=SilentFlareGit/SilentFlareBackups
BACKUP_AGE_RECIPIENT=age1...
BACKUP_LOCAL_RETENTION=30
BACKUP_RELEASE_RETENTION=30
```

Do not put actual token values in docs, commits, shell history, Telegram, or GitHub issues.

#### Restore A Backup Safely

Download the encrypted `.sql.gz.age` asset from the private GitHub Release or copy it from `/opt/silentflare/backups/ghost-db`. Decrypt only on a trusted local machine that has the age private key:

```sh
age -d -i silentflare-backup-age-key.txt SilentFLare-DB-Backup-xxxx.sql.gz.age > SilentFLare-DB-Backup-xxxx.sql.gz
gunzip -t SilentFLare-DB-Backup-xxxx.sql.gz
gunzip SilentFLare-DB-Backup-xxxx.sql.gz
```

Review the resulting SQL before restoring it anywhere. Restore to a disposable test database first; do not directly overwrite production. Never upload `silentflare-backup-age-key.txt` to FNS1 or store it in this repository.

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
