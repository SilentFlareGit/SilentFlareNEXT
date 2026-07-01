<script lang="ts">
import Icon from "@iconify/svelte";

let {
	onSelectEmailCode,
	onSelectPassword,
	onRegister,
	notice = "",
	error = "",
}: {
	onSelectEmailCode: () => void;
	onSelectPassword: () => void;
	onRegister: () => void;
	notice?: string;
	error?: string;
} = $props();
</script>

<div class="mx-auto w-full max-w-[360px]">
	<h2 class="mb-1 text-2xl font-extrabold text-black/90 dark:text-white/90">Sign in</h2>
	<p class="mb-8 text-sm leading-6 text-black/45 dark:text-white/45">One account for the blog and every SilentFlare subsite.</p>

	<div class="flex flex-col gap-3">
		<button
			type="button"
			class="flex w-full items-center gap-4 rounded-xl border border-[var(--line-divider)] bg-[var(--btn-plain-bg)] px-5 py-4 text-left transition-all hover:border-[var(--primary)]/30 hover:bg-[var(--btn-regular-bg)] active:scale-[0.98]"
			onclick={onSelectEmailCode}
		>
			<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--btn-regular-bg)]">
				<Icon icon="material-symbols:mail-outline-rounded" class="text-[1.3rem] text-[var(--primary)]" />
			</span>
			<div>
				<p class="font-bold text-black/85 dark:text-white/85">Email verification code</p>
				<p class="mt-0.5 text-xs text-black/45 dark:text-white/45">No password needed; we email you a code</p>
			</div>
			<Icon icon="material-symbols:chevron-right-rounded" class="ml-auto shrink-0 text-[1.3rem] text-black/30 dark:text-white/30" />
		</button>

		<button
			type="button"
			class="flex w-full items-center gap-4 rounded-xl border border-[var(--line-divider)] bg-[var(--btn-plain-bg)] px-5 py-4 text-left transition-all hover:border-[var(--primary)]/30 hover:bg-[var(--btn-regular-bg)] active:scale-[0.98]"
			onclick={onSelectPassword}
		>
			<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--btn-regular-bg)]">
				<Icon icon="material-symbols:lock-outline-rounded" class="text-[1.3rem] text-[var(--primary)]" />
			</span>
			<div>
				<p class="font-bold text-black/85 dark:text-white/85">Email or username + password</p>
				<p class="mt-0.5 text-xs text-black/45 dark:text-white/45">Sign in with your credentials</p>
			</div>
			<Icon icon="material-symbols:chevron-right-rounded" class="ml-auto shrink-0 text-[1.3rem] text-black/30 dark:text-white/30" />
		</button>

		<!-- Reserved OAuth entry points. API routes exist and report unavailable until configured. -->
		<div class="mt-2 grid grid-cols-3 gap-2">
			<button
				type="button"
				disabled
				class="flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[var(--line-divider)] px-3 py-3 text-sm font-medium text-black/35 opacity-50 dark:text-white/35"
				title="Google login (coming soon)"
			>
				<Icon icon="fa6-brands:google" class="text-[1rem]" />
				<span class="hidden sm:inline">Google</span>
			</button>
			<button
				type="button"
				disabled
				class="flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[var(--line-divider)] px-3 py-3 text-sm font-medium text-black/35 opacity-50 dark:text-white/35"
				title="GitHub login (coming soon)"
			>
				<Icon icon="fa6-brands:github" class="text-[1rem]" />
				<span class="hidden sm:inline">GitHub</span>
			</button>
			<button
				type="button"
				disabled
				class="flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[var(--line-divider)] px-3 py-3 text-sm font-medium text-black/35 opacity-50 dark:text-white/35"
				title="Telegram login (coming soon)"
			>
				<Icon icon="fa6-brands:telegram" class="text-[1rem]" />
				<span class="hidden sm:inline">Telegram</span>
			</button>
		</div>
		<p class="text-center text-xs text-black/30 dark:text-white/30">OAuth coming soon</p>
	</div>

	<div class="mt-7 border-t border-[var(--line-divider)] pt-6 text-center">
		<p class="mb-3 text-sm text-black/50 dark:text-white/50">New to SilentFlare?</p>
		<button type="button" class="min-h-11 w-full rounded-lg border border-[var(--line-divider)] px-4 font-bold text-[var(--primary)] transition-colors hover:bg-[var(--btn-regular-bg)]" onclick={onRegister}>
			Create an account
		</button>
	</div>

	{#if notice}
		<div class="mt-5 flex items-start gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-[0.9rem] font-bold text-emerald-700 dark:text-emerald-400">
			<Icon icon="material-symbols:check-circle-outline-rounded" class="mt-0.5 shrink-0 text-[1.2rem]" />
			<p class="leading-snug">{notice}</p>
		</div>
	{/if}

	{#if error}
		<div class="mt-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-[0.9rem] font-bold text-red-600 dark:text-red-400">
			<Icon icon="material-symbols:error-outline-rounded" class="mt-0.5 shrink-0 text-[1.2rem]" />
			<p class="leading-snug">{error}</p>
		</div>
	{/if}
</div>
