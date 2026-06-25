<script lang="ts">
import Icon from "@iconify/svelte";

let { mode = "login" } = $props<{ mode: string }>();

const features = [
	{
		icon: "material-symbols:chat-bubble-outline-rounded",
		text: "Join article discussions",
	},
	{
		icon: "material-symbols:person-outline-rounded",
		text: "Public profile & identity",
	},
	{
		icon: "material-symbols:lock-outline-rounded",
		text: "Cloudflare-secured sessions",
	},
];
</script>

<div
	class="relative hidden flex-col justify-between overflow-hidden p-10 lg:flex xl:p-12"
	style="background: oklch(0.15 0.05 var(--hue))"
>
	<!-- Dot grid texture -->
	<div
		class="pointer-events-none absolute inset-0"
		style="background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1.5px, transparent 1.5px); background-size: 24px 24px;"
	></div>

	<!-- Ambient glow bottom-right -->
	<div
		class="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full"
		style="background: radial-gradient(circle, oklch(0.65 0.15 var(--hue) / 0.25) 0%, transparent 70%)"
	></div>
	<!-- Ambient glow top-left -->
	<div
		class="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full"
		style="background: radial-gradient(circle, oklch(0.65 0.15 var(--hue) / 0.12) 0%, transparent 70%)"
	></div>

	<!-- Wordmark -->
	<div class="relative z-10 flex items-center gap-2.5">
		<div
			class="flex h-9 w-9 items-center justify-center rounded-xl"
			style="background: rgba(255,255,255,0.1)"
		>
			<Icon
				icon="material-symbols:shield-lock-outline-rounded"
				class="text-[1.2rem] text-white"
			/>
		</div>
		<span class="text-base font-bold tracking-wide text-white">SilentFlare</span>
	</div>

	<!-- Main headline reactive to mode -->
	<div class="relative z-10 mt-auto">
		<h2 class="mb-3 text-3xl font-extrabold leading-[1.2] tracking-tight text-white xl:text-4xl">
			{#if mode === "register"}
				Join the<br />community.
			{:else}
				Welcome<br />back.
			{/if}
		</h2>
		<p class="max-w-[22ch] text-sm leading-relaxed" style="color: rgba(255,255,255,0.42)">
			One account for the full SilentFlare experience.
		</p>
	</div>

	<!-- Feature list -->
	<div class="relative z-10 mt-10 flex flex-col gap-3">
		{#each features as feature}
			<div class="flex items-center gap-3">
				<div
					class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
					style="background: rgba(255,255,255,0.08)"
				>
					<Icon icon={feature.icon} class="text-[0.95rem] text-white/70" />
				</div>
				<span class="text-sm font-medium text-white/55">{feature.text}</span>
			</div>
		{/each}
	</div>

	<!-- Domain attribution -->
	<div class="relative z-10 mt-8">
		<span class="text-xs tracking-wider text-white/25">accounts.silentflare.com</span>
	</div>
</div>
