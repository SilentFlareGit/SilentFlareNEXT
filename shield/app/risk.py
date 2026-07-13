from __future__ import annotations

from dataclasses import dataclass, field

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
	add(rate_exceeded, "rate_exceeded", "Rate policy exceeded")
	add(list_status == "deny", "deny_list", "Matched deny list")
	add(list_status == "allow", "allow_list", "Matched allow list")
	score = max(0, min(100, score))
	return RiskResult(score=score, level=level_for(score, thresholds), reasons=reasons)
