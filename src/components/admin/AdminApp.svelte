<script lang="ts">
import Icon from "@iconify/svelte";
import { onDestroy, onMount } from "svelte";

type AuthOptions = {
	methods?: {
		telegram?: boolean;
		totp?: boolean;
	};
	owner_id?: number;
};

type UserRow = {
	id: string;
	email: string;
	username: string;
	role: string;
	created_at: string;
	updated_at: string;
	disabled_at: string | null;
};

type CommentRow = {
	id: string;
	post_slug: string;
	user_id: string;
	username: string;
	content: string;
	status: string;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
};

type AdminStatus = {
	d1_configured?: boolean;
	users_available?: boolean;
	comments_available?: boolean;
	storage?: string;
	totp_enabled?: boolean;
};

let { apiBase }: { apiBase: string } = $props();

const ADMIN_BOT_ID = "SilentFlare Admin";
const apiOrigin = $derived(apiBase.replace(/\/$/, ""));

let authOptions = $state<AuthOptions | null>(null);
let authenticated = $state(false);
let csrf = $state(
	typeof sessionStorage !== "undefined"
		? (sessionStorage.getItem("silentflare_admin_csrf") ?? "")
		: "",
);
let activeTab = $state<"users" | "comments">("users");
let loginMode = $state<"telegram" | "totp">("telegram");
let loginCode = $state("");
let loginMessage = $state("Loading admin login options...");
let loginTone = $state<"neutral" | "warning" | "error" | "success">("neutral");
let challengeId = $state("");
let challengeExpiresAt = $state<Date | null>(null);
let pollTimer: number | null = null;
let countdownTimer: number | null = null;
let sendingTelegram = $state(false);
let loggingIn = $state(false);

let status = $state<AdminStatus | null>(null);
let users = $state<UserRow[]>([]);
let comments = $state<CommentRow[]>([]);
let postSlugFilter = $state("");
let loadingUsers = $state(false);
let loadingComments = $state(false);
let actionMessage = $state("");
let actionTone = $state<"neutral" | "warning" | "error" | "success">("neutral");

const telegramAvailable = $derived(Boolean(authOptions?.methods?.telegram));
const totpAvailable = $derived(Boolean(authOptions?.methods?.totp));
const accountDbReady = $derived(Boolean(status?.d1_configured));

function toneClass(tone: string) {
	if (tone === "success")
		return "border-cyan-300/30 bg-cyan-300/10 text-cyan-100";
	if (tone === "warning")
		return "border-amber-300/30 bg-amber-300/10 text-amber-100";
	if (tone === "error") return "border-red-300/30 bg-red-300/10 text-red-100";
	return "border-white/10 bg-white/[0.055] text-slate-300";
}

function formatTime(value: string | null) {
	if (!value) return "None";
	try {
		return new Intl.DateTimeFormat(undefined, {
			month: "short",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		}).format(new Date(value));
	} catch {
		return value;
	}
}

async function api<T>(
	path: string,
	init: RequestInit & { csrf?: boolean } = {},
) {
	const response = await fetch(`${apiOrigin}${path}`, {
		...init,
		credentials: "include",
		headers: {
			Accept: "application/json",
			...(init.body ? { "Content-Type": "application/json" } : {}),
			...(init.csrf ? { "X-CSRF-Token": csrf } : {}),
			...(init.headers ?? {}),
		},
	});
	const body = (await response.json().catch(() => ({}))) as { detail?: string };
	if (!response.ok) {
		if (response.status === 401 || response.status === 403) {
			authenticated = false;
		}
		throw new Error(body.detail ?? `API ${response.status}`);
	}
	return body as T;
}

async function loadAuthOptions() {
	try {
		authOptions = await api<AuthOptions>("/auth/options");
		loginMessage = telegramAvailable
			? "Use SilentflareBot to approve this admin login."
			: "SilentflareBot login is not configured.";
		loginTone = telegramAvailable ? "neutral" : "warning";
	} catch (error) {
		loginMessage =
			error instanceof Error ? error.message : "Unable to load login options.";
		loginTone = "error";
	}
}

