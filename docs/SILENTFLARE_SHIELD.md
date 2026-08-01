# SilentFlare Shield Architecture and MVP

## 1. Repository Analysis and Boundaries

SilentFlareNEXT is an Astro static renderer backed by the Ghost Content API. Ghost owns posts, tags, authors, SEO metadata, and `/content/` media. The public identity surfaces are Astro/Svelte applications, while `server/api/app.py` is the independent FastAPI authority for credentials, opaque account sessions, CSRF, profiles, comments, and Admin data actions. Production static releases and FastAPI are deployed separately on FNS1, and Nginx maps the public subdomains to their respective origins.

Those boundaries make an in-repository Astro middleware or a collection of FastAPI endpoint checks the wrong design. Shield is therefore implemented under the standalone `shield/` root. It has its own process, data files, migrations, administration surface, security secrets, and deployment lifecycle. The existing application and Ghost code are unchanged.

```text
Internet client
    |
Cloudflare: TLS, WAF, bot signals, Turnstile edge
    |
Nginx: trusted client-IP normalization, timeouts, emergency fallback
    |
SilentFlare Shield: classify -> rate -> score -> rule -> decide -> sign
    |
    +--> blog/accounts/admin static Astro origin
    +--> api FastAPI origin
    +--> cms Ghost origin

shield.silentflare.com --> Nginx --> Shield public decision portal
```

Shield never reads passwords, raw TOTP secrets from the account system, Turnstile response tokens after verification, or complete session tokens. It stores keyed digests for correlation and stable user IDs only when an optional adapter supplies them. It never writes risk columns into Ghost or account tables.

## 2. Recommended Technology Stack

| Layer | MVP choice | Scale-out choice | Reason |
| --- | --- | --- | --- |
| Gateway/API | Python 3.13, FastAPI, Uvicorn, HTTPX | Multiple stateless gateway replicas | Matches the existing operational language while remaining a separate service |
| Persistence | SQLite in WAL mode | PostgreSQL 16 | Simple FNS1 MVP, transactional rules and audit data, clean migration path |
| Counters | SQLite transactional counters | Redis 7 cluster | Exact single-node behavior now; low-latency distributed token buckets later |
| IP intelligence | Trusted Cloudflare headers plus cache-backed provider adapter | Multiple commercial feeds with circuit breakers | Avoids blocking on one vendor and preserves cached decisions |
| Admin UI | Independent HTML/CSS/JavaScript application served by Shield | SvelteKit static bundle consuming the same APIs | Small attack surface for the MVP, no coupling to blog assets |
| Edge | Cloudflare and Nginx | Cloudflare Workers prefilter where justified | Preserves origin control and supports outer-edge volumetric protection |
| Packaging | Docker Compose | systemd-managed containers or Kubernetes | Independent start, stop, upgrade, rollback, and uninstall |

## 3. Directory Structure

```text
shield/
  app/
    blocking.py           public ban IDs, error-code catalog, normalization
    config.py             environment-only runtime configuration
    database.py           migrations, transactions, audit helpers
    geo.py                Cloudflare/provider IP intelligence and cache
    main.py               gateway, admin API, challenge, proxy, health
    rate_limit.py         fixed, sliding, and token-bucket policies
    risk.py               configurable score and risk bands
    rules.py              list matching and JSON rule evaluation
    security.py           HMAC headers and signed challenge cookies
  adapters/
    fastapi.py            optional header-verification helper
  migrations/
    0001_initial.sql
    0002_correlation_and_moderation.sql
    0003_response_rate_policies.sql
    0004_immutable_rule_versions.sql
    0005_account_projections.sql
    0006_control_plane.sql
    0007_operations_and_response.sql
    0008_public_block_cases.sql
  nginx/
    silentflare-shield.conf
  static/
    index.html
    app.css
    app.js
    challenge.html
    blocked.html
    blocked.css
    shield-mark.png
  tests/
    test_mvp.py
  .env.example
  Dockerfile
  docker-compose.yml
  requirements.txt
```

## 4. Independent Database Design

The MVP schema is normalized around Shield-owned facts:

