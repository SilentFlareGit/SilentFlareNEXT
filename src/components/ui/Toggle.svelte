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
	.sf-toggle-row { min-height: 5.75rem; display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 1.5rem; padding: 1.15rem 1.25rem; border: 0; border-radius: 0; background: transparent; cursor: pointer; }
	.sf-toggle-row span { min-width: 0; display: grid; gap: 0.3rem; }
	.sf-toggle-row strong { color: var(--sf-text); }
	.sf-toggle-row small { max-width: 62ch; color: var(--sf-text-muted); font-size: 0.85rem; line-height: 1.55; }
	.sf-toggle-row input { appearance: none; position: relative; flex: none; width: 3rem; height: 1.75rem; margin: 0; border: 1px solid var(--sf-border-strong); border-radius: 999px; background: var(--sf-text-soft); cursor: pointer; }
	.sf-toggle-row input::before { content: ""; position: absolute; top: 0.2rem; left: 0.2rem; width: 1.2rem; height: 1.2rem; border-radius: 50%; background: white; transition: transform 150ms ease; }
	.sf-toggle-row input:checked { border-color: var(--sf-accent); background: var(--sf-accent); }
	.sf-toggle-row input:checked::before { transform: translateX(1.25rem); }
	.sf-toggle-row input:disabled { cursor: not-allowed; opacity: 0.55; }
	@media (max-width: 520px) {
		.sf-toggle-row { min-height: 6rem; gap: 1rem; padding: 1.1rem; }
	}
</style>
