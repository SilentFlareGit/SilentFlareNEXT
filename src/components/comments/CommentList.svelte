<script lang="ts">
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

let replyingTo = $state<string | null>(null);

async function handleReplyCreated() {
	await onReplied();
	replyingTo = null;
}
</script>

<div class="divide-y divide-[var(--line-divider)]">
	{#each comments as comment (comment.id)}
		<section class="py-1" aria-label={`Comment by ${comment.author.displayName || comment.author.username}`}>
			<CommentItem {comment} {currentUser} {onDeleted} {onUpdated} onReply={() => (replyingTo = replyingTo === comment.id ? null : comment.id)} />

			{#if comment.replies.length > 0 || replyingTo === comment.id}
				<div class="mb-5 ml-3 border-l-2 border-[var(--line-divider)] pl-3 sm:ml-12 sm:pl-5">
					{#each comment.replies as reply (reply.id)}
						<CommentItem comment={reply} {currentUser} isReply {onDeleted} {onUpdated} />
					{/each}

					{#if replyingTo === comment.id}
						<div class="border-t border-[var(--line-divider)] pt-4">
							<div class="mb-3 flex items-center justify-between gap-3">
								<p class="font-bold text-75">Reply to @{comment.author.username}</p>
								<button class="btn-plain min-h-11 rounded-lg px-3 text-sm font-bold" type="button" onclick={() => (replyingTo = null)}>Cancel</button>
							</div>
							<CommentForm {postSlug} parentId={comment.id} compact onCreated={handleReplyCreated} />
						</div>
					{/if}
				</div>
			{/if}
		</section>
	{/each}
</div>
