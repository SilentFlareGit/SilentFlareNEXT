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
		<!-- Email address card -->
		<section class="rounded-xl border border-[var(--line-divider)] px-5 py-5">
			<div class="mb-1 flex items-center gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--btn-regular-bg)] text-[var(--primary)]">
					<Icon icon="material-symbols:mail-outline-rounded" class="text-[1.25rem]" />
				</div>
				<h3 class="text-lg font-bold text-black/90 dark:text-white/90">Email Address</h3>
			</div>
			<p class="mb-5 mt-3 text-[0.95rem] text-black/60 dark:text-white/60">
				Your email is linked to your SilentFlare identity. Email change is not currently supported.
			</p>
			<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
				<div class="auth-input flex max-w-sm cursor-not-allowed items-center bg-black/5 font-medium opacity-70 dark:bg-white/5">
					<Icon icon="material-symbols:mail-outline-rounded" class="mr-3 text-lg text-black/50 dark:text-white/50" />
					{user.email}
				</div>
				<span class="w-max rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
					Verified
				</span>
			</div>
		</section>

		<!-- Password management card — coming soon -->
		<section class="rounded-xl border border-[var(--line-divider)] px-5 py-5">
			<div class="mb-1 flex items-center gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--btn-regular-bg)] text-black/30 dark:text-white/30">
					<Icon icon="material-symbols:lock-clock-outline-rounded" class="text-[1.25rem]" />
				</div>
				<h3 class="text-lg font-bold text-black/90 dark:text-white/90">Password Management</h3>
			</div>
			<p class="mb-5 mt-3 text-[0.95rem] text-black/60 dark:text-white/60">
				Login and registration require Cloudflare verification. Password rotation is not exposed in the current API.
			</p>
			<div class="flex items-start gap-3 rounded-xl border border-dashed border-[var(--line-divider)] bg-black/3 p-4 dark:bg-white/3">
				<Icon icon="material-symbols:schedule-outline-rounded" class="mt-0.5 shrink-0 text-[1.2rem] text-black/30 dark:text-white/30" />
				<div>
					<div class="text-sm font-bold text-black/55 dark:text-white/55">Coming soon</div>
					<div class="mt-0.5 text-xs leading-5 text-black/40 dark:text-white/40">
						Will become available once the API exposes an authenticated password update endpoint.
					</div>
				</div>
			</div>
		</section>
	</div>
</div>
