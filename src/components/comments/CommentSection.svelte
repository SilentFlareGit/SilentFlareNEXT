<script lang="ts">
import Icon from "@iconify/svelte";
import { type CurrentUser, getCurrentUser } from "@lib/client/auth";
import { type CommentRecord, getComments } from "@lib/client/comments";
import { onMount } from "svelte";
import CommentForm from "./CommentForm.svelte";
import CommentList from "./CommentList.svelte";

let { postSlug }: { postSlug: string } = $props();

let user = $state<CurrentUser | null>(null);
let comments = $state<CommentRecord[]>([]);
let loading = $state(true);
let error = $state("");
let accountHref = $state("/accounts/");

async function loadUser() {
	try {
		const result = await getCurrentUser();
		user = result.user;
	} catch {
		user = null;
	}
}

async function loadComments() {
	error = "";
	try {
		const result = await getComments(postSlug);
		comments = result.comments;
	} catch (err) {
		error = err instanceof Error ? err.message : "Could not load comments";
	}
}

async function refresh() {
	loading = true;
	await Promise.all([loadUser(), loadComments()]);
	loading = false;
}

onMount(() => {
	accountHref = `/accounts/?next=${encodeURIComponent(window.location.pathname)}`;
	void refresh();
	const refreshAuth = () => void loadUser();
	document.addEventListener("silentflare-auth-change", refreshAuth);
	return () => {
		document.removeEventListener("silentflare-auth-change", refreshAuth);
	};
});
</script>

<section class="card-base mb-4 px-6 py-6 md:px-9" aria-labelledby="comments-title">
	<div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="text-xs font-bold uppercase tracking-[0.16em] text-30">Discussion</p>
			<h2 id="comments-title" class="mt-1 text-2xl font-bold text-90">Comments</h2>
		</div>
		<button class="btn-plain min-h-11 rounded-lg px-3 font-medium active:scale-95" type="button" onclick={() => void loadComments()}>
			<Icon icon="material-symbols:refresh-rounded" class="mr-2 text-[1.25rem]" />
			Refresh
		</button>
	</div>

	{#if error}
		<p class="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/30 dark:text-red-200">{error}</p>
	{/if}

	{#if loading}
		<div class="space-y-3">
			<div class="h-24 animate-pulse rounded-xl bg-[var(--btn-regular-bg)]"></div>
			<div class="h-20 animate-pulse rounded-xl bg-[var(--btn-regular-bg)]"></div>
		</div>
	{:else}
		<div class="mb-6">
			{#if user}
				<CommentForm {postSlug} onCreated={() => void loadComments()} />
			{:else}
				<div class="rounded-xl border border-dashed border-[var(--line-divider)] bg-black/[0.015] p-4 dark:bg-white/[0.02]">
					<p class="mb-3 text-75">Sign in through the accounts subsite to publish a comment.</p>
					<a class="btn-regular min-h-11 rounded-lg px-4 font-bold active:scale-95" href={accountHref}>
						Accounts login / register
					</a>
				</div>
			{/if}
		</div>

		{#if comments.length > 0}
			<CommentList {comments} currentUser={user} onDeleted={() => void loadComments()} />
		{:else}
			<div class="rounded-xl border border-[var(--line-divider)] px-4 py-8 text-center">
				<p class="font-medium text-75">No comments yet.</p>
				<p class="mt-1 text-sm text-50">Be the first to add a thoughtful note.</p>
			</div>
		{/if}
	{/if}
</section>
