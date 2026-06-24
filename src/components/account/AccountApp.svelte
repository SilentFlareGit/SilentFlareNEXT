<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";
import TurnstileWidget from "../security/TurnstileWidget.svelte";

type AccountUser = {
	id: string;
	email: string;
	username: string;
	role: string;
	displayName: string;
	avatarUrl: string;
	bio: string;
};

let { apiBase = "/accounts-api" } = $props<{ apiBase?: string }>();

let user = $state<AccountUser | null>(null);
let mode = $state<"login" | "register">("login");
let loading = $state(true);
let submitting = $state(false);
let saving = $state(false);
let error = $state("");
let notice = $state("");
let nextPath = $state("");

let loginEmail = $state("");
let loginPassword = $state("");
let loginTurnstileToken = $state("");
let loginResetKey = $state(0);

let registerEmail = $state("");
let registerUsername = $state("");
let registerPassword = $state("");
let confirmPassword = $state("");
let registerTurnstileToken = $state("");
let registerResetKey = $state(0);

let displayName = $state("");
let avatarUrl = $state("");
let bio = $state("");
let avatarStyle = $derived(
	avatarUrl
		? `background-image: url("${avatarUrl.replaceAll('"', "%22")}")`
		: "",
);

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
	const response = await fetch(`${apiBase}${path}`, {
		...init,
		credentials: "include",
		headers: {
			"content-type": "application/json",
			...(init.headers ?? {}),
		},
	});
	const data = (await response.json().catch(() => ({}))) as {
		detail?: string;
		error?: string;
	};
	if (!response.ok) {
		throw new Error(data.detail || data.error || "Request failed");
	}
	return data as T;
}

function applyUser(nextUser: AccountUser | null) {
	user = nextUser;
	displayName = nextUser?.displayName ?? "";
	avatarUrl = nextUser?.avatarUrl ?? "";
	bio = nextUser?.bio ?? "";
}

function resetTurnstile() {
	loginTurnstileToken = "";
	registerTurnstileToken = "";
	loginResetKey += 1;
	registerResetKey += 1;
}

function safeRedirect() {
	if (!nextPath) return;
	if (!nextPath.startsWith("/") || nextPath.startsWith("//")) return;
	window.location.assign(nextPath);
}

async function loadUser() {
	loading = true;
	error = "";
	try {
		const result = await apiFetch<{
			user: AccountUser | null;
			configured?: boolean;
		}>("/account/auth/me");
		applyUser(result.user);
		if (result.configured === false) {
			error = "Account API is not configured yet.";
		}
	} catch (err) {
		applyUser(null);
		error = err instanceof Error ? err.message : "Could not load account";
	} finally {
		loading = false;
	}
}

async function submitLogin() {
	if (!loginTurnstileToken) {
		error = "Complete human verification first.";
		return;
	}
	submitting = true;
	error = "";
	notice = "";
	try {
		const result = await apiFetch<{ user: AccountUser }>(
			"/account/auth/login",
			{
				method: "POST",
				body: JSON.stringify({
					email: loginEmail,
					password: loginPassword,
					turnstileToken: loginTurnstileToken,
				}),
			},
		);
		applyUser(result.user);
		notice = "Signed in.";
		safeRedirect();
	} catch (err) {
		error = err instanceof Error ? err.message : "Login failed";
		resetTurnstile();
	} finally {
		submitting = false;
	}
}

async function submitRegister() {
	if (registerPassword !== confirmPassword) {
		error = "Passwords do not match.";
		return;
	}
	if (!registerTurnstileToken) {
		error = "Complete human verification first.";
		return;
	}
	submitting = true;
	error = "";
	notice = "";
	try {
		const result = await apiFetch<{ user: AccountUser }>(
			"/account/auth/register",
			{
				method: "POST",
				body: JSON.stringify({
					email: registerEmail,
					username: registerUsername,
					password: registerPassword,
					turnstileToken: registerTurnstileToken,
				}),
			},
		);
		applyUser(result.user);
		notice = "Account created.";
		safeRedirect();
	} catch (err) {
		error = err instanceof Error ? err.message : "Registration failed";
		resetTurnstile();
	} finally {
		submitting = false;
	}
}

