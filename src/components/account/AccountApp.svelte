<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";
import RegistrationApp from "./RegistrationApp.svelte";

type AccountUser = {
	id: string;
	email: string;
	username: string;
	displayName: string;
	avatarUrl: string;
	bio: string;
	displayRegion: string;
	displayRegionCode: string;
	twoFactorEnabled: boolean;
	hasPassword: boolean;
};

type AccountSession = {
	id: string;
	device: string;
	platform: string;
	region: string;
	regionCode: string;
	createdAt: string;
	lastActiveAt: string;
	expiresAt: string;
	current: boolean;
};

type PrivacySettings = {
	profilePublic: boolean;
	showRegion: boolean;
	showComments: boolean;
	allowSearch: boolean;
	allowDataExport: boolean;
};

type NotificationSettings = {
	securityEmail: boolean;
	commentReplies: boolean;
	systemEmail: boolean;
	marketingEmail: boolean;
};

type SecurityEvent = {
	event_type: string;
	detail: string;
	created_at: string;
};

let { apiBase = "/accounts-api" } = $props<{ apiBase?: string }>();
let loading = $state(true);
let redirecting = $state(false);
let registrationMode = $state(false);
let user = $state<AccountUser | null>(null);
let csrf = $state("");
let emailConfigured = $state(false);
let tosVersion = $state("");
let registrationVerifyToken = $state("");
let submitting = $state(false);
let avatarUploading = $state(false);
let error = $state("");
let notice = $state("");
let activePanel = $state<
	"profile" | "security" | "sessions" | "privacy" | "notifications" | "danger"
>("profile");
let displayName = $state("");
let avatarUrl = $state("");
let bio = $state("");
let displayRegion = $state("");
let displayRegionCode = $state("");
let setupToken = $state("");
let totpSecret = $state("");
let totpUri = $state("");
let totpCode = $state("");
let currentPassword = $state("");
let newPassword = $state("");
let sessions = $state<AccountSession[]>([]);
let securityEvents = $state<SecurityEvent[]>([]);
let privacy = $state<PrivacySettings>({
	profilePublic: true,
	showRegion: true,
	showComments: true,
	allowSearch: true,
	allowDataExport: true,
});
let notifications = $state<NotificationSettings>({
	securityEmail: true,
	commentReplies: true,
	systemEmail: true,
	marketingEmail: false,
});
let dangerConfirmation = $state("");

const panels = [
	{
		id: "profile",
		label: "Public Profile",
		icon: "material-symbols:person-outline-rounded",
	},
	{
		id: "security",
		label: "Security",
		icon: "material-symbols:shield-lock-outline-rounded",
	},
	{
		id: "sessions",
		label: "Sessions",
		icon: "material-symbols:devices-outline-rounded",
	},
	{
		id: "privacy",
		label: "Privacy",
		icon: "material-symbols:visibility-lock-outline-rounded",
	},
	{
		id: "notifications",
		label: "Notifications",
		icon: "material-symbols:notifications-outline-rounded",
	},
	{
		id: "danger",
		label: "Danger Zone",
		icon: "material-symbols:warning-outline-rounded",
	},
] as const;

async function apiFetch<T>(
	path: string,
	init: RequestInit & { csrf?: boolean } = {},
): Promise<T> {
	const response = await fetch(`${apiBase}${path}`, {
		...init,
		credentials: "include",
		headers: {
			Accept: "application/json",
			...(init.body ? { "content-type": "application/json" } : {}),
			...(init.csrf && csrf ? { "X-CSRF-Token": csrf } : {}),
			...(init.headers ?? {}),
		},
	});
	const data = (await response.json().catch(() => ({}))) as { detail?: string };
	if (!response.ok) throw new Error(data.detail || "Request failed");
	return data as T;
}

function applyUser(next: AccountUser) {
	user = next;
	displayName = next.displayName;
	avatarUrl = next.avatarUrl;
	bio = next.bio;
	displayRegion = next.displayRegion;
	displayRegionCode = next.displayRegionCode;
}

function clearMessages() {
	error = "";
	notice = "";
}

function flagUrl(countryCode: string) {
	const normalized = countryCode.trim().toLowerCase();
	return /^[a-z]{2}$/.test(normalized)
		? `https://flagcdn.com/${normalized}.svg`
		: "";
}

