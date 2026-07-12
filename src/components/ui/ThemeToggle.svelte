<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";

let dark = $state(false);

function syncTheme() {
	dark = document.documentElement.classList.contains("dark");
	document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

function toggleTheme() {
	dark = !dark;
	document.documentElement.classList.toggle("dark", dark);
	document.documentElement.style.colorScheme = dark ? "dark" : "light";
	localStorage.setItem("theme", dark ? "dark" : "light");
}

onMount(syncTheme);
</script>

<button
	type="button"
	class="theme-toggle"
	aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
	title={dark ? "Light theme" : "Dark theme"}
	onclick={toggleTheme}
>
	<Icon icon={dark ? "material-symbols:wb-sunny-outline-rounded" : "material-symbols:dark-mode-outline-rounded"} />
</button>

<style>
	.theme-toggle {
		width: 2.75rem;
		height: 2.75rem;
		display: grid;
		place-items: center;
		border: 1px solid var(--sf-border-strong);
		border-radius: var(--sf-radius-md);
		background: var(--sf-surface);
		color: var(--sf-text-muted);
		box-shadow: 0 0.5rem 1.5rem rgba(28, 53, 79, 0.08);
		cursor: pointer;
		transition: color 150ms ease, background-color 150ms ease, border-color 150ms ease, transform 150ms ease;
	}
	.theme-toggle:hover {
		color: var(--sf-accent-strong);
		background: var(--sf-surface-muted);
		transform: translateY(-1px);
	}
	.theme-toggle:active {
		transform: translateY(0);
	}
	.theme-toggle :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}
</style>