| Table | Purpose and retention |
| --- | --- |
| `settings` | Version-neutral runtime values such as global mode and risk weights; secrets are forbidden |
| `access_lists` | Scoped temporary/permanent allow and deny entries with creator, note, and expiry |
| `rules` | Current rule definition, priority, mode, enabled state, version, and hit count |
| `rule_versions` | Immutable rule snapshots used for history and rollback |
| `rate_policies` | Route/dimension/algorithm budgets and escalation action |
| `rate_counters` | Short-lived counter state; a cleanup job may remove expired windows |
| `ip_intel` | Masked display IP, keyed IP digest, location/network attributes, first/last seen, cache expiry |
| `device_risk` | Pseudonymous device signal summary; never a sole blocking authority |
| `identity_relations` | Keyed IP/account/device/session digests for association counts and graph analysis |
| `bans` | Typed restrictions, creator, reason, expiry, revocation actor, and revocation reason |
| `risk_events` | Redacted request decision record, reasons, matched rules, actions, review state, and trace ID |
| `content_reviews` | Content digest, signals, risk, action, and review state; not a copy of Ghost content |
| `alert_configs` | Encrypted delivery endpoints and thresholds; production encryption key remains outside the DB |
| `audit_log` | Append-only administrative actions protected by no-update/no-delete triggers |

PostgreSQL production evolution should add row partitioning for `risk_events`, native `inet/cidr` columns, JSONB indexes, table-level audit permissions, and a separate retention worker. Redis keys should contain keyed identity digests, never raw email, API keys, or session tokens.

Recommended retention is 30 days for detailed risk events, 180 days for aggregate network facts, policy-defined ban history, and at least one year for administrative audit records. Legal/privacy requirements override these defaults.

## 5. Rule Engine Design

Rules are ordered by ascending priority and then ID. Conditions use a typed JSON expression tree with `all` and `any` groups. Leaf operators are `eq`, `neq`, `in`, `not_in`, `contains`, `glob`, `gte`, `lte`, and `exists`.

```json
{
  "all": [
    {"field": "country", "op": "not_in", "value": ["TW", "US"]},
    {"field": "ip_type", "op": "eq", "value": "datacenter"},
    {"field": "account_age_hours", "op": "lte", "value": 24},
    {"field": "requests_60s", "op": "gte", "value": 30}
  ]
}
```

Supported condition fields are host, path, method, IP/CIDR list result, ASN, country, region, IP type and flags, account status and age, email verification, 2FA state, device state, session state, user agent, rate facts, score, and time window. Fields unavailable to the MVP remain absent rather than guessed.

Actions are `allow`, `block`, `log`, `delay`, `rate_limit`, `turnstile`, `email_verify`, `reauthenticate`, `revoke_session`, `read_only`, `freeze_account`, `manual_review`, `temporary_ban`, and `notify_admin`. Actions requiring business authority emit a signed decision or webhook command; Shield does not update the account database.

The MVP implements ordered evaluation, enable/disable state, observe/enforce state, nested expressions, simulation against recent events, immutable version snapshots, hit counts, and a global-block guard. The next phase adds update/copy/rollback endpoints, four-eyes approval for high-impact rules, scheduled activation, and shadow comparison between versions.

Before publishing a high-risk rule, the control plane must simulate at least the previous 24 hours, display matched request and known-good counts, reject an unscoped global block, store a new version, and require an owner confirmation. The previous successfully loaded rules remain in memory when parsing or loading fails.

## 6. Risk Scoring Design

Every evaluated request receives a bounded integer score from 0 to 100. The default additive weights are stored as code defaults and can be overridden through the `risk_weights` setting.

| Signal | Default weight |
| --- | ---: |
| VPN | +18 |
| Proxy | +20 |
| Tor | +35 |
| Data center | +15 |
| Known malicious IP | +50 |
| New device | +8 |
| Automation signature | +22 |
| Missing browser headers | +7 |
| Abnormal Origin/Referer | +10 |
| Rate policy exceeded | +25 |
| Explicit deny list | force 100 |
| Explicit allow list | force 0 and allow |

Future account signals include impossible travel, new-country session use, password failures, account age, email domain quality/MX, verification state, 2FA state, multi-account correlation, refresh-token replay, and positive historical behavior. A device fingerprint can add evidence but cannot independently block.

```text
0-19   normal    allow
20-39  observe   allow and record
40-59  verify    require Turnstile or stronger proof
60-79  restrict  delay, rate limit, temporary restriction, or review
80-100 block     deny and create a high-risk event
```

Policy actions can override the score. An allow list is evaluated before score enforcement; owner-authenticated administration can still be subject to a separate non-bypassable safety policy.

The Subjects workspace presents exact score assignment, reset to 0, escalation to 100, score adjustment, cap/floor, response exemption, and permanent allowlisting as selectable manual-control modes. Selecting a mode never writes immediately: an audit reason is required before Apply becomes available. A permanent allowlist is stored as an unscoped, non-expiring score cap of 0: the raw and effective entity score remain 0, queued signals cannot raise it, and ordinary protected services allow the matching entity. When active, the same mode becomes Remove allowlist and revokes that override without deleting the append-only history. Admin and CMS hosts retain their non-bypassable safety policy.

## 7. Gateway and Reverse Proxy Design

