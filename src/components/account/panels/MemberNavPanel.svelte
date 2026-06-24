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
	<div class="mt-4 flex flex-col gap-2 px-4">
		{#each tabs as tab}
			<button
				type="button"
				onclick={() => (currentTab = tab.id)}
				class="btn-plain scale-animation flex h-11 w-full items-center justify-start gap-3 rounded-lg px-4 font-bold active:scale-95 {currentTab === tab.id ? 'bg-[var(--btn-plain-bg-active)] text-[var(--primary)]' : ''}"
			>
				<Icon icon={tab.icon} class="text-[1.25rem]" />
				<span>{tab.label}</span>
			</button>
		{/each}
	</div>

	<div class="mx-4 mt-4 rounded-xl border border-[var(--line-divider)] px-4 py-4 text-sm leading-6 text-black/55 dark:text-white/55">
		<div class="mb-2 font-bold text-black/80 dark:text-white/80">Security status</div>
		Login and registration remain gated by Cloudflare verification before the session layer can issue account cookies.
	</div>
</section>
