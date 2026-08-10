<script lang="ts">
import Icon from "@iconify/svelte";
import { onDestroy, onMount } from "svelte";

type AuthOptions = {
	methods?: { telegram?: boolean; totp?: boolean };
	web_login_enabled?: boolean;
};

let {
	apiBase,
	returnUrl,
	surface = "Admin",
}: { apiBase: string; returnUrl: string; surface?: "Admin" | "CMS" } = $props();

const adminId = "SilentFlare Admin";
let options = $state<AuthOptions | null>(null);
let mode = $state<"telegram" | "totp">("telegram");
let code = $state("");
let challengeId = $state("");
let expiresAt = $state(0);
let message = $state("Checking available owner verification methods...");
let tone = $state<"neutral" | "warning" | "error">("neutral");
let busy = $state(false);
let pollTimer: number | undefined;
let countdownTimer: number | undefined;

const telegramAvailable = $derived(Boolean(options?.methods?.telegram));
const totpAvailable = $derived(Boolean(options?.methods?.totp));

async function api<T>(path: string, init: RequestInit = {}) {
	const response = await fetch(`${apiBase}${path}`, {
		...init,
		credentials: "include",
		headers: { "content-type": "application/json", ...(init.headers ?? {}) },
	});
	const data = (await response.json().catch(() => ({}))) as { detail?: string };
	if (!response.ok) throw new Error(data.detail || "Verification failed");
	return data as T;
}

function stopPolling() {
	if (pollTimer) window.clearInterval(pollTimer);
	if (countdownTimer) window.clearInterval(countdownTimer);
	pollTimer = countdownTimer = undefined;
	challengeId = "";
	busy = false;
}

function redirectToAdmin() {
	stopPolling();
	window.location.replace(returnUrl);
}

function updateCountdown() {
	const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
	if (!remaining) {
		message = "Approval expired. Send a new request to continue.";
		tone = "warning";
		stopPolling();
		return;
	}
	message = `Approval sent. Waiting ${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}.`;
}

async function pollApproval() {
	if (!challengeId) return;
	try {
		const result = await api<{ status: string }>(
			`/auth/telegram/status/${challengeId}?bot_id=${encodeURIComponent(adminId)}`,
		);
		if (result.status === "approved") redirectToAdmin();
	} catch (reason) {
		message = reason instanceof Error ? reason.message : "Approval failed";
		tone = "error";
		stopPolling();
	}
}

async function startTelegram() {
	if (!telegramAvailable || busy) return;
	stopPolling();
	busy = true;
	tone = "neutral";
	try {
		const result = await api<{ challenge_id: string; expires_at: string }>(
			"/auth/telegram/start",
			{ method: "POST", body: JSON.stringify({ bot_id: adminId }) },
		);
		challengeId = result.challenge_id;
		expiresAt = new Date(result.expires_at).getTime();
		updateCountdown();
		countdownTimer = window.setInterval(updateCountdown, 1000);
		void pollApproval();
		pollTimer = window.setInterval(pollApproval, 1000);
	} catch (reason) {
		message =
			reason instanceof Error ? reason.message : "Telegram is unavailable";
		tone = "error";
		busy = false;
	}
}

async function verifyTotp() {
	if (!totpAvailable || busy || code.replace(/\D/g, "").length !== 6) return;
	busy = true;
	tone = "neutral";
	try {
		await api("/auth/login", {
			method: "POST",
			body: JSON.stringify({ bot_id: adminId, method: "totp", code }),
		});
		redirectToAdmin();
	} catch (reason) {
		message =
			reason instanceof Error ? reason.message : "Invalid authenticator code";
		tone = "error";
		busy = false;
	}
}

onMount(async () => {
	try {
		options = await api<AuthOptions>(
			`/auth/options?bot_id=${encodeURIComponent(adminId)}`,
		);
		if (options.web_login_enabled === false) return;
		try {
			const session = await api<{ bot?: { id?: string } }>("/auth/me");
			if (session.bot?.id === adminId) {
				redirectToAdmin();
				return;
			}
		} catch {
			// No owner session yet.
		}
		message = telegramAvailable
			? `One Telegram approval unlocks ${surface} for one hour.`
			: "Telegram approval is unavailable on this server.";
		tone = telegramAvailable ? "neutral" : "warning";
	} catch (reason) {
		message =
			reason instanceof Error ? reason.message : "Unable to load sign-in";
		tone = "error";
	}
});
onDestroy(stopPolling);
</script>

