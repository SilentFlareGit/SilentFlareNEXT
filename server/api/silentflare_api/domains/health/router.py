from __future__ import annotations

from fastapi import APIRouter

from ...runtime import *
from . import service

router = APIRouter()


@router.get("/health")
def health() -> dict[str, Any]:
	return service.health()
