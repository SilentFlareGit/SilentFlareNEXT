<script lang="ts">
import Icon from "@iconify/svelte";
import { onDestroy, onMount } from "svelte";

type UserRow = {
	id: string;
	email: string;
	username: string;
	role: string;
	display_name?: string;
	avatar_url?: string;
	bio?: string;
	display_region?: string;
	display_region_code?: string;
	email_verified_at?: string;
	totp_enabled?: number;
	tos_version?: string;
	tos_accepted_at?: string;
	registration_ip?: string;
	last_seen_ip?: string;
	last_seen_at?: string;
	last_user_agent?: string;
	created_at: string;
	updated_at: string;
	disabled_at: string | null;
	has_password?: number;
	comment_count?: number;
	active_session_count?: number;
	latest_comment_at?: string;
};
type CommentRow = {
	id: string;
	post_slug: string;
	user_id: string;
	username: string;
	email?: string;
	display_name?: string;
	content: string;
	status: string;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	created_ip?: string;
};
type AuthOptions = { methods?: { telegram?: boolean; totp?: boolean } };
type AdminStatus = {
	d1_configured?: boolean;
	storage?: string;
	totp_enabled?: boolean;
};

let { apiBase }: { apiBase: string } = $props();
const ADMIN_BOT_ID = "SilentFlare Admin";
const apiOrigin = $derived(apiBase.replace(/\/$/, ""));
let authenticated = $state(false);
let authOptions = $state<AuthOptions | null>(null);
let csrf = $state(
	typeof sessionStorage === "undefined"
		? ""
		: (sessionStorage.getItem("silentflare_admin_csrf") ?? ""),
);
let loginMode = $state<"telegram" | "totp">("telegram");
let loginCode = $state("");
let loginMessage = $state("Loading secure sign-in...");
let loginTone = $state<"neutral" | "warning" | "error" | "success">("neutral");
let challengeId = $state("");
let challengeExpiresAt = $state<Date | null>(null);
let pollTimer: number | null = null;
let countdownTimer: number | null = null;
let sendingTelegram = $state(false);
let checkingTelegram = false;
let loggingIn = $state(false);
let status = $state<AdminStatus | null>(null);
let activeTab = $state<"users" | "comments">("users");
let users = $state<UserRow[]>([]);
let comments = $state<CommentRow[]>([]);
let selectedUser = $state<UserRow | null>(null);
let selectedUserComments = $state<CommentRow[]>([]);
let search = $state("");
let postSlugFilter = $state("");
let loading = $state(false);
let actionMessage = $state("");
let actionTone = $state<"neutral" | "error" | "success">("neutral");

const telegramAvailable = $derived(Boolean(authOptions?.methods?.telegram));
const totpAvailable = $derived(Boolean(authOptions?.methods?.totp));
const visibleUsers = $derived(
	users.filter((user) =>
		`${user.username} ${user.email} ${user.display_name ?? ""} ${user.last_seen_ip ?? ""}`
			.toLowerCase()
			.includes(search.trim().toLowerCase()),
	),
);
const visibleComments = $derived(
	comments.filter((comment) =>
		`${comment.username} ${comment.email ?? ""} ${comment.content} ${comment.post_slug}`
			.toLowerCase()
			.includes(search.trim().toLowerCase()),
	),
);
const disabledCount = $derived(users.filter((user) => user.disabled_at).length);

