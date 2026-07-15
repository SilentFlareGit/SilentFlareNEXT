<script lang="ts">
import { renderCommentMarkdown } from "@lib/client/comment-markdown";

let { content }: { content: string } = $props();
const rendered = $derived(renderCommentMarkdown(content));
</script>

<div class="comment-markdown break-words text-base leading-7 text-75">
	{@html rendered}
</div>

<style>
	.comment-markdown :global(p),
	.comment-markdown :global(ul),
	.comment-markdown :global(ol),
	.comment-markdown :global(blockquote),
	.comment-markdown :global(pre) {
		margin: 0 0 0.75rem;
	}

	.comment-markdown :global(:last-child) {
		margin-bottom: 0;
	}

	.comment-markdown :global(ul),
	.comment-markdown :global(ol) {
		padding-left: 1.5rem;
	}

	.comment-markdown :global(ul) {
		list-style: disc;
	}

	.comment-markdown :global(ol) {
		list-style: decimal;
	}

	.comment-markdown :global(blockquote) {
		border-left: 3px solid var(--primary);
		padding-left: 0.875rem;
		opacity: 0.85;
	}

	.comment-markdown :global(code) {
		border-radius: 0.25rem;
		background: var(--codeblock-bg);
		padding: 0.125rem 0.3rem;
		font-family: "JetBrains Mono Variable", ui-monospace, monospace;
		font-size: 0.875em;
	}

	.comment-markdown :global(pre) {
		overflow-x: auto;
		border-radius: 0.5rem;
		background: var(--codeblock-bg);
		padding: 0.875rem;
	}

	.comment-markdown :global(pre code) {
		background: transparent;
		padding: 0;
	}

	.comment-markdown :global(a) {
		color: var(--primary);
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	.comment-markdown :global(h1),
	.comment-markdown :global(h2),
	.comment-markdown :global(h3),
	.comment-markdown :global(h4),
	.comment-markdown :global(h5),
	.comment-markdown :global(h6) {
		margin: 0.75rem 0 0.4rem;
		font-size: 1rem;
		font-weight: 700;
		line-height: 1.5;
	}
</style>
