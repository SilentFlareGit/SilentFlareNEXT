<script lang="ts">
import Icon from "@iconify/svelte";

let {
	user,
	displayName = $bindable(""),
	avatarUrl = $bindable(""),
	bio = $bindable(""),
	saving,
	saveProfile,
	error,
	notice,
} = $props();

let avatarStyle = $derived(
	avatarUrl
		? `background-image: url("${avatarUrl.replaceAll('"', "%22")}")`
		: "",
);
</script>

<div class="flex flex-col gap-8">
	<div>
		<h2 class="mb-2 text-2xl font-extrabold text-black/90 dark:text-white/90">Public Profile</h2>
		<p class="text-[0.95rem] text-black/50 dark:text-white/50">
			Manage the public identity that follows your comments and user-facing presence.
		</p>
	</div>

	<div class="flex items-center gap-6 border-b border-[var(--line-divider)] pb-8">
		<div class="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-[var(--line-divider)] bg-[var(--btn-regular-bg)] bg-cover bg-center text-[2.5rem]" style={avatarStyle}>
			{#if !avatarUrl}
				<div class="flex h-full w-full items-center justify-center">
					<Icon icon="material-symbols:person-rounded" class="text-[var(--primary)]" />
				</div>
			{/if}
		</div>
		<div class="min-w-0">
			<p class="mb-1 truncate text-lg font-bold text-black/90 dark:text-white/90">{displayName || user.username}</p>
			<p class="truncate text-sm font-medium text-black/50 dark:text-white/50">@{user.username}</p>
		</div>
	</div>

	<form class="flex flex-col gap-6" onsubmit={(event) => {
		event.preventDefault();
		void saveProfile();
	}}>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<label class="flex flex-col gap-2 font-bold text-[0.9rem] text-black/75 dark:text-white/75">
				<span>Display name</span>
				<input class="auth-input" bind:value={displayName} maxlength="80" autocomplete="name" />
			</label>
			<label class="flex flex-col gap-2 font-bold text-[0.9rem] text-black/75 dark:text-white/75">
				<span>Avatar URL</span>
				<input class="auth-input" bind:value={avatarUrl} maxlength="500" autocomplete="photo" placeholder="https://..." />
			</label>
		</div>

		<label class="flex flex-col gap-2 font-bold text-[0.9rem] text-black/75 dark:text-white/75">
			<div class="flex items-center justify-between">
				<span>Bio</span>
				<span class="text-[0.75rem] font-semibold text-black/40 dark:text-white/40">{bio.length}/500</span>
			</div>
			<textarea class="auth-input min-h-[120px] resize-y py-3" bind:value={bio} maxlength="500" rows="4"></textarea>
		</label>

		{#if error}
			<div class="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-[0.95rem] font-bold text-red-600 dark:text-red-400">
				<Icon icon="material-symbols:error-outline-rounded" class="mt-0.5 shrink-0 text-[1.3rem]" />
				<p class="leading-snug">{error}</p>
			</div>
		{/if}
		{#if notice}
			<div class="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-[0.95rem] font-bold text-emerald-600 dark:text-emerald-400">
				<Icon icon="material-symbols:check-circle-outline-rounded" class="mt-0.5 shrink-0 text-[1.3rem]" />
				<p class="leading-snug">{notice}</p>
			</div>
		{/if}

		<div class="pt-2">
			<button class="btn-regular w-max rounded-xl px-8 py-3 text-[1rem] font-bold disabled:cursor-wait disabled:opacity-70" type="submit" disabled={saving}>
				<Icon icon="material-symbols:save-rounded" class="mr-2 text-[1.2rem]" />
				<span>{saving ? "Saving..." : "Save profile"}</span>
			</button>
		</div>
	</form>
</div>
