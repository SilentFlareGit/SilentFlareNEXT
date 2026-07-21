from __future__ import annotations

import ipaddress
import re
import uuid
from typing import Any


SUBJECT_CODE_NUMBERS = {
	"ip": "100",
	"cidr": "110",
	"asn": "120",
	"country": "130",
	"region": "140",
	"account": "200",
	"session": "210",
	"device": "220",
	"email": "230",
	"email_domain": "240",
	"api_key": "250",
}

ERROR_DESCRIPTIONS = {
	**{
		f"SF-BAN-{duration}{number}": f"{subject.replace('_', ' ').title()} access is {label}."
		for subject, number in SUBJECT_CODE_NUMBERS.items()
		for duration, label in (("T", "temporarily restricted"), ("P", "permanently restricted"))
	},
	"SF-BLOCK-310": "An access policy denied this request.",
	"SF-BLOCK-320": "A geographic access policy denied this request.",
	"SF-BLOCK-330": "A Shield rule denied this request.",
	"SF-BLOCK-340": "The request exceeded the active risk threshold.",
	"SF-BLOCK-350": "An automated protection policy denied this request.",
	"SF-BLOCK-399": "SilentFlare Shield denied this request.",
}

PUBLIC_BAN_ID_PATTERN = re.compile(r"^SFB-[A-F0-9]{16}$")
PUBLIC_EVENT_ID_PATTERN = re.compile(r"^[a-f0-9]{32}$")


def new_public_ban_id() -> str:
	return f"SFB-{uuid.uuid4().hex[:16].upper()}"


def normalize_ban_subject(subject_type: str, value: str) -> str:
	value = value.strip()
	if subject_type == "ip":
		return str(ipaddress.ip_address(value))
	if subject_type == "cidr":
		return str(ipaddress.ip_network(value, strict=False))
	if subject_type == "asn":
		number = value.upper().removeprefix("AS")
		if not number.isdigit():
			raise ValueError("ASN must contain a numeric identifier")
		return f"AS{number}"
	if subject_type == "country":
		if len(value) != 2 or not value.isalpha():
			raise ValueError("Country must be a two-letter code")
		return value.upper()
	if subject_type in {"region", "email", "email_domain"}:
		return value.casefold()
	if not value:
		raise ValueError("Ban subject cannot be empty")
	return value


def ban_subject_display(subject_type: str, normalized: str) -> str:
	if subject_type == "ip":
		return str(ipaddress.ip_address(normalized))
	if subject_type in {"cidr", "asn", "country", "region", "email_domain"}:
		return normalized
	if subject_type == "email" and "@" in normalized:
		local, domain = normalized.split("@", 1)
		return f"{local[:1]}***@{domain}"
	labels = {
		"account": "Account reference",
		"session": "Correlated session",
		"device": "Correlated device",
		"api_key": "API key reference",
	}
	if subject_type in labels:
		return labels[subject_type]
	return f"{normalized[:4]}..."


def ban_error_code(ban: dict[str, Any]) -> str:
	number = SUBJECT_CODE_NUMBERS.get(str(ban.get("subject_type", "")), "299")
	duration = "P" if ban.get("expires_at") is None else "T"
	return f"SF-BAN-{duration}{number}"


def safe_error_code(value: str) -> str:
	return value if value in ERROR_DESCRIPTIONS else "SF-BLOCK-399"


def safe_public_ban_id(value: str) -> str:
	return value if PUBLIC_BAN_ID_PATTERN.fullmatch(value) else ""


def safe_event_id(value: str) -> str:
	return value if PUBLIC_EVENT_ID_PATTERN.fullmatch(value) else ""
