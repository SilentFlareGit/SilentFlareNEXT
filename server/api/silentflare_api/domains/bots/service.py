from __future__ import annotations

from fastapi import BackgroundTasks, Header

from ... import runtime as shared_runtime
from ...jobs.worker import Worker
from ...runtime import *  # noqa: F403


def auth_options(bot_id: str = "") -> dict[str, Any]:
	target = ensure_bot(bot_id) if bot_id else None
	web_login_enabled = (
		target is None or target["id"] != ADMIN_AUTH_ID or shared_runtime.ADMIN_WEB_LOGIN_ENABLED
	)
	telegram_ready = (
		bool(telegram_auth_config(target["id"])["token"])
		if target
		else any((bool(telegram_auth_config(bot["id"])["token"]) for bot in AUTH_TARGETS))
	)
	return {
		"methods": {
			"telegram": telegram_ready and web_login_enabled,
			"totp": bool(console_totp_secret()) and web_login_enabled,
		},
		"owner_id": TELEGRAM_OWNER_ID,
		"web_login_enabled": web_login_enabled,
	}


def auth_me(request: Request) -> dict[str, Any]:
	session = get_session(request)
	bot = ensure_bot(str(session["bot_id"]))
	return {
		"authenticated": True,
		"bot": public_bot(bot),
		"csrf": session["csrf"],
		"totp_enabled": bool(console_totp_secret()),
	}


def cms_gate(request: Request) -> Response:
	require_admin_console_session(request)
	return Response(status_code=204, headers={"Cache-Control": "no-store"})


def auth_login(payload: LoginPayload, request: Request, response: Response) -> dict[str, Any]:
	check_login_rate_limit(request)
	bot = ensure_bot(str(payload.bot_id or ""))
	if bot["id"] == ADMIN_AUTH_ID and not shared_runtime.ADMIN_WEB_LOGIN_ENABLED:
		raise HTTPException(status_code=403, detail="Web login is disabled")
	try:
		verify_console_login(payload)
	except HTTPException:
		record_login_failure(request)
		raise
	BOT_STATE.clear_failures(client_key(request))
	session = create_session(response, bot["id"])
	return {
		"ok": True,
		"bot": public_bot(bot),
		"totp_enabled": bool(console_totp_secret()),
		**session,
	}


def auth_telegram_start(payload: TelegramStartPayload, request: Request) -> dict[str, Any]:
	check_login_rate_limit(request)
	bot = ensure_bot(str(payload.bot_id or ""))
	if bot["id"] == ADMIN_AUTH_ID and not shared_runtime.ADMIN_WEB_LOGIN_ENABLED:
		raise HTTPException(status_code=403, detail="Web login is disabled")
	ensure_telegram_auth_bot(bot)
	challenge = create_login_challenge(bot["id"], client_key(request))
	try:
		message = send_login_approval(bot, challenge)
		result = message.get("result") or {}
		challenge["telegram_message_id"] = result.get("message_id")
		challenge["telegram_chat_id"] = (result.get("chat") or {}).get("id")
		BOT_STATE.set_challenge_message(
			challenge["id"],
			challenge["telegram_chat_id"],
			challenge["telegram_message_id"],
		)
	except HTTPException:
		BOT_STATE.delete_challenge(challenge["id"])
		record_login_failure(request)
		raise
	return {
		"ok": True,
		"bot": public_bot(bot),
		"challenge_id": challenge["id"],
		"expires_at": datetime.fromtimestamp(challenge["expires_at"], tz=timezone.utc)
		.isoformat()
		.replace("+00:00", "Z"),
	}


