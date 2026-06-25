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

let avatarPreview = $state(avatarUrl as string);
let avatarLoadError = $state(false);

$effect(() => {
	const url = avatarUrl as string;
	avatarLoadError = false;
	const timer = setTimeout(() => {
		avatarPreview = url;
	}, 600);
	return () => clearTimeout(timer);
});

let bioPercent = $derived(Math.min(((bio as string).length / 500) * 100, 100));
let bioNearLimit = $derived((bio as string).length >= 450);
</script>

<div class="flex flex-col gap-8">
	<div>
		<h2 class="mb-2 text-2xl font-extrabold text-black/90 dark:text-white/90">Public Profile</h2>
		<p class="text-[0.95rem] text-black/50 dark:text-white/50">
			Manage the public identity that follows your comments and user-facing presence.
		</p>
	</div>

	<div class="flex items-center gap-6 border-b border-[var(--line-divider)] pb-8">
		<!-- Live avatar preview with ring -->
		<div class="relative shrink-0">
			<div
				class="h-20 w-20 overflow-hidden rounded-full bg-[var(--btn-regular-bg)] bg-cover bg-center text-[2.5rem]"
				style="box-shadow: 0 0 0 2px var(--card-bg), 0 0 0 4px var(--primary)"
			>
				{#if !avatarPreview || avatarLoadError}
					<div class="flex h-full w-full items-center justify-center">
						<Icon icon="material-symbols:person-rounded" class="text-[var(--primary)]" />
					</div>
				{:else}
					<img
						src={avatarPreview}
						alt="Avatar preview"
						class="h-full w-full object-cover"
						onerror={() => (avatarLoadError = true)}
					/>
				{/if}
			</div>
			{#if avatarUrl && !avatarLoadError}
				<div class="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
					<Icon icon="material-symbols:check-rounded" class="text-[0.7rem]" />
				</div>
			{:else if avatarUrl && avatarLoadError}
				<div class="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white">
					<Icon icon="material-symbols:close-rounded" class="text-[0.7rem]" />
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
				{#if avatarUrl && avatarLoadError}
					<p class="text-[0.75rem] font-normal text-red-500/80">Image failed to load — check the URL.</p>
				{/if}
			</label>
		</div>

		<label class="flex flex-col gap-2 font-bold text-[0.9rem] text-black/75 dark:text-white/75">
			<div class="flex items-center justify-between">
				<span>Bio</span>
				<span class="text-[0.75rem] font-semibold {bioNearLimit ? 'text-amber-500' : 'text-black/40 dark:text-white/40'}">
					{(bio as string).length}/500
				</span>
			</div>
			<textarea class="auth-input min-h-[120px] resize-y py-3" bind:value={bio} maxlength="500" rows="4"></textarea>
			<!-- Bio progress bar -->
			<div class="h-0.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
				<div
					class="h-full rounded-full transition-all duration-300 {bioNearLimit ? 'bg-amber-500' : 'bg-[var(--primary)]'}"
					style="width: {bioPercent}%"
				></div>
			</div>
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
			<button
				class="btn-regular flex w-max items-center justify-center gap-2 rounded-xl px-8 py-3 text-[1rem] font-bold disabled:cursor-wait disabled:opacity-70"
				type="submit"
				disabled={saving}
			>
				{#if saving}
					<span class="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
				{:else}
					<Icon icon="material-symbols:save-rounded" class="text-[1.2rem]" />
				{/if}
				<span>{saving ? "Saving..." : "Save profile"}</span>
			</button>
		</div>
	</form>
</div>
