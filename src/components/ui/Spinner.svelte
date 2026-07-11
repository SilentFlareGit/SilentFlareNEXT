<script lang="ts">
let { label = "Loading" }: { label?: string } = $props();
</script>

<div class="sf-loading" role="status">
	<span aria-hidden="true"></span>
	<p>{label}</p>
</div>

<style>
	.sf-loading { width: 100%; display: grid; justify-items: center; gap: 1rem; color: var(--sf-text-muted); }
	.sf-loading span { width: 2rem; height: 2rem; border: 2px solid var(--sf-border-strong); border-top-color: var(--sf-accent); border-radius: 50%; animation: spin 800ms linear infinite; }
	.sf-loading p { margin: 0; font-size: 0.9rem; }
	@keyframes spin { to { transform: rotate(360deg); } }
</style>
