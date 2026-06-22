<script lang="ts">
import TurnstileWidget from "@components/security/TurnstileWidget.svelte";
import { createComment } from "@lib/client/comments";

let {
	postSlug,
	onCreated,
}: {
	postSlug: string;
	onCreated: () => void;
} = $props();

let content = $state("");
let turnstileToken = $state("");
let error = $state("");
let loading = $state(false);
let resetKey = $state(0);

const remaining = $derived(1000 - content.length);

async function submit() {
	error = "";
	const trimmed = content.trim();
	if (!trimmed) {
		error = "Write a comment first.";
		return;
	}
	if (trimmed.length > 1000) {
		error = "Comment must be 1000 characters or less.";
		return;
	}
	if (!turnstileToken) {
		error = "Please complete human verification.";
		return;
	}

	loading = true;
	try {
		await createComment({ postSlug, content: trimmed, turnstileToken });
		content = "";
		turnstileToken = "";
		resetKey += 1;
		onCreated();
	} catch (err) {
		error = err instanceof Error ? err.message : "Could not publish comment";
		resetKey += 1;
	} finally {
		loading = false;
	}
}
</script>

<form class="flex flex-col gap-4" onsubmit={(event) => { event.preventDefault(); void submit(); }}>
	<label class="flex flex-col gap-2 text-sm font-medium text-75">
		Comment
		<textarea class="auth-input min-h-32 resize-y leading-7" maxlength="1000" bind:value={content} placeholder="Join the discussion..." required></textarea>
	</label>
	<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
		<p class:text-red-500={remaining < 0} class="text-sm text-50">{remaining} characters left</p>
		<TurnstileWidget action="comment" resetKey={resetKey} onTokenChange={(token) => { turnstileToken = token; }} />
	</div>
	{#if error}
		<p class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/30 dark:text-red-200">{error}</p>
	{/if}
	<button class="btn-regular min-h-11 rounded-lg px-4 font-bold active:scale-95 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={loading}>
		{loading ? "Publishing..." : "Publish comment"}
	</button>
</form>
