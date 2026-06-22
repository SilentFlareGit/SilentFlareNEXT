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

<main class="account-shell">
	<section class="account-hero" aria-labelledby="account-title">
		<a class="brand-link" href="/">
			<Icon icon="material-symbols:arrow-back-rounded" />
			<span>SilentFlare</span>
		</a>
		<div>
			<p class="eyebrow">Accounts center</p>
			<h1 id="account-title">Your SilentFlare identity</h1>
			<p class="hero-copy">
				Manage sign-in, registration, avatar, and public profile details from the
				accounts subsite.
			</p>
		</div>
	</section>

	<section class="account-panel" aria-live="polite">
		{#if loading}
			<div class="loading-stack">
				<div></div>
				<div></div>
				<div></div>
			</div>
		{:else if user}
			<div class="panel-head">
				<div class="identity">
					<div class="avatar" style={avatarStyle}>
						{#if !avatarUrl}
							<Icon icon="material-symbols:person-rounded" />
						{/if}
					</div>
					<div>
						<p class="username">{displayName || user.username}</p>
						<p class="muted">{user.email}</p>
					</div>
				</div>
				<button class="ghost-button" type="button" onclick={logout}>
					<Icon icon="material-symbols:logout-rounded" />
					<span>Logout</span>
				</button>
			</div>

			<form class="form-grid" onsubmit={(event) => { event.preventDefault(); void saveProfile(); }}>
				<label>
					<span>Display name</span>
					<input bind:value={displayName} maxlength="80" autocomplete="name" />
				</label>
				<label>
					<span>Avatar URL</span>
					<input bind:value={avatarUrl} maxlength="500" autocomplete="photo" placeholder="https://..." />
				</label>
				<label class="wide">
					<span>Bio</span>
					<textarea bind:value={bio} maxlength="500" rows="5"></textarea>
					<small>{bio.length}/500</small>
				</label>
				<button class="primary-button wide" type="submit" disabled={saving}>
					<Icon icon="material-symbols:save-rounded" />
					<span>{saving ? "Saving..." : "Save profile"}</span>
				</button>
			</form>
		{:else}
			<div class="mode-switch" role="tablist" aria-label="Account action">
				<button
					class:active={mode === "login"}
					type="button"
					role="tab"
					aria-selected={mode === "login"}
					onclick={() => { mode = "login"; error = ""; }}
				>
					Login
				</button>
				<button
					class:active={mode === "register"}
					type="button"
					role="tab"
					aria-selected={mode === "register"}
					onclick={() => { mode = "register"; error = ""; }}
				>
					Register
				</button>
			</div>

			{#if mode === "login"}
				<form class="auth-form" onsubmit={(event) => { event.preventDefault(); void submitLogin(); }}>
					<label>
						<span>Email</span>
						<input bind:value={loginEmail} type="email" autocomplete="email" required />
					</label>
					<label>
						<span>Password</span>
						<input bind:value={loginPassword} type="password" autocomplete="current-password" required />
					</label>
					<TurnstileWidget
						action="login"
						resetKey={loginResetKey}
						onTokenChange={(token) => { loginTurnstileToken = token; }}
					/>
					<button class="primary-button" type="submit" disabled={submitting}>
						<Icon icon="material-symbols:login-rounded" />
						<span>{submitting ? "Signing in..." : "Login"}</span>
					</button>
				</form>
			{:else}
				<form class="auth-form" onsubmit={(event) => { event.preventDefault(); void submitRegister(); }}>
					<label>
						<span>Email</span>
						<input bind:value={registerEmail} type="email" autocomplete="email" required />
					</label>
					<label>
						<span>Username</span>
						<input bind:value={registerUsername} autocomplete="username" minlength="3" maxlength="24" required />
					</label>
					<label>
						<span>Password</span>
						<input bind:value={registerPassword} type="password" autocomplete="new-password" minlength="8" required />
					</label>
					<label>
						<span>Confirm password</span>
						<input bind:value={confirmPassword} type="password" autocomplete="new-password" minlength="8" required />
					</label>
					<TurnstileWidget
						action="register"
						resetKey={registerResetKey}
						onTokenChange={(token) => { registerTurnstileToken = token; }}
					/>
					<button class="primary-button" type="submit" disabled={submitting}>
						<Icon icon="material-symbols:person-add-rounded" />
						<span>{submitting ? "Creating..." : "Create account"}</span>
					</button>
				</form>
			{/if}
		{/if}

		{#if error}
			<p class="message error">{error}</p>
		{/if}
		{#if notice}
			<p class="message success">{notice}</p>
		{/if}
	</section>
</main>

<style>
:global(body) {
	font-family: Roboto, system-ui, sans-serif;
	color: #e5eefc;
}

.account-shell {
	display: grid;
	min-height: 100vh;
	grid-template-columns: minmax(0, 0.92fr) minmax(22rem, 0.62fr);
	gap: clamp(1.5rem, 4vw, 4rem);
	align-items: center;
	width: min(1120px, calc(100% - 2rem));
	margin: 0 auto;
	padding: clamp(1rem, 4vw, 3rem) 0;
}

.account-hero {
	display: flex;
	min-height: 34rem;
	flex-direction: column;
	justify-content: space-between;
	border-left: 1px solid rgba(148, 163, 184, 0.28);
	padding-left: clamp(1.25rem, 3vw, 2.5rem);
}

.brand-link,
.ghost-button,
.primary-button,
.mode-switch button {
	display: inline-flex;
	min-height: 44px;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	border: 0;
	border-radius: 8px;
	font-weight: 700;
	text-decoration: none;
	cursor: pointer;
}

.brand-link {
	width: fit-content;
	color: #b7c6db;
}

.brand-link:hover {
	color: #ffffff;
}

.eyebrow {
	margin: 0 0 0.75rem;
	color: #8fb8ff;
	font-size: 0.78rem;
	font-weight: 800;
	letter-spacing: 0;
	text-transform: uppercase;
}

h1 {
	max-width: 12ch;
	margin: 0;
	font-size: clamp(2.8rem, 8vw, 5.8rem);
	line-height: 0.95;
	letter-spacing: 0;
}

.hero-copy {
	max-width: 34rem;
	margin: 1.25rem 0 0;
	color: #a9b8cf;
	font-size: 1.05rem;
	line-height: 1.7;
}

.account-panel {
	border: 1px solid rgba(148, 163, 184, 0.22);
	border-radius: 8px;
	background: rgba(15, 23, 42, 0.82);
	box-shadow: 0 24px 80px rgba(0, 0, 0, 0.26);
	padding: clamp(1rem, 4vw, 1.5rem);
}

.mode-switch {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 0.5rem;
	margin-bottom: 1rem;
	padding: 0.25rem;
	border-radius: 8px;
	background: rgba(148, 163, 184, 0.1);
}

.mode-switch button {
	color: #a9b8cf;
	background: transparent;
}

.mode-switch button.active {
	color: #0b111c;
	background: #e5eefc;
}

.auth-form,
.form-grid {
	display: grid;
	gap: 1rem;
}

.form-grid {
	grid-template-columns: repeat(2, minmax(0, 1fr));
}

.wide {
	grid-column: 1 / -1;
}

label {
	display: grid;
	gap: 0.45rem;
	color: #c9d6e8;
	font-size: 0.9rem;
	font-weight: 700;
}

input,
textarea {
	width: 100%;
	box-sizing: border-box;
	border: 1px solid rgba(148, 163, 184, 0.26);
	border-radius: 8px;
	background: rgba(2, 6, 23, 0.48);
	color: #ffffff;
	font: inherit;
	padding: 0.8rem 0.9rem;
	outline: none;
}

input:focus,
textarea:focus {
	border-color: #8fb8ff;
	box-shadow: 0 0 0 3px rgba(143, 184, 255, 0.18);
}

textarea {
	resize: vertical;
}

small,
.muted {
	color: #8c9bb0;
}

.primary-button {
	width: 100%;
	color: #06111f;
	background: #8fb8ff;
}

.primary-button:disabled,
.ghost-button:disabled {
	cursor: wait;
	opacity: 0.7;
}

.ghost-button {
	color: #d7e3f5;
	background: rgba(148, 163, 184, 0.12);
	padding: 0 0.9rem;
}

.panel-head {
	display: flex;
	gap: 1rem;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 1.25rem;
}

.identity {
	display: flex;
	min-width: 0;
	gap: 0.85rem;
	align-items: center;
}

.avatar {
	display: grid;
	width: 3.5rem;
	height: 3.5rem;
	flex: 0 0 auto;
	place-items: center;
	border-radius: 50%;
	background: #26344a center / cover;
	color: #d7e3f5;
	font-size: 1.75rem;
}

.username {
	margin: 0 0 0.2rem;
	overflow: hidden;
	color: #ffffff;
	font-size: 1.05rem;
	font-weight: 800;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.message {
	margin: 1rem 0 0;
	border-radius: 8px;
	padding: 0.8rem 0.9rem;
	font-weight: 700;
}

.message.error {
	color: #fecaca;
	background: rgba(127, 29, 29, 0.38);
}

.message.success {
	color: #bbf7d0;
	background: rgba(20, 83, 45, 0.36);
}

.loading-stack {
	display: grid;
	gap: 1rem;
}

.loading-stack div {
	height: 4rem;
	border-radius: 8px;
	background: rgba(148, 163, 184, 0.12);
	animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
	50% {
		opacity: 0.45;
	}
}

@media (max-width: 820px) {
	.account-shell {
		grid-template-columns: 1fr;
		align-items: stretch;
	}

	.account-hero {
		min-height: auto;
		gap: 3rem;
	}

	h1 {
		max-width: 11ch;
	}
}

@media (max-width: 560px) {
	.account-shell {
		width: min(100% - 1rem, 1120px);
	}

	.account-panel {
		padding: 0.9rem;
	}

	.form-grid {
		grid-template-columns: 1fr;
	}

	.panel-head {
		align-items: flex-start;
		flex-direction: column;
	}

	.ghost-button {
		width: 100%;
	}
}
</style>
