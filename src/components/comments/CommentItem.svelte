<script lang="ts">
import Icon from "@iconify/svelte";
import { type CurrentUser } from "@lib/client/auth";
import { type CommentRecord, deleteComment } from "@lib/client/comments";

let {
	comment,
	currentUser,
	onDeleted,
}: {
	comment: CommentRecord;
	currentUser: CurrentUser | null;
	onDeleted: () => void;
} = $props();

let deleting = $state(false);
let error = $state("");

const canDelete = $derived(
	!!currentUser &&
		(currentUser.id === comment.userId || currentUser.role === "admin"),
);

function formatTime(value: string) {
	try {
		return new Intl.DateTimeFormat(undefined, {
			year: "numeric",
			month: "short",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		}).format(new Date(value));
	} catch {
		return value;
	}
}

async function remove() {
	if (!canDelete || deleting) return;
	deleting = true;
	error = "";
	try {
		await deleteComment(comment.id);
		onDeleted();
	} catch (err) {
		error = err instanceof Error ? err.message : "Could not delete comment";
	} finally {
		deleting = false;
	}
}
</script>

<article class="rounded-xl border border-[var(--line-divider)] bg-black/[0.015] p-4 dark:bg-white/[0.02]">
	<header class="mb-3 flex items-start justify-between gap-3">
		<div>
			<p class="font-bold text-90">{comment.username}</p>
			<time class="text-sm text-50" datetime={comment.createdAt}>{formatTime(comment.createdAt)}</time>
		</div>
		{#if canDelete}
			<button class="btn-plain min-h-11 rounded-lg px-3 text-sm active:scale-95 disabled:cursor-not-allowed disabled:opacity-60" type="button" disabled={deleting} onclick={() => void remove()}>
				<Icon icon="material-symbols:delete-outline-rounded" class="mr-1 text-[1.15rem]" />
				{deleting ? "Deleting" : "Delete"}
			</button>
		{/if}
	</header>
	<p class="whitespace-pre-wrap break-words text-base leading-7 text-75">{comment.content}</p>
	{#if error}
		<p class="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/30 dark:text-red-200">{error}</p>
	{/if}
</article>
