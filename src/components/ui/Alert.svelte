<script lang="ts">
import Icon from "@iconify/svelte";

let {
	tone = "neutral",
	message,
}: { tone?: "neutral" | "success" | "warning" | "error"; message: string } =
	$props();
const icons = {
	neutral: "material-symbols:info-outline-rounded",
	success: "material-symbols:check-circle-outline-rounded",
	warning: "material-symbols:warning-outline-rounded",
	error: "material-symbols:error-outline-rounded",
};
</script>

<div class="sf-alert {tone}" role={tone === "error" ? "alert" : "status"}>
	<Icon icon={icons[tone]} />
	<p>{message}</p>
</div>

<style>
	.sf-alert { display: flex; align-items: flex-start; gap: 0.65rem; padding: 0.85rem; border: 1px solid var(--sf-border); border-radius: var(--sf-radius-md); background: var(--sf-surface-subtle); color: var(--sf-text-muted); font-size: 0.9rem; font-weight: 700; line-height: 1.45; }
	.sf-alert p { margin: 0; }
	.sf-alert :global(svg) { flex: none; margin-top: 0.1rem; font-size: 1.2rem; }
	.success { border-color: color-mix(in srgb, var(--sf-success) 25%, transparent); background: var(--sf-success-soft); color: var(--sf-success); }
	.warning { border-color: color-mix(in srgb, var(--sf-warning) 25%, transparent); background: var(--sf-warning-soft); color: var(--sf-warning); }
	.error { border-color: color-mix(in srgb, var(--sf-danger) 25%, transparent); background: var(--sf-danger-soft); color: var(--sf-danger); }
</style>
