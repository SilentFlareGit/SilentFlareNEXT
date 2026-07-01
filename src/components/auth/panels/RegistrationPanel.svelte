<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";
import TurnstileWidget from "../../security/TurnstileWidget.svelte";

let {
	apiBase,
	emailConfigured,
	tosVersion: initialTosVersion,
	verifyToken = "",
	onBack,
	onComplete,
} = $props<{
	apiBase: string;
	emailConfigured: boolean;
	tosVersion: string;
	verifyToken?: string;
	onBack: () => void;
	onComplete: () => void;
}>();

let step = $state<"email" | "code" | "details" | "security" | "totp">(
	verifyToken ? "code" : "email",
);
let submitting = $state(false);
let error = $state("");
let notice = $state("");
let turnstileToken = $state("");
let turnstileReset = $state(0);
let email = $state("");
let code = $state("");
let regToken = $state("");
let tosVersion = $state(initialTosVersion);
let onboardingToken = $state("");
let username = $state("");
let displayName = $state("");
let usePassword = $state(true);
let password = $state("");
let tosAccepted = $state(false);
let setupToken = $state("");
let totpSecret = $state("");
let totpUri = $state("");
let totpCode = $state("");

async function post<T>(path: string, body: object): Promise<T> {
	const response = await fetch(`${apiBase}${path}`, {
		method: "POST",
		credentials: "include",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(body),
	});
	const data = (await response.json().catch(() => ({}))) as { detail?: string };
	if (!response.ok) throw new Error(data.detail || "Request failed");
	return data as T;
}

function clearMessages() {
	error = "";
	notice = "";
}

async function requestCode() {
	if (!turnstileToken) {
		error = "Complete the security check first.";
		return;
	}
	submitting = true;
	clearMessages();
	try {
		await post("/accounts/register/email/request", {
			email,
			turnstile_token: turnstileToken,
		});
		step = "code";
		notice = "Check your inbox for a code or secure verification link.";
	} catch (reason) {
		error =
			reason instanceof Error
				? reason.message
				: "Could not send verification email";
		turnstileToken = "";
		turnstileReset += 1;
	} finally {
		submitting = false;
	}
}

async function verifyEmail() {
	submitting = true;
	clearMessages();
	try {
		const result = await post<{ reg_token: string; tos_version: string }>(
			"/accounts/register/email/verify",
			{ email, code },
		);
		regToken = result.reg_token;
		tosVersion = result.tos_version;
		step = "details";
		notice = "Email verified. Choose your account details.";
	} catch (reason) {
		error = reason instanceof Error ? reason.message : "Verification failed";
		code = "";
	} finally {
		submitting = false;
	}
}

async function verifyLink() {
	if (!verifyToken) return;
	submitting = true;
	try {
		const result = await post<{
			email: string;
			reg_token: string;
			tos_version: string;
		}>("/accounts/register/email/verify-link", { token: verifyToken });
		email = result.email;
		regToken = result.reg_token;
		tosVersion = result.tos_version;
		step = "details";
		notice = "Email verified. Choose your account details.";
	} catch (reason) {
		error =
			reason instanceof Error ? reason.message : "Verification link failed";
		step = "email";
	} finally {
		window.history.replaceState({}, "", window.location.pathname);
		submitting = false;
	}
}

