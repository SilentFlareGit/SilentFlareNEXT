<script lang="ts">
import Icon from "@iconify/svelte";
</script>

<section class="card-base p-5">
	<div class="mb-4 flex items-center gap-3">
		<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--btn-regular-bg)] text-[var(--primary)]">
			<Icon icon="material-symbols:shield-lock-outline-rounded" class="text-[1.65rem]" />
		</div>
		<div>
			<div class="text-sm font-bold text-black/90 dark:text-white/90">Accounts Center</div>
			<div class="text-sm text-black/50 dark:text-white/50">SilentFlare identity layer</div>
		</div>
	</div>

	<div class="space-y-3 text-sm text-black/60 dark:text-white/60">
		<p class="max-w-[28ch] leading-7 sm:max-w-none">
			Use the same account surface for comment login, profile edits, and session-based access across the public site.
		</p>
		<div class="flex flex-wrap gap-2">
			<span class="rounded-full bg-[var(--btn-plain-bg)] px-3 py-1 font-bold text-black/70 dark:text-white/70">Login</span>
			<span class="rounded-full bg-[var(--btn-plain-bg)] px-3 py-1 font-bold text-black/70 dark:text-white/70">Register</span>
			<span class="rounded-full bg-[var(--btn-plain-bg)] px-3 py-1 font-bold text-black/70 dark:text-white/70">Profile</span>
		</div>
	</div>
</section>
