<script lang="ts">
import Icon from "@iconify/svelte";
import TurnstileWidget from "../security/TurnstileWidget.svelte";

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

<div class="z-50 pointer-events-none relative transition-all duration-700 max-w-[var(--page-width)] px-0 md:px-4 mx-auto pt-4 md:pt-0">
    <div class="pointer-events-auto sticky top-0 transition-all">
        <div class="card-base !overflow-visible max-w-[var(--page-width)] h-[4.5rem] md:!rounded-t-none mx-auto flex items-center justify-between px-4">
            <a href="/" class="btn-plain scale-animation rounded-lg h-[3.25rem] px-5 font-bold active:scale-95">
                <div class="flex flex-row text-[var(--primary)] items-center text-md">
                    <Icon icon="material-symbols:home-outline-rounded" class="text-[1.75rem] mb-1 mr-2" />
                    SilentFlare
                </div>
            </a>
        </div>
    </div>
</div>

<div class="relative max-w-[var(--page-width)] mx-auto pointer-events-auto mt-4 px-0 md:px-4 pb-12">
    <div class="flex flex-col lg:flex-row gap-4">
        
        <!-- Left Banner Card -->
        <section class="card-base p-8 md:p-12 lg:p-16 flex-1 flex flex-col justify-center min-h-[auto] lg:min-h-[500px] onload-animation">
            <div>
                <div class="font-bold transition text-xl text-neutral-900 dark:text-neutral-100 relative ml-8 mt-4 mb-6 before:w-1.5 before:h-6 before:rounded-md before:bg-[var(--primary)] before:absolute before:left-[-20px] before:top-[1.5px]">
                    Accounts Center
                </div>
                <h1 class="max-w-[10ch] sm:max-w-[11ch] md:max-w-none text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] font-extrabold leading-[1.1] tracking-tight mb-6 text-black/90 dark:text-white/90">
                    Your SilentFlare identity
                </h1>
                <p class="text-black/50 dark:text-white/50 text-base sm:text-lg md:text-[1.1rem] leading-relaxed max-w-[28ch] md:max-w-[420px]">
                    Manage sign-in, registration, avatar, and public profile details directly from the accounts subsite.
                </p>
            </div>
        </section>

        <!-- Right Form Card -->
        <section class="card-base relative w-full lg:w-[460px] p-6 md:p-8 shrink-0 onload-animation" style="animation-delay: 150ms" aria-live="polite">
            {#if loading}
                <div class="flex flex-col gap-4">
                    <div class="h-14 w-full rounded-xl bg-black/5 dark:bg-white/5 animate-pulse"></div>
                    <div class="h-14 w-full rounded-xl bg-black/5 dark:bg-white/5 animate-pulse"></div>
                    <div class="h-14 w-full rounded-xl bg-black/5 dark:bg-white/5 animate-pulse"></div>
                </div>
            {:else}
                <div class="flex p-1 bg-[var(--btn-plain-bg)] rounded-xl mb-7" role="tablist">
                    <button
                        class="flex-1 transition auth-tab {mode === 'login' ? 'auth-tab-active bg-[var(--card-bg)] text-[var(--primary)] shadow-sm' : 'hover:bg-black/5 dark:hover:bg-white/5 text-black/75 dark:text-white/75'}"
                        onclick={() => mode = "login"}
                    >
                        Login
                    </button>
                    <button
                        class="flex-1 transition auth-tab {mode === 'register' ? 'auth-tab-active bg-[var(--card-bg)] text-[var(--primary)] shadow-sm' : 'hover:bg-black/5 dark:hover:bg-white/5 text-black/75 dark:text-white/75'}"
                        onclick={() => mode = "register"}
                    >
                        Register
                    </button>
                </div>

                {#if mode === "login"}
                    <form class="flex flex-col gap-5" onsubmit={(e) => { e.preventDefault(); submitLogin(); }}>
                        <label class="flex flex-col gap-2 font-bold text-[0.9rem] text-black/75 dark:text-white/75">
                            <span>Email</span>
                            <input class="auth-input" bind:value={loginEmail} type="email" autocomplete="email" required />
                        </label>
                        <label class="flex flex-col gap-2 font-bold text-[0.9rem] text-black/75 dark:text-white/75">
                            <span>Password</span>
                            <input class="auth-input" bind:value={loginPassword} type="password" autocomplete="current-password" required />
                        </label>
                        <div class="pt-2">
                            <TurnstileWidget action="login" resetKey={loginResetKey} onTokenChange={t => loginTurnstileToken = t} />
                        </div>
                        <button class="btn-regular scale-animation py-3.5 rounded-xl font-bold text-[1rem] mt-2 disabled:opacity-70 disabled:cursor-wait w-full flex justify-center items-center" type="submit" disabled={submitting}>
                            <Icon icon="material-symbols:login-rounded" class="text-[1.25rem] mr-2" />
                            <span>{submitting ? "Signing in..." : "Login"}</span>
                        </button>
                    </form>
                {:else}
                    <form class="flex flex-col gap-5" onsubmit={(e) => { e.preventDefault(); submitRegister(); }}>
                        <label class="flex flex-col gap-2 font-bold text-[0.9rem] text-black/75 dark:text-white/75">
                            <span>Email</span>
                            <input class="auth-input" bind:value={registerEmail} type="email" autocomplete="email" required />
                        </label>
                        <label class="flex flex-col gap-2 font-bold text-[0.9rem] text-black/75 dark:text-white/75">
                            <span>Username</span>
                            <input class="auth-input" bind:value={registerUsername} autocomplete="username" minlength="3" maxlength="24" required />
                        </label>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <label class="flex flex-col gap-2 font-bold text-[0.9rem] text-black/75 dark:text-white/75">
                                <span>Password</span>
                                <input class="auth-input" bind:value={registerPassword} type="password" autocomplete="new-password" minlength="8" required />
                            </label>
                            <label class="flex flex-col gap-2 font-bold text-[0.9rem] text-black/75 dark:text-white/75">
                                <span>Confirm password</span>
                                <input class="auth-input" bind:value={confirmPassword} type="password" autocomplete="new-password" minlength="8" required />
                            </label>
                        </div>
                        <div class="pt-2">
                            <TurnstileWidget action="register" resetKey={registerResetKey} onTokenChange={t => registerTurnstileToken = t} />
                        </div>
                        <button class="btn-regular scale-animation py-3.5 rounded-xl font-bold text-[1rem] mt-2 disabled:opacity-70 disabled:cursor-wait w-full flex justify-center items-center" type="submit" disabled={submitting}>
                            <Icon icon="material-symbols:person-add-rounded" class="text-[1.25rem] mr-2" />
                            <span>{submitting ? "Creating..." : "Create account"}</span>
                        </button>
                    </form>
                {/if}
            {/if}

            {#if error}
                <div class="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-bold text-[0.95rem] flex items-start gap-3">
                    <Icon icon="material-symbols:error-outline-rounded" class="text-[1.3rem] shrink-0 mt-0.5" />
                    <p class="leading-snug">{error}</p>
                </div>
            {/if}
            {#if notice}
                <div class="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[0.95rem] flex items-start gap-3">
                    <Icon icon="material-symbols:check-circle-outline-rounded" class="text-[1.3rem] shrink-0 mt-0.5" />
                    <p class="leading-snug">{notice}</p>
                </div>
            {/if}
        </section>
    </div>
</div>