async function completeRegistration() {
	if (!tosAccepted) {
		error = "Accept the current Terms of Service to continue.";
		return;
	}
	submitting = true;
	clearMessages();
	try {
		const result = await post<{ onboarding_token: string }>(
			"/accounts/register/complete",
			{
				reg_token: regToken,
				username,
				password: usePassword ? password : null,
				tos_accepted: tosAccepted,
				tos_version: tosVersion,
				display_name: displayName,
				display_region: "",
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

async function start2FA() {
	submitting = true;
	clearMessages();
	try {
		const result = await post<{
			setup_token: string;
			secret: string;
			uri: string;
		}>("/accounts/register/2fa/start", { onboarding_token: onboardingToken });
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

async function skip2FA() {
	submitting = true;
	clearMessages();
	try {
		await post("/accounts/register/2fa/skip", {
			onboarding_token: onboardingToken,
		});
		onComplete();
	} catch (reason) {
		error =
			reason instanceof Error
				? reason.message
				: "Could not finish registration";
		submitting = false;
	}
}

async function verify2FA() {
	submitting = true;
	clearMessages();
	try {
		await post("/accounts/register/2fa/verify", {
			setup_token: setupToken,
			code: totpCode,
		});
		onComplete();
	} catch (reason) {
		error =
			reason instanceof Error ? reason.message : "Invalid authenticator code";
		totpCode = "";
		submitting = false;
	}
}

onMount(() => void verifyLink());
</script>

<div class="registration-panel">
	<button type="button" class="back-command" onclick={onBack}>
		<Icon icon="material-symbols:arrow-back-rounded" />
		Back to sign in
	</button>

	<div class="progress" aria-label="Registration progress">
		<span class:active={step === "email" || step === "code"}>1</span><i></i>
		<span class:active={step === "details"}>2</span><i></i>
		<span class:active={step === "security" || step === "totp"}>3</span>
	</div>

	{#if step === "email"}
		<h2>Create your account</h2>
		<p class="intro">Start with your email. We will send both a one-time code and a secure link.</p>
		{#if !emailConfigured}<p class="message error"><Icon icon="material-symbols:mail-lock-outline-rounded" />Email delivery is unavailable.</p>{/if}
		<form onsubmit={(event) => { event.preventDefault(); void requestCode(); }}>
			<label>Email address<input class="auth-input" type="email" autocomplete="email" bind:value={email} required /></label>
			<TurnstileWidget action="register" resetKey={turnstileReset} onTokenChange={(token) => (turnstileToken = token)} />
			<button class="primary-command" disabled={submitting || !emailConfigured}><Icon icon="material-symbols:send-outline-rounded" />{submitting ? "Sending…" : "Send verification"}</button>
		</form>
	{:else if step === "code"}
		<h2>Check your inbox</h2>
		<p class="intro">Enter the six-digit code sent to {email}, or use the secure link in that email.</p>
		<form onsubmit={(event) => { event.preventDefault(); void verifyEmail(); }}>
			<label>Verification code<input class="auth-input code-input" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="one-time-code" bind:value={code} required /></label>
			<button class="primary-command" disabled={submitting}><Icon icon="material-symbols:mark-email-read-outline-rounded" />{submitting ? "Verifying…" : "Verify email"}</button>
			<button type="button" class="text-command" onclick={() => { step = "email"; code = ""; }}>Use another email</button>
		</form>
	{:else if step === "details"}
		<h2>Choose your identity</h2>
		<p class="intro">Your username signs you in; your display name appears publicly.</p>
		<form onsubmit={(event) => { event.preventDefault(); void completeRegistration(); }}>
			<div class="field-grid">
				<label>Username<input class="auth-input" autocomplete="username" bind:value={username} minlength="3" maxlength="24" required /></label>
				<label>Display name <span>Optional</span><input class="auth-input" autocomplete="name" bind:value={displayName} maxlength="80" /></label>
			</div>
			<label class="choice"><input type="checkbox" bind:checked={usePassword} />Set a password for email or username login</label>
			{#if usePassword}<label>Password<input class="auth-input" type="password" autocomplete="new-password" bind:value={password} minlength="8" required /></label>{/if}
			<div class="region-note"><Icon icon="material-symbols:location-on-outline-rounded" /><div><strong>Display region</strong><span>Added from your current network after registration</span></div></div>
			<label class="choice"><input type="checkbox" bind:checked={tosAccepted} required />I agree to the <a href="https://tos.silentflare.com/" target="_blank" rel="noopener">Terms of Service</a> ({tosVersion}).</label>
			<button class="primary-command" disabled={submitting}><Icon icon="material-symbols:person-add-outline-rounded" />{submitting ? "Creating…" : "Create account"}</button>
		</form>
	{:else if step === "security"}
		<h2>Protect your account</h2>
		<p class="intro">Add an authenticator challenge now, or continue with your chosen sign-in method.</p>
		<div class="security-actions">
			<button class="primary-command" type="button" onclick={() => void start2FA()} disabled={submitting}><Icon icon="material-symbols:add-moderator-outline-rounded" />Set up 2FA</button>
			<button class="secondary-command" type="button" onclick={() => void skip2FA()} disabled={submitting}><Icon icon="material-symbols:arrow-forward-rounded" />Skip for now</button>
		</div>
	{:else}
		<h2>Connect your app</h2>
		<p class="intro">Add the secret to your authenticator, then enter the current six-digit code.</p>
		<div class="totp-box">
			<code>{totpSecret}</code>
			<a href={totpUri}><Icon icon="material-symbols:open-in-new-rounded" />Open authenticator app</a>
			<input class="auth-input code-input" inputmode="numeric" maxlength="6" bind:value={totpCode} placeholder="000000" />
			<button class="primary-command" type="button" onclick={() => void verify2FA()} disabled={submitting}><Icon icon="material-symbols:verified-user-outline-rounded" />Verify and finish</button>
		</div>
	{/if}

	{#if error}<p class="message error"><Icon icon="material-symbols:error-outline-rounded" />{error}</p>{/if}
	{#if notice}<p class="message notice"><Icon icon="material-symbols:check-circle-outline-rounded" />{notice}</p>{/if}
</div>

<style>
	.registration-panel { width: 100%; max-width: 28rem; margin: 0 auto; }
	.back-command, .text-command { min-height: 2.75rem; display: inline-flex; align-items: center; gap: .4rem; color: #68798a; font-weight: 700; }
	.progress { display: flex; align-items: center; margin: .75rem 0 1.5rem; }
	.progress span { width: 2rem; height: 2rem; display: grid; place-items: center; border-radius: 50%; background: #e8eff5; color: #52677b; font-weight: 800; }
	.progress span.active { background: #4b9fe8; color: white; }
	.progress i { width: 2.5rem; height: 1px; background: #d8e2eb; }
	h2 { margin: 0; color: #182230; font-size: 2rem; line-height: 1.15; letter-spacing: 0; }
	.intro { margin: .65rem 0 1.5rem; color: #68798a; line-height: 1.65; }
	form, .totp-box { display: flex; flex-direction: column; gap: 1rem; }
	label { display: flex; flex-direction: column; gap: .5rem; color: #33465a; font-weight: 800; }
	label span { color: #8492a1; font-size: .8rem; font-weight: 500; }
	.auth-input { min-height: 3rem; border-radius: .5rem; }
	.field-grid { display: grid; gap: 1rem; }
	.choice { min-height: 2.75rem; flex-direction: row; align-items: center; gap: .7rem; color: #52677b; font-weight: 600; line-height: 1.45; }
	.choice input { width: 1.1rem; height: 1.1rem; flex: none; }
	.choice a { color: #176db8; text-decoration: underline; }
	.primary-command, .secondary-command { min-height: 3rem; display: inline-flex; align-items: center; justify-content: center; gap: .5rem; padding: 0 1rem; border-radius: .5rem; font-weight: 800; }
	.primary-command { background: #dceeff; color: #176db8; }
	.secondary-command { border: 1px solid #d8e2eb; color: #33465a; }
	.primary-command:disabled, .secondary-command:disabled { cursor: wait; opacity: .6; }
	.region-note { display: flex; align-items: center; gap: .75rem; padding: .8rem; border: 1px solid #dce6ee; border-radius: .5rem; color: #428ed1; background: #f5f8fb; }
	.region-note div { display: flex; flex-direction: column; gap: .15rem; }
	.region-note strong { color: #33465a; }
	.region-note span { color: #748395; font-size: .8rem; }
	.security-actions { display: grid; gap: .75rem; }
	.code-input { text-align: center; font-size: 1.3rem; letter-spacing: 0; }
	.totp-box code { overflow-wrap: anywhere; padding: .8rem; border-radius: .5rem; background: #edf3f8; color: #33465a; }
	.totp-box a { min-height: 2.75rem; display: inline-flex; align-items: center; gap: .4rem; color: #176db8; font-weight: 700; }
	.message { display: flex; align-items: flex-start; gap: .5rem; margin: 1rem 0 0; padding: .85rem; border-radius: .5rem; font-weight: 700; }
	.message.error { color: #a82929; background: #fbeaea; }
	.message.notice { color: #177248; background: #e7f5ed; }
	@media (min-width: 768px) { .field-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .security-actions { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
	:global(.dark) h2 { color: #edf3f8; }
	:global(.dark) label, :global(.dark) .region-note strong { color: #dce6ee; }
	:global(.dark) .region-note, :global(.dark) .totp-box code { border-color: #2a3948; background: #121b25; }
</style>
