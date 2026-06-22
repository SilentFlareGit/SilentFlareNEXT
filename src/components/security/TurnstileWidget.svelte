<script lang="ts">
import { onMount } from "svelte";

let {
	action,
	onTokenChange,
	resetKey = 0,
}: {
	action: "register" | "login" | "comment";
	onTokenChange: (token: string) => void;
	resetKey?: number;
} = $props();

const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;
let container: HTMLDivElement;
let widgetId: string | null = null;
let loaded = $state(false);
let error = $state("");
let lastResetKey = resetKey;

function loadTurnstileScript() {
	return new Promise<void>((resolve, reject) => {
		if (window.turnstile) {
			resolve();
			return;
		}

		const existing = document.querySelector<HTMLScriptElement>(
			'script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]',
		);
		if (existing) {
			existing.addEventListener("load", () => resolve(), { once: true });
			existing.addEventListener("error", () => reject(), { once: true });
			return;
		}

		const script = document.createElement("script");
		script.src =
			"https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
		script.async = true;
		script.defer = true;
		script.addEventListener("load", () => resolve(), { once: true });
		script.addEventListener("error", () => reject(), { once: true });
		document.head.appendChild(script);
	});
}

async function renderWidget() {
	if (!siteKey) {
		error = "Human verification is not configured.";
		return;
	}

	try {
		await loadTurnstileScript();
		if (!window.turnstile || !container || widgetId) return;
		widgetId = window.turnstile.render(container, {
			sitekey: siteKey,
			action,
			callback: (token: string) => {
				error = "";
				onTokenChange(token);
			},
			"expired-callback": () => onTokenChange(""),
			"error-callback": () => {
				onTokenChange("");
				error = "Verification failed. Please try again.";
			},
		});
		loaded = true;
	} catch {
		error = "Verification could not load.";
	}
}

function resetWidget() {
	onTokenChange("");
	if (widgetId && window.turnstile) {
		window.turnstile.reset(widgetId);
	}
}

$effect(() => {
	if (resetKey !== lastResetKey) {
		lastResetKey = resetKey;
		resetWidget();
	}
});

onMount(() => {
	void renderWidget();
	return () => {
		if (widgetId && window.turnstile) {
			window.turnstile.remove(widgetId);
		}
	};
});
</script>

<div class="turnstile-shell">
	<div bind:this={container} class="min-h-[4.25rem]"></div>
	{#if !loaded && !error}
		<p class="text-sm text-50">Loading verification...</p>
	{/if}
	{#if error}
		<p class="text-sm text-red-500 dark:text-red-300">{error}</p>
	{/if}
</div>