Nginx restores the visitor address only when the socket peer belongs to Cloudflare's published network list, then sends that address to Shield in the internal `X-SF-Client-IP` header. Uvicorn proxy-header rewriting is disabled so Shield can independently verify the Nginx socket peer before accepting this header. Shield ignores public `X-Forwarded-For` input, removes edge identity and inbound `X-SF-Shield-*` values before proxying, resolves the host through an explicit upstream map, evaluates the request, creates new signed headers, and proxies with bounded connection/read timeouts.

Location and network identity use independent evidence. Cloudflare Managed Transform headers are fused with the cache-backed GeoIP provider; RIPEstat's routed-prefix observation validates the current origin ASN. The cache records a source and `high`, `medium`, `low`, or `unknown` confidence for country, region, and ASN separately. Conflicts remain visible to operators rather than being silently overwritten. Nginx's Cloudflare CIDRs are versioned in `shield/nginx/fns1/silentflare-cloudflare-real-ip.conf` and must be synchronized with Cloudflare's official IPv4 and IPv6 lists during routine edge maintenance.

Origins are never public listeners. Firewall rules should allow the origin ports only from localhost/container networking. This is essential: if users can reach an origin directly, Shield is advisory rather than a perimeter.

The reference Nginx file demonstrates public blog read fallback and sensitive API fail-closed behavior. The actual FNS1 configuration should preserve its existing TLS and Cloudflare real-IP configuration. Nginx must be tested with `nginx -t` before reload.

## 8. Minimal Integration with SilentFlareNEXT, Ghost, and FastAPI

### SilentFlareNEXT

No page or layout change is required for observe, allow, log, block, delay, or rate-limit decisions. The optional Turnstile browser adapter only needs to understand a `403` response with `action: "turnstile"`; ordinary HTML GET requests receive Shield's standalone challenge page. SilentFlareNEXT remains buildable and deployable with Shield removed.

### Ghost

Ghost remains the content owner and is treated as an upstream HTTP service. Shield does not use a Ghost Admin API key, alter Ghost core, or write moderation fields into Ghost tables. CMS administrator paths should be fail closed and use stricter rules than public `/content/` media reads.

### FastAPI

The optional `shield/adapters/fastapi.py` helper verifies the signed decision envelope for endpoints that need risk context. FastAPI continues to authenticate credentials, validate CSRF, issue/revoke sessions, and authorize account/admin actions. It must never treat a Shield allow decision as authentication.

For account-aware scoring, FastAPI exposes a private HMAC-authenticated session resolver returning only the stable user ID for the opaque account cookie. Shield caches the keyed session digest and minimal result for five minutes; it never persists or logs the raw cookie. Account posture remains a separate bounded snapshot containing account age, email-verified boolean, 2FA boolean, role class, and activity counts. Session revocation/freeze actions are sent to a private FastAPI webhook with request ID, stable user/session digest, reason, expiry, timestamp, and HMAC signature. No business table access is granted to Shield.

## 9. Administration Application Design

The independent English console follows SilentFlare's pale blue/white visual language while using a denser security-operations layout. It is not embedded in the blog. The responsive navigation includes:

```text
Overview                 Countries & regions      Content review
Risk events              Rate limits              Session management
IP intelligence          Rule engine              Administrator security
Account risk             Ban lists                Alerts
Device risk              Audit log                System settings
```

The implemented dashboard reports daily risk events, high-risk blocks, verification decisions, active bans, highest-risk countries, top rules, and protected service status. Events, IP cache, access lists, rate policies, rules, bans, risk-model settings, and audit records have working data views. Account, device, content, session, and alert areas reserve the explicit independent API boundaries required by later phases.

The primary operator experience is the `Shield` workspace inside the existing SilentFlare Admin Svelte application. The former Members and Protection navigation groups are one operator category: account records and comment moderation remain FastAPI-owned business actions, while risk subjects, factors, geography, and protected sites call Shield directly through the same-origin `/__shield/api/admin/*` route. `Account directory` and `Risk subjects` are deliberately named by responsibility rather than presented as two interchangeable user lists.

This frontend placement does not make Shield an embedded backend. The Admin bundle contains presentation components only and owns no Shield rules, scoring, persistence, gateway, or worker logic. Production Nginx sends protected public traffic to the standalone Shield gateway before any Astro, Ghost, or FastAPI origin; the Shield control and worker roles use their own processes and database. Astro may be rebuilt without rebuilding Shield, and Shield may be upgraded, bypassed, or removed without importing its Python modules into the website or business API. The shared Admin session is delegated authentication, not process or data ownership.

