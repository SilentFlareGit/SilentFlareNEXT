<script lang="ts">
import TurnstileWidget from "../../security/TurnstileWidget.svelte";
import Alert from "../../ui/Alert.svelte";
import Button from "../../ui/Button.svelte";
import AuthBackButton from "../AuthBackButton.svelte";

type AuthUser = {
	id: string;
	email: string;
	username: string;
	displayName: string;
};
let { apiBase, returnUrl, onSuccess, on2FARequired, onBack } = $props<{
	apiBase: string;
	returnUrl: string;
	onSuccess: (user: AuthUser, returnUrl?: string) => void;
	on2FARequired: (pendingId: string) => void;
	onBack: () => void;
}>();

let phase = $state<"email" | "code">("email");
let email = $state("");
let code = $state("");
let turnstileToken = $state("");
let resetKey = $state(0);
let submitting = $state(false);
let error = $state("");

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

async function requestCode() {
	if (!turnstileToken) {
		error = "Complete the security check first.";
		return;
	}
	submitting = true;
	error = "";
	try {
		await post("/auth/login/email/request", {
			email,
			turnstile_token: turnstileToken,
			return_url: returnUrl,
		});
		phase = "code";
	} catch (reason) {
		error = reason instanceof Error ? reason.message : "Could not send code";
		turnstileToken = "";
		resetKey += 1;
	} finally {
		submitting = false;
	}
}

async function verifyCode() {
	submitting = true;
	error = "";
	try {
		const result = await post<{
			requires_2fa?: boolean;
			pending_id?: string;
			user?: AuthUser;
			return_url?: string;
		}>("/auth/login/email/verify", { email, code, return_url: returnUrl });
		if (result.requires_2fa && result.pending_id)
			on2FARequired(result.pending_id);
		else if (result.user) onSuccess(result.user, result.return_url);
	} catch (reason) {
		error = reason instanceof Error ? reason.message : "Verification failed";
		code = "";
	} finally {
		submitting = false;
	}
}
</script>

<div class="mx-auto w-full max-w-[360px]">
	<AuthBackButton label="All sign-in methods" onclick={onBack} />
	<h2 class="mb-1 text-2xl font-extrabold text-[var(--sf-text)]">Email code</h2>
	<p class="mb-8 text-sm leading-6 text-[var(--sf-text-muted)]">{phase === "email" ? "We’ll send a short-lived code and a secure verification link. No password is required." : `Enter the six-digit code sent to ${email}, or use the link in that email.`}</p>
	{#if phase === "email"}
		<form class="flex flex-col gap-5" onsubmit={(event) => { event.preventDefault(); void requestCode(); }}>
			<label class="flex flex-col gap-2 font-bold text-75">Email address<input class="auth-input min-h-11" type="email" autocomplete="email" bind:value={email} required /></label>
			<TurnstileWidget action="login" {resetKey} onTokenChange={(token) => (turnstileToken = token)} />
			<Button type="submit" icon="material-symbols:send-outline-rounded" loading={submitting} full>Send code</Button>
		</form>
	{:else}
		<form class="flex flex-col gap-5" onsubmit={(event) => { event.preventDefault(); void verifyCode(); }}>
			<label class="flex flex-col gap-2 font-bold text-75">Verification code<input class="auth-input min-h-11 text-center text-xl tracking-[.3em]" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="one-time-code" bind:value={code} required /></label>
			<Button type="submit" icon="material-symbols:verified-outline-rounded" loading={submitting} full>Continue</Button>
			<button type="button" class="min-h-11 text-sm text-50 hover:text-[var(--primary)]" onclick={() => { phase = "email"; code = ""; resetKey += 1; }}>Use another email</button>
		</form>
	{/if}
	{#if error}<div class="mt-5"><Alert tone="error" message={error} /></div>{/if}
</div>
