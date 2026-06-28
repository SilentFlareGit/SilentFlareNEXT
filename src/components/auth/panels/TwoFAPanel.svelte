<script lang="ts">
import Icon from "@iconify/svelte";

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
	pendingId,
	onSuccess,
	onError,
	onBack,
}: {
	apiBase?: string;
	pendingId: string;
	onSuccess: (user: AuthUser, returnUrl?: string) => void;
	onError: (msg: string) => void;
	onBack: () => void;
} = $props();

let code = $state("");
let submitting = $state(false);
let error = $state("");

async function submit() {
	submitting = true;
	error = "";
	try {
		const res = await fetch(`${apiBase}/auth/2fa/verify`, {
			method: "POST",
			credentials: "include",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ pending_id: pendingId, code }),
		});
		const data = (await res.json().catch(() => ({}))) as {
			detail?: string;
			error?: string;
			user?: AuthUser;
			return_url?: string;
		};
		if (!res.ok) throw new Error(data.detail || data.error || "Invalid code");
		if (data.user) onSuccess(data.user, data.return_url);
	} catch (err) {
		error = err instanceof Error ? err.message : "Verification failed";
		code = "";
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
	<button
		type="button"
		class="mb-6 flex items-center gap-1.5 text-sm text-black/45 transition-colors hover:text-black/70 dark:text-white/45 dark:hover:text-white/70"
		onclick={onBack}
	>
		<Icon icon="material-symbols:arrow-back-rounded" class="text-[1.1rem]" />
		Start over
	</button>

	<h2 class="mb-1 text-2xl font-extrabold text-black/90 dark:text-white/90">Two-factor auth</h2>
	<p class="mb-8 text-sm text-black/45 dark:text-white/45">Open your authenticator app and enter the 6-digit code</p>

	<form class="flex flex-col gap-5" onsubmit={(e) => { e.preventDefault(); void submit(); }}>
		<label class="flex flex-col gap-2 text-[0.9rem] font-bold text-black/70 dark:text-white/70">
			Authenticator code
			<input
				class="auth-input text-center text-xl font-bold tracking-[0.3em]"
				type="text"
				inputmode="numeric"
				bind:value={code}
				maxlength={6}
				pattern="[0-9]{6}"
				placeholder="000000"
				autofocus
				required
			/>
		</label>
		<p class="text-xs text-black/40 dark:text-white/40">
			Compatible with Google Authenticator, Microsoft Authenticator, 1Password, Bitwarden, and other TOTP apps.
		</p>
		<button
			class="btn-regular scale-animation flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[1rem] font-bold disabled:cursor-wait disabled:opacity-70"
			type="submit"
			disabled={submitting}
		>
			{#if submitting}
				<span class="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
			{:else}
				<Icon icon="material-symbols:verified-outline-rounded" class="text-[1.2rem]" />
			{/if}
			{submitting ? "Verifying..." : "Verify"}
		</button>
	</form>

	{#if error}
		<div class="mt-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-[0.9rem] font-bold text-red-600 dark:text-red-400">
			<Icon icon="material-symbols:error-outline-rounded" class="mt-0.5 shrink-0 text-[1.2rem]" />
			<p class="leading-snug">{error}</p>
		</div>
	{/if}
</div>