The Subjects, Risk factors, Geography, and Sites views operate on live Shield data. Geography provides the complete ISO 3166 country and subdivision catalog instead of limiting configuration to previously observed locations. Country and regional restrictions require an audit reason; a matching request is assigned risk score 100 and the linked Account and IP roots receive an expiring, append-only `GEOGRAPHY_RESTRICTION` ledger entry. Enforcement still follows the selected site mode: observe records the decision, while enforce denies it.

Only a hostname whose edge route actually points to Shield is marked `connected`; a configured but unrouted hostname is `staged`. Enabling a staged service prepares its data-plane policy but does not pretend to rewrite Nginx or Cloudflare. This distinction prevents a control-plane toggle from giving a false protection signal. Rate-policy responses are applied automatically by the gateway: for example, `5 comments / 1 minute -> temporary ban / 6 hours` creates an expiring Account-root ban when the sixth authenticated request is evaluated in enforce mode, with IP-root fallback for anonymous traffic. Repeated over-limit requests reuse the active ban instead of generating duplicate records.

Account synchronization is a bounded projection rather than database coupling. A Shield background task requests the private FastAPI account snapshot every minute with a timestamped HMAC signature and upserts only a keyed account ID, an operator label, role, country code, verification/2FA/disabled flags, timestamps, activity counts, and derived risk metadata into its own database. Passwords, email addresses, raw sessions, verification data, and business-table access are excluded. A failed synchronization leaves the last successful projection available and does not interrupt gateway traffic. Opening the Admin Security workspace also performs a freshness check, while the explicit sync command forces immediate reconciliation.

Account responses use a separate private `POST /internal/shield/respond` FastAPI contract. Shield signs the method, fixed path, timestamp, command ID, action, and stable account ID with the sync secret. FastAPI rejects stale or altered commands, stores an idempotency record, and remains the only component allowed to revoke sessions or disable an account. Shield stores only command state and its keyed account correlation; it never receives raw session tokens.

The console does not issue a second password, TOTP secret, or Shield-specific administrator session. Each console request forwards only the existing `sf_bot_session` cookie to the private FastAPI `GET /auth/me` endpoint and requires `bot.id` to equal `SilentFlare Admin`. Mutations reuse that Admin session's CSRF value. When the existing Admin session expires, is revoked, or the Owner disables web login, Shield access stops immediately. Production should additionally restrict source networks and add role tiers (`viewer`, `analyst`, `rule_admin`, `owner`). Only the owner can change global bypass or publish high-impact rules.

## 10. API Route Design

Implemented routes:

| Method and path | Purpose |
| --- | --- |
| `GET /__shield/health/live` | Process liveness without dependency checks |
| `GET /__shield/health/ready` | Database readiness and active mode |
| `POST /__shield/challenge/verify` | Verify Turnstile and issue a short, IP/UA-bound proof |
| `GET /` on `shield.silentflare.com` | Public Shield service landing page |
| `GET /blocked?...` on `shield.silentflare.com` | Render a signed, non-sensitive block or ban case |
| `GET /__shield/api/admin/session` | Validate the existing SilentFlare Admin session and return its CSRF state |
| `GET /__shield/api/admin/overview` | Dashboard aggregates |
| `GET /__shield/api/admin/dashboard` | Live time series, account posture, event decisions, policies, and service coverage |
| `POST /__shield/api/admin/sync/accounts` | Force a minimal authenticated FastAPI account projection refresh |
| `POST /__shield/api/admin/events/{id}/action` | Apply a contextual IP/account block or dismiss an event without raw target input |
| `PUT /__shield/api/admin/services/{host}` | Enable/bypass one service and set its mode and failure policy |
| `PUT /__shield/api/admin/rate-policies/{id}` | Tune an automated threshold, window, response, and cooldown |
| `POST/DELETE /__shield/api/admin/geo-policies...` | Publish or disable country/region controls |
| `GET/PUT /__shield/api/admin/geography/restrictions` | List the complete ISO catalog and audit country/region restrictions |
| `PUT /__shield/api/admin/accounts/{digest}/risk` | Apply, replace, or clear an expiring manual risk adjustment |
| `PUT /__shield/api/admin/entities/{id}/score` | Set an exact audited entity score from 0 to 100; permanent allowlisting uses the existing override endpoint with a non-expiring score cap of 0 |
| `POST /__shield/api/admin/accounts/{digest}/response` | Send a signed re-authenticate, revoke-session, review, or freeze command to FastAPI |
| `GET /__shield/api/admin/events` | Filter-ready recent risk events |
| `GET /__shield/api/admin/intel` | Cached redacted IP intelligence |
| `GET/POST/DELETE /__shield/api/admin/lists...` | List administration |
| `GET/POST /__shield/api/admin/rules` | Rule list and guarded create |
| `POST /__shield/api/admin/rules/test` | Replay a rule against recent event summaries |
| `GET /__shield/api/admin/rate-policies` | Effective rate policy list |
| `GET/PUT /__shield/api/admin/settings/risk` | Validated, audited score weights and thresholds with version creation |
| `POST /__shield/api/admin/settings/risk/simulate` | Replay candidate weights and thresholds against up to 1,000 recent events |
| `POST /__shield/api/admin/settings/risk/rollback/{version}` | Restore an audited risk-model version |
| `GET/POST /__shield/api/admin/bans` | Ban list and creation |
| `POST /__shield/api/admin/bans/{id}/revoke` | Audited ban revocation |
| `GET /__shield/api/admin/audit` | Append-only audit history |
| `PUT /__shield/api/admin/alerts/config` | Configure high-risk, surge, and daily-report thresholds |
| `POST /__shield/api/admin/alerts/test` | Queue and optionally deliver a redacted test alert |
| `POST /__shield/api/admin/alerts/{id}/dismiss` | Dismiss an operator alert |
| `GET /__shield/api/admin/reports/daily` | Return and persist the rolling 24-hour report |
| `POST /__shield/api/admin/mode` | Audited bypass/observe/enforce switch |

