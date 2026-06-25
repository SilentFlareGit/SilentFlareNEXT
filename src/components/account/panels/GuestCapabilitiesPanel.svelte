<script lang="ts">
import Icon from "@iconify/svelte";

const capabilities = [
	{
		icon: "material-symbols:person-outline-rounded",
		title: "Identity",
		body: "Set a display name, avatar, and bio that follow your public presence across the site.",
	},
	{
		icon: "material-symbols:lock-outline-rounded",
		title: "Auth",
		body: "Dedicated login and registration flows, isolated from the public blog renderer.",
	},
	{
		icon: "material-symbols:comment-outline-rounded",
		title: "Comments",
		body: "Comment prompts send readers into accounts and return them to the post after sign-in.",
	},
];
</script>

<section class="card-base px-6 py-6 md:px-10 md:py-8">
	<div class="mb-7">
		<div class="font-bold transition text-lg text-neutral-900 dark:text-neutral-100 relative ml-6 mb-3 before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)] before:absolute before:left-[-16px] before:top-[5px]">
			What you can do
		</div>
		<h2 class="text-2xl font-extrabold text-black/90 dark:text-white/90">
			One account across SilentFlare.
		</h2>
		<p class="mt-2 max-w-[58ch] text-black/50 dark:text-white/50">
			Authentication, profile editing, and public identity work — all separate from the blog reading surface.
		</p>
	</div>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
		{#each capabilities as cap}
			<div class="rounded-xl border border-[var(--line-divider)] px-5 py-5">
				<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--btn-regular-bg)] text-[var(--primary)]">
					<Icon icon={cap.icon} class="text-[1.5rem]" />
				</div>
				<div class="mb-1.5 text-base font-bold text-black/85 dark:text-white/85">{cap.title}</div>
				<p class="text-sm leading-6 text-black/55 dark:text-white/55">{cap.body}</p>
			</div>
		{/each}
	</div>

	<div class="mt-5 flex items-center gap-2">
		<a
			href="https://blog.silentflare.com"
			class="flex items-center gap-1.5 text-sm font-bold text-[var(--primary)] hover:underline"
		>
			<Icon icon="material-symbols:arrow-back-rounded" class="text-[1rem]" />
			Back to blog
		</a>
	</div>
</section>
