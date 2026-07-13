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
- A separate English administration console with password, TOTP, CSRF protection, and append-only audit records.
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
7. Restrict `shield.silentflare.com` with Cloudflare Access or an equivalent network policy in addition to Shield's mandatory TOTP login.

Never expose the Shield container directly to the internet. Nginx must be the only direct peer, and Cloudflare-origin authentication should remain enabled at the outer edge.