function formatTime(value?: string | null) {
	if (!value) return "Not recorded";
	return new Intl.DateTimeFormat(undefined, {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(new Date(value));
}
function initials(user: UserRow) {
	return (user.display_name || user.username || "U").slice(0, 2).toUpperCase();
}
function countryFlag(code?: string) {
	return code?.length === 2
		? String.fromCodePoint(
				...code
					.toUpperCase()
					.split("")
					.map((c) => 127397 + c.charCodeAt(0)),
			)
		: "";
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
		if (response.status === 401 || response.status === 403)
			authenticated = false;
		throw new Error(body.detail ?? `API ${response.status}`);
	}
	return body as T;
}
function stopPolling() {
	if (pollTimer) clearInterval(pollTimer);
	if (countdownTimer) clearInterval(countdownTimer);
	pollTimer = countdownTimer = null;
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
	if (!remaining) {
		loginMessage = "Approval expired. Send a new request.";
		loginTone = "warning";
		stopPolling();
		return;
	}
	loginMessage = `Approval sent. Waiting ${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}.`;
}
async function loadAuthOptions() {
	try {
		authOptions = await api<AuthOptions>("/auth/options");
		loginMessage = telegramAvailable
			? "Approve this sign-in in SilentflareBot."
			: "Telegram approval is not configured.";
		loginTone = telegramAvailable ? "neutral" : "warning";
	} catch (error) {
		loginMessage =
			error instanceof Error ? error.message : "Unable to load sign-in.";
		loginTone = "error";
	}
}
async function enterAdmin(nextCsrf: string) {
	stopPolling();
	csrf = nextCsrf;
	sessionStorage.setItem("silentflare_admin_csrf", csrf);
	authenticated = true;
	status = await api<AdminStatus>("/admin/status");
	await loadUsers();
}
async function checkExistingSession() {
	try {
		const session = await api<{ csrf: string; bot: { id: string } }>(
			"/auth/me",
		);
		if (session.bot?.id !== ADMIN_BOT_ID) throw new Error();
		await enterAdmin(session.csrf);
	} catch {
		authenticated = false;
		sessionStorage.removeItem("silentflare_admin_csrf");
	}
}
async function startTelegramLogin() {
	if (!telegramAvailable || sendingTelegram) return;
	stopPolling();
	sendingTelegram = true;
	try {
		const result = await api<{ challenge_id: string; expires_at: string }>(
			"/auth/telegram/start",
			{ method: "POST", body: JSON.stringify({ bot_id: ADMIN_BOT_ID }) },
		);
		challengeId = result.challenge_id;
		challengeExpiresAt = new Date(result.expires_at);
		updateCountdown();
		countdownTimer = setInterval(updateCountdown, 1000) as unknown as number;
		pollTimer = setInterval(checkTelegramLogin, 1000) as unknown as number;
	} catch (error) {
		stopPolling();
		loginMessage =
			error instanceof Error ? error.message : "Telegram sign-in failed.";
		loginTone = "error";
	}
}
async function checkTelegramLogin() {
	if (!challengeId || checkingTelegram) return;
	checkingTelegram = true;
	try {
		const result = await api<{ status: string; csrf?: string }>(
			`/auth/telegram/status/${challengeId}?bot_id=${encodeURIComponent(ADMIN_BOT_ID)}`,
		);
		if (result.status === "approved") {
			stopPolling();
			await enterAdmin(result.csrf ?? "");
		}
	} catch (error) {
		stopPolling();
		loginMessage = error instanceof Error ? error.message : "Approval failed.";
		loginTone = "error";
	} finally {
		checkingTelegram = false;
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
		loginMessage =
			error instanceof Error ? error.message : "2FA sign-in failed.";
		loginTone = "error";
	} finally {
		loggingIn = false;
	}
}
async function loadUsers() {
	loading = true;
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
		showError(error);
	} finally {
		loading = false;
	}
}
async function loadComments() {
	loading = true;
	const query = postSlugFilter.trim()
		? `?post_slug=${encodeURIComponent(postSlugFilter.trim())}`
		: "";
	try {
		const data = await api<{ comments: CommentRow[] }>(
			`/admin/comments${query}`,
		);
		comments = data.comments ?? [];
	} catch (error) {
		showError(error);
	} finally {
		loading = false;
	}
}
async function selectUser(user: UserRow) {
	selectedUser = user;
	try {
		const data = await api<{ user: UserRow; comments: CommentRow[] }>(
			`/admin/users/${encodeURIComponent(user.id)}`,
		);
		selectedUser = data.user;
		selectedUserComments = data.comments ?? [];
	} catch (error) {
		showError(error);
	}
}
function showError(error: unknown) {
	actionMessage = error instanceof Error ? error.message : "Request failed.";
	actionTone = "error";
}
async function userAction(user: UserRow, action: "enable" | "disable") {
	try {
		await api(`/admin/users/${encodeURIComponent(user.id)}/${action}`, {
			method: "POST",
			csrf: true,
			body: "{}",
		});
		actionMessage = `${user.username} ${action}d.`;
		actionTone = "success";
		await loadUsers();
		selectedUser = null;
	} catch (error) {
		showError(error);
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
		selectedUser = null;
	} catch (error) {
		showError(error);
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
			body: "{}",
		});
		actionMessage = `Comment ${action}d.`;
		actionTone = "success";
		await loadComments();
	} catch (error) {
		showError(error);
	}
}
async function logout() {
	try {
		await api("/auth/logout", { method: "POST", csrf: true });
	} catch {}
	csrf = "";
	sessionStorage.removeItem("silentflare_admin_csrf");
	authenticated = false;
}
async function switchTab(tab: "users" | "comments") {
	activeTab = tab;
	search = "";
	if (tab === "users") await loadUsers();
	else await loadComments();
}
onMount(() => {
	void loadAuthOptions();
	void checkExistingSession();
});
onDestroy(stopPolling);
</script>

