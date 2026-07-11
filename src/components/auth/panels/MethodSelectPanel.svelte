<script lang="ts">
import Icon from "@iconify/svelte";
import Alert from "../../ui/Alert.svelte";
import Button from "../../ui/Button.svelte";

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
	<h2 class="mb-1 text-2xl font-extrabold text-[var(--sf-text)]">Sign in</h2>
	<p class="mb-8 text-sm leading-6 text-[var(--sf-text-muted)]">One account for the blog, comments, Account Center, and every SilentFlare subsite.</p>

	<div class="flex flex-col gap-3">
		<button
			type="button"
			class="method-option"
			onclick={onSelectEmailCode}
		>
			<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--btn-regular-bg)]">
				<Icon icon="material-symbols:mail-outline-rounded" class="text-[1.3rem] text-[var(--primary)]" />
			</span>
			<div>
				<p class="font-bold text-[var(--sf-text)]">Email verification code</p>
				<p class="mt-0.5 text-xs text-[var(--sf-text-muted)]">No password needed; we email you a code</p>
			</div>
			<Icon icon="material-symbols:chevron-right-rounded" class="ml-auto shrink-0 text-[1.3rem] text-black/30 dark:text-white/30" />
		</button>

		<button
			type="button"
			class="method-option"
			onclick={onSelectPassword}
		>
			<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--btn-regular-bg)]">
				<Icon icon="material-symbols:key-outline-rounded" class="text-[1.3rem] text-[var(--primary)]" />
			</span>
			<div>
				<p class="font-bold text-[var(--sf-text)]">Email or username + password</p>
				<p class="mt-0.5 text-xs text-[var(--sf-text-muted)]">Sign in with your credentials</p>
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
		<p class="text-center text-xs text-[var(--sf-text-soft)]">OAuth coming soon</p>
	</div>

	<div class="mt-7 border-t border-[var(--line-divider)] pt-6 text-center">
		<p class="mb-3 text-sm text-[var(--sf-text-muted)]">New to SilentFlare? Create an account, then manage profile, privacy, sessions, and notifications.</p>
		<Button variant="secondary" full onclick={onRegister}>Create an account</Button>
	</div>

	{#if notice}<div class="mt-5"><Alert tone="success" message={notice} /></div>{/if}
	{#if error}<div class="mt-5"><Alert tone="error" message={error} /></div>{/if}
</div>

<style>
	.method-option {
		width: 100%;
		min-height: 4.75rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		border: 0;
		border-bottom: 1px solid var(--sf-border);
		padding: 0.85rem 0.25rem;
		background: transparent;
		color: var(--sf-text);
		text-align: left;
		cursor: pointer;
		transition: color 150ms ease, background-color 150ms ease;
	}
	.method-option:first-child {
		border-top: 1px solid var(--sf-border);
	}
	.method-option:hover {
		color: var(--sf-accent-strong);
		background: var(--sf-surface-subtle);
	}
</style>