Planned control/data APIs are `/rules/{id}`, `/rules/{id}/versions`, `/rules/{id}/rollback`, `/events/{id}/review`, `/correlations/{type}/{digest}`, and `/content/evaluate`. Browser mutations require the delegated Admin CSRF proof and produce audit entries; private response commands are signed and idempotent.

### Public Ban IDs and Error Codes

Every persistent ban has a public, non-secret identifier in the form `SFB-` followed by 16 uppercase hexadecimal characters. This is the only ban identifier exposed to a blocked client. SQLite row IDs, subject hashes, raw subjects, reasons, operator identities, and audit details remain internal.

| Subject | Temporary | Permanent |
| --- | --- | --- |
| IP | `SF-BAN-T100` | `SF-BAN-P100` |
| CIDR network | `SF-BAN-T110` | `SF-BAN-P110` |
| ASN | `SF-BAN-T120` | `SF-BAN-P120` |
| Country | `SF-BAN-T130` | `SF-BAN-P130` |
| Region | `SF-BAN-T140` | `SF-BAN-P140` |
| Account | `SF-BAN-T200` | `SF-BAN-P200` |
| Session | `SF-BAN-T210` | `SF-BAN-P210` |
| Device | `SF-BAN-T220` | `SF-BAN-P220` |
| Email | `SF-BAN-T230` | `SF-BAN-P230` |
| Email domain | `SF-BAN-T240` | `SF-BAN-P240` |
| API key | `SF-BAN-T250` | `SF-BAN-P250` |

Non-persistent decisions use `SF-BLOCK-310` for access lists, `SF-BLOCK-320` for geography, `SF-BLOCK-330` for rules, `SF-BLOCK-340` for score thresholds, `SF-BLOCK-350` for automated policies, and `SF-BLOCK-399` as the guarded fallback.

Browser `GET` and `HEAD` requests with an HTML accept header receive `303 See Other` to the public portal. API, mutation, and non-HTML requests remain `403` JSON so clients do not accidentally follow a redirect into an HTML document. Those responses still carry `Location`, `X-SF-Shield-Error-Code`, `X-SF-Shield-Ban-ID` when applicable, and `X-SF-Shield-Request-ID`. Portal parameters are HMAC-signed and contain only the code, public ban ID, request reference, originating hostname, expiry, and restriction scope. The originating path and all raw subject values are excluded.

## 11. Signed Request Header Scheme

Shield always deletes public values for these names before creating its own:

```text
X-SF-Shield-Request-ID
X-SF-Shield-Risk-Score
X-SF-Shield-Risk-Level
X-SF-Shield-Country
X-SF-Shield-ASN
X-SF-Shield-IP-Type
X-SF-Shield-Device-ID
X-SF-Shield-Action
X-SF-Shield-Timestamp
X-SF-Shield-Signature
```

The signature is lowercase hexadecimal HMAC-SHA256 using a Shield-specific key. The canonical UTF-8 payload is:

```text
UPPERCASE_METHOD\n
RAW_PATH_WITHOUT_QUERY\n
x-sf-shield-request-id:<value>\n
x-sf-shield-risk-score:<value>\n
x-sf-shield-risk-level:<value>\n
x-sf-shield-country:<value>\n
x-sf-shield-asn:<value>\n
x-sf-shield-ip-type:<value>\n
x-sf-shield-device-id:<value>\n
x-sf-shield-action:<value>\n
x-sf-shield-timestamp:<unix-seconds>
```

