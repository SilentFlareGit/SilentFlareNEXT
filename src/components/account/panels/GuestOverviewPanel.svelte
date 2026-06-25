<script lang="ts">
import Icon from "@iconify/svelte";

const features = [
	{ text: "Secure login via Cloudflare verification" },
	{ text: "Persistent session, no repeated sign-ins" },
	{ text: "Comments tied to your public profile" },
];
</script>

<section class="card-base border-l-[3px] border-l-[var(--primary)] p-5">
	<div class="mb-5 flex items-center gap-3">
		<div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--btn-regular-bg)] text-[var(--primary)]">
			<Icon icon="material-symbols:shield-lock-outline-rounded" class="text-[2rem]" />
		</div>
		<div>
			<div class="text-sm font-bold text-black/90 dark:text-white/90">SilentFlare Accounts</div>
			<div class="text-sm text-black/50 dark:text-white/50">Your public identity, one place</div>
		</div>
	</div>

	<div class="flex flex-col gap-2.5">
		{#each features as feature}
			<div class="flex items-start gap-2.5 text-sm text-black/60 dark:text-white/60">
				<Icon
					icon="material-symbols:check-circle-outline-rounded"
					class="mt-0.5 shrink-0 text-[1rem] text-emerald-500"
				/>
				<span class="leading-snug">{feature.text}</span>
			</div>
		{/each}
	</div>
</section>
