<script lang="ts">
import Icon from "@iconify/svelte";
import TurnstileWidget from "../../security/TurnstileWidget.svelte";
import Alert from "../../ui/Alert.svelte";
import Button from "../../ui/Button.svelte";
import AuthBackButton from "../AuthBackButton.svelte";

type AuthUser = {
	id: string;
	email: string;
	username: string;
	role: string;
	displayName: string;
	avatarUrl: string;
};

let {
	apiBase = "/auth-api",
	returnUrl,
	onSuccess,
	on2FARequired,
	onError,
	onBack,
}: {
	apiBase?: string;
	returnUrl: string;
	onSuccess: (user: AuthUser, returnUrl?: string) => void;
	on2FARequired: (pendingId: string) => void;
	onError: (msg: string) => void;
	onBack: () => void;
} = $props();

let emailOrUsername = $state("");
let password = $state("");
let showPassword = $state(false);
let turnstileToken = $state("");
let resetKey = $state(0);
let submitting = $state(false);
let error = $state("");

async function submit() {
	if (!turnstileToken) {
		error = "Complete the security verification first.";
		return;
	}
	submitting = true;
	error = "";
	try {
		const res = await fetch(`${apiBase}/auth/login/password`, {
			method: "POST",
			credentials: "include",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				email_or_username: emailOrUsername,
				password,
				turnstile_token: turnstileToken,
				return_url: returnUrl,
			}),
		});
		const data = (await res.json().catch(() => ({}))) as {
			detail?: string;
			error?: string;
			requires_2fa?: boolean;
			pending_id?: string;
			user?: AuthUser;
			return_url?: string;
		};
		if (!res.ok) throw new Error(data.detail || data.error || "Login failed");
		if (data.requires_2fa && data.pending_id) {
			on2FARequired(data.pending_id);
		} else if (data.user) {
			onSuccess(data.user, data.return_url);
		}
	} catch (err) {
		error = err instanceof Error ? err.message : "Login failed";
		turnstileToken = "";
		resetKey++;
	} finally {
		submitting = false;
	}
}

// Silence unused prop warning — onError is available for parent escalation if needed
$effect(() => {
	void onError;
});
</script>

<div class="mx-auto w-full max-w-[360px]">
	<AuthBackButton onclick={onBack} />

	<h2 class="mb-1 text-2xl font-extrabold text-black/90 dark:text-white/90">Sign in</h2>
	<p class="mb-8 text-sm text-black/45 dark:text-white/45">Use your email or username with password</p>

	<form class="flex flex-col gap-5" onsubmit={(e) => { e.preventDefault(); void submit(); }}>
		<label class="flex flex-col gap-2 text-[0.9rem] font-bold text-black/70 dark:text-white/70">
			Email or username
			<input
				class="auth-input"
				bind:value={emailOrUsername}
				autocomplete="email username"
				placeholder="you@example.com or username"
				required
			/>
		</label>
		<label class="flex flex-col gap-2 text-[0.9rem] font-bold text-black/70 dark:text-white/70">
			Password
			<div class="relative">
				<input
					class="auth-input pr-11"
					type={showPassword ? "text" : "password"}
					bind:value={password}
					autocomplete="current-password"
					required
				/>
				<button
					type="button"
					class="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 transition-colors hover:text-black/70 dark:text-white/40 dark:hover:text-white/70"
					onclick={() => (showPassword = !showPassword)}
					aria-label={showPassword ? "Hide password" : "Show password"}
				>
					<Icon
						icon={showPassword
							? "material-symbols:visibility-off-outline-rounded"
							: "material-symbols:visibility-outline-rounded"}
						class="text-[1.2rem]"
					/>
				</button>
			</div>
		</label>
		<div class="border-t border-[var(--line-divider)] pt-5">
			<p class="mb-3 text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/40">Security verification</p>
			<TurnstileWidget action="login" {resetKey} onTokenChange={(t) => { turnstileToken = t; }} />
		</div>
		<Button type="submit" icon="material-symbols:login-rounded" loading={submitting} full>Sign in</Button>
	</form>

	{#if error}<div class="mt-5"><Alert tone="error" message={error} /></div>{/if}
</div>
