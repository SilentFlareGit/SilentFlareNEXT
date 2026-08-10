from __future__ import annotations

from typing import Any

from fastapi import HTTPException
from fastapi.testclient import TestClient
from test_api_contracts import load_test_app


class FakeGhostAdminClient:
	configured = True

	def __init__(self) -> None:
		self.calls: list[dict[str, Any]] = []

	def request(self, method: str, path: str, **kwargs: Any) -> dict[str, Any]:
		self.calls.append({"method": method, "path": path, **kwargs})
		if path == "site/":
			return {"site": {"title": "SilentFlare"}}
		if path == "tags/":
			return {"tags": [{"id": "tag-1", "name": "News", "slug": "news"}]}
		if path == "images/upload/":
			return {
				"images": [
					{"url": "https://cms.silentflare.com/content/images/test.png", "ref": "test.png"}
				]
			}
		if method == "DELETE":
			return {"ok": True}
		if method in {"POST", "PUT"}:
			post = dict((kwargs.get("json_payload") or {}).get("posts", [{}])[0])
			post.update(
				{
					"id": "post-1",
					"uuid": "uuid-1",
					"updated_at": "2026-08-10T00:00:00.000Z",
					"tags": [{"id": "tag-1", "name": "News", "slug": "news"}],
					"authors": [{"id": "owner-1", "name": "SilentFlare"}],
				}
			)
			return {"posts": [post]}
		if path == "posts/post-1/":
			return {"posts": [self._post()]}
		status = str((kwargs.get("params") or {}).get("filter") or "")
		if status:
			return {"posts": [], "meta": {"pagination": {"total": 1}}}
		return {"posts": [self._post()], "meta": {"pagination": {"page": 1, "total": 1}}}

	@staticmethod
	def _post() -> dict[str, Any]:
		return {
			"id": "post-1",
			"uuid": "uuid-1",
			"title": "Existing post",
			"slug": "existing-post",
			"status": "draft",
			"html": "<p>Body</p>",
			"updated_at": "2026-08-09T00:00:00.000Z",
			"tags": [{"id": "tag-1", "name": "News", "slug": "news"}],
			"authors": [{"id": "owner-1", "name": "SilentFlare"}],
		}


def test_cms_bff_uses_owner_session_csrf_and_server_side_ghost(monkeypatch, tmp_path) -> None:
	app, _runtime, _email = load_test_app(monkeypatch, tmp_path)
	from server.api.silentflare_api.domains.cms import service

	def require_cms_session(_request, x_csrf_token=None, require_csrf=False):
		if require_csrf and x_csrf_token != "cms-csrf":
			raise HTTPException(status_code=403, detail="CSRF validation failed")
		return {"bot_id": "SilentFlare Admin", "csrf": "cms-csrf"}

	monkeypatch.setattr(service, "require_admin_console_session", require_cms_session)
	ghost = FakeGhostAdminClient()
	app.state.ghost_admin = ghost

	with TestClient(app, base_url="https://cms.silentflare.com") as client:
		session = client.get("/cms/session")
		assert session.status_code == 200
		assert session.json() == {
			"authenticated": True,
			"actor": "SilentFlare Admin",
			"csrf": "cms-csrf",
			"configured": True,
		}

		listed = client.get("/cms/posts")
		assert listed.status_code == 200
		assert listed.json()["items"][0]["title"] == "Existing post"
		assert listed.json()["items"][0]["html"] == "<p>Body</p>"

		payload = {
			"title": "Created from SilentFlare",
			"html": "<p>Server-side Ghost request</p>",
			"status": "draft",
			"tags": ["News"],
		}
		assert client.post("/cms/posts", json=payload).status_code == 403
		created = client.post("/cms/posts", json=payload, headers={"X-CSRF-Token": "cms-csrf"})
		assert created.status_code == 200
		assert created.json()["post"]["id"] == "post-1"
		call = ghost.calls[-1]
		assert call["path"] == "posts/"
		assert call["params"] == {"source": "html"}
		assert call["json_payload"]["posts"][0]["html"] == payload["html"]

		payload["updated_at"] = "2026-08-09T00:00:00.000Z"
		updated = client.put(
			"/cms/posts/post-1",
			json=payload,
			headers={"X-CSRF-Token": "cms-csrf"},
		)
		assert updated.status_code == 200
		assert ghost.calls[-1]["params"]["save_revision"] == "true"

		uploaded = client.post(
			"/cms/images",
			files={"file": ("test.png", b"png-bytes", "image/png")},
			headers={"X-CSRF-Token": "cms-csrf"},
		)
		assert uploaded.status_code == 200
		assert uploaded.json()["image"]["url"].endswith("/test.png")

		deleted = client.delete(
			"/cms/posts/post-1",
			headers={"X-CSRF-Token": "cms-csrf"},
		)
		assert deleted.status_code == 200

		audit = app.state.database.query(
			"SELECT action FROM cms_audit_log ORDER BY id"
		)
		assert [row["action"] for row in audit] == [
			"post.create",
			"post.update",
			"image.upload",
			"post.delete",
		]


def test_cms_session_rejects_unauthenticated_owner(monkeypatch, tmp_path) -> None:
	app, _runtime, _email = load_test_app(monkeypatch, tmp_path)
	from server.api.silentflare_api.domains.cms import service

	def reject_session(*_args, **_kwargs):
		raise HTTPException(status_code=401, detail="Login required")

	monkeypatch.setattr(service, "require_admin_console_session", reject_session)
	with TestClient(app, base_url="https://cms.silentflare.com") as client:
		assert client.get("/cms/session").status_code == 401


def test_cms_outer_gate_requires_admin_owner_session(monkeypatch, tmp_path) -> None:
	app, _runtime, _email = load_test_app(monkeypatch, tmp_path)
	from server.api.silentflare_api.domains.bots import service

	checked = False

	def require_owner_session(_request):
		nonlocal checked
		checked = True
		return {"bot_id": "SilentFlare Admin"}

	monkeypatch.setattr(service, "require_admin_console_session", require_owner_session)
	with TestClient(app, base_url="https://api.silentflare.com") as client:
		response = client.get("/auth/cms-gate")

	assert response.status_code == 204
	assert response.headers["cache-control"] == "no-store"
	assert checked is True


def test_cms_outer_gate_rejects_missing_owner_session(monkeypatch, tmp_path) -> None:
	app, _runtime, _email = load_test_app(monkeypatch, tmp_path)
	from server.api.silentflare_api.domains.bots import service

	def reject_session(_request):
		raise HTTPException(status_code=401, detail="Login required")

	monkeypatch.setattr(service, "require_admin_console_session", reject_session)
	with TestClient(app, base_url="https://api.silentflare.com") as client:
		response = client.get("/auth/cms-gate")

	assert response.status_code == 401
