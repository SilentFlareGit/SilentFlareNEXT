<script lang="ts">
import Icon from "@iconify/svelte";

const rules = [
	{
		icon: "material-symbols:verified-user-outline-rounded",
		title: "Cloudflare gate",
		body: "Every login and registration request must pass Turnstile before the API will accept it.",
	},
	{
		icon: "material-symbols:cookie-outline-rounded",
		title: "Cookie session",
		body: "Account access stays on HttpOnly cookies scoped for the SilentFlare domain.",
	},
	{
		icon: "material-symbols:comment-outline-rounded",
		title: "Comment return path",
		body: "Comment prompts can send readers into accounts and return them to the current post after sign-in.",
	},
];
</script>

<section class="card-base p-5">
	<div class="font-bold transition text-lg text-neutral-900 dark:text-neutral-100 relative ml-6 mb-4 before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)] before:absolute before:left-[-16px] before:top-[5px]">
		Access Model
	</div>

	<div class="flex flex-col gap-4">
		{#each rules as rule}
			<div class="rounded-xl border border-[var(--line-divider)] px-4 py-4">
				<div class="mb-2 flex items-center gap-3">
					<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--btn-plain-bg)] text-[var(--primary)]">
						<Icon icon={rule.icon} class="text-[1.2rem]" />
					</div>
					<div class="font-bold text-black/85 dark:text-white/85">{rule.title}</div>
				</div>
				<p class="max-w-[24ch] text-sm leading-7 text-black/55 dark:text-white/55 sm:max-w-none">{rule.body}</p>
			</div>
		{/each}
	</div>
</section>