async function checkExistingSession() {
	try {
		const session = await api<{
			csrf: string;
			bot: { id: string };
			totp_enabled: boolean;
		}>("/auth/me");
		if (session.bot?.id !== ADMIN_BOT_ID) {
			throw new Error("Current session is not an admin session.");
		}
		csrf = session.csrf;
		sessionStorage.setItem("silentflare_admin_csrf", csrf);
		authenticated = true;
		status = await api<AdminStatus>("/admin/status");
		await refreshActiveTab();
	} catch {
		authenticated = false;
		sessionStorage.removeItem("silentflare_admin_csrf");
	}
}

function stopPolling() {
	if (pollTimer) clearInterval(pollTimer);
	if (countdownTimer) clearInterval(countdownTimer);
	pollTimer = null;
	countdownTimer = null;
	challengeId = "";
	challengeExpiresAt = null;
	sendingTelegram = false;
}

function updateCountdown() {
	if (!challengeExpiresAt) return;
	const remaining = Math.max(
		0,
		Math.round((challengeExpiresAt.getTime() - Date.now()) / 1000),
	);
	if (remaining <= 0) {
		loginMessage = "Approval request expired. Send a new request.";
		loginTone = "warning";
		stopPolling();
		return;
	}
	const minutes = Math.floor(remaining / 60);
	const seconds = String(remaining % 60).padStart(2, "0");
	loginMessage = `Approval sent to SilentflareBot. Waiting ${minutes}:${seconds}.`;
	loginTone = "neutral";
}

async function startTelegramLogin() {
	if (!telegramAvailable || sendingTelegram) return;
	stopPolling();
	sendingTelegram = true;
	try {
		const result = await api<{ challenge_id: string; expires_at: string }>(
			"/auth/telegram/start",
			{
				method: "POST",
				body: JSON.stringify({ bot_id: ADMIN_BOT_ID }),
			},
		);
		challengeId = result.challenge_id;
		challengeExpiresAt = new Date(result.expires_at);
		updateCountdown();
		countdownTimer = setInterval(updateCountdown, 1000) as unknown as number;
		pollTimer = setInterval(checkTelegramLogin, 1000) as unknown as number;
		await checkTelegramLogin();
	} catch (error) {
		stopPolling();
		loginMessage =
			error instanceof Error ? error.message : "Telegram login failed.";
		loginTone = "error";
	}
}

async function checkTelegramLogin() {
	if (!challengeId) return;
	try {
		const result = await api<{
			status: string;
			csrf?: string;
			bot?: { id: string };
		}>(
			`/auth/telegram/status/${challengeId}?bot_id=${encodeURIComponent(ADMIN_BOT_ID)}`,
		);
		if (result.status !== "approved") return;
		await enterAdmin(result.csrf ?? "");
	} catch (error) {
		stopPolling();
		loginMessage =
			error instanceof Error ? error.message : "Telegram approval failed.";
		loginTone = "error";
	}
}

async function loginWithTotp() {
	if (!totpAvailable || loggingIn) return;
	loggingIn = true;
	try {
		const result = await api<{ csrf: string }>("/auth/login", {
			method: "POST",
			body: JSON.stringify({
				bot_id: ADMIN_BOT_ID,
				method: "totp",
				code: loginCode,
			}),
		});
		await enterAdmin(result.csrf);
	} catch (error) {
		loginMessage = error instanceof Error ? error.message : "2FA login failed.";
		loginTone = "error";
	} finally {
		loggingIn = false;
	}
}

async function enterAdmin(nextCsrf: string) {
	stopPolling();
	csrf = nextCsrf;
	sessionStorage.setItem("silentflare_admin_csrf", csrf);
	authenticated = true;
	loginMessage = "Admin login verified.";
	loginTone = "success";
	status = await api<AdminStatus>("/admin/status");
	await refreshActiveTab();
}

