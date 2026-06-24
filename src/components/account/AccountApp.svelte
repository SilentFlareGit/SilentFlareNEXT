<script lang="ts">
import { onMount } from "svelte";
import AuthScreen from "./AuthScreen.svelte";
import DashboardScreen from "./DashboardScreen.svelte";

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
		error = "Complete Cloudflare verification first.";
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
		error = "Complete Cloudflare verification first.";
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

{#if user && !loading}
    <DashboardScreen
        {user}
        {logout}
        bind:displayName
        bind:avatarUrl
        bind:bio
        {saving}
        {saveProfile}
        {error}
        {notice}
    />
{:else}
    <AuthScreen 
        bind:mode
        {loading}
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
{/if}
