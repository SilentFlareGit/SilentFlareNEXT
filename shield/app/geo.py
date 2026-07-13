from __future__ import annotations

import ipaddress
import json
import time
from dataclasses import asdict, dataclass

import httpx

from .database import Database, mask_ip, stable_hash


@dataclass
class IpIntel:
	ip: str
	country_code: str = ""
	region: str = ""
	city: str = ""
	timezone: str = ""
	asn: str = ""
	isp: str = ""
	organization: str = ""
	ip_type: str = "unknown"
	is_vpn: bool = False
	is_proxy: bool = False
	is_tor: bool = False
	is_crawler: bool = False
	is_malicious: bool = False
	provider_risk: int = 0


class GeoService:
	def __init__(self, database: Database, hash_key: str, url_template: str, cache_ttl: int, allow_private: bool):
		self.database = database
		self.hash_key = hash_key
		self.url_template = url_template
		self.cache_ttl = cache_ttl
		self.allow_private = allow_private

	def _from_cloudflare(self, ip: str, headers: dict[str, str]) -> IpIntel | None:
		country = headers.get("cf-ipcountry", "").upper()
		if not country or country in {"XX", "T1"}:
			return None
		return IpIntel(
			ip=ip,
			country_code=country,
			region=headers.get("cf-region", ""),
			city=headers.get("cf-ipcity", ""),
			timezone=headers.get("cf-timezone", ""),
			asn=headers.get("cf-asn", ""),
			ip_type="unknown",
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
			city=row["city"] or "",
			timezone=row["timezone"] or "",
			asn=row["asn"] or "",
			isp=row["isp"] or "",
			organization=row["organization"] or "",
			ip_type=row["ip_type"],
			is_vpn=bool(row["is_vpn"]),
			is_proxy=bool(row["is_proxy"]),
			is_tor=bool(row["is_tor"]),
			is_crawler=bool(row["is_crawler"]),
			is_malicious=bool(row["is_malicious"]),
			provider_risk=int(row["risk_score"]),
		)

	def _store(self, intel: IpIntel, raw: dict) -> None:
		now = int(time.time())
		self.database.execute(
			"""
			INSERT INTO ip_intel(ip_hash, ip_masked, country_code, region, city, timezone, asn, isp,
			organization, ip_type, is_vpn, is_proxy, is_tor, is_crawler, is_malicious, risk_score,
			first_seen_at, last_seen_at, cache_expires_at, raw_json)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			ON CONFLICT(ip_hash) DO UPDATE SET country_code=excluded.country_code, region=excluded.region,
			city=excluded.city, timezone=excluded.timezone, asn=excluded.asn, isp=excluded.isp,
			organization=excluded.organization, ip_type=excluded.ip_type, is_vpn=excluded.is_vpn,
			is_proxy=excluded.is_proxy, is_tor=excluded.is_tor, is_crawler=excluded.is_crawler,
			is_malicious=excluded.is_malicious, risk_score=excluded.risk_score,
			last_seen_at=excluded.last_seen_at, cache_expires_at=excluded.cache_expires_at,
			raw_json=excluded.raw_json
			""",
			(
				stable_hash(intel.ip, self.hash_key), mask_ip(intel.ip), intel.country_code, intel.region,
				intel.city, intel.timezone, intel.asn, intel.isp, intel.organization, intel.ip_type,
				int(intel.is_vpn), int(intel.is_proxy), int(intel.is_tor), int(intel.is_crawler),
				int(intel.is_malicious), intel.provider_risk, now, now, now + self.cache_ttl,
				json.dumps(raw, separators=(",", ":"))[:8000],
			),
		)

	async def lookup(self, ip: str, headers: dict[str, str]) -> tuple[IpIntel, str]:
		cf_intel = self._from_cloudflare(ip, headers)
		cached = self._cached(ip)
		if cached and (not cf_intel or cached.ip_type != "unknown"):
			if cf_intel:
				cached.country_code = cf_intel.country_code or cached.country_code
				cached.region = cf_intel.region or cached.region
				cached.city = cf_intel.city or cached.city
				cached.timezone = cf_intel.timezone or cached.timezone
				cached.asn = cf_intel.asn or cached.asn
			return cached, "cache"
		try:
			address = ipaddress.ip_address(ip)
			if not self.allow_private and not address.is_global:
				intel = cf_intel or IpIntel(ip=ip, ip_type="private")
				return intel, "local"
		except ValueError:
			return IpIntel(ip=ip, ip_type="invalid"), "local"

		try:
			async with httpx.AsyncClient(timeout=2.0) as client:
				response = await client.get(self.url_template.format(ip=ip))
				response.raise_for_status()
				data = response.json()
			connection = data.get("connection") or {}
			security = data.get("security") or {}
			ip_type = "datacenter" if security.get("hosting") else "mobile" if connection.get("type") == "mobile" else "residential"
			intel = IpIntel(
				ip=ip,
				country_code=str(data.get("country_code") or "").upper(),
				region=str(data.get("region") or ""),
				city=str(data.get("city") or ""),
				timezone=str((data.get("timezone") or {}).get("id") or ""),
				asn=str(connection.get("asn") or ""),
				isp=str(connection.get("isp") or ""),
				organization=str(connection.get("org") or ""),
				ip_type=ip_type,
				is_vpn=bool(security.get("vpn")),
				is_proxy=bool(security.get("proxy")),
				is_tor=bool(security.get("tor")),
				is_crawler=bool(security.get("crawler")),
			)
			if cf_intel:
				intel.country_code = cf_intel.country_code or intel.country_code
				intel.region = cf_intel.region or intel.region
				intel.city = cf_intel.city or intel.city
				intel.timezone = cf_intel.timezone or intel.timezone
				intel.asn = cf_intel.asn or intel.asn
			self._store(intel, data)
			return intel, "provider"
		except (httpx.HTTPError, ValueError, TypeError):
			return cf_intel or cached or IpIntel(ip=ip), "degraded"

	def public_record(self, intel: IpIntel) -> dict:
		record = asdict(intel)
		record["ip"] = mask_ip(intel.ip)
		return record
