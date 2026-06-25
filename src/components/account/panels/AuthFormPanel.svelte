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

let showLoginPassword = $state(false);
let showRegisterPassword = $state(false);
let showConfirmPassword = $state(false);

let passwordMatch = $derived(
	confirmPassword.length > 0 && registerPassword === confirmPassword,
);
let passwordMismatch = $derived(
	confirmPassword.length > 0 && registerPassword !== confirmPassword,
);
</script>

<div class="mx-auto w-full max-w-[360px]">
	<!-- Section heading -->
	<div class="mb-7">
		<h2 class="text-2xl font-extrabold text-black/90 dark:text-white/90">
			{mode === "login" ? "Sign in" : "Create an account"}
		</h2>
		<p class="mt-1 text-sm text-black/45 dark:text-white/45">
			to your SilentFlare account
		</p>
	</div>

	<!-- Animated sliding tab switcher -->
	<div class="relative mb-7 flex rounded-xl bg-[var(--btn-plain-bg)] p-1" role="tablist" aria-label="Account action">
		<div
			class="pointer-events-none absolute top-1 bottom-1 left-1 rounded-lg bg-[var(--card-bg)] shadow-sm transition-transform duration-300 ease-in-out"
			style="width: calc(50% - 8px); transform: translateX({mode === 'register' ? 'calc(100% + 8px)' : '0'})"
		></div>
		<button
			class="relative z-10 auth-tab flex-1 transition-colors duration-200 {mode === 'login' ? 'text-[var(--primary)]' : 'hover:text-black/75 dark:hover:text-white/75'}"
			type="button"
			role="tab"
			aria-selected={mode === "login"}
			onclick={() => (mode = "login")}
		>
			Login
		</button>
		<button
			class="relative z-10 auth-tab flex-1 transition-colors duration-200 {mode === 'register' ? 'text-[var(--primary)]' : 'hover:text-black/75 dark:hover:text-white/75'}"
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
			<label class="flex flex-col gap-2 font-bold text-[0.9rem] text-black/70 dark:text-white/70">
				<span>Email</span>
				<input class="auth-input" bind:value={loginEmail} type="email" autocomplete="email" required />
			</label>
			<label class="flex flex-col gap-2 font-bold text-[0.9rem] text-black/70 dark:text-white/70">
				<span>Password</span>
				<div class="relative">
					<input
						class="auth-input pr-11"
						bind:value={loginPassword}
						type={showLoginPassword ? "text" : "password"}
						autocomplete="current-password"
						required
					/>
					<button
						type="button"
						class="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/70 dark:text-white/40 dark:hover:text-white/70 transition-colors"
						onclick={() => (showLoginPassword = !showLoginPassword)}
						aria-label={showLoginPassword ? "Hide password" : "Show password"}
					>
						<Icon
							icon={showLoginPassword
								? "material-symbols:visibility-off-outline-rounded"
								: "material-symbols:visibility-outline-rounded"}
							class="text-[1.2rem]"
						/>
					</button>
				</div>
			</label>
			<div class="border-t border-[var(--line-divider)] pt-5">
				<p class="mb-3 text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/40">
					Security verification
				</p>
				<TurnstileWidget
					action="login"
					resetKey={loginResetKey}
					onTokenChange={(token) => {
						loginTurnstileToken = token;
					}}
				/>
			</div>
			<button
				class="btn-regular scale-animation mt-1 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[1rem] font-bold disabled:cursor-wait disabled:opacity-70"
				type="submit"
				disabled={submitting}
			>
				{#if submitting}
					<span class="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
				{:else}
					<Icon icon="material-symbols:login-rounded" class="text-[1.25rem]" />
				{/if}
				<span>{submitting ? "Signing in..." : "Sign in"}</span>
			</button>
		</form>
	{:else}
		<form class="flex flex-col gap-5" onsubmit={(event) => {
			event.preventDefault();
			void submitRegister();
		}}>
			<label class="flex flex-col gap-2 font-bold text-[0.9rem] text-black/70 dark:text-white/70">
				<span>Email</span>
				<input class="auth-input" bind:value={registerEmail} type="email" autocomplete="email" required />
			</label>
			<label class="flex flex-col gap-2 font-bold text-[0.9rem] text-black/70 dark:text-white/70">
				<span>Username</span>
				<input
					class="auth-input"
					bind:value={registerUsername}
					autocomplete="username"
					minlength="3"
					maxlength="24"
					required
				/>
			</label>
			<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
				<label class="flex flex-col gap-2 font-bold text-[0.9rem] text-black/70 dark:text-white/70">
					<span>Password</span>
					<div class="relative">
						<input
							class="auth-input pr-11"
							bind:value={registerPassword}
							type={showRegisterPassword ? "text" : "password"}
							autocomplete="new-password"
							minlength="8"
							required
						/>
						<button
							type="button"
							class="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/70 dark:text-white/40 dark:hover:text-white/70 transition-colors"
							onclick={() => (showRegisterPassword = !showRegisterPassword)}
							aria-label={showRegisterPassword ? "Hide password" : "Show password"}
						>
							<Icon
								icon={showRegisterPassword
									? "material-symbols:visibility-off-outline-rounded"
									: "material-symbols:visibility-outline-rounded"}
								class="text-[1.2rem]"
							/>
						</button>
					</div>
					<p class="text-[0.75rem] font-normal text-black/40 dark:text-white/40">Min 8 characters</p>
				</label>
				<label class="flex flex-col gap-2 font-bold text-[0.9rem] text-black/70 dark:text-white/70">
					<div class="flex items-center justify-between">
						<span>Confirm</span>
						{#if passwordMatch}
							<Icon icon="material-symbols:check-circle-outline-rounded" class="text-[1rem] text-emerald-500" />
						{:else if passwordMismatch}
							<Icon icon="material-symbols:cancel-outline-rounded" class="text-[1rem] text-red-500" />
						{/if}
					</div>
					<div class="relative">
						<input
							class="auth-input pr-11 {passwordMismatch
								? 'border-red-400/60'
								: passwordMatch
									? 'border-emerald-400/60'
									: ''}"
							bind:value={confirmPassword}
							type={showConfirmPassword ? "text" : "password"}
							autocomplete="new-password"
							minlength="8"
							required
						/>
						<button
							type="button"
							class="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/70 dark:text-white/40 dark:hover:text-white/70 transition-colors"
							onclick={() => (showConfirmPassword = !showConfirmPassword)}
							aria-label={showConfirmPassword ? "Hide password" : "Show password"}
						>
							<Icon
								icon={showConfirmPassword
									? "material-symbols:visibility-off-outline-rounded"
									: "material-symbols:visibility-outline-rounded"}
								class="text-[1.2rem]"
							/>
						</button>
					</div>
				</label>
			</div>
			<div class="border-t border-[var(--line-divider)] pt-5">
				<p class="mb-3 text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/40">
					Security verification
				</p>
				<TurnstileWidget
					action="register"
					resetKey={registerResetKey}
					onTokenChange={(token) => {
						registerTurnstileToken = token;
					}}
				/>
			</div>
			<button
				class="btn-regular scale-animation mt-1 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[1rem] font-bold disabled:cursor-wait disabled:opacity-70"
				type="submit"
				disabled={submitting}
			>
				{#if submitting}
					<span class="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
				{:else}
					<Icon icon="material-symbols:person-add-rounded" class="text-[1.25rem]" />
				{/if}
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
</div>
