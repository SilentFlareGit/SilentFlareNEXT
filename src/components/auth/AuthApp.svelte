<script lang="ts">
import { onMount } from "svelte";
import EmailCodePanel from "./panels/EmailCodePanel.svelte";
import MethodSelectPanel from "./panels/MethodSelectPanel.svelte";
import PasswordPanel from "./panels/PasswordPanel.svelte";
import TwoFAPanel from "./panels/TwoFAPanel.svelte";

type AuthUser = {
	id: string;
	email: string;
	username: string;
	displayName: string;
};

let { apiBase = "/auth-api" } = $props<{ apiBase?: string }>();
let step = $state<
	"checking" | "method" | "email" | "password" | "2fa" | "redirecting"
>("checking");
let returnUrl = $state("https://accounts.silentflare.com/");
let pendingId = $state("");
let error = $state("");

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
	const response = await fetch(`${apiBase}${path}`, {
		...init,
		credentials: "include",
		headers: { "content-type": "application/json", ...(init.headers ?? {}) },
	});
	const data = (await response.json().catch(() => ({}))) as { detail?: string };
	if (!response.ok) throw new Error(data.detail || "Request failed");
	return data as T;
}

async function resolveReturnUrl(raw: string) {
	try {
		const result = await apiFetch<{ return_url: string }>(
			`/auth/return-url?return_url=${encodeURIComponent(raw)}`,
		);
		returnUrl = result.return_url;
	} catch {
		returnUrl = "https://accounts.silentflare.com/";
	}
}

function finishLogin(user: AuthUser, destination?: string) {
	void user;
	step = "redirecting";
	window.location.replace(destination || returnUrl);
}

async function bootstrap() {
	const params = new URLSearchParams(window.location.search);
	await resolveReturnUrl(params.get("return_url") ?? "");
	const verifyToken = params.get("verify_token") ?? "";
	if (verifyToken) {
		try {
			const result = await apiFetch<{
				requires_2fa?: boolean;
				pending_id?: string;
				user?: AuthUser;
				return_url?: string;
			}>("/auth/login/email/verify-link", {
				method: "POST",
				body: JSON.stringify({ token: verifyToken }),
			});
			window.history.replaceState({}, "", window.location.pathname);
			if (result.requires_2fa && result.pending_id) {
				pendingId = result.pending_id;
				step = "2fa";
				return;
			}
			if (result.user) {
				finishLogin(result.user, result.return_url);
				return;
			}
			throw new Error("Verification link could not be completed");
		} catch (reason) {
			window.history.replaceState({}, "", window.location.pathname);
			error =
				reason instanceof Error
					? reason.message
					: "Verification link could not be completed";
			step = "method";
			return;
		}
	}
	try {
		const session = await apiFetch<{ authenticated: boolean }>("/auth/session");
		if (session.authenticated) {
			step = "redirecting";
			window.location.replace(returnUrl);
			return;
		}
	} catch {
		// The login screen remains usable and will surface API errors on submit.
	}
	step = "method";
}

onMount(() => void bootstrap());
</script>

