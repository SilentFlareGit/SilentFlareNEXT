<script lang="ts">
const sections = [
	{
		title: "Identity",
		body: "Set a display name, avatar URL, and bio that follow your public presence on the site.",
	},
	{
		title: "Auth",
		body: "Use dedicated login and registration flows isolated from the public blog renderer.",
	},
	{
		title: "Comments",
		body: "Move from article comment prompts into accounts without losing the intended return destination.",
	},
];
</script>

<section class="card-base px-6 py-6 md:px-10 md:py-8">
	<div class="mb-6">
		<div class="font-bold transition text-lg text-neutral-900 dark:text-neutral-100 relative ml-6 mb-3 before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)] before:absolute before:left-[-16px] before:top-[5px]">
			Surface Map
		</div>
		<h2 class="text-2xl font-extrabold text-black/90 dark:text-white/90">Everything account-facing stays layered here.</h2>
		<p class="mt-2 max-w-[58ch] text-black/50 dark:text-white/50">
			The accounts subsite keeps authentication, profile editing, and user-specific public identity work separate from the blog reading surface.
		</p>
	</div>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
		{#each sections as section}
			<div class="rounded-xl border border-[var(--line-divider)] px-4 py-4">
				<div class="mb-2 text-base font-bold text-black/85 dark:text-white/85">{section.title}</div>
				<p class="text-sm leading-6 text-black/55 dark:text-white/55">{section.body}</p>
			</div>
		{/each}
	</div>
</section>
