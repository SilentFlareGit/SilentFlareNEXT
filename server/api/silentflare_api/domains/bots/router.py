from __future__ import annotations

from fastapi import APIRouter, BackgroundTasks, Header, Request, Response

from ...runtime import *
from . import service

router = APIRouter()


@router.get("/auth/options")
def auth_options(bot_id: str = "") -> dict[str, Any]:
	return service.auth_options(bot_id)


@router.get("/auth/me")
def auth_me(request: Request) -> dict[str, Any]:
	return service.auth_me(request)


@router.get("/auth/cms-gate", status_code=204)
def cms_gate(request: Request) -> Response:
	return service.cms_gate(request)


@router.post("/auth/login")
def auth_login(payload: LoginPayload, request: Request, response: Response) -> dict[str, Any]:
	return service.auth_login(payload, request, response)


@router.post("/auth/telegram/start")
def auth_telegram_start(payload: TelegramStartPayload, request: Request) -> dict[str, Any]:
	return service.auth_telegram_start(payload, request)


@router.get("/auth/telegram/status/{challenge_id}")
def auth_telegram_status(
	challenge_id: str, bot_id: str, request: Request, response: Response
) -> dict[str, Any]:
	return service.auth_telegram_status(challenge_id, bot_id, request, response)


@router.post("/auth/telegram/cancel")
def auth_telegram_cancel(payload: TelegramCancelPayload, request: Request) -> dict[str, Any]:
	return service.auth_telegram_cancel(payload, request)


@router.post("/auth/logout")
def auth_logout(
	request: Request, response: Response, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	return service.auth_logout(request, response, x_csrf_token)


@router.post("/telegram/update")
async def telegram_update(
	request: Request, background_tasks: BackgroundTasks, token: str = ""
) -> dict[str, Any]:
	return await service.telegram_update(request, background_tasks, token)


@router.get("/bots")
def bots() -> dict[str, Any]:
	return service.bots()


@router.get("/bots/{bot_id}")
def bot(bot_id: str, request: Request) -> dict[str, Any]:
	return service.bot(bot_id, request)


@router.get("/bots/{bot_id}/checks/unified")
def unified_checks(bot_id: str, request: Request) -> dict[str, Any]:
	return service.unified_checks(bot_id, request)


@router.get("/bots/{bot_id}/chat/status")
def chat_status(bot_id: str, request: Request) -> dict[str, Any]:
	return service.chat_status(bot_id, request)


@router.post("/bots/{bot_id}/chat/takeover")
def chat_takeover(
	bot_id: str, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	return service.chat_takeover(bot_id, request, x_csrf_token)


@router.post("/bots/{bot_id}/chat/resume-web")
def chat_resume_web(
	bot_id: str, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	return service.chat_resume_web(bot_id, request, x_csrf_token)


@router.get("/bots/{bot_id}/chat/state")
def chat_state(bot_id: str, request: Request, selected: int | None = None) -> dict[str, Any]:
	return service.chat_state(bot_id, request, selected)


@router.post("/bots/{bot_id}/chat/read")
def chat_read(
	bot_id: str,
	payload: ChatReadPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.chat_read(bot_id, payload, request, x_csrf_token)


@router.post("/bots/{bot_id}/chat/send")
def chat_send(
	bot_id: str,
	payload: ChatSendPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.chat_send(bot_id, payload, request, x_csrf_token)


@router.post("/bots/{bot_id}/chat/action")
def chat_user_action(
	bot_id: str,
	payload: ChatActionPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.chat_user_action(bot_id, payload, request, x_csrf_token)


@router.post("/bots/{bot_id}/chat/command")
def chat_command(
	bot_id: str,
	payload: ChatCommandPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.chat_command(bot_id, payload, request, x_csrf_token)


@router.post("/bots/{bot_id}/chat/settings/bot-notifications")
def chat_bot_notifications(
	bot_id: str,
	payload: ChatNotificationPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.chat_bot_notifications(bot_id, payload, request, x_csrf_token)


@router.get("/bots/{bot_id}/chat/media")
def chat_media(bot_id: str, message_id: int, request: Request) -> Response:
	return service.chat_media(bot_id, message_id, request)


@router.post("/bots/{bot_id}/chat/upload")
async def chat_upload(
	bot_id: str, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	return await service.chat_upload(bot_id, request, x_csrf_token)


@router.post("/settings/totp/generate")
def settings_totp_generate(
	request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	return service.settings_totp_generate(request, x_csrf_token)


@router.post("/settings/totp/enable")
def settings_totp_enable(
	payload: TotpEnablePayload, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	return service.settings_totp_enable(payload, request, x_csrf_token)


@router.get("/bots/{bot_id}/backup/status")
def backup_status(
	bot_id: str, request: Request, x_admin_token: str | None = Header(default=None)
) -> dict[str, Any]:
	return service.backup_status(bot_id, request, x_admin_token)


@router.post("/bots/{bot_id}/backup/schedule")
def backup_schedule_update(
	bot_id: str,
	payload: BackupSchedulePayload,
	request: Request,
	x_admin_token: str | None = Header(default=None),
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.backup_schedule_update(bot_id, payload, request, x_admin_token, x_csrf_token)


@router.post("/bots/{bot_id}/backup/run")
def backup_run(
	bot_id: str,
	request: Request,
	x_admin_token: str | None = Header(default=None),
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.backup_run(bot_id, request, x_admin_token, x_csrf_token)


@router.post("/bots/{bot_id}/telegram/test")
def telegram_test(
	bot_id: str,
	request: Request,
	x_admin_token: str | None = Header(default=None),
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	return service.telegram_test(bot_id, request, x_admin_token, x_csrf_token)
