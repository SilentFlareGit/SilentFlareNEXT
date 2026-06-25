<script lang="ts">
import Icon from "@iconify/svelte";

type AccountUser = {
	id: string;
	email: string;
	username: string;
	display_name?: string | null;
	avatar_url?: string | null;
	bio?: string | null;
	role?: string | null;
};

let {
	user,
	displayName = "",
	avatarUrl = "",
	logout,
} = $props<{
	user: AccountUser;
	displayName?: string;
	avatarUrl?: string;
	logout: () => Promise<void>;
}>();

let loggingOut = $state(false);

async function handleLogout() {
	loggingOut = true;
	await logout();
	loggingOut = false;
}

let roleLabel = $derived(user.role === "admin" ? "Admin" : "Member");
</script>

<section class="card-base p-5">
	<div class="flex flex-col items-center justify-center">
		<!-- Avatar with primary-color ring -->
		<div
			class="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[var(--btn-regular-bg)] bg-cover bg-center text-[3rem]"
			style="
				background-image: {avatarUrl ? `url('${avatarUrl.replaceAll("'", "%27")}')` : 'none'};
				box-shadow: 0 0 0 2px var(--card-bg), 0 0 0 4px var(--primary);
			"
		>
			{#if !avatarUrl}
				<Icon icon="material-symbols:person-rounded" class="text-[var(--primary)]" />
			{/if}
		</div>

		<!-- Display name -->
		<div class="mb-1 text-center text-xl font-bold text-black/90 dark:text-white/90">
			{displayName || user.username}
		</div>

		<!-- Username -->
		<div class="mb-2 text-center text-sm text-black/50 dark:text-white/50">
			@{user.username}
		</div>

		<!-- Role badge -->
		<span class="mb-3 rounded-full bg-[var(--primary)]/10 px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-[var(--primary)]">
			{roleLabel}
		</span>

		<!-- Email -->
		<div class="mb-5 text-center text-sm text-black/40 dark:text-white/40">{user.email}</div>

		<!-- Ghost logout button -->
		<button
			class="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-[var(--line-divider)] text-sm font-medium text-black/50 transition-colors hover:border-red-400/40 hover:text-red-500/80 dark:text-white/50 dark:hover:border-red-400/30 dark:hover:text-red-400/80 disabled:cursor-wait disabled:opacity-60"
			type="button"
			onclick={handleLogout}
			disabled={loggingOut}
		>
			{#if loggingOut}
				<span class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
			{:else}
				<Icon icon="material-symbols:logout-rounded" class="text-[1.1rem]" />
			{/if}
			<span>{loggingOut ? "Signing out..." : "Logout"}</span>
		</button>
	</div>
</section>
