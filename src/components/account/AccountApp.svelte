<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";
import TurnstileWidget from "../security/TurnstileWidget.svelte";

type AccountUser = {
	id: string;
	email: string;
	username: string;
	displayName: string;
	avatarUrl: string;
	bio: string;
	displayRegion: string;
	twoFactorEnabled: boolean;
	hasPassword: boolean;
};

let { apiBase = "/accounts-api" } = $props<{ apiBase?: string }>();
let loading = $state(true);
let user = $state<AccountUser | null>(null);
let csrf = $state("");
let tosVersion = $state("");
let emailConfigured = $state(true);
let step = $state<"email" | "code" | "details" | "security" | "totp">("email");
let submitting = $state(false);
let error = $state("");
let notice = $state("");
let turnstileToken = $state("");
let turnstileReset = $state(0);
let email = $state("");
let code = $state("");
let regToken = $state("");
let onboardingToken = $state("");
let username = $state("");
let password = $state("");
let usePassword = $state(true);
let tosAccepted = $state(false);
let displayName = $state("");
let avatarUrl = $state("");
let bio = $state("");
let displayRegion = $state("");
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
}

async function loadSession() {
	try {
		const result = await apiFetch<{
			authenticated: boolean;
			user: AccountUser | null;
			csrf?: string;
			tosVersion: string;
			emailConfigured: boolean;
		}>("/auth/session");
		tosVersion = result.tosVersion;
		emailConfigured = result.emailConfigured;
		csrf = result.csrf ?? "";
		if (result.user) applyUser(result.user);
	} catch (reason) {
		error =
			reason instanceof Error
				? reason.message
				: "Account service is unavailable";
	} finally {
		loading = false;
	}
}

async function requestCode() {
	if (!turnstileToken) {
		error = "Complete the security check first.";
		return;
	}
	submitting = true;
	error = "";
	try {
		await apiFetch("/accounts/register/email/request", {
			method: "POST",
			body: JSON.stringify({ email, turnstile_token: turnstileToken }),
		});
		step = "code";
	} catch (reason) {
		error = reason instanceof Error ? reason.message : "Could not send code";
		turnstileToken = "";
		turnstileReset += 1;
	} finally {
		submitting = false;
	}
}

async function verifyEmail() {
	submitting = true;
	error = "";
	try {
		const result = await apiFetch<{ reg_token: string; tos_version: string }>(
			"/accounts/register/email/verify",
			{ method: "POST", body: JSON.stringify({ email, code }) },
		);
		regToken = result.reg_token;
		tosVersion = result.tos_version;
		step = "details";
	} catch (reason) {
		error = reason instanceof Error ? reason.message : "Verification failed";
		code = "";
	} finally {
		submitting = false;
	}
}

async function completeRegistration() {
	if (!tosAccepted) {
		error = "Accept the current Terms of Service to continue.";
		return;
	}
	submitting = true;
	error = "";
	try {
		const result = await apiFetch<{ onboarding_token: string }>(
			"/accounts/register/complete",
			{
				method: "POST",
				body: JSON.stringify({
					reg_token: regToken,
					username,
					password: usePassword ? password : null,
					tos_accepted: tosAccepted,
					tos_version: tosVersion,
					display_name: displayName,
					display_region: displayRegion,
				}),
			},
		);
		onboardingToken = result.onboarding_token;
		step = "security";
	} catch (reason) {
		error =
			reason instanceof Error ? reason.message : "Could not create account";
	} finally {
		submitting = false;
	}
}

async function startRegistration2FA() {
	submitting = true;
	error = "";
	try {
		const result = await apiFetch<{
			setup_token: string;
			secret: string;
			uri: string;
		}>("/accounts/register/2fa/start", {
			method: "POST",
			body: JSON.stringify({ onboarding_token: onboardingToken }),
		});
		setupToken = result.setup_token;
		totpSecret = result.secret;
		totpUri = result.uri;
		step = "totp";
	} catch (reason) {
		error =
			reason instanceof Error ? reason.message : "Could not start 2FA setup";
	} finally {
		submitting = false;
	}
}

function finishRegistration() {
	window.location.assign("https://auth.silentflare.com/?registration=complete");
}

async function skipRegistration2FA() {
	submitting = true;
	error = "";
	try {
		await apiFetch("/accounts/register/2fa/skip", {
			method: "POST",
			body: JSON.stringify({ onboarding_token: onboardingToken }),
		});
		finishRegistration();
	} catch (reason) {
		error =
			reason instanceof Error
				? reason.message
				: "Could not finish registration";
		submitting = false;
	}
}

