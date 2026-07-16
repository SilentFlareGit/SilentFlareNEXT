<script lang="ts">
import Icon from "@iconify/svelte";
import { type CurrentUser, getCurrentUser } from "@lib/client/auth";
import {
	type CommentRecord,
	getComments,
	setCommentCsrf,
} from "@lib/client/comments";
import { onMount } from "svelte";
import CommentForm from "./CommentForm.svelte";
import CommentList from "./CommentList.svelte";

let { postSlug }: { postSlug: string } = $props();

let user = $state<CurrentUser | null>(null);
let comments = $state<CommentRecord[]>([]);
let totalCount = $state(0);
let nextCursor = $state<string | null>(null);
let loading = $state(true);
let loadingMore = $state(false);
let refreshing = $state(false);
let error = $state("");
let accountHref = $state("/accounts/");

async function loadUser() {
	try {
		const result = await getCurrentUser();
		user = result.user;
		setCommentCsrf(result.csrf ?? "");
	} catch {
		user = null;
		setCommentCsrf();
	}
}

async function loadComments(append = false) {
	error = "";
	try {
		const result = await getComments(postSlug, {
			cursor: append ? nextCursor : null,
			limit: 20,
		});
		comments = append ? [...comments, ...result.items] : result.items;
		totalCount = result.totalCount;
		nextCursor = result.nextCursor;
	} catch (err) {
		error = err instanceof Error ? err.message : "Could not load comments";
	}
}

async function refresh() {
	refreshing = true;
	await Promise.all([loadUser(), loadComments()]);
	refreshing = false;
}

async function loadMore() {
	if (!nextCursor || loadingMore) return;
	loadingMore = true;
	await loadComments(true);
	loadingMore = false;
}

onMount(() => {
	accountHref = `https://auth.silentflare.com/login?return_url=${encodeURIComponent(window.location.href)}`;
	void Promise.all([loadUser(), loadComments()]).finally(() => {
		loading = false;
	});
	const refreshAuth = () => void loadUser();
	document.addEventListener("silentflare-auth-change", refreshAuth);
	return () => {
		document.removeEventListener("silentflare-auth-change", refreshAuth);
	};
});
</script>

<section class="discussion mb-4 bg-[var(--card-bg)] px-4 py-6 sm:rounded-[var(--radius-large)] sm:px-8" aria-labelledby="comments-title">
	<header class="mb-6 flex items-center justify-between gap-3 border-b border-[var(--line-divider)] pb-4">
		<div class="min-w-0">
			<h2 id="comments-title" class="text-xl font-bold text-90 sm:text-2xl">Discussion</h2>
			<p class="mt-1 text-sm text-50" aria-live="polite">{totalCount} {totalCount === 1 ? "comment" : "comments"}</p>
		</div>
		<button class="btn-plain h-11 w-11 shrink-0 rounded-lg active:scale-95 disabled:cursor-wait disabled:opacity-60" type="button" title="Refresh comments" aria-label="Refresh comments" disabled={loading || refreshing} onclick={() => void refresh()}>
			<Icon icon="material-symbols:refresh-rounded" class={`text-[1.25rem] ${refreshing ? "animate-spin" : ""}`} />
		</button>
	</header>

	{#if error}
		<div class="mb-5 flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/30 dark:text-red-200" role="alert">
			<p>{error}</p>
			<button class="shrink-0 font-bold underline" type="button" onclick={() => void refresh()}>Retry</button>
		</div>
	{/if}

	{#if loading}
		<div class="space-y-5" aria-label="Loading comments">
			<div class="h-36 animate-pulse rounded-lg bg-[var(--btn-regular-bg)]"></div>
			<div class="h-24 animate-pulse rounded-lg bg-[var(--btn-regular-bg)]"></div>
		</div>
	{:else}
		<div class="mb-8">
			{#if user}
				<CommentForm {postSlug} onCreated={loadComments} />
			{:else}
				<div class="border-l-4 border-[var(--primary)] bg-[var(--btn-plain-bg-active)] px-4 py-4">
					<p class="mb-3 text-75">Sign in to join the discussion and publish comments.</p>
					<a class="btn-regular min-h-11 w-fit rounded-lg px-4 font-bold active:scale-95" href={accountHref}>
						<Icon icon="material-symbols:login-rounded" class="mr-2 text-[1.15rem]" />
						Sign in to comment
					</a>
				</div>
			{/if}
		</div>

		{#if comments.length > 0}
			<CommentList {comments} currentUser={user} {postSlug} onDeleted={loadComments} onUpdated={loadComments} onReplied={loadComments} />
			{#if nextCursor}
				<div class="mt-6 flex justify-center">
					<button class="btn-regular min-h-11 rounded-lg px-5 font-bold active:scale-95 disabled:cursor-wait disabled:opacity-60" type="button" disabled={loadingMore} onclick={() => void loadMore()}>
						<Icon icon={loadingMore ? "material-symbols:progress-activity" : "material-symbols:expand-more-rounded"} class={`mr-2 text-[1.2rem] ${loadingMore ? "animate-spin" : ""}`} />
						{loadingMore ? "Loading..." : "Load more"}
					</button>
				</div>
			{/if}
		{:else if !error}
			<div class="border-y border-[var(--line-divider)] py-10 text-center">
				<p class="font-medium text-75">No comments yet.</p>
				<p class="mt-1 text-sm text-50">Be the first to add a thoughtful note.</p>
			</div>
		{/if}
	{/if}
</section>
