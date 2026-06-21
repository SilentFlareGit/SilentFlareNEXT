<script lang="ts">
// biome-ignore-all lint/suspicious/noExplicitAny: Bot API responses are dynamic and normalized at render boundaries.
import QRCode from "qrcode";
import { onDestroy, onMount } from "svelte";
import ChatBotConsole from "./ChatBotConsole.svelte";
import GitHubStatusCard from "./GitHubStatusCard.svelte";

export let apiBase = "https://api.silentflare.com";

let bots: any[] = [];
let selectedBot: any = null;
let activeChallenge = "";
let challengeExpiresAt: Date | null = null;
let countdownTimer: number | null = null;
let pollTimer: number | null = null;
let statusTimer: number | null = null;
let csrf =
	typeof sessionStorage !== "undefined"
		? (sessionStorage.getItem("silentflare_bot_csrf") ?? "")
		: "";
let loginMethods = { telegram: false, totp: false };
let totpSecret = "";
let totpUri = "";
let totpEnabled = false;

let currentStep = "bot"; // "bot", "auth", "app"
let activeView = "dashboard"; // "dashboard", "settings"
let isBooting = true;

let loginMessage = "Loading...";
let loginMessageTone = "neutral";
let authMessage = "";
let authMessageTone = "neutral";
let loginTelegramMessage = "";
let loginTelegramMessageTone = "neutral";
let settingsMessage = "";
let settingsMessageTone = "neutral";
let dashboardMessage = "Select a bot to load operations.";
let dashboardMessageTone = "neutral";
let githubMessage = "GitHub backup status has not loaded.";
let githubMessageTone = "neutral";
let unifiedCheck: any = null;
let unifiedCheckMessage = "API checks have not loaded.";
let unifiedCheckTone = "neutral";
let chatMessage = "Chat Bot status has not loaded.";
let chatMessageTone = "neutral";

let noticeMessage = "";
let noticeVisible = false;

let backupStatus: any = null;
let chatStatus: any = null;
let chatData: any = null;
let totpQrCanvas: HTMLCanvasElement;

let loginTotpCode = "";
let enableTotpCode = "";
let scheduleInterval = 24;
let selectedChatUserId: number | null = null;
let chatReplyText = "";
let chatCommandText = "";
let chatCommandResult = "";
let chatUploadFile: File | null = null;
let chatSearch = "";

let isSendingTelegram = false;
let isRunningBackup = false;
let isGeneratingTotp = false;
let isSavingSchedule = false;
let isSendingChat = false;

function icon(name: string) {
	if (name === "bot")
		return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-4 h-4"><rect x="5" y="8" width="14" height="10" rx="3" /><path d="M12 8V4" /><path d="M9 4h6" /><path d="M9 13h.01" /><path d="M15 13h.01" /></svg>`;
	if (name === "send")
		return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-4 h-4"><path d="m22 2-7 20-4-9-9-4 20-7Z" /><path d="M22 2 11 13" /></svg>`;
	if (name === "lock")
		return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-4 h-4"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>`;
	if (name === "db")
		return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-4 h-4"><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></svg>`;
	if (name === "refresh")
		return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-4 h-4"><path d="M21 12a9 9 0 0 1-15.5 6.2" /><path d="M3 12A9 9 0 0 1 18.5 5.8" /><path d="M18 2v4h4" /><path d="M6 22v-4H2" /></svg>`;
	if (name === "settings")
		return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-4 h-4"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.4.2.73.5 1 .9.27.4.4.8.4 1.1V11a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.31 1Z" /></svg>`;
	if (name === "switch")
		return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-4 h-4"><path d="M8 7h11" /><path d="m16 4 3 3-3 3" /><path d="M16 17H5" /><path d="m8 14-3 3 3 3" /></svg>`;
	if (name === "check")
		return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-4 h-4"><path d="M20 6 9 17l-5-5" /></svg>`;
	return "";
}

function botLabel(bot: any) {
	return bot?.name || bot?.id || "Selected bot";
}

function isChatBot(bot: any = selectedBot) {
	return bot?.id === "Telegram Chat Bot";
}