async function verifyRegistration2FA() {
	submitting = true;
	error = "";
	try {
		await apiFetch("/accounts/register/2fa/verify", {
			method: "POST",
			body: JSON.stringify({ setup_token: setupToken, code: totpCode }),
		});
		finishRegistration();
	} catch (reason) {
		error =
			reason instanceof Error ? reason.message : "Invalid authenticator code";
		totpCode = "";
		submitting = false;
	}
}

async function saveProfile() {
	submitting = true;
	error = "";
	notice = "";
	try {
		const result = await apiFetch<{ user: AccountUser }>("/accounts/profile", {
			method: "PATCH",
			csrf: true,
			body: JSON.stringify({
				display_name: displayName,
				avatar_url: avatarUrl,
				bio,
				display_region: displayRegion,
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

async function startAccount2FA() {
	submitting = true;
	error = "";
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
	error = "";
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
		/* Cookie is cleared best-effort by the API. */
	}
	window.location.assign("https://auth.silentflare.com/");
}

onMount(() => void loadSession());
</script>

{#if loading}
	<div class="account-loading"><span></span><p>Loading account…</p></div>
{:else if user}
	<div class="account-grid">
		<aside class="account-identity card-base">
			<div class="avatar">{#if avatarUrl}<img src={avatarUrl} alt="" />{:else}{(displayName || user.username)[0]?.toUpperCase()}{/if}</div>
			<p class="eyebrow">Signed in across SilentFlare</p>
			<h1>{displayName || user.username}</h1>
			<p class="muted">@{user.username}</p>
			<button class="btn-plain min-h-11 rounded-xl px-4 font-bold" onclick={() => void logout()}>Sign out everywhere</button>
		</aside>

		<div class="account-content">
			<section class="card-base account-card">
				<p class="eyebrow">Public profile</p><h2>How you appear</h2>
				<form class="form-stack" onsubmit={(event) => { event.preventDefault(); void saveProfile(); }}>
					<div class="form-grid">
						<label>Display name<input class="auth-input" bind:value={displayName} maxlength="80" /></label>
						<label>Display region <span class="optional">Profile only</span><input class="auth-input" bind:value={displayRegion} maxlength="100" placeholder="Shanghai, China" /></label>
					</div>
					<label>Avatar URL<input class="auth-input" type="url" bind:value={avatarUrl} maxlength="500" placeholder="https://…" /></label>
					<label>Bio<textarea class="auth-input min-h-32" bind:value={bio} maxlength="500"></textarea></label>
					<button class="btn-regular min-h-11 w-max rounded-xl px-6 font-bold" disabled={submitting}>Save profile</button>
				</form>
			</section>

			<section class="card-base account-card">
				<p class="eyebrow">Security</p><h2>Sign-in protection</h2>
				<div class="security-row"><div><strong>Email</strong><p>{user.email}</p></div><span class="status good">Verified</span></div>
				<div class="security-row"><div><strong>Password</strong><p>{user.hasPassword ? "Available for email or username login" : "Email-code login only"}</p></div><span class="status">{user.hasPassword ? "Set" : "Not set"}</span></div>
				<div class="security-row"><div><strong>Two-factor authentication</strong><p>Required after the first login step when enabled.</p></div><span class:good={user.twoFactorEnabled} class="status">{user.twoFactorEnabled ? "Enabled" : "Optional"}</span></div>
				{#if !user.twoFactorEnabled && !setupToken}<button class="btn-plain min-h-11 rounded-xl px-5 font-bold" onclick={() => void startAccount2FA()} disabled={submitting}>Set up 2FA</button>{/if}
				{#if setupToken}
					<div class="totp-box"><p>Enter this secret in your authenticator:</p><code>{totpSecret}</code><a href={totpUri}>Open authenticator app</a><input class="auth-input" inputmode="numeric" maxlength="6" bind:value={totpCode} placeholder="000000" /><button class="btn-regular min-h-11 rounded-xl px-5 font-bold" onclick={() => void verifyAccount2FA()}>Verify and enable</button></div>
				{/if}
			</section>
			{#if error}<p class="message error">{error}</p>{/if}{#if notice}<p class="message notice">{notice}</p>{/if}
		</div>
	</div>
{:else}
	<div class="registration-shell">
		<section class="registration-story">
			<p class="eyebrow">SilentFlare Accounts</p>
			<h1>Build the profile behind your byline.</h1>
			<p>Registration begins with a verified email. Password and 2FA are choices; your region is display metadata only and is never used as proof of identity.</p>
			<a href="https://auth.silentflare.com/">Already registered? Sign in</a>
		</section>
		<section class="registration-form card-base">
			<div class="steps" aria-label="Registration progress"><span class:active={step === "email" || step === "code"}>1</span><i></i><span class:active={step === "details"}>2</span><i></i><span class:active={step === "security" || step === "totp"}>3</span></div>
			{#if step === "email"}
				<p class="eyebrow">Step 1 · Verify email</p><h2>Create your account</h2>
				{#if !emailConfigured}<p class="message error">Email delivery is not configured on the API yet.</p>{/if}
				<form class="form-stack" onsubmit={(event) => { event.preventDefault(); void requestCode(); }}><label>Email address<input class="auth-input" type="email" autocomplete="email" bind:value={email} required /></label><TurnstileWidget action="register" resetKey={turnstileReset} onTokenChange={(token) => (turnstileToken = token)} /><button class="btn-regular min-h-11 rounded-xl px-5 font-bold" disabled={submitting || !emailConfigured}>{submitting ? "Sending…" : "Send verification code"}</button></form>
			{:else if step === "code"}
				<p class="eyebrow">Step 1 · Verify email</p><h2>Check your inbox</h2><p class="muted">The code expires shortly and can only be used once.</p>
				<form class="form-stack" onsubmit={(event) => { event.preventDefault(); void verifyEmail(); }}><label>Six-digit code<input class="auth-input code-input" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="one-time-code" bind:value={code} required /></label><button class="btn-regular min-h-11 rounded-xl px-5 font-bold" disabled={submitting}>Verify email</button></form>
			{:else if step === "details"}
				<p class="eyebrow">Step 2 · Account details</p><h2>Choose your identity</h2>
				<form class="form-stack" onsubmit={(event) => { event.preventDefault(); void completeRegistration(); }}>
					<div class="form-grid"><label>Username<input class="auth-input" autocomplete="username" bind:value={username} minlength="3" maxlength="24" required /></label><label>Display name <span class="optional">Optional</span><input class="auth-input" bind:value={displayName} maxlength="80" /></label></div>
					<label class="choice"><input type="checkbox" bind:checked={usePassword} /> Set a password for email/username login</label>
					{#if usePassword}<label>Password<input class="auth-input" type="password" autocomplete="new-password" bind:value={password} minlength="8" required /></label>{/if}
					<label>Display region <span class="optional">Optional; not authentication</span><input class="auth-input" bind:value={displayRegion} maxlength="100" /></label>
					<label class="choice tos"><input type="checkbox" bind:checked={tosAccepted} required /> I agree to the <a href="https://tos.silentflare.com/" target="_blank" rel="noopener">Terms of Service</a> ({tosVersion}).</label>
					<button class="btn-regular min-h-11 rounded-xl px-5 font-bold" disabled={submitting}>Create account</button>
				</form>
			{:else if step === "security"}
				<p class="eyebrow">Step 3 · Security</p><h2>Add a second factor?</h2><p class="muted">If enabled, login remains pending until a valid authenticator code is supplied.</p>
				<div class="security-actions"><button class="btn-regular min-h-11 rounded-xl px-5 font-bold" onclick={() => void startRegistration2FA()} disabled={submitting}>Set up 2FA</button><button class="btn-plain min-h-11 rounded-xl px-5 font-bold" onclick={() => void skipRegistration2FA()} disabled={submitting}>Skip for now</button></div>
			{:else}
				<p class="eyebrow">Step 3 · Authenticator</p><h2>Connect your app</h2><div class="totp-box"><p>Enter this secret in your authenticator app:</p><code>{totpSecret}</code><a href={totpUri}>Open authenticator app</a><input class="auth-input code-input" inputmode="numeric" maxlength="6" bind:value={totpCode} placeholder="000000" /><button class="btn-regular min-h-11 rounded-xl px-5 font-bold" onclick={() => void verifyRegistration2FA()} disabled={submitting}>Verify and finish</button></div>
			{/if}
			{#if error}<p class="message error"><Icon icon="material-symbols:error-outline-rounded" />{error}</p>{/if}
		</section>
	</div>
{/if}

<style>
	.account-loading { min-height: 34rem; display: grid; place-content: center; justify-items: center; gap: 1rem; color: var(--muted-text); }
	.account-loading span { width: 2rem; height: 2rem; border: 2px solid var(--line-divider); border-top-color: var(--primary); border-radius: 50%; animation: spin .8s linear infinite; }
	.account-grid, .registration-shell { display: grid; gap: 1rem; margin: 1rem auto 2rem; }
	.account-identity, .account-card, .registration-form { padding: clamp(1.5rem, 5vw, 2.5rem); }
	.account-identity { text-align: center; }
	.avatar { width: 5rem; height: 5rem; margin: 0 auto 1.2rem; display: grid; place-items: center; overflow: hidden; border: 3px solid var(--primary); border-radius: 50%; background: var(--btn-regular-bg); color: var(--primary); font-size: 2rem; font-weight: 800; }
	.avatar img { width: 100%; height: 100%; object-fit: cover; }
	.eyebrow { margin: 0 0 .65rem; color: var(--primary); font-size: .75rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
	h1, h2 { margin: 0; color: var(--deep-text, currentColor); letter-spacing: -.03em; } h1 { font-size: clamp(2rem, 8vw, 3.6rem); line-height: 1; } h2 { margin-bottom: 1.4rem; font-size: clamp(1.7rem, 5vw, 2.5rem); }
	.muted { color: var(--muted-text); line-height: 1.7; }
	.account-identity button { margin-top: 1.5rem; }
	.account-content { display: grid; gap: 1rem; min-width: 0; }
	.form-stack { display: flex; flex-direction: column; gap: 1.2rem; }
	.form-grid { display: grid; gap: 1.2rem; }
	label { display: flex; flex-direction: column; gap: .5rem; color: var(--deep-text, currentColor); font-weight: 700; }
	.auth-input { min-height: 2.75rem; }
	.optional { color: var(--muted-text); font-size: .75rem; font-weight: 500; }
	.security-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; min-height: 4.5rem; padding: 1rem 0; border-top: 1px solid var(--line-divider); }
	.security-row p { margin: .25rem 0 0; color: var(--muted-text); font-size: .85rem; }
	.status { flex: none; padding: .35rem .65rem; border-radius: 999px; background: var(--btn-regular-bg); font-size: .72rem; font-weight: 800; text-transform: uppercase; } .status.good { color: #17834d; background: rgba(23,131,77,.1); }
	.registration-story { padding: clamp(2rem, 7vw, 5rem); border-radius: 1.5rem; color: white; background: linear-gradient(150deg, color-mix(in srgb, var(--primary) 78%, #10233f), #10233f); }
	.registration-story .eyebrow { color: rgba(255,255,255,.7); } .registration-story h1 { max-width: 13ch; color: white; } .registration-story > p:not(.eyebrow) { max-width: 42rem; margin: 1.4rem 0; line-height: 1.75; opacity: .78; } .registration-story a { display: inline-flex; min-height: 2.75rem; align-items: center; color: white; font-weight: 800; text-decoration: underline; }
	.steps { display: flex; align-items: center; margin-bottom: 2rem; } .steps span { width: 2rem; height: 2rem; display: grid; place-items: center; border-radius: 50%; background: var(--btn-regular-bg); font-weight: 800; } .steps span.active { background: var(--primary); color: white; } .steps i { width: 2.5rem; height: 1px; background: var(--line-divider); }
	.choice { min-height: 2.75rem; flex-direction: row; align-items: center; gap: .75rem; } .choice input { width: 1.1rem; height: 1.1rem; } .choice a { text-decoration: underline; }
	.security-actions { display: flex; flex-direction: column; gap: .75rem; }
	.totp-box { display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; padding: 1rem; border: 1px solid var(--line-divider); border-radius: 1rem; background: var(--btn-plain-bg); } .totp-box code { overflow-wrap: anywhere; padding: .8rem; border-radius: .7rem; background: var(--btn-regular-bg); font-size: 1rem; letter-spacing: .12em; } .totp-box a { min-height: 2.75rem; display: inline-flex; align-items: center; color: var(--primary); font-weight: 700; }
	.code-input { text-align: center; font-size: 1.25rem; letter-spacing: .28em; }
	.message { display: flex; align-items: center; gap: .5rem; margin-top: 1rem; padding: 1rem; border-radius: .8rem; font-weight: 700; } .message.error { color: #b42318; background: rgba(180,35,24,.08); } .message.notice { color: #17834d; background: rgba(23,131,77,.08); }
	@media (min-width: 768px) { .form-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .security-actions { flex-direction: row; } }
	@media (min-width: 1024px) { .account-grid { grid-template-columns: 18rem minmax(0,1fr); } .account-identity { position: sticky; top: 5rem; align-self: start; } .registration-shell { grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); align-items: stretch; } .registration-story { min-height: 42rem; display: flex; flex-direction: column; justify-content: center; } }
	@keyframes spin { to { transform: rotate(360deg); } }
	@media (prefers-reduced-motion: reduce) { .account-loading span { animation: none; } }
</style>
