<script lang="ts">
import Icon from "@iconify/svelte";

let {
	icon,
	label,
	disabled = false,
	onclick,
}: {
	icon: string;
	label: string;
	disabled?: boolean;
	onclick?: (event: MouseEvent) => void;
} = $props();
</script>

<button class="sf-icon-button" type="button" aria-label={label} title={label} {disabled} {onclick}><Icon {icon} /></button>

<style>
	.sf-icon-button { width: var(--sf-control-height); height: var(--sf-control-height); display: inline-grid; place-items: center; border: 1px solid var(--sf-border-strong); border-radius: var(--sf-radius-md); background: var(--sf-surface); color: var(--sf-text-muted); cursor: pointer; transition: background-color 150ms ease, color 150ms ease; }
	.sf-icon-button:hover:not(:disabled) { color: var(--sf-accent-strong); background: var(--sf-surface-muted); }
	.sf-icon-button:disabled { cursor: not-allowed; opacity: 0.55; }
	.sf-icon-button :global(svg) { font-size: 1.25rem; }
</style>
