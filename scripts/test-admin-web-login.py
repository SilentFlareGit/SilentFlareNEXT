from __future__ import annotations

import asyncio
import importlib
import json
import os
import sys
import tempfile
import time
from pathlib import Path


def load_api_module(repo_root: Path, state_path: Path):
	os.environ["ADMIN_WEB_LOGIN_STATE_PATH"] = str(state_path)
	os.environ["ACCOUNT_DB_PATH"] = str(state_path.with_name("admin-login.db"))
	os.environ["SESSION_SECRET"] = "x" * 32
	if str(repo_root) not in sys.path:
		sys.path.insert(0, str(repo_root))
	for name in list(sys.modules):
		if name == "server.api.app" or name.startswith("server.api.silentflare_api"):
			del sys.modules[name]
	module = importlib.import_module("server.api.app")
	module._runtime = importlib.import_module("server.api.silentflare_api.runtime")
	module._bots_service = importlib.import_module(
		"server.api.silentflare_api.domains.bots.service"
	)
	return module


async def check_callback_work_is_deferred(api) -> None:
	calls: list[str] = []
	challenge_id = "background-challenge"
	api.BOT_STATE.create_challenge(
		challenge_id,
		api.ADMIN_AUTH_ID,
		"callback-client",
		int(time.time()),
		int(time.time()) + 60,
	)
	api._bots_service.telegram_config_from_webhook_token = lambda _token: {
		"bot_id": api.ADMIN_AUTH_ID,
		"token": "test",
		"webhook_secret": "test",
		"owner_id": api.TELEGRAM_OWNER_ID,
	}
	api._bots_service.telegram_configs_share_credentials = lambda _left, _right: True
	api._bots_service.approve_login_challenge = lambda _challenge_id, _owner_id: True
	api._bots_service.answer_callback = lambda *_args: calls.append("answer")
	api._bots_service.edit_login_approval_message = lambda *_args: calls.append("edit")

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

		assert api._runtime.ADMIN_WEB_LOGIN_ENABLED is False
		api.set_admin_web_login(True)
		assert api._runtime.ADMIN_WEB_LOGIN_ENABLED is True
		assert api.load_admin_web_login_state() is True
		assert json.loads(state_path.read_text(encoding="utf-8"))["enabled"] is True

		api.BOT_STATE.create_session(
			"expired-admin",
			api.ADMIN_AUTH_ID,
			int(time.time()) - 1,
			api.WEB_LOGIN_SESSION_EPOCH,
		)
		api.BOT_STATE.create_session(
			"active-bot",
			api.BACKUP_BOT_ID,
			int(time.time()) + 60,
			api.WEB_LOGIN_SESSION_EPOCH,
		)
		api.cleanup_sessions()
		assert api.BOT_STATE.session("expired-admin") is None
		assert api.BOT_STATE.session("active-bot") is not None
		assert api._runtime.ADMIN_WEB_LOGIN_ENABLED is True

		api.BOT_STATE.create_session(
			"active-admin",
			api.ADMIN_AUTH_ID,
			int(time.time()) + 60,
			api.WEB_LOGIN_SESSION_EPOCH,
		)
		api.BOT_STATE.create_challenge(
			"admin-challenge",
			api.ADMIN_AUTH_ID,
			"admin-client",
			int(time.time()),
			int(time.time()) + 60,
		)
		api.set_admin_web_login(False)
		assert api._runtime.ADMIN_WEB_LOGIN_ENABLED is False
		assert api.load_admin_web_login_state() is False
		assert api.BOT_STATE.session("active-admin") is None
		assert api.BOT_STATE.challenge("admin-challenge") is None
		assert api.BOT_STATE.session("active-bot") is not None
		asyncio.run(check_callback_work_is_deferred(api))

		state_path.write_text("not-json", encoding="utf-8")
		assert api.load_admin_web_login_state() is False

	print("Admin web-login lifecycle checks passed.")


if __name__ == "__main__":
	main()
