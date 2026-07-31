# SilentFlare Shield

SilentFlare Shield is an independent, fail-aware security gateway for the SilentFlare service perimeter. It runs between Cloudflare/Nginx and the existing Astro, Ghost, and FastAPI origins. Removing Shield restores the original routing model; no SilentFlareNEXT page or Ghost core change is required.

The MVP includes:

- Reverse proxy routing for the five protected SilentFlare hosts.
- Bypass, observe, and enforce modes with route-sensitive failure policy.
- IPv4/IPv6 handling, Cloudflare location headers, cache-backed IP enrichment, and network classification.
- Scoped IP, CIDR, ASN, country, region, and account allow/deny lists.
- Fixed-window, sliding-window, and token-bucket rate policies.
- A configurable 0-100 risk score, Turnstile challenge, temporary bans, and risk events.
- A versioned JSON rule model, nested conditions, priority, simulation, actions, and hit counts.
- Signed, spoof-resistant internal decision headers.
- A separate English administration console that reuses the existing SilentFlare Admin session, CSRF proof, and append-only audit records.
- A real Security workspace inside SilentFlare Admin with live trends, contextual event actions, automated policies, service coverage, and account-risk projections synchronized from FastAPI without sharing the business database.
- Network intelligence, access-list and ban operations, signed account/session response commands, risk-model simulation/versioning/rollback, configurable alerts, and rolling daily reports.
- A public `shield.silentflare.com` decision portal with signed case links, stable public ban IDs, and subject/duration-specific error codes.
- Two operator-visible risk roots, Account and IP, with sessions, devices, CIDR, ASN, email/domain, API-key, and geography retained as linked evidence under both roots.
- Split gateway, control, portal, and worker entry points that keep Shield deployable as an external security exoskeleton; only `ShieldDashboard.svelte` and its entity explorer are integrated into SilentFlare Admin.
- SQLite/WAL persistence, migrations, health probes, Docker Compose, and an Nginx reference configuration.

The full architecture, data model, integration contract, API plan, failure matrix, and phased roadmap are in [docs/SILENTFLARE_SHIELD.md](../docs/SILENTFLARE_SHIELD.md).

## Quick Start

Create a private `shield/.env` from `.env.example` and replace every placeholder. Use independent random secrets; do not reuse the public account `SESSION_SECRET`.

```powershell
Set-Location shield
docker compose up --build
```

Shield listens only on `127.0.0.1:9080` by default. Test its probes:

```powershell
Invoke-RestMethod http://127.0.0.1:9080/__shield/health/live
Invoke-RestMethod http://127.0.0.1:9080/__shield/health/ready
```

On the Linux origin host, use the production Compose file so Shield can reach services bound to host loopback while Shield itself remains loopback-only:

```bash
docker compose -f docker-compose.split.prod.yml -p silentflare-shield up -d --build
```

For local HTTP-only console testing, set `SHIELD_COOKIE_SECURE=false`. Production must use HTTPS and `SHIELD_COOKIE_SECURE=true`.

## Validation

From `shield/`, with the requirements installed:

```powershell
python -m compileall app adapters tests
python -m unittest discover -s tests -v
docker compose config
```

Validate the split deployment separately:

```powershell
docker compose -f docker-compose.split.yml config
docker compose -f docker-compose.split.prod.yml config
```

The split deployment uses one image with four least-purpose commands. `gateway` owns the request data plane on port 9080, `control` owns Admin APIs on 9082, `portal` owns the public decision site on 9083, and `worker` owns queued signal application, synchronization, decay, automatic response, alerting, and maintenance. The one-shot `migrate` service must complete before any role starts. `docker-compose.prod.yml` remains the controlled single-process fallback and test-compatible rollback target.

## Entity Risk Ledger

Every Account and IP root has an independent score from 0 to 100. Changes are written to the append-only `risk_ledger` with before/after values, delta, raw/effective score kind, reason code, human reason, source, actor, expiry, and parent event. Gateway factors, account-posture factors, manual adjustments, cap/floor activation, revocation, expiry, decay, and automatic expiry all produce explicit entries rather than silently changing a score. Supporting identity and network facts are pseudonymous evidence, not independently adjustable scores. The Admin workspace pages the complete history instead of truncating it to the latest rows.

