<script lang="ts">
import Icon from "@iconify/svelte";
import { type CurrentUser } from "@lib/client/auth";
import {
	type CommentRecord,
	deleteComment,
	updateComment,
} from "@lib/client/comments";
import CommentMarkdown from "./CommentMarkdown.svelte";
import MarkdownEditor from "./MarkdownEditor.svelte";

let {
	comment,
	currentUser,
	onDeleted,
	onUpdated,
}: {
	comment: CommentRecord;
	currentUser: CurrentUser | null;
	onDeleted: () => void;
	onUpdated: () => void;
} = $props();

let deleting = $state(false);
let editing = $state(false);
let saving = $state(false);
let draft = $state(comment.content);
let error = $state("");

const canDelete = $derived(
	!!currentUser &&
		(currentUser.id === comment.userId || currentUser.role === "admin"),
);
const wasEdited = $derived(comment.updatedAt !== comment.createdAt);

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

function startEditing() {
	draft = comment.content;
	error = "";
	editing = true;
}

async function save() {
	const content = draft.trim();
	if (!content) {
		error = "Comment content is required.";
		return;
	}
	if (content.length > 1000) {
		error = "Comment must be 1000 characters or less.";
		return;
	}
	saving = true;
	error = "";
	try {
		await updateComment(comment.id, content);
		editing = false;
		onUpdated();
	} catch (err) {
		error = err instanceof Error ? err.message : "Could not update comment";
	} finally {
		saving = false;
	}
}
</script>

<article class="rounded-xl border border-[var(--line-divider)] bg-black/[0.015] p-4 dark:bg-white/[0.02]">
	<header class="mb-3 flex items-start justify-between gap-3">
		<div>
			<p class="font-bold text-90">{comment.username}</p>
			<p class="text-sm text-50">
				<time datetime={comment.createdAt}>{formatTime(comment.createdAt)}</time>
				{#if wasEdited}<span> · Edited</span>{/if}
			</p>
		</div>
		{#if canDelete}
			<div class="flex gap-1">
				<button class="btn-plain h-11 w-11 rounded-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-60" type="button" title="Edit comment" aria-label="Edit comment" disabled={deleting || saving} onclick={startEditing}>
					<Icon icon="material-symbols:edit-outline-rounded" class="text-[1.15rem]" />
				</button>
				<button class="btn-plain h-11 w-11 rounded-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-60" type="button" title="Delete comment" aria-label="Delete comment" disabled={deleting || saving} onclick={() => void remove()}>
					<Icon icon="material-symbols:delete-outline-rounded" class="text-[1.15rem]" />
				</button>
			</div>
		{/if}
	</header>
	{#if editing}
		<div class="flex flex-col gap-3">
			<MarkdownEditor bind:value={draft} label="Edit comment" />
			<div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
				<button class="btn-plain min-h-11 rounded-lg px-4 font-bold" type="button" disabled={saving} onclick={() => (editing = false)}>Cancel</button>
				<button class="btn-regular min-h-11 rounded-lg px-4 font-bold disabled:cursor-not-allowed disabled:opacity-60" type="button" disabled={saving || !draft.trim()} onclick={() => void save()}>
					<Icon icon="material-symbols:save-rounded" class="mr-2 text-[1.15rem]" />
					{saving ? "Saving..." : "Save changes"}
				</button>
			</div>
		</div>
	{:else}
		<CommentMarkdown content={comment.content} />
	{/if}
	{#if error}
		<p class="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/30 dark:text-red-200">{error}</p>
	{/if}
</article>
