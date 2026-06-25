<script lang="ts">
import AuthBrandPanel from "./panels/AuthBrandPanel.svelte";
import AuthFormPanel from "./panels/AuthFormPanel.svelte";

let {
	mode = $bindable("login"),
	loading,
	submitting,
	error,
	notice,

	loginEmail = $bindable(""),
	loginPassword = $bindable(""),
	loginTurnstileToken = $bindable(""),
	loginResetKey,
	submitLogin,

	registerEmail = $bindable(""),
	registerUsername = $bindable(""),
	registerPassword = $bindable(""),
	confirmPassword = $bindable(""),
	registerTurnstileToken = $bindable(""),
	registerResetKey,
	submitRegister,
} = $props();
</script>

<div class="mx-auto mt-6 pb-12 onload-animation">
	<!-- Split-panel auth card -->
	<div class="overflow-hidden rounded-[var(--radius-large)] shadow-sm">
		<div class="grid grid-cols-1 lg:grid-cols-[5fr_7fr] lg:min-h-[580px]">

			<!-- Left: brand panel (hidden on mobile) -->
			<AuthBrandPanel {mode} />

			<!-- Right: form panel -->
			<div class="flex flex-col justify-center bg-[var(--card-bg)] px-8 py-12 md:px-12 lg:px-14">

				<!-- Mobile-only wordmark (brand panel is hidden on small screens) -->
				<div class="mb-8 flex items-center gap-2 lg:hidden">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--btn-regular-bg)] text-[var(--primary)]">
						<svg width="1em" height="1em" class="text-[1.1rem]" data-icon="material-symbols:shield-lock-outline-rounded">
							<use href="#ai:material-symbols:shield-lock-outline-rounded"></use>
						</svg>
					</div>
					<span class="text-sm font-bold text-black/70 dark:text-white/70">SilentFlare Accounts</span>
				</div>

				{#if loading}
					<!-- Loading skeleton in form area -->
					<div class="mx-auto w-full max-w-[360px] flex flex-col gap-4">
						<div class="h-8 w-40 animate-pulse rounded-lg bg-black/5 dark:bg-white/5"></div>
						<div class="h-4 w-28 animate-pulse rounded-md bg-black/5 dark:bg-white/5"></div>
						<div class="mt-3 h-11 w-full animate-pulse rounded-xl bg-black/5 dark:bg-white/5"></div>
						<div class="h-11 w-full animate-pulse rounded-xl bg-black/5 dark:bg-white/5"></div>
						<div class="h-11 w-full animate-pulse rounded-xl bg-black/5 dark:bg-white/5"></div>
					</div>
				{:else}
					<div aria-live="polite">
						<AuthFormPanel
							bind:mode
							{submitting}
							{error}
							{notice}
							bind:loginEmail
							bind:loginPassword
							bind:loginTurnstileToken
							{loginResetKey}
							{submitLogin}
							bind:registerEmail
							bind:registerUsername
							bind:registerPassword
							bind:confirmPassword
							bind:registerTurnstileToken
							{registerResetKey}
							{submitRegister}
						/>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