async function logout() {
	try {
		await api("/auth/logout", { method: "POST", csrf: true });
	} catch {}
	csrf = "";
	sessionStorage.removeItem("silentflare_admin_csrf");
	authenticated = false;
}

async function loadUsers() {
	loadingUsers = true;
	actionMessage = "";
	try {
		const data = await api<{
			users: UserRow[];
			d1_configured?: boolean;
			storage?: string;
		}>("/admin/users");
		users = data.users ?? [];
		status = {
			...status,
			d1_configured: data.d1_configured,
			storage: data.storage,
		};
	} catch (error) {
		actionMessage =
			error instanceof Error ? error.message : "Unable to load users.";
		actionTone = "error";
	} finally {
		loadingUsers = false;
	}
}

async function loadComments() {
	loadingComments = true;
	actionMessage = "";
	const query = postSlugFilter.trim()
		? `?post_slug=${encodeURIComponent(postSlugFilter.trim())}`
		: "";
	try {
		const data = await api<{
			comments: CommentRow[];
			d1_configured?: boolean;
			storage?: string;
		}>(`/admin/comments${query}`);
		comments = data.comments ?? [];
		status = {
			...status,
			d1_configured: data.d1_configured,
			storage: data.storage,
		};
	} catch (error) {
		actionMessage =
			error instanceof Error ? error.message : "Unable to load comments.";
		actionTone = "error";
	} finally {
		loadingComments = false;
	}
}

async function refreshActiveTab() {
	if (activeTab === "users") {
		await loadUsers();
	} else {
		await loadComments();
	}
}

async function userAction(user: UserRow, action: "enable" | "disable") {
	try {
		await api(`/admin/users/${encodeURIComponent(user.id)}/${action}`, {
			method: "POST",
			csrf: true,
			body: JSON.stringify({}),
		});
		actionMessage = `${user.username} ${action === "enable" ? "enabled" : "disabled"}.`;
		actionTone = "success";
		await loadUsers();
	} catch (error) {
		actionMessage =
			error instanceof Error ? error.message : "User update failed.";
		actionTone = "error";
	}
}

async function setRole(user: UserRow, role: "user" | "admin") {
	try {
		await api(`/admin/users/${encodeURIComponent(user.id)}/role`, {
			method: "POST",
			csrf: true,
			body: JSON.stringify({ role }),
		});
		actionMessage = `${user.username} role updated.`;
		actionTone = "success";
		await loadUsers();
	} catch (error) {
		actionMessage =
			error instanceof Error ? error.message : "Role update failed.";
		actionTone = "error";
	}
}

async function commentAction(
	comment: CommentRow,
	action: "delete" | "restore",
) {
	try {
		await api(`/admin/comments/${encodeURIComponent(comment.id)}/${action}`, {
			method: "POST",
			csrf: true,
			body: JSON.stringify({}),
		});
		actionMessage = `Comment ${action === "delete" ? "deleted" : "restored"}.`;
		actionTone = "success";
		await loadComments();
	} catch (error) {
		actionMessage =
			error instanceof Error ? error.message : "Comment update failed.";
		actionTone = "error";
	}
}

onMount(() => {
	void loadAuthOptions();
	void checkExistingSession();
});

onDestroy(stopPolling);
</script>

