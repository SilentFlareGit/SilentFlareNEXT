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
	:global(.feature-rail) { display: grid; grid-template-columns: 1fr; gap: 0; width: min(100%, 27rem); }
	:global(.feature-rail span) { min-height: 3.25rem; display: flex; align-items: center; gap: 0.75rem; border-bottom: 1px solid var(--sf-border); padding: 0.45rem 0; color: var(--sf-text-muted); font-size: 0.9rem; font-weight: 700; line-height: 1.35; }
	:global(.feature-rail span:first-child) { border-top: 1px solid var(--sf-border); }
	:global(.feature-rail svg) { width: 1.25rem; height: 1.25rem; flex: 0 0 1.25rem; color: var(--sf-accent); }
	.auth-loading { width: 100%; display: grid; justify-items: center; gap: 1rem; color: var(--sf-text-muted); }
	.auth-loading span { width: 2rem; height: 2rem; border: 2px solid var(--sf-border); border-top-color: var(--sf-accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
	@keyframes spin { to { transform: rotate(360deg); } }
	@media (prefers-reduced-motion: reduce) { .auth-loading span { animation: none; } }
</style>
