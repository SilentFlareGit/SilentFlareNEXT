<script lang="ts">
import Icon from "@iconify/svelte";

let { label = "Back", onclick } = $props<{
	label?: string;
	onclick: () => void;
}>();
</script>

<button type="button" class="auth-back" {onclick}>
	<Icon icon="material-symbols:arrow-back-rounded" />
	<span>{label}</span>
</button>

<style>
	.auth-back {
		min-height: 2.75rem;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin: 0 0 1.25rem;
		border: 0;
		padding: 0 0.25rem;
		background: transparent;
		color: var(--sf-text-muted);
		font-size: 0.875rem;
		font-weight: 700;
		cursor: pointer;
		transition:
			color 0.16s ease,
			transform 0.16s ease;
	}
	.auth-back:hover {
		color: var(--sf-accent-strong);
		transform: translateX(-0.15rem);
	}
	.auth-back:focus-visible {
		outline: 3px solid rgba(50, 139, 214, 0.35);
		outline-offset: 2px;
	}
	.auth-back :global(svg) {
		flex: none;
		font-size: 1.1rem;
	}
	@media (prefers-reduced-motion: reduce) {
		.auth-back {
			transition: none;
		}
	}
</style>
