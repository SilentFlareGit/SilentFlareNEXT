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
</script>

<section class="card-base p-5">
	<div class="flex flex-col items-center justify-center">
		<div
			class="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-[var(--radius-large)] border border-[var(--line-divider)] bg-[var(--btn-regular-bg)] bg-cover bg-center text-[3rem]"
			style={avatarUrl ? `background-image: url("${avatarUrl.replaceAll('"', "%22")}")` : ""}
		>
			{#if !avatarUrl}
				<Icon icon="material-symbols:person-rounded" class="text-[var(--primary)]" />
			{/if}
		</div>
		<div class="mb-1 text-center text-xl font-bold text-black/90 dark:text-white/90">{displayName || user.username}</div>
		<div class="mb-1 text-center text-sm text-black/50 dark:text-white/50">@{user.username}</div>
		<div class="mb-4 text-center text-sm text-black/50 dark:text-white/50">{user.email}</div>
		<button class="btn-regular scale-animation flex h-11 w-full items-center justify-center gap-2 rounded-lg font-bold active:scale-95" type="button" onclick={logout}>
			<Icon icon="material-symbols:logout-rounded" class="text-[1.2rem]" />
			<span>Logout</span>
		</button>
	</div>
</section>
