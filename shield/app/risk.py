from __future__ import annotations

from dataclasses import dataclass, field
from urllib.parse import urlsplit

from .geo import IpIntel


DEFAULT_WEIGHTS = {
	"vpn": 18,
	"proxy": 20,
	"tor": 35,
	"datacenter": 15,
	"malicious_ip": 50,
	"new_device": 8,
	"automation": 22,
	"missing_headers": 7,
	"abnormal_origin": 10,
	"rate_exceeded": 25,
	"deny_list": 100,
	"allow_list": -100,
	"new_account": 15,
	"unverified_email": 15,
	"no_2fa": 5,
	"privileged_no_2fa": 20,
	"many_sessions": 10,
	"disabled_account": 60,
	"rule_match": 8,
	"challenge_passed": -8,
	"challenge_failed": 15,
}

RISK_FACTOR_CATALOG = {
	"vpn": ("VPN network", "Network", ("IP", "CIDR")),
	"proxy": ("Proxy network", "Network", ("IP", "CIDR")),
	"tor": ("Tor exit node", "Network", ("IP",)),
	"datacenter": ("Data center network", "Network", ("IP", "ASN")),
	"malicious_ip": ("Malicious IP intelligence", "Network", ("IP", "ASN")),
	"new_device": ("New device", "Behavior", ("Device", "Account")),
	"automation": ("Automation browser", "Behavior", ("Device", "IP")),
	"missing_headers": ("Missing browser headers", "Behavior", ("Device", "IP")),
	"abnormal_origin": ("Abnormal request origin", "Behavior", ("Session", "IP")),
	"rate_exceeded": ("Rate policy exceeded", "Behavior", ("Account", "Session", "IP", "CIDR")),
	"rule_match": ("Shield rule matched", "Behavior", ("Session", "IP")),
	"challenge_failed": ("Security challenge failed", "Behavior", ("Session", "Device", "IP")),
	"challenge_passed": ("Security challenge passed", "Behavior", ("Session", "Device", "IP")),
	"new_account": ("Account created recently", "Account", ("Account",)),
	"unverified_email": ("Email not verified", "Account", ("Account", "Email")),
	"no_2fa": ("Two-factor authentication disabled", "Account", ("Account",)),
	"privileged_no_2fa": ("Privileged account without 2FA", "Account", ("Account",)),
	"many_sessions": ("High active-session count", "Account", ("Account", "Session")),
	"disabled_account": ("Account disabled", "Account", ("Account",)),
	"deny_list": ("Deny list matched", "Policy", ("All",)),
	"allow_list": ("Allow list matched", "Policy", ("All",)),
}

DEFAULT_THRESHOLDS = {
	"observe": 20,
	"verify": 40,
	"restrict": 60,
	"block": 80,
}


@dataclass
class RiskResult:
	score: int
	level: str
	reasons: list[str] = field(default_factory=list)


def level_for(score: int, thresholds: dict[str, int] | None = None) -> str:
	values = DEFAULT_THRESHOLDS | (thresholds or {})
	if score < values["observe"]:
		return "normal"
	if score < values["verify"]:
		return "observe"
	if score < values["restrict"]:
		return "verify"
	if score < values["block"]:
		return "restrict"
	return "block"


def score_request(
	intel: IpIntel,
	headers: dict[str, str],
	weights: dict[str, int],
	thresholds: dict[str, int] | None = None,
	list_status: str | None = None,
	rate_exceeded: bool = False,
) -> RiskResult:
	values = DEFAULT_WEIGHTS | weights
	score = max(0, min(100, int(intel.provider_risk)))
	reasons: list[str] = []

	def add(flag: bool, key: str, reason: str) -> None:
		nonlocal score
		if flag:
			score += int(values.get(key, 0))
			reasons.append(reason)

	add(intel.is_vpn, "vpn", "VPN network")
	add(intel.is_proxy, "proxy", "Proxy network")
	add(intel.is_tor, "tor", "Tor exit node")
	add(intel.ip_type == "datacenter", "datacenter", "Data center network")
	add(intel.is_malicious, "malicious_ip", "Known malicious IP")
	ua = headers.get("user-agent", "").lower()
	add(any(marker in ua for marker in ("headless", "selenium", "playwright", "puppeteer")), "automation", "Automation browser signature")
	add(not headers.get("user-agent") or not headers.get("accept"), "missing_headers", "Expected browser headers missing")
	origin = headers.get("origin", "")
	try:
		origin_host = (urlsplit(origin).hostname or "").lower()
	except ValueError:
		origin_host = "invalid"
	request_host = headers.get("host", "").split(":", 1)[0].lower()
	abnormal_origin = bool(
		origin
		and (
			origin_host == "invalid"
			or not origin_host
			or (
				origin_host != request_host
				and not origin_host.endswith(".silentflare.com")
				and origin_host != "silentflare.com"
			)
		)
	)
	add(abnormal_origin, "abnormal_origin", "Abnormal request origin")
	add(rate_exceeded, "rate_exceeded", "Rate policy exceeded")
	add(list_status == "deny", "deny_list", "Matched deny list")
	add(list_status == "allow", "allow_list", "Matched allow list")
	score = max(0, min(100, score))
	return RiskResult(score=score, level=level_for(score, thresholds), reasons=reasons)