<main class="min-h-screen bg-[#10141d] text-slate-100">
	{#if !authenticated}
		<section class="flex min-h-screen items-center justify-center px-4 py-8">
			<div class="w-full max-w-5xl overflow-hidden rounded-lg border border-white/10 bg-[#151b27] shadow-2xl">
				<div class="grid min-h-[36rem] lg:grid-cols-[1fr_26rem]">
					<div class="flex flex-col justify-between gap-8 border-b border-white/10 p-5 md:p-8 lg:border-b-0 lg:border-r">
						<div>
							<div class="mb-5 flex flex-wrap items-center gap-2">
								<span class="rounded-md border border-cyan-300/25 bg-cyan-300/10 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">Admin</span>
								<span class="text-sm text-slate-400">admin.silentflare.com</span>
							</div>
							<h1 class="max-w-2xl text-3xl font-bold text-white md:text-5xl">SilentFlare user and comment control</h1>
							<p class="mt-4 max-w-2xl text-base leading-7 text-slate-300">
								Owner-only management for registered public users and post comments. Articles, tags, authors, and media stay in Ghost.
							</p>
						</div>

						<div class="grid gap-3 sm:grid-cols-2">
							<div class="rounded-lg border border-white/10 bg-white/[0.04] p-4">
								<Icon icon="material-symbols:shield-lock-outline-rounded" class="mb-3 text-[1.6rem] text-cyan-100" />
								<h2 class="font-bold text-white">SilentflareBot approval</h2>
								<p class="mt-2 text-sm leading-6 text-slate-400">Primary login path. Approval goes to the fixed owner Telegram account.</p>
							</div>
							<div class="rounded-lg border border-white/10 bg-white/[0.04] p-4">
								<Icon icon="material-symbols:password-rounded" class="mb-3 text-[1.6rem] text-cyan-100" />
								<h2 class="font-bold text-white">Authenticator 2FA</h2>
								<p class="mt-2 text-sm leading-6 text-slate-400">Fallback only. If no secret is configured, this path remains disabled.</p>
							</div>
						</div>
					</div>

					<div class="p-5 md:p-8">
						<div class="mb-5 grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-black/20 p-1">
							<button class:admin-tab-active={loginMode === "telegram"} class="admin-tab" type="button" onclick={() => { loginMode = "telegram"; }}>
								Bot login
							</button>
							<button class:admin-tab-active={loginMode === "totp"} class="admin-tab" type="button" onclick={() => { loginMode = "totp"; }}>
								2FA
							</button>
						</div>

						{#if loginMode === "telegram"}
							<div class="grid gap-4">
								<div class="rounded-lg border border-white/10 bg-white/[0.04] p-4">
									<p class="text-sm font-medium text-slate-300">Login target</p>
									<p class="mt-1 text-xl font-bold text-white">{ADMIN_BOT_ID}</p>
									<p class="mt-2 text-sm leading-6 text-slate-400">Uses the SilentflareBot Telegram approval flow.</p>
								</div>
								<button class="admin-button-primary w-full" type="button" disabled={!telegramAvailable || sendingTelegram} onclick={() => void startTelegramLogin()}>
									<Icon icon="material-symbols:send-rounded" class="text-[1.25rem]" />
									{sendingTelegram ? "Waiting for approval" : "Send approval request"}
								</button>
							</div>
						{:else}
							<form class="grid gap-4" onsubmit={(event) => { event.preventDefault(); void loginWithTotp(); }}>
								{#if totpAvailable}
									<label class="grid gap-2 text-sm font-medium text-slate-300">
										Authenticator code
										<input class="admin-input" inputmode="numeric" autocomplete="one-time-code" maxlength="8" bind:value={loginCode} placeholder="123456" />
									</label>
									<button class="admin-button-primary w-full" type="submit" disabled={loggingIn}>
										<Icon icon="material-symbols:login-rounded" class="text-[1.25rem]" />
										{loggingIn ? "Verifying" : "Login with 2FA"}
									</button>
								{:else}
									<div class="rounded-lg border border-amber-300/30 bg-amber-300/10 p-4 text-amber-100">
										<p class="font-bold">2FA unavailable</p>
										<p class="mt-2 text-sm leading-6">Authenticator fallback is not configured on the API server.</p>
									</div>
								{/if}
							</form>
						{/if}

						<div class="mt-5 rounded-lg border p-3 text-sm leading-6 {toneClass(loginTone)}">
							{loginMessage}
						</div>
					</div>
				</div>
			</div>
		</section>
	{:else}
		<section class="border-b border-white/10 bg-[#151b27]">
			<div class="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 md:px-6 lg:flex-row lg:items-center lg:justify-between">
				<div>
					<p class="text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">SilentFlare Admin</p>
					<h1 class="mt-1 text-2xl font-bold text-white md:text-3xl">Users and comments</h1>
				</div>
				<div class="flex flex-wrap gap-2">
					<button class="admin-button" type="button" onclick={() => { activeTab = "users"; void refreshActiveTab(); }}>
						<Icon icon="material-symbols:group-outline-rounded" class="text-[1.25rem]" />
						Users
					</button>
					<button class="admin-button" type="button" onclick={() => { activeTab = "comments"; void refreshActiveTab(); }}>
						<Icon icon="material-symbols:forum-outline-rounded" class="text-[1.25rem]" />
						Comments
					</button>
					<button class="admin-button" type="button" onclick={() => void refreshActiveTab()}>
						<Icon icon="material-symbols:refresh-rounded" class="text-[1.25rem]" />
						Refresh
					</button>
					<button class="admin-button-danger" type="button" onclick={() => void logout()}>
						<Icon icon="material-symbols:logout-rounded" class="text-[1.25rem]" />
						Logout
					</button>
				</div>
			</div>
		</section>

		<div class="mx-auto grid w-full max-w-7xl gap-4 px-4 py-5 md:px-6">
			{#if !accountDbReady}
				<div class="rounded-lg border border-amber-300/30 bg-amber-300/10 p-4 text-amber-100">
					<p class="font-bold">Account database is not available</p>
					<p class="mt-2 text-sm leading-6">Check the FNS1 API local database path and filesystem permissions to enable user and comment operations.</p>
				</div>
			{/if}

			{#if actionMessage}
				<div class="rounded-lg border p-3 text-sm {toneClass(actionTone)}">{actionMessage}</div>
			{/if}

			{#if activeTab === "users"}
				<section class="rounded-lg border border-white/10 bg-white/[0.04]">
					<div class="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h2 class="text-lg font-bold text-white">Registered users</h2>
							<p class="mt-1 text-sm text-slate-400">Manage public login/register accounts.</p>
						</div>
						<span class="rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-1 text-sm text-slate-300">{users.length} loaded</span>
					</div>
					<div class="grid gap-3 p-3">
						{#if loadingUsers}
							<p class="p-4 text-sm text-slate-400">Loading users...</p>
						{:else if users.length === 0}
							<p class="p-4 text-sm text-slate-400">No users loaded.</p>
						{:else}
							{#each users as user}
								<article class="grid gap-4 rounded-lg border border-white/10 bg-[#151b27] p-4 lg:grid-cols-[1fr_auto] lg:items-center">
									<div class="min-w-0">
										<div class="flex flex-wrap items-center gap-2">
											<h3 class="truncate font-bold text-white">{user.username}</h3>
											<span class="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-2 py-0.5 text-xs text-cyan-100">{user.role}</span>
											{#if user.disabled_at}
												<span class="rounded-md border border-red-300/20 bg-red-300/10 px-2 py-0.5 text-xs text-red-100">disabled</span>
											{/if}
										</div>
										<p class="mt-1 truncate text-sm text-slate-400">{user.email}</p>
										<p class="mt-2 text-xs text-slate-500">Created {formatTime(user.created_at)} · Updated {formatTime(user.updated_at)}</p>
									</div>
									<div class="grid grid-cols-2 gap-2 sm:flex">
										<button class="admin-small-button" type="button" onclick={() => void setRole(user, user.role === "admin" ? "user" : "admin")}>{user.role === "admin" ? "Make user" : "Make admin"}</button>
										<button class={user.disabled_at ? "admin-small-button" : "admin-small-button-danger"} type="button" onclick={() => void userAction(user, user.disabled_at ? "enable" : "disable")}>{user.disabled_at ? "Enable" : "Disable"}</button>
									</div>
								</article>
							{/each}
						{/if}
					</div>
				</section>
			{:else}
				<section class="rounded-lg border border-white/10 bg-white/[0.04]">
					<div class="grid gap-3 border-b border-white/10 p-4 md:grid-cols-[1fr_auto] md:items-end">
						<div>
							<h2 class="text-lg font-bold text-white">Comments</h2>
							<p class="mt-1 text-sm text-slate-400">Moderate public post comments. Use a Ghost slug to narrow results.</p>
						</div>
						<form class="flex gap-2" onsubmit={(event) => { event.preventDefault(); void loadComments(); }}>
							<input class="admin-input min-w-0" bind:value={postSlugFilter} placeholder="post slug" />
							<button class="admin-button-primary shrink-0" type="submit">Filter</button>
						</form>
					</div>
					<div class="grid gap-3 p-3">
						{#if loadingComments}
							<p class="p-4 text-sm text-slate-400">Loading comments...</p>
						{:else if comments.length === 0}
							<p class="p-4 text-sm text-slate-400">No comments loaded.</p>
						{:else}
							{#each comments as comment}
								<article class="grid gap-4 rounded-lg border border-white/10 bg-[#151b27] p-4 lg:grid-cols-[1fr_auto]">
									<div class="min-w-0">
										<div class="flex flex-wrap items-center gap-2">
											<h3 class="font-bold text-white">{comment.username}</h3>
											<span class="rounded-md border border-white/10 bg-white/[0.06] px-2 py-0.5 text-xs text-slate-300">{comment.post_slug}</span>
											<span class="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-2 py-0.5 text-xs text-cyan-100">{comment.status}</span>
										</div>
										<p class="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-300">{comment.content}</p>
										<p class="mt-3 text-xs text-slate-500">Created {formatTime(comment.created_at)} · Deleted {formatTime(comment.deleted_at)}</p>
									</div>
									<div class="sm:min-w-28">
										<button class={comment.deleted_at ? "admin-small-button" : "admin-small-button-danger"} type="button" onclick={() => void commentAction(comment, comment.deleted_at ? "restore" : "delete")}>{comment.deleted_at ? "Restore" : "Delete"}</button>
									</div>
								</article>
							{/each}
						{/if}
					</div>
				</section>
			{/if}
		</div>
	{/if}
</main>

<style>
	.admin-tab,
	.admin-button,
	.admin-button-primary,
	.admin-button-danger,
	.admin-small-button,
	.admin-small-button-danger {
		display: inline-flex;
		min-height: 2.75rem;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		border-radius: 0.5rem;
		padding: 0 1rem;
		font-weight: 700;
		transition:
			transform 160ms ease,
			background-color 160ms ease,
			border-color 160ms ease;
	}

	.admin-tab,
	.admin-button,
	.admin-small-button {
		border: 1px solid rgb(255 255 255 / 0.1);
		background: rgb(255 255 255 / 0.055);
		color: rgb(226 232 240);
	}

	.admin-tab-active,
	.admin-button-primary {
		border: 1px solid rgb(103 232 249 / 0.35);
		background: rgb(34 211 238 / 0.16);
		color: white;
	}

	.admin-button-danger,
	.admin-small-button-danger {
		border: 1px solid rgb(252 165 165 / 0.3);
		background: rgb(248 113 113 / 0.12);
		color: rgb(254 226 226);
	}

	.admin-small-button,
	.admin-small-button-danger {
		min-height: 2.5rem;
		padding: 0 0.75rem;
		font-size: 0.875rem;
	}

	.admin-input {
		min-height: 2.75rem;
		width: 100%;
		border-radius: 0.5rem;
		border: 1px solid rgb(255 255 255 / 0.12);
		background: rgb(0 0 0 / 0.18);
		padding: 0 0.875rem;
		color: white;
		outline: none;
	}

	.admin-input:focus {
		border-color: rgb(103 232 249 / 0.45);
		box-shadow: 0 0 0 2px rgb(103 232 249 / 0.16);
	}

	button:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}

	.admin-tab:active,
	.admin-button:active,
	.admin-button-primary:active,
	.admin-button-danger:active,
	.admin-small-button:active,
	.admin-small-button-danger:active {
		transform: scale(0.98);
	}
</style>
