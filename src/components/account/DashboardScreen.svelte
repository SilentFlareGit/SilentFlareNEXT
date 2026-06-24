<script lang="ts">
import Icon from "@iconify/svelte";
import ProfileTab from "./tabs/ProfileTab.svelte";
import SecurityTab from "./tabs/SecurityTab.svelte";

let {
	user,
	logout,

	displayName = $bindable(),
	avatarUrl = $bindable(),
	bio = $bindable(),
	saving,
	saveProfile,
	error,
	notice,
} = $props();

let currentTab = $state("profile");

const tabs = [
	{
		id: "profile",
		label: "Public Profile",
		icon: "material-symbols:person-outline-rounded",
	},
	{
		id: "security",
		label: "Security & Access",
		icon: "material-symbols:shield-lock-outline-rounded",
	},
];
</script>

<div class="z-50 pointer-events-none relative transition-all duration-700 max-w-[var(--page-width)] px-0 md:px-4 mx-auto pt-4 md:pt-0">
    <div class="pointer-events-auto sticky top-0 transition-all">
        <div class="card-base !overflow-visible max-w-[var(--page-width)] h-[4.5rem] md:!rounded-t-none mx-auto flex items-center justify-between px-4">
            <a href="/" class="btn-plain scale-animation rounded-lg h-[3.25rem] px-5 font-bold active:scale-95">
                <div class="flex flex-row text-[var(--primary)] items-center text-md">
                    <Icon icon="material-symbols:home-outline-rounded" class="text-[1.75rem] mb-1 mr-2" />
                    SilentFlare
                </div>
            </a>
            <div class="flex items-center gap-2">
                <div class="hidden md:block text-sm font-bold mr-2 text-black/75 dark:text-white/75">{displayName || user.username}</div>
                <button class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90" onclick={logout} title="Logout">
                    <Icon icon="material-symbols:logout-rounded" class="text-[1.25rem]" />
                </button>
            </div>
        </div>
    </div>
</div>

<div class="relative max-w-[var(--page-width)] mx-auto pointer-events-auto mt-4">
    <div id="main-grid" class="transition duration-700 mx-auto grid w-full grid-cols-1 gap-4 px-0 pb-8 md:px-4 lg:grid-cols-[17.5rem_minmax(0,1fr)]">
        <div class="onload-animation lg:max-w-[17.5rem]">
            <div class="flex flex-col w-full gap-4 mb-4">
                <div class="card-base p-6">
                    <div class="flex flex-col items-center justify-center">
                        <div class="w-24 h-24 rounded-[var(--radius-large)] bg-[var(--btn-regular-bg)] flex items-center justify-center text-[3rem] overflow-hidden bg-cover bg-center mb-4 border border-[var(--line-divider)]" style={avatarUrl ? `background-image: url("${avatarUrl.replaceAll('"', "%22")}")` : ""}>
                            {#if !avatarUrl}
                                <Icon icon="material-symbols:person-rounded" class="text-[var(--primary)]" />
                            {/if}
                        </div>
                        <div class="font-bold text-xl text-center mb-1 text-black/90 dark:text-white/90">{displayName || user.username}</div>
                        <div class="text-sm text-center text-black/50 dark:text-white/50">@{user.username}</div>
                    </div>
                </div>
            </div>
            
            <div class="transition-all duration-700 flex w-full flex-col gap-4 lg:sticky lg:top-4">
                <div class="pb-4 card-base">
                    <div class="font-bold transition text-lg text-neutral-900 dark:text-neutral-100 relative ml-8 mt-4 mb-2 before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)] before:absolute before:left-[-16px] before:top-[5.5px]">
                        Account Settings
                    </div>
                    <div class="px-4 mt-4 flex flex-col gap-2">
                        {#each tabs as tab}
                            <button 
                                onclick={() => currentTab = tab.id}
                                class="btn-plain scale-animation rounded-lg h-11 px-4 font-bold active:scale-95 flex items-center justify-start gap-3 w-full {currentTab === tab.id ? 'bg-[var(--btn-plain-bg-active)] text-[var(--primary)]' : ''}"
                            >
                                <Icon icon={tab.icon} class="text-[1.25rem]" />
                                <span>{tab.label}</span>
                            </button>
                        {/each}
                    </div>
                </div>
            </div>
        </div>

        <main id="swup-container" class="transition-swup-fade min-w-0 overflow-hidden">
            <div id="content-wrapper" class="onload-animation">
                <div class="card-base px-6 py-6 md:px-10 md:py-8 min-h-[500px]">
                    {#if currentTab === "profile"}
                        <ProfileTab 
                            {user}
                            bind:displayName
                            bind:avatarUrl
                            bind:bio
                            {saving}
                            {saveProfile}
                            {error}
                            {notice}
                        />
                    {:else if currentTab === "security"}
                        <SecurityTab {user} />
                    {/if}
                </div>
            </div>
        </main>
    </div>
</div>
