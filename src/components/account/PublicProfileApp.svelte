<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";
import CommentMarkdown from "../comments/CommentMarkdown.svelte";
import ThemeToggle from "../ui/ThemeToggle.svelte";

type PublicProfile = {
	username: string;
	displayName: string;
	avatarUrl: string;
	bio: string;
	displayRegion: string;
	displayRegionCode: string;
	createdAt: string;
	commentsVisible: boolean;
	commentCount: number | null;
};

type PublicComment = {
	id: string;
	postSlug: string;
	content: string;
	createdAt: string;
	updatedAt: string;
};

let {
	apiBase = "/accounts-api",
	username,
}: {
	apiBase?: string;
	username: string;
} = $props();

let loading = $state(true);
let unavailable = $state(false);
let error = $state("");
let profile = $state<PublicProfile | null>(null);
let comments = $state<PublicComment[]>([]);

const profileName = $derived(
	profile?.displayName || profile?.username || username,
);
const profileInitial = $derived(profileName.slice(0, 1).toUpperCase());

function formatDate(value: string) {
	try {
		return new Intl.DateTimeFormat(undefined, {
			year: "numeric",
			month: "short",
			day: "numeric",
		}).format(new Date(value));
	} catch {
		return value;
	}
}

function flagUrl(countryCode: string) {
	const normalized = countryCode.trim().toLowerCase();
	return /^[a-z]{2}$/.test(normalized)
		? `https://flagcdn.com/${normalized}.svg`
		: "";
}

function postHref(comment: PublicComment) {
	return `https://blog.silentflare.com/posts/${encodeURIComponent(comment.postSlug)}/#discussion`;
}

async function loadProfile() {
	loading = true;
	error = "";
	unavailable = false;
	try {
		const response = await fetch(
			`${apiBase}/accounts/public/${encodeURIComponent(username)}`,
			{ headers: { Accept: "application/json" } },
		);
		if (response.status === 404) {
			unavailable = true;
			return;
		}
		const payload = (await response.json().catch(() => ({}))) as {
			detail?: string;
			profile?: PublicProfile;
			comments?: PublicComment[];
		};
		if (!response.ok || !payload.profile) {
			throw new Error(payload.detail || "Could not load this public profile");
		}
		profile = payload.profile;
		comments = payload.comments ?? [];
		document.title = `${payload.profile.displayName || payload.profile.username} (@${payload.profile.username}) | SilentFlare`;
	} catch (loadError) {
		error =
			loadError instanceof Error
				? loadError.message
				: "Could not load this public profile";
	} finally {
		loading = false;
	}
}

onMount(() => void loadProfile());
</script>