The origin verifies exact method/path, constant-time signature equality, and a maximum 30-second timestamp skew. Network isolation prevents replay to an origin from the public internet. A future version can add a body digest and one-use request ID store for sensitive webhook commands.

## 12. Bypass, Availability, and Failure Degradation

| Condition | Public blog GET | Login/register/comment/API write | Admin/CMS |
| --- | --- | --- | --- |
| Mode `bypass` | Proxy, stripped/signed bypass header | Same | Same, with an optional non-bypassable edge policy |
| Mode `observe` | Evaluate, record, never enforce | Evaluate, record, never enforce | Evaluate, record, never enforce |
| Mode `enforce` | Enforce active policy | Enforce active policy | Enforce strict policy |
| IP provider down | Cached/Cloudflare data, unknown attributes | Same; do not invent risk | Same |
| Shield DB down | Bounded in-memory counters/events, then fail open | In-memory record plus fail closed with 503 | In-memory record plus fail closed with 503 |
| Rule load error | Last known good in-memory rules | Last known good rules | Last known good rules |
| Shield process down | Nginx named-location fallback | Nginx returns 502/503 | Nginx returns 502/503 |
| Upstream down | Bounded 502/504 | Bounded 502/504 | Bounded 502/504 |

`SHIELD_FAIL_POLICY=route` supplies the fallback default. Each service can override it with `open`, `closed`, or `route`; the gateway snapshots that service policy before evaluation so it can still make the intended failure decision if a later database operation fails. During a database outage, Shield retains a bounded 1,000-event memory buffer and bounded per-route counters; this is intentionally ephemeral and does not pretend that persistence succeeded. Nginx supplies the process-down fallback for blog reads. Timeouts, provider cache, WAL, last-good rules, and container health/restart policies prevent a secondary dependency from holding traffic indefinitely.

The emergency switch is the audited global `bypass` mode. The out-of-process emergency procedure is to restore the original Nginx upstream for the affected hostname and reload Nginx. Uninstalling Shield consists of restoring those routes, stopping the Compose project, and retaining/exporting the Shield data volume according to policy.

## 13. Docker Compose and Deployment

`shield/docker-compose.split.yml` is the portable split development deployment. `shield/docker-compose.split.prod.yml` uses Linux host networking and binds the gateway, control, and portal only to loopback ports 9080, 9082, and 9083. The one-shot migrator completes before these roles and the worker start. `shield/docker-compose.prod.yml` remains the single-process rollback target. All variants run non-root, read-only containers, mount only the Shield data volume, and drop Linux capabilities. `shield/nginx/silentflare-shield.conf` remains a generic merge reference. The production FNS1 files in `shield/nginx/fns1` are installable, versioned configurations.

FNS1 uses an internal Nginx origin listener on `127.0.0.1:9081` for the Astro account/admin/blog renderers and Ghost HTTP traffic. Public Nginx sends the five protected Host values to Shield on `127.0.0.1:9080`; Shield then selects `9081` or FastAPI on `9010`. This prevents the routing loop that would occur if a Shield upstream pointed back to the public port. The separate `shield.silentflare.com` Nginx host also reaches port `9080`, but it serves only explicit public portal routes and is never added to the protected-upstream map. The blog has a one-second connection timeout and named fail-open origin. Accounts, API, Admin, and CMS fail closed. CMS Upgrade requests bypass the HTTP-only Shield gateway and proxy directly to Ghost; ordinary CMS HTTP traffic is still evaluated.

Recommended FNS1 layout:

```text
/opt/silentflare/shield/current       versioned Shield source/release
/opt/silentflare/shield/shared/.env   root-owned 0600 environment file
/var/lib/docker/volumes/...           Shield database volume
/etc/nginx/sites-available/...        host routing and fallback policy
```

Upgrade procedure: build a tagged image, run migrations against a backup, start the candidate on a second loopback port, check readiness and a proxy smoke request, atomically change the Nginx upstream, reload, observe, and retain the prior image/config for rollback. Shield deployment is separate from the Astro static release webhook and separate from manual FastAPI deployment.

The FNS1 helper sequence is:

```bash
bash shield/scripts/configure-fns1-env.sh
bash shield/scripts/install-fns1-routing.sh
docker compose -f shield/docker-compose.split.prod.yml -p silentflare-shield up -d --build
```

The environment configurator copies the existing Turnstile values on the host without printing them, connects all five protected hostnames, sets `SHIELD_PUBLIC_URL=https://shield.silentflare.com`, raises the CMS request-body budget to 50 MiB, and points Shield at the internal origins. The routing installer installs and enables the separate portal host, backs up every replaced file under `/etc/nginx/shield-backups`, validates with `nginx -t`, and automatically restores the backup if validation fails.

