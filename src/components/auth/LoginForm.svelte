<script lang="ts">
import TurnstileWidget from "@components/security/TurnstileWidget.svelte";
import { login, notifyAuthChanged } from "@lib/client/auth";

let { onSuccess }: { onSuccess: () => void } = $props();

let email = $state("");
let password = $state("");
let turnstileToken = $state("");
let error = $state("");
let loading = $state(false);
let resetKey = $state(0);

async function submit() {
	error = "";
	if (!turnstileToken) {
		error = "Please complete human verification.";
		return;
	}

	loading = true;
	try {
		await login({ email, password, turnstileToken });
		notifyAuthChanged();
		onSuccess();
	} catch (err) {
		error = err instanceof Error ? err.message : "Login failed";
		resetKey += 1;
	} finally {
		loading = false;
	}
}
</script>

<form class="flex flex-col gap-4" onsubmit={(event) => { event.preventDefault(); void submit(); }}>
	<label class="flex flex-col gap-2 text-sm font-medium text-75">
		Email
		<input class="auth-input" type="email" autocomplete="email" bind:value={email} required />
	</label>
	<label class="flex flex-col gap-2 text-sm font-medium text-75">
		Password
		<input class="auth-input" type="password" autocomplete="current-password" bind:value={password} required />
	</label>
	<TurnstileWidget action="login" resetKey={resetKey} onTokenChange={(token) => { turnstileToken = token; }} />
	{#if error}
		<p class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/30 dark:text-red-200">{error}</p>
	{/if}
	<button class="btn-regular min-h-11 rounded-lg px-4 font-bold active:scale-95 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={loading}>
		{loading ? "Logging in..." : "Login"}
	</button>
</form>
