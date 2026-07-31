<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";
import Alert from "../ui/Alert.svelte";
import Button from "../ui/Button.svelte";
import StatusBadge from "../ui/StatusBadge.svelte";
import TextField from "../ui/TextField.svelte";
import ThemeToggle from "../ui/ThemeToggle.svelte";
import Toggle from "../ui/Toggle.svelte";
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
	deletionRequestedAt?: string;
	deletionReviewStatus?: string;
	deletionScheduledFor?: string;
};

type SensitiveAction =
	| "change-password"
	| "change-email"
	| "enable-2fa"
	| "disable-2fa"
	| "export-data"
	| "delete-account";

type PanelId =
	| "profile"
	| "security"
	| "sessions"
	| "privacy"
	| "notifications"
	| "danger";

type NavGroupId = "identity" | "access" | "preferences" | "account";

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
let activePanel = $state<PanelId>("profile");
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
let savedDisplayName = $state("");
let savedBio = $state("");
let savedPrivacy = $state("");
let savedNotifications = $state("");
let mobileMenuOpen = $state(false);
let sensitiveAction = $state<SensitiveAction | null>(null);
let modalStep = $state<"intro" | "code" | "details" | "confirm" | "success">(
	"intro",
);
let verificationCode = $state("");
let verificationToken = $state("");
let confirmationText = $state("");
let modalBusy = $state(false);
let modalError = $state("");
let newEmail = $state("");
let disableTotpCode = $state("");
let deletionTotpCode = $state("");
let scheduledDeletion = $state("");
let passwordCleanupToken = $state("");
let accountContentElement: HTMLDivElement;
let accountNavElement: HTMLElement;
let expandedNavGroup = $state<NavGroupId | null>("identity");

let profileChanged = $derived(
	displayName !== savedDisplayName || bio !== savedBio,
);
let privacyChanged = $derived(JSON.stringify(privacy) !== savedPrivacy);
let notificationsChanged = $derived(
	JSON.stringify(notifications) !== savedNotifications,
);

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

const navGroups = [
	{
		id: "identity",
		label: "Identity",
		icon: "material-symbols:badge-outline-rounded",
		panels: [panels[0]],
	},
	{
		id: "access",
		label: "Access",
		icon: "material-symbols:shield-outline-rounded",
		panels: [panels[1], panels[2]],
	},
	{
		id: "preferences",
		label: "Preferences",
		icon: "material-symbols:tune-rounded",
		panels: [panels[3], panels[4]],
	},
	{
		id: "account",
		label: "Account",
		icon: "material-symbols:manage-accounts-outline-rounded",
		panels: [panels[5]],
	},
] as const;

const actionCopy: Record<
	SensitiveAction,
	{ title: string; description: string; phrase?: string }
> = {
	"change-password": {
		title: "Change password",
		description:
			"Verify your email before entering your current and new password.",
	},
	"change-email": {
		title: "Change email",
		description: "Verify your current email before replacing it.",
	},
	"enable-2fa": {
		title: "Enable two-factor authentication",
		description: "Verify your email before connecting an authenticator app.",
	},
	"disable-2fa": {
		title: "Disable two-factor authentication",
		description: "Verify your email, then enter an authenticator code.",
	},
	"export-data": {
		title: "Export account data",
		description: "Verify your email before creating a private JSON export.",
	},
	"delete-account": {
		title: "Request account deletion",
		description:
			"Verify your email and authenticator code before sending this request for administrator review.",
		phrase: "DELETE ACCOUNT",
	},
};

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
	savedDisplayName = next.displayName;
	savedBio = next.bio;
}

function clearMessages() {
	error = "";
	notice = "";
}

function selectPanel(panelId: PanelId) {
	activePanel = panelId;
	expandedNavGroup =
		navGroups.find((group) =>
			group.panels.some((panel) => panel.id === panelId),
		)?.id ?? expandedNavGroup;
	mobileMenuOpen = false;
	clearMessages();
	requestAnimationFrame(() => {
		accountContentElement?.scrollTo({ top: 0 });
		accountNavElement?.scrollTo({ top: 0 });
	});
}

