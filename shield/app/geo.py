from __future__ import annotations

import asyncio
import ipaddress
import json
import time
from dataclasses import asdict, dataclass, field

import httpx

from .database import Database, mask_ip, stable_hash


@dataclass
class IpIntel:
	ip: str
	country_code: str = ""
	region: str = ""
	region_code: str = ""
	city: str = ""
	timezone: str = ""
	asn: str = ""
	network_prefix: str = ""
	isp: str = ""
	organization: str = ""
	ip_type: str = "unknown"
	is_vpn: bool = False
	is_proxy: bool = False
	is_tor: bool = False
	is_crawler: bool = False
	is_malicious: bool = False
	provider_risk: int = 0
	country_source: str = "unknown"
	region_source: str = "unknown"
	asn_source: str = "unknown"
	country_confidence: str = "unknown"
	region_confidence: str = "unknown"
	asn_confidence: str = "unknown"
	conflict_fields: list[str] = field(default_factory=list)


def _normalized_asn(value: object) -> str:
	text = str(value or "").strip().upper()
	if text.startswith("AS"):
		text = text[2:]
	return f"AS{text}" if text.isdigit() else ""


def _same_text(left: str, right: str) -> bool:
	return " ".join(left.lower().split()) == " ".join(right.lower().split())


class GeoService:
	def __init__(
		self,
		database: Database,
		hash_key: str,
		url_template: str,
		routing_url_template: str,
		cache_ttl: int,
		allow_private: bool,
	):
		self.database = database
		self.hash_key = hash_key
		self.url_template = url_template
		self.routing_url_template = routing_url_template
		self.cache_ttl = cache_ttl
		self.allow_private = allow_private

	def _from_cloudflare(self, ip: str, headers: dict[str, str]) -> IpIntel | None:
		country = headers.get("cf-ipcountry", "").upper()
		if not country:
			return None
		if country == "T1":
			return IpIntel(ip=ip, is_tor=True, country_source="cloudflare")
		if country == "XX" or len(country) != 2:
			return None
		region = headers.get("cf-region", "").strip()
		return IpIntel(
			ip=ip,
			country_code=country,
			region=region,
			region_code=headers.get("cf-region-code", "").strip().upper(),
			city=headers.get("cf-ipcity", "").strip(),
			timezone=headers.get("cf-timezone", "").strip(),
			country_source="cloudflare",
			region_source="cloudflare" if region else "unknown",
			country_confidence="medium",
			region_confidence="medium" if region else "unknown",
		)

	def _cached(self, ip: str) -> IpIntel | None:
		rows = self.database.query(
			"SELECT * FROM ip_intel WHERE ip_hash = ? AND cache_expires_at > ?",
			(stable_hash(ip, self.hash_key), int(time.time())),
		)
		if not rows:
			return None
		row = rows[0]
		return IpIntel(
			ip=ip,
			country_code=row["country_code"] or "",
			region=row["region"] or "",
			region_code=row.get("region_code") or "",
			city=row["city"] or "",
			timezone=row["timezone"] or "",
			asn=row["asn"] or "",
			network_prefix=row.get("network_prefix") or "",
			isp=row["isp"] or "",
			organization=row["organization"] or "",
			ip_type=row["ip_type"],
			is_vpn=bool(row["is_vpn"]),
			is_proxy=bool(row["is_proxy"]),
			is_tor=bool(row["is_tor"]),
			is_crawler=bool(row["is_crawler"]),
			is_malicious=bool(row["is_malicious"]),
			provider_risk=int(row["risk_score"]),
			country_source=row.get("country_source") or "legacy",
			region_source=row.get("region_source") or "legacy",
			asn_source=row.get("asn_source") or "legacy",
			country_confidence=row.get("country_confidence") or "unknown",
			region_confidence=row.get("region_confidence") or "unknown",
			asn_confidence=row.get("asn_confidence") or "unknown",
			conflict_fields=json.loads(row.get("conflict_fields") or "[]"),
		)

	def _store(self, intel: IpIntel, raw: dict) -> None:
		now = int(time.time())
		self.database.execute(
			"""
			INSERT INTO ip_intel(ip_hash, ip_masked, country_code, region, city, timezone, asn, isp,
			organization, ip_type, is_vpn, is_proxy, is_tor, is_crawler, is_malicious, risk_score,
			first_seen_at, last_seen_at, cache_expires_at, raw_json, region_code, network_prefix,
			country_source, region_source, asn_source, country_confidence, region_confidence,
			asn_confidence, conflict_fields, provenance_status)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'verified')
			ON CONFLICT(ip_hash) DO UPDATE SET country_code=excluded.country_code, region=excluded.region,
			city=excluded.city, timezone=excluded.timezone, asn=excluded.asn, isp=excluded.isp,
			organization=excluded.organization, ip_type=excluded.ip_type, is_vpn=excluded.is_vpn,
			is_proxy=excluded.is_proxy, is_tor=excluded.is_tor, is_crawler=excluded.is_crawler,
			is_malicious=excluded.is_malicious, risk_score=excluded.risk_score,
			last_seen_at=excluded.last_seen_at, cache_expires_at=excluded.cache_expires_at,
			raw_json=excluded.raw_json, region_code=excluded.region_code,
			network_prefix=excluded.network_prefix, country_source=excluded.country_source,
			region_source=excluded.region_source, asn_source=excluded.asn_source,
			country_confidence=excluded.country_confidence, region_confidence=excluded.region_confidence,
			asn_confidence=excluded.asn_confidence, conflict_fields=excluded.conflict_fields,
			provenance_status='verified'
			""",
			(
				stable_hash(intel.ip, self.hash_key), mask_ip(intel.ip), intel.country_code, intel.region,
				intel.city, intel.timezone, intel.asn, intel.isp, intel.organization, intel.ip_type,
				int(intel.is_vpn), int(intel.is_proxy), int(intel.is_tor), int(intel.is_crawler),
				int(intel.is_malicious), intel.provider_risk, now, now, now + self.cache_ttl,
				json.dumps(raw, separators=(",", ":"))[:8000], intel.region_code,
				intel.network_prefix, intel.country_source, intel.region_source, intel.asn_source,
				intel.country_confidence, intel.region_confidence, intel.asn_confidence,
				json.dumps(intel.conflict_fields, separators=(",", ":")),
			),
		)

	async def _provider(self, client: httpx.AsyncClient, ip: str) -> tuple[IpIntel | None, dict]:
		try:
			response = await client.get(self.url_template.format(ip=ip))
			response.raise_for_status()
			data = response.json()
			if data.get("success") is False:
				return None, data
			connection = data.get("connection") or {}
			security = data.get("security") or {}
			ip_type = "datacenter" if security.get("hosting") else "mobile" if connection.get("type") == "mobile" else "residential"
			return IpIntel(
				ip=ip,
				country_code=str(data.get("country_code") or "").upper(),
				region=str(data.get("region") or "").strip(),
				city=str(data.get("city") or "").strip(),
				timezone=str((data.get("timezone") or {}).get("id") or ""),
				asn=_normalized_asn(connection.get("asn")),
				isp=str(connection.get("isp") or ""),
				organization=str(connection.get("org") or ""),
				ip_type=ip_type,
				is_vpn=bool(security.get("vpn")),
				is_proxy=bool(security.get("proxy")),
				is_tor=bool(security.get("tor")),
				is_crawler=bool(security.get("crawler")),
				country_source="ipwho",
				region_source="ipwho" if data.get("region") else "unknown",
				asn_source="ipwho" if connection.get("asn") else "unknown",
				country_confidence="medium" if data.get("country_code") else "unknown",
				region_confidence="medium" if data.get("region") else "unknown",
				asn_confidence="medium" if connection.get("asn") else "unknown",
			), data
		except (httpx.HTTPError, ValueError, TypeError, AttributeError):
			return None, {}

	async def _routing(self, client: httpx.AsyncClient, ip: str) -> tuple[list[str], str, dict]:
		try:
			response = await client.get(self.routing_url_template.format(ip=ip))
			response.raise_for_status()
			payload = response.json()
			data = payload.get("data") or {}
			asns = [asn for item in data.get("asns") or [] if (asn := _normalized_asn(item))]
			return list(dict.fromkeys(asns)), str(data.get("prefix") or ""), data
		except (httpx.HTTPError, ValueError, TypeError, AttributeError):
			return [], "", {}

	def _merge(self, ip: str, cloudflare: IpIntel | None, provider: IpIntel | None, asns: list[str], prefix: str) -> IpIntel:
		intel = provider or cloudflare or IpIntel(ip=ip)
		if cloudflare:
			intel.is_tor = intel.is_tor or cloudflare.is_tor
			if cloudflare.country_code:
				if provider and provider.country_code and provider.country_code != cloudflare.country_code:
					intel.conflict_fields.append("country")
					intel.country_confidence = "medium"
					intel.country_source = "cloudflare (provider conflict)"
				elif provider and provider.country_code == cloudflare.country_code:
					intel.country_confidence = "high"
					intel.country_source = "cloudflare+ipwho"
				else:
					intel.country_confidence = "medium"
					intel.country_source = "cloudflare"
				intel.country_code = cloudflare.country_code
			if cloudflare.region:
				if provider and provider.region and not _same_text(provider.region, cloudflare.region):
					intel.conflict_fields.append("region")
					intel.region_confidence = "medium"
					intel.region_source = "cloudflare (provider conflict)"
				elif provider and provider.region:
					intel.region_confidence = "high"
					intel.region_source = "cloudflare+ipwho"
				else:
					intel.region_confidence = "medium"
					intel.region_source = "cloudflare"
				intel.region = cloudflare.region
				intel.region_code = cloudflare.region_code
			intel.city = cloudflare.city or intel.city
			intel.timezone = cloudflare.timezone or intel.timezone
		intel.network_prefix = prefix
		if asns:
			if intel.asn and intel.asn in asns:
				intel.asn_source = "ripe+ipwho"
				intel.asn_confidence = "high"
			elif len(asns) == 1:
				if intel.asn and intel.asn != asns[0]:
					intel.conflict_fields.append("asn")
				intel.asn = asns[0]
				intel.asn_source = "ripe"
				intel.asn_confidence = "high"
			else:
				intel.conflict_fields.append("asn")
				intel.asn = ""
				intel.asn_source = "ripe multi-origin"
				intel.asn_confidence = "low"
		return intel

	async def lookup(self, ip: str, headers: dict[str, str]) -> tuple[IpIntel, str]:
		cached = self._cached(ip)
		if cached:
			return cached, "cache"
		cloudflare = self._from_cloudflare(ip, headers)
		try:
			address = ipaddress.ip_address(ip)
			if not self.allow_private and not address.is_global:
				return cloudflare or IpIntel(ip=ip, ip_type="private"), "local"
		except ValueError:
			return IpIntel(ip=ip, ip_type="invalid"), "local"

		async with httpx.AsyncClient(timeout=2.0) as client:
			(provider, provider_raw), (asns, prefix, routing_raw) = await asyncio.gather(
				self._provider(client, ip),
				self._routing(client, ip),
			)
		intel = self._merge(ip, cloudflare, provider, asns, prefix)
		if provider or cloudflare or asns:
			self._store(
				intel,
				{
					"providerAvailable": bool(provider_raw),
					"routingAvailable": bool(routing_raw),
					"routingAsns": asns,
					"routingPrefix": prefix,
				},
			)
			sources = [name for name, value in (("cloudflare", cloudflare), ("provider", provider), ("ripe", asns)) if value]
			return intel, "+".join(sources)
		return IpIntel(ip=ip), "degraded"

	def public_record(self, intel: IpIntel) -> dict:
		record = asdict(intel)
		record["ip"] = mask_ip(intel.ip)
		return record