<div class="sf-app public-profile-stage">
	<main class="profile-shell">
		<header class="shell-bar">
			<a class="product-link" href="https://blog.silentflare.com/" aria-label="SilentFlare Blog">
				<span aria-hidden="true">S</span>
				<strong>SilentFlare</strong>
			</a>
			<ThemeToggle />
		</header>

		{#if loading}
			<section class="profile-state" aria-live="polite">
				<span class="loading-ring" aria-hidden="true"></span>
				<h1>Loading profile</h1>
				<p>Gathering the public details for @{username}.</p>
			</section>
		{:else if unavailable}
			<section class="profile-state">
				<span class="state-icon"><Icon icon="material-symbols:person-off-outline-rounded" /></span>
				<p class="eyebrow">Public profile</p>
				<h1>Profile unavailable</h1>
				<p>This account does not exist or its owner has chosen not to publish a profile.</p>
				<a class="primary-link" href="https://blog.silentflare.com/"><Icon icon="material-symbols:arrow-back-rounded" />Return to the blog</a>
			</section>
		{:else if error}
			<section class="profile-state" role="alert">
				<span class="state-icon"><Icon icon="material-symbols:cloud-off-outline-rounded" /></span>
				<p class="eyebrow">Public profile</p>
				<h1>Profile could not be loaded</h1>
				<p>{error}</p>
				<button class="primary-link" type="button" onclick={() => void loadProfile()}><Icon icon="material-symbols:refresh-rounded" />Try again</button>
			</section>
		{:else if profile}
			<div class="profile-layout">
				<aside class="profile-summary">
					{#if profile.avatarUrl}
						<img class="profile-avatar" src={profile.avatarUrl} alt={`${profileName}'s avatar`} referrerpolicy="no-referrer" />
					{:else}
						<div class="profile-avatar avatar-fallback" aria-hidden="true">{profileInitial}</div>
					{/if}
					<div class="identity-copy">
						<p class="eyebrow">Public profile</p>
						<h1>{profileName}</h1>
						<p class="username">@{profile.username}</p>
					</div>
					{#if profile.bio}<p class="bio">{profile.bio}</p>{/if}
					<dl class="profile-facts">
						{#if profile.displayRegion}
							<div><dt><Icon icon="material-symbols:location-on-outline-rounded" />IP location</dt><dd class="region-value">{#if flagUrl(profile.displayRegionCode)}<img src={flagUrl(profile.displayRegionCode)} alt="" />{/if}<span>{profile.displayRegion}</span></dd></div>
						{/if}
						<div><dt><Icon icon="material-symbols:calendar-month-outline-rounded" />Member since</dt><dd>{formatDate(profile.createdAt)}</dd></div>
						{#if profile.commentsVisible}
							<div><dt><Icon icon="material-symbols:forum-outline-rounded" />Published comments</dt><dd>{profile.commentCount ?? 0}</dd></div>
						{/if}
					</dl>
					<a class="secondary-link" href="https://blog.silentflare.com/"><Icon icon="material-symbols:arrow-back-rounded" />SilentFlare Blog</a>
				</aside>

				<section class="profile-activity">
					<header class="activity-heading">
						<div><p class="eyebrow">Activity</p><h2>Recent discussion</h2></div>
						{#if profile.commentsVisible}<span>{profile.commentCount ?? 0} total</span>{/if}
					</header>

					{#if !profile.commentsVisible}
						<div class="empty-activity"><Icon icon="material-symbols:visibility-lock-outline-rounded" /><h3>Activity is private</h3><p>This member has chosen not to publish their comment history.</p></div>
					{:else if comments.length === 0}
						<div class="empty-activity"><Icon icon="material-symbols:chat-bubble-outline-rounded" /><h3>No published comments yet</h3><p>When this member joins a public discussion, their recent comments will appear here.</p></div>
					{:else}
						<div class="comment-list">
							{#each comments as comment (comment.id)}
								<article class="comment-card">
									<header><div><p>Comment on</p><strong>{comment.postSlug}</strong></div><time datetime={comment.createdAt}>{formatDate(comment.createdAt)}</time></header>
									<CommentMarkdown content={comment.content} />
									<a href={postHref(comment)}>View discussion<Icon icon="material-symbols:arrow-outward-rounded" /></a>
								</article>
							{/each}
						</div>
					{/if}
				</section>
			</div>
		{/if}
	</main>
	<footer><a href="https://blog.silentflare.com/">SilentFlare</a><span>/</span><a href="https://blog.silentflare.com/rss.xml">RSS</a><span>/</span><a href="https://tos.silentflare.com/">Terms</a></footer>
</div>

<style>
	.public-profile-stage { min-height: 100svh; padding: 0.75rem; background: var(--sf-page); color: var(--sf-text); }
	.profile-shell { width: min(100%, 70rem); min-height: calc(100svh - 5rem); margin: 0 auto; overflow: hidden; border: 1px solid var(--sf-border-strong); border-radius: var(--sf-radius-lg); background: var(--sf-surface); box-shadow: var(--sf-shadow-surface); }
	.shell-bar { min-height: 4.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.75rem 1rem; border-bottom: 1px solid var(--sf-border); }
	.product-link { min-height: 2.75rem; display: inline-flex; align-items: center; gap: 0.75rem; color: var(--sf-text); text-decoration: none; }
	.product-link > span { width: 2.25rem; height: 2.25rem; display: grid; place-items: center; border-radius: var(--sf-radius-sm); background: var(--sf-accent); color: white; font-weight: 800; }
	.product-link strong { font-size: 1rem; }
	.profile-layout { animation: profile-enter 0.22s ease-out; }
	.profile-summary { min-width: 0; display: flex; flex-direction: column; align-items: flex-start; padding: 1.5rem; border-bottom: 1px solid var(--sf-border); background: var(--sf-surface-subtle); }
	.profile-avatar { width: 6rem; height: 6rem; flex: none; border: 3px solid var(--sf-surface); border-radius: 50%; object-fit: cover; box-shadow: 0 0 0 0.3rem var(--sf-accent-soft); }
	.avatar-fallback { display: grid; place-items: center; background: var(--sf-accent); color: white; font-size: 2rem; font-weight: 800; }
	.identity-copy { min-width: 0; margin-top: 1.5rem; }
	.eyebrow { margin: 0 0 0.4rem; color: var(--sf-accent-strong); font-size: 0.75rem; font-weight: 800; text-transform: uppercase; }
	h1, h2, h3, p { overflow-wrap: anywhere; }
	h1 { margin: 0; font-size: 2rem; line-height: 1.15; }
	.username { margin: 0.35rem 0 0; color: var(--sf-text-muted); font-size: 1rem; }
	.bio { margin: 1.25rem 0 0; color: var(--sf-text-muted); line-height: 1.65; }
	.profile-facts { width: 100%; display: grid; gap: 0; margin: 1.5rem 0 0; border-top: 1px solid var(--sf-border); }
	.profile-facts div { min-width: 0; display: grid; gap: 0.3rem; padding: 0.9rem 0; border-bottom: 1px solid var(--sf-border); }
	.profile-facts dt { display: flex; align-items: center; gap: 0.5rem; color: var(--sf-text-soft); font-size: 0.75rem; font-weight: 800; text-transform: uppercase; }
	.profile-facts dt :global(svg) { color: var(--sf-accent-strong); font-size: 1.1rem; }
	.profile-facts dd { margin: 0; color: var(--sf-text); font-weight: 700; line-height: 1.45; }
	.profile-facts .region-value { display: flex; align-items: center; gap: 0.55rem; }
	.profile-facts .region-value img { width: 1.4rem; height: 1rem; flex: none; border-radius: 2px; object-fit: cover; box-shadow: 0 0 0 1px var(--sf-border); }
	.secondary-link, .primary-link { min-height: 2.75rem; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; border-radius: var(--sf-radius-md); padding: 0 1rem; font-weight: 800; text-decoration: none; }
	.secondary-link { margin-top: 1.5rem; border: 1px solid var(--sf-border-strong); color: var(--sf-text); background: var(--sf-surface); }
	.profile-activity { min-width: 0; padding: 1.5rem; }
	.activity-heading { display: flex; align-items: end; justify-content: space-between; gap: 1rem; margin-bottom: 1.25rem; }
	.activity-heading h2 { margin: 0; font-size: 1.5rem; }
	.activity-heading > span { flex: none; color: var(--sf-text-soft); font-size: 0.8rem; font-weight: 700; }
	.comment-list { display: grid; gap: 0.75rem; }
	.comment-card { min-width: 0; padding: 1rem; border: 1px solid var(--sf-border); border-radius: var(--sf-radius-md); background: var(--sf-surface-subtle); }
	.comment-card header { display: flex; align-items: start; justify-content: space-between; gap: 1rem; margin-bottom: 0.85rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--sf-border); }
	.comment-card header p { margin: 0 0 0.2rem; color: var(--sf-text-soft); font-size: 0.72rem; font-weight: 800; text-transform: uppercase; }
	.comment-card header strong { display: block; color: var(--sf-text); }
	.comment-card time { flex: none; color: var(--sf-text-soft); font-size: 0.78rem; }
	.comment-card > a { min-height: 2.75rem; display: inline-flex; align-items: center; gap: 0.4rem; margin-top: 0.75rem; color: var(--sf-accent-strong); font-size: 0.875rem; font-weight: 800; text-decoration: none; }
	.empty-activity, .profile-state { min-height: 24rem; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem 1.25rem; text-align: center; }
	.empty-activity :global(svg), .state-icon { width: 3rem; height: 3rem; display: grid; place-items: center; margin-bottom: 1rem; border-radius: 50%; background: var(--sf-accent-soft); color: var(--sf-accent-strong); font-size: 1.5rem; }
	.empty-activity h3, .profile-state h1 { margin: 0; }
	.empty-activity p, .profile-state > p:not(.eyebrow) { max-width: 30rem; margin: 0.6rem 0 0; color: var(--sf-text-muted); line-height: 1.6; }
	.primary-link { margin-top: 1.25rem; border: 0; background: var(--sf-accent); color: white; cursor: pointer; }
	.loading-ring { width: 2rem; height: 2rem; margin-bottom: 1rem; border: 2px solid var(--sf-border); border-top-color: var(--sf-accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
	footer { min-height: 3.5rem; display: flex; align-items: center; justify-content: center; gap: 0.6rem; color: var(--sf-text-soft); font-size: 0.8rem; }
	footer a { color: inherit; text-decoration: none; }
	@media (min-width: 768px) { .public-profile-stage { padding: 1.5rem; } .shell-bar { padding: 0.75rem 1.5rem; } .profile-summary, .profile-activity { padding: 2rem; } .comment-card { padding: 1.25rem; } }
	@media (min-width: 960px) { .profile-layout { min-height: calc(100svh - 9.5rem); display: grid; grid-template-columns: minmax(17rem, 20rem) minmax(0, 1fr); } .profile-summary { border-right: 1px solid var(--sf-border); border-bottom: 0; } .profile-activity { padding: 2.5rem; } }
	@media (max-width: 520px) { .profile-summary, .profile-activity { padding: 1.25rem; } .comment-card header { align-items: flex-start; flex-direction: column; gap: 0.35rem; } .comment-card time { white-space: normal; } }
	@keyframes profile-enter { from { opacity: 0; transform: translateY(0.45rem); } to { opacity: 1; transform: translateY(0); } }
	@keyframes spin { to { transform: rotate(360deg); } }
	@media (prefers-reduced-motion: reduce) { .profile-layout, .loading-ring { animation: none; } }
</style>