<main class="admin-shell">
{#if !authenticated}
	<section class="login-wrap">
		<div class="login-panel">
			<a class="wordmark" href="https://blog.silentflare.com/"><span>S</span> SilentFlare</a>
			<div class="login-copy">
				<div><p class="eyebrow">OWNER CONSOLE</p><h1>Keep the community in focus.</h1><p>Review members, understand account activity, and moderate every public conversation from one private workspace.</p></div>
				<div class="login-features">
					<div><Icon icon="material-symbols:manage-accounts-outline-rounded"/><span><strong>Account directory</strong><small>Profiles, security, sessions and network audit</small></span></div>
					<div><Icon icon="material-symbols:forum-outline-rounded"/><span><strong>Comment moderation</strong><small>Review context and act without leaving the console</small></span></div>
				</div>
			</div>
			<div class="login-form">
				<div class="mode-tabs"><button class:active={loginMode === "telegram"} onclick={() => loginMode = "telegram"}>Telegram</button><button class:active={loginMode === "totp"} disabled={!totpAvailable} onclick={() => loginMode = "totp"}>Authenticator</button></div>
				<p class="eyebrow">SECURE SIGN IN</p>
				{#if loginMode === "telegram"}<div class="login-icon-wrap"><Icon icon="material-symbols:verified-user-outline-rounded" class="login-icon"/></div><h2>Approve with Telegram</h2><p>We will send a one-time approval request to the configured SilentFlare Owner account.</p><button class="primary" disabled={!telegramAvailable || sendingTelegram} onclick={startTelegramLogin}><Icon icon="material-symbols:send-rounded"/>{sendingTelegram ? "Waiting for approval" : "Send approval request"}</button>
				{:else}<Icon icon="material-symbols:password-rounded" class="login-icon"/><h2>Authenticator code</h2><p>Enter the six-digit fallback code.</p><input class="field" inputmode="numeric" maxlength="6" bind:value={loginCode} placeholder="000000"/><button class="primary" disabled={!totpAvailable || loggingIn} onclick={loginWithTotp}>Verify code</button>{/if}
				<div class:error={loginTone === "error"} class:warning={loginTone === "warning"} class="notice">{loginMessage}</div>
			</div>
		</div>
	</section>
{:else}
	<header><a class="wordmark" href="https://blog.silentflare.com/"><span>S</span> SilentFlare <b>Admin</b></a><div class="header-actions"><button class="icon-button" title="Refresh" onclick={() => activeTab === "users" ? loadUsers() : loadComments()}><Icon icon="material-symbols:refresh-rounded"/></button><button class="icon-button" title="Sign out" onclick={logout}><Icon icon="material-symbols:logout-rounded"/></button></div></header>
	<div class="workspace">
		<aside><p class="nav-label">Workspace</p><button class:active={activeTab === "users"} onclick={() => switchTab("users")}><Icon icon="material-symbols:group-outline-rounded"/>Users <span>{users.length}</span></button><button class:active={activeTab === "comments"} onclick={() => switchTab("comments")}><Icon icon="material-symbols:forum-outline-rounded"/>Comments</button><div class="storage"><i class:ok={status?.d1_configured}></i><div><strong>Account database</strong><small>{status?.d1_configured ? "Connected on FNS1" : "Unavailable"}</small></div></div></aside>
		<section class="content">
			<div class="page-head"><div><p class="eyebrow">{activeTab === "users" ? "ACCOUNT DIRECTORY" : "COMMENT MODERATION"}</p><h1>{activeTab === "users" ? "Users" : "Comments"}</h1></div><label class="search"><Icon icon="material-symbols:search-rounded"/><input bind:value={search} placeholder="Search"/></label></div>
			{#if actionMessage}<div class:success={actionTone === "success"} class:error={actionTone === "error"} class="notice">{actionMessage}</div>{/if}
			{#if activeTab === "users"}
				<div class="metrics"><div><span>Total users</span><strong>{users.length}</strong></div><div><span>Active sessions</span><strong>{users.reduce((sum, user) => sum + Number(user.active_session_count ?? 0), 0)}</strong></div><div><span>Disabled</span><strong>{disabledCount}</strong></div></div>
				<div class="table-wrap"><table><thead><tr><th>User</th><th>Location / IP</th><th>Security</th><th>Registered</th><th>Activity</th><th></th></tr></thead><tbody>{#if loading}<tr><td colspan="6">Loading users...</td></tr>{:else}{#each visibleUsers as user}<tr><td><button class="user-cell" onclick={() => selectUser(user)}>{#if user.avatar_url}<img src={user.avatar_url} alt=""/>{:else}<span>{initials(user)}</span>{/if}<div><strong>{user.display_name || user.username}</strong><small>@{user.username}<br/>{user.email}</small></div></button></td><td><strong>{countryFlag(user.display_region_code)} {user.display_region || "Unknown"}</strong><small>{user.last_seen_ip || user.registration_ip || "IP not recorded"}</small></td><td><div class="badges"><i>{user.role}</i>{#if user.email_verified_at}<i>verified</i>{/if}{#if user.totp_enabled}<i>2FA</i>{/if}{#if user.disabled_at}<i class="danger">disabled</i>{/if}</div></td><td>{formatTime(user.created_at)}</td><td><strong>{user.comment_count ?? 0} comments</strong><small>{user.active_session_count ?? 0} active sessions</small></td><td><button class="icon-button" title="View user" onclick={() => selectUser(user)}><Icon icon="material-symbols:chevron-right-rounded"/></button></td></tr>{/each}{/if}</tbody></table></div>
			{:else}
				<form class="filter" onsubmit={(event) => { event.preventDefault(); loadComments(); }}><input class="field" bind:value={postSlugFilter} placeholder="Filter by post slug"/><button class="secondary" type="submit">Apply filter</button></form>
				<div class="comment-list">{#if loading}<p>Loading comments...</p>{:else}{#each visibleComments as comment}<article><div class="comment-meta"><strong>{comment.display_name || comment.username}</strong><span>{comment.email}</span><i>{comment.status}</i><time>{formatTime(comment.created_at)}</time></div><p>{comment.content}</p><footer><span><Icon icon="material-symbols:article-outline-rounded"/>{comment.post_slug}</span><span><Icon icon="material-symbols:location-on-outline-rounded"/>{comment.created_ip || "IP not recorded"}</span><button class={comment.deleted_at ? "secondary" : "danger-button"} onclick={() => commentAction(comment, comment.deleted_at ? "restore" : "delete")}>{comment.deleted_at ? "Restore" : "Delete"}</button></footer></article>{/each}{/if}</div>
			{/if}
		</section>
	</div>
	{#if selectedUser}<div class="drawer-backdrop" role="presentation" onclick={() => selectedUser = null}></div><aside class="drawer"><div class="drawer-head"><div><p class="eyebrow">USER RECORD</p><h2>{selectedUser.display_name || selectedUser.username}</h2></div><button class="icon-button" title="Close" onclick={() => selectedUser = null}><Icon icon="material-symbols:close-rounded"/></button></div><div class="drawer-body"><section><h3>Identity</h3><dl><div><dt>Email</dt><dd>{selectedUser.email}</dd></div><div><dt>Username</dt><dd>@{selectedUser.username}</dd></div><div><dt>Account ID</dt><dd>{selectedUser.id}</dd></div><div><dt>Bio</dt><dd>{selectedUser.bio || "Not provided"}</dd></div></dl></section><section><h3>Security and consent</h3><dl><div><dt>Password</dt><dd>{selectedUser.has_password ? "Configured" : "Email code only"}</dd></div><div><dt>2FA</dt><dd>{selectedUser.totp_enabled ? "Enabled" : "Not enabled"}</dd></div><div><dt>TOS</dt><dd>{selectedUser.tos_version || "Not recorded"} / {formatTime(selectedUser.tos_accepted_at)}</dd></div></dl></section><section><h3>Network audit</h3><dl><div><dt>Registration IP</dt><dd>{selectedUser.registration_ip || "Not recorded"}</dd></div><div><dt>Last IP</dt><dd>{selectedUser.last_seen_ip || "Not recorded"}</dd></div><div><dt>Last seen</dt><dd>{formatTime(selectedUser.last_seen_at)}</dd></div><div><dt>User agent</dt><dd class="break">{selectedUser.last_user_agent || "Not recorded"}</dd></div></dl></section><section><h3>Recent comments ({selectedUserComments.length})</h3>{#each selectedUserComments as comment}<div class="mini-comment"><strong>{comment.post_slug}</strong><p>{comment.content}</p><small>{formatTime(comment.created_at)} / {comment.created_ip || "IP not recorded"}</small></div>{/each}</section></div><div class="drawer-actions"><button class="secondary" onclick={() => setRole(selectedUser!, selectedUser!.role === "admin" ? "user" : "admin")}>{selectedUser.role === "admin" ? "Set as user" : "Set as admin"}</button><button class="danger-button" onclick={() => userAction(selectedUser!, selectedUser!.disabled_at ? "enable" : "disable")}>{selectedUser.disabled_at ? "Enable account" : "Disable account"}</button></div></aside>{/if}
{/if}
</main>

<style>
:global(body){margin:0;background:#edf3f8;color:#182230}.admin-shell{min-height:100vh;font-family:Roboto,Arial,sans-serif}.wordmark{display:flex;align-items:center;gap:.6rem;color:#182230;font-weight:700;text-decoration:none}.wordmark span{display:grid;width:2rem;height:2rem;place-items:center;border-radius:6px;background:#55a7ed;color:white}.wordmark b{color:#718096;font-weight:500}.login-wrap{display:grid;min-height:100vh;place-items:center;padding:1.5rem}.login-panel{display:grid;width:min(58rem,100%);overflow:hidden;border:1px solid #dce5ed;border-radius:8px;background:white;box-shadow:0 18px 50px rgba(33,56,79,.12);grid-template-columns:1fr 24rem}.login-panel>.wordmark{grid-column:1/-1;padding:1.5rem 2rem;border-bottom:1px solid #e5ebf0}.login-copy{padding:4rem 3rem;background:#f7fafc}.login-copy h1,.page-head h1{margin:.35rem 0;font-size:2rem;letter-spacing:0}.login-copy p{color:#607080;line-height:1.7}.eyebrow{margin:0;color:#438fd0;font-size:.72rem;font-weight:800;letter-spacing:0}.login-form{padding:3rem 2rem}.login-icon{font-size:2rem;color:#4b9fe8}.login-form h2{margin:.8rem 0 .4rem;font-size:1.25rem}.login-form>p{color:#607080;line-height:1.6}.mode-tabs{display:grid;grid-template-columns:1fr 1fr;margin-bottom:2rem;padding:3px;border-radius:7px;background:#edf3f8}.mode-tabs button{min-height:2.5rem;border:0;border-radius:5px;background:transparent}.mode-tabs button.active{background:white;box-shadow:0 1px 4px #ccd7e0}.primary,.secondary,.danger-button{display:inline-flex;min-height:2.7rem;align-items:center;justify-content:center;gap:.5rem;border:1px solid transparent;border-radius:6px;padding:0 1rem;font-weight:700;cursor:pointer}.primary{width:100%;margin-top:1rem;background:#4b9fe8;color:white}.secondary{border-color:#cfdbe5;background:white;color:#304356}.danger-button{background:#fff1f1;color:#b63b3b;border-color:#f1caca}.field{box-sizing:border-box;width:100%;min-height:2.75rem;border:1px solid #cfdbe5;border-radius:6px;padding:0 .8rem;background:white}.notice{margin-top:1rem;padding:.75rem;border:1px solid #d8e2ea;border-radius:6px;background:#f7fafc;color:#526575;font-size:.88rem}.notice.error{border-color:#f0caca;background:#fff1f1;color:#a73333}.notice.warning{border-color:#eed9a8;background:#fff9e9;color:#855d13}.notice.success{border-color:#bde3cf;background:#effaf4;color:#237047}header{display:flex;height:4.25rem;align-items:center;justify-content:space-between;border-bottom:1px solid #dce5ed;background:white;padding:0 2rem}.header-actions{display:flex;gap:.5rem}.icon-button{display:inline-grid;width:2.5rem;height:2.5rem;place-items:center;border:1px solid #d6e0e8;border-radius:6px;background:white;color:#526575;font-size:1.25rem;cursor:pointer}.workspace{display:grid;min-height:calc(100vh - 4.25rem);grid-template-columns:14rem 1fr}aside{border-right:1px solid #dce5ed;background:#f7fafc;padding:1.5rem 1rem}.nav-label{padding:0 .75rem;color:#8391a0;font-size:.7rem;font-weight:800;text-transform:uppercase}.workspace aside button{display:flex;width:100%;min-height:2.8rem;align-items:center;gap:.65rem;border:0;border-radius:6px;padding:0 .75rem;background:transparent;color:#526575;font-weight:700;cursor:pointer}.workspace aside button.active{background:#e5f2fd;color:#287dbf}.workspace aside button span{margin-left:auto;font-size:.78rem}.storage{display:flex;gap:.65rem;margin-top:2rem;padding:1rem .75rem;border-top:1px solid #dce5ed}.storage i{width:.55rem;height:.55rem;margin-top:.25rem;border-radius:50%;background:#d95c5c}.storage i.ok{background:#40a66b}.storage strong,.storage small{display:block}.storage strong{font-size:.8rem}.storage small{margin-top:.25rem;color:#8391a0;font-size:.72rem}.content{min-width:0;padding:2rem}.page-head{display:flex;align-items:end;justify-content:space-between;gap:1rem;margin-bottom:1.5rem}.search{display:flex;width:min(22rem,100%);height:2.75rem;align-items:center;gap:.5rem;border:1px solid #d4dfe8;border-radius:6px;background:white;padding:0 .8rem;color:#8391a0}.search input{width:100%;border:0;outline:0}.metrics{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid #dce5ed;border-radius:8px;background:white;margin-bottom:1rem}.metrics div{padding:1rem 1.25rem;border-right:1px solid #e3eaf0}.metrics div:last-child{border:0}.metrics span,.metrics strong{display:block}.metrics span{color:#718096;font-size:.78rem}.metrics strong{margin-top:.35rem;font-size:1.45rem}.table-wrap{overflow:auto;border:1px solid #dce5ed;border-radius:8px;background:white}table{width:100%;border-collapse:collapse;white-space:nowrap}th,td{padding:.9rem 1rem;border-bottom:1px solid #e7edf2;text-align:left;font-size:.82rem}th{background:#f8fafc;color:#718096;font-size:.7rem;text-transform:uppercase}td>small,td>strong{display:block}td>small{margin-top:.25rem;color:#7a8997}.user-cell{display:flex;align-items:center;gap:.7rem;border:0;background:transparent;text-align:left;cursor:pointer}.user-cell>span,.user-cell img{width:2.3rem;height:2.3rem;border-radius:50%;object-fit:cover}.user-cell>span{display:grid;place-items:center;background:#dcedfb;color:#287dbf;font-weight:800}.user-cell strong,.user-cell small{display:block}.user-cell small{margin-top:.15rem;color:#718096}.badges{display:flex;gap:.3rem}.badges i{border-radius:4px;background:#e9f4fd;color:#287dbf;padding:.2rem .4rem;font-size:.66rem;font-style:normal}.badges i.danger{background:#fff0f0;color:#b53b3b}.filter{display:flex;max-width:34rem;gap:.6rem;margin-bottom:1rem}.comment-list{display:grid;gap:.75rem}.comment-list article{border:1px solid #dce5ed;border-radius:8px;background:white;padding:1.15rem}.comment-meta{display:flex;flex-wrap:wrap;align-items:center;gap:.6rem}.comment-meta span,.comment-meta time{color:#718096;font-size:.78rem}.comment-meta i{border-radius:4px;background:#edf5fb;color:#287dbf;padding:.2rem .4rem;font-size:.7rem;font-style:normal}.comment-list article>p{line-height:1.65;white-space:pre-wrap}.comment-list footer{display:flex;align-items:center;gap:1rem;border-top:1px solid #e7edf2;padding-top:.8rem;color:#718096;font-size:.78rem}.comment-list footer span{display:flex;align-items:center;gap:.3rem}.comment-list footer button{margin-left:auto}.drawer-backdrop{position:fixed;inset:0;background:rgba(25,36,48,.35)}.drawer{position:fixed;z-index:2;top:0;right:0;box-sizing:border-box;width:min(34rem,100%);height:100vh;overflow:auto;border:0;border-left:1px solid #dce5ed;background:white;padding:0}.drawer-head{position:sticky;top:0;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e1e8ee;background:white;padding:1.25rem 1.5rem}.drawer-head h2{margin:.3rem 0 0}.drawer-body{display:grid;gap:1.5rem;padding:1.5rem}.drawer-body section{border-bottom:1px solid #e5ebf0;padding-bottom:1.2rem}.drawer-body h3{font-size:.9rem}dl{margin:0}dl div{display:grid;grid-template-columns:8rem 1fr;gap:1rem;padding:.55rem 0}dt{color:#718096;font-size:.78rem}dd{margin:0;font-size:.82rem}.break{overflow-wrap:anywhere}.mini-comment{margin-top:.7rem;border-left:3px solid #b7d9f5;padding:.2rem 0 .2rem .8rem}.mini-comment p{margin:.3rem 0;font-size:.82rem}.mini-comment small{color:#718096}.drawer-actions{position:sticky;bottom:0;display:flex;justify-content:flex-end;gap:.6rem;border-top:1px solid #e1e8ee;background:white;padding:1rem 1.5rem}
@media(max-width:800px){.login-panel{grid-template-columns:1fr}.login-panel>.wordmark{padding:1.2rem}.login-copy{padding:2rem 1.5rem}.login-form{padding:2rem 1.5rem}.workspace{grid-template-columns:1fr}.workspace>aside{display:flex;position:sticky;top:0;z-index:1;border-right:0;border-bottom:1px solid #dce5ed;padding:.5rem}.workspace>aside .nav-label,.storage{display:none}.workspace>aside button{justify-content:center}.content{padding:1rem}.page-head{align-items:stretch;flex-direction:column}.metrics{grid-template-columns:1fr 1fr}.metrics div:last-child{grid-column:1/-1;border-top:1px solid #e3eaf0}.comment-list footer{align-items:flex-start;flex-direction:column}.comment-list footer button{margin-left:0;width:100%}header{padding:0 1rem}}
.admin-shell,.login-wrap{background:#edf3f8;color:#182230}
.login-wrap{box-sizing:border-box;padding:clamp(1rem,4vw,4rem)}
.login-panel{width:min(70rem,100%);min-height:min(44rem,calc(100vh - 8rem));grid-template-columns:minmax(0,1.08fr) minmax(25rem,.92fr);box-shadow:0 24px 70px rgba(47,72,96,.14)}
.login-panel>.wordmark{padding:1.25rem 2.25rem}
.login-copy{display:flex;flex-direction:column;justify-content:space-between;padding:clamp(2.5rem,5vw,5.5rem);background:#e8f3fc}
.login-copy h1{max-width:30rem;margin:.7rem 0 1.1rem;font-size:clamp(2.35rem,4vw,4.2rem);line-height:1.05}
.login-copy>div>p:last-child{max-width:32rem;color:#536b7f;font-size:1rem;line-height:1.75}
.login-features{display:grid;gap:1rem;margin-top:3rem}
.login-features>div{display:flex;align-items:center;gap:.9rem;border-top:1px solid #c8deef;padding-top:1rem;color:#347fb8}
.login-features svg{flex:0 0 auto;font-size:1.55rem}
.login-features span,.login-features strong,.login-features small{display:block}
.login-features strong{color:#263c4e;font-size:.86rem}
.login-features small{margin-top:.25rem;color:#667c8e;font-size:.76rem}
.login-form{display:flex;flex-direction:column;justify-content:center;padding:clamp(2rem,4vw,4rem)}
.login-form .mode-tabs{order:-1;margin-bottom:2.5rem}
.login-icon-wrap{display:grid;width:3.25rem;height:3.25rem;margin-top:1rem;place-items:center;border-radius:8px;background:#e7f3fd}
.login-icon{font-size:1.7rem}
.login-form h2{font-size:1.45rem}
.login-form .primary{min-height:3rem}
.workspace,.content{background:#edf3f8}
@media(max-width:800px){.login-wrap{align-items:start;padding:0}.login-panel{min-height:100vh;border:0;border-radius:0;grid-template-columns:1fr}.login-panel>.wordmark{padding:1rem 1.25rem}.login-copy{padding:2.25rem 1.5rem}.login-copy h1{font-size:2.35rem}.login-copy>div>p:last-child{font-size:.9rem}.login-features{display:none}.login-form{padding:2rem 1.5rem 3rem}.workspace>aside button{flex:1;width:auto;min-height:3.5rem}}
</style>
