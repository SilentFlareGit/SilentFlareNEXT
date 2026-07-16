<script lang="ts">
import TurnstileWidget from "@components/security/TurnstileWidget.svelte";
import Icon from "@iconify/svelte";
import { createComment } from "@lib/client/comments";
import MarkdownEditor from "./MarkdownEditor.svelte";

let {
	postSlug,
	parentId = null,
	compact = false,
	onCreated,
}: {
	postSlug: string;
	parentId?: string | null;
	compact?: boolean;
	onCreated: () => void | Promise<void>;
} = $props();

let content = $state("");
let turnstileToken = $state("");
let error = $state("");
let loading = $state(false);
let resetKey = $state(0);
let success = $state("");

async function submit() {
	error = "";
	success = "";
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
		await createComment({
			postSlug,
			content: trimmed,
			turnstileToken,
			parentId,
		});
		content = "";
		turnstileToken = "";
		resetKey += 1;
		success = parentId ? "Reply published." : "Comment published.";
		await onCreated();
	} catch (err) {
		error = err instanceof Error ? err.message : "Could not publish comment";
		resetKey += 1;
	} finally {
		loading = false;
	}
}
</script>

<form class="flex flex-col gap-4" onsubmit={(event) => { event.preventDefault(); void submit(); }}>
	<MarkdownEditor bind:value={content} label={parentId ? "Reply" : "Comment"} minHeightClass={compact ? "min-h-28" : "min-h-36"} placeholder={parentId ? "Write a reply..." : "Join the discussion..."} />
	<div class="flex justify-center sm:justify-end">
		<TurnstileWidget action="comment" resetKey={resetKey} onTokenChange={(token) => { turnstileToken = token; }} />
	</div>
	{#if error}
		<p class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/30 dark:text-red-200">{error}</p>
	{/if}
	{#if success}
		<p class="text-sm font-medium text-green-700 dark:text-green-300" role="status">{success}</p>
	{/if}
	<button class="btn-regular min-h-11 rounded-lg px-4 font-bold active:scale-95 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={loading || !content.trim()}>
		<Icon icon="material-symbols:send-rounded" class="mr-2 text-[1.15rem]" />
		{loading ? "Publishing..." : parentId ? "Publish reply" : "Publish comment"}
	</button>
</form>
