<script lang="ts">
import Icon from "@iconify/svelte";
import {
	type CurrentUser,
	getCurrentUser,
	logout,
	notifyAuthChanged,
} from "@lib/client/auth";
import { onMount } from "svelte";
import AuthModal from "./AuthModal.svelte";

let { hydrated = false } = $props<{ hydrated?: boolean }>();
let user = $state<CurrentUser | null>(null);
let loading = $state(true);
let menuOpen = $state(false);
let authOpen = $state(false);

async function refreshUser() {
	loading = true;
	try {
		const result = await getCurrentUser();
		user = result.user;
	} catch {
		user = null;
	} finally {
		loading = false;
	}
}

async function signOut() {
	await logout().catch(() => null);
	user = null;
	menuOpen = false;
	notifyAuthChanged();
}

onMount(() => {
	void refreshUser();
	const refresh = () => void refreshUser();
	const openAuth = () => {
		authOpen = true;
		menuOpen = false;
	};
	document.addEventListener("silentflare-auth-change", refresh);
	document.addEventListener("silentflare-auth-open", openAuth);
	return () => {
		document.removeEventListener("silentflare-auth-change", refresh);
		document.removeEventListener("silentflare-auth-open", openAuth);
	};
});
</script>

<div class="relative z-50">
	{#if loading}
		<div class="hidden h-11 w-24 animate-pulse rounded-lg bg-[var(--btn-regular-bg)] md:block"></div>
	{:else if user}
		<button class="btn-plain scale-animation min-h-11 rounded-lg px-3 font-bold active:scale-95" onclick={() => { menuOpen = !menuOpen; }}>
			<Icon icon="material-symbols:account-circle-outline-rounded" class="mr-2 text-[1.25rem]" />
			<span class="hidden max-w-28 truncate md:inline">{user.username}</span>
		</button>
		{#if menuOpen}
			<div class="card-base float-panel absolute right-0 top-12 w-52 p-2 shadow-xl">
				<div class="border-b border-[var(--line-divider)] px-3 py-2">
					<p class="truncate text-sm font-bold text-90">{user.username}</p>
					<p class="truncate text-xs text-50">{user.email}</p>
				</div>
				<button class="btn-plain mt-2 min-h-11 w-full rounded-lg px-3 !justify-start font-medium active:scale-95" onclick={() => void signOut()}>
					<Icon icon="material-symbols:logout-rounded" class="mr-2 text-[1.25rem]" />
					Logout
				</button>
			</div>
		{/if}
	{:else}
		<button class="btn-plain scale-animation min-h-11 rounded-lg px-3 font-bold active:scale-95" onclick={() => { authOpen = true; }}>
			<Icon icon="material-symbols:login-rounded" class="md:mr-2 text-[1.25rem]" />
			<span class="hidden md:inline">Login / Register</span>
		</button>
	{/if}

	<AuthModal open={authOpen} onClose={() => { authOpen = false; }} />
</div>