def auth_telegram_status(
	challenge_id: str, bot_id: str, request: Request, response: Response
) -> dict[str, Any]:
	bot = ensure_bot(bot_id)
	if bot["id"] == ADMIN_AUTH_ID and not shared_runtime.ADMIN_WEB_LOGIN_ENABLED:
		BOT_STATE.delete_challenge(challenge_id)
		raise HTTPException(status_code=403, detail="Web login is disabled")
	challenge = get_login_challenge(challenge_id, bot["id"], client_key(request))
	if challenge["status"] != "approved":
		return {"ok": True, "status": "pending"}
	BOT_STATE.delete_challenge(challenge_id)
	BOT_STATE.clear_failures(client_key(request))
	session = create_session(response, bot["id"])
	return {
		"ok": True,
		"status": "approved",
		"bot": public_bot(bot),
		"totp_enabled": bool(console_totp_secret()),
		**session,
	}


def auth_telegram_cancel(payload: TelegramCancelPayload, request: Request) -> dict[str, Any]:
	bot = ensure_bot(str(payload.bot_id or ""))
	challenge = get_login_challenge(payload.challenge_id, bot["id"], client_key(request))
	if challenge["status"] == "pending":
		BOT_STATE.delete_challenge(payload.challenge_id)
	return {"ok": True}


