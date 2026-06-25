<script lang="ts">
import Icon from "@iconify/svelte";

let { currentTab = $bindable("profile") } = $props();

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

<section class="card-base pb-4">
	<div class="font-bold transition text-lg text-neutral-900 dark:text-neutral-100 relative ml-8 mt-4 mb-2 before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)] before:absolute before:left-[-16px] before:top-[5.5px]">
		Account Settings
	</div>
	<div class="mt-4 flex flex-col gap-1 px-3">
		{#each tabs as tab}
			<button
				type="button"
				onclick={() => (currentTab = tab.id)}
				class="btn-plain flex h-11 w-full items-center justify-start gap-3 rounded-lg px-4 font-bold transition-all {currentTab === tab.id
					? 'bg-[var(--btn-plain-bg-active)] text-[var(--primary)] border-l-2 border-l-[var(--primary)] pl-[calc(1rem-2px)]'
					: 'border-l-2 border-l-transparent'}"
			>
				<Icon icon={tab.icon} class="text-[1.25rem]" />
				<span>{tab.label}</span>
			</button>
		{/each}
	</div>

	<div class="mx-4 mt-4 flex items-center gap-2.5 rounded-lg bg-emerald-500/8 px-3 py-2.5">
		<Icon icon="material-symbols:shield-check-outline-rounded" class="shrink-0 text-[1.1rem] text-emerald-500" />
		<span class="text-xs leading-snug text-emerald-600/80 dark:text-emerald-400/80">
			Cloudflare-gated login active
		</span>
	</div>
</section>