Admin operators can set an exact score from 0 to 100, apply a temporary positive or negative adjustment, set a score cap or floor, or add a scoped rule/response exemption. The Subjects workspace includes audited shortcuts to set 100, reset to 0, and permanently allowlist an Account or IP root. Permanent allowlisting keeps both raw and effective scores at 0 despite later signals, while authentication, authorization, CSRF, Admin-session enforcement, and the Admin/CMS non-bypassable perimeter remain protected.

## Operational Guardrails

1. Start with `SHIELD_MODE=observe`.
2. Point only one low-risk hostname to Shield first.
3. Review event volume and simulate rules against recent events.
4. Enable enforcement for narrow rules before expanding coverage.
5. Keep the Nginx fail-open origin route only for public blog reads.
6. Keep login, registration, comments, Admin, CMS, and sensitive API routes fail closed.
7. Keep the existing SilentFlare Admin login gate and its Telegram/TOTP verification enabled; Shield does not issue a second administrator credential.

The Admin Security workspace has four operator surfaces: `Subjects`, `Risk factors`, `Geography`, and `Sites`. Subjects exposes Account and IP as always-visible, directly selectable controls, searches root labels and linked evidence, pages each root's complete score ledger, and applies audited temporary adjustments, caps, floors, or response exemptions. Account and IP details show their bidirectional authenticated relationships and supporting evidence. Risk factors publish the complete weight set as a simulated and versioned configuration. Geography lists the complete ISO country and subdivision catalog and applies audited country- or region-level restrictions; every match sets the request and linked Account/IP root score to 100 and writes a timed ledger entry. Sites apply one audited on/off protection decision per configured hostname. Rate policies, decay, correlation, threat intelligence, alerts, account synchronization, and automated response remain internal Shield jobs instead of dashboard configuration.

Shield synchronizes a minimal account projection from a private timestamped and HMAC-signed FastAPI snapshot every minute. It stores stable keyed account hashes, usernames as operator labels, security posture, activity counts, and derived risk metadata only. It never copies passwords, email addresses, session tokens, verification material, or authentication secrets. A site is reported as connected only after its edge route actually traverses Shield. The site switch changes Shield enforcement state but never rewrites Nginx or Cloudflare.

FNS1 deployment uses the committed configs in `nginx/fns1` and the idempotent scripts in `scripts`. The internal origin listener is `127.0.0.1:9081`; this avoids a proxy loop after all five public hosts point to Shield. Only public blog reads have an Nginx fail-open route. Sensitive account, API, Admin, and CMS requests remain fail closed, while CMS connection-upgrade traffic uses a documented direct-origin exception because the HTTP gateway does not terminate WebSockets.

Never expose the Shield container directly to the internet. Nginx must be the only direct peer, and Cloudflare-origin authentication should remain enabled at the outer edge.

## Public Block Contract

Every denied request receives or reuses a non-secret public identifier such as `SFB-0123456789ABCDEF`. Browser `GET`/`HEAD` requests that accept HTML receive a `303` redirect to `https://shield.silentflare.com/blocked` with only the public ID and a signed token. API and non-HTML requests retain a `403` JSON response. The portal displays only `Unable to access this website`, a three-digit risk code, and the Ban ID. Its URL never includes a raw IP, account identifier, email, API key, path, cookie, score, or ban reason.

The safe original host and path remain server-side in `risk_cases`. When the restriction has expired, been revoked, or the subject has returned below the release threshold, the portal issues a one-use clearance and redirects a GET/HEAD request back to that validated SilentFlare location without rendering the block page. Mutation requests are never replayed.

Temporary and permanent codes are unique per subject family. For example, a temporary session ban is `SF-BAN-T210`, while a permanent session ban is `SF-BAN-P210`. Policy-only blocks use the `SF-BLOCK-3xx` family and show an incident ID rather than claiming that a persistent ban exists.
