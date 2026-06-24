<script lang="ts">
import Icon from "@iconify/svelte";

let { user } = $props();
</script>

<div class="flex flex-col gap-8">
	<div>
		<h2 class="mb-2 text-2xl font-extrabold text-black/90 dark:text-white/90">Security & Access</h2>
		<p class="text-[0.95rem] text-black/50 dark:text-white/50">
			Review the boundaries around account authentication and what the current API exposes.
		</p>
	</div>

	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
		<section class="rounded-xl border border-[var(--line-divider)] px-5 py-5">
			<h3 class="mb-4 text-lg font-bold text-black/90 dark:text-white/90">Email Address</h3>
			<p class="mb-6 text-[0.95rem] text-black/75 dark:text-white/75">
				Your current email address is linked to your SilentFlare identity. Email change is not currently supported.
			</p>
			<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
				<div class="auth-input flex max-w-sm cursor-not-allowed items-center bg-black/5 font-medium opacity-70 dark:bg-white/5">
					<Icon icon="material-symbols:mail-outline-rounded" class="mr-3 text-lg text-black/50 dark:text-white/50" />
					{user.email}
				</div>
				<span class="w-max rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Verified</span>
			</div>
		</section>

		<section class="rounded-xl border border-[var(--line-divider)] px-5 py-5">
			<h3 class="mb-4 text-lg font-bold text-black/90 dark:text-white/90">Password Management</h3>
			<p class="mb-6 text-[0.95rem] text-black/75 dark:text-white/75">
				Login and registration require Cloudflare verification. Password rotation is not exposed in the current API yet.
			</p>
			<div class="rounded-xl border border-[var(--line-divider)] bg-black/5 p-4 text-[0.95rem] text-black/70 dark:bg-white/5 dark:text-white/70">
				Password change UI will stay unavailable until the backend exposes a real authenticated password update endpoint.
			</div>
		</section>
	</div>
</div>
