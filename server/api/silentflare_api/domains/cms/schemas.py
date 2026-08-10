from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class CmsPostWritePayload(BaseModel):
	title: str = Field(default="", max_length=255)
	slug: str = Field(default="", max_length=191)
	html: str = Field(default="", max_length=2_000_000)
	custom_excerpt: str = Field(default="", max_length=300)
	feature_image: str = Field(default="", max_length=2_000)
	tags: list[str] = Field(default_factory=list, max_length=50)
	status: Literal["draft", "published"] = "draft"
	updated_at: str = Field(default="", max_length=64)
