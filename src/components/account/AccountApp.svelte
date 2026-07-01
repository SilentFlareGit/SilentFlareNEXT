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
let displayName = $state("");
let avatarUrl = $state("");
let bio = $state("");
let displayRegion = $state("");
let displayRegionCode = $state("");
let setupToken = $state("");
let totpSecret = $state("");
let totpUri = $state("");
let totpCode = $state("");

async function apiFetch<T>(
	path: string,
	init: RequestInit & { csrf?: boolean } = {},
): Promise<T> {
	const response = await fetch(`${apiBase}${path}`, {
		...init,
		credentials: "include",
		headers: {
			"content-type": "application/json",
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

function countryFlagUrl(countryCode: string) {
	const normalized = countryCode.trim().toLowerCase();
	return /^[a-z]{2}$/.test(normalized)
		? `https://flagcdn.com/${normalized}.svg`
		: "";
}

function clearMessages() {
	error = "";
	notice = "";
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
		notice = "Profile saved.";
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
			headers: {
				"content-type": file.type,
				"X-CSRF-Token": csrf,
			},
			body: file,
		});
		const result = (await response.json().catch(() => ({}))) as {
			detail?: string;
			user?: AccountUser;
		};
		if (!response.ok || !result.user) {
			throw new Error(result.detail || "Avatar upload failed");
		}
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
			{
				method: "DELETE",
				csrf: true,
			},
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
	} catch (reason) {
		error =
			reason instanceof Error ? reason.message : "Invalid authenticator code";
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
		<div class="account-loading" aria-live="polite"><span></span><p>Loading account…</p></div>
	</div>
	{:else if user}
	<div class="accounts-stage">
		<main class="accounts-workspace">
			<div class="workspace-bar">
				<a class="wordmark" href="https://blog.silentflare.com/" aria-label="SilentFlare Blog">
					<span>S</span><strong>SilentFlare</strong>
				</a>
				<button class="icon-command" type="button" title="Sign out everywhere" aria-label="Sign out everywhere" onclick={() => void logout()}>
					<Icon icon="material-symbols:logout-rounded" />
				</button>
			</div>

			<div class="account-grid">
				<aside class="identity-card panel">
					<div class="avatar-shell">
						<div class="avatar">
							{#if avatarUrl}<img src={avatarUrl} alt="" />{:else}<span>{(displayName || user.username)[0]?.toUpperCase()}</span>{/if}
						</div>
						<label class="avatar-camera" title="Upload avatar" aria-label="Upload avatar">
							<Icon icon={avatarUploading ? "material-symbols:progress-activity" : "material-symbols:add-a-photo-outline-rounded"} class={avatarUploading ? "spin" : ""} />
							<input type="file" accept="image/png,image/jpeg,image/webp" onchange={(event) => void uploadAvatar(event)} disabled={avatarUploading} />
						</label>
					</div>
					<p class="eyebrow">SilentFlare identity</p>
					<h1>{displayName || user.username}</h1>
					<p class="handle">@{user.username}</p>
					<div class="avatar-actions">
						<label class="command secondary">
							<Icon icon="material-symbols:upload-rounded" />
							{avatarUploading ? "Uploading…" : "Upload photo"}
							<input type="file" accept="image/png,image/jpeg,image/webp" onchange={(event) => void uploadAvatar(event)} disabled={avatarUploading} />
						</label>
						{#if avatarUrl}<button class="icon-command subtle" type="button" title="Remove avatar" aria-label="Remove avatar" onclick={() => void removeAvatar()} disabled={avatarUploading}><Icon icon="material-symbols:delete-rounded" /></button>{/if}
					</div>
				</aside>

				<div class="account-content">
					<section class="panel account-card">
						<div class="section-heading">
							<span class="section-icon"><Icon icon="material-symbols:person-edit-outline-rounded" /></span>
							<div><p class="eyebrow">Public profile</p><h2>How you appear</h2></div>
						</div>
						<form class="form-stack" onsubmit={(event) => { event.preventDefault(); void saveProfile(); }}>
							<label>Display name<input class="auth-input" bind:value={displayName} maxlength="80" autocomplete="name" /></label>
							<div class="region-field">
								<span class="region-flag">
									{#if countryFlagUrl(displayRegionCode)}
										<img src={countryFlagUrl(displayRegionCode)} alt={`${displayRegionCode} flag`} />
									{:else}
										<Icon icon="material-symbols:public-rounded" aria-label="Global" />
									{/if}
								</span>
								<div class="region-copy"><span>Current region</span><strong>{displayRegion || "Location unavailable"}</strong></div>
								<Icon icon="material-symbols:location-on-outline-rounded" class="region-pin" />
							</div>
							<label>Bio<textarea class="auth-input bio-input" bind:value={bio} maxlength="500"></textarea><span class="field-count">{bio.length}/500</span></label>
							<button class="command primary" type="submit" disabled={submitting}><Icon icon="material-symbols:save-outline-rounded" />{submitting ? "Saving…" : "Save profile"}</button>
						</form>
					</section>

					<section class="panel account-card security-card">
						<div class="section-heading">
							<span class="section-icon"><Icon icon="material-symbols:shield-lock-outline-rounded" /></span>
							<div><p class="eyebrow">Security</p><h2>Sign-in protection</h2></div>
						</div>
						<div class="security-list">
							<div class="security-row"><span class="row-icon"><Icon icon="material-symbols:alternate-email-rounded" /></span><div><strong>Email</strong><p>{user.email}</p></div><span class="status good"><Icon icon="material-symbols:verified-rounded" />Verified</span></div>
							<div class="security-row"><span class="row-icon"><Icon icon="material-symbols:key-outline-rounded" /></span><div><strong>Password</strong><p>{user.hasPassword ? "Email or username login" : "Email-code login only"}</p></div><span class="status">{user.hasPassword ? "Set" : "Not set"}</span></div>
							<div class="security-row"><span class="row-icon"><Icon icon="material-symbols:phonelink-lock-outline-rounded" /></span><div><strong>Two-factor authentication</strong><p>Authenticator challenge after primary login</p></div><span class:good={user.twoFactorEnabled} class="status">{user.twoFactorEnabled ? "Enabled" : "Optional"}</span></div>
						</div>
						{#if !user.twoFactorEnabled && !setupToken}<button class="command secondary" type="button" onclick={() => void startAccount2FA()} disabled={submitting}><Icon icon="material-symbols:add-moderator-outline-rounded" />Set up 2FA</button>{/if}
						{#if setupToken}
							<div class="totp-box"><p>Authenticator secret</p><code>{totpSecret}</code><a href={totpUri}><Icon icon="material-symbols:open-in-new-rounded" />Open authenticator app</a><input class="auth-input code-input" inputmode="numeric" maxlength="6" bind:value={totpCode} placeholder="000000" /><button class="command primary" type="button" onclick={() => void verifyAccount2FA()}><Icon icon="material-symbols:verified-user-outline-rounded" />Verify and enable</button></div>
						{/if}
					</section>

					{#if error}<p class="message error"><Icon icon="material-symbols:error-outline-rounded" />{error}</p>{/if}
					{#if notice}<p class="message notice"><Icon icon="material-symbols:check-circle-outline-rounded" />{notice}</p>{/if}
				</div>
			</div>
		</main>
		<footer class="accounts-footer"><a href="https://blog.silentflare.com/">SilentFlare</a><span>·</span><a href="https://blog.silentflare.com/rss.xml">RSS</a><span>·</span><a href="https://tos.silentflare.com/">Terms</a></footer>
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
	.accounts-stage { min-height: 100svh; padding: 1rem; color: var(--deep-text, #182230); background: #edf3f8; }
	:global(.dark) .accounts-stage { background: #111923; color: #e8edf4; }
	.accounts-workspace { width: min(100%, 72rem); margin: 0 auto; }
	.workspace-bar { min-height: 3.5rem; display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
	.wordmark { display: inline-flex; align-items: center; gap: .65rem; color: inherit; font-weight: 800; }
	.wordmark span { width: 2rem; height: 2rem; display: grid; place-items: center; border-radius: .5rem; background: #4b9fe8; color: white; }
	.panel { border: 1px solid rgba(70, 100, 130, .12); border-radius: .5rem; background: rgba(255,255,255,.96); box-shadow: 0 .75rem 2.5rem rgba(28, 53, 79, .07); }
	:global(.dark) .panel { border-color: rgba(255,255,255,.08); background: #19232f; }
	.account-grid { display: grid; gap: 1rem; }
	.identity-card, .account-card { padding: clamp(1.25rem, 4vw, 2rem); }
	.identity-card { min-width: 0; text-align: center; }
	.avatar-shell { position: relative; width: 7rem; height: 7rem; margin: 0 auto 1.5rem; }
	.avatar { width: 100%; height: 100%; display: grid; place-items: center; overflow: hidden; border: .2rem solid #4b9fe8; border-radius: 50%; background: #e8f3ff; color: #388bd3; font-size: 2.4rem; font-weight: 800; }
	.avatar img { width: 100%; height: 100%; object-fit: cover; }
	.avatar-camera { position: absolute; right: -.15rem; bottom: .25rem; width: 2.6rem; height: 2.6rem; display: grid; place-items: center; border: .2rem solid white; border-radius: 50%; background: #182e49; color: white; cursor: pointer; }
	.avatar-camera input, .command input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
	.identity-card h1 { max-width: 100%; margin: .2rem 0; overflow-wrap: anywhere; font-size: 1.75rem; line-height: 1.08; letter-spacing: 0; }
	.handle { margin: .45rem 0 1.25rem; overflow-wrap: anywhere; color: #6c7b8c; }
	.avatar-actions { display: flex; justify-content: center; gap: .5rem; }
	.account-content { min-width: 0; display: grid; gap: 1rem; }
	.section-heading { display: flex; align-items: flex-start; gap: .9rem; margin-bottom: 1.75rem; }
	.section-icon, .row-icon { flex: none; display: grid; place-items: center; color: #317dc1; background: #e8f3ff; }
	.section-icon { width: 2.75rem; height: 2.75rem; border-radius: .5rem; font-size: 1.35rem; }
	.row-icon { width: 2.5rem; height: 2.5rem; border-radius: .5rem; font-size: 1.2rem; }
	.eyebrow { margin: 0 0 .4rem; color: #428ed1; font-size: .75rem; font-weight: 800; letter-spacing: 0; text-transform: uppercase; }
	h2 { margin: 0; font-size: 1.75rem; line-height: 1.08; letter-spacing: 0; }
	.form-stack { display: flex; flex-direction: column; gap: 1.2rem; }
	label { position: relative; display: flex; flex-direction: column; gap: .5rem; font-weight: 700; }
	.auth-input { min-height: 2.9rem; border-radius: .45rem; }
	.bio-input { min-height: 8rem; resize: vertical; }
	.field-count { align-self: flex-end; color: #7a8795; font-size: .75rem; font-weight: 500; }
	.region-field { min-height: 4.8rem; display: grid; grid-template-columns: auto minmax(0,1fr) auto; align-items: center; gap: 1rem; padding: .85rem 1rem; border: 1px solid rgba(70,100,130,.14); border-radius: .5rem; background: #f5f8fb; }
	:global(.dark) .region-field { background: #121b25; }
	.region-flag { width: 2rem; height: 2rem; display: grid; place-items: center; overflow: hidden; border: 1px solid rgba(70,100,130,.14); border-radius: 50%; font-size: 1.4rem; line-height: 1; background: white; }
	.region-flag img { width: 100%; height: 100%; object-fit: cover; }
	.region-copy { min-width: 0; display: flex; flex-direction: column; gap: .2rem; }
	.region-copy span { color: #788696; font-size: .75rem; font-weight: 700; text-transform: uppercase; }
	.region-copy strong { overflow-wrap: anywhere; }
	.region-pin { color: #4b9fe8; font-size: 1.4rem; }
	.region-field.compact { min-height: 4rem; }
	.command, .icon-command { min-width: 2.75rem; min-height: 2.75rem; display: inline-flex; align-items: center; justify-content: center; gap: .55rem; border-radius: .5rem; font-weight: 800; transition: transform .16s ease, background-color .16s ease; cursor: pointer; }
	.command { width: max-content; padding: 0 1rem; }
	.command:hover, .icon-command:hover { transform: translateY(-1px); }
	.command.primary { background: #dceeff; color: #176db8; }
	.command.secondary, .icon-command { border: 1px solid rgba(70,100,130,.16); background: white; color: #31465b; }
	:global(.dark) .command.secondary, :global(.dark) .icon-command { background: #19232f; color: #e8edf4; }
	.icon-command { padding: 0; font-size: 1.3rem; }
	.icon-command.subtle { color: #a34141; }
	.command:disabled, .icon-command:disabled { cursor: wait; opacity: .55; transform: none; }
	.security-list { margin-bottom: 1.2rem; }
	.security-row { display: grid; grid-template-columns: auto minmax(0,1fr) auto; align-items: center; gap: .85rem; min-height: 5rem; padding: .9rem 0; border-top: 1px solid rgba(70,100,130,.12); }
	.security-row p { margin: .2rem 0 0; overflow-wrap: anywhere; color: #6c7b8c; font-size: .86rem; }
	.status { display: inline-flex; align-items: center; gap: .25rem; padding: .35rem .55rem; border-radius: 999px; background: #e9f0f6; color: #52677b; font-size: .68rem; font-weight: 800; text-transform: uppercase; }
	.status.good { background: #e5f6ec; color: #177248; }
	.totp-box { display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; padding: 1rem; border: 1px solid rgba(70,100,130,.14); border-radius: .5rem; background: #f5f8fb; }
	.totp-box p { margin: 0; font-weight: 800; }
	.totp-box code { overflow-wrap: anywhere; padding: .8rem; border-radius: .45rem; background: #e8eef4; font-size: 1rem; letter-spacing: 0; }
	.totp-box a { min-height: 2.75rem; display: inline-flex; align-items: center; gap: .45rem; color: #2c7cc2; font-weight: 700; }
	.code-input { text-align: center; font-size: 1.25rem; letter-spacing: 0; }
	.message { display: flex; align-items: flex-start; gap: .55rem; margin: 1rem 0 0; padding: 1rem; border-radius: .5rem; font-weight: 700; }
	.message.error { color: #a82929; background: #fbeaea; }
	.message.notice { color: #177248; background: #e7f5ed; }
	.accounts-footer { min-height: 3rem; display: flex; align-items: center; justify-content: center; gap: .45rem; color: #718195; font-size: .8rem; }
	.account-loading { min-height: calc(100svh - 2rem); display: grid; place-content: center; justify-items: center; gap: 1rem; color: #718195; }
	.account-loading span { width: 2rem; height: 2rem; border: 2px solid #d5e0e9; border-top-color: #4b9fe8; border-radius: 50%; animation: spin .8s linear infinite; }
	.spin { animation: spin .8s linear infinite; }
	@media (min-width: 768px) { .identity-card h1, h2 { font-size: 2rem; } }
	@media (min-width: 1024px) { .accounts-stage { padding: 1.5rem; } .account-grid { grid-template-columns: minmax(15rem, 18rem) minmax(0,1fr); align-items: start; } .identity-card { position: sticky; top: 1.5rem; } }
	@keyframes spin { to { transform: rotate(360deg); } }
	@media (prefers-reduced-motion: reduce) { .account-loading span, .spin { animation: none; } .command, .icon-command { transition: none; } }
</style>