async function saveProfile() {
	saving = true;
	error = "";
	notice = "";
	try {
		const result = await apiFetch<{ user: AccountUser }>("/account/profile", {
			method: "POST",
			body: JSON.stringify({
				display_name: displayName,
				avatar_url: avatarUrl,
				bio,
			}),
		});
		applyUser(result.user);
		notice = "Profile saved.";
	} catch (err) {
		error = err instanceof Error ? err.message : "Could not save profile";
	} finally {
		saving = false;
	}
}

async function logout() {
	await apiFetch<{ ok: true }>("/account/auth/logout", {
		method: "POST",
		body: JSON.stringify({}),
	}).catch(() => null);
	applyUser(null);
	notice = "Signed out.";
	resetTurnstile();
}

onMount(() => {
	const params = new URLSearchParams(window.location.search);
	nextPath = params.get("next") ?? "";
	void loadUser();
});
</script>

<main class="min-h-screen w-full flex justify-center py-10 md:py-20 px-4 md:px-8">
	<div class="w-full max-w-[1100px] flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-24 items-center">
		<!-- Left / Hero side -->
		<section class="flex-1 flex flex-col justify-center min-h-[auto] md:min-h-[440px] w-full" aria-labelledby="account-title">
			<a class="btn-plain scale-animation w-max mb-10 -ml-2 p-2 rounded-xl flex items-center gap-2 font-bold text-lg text-black/75 dark:text-white/75" href="/">
				<Icon icon="material-symbols:arrow-back-rounded" class="text-[1.35rem]" />
				<span>SilentFlare</span>
			</a>
			<div>
				<p class="text-[var(--primary)] font-bold text-sm uppercase tracking-wider mb-4">Accounts center</p>
				<h1 id="account-title" class="max-w-[10ch] sm:max-w-[11ch] md:max-w-none text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] font-extrabold leading-[1.1] tracking-tight mb-6 text-black/90 dark:text-white/90">
					Your SilentFlare identity
				</h1>
				<p class="text-black/50 dark:text-white/50 text-lg md:text-[1.1rem] leading-relaxed max-w-[420px]">
					Manage sign-in, registration, avatar, and public profile details from the accounts subsite.
				</p>
			</div>
		</section>

		<!-- Right / Panel side -->
		<section class="card-base card-shadow relative w-full max-w-[440px] p-6 md:p-8 lg:p-9 border border-[var(--line-divider)]" aria-live="polite">
			{#if loading}
				<div class="flex flex-col gap-4">
					<div class="h-14 w-full rounded-xl bg-black/5 dark:bg-white/5 animate-pulse"></div>
					<div class="h-14 w-full rounded-xl bg-black/5 dark:bg-white/5 animate-pulse"></div>
					<div class="h-14 w-full rounded-xl bg-black/5 dark:bg-white/5 animate-pulse"></div>
				</div>
			{:else if user}
				<div class="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8 pb-6 border-b border-[var(--line-divider)]">
					<div class="flex items-center gap-4 min-w-0">
						<div class="w-14 h-14 rounded-full bg-[var(--btn-regular-bg)] flex items-center justify-center text-[1.75rem] shrink-0 overflow-hidden bg-cover bg-center" style={avatarStyle}>
							{#if !avatarUrl}
								<Icon icon="material-symbols:person-rounded" class="text-[var(--primary)]" />
							{/if}
						</div>
						<div class="min-w-0">
							<p class="font-bold text-[1.05rem] text-black/90 dark:text-white/90 truncate mb-0.5">{displayName || user.username}</p>
							<p class="text-black/50 dark:text-white/50 text-sm truncate">{user.email}</p>
						</div>
					</div>
					<button class="btn-plain scale-animation p-2 px-3 rounded-lg flex items-center justify-center gap-2 font-bold shrink-0 text-[0.95rem] bg-black/5 dark:bg-white/5 w-full md:w-auto mt-2 md:mt-0" type="button" onclick={logout}>
						<Icon icon="material-symbols:logout-rounded" class="text-lg" />
						<span>Logout</span>
					</button>
				</div>

				<form class="flex flex-col gap-5" onsubmit={(event) => { event.preventDefault(); void saveProfile(); }}>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
						<label class="flex flex-col gap-2 font-bold text-[0.9rem] text-black/75 dark:text-white/75">
							<span>Display name</span>
							<input class="auth-input" bind:value={displayName} maxlength="80" autocomplete="name" />
						</label>
						<label class="flex flex-col gap-2 font-bold text-[0.9rem] text-black/75 dark:text-white/75">
							<span>Avatar URL</span>
							<input class="auth-input" bind:value={avatarUrl} maxlength="500" autocomplete="photo" placeholder="https://..." />
						</label>
					</div>
					<label class="flex flex-col gap-2 font-bold text-[0.9rem] text-black/75 dark:text-white/75">
						<div class="flex justify-between items-center">
							<span>Bio</span>
							<span class="text-[0.75rem] font-semibold text-black/40 dark:text-white/40">{bio.length}/500</span>
						</div>
						<textarea class="auth-input min-h-[110px] resize-y py-3" bind:value={bio} maxlength="500" rows="4"></textarea>
					</label>
					<button class="btn-regular py-3 rounded-xl font-bold text-[1rem] mt-3 disabled:opacity-70 disabled:cursor-wait" type="submit" disabled={saving}>
						<Icon icon="material-symbols:save-rounded" class="text-[1.2rem] mr-2" />
						<span>{saving ? "Saving..." : "Save profile"}</span>
					</button>
				</form>
			{:else}
				<div class="flex p-1 bg-black/5 dark:bg-white/5 rounded-xl mb-7" role="tablist" aria-label="Account action">
					<button
						class="flex-1 transition auth-tab {mode === 'login' ? 'auth-tab-active' : 'hover:text-black/75 dark:hover:text-white/75'}"
						type="button"
						role="tab"
						aria-selected={mode === "login"}
						onclick={() => { mode = "login"; error = ""; }}
					>
						Login
					</button>
					<button
						class="flex-1 transition auth-tab {mode === 'register' ? 'auth-tab-active' : 'hover:text-black/75 dark:hover:text-white/75'}"
						type="button"
						role="tab"
						aria-selected={mode === "register"}
						onclick={() => { mode = "register"; error = ""; }}
					>
						Register
					</button>
				</div>

				{#if mode === "login"}
					<form class="flex flex-col gap-5" onsubmit={(event) => { event.preventDefault(); void submitLogin(); }}>
						<label class="flex flex-col gap-2 font-bold text-[0.9rem] text-black/75 dark:text-white/75">
							<span>Email</span>
							<input class="auth-input" bind:value={loginEmail} type="email" autocomplete="email" required />
						</label>
						<label class="flex flex-col gap-2 font-bold text-[0.9rem] text-black/75 dark:text-white/75">
							<span>Password</span>
							<input class="auth-input" bind:value={loginPassword} type="password" autocomplete="current-password" required />
						</label>
						<div class="pt-2">
							<TurnstileWidget
								action="login"
								resetKey={loginResetKey}
								onTokenChange={(token) => { loginTurnstileToken = token; }}
							/>
						</div>
						<button class="btn-regular py-3.5 rounded-xl font-bold text-[1rem] mt-2 disabled:opacity-70 disabled:cursor-wait" type="submit" disabled={submitting}>
							<Icon icon="material-symbols:login-rounded" class="text-[1.25rem] mr-2" />
							<span>{submitting ? "Signing in..." : "Login"}</span>
						</button>
					</form>
				{:else}
					<form class="flex flex-col gap-5" onsubmit={(event) => { event.preventDefault(); void submitRegister(); }}>
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
							<TurnstileWidget
								action="register"
								resetKey={registerResetKey}
								onTokenChange={(token) => { registerTurnstileToken = token; }}
							/>
						</div>
						<button class="btn-regular py-3.5 rounded-xl font-bold text-[1rem] mt-2 disabled:opacity-70 disabled:cursor-wait" type="submit" disabled={submitting}>
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
</main>
