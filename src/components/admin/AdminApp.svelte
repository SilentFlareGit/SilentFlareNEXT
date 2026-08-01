<script lang="ts">
import Icon from "@iconify/svelte";
import { onDestroy, onMount } from "svelte";
import { fade, slide } from "svelte/transition";
import ShieldDashboard from "./ShieldDashboard.svelte";
import SiteEditor from "./SiteEditor.svelte";

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
	deletion_requested_at?: string;
	deletion_review_status?: string;
	deletion_approved_at?: string;
	deletion_scheduled_for?: string;
	has_password?: number;
	comment_count?: number;
	active_session_count?: number;
	latest_comment_at?: string;
	profile_public?: number;
	show_region?: number;
	show_comments?: number;
	allow_search?: number;
	security_email?: number;
	comment_replies?: number;
};
type AccountSession = {
	id: string;
	device: string;
	platform: string;
	region: string;
	lastActiveAt: string;
	createdAt: string;
	expiresAt: string;
	current: boolean;
};
type AccountPreferences = {
	privacy: {
		profilePublic: boolean;
		showRegion: boolean;
		showComments: boolean;
		allowSearch: boolean;
		allowDataExport: boolean;
	};
	notifications: {
		securityEmail: boolean;
		commentReplies: boolean;
		systemEmail: boolean;
		marketingEmail: boolean;
	};
};
type SecurityEvent = {
	event_type: string;
	detail: string;
	created_at: string;
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
	parent_id?: string | null;
	root_id?: string | null;
	last_moderation_action?: string;
	last_moderation_reason?: string;
	revision_count?: number;
};
type AdminStatus = {
	d1_configured?: boolean;
	storage?: string;
	totp_enabled?: boolean;
};
type AdminTab = "users" | "comments" | "shield" | "site";
type ShieldView = "subjects" | "factors" | "geography" | "sites";

