<script lang="ts">
let {
	href = "https://blog.silentflare.com/",
	product = "",
	compact = false,
}: {
	href?: string;
	product?: string;
	compact?: boolean;
} = $props();
</script>

<a class:compact class="sf-brand" {href} aria-label={product ? `SilentFlare ${product}` : "SilentFlare Blog"}>
	<span class="sf-brand-mark" aria-hidden="true">S</span>
	<span class="sf-brand-name">SilentFlare</span>
	{#if product}<span class="sf-brand-product">{product}</span>{/if}
</a>

<style>
	.sf-brand {
		min-height: var(--sf-control-height);
		display: inline-flex;
		align-items: center;
		gap: 0.65rem;
		width: max-content;
		max-width: 100%;
		color: var(--sf-text);
		font-weight: 800;
		text-decoration: none;
	}
	.sf-brand-mark {
		width: 2rem;
		height: 2rem;
		display: grid;
		flex: none;
		place-items: center;
		border-radius: var(--sf-radius-md);
		background: var(--sf-accent);
		color: white;
	}
	.sf-brand-name,
	.sf-brand-product {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.sf-brand-product {
		color: var(--sf-text-muted);
		font-weight: 500;
	}
	.compact .sf-brand-name {
		display: none;
	}
	@media (min-width: 480px) {
		.compact .sf-brand-name {
			display: inline;
		}
	}
</style>
