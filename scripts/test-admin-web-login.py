from __future__ import annotations

import asyncio
import importlib.util
import json
import os
import tempfile
import time
from pathlib import Path


def load_api_module(repo_root: Path, state_path: Path):
	os.environ["ADMIN_WEB_LOGIN_STATE_PATH"] = str(state_path)
	spec = importlib.util.spec_from_file_location(
		"silentflare_api_admin_login_test",
		repo_root / "server" / "api" / "app.py",
	)
	if spec is None or spec.loader is None:
		raise RuntimeError("Unable to load the FastAPI module")
	module = importlib.util.module_from_spec(spec)
	spec.loader.exec_module(module)
	return module


async def check_callback_work_is_deferred(api) -> None:
	calls: list[str] = []
	challenge_id = "background-challenge"
	api.LOGIN_CHALLENGES[challenge_id] = {
		"id": challenge_id,
		"bot_id": api.ADMIN_AUTH_ID,
		"expires_at": time.time() + 60,
	}
	api.telegram_config_from_webhook_token = lambda _token: {
		"bot_id": api.ADMIN_AUTH_ID,
		"token": "test",
		"webhook_secret": "test",
		"owner_id": api.TELEGRAM_OWNER_ID,
	}
	api.telegram_configs_share_credentials = lambda _left, _right: True
	api.approve_login_challenge = lambda _challenge_id, _owner_id: True
	api.answer_callback = lambda *_args: calls.append("answer")
	api.edit_login_approval_message = lambda *_args: calls.append("edit")

	class CallbackRequest:
		async def json(self):
			return {
				"callback_query": {
					"id": "callback",
					"data": f"sf_login:{challenge_id}",
					"from": {"id": api.TELEGRAM_OWNER_ID},
				}
			}

	background_tasks = api.BackgroundTasks()
	result = await api.telegram_update(CallbackRequest(), background_tasks, "test")
	assert result == {"ok": True, "approved": True}
	assert calls == []
	await background_tasks()
	assert calls == ["answer", "edit"]


def main() -> None:
	repo_root = Path(__file__).resolve().parents[1]
	with tempfile.TemporaryDirectory(prefix="sf-admin-login-") as temporary_dir:
		state_path = Path(temporary_dir) / "admin-web-login-state.json"
		api = load_api_module(repo_root, state_path)

		assert api.ADMIN_WEB_LOGIN_ENABLED is False
		api.set_admin_web_login(True)
		assert api.ADMIN_WEB_LOGIN_ENABLED is True
		assert api.load_admin_web_login_state() is True
		assert json.loads(state_path.read_text(encoding="utf-8"))["enabled"] is True

		api.SESSIONS["expired-admin"] = {
			"bot_id": api.ADMIN_AUTH_ID,
			"csrf": "test",
			"expires_at": time.time() - 1,
			"login_epoch": api.WEB_LOGIN_SESSION_EPOCH,
		}
		api.SESSIONS["active-bot"] = {
			"bot_id": api.BACKUP_BOT_ID,
			"csrf": "test",
			"expires_at": time.time() + 60,
			"login_epoch": api.WEB_LOGIN_SESSION_EPOCH,
		}
		api.cleanup_sessions()
		assert "expired-admin" not in api.SESSIONS
		assert "active-bot" in api.SESSIONS
		assert api.ADMIN_WEB_LOGIN_ENABLED is True

		api.SESSIONS["active-admin"] = {
			"bot_id": api.ADMIN_AUTH_ID,
			"csrf": "test",
			"expires_at": time.time() + 60,
			"login_epoch": api.WEB_LOGIN_SESSION_EPOCH,
		}
		api.LOGIN_CHALLENGES["admin-challenge"] = {
			"bot_id": api.ADMIN_AUTH_ID,
			"expires_at": time.time() + 60,
		}
		api.set_admin_web_login(False)
		assert api.ADMIN_WEB_LOGIN_ENABLED is False
		assert api.load_admin_web_login_state() is False
		assert "active-admin" not in api.SESSIONS
		assert "admin-challenge" not in api.LOGIN_CHALLENGES
		assert "active-bot" in api.SESSIONS
		asyncio.run(check_callback_work_is_deferred(api))

		state_path.write_text("not-json", encoding="utf-8")
		assert api.load_admin_web_login_state() is False

	print("Admin web-login lifecycle checks passed.")


if __name__ == "__main__":
	main()