function toggleNavGroup(groupId: NavGroupId) {
	expandedNavGroup = expandedNavGroup === groupId ? null : groupId;
	requestAnimationFrame(() => accountNavElement?.scrollTo({ top: 0 }));
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
	savedPrivacy = JSON.stringify(preferenceResult.privacy);
	savedNotifications = JSON.stringify(preferenceResult.notifications);
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

async function startAccount2FA(proof: string) {
	submitting = true;
	clearMessages();
	try {
		const result = await apiFetch<{
			setup_token: string;
			secret: string;
			uri: string;
		}>("/accounts/2fa/setup/start", {
			method: "POST",
			csrf: true,
			body: JSON.stringify({ verification_token: proof }),
		});
		setupToken = result.setup_token;
		totpSecret = result.secret;
		totpUri = result.uri;
	} catch (reason) {
		error =
			reason instanceof Error ? reason.message : "Could not start 2FA setup";
		throw reason;
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
		savedPrivacy = JSON.stringify(result.privacy);
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
		savedNotifications = JSON.stringify(result.notifications);
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
		throw reason;
	}
}

async function dangerAction(proof = "") {
	submitting = true;
	clearMessages();
	try {
		await apiFetch("/accounts/danger/delete", {
			method: "POST",
			csrf: true,
			body: JSON.stringify({
				confirmation: dangerConfirmation,
				verification_token: proof,
				two_factor_code: deletionTotpCode,
			}),
		});
		scheduledDeletion =
			"Deletion request submitted. Waiting for administrator review.";
		dangerConfirmation = "";
		notice = "Danger-zone action completed.";
		const profile = await apiFetch<{ user: AccountUser }>("/accounts/profile");
		applyUser(profile.user);
	} catch (reason) {
		error =
			reason instanceof Error ? reason.message : "Danger-zone action failed";
		throw reason;
	} finally {
		submitting = false;
	}
}

function openSensitive(action: SensitiveAction) {
	sensitiveAction = action;
	modalStep = "intro";
	verificationCode = "";
	verificationToken = "";
	confirmationText = "";
	currentPassword = "";
	newPassword = "";
	newEmail = user?.email ?? "";
	disableTotpCode = "";
	deletionTotpCode = "";
	modalError = "";
}

function closeSensitive() {
	if (modalBusy) return;
	sensitiveAction = null;
}

async function sendSensitiveCode() {
	if (!sensitiveAction) return;
	modalBusy = true;
	modalError = "";
	try {
		await apiFetch("/accounts/security/email/request", {
			method: "POST",
			csrf: true,
			body: JSON.stringify({ action: sensitiveAction }),
		});
		modalStep = "code";
	} catch (reason) {
		modalError =
			reason instanceof Error
				? reason.message
				: "Could not send verification code";
	} finally {
		modalBusy = false;
	}
}

async function verifySensitiveCode() {
	if (!sensitiveAction) return;
	modalBusy = true;
	modalError = "";
	try {
		const result = await apiFetch<{ verificationToken: string }>(
			"/accounts/security/email/verify",
			{
				method: "POST",
				csrf: true,
				body: JSON.stringify({
					action: sensitiveAction,
					code: verificationCode,
				}),
			},
		);
		verificationToken = result.verificationToken;
		modalStep = actionCopy[sensitiveAction].phrase ? "confirm" : "details";
	} catch (reason) {
		modalError =
			reason instanceof Error ? reason.message : "Verification failed";
	} finally {
		modalBusy = false;
	}
}

function downloadExport(data: unknown) {
	const blob = new Blob([JSON.stringify(data, null, 2)], {
		type: "application/json",
	});
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `silentflare-account-${new Date().toISOString().slice(0, 10)}.json`;
	link.click();
	URL.revokeObjectURL(url);
}

async function completeSensitiveAction() {
	if (!sensitiveAction || !verificationToken) return;
	modalBusy = true;
	modalError = "";
	clearMessages();
	try {
		if (sensitiveAction === "change-password") {
			const result = await apiFetch<{ sessionCleanupToken: string }>(
				"/accounts/security/password",
				{
					method: "POST",
					csrf: true,
					body: JSON.stringify({
						current_password: currentPassword,
						new_password: newPassword,
						verification_token: verificationToken,
					}),
				},
			);
			passwordCleanupToken = result.sessionCleanupToken;
			if (user) user = { ...user, hasPassword: true };
		} else if (sensitiveAction === "change-email") {
			const result = await apiFetch<{ email: string }>(
				"/accounts/security/email",
				{
					method: "PATCH",
					csrf: true,
					body: JSON.stringify({
						new_email: newEmail,
						verification_token: verificationToken,
					}),
				},
			);
			if (user) user = { ...user, email: result.email };
		} else if (sensitiveAction === "enable-2fa") {
			await startAccount2FA(verificationToken);
		} else if (sensitiveAction === "disable-2fa") {
			await apiFetch("/accounts/2fa/disable", {
				method: "POST",
				csrf: true,
				body: JSON.stringify({
					code: disableTotpCode,
					verification_token: verificationToken,
				}),
			});
			if (user) user = { ...user, twoFactorEnabled: false };
		} else if (sensitiveAction === "export-data") {
			const result = await apiFetch("/accounts/security/export", {
				method: "POST",
				csrf: true,
				body: JSON.stringify({ verification_token: verificationToken }),
			});
			downloadExport(result);
		} else {
			dangerConfirmation = actionCopy[sensitiveAction].phrase ?? "";
			await dangerAction(verificationToken);
		}
		modalStep = "success";
		notice =
			sensitiveAction === "delete-account"
				? "Deletion request submitted for administrator review."
				: `${actionCopy[sensitiveAction].title} completed.`;
		await loadAccountExtras();
	} catch (reason) {
		modalError = reason instanceof Error ? reason.message : "Action failed";
	} finally {
		modalBusy = false;
	}
}

async function cancelDeletion() {
	submitting = true;
	clearMessages();
	try {
		await apiFetch("/accounts/danger/delete/cancel", {
			method: "POST",
			csrf: true,
			body: "{}",
		});
		scheduledDeletion = "";
		if (user)
			user = {
				...user,
				deletionRequestedAt: "",
				deletionReviewStatus: "",
				deletionScheduledFor: "",
			};
		notice = "Account deletion request cancelled.";
	} catch (reason) {
		error =
			reason instanceof Error ? reason.message : "Could not cancel deletion";
	} finally {
		submitting = false;
	}
}

async function logoutOtherSessions() {
	if (!passwordCleanupToken) return;
	modalBusy = true;
	modalError = "";
	try {
		await apiFetch("/accounts/sessions/logout-others", {
			method: "POST",
			csrf: true,
			body: JSON.stringify({ verification_token: passwordCleanupToken }),
		});
		passwordCleanupToken = "";
		notice = "Password updated and other devices signed out.";
		await loadAccountExtras();
	} catch (reason) {
		modalError =
			reason instanceof Error
				? reason.message
				: "Could not sign out other devices";
	} finally {
		modalBusy = false;
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
		<div class="account-theme-command"><ThemeToggle /></div>
		<main class="accounts-workspace">
			<div class="account-frame panel">
				<aside class="identity-card">
					<div class="identity-summary">
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
						<button
							class="mobile-menu-command"
							type="button"
							aria-label={mobileMenuOpen ? "Close account menu" : "Open account menu"}
							aria-expanded={mobileMenuOpen}
							aria-controls="account-navigation"
							onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
						>
							<Icon icon={mobileMenuOpen ? "material-symbols:close-rounded" : "material-symbols:menu-rounded"} />
							<span>{mobileMenuOpen ? "Close menu" : "Account menu"}</span>
						</button>
					</div>
					<nav
						id="account-navigation"
						bind:this={accountNavElement}
						class:open={mobileMenuOpen}
						class="account-nav"
						aria-label="Account sections"
					>
						{#each navGroups as group}
							<section class:expanded={expandedNavGroup === group.id} class="nav-group">
								<button
									class="nav-group-toggle"
									type="button"
									aria-expanded={expandedNavGroup === group.id}
									aria-controls={`account-nav-${group.id}`}
									onclick={() => toggleNavGroup(group.id)}
								>
									<Icon icon={group.icon} />
									<span>{group.label}</span>
									<span class="nav-group-chevron"><Icon icon="material-symbols:expand-more-rounded" /></span>
								</button>
								<div
									id={`account-nav-${group.id}`}
									class="nav-group-collapse"
									aria-hidden={expandedNavGroup !== group.id}
									inert={expandedNavGroup !== group.id}
								>
									<div class="nav-group-clip">
										<div class="nav-group-items">
											{#each group.panels as panel}
												<button
													type="button"
													class:active={activePanel === panel.id}
													aria-current={activePanel === panel.id ? "page" : undefined}
													onclick={() => selectPanel(panel.id)}
												>
													<Icon icon={panel.icon} />
													<span>{panel.label}</span>
												</button>
											{/each}
										</div>
									</div>
								</div>
							</section>
						{/each}
						<button class="sidebar-logout" type="button" onclick={() => void logout()}>
							<Icon icon="material-symbols:logout-rounded" />
							<span>Sign out</span>
						</button>
					</nav>
				</aside>

				<div class="account-content" bind:this={accountContentElement}>
					{#key activePanel}
						<div class="panel-view">
						{#if activePanel === "profile"}
						<section class="account-card split-card">
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
								<TextField label="Display name" bind:value={displayName} maxlength={80} autocomplete="name" />
								<div class="readonly-field">
									<span>Region</span>
									<div>
										{#if flagUrl(displayRegionCode)}<img src={flagUrl(displayRegionCode)} alt="" />{:else}<Icon icon="material-symbols:public-rounded" />{/if}
										<strong>{displayRegion || "Region unavailable"}</strong>
									</div>
									<small>Updated automatically from your current connection.</small>
								</div>
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
								<Button type="submit" icon="material-symbols:save-outline-rounded" loading={submitting} disabled={!profileChanged}>Save profile</Button>
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
						<section class="account-card">
							<div class="section-heading">
								<span class="section-icon"><Icon icon="material-symbols:shield-lock-outline-rounded" /></span>
								<div><p class="eyebrow">Security</p><h3>Sign-in protection</h3></div>
							</div>
							<p class="group-label">Sensitive operations / email verification required</p>
							<div class="security-list">
								<div class="security-row"><span class="row-icon"><Icon icon="material-symbols:alternate-email-rounded" /></span><div><strong>Email address</strong><p>{user.email}</p></div><button class="command secondary" type="button" onclick={() => openSensitive("change-email")}>Change</button></div>
								<div class="security-row"><span class="row-icon"><Icon icon="material-symbols:key-outline-rounded" /></span><div><strong>Password</strong><p>{user.hasPassword ? "Password login is available" : "Email-code login only"}</p></div><button class="command secondary" type="button" onclick={() => openSensitive("change-password")}>{user.hasPassword ? "Change" : "Set password"}</button></div>
								<div class="security-row"><span class="row-icon"><Icon icon="material-symbols:phonelink-lock-outline-rounded" /></span><div><strong>Two-factor authentication</strong><p>Authenticator challenge after primary login</p></div><button class={user.twoFactorEnabled ? "command subtle-danger" : "command secondary"} type="button" onclick={() => openSensitive(user.twoFactorEnabled ? "disable-2fa" : "enable-2fa")}>{user.twoFactorEnabled ? "Disable" : "Enable"}</button></div>
							</div>
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
						<section class="account-card">
							<div class="section-heading">
								<span class="section-icon"><Icon icon="material-symbols:devices-outline-rounded" /></span>
								<div><p class="eyebrow">Sessions</p><h3>Logged-in devices</h3></div>
							</div>
							<div class="session-list">
								{#if sessions.length === 0}
									<div class="empty-state"><Icon icon="material-symbols:devices-outline-rounded" /><div><strong>No active sessions found</strong><p>New sign-ins will appear here with device and activity details.</p></div></div>
								{/if}
								{#each sessions as session}
									<article>
										<span class="row-icon"><Icon icon={session.current ? "material-symbols:computer-outline-rounded" : "material-symbols:devices-outline-rounded"} /></span>
										<div>
											<strong>{session.device} on {session.platform}</strong>
											<p>{session.region} / Last active {formatTime(session.lastActiveAt)}</p>
											<small>Created {formatTime(session.createdAt)} / Expires {formatTime(session.expiresAt)}</small>
										</div>
									{#if session.current}
										<StatusBadge tone="success" label="Current" />
										{:else}
											<button class="command secondary" type="button" onclick={() => void revokeSession(session.id)}>Sign out</button>
										{/if}
									</article>
								{/each}
							</div>
							<div class="risk-action"><div><strong>Sign out all devices</strong><p>Ends every active session, including this one.</p></div><button class="command subtle-danger" type="button" onclick={() => void logoutAll()}><Icon icon="material-symbols:logout-rounded" />Sign out all</button></div>
						</section>
					{:else if activePanel === "privacy"}
						<section class="account-card">
							<div class="section-heading">
								<span class="section-icon"><Icon icon="material-symbols:visibility-lock-outline-rounded" /></span>
								<div><p class="eyebrow">Privacy</p><h3>Public visibility</h3></div>
							</div>
							<div class="toggle-list">
								<Toggle label="Public profile" description="Allow your profile preview to be visible." bind:checked={privacy.profilePublic} />
								<Toggle label="Show region" description="Display API-owned city and country data on your profile." bind:checked={privacy.showRegion} />
								<Toggle label="Show comment record" description="Allow public surfaces to reference your comments." bind:checked={privacy.showComments} />
								<Toggle label="Allow search" description="Let account search discover your public profile." bind:checked={privacy.allowSearch} />
							</div>
							<div class="card-actions"><Button icon="material-symbols:save-outline-rounded" loading={submitting} disabled={!privacyChanged} onclick={() => void savePrivacy()}>Save privacy</Button></div>
						</section>
						<section class="account-card account-card-secondary">
							<div class="section-heading"><span class="section-icon"><Icon icon="material-symbols:download-rounded" /></span><div><p class="eyebrow">Sensitive operation</p><h3>Data export</h3></div></div>
							<div class="risk-action"><div><strong>Download a JSON copy</strong><p>Includes your profile, preferences, and comment history. Email verification is required.</p></div><button class="command secondary" type="button" onclick={() => openSensitive("export-data")}><Icon icon="material-symbols:download-rounded" />Export data</button></div>
						</section>
					{:else if activePanel === "notifications"}
						<section class="account-card">
							<div class="section-heading">
								<span class="section-icon"><Icon icon="material-symbols:notifications-outline-rounded" /></span>
								<div><p class="eyebrow">Notifications</p><h3>Email and system signals</h3></div>
							</div>
							<div class="toggle-list">
								<Toggle label="Security notifications" description="Password, session, and 2FA changes." bind:checked={notifications.securityEmail} />
								<Toggle label="Comment replies" description="Replies to your blog comments." bind:checked={notifications.commentReplies} />
								<Toggle label="System notifications" description="Important account and policy updates." bind:checked={notifications.systemEmail} />
								<Toggle label="Email announcements" description="Occasional SilentFlare updates." bind:checked={notifications.marketingEmail} />
							</div>
							<Button icon="material-symbols:save-outline-rounded" loading={submitting} disabled={!notificationsChanged} onclick={() => void saveNotifications()}>Save notifications</Button>
						</section>
					{:else}
						<div class="danger-grid">
							<section class="account-card danger-card"><div class="danger-copy"><span class="section-icon danger-icon"><Icon icon="material-symbols:delete-forever-outline-rounded" /></span><div><h3>Delete account</h3><p>Email verification and two-factor authentication are both required. An administrator must approve every deletion request.</p>{#if !user.twoFactorEnabled}<p class="scheduled">Enable two-factor authentication in Security before requesting deletion.</p>{:else if scheduledDeletion || user.deletionRequestedAt}<p class="scheduled">{scheduledDeletion || (user.deletionReviewStatus === "approved" && user.deletionScheduledFor ? `Approved. Scheduled for ${formatTime(user.deletionScheduledFor)}` : "Deletion request is waiting for administrator review.")}</p>{/if}</div></div>{#if scheduledDeletion || user.deletionRequestedAt}<button class="command secondary" type="button" onclick={() => void cancelDeletion()} disabled={submitting}>Cancel request</button>{:else}<button class="command danger" type="button" onclick={() => openSensitive("delete-account")} disabled={!user.twoFactorEnabled}>Request deletion</button>{/if}</section>
						</div>
						{/if}
						</div>
					{/key}

					{#if error}<Alert tone="error" message={error} />{/if}
					{#if notice}<Alert tone="success" message={notice} />{/if}
				</div>
			</div>

			{#if sensitiveAction}
				<div class="modal-backdrop" role="presentation" onclick={(event) => event.currentTarget === event.target && closeSensitive()}>
					<section class="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
						<header class="modal-header">
							<div><p class="eyebrow">Protected action</p><h2 id="confirm-title">{actionCopy[sensitiveAction].title}</h2></div>
							<button class="icon-command" type="button" aria-label="Close" onclick={closeSensitive} disabled={modalBusy}><Icon icon="material-symbols:close-rounded" /></button>
						</header>
						<p class="modal-description">{actionCopy[sensitiveAction].description}</p>

						{#if modalStep === "intro"}
							<div class="verification-note"><Icon icon="material-symbols:mark-email-read-outline-rounded" /><div><strong>Verify {user.email}</strong><p>We will send a six-digit code. It expires shortly and works only for this action.</p></div></div>
							<div class="modal-actions"><button class="command secondary" type="button" onclick={closeSensitive}>Cancel</button><button class="command primary" type="button" onclick={() => void sendSensitiveCode()} disabled={modalBusy || !emailConfigured}>{modalBusy ? "Sending..." : "Send verification code"}</button></div>
						{:else if modalStep === "code"}
							<label>Email verification code<input class="auth-input code-input" inputmode="numeric" autocomplete="one-time-code" maxlength="6" bind:value={verificationCode} placeholder="000000" /></label>
							<div class="modal-actions"><button class="command secondary" type="button" onclick={() => void sendSensitiveCode()} disabled={modalBusy}>Send again</button><button class="command primary" type="button" onclick={() => void verifySensitiveCode()} disabled={modalBusy || verificationCode.length !== 6}>{modalBusy ? "Verifying..." : "Verify code"}</button></div>
						{:else if modalStep === "details"}
							{#if sensitiveAction === "change-password"}
								<div class="modal-fields"><label>Current password<input class="auth-input" type="password" bind:value={currentPassword} autocomplete="current-password" placeholder={user.hasPassword ? "Current password" : "Not required for email-code accounts"} /></label><label>New password<input class="auth-input" type="password" bind:value={newPassword} autocomplete="new-password" minlength="8" /></label></div>
							{:else if sensitiveAction === "change-email"}
								<label>New email address<input class="auth-input" type="email" bind:value={newEmail} autocomplete="email" /></label>
							{:else if sensitiveAction === "disable-2fa"}
								<label>Authenticator code<input class="auth-input code-input" inputmode="numeric" maxlength="6" bind:value={disableTotpCode} placeholder="000000" /></label>
							{:else if sensitiveAction === "enable-2fa"}
								<div class="verification-note"><Icon icon="material-symbols:verified-user-outline-rounded" /><div><strong>Email verified</strong><p>Continue to connect your authenticator app.</p></div></div>
							{:else}
								<div class="verification-note"><Icon icon="material-symbols:download-rounded" /><div><strong>Ready to export</strong><p>Your download is created locally after the API returns your data.</p></div></div>
							{/if}
							<div class="modal-actions"><button class="command secondary" type="button" onclick={closeSensitive}>Cancel</button><button class="command primary" type="button" onclick={() => void completeSensitiveAction()} disabled={modalBusy || (sensitiveAction === "change-password" && (newPassword.length < 8 || (user.hasPassword && !currentPassword))) || (sensitiveAction === "change-email" && (!newEmail.includes("@") || newEmail === user.email)) || (sensitiveAction === "disable-2fa" && disableTotpCode.length !== 6)}>{modalBusy ? "Working..." : "Continue"}</button></div>
						{:else if modalStep === "confirm"}
							<div class="confirmation-warning"><Icon icon="material-symbols:warning-outline-rounded" /><p>Type <strong>{actionCopy[sensitiveAction].phrase}</strong> to confirm. This is the final step.</p></div>
							{#if sensitiveAction === "delete-account"}<label>Authenticator code<input class="auth-input code-input" inputmode="numeric" autocomplete="one-time-code" maxlength="6" bind:value={deletionTotpCode} placeholder="000000" /></label>{/if}
							<label>Confirmation text<input class="auth-input" bind:value={confirmationText} autocomplete="off" /></label>
							<div class="modal-actions"><button class="command secondary" type="button" onclick={closeSensitive}>Cancel</button><button class="command danger" type="button" onclick={() => void completeSensitiveAction()} disabled={modalBusy || confirmationText !== actionCopy[sensitiveAction].phrase || (sensitiveAction === "delete-account" && deletionTotpCode.length !== 6)}>{modalBusy ? "Working..." : actionCopy[sensitiveAction].title}</button></div>
						{:else}
							<div class="success-state"><Icon icon="material-symbols:check-circle-outline-rounded" /><strong>{sensitiveAction === "delete-account" ? "Deletion request submitted" : "Action completed"}</strong><p>{sensitiveAction === "delete-account" ? "Your request is waiting for administrator review. You can cancel it from Danger Zone." : "Your account settings are up to date."}</p></div>
							<div class="modal-actions">{#if sensitiveAction === "change-password" && passwordCleanupToken}<button class="command subtle-danger" type="button" onclick={() => void logoutOtherSessions()} disabled={modalBusy}>Sign out other devices</button>{/if}<button class="command primary" type="button" onclick={closeSensitive}>Done</button></div>
						{/if}
						{#if modalError}<p class="message error" aria-live="polite"><Icon icon="material-symbols:error-outline-rounded" />{modalError}</p>{/if}
					</section>
				</div>
			{/if}
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
	.accounts-stage {
		position: relative;
		min-height: 100svh;
		display: flex;
		flex-direction: column;
		overflow-x: hidden;
		padding: 1rem;
		color: var(--sf-text);
		background: var(--sf-page);
	}
	:global(.dark) .accounts-stage {
		background: var(--sf-page);
		color: var(--sf-text);
	}
	.accounts-workspace {
		width: min(100%, 78rem);
		margin: auto;
		padding-top: 3.75rem;
	}
	.account-theme-command {
		position: absolute;
		z-index: 10;
		top: 1rem;
		right: 1rem;
	}
	.wordmark {
		display: inline-flex;
		align-items: center;
		gap: 0.65rem;
		color: inherit;
		font-weight: 800;
		text-decoration: none;
	}
	.wordmark span {
		width: 2rem;
		height: 2rem;
		display: grid;
		place-items: center;
		border-radius: 0.6rem;
		background: var(--primary, #4b9fe8);
		color: white;
		box-shadow: 0 0.5rem 1.2rem rgba(43, 126, 190, 0.24);
	}
	.panel {
		border: 1px solid var(--sf-border);
		border-radius: var(--sf-radius-lg);
		background: var(--sf-surface);
		box-shadow: 0 0.75rem 2.5rem rgba(28, 53, 79, 0.06);
	}
	.account-frame {
		display: grid;
		gap: 1rem;
	}
	.identity-card,
	.account-card {
		padding: clamp(1.15rem, 3vw, 1.75rem);
	}
	.identity-card {
		min-width: 0;
		text-align: left;
		box-shadow: 0 1.6rem 3.5rem rgba(28, 53, 79, 0.1);
	}
	.identity-summary {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: 0.75rem;
	}
	.avatar-shell {
		position: relative;
		grid-row: 1 / span 3;
		width: 3.75rem;
		height: 3.75rem;
		margin: 0;
	}
	.avatar,
	.preview-avatar {
		display: grid;
		place-items: center;
		overflow: hidden;
		border-radius: 50%;
		background: var(--btn-regular-bg, #e8f3ff);
		color: var(--primary, #388bd3);
		font-weight: 800;
	}
	.avatar {
		width: 100%;
		height: 100%;
		border: 0.2rem solid var(--primary, #4b9fe8);
		box-shadow:
			0 0 0 0.45rem rgba(75, 159, 232, 0.12),
			0 0.8rem 2rem rgba(40, 90, 130, 0.13);
		font-size: 1.2rem;
	}
	.avatar img,
	.preview-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.avatar-camera {
		position: absolute;
		right: -0.15rem;
		bottom: 0.25rem;
		width: 2.75rem;
		height: 2.75rem;
		display: grid;
		place-items: center;
		border: 0.2rem solid var(--sf-surface);
		border-radius: 50%;
		background: #182e49;
		color: white;
		cursor: pointer;
	}
	.avatar-camera input,
	.command input {
		position: absolute;
		width: 1px;
		height: 1px;
		opacity: 0;
		pointer-events: none;
	}
	.identity-summary h1 {
		grid-column: 2;
		margin: 0;
		overflow-wrap: anywhere;
		font-size: 1.1rem;
		line-height: 1.08;
		letter-spacing: 0;
	}
	.identity-summary > .eyebrow {
		display: none;
	}
	.identity-summary > .handle {
		grid-column: 2;
		margin: 0.15rem 0 0;
	}
	.handle,
	.muted {
		color: var(--sf-text-muted);
	}
	.region-pill {
		display: inline-flex;
		min-height: 2.35rem;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		max-width: 100%;
		grid-column: 2;
		width: 100%;
		margin: 0;
		padding: 0 0.75rem;
		box-sizing: border-box;
		border: 1px solid rgba(75, 159, 232, 0.12);
		border-radius: 999px;
		background: var(--sf-surface-muted);
		color: var(--sf-text-muted);
		font-size: 0.82rem;
		font-weight: 700;
	}
	.region-pill span {
		min-width: 0;
		overflow-wrap: anywhere;
	}
	.region-pill img,
	.preview-region img {
		width: 1.15rem;
		height: 1.15rem;
		border-radius: 50%;
		object-fit: cover;
	}
	.account-nav {
		max-height: 0;
		display: grid;
		gap: 0.35rem;
		overflow: hidden;
		visibility: hidden;
		margin-top: 0;
		padding-top: 0;
		border-top: 1px solid transparent;
		opacity: 0;
		text-align: left;
		transform: translateY(-0.35rem);
		transition:
			max-height 0.24s ease,
			margin-top 0.24s ease,
			padding-top 0.24s ease,
			border-color 0.2s ease,
			opacity 0.16s ease,
			transform 0.2s ease,
			visibility 0s linear 0.24s;
	}
	.account-nav.open {
		max-height: 70rem;
		overflow: visible;
		visibility: visible;
		margin-top: 1rem;
		padding-top: 1rem;
		border-top-color: var(--line-divider, rgba(70, 100, 130, 0.12));
		opacity: 1;
		transform: translateY(0);
		transition-delay: 0s;
	}
	.nav-group {
		min-width: 0;
	}
	.nav-group-toggle {
		width: 100%;
		min-height: 2.75rem;
		display: flex;
		align-items: center;
		gap: 0.55rem;
		border: 0;
		padding: 0 0.75rem;
		background: transparent;
		color: var(--sf-text-soft);
		font-size: 0.72rem;
		font-weight: 800;
		text-transform: uppercase;
		cursor: pointer;
	}
	.nav-group-toggle:hover {
		color: var(--sf-text);
	}
	.nav-group-toggle > :global(svg) {
		flex: none;
		width: 1.1rem;
		height: 1.1rem;
	}
	.nav-group-chevron {
		width: 1.5rem;
		height: 1.5rem;
		display: grid;
		place-items: center;
		margin-left: auto;
		transition: transform 0.22s ease;
	}
	.nav-group.expanded .nav-group-chevron {
		transform: rotate(180deg);
	}
	.nav-group-collapse {
		display: grid;
		grid-template-rows: 0fr;
		opacity: 0;
		transform: translateY(-0.25rem);
		transition:
			grid-template-rows 0.22s ease,
			opacity 0.16s ease,
			transform 0.22s ease;
	}
	.nav-group.expanded .nav-group-collapse {
		grid-template-rows: 1fr;
		opacity: 1;
		transform: translateY(0);
	}
	.nav-group-clip {
		min-height: 0;
		overflow: hidden;
	}
	.nav-group-items {
		display: grid;
		gap: 0.2rem;
		padding: 0 0 0.5rem 0.65rem;
		border-left: 1px solid var(--sf-border);
	}
	.mobile-menu-command {
		grid-column: 3;
		grid-row: 1 / span 3;
		min-width: 2.75rem;
		min-height: 2.75rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		border: 1px solid var(--sf-border);
		border-radius: 0.7rem;
		background: var(--sf-surface);
		color: inherit;
		font-weight: 800;
		cursor: pointer;
	}
	.mobile-menu-command span {
		display: none;
	}
	.account-nav button {
		min-height: 2.9rem;
		display: flex;
		align-items: center;
		gap: 0.65rem;
		border: 0;
		border-radius: 0.7rem;
		padding: 0 0.8rem;
		background: transparent;
		color: var(--sf-text-muted);
		font-weight: 800;
		cursor: pointer;
		transition:
			background-color 0.16s ease,
			color 0.16s ease,
			transform 0.16s ease;
	}
	.account-nav button:hover {
		background: var(--sf-surface-muted);
		transform: translateX(2px);
	}
	.account-nav button.active {
		background: var(--sf-accent-soft);
		color: var(--sf-accent-strong);
	}
	.account-nav .sidebar-logout {
		margin-top: 0.65rem;
		border-radius: 999px;
		padding-top: 0;
		color: var(--sf-danger);
	}
	.account-nav .sidebar-logout:hover {
		background: var(--sf-danger-soft);
	}
	.account-content {
		min-width: 0;
		display: grid;
		gap: 1rem;
	}
	.panel-view {
		min-width: 0;
		display: grid;
		gap: 1rem;
		animation: panel-enter 0.22s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	.page-heading {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 0.35rem 0.15rem 0.2rem;
	}
	.page-heading h2 {
		margin: 0;
		font-size: 1.75rem;
		line-height: 1.15;
		letter-spacing: 0;
	}
	.page-heading p {
		max-width: 62ch;
		margin: 0.35rem 0 0;
		color: var(--text-75, #617386);
		line-height: 1.55;
	}
	.status {
		display: inline-flex;
		align-items: center;
		min-height: 2rem;
		border-radius: 999px;
		padding: 0 0.65rem;
		background: var(--btn-regular-bg, #e9f0f6);
		color: var(--text-75, #52677b);
		font-size: 0.72rem;
		font-weight: 800;
		text-transform: uppercase;
		white-space: nowrap;
	}
	.section-heading {
		display: flex;
		align-items: flex-start;
		gap: 0.9rem;
		margin-bottom: 1.35rem;
	}
	.section-icon,
	.row-icon {
		flex: none;
		display: grid;
		place-items: center;
		color: var(--primary, #317dc1);
		background: var(--btn-regular-bg, #e8f3ff);
	}
	.section-icon {
		width: 2.75rem;
		height: 2.75rem;
		border-radius: 0.75rem;
		font-size: 1.35rem;
	}
	.row-icon {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 0.7rem;
		font-size: 1.2rem;
	}
	.eyebrow {
		margin: 0 0 0.4rem;
		color: var(--primary, #428ed1);
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0;
		text-transform: uppercase;
	}
	h3 {
		margin: 0;
		font-size: 1.45rem;
		line-height: 1.12;
		letter-spacing: 0;
	}
	.form-stack {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.readonly-field {
		display: grid;
		gap: 0.5rem;
		color: var(--sf-text);
		font-weight: 800;
	}
	.readonly-field > div {
		min-height: var(--sf-control-height);
		display: flex;
		align-items: center;
		gap: 0.65rem;
		padding: 0.65rem 0.8rem;
		border: 1px solid var(--sf-border);
		border-radius: var(--sf-radius-md);
		background: var(--sf-surface-subtle);
	}
	.readonly-field img,
	.readonly-field :global(svg) {
		flex: none;
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 50%;
	}
	.readonly-field small {
		color: var(--sf-text-muted);
		font-size: 0.78rem;
		font-weight: 500;
		line-height: 1.4;
	}
	label {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-weight: 800;
	}
	.auth-input {
		box-sizing: border-box;
		width: 100%;
		min-height: 2.9rem;
		border: 1px solid var(--line-divider, rgba(70, 100, 130, 0.18));
		border-radius: 0.65rem;
		padding: 0.65rem 0.8rem;
		background: var(--sf-surface);
		color: var(--sf-text);
		font: inherit;
		outline: none;
		transition:
			border-color 0.16s ease,
			box-shadow 0.16s ease;
	}
	.auth-input:focus {
		border-color: var(--primary, #4b9fe8);
		box-shadow: 0 0 0 0.22rem rgba(75, 159, 232, 0.14);
	}
	.bio-input {
		min-height: 8rem;
		resize: vertical;
	}
	.field-count {
		align-self: flex-end;
		color: var(--text-50, #7a8795);
		font-size: 0.75rem;
		font-weight: 500;
	}
	.avatar-actions {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 10rem));
		gap: 0.6rem;
	}
	.avatar-actions .command {
		width: 100%;
		min-width: 0;
		flex-direction: row;
		white-space: nowrap;
	}
	.command,
	.icon-command {
		min-width: 2.75rem;
		min-height: 2.75rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.55rem;
		border-radius: 0.7rem;
		font-weight: 800;
		cursor: pointer;
		transition:
			transform 0.16s ease,
			background-color 0.16s ease,
			border-color 0.16s ease;
	}
	.command {
		width: max-content;
		padding: 0 1rem;
		border: 1px solid transparent;
		white-space: nowrap;
	}
	.command:hover,
	.icon-command:hover {
		transform: translateY(-1px);
	}
	.command.primary {
		background: var(--sf-accent-soft);
		color: var(--sf-accent-strong);
	}
	.command.secondary,
	.icon-command {
		border: 1px solid var(--sf-border-strong);
		background: var(--sf-surface);
		color: var(--sf-text);
	}
	.command.subtle-danger {
		border: 1px solid color-mix(in srgb, var(--sf-danger) 32%, var(--sf-border));
		background: var(--sf-danger-soft);
		color: var(--sf-danger);
	}
	.command.danger {
		background: #aa2d2d;
		color: white;
	}
	.icon-command {
		padding: 0;
		font-size: 1.3rem;
	}
	.command:disabled,
	.icon-command:disabled {
		cursor: not-allowed;
		opacity: 0.55;
		transform: none;
	}
	.command:focus-visible,
	.icon-command:focus-visible,
	.account-nav button:focus-visible,
	.nav-group-toggle:focus-visible,
	.mobile-menu-command:focus-visible,
	.toggle-list input:focus-visible,
	.avatar-camera:focus-within {
		outline: 3px solid rgba(50, 139, 214, 0.35);
		outline-offset: 2px;
	}
	.split-card {
		display: grid;
		gap: 1.5rem;
	}
	.profile-preview {
		min-width: 0;
		padding-top: 1.25rem;
		border-top: 1px solid var(--sf-border);
	}
	.preview-card {
		padding: 1.2rem;
		border: 0;
		border-radius: 0;
		background: transparent;
		text-align: center;
	}
	.preview-avatar {
		width: 4.5rem;
		height: 4.5rem;
		margin: 0 auto 0.8rem;
		font-size: 1.4rem;
	}
	.preview-card h4 {
		margin: 0;
		overflow-wrap: anywhere;
		font-size: 1.2rem;
	}
	.preview-card p {
		margin: 0.25rem 0 0.8rem;
		color: var(--text-75, #6c7b8c);
		overflow-wrap: anywhere;
	}
	.preview-region {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin-bottom: 0.8rem;
		color: var(--text-75, #52677b);
		font-size: 0.82rem;
		font-weight: 700;
	}
	blockquote {
		margin: 0;
		color: var(--sf-text);
		line-height: 1.6;
		overflow-wrap: anywhere;
	}
	.security-list,
	.session-list,
	.toggle-list {
		display: grid;
		gap: 0;
		overflow: hidden;
		margin-bottom: 1rem;
		border: 1px solid var(--line-divider, rgba(70, 100, 130, 0.12));
		border-radius: 0.8rem;
		background: var(--sf-surface-subtle);
	}
	.event-list {
		display: grid;
		gap: 0.7rem;
		margin-bottom: 1rem;
	}
	.group-label {
		margin: 0 0 0.75rem;
		color: var(--text-75, #657789);
		font-size: 0.78rem;
		font-weight: 800;
		text-transform: uppercase;
	}
	.security-row,
	.session-list article,
	.toggle-list label {
		display: grid;
		align-items: center;
		gap: 0.85rem;
		min-height: 4.75rem;
		padding: 0.9rem;
		border: 0;
		border-radius: 0;
		background: transparent;
		transition: background-color 0.16s ease;
	}
	.security-row + .security-row,
	.session-list article + article,
	.toggle-list label + label {
		border-top: 1px solid var(--line-divider, rgba(70, 100, 130, 0.12));
	}
	.security-row:hover,
	.session-list article:hover,
	.toggle-list label:hover {
		background: var(--sf-surface-muted);
	}
	.security-row,
	.session-list article {
		grid-template-columns: auto minmax(0, 1fr) auto;
	}
	.security-row p,
	.session-list p,
	.session-list small,
	.toggle-list small {
		margin: 0.25rem 0 0;
		overflow-wrap: anywhere;
		color: var(--text-75, #6c7b8c);
		font-size: 0.86rem;
		font-weight: 600;
		line-height: 1.45;
	}
	.status.good {
		background: #e5f6ec;
		color: #177248;
	}
	.totp-box,
	.event-list div {
		padding: 1rem;
		border: 1px solid var(--line-divider, rgba(70, 100, 130, 0.14));
		border-radius: 0.9rem;
		background: var(--btn-regular-bg, #f5f8fb);
	}
	.totp-box {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1rem;
	}
	.totp-box p,
	.event-list h4 {
		margin: 0;
		font-weight: 800;
	}
	.totp-box code {
		overflow-wrap: anywhere;
		padding: 0.8rem;
		border-radius: 0.7rem;
		background: rgba(112, 140, 166, 0.14);
		font-size: 1rem;
		letter-spacing: 0;
	}
	.totp-box a {
		min-height: 2.75rem;
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		color: var(--primary, #2c7cc2);
		font-weight: 700;
	}
	.code-input {
		text-align: center;
		font-size: 1.25rem;
		letter-spacing: 0;
	}
	.event-list {
		margin-top: 1.2rem;
	}
	.empty-state {
		min-height: 8rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.85rem;
		padding: 1.25rem;
		color: var(--sf-text-muted);
		text-align: left;
	}
	.empty-state > :global(svg) {
		flex: none;
		font-size: 1.75rem;
		color: var(--sf-accent-strong);
	}
	.empty-state p {
		margin: 0.25rem 0 0;
		font-size: 0.86rem;
		line-height: 1.45;
	}
	.event-list div strong,
	.event-list div span {
		display: block;
	}
	.event-list div strong {
		text-transform: capitalize;
	}
	.event-list div span {
		margin-top: 0.2rem;
		color: var(--text-75, #718195);
		font-size: 0.78rem;
	}
	.event-list div p {
		margin: 0.45rem 0 0;
		color: var(--text-75, #52677b);
	}
	.toggle-list label {
		grid-template-columns: minmax(0, 1fr) auto;
		cursor: pointer;
	}
	.toggle-list label span {
		min-width: 0;
		display: grid;
		gap: 0.2rem;
	}
	.toggle-list label strong {
		line-height: 1.25;
	}
	.toggle-list input {
		appearance: none;
		position: relative;
		width: 3.05rem;
		height: 1.7rem;
		margin: 0;
		border: 1px solid var(--line-divider, rgba(70, 100, 130, 0.2));
		border-radius: 999px;
		background: rgba(113, 129, 149, 0.24);
		cursor: pointer;
		transition:
			background-color 0.16s ease,
			border-color 0.16s ease;
	}
	.toggle-list input::before {
		content: "";
		position: absolute;
		top: 0.18rem;
		left: 0.2rem;
		width: 1.2rem;
		height: 1.2rem;
		border-radius: 50%;
		background: white;
		box-shadow: 0 0.18rem 0.45rem rgba(24, 46, 73, 0.22);
		transition: transform 0.16s ease;
	}
	.toggle-list input:checked {
		border-color: var(--primary, #4b9fe8);
		background: var(--primary, #4b9fe8);
	}
	.toggle-list input:checked::before {
		transform: translateX(1.34rem);
	}
	.danger-card {
		border-color: #f0caca;
		background: var(--sf-surface);
	}
	.danger-grid {
		display: grid;
		gap: 1rem;
	}
	.danger-card {
		display: flex;
		min-width: 0;
		flex-direction: column;
		align-items: stretch;
		gap: 1rem;
	}
	.danger-copy {
		display: flex;
		align-items: flex-start;
		gap: 0.85rem;
	}
	.danger-copy p,
	.risk-action p {
		margin: 0.45rem 0 0;
		color: var(--text-75, #6c7b8c);
		line-height: 1.5;
	}
	.danger-copy .scheduled {
		color: #9b3131;
		font-weight: 800;
	}
	.danger-card .command {
		width: 100%;
	}
	.risk-action {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		border: 1px solid var(--line-divider, rgba(70, 100, 130, 0.12));
		border-radius: 0.8rem;
		background: var(--btn-regular-bg, #f8fbfd);
	}
	.card-actions {
		margin-top: 1rem;
	}
	.modal-backdrop {
		position: fixed;
		z-index: 100;
		inset: 0;
		display: grid;
		place-items: center;
		padding: 1rem;
		background: rgba(20, 34, 50, 0.48);
		backdrop-filter: blur(4px);
	}
	.confirm-modal {
		box-sizing: border-box;
		width: min(100%, 34rem);
		max-height: calc(100svh - 2rem);
		overflow-y: auto;
		padding: 1.25rem;
		border: 1px solid var(--line-divider, rgba(70, 100, 130, 0.16));
		border-radius: 0.75rem;
		background: var(--sf-surface);
		box-shadow: 0 1.5rem 4rem rgba(17, 38, 60, 0.24);
	}
	.modal-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
	}
	.modal-header h2 {
		margin: 0;
		font-size: 1.35rem;
		letter-spacing: 0;
	}
	.modal-description {
		margin: 0.75rem 0 1rem;
		color: var(--text-75, #617386);
		line-height: 1.55;
	}
	.verification-note,
	.confirmation-warning,
	.success-state {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 1rem;
		border-radius: 0.75rem;
		background: var(--btn-regular-bg, #edf6fd);
	}
	.verification-note > :global(svg),
	.confirmation-warning > :global(svg),
	.success-state > :global(svg) {
		flex: none;
		font-size: 1.4rem;
		color: var(--primary, #2d80c5);
	}
	.verification-note p,
	.confirmation-warning p,
	.success-state p {
		margin: 0.3rem 0 0;
		color: var(--text-75, #617386);
		line-height: 1.5;
	}
	.confirmation-warning {
		margin-bottom: 1rem;
		background: #fff1f1;
	}
	.confirmation-warning > :global(svg) {
		color: #ae3838;
	}
	.success-state {
		flex-wrap: wrap;
		background: #e8f6ee;
	}
	.success-state > :global(svg) {
		color: #177248;
	}
	.success-state p {
		flex-basis: 100%;
	}
	.modal-fields {
		display: grid;
		gap: 1rem;
	}
	.modal-actions {
		display: flex;
		flex-direction: column-reverse;
		gap: 0.65rem;
		margin-top: 1.15rem;
	}
	.modal-actions .command {
		width: 100%;
	}
	.danger-icon {
		background: #fff1f1;
		color: #b63b3b;
	}
	.message {
		display: flex;
		align-items: flex-start;
		gap: 0.55rem;
		margin: 0;
		padding: 1rem;
		border-radius: 0.9rem;
		font-weight: 700;
	}
	.message.error {
		color: #a82929;
		background: #fbeaea;
	}
	.message.notice {
		color: #177248;
		background: #e7f5ed;
	}
	.accounts-footer {
		min-height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		color: var(--text-75, #718195);
		font-size: 0.8rem;
	}
	.account-loading {
		min-height: calc(100svh - 2rem);
		display: grid;
		place-content: center;
		justify-items: center;
		gap: 1rem;
		color: var(--text-75, #718195);
	}
	.account-loading span {
		width: 2rem;
		height: 2rem;
		border: 2px solid rgba(113, 129, 149, 0.24);
		border-top-color: var(--primary, #4b9fe8);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	/* Google Account-inspired structure, using SilentFlare color and type tokens. */
	.accounts-stage {
		padding: 4.5rem 1rem 1.5rem;
		background: var(--sf-page);
	}
	.accounts-workspace {
		width: min(100%, 76rem);
		padding-top: 0;
	}
	.account-frame {
		gap: 0;
		overflow: hidden;
		background: var(--sf-surface);
		box-shadow: var(--sf-shadow-surface);
	}
	.identity-card {
		padding: 1.25rem;
		border-bottom: 1px solid var(--sf-border);
		background: var(--sf-surface-subtle);
		box-shadow: none;
	}
	.avatar-shell {
		width: 4.75rem;
		height: 4.75rem;
	}
	.avatar {
		border-width: 2px;
		box-shadow: 0 0 0 0.3rem var(--sf-accent-soft);
		font-size: 1.5rem;
	}
	.account-nav {
		gap: 0.2rem;
		border-top: 0;
	}
	.account-nav button {
		min-height: 3rem;
		border-radius: 999px;
		padding: 0 1rem;
		font-weight: 700;
	}
	.account-nav button:hover {
		transform: none;
	}
	.account-nav button.active {
		background: var(--sf-accent-soft);
		color: var(--sf-accent-strong);
	}
	.account-content {
		width: 100%;
		max-width: none;
		min-height: 0;
		justify-self: start;
		align-content: start;
		gap: 0;
		padding: clamp(1.25rem, 4vw, 2rem);
	}
	.page-heading {
		min-height: 6rem;
		align-items: flex-start;
		justify-content: flex-end;
		padding: 0.75rem 0 0.85rem;
		text-align: left;
	}
	.page-heading p {
		margin-right: 0;
		margin-left: 0;
	}
	.panel {
		border-color: var(--sf-border-strong);
		border-radius: var(--sf-radius-lg);
		box-shadow: var(--sf-shadow-surface);
	}
	.account-card {
		min-width: 0;
		padding: 0;
	}
	.account-card + .account-card {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--sf-border);
	}
	.section-heading {
		align-items: center;
		margin-bottom: 1rem;
	}
	.section-icon {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		background: var(--sf-accent-soft);
		color: var(--sf-accent-strong);
	}
	.security-list,
	.session-list,
	.toggle-list {
		gap: 0;
		border-top: 1px solid var(--sf-border);
	}
	.security-row,
	.session-list article,
	.toggle-list label {
		min-height: 5rem;
		border: 0;
		border-bottom: 1px solid var(--sf-border);
		border-radius: 0;
		padding-right: 0;
		padding-left: 0;
		background: transparent;
	}
	.row-icon {
		background: transparent;
		color: var(--sf-accent-strong);
	}
	.risk-action {
		padding: 1rem 0;
		border: 0;
		border-top: 1px solid var(--sf-border);
		border-radius: 0;
		background: transparent;
	}
	.event-list div,
	.totp-box {
		border-color: var(--sf-border);
		border-radius: var(--sf-radius-md);
		background: var(--sf-surface-subtle);
	}
	.preview-card {
		padding: 1rem 0;
	}
	.danger-card {
		padding: 1.25rem;
		border: 0;
		border-left: 3px solid var(--sf-danger);
		border-radius: var(--sf-radius-sm);
		background: var(--sf-danger-soft);
	}
	.danger-icon {
		background: var(--sf-danger-soft);
		color: var(--sf-danger);
	}
	.confirm-modal {
		border-color: var(--sf-border-strong);
		border-radius: var(--sf-radius-lg);
		box-shadow: 0 1.5rem 4rem rgba(17, 38, 60, 0.22);
	}
	.spin {
		animation: spin 0.8s linear infinite;
	}
	@media (min-width: 640px) and (max-width: 767px) {
		.account-nav.open {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.account-nav .sidebar-logout {
			grid-column: 1 / -1;
		}
	}
	@media (min-width: 768px) {
		.accounts-stage {
			padding: 1.5rem;
		}
		.accounts-workspace {
			padding-top: 0;
		}
		.account-theme-command {
			top: 1.5rem;
			right: max(1.5rem, calc((100vw - 76rem) / 2));
		}
		.account-frame {
			height: clamp(40rem, calc(100svh - 3rem), 46rem);
			grid-template-columns: clamp(15rem, 25vw, 18rem) minmax(0, 1fr);
			align-items: stretch;
		}
		.identity-card {
			min-height: 0;
			display: grid;
			grid-template-rows: auto minmax(0, 1fr);
			overflow: hidden;
			border-right: 1px solid var(--sf-border);
			border-bottom: 0;
			text-align: center;
		}
		.identity-summary {
			display: block;
		}
		.account-content {
			overflow-y: auto;
			overscroll-behavior: contain;
			scrollbar-gutter: stable;
			scrollbar-color: rgba(91, 112, 133, 0.55) transparent;
			scrollbar-width: thin;
		}
		.account-content::-webkit-scrollbar,
		.account-nav::-webkit-scrollbar {
			width: 0.65rem;
		}
		.account-content::-webkit-scrollbar-track,
		.account-nav::-webkit-scrollbar-track {
			margin-block: 0.6rem;
			background: transparent;
		}
		.account-content::-webkit-scrollbar-thumb,
		.account-nav::-webkit-scrollbar-thumb {
			border: 0.2rem solid transparent;
			border-radius: 999px;
			background: rgba(91, 112, 133, 0.55);
			background-clip: padding-box;
		}
		.identity-summary h1 {
			margin: 0.2rem 0;
			font-size: 1.35rem;
		}
		.identity-summary > .handle {
			margin: 0 0 0.8rem;
		}
		.avatar-shell {
			width: 5.5rem;
			height: 5.5rem;
			margin: 0 auto 1rem;
		}
		.avatar {
			font-size: 1.8rem;
		}
		.region-pill {
			margin: 0 auto;
		}
		.mobile-menu-command {
			display: none;
		}
		.account-nav,
		.account-nav.open {
			max-height: none;
			display: grid;
			min-height: 0;
			overflow-y: auto;
			visibility: visible;
			margin-top: 1rem;
			padding-top: 1rem;
			border-top-color: transparent;
			opacity: 1;
			align-content: start;
			transform: none;
			overscroll-behavior: contain;
			scrollbar-gutter: stable;
			scrollbar-color: rgba(91, 112, 133, 0.55) transparent;
			scrollbar-width: thin;
		}
		.page-heading {
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}
		.risk-action {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
		.danger-card {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
		.danger-card .command {
			width: max-content;
			flex: none;
		}
		.modal-actions {
			flex-direction: row;
			justify-content: flex-end;
		}
		.modal-actions .command {
			width: max-content;
		}
	}
	@media (min-width: 1024px) {
		.identity-card {
			padding: 1.5rem;
		}
		.split-card {
			grid-template-columns: minmax(0, 1fr) minmax(16rem, 0.65fr);
		}
		.profile-preview {
			padding-top: 0;
			padding-left: 1.5rem;
			border-top: 0;
			border-left: 1px solid var(--sf-border);
		}
		.danger-grid {
			max-width: 44rem;
			margin: 0 auto;
		}
	}
	@media (max-width: 520px) {
		.accounts-stage {
			padding: 4rem 0.75rem 1rem;
		}
		.account-content {
			min-height: auto;
			padding: 1rem;
		}
		.page-heading {
			min-height: auto;
		}
		.account-nav button {
			justify-content: flex-start;
			min-height: 3.25rem;
			padding: 0.35rem 0.75rem;
			font-size: 0.85rem;
			text-align: left;
		}
		.account-nav button :global(svg) {
			font-size: 1.1rem;
		}
		.security-row,
		.session-list article {
			grid-template-columns: auto minmax(0, 1fr);
		}
		.security-row .status,
		.session-list .status,
		.session-list .command {
			grid-column: 1 / -1;
			width: 100%;
		}
		.command {
			width: 100%;
		}
		.avatar-actions {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.toggle-list label {
			align-items: start;
		}
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	@keyframes panel-enter {
		from {
			opacity: 0;
			transform: translateY(0.45rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.account-loading span,
		.spin,
		.panel-view {
			animation: none;
		}
		.command,
		.icon-command,
		.account-nav button,
		.account-nav,
		.nav-group-collapse,
		.nav-group-chevron,
		.auth-input,
		.toggle-list input,
		.toggle-list input::before {
			transition: none;
		}
	}
</style>
