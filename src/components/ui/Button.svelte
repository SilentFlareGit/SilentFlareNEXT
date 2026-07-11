<script lang="ts">
import Icon from "@iconify/svelte";
import type { Snippet } from "svelte";

let {
	variant = "primary",
	type = "button",
	icon = "",
	loading = false,
	disabled = false,
	full = false,
	onclick,
	children,
}: {
	variant?: "primary" | "secondary" | "ghost" | "danger";
	type?: "button" | "submit" | "reset";
	icon?: string;
	loading?: boolean;
	disabled?: boolean;
	full?: boolean;
	onclick?: (event: MouseEvent) => void;
	children: Snippet;
} = $props();
</script>

<button class:full class="sf-button {variant}" {type} disabled={disabled || loading} {onclick}>
	{#if loading}<span class="spinner" aria-hidden="true"></span>{:else if icon}<Icon {icon} />{/if}
	<span>{@render children()}</span>
</button>

<style>
	.sf-button {
		min-height: var(--sf-control-height);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		border: 1px solid transparent;
		border-radius: var(--sf-radius-md);
		padding: 0 1rem;
		font-weight: 800;
		cursor: pointer;
		transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease, transform 150ms ease;
	}
	.sf-button:hover:not(:disabled) { transform: translateY(-1px); }
	.sf-button:active:not(:disabled) { transform: translateY(0); }
	.sf-button:disabled { cursor: not-allowed; opacity: 0.55; }
	.primary { background: var(--sf-accent); color: white; }
	.primary:hover:not(:disabled) { background: var(--sf-accent-strong); }
	.secondary { border-color: var(--sf-border-strong); background: var(--sf-surface); color: var(--sf-text); }
	.secondary:hover:not(:disabled), .ghost:hover:not(:disabled) { background: var(--sf-surface-muted); }
	.ghost { background: transparent; color: var(--sf-text-muted); }
	.danger { border-color: color-mix(in srgb, var(--sf-danger) 30%, transparent); background: var(--sf-danger-soft); color: var(--sf-danger); }
	.full { width: 100%; }
	.sf-button :global(svg) { flex: none; font-size: 1.2rem; }
	.spinner { width: 1rem; height: 1rem; border: 2px solid currentColor; border-top-color: transparent; border-radius: 50%; animation: spin 700ms linear infinite; }
	@keyframes spin { to { transform: rotate(360deg); } }
</style>