let {
	apiBase,
	fallbackAssets,
}: {
	apiBase: string;
	fallbackAssets: { avatar: string; banner: string };
} = $props();
const ADMIN_BOT_ID = "SilentFlare Admin";
const apiOrigin = $derived(apiBase.replace(/\/$/, ""));
let authenticated = $state(false);
let checkingSession = $state(true);
let csrf = $state(
	typeof sessionStorage === "undefined"
		? ""
		: (sessionStorage.getItem("silentflare_admin_csrf") ?? ""),
);
let status = $state<AdminStatus | null>(null);
let activeTab = $state<AdminTab>("users");
let shieldView = $state<ShieldView>("subjects");
let shieldRefreshKey = $state(0);
let navigationOpen = $state(false);
let membersExpanded = $state(true);
let protectionExpanded = $state(true);
let publishingExpanded = $state(true);
let users = $state<UserRow[]>([]);
let comments = $state<CommentRow[]>([]);
let selectedUser = $state<UserRow | null>(null);
let selectedUserComments = $state<CommentRow[]>([]);
let selectedUserSessions = $state<AccountSession[]>([]);
let selectedUserPreferences = $state<AccountPreferences | null>(null);
let selectedUserSecurityEvents = $state<SecurityEvent[]>([]);
let search = $state("");
let postSlugFilter = $state("");
let commentStatusFilter = $state<"all" | "published" | "deleted">("all");
let commentTotal = $state(0);
let commentNextCursor = $state<string | null>(null);
let loadingMoreComments = $state(false);
let moderationTarget = $state<CommentRow | null>(null);
let moderationAction = $state<"delete" | "restore">("delete");
let moderationReason = $state("");
let moderating = $state(false);
let loading = $state(false);
let actionMessage = $state("");
let sessionCheckTimer: number | undefined;
let actionTone = $state<"neutral" | "error" | "success">("neutral");

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
const pageMeta = $derived.by(() => {
	if (activeTab === "users")
		return {
			eyebrow: "MEMBERS",
			title: "Users",
			icon: "material-symbols:group-outline-rounded",
		};
	if (activeTab === "comments")
		return {
			eyebrow: "MEMBERS",
			title: "Comments",
			icon: "material-symbols:forum-outline-rounded",
		};
	if (activeTab === "site")
		return {
			eyebrow: "PUBLISHING",
			title: "Blog appearance",
			icon: "material-symbols:format-paint-outline-rounded",
		};
	const shieldPages: Record<ShieldView, { title: string; icon: string }> = {
		subjects: {
			title: "Subjects",
			icon: "material-symbols:person-search-outline-rounded",
		},
		factors: { title: "Risk factors", icon: "material-symbols:tune-rounded" },
		geography: {
			title: "Geography",
			icon: "material-symbols:public-off-outline-rounded",
		},
		sites: {
			title: "Protected sites",
			icon: "material-symbols:domain-verification-outline-rounded",
		},
	};
	return { eyebrow: "PROTECTION", ...shieldPages[shieldView] };
});

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
		if (response.status === 401 || body.detail === "Web login is disabled")
			redirectToAuth();
		throw new Error(body.detail ?? `API ${response.status}`);
	}
	return body as T;
}
function redirectToAuth() {
	if (typeof window === "undefined") return;
	const destination = window.location.href;
	const authOrigin = window.location.hostname.endsWith("silentflare.com")
		? "https://auth.silentflare.com/"
		: `${window.location.origin}/auth/`;
	window.location.replace(
		`${authOrigin}?audience=admin&return_url=${encodeURIComponent(destination)}`,
	);
}
async function enterAdmin(nextCsrf: string) {
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
		redirectToAuth();
	} finally {
		checkingSession = false;
	}
}
async function verifyAdminSession() {
	if (!authenticated || document.visibilityState === "hidden") return;
	try {
		const session = await api<{ bot: { id: string } }>("/auth/me");
		if (session.bot?.id !== ADMIN_BOT_ID)
			throw new Error("Invalid Admin session");
	} catch {
		authenticated = false;
		csrf = "";
		sessionStorage.removeItem("silentflare_admin_csrf");
		redirectToAuth();
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
async function loadComments(append = false) {
	if (append) loadingMoreComments = true;
	else loading = true;
	const params = new URLSearchParams({
		status: commentStatusFilter,
		limit: "50",
	});
	if (postSlugFilter.trim()) {
		params.set("post_slug", postSlugFilter.trim());
	}
	if (append && commentNextCursor) {
		params.set("cursor", commentNextCursor);
	}
	try {
		const data = await api<{
			comments: CommentRow[];
			totalCount?: number;
			nextCursor?: string | null;
		}>(`/admin/comments?${params}`);
		comments = append
			? [...comments, ...(data.comments ?? [])]
			: (data.comments ?? []);
		commentTotal = data.totalCount ?? comments.length;
		commentNextCursor = data.nextCursor ?? null;
	} catch (error) {
		showError(error);
	} finally {
		if (append) loadingMoreComments = false;
		else loading = false;
	}
}
async function selectUser(user: UserRow) {
	selectedUser = user;
	try {
		const data = await api<{
			user: UserRow;
			comments: CommentRow[];
			sessions: AccountSession[];
			preferences: AccountPreferences;
			securityEvents: SecurityEvent[];
		}>(`/admin/users/${encodeURIComponent(user.id)}`);
		selectedUser = data.user;
		selectedUserComments = data.comments ?? [];
		selectedUserSessions = data.sessions ?? [];
		selectedUserPreferences = data.preferences ?? null;
		selectedUserSecurityEvents = data.securityEvents ?? [];
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
async function deletionReview(user: UserRow, action: "approve" | "reject") {
	try {
		await api(
			`/admin/users/${encodeURIComponent(user.id)}/deletion/${action}`,
			{
				method: "POST",
				csrf: true,
				body: "{}",
			},
		);
		actionMessage = `Deletion request ${action === "approve" ? "approved" : "rejected"}.`;
		actionTone = "success";
		await loadUsers();
		await selectUser(user);
	} catch (error) {
		showError(error);
	}
}
function requestCommentAction(
	comment: CommentRow,
	action: "delete" | "restore",
) {
	moderationTarget = comment;
	moderationAction = action;
	moderationReason = "";
}
async function submitCommentAction() {
	if (!moderationTarget || !moderationReason.trim() || moderating) return;
	moderating = true;
	try {
		await api(
			`/admin/comments/${encodeURIComponent(moderationTarget.id)}/${moderationAction}`,
			{
				method: "POST",
				csrf: true,
				body: JSON.stringify({ reason: moderationReason.trim() }),
			},
		);
		actionMessage = `Comment ${moderationAction}d.`;
		actionTone = "success";
		await loadComments();
		moderationTarget = null;
	} catch (error) {
		showError(error);
	} finally {
		moderating = false;
	}
}
async function logout() {
	try {
		await api("/auth/logout", { method: "POST", csrf: true });
	} catch {}
	csrf = "";
	sessionStorage.removeItem("silentflare_admin_csrf");
	authenticated = false;
	redirectToAuth();
}
async function switchTab(tab: AdminTab, nextShieldView?: ShieldView) {
	activeTab = tab;
	if (nextShieldView) shieldView = nextShieldView;
	navigationOpen = false;
	search = "";
	if (tab === "users") await loadUsers();
	else if (tab === "comments") await loadComments();
}
async function refreshActiveView() {
	if (activeTab === "users") await loadUsers();
	else if (activeTab === "comments") await loadComments();
	else if (activeTab === "shield") shieldRefreshKey += 1;
	else window.location.reload();
}
onMount(() => {
	void checkExistingSession();
	sessionCheckTimer = window.setInterval(
		() => void verifyAdminSession(),
		15_000,
	);
	const handleVisibility = () => void verifyAdminSession();
	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === "Escape") navigationOpen = false;
	};
	document.addEventListener("visibilitychange", handleVisibility);
	document.addEventListener("keydown", handleKeydown);
	return () => {
		document.removeEventListener("visibilitychange", handleVisibility);
		document.removeEventListener("keydown", handleKeydown);
	};
});
onDestroy(() => {
	if (sessionCheckTimer) window.clearInterval(sessionCheckTimer);
});
</script>

<main class="sf-app admin-stage">
{#if checkingSession || !authenticated}
	<section class="session-check"><span></span><p>Opening the secure Admin workspace...</p></section>
{:else}
	<section class="admin-frame">
		{#if navigationOpen}<button class="navigation-backdrop" aria-label="Close navigation" onclick={() => navigationOpen = false}></button>{/if}
		<aside class:open={navigationOpen} class="admin-sidebar" aria-label="Admin navigation">
			<div class="sidebar-brand"><a class="wordmark" href="https://blog.silentflare.com/"><span>S</span><span>SilentFlare <b>Admin</b></span></a><button class="sidebar-close icon-button" aria-label="Close navigation" title="Close navigation" onclick={() => navigationOpen = false}><Icon icon="material-symbols:close-rounded"/></button></div>
			<nav>
				<section class="nav-group">
					<button class="nav-group-toggle" aria-expanded={membersExpanded} onclick={() => membersExpanded = !membersExpanded}><Icon icon="material-symbols:badge-outline-rounded"/><span>Members</span><Icon class="group-chevron" icon="material-symbols:expand-more-rounded"/></button>
					{#if membersExpanded}<div class="nav-children" transition:slide={{ duration: 160 }}><button class:active={activeTab === "users"} onclick={() => switchTab("users")}><Icon icon="material-symbols:group-outline-rounded"/><span>Users</span><i>{users.length}</i></button><button class:active={activeTab === "comments"} onclick={() => switchTab("comments")}><Icon icon="material-symbols:forum-outline-rounded"/><span>Comments</span></button></div>{/if}
				</section>
				<section class="nav-group">
					<button class="nav-group-toggle" aria-expanded={protectionExpanded} onclick={() => protectionExpanded = !protectionExpanded}><Icon icon="material-symbols:shield-outline-rounded"/><span>Protection</span><Icon class="group-chevron" icon="material-symbols:expand-more-rounded"/></button>
					{#if protectionExpanded}<div class="nav-children" transition:slide={{ duration: 160 }}><button class:active={activeTab === "shield" && shieldView === "subjects"} onclick={() => switchTab("shield", "subjects")}><Icon icon="material-symbols:person-search-outline-rounded"/><span>Subjects</span></button><button class:active={activeTab === "shield" && shieldView === "factors"} onclick={() => switchTab("shield", "factors")}><Icon icon="material-symbols:tune-rounded"/><span>Risk factors</span></button><button class:active={activeTab === "shield" && shieldView === "geography"} onclick={() => switchTab("shield", "geography")}><Icon icon="material-symbols:public-off-outline-rounded"/><span>Geography</span></button><button class:active={activeTab === "shield" && shieldView === "sites"} onclick={() => switchTab("shield", "sites")}><Icon icon="material-symbols:domain-verification-outline-rounded"/><span>Protected sites</span></button></div>{/if}
				</section>
				<section class="nav-group">
					<button class="nav-group-toggle" aria-expanded={publishingExpanded} onclick={() => publishingExpanded = !publishingExpanded}><Icon icon="material-symbols:edit-square-outline-rounded"/><span>Publishing</span><Icon class="group-chevron" icon="material-symbols:expand-more-rounded"/></button>
					{#if publishingExpanded}<div class="nav-children" transition:slide={{ duration: 160 }}><button class:active={activeTab === "site"} onclick={() => switchTab("site")}><Icon icon="material-symbols:format-paint-outline-rounded"/><span>Blog appearance</span></button></div>{/if}
				</section>
			</nav>
			<div class="sidebar-footer"><div class="storage"><i class:ok={status?.d1_configured}></i><div><strong>Account database</strong><small>{status?.d1_configured ? "Connected on FNS1" : "Unavailable"}</small></div></div><button class="sidebar-signout" onclick={logout}><Icon icon="material-symbols:logout-rounded"/><span>Sign out</span></button></div>
		</aside>
		<section class="workspace-pane">
			<header class="workspace-header"><button class="menu-button icon-button" aria-label="Open navigation" title="Open navigation" onclick={() => navigationOpen = true}><Icon icon="material-symbols:menu-rounded"/></button><span class="page-icon"><Icon icon={pageMeta.icon}/></span><div class="workspace-title"><p>{pageMeta.eyebrow}</p><h1>{pageMeta.title}</h1></div><div class="header-actions">{#if activeTab === "users" || activeTab === "comments"}<label class="search"><Icon icon="material-symbols:search-rounded"/><input bind:value={search} aria-label={`Search ${pageMeta.title.toLowerCase()}`} placeholder={`Search ${pageMeta.title.toLowerCase()}`}/></label>{/if}<button class="icon-button" title="Refresh" aria-label="Refresh current workspace" onclick={refreshActiveView}><Icon icon="material-symbols:refresh-rounded"/></button></div></header>
			<div class="content-scroll"><section class="content">
			{#if actionMessage}<div class:success={actionTone === "success"} class:error={actionTone === "error"} class="notice">{actionMessage}</div>{/if}
			{#key activeTab === "shield" ? `shield-${shieldView}-${shieldRefreshKey}` : activeTab}<div class="view-transition" in:fade={{ duration: 180 }}>
			{#if activeTab === "users"}
				<div class="metrics"><div><span>Total users</span><strong>{users.length}</strong></div><div><span>Active sessions</span><strong>{users.reduce((sum, user) => sum + Number(user.active_session_count ?? 0), 0)}</strong></div><div><span>Disabled</span><strong>{disabledCount}</strong></div></div>
				<div class="table-wrap"><table><thead><tr><th>User</th><th>Location / IP</th><th>Security</th><th>Registered</th><th>Activity</th><th></th></tr></thead><tbody>{#if loading}<tr><td colspan="6">Loading users...</td></tr>{:else}{#each visibleUsers as user}<tr><td><button class="user-cell" onclick={() => selectUser(user)}>{#if user.avatar_url}<img src={user.avatar_url} alt=""/>{:else}<span>{initials(user)}</span>{/if}<div><strong>{user.display_name || user.username}</strong><small>@{user.username}<br/>{user.email}</small></div></button></td><td><strong>{countryFlag(user.display_region_code)} {user.display_region || "Unknown"}</strong><small>{user.last_seen_ip || user.registration_ip || "IP not recorded"}</small></td><td><div class="badges"><i>{user.role}</i>{#if user.email_verified_at}<i>verified</i>{/if}{#if user.totp_enabled}<i>2FA</i>{/if}{#if user.profile_public === 0}<i>private</i>{/if}{#if user.security_email === 0}<i>no security mail</i>{/if}{#if user.deletion_review_status}<i class="danger">deletion {user.deletion_review_status}</i>{/if}{#if user.disabled_at}<i class="danger">disabled</i>{/if}</div></td><td>{formatTime(user.created_at)}</td><td><strong>{user.comment_count ?? 0} comments</strong><small>{user.active_session_count ?? 0} active sessions</small></td><td><button class="icon-button" title="View user" onclick={() => selectUser(user)}><Icon icon="material-symbols:chevron-right-rounded"/></button></td></tr>{/each}{/if}</tbody></table></div>
			{:else if activeTab === "comments"}
				<form class="filter comment-filter" onsubmit={(event) => { event.preventDefault(); loadComments(); }}>
					<input class="field" bind:value={postSlugFilter} placeholder="Filter by post slug"/>
					<select class="field" bind:value={commentStatusFilter} aria-label="Comment status">
						<option value="all">All statuses</option>
						<option value="published">Published</option>
						<option value="deleted">Deleted</option>
					</select>
					<button class="secondary" type="submit">Apply filter</button>
				</form>
				<p class="result-count">{commentTotal} matching comments</p>
				<div class="comment-list">
					{#if loading}
						<p>Loading comments...</p>
					{:else}
						{#each visibleComments as comment}
							<article>
								<div class="comment-meta"><strong>{comment.display_name || comment.username}</strong><span>{comment.email}</span><i>{comment.status}</i>{#if comment.parent_id}<i>reply</i>{/if}<time>{formatTime(comment.created_at)}</time></div>
								<p>{comment.content}</p>
								{#if comment.last_moderation_reason}<small class="moderation-note"><strong>{comment.last_moderation_action}</strong> · {comment.last_moderation_reason}</small>{/if}
								<footer><span><Icon icon="material-symbols:article-outline-rounded"/>{comment.post_slug}</span><span><Icon icon="material-symbols:history-rounded"/>{comment.revision_count ?? 0} revisions</span><span><Icon icon="material-symbols:location-on-outline-rounded"/>{comment.created_ip || "IP not recorded"}</span><button class={comment.deleted_at ? "secondary" : "danger-button"} onclick={() => requestCommentAction(comment, comment.deleted_at ? "restore" : "delete")}>{comment.deleted_at ? "Restore" : "Delete"}</button></footer>
							</article>
						{/each}
					{/if}
				</div>
				{#if commentNextCursor}<div class="load-more"><button class="secondary" disabled={loadingMoreComments} onclick={() => loadComments(true)}>{loadingMoreComments ? "Loading..." : "Load more"}</button></div>{/if}
			{:else if activeTab === "shield"}
				<ShieldDashboard {csrf} bind:activeView={shieldView} embedded />
			{:else}
				<SiteEditor {apiOrigin} {csrf} {fallbackAssets} />
			{/if}
			</div>{/key}
			</section></div>
		</section>
	</section>
	{#if selectedUser}
		<div class="drawer-backdrop" role="presentation" onclick={() => selectedUser = null}></div>
		<aside class="drawer">
			<div class="drawer-head"><div><p class="eyebrow">USER RECORD</p><h2>{selectedUser.display_name || selectedUser.username}</h2></div><button class="icon-button" title="Close" onclick={() => selectedUser = null}><Icon icon="material-symbols:close-rounded"/></button></div>
			<div class="drawer-body">
				<section><h3>Identity</h3><dl><div><dt>Email</dt><dd>{selectedUser.email}</dd></div><div><dt>Username</dt><dd>@{selectedUser.username}</dd></div><div><dt>Account ID</dt><dd>{selectedUser.id}</dd></div><div><dt>Bio</dt><dd>{selectedUser.bio || "Not provided"}</dd></div></dl></section>
				<section><h3>Security and consent</h3><dl><div><dt>Password</dt><dd>{selectedUser.has_password ? "Configured" : "Email code only"}</dd></div><div><dt>2FA</dt><dd>{selectedUser.totp_enabled ? "Enabled" : "Not enabled"}</dd></div><div><dt>TOS</dt><dd>{selectedUser.tos_version || "Not recorded"} / {formatTime(selectedUser.tos_accepted_at)}</dd></div></dl></section>
				{#if selectedUser.deletion_review_status}<section class="deletion-review"><h3>Deletion request</h3><p>Status: <strong>{selectedUser.deletion_review_status}</strong></p><small>Requested {formatTime(selectedUser.deletion_requested_at)}{selectedUser.deletion_scheduled_for ? ` / scheduled ${formatTime(selectedUser.deletion_scheduled_for)}` : ""}</small>{#if selectedUser.deletion_review_status === "pending"}<div><button class="secondary" onclick={() => deletionReview(selectedUser!, "reject")}>Reject request</button><button class="danger-button" onclick={() => deletionReview(selectedUser!, "approve")}>Approve deletion</button></div>{/if}</section>{/if}
				<section><h3>Account Center</h3><div class="badges drawer-badges"><i>{selectedUserPreferences?.privacy.profilePublic ? "public profile" : "private profile"}</i><i>{selectedUserPreferences?.privacy.showRegion ? "region visible" : "region hidden"}</i><i>{selectedUserPreferences?.privacy.showComments ? "comments visible" : "comments hidden"}</i><i>{selectedUserPreferences?.privacy.allowSearch ? "searchable" : "not searchable"}</i><i>{selectedUserPreferences?.notifications.securityEmail ? "security mail on" : "security mail off"}</i><i>{selectedUserPreferences?.notifications.commentReplies ? "reply mail on" : "reply mail off"}</i></div></section>
				<section><h3>Active sessions ({selectedUserSessions.length})</h3>{#each selectedUserSessions as session}<div class="mini-comment"><strong>{session.device} on {session.platform}</strong><p>{session.region}</p><small>Last active {formatTime(session.lastActiveAt)} / expires {formatTime(session.expiresAt)}</small></div>{:else}<p class="drawer-empty">No active sessions.</p>{/each}</section>
				<section><h3>Security record ({selectedUserSecurityEvents.length})</h3>{#each selectedUserSecurityEvents as item}<div class="mini-comment"><strong>{item.event_type.replaceAll("_", " ")}</strong><p>{item.detail || "No detail recorded"}</p><small>{formatTime(item.created_at)}</small></div>{:else}<p class="drawer-empty">No recent security events.</p>{/each}</section>
				<section><h3>Network audit</h3><dl><div><dt>Registration IP</dt><dd>{selectedUser.registration_ip || "Not recorded"}</dd></div><div><dt>Last IP</dt><dd>{selectedUser.last_seen_ip || "Not recorded"}</dd></div><div><dt>Last seen</dt><dd>{formatTime(selectedUser.last_seen_at)}</dd></div><div><dt>User agent</dt><dd class="break">{selectedUser.last_user_agent || "Not recorded"}</dd></div></dl></section>
				<section><h3>Recent comments ({selectedUserComments.length})</h3>{#each selectedUserComments as comment}<div class="mini-comment"><strong>{comment.post_slug}</strong><p>{comment.content}</p><small>{formatTime(comment.created_at)} / {comment.created_ip || "IP not recorded"}</small></div>{/each}</section>
			</div>
			<div class="drawer-actions"><button class="secondary" onclick={() => setRole(selectedUser!, selectedUser!.role === "admin" ? "user" : "admin")}>{selectedUser.role === "admin" ? "Set as user" : "Set as admin"}</button><button class="danger-button" onclick={() => userAction(selectedUser!, selectedUser!.disabled_at ? "enable" : "disable")}>{selectedUser.disabled_at ? "Enable account" : "Disable account"}</button></div>
		</aside>
	{/if}
	{#if moderationTarget}
		<div class="modal-backdrop" role="presentation" onclick={() => { if (!moderating) moderationTarget = null; }}></div>
		<section class="moderation-modal" role="dialog" aria-modal="true" aria-labelledby="moderation-title">
			<div class="moderation-modal-head"><div><p class="eyebrow">COMMENT MODERATION</p><h2 id="moderation-title">{moderationAction === "delete" ? "Delete comment" : "Restore comment"}</h2></div><button class="icon-button" title="Close" disabled={moderating} onclick={() => moderationTarget = null}><Icon icon="material-symbols:close-rounded"/></button></div>
			<p class="moderation-preview">{moderationTarget.content}</p>
			<label><span>Reason</span><textarea class="field" bind:value={moderationReason} maxlength="300" placeholder="Record why this moderation action is needed"></textarea></label>
			<div class="moderation-actions"><button class="secondary" disabled={moderating} onclick={() => moderationTarget = null}>Cancel</button><button class={moderationAction === "delete" ? "danger-button" : "primary moderation-primary"} disabled={moderating || !moderationReason.trim()} onclick={submitCommentAction}>{moderating ? "Saving..." : moderationAction === "delete" ? "Delete comment" : "Restore comment"}</button></div>
		</section>
	{/if}
{/if}
</main>

<style>
:global(body){margin:0;background:#edf3f8;color:#182230}.admin-shell{min-height:100vh;overflow-x:hidden;font-family:Roboto,Arial,sans-serif}.wordmark{display:flex;align-items:center;gap:.6rem;color:#182230;font-weight:700;text-decoration:none}.wordmark span{display:grid;width:2rem;height:2rem;place-items:center;border-radius:6px;background:#55a7ed;color:white}.wordmark b{color:#718096;font-weight:500}.login-wrap{display:grid;min-height:100vh;place-items:center;padding:1.5rem}.login-panel{display:grid;width:min(58rem,100%);overflow:hidden;border:1px solid #dce5ed;border-radius:8px;background:white;box-shadow:0 18px 50px rgba(33,56,79,.12);grid-template-columns:1fr 24rem}.login-panel>.wordmark{grid-column:1/-1;padding:1.5rem 2rem;border-bottom:1px solid #e5ebf0}.login-copy{padding:4rem 3rem;background:#f7fafc}.login-copy h1,.page-head h1{margin:.35rem 0;font-size:2rem;letter-spacing:0}.login-copy p{color:#607080;line-height:1.7}.eyebrow{margin:0;color:#438fd0;font-size:.72rem;font-weight:800;letter-spacing:0}.login-form{padding:3rem 2rem}.login-icon{font-size:2rem;color:#4b9fe8}.login-form h2{margin:.8rem 0 .4rem;font-size:1.25rem}.login-form>p{color:#607080;line-height:1.6}.mode-tabs{display:grid;grid-template-columns:1fr 1fr;margin-bottom:2rem;padding:3px;border-radius:7px;background:#edf3f8}.mode-tabs button{min-height:2.5rem;border:0;border-radius:5px;background:transparent}.mode-tabs button.active{background:white;box-shadow:0 1px 4px #ccd7e0}.primary,.secondary,.danger-button{display:inline-flex;min-height:2.7rem;align-items:center;justify-content:center;gap:.5rem;border:1px solid transparent;border-radius:6px;padding:0 1rem;font-weight:700;cursor:pointer}.primary{width:100%;margin-top:1rem;background:#4b9fe8;color:white}.secondary{border-color:#cfdbe5;background:white;color:#304356}.danger-button{background:#fff1f1;color:#b63b3b;border-color:#f1caca}.field{box-sizing:border-box;width:100%;min-height:2.75rem;border:1px solid #cfdbe5;border-radius:6px;padding:0 .8rem;background:white}.notice{margin-top:1rem;padding:.75rem;border:1px solid #d8e2ea;border-radius:6px;background:#f7fafc;color:#526575;font-size:.88rem}.notice.error{border-color:#f0caca;background:#fff1f1;color:#a73333}.notice.warning{border-color:#eed9a8;background:#fff9e9;color:#855d13}.notice.success{border-color:#bde3cf;background:#effaf4;color:#237047}header{display:flex;height:4.25rem;align-items:center;justify-content:space-between;border-bottom:1px solid #dce5ed;background:white;padding:0 2rem}.header-actions{display:flex;gap:.5rem}.icon-button{display:inline-grid;width:2.5rem;height:2.5rem;place-items:center;border:1px solid #d6e0e8;border-radius:6px;background:white;color:#526575;font-size:1.25rem;cursor:pointer}.workspace{display:grid;min-height:calc(100vh - 4.25rem);grid-template-columns:14rem 1fr}aside{border-right:1px solid #dce5ed;background:#f7fafc;padding:1.5rem 1rem}.nav-label{padding:0 .75rem;color:#8391a0;font-size:.7rem;font-weight:800;text-transform:uppercase}.workspace aside button{display:flex;width:100%;min-height:2.8rem;align-items:center;gap:.65rem;border:0;border-radius:6px;padding:0 .75rem;background:transparent;color:#526575;font-weight:700;cursor:pointer}.workspace aside button.active{background:#e5f2fd;color:#287dbf}.workspace aside button span{margin-left:auto;font-size:.78rem}.storage{display:flex;gap:.65rem;margin-top:2rem;padding:1rem .75rem;border-top:1px solid #dce5ed}.storage i{width:.55rem;height:.55rem;margin-top:.25rem;border-radius:50%;background:#d95c5c}.storage i.ok{background:#40a66b}.storage strong,.storage small{display:block}.storage strong{font-size:.8rem}.storage small{margin-top:.25rem;color:#8391a0;font-size:.72rem}.content{min-width:0;padding:2rem}.page-head{display:flex;align-items:end;justify-content:space-between;gap:1rem;margin-bottom:1.5rem}.search{display:flex;width:min(22rem,100%);height:2.75rem;align-items:center;gap:.5rem;border:1px solid #d4dfe8;border-radius:6px;background:white;padding:0 .8rem;color:#8391a0}.search input{width:100%;border:0;outline:0}.metrics{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid #dce5ed;border-radius:8px;background:white;margin-bottom:1rem}.metrics div{padding:1rem 1.25rem;border-right:1px solid #e3eaf0}.metrics div:last-child{border:0}.metrics span,.metrics strong{display:block}.metrics span{color:#718096;font-size:.78rem}.metrics strong{margin-top:.35rem;font-size:1.45rem}.table-wrap{overflow:auto;border:1px solid #dce5ed;border-radius:8px;background:white}table{width:100%;border-collapse:collapse;white-space:nowrap}th,td{padding:.9rem 1rem;border-bottom:1px solid #e7edf2;text-align:left;font-size:.82rem}th{background:#f8fafc;color:#718096;font-size:.7rem;text-transform:uppercase}td>small,td>strong{display:block}td>small{margin-top:.25rem;color:#7a8997}.user-cell{display:flex;align-items:center;gap:.7rem;border:0;background:transparent;text-align:left;cursor:pointer}.user-cell>span,.user-cell img{width:2.3rem;height:2.3rem;border-radius:50%;object-fit:cover}.user-cell>span{display:grid;place-items:center;background:#dcedfb;color:#287dbf;font-weight:800}.user-cell strong,.user-cell small{display:block}.user-cell small{margin-top:.15rem;color:#718096}.badges{display:flex;gap:.3rem}.badges i{border-radius:4px;background:#e9f4fd;color:#287dbf;padding:.2rem .4rem;font-size:.66rem;font-style:normal}.badges i.danger{background:#fff0f0;color:#b53b3b}.filter{display:flex;max-width:34rem;gap:.6rem;margin-bottom:1rem}.comment-list{display:grid;gap:.75rem}.comment-list article{border:1px solid #dce5ed;border-radius:8px;background:white;padding:1.15rem}.comment-meta{display:flex;flex-wrap:wrap;align-items:center;gap:.6rem}.comment-meta span,.comment-meta time{color:#718096;font-size:.78rem}.comment-meta i{border-radius:4px;background:#edf5fb;color:#287dbf;padding:.2rem .4rem;font-size:.7rem;font-style:normal}.comment-list article>p{line-height:1.65;white-space:pre-wrap}.comment-list footer{display:flex;align-items:center;gap:1rem;border-top:1px solid #e7edf2;padding-top:.8rem;color:#718096;font-size:.78rem}.comment-list footer span{display:flex;align-items:center;gap:.3rem}.comment-list footer button{margin-left:auto}.comment-filter{max-width:48rem}.comment-filter select{max-width:12rem}.result-count{margin:-.35rem 0 1rem;color:#718096;font-size:.78rem}.moderation-note{display:block;margin:.8rem 0;color:#718096}.load-more{display:flex;justify-content:center;margin-top:1rem}.modal-backdrop{position:fixed;z-index:20;inset:0;background:rgba(25,36,48,.42)}.moderation-modal{position:fixed;z-index:21;top:50%;left:50%;box-sizing:border-box;width:min(32rem,calc(100% - 2rem));transform:translate(-50%,-50%);border:1px solid #dce5ed;border-radius:8px;background:white;padding:1.25rem;box-shadow:0 1.5rem 4rem rgba(25,36,48,.24)}.moderation-modal-head{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem}.moderation-modal-head h2{margin:.3rem 0}.moderation-preview{max-height:8rem;overflow:auto;border-left:3px solid #b7d9f5;padding-left:.8rem;white-space:pre-wrap;color:#526575}.moderation-modal label span{display:block;margin-bottom:.4rem;font-size:.78rem;font-weight:700}.moderation-modal textarea{min-height:7rem;padding:.7rem;resize:vertical;font:inherit}.moderation-actions{display:flex;justify-content:flex-end;gap:.6rem;margin-top:1rem}.moderation-primary{width:auto;margin:0}.drawer-backdrop{position:fixed;inset:0;background:rgba(25,36,48,.35)}.drawer{position:fixed;z-index:2;top:0;right:0;box-sizing:border-box;width:min(34rem,100%);height:100vh;overflow:auto;border:0;border-left:1px solid #dce5ed;background:white;padding:0}.drawer-head{position:sticky;top:0;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e1e8ee;background:white;padding:1.25rem 1.5rem}.drawer-head h2{margin:.3rem 0 0}.drawer-body{display:grid;gap:1.5rem;padding:1.5rem}.drawer-body section{border-bottom:1px solid #e5ebf0;padding-bottom:1.2rem}.drawer-body h3{font-size:.9rem}dl{margin:0}dl div{display:grid;grid-template-columns:8rem 1fr;gap:1rem;padding:.55rem 0}dt{color:#718096;font-size:.78rem}dd{margin:0;font-size:.82rem}.break{overflow-wrap:anywhere}.mini-comment{margin-top:.7rem;border-left:3px solid #b7d9f5;padding:.2rem 0 .2rem .8rem}.mini-comment p{margin:.3rem 0;font-size:.82rem}.mini-comment small{color:#718096}.drawer-actions{position:sticky;bottom:0;display:flex;justify-content:flex-end;gap:.6rem;border-top:1px solid #e1e8ee;background:white;padding:1rem 1.5rem}
	.drawer-badges{flex-wrap:wrap}.drawer-empty{color:#718096}
	.deletion-review{border:1px solid #f1caca!important;border-radius:8px;padding:1rem!important;background:#fff8f8}.deletion-review p{margin:.4rem 0}.deletion-review small{color:#718096}.deletion-review>div{display:flex;gap:.6rem;margin-top:1rem}
.workspace,.content{background:#edf3f8}
.session-check{min-height:100svh;display:grid;align-content:center;justify-items:center;gap:1rem;color:#617487}.session-check span{width:2rem;height:2rem;border:2px solid #cddce7;border-top-color:#4b9fe8;border-radius:50%;animation:spin .8s linear infinite}.session-check p{margin:0;font-size:.9rem}.content{box-sizing:border-box;width:100%;max-width:96rem;margin:0 auto}.icon-button,.workspace aside button,.primary,.secondary,.danger-button{min-height:2.75rem}.search input{min-width:0;background:transparent;font:inherit}@keyframes spin{to{transform:rotate(360deg)}}
@media(max-width:800px){.workspace{grid-template-columns:1fr}.workspace>aside{display:flex;position:sticky;top:0;z-index:1;border-right:0;border-bottom:1px solid #dce5ed;padding:.5rem}.workspace>aside .nav-label,.storage{display:none}.workspace>aside button{flex:1;width:auto;min-height:3.5rem;justify-content:center}.content{padding:1rem}.page-head{align-items:stretch;flex-direction:column}.metrics{grid-template-columns:1fr 1fr}.metrics div:last-child{grid-column:1/-1;border-top:1px solid #e3eaf0}.comment-list footer{align-items:flex-start;flex-direction:column}.comment-list footer button{margin-left:0;width:100%}header{padding:0 1rem}}
@media(max-width:480px){header{height:3.75rem}.wordmark b{display:none}.workspace{min-height:calc(100vh - 3.75rem)}.workspace>aside{display:grid;position:static;grid-template-columns:repeat(2,minmax(0,1fr));gap:.25rem}.workspace>aside button{min-width:0;font-size:.8rem}.metrics strong{font-size:1.25rem}.drawer-actions{display:grid;grid-template-columns:1fr}.drawer-actions button{width:100%}dl div{grid-template-columns:1fr;gap:.2rem}.filter{flex-direction:column}.filter .secondary,.comment-filter select{width:100%;max-width:none}.moderation-actions{display:grid;grid-template-columns:1fr}.moderation-actions button{width:100%}}
@media(prefers-reduced-motion:reduce){.session-check span{animation:none}}

/* Admin workbench shell: mobile first, then progressively enhanced. */
:global(body){overflow:hidden;background:var(--sf-page);color:var(--sf-text)}
.admin-stage{height:100svh;min-height:0;display:grid;place-items:stretch;overflow:hidden;padding:0;background:var(--sf-page)}
.admin-frame{position:relative;width:100%;height:100svh;min-width:0;display:grid;grid-template-columns:minmax(0,1fr);overflow:hidden;border:0;background:var(--sf-surface)}
.admin-sidebar{position:fixed;z-index:31;inset:0 auto 0 0;width:min(18rem,calc(100vw - 3rem));display:grid;grid-template-rows:auto minmax(0,1fr) auto;overflow:hidden;border:0;border-right:1px solid var(--sf-border);padding:0;background:var(--sf-surface-subtle);transform:translateX(-102%);transition:transform 180ms ease}
.admin-sidebar.open{transform:translateX(0)}
.navigation-backdrop{position:fixed;z-index:30;inset:0;width:100%;height:100%;min-height:0;border:0;border-radius:0;background:rgb(24 34 48 / 38%);cursor:pointer}
.sidebar-brand{min-height:4.75rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;border-bottom:1px solid var(--sf-border);padding:1rem 1.1rem}
.wordmark{min-width:0;display:flex;align-items:center;gap:.7rem;color:var(--sf-text);font-weight:800;text-decoration:none}
.wordmark>span:first-child{width:2.25rem;height:2.25rem;display:grid;flex:none;place-items:center;border-radius:var(--sf-radius-md);background:var(--sf-accent);color:#fff}
.wordmark>span:last-child{width:auto;height:auto;display:inline;overflow:hidden;border-radius:0;background:transparent;color:inherit;text-overflow:ellipsis;white-space:nowrap}
.wordmark b{color:var(--sf-text-muted);font-weight:600}
.admin-sidebar nav{min-height:0;overflow:auto;padding:.75rem}
.nav-group{margin:0 0 .35rem;padding:0;border:0;background:transparent}
.nav-group-toggle,.nav-children button,.sidebar-signout{width:100%;min-height:2.75rem;display:grid;grid-template-columns:1.25rem minmax(0,1fr) auto;align-items:center;gap:.65rem;border:0;border-radius:var(--sf-radius-md);padding:0 .75rem;background:transparent;color:var(--sf-text-muted);font-weight:800;text-align:left;cursor:pointer}
.nav-group-toggle{color:var(--sf-text-soft);font-size:.72rem;text-transform:uppercase}
.nav-group-toggle .group-chevron{transition:transform 160ms ease}
.nav-group-toggle[aria-expanded="true"] .group-chevron{transform:rotate(180deg)}
.nav-children{display:grid;gap:.2rem;margin:.15rem 0 .65rem .6rem;border-left:1px solid var(--sf-border);padding-left:.55rem;overflow:hidden}
.nav-children button{font-size:.9rem}
.nav-children button:hover,.sidebar-signout:hover{background:var(--sf-surface-muted);color:var(--sf-text)}
.nav-children button.active{background:var(--sf-accent-soft);color:var(--sf-accent-strong)}
.nav-children i{min-width:1.75rem;border-radius:999px;padding:.16rem .42rem;background:var(--sf-surface);color:var(--sf-text-soft);font-size:.7rem;font-style:normal;text-align:center}
.sidebar-footer{border-top:1px solid var(--sf-border);padding:.75rem}
.storage{display:flex;gap:.7rem;margin:0;padding:.75rem;color:var(--sf-text)}
.storage i{width:.55rem;height:.55rem;flex:none;margin-top:.25rem;border-radius:50%;background:var(--sf-danger)}
.storage i.ok{background:var(--sf-success)}
.storage strong,.storage small{display:block}.storage strong{font-size:.82rem}.storage small{margin-top:.2rem;color:var(--sf-text-soft);font-size:.72rem;line-height:1.35}
.sidebar-signout{color:var(--sf-danger)}
.workspace-pane{min-width:0;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);background:var(--sf-surface)}
.workspace-header{min-height:auto;display:grid;grid-template-columns:auto auto minmax(0,1fr);align-items:center;gap:.75rem;border:0;border-bottom:1px solid var(--sf-border);padding:1rem;background:var(--sf-surface)}
.menu-button,.sidebar-close,.icon-button{width:var(--sf-control-height);height:var(--sf-control-height);min-width:var(--sf-control-height);min-height:var(--sf-control-height);display:inline-grid;place-items:center;border:1px solid var(--sf-border-strong);border-radius:var(--sf-radius-md);padding:0;background:var(--sf-surface);color:var(--sf-text-muted);cursor:pointer}
.icon-button:hover{background:var(--sf-surface-muted);color:var(--sf-accent-strong)}
.page-icon{width:2.75rem;height:2.75rem;display:grid;flex:none;place-items:center;border-radius:50%;background:var(--sf-accent-soft);color:var(--sf-accent-strong);font-size:1.35rem}
.workspace-title{min-width:0}.workspace-title p{margin:0;color:var(--sf-accent-strong);font-size:.7rem;font-weight:800}.workspace-title h1{overflow:hidden;margin:.2rem 0 0;color:var(--sf-text);font-size:1.35rem;line-height:1.2;text-overflow:ellipsis;white-space:nowrap}
.header-actions{grid-column:1/-1;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:.65rem}
.search{width:100%;height:var(--sf-control-height);display:flex;align-items:center;gap:.55rem;border:1px solid var(--sf-border-strong);border-radius:var(--sf-radius-md);padding:0 .8rem;background:var(--sf-surface);color:var(--sf-text-soft)}
.search input{min-width:0;width:100%;border:0;padding:0;outline:0;background:transparent;color:var(--sf-text);font:inherit}
.content-scroll{min-width:0;min-height:0;overflow:auto;overscroll-behavior:contain;background:var(--sf-page)}
.content{box-sizing:border-box;width:100%;max-width:96rem;min-width:0;margin:0 auto;padding:1rem;background:transparent}
.view-transition{min-width:0}
.notice{margin:0 0 1rem;padding:.85rem 1rem;border:1px solid var(--sf-border);border-radius:var(--sf-radius-md);background:var(--sf-surface-subtle);color:var(--sf-text-muted);font-size:.88rem;line-height:1.5}
.notice.error{border-color:color-mix(in srgb,var(--sf-danger) 30%,var(--sf-border));background:var(--sf-danger-soft);color:var(--sf-danger)}
.notice.success{border-color:color-mix(in srgb,var(--sf-success) 30%,var(--sf-border));background:var(--sf-success-soft);color:var(--sf-success)}
.metrics{display:grid;grid-template-columns:1fr;margin:0 0 1rem;overflow:hidden;border:1px solid var(--sf-border);border-radius:var(--sf-radius-md);background:var(--sf-surface)}
.metrics div{min-height:5rem;padding:1rem 1.25rem;border:0;border-bottom:1px solid var(--sf-border)}
.metrics div:last-child{border:0}.metrics span{color:var(--sf-text-muted);font-size:.78rem}.metrics strong{margin-top:.35rem;color:var(--sf-text);font-size:1.45rem}
.table-wrap{max-width:100%;overflow:auto;border:1px solid var(--sf-border);border-radius:var(--sf-radius-md);background:var(--sf-surface);overscroll-behavior-x:contain}
table{min-width:58rem;width:100%;border-collapse:collapse;white-space:nowrap}
th,td{padding:1rem 1.15rem;border-bottom:1px solid var(--sf-border);font-size:.82rem;text-align:left}
th{position:sticky;z-index:1;top:0;background:var(--sf-surface-subtle);color:var(--sf-text-muted);font-size:.7rem;text-transform:uppercase}
td{color:var(--sf-text)}td>small{margin-top:.3rem;color:var(--sf-text-muted);line-height:1.4}
.user-cell{min-height:2.75rem;color:var(--sf-text)}
.badges{display:flex;flex-wrap:wrap;gap:.35rem}.badges i{background:var(--sf-accent-soft);color:var(--sf-accent-strong)}.badges i.danger{background:var(--sf-danger-soft);color:var(--sf-danger)}
.filter{display:grid;grid-template-columns:1fr;gap:.75rem;max-width:none;margin-bottom:1rem;padding:1rem;border:1px solid var(--sf-border);border-radius:var(--sf-radius-md);background:var(--sf-surface)}
.field{min-height:var(--sf-control-height);border:1px solid var(--sf-border-strong);border-radius:var(--sf-radius-md);padding:.7rem .8rem;background:var(--sf-surface);color:var(--sf-text)}
.primary,.secondary,.danger-button{min-height:var(--sf-control-height);border-radius:var(--sf-radius-md);padding:0 1rem}
.primary{background:var(--sf-accent);color:#fff}.secondary{border-color:var(--sf-border-strong);background:var(--sf-surface);color:var(--sf-text)}.danger-button{border-color:color-mix(in srgb,var(--sf-danger) 30%,var(--sf-border));background:var(--sf-danger-soft);color:var(--sf-danger)}
.result-count{margin:0 0 1rem;color:var(--sf-text-muted);font-size:.82rem}
.comment-list{gap:1rem}.comment-list article{padding:1.25rem;border-color:var(--sf-border);border-radius:var(--sf-radius-md);background:var(--sf-surface)}
.comment-list article>p{margin:1rem 0;line-height:1.65}.comment-list footer{align-items:flex-start;flex-direction:column;gap:.75rem}.comment-list footer button{width:100%;margin:0}
.drawer{z-index:41;width:min(36rem,100%);border-left:1px solid var(--sf-border);background:var(--sf-surface);color:var(--sf-text);box-shadow:-1rem 0 3rem rgb(28 53 79 / 12%)}
.drawer-backdrop{z-index:40}.drawer-head,.drawer-actions{background:var(--sf-surface);border-color:var(--sf-border)}
.drawer-body section{border-color:var(--sf-border)}dt,.mini-comment small,.drawer-empty{color:var(--sf-text-muted)}
.moderation-modal{border-color:var(--sf-border);border-radius:var(--sf-radius-lg);background:var(--sf-surface);color:var(--sf-text)}
.moderation-actions{display:grid;grid-template-columns:1fr;gap:.65rem}.moderation-actions button{width:100%}

@media(min-width:640px){
	.workspace-header{grid-template-columns:auto auto minmax(0,1fr) auto;padding:1rem 1.25rem}.header-actions{grid-column:auto;display:flex}.search{width:min(19rem,32vw)}
	.metrics{grid-template-columns:repeat(3,1fr)}.metrics div{border-right:1px solid var(--sf-border);border-bottom:0}
	.filter{grid-template-columns:minmax(15rem,1fr) minmax(9rem,12rem) auto;align-items:end}.comment-list footer{align-items:center;flex-direction:row;flex-wrap:wrap}.comment-list footer button{width:auto;margin-left:auto}
	.moderation-actions{display:flex;justify-content:flex-end}.moderation-actions button{width:auto}
}
@media(min-width:1024px){
	.admin-stage{place-items:center;padding:1.5rem}.admin-frame{height:min(60rem,calc(100svh - 3rem));min-height:38rem;grid-template-columns:17rem minmax(0,1fr);border:1px solid var(--sf-border-strong);border-radius:var(--sf-radius-lg);box-shadow:var(--sf-shadow-surface)}
	.admin-sidebar{position:static;z-index:auto;width:auto;transform:none}.navigation-backdrop,.menu-button,.sidebar-close{display:none}
	.workspace-header{min-height:5rem;padding:1rem 1.5rem}.content{padding:1.5rem clamp(1.5rem,3vw,2.5rem) 2.5rem}
}
@media(min-width:1280px){.content{padding-inline:3rem}.search{width:22rem}}
@media(prefers-reduced-motion:reduce){.admin-sidebar,.nav-group-toggle .group-chevron{transition:none}}
</style>