def auth_logout(
	request: Request, response: Response, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	if request.cookies.get(SESSION_COOKIE):
		require_session(request, x_csrf_token=x_csrf_token, require_csrf=True)
		destroy_session(request, response)
	elif request.cookies.get(ACCOUNT_SESSION_COOKIE):
		require_account_csrf(request, x_csrf_token)
		token = request.cookies.get(ACCOUNT_SESSION_COOKIE, "")
		d1_query("DELETE FROM sessions WHERE session_hash = ?", [account_session_hash(token)])
		clear_account_cookie(response)
	else:
		clear_account_cookie(response)
	return {"ok": True}


async def telegram_update(
	request: Request, background_tasks: BackgroundTasks, token: str = ""
) -> dict[str, Any]:
	webhook_config = telegram_config_from_webhook_token(token)
	if not webhook_config:
		raise HTTPException(status_code=401, detail="Invalid webhook token")
	update = await request.json()
	message = update.get("message") or {}
	message_text = str(message.get("text") or "").strip()
	command = message_text.split(maxsplit=1)[0].split("@", 1)[0].lower() if message_text else ""
	if command in {"/allowweblogin", "/denyweblogin"}:
		from_user = message.get("from") or {}
		user_id = int(from_user.get("id") or 0)
		if user_id != int(webhook_config["owner_id"]):
			return {"ok": True}
		enabled = command == "/allowweblogin"
		set_admin_web_login(enabled)
		chat = message.get("chat") or {}
		chat_id = chat.get("id") or webhook_config.get("chat_id") or webhook_config["owner_id"]
		background_tasks.add_task(
			send_admin_web_login_confirmation, webhook_config, chat_id, enabled
		)
		return {"ok": True, "web_login_enabled": enabled}
	callback = update.get("callback_query") or {}
	data = callback.get("data") or ""
	if not data.startswith("sf_login:"):
		return {"ok": True}
	challenge_id = data.removeprefix("sf_login:")
	from_user = callback.get("from") or {}
	user_id = int(from_user.get("id") or 0)
	callback_id = callback.get("id") or ""
	challenge = get_login_challenge_by_id(challenge_id) or {"id": challenge_id}
	challenge_config = telegram_auth_config(str(challenge.get("bot_id", webhook_config["bot_id"])))
	if not telegram_configs_share_credentials(challenge_config, webhook_config):
		approved = False
	else:
		approved = approve_login_challenge(challenge_id, user_id)
	if callback_id:
		background_tasks.add_task(
			answer_callback,
			webhook_config,
			callback_id,
			"Login approved. Return to the web page."
			if approved
			else "Login request expired or unauthorized.",
			not approved,
		)
	background_tasks.add_task(edit_login_approval_message, challenge, approved, webhook_config)
	return {"ok": True, "approved": approved}


def bots() -> dict[str, Any]:
	return {"bots": [public_bot(bot) for bot in BOTS]}


def bot(bot_id: str, request: Request) -> dict[str, Any]:
	require_session(request, bot_id=bot_id)
	return public_bot(ensure_bot(bot_id))


def unified_checks(bot_id: str, request: Request) -> dict[str, Any]:
	require_session(request, bot_id=bot_id)
	bot = ensure_bot(bot_id)
	if bot["id"] == CHAT_BOT_ID:
		status = chat_bot_status_payload()
		checks = [
			{
				"key": "public_health",
				"label": "Public health",
				"ok": bool(status["health"]["ok"]),
				"status": str(status["health"]["status"]),
				"detail": status["web_url"],
			},
			{
				"key": "web_service",
				"label": "Web service",
				"ok": status["services"]["web"]["active"] is not False,
				"status": status["services"]["web"]["status"],
				"detail": status["services"]["web"]["name"],
			},
			{
				"key": "bot_service",
				"label": "Bot service",
				"ok": status["services"]["bot"]["active"] is not False,
				"status": status["services"]["bot"]["status"],
				"detail": status["services"]["bot"]["name"],
			},
			{
				"key": "remote_control",
				"label": "Remote control",
				"ok": bool(status["control"]["configured"]),
				"status": "Configured" if status["control"]["configured"] else "Disabled",
				"detail": status["control"]["mode"],
			},
		]
		return {
			"ok": bool(status["health"]["ok"]),
			"bot_id": bot["id"],
			"checked_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
			"checks": checks,
		}
	checks: list[dict[str, Any]] = []

	def add_check(key: str, label: str, ok: bool, status: str, detail: str = "") -> None:
		checks.append({"key": key, "label": label, "ok": ok, "status": status, "detail": detail})

	add_check("api", "FastAPI service", True, "OK", APP_NAME)
	add_check("bot", "Bot registry", bot["id"] == BACKUP_BOT_ID, "OK", bot["id"])
	telegram_config = telegram_auth_config(bot["id"])
	add_check(
		"telegram",
		"Telegram authorization",
		bool(telegram_config["token"] and telegram_config["owner_id"]),
		"OK" if telegram_config["token"] and telegram_config["owner_id"] else "Missing",
		"Owner approval path",
	)
	try:
		active = timer_active()
		add_check(
			"timer",
			"Backup timer",
			active,
			"Active" if active else "Inactive",
			backup_timer_unit_name(),
		)
	except Exception:
		add_check("timer", "Backup timer", False, "Error", backup_timer_unit_name())
	add_check(
		"backup_dir",
		"Backup directory",
		BACKUP_DIR.exists(),
		"OK" if BACKUP_DIR.exists() else "Missing",
		str(BACKUP_DIR),
	)
	backups = list_backups()
	add_check(
		"backup_files",
		"Backup files",
		bool(backups),
		f"{len(backups[:5])} recent",
		"Latest five local backup files",
	)
	github = github_backup_status()
	add_check(
		"github",
		"GitHub releases",
		bool(github.get("configured")) and (not github.get("error")),
		"Connected" if github.get("configured") and (not github.get("error")) else "Check",
		github.get("error", "Release upload status"),
	)
	add_check(
		"totp",
		"Authenticator 2FA",
		bool(console_totp_secret()),
		"Configured" if console_totp_secret() else "Disabled",
		"Optional fallback login",
	)
	return {
		"ok": all((item["ok"] for item in checks if item["key"] != "totp")),
		"bot_id": bot["id"],
		"checked_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
		"checks": checks,
	}


def chat_status(bot_id: str, request: Request) -> dict[str, Any]:
	require_session(request, bot_id=bot_id)
	bot = ensure_bot(bot_id)
	if bot["id"] != CHAT_BOT_ID:
		raise HTTPException(status_code=404, detail="Chat status is not available for this bot")
	return {"ok": True, "bot_id": bot["id"], **chat_bot_status_payload()}


def chat_takeover(
	bot_id: str, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	require_session(request, bot_id=bot_id, x_csrf_token=x_csrf_token, require_csrf=True)
	bot = ensure_bot(bot_id)
	if bot["id"] != CHAT_BOT_ID:
		raise HTTPException(status_code=404, detail="Chat control is not available for this bot")
	return {"bot_id": bot["id"], **run_chat_bot_control("takeover")}


def chat_resume_web(
	bot_id: str, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	require_session(request, bot_id=bot_id, x_csrf_token=x_csrf_token, require_csrf=True)
	bot = ensure_bot(bot_id)
	if bot["id"] != CHAT_BOT_ID:
		raise HTTPException(status_code=404, detail="Chat control is not available for this bot")
	return {"bot_id": bot["id"], **run_chat_bot_control("resume-web")}


def chat_state(bot_id: str, request: Request, selected: int | None = None) -> dict[str, Any]:
	bot = ensure_chat_bot_session(bot_id, request)
	return {"bot_id": bot["id"], **run_chat_proxy("state", {"selected": selected})}


def chat_read(
	bot_id: str,
	payload: ChatReadPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	bot = ensure_chat_bot_session(bot_id, request, x_csrf_token, True)
	return {"bot_id": bot["id"], **run_chat_proxy("read", model_payload(payload))}


def chat_send(
	bot_id: str,
	payload: ChatSendPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	bot = ensure_chat_bot_session(bot_id, request, x_csrf_token, True)
	return {"bot_id": bot["id"], **run_chat_proxy("send", model_payload(payload))}


def chat_user_action(
	bot_id: str,
	payload: ChatActionPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	bot = ensure_chat_bot_session(bot_id, request, x_csrf_token, True)
	return {"bot_id": bot["id"], **run_chat_proxy("action", model_payload(payload))}


def chat_command(
	bot_id: str,
	payload: ChatCommandPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	bot = ensure_chat_bot_session(bot_id, request, x_csrf_token, True)
	return {"bot_id": bot["id"], **run_chat_proxy("command", model_payload(payload))}


def chat_bot_notifications(
	bot_id: str,
	payload: ChatNotificationPayload,
	request: Request,
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	bot = ensure_chat_bot_session(bot_id, request, x_csrf_token, True)
	return {"bot_id": bot["id"], **run_chat_proxy("bot_notifications", model_payload(payload))}


def chat_media(bot_id: str, message_id: int, request: Request) -> Response:
	ensure_chat_bot_session(bot_id, request)
	media = run_chat_proxy("media", {"message_id": message_id}, timeout=90)
	body = base64.b64decode(str(media.get("body_b64") or ""))
	filename = quote(str(media.get("filename") or "file"))
	return Response(
		content=body,
		media_type=str(media.get("mime_type") or "application/octet-stream"),
		headers={
			"Content-Disposition": f"attachment; filename*=UTF-8''{filename}",
			"Cache-Control": "no-store",
		},
	)


async def chat_upload(
	bot_id: str, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	bot = ensure_chat_bot_session(bot_id, request, x_csrf_token, True)
	body = await request.body()
	if not body:
		raise HTTPException(status_code=400, detail="Upload body is empty")
	return {
		"bot_id": bot["id"],
		**run_chat_proxy(
			"upload_raw",
			{
				"content_type": request.headers.get("content-type", ""),
				"body_b64": base64.b64encode(body).decode("ascii"),
			},
			timeout=120,
		),
	}


def settings_totp_generate(
	request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	require_session(request, x_csrf_token=x_csrf_token, require_csrf=True)
	secret = generate_totp_secret()
	return {"ok": True, "secret": secret, "otpauth_uri": console_totp_uri(secret)}


def settings_totp_enable(
	payload: TotpEnablePayload, request: Request, x_csrf_token: str | None = Header(default=None)
) -> dict[str, Any]:
	global CONSOLE_TOTP_SECRET
	require_session(request, x_csrf_token=x_csrf_token, require_csrf=True)
	if not verify_totp(payload.secret, payload.code):
		raise HTTPException(status_code=401, detail="Invalid authentication code")
	set_api_env_value("BOT_CONSOLE_TOTP_SECRET", payload.secret)
	CONSOLE_TOTP_SECRET = payload.secret
	return {"ok": True, "totp_enabled": True}


def backup_status(
	bot_id: str, request: Request, x_admin_token: str | None = Header(default=None)
) -> dict[str, Any]:
	if x_admin_token:
		require_admin(x_admin_token)
	else:
		require_session(request, bot_id=bot_id)
	bot = ensure_bot(bot_id)
	backups = list_backups()
	return {
		"bot_id": bot["id"],
		"timer_active": timer_active(),
		"schedule": read_timer_schedule(),
		"github": github_backup_status(),
		"latest": backups[0] if backups else None,
		"backups": backups[:5],
		"message": "Complete SilentFlare database backups are available."
		if backups
		else "No local backups found.",
	}


def backup_schedule_update(
	bot_id: str,
	payload: BackupSchedulePayload,
	request: Request,
	x_admin_token: str | None = Header(default=None),
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	if x_admin_token:
		require_admin(x_admin_token)
	else:
		require_session(request, bot_id=bot_id, x_csrf_token=x_csrf_token, require_csrf=True)
	bot = ensure_bot(bot_id)
	return {
		"ok": True,
		"bot_id": bot["id"],
		"schedule": write_timer_schedule(payload.interval_hours),
	}


def execute_backup_job(payload: dict[str, Any]) -> dict[str, Any]:
	bot = ensure_bot(str(payload.get("bot_id") or ""))
	if not BACKUP_SCRIPT.exists():
		raise RuntimeError("Backup script is missing")
	result = subprocess.run(
		[str(BACKUP_SCRIPT)], check=False, capture_output=True, text=True, timeout=180
	)
	if result.returncode != 0:
		raise RuntimeError("Backup script failed")
	backups = list_backups()
	latest = backups[0] if backups else None
	notification_sent = False
	if latest:
		notification_sent = notify_telegram(
			f"SilentFlare DB Backup completed an update-proof all-database backup: {latest['filename']} sha256={latest['sha256']} size={latest['size']}"
		)
	message = "SilentFlare DB Backup completed and local encrypted all-database backup was created."
	if "upload=uploaded" in result.stdout:
		message = "SilentFlare DB Backup completed and encrypted all-database GitHub Release asset was uploaded."
	if latest and (not notification_sent):
		message += " Telegram notification was not sent."
	return {
		"ok": True,
		"bot_id": bot["id"],
		"latest": latest,
		"notification_sent": notification_sent,
		"message": message,
	}


def backup_run(
	bot_id: str,
	request: Request,
	x_admin_token: str | None = Header(default=None),
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	if x_admin_token:
		require_admin(x_admin_token)
	else:
		require_session(request, bot_id=bot_id, x_csrf_token=x_csrf_token, require_csrf=True)
	bot = ensure_bot(bot_id)
	job = JOBS.enqueue("backup.run", {"bot_id": bot["id"]}, max_attempts=3)
	Worker(JOBS, {"backup.run": execute_backup_job}, "api-inline").run_once(job_id=job.id)
	finished = JOBS.get(job.id)
	if not finished or finished.status != "completed" or not finished.result:
		raise HTTPException(
			status_code=500,
			detail="Backup job failed and remains available for retry",
		)
	return {**finished.result, "job_id": finished.id}


def telegram_test(
	bot_id: str,
	request: Request,
	x_admin_token: str | None = Header(default=None),
	x_csrf_token: str | None = Header(default=None),
) -> dict[str, Any]:
	if x_admin_token:
		require_admin(x_admin_token)
	else:
		require_session(request, bot_id=bot_id, x_csrf_token=x_csrf_token, require_csrf=True)
	bot = ensure_bot(bot_id)
	config = telegram_auth_config(bot["id"])
	if not config["token"] or not resolve_telegram_chat_id(bot["id"]):
		raise HTTPException(
			status_code=503,
			detail="Telegram token is not configured or no chat has messaged the bot",
		)
	if not notify_telegram("SilentFlare Bot Management test notification.", bot["id"]):
		raise HTTPException(status_code=503, detail="Telegram notification could not be sent")
	return {"ok": True, "bot_id": bot["id"], "message": "Telegram test notification sent."}