function formatSize(value: number) {
	if (!Number.isFinite(value)) return "0 B";
	if (value < 1024) return `${value} B`;
	if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
	return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

function shortSha(value: string) {
	if (!value) return "Unavailable";
	return `${value.slice(0, 10)}...${value.slice(-8)}`;
}

function compactTime(value: string) {
	if (!value) return "Unknown";
	return value.replace(/:\d{2}(?:\s|$)/, " ").trim();
}

function chatMediaUrl(message: any) {
	if (!selectedBot || !message?.id) return "";
	return `${apiBase}/bots/${encodeURIComponent(selectedBot.id)}/chat/media?message_id=${encodeURIComponent(String(message.id))}`;
}

function scheduleLabel(schedule: any) {
	if (!schedule?.interval_hours) return schedule?.on_calendar || "Custom";
	const option = schedule.options?.find(
		(item: any) => item.interval_hours === schedule.interval_hours,
	);
	return option?.label ?? `Every ${schedule.interval_hours} hours`;
}

function toast(message: string) {
	noticeMessage = message;
	noticeVisible = true;
	setTimeout(() => {
		noticeVisible = false;
	}, 2400);
}

async function api(path: string, options: any = {}) {
	const headers: any = {
		Accept: "application/json",
		...(options.body ? { "Content-Type": "application/json" } : {}),
		...(options.csrf ? { "X-CSRF-Token": csrf } : {}),
		...(options.headers ?? {}),
	};
	let response: Response;
	try {
		response = await fetch(`${apiBase}${path}`, {
			...options,
			credentials: "include",
			headers,
		});
	} catch (error) {
		if (options.lockOnAuthFailure !== false) {
			handleAuthExpired("The API request failed. Verify this bot again.");
		}
		throw error;
	}
	if (!response.ok) {
		let detail = `API ${response.status}`;
		try {
			const body = await response.json();
			detail = body.detail ?? detail;
		} catch {}
		if (
			(response.status === 401 || response.status === 403) &&
			options.lockOnAuthFailure !== false
		) {
			handleAuthExpired(detail);
		}
		throw new Error(detail);
	}
	return response.json();
}

function handleAuthExpired(
	message = "Session expired. Verify this bot again.",
) {
	csrf = "";
	sessionStorage.removeItem("silentflare_bot_csrf");
	stopStatusAutoRefresh();
	if (selectedBot) {
		showAuthStep();
		authMessage = message;
		authMessageTone = "warning";
	} else {
		showBotStep();
		loginMessage = message;
		loginMessageTone = "warning";
	}
}

function showBotStep() {
	stopLoginPolling();
	currentStep = "bot";
	loginTotpCode = "";
}

function showAuthStep() {
	if (!selectedBot) return;
	currentStep = "auth";
	authMessage = "";
	authMessageTone = "neutral";
	loginTelegramMessage = "";
	loginTelegramMessageTone = "neutral";
}

function selectLoginBot(bot: any) {
	selectedBot = bot;
	sessionStorage.setItem("silentflare_selected_bot", bot.id);
	showAuthStep();
}

function stopLoginPolling() {
	if (pollTimer) clearInterval(pollTimer);
	if (countdownTimer) clearInterval(countdownTimer);
	pollTimer = null;
	countdownTimer = null;
	activeChallenge = "";
	challengeExpiresAt = null;
	isSendingTelegram = false;
}

function updateLoginCountdown() {
	if (!challengeExpiresAt) return;
	const remaining = Math.max(
		0,
		Math.round((challengeExpiresAt.getTime() - Date.now()) / 1000),
	);
	const minutes = Math.floor(remaining / 60);
	const seconds = String(remaining % 60).padStart(2, "0");
	if (remaining > 0) {
		loginTelegramMessage = `Approval request sent. Waiting for Telegram approval (${minutes}:${seconds}).`;
		loginTelegramMessageTone = "neutral";
	} else {
		loginTelegramMessage = "Approval request expired. Send a new request.";
		loginTelegramMessageTone = "warning";
		stopLoginPolling();
	}
}

async function startTelegramLogin() {
	if (!selectedBot) {
		loginMessage = "Select a bot before verification.";
		loginMessageTone = "warning";
		return;
	}
	stopLoginPolling();
	isSendingTelegram = true;
	try {
		const result = await api("/auth/telegram/start", {
			method: "POST",
			body: JSON.stringify({ bot_id: selectedBot.id }),
			lockOnAuthFailure: false,
		});
		activeChallenge = result.challenge_id;
		challengeExpiresAt = new Date(result.expires_at);
		updateLoginCountdown();
		countdownTimer = setInterval(updateLoginCountdown, 1000) as any;
		pollTimer = setInterval(checkTelegramLogin, 900) as any;
		await checkTelegramLogin();
	} catch (error: any) {
		stopLoginPolling();
		loginTelegramMessage = `Unable to send approval request: ${error.message}`;
		loginTelegramMessageTone = "error";
	}
}

async function checkTelegramLogin() {
	if (!activeChallenge || !selectedBot) return;
	try {
		const result = await api(
			`/auth/telegram/status/${activeChallenge}?bot_id=${encodeURIComponent(selectedBot.id)}`,
			{ lockOnAuthFailure: false },
		);
		if (result.status !== "approved") return;
		await enterApp(result);
	} catch (error: any) {
		stopLoginPolling();
		loginTelegramMessage = `Authorization failed: ${error.message}`;
		loginTelegramMessageTone = "error";
	}
}

async function loginWithTotp(e: Event) {
	e.preventDefault();
	if (!selectedBot) {
		loginMessage = "Select a bot before verification.";
		loginMessageTone = "warning";
		return;
	}
	try {
		const result = await api("/auth/login", {
			method: "POST",
			body: JSON.stringify({
				bot_id: selectedBot.id,
				code: loginTotpCode,
				method: "totp",
			}),
			lockOnAuthFailure: false,
		});
		await enterApp(result);
	} catch (error: any) {
		authMessage = `2FA login failed: ${error.message}`;
		authMessageTone = "error";
	}
}

async function enterApp(session: any) {
	stopLoginPolling();
	csrf = session.csrf;
	sessionStorage.setItem("silentflare_bot_csrf", csrf);
	if (session.bot) bots = [session.bot];
	selectedBot = session.bot ?? selectedBot;
	totpEnabled = session.totp_enabled;
	currentStep = "app";
	if (selectedBot) selectAppBot(selectedBot);
	toast(`Bot access verified for ${botLabel(selectedBot)}`);
}

function selectAppBot(bot: any) {
	selectedBot = bot;
	dashboardMessage = "";
	dashboardMessageTone = "neutral";
	if (isChatBot(bot)) {
		loadChatStatus();
		loadChatConsole();
	} else {
		loadStatus();
	}
	loadUnifiedCheck();
	startStatusAutoRefresh();
}

function startStatusAutoRefresh() {
	if (statusTimer) return;
	statusTimer = setInterval(() => {
		if (document.visibilityState !== "hidden" && selectedBot) {
			if (isChatBot()) {
				loadChatStatus({ quiet: true });
				loadChatConsole({ quiet: true });
			} else loadStatus({ quiet: true });
			loadUnifiedCheck({ quiet: true });
		}
	}, 30000) as any;
}

function stopStatusAutoRefresh() {
	if (statusTimer) clearInterval(statusTimer);
	statusTimer = null;
}

async function loadStatus(options: any = {}) {
	if (!selectedBot) return;
	try {
		const status = await api(
			`/bots/${encodeURIComponent(selectedBot.id)}/backup/status`,
		);
		backupStatus = status;
		if (status.schedule) scheduleInterval = status.schedule.interval_hours;

		if (status.github?.configured) {
			const latest = status.github.latest;
			githubMessageTone = status.github.error ? "warning" : "neutral";
			githubMessage =
				status.github.error ??
				(latest
					? `Latest GitHub backup release: ${latest.name ?? latest.tagName}.`
					: "No GitHub backup release found.");
		} else {
			githubMessageTone = "warning";
			githubMessage =
				status.github?.error ?? "GitHub Release upload is not configured.";
		}
		if (!options.quiet) toast("Backup status loaded");
	} catch (error: any) {
		dashboardMessage = `Unable to load backup status: ${error.message}`;
		dashboardMessageTone = "error";
		if (!options.quiet) toast("Backup status failed");
	}
}

async function loadUnifiedCheck(options: any = {}) {
	if (!selectedBot) return;
	try {
		const result = await api(
			`/bots/${encodeURIComponent(selectedBot.id)}/checks/unified`,
		);
		unifiedCheck = result;
		unifiedCheckTone = result.ok ? "neutral" : "warning";
		unifiedCheckMessage = result.ok
			? "All monitored API checks are responding."
			: "One or more API checks need attention.";
		if (!options.quiet) toast("API checks refreshed");
	} catch (error: any) {
		unifiedCheck = null;
		unifiedCheckTone = "error";
		unifiedCheckMessage = `API check failed: ${error.message}`;
	}
}

async function loadChatStatus(options: any = {}) {
	if (!selectedBot) return;
	try {
		const status = await api(
			`/bots/${encodeURIComponent(selectedBot.id)}/chat/status`,
		);
		chatStatus = status;
		chatMessage = status.control?.configured
			? "Telegram Chat Bot control is available."
			: "Remote control is not configured. Status checks remain available.";
		chatMessageTone = status.control?.configured ? "neutral" : "warning";
		if (!options.quiet) toast("Chat Bot status loaded");
	} catch (error: any) {
		chatMessage = `Unable to load Chat Bot status: ${error.message}`;
		chatMessageTone = "error";
		if (!options.quiet) toast("Chat Bot status failed");
	}
}

async function loadChatConsole(options: any = {}) {
	if (!selectedBot || !isChatBot()) return;
	try {
		const query =
			selectedChatUserId == null
				? ""
				: `?selected=${encodeURIComponent(String(selectedChatUserId))}`;
		const result = await api(
			`/bots/${encodeURIComponent(selectedBot.id)}/chat/state${query}`,
		);
		chatData = result;
		selectedChatUserId = result.selected ?? selectedChatUserId;
		if (!options.quiet) toast("Chat console loaded");
	} catch (error: any) {
		chatMessage = `Unable to load chat console: ${error.message}`;
		chatMessageTone = "error";
	}
}

async function selectChatContact(userId: number) {
	selectedChatUserId = userId;
	await loadChatConsole({ quiet: true });
	await markChatRead();
}

async function markChatRead() {
	if (!selectedBot || selectedChatUserId == null) return;
	try {
		const result = await api(
			`/bots/${encodeURIComponent(selectedBot.id)}/chat/read`,
			{
				method: "POST",
				csrf: true,
				body: JSON.stringify({ user_id: selectedChatUserId }),
			},
		);
		chatData = result;
	} catch {}
}

async function sendChatReply(e: Event) {
	e.preventDefault();
	if (
		!selectedBot ||
		selectedChatUserId == null ||
		(!chatReplyText.trim() && !chatUploadFile)
	)
		return;
	isSendingChat = true;
	try {
		if (chatUploadFile) {
			const form = new FormData();
			form.append("user_id", String(selectedChatUserId));
			form.append("caption", chatReplyText.trim());
			form.append("file", chatUploadFile);
			const response = await fetch(
				`${apiBase}/bots/${encodeURIComponent(selectedBot.id)}/chat/upload`,
				{
					method: "POST",
					credentials: "include",
					headers: { "X-CSRF-Token": csrf },
					body: form,
				},
			);
			if (!response.ok) {
				let detail = `Upload ${response.status}`;
				try {
					const body = await response.json();
					detail = body.detail ?? detail;
				} catch {}
				throw new Error(detail);
			}
			const result = await response.json();
			chatData = result;
			chatReplyText = "";
			chatUploadFile = null;
			toast("Upload sent");
			return;
		}
		const path = chatReplyText.trim().startsWith("/") ? "command" : "send";
		const result = await api(
			`/bots/${encodeURIComponent(selectedBot.id)}/chat/${path}`,
			{
				method: "POST",
				csrf: true,
				body: JSON.stringify({
					user_id: selectedChatUserId,
					text: chatReplyText.trim(),
				}),
			},
		);
		chatData = result;
		chatCommandResult = result.command_result ?? "";
		chatReplyText = "";
		chatUploadFile = null;
		toast(path === "command" ? "Command completed" : "Message sent");
	} catch (error: any) {
		chatMessage = `Chat send failed: ${error.message}`;
		chatMessageTone = "error";
	} finally {
		isSendingChat = false;
	}
}

async function runChatUserAction(
	action: string,
	minutes: number | null = null,
) {
	if (!selectedBot || selectedChatUserId == null) return;
	try {
		const result = await api(
			`/bots/${encodeURIComponent(selectedBot.id)}/chat/action`,
			{
				method: "POST",
				csrf: true,
				body: JSON.stringify({
					user_id: selectedChatUserId,
					action,
					minutes,
				}),
			},
		);
		chatData = result;
		chatCommandResult = result.notice ?? "";
		toast(result.notice ?? "Action completed");
	} catch (error: any) {
		chatMessage = `Chat action failed: ${error.message}`;
		chatMessageTone = "error";
	}
}

async function runChatCommand(text: string) {
	if (!selectedBot || !text.trim()) return;
	try {
		const result = await api(
			`/bots/${encodeURIComponent(selectedBot.id)}/chat/command`,
			{
				method: "POST",
				csrf: true,
				body: JSON.stringify({
					user_id: selectedChatUserId,
					text: text.trim(),
				}),
			},
		);
		chatData = result;
		chatCommandResult = result.command_result ?? result.notice ?? "";
		chatCommandText = "";
		toast("Command completed");
	} catch (error: any) {
		chatMessage = `Command failed: ${error.message}`;
		chatMessageTone = "error";
	}
}

async function toggleChatNotifications() {
	if (!selectedBot || !chatData?.settings) return;
	try {
		const result = await api(
			`/bots/${encodeURIComponent(selectedBot.id)}/chat/settings/bot-notifications`,
			{
				method: "POST",
				csrf: true,
				body: JSON.stringify({
					enabled: !chatData.settings.bot_notifications_enabled,
				}),
			},
		);
		chatData = result;
		toast(result.notice ?? "Notification setting updated");
	} catch (error: any) {
		chatMessage = `Notification update failed: ${error.message}`;
		chatMessageTone = "error";
	}
}

async function runChatAction(action: "takeover" | "resume-web") {
	if (!selectedBot) return;
	chatMessage =
		action === "takeover" ? "Starting Bot takeover." : "Restoring Web control.";
	chatMessageTone = "neutral";
	try {
		await api(`/bots/${encodeURIComponent(selectedBot.id)}/chat/${action}`, {
			method: "POST",
			csrf: true,
		});
		chatMessage =
			action === "takeover"
				? "Bot takeover completed."
				: "Web control restored.";
		chatMessageTone = "success";
		toast(chatMessage);
		await loadChatStatus({ quiet: true });
		await loadUnifiedCheck({ quiet: true });
	} catch (error: any) {
		chatMessage = `Chat Bot action failed: ${error.message}`;
		chatMessageTone = "error";
	}
}

async function runBackup() {
	if (!selectedBot) return;
	isRunningBackup = true;
	dashboardMessage = "Backup job started.";
	dashboardMessageTone = "neutral";
	toast("Backup started");
	try {
		const result = await api(
			`/bots/${encodeURIComponent(selectedBot.id)}/backup/run`,
			{
				method: "POST",
				csrf: true,
			},
		);
		dashboardMessage = result.message ?? "Backup completed.";
		dashboardMessageTone = "success";
		toast("Backup completed");
		await loadStatus({ quiet: true });
		await loadUnifiedCheck({ quiet: true });
	} catch (error: any) {
		dashboardMessage = `Backup failed: ${error.message}`;
		dashboardMessageTone = "error";
		toast("Backup failed");
	} finally {
		isRunningBackup = false;
	}
}

async function saveSchedule(e: Event) {
	e.preventDefault();
	if (!selectedBot) return;
	isSavingSchedule = true;
	try {
		const result = await api(
			`/bots/${encodeURIComponent(selectedBot.id)}/backup/schedule`,
			{
				method: "POST",
				csrf: true,
				body: JSON.stringify({ interval_hours: Number(scheduleInterval) }),
			},
		);
		backupStatus.schedule = result.schedule;
		dashboardMessage = "Backup schedule updated.";
		dashboardMessageTone = "success";
		toast("Backup schedule updated");
		await loadStatus({ quiet: true });
	} catch (error: any) {
		dashboardMessage = `Schedule update failed: ${error.message}`;
		dashboardMessageTone = "error";
	} finally {
		isSavingSchedule = false;
	}
}

async function generateTotp() {
	isGeneratingTotp = true;
	try {
		const result = await api("/settings/totp/generate", {
			method: "POST",
			csrf: true,
		});
		totpSecret = result.secret;
		totpUri = result.otpauth_uri;
		if (totpQrCanvas) {
			await QRCode.toCanvas(totpQrCanvas, totpUri, {
				errorCorrectionLevel: "M",
				margin: 1,
				width: 176,
			});
		}
		settingsMessage = "Enter the current authenticator code to enable 2FA.";
		settingsMessageTone = "neutral";
	} catch (error: any) {
		settingsMessage = `Unable to generate 2FA setup: ${error.message}`;
		settingsMessageTone = "error";
	} finally {
		isGeneratingTotp = false;
	}
}

async function enableTotpSubmit(e: Event) {
	e.preventDefault();
	if (!totpSecret) return;
	try {
		const result = await api("/settings/totp/enable", {
			method: "POST",
			csrf: true,
			body: JSON.stringify({ code: enableTotpCode, secret: totpSecret }),
		});
		totpEnabled = result.totp_enabled;
		totpSecret = "";
		enableTotpCode = "";
		settingsMessage = "2FA reset complete.";
		settingsMessageTone = "success";
		toast("2FA reset complete");
	} catch (error: any) {
		settingsMessage = `Unable to enable 2FA: ${error.message}`;
		settingsMessageTone = "error";
	}
}

async function logout() {
	try {
		await api("/auth/logout", { method: "POST", csrf: true });
	} catch {}
	csrf = "";
	sessionStorage.removeItem("silentflare_bot_csrf");
	selectedBot = null;
	stopStatusAutoRefresh();
	currentStep = "bot";
	await loadPublicBots();
}

async function loadPublicBots() {
	try {
		const list = await api("/bots", { lockOnAuthFailure: false });
		bots = list.bots ?? [];
		if (currentStep === "app") return;
		selectedBot = null;
		loginMessage = "Select a bot to continue to verification.";
		loginMessageTone = "neutral";
	} catch (error: any) {
		bots = [];
		loginMessage = `Unable to load bots: ${error.message}`;
		loginMessageTone = "error";
	}
}

async function loadAuthOptions() {
	try {
		const options = await api("/auth/options", { lockOnAuthFailure: false });
		loginMethods = options.methods;
		loginMessage = "Select a bot to continue to verification.";
		loginMessageTone =
			loginMethods.telegram || loginMethods.totp ? "neutral" : "error";
	} catch (error: any) {
		loginMessage = `Unable to load login methods: ${error.message}`;
		loginMessageTone = "error";
	}
}

onMount(async () => {
	const botsPromise = loadPublicBots();
	const optionsPromise = loadAuthOptions();
	const sessionPromise = api("/auth/me", { lockOnAuthFailure: false });

	try {
		const session = await sessionPromise;
		await enterApp(session);
	} catch {
		await botsPromise;
		currentStep = "bot";
	} finally {
		await optionsPromise;
		isBooting = false;
	}
});

onDestroy(() => {
	stopLoginPolling();
	stopStatusAutoRefresh();
});

$: toneToClass = (tone: string) => {
	if (tone === "success")
		return "border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300";
	if (tone === "warning")
		return "border-amber-200 bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-300";
	if (tone === "error")
		return "border-rose-200 bg-rose-50 text-rose-800 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-300";
	return "border-zinc-200 bg-zinc-50 text-zinc-600 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-400";
};
</script>

<div class="min-h-screen bg-[#eef2f6] font-sans text-zinc-900 selection:bg-cyan-400/25 dark:bg-[#07111f] dark:text-zinc-100">
	<!-- Console grid background -->
	<div
		class="fixed inset-0 z-0 pointer-events-none opacity-70 dark:opacity-40"
		style="background-image: linear-gradient(rgb(15 23 42 / 0.045) 1px, transparent 1px), linear-gradient(90deg, rgb(15 23 42 / 0.045) 1px, transparent 1px); background-size: 32px 32px;">
	</div>

	{#if currentStep === 'bot' || currentStep === 'auth'}
		<!-- Login Flow -->
		<div class="relative z-10 flex-1 grid place-items-center p-4">
			<div class="w-full max-w-xl flex flex-col gap-6 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-black/50 transition-all duration-300">
				
				<div class="flex items-center gap-4">
					<div class="grid place-items-center w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold text-xl shadow-inner shadow-black/20">SF</div>
					<div>
						<strong class="block text-lg tracking-tight">SilentFlare</strong>
						<span class="block text-sm text-zinc-500 dark:text-zinc-400">Bot operations</span>
					</div>
				</div>

				<div class="space-y-2">
					<h1 class="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Owner-approved operations</h1>
					<p class="text-zinc-500 dark:text-zinc-400">SilentFlare DB Backup uses bot-scoped approval before opening the console.</p>
				</div>

				{#if currentStep === 'bot'}
					<div class="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
						<div class="bg-zinc-50/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-5 transition-colors hover:bg-white dark:hover:bg-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700">
							<div class="mb-4">
								<h2 class="font-semibold text-zinc-900 dark:text-zinc-100">Select bot</h2>
								<p class="text-sm text-zinc-500 dark:text-zinc-400">Pick the bot backend you want to operate.</p>
							</div>
							<div class="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2">
								{#if isBooting && bots.length === 0}
									<div class="grid gap-2">
										<div class="h-16 rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"></div>
									</div>
								{:else if bots.length === 0}
									<div class="p-3 text-center text-sm text-zinc-500 dark:text-zinc-400">No bots available.</div>
								{/if}
								{#each bots as bot}
									<button type="button" 
										class="flex items-center gap-3 w-full text-left p-3 rounded-lg border transition-all duration-200
										{selectedBot?.id === bot.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-indigo-300 dark:hover:border-indigo-700'}"
										on:click={() => selectLoginBot(bot)}>
										<div class="grid place-items-center w-10 h-10 rounded-lg bg-indigo-600 text-white flex-shrink-0">
											{@html icon("bot")}
										</div>
										<div class="min-w-0 flex-1">
											<strong class="block truncate font-medium text-zinc-900 dark:text-zinc-100">{botLabel(bot)}</strong>
											<small class="block truncate text-xs text-zinc-500 dark:text-zinc-400">{bot.purpose} / {bot.status}</small>
										</div>
									</button>
								{/each}
							</div>
						</div>
						{#if loginMessageTone !== "neutral"}
							<div class="text-sm p-3 rounded-lg border {toneToClass(loginMessageTone)}">
								{loginMessage}
							</div>
						{/if}
					</div>
				{/if}

				{#if currentStep === 'auth'}
					<div class="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
						<div class="flex items-center justify-between gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50">
							<div>
								<h2 class="font-semibold text-zinc-900 dark:text-zinc-100">Verify {botLabel(selectedBot)}</h2>
								<p class="text-sm text-zinc-500 dark:text-zinc-400">{selectedBot?.purpose} / {selectedBot?.status}</p>
							</div>
							<button type="button" aria-label="Change bot" title="Change bot" class="grid h-10 w-10 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400" on:click={showBotStep}>
								{@html icon("switch")}
							</button>
						</div>

						<div class="bg-zinc-50/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-5">
							<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
								<div>
									<h2 class="font-semibold text-zinc-900 dark:text-zinc-100">Telegram Bot authorization</h2>
								</div>
								<button type="button" 
									class="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors shadow-sm" 
									disabled={!loginMethods.telegram || isSendingTelegram}
									on:click={startTelegramLogin}>
									{@html icon("send")}
									{isSendingTelegram ? 'Sending...' : 'Send request'}
								</button>
							</div>
							{#if loginTelegramMessage}
								<div class="text-sm p-3 rounded-lg border {toneToClass(loginTelegramMessageTone)}">
									{loginTelegramMessage}
								</div>
							{/if}
						</div>

						{#if loginMethods.totp}
							<div class="bg-zinc-50/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-5">
								<div class="mb-4">
									<h2 class="font-semibold text-zinc-900 dark:text-zinc-100">Authenticator 2FA</h2>
								</div>
								<form on:submit={loginWithTotp} class="flex flex-col gap-3 sm:flex-row">
									<input type="text" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" placeholder="000000"
										bind:value={loginTotpCode}
										class="flex-1 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-zinc-900 dark:text-zinc-100 transition-shadow" />
									<button type="submit"
										disabled={loginTotpCode.length !== 6}
										class="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-900 dark:text-zinc-100 text-sm font-medium rounded-lg transition-colors shadow-sm">
										{@html icon("lock")}
										Verify 2FA
									</button>
								</form>
							</div>
						{:else}
							<div class="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/70 p-4 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/40 dark:text-zinc-400">
								Authenticator 2FA is not configured.
							</div>
						{/if}

						{#if authMessage}
							<div class="text-sm p-3 rounded-lg border {toneToClass(authMessageTone)}">
								{authMessage}
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	{/if}

	{#if currentStep === 'app'}
		<!-- Main App Layout -->
		<div class="relative z-10 w-full max-w-[118rem] mx-auto p-2 sm:p-3 lg:p-4">
			<div class="grid min-h-[calc(100vh-1rem)] overflow-hidden rounded-xl border border-slate-300/80 bg-white shadow-[0_18px_60px_rgb(15_23_42/0.12)] dark:border-slate-800 dark:bg-[#0c1726] dark:shadow-black/30 lg:min-h-[calc(100vh-2rem)] lg:grid-cols-[17rem_minmax(0,1fr)]">
				<!-- Left Rail Sidebar -->
				<aside class="flex min-h-0 flex-col border-b border-slate-200 bg-slate-950 text-slate-100 dark:border-slate-800 lg:border-b-0 lg:border-r">
					<div class="border-b border-white/10 px-5 py-5">
						<div class="flex items-center gap-3">
							<div class="relative grid h-11 w-11 place-items-center rounded-lg border border-cyan-300/30 bg-cyan-400/10 text-sm font-black tracking-tight text-cyan-100">
								SF
								<span class="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgb(103_232_249/0.9)]"></span>
							</div>
							<div class="min-w-0">
								<strong class="block text-base font-semibold tracking-tight">SilentFlare</strong>
								<span class="block text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Owner Ops</span>
							</div>
						</div>
					</div>

					<nav class="flex gap-2 overflow-x-auto px-3 py-3 lg:flex-col lg:overflow-visible lg:px-4 lg:py-5">
						<p class="hidden px-2 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 lg:block">Console</p>
						<button class="flex min-h-11 shrink-0 items-center gap-3 rounded-lg border px-3 py-2 text-sm font-semibold transition duration-150 active:scale-[0.99]
							{activeView === 'dashboard' ? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100 shadow-[inset_3px_0_0_rgb(103_232_249)]' : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white'}"
							on:click={() => activeView = 'dashboard'}>
							{@html icon("db")} Dashboard
						</button>
						<button class="flex min-h-11 shrink-0 items-center gap-3 rounded-lg border px-3 py-2 text-sm font-semibold transition duration-150 active:scale-[0.99]
							{activeView === 'settings' ? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100 shadow-[inset_3px_0_0_rgb(103_232_249)]' : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white'}"
							on:click={() => activeView = 'settings'}>
							{@html icon("settings")} Settings
						</button>
					</nav>

					<div class="mt-auto border-t border-white/10 p-4">
						<div class="grid gap-3 text-xs">
							<div class="rounded-lg border border-white/10 bg-white/[0.04] p-3">
								<span class="block font-medium uppercase tracking-[0.16em] text-slate-500">API</span>
								<strong class="mt-1 block text-sm {unifiedCheck?.ok ? 'text-cyan-200' : 'text-amber-200'}">{unifiedCheck?.ok ? 'Checked' : 'Pending'}</strong>
							</div>
							<div class="rounded-lg border border-white/10 bg-white/[0.04] p-3">
								<span class="block font-medium uppercase tracking-[0.16em] text-slate-500">Session</span>
								<strong class="mt-1 block text-sm text-slate-100">Owner verified</strong>
							</div>
							<button class="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-100 active:scale-[0.99]" on:click={logout}>
								{@html icon("lock")} Lock session
							</button>
						</div>
					</div>
				</aside>

				<!-- Main Content Shell -->
				<main class="flex min-w-0 flex-col bg-[#f7f9fc] dark:bg-[#0b1422]">
					<header class="border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-[#101b2b] md:px-6">
						<div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
							<div>
								<p class="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Telegram Bot Owner Console</p>
								<h1 class="mt-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-3xl">{selectedBot ? botLabel(selectedBot) : 'Select a bot'}</h1>
								<p class="mt-1 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
									{isChatBot() ? 'Owner-controlled chat relay, moderation actions, and web/bot handoff in one operations surface.' : 'Complete all-database backups remain valid across Ghost and schema updates.'}
								</p>
							</div>
							<div class="grid grid-cols-2 gap-2 text-xs sm:flex sm:flex-wrap sm:justify-end">
								<span class="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 font-semibold text-cyan-800 dark:border-cyan-800/70 dark:bg-cyan-950/40 dark:text-cyan-200">Owner verified</span>
								<span class="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">{unifiedCheck?.ok ? 'API checked' : 'API pending'}</span>
								<span class="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">{selectedBot?.status ?? 'No bot selected'}</span>
								<span class="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">{statusTimer ? 'Auto refresh 30s' : 'Refresh paused'}</span>
							</div>
						</div>
					</header>

				{#if activeView === 'dashboard'}
					<div class="{isChatBot() ? 'min-h-0 p-3 md:p-4' : 'p-5 md:p-6'} flex flex-col gap-8 animate-in fade-in duration-300">
						{#if isChatBot()}
							<ChatBotConsole
								{chatData}
								{chatStatus}
								bind:selectedChatUserId
								bind:chatSearch
								bind:chatReplyText
								bind:chatCommandText
								bind:chatUploadFile
								{chatCommandResult}
								{isSendingChat}
								mediaUrl={chatMediaUrl}
								onRefresh={() => {
									loadChatStatus();
									loadChatConsole();
								}}
								onSelectContact={selectChatContact}
								onSendReply={sendChatReply}
								onUserAction={runChatUserAction}
								onChatAction={runChatAction}
								onToggleNotifications={toggleChatNotifications}
								onRunCommand={runChatCommand}
							/>
						{:else}
						<!-- Primary action -->
						<div class="grid grid-cols-1 xl:grid-cols-[minmax(0,1.15fr)_minmax(24rem,0.85fr)] gap-6">
							<!-- Backup Control -->
							<div class="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden shadow-sm">
								<div class="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
									<h2 class="font-semibold text-sm">Backup control</h2>
									<span class="px-2 py-0.5 text-xs font-medium rounded-full {selectedBot ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}">
										{selectedBot?.status ?? 'None selected'}
									</span>
								</div>
								<div class="p-4 flex flex-col gap-4">
									{#if dashboardMessage}
										<div class="text-sm p-3 rounded-lg border {toneToClass(dashboardMessageTone)}">{dashboardMessage}</div>
									{/if}
									<div class="flex flex-wrap gap-2">
										<button class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50 text-sm font-medium rounded-lg transition-colors shadow-sm" on:click={() => loadStatus()} disabled={!selectedBot}>
											{@html icon("refresh")} Refresh
										</button>
										<button class="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors shadow-sm" on:click={runBackup} disabled={!selectedBot || isRunningBackup}>
											{@html icon("db")} {isRunningBackup ? 'Running...' : 'Run backup'}
										</button>
									</div>
									<div class="grid grid-cols-3 divide-x divide-zinc-100 dark:divide-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700 text-center text-sm">
										<div class="p-2 md:p-3 flex flex-col justify-center">
											<span class="text-xs text-zinc-500 font-medium">Timer active</span>
											<strong class="mt-1 truncate">{backupStatus?.timer_active ? 'Active' : 'Inactive'}</strong>
										</div>
										<div class="p-2 md:p-3 flex flex-col justify-center">
											<span class="text-xs text-zinc-500 font-medium">Latest backup</span>
											<strong class="mt-1 truncate">{backupStatus?.latest?.created_at_de ? compactTime(backupStatus.latest.created_at_de) : 'None'}</strong>
											<span class="mt-0.5 truncate text-[11px] text-zinc-500">{backupStatus?.latest?.created_at_beijing ? compactTime(backupStatus.latest.created_at_beijing) : 'Beijing pending'}</span>
										</div>
										<div class="p-2 md:p-3 flex flex-col justify-center">
											<span class="text-xs text-zinc-500 font-medium">Local backups</span>
											<strong class="mt-1 truncate">{backupStatus?.backups?.length ?? 0} files</strong>
										</div>
									</div>
								</div>
							</div>

							<!-- Schedule Control -->
							<div class="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden shadow-sm">
								<div class="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
									<h2 class="font-semibold text-sm">Schedule</h2>
									<span class="px-2 py-0.5 text-xs font-medium rounded-full {backupStatus?.schedule?.active ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'}">
										{backupStatus?.schedule?.active ? 'Active' : 'Inactive'}
									</span>
								</div>
								<div class="p-4 flex flex-col gap-4">
									<form on:submit={saveSchedule} class="flex gap-2">
										<select bind:value={scheduleInterval} disabled={!backupStatus} class="flex-1 px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:opacity-50">
											{#if backupStatus?.schedule?.options}
												{#each backupStatus.schedule.options as opt}
													<option value={opt.interval_hours}>{opt.label}</option>
												{/each}
											{:else}
												<option value={24}>Loading...</option>
											{/if}
										</select>
										<button type="submit" disabled={!backupStatus || isSavingSchedule} class="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50 text-sm font-medium rounded-lg transition-colors shadow-sm">
											{isSavingSchedule ? 'Saving...' : 'Save'}
										</button>
									</form>
									<div class="grid grid-cols-3 divide-x divide-zinc-100 dark:divide-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700 text-center text-sm">
										<div class="p-2 md:p-3 flex flex-col justify-center">
											<span class="text-xs text-zinc-500 font-medium">Current interval</span>
											<strong class="mt-1 truncate">{scheduleLabel(backupStatus?.schedule)}</strong>
										</div>
										<div class="p-2 md:p-3 flex flex-col justify-center">
											<span class="text-xs text-zinc-500 font-medium">Next run</span>
											<strong class="mt-1 truncate">{backupStatus?.schedule?.next_run || 'Unknown'}</strong>
										</div>
										<div class="p-2 md:p-3 flex flex-col justify-center">
											<span class="text-xs text-zinc-500 font-medium">Last run</span>
											<strong class="mt-1 truncate">{backupStatus?.schedule?.last_run || 'Unknown'}</strong>
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- Secondary status -->
						<div class="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6">
							<GitHubStatusCard
								{backupStatus}
								{githubMessage}
								{githubMessageTone}
								{toneToClass}
							/>

							<div class="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden shadow-sm h-fit">
								<div class="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
									<h2 class="font-semibold text-sm">API unified check</h2>
									<button type="button" class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700" on:click={() => loadUnifiedCheck()}>
										{@html icon("refresh")} Check
									</button>
								</div>
								<div class="p-4 flex flex-col gap-4">
									<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
										{#each unifiedCheck?.checks ?? [] as check}
											<div class="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800/50">
												<span class="truncate text-zinc-600 dark:text-zinc-300">{check.label}</span>
												<span class="rounded-full px-2 py-0.5 text-xs font-medium {check.ok ? 'bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}">{check.status}</span>
											</div>
										{/each}
									</div>
									<div class="text-sm p-3 rounded-lg border {toneToClass(unifiedCheckTone)}">
										{unifiedCheckMessage}
									</div>
								</div>
							</div>
						</div>

						<!-- Backup files -->
						<div class="grid grid-cols-1 gap-6">
							<div class="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden shadow-sm">
								<div class="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
									<h2 class="font-semibold text-sm">Latest files</h2>
									<span class="text-xs text-zinc-500 font-medium">{statusTimer ? 'Auto refresh: 30s' : 'Auto refresh paused'}</span>
								</div>
								<div class="overflow-x-auto">
									<table class="w-full text-sm text-left whitespace-nowrap">
										<thead class="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
											<tr>
												<th class="px-4 py-3 font-semibold">Filename</th>
												<th class="px-4 py-3 font-semibold">Germany / VPS time</th>
												<th class="px-4 py-3 font-semibold">Beijing time</th>
												<th class="px-4 py-3 font-semibold">Size</th>
												<th class="px-4 py-3 font-semibold">SHA256</th>
											</tr>
										</thead>
										<tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/50">
											{#if !backupStatus}
												<tr><td colspan="5" class="px-4 py-8 text-center text-zinc-500">No bot selected.</td></tr>
											{:else if backupStatus.backups.length === 0}
												<tr><td colspan="5" class="px-4 py-8 text-center text-zinc-500">No local backups found.</td></tr>
											{:else}
												{#each backupStatus.backups as item}
													<tr class="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
														<td class="px-4 py-3 font-mono text-xs">{item.filename}</td>
														<td class="px-4 py-3">{item.created_at_de ?? item.created_at}</td>
														<td class="px-4 py-3">{item.created_at_beijing ?? item.created_at}</td>
														<td class="px-4 py-3">{formatSize(item.size)}</td>
														<td class="px-4 py-3 font-mono text-xs text-zinc-500">{item.sha256 ? shortSha(item.sha256) : 'Deferred'}</td>
													</tr>
												{/each}
											{/if}
										</tbody>
									</table>
								</div>
							</div>
						</div>
						{/if}
					</div>
				{/if}

				{#if activeView === 'settings'}
					<div class="p-5 md:p-6 animate-in fade-in duration-300">
						<div class="mx-auto flex w-full max-w-3xl flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden shadow-sm">
							<div class="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
								<h2 class="font-semibold text-sm">Account security</h2>
								<span class="px-2 py-0.5 text-xs font-medium rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
									{totpEnabled ? '2FA enabled' : '2FA not configured'}
								</span>
							</div>
							<div class="p-4 flex flex-col gap-4">
								<div class="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
									<div>
										<strong class="block text-sm text-zinc-900 dark:text-zinc-100">Telegram approval</strong>
										<span class="mt-1 block text-sm text-zinc-500 dark:text-zinc-400">Available for owner login approval.</span>
									</div>
									<span class="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">Enabled</span>
								</div>

								<div class="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
									<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
										<div>
											<strong class="block text-sm text-zinc-900 dark:text-zinc-100">Authenticator setup</strong>
											<span class="mt-1 block text-sm text-zinc-500 dark:text-zinc-400">{totpEnabled ? 'Configured for fallback login.' : '2FA is not configured.'}</span>
										</div>
										<button class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 sm:self-start" on:click={generateTotp} disabled={isGeneratingTotp}>
											{isGeneratingTotp ? 'Generating...' : (totpEnabled ? 'Reset 2FA setup' : 'Generate 2FA setup')}
										</button>
									</div>
								</div>

								{#if totpSecret}
									<div class="grid gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50 md:grid-cols-[auto_minmax(0,1fr)]">
										<div>
											<strong class="mb-2 block text-sm">Scan QR code</strong>
											<div class="bg-white p-2 rounded-lg border border-zinc-200 self-start">
												<canvas bind:this={totpQrCanvas}></canvas>
											</div>
										</div>
										<div class="min-w-0 space-y-3">
											<div>
												<strong class="mb-1 block text-sm">Manual secret</strong>
												<code class="block text-xs bg-zinc-200 dark:bg-zinc-900 p-2 rounded break-all">{totpSecret}</code>
											</div>
											<div>
												<strong class="mb-1 block text-sm">otpauth URI</strong>
												<code class="block text-xs bg-zinc-200 dark:bg-zinc-900 p-2 rounded break-all">{totpUri}</code>
											</div>
										</div>
									</div>
									<form on:submit={enableTotpSubmit} class="flex flex-col gap-2 sm:flex-row">
										<input type="text" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" placeholder="000000" bind:value={enableTotpCode} class="flex-1 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
										<button type="submit" disabled={enableTotpCode.length !== 6} class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
											Enable 2FA
										</button>
									</form>
								{/if}
								{#if settingsMessage}
									<div class="text-sm p-3 rounded-lg border {toneToClass(settingsMessageTone)}">
										{settingsMessage}
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/if}
			</main>
		</div>
		</div>
	{/if}
</div>

{#if noticeVisible}
	<div class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-zinc-900 text-white text-sm rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-200 pointer-events-none">
		{noticeMessage}
	</div>
{/if}
