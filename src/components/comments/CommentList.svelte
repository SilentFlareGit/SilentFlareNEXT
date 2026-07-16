<script lang="ts">
import Icon from "@iconify/svelte";
import { type CurrentUser } from "@lib/client/auth";
import { type CommentRecord } from "@lib/client/comments";
import CommentForm from "./CommentForm.svelte";
import CommentItem from "./CommentItem.svelte";

let {
	comments,
	currentUser,
	postSlug,
	onDeleted,
	onUpdated,
	onReplied,
}: {
	comments: CommentRecord[];
	currentUser: CurrentUser | null;
	postSlug: string;
	onDeleted: () => void | Promise<void>;
	onUpdated: () => void | Promise<void>;
	onReplied: () => void | Promise<void>;
} = $props();

const REPLY_COLLAPSE_LIMIT = 5;
let replyingTo = $state<string | null>(null);
let expandedReplyGroups = $state<string[]>([]);

async function handleReplyCreated(parentId: string) {
	if (!expandedReplyGroups.includes(parentId)) {
		expandedReplyGroups = [...expandedReplyGroups, parentId];
	}
	await onReplied();
	replyingTo = null;
}

function toggleReplies(commentId: string) {
	expandedReplyGroups = expandedReplyGroups.includes(commentId)
		? expandedReplyGroups.filter((id) => id !== commentId)
		: [...expandedReplyGroups, commentId];
}

function visibleReplies(comment: CommentRecord) {
	return expandedReplyGroups.includes(comment.id)
		? comment.replies
		: comment.replies.slice(0, REPLY_COLLAPSE_LIMIT);
}
</script>

{#snippet commentBranch(comment: CommentRecord, depth: number)}
	<section aria-label={`Comment by ${comment.author.displayName || comment.author.username}`}>
		<CommentItem {comment} {currentUser} {onDeleted} {onUpdated} onReply={() => (replyingTo = replyingTo === comment.id ? null : comment.id)} />

		{#if comment.replies.length > 0 || replyingTo === comment.id}
			<div class={`mb-5 border-l-2 border-[var(--line-divider)] pl-3 sm:pl-5 ${depth < 3 ? "ml-3 sm:ml-10" : "ml-0"}`}>
				<div id={`comment-replies-${comment.id}`}>
					{#each visibleReplies(comment) as reply (reply.id)}
						{@render commentBranch(reply, depth + 1)}
					{/each}
				</div>

				{#if comment.replies.length > REPLY_COLLAPSE_LIMIT}
					<button
						class="btn-plain my-2 flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-bold text-[var(--primary)]"
						type="button"
						aria-expanded={expandedReplyGroups.includes(comment.id)}
						aria-controls={`comment-replies-${comment.id}`}
						onclick={() => toggleReplies(comment.id)}
					>
						<Icon icon={expandedReplyGroups.includes(comment.id) ? "material-symbols:expand-less-rounded" : "material-symbols:expand-more-rounded"} class="text-[1.2rem]" />
						{expandedReplyGroups.includes(comment.id) ? "Show fewer replies" : `Show ${comment.replies.length - REPLY_COLLAPSE_LIMIT} more replies`}
					</button>
				{/if}

				{#if replyingTo === comment.id}
					<div class="border-t border-[var(--line-divider)] pt-4">
						<div class="mb-3 flex items-center justify-between gap-3">
							<p class="min-w-0 truncate font-bold text-75">Reply to @{comment.author.username}</p>
							<button class="btn-plain min-h-11 shrink-0 rounded-lg px-3 text-sm font-bold" type="button" onclick={() => (replyingTo = null)}>Cancel</button>
						</div>
						<CommentForm {postSlug} parentId={comment.id} compact onCreated={() => handleReplyCreated(comment.id)} />
					</div>
				{/if}
			</div>
		{/if}
	</section>
{/snippet}

<div class="divide-y divide-[var(--line-divider)]">
	{#each comments as comment (comment.id)}
		<div class="py-1">{@render commentBranch(comment, 0)}</div>
	{/each}
</div>
