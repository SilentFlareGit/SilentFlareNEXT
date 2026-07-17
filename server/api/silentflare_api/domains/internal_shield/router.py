from __future__ import annotations

from fastapi import APIRouter, Header, Request

from ...runtime import *
from . import service

router = APIRouter()


@router.get("/internal/shield/accounts")
def shield_account_snapshot(
	x_sf_shield_timestamp: str | None = Header(default=None),
	x_sf_shield_signature: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.shield_account_snapshot(x_sf_shield_timestamp, x_sf_shield_signature)


@router.get("/internal/shield/session")
def shield_account_session(
	request: Request,
	x_sf_shield_timestamp: str | None = Header(default=None),
	x_sf_shield_signature: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.shield_account_session(request, x_sf_shield_timestamp, x_sf_shield_signature)


@router.post("/internal/shield/respond")
def shield_account_response(
	payload: ShieldResponsePayload,
	x_sf_shield_timestamp: str | None = Header(default=None),
	x_sf_shield_signature: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.shield_account_response(payload, x_sf_shield_timestamp, x_sf_shield_signature)
