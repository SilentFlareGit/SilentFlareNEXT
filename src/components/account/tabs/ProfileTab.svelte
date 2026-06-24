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
        <h2 class="text-2xl font-extrabold text-black/90 dark:text-white/90 mb-2">Public Profile</h2>
        <p class="text-black/50 dark:text-white/50 text-[0.95rem]">
            Manage your public identity, display name, and short biography.
        </p>
    </div>

    <div class="card-base card-shadow border border-[var(--line-divider)] p-6 md:p-8">
        <div class="flex items-center gap-6 mb-8 pb-8 border-b border-[var(--line-divider)]">
            <div class="w-20 h-20 rounded-full bg-[var(--btn-regular-bg)] flex items-center justify-center text-[2.5rem] shrink-0 overflow-hidden bg-cover bg-center border-4 border-white/10" style={avatarStyle}>
                {#if !avatarUrl}
                    <Icon icon="material-symbols:person-rounded" class="text-[var(--primary)]" />
                {/if}
            </div>
            <div class="min-w-0">
                <p class="font-bold text-lg text-black/90 dark:text-white/90 truncate mb-1">{displayName || user.username}</p>
                <p class="text-black/50 dark:text-white/50 text-sm truncate font-medium">@{user.username}</p>
            </div>
        </div>

        <form class="flex flex-col gap-6" onsubmit={(e) => { e.preventDefault(); saveProfile(); }}>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div class="flex justify-between items-center">
                    <span>Bio</span>
                    <span class="text-[0.75rem] font-semibold text-black/40 dark:text-white/40">{bio.length}/500</span>
                </div>
                <textarea class="auth-input min-h-[120px] resize-y py-3" bind:value={bio} maxlength="500" rows="4"></textarea>
            </label>

            {#if error}
                <div class="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-bold text-[0.95rem] flex items-start gap-3">
                    <Icon icon="material-symbols:error-outline-rounded" class="text-[1.3rem] shrink-0 mt-0.5" />
                    <p class="leading-snug">{error}</p>
                </div>
            {/if}
            {#if notice}
                <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[0.95rem] flex items-start gap-3">
                    <Icon icon="material-symbols:check-circle-outline-rounded" class="text-[1.3rem] shrink-0 mt-0.5" />
                    <p class="leading-snug">{notice}</p>
                </div>
            {/if}

            <div class="pt-2">
                <button class="btn-regular w-max px-8 py-3 rounded-xl font-bold text-[1rem] disabled:opacity-70 disabled:cursor-wait" type="submit" disabled={saving}>
                    <Icon icon="material-symbols:save-rounded" class="text-[1.2rem] mr-2" />
                    <span>{saving ? "Saving..." : "Save profile"}</span>
                </button>
            </div>
        </form>
    </div>
</div>
