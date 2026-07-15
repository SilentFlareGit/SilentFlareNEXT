from __future__ import annotations

from typing import Any


SUBJECT_RISK_CODES = {
	"account": "101",
	"session": "102",
	"device": "103",
	"email": "104",
	"email_domain": "104",
	"ip": "201",
	"cidr": "202",
	"asn": "203",
	"country": "204",
	"region": "204",
	"api_key": "303",
}

ACTION_RISK_CODES = {
	"login": "301",
	"register": "301",
	"comment": "302",
	"api": "303",
	"scan": "304",
	"automation": "401",
	"threat_intel": "402",
	"rule": "403",
	"risk": "404",
	"protected_surface": "501",
}


def risk_code_for(
	ban: dict[str, Any] | None = None,
	*,
	action_family: str = "",
	host: str = "",
) -> str:
	if ban:
		code = SUBJECT_RISK_CODES.get(str(ban.get("subject_type", "")))
		if code:
			return code
	if host in {"admin.silentflare.com", "cms.silentflare.com"}:
		return ACTION_RISK_CODES["protected_surface"]
	return ACTION_RISK_CODES.get(action_family, ACTION_RISK_CODES["risk"])


def is_public_risk_code(value: str) -> bool:
	return len(value) == 3 and value.isdigit() and value[0] in "12345"
