<script lang="ts">
import type { Snippet } from "svelte";
import BrandMark from "../ui/BrandMark.svelte";

let {
	headline,
	description,
	backHref,
	backLabel,
	product = "",
	story,
	children,
}: {
	headline: string;
	description: string;
	backHref: string;
	backLabel: string;
	product?: string;
	story?: Snippet;
	children: Snippet;
} = $props();
</script>

<div class="sf-app identity-stage">
	<main class="identity-main">
		<section class="identity-shell">
			<aside class="identity-story">
				<BrandMark {product} />
				<div class="story-copy">
					<h1>{headline}</h1>
					<p>{description}</p>
				</div>
				{#if story}<div class="story-extra">{@render story()}</div>{/if}
				<a class="story-link" href={backHref}>{backLabel}</a>
			</aside>
			<div class="identity-form-column">
				<section class="identity-form">{@render children()}</section>
				<p class="identity-legal">By continuing, you agree to the <a href="https://tos.silentflare.com/">SilentFlare Terms of Service</a>.</p>
			</div>
		</section>
	</main>
</div>

<style>
	.identity-stage { padding: 0.75rem; overflow-x: hidden; }
	.identity-main { width: min(100%, 80rem); margin: 0 auto; }
	.identity-shell { display: grid; gap: 1.5rem; padding: 1rem 0; }
	.identity-story { min-width: 0; display: flex; flex-direction: column; gap: 1rem; padding: 0.5rem 0; }
	.story-copy h1 { max-width: 17ch; margin: 0; color: var(--sf-text); font-size: 2rem; line-height: 1.08; letter-spacing: 0; }
	.story-copy p { max-width: 31rem; margin: 0.75rem 0 0; color: var(--sf-text-muted); line-height: 1.65; }
	.story-extra { min-width: 0; }
	.story-link { min-height: var(--sf-control-height); display: inline-flex; align-items: center; width: max-content; color: var(--sf-accent-strong); font-weight: 700; text-decoration: underline; text-underline-offset: 0.2rem; }
	.identity-form-column { min-width: 0; }
	.identity-form { min-width: 0; min-height: 28rem; display: flex; align-items: center; padding: 1.25rem; border: 1px solid var(--sf-border); border-radius: var(--sf-radius-lg); background: var(--sf-surface); box-shadow: 0 0.75rem 2.5rem rgba(28, 53, 79, 0.07); }
	.identity-legal { margin: 0.85rem 0 0; color: var(--sf-text-muted); font-size: 0.8rem; text-align: center; }
	.identity-legal a { color: inherit; text-decoration: underline; text-underline-offset: 0.15rem; }
	@media (min-width: 768px) {
		.identity-stage { padding: 1.5rem; }
		.identity-shell { gap: 2rem; padding: 1.5rem 0; }
		.identity-story { padding: 1rem 0; }
		.identity-form { padding: 2.5rem; }
	}
	@media (min-width: 1024px) {
		.identity-shell { min-height: 100svh; grid-template-columns: minmax(0, 1fr) 31rem; align-items: center; gap: clamp(4rem, 8vw, 7rem); padding: 2rem 0; }
		.identity-story { min-height: 29rem; justify-content: center; padding: 2rem 0; }
		.identity-form { padding: 3rem; }
		.story-copy h1 { font-size: 3.25rem; }
		.identity-legal { text-align: center; }
	}
</style>