## 14. Environment Template

The committed `shield/.env.example` documents only names and placeholders:

- Mode, failure policy, database path, and timeouts.
- Independent internal HMAC key.
- Private Admin introspection URL and existing Admin cookie name; no additional Admin credential.
- Dedicated Turnstile site/secret keys.
- Cache-backed IP provider URL.
- Trusted proxy CIDRs.
- Explicit host-to-origin JSON map.
- Public decision-portal URL; it is not an upstream and carries no secret.

The real `.env` must remain uncommitted, root-readable only, and preferably supplied by a secret manager. Values must never appear in logs or admin API responses. Production must keep `SHIELD_COOKIE_SECURE=true`.

## 15. Database Migrations

Migrations are ordered SQL files recorded in `schema_migrations`. Startup applies each file and its version marker in one `BEGIN IMMEDIATE` transaction under an application lock. SQLite uses WAL and foreign keys. `0001_initial.sql` creates the gateway/control tables and default policies; `0002_correlation_and_moderation.sql` adds pseudonymous relation, device, moderation, and alert structures; `0003_response_rate_policies.sql` makes 404 scanning response-aware; `0004_immutable_rule_versions.sql` protects rule history from update or deletion; `0005_account_projections.sql` and `0006_control_plane.sql` add isolated account posture and live service/geography controls; `0007_operations_and_response.sql` adds response commands, risk-model versions, alert policy/events, daily reports, five-host observation defaults, and the six-hour automatic comment-ban response; `0008_public_block_cases.sql` assigns every existing and future ban a unique public case identifier without exposing the internal row ID; `0009` through `0013` implement the append-only entity risk engine and two-root Account/IP model; `0014_geo_restriction_catalog.sql` adds stable ISO subdivision codes for catalog-backed geographic restrictions; and `0015_ip_intel_coordinates.sql` stores provider coordinates for the local, non-tracking Admin location map.

Before production migration:

1. Stop writes or create a consistent SQLite online backup.
2. Record the image and schema version without printing secrets.
3. Apply migrations to a copy and run the test suite.
4. Start the candidate and verify readiness.
5. Roll back the image and database backup together if migration validation fails.

Never edit an applied migration. Add a new forward migration and, for destructive evolution, a separately tested rollback procedure.

## 16. Test Strategy

The included unit suite covers canonical header signing, method/path binding, delegated Admin-session validation, CIDR matching, combined scoring, nested rule conditions, migrations, the default login rate policy, contextual bans, signed response delivery, model simulation/version/rollback, alert operations, and dashboard contracts.

Required CI layers:

1. Static: Python compilation, formatting/lint, dependency audit, secret scan, and container scan.
2. Unit: IPv4/IPv6/CIDR, every rule operator, score boundaries, rate algorithms, Admin-session delegation, HMAC tampering, expiry, and redaction.
3. Integration: fake IP provider, fake Turnstile, SQLite outage, stale cache, upstream timeout, spoofed Shield headers, signed header verification, and fail matrix.
4. Proxy: preserve status/body/cookies/query, remove hop-by-hop headers, streaming, request size limits, and all five Host mappings.
5. Security: admin brute-force, CSRF, cookie flags, rule global-lockout guard, SSRF host rejection, traversal, XSS in event/admin fields, replay, and audit immutability.
6. Performance: p50/p95/p99 latency, token-bucket contention, WAL growth, provider circuit breaker, and 10x bursts.
7. Deployment: container health, graceful stop, second-port upgrade, Nginx fail-open blog read, fail-closed sensitive request, bypass, and rollback.

Run the MVP checks from `shield/`:

```powershell
python -m compileall app adapters tests
python -m unittest discover -s tests -v
docker compose config
```

## 17. Shield 2.0 Entity Risk and Split Runtime

Shield remains an independent backend exoskeleton under `shield/`. Its operator frontend intentionally stays inside Admin for a single owner workflow, but Astro and FastAPI business logic do not import Shield modules. The only application-level integration is the Admin Shield presentation layer, which calls the same-origin Shield control API.

The runtime has four bounded entry points: `app.gateway.app:app` for protected traffic, `app.control.app:app` for delegated Admin control, `app.portal.app:app` for the minimal public decision site, and `app.worker.main` for account synchronization, score decay, alerts, and maintenance. `app.main:app` remains the compatibility composition used by tests and controlled single-process fallback.

Migration `0009_entity_risk_ledger.sql` adds independent subjects, an append-only risk ledger, mutable decay effects, scoped operator overrides, subject relations, public cases, automation actions, and job history. Gateway signals add bounded, expiring risk to the relevant subjects. Worker decay creates explicit negative or reversal ledger entries, so every increase and decrease is attributable.

