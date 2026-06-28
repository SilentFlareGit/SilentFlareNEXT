<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";

let { hydrated = false } = $props<{ hydrated?: boolean }>();
let label = $state("Sign in");
let href = $state("https://auth.silentflare.com/");

onMount(async () => {
	href = `https://auth.silentflare.com/?return_url=${encodeURIComponent(window.location.href)}`;
	try {
		const response = await fetch("https://api.silentflare.com/auth/session", {
			credentials: "include",
		});
		const data = (await response.json()) as {
			authenticated?: boolean;
			user?: { displayName?: string; username?: string };
		};
		if (data.authenticated && data.user) {
			label = data.user.displayName || data.user.username || "Account";
			href = "https://accounts.silentflare.com/";
		}
	} catch {
		// Keep the safe auth entry when status cannot be loaded.
	}
});
</script>

<div class="relative z-50" data-hydrated={hydrated}>
	<a class="btn-plain scale-animation min-h-11 rounded-lg px-3 font-bold active:scale-95" {href}>
		<Icon icon="material-symbols:account-circle-outline-rounded" class="md:mr-2 text-[1.25rem]" />
		<span class="hidden max-w-28 truncate md:inline">{label}</span>
	</a>
</div>
