<script lang="ts">
import { type CurrentUser } from "@lib/client/auth";
import { type CommentRecord } from "@lib/client/comments";
import CommentItem from "./CommentItem.svelte";

let {
	comments,
	currentUser,
	onDeleted,
	onUpdated,
}: {
	comments: CommentRecord[];
	currentUser: CurrentUser | null;
	onDeleted: () => void | Promise<void>;
	onUpdated: () => void | Promise<void>;
} = $props();
</script>

<div class="flex flex-col gap-3">
	{#each comments as comment (comment.id)}
		<CommentItem {comment} {currentUser} {onDeleted} {onUpdated} />
	{/each}
</div>