{#if options?.web_login_enabled === false}
	<div class="web-login-disabled">
		<section>
			<span aria-hidden="true"><Icon icon="material-symbols:lock-rounded" /></span>
			<h1>Web login is disabled</h1>
			<p>Please enable Web login from the Bot.</p>
		</section>
	</div>
{:else}
<div class="owner-auth">
	<div class="owner-heading">
		<span class="owner-mark"><Icon icon="material-symbols:shield-lock-outline-rounded" /></span>
		<div><p>OWNER ACCESS</p><h2>Verify your identity</h2></div>
	</div>
	<p class="intro">{surface} access uses a separate, bot-scoped session. Public account credentials cannot unlock this workspace.</p>

	<div class="method-tabs" aria-label="Owner verification method">
		<button class:active={mode === "telegram"} onclick={() => (mode = "telegram")}><Icon icon="material-symbols:send-outline-rounded" />Telegram</button>
		<button class:active={mode === "totp"} onclick={() => (mode = "totp")}><Icon icon="material-symbols:password-rounded" />Authenticator</button>
	</div>

	{#if mode === "telegram"}
		<div class="method-body">
			<h3>Approve in Telegram</h3>
			<p>Confirm the request from the fixed SilentFlare Owner account. After one hour, request a fresh approval here.</p>
			<button class="primary" disabled={!telegramAvailable || busy} onclick={startTelegram}>
				<Icon icon={busy ? "material-symbols:hourglass-top-rounded" : "material-symbols:verified-user-outline-rounded"} />
				{busy ? "Waiting for approval" : "Send approval request"}
			</button>
		</div>
	{:else if totpAvailable}
		<form class="method-body" onsubmit={(event) => { event.preventDefault(); void verifyTotp(); }}>
			<h3>Authenticator code</h3>
			<p>Enter the current six-digit code from your configured authenticator.</p>
			<label><span>Six-digit code</span><input inputmode="numeric" autocomplete="one-time-code" maxlength="6" bind:value={code} placeholder="000000" /></label>
			<button class="primary" disabled={busy || code.replace(/\D/g, "").length !== 6} type="submit"><Icon icon="material-symbols:lock-open-right-outline-rounded" />Verify and continue</button>
		</form>
	{:else}
		<div class="method-body unavailable">
			<Icon icon="material-symbols:do-not-disturb-on-outline-rounded" />
			<h3>Authenticator unavailable</h3>
			<p>2FA has not been configured for the Owner console. Use Telegram approval instead.</p>
		</div>
	{/if}

	<div class:error={tone === "error"} class:warning={tone === "warning"} class="notice" aria-live="polite">{message}</div>
</div>
{/if}

<style>
	.owner-auth{width:100%;color:var(--sf-text)}.owner-heading{display:flex;align-items:center;gap:1rem}.owner-mark{display:grid;width:3rem;height:3rem;flex:0 0 auto;place-items:center;border:1px solid var(--sf-border-strong);border-radius:.5rem;background:var(--sf-accent-soft);color:var(--sf-accent-strong);font-size:1.55rem}.owner-heading p{margin:0;color:var(--sf-accent-strong);font-size:.72rem;font-weight:800}.owner-heading h2{margin:.2rem 0 0;font-size:1.55rem;letter-spacing:0}.intro,.method-body>p{color:var(--sf-text-muted);line-height:1.65}.intro{margin:1.25rem 0 1.5rem}.method-tabs{display:grid;grid-template-columns:1fr 1fr;gap:.25rem;padding:.25rem;border:1px solid var(--sf-border);border-radius:.5rem;background:var(--sf-surface-muted)}.method-tabs button{min-height:2.75rem;display:flex;align-items:center;justify-content:center;gap:.4rem;border:0;border-radius:.35rem;background:transparent;color:var(--sf-text-muted);font-weight:700;cursor:pointer}.method-tabs button.active{background:var(--sf-surface);color:var(--sf-accent-strong);box-shadow:0 1px 5px rgba(33,61,86,.12)}.method-body{min-height:13rem;padding:1.5rem 0 0}.method-body h3{margin:0;font-size:1.1rem}.method-body>p{margin:.55rem 0 1.25rem}.method-body label span{display:block;margin-bottom:.45rem;color:var(--sf-text-muted);font-size:.82rem;font-weight:700}.method-body input{box-sizing:border-box;width:100%;min-height:3rem;border:1px solid var(--sf-border-strong);border-radius:.4rem;padding:0 .85rem;background:var(--sf-surface);color:var(--sf-text);font:inherit;font-size:1.1rem;letter-spacing:.18rem;outline:0}.method-body input:focus{border-color:var(--sf-accent);box-shadow:var(--sf-focus)}.primary{width:100%;min-height:3rem;display:flex;align-items:center;justify-content:center;gap:.55rem;margin-top:1rem;border:0;border-radius:.4rem;background:var(--sf-accent);color:white;font-weight:800;cursor:pointer}.primary:hover:not(:disabled){background:var(--sf-accent-strong)}.primary:disabled{cursor:not-allowed;opacity:.52}.unavailable{display:grid;align-content:center;justify-items:center;text-align:center}.unavailable>svg{font-size:2rem;color:var(--sf-text-soft)}.unavailable h3{margin:.7rem 0 0}.unavailable p{max-width:26rem}.notice{padding:.75rem .85rem;border:1px solid var(--sf-border);border-radius:.4rem;background:var(--sf-surface-subtle);color:var(--sf-text-muted);font-size:.85rem;line-height:1.5}.notice.warning{border-color:color-mix(in srgb,var(--sf-warning) 35%,var(--sf-border));background:var(--sf-warning-soft);color:var(--sf-warning)}.notice.error{border-color:color-mix(in srgb,var(--sf-danger) 35%,var(--sf-border));background:var(--sf-danger-soft);color:var(--sf-danger)}@media(min-width:768px){.method-body{min-height:14rem;padding-top:1.75rem}}@media(prefers-reduced-motion:no-preference){.owner-auth{animation:enter .35s ease-out}@keyframes enter{from{opacity:0;transform:translateY(.4rem)}to{opacity:1;transform:none}}}
	.web-login-disabled{position:fixed;z-index:100;inset:0;display:grid;place-items:center;padding:1.5rem;background:var(--sf-page)}.web-login-disabled section{box-sizing:border-box;width:min(100%,26rem);padding:2rem;border:1px solid var(--sf-border);border-radius:1.5rem;background:var(--sf-surface);box-shadow:var(--sf-shadow-surface);text-align:center}.web-login-disabled span{width:3.25rem;height:3.25rem;display:grid;place-items:center;margin:0 auto 1.25rem;border-radius:1rem;background:var(--sf-accent-soft);color:var(--sf-accent-strong);font-size:1.35rem}.web-login-disabled span :global(svg){width:1.5rem;height:1.5rem}.web-login-disabled h1{margin:0;color:var(--sf-text);font-size:1.45rem;letter-spacing:0}.web-login-disabled p{margin:.75rem 0 0;color:var(--sf-text-muted);line-height:1.5}
</style>
