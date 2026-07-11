<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";
import IdentityShell from "../shells/IdentityShell.svelte";
import AdminOwnerAuth from "./AdminOwnerAuth.svelte";
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
let notice = $state("");
let adminMode = $state(false);

const accountCenterFeatures = [
	{
		label: "Read and join the conversation",
		icon: "material-symbols:article-outline-rounded",
	},
	{
		label: "Shape your public identity",
		icon: "material-symbols:person-outline-rounded",
	},
	{
		label: "Protect access across every subsite",
		icon: "material-symbols:shield-lock-outline-rounded",
	},
] as const;

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
	adminMode = params.get("audience") === "admin";
	await resolveReturnUrl(params.get("return_url") ?? "");
	if (adminMode) {
		step = "method";
		return;
	}
	const verifyToken = params.get("verify_token") ?? "";
	if (params.get("registration") === "complete")
		notice = "Account created. Sign in with your new credentials.";
	try {
		const session = await apiFetch<{
			authenticated: boolean;
		}>("/auth/session");
		if (session.authenticated) {
			step = "redirecting";
			window.location.replace(returnUrl);
			return;
		}
	} catch {
		// The login screen remains usable and will surface API errors on submit.
	}
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
	step = "method";
}

onMount(() => void bootstrap());
</script>

{#snippet story()}
	{#if !adminMode}
		<div class="feature-rail" aria-label="Account center areas">
			{#each accountCenterFeatures as feature}
				<span><Icon icon={feature.icon} />{feature.label}</span>
			{/each}
		</div>
	{/if}
{/snippet}

<IdentityShell
	product={adminMode ? "Admin" : ""}
	headline={adminMode ? "A private door to public trust." : "One identity across SilentFlare."}
	description={adminMode ? "Verify Owner access before reviewing members and moderated conversations." : "Sign in once for the blog, comments, your profile, privacy, and security settings."}
	backHref="https://blog.silentflare.com/"
	backLabel="Return to the blog"
	{story}
>
				{#if adminMode}
					<AdminOwnerAuth {apiBase} {returnUrl} />
				{:else if step === "checking" || step === "redirecting"}
					<div class="auth-loading"><span></span><p>{step === "checking" ? "Checking your session…" : "Returning you safely…"}</p></div>
				{:else if step === "method"}
					<MethodSelectPanel
						onSelectEmailCode={() => { step = "email"; error = ""; }}
						onSelectPassword={() => { step = "password"; error = ""; }}
						onRegister={() => window.location.assign("https://accounts.silentflare.com/?register=1")}
						{notice}
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
</IdentityShell>

<style>
	.auth-stage { min-height: 100svh; padding: 1rem; color: var(--primary); background: #edf3f8; }
	.auth-main { width: min(100%, 62rem); margin: 0 auto; padding: 1rem 0; }
	.auth-shell { display: grid; overflow: hidden; border: 1px solid rgba(70,100,130,.14); border-radius: .5rem; background: var(--card-bg); box-shadow: 0 1rem 3rem rgba(28,53,79,.09); }
	.auth-story { order: 2; min-height: 11rem; display: flex; flex-direction: column; justify-content: space-between; gap: 1.5rem; padding: 1.5rem; border-top: 1px solid #dce6ee; color: #182230; background: #f4f8fb; }
	.story-wordmark { min-height: 2.75rem; display: inline-flex; align-items: center; gap: .65rem; width: max-content; color: #182230; }
	.story-wordmark span { width: 2rem; height: 2rem; display: grid; place-items: center; border-radius: .5rem; background: #4b9fe8; color: white; font-weight: 800; }
	.story-copy h1 { max-width: 15ch; margin: 0; font-size: 2rem; line-height: 1.08; letter-spacing: 0; }
	.story-copy p { max-width: 30rem; margin: 1rem 0 0; color: #68798a; line-height: 1.65; }
	.feature-rail { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .45rem; }
	.feature-rail span { min-height: 2.5rem; display: inline-flex; align-items: center; gap: .45rem; border: 1px solid #dce6ee; border-radius: .5rem; padding: 0 .65rem; background: rgba(255,255,255,.62); color: #526575; font-size: .78rem; font-weight: 800; }
	.feature-rail :global(svg) { flex: none; color: #438fd0; font-size: 1rem; }
	.story-link { min-height: 2.75rem; display: inline-flex; align-items: center; width: max-content; color: #176db8; font-weight: 700; text-decoration: underline; }
	.auth-form { order: 1; min-width: 0; min-height: 30rem; display: flex; align-items: center; padding: 1.5rem; }
	.auth-loading { width: 100%; display: grid; justify-items: center; gap: 1rem; color: var(--muted-text); }
	.auth-loading span { width: 2rem; height: 2rem; border: 2px solid var(--line-divider); border-top-color: var(--primary); border-radius: 50%; animation: spin .8s linear infinite; }
	.auth-legal { margin: 1rem 0 0; text-align: center; color: var(--muted-text); font-size: .8rem; }
	.auth-legal a { text-decoration: underline; }
	:global(.dark) .auth-stage { background: #111923; }
	:global(.dark) .auth-story { border-color: #2a3948; color: #edf3f8; background: #19232f; }
	:global(.dark) .story-wordmark { color: #edf3f8; }
	:global(.dark) .story-copy p { color: #aab7c3; }
	:global(.dark) .feature-rail span { border-color: #2a3948; background: rgba(17,25,35,.7); color: #c8d3df; }
	.auth-story.admin-story { background: #e8f3fc; }
	@media (min-width: 768px) { .auth-stage { padding: 1.5rem; } .auth-main { padding: 2rem 0; } .auth-form { padding: 2.5rem; } }
	@media (min-width: 1024px) { .auth-main { padding: 3rem 0 2rem; } .auth-shell { grid-template-columns: minmax(17rem, 2fr) minmax(0, 3fr); align-items: stretch; } .auth-story { order: 1; min-height: 28rem; padding: 2.5rem; border-top: 0; border-right: 1px solid #dce6ee; box-shadow: inset .25rem 0 #4b9fe8; } .story-copy h1 { font-size: 2.4rem; } .auth-form { order: 2; padding: 3rem; } }
	@keyframes spin { to { transform: rotate(360deg); } }
	@media (prefers-reduced-motion: reduce) { .auth-loading span { animation: none; } }
	.feature-rail { grid-template-columns: 1fr; gap: 0; max-width: 25rem; }
	.feature-rail span { min-height: 3rem; border: 0; border-bottom: 1px solid var(--sf-border); border-radius: 0; padding: 0.35rem 0; background: transparent; color: var(--sf-text-muted); font-size: 0.85rem; }
	.feature-rail span:first-child { border-top: 1px solid var(--sf-border); }
	.feature-rail :global(svg) { color: var(--sf-accent); }
</style>
