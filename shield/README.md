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
docker compose -f docker-compose.prod.yml -p silentflare-shield up -d --build
```

For local HTTP-only console testing, set `SHIELD_COOKIE_SECURE=false`. Production must use HTTPS and `SHIELD_COOKIE_SECURE=true`.

## Validation

From `shield/`, with the requirements installed:

```powershell
python -m compileall app adapters tests
python -m unittest discover -s tests -v
docker compose config
```

## Operational Guardrails

1. Start with `SHIELD_MODE=observe`.
2. Point only one low-risk hostname to Shield first.
3. Review event volume and simulate rules against recent events.
4. Enable enforcement for narrow rules before expanding coverage.
5. Keep the Nginx fail-open origin route only for public blog reads.
6. Keep login, registration, comments, Admin, CMS, and sensitive API routes fail closed.
7. Keep the existing SilentFlare Admin login gate and its Telegram/TOTP verification enabled; Shield does not issue a second administrator credential.

The Admin Security workspace automatically refreshes gateway telemetry every 30 seconds. Independently, Shield synchronizes a minimal account projection from a private timestamped and HMAC-signed FastAPI snapshot every minute. It stores stable keyed account hashes, usernames as operator labels, security posture, activity counts, and derived risk metadata only. It never copies passwords, email addresses, session tokens, verification material, or authentication secrets. Risk-event actions derive their IP or account target from the selected event, so normal operation does not require manually entering raw values.

The workspace is also the live control plane. `Automation` edits rate thresholds, windows, responses, and ban cooldowns; `Services` enables or bypasses each hostname and selects observe/enforce plus fail-open/closed behavior; `Geography` creates scoped country/region actions from observed locations; `Network` manages observed ASN access decisions and active bans; `Accounts` applies expiring risk adjustments or sends signed re-authentication, session-revocation, review, and freeze commands; `Risk model` simulates and versions score changes; and `Operations` manages alerts and daily reports. A service is reported as connected only after its edge route actually traverses Shield. Staged controls do not silently rewrite Nginx or Cloudflare.

FNS1 deployment uses the committed configs in `nginx/fns1` and the idempotent scripts in `scripts`. The internal origin listener is `127.0.0.1:9081`; this avoids a proxy loop after all five public hosts point to Shield. Only public blog reads have an Nginx fail-open route. Sensitive account, API, Admin, and CMS requests remain fail closed, while CMS connection-upgrade traffic uses a documented direct-origin exception because the HTTP gateway does not terminate WebSockets.

Never expose the Shield container directly to the internet. Nginx must be the only direct peer, and Cloudflare-origin authentication should remain enabled at the outer edge.

## Public Block Contract

Active bans receive a non-secret public identifier such as `SFB-0123456789ABCDEF`. Browser `GET`/`HEAD` requests that accept HTML receive a `303` redirect to `https://shield.silentflare.com/blocked` with a signed case payload. API and non-HTML requests retain a `403` JSON response and receive the same `errorCode`, `banId`, `requestId`, `supportUrl`, and `Location` header. The case URL never includes a raw IP, account identifier, email, API key, path, cookie, or ban reason.

Temporary and permanent codes are unique per subject family. For example, a temporary session ban is `SF-BAN-T210`, while a permanent session ban is `SF-BAN-P210`. Policy-only blocks use the `SF-BLOCK-3xx` family and show an incident ID rather than claiming that a persistent ban exists.
