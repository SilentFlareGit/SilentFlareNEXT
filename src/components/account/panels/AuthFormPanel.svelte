<script lang="ts">
import Icon from "@iconify/svelte";
import TurnstileWidget from "../../security/TurnstileWidget.svelte";

let {
	mode = $bindable("login"),
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

<section class="card-base px-6 py-6 md:px-10 md:py-8">
	<div class="mb-6 flex items-start justify-between gap-4">
		<div>
			<div class="font-bold transition text-lg text-neutral-900 dark:text-neutral-100 relative ml-6 mb-3 before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)] before:absolute before:left-[-16px] before:top-[5px]">
				Access
			</div>
			<h2 class="text-2xl font-extrabold text-black/90 dark:text-white/90">
				{mode === "login" ? "Log in to your account" : "Create your account"}
			</h2>
			<p class="mt-2 max-w-[26ch] text-black/50 dark:text-white/50 sm:max-w-[52ch]">
				Cloudflare verification is required before any login or registration request reaches the account API.
			</p>
		</div>
	</div>

	<div class="mb-7 flex rounded-xl bg-[var(--btn-plain-bg)] p-1" role="tablist" aria-label="Account action">
		<button
			class="auth-tab flex-1 transition {mode === 'login' ? 'auth-tab-active' : 'hover:bg-black/5 dark:hover:bg-white/5 hover:text-black/75 dark:hover:text-white/75'}"
			type="button"
			role="tab"
			aria-selected={mode === "login"}
			onclick={() => (mode = "login")}
		>
			Login
		</button>
		<button
			class="auth-tab flex-1 transition {mode === 'register' ? 'auth-tab-active' : 'hover:bg-black/5 dark:hover:bg-white/5 hover:text-black/75 dark:hover:text-white/75'}"
			type="button"
			role="tab"
			aria-selected={mode === "register"}
			onclick={() => (mode = "register")}
		>
			Register
		</button>
	</div>

	{#if mode === "login"}
		<form class="flex flex-col gap-5" onsubmit={(event) => {
			event.preventDefault();
			void submitLogin();
		}}>
			<label class="flex flex-col gap-2 font-bold text-[0.9rem] text-black/75 dark:text-white/75">
				<span>Email</span>
				<input class="auth-input" bind:value={loginEmail} type="email" autocomplete="email" required />
			</label>
			<label class="flex flex-col gap-2 font-bold text-[0.9rem] text-black/75 dark:text-white/75">
				<span>Password</span>
				<input class="auth-input" bind:value={loginPassword} type="password" autocomplete="current-password" required />
			</label>
			<div class="pt-1">
				<TurnstileWidget
					action="login"
					resetKey={loginResetKey}
					onTokenChange={(token) => {
						loginTurnstileToken = token;
					}}
				/>
			</div>
			<button class="btn-regular scale-animation mt-2 flex w-full items-center justify-center rounded-xl py-3.5 text-[1rem] font-bold disabled:cursor-wait disabled:opacity-70" type="submit" disabled={submitting}>
				<Icon icon="material-symbols:login-rounded" class="mr-2 text-[1.25rem]" />
				<span>{submitting ? "Signing in..." : "Login"}</span>
			</button>
		</form>
	{:else}
		<form class="flex flex-col gap-5" onsubmit={(event) => {
			event.preventDefault();
			void submitRegister();
		}}>
			<label class="flex flex-col gap-2 font-bold text-[0.9rem] text-black/75 dark:text-white/75">
				<span>Email</span>
				<input class="auth-input" bind:value={registerEmail} type="email" autocomplete="email" required />
			</label>
			<label class="flex flex-col gap-2 font-bold text-[0.9rem] text-black/75 dark:text-white/75">
				<span>Username</span>
				<input class="auth-input" bind:value={registerUsername} autocomplete="username" minlength="3" maxlength="24" required />
			</label>
			<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
				<label class="flex flex-col gap-2 font-bold text-[0.9rem] text-black/75 dark:text-white/75">
					<span>Password</span>
					<input class="auth-input" bind:value={registerPassword} type="password" autocomplete="new-password" minlength="8" required />
				</label>
				<label class="flex flex-col gap-2 font-bold text-[0.9rem] text-black/75 dark:text-white/75">
					<span>Confirm password</span>
					<input class="auth-input" bind:value={confirmPassword} type="password" autocomplete="new-password" minlength="8" required />
				</label>
			</div>
			<div class="pt-1">
				<TurnstileWidget
					action="register"
					resetKey={registerResetKey}
					onTokenChange={(token) => {
						registerTurnstileToken = token;
					}}
				/>
			</div>
			<button class="btn-regular scale-animation mt-2 flex w-full items-center justify-center rounded-xl py-3.5 text-[1rem] font-bold disabled:cursor-wait disabled:opacity-70" type="submit" disabled={submitting}>
				<Icon icon="material-symbols:person-add-rounded" class="mr-2 text-[1.25rem]" />
				<span>{submitting ? "Creating..." : "Create account"}</span>
			</button>
		</form>
	{/if}

	{#if error}
		<div class="mt-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-[0.95rem] font-bold text-red-600 dark:text-red-400">
			<Icon icon="material-symbols:error-outline-rounded" class="mt-0.5 shrink-0 text-[1.3rem]" />
			<p class="leading-snug">{error}</p>
		</div>
	{/if}
	{#if notice}
		<div class="mt-6 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-[0.95rem] font-bold text-emerald-600 dark:text-emerald-400">
			<Icon icon="material-symbols:check-circle-outline-rounded" class="mt-0.5 shrink-0 text-[1.3rem]" />
			<p class="leading-snug">{notice}</p>
		</div>
	{/if}
</section>
