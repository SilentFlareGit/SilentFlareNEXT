<script lang="ts">
import AuthFormPanel from "./panels/AuthFormPanel.svelte";
import GuestAccessPanel from "./panels/GuestAccessPanel.svelte";
import GuestCapabilitiesPanel from "./panels/GuestCapabilitiesPanel.svelte";
import GuestOverviewPanel from "./panels/GuestOverviewPanel.svelte";

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

<div class="relative mx-auto mt-4 pb-12">
	<div id="main-grid" class="transition duration-700 mx-auto grid w-full grid-cols-1 gap-4 lg:grid-cols-[17.5rem_minmax(0,1fr)]">
		<aside class="mb-4 w-full onload-animation">
			<div class="flex flex-col gap-4">
				<GuestOverviewPanel />
				<div class="transition-all duration-700 flex w-full flex-col gap-4 lg:sticky lg:top-4">
					<GuestAccessPanel />
				</div>
			</div>
		</aside>

		<div class="min-w-0 space-y-4">
			<section class="card-base px-6 py-6 md:px-10 md:py-8 onload-animation" style="animation-delay: 80ms">
				<div class="font-bold transition text-lg text-neutral-900 dark:text-neutral-100 relative ml-6 mb-4 before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)] before:absolute before:left-[-16px] before:top-[5px]">
					Accounts Center
				</div>
				<h1 class="max-w-[15ch] text-3xl font-extrabold leading-[1.1] text-black/90 dark:text-white/90 sm:text-4xl md:text-5xl">
					Your SilentFlare identity
				</h1>
				<p class="mt-4 max-w-[24ch] text-base leading-7 text-black/50 dark:text-white/50 sm:max-w-[58ch] sm:text-lg">
					Manage sign-in, registration, avatar, and public profile details directly from the accounts subsite with the same shell language as the main blog.
				</p>
			</section>

			{#if loading}
				<section class="card-base px-6 py-6 md:px-10 md:py-8 onload-animation" style="animation-delay: 120ms">
					<div class="flex flex-col gap-4">
						<div class="h-14 w-full animate-pulse rounded-xl bg-black/5 dark:bg-white/5"></div>
						<div class="h-14 w-full animate-pulse rounded-xl bg-black/5 dark:bg-white/5"></div>
						<div class="h-14 w-full animate-pulse rounded-xl bg-black/5 dark:bg-white/5"></div>
					</div>
				</section>
			{:else}
				<div class="onload-animation" style="animation-delay: 120ms" aria-live="polite">
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

			<div class="onload-animation" style="animation-delay: 160ms">
				<GuestCapabilitiesPanel />
			</div>
		</div>
	</div>
</div>