Migration `0013_two_root_risk_entities.sql` adds pseudonymous evidence, authenticated Account-IP relationships, and a keyed session-resolution cache. It archives non-root subjects as legacy evidence without copying their scores, so historical ledgers remain intact and root scores are not double-counted.

The public contract now uses stable three-digit codes: `1xx` identity, `2xx` network, `3xx` behavior, `4xx` automation/policy, and `501` protected administration. The public portal renders only the inaccessible message, code, and `SFB-` identifier. Detailed reasons, scores, subjects, paths, expiry, and internal references remain private.

The Admin control surface intentionally exposes only four workspaces: `Subjects`, `Risk factors`, `Geography`, and `Sites`. Subjects have only two operator-visible roots: `Account` and `IP`. Sessions, devices, CIDR, ASN, email/domain, API key, country, and region are immutable linked evidence under those roots rather than independent score controls. Authenticated observations create bidirectional Account-IP relationships; each root retains its own complete append-only score history, expiring score adjustments, caps, floors, and response exemptions. Legacy non-root scores remain archived without being copied into a root, preventing migration double-counting. Risk factors publish a complete versioned weight set with a required audit reason and pre-publish traffic simulation. Geography lists all ISO countries and subdivisions and publishes audited restrictions whose matches score 100. Sites expose one audited protection switch per configured hostname. Rate enforcement, decay, correlation, threat intelligence, account synchronization, and response jobs remain autonomous backend services rather than operator-facing configuration screens.

## 18. Phased Development Plan

### Phase 0: Perimeter and Observation (Complete)

Deploy the implemented MVP on loopback, connect one hostname, keep observe mode, verify signed-header stripping, establish dashboards, tune IP cache and rate budgets, and measure added latency/error rate.

### Phase 1: Narrow Enforcement (Complete for FNS1 MVP)

Enforce explicit IP/CIDR/ASN/country lists, login/registration/comment/API frequency policies, Turnstile, temporary IP bans, and high-risk events. Add fake-provider/Turnstile integration tests and rule update/copy/rollback APIs.

### Phase 2: Account and Session Response Adapter (Complete for FNS1 MVP)

The private FastAPI metadata projection and signed account/session response webhook are implemented. Remaining expansion work is session replay epochs, impossible-travel logic, account/device relation counts, email-domain/MX reputation, and minimal browser signal collection with consent/retention review.

### Phase 3: Content and Analyst Workflow

Add content evaluation for usernames/profiles/comments, URL/domain reputation, duplicate detection, sanitization signals, review queues, event merging, correlation graphs, bulk actions, false-positive recovery, and redacted exports.

### Phase 4: Distributed Reliability

Move persistence to PostgreSQL, counters to Redis, add gateway replicas, provider adapters with health/circuit breakers, alert delivery, config signing, owner approval workflow, immutable external audit export, backups, and disaster recovery exercises.

### Phase 5: Continuous Tuning

Add rule quality metrics, false-positive budgets, canary rules, historical baselines, privacy reviews, threat-feed lifecycle, quarterly key rotation, load testing, and scheduled failover/bypass drills.

## MVP Acceptance Criteria

- Shield can start, stop, upgrade, and be removed without modifying Astro, Ghost, or FastAPI business logic.
- All five hosts resolve only through an explicit upstream allow map.
- Public spoofed Shield headers are removed and replaced with a valid signed envelope.
- Observe mode never enforces; bypass mode performs no risk decision; enforce mode applies lists, scores, rules, limits, Turnstile, and temporary bans.
- IPv4/IPv6 and CIDR inputs are validated; country/region/ASN scopes are supported.
- Risk events and administrative actions are redacted and independently persisted.
- Liveness, readiness, last-good rules, cache fallback, route fail policy, and Nginx public-read fallback are testable.
- The administration console is independent, English-only, responsive, protected by the existing SilentFlare Admin session, CSRF-protected, and audited.
- The original SilentFlare website remains operational after Nginx is pointed back to its original origins and Shield is stopped.
- All five production hosts can traverse Shield without a public-port proxy loop, and blog reads remain available during a Shield process outage.
- The live dashboard exposes only subject operations, versioned risk-factor weights, catalog-backed geographic restrictions, and one protection switch per configured site; all other automation remains internal.
- Geography lists every ISO country and subdivision. A restriction match sets the request score to 100, records a timed Account/IP ledger signal where those roots exist, and denies access only when the matched site is in enforce mode.
- The Subjects workspace exposes only Account and IP roots, shows their bidirectional authenticated relationships and supporting evidence, and pages the complete append-only raw/effective score ledger, including gateway factors, account-posture factor changes, operator controls, cap/floor lifecycle, decay, and expiry.