function formatTime(value?: string) {
	if (!value) return "Not recorded";
	return new Intl.DateTimeFormat(undefined, {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(new Date(value));
}

function initials() {
	return (displayName || user?.username || "S").slice(0, 2).toUpperCase();
}

async function loadAccountExtras() {
	const [sessionResult, preferenceResult, securityResult] = await Promise.all([
		apiFetch<{ sessions: AccountSession[] }>("/accounts/sessions").catch(
			() => ({
				sessions: [],
			}),
		),
		apiFetch<{
			privacy: PrivacySettings;
			notifications: NotificationSettings;
		}>("/accounts/preferences").catch(() => ({ privacy, notifications })),
		apiFetch<{
			events: SecurityEvent[];
		}>("/accounts/security").catch(() => ({ events: [] })),
	]);
	sessions = sessionResult.sessions;
	privacy = preferenceResult.privacy;
	notifications = preferenceResult.notifications;
	securityEvents = securityResult.events;
}

async function loadSession() {
	const params = new URLSearchParams(window.location.search);
	const wantsRegistration = params.get("register") === "1";
	registrationVerifyToken = params.get("verify_token") ?? "";
	try {
		const result = await apiFetch<{
			authenticated: boolean;
			user: AccountUser | null;
			csrf?: string;
			emailConfigured: boolean;
			tosVersion: string;
		}>("/auth/session");
		csrf = result.csrf ?? "";
		emailConfigured = result.emailConfigured;
		tosVersion = result.tosVersion;
		if (result.authenticated && result.user) {
			const profile = await apiFetch<{ user: AccountUser }>(
				"/accounts/profile",
			);
			applyUser(profile.user);
			await loadAccountExtras();
		} else if (wantsRegistration || registrationVerifyToken) {
			registrationMode = true;
		} else {
			redirecting = true;
			window.location.replace(
				"https://auth.silentflare.com/?return_url=https%3A%2F%2Faccounts.silentflare.com%2F",
			);
		}
	} catch (reason) {
		error =
			reason instanceof Error
				? reason.message
				: "Account service is unavailable";
	} finally {
		loading = false;
	}
}

async function saveProfile() {
	submitting = true;
	clearMessages();
	try {
		const result = await apiFetch<{ user: AccountUser }>("/accounts/profile", {
			method: "PATCH",
			csrf: true,
			body: JSON.stringify({
				display_name: displayName,
				bio,
				display_region: "",
			}),
		});
		applyUser(result.user);
		notice = "Public profile saved.";
	} catch (reason) {
		error = reason instanceof Error ? reason.message : "Could not save profile";
	} finally {
		submitting = false;
	}
}

async function uploadAvatar(event: Event) {
	const input = event.currentTarget as HTMLInputElement;
	const file = input.files?.[0];
	input.value = "";
	if (!file) return;
	if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
		error = "Choose a PNG, JPEG, or WebP image.";
		return;
	}
	if (file.size > 2 * 1024 * 1024) {
		error = "Avatar image must be 2 MB or smaller.";
		return;
	}
	avatarUploading = true;
	clearMessages();
	try {
		const response = await fetch(`${apiBase}/accounts/profile/avatar`, {
			method: "POST",
			credentials: "include",
			headers: { "content-type": file.type, "X-CSRF-Token": csrf },
			body: file,
		});
		const result = (await response.json().catch(() => ({}))) as {
			detail?: string;
			user?: AccountUser;
		};
		if (!response.ok || !result.user)
			throw new Error(result.detail || "Avatar upload failed");
		applyUser(result.user);
		notice = "Avatar updated.";
	} catch (reason) {
		error = reason instanceof Error ? reason.message : "Avatar upload failed";
	} finally {
		avatarUploading = false;
	}
}

async function removeAvatar() {
	avatarUploading = true;
	clearMessages();
	try {
		const result = await apiFetch<{ user: AccountUser }>(
			"/accounts/profile/avatar",
			{ method: "DELETE", csrf: true },
		);
		applyUser(result.user);
		notice = "Avatar removed.";
	} catch (reason) {
		error =
			reason instanceof Error ? reason.message : "Could not remove avatar";
	} finally {
		avatarUploading = false;
	}
}

async function startAccount2FA() {
	submitting = true;
	clearMessages();
	try {
		const result = await apiFetch<{
			setup_token: string;
			secret: string;
			uri: string;
		}>("/accounts/2fa/setup/start", { method: "POST", csrf: true, body: "{}" });
		setupToken = result.setup_token;
		totpSecret = result.secret;
		totpUri = result.uri;
	} catch (reason) {
		error =
			reason instanceof Error ? reason.message : "Could not start 2FA setup";
	} finally {
		submitting = false;
	}
}

async function verifyAccount2FA() {
	submitting = true;
	clearMessages();
	try {
		await apiFetch("/accounts/2fa/setup/verify", {
			method: "POST",
			csrf: true,
			body: JSON.stringify({ setup_token: setupToken, code: totpCode }),
		});
		if (user) user = { ...user, twoFactorEnabled: true };
		setupToken = "";
		totpSecret = "";
		totpCode = "";
		notice = "Two-factor authentication enabled.";
		await loadAccountExtras();
	} catch (reason) {
		error =
			reason instanceof Error ? reason.message : "Invalid authenticator code";
	} finally {
		submitting = false;
	}
}

async function savePassword() {
	submitting = true;
	clearMessages();
	try {
		await apiFetch("/accounts/security/password", {
			method: "POST",
			csrf: true,
			body: JSON.stringify({
				current_password: currentPassword,
				new_password: newPassword,
			}),
		});
		if (user) user = { ...user, hasPassword: true };
		currentPassword = "";
		newPassword = "";
		notice = "Password updated.";
		await loadAccountExtras();
	} catch (reason) {
		error =
			reason instanceof Error ? reason.message : "Could not update password";
	} finally {
		submitting = false;
	}
}

async function savePrivacy() {
	submitting = true;
	clearMessages();
	try {
		const result = await apiFetch<{ privacy: PrivacySettings }>(
			"/accounts/preferences/privacy",
			{
				method: "PATCH",
				csrf: true,
				body: JSON.stringify({
					profile_public: privacy.profilePublic,
					show_region: privacy.showRegion,
					show_comments: privacy.showComments,
					allow_search: privacy.allowSearch,
					allow_data_export: privacy.allowDataExport,
				}),
			},
		);
		privacy = result.privacy;
		notice = "Privacy settings saved.";
	} catch (reason) {
		error = reason instanceof Error ? reason.message : "Could not save privacy";
	} finally {
		submitting = false;
	}
}

async function saveNotifications() {
	submitting = true;
	clearMessages();
	try {
		const result = await apiFetch<{ notifications: NotificationSettings }>(
			"/accounts/preferences/notifications",
			{
				method: "PATCH",
				csrf: true,
				body: JSON.stringify({
					security_email: notifications.securityEmail,
					comment_replies: notifications.commentReplies,
					system_email: notifications.systemEmail,
					marketing_email: notifications.marketingEmail,
				}),
			},
		);
		notifications = result.notifications;
		notice = "Notification settings saved.";
	} catch (reason) {
		error =
			reason instanceof Error ? reason.message : "Could not save notifications";
	} finally {
		submitting = false;
	}
}

async function revokeSession(sessionId: string) {
	clearMessages();
	try {
		await apiFetch(`/accounts/sessions/${encodeURIComponent(sessionId)}`, {
			method: "DELETE",
			csrf: true,
		});
		notice = "Session signed out.";
		if (sessions.find((session) => session.id === sessionId)?.current) {
			window.location.assign("https://auth.silentflare.com/");
			return;
		}
		await loadAccountExtras();
	} catch (reason) {
		error =
			reason instanceof Error ? reason.message : "Could not sign out session";
	}
}

async function logoutAll() {
	clearMessages();
	try {
		await apiFetch("/accounts/sessions/logout-all", {
			method: "POST",
			csrf: true,
			body: "{}",
		});
		window.location.assign("https://auth.silentflare.com/");
	} catch (reason) {
		error =
			reason instanceof Error ? reason.message : "Could not sign out sessions";
	}
}

async function dangerAction(
	path: "clear-profile" | "clear-comments" | "deactivate" | "delete",
) {
	submitting = true;
	clearMessages();
	try {
		await apiFetch(`/accounts/danger/${path}`, {
			method: "POST",
			csrf: true,
			body: JSON.stringify({ confirmation: dangerConfirmation }),
		});
		if (path === "deactivate" || path === "delete") {
			window.location.assign("https://auth.silentflare.com/");
			return;
		}
		dangerConfirmation = "";
		notice = "Danger-zone action completed.";
		const profile = await apiFetch<{ user: AccountUser }>("/accounts/profile");
		applyUser(profile.user);
	} catch (reason) {
		error =
			reason instanceof Error ? reason.message : "Danger-zone action failed";
	} finally {
		submitting = false;
	}
}

async function logout() {
	try {
		await apiFetch("/auth/logout", { method: "POST", csrf: true, body: "{}" });
	} catch {
		// The API clears the domain cookie whenever possible.
	}
	window.location.assign("https://auth.silentflare.com/");
}

onMount(() => void loadSession());
</script>

{#if loading || redirecting}
	<div class="accounts-stage">
		<div class="account-loading" aria-live="polite">
			<span></span>
			<p>Loading account...</p>
		</div>
	</div>
{:else if user}
	<div class="accounts-stage">
		<main class="accounts-workspace">
			<div class="workspace-bar">
				<a
					class="wordmark"
					href="https://blog.silentflare.com/"
					aria-label="SilentFlare Blog"
				>
					<span>S</span><strong>SilentFlare</strong>
				</a>
				<button
					class="icon-command"
					type="button"
					title="Sign out"
					aria-label="Sign out"
					onclick={() => void logout()}
				>
					<Icon icon="material-symbols:logout-rounded" />
				</button>
			</div>

			<div class="account-grid">
				<aside class="identity-card panel">
					<div class="avatar-shell">
						<div class="avatar">
							{#if avatarUrl}
								<img src={avatarUrl} alt="" />
							{:else}
								<span>{initials()}</span>
							{/if}
						</div>
						<label class="avatar-camera" title="Upload avatar" aria-label="Upload avatar">
							<Icon
								icon={avatarUploading
									? "material-symbols:progress-activity"
									: "material-symbols:add-a-photo-outline-rounded"}
								class={avatarUploading ? "spin" : ""}
							/>
							<input
								type="file"
								accept="image/png,image/jpeg,image/webp"
								onchange={(event) => void uploadAvatar(event)}
								disabled={avatarUploading}
							/>
						</label>
					</div>
					<p class="eyebrow">Account Center</p>
					<h1>{displayName || user.username}</h1>
					<p class="handle">@{user.username}</p>
					<div class="region-pill">
						{#if flagUrl(displayRegionCode)}
							<img src={flagUrl(displayRegionCode)} alt="" />
						{:else}
							<Icon icon="material-symbols:public-rounded" />
						{/if}
						<span>{displayRegion || "Region unavailable"}</span>
					</div>
					<nav class="account-nav" aria-label="Account sections">
						{#each panels as panel}
							<button
								type="button"
								class:active={activePanel === panel.id}
								onclick={() => {
									activePanel = panel.id;
									clearMessages();
								}}
							>
								<Icon icon={panel.icon} />
								<span>{panel.label}</span>
							</button>
						{/each}
					</nav>
				</aside>

				<div class="account-content">
					<section class="panel hero-panel">
						<div>
							<p class="eyebrow">{panels.find((panel) => panel.id === activePanel)?.label}</p>
							<h2>Control how your SilentFlare account appears, signs in, and stays quiet.</h2>
						</div>
						<div class="hero-stats">
							<span>{user.twoFactorEnabled ? "2FA on" : "2FA optional"}</span>
							<span>{sessions.length} session{sessions.length === 1 ? "" : "s"}</span>
						</div>
					</section>

					{#if activePanel === "profile"}
						<section class="panel account-card split-card">
							<form
								class="form-stack"
								onsubmit={(event) => {
									event.preventDefault();
									void saveProfile();
								}}
							>
								<div class="section-heading">
									<span class="section-icon"
										><Icon icon="material-symbols:person-edit-outline-rounded" /></span
									>
									<div>
										<p class="eyebrow">Public Profile</p>
										<h3>Profile details</h3>
									</div>
								</div>
								<label>
									Display name
									<input class="auth-input" bind:value={displayName} maxlength="80" autocomplete="name" />
								</label>
								<label>
									Bio
									<textarea class="auth-input bio-input" bind:value={bio} maxlength="500"></textarea>
									<span class="field-count">{bio.length}/500</span>
								</label>
								<div class="avatar-actions">
									<label class="command secondary">
										<Icon icon="material-symbols:upload-rounded" />
										{avatarUploading ? "Uploading..." : "Upload photo"}
										<input
											type="file"
											accept="image/png,image/jpeg,image/webp"
											onchange={(event) => void uploadAvatar(event)}
											disabled={avatarUploading}
										/>
									</label>
									{#if avatarUrl}
										<button
											class="command subtle-danger"
											type="button"
											onclick={() => void removeAvatar()}
											disabled={avatarUploading}
										>
											<Icon icon="material-symbols:delete-rounded" />Remove
										</button>
									{/if}
								</div>
								<button class="command primary" type="submit" disabled={submitting}>
									<Icon icon="material-symbols:save-outline-rounded" />{submitting ? "Saving..." : "Save profile"}
								</button>
							</form>
							<article class="profile-preview">
								<p class="eyebrow">Homepage Preview</p>
								<div class="preview-card">
									<div class="preview-avatar">
										{#if avatarUrl}<img src={avatarUrl} alt="" />{:else}<span>{initials()}</span>{/if}
									</div>
									<h4>{displayName || user.username}</h4>
									<p>@{user.username}</p>
									{#if privacy.showRegion}
										<div class="preview-region">
											{#if flagUrl(displayRegionCode)}<img src={flagUrl(displayRegionCode)} alt="" />{/if}
											<span>{displayRegion || "Region unavailable"}</span>
										</div>
									{/if}
									<blockquote>{bio || "Your short intro will appear here."}</blockquote>
								</div>
							</article>
						</section>
					{:else if activePanel === "security"}
						<section class="panel account-card">
							<div class="section-heading">
								<span class="section-icon"><Icon icon="material-symbols:shield-lock-outline-rounded" /></span>
								<div><p class="eyebrow">Security</p><h3>Sign-in protection</h3></div>
							</div>
							<div class="security-list">
								<div class="security-row"><span class="row-icon"><Icon icon="material-symbols:alternate-email-rounded" /></span><div><strong>Email verification</strong><p>{user.email}</p></div><span class="status good">Verified</span></div>
								<div class="security-row"><span class="row-icon"><Icon icon="material-symbols:key-outline-rounded" /></span><div><strong>Password</strong><p>{user.hasPassword ? "Password login is available" : "Email-code login only"}</p></div><span class="status">{user.hasPassword ? "Set" : "Not set"}</span></div>
								<div class="security-row"><span class="row-icon"><Icon icon="material-symbols:phonelink-lock-outline-rounded" /></span><div><strong>Two-step verification</strong><p>Authenticator challenge after primary login</p></div><span class:good={user.twoFactorEnabled} class="status">{user.twoFactorEnabled ? "Enabled" : "Optional"}</span></div>
								<div class="security-row"><span class="row-icon"><Icon icon="material-symbols:emergency-home-outline-rounded" /></span><div><strong>Recovery codes</strong><p>Reserved for the next security phase</p></div><span class="status">Pending</span></div>
							</div>
							<form class="inline-form" onsubmit={(event) => { event.preventDefault(); void savePassword(); }}>
								<input class="auth-input" type="password" bind:value={currentPassword} placeholder={user.hasPassword ? "Current password" : "Current password not required"} autocomplete="current-password" />
								<input class="auth-input" type="password" bind:value={newPassword} placeholder="New password" autocomplete="new-password" minlength="8" />
								<button class="command primary" type="submit" disabled={submitting || newPassword.length < 8}><Icon icon="material-symbols:password-rounded" />Update password</button>
							</form>
							{#if !user.twoFactorEnabled && !setupToken}
								<button class="command secondary" type="button" onclick={() => void startAccount2FA()} disabled={submitting}><Icon icon="material-symbols:add-moderator-outline-rounded" />Set up 2FA</button>
							{/if}
							{#if setupToken}
								<div class="totp-box">
									<p>Authenticator secret</p>
									<code>{totpSecret}</code>
									<a href={totpUri}><Icon icon="material-symbols:open-in-new-rounded" />Open authenticator app</a>
									<input class="auth-input code-input" inputmode="numeric" maxlength="6" bind:value={totpCode} placeholder="000000" />
									<button class="command primary" type="button" onclick={() => void verifyAccount2FA()}><Icon icon="material-symbols:verified-user-outline-rounded" />Verify and enable</button>
								</div>
							{/if}
							<div class="event-list">
								<h4>Security record</h4>
								{#if securityEvents.length === 0}
									<p class="muted">No recent security events.</p>
								{:else}
									{#each securityEvents as item}
										<div><strong>{item.event_type.replaceAll("_", " ")}</strong><span>{formatTime(item.created_at)}</span><p>{item.detail}</p></div>
									{/each}
								{/if}
							</div>
						</section>
					{:else if activePanel === "sessions"}
						<section class="panel account-card">
							<div class="section-heading">
								<span class="section-icon"><Icon icon="material-symbols:devices-outline-rounded" /></span>
								<div><p class="eyebrow">Sessions</p><h3>Logged-in devices</h3></div>
							</div>
							<div class="session-list">
								{#each sessions as session}
									<article>
										<span class="row-icon"><Icon icon={session.current ? "material-symbols:laptop-mac-outline-rounded" : "material-symbols:devices-other-rounded"} /></span>
										<div>
											<strong>{session.device} on {session.platform}</strong>
											<p>{session.region} · Last active {formatTime(session.lastActiveAt)}</p>
											<small>Created {formatTime(session.createdAt)} · Expires {formatTime(session.expiresAt)}</small>
										</div>
										{#if session.current}
											<span class="status good">Current</span>
										{:else}
											<button class="command secondary" type="button" onclick={() => void revokeSession(session.id)}>Sign out</button>
										{/if}
									</article>
								{/each}
							</div>
							<button class="command subtle-danger" type="button" onclick={() => void logoutAll()}><Icon icon="material-symbols:logout-rounded" />Sign out all devices</button>
						</section>
					{:else if activePanel === "privacy"}
						<section class="panel account-card">
							<div class="section-heading">
								<span class="section-icon"><Icon icon="material-symbols:visibility-lock-outline-rounded" /></span>
								<div><p class="eyebrow">Privacy</p><h3>Public visibility</h3></div>
							</div>
							<div class="toggle-list">
								<label><span><strong>Public profile</strong><small>Allow your profile preview to be visible.</small></span><input type="checkbox" bind:checked={privacy.profilePublic} /></label>
								<label><span><strong>Show region</strong><small>Display API-owned city/country data on your profile.</small></span><input type="checkbox" bind:checked={privacy.showRegion} /></label>
								<label><span><strong>Show comment record</strong><small>Allow public surfaces to reference your comments.</small></span><input type="checkbox" bind:checked={privacy.showComments} /></label>
								<label><span><strong>Allow search</strong><small>Let account search discover your public profile.</small></span><input type="checkbox" bind:checked={privacy.allowSearch} /></label>
								<label><span><strong>Data export</strong><small>Keep export eligibility enabled for account data.</small></span><input type="checkbox" bind:checked={privacy.allowDataExport} /></label>
							</div>
							<button class="command primary" type="button" onclick={() => void savePrivacy()} disabled={submitting}><Icon icon="material-symbols:save-outline-rounded" />Save privacy</button>
						</section>
					{:else if activePanel === "notifications"}
						<section class="panel account-card">
							<div class="section-heading">
								<span class="section-icon"><Icon icon="material-symbols:notifications-outline-rounded" /></span>
								<div><p class="eyebrow">Notifications</p><h3>Email and system signals</h3></div>
							</div>
							<div class="toggle-list">
								<label><span><strong>Security notifications</strong><small>Password, session, and 2FA changes.</small></span><input type="checkbox" bind:checked={notifications.securityEmail} /></label>
								<label><span><strong>Comment replies</strong><small>Replies to your blog comments.</small></span><input type="checkbox" bind:checked={notifications.commentReplies} /></label>
								<label><span><strong>System notifications</strong><small>Important account and policy updates.</small></span><input type="checkbox" bind:checked={notifications.systemEmail} /></label>
								<label><span><strong>Email announcements</strong><small>Occasional SilentFlare updates.</small></span><input type="checkbox" bind:checked={notifications.marketingEmail} /></label>
							</div>
							<button class="command primary" type="button" onclick={() => void saveNotifications()} disabled={submitting}><Icon icon="material-symbols:save-outline-rounded" />Save notifications</button>
						</section>
					{:else}
						<section class="panel account-card danger-card">
							<div class="section-heading">
								<span class="section-icon danger-icon"><Icon icon="material-symbols:warning-outline-rounded" /></span>
								<div><p class="eyebrow">Danger Zone</p><h3>Destructive account actions</h3></div>
							</div>
							<label>Confirmation text<input class="auth-input" bind:value={dangerConfirmation} placeholder="Type the exact phrase shown on the action" /></label>
							<div class="danger-actions">
								<button class="command secondary" type="button" onclick={() => void dangerAction("clear-profile")} disabled={dangerConfirmation !== "CLEAR PROFILE" || submitting}>Clear profile</button>
								<button class="command secondary" type="button" onclick={() => void dangerAction("clear-comments")} disabled={dangerConfirmation !== "CLEAR COMMENTS" || submitting}>Clear comments</button>
								<button class="command subtle-danger" type="button" onclick={() => void logoutAll()}>Sign out all devices</button>
								<button class="command danger" type="button" onclick={() => void dangerAction("deactivate")} disabled={dangerConfirmation !== "DEACTIVATE" || submitting}>Deactivate account</button>
								<button class="command danger" type="button" onclick={() => void dangerAction("delete")} disabled={dangerConfirmation !== "DELETE ACCOUNT" || submitting}>Delete account</button>
							</div>
							<p class="muted">Required phrases: CLEAR PROFILE, CLEAR COMMENTS, DEACTIVATE, DELETE ACCOUNT.</p>
						</section>
					{/if}

					{#if error}
						<p class="message error"><Icon icon="material-symbols:error-outline-rounded" />{error}</p>
					{/if}
					{#if notice}
						<p class="message notice"><Icon icon="material-symbols:check-circle-outline-rounded" />{notice}</p>
					{/if}
				</div>
			</div>
		</main>
		<footer class="accounts-footer">
			<a href="https://blog.silentflare.com/">SilentFlare</a><span>/</span><a href="https://blog.silentflare.com/rss.xml">RSS</a><span>/</span><a href="https://tos.silentflare.com/">Terms</a>
		</footer>
	</div>
{:else if registrationMode}
	<RegistrationApp
		{apiBase}
		{emailConfigured}
		{tosVersion}
		verifyToken={registrationVerifyToken}
	/>
{/if}

<style>
	.accounts-stage { min-height: 100svh; padding: 1rem; color: #182230; background: #edf3f8; }
	:global(.dark) .accounts-stage { background: #101820; color: #e8edf4; }
	.accounts-workspace { width: min(100%, 78rem); margin: 0 auto; }
	.workspace-bar { min-height: 3.5rem; display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
	.wordmark { display: inline-flex; align-items: center; gap: .65rem; color: inherit; font-weight: 800; text-decoration: none; }
	.wordmark span { width: 2rem; height: 2rem; display: grid; place-items: center; border-radius: .5rem; background: #4b9fe8; color: white; }
	.panel { border: 1px solid rgba(70,100,130,.14); border-radius: .5rem; background: rgba(255,255,255,.96); box-shadow: 0 .75rem 2.5rem rgba(28,53,79,.07); }
	:global(.dark) .panel { border-color: rgba(255,255,255,.08); background: #19232f; }
	.account-grid { display: grid; gap: 1rem; }
	.identity-card, .account-card, .hero-panel { padding: clamp(1.1rem, 3vw, 1.75rem); }
	.identity-card { min-width: 0; text-align: center; }
	.avatar-shell { position: relative; width: 6.6rem; height: 6.6rem; margin: 0 auto 1.2rem; }
	.avatar, .preview-avatar { display: grid; place-items: center; overflow: hidden; border-radius: 50%; background: #e8f3ff; color: #388bd3; font-weight: 800; }
	.avatar { width: 100%; height: 100%; border: .2rem solid #4b9fe8; font-size: 2.2rem; }
	.avatar img, .preview-avatar img { width: 100%; height: 100%; object-fit: cover; }
	.avatar-camera { position: absolute; right: -.15rem; bottom: .25rem; width: 2.7rem; height: 2.7rem; display: grid; place-items: center; border: .2rem solid white; border-radius: 50%; background: #182e49; color: white; cursor: pointer; }
	.avatar-camera input, .command input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
	.identity-card h1 { margin: .2rem 0; overflow-wrap: anywhere; font-size: 1.65rem; line-height: 1.1; letter-spacing: 0; }
	.handle, .muted { color: #6c7b8c; }
	.region-pill { display: inline-flex; min-height: 2.35rem; align-items: center; gap: .45rem; max-width: 100%; margin-bottom: 1rem; padding: 0 .7rem; border-radius: 999px; background: #eef6fd; color: #44637f; font-size: .82rem; font-weight: 700; }
	.region-pill img, .preview-region img { width: 1.15rem; height: 1.15rem; border-radius: 50%; object-fit: cover; }
	.account-nav { display: grid; gap: .35rem; margin-top: 1rem; text-align: left; }
	.account-nav button { min-height: 2.85rem; display: flex; align-items: center; gap: .65rem; border: 0; border-radius: .5rem; padding: 0 .8rem; background: transparent; color: #52677b; font-weight: 800; cursor: pointer; }
	.account-nav button.active { background: #e5f2fd; color: #287dc0; }
	.account-content { min-width: 0; display: grid; gap: 1rem; }
	.hero-panel { display: grid; gap: 1rem; align-items: center; }
	.hero-panel h2 { max-width: 20ch; margin: 0; font-size: clamp(1.65rem, 4vw, 2.4rem); line-height: 1.04; letter-spacing: 0; }
	.hero-stats { display: flex; flex-wrap: wrap; gap: .5rem; }
	.hero-stats span, .status { display: inline-flex; align-items: center; min-height: 2rem; border-radius: 999px; padding: 0 .65rem; background: #e9f0f6; color: #52677b; font-size: .72rem; font-weight: 800; text-transform: uppercase; }
	.section-heading { display: flex; align-items: flex-start; gap: .9rem; margin-bottom: 1.4rem; }
	.section-icon, .row-icon { flex: none; display: grid; place-items: center; color: #317dc1; background: #e8f3ff; }
	.section-icon { width: 2.75rem; height: 2.75rem; border-radius: .5rem; font-size: 1.35rem; }
	.row-icon { width: 2.5rem; height: 2.5rem; border-radius: .5rem; font-size: 1.2rem; }
	.eyebrow { margin: 0 0 .4rem; color: #428ed1; font-size: .72rem; font-weight: 800; letter-spacing: 0; text-transform: uppercase; }
	h3 { margin: 0; font-size: 1.55rem; line-height: 1.12; letter-spacing: 0; }
	.form-stack { display: flex; flex-direction: column; gap: 1rem; }
	label { position: relative; display: flex; flex-direction: column; gap: .5rem; font-weight: 800; }
	.auth-input { box-sizing: border-box; width: 100%; min-height: 2.9rem; border: 1px solid rgba(70,100,130,.18); border-radius: .45rem; padding: .65rem .8rem; background: white; color: inherit; font: inherit; }
	:global(.dark) .auth-input { background: #121b25; border-color: rgba(255,255,255,.12); }
	.bio-input { min-height: 8rem; resize: vertical; }
	.field-count { align-self: flex-end; color: #7a8795; font-size: .75rem; font-weight: 500; }
	.avatar-actions, .inline-form, .danger-actions { display: flex; flex-wrap: wrap; gap: .6rem; }
	.command, .icon-command { min-width: 2.75rem; min-height: 2.75rem; display: inline-flex; align-items: center; justify-content: center; gap: .55rem; border-radius: .5rem; font-weight: 800; cursor: pointer; transition: transform .16s ease, background-color .16s ease; }
	.command { width: max-content; padding: 0 1rem; border: 1px solid transparent; }
	.command:hover, .icon-command:hover { transform: translateY(-1px); }
	.command.primary { background: #dceeff; color: #176db8; }
	.command.secondary, .icon-command { border: 1px solid rgba(70,100,130,.16); background: white; color: #31465b; }
	.command.subtle-danger { border: 1px solid #f0caca; background: #fff5f5; color: #a34141; }
	.command.danger { background: #aa2d2d; color: white; }
	:global(.dark) .command.secondary, :global(.dark) .icon-command { background: #19232f; color: #e8edf4; }
	.icon-command { padding: 0; font-size: 1.3rem; }
	.command:disabled, .icon-command:disabled { cursor: not-allowed; opacity: .55; transform: none; }
	.split-card { display: grid; gap: 1.5rem; }
	.profile-preview { min-width: 0; }
	.preview-card { padding: 1.2rem; border: 1px solid rgba(70,100,130,.14); border-radius: .5rem; background: #f6f9fc; text-align: center; }
	.preview-avatar { width: 4.5rem; height: 4.5rem; margin: 0 auto .8rem; font-size: 1.4rem; }
	.preview-card h4 { margin: 0; font-size: 1.2rem; overflow-wrap: anywhere; }
	.preview-card p { margin: .25rem 0 .8rem; color: #6c7b8c; overflow-wrap: anywhere; }
	.preview-region { display: inline-flex; align-items: center; gap: .4rem; margin-bottom: .8rem; color: #52677b; font-size: .82rem; font-weight: 700; }
	blockquote { margin: 0; color: #31465b; line-height: 1.6; overflow-wrap: anywhere; }
	.security-list, .session-list, .toggle-list, .event-list { display: grid; gap: .65rem; margin-bottom: 1rem; }
	.security-row, .session-list article, .toggle-list label { display: grid; grid-template-columns: auto minmax(0,1fr) auto; align-items: center; gap: .85rem; min-height: 4.6rem; padding: .85rem; border: 1px solid rgba(70,100,130,.12); border-radius: .5rem; background: #f8fbfd; }
	.security-row p, .session-list p, .session-list small, .toggle-list small { margin: .2rem 0 0; overflow-wrap: anywhere; color: #6c7b8c; font-size: .86rem; }
	.status.good { background: #e5f6ec; color: #177248; }
	.inline-form { margin: 1rem 0; }
	.inline-form .auth-input { flex: 1 1 13rem; }
	.totp-box, .event-list div { padding: 1rem; border: 1px solid rgba(70,100,130,.14); border-radius: .5rem; background: #f5f8fb; }
	.totp-box { display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; }
	.totp-box p, .event-list h4 { margin: 0; font-weight: 800; }
	.totp-box code { overflow-wrap: anywhere; padding: .8rem; border-radius: .45rem; background: #e8eef4; font-size: 1rem; letter-spacing: 0; }
	.totp-box a { min-height: 2.75rem; display: inline-flex; align-items: center; gap: .45rem; color: #2c7cc2; font-weight: 700; }
	.code-input { text-align: center; font-size: 1.25rem; letter-spacing: 0; }
	.event-list { margin-top: 1.2rem; }
	.event-list div strong, .event-list div span { display: block; }
	.event-list div strong { text-transform: capitalize; }
	.event-list div span { margin-top: .2rem; color: #718195; font-size: .78rem; }
	.event-list div p { margin: .45rem 0 0; color: #52677b; }
	.toggle-list label { grid-template-columns: minmax(0,1fr) auto; cursor: pointer; }
	.toggle-list input { width: 3rem; height: 1.65rem; accent-color: #4b9fe8; }
	.danger-card { border-color: #f0caca; }
	.danger-icon { background: #fff1f1; color: #b63b3b; }
	.message { display: flex; align-items: flex-start; gap: .55rem; margin: 0; padding: 1rem; border-radius: .5rem; font-weight: 700; }
	.message.error { color: #a82929; background: #fbeaea; }
	.message.notice { color: #177248; background: #e7f5ed; }
	.accounts-footer { min-height: 3rem; display: flex; align-items: center; justify-content: center; gap: .45rem; color: #718195; font-size: .8rem; }
	.account-loading { min-height: calc(100svh - 2rem); display: grid; place-content: center; justify-items: center; gap: 1rem; color: #718195; }
	.account-loading span { width: 2rem; height: 2rem; border: 2px solid #d5e0e9; border-top-color: #4b9fe8; border-radius: 50%; animation: spin .8s linear infinite; }
	.spin { animation: spin .8s linear infinite; }
	@media (min-width: 768px) {
		.accounts-stage { padding: 1.5rem; }
		.hero-panel { grid-template-columns: minmax(0,1fr) auto; }
		.split-card { grid-template-columns: minmax(0,1fr) minmax(16rem, .65fr); }
	}
	@media (min-width: 1024px) {
		.account-grid { grid-template-columns: minmax(16rem, 19rem) minmax(0,1fr); align-items: start; }
		.identity-card { position: sticky; top: 1.5rem; }
	}
	@media (max-width: 520px) {
		.accounts-stage { padding: .75rem; }
		.account-nav { grid-template-columns: repeat(2, minmax(0,1fr)); }
		.account-nav button { justify-content: center; min-height: 3.25rem; padding: .35rem; font-size: .78rem; text-align: center; }
		.account-nav button :global(svg) { font-size: 1.1rem; }
		.security-row, .session-list article { grid-template-columns: auto minmax(0,1fr); }
		.security-row .status, .session-list .status, .session-list .command { grid-column: 1 / -1; width: 100%; }
		.command { width: 100%; }
	}
	@keyframes spin { to { transform: rotate(360deg); } }
	@media (prefers-reduced-motion: reduce) {
		.account-loading span, .spin { animation: none; }
		.command, .icon-command { transition: none; }
	}
</style>
