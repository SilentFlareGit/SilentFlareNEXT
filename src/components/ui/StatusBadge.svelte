<script lang="ts">
let {
	tone = "neutral",
	label,
}: {
	tone?: "neutral" | "accent" | "success" | "warning" | "danger";
	label: string;
} = $props();
</script>

<span class="sf-status {tone}">{label}</span>

<style>
	.sf-status { min-height: 1.75rem; display: inline-flex; align-items: center; width: max-content; max-width: 100%; border-radius: 999px; padding: 0 0.65rem; background: var(--sf-surface-muted); color: var(--sf-text-muted); font-size: 0.72rem; font-weight: 800; white-space: nowrap; }
	.accent { background: var(--sf-accent-soft); color: var(--sf-accent-strong); }
	.success { background: var(--sf-success-soft); color: var(--sf-success); }
	.warning { background: var(--sf-warning-soft); color: var(--sf-warning); }
	.danger { background: var(--sf-danger-soft); color: var(--sf-danger); }
</style>
