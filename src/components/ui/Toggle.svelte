<script lang="ts">
let {
	checked = $bindable(false),
	label,
	description = "",
	disabled = false,
}: {
	checked?: boolean;
	label: string;
	description?: string;
	disabled?: boolean;
} = $props();
</script>

<label class="sf-toggle-row">
	<span><strong>{label}</strong>{#if description}<small>{description}</small>{/if}</span>
	<input type="checkbox" bind:checked {disabled} />
</label>

<style>
	.sf-toggle-row { min-height: 4.5rem; display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 1rem; padding: 0.85rem; border: 1px solid var(--sf-border); border-radius: var(--sf-radius-md); background: var(--sf-surface-subtle); cursor: pointer; }
	.sf-toggle-row span { min-width: 0; display: grid; gap: 0.2rem; }
	.sf-toggle-row strong { color: var(--sf-text); }
	.sf-toggle-row small { color: var(--sf-text-muted); font-size: 0.85rem; line-height: 1.45; }
	.sf-toggle-row input { appearance: none; position: relative; width: 3rem; height: 1.75rem; margin: 0; border: 1px solid var(--sf-border-strong); border-radius: 999px; background: var(--sf-text-soft); cursor: pointer; }
	.sf-toggle-row input::before { content: ""; position: absolute; top: 0.2rem; left: 0.2rem; width: 1.2rem; height: 1.2rem; border-radius: 50%; background: white; transition: transform 150ms ease; }
	.sf-toggle-row input:checked { border-color: var(--sf-accent); background: var(--sf-accent); }
	.sf-toggle-row input:checked::before { transform: translateX(1.25rem); }
	.sf-toggle-row input:disabled { cursor: not-allowed; opacity: 0.55; }
</style>