<div class="auth-stage">
	<header class="auth-topbar">
		<a href="https://blog.silentflare.com/" class="auth-wordmark" aria-label="SilentFlare Blog">
			<span class="auth-mark">S</span>
			<span>SilentFlare</span>
		</a>
		<a class="auth-register-link" href="https://accounts.silentflare.com/">Create account</a>
	</header>

	<main class="auth-main">
		<section class="auth-shell" aria-live="polite">
			<div class="auth-story" aria-hidden="true">
				<p class="auth-kicker">One identity, every subsite</p>
				<h1>Return to the quiet side of the web.</h1>
				<p>Your SilentFlare session follows you across the blog, accounts, and connected services without sharing your password with any frontend.</p>
				<div class="auth-orbit"><span></span><span></span><span></span></div>
			</div>

			<div class="auth-form">
				{#if step === "checking" || step === "redirecting"}
					<div class="auth-loading"><span></span><p>{step === "checking" ? "Checking your session…" : "Returning you safely…"}</p></div>
				{:else if step === "method"}
					<MethodSelectPanel
						onSelectEmailCode={() => { step = "email"; error = ""; }}
						onSelectPassword={() => { step = "password"; error = ""; }}
						{error}
					/>
				{:else if step === "email"}
					<EmailCodePanel
						{apiBase}
						{returnUrl}
						onSuccess={finishLogin}
						on2FARequired={(id) => { pendingId = id; step = "2fa"; }}
						onBack={() => { step = "method"; error = ""; }}
					/>
				{:else if step === "password"}
					<PasswordPanel
						{apiBase}
						{returnUrl}
						onSuccess={finishLogin}
						on2FARequired={(id) => { pendingId = id; step = "2fa"; }}
						onError={(message) => (error = message)}
						onBack={() => { step = "method"; error = ""; }}
					/>
				{:else}
					<TwoFAPanel
						{apiBase}
						{pendingId}
						onSuccess={finishLogin}
						onError={(message) => (error = message)}
						onBack={() => { step = "method"; pendingId = ""; }}
					/>
				{/if}
			</div>
		</section>
		<p class="auth-legal">By continuing, you agree to the <a href="https://tos.silentflare.com/">SilentFlare Terms of Service</a>.</p>
	</main>
</div>

<style>
	.auth-stage { min-height: 100svh; color: var(--primary); background: radial-gradient(circle at 15% 20%, color-mix(in srgb, var(--primary) 14%, transparent), transparent 36rem), var(--page-bg); }
	.auth-topbar { min-height: 4rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .75rem clamp(1rem, 4vw, 3rem); border-bottom: 1px solid var(--line-divider); }
	.auth-wordmark { min-height: 2.75rem; display: inline-flex; align-items: center; gap: .7rem; color: var(--deep-text); font-weight: 800; }
	.auth-mark { width: 2rem; height: 2rem; display: grid; place-items: center; border-radius: .65rem; background: var(--primary); color: white; }
	.auth-register-link { min-height: 2.75rem; display: inline-flex; align-items: center; padding: 0 1rem; border-radius: .8rem; background: var(--btn-regular-bg); font-weight: 700; }
	.auth-main { width: min(100% - 2rem, 64rem); margin: 0 auto; padding: clamp(2rem, 7vw, 5rem) 0 2rem; }
	.auth-shell { display: grid; overflow: hidden; border: 1px solid var(--line-divider); border-radius: 1.5rem; background: var(--card-bg); box-shadow: 0 1.6rem 5rem rgba(20, 35, 55, .13); }
	.auth-story { min-height: 16rem; padding: clamp(2rem, 7vw, 4rem); color: white; background: linear-gradient(145deg, #397fbd, #10233f); position: relative; overflow: hidden; }
	.auth-kicker { margin: 0 0 1rem; font-size: .78rem; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; opacity: .72; }
	.auth-story h1 { max-width: 12ch; margin: 0; font-size: clamp(2.25rem, 8vw, 4.4rem); line-height: .98; letter-spacing: -.045em; }
	.auth-story > p:last-of-type { max-width: 38rem; margin: 1.5rem 0 0; line-height: 1.7; opacity: .78; }
	.auth-orbit { position: absolute; width: 15rem; height: 15rem; right: -5rem; bottom: -6rem; border: 1px solid rgba(255,255,255,.24); border-radius: 50%; }
	.auth-orbit span { position: absolute; width: .65rem; height: .65rem; border-radius: 50%; background: white; }
	.auth-orbit span:nth-child(1) { left: 1rem; top: 3rem; } .auth-orbit span:nth-child(2) { right: 2rem; top: 1rem; } .auth-orbit span:nth-child(3) { left: 5rem; bottom: 1rem; }
	.auth-form { min-height: 31rem; display: flex; align-items: center; padding: clamp(1.5rem, 6vw, 4rem); }
	.auth-loading { width: 100%; display: grid; justify-items: center; gap: 1rem; color: var(--muted-text); }
	.auth-loading span { width: 2rem; height: 2rem; border: 2px solid var(--line-divider); border-top-color: var(--primary); border-radius: 50%; animation: spin .8s linear infinite; }
	.auth-legal { margin: 1rem 0 0; text-align: center; color: var(--muted-text); font-size: .8rem; }
	.auth-legal a { text-decoration: underline; }
	@media (min-width: 1024px) { .auth-shell { grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); } .auth-story { min-height: 38rem; display: flex; flex-direction: column; justify-content: center; } }
	@keyframes spin { to { transform: rotate(360deg); } }
	@media (prefers-reduced-motion: reduce) { .auth-loading span { animation: none; } }
</style>
