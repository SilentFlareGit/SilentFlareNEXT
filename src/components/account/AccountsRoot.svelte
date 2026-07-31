<script lang="ts">
import AccountApp from "./AccountApp.svelte";
import PublicProfileApp from "./PublicProfileApp.svelte";

let { apiBase = "/accounts-api" } = $props<{ apiBase?: string }>();

function routeUsername() {
	if (typeof window === "undefined") return "";
	const match = window.location.pathname.match(
		/^(?:\/accounts)?\/u\/([^/]+)\/?$/i,
	);
	if (!match) return "";
	try {
		return decodeURIComponent(match[1]);
	} catch {
		return "";
	}
}

const username = routeUsername();
</script>

{#if username}
	<PublicProfileApp {apiBase} {username} />
{:else}
	<AccountApp {apiBase} />
{/if}
