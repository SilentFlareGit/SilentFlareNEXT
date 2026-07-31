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

	<div class="method-stack">
		<div class="method-list">
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
		</div>

		<!-- Reserved OAuth entry points. API routes exist and report unavailable until configured. -->
		<div class="oauth-list">
			<button
				type="button"
				disabled
				class="oauth-option"
				title="Google login (coming soon)"
			>
				<Icon icon="fa6-brands:google" class="text-[1rem]" />
				<span class="hidden sm:inline">Google</span>
			</button>
			<button
				type="button"
				disabled
				class="oauth-option"
				title="GitHub login (coming soon)"
			>
				<Icon icon="fa6-brands:github" class="text-[1rem]" />
				<span class="hidden sm:inline">GitHub</span>
			</button>
			<button
				type="button"
				disabled
				class="oauth-option"
				title="Telegram login (coming soon)"
			>
				<Icon icon="fa6-brands:telegram" class="text-[1rem]" />
				<span class="hidden sm:inline">Telegram</span>
			</button>
		</div>
		<p class="oauth-note">OAuth coming soon</p>
	</div>

	<div class="mt-7 border-t border-[var(--line-divider)] pt-6 text-center">
		<p class="mb-3 text-sm text-[var(--sf-text-muted)]">New to SilentFlare? Create an account, then manage profile, privacy, sessions, and notifications.</p>
		<Button variant="secondary" full onclick={onRegister}>Create an account</Button>
	</div>

	{#if notice}<div class="mt-5"><Alert tone="success" message={notice} /></div>{/if}
	{#if error}<div class="mt-5"><Alert tone="error" message={error} /></div>{/if}
</div>

<style>
	.method-stack {
		display: grid;
		gap: 1rem;
	}
	.method-list {
		overflow: hidden;
		border: 1px solid var(--sf-border);
		border-radius: var(--sf-radius-md);
		background: var(--sf-surface-subtle);
	}
	.method-option {
		width: 100%;
		min-height: 4.75rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		border: 0;
		padding: 0.85rem;
		background: transparent;
		color: var(--sf-text);
		text-align: left;
		cursor: pointer;
		transition: color 150ms ease, background-color 150ms ease;
	}
	.method-option + .method-option {
		border-top: 1px solid var(--sf-border);
	}
	.method-option:hover {
		color: var(--sf-accent-strong);
		background: var(--sf-surface-muted);
	}
	.oauth-list {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		overflow: hidden;
		border: 1px solid var(--sf-border);
		border-radius: var(--sf-radius-md);
	}
	.oauth-option {
		min-width: 0;
		min-height: 2.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		border: 0;
		padding: 0.7rem 0.45rem;
		background: transparent;
		color: var(--sf-text-soft);
		font-size: 0.8rem;
		opacity: 0.55;
		cursor: not-allowed;
	}
	.oauth-option + .oauth-option {
		border-left: 1px solid var(--sf-border);
	}
	.oauth-note {
		margin: -0.4rem 0 0;
		color: var(--sf-text-soft);
		font-size: 0.75rem;
		text-align: center;
	}
	@media (max-width: 420px) {
		.oauth-option span {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.method-option {
			transition: none;
		}
	}
</style>
