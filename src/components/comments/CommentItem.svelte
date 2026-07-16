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
	onReply,
}: {
	comment: CommentRecord;
	currentUser: CurrentUser | null;
	onDeleted: () => void | Promise<void>;
	onUpdated: () => void | Promise<void>;
	onReply?: () => void;
} = $props();

let deleting = $state(false);
let confirmingDelete = $state(false);
let editing = $state(false);
let saving = $state(false);
let draft = $state(comment.content);
let error = $state("");
let actionMenu: HTMLDetailsElement;

const canManage = $derived(
	!comment.isDeleted &&
		!!currentUser &&
		(currentUser.id === comment.userId || currentUser.role === "admin"),
);
const wasEdited = $derived(
	!comment.isDeleted && comment.updatedAt !== comment.createdAt,
);
const authorName = $derived(
	comment.author.displayName || comment.author.username || comment.username,
);
const authorInitial = $derived(authorName.slice(0, 1).toUpperCase());

function formatTime(value: string) {
	try {
		return new Intl.DateTimeFormat(undefined, {
			dateStyle: "medium",
			timeStyle: "short",
		}).format(new Date(value));
	} catch {
		return value;
	}
}

function formatRelativeTime(value: string) {
	const timestamp = new Date(value).getTime();
	if (!Number.isFinite(timestamp)) return formatTime(value);
	const seconds = Math.round((timestamp - Date.now()) / 1000);
	const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
	if (Math.abs(seconds) < 60) return formatter.format(seconds, "second");
	const minutes = Math.round(seconds / 60);
	if (Math.abs(minutes) < 60) return formatter.format(minutes, "minute");
	const hours = Math.round(minutes / 60);
	if (Math.abs(hours) < 24) return formatter.format(hours, "hour");
	const days = Math.round(hours / 24);
	if (Math.abs(days) < 30) return formatter.format(days, "day");
	return formatTime(value);
}

async function remove() {
	if (!canManage || deleting) return;
	deleting = true;
	error = "";
	try {
		await deleteComment(comment.id);
		await onDeleted();
	} catch (err) {
		error = err instanceof Error ? err.message : "Could not delete comment";
	} finally {
		deleting = false;
		confirmingDelete = false;
	}
}

function startEditing() {
	draft = comment.content;
	error = "";
	editing = true;
	if (actionMenu) actionMenu.open = false;
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
		await onUpdated();
		editing = false;
	} catch (err) {
		error = err instanceof Error ? err.message : "Could not update comment";
	} finally {
		saving = false;
	}
}

function requestDelete() {
	confirmingDelete = true;
	if (actionMenu) actionMenu.open = false;
}
</script>

<article class="comment-item py-5 first:pt-0 last:pb-0">
	<div class="flex min-w-0 items-start gap-3 sm:gap-4">
		{#if comment.author.avatarUrl}
			<img class="h-9 w-9 shrink-0 rounded-full object-cover sm:h-10 sm:w-10" src={comment.author.avatarUrl} alt="" loading="lazy" referrerpolicy="no-referrer" />
		{:else}
			<div class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--btn-regular-bg)] font-bold text-[var(--primary)] sm:h-10 sm:w-10" aria-hidden="true">{authorInitial}</div>
		{/if}

		<div class="min-w-0 flex-1">
			<header class="flex min-w-0 items-start justify-between gap-2">
				<div class="min-w-0">
					<div class="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
						<p class="max-w-full truncate font-bold text-90">{authorName}</p>
						{#if comment.author.displayName}<span class="truncate text-sm text-50">@{comment.author.username}</span>{/if}
					</div>
					<p class="flex flex-wrap items-center gap-x-1.5 text-sm text-50">
						<time datetime={comment.createdAt} title={formatTime(comment.createdAt)}>{formatRelativeTime(comment.createdAt)}</time>
						{#if wasEdited}
							<span aria-hidden="true">/</span>
							<span>Edited <time datetime={comment.updatedAt} title={formatTime(comment.updatedAt)}>{formatRelativeTime(comment.updatedAt)}</time></span>
						{/if}
					</p>
				</div>

				{#if canManage}
					<details class="action-menu relative shrink-0" bind:this={actionMenu}>
						<summary class="btn-plain grid h-11 w-11 cursor-pointer list-none place-items-center rounded-lg" title="Comment actions" aria-label="Comment actions">
							<Icon icon="material-symbols:more-horiz" class="text-[1.25rem]" />
						</summary>
						<div class="absolute right-0 z-10 mt-1 grid min-w-36 overflow-hidden rounded-lg border border-[var(--line-divider)] bg-[var(--card-bg)] p-1 shadow-lg">
							<button class="flex min-h-11 items-center gap-2 rounded-md px-3 text-left text-sm font-medium text-75 hover:bg-[var(--btn-plain-bg-hover)]" type="button" disabled={deleting || saving} onclick={startEditing}><Icon icon="material-symbols:edit-outline-rounded" />Edit</button>
							<button class="flex min-h-11 items-center gap-2 rounded-md px-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/30" type="button" disabled={deleting || saving} onclick={requestDelete}><Icon icon="material-symbols:delete-outline-rounded" />Delete</button>
						</div>
					</details>
				{/if}
			</header>

			{#if editing}
				<div class="mt-3 flex flex-col gap-3">
					<MarkdownEditor bind:value={draft} label="Edit comment" minHeightClass="min-h-28" placeholder="Update your comment..." />
					<div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
						<button class="btn-plain min-h-11 rounded-lg px-4 font-bold" type="button" disabled={saving} onclick={() => (editing = false)}>Cancel</button>
						<button class="btn-regular min-h-11 rounded-lg px-4 font-bold disabled:cursor-not-allowed disabled:opacity-60" type="button" disabled={saving || !draft.trim()} onclick={() => void save()}>
							<Icon icon="material-symbols:save-rounded" class="mr-2 text-[1.15rem]" />
							{saving ? "Saving..." : "Save changes"}
						</button>
					</div>
				</div>
			{:else if comment.isDeleted}
				<p class="mt-3 italic text-50">This comment was deleted.</p>
			{:else}
				<div class="mt-3"><CommentMarkdown content={comment.content} /></div>
				{#if currentUser && onReply}
					<button class="mt-2 flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-bold text-50 hover:bg-[var(--btn-plain-bg-hover)] hover:text-[var(--primary)]" type="button" onclick={onReply}>
						<Icon icon="material-symbols:reply-rounded" class="text-[1.15rem]" />Reply
					</button>
				{/if}
			{/if}

			{#if confirmingDelete}
				<div class="mt-3 flex flex-col gap-3 border-l-4 border-red-400 bg-red-50 px-3 py-3 text-sm text-red-800 dark:bg-red-950/30 dark:text-red-200" role="alert">
					<p>Delete this comment? Replies will remain visible.</p>
					<div class="flex flex-wrap justify-end gap-2">
						<button class="min-h-11 rounded-lg px-3 font-bold" type="button" disabled={deleting} onclick={() => (confirmingDelete = false)}>Cancel</button>
						<button class="min-h-11 rounded-lg bg-red-600 px-3 font-bold text-white disabled:opacity-60" type="button" disabled={deleting} onclick={() => void remove()}>{deleting ? "Deleting..." : "Delete"}</button>
					</div>
				</div>
			{/if}

			{#if error}
				<p class="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/30 dark:text-red-200" role="alert">{error}</p>
			{/if}
		</div>
	</div>
</article>

<style>
	.action-menu summary::-webkit-details-marker {
		display: none;
	}
</style>
