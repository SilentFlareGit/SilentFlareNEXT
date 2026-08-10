<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount, tick } from "svelte";
import ThemeToggle from "../ui/ThemeToggle.svelte";

type PostTag = { id: string; name: string; slug: string };
type Post = {
	id: string;
	uuid: string;
	title: string;
	slug: string;
	status: "draft" | "published" | "scheduled";
	html: string;
	customExcerpt: string;
	featureImage: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	url: string;
	tags: PostTag[];
	authors: { id: string; name: string }[];
};
type Overview = {
	total: number;
	counts: { draft: number; published: number; scheduled: number };
};
type StatusFilter = "all" | "draft" | "published" | "scheduled";

let { apiBase = "/cms-api" } = $props<{ apiBase?: string }>();
let csrf = $state("");
let actor = $state("");
let configured = $state(true);
let checking = $state(true);
let loading = $state(false);
let saving = $state(false);
let navOpen = $state(false);
let statusFilter = $state<StatusFilter>("all");
let query = $state("");
let posts = $state<Post[]>([]);
let selected = $state<Post | null>(null);
let overview = $state<Overview>({
	total: 0,
	counts: { draft: 0, published: 0, scheduled: 0 },
});
let availableTags = $state<PostTag[]>([]);
let title = $state("");
let slug = $state("");
let excerpt = $state("");
let featureImage = $state("");
let tagsText = $state("");
let editorHtml = $state("");
let editorMode = $state<"write" | "preview">("write");
let dirty = $state(false);
let error = $state("");
let notice = $state("");
let editorElement: HTMLDivElement | undefined = $state();
let uploadInput: HTMLInputElement | undefined = $state();

const visiblePosts = $derived(
	posts.filter((post) => {
		const needle = query.trim().toLowerCase();
		return (
			!needle || `${post.title} ${post.slug}`.toLowerCase().includes(needle)
		);
	}),
);

function loginUrl() {
	return `https://auth.silentflare.com/?audience=cms&return_url=${encodeURIComponent(window.location.href)}`;
}

async function api<T>(
	path: string,
	init: RequestInit & { csrf?: boolean } = {},
): Promise<T> {
	const headers = new Headers(init.headers);
	if (init.body && !(init.body instanceof FormData))
		headers.set("content-type", "application/json");
	if (init.csrf && csrf) headers.set("X-CSRF-Token", csrf);
	const response = await fetch(`${apiBase}${path}`, {
		...init,
		credentials: "include",
		headers,
	});
	if (
		response.status === 401 ||
		(path === "/cms/session" && response.status === 403)
	) {
		window.location.replace(loginUrl());
		throw new Error("Owner verification is required");
	}
	const data = (await response.json().catch(() => ({}))) as { detail?: string };
	if (!response.ok) throw new Error(data.detail || "CMS request failed");
	return data as T;
}

function formatDate(value: string) {
	if (!value) return "Not published";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return new Intl.DateTimeFormat("en", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(date);
}

function statusLabel(value: string) {
	if (value === "all") return "All posts";
	return value === "published"
		? "Published"
		: value === "scheduled"
			? "Scheduled"
			: "Draft";
}

function flash(message: string) {
	notice = message;
	window.setTimeout(() => {
		if (notice === message) notice = "";
	}, 3000);
}

async function loadOverview() {
	overview = await api<Overview>("/cms/overview");
}

async function loadTags() {
	const payload = await api<{ tags: PostTag[] }>("/cms/tags");
	availableTags = payload.tags;
}

async function loadPosts(selectId = "") {
	loading = true;
	error = "";
	try {
		const payload = await api<{ items: Post[] }>(
			`/cms/posts?status=${statusFilter}&limit=100`,
		);
		posts = payload.items;
		if (selectId) {
			const match = posts.find((post) => post.id === selectId);
			if (match) await openPost(match);
		}
	} catch (reason) {
		error = reason instanceof Error ? reason.message : "Unable to load posts";
	} finally {
		loading = false;
	}
}

function resetFields(post: Post | null) {
	selected = post;
	title = post?.title ?? "";
	slug = post?.slug ?? "";
	excerpt = post?.customExcerpt ?? "";
	featureImage = post?.featureImage ?? "";
	tagsText = post?.tags.map((tag) => tag.name).join(", ") ?? "";
	editorHtml = post?.html ?? "<p></p>";
	editorMode = "write";
	dirty = false;
	void tick().then(() => {
		if (editorElement) editorElement.innerHTML = editorHtml;
	});
}

async function openPost(post: Post) {
	if (dirty && !window.confirm("Discard unsaved changes?")) return;
	error = "";
	try {
		const payload = await api<{ post: Post }>(`/cms/posts/${post.id}`);
		resetFields(payload.post);
	} catch (reason) {
		error =
			reason instanceof Error ? reason.message : "Unable to open the post";
	}
}

function newPost() {
	if (dirty && !window.confirm("Discard unsaved changes?")) return;
	resetFields(null);
	title = "Untitled";
	dirty = true;
	void tick().then(() => editorElement?.focus());
}

function markDirty() {
	dirty = true;
}

function syncEditor() {
	if (editorElement) editorHtml = editorElement.innerHTML;
	markDirty();
}

function postPayload(status: "draft" | "published") {
	if (editorElement) editorHtml = editorElement.innerHTML;
	return {
		title,
		slug,
		html: editorHtml,
		custom_excerpt: excerpt,
		feature_image: featureImage,
		tags: tagsText
			.split(",")
			.map((tag) => tag.trim())
			.filter(Boolean),
		status,
		updated_at: selected?.updatedAt ?? "",
	};
}

async function save(
	status: "draft" | "published" = selected?.status === "published"
		? "published"
		: "draft",
) {
	if (saving) return;
	saving = true;
	error = "";
	try {
		const path = selected ? `/cms/posts/${selected.id}` : "/cms/posts";
		const result = await api<{ post: Post }>(path, {
			method: selected ? "PUT" : "POST",
			body: JSON.stringify(postPayload(status)),
			csrf: true,
		});
		resetFields(result.post);
		await Promise.all([loadOverview(), loadPosts()]);
		flash(status === "published" ? "Post published." : "Draft saved.");
	} catch (reason) {
		error =
			reason instanceof Error ? reason.message : "Unable to save the post";
	} finally {
		saving = false;
	}
}

async function removePost() {
	if (
		!selected ||
		saving ||
		!window.confirm(`Delete "${selected.title}"? This cannot be undone.`)
	)
		return;
	saving = true;
	error = "";
	try {
		await api(`/cms/posts/${selected.id}`, { method: "DELETE", csrf: true });
		resetFields(null);
		await Promise.all([loadOverview(), loadPosts()]);
		flash("Post deleted.");
	} catch (reason) {
		error =
			reason instanceof Error ? reason.message : "Unable to delete the post";
	} finally {
		saving = false;
	}
}

function runCommand(command: string, value?: string) {
	if (!editorElement) return;
	editorElement.focus();
	document.execCommand(command, false, value);
	syncEditor();
}

function addLink() {
	const value = window.prompt("Link URL", "https://");
	if (value?.startsWith("http://") || value?.startsWith("https://"))
		runCommand("createLink", value);
}

async function uploadImage(file: File) {
	const form = new FormData();
	form.set("file", file);
	saving = true;
	error = "";
	try {
		const payload = await api<{ image: { url: string } }>("/cms/images", {
			method: "POST",
			body: form,
			csrf: true,
		});
		if (!featureImage) featureImage = payload.image.url;
		if (editorMode === "write") runCommand("insertImage", payload.image.url);
		markDirty();
		flash("Image uploaded and inserted.");
	} catch (reason) {
		error =
			reason instanceof Error ? reason.message : "Unable to upload the image";
	} finally {
		saving = false;
		if (uploadInput) uploadInput.value = "";
	}
}

async function logout() {
	try {
		await api("/auth/logout", { method: "POST", csrf: true });
	} catch {
		// Redirect even if the session already expired.
	}
	window.location.replace(loginUrl());
}

async function bootstrap() {
	try {
		const session = await api<{
			actor: string;
			csrf: string;
			configured: boolean;
		}>("/cms/session");
		csrf = session.csrf;
		actor = session.actor;
		configured = session.configured;
		if (!configured) {
			error = "CMS publishing is not configured on the server.";
			return;
		}
		await Promise.all([loadOverview(), loadTags(), loadPosts()]);
	} catch (reason) {
		error = reason instanceof Error ? reason.message : "Unable to open CMS";
	} finally {
		checking = false;
	}
}

onMount(() => {
	void bootstrap();
	const saveShortcut = (event: KeyboardEvent) => {
		if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
			event.preventDefault();
			void save();
		}
	};
	window.addEventListener("keydown", saveShortcut);
	return () => window.removeEventListener("keydown", saveShortcut);
});
</script>

{#if checking}
	<div class="cms-check"><span></span><p>Opening the publishing workspace...</p></div>
{:else}
	<div class="cms-stage">
		<div class="cms-frame" class:editor-active={selected !== null || dirty}>
			{#if navOpen}<button class="nav-backdrop" aria-label="Close navigation" onclick={() => (navOpen = false)}></button>{/if}
			<aside class:open={navOpen} class="cms-nav">
				<div class="brand-row">
					<a href="https://blog.silentflare.com/" class="brand"><span>S</span><strong>SilentFlare <b>CMS</b></strong></a>
					<div class="brand-actions">
						<ThemeToggle />
						<button class="icon-command close-nav" aria-label="Close navigation" title="Close" onclick={() => (navOpen = false)}><Icon icon="material-symbols:close-rounded" /></button>
					</div>
				</div>
				<nav aria-label="Publishing sections">
					<p>Content</p>
					<button class:active={statusFilter === "all"} onclick={() => { statusFilter = "all"; navOpen = false; void loadPosts(); }}><Icon icon="material-symbols:article-outline-rounded" /><span>All posts</span><i>{overview.total}</i></button>
					<button class:active={statusFilter === "draft"} onclick={() => { statusFilter = "draft"; navOpen = false; void loadPosts(); }}><Icon icon="material-symbols:edit-note-outline-rounded" /><span>Drafts</span><i>{overview.counts.draft}</i></button>
					<button class:active={statusFilter === "published"} onclick={() => { statusFilter = "published"; navOpen = false; void loadPosts(); }}><Icon icon="material-symbols:language-rounded" /><span>Published</span><i>{overview.counts.published}</i></button>
					<button class:active={statusFilter === "scheduled"} onclick={() => { statusFilter = "scheduled"; navOpen = false; void loadPosts(); }}><Icon icon="material-symbols:schedule-outline-rounded" /><span>Scheduled</span><i>{overview.counts.scheduled}</i></button>
				</nav>
				<div class="nav-footer">
					<div><span></span><p><strong>Ghost content service</strong><small>{configured ? "Connected through CMS API" : "Not configured"}</small></p></div>
					<button class="sign-out" onclick={logout}><Icon icon="material-symbols:logout-rounded" />Sign out</button>
				</div>
			</aside>

			<section class="post-index">
				<header>
					<button class="icon-command menu-command" aria-label="Open navigation" title="Menu" onclick={() => (navOpen = true)}><Icon icon="material-symbols:menu-rounded" /></button>
					<div><p>CONTENT</p><h1>{statusLabel(statusFilter)}</h1></div>
					<button class="new-command" onclick={newPost}><Icon icon="material-symbols:add-rounded" /><span>New post</span></button>
				</header>
				<div class="index-tools">
					<label><Icon icon="material-symbols:search-rounded" /><input bind:value={query} placeholder="Search posts" aria-label="Search posts" /></label>
					<button class="icon-command" aria-label="Refresh posts" title="Refresh" onclick={() => void Promise.all([loadOverview(), loadPosts()])}><Icon icon="material-symbols:refresh-rounded" /></button>
				</div>
				<div class="post-list" aria-busy={loading}>
					{#if loading}<div class="list-state"><span></span><p>Loading posts...</p></div>
					{:else if visiblePosts.length === 0}<div class="list-state"><Icon icon="material-symbols:article-outline-rounded" /><p>No posts in this view.</p></div>
					{:else}
						{#each visiblePosts as post (post.id)}
							<button class:selected={selected?.id === post.id} class="post-row" onclick={() => void openPost(post)}>
								{#if post.featureImage}<img src={post.featureImage} alt="" />{:else}<span class="post-mark"><Icon icon="material-symbols:article-outline-rounded" /></span>{/if}
								<span class="post-copy"><strong>{post.title || "Untitled"}</strong><small>{formatDate(post.updatedAt)} / {statusLabel(post.status)}</small></span>
								<Icon class="row-arrow" icon="material-symbols:chevron-right-rounded" />
							</button>
						{/each}
					{/if}
				</div>
			</section>

			<main class="editor-pane">
				{#if !selected && !dirty}
					<div class="editor-empty">
						<Icon icon="material-symbols:edit-document-outline-rounded" />
						<h2>Select a post to edit</h2>
						<p>Open existing content or start a new draft.</p>
						<button class="primary-command" onclick={newPost}><Icon icon="material-symbols:add-rounded" />New post</button>
					</div>
				{:else}
					<header class="editor-head">
						<button class="icon-command back-command" aria-label="Back to posts" title="Posts" onclick={() => { if (!dirty || window.confirm("Discard unsaved changes?")) resetFields(null); }}><Icon icon="material-symbols:arrow-back-rounded" /></button>
						<div class="document-state"><span class:published={selected?.status === "published"}></span><p><strong>{selected ? statusLabel(selected.status) : "New draft"}</strong><small>{dirty ? "Unsaved changes" : selected ? `Updated ${formatDate(selected.updatedAt)}` : "Not saved"}</small></p></div>
						<div class="editor-actions">
							{#if selected?.url}<a class="icon-command" href={selected.url} target="_blank" rel="noreferrer" aria-label="View published post" title="View post"><Icon icon="material-symbols:open-in-new-rounded" /></a>{/if}
							<button class="secondary-command" disabled={saving} onclick={() => void save(selected?.status === "published" ? "published" : "draft")}><Icon icon="material-symbols:save-outline-rounded" />Save</button>
				<button class="primary-command" disabled={saving} onclick={() => void save(selected?.status === "published" ? "draft" : "published")}><Icon icon={selected?.status === "published" ? "material-symbols:unpublished-outline-rounded" : "material-symbols:publish-rounded"} />{selected?.status === "published" ? "Unpublish" : "Publish"}</button>
						</div>
					</header>

					<div class="editor-scroll">
						{#if error}<div class="message error" role="alert">{error}</div>{/if}
						{#if notice}<div class="message success" role="status">{notice}</div>{/if}
						<div class="title-fields">
							<input class="title-input" bind:value={title} oninput={markDirty} aria-label="Post title" placeholder="Post title" />
							<label><span>Slug</span><input bind:value={slug} oninput={markDirty} placeholder="generated-from-title" /></label>
						</div>

						<section class="writing-surface">
							<div class="mode-bar">
								<div class="mode-tabs"><button class:active={editorMode === "write"} onclick={() => (editorMode = "write")}>Write</button><button class:active={editorMode === "preview"} onclick={() => { if (editorElement) editorHtml = editorElement.innerHTML; editorMode = "preview"; }}>Preview</button></div>
								<div class="format-tools" aria-label="Formatting tools">
									<button aria-label="Bold" title="Bold" onclick={() => runCommand("bold")}><Icon icon="material-symbols:format-bold-rounded" /></button>
									<button aria-label="Italic" title="Italic" onclick={() => runCommand("italic")}><Icon icon="material-symbols:format-italic-rounded" /></button>
									<button aria-label="Heading" title="Heading" onclick={() => runCommand("formatBlock", "h2")}><Icon icon="material-symbols:format-h2-rounded" /></button>
									<button aria-label="Quote" title="Quote" onclick={() => runCommand("formatBlock", "blockquote")}><Icon icon="material-symbols:format-quote-rounded" /></button>
									<button aria-label="Bulleted list" title="Bulleted list" onclick={() => runCommand("insertUnorderedList")}><Icon icon="material-symbols:format-list-bulleted-rounded" /></button>
									<button aria-label="Add link" title="Link" onclick={addLink}><Icon icon="material-symbols:link-rounded" /></button>
									<button aria-label="Upload image" title="Image" onclick={() => uploadInput?.click()}><Icon icon="material-symbols:image-outline-rounded" /></button>
								</div>
							</div>
							<input class="visually-hidden" bind:this={uploadInput} type="file" accept="image/png,image/jpeg,image/gif,image/webp" onchange={(event) => { const file = event.currentTarget.files?.[0]; if (file) void uploadImage(file); }} />
							{#if editorMode === "write"}
								<div class="rich-editor" bind:this={editorElement} contenteditable="true" role="textbox" aria-multiline="true" aria-label="Post content" oninput={syncEditor}></div>
							{:else}
								<article class="post-preview">{@html editorHtml}</article>
							{/if}
						</section>

						<section class="post-settings">
							<div><label><span>Tags</span><input list="cms-tags" bind:value={tagsText} oninput={markDirty} placeholder="News, Product" /></label><datalist id="cms-tags">{#each availableTags as tag}<option value={tag.name}></option>{/each}</datalist></div>
							<div><label><span>Custom excerpt</span><textarea bind:value={excerpt} oninput={markDirty} maxlength="300" placeholder="Optional summary for cards and search results"></textarea></label><small>{excerpt.length}/300</small></div>
							<div><label><span>Feature image URL</span><input bind:value={featureImage} oninput={markDirty} placeholder="https://cms.silentflare.com/content/images/..." /></label>{#if featureImage}<img class="feature-preview" src={featureImage} alt="Feature preview" />{/if}</div>
						</section>

						{#if selected}<div class="danger-row"><div><strong>Delete post</strong><p>Remove this post permanently from Ghost.</p></div><button class="danger-command" disabled={saving} onclick={() => void removePost()}><Icon icon="material-symbols:delete-outline-rounded" />Delete</button></div>{/if}
					</div>
				{/if}
			</main>
		</div>
	</div>
{/if}

<style>
	:global(body){overflow:hidden}.cms-check{min-height:100svh;display:grid;align-content:center;justify-items:center;gap:1rem;color:var(--sf-text-muted)}.cms-check span,.list-state span{width:2rem;height:2rem;border:2px solid var(--sf-border-strong);border-top-color:var(--sf-accent);border-radius:50%;animation:spin .8s linear infinite}.cms-check p,.list-state p{margin:0}.cms-stage{height:100svh;min-height:0;padding:0;background:var(--sf-page)}.cms-frame{position:relative;width:100%;height:100svh;min-width:0;display:grid;grid-template-columns:minmax(0,1fr);overflow:hidden;background:var(--sf-surface)}
	.cms-nav{position:fixed;z-index:41;inset:0 auto 0 0;width:min(17rem,calc(100vw - 3rem));display:grid;grid-template-rows:auto minmax(0,1fr) auto;border-right:1px solid var(--sf-border);background:var(--sf-surface-subtle);transform:translateX(-102%);transition:transform 180ms ease}.cms-nav.open{transform:translateX(0)}.nav-backdrop{position:fixed;z-index:40;inset:0;border:0;border-radius:0;background:rgb(24 34 48 / 38%)}.brand-row{min-height:4.75rem;display:flex;align-items:center;justify-content:space-between;gap:.75rem;border-bottom:1px solid var(--sf-border);padding:1rem}.brand{min-width:0;display:flex;align-items:center;gap:.7rem;color:var(--sf-text);text-decoration:none}.brand>span{width:2.25rem;height:2.25rem;display:grid;flex:none;place-items:center;border-radius:var(--sf-radius-md);background:var(--sf-accent);color:#fff;font-weight:800}.brand strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.brand b{color:var(--sf-text-muted);font-weight:600}.brand-actions{display:flex;flex:none;align-items:center;gap:.4rem}.icon-command{width:var(--sf-control-height);height:var(--sf-control-height);min-width:var(--sf-control-height);min-height:var(--sf-control-height);display:inline-grid;place-items:center;border:1px solid var(--sf-border-strong);border-radius:var(--sf-radius-md);padding:0;background:var(--sf-surface);color:var(--sf-text-muted);text-decoration:none;cursor:pointer}.icon-command:hover{background:var(--sf-surface-muted);color:var(--sf-accent-strong)}.cms-nav nav{min-height:0;overflow:auto;padding:.9rem .75rem}.cms-nav nav>p{margin:.5rem .75rem;color:var(--sf-text-soft);font-size:.72rem;font-weight:800;text-transform:uppercase}.cms-nav nav button{width:100%;min-height:2.8rem;display:grid;grid-template-columns:1.25rem minmax(0,1fr) auto;align-items:center;gap:.65rem;border:0;border-radius:var(--sf-radius-md);padding:0 .75rem;background:transparent;color:var(--sf-text-muted);font-weight:700;text-align:left;cursor:pointer}.cms-nav nav button:hover{background:var(--sf-surface-muted);color:var(--sf-text)}.cms-nav nav button.active{background:var(--sf-accent-soft);color:var(--sf-accent-strong)}.cms-nav nav button i{min-width:1.75rem;border-radius:999px;padding:.15rem .4rem;background:var(--sf-surface);font-size:.7rem;font-style:normal;text-align:center}.nav-footer{border-top:1px solid var(--sf-border);padding:.75rem}.nav-footer>div{display:flex;gap:.65rem;padding:.65rem .75rem}.nav-footer>div>span{width:.55rem;height:.55rem;flex:none;margin-top:.25rem;border-radius:50%;background:var(--sf-success)}.nav-footer p{margin:0}.nav-footer strong,.nav-footer small{display:block}.nav-footer strong{font-size:.82rem}.nav-footer small{margin-top:.2rem;color:var(--sf-text-soft);font-size:.72rem}.sign-out{width:100%;min-height:2.75rem;display:flex;align-items:center;gap:.65rem;border:0;border-radius:var(--sf-radius-md);padding:0 .75rem;background:transparent;color:var(--sf-danger);font-weight:800;cursor:pointer}.sign-out:hover{background:var(--sf-danger-soft)}
	.post-index{min-width:0;min-height:0;display:grid;grid-template-rows:auto auto minmax(0,1fr);border-right:1px solid var(--sf-border);background:var(--sf-surface)}.post-index>header{min-height:4.75rem;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:.75rem;border-bottom:1px solid var(--sf-border);padding:.75rem 1rem}.post-index header p{margin:0;color:var(--sf-accent-strong);font-size:.7rem;font-weight:800}.post-index header h1{margin:.15rem 0 0;color:var(--sf-text);font-size:1.25rem}.new-command,.primary-command,.secondary-command,.danger-command{min-height:var(--sf-control-height);display:inline-flex;align-items:center;justify-content:center;gap:.45rem;border-radius:var(--sf-radius-md);padding:0 .85rem;font-weight:800;cursor:pointer}.new-command,.primary-command{border:0;background:var(--sf-accent);color:#fff}.secondary-command{border:1px solid var(--sf-border-strong);background:var(--sf-surface);color:var(--sf-text)}.danger-command{border:1px solid color-mix(in srgb,var(--sf-danger) 30%,var(--sf-border));background:var(--sf-danger-soft);color:var(--sf-danger)}button:disabled{cursor:not-allowed;opacity:.55}.new-command span{display:none}.index-tools{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:.5rem;border-bottom:1px solid var(--sf-border);padding:.75rem 1rem}.index-tools label{height:var(--sf-control-height);display:flex;align-items:center;gap:.5rem;border:1px solid var(--sf-border-strong);border-radius:var(--sf-radius-md);padding:0 .75rem;background:var(--sf-surface);color:var(--sf-text-soft)}.index-tools input{min-width:0;width:100%;border:0;outline:0;background:transparent;color:var(--sf-text)}.post-list{min-height:0;overflow:auto}.post-row{width:100%;min-height:5rem;display:grid;grid-template-columns:2.75rem minmax(0,1fr) auto;align-items:center;gap:.75rem;border:0;border-bottom:1px solid var(--sf-border);padding:.75rem 1rem;background:var(--sf-surface);color:var(--sf-text);text-align:left;cursor:pointer}.post-row:hover{background:var(--sf-surface-subtle)}.post-row.selected{background:var(--sf-accent-soft)}.post-row img,.post-mark{width:2.75rem;height:2.75rem;border-radius:var(--sf-radius-sm);object-fit:cover}.post-mark{display:grid;place-items:center;background:var(--sf-surface-muted);color:var(--sf-text-soft);font-size:1.25rem}.post-copy{min-width:0}.post-copy strong,.post-copy small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.post-copy small{margin-top:.35rem;color:var(--sf-text-muted);font-size:.76rem}.row-arrow{color:var(--sf-text-soft)}.list-state{min-height:16rem;display:grid;align-content:center;justify-items:center;gap:.75rem;color:var(--sf-text-muted);text-align:center}.list-state>svg{font-size:2rem;color:var(--sf-text-soft)}
	.editor-pane{display:none;min-width:0;min-height:0;grid-template-rows:auto minmax(0,1fr);background:var(--sf-page)}.cms-frame.editor-active .post-index{display:none}.cms-frame.editor-active .editor-pane{display:grid}.editor-empty{display:grid;align-content:center;justify-items:center;min-height:100%;padding:2rem;color:var(--sf-text-muted);text-align:center}.editor-empty>svg{font-size:3rem;color:var(--sf-text-soft)}.editor-empty h2{margin:1rem 0 .25rem;color:var(--sf-text)}.editor-empty p{margin:0 0 1.25rem}.editor-head{min-height:4.75rem;display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:.75rem;border-bottom:1px solid var(--sf-border);padding:.75rem 1rem;background:var(--sf-surface)}.document-state{min-width:0;display:flex;align-items:center;gap:.65rem}.document-state>span{width:.6rem;height:.6rem;flex:none;border-radius:50%;background:var(--sf-warning)}.document-state>span.published{background:var(--sf-success)}.document-state p{min-width:0;margin:0}.document-state strong,.document-state small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.document-state small{margin-top:.2rem;color:var(--sf-text-muted);font-size:.75rem}.editor-actions{grid-column:1/-1;display:grid;grid-template-columns:auto minmax(0,1fr) minmax(0,1fr);gap:.5rem}.editor-actions .secondary-command,.editor-actions .primary-command{width:100%}.editor-scroll{min-width:0;min-height:0;overflow:auto;padding:1rem}.message{margin-bottom:1rem;border:1px solid var(--sf-border);border-radius:var(--sf-radius-md);padding:.8rem 1rem;font-size:.88rem}.message.error{border-color:color-mix(in srgb,var(--sf-danger) 30%,var(--sf-border));background:var(--sf-danger-soft);color:var(--sf-danger)}.message.success{border-color:color-mix(in srgb,var(--sf-success) 30%,var(--sf-border));background:var(--sf-success-soft);color:var(--sf-success)}.title-fields{display:grid;gap:.75rem;margin-bottom:1rem}.title-input{width:100%;border:0;border-bottom:1px solid var(--sf-border-strong);padding:.45rem 0 .7rem;outline:0;background:transparent;color:var(--sf-text);font-size:1.75rem;font-weight:700}.title-fields label span,.post-settings label span{display:block;margin-bottom:.4rem;color:var(--sf-text-muted);font-size:.76rem;font-weight:800}.title-fields label input,.post-settings input,.post-settings textarea{width:100%;min-height:var(--sf-control-height);border:1px solid var(--sf-border-strong);border-radius:var(--sf-radius-md);padding:.65rem .75rem;background:var(--sf-surface);color:var(--sf-text)}
	.writing-surface{overflow:hidden;border:1px solid var(--sf-border);border-radius:var(--sf-radius-md);background:var(--sf-surface)}.mode-bar{display:flex;align-items:center;justify-content:space-between;gap:.5rem;border-bottom:1px solid var(--sf-border);padding:.4rem;overflow:auto}.mode-tabs{display:flex}.mode-tabs button,.format-tools button{min-width:2.75rem;min-height:2.75rem;border:0;border-radius:var(--sf-radius-sm);background:transparent;color:var(--sf-text-muted);cursor:pointer}.mode-tabs button{padding:0 .75rem;font-size:.8rem;font-weight:800}.mode-tabs button.active{background:var(--sf-accent-soft);color:var(--sf-accent-strong)}.format-tools{display:flex;margin-left:auto}.format-tools button:hover{background:var(--sf-surface-muted);color:var(--sf-text)}.rich-editor,.post-preview{min-height:24rem;padding:1.25rem;color:var(--sf-text);font-size:1rem;line-height:1.7;outline:0}.rich-editor:focus{box-shadow:inset 0 0 0 2px color-mix(in srgb,var(--sf-accent) 45%,transparent)}.rich-editor :global(img),.post-preview :global(img){max-width:100%;height:auto}.rich-editor :global(blockquote),.post-preview :global(blockquote){margin:1rem 0;border-left:3px solid var(--sf-accent);padding-left:1rem;color:var(--sf-text-muted)}.post-settings{display:grid;gap:1rem;margin-top:1rem}.post-settings>div{position:relative;border-bottom:1px solid var(--sf-border);padding:0 0 1rem}.post-settings textarea{min-height:6rem;resize:vertical}.post-settings>div>small{position:absolute;right:.5rem;bottom:1.4rem;color:var(--sf-text-soft);font-size:.72rem}.feature-preview{display:block;width:100%;max-height:16rem;margin-top:.75rem;border-radius:var(--sf-radius-md);object-fit:cover}.danger-row{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-top:1rem;border-top:1px solid var(--sf-border);padding:1.25rem 0}.danger-row p{margin:.3rem 0 0;color:var(--sf-text-muted);font-size:.84rem}.visually-hidden{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important}
	@keyframes spin{to{transform:rotate(360deg)}}
	@media(min-width:640px){.new-command span{display:inline}.editor-head{grid-template-columns:auto minmax(0,1fr) auto}.editor-actions{grid-column:auto;display:flex}.editor-actions .secondary-command,.editor-actions .primary-command{width:auto}.post-settings{grid-template-columns:1fr 1fr}.post-settings>div:last-child{grid-column:1/-1}.editor-scroll{padding:1.5rem}.title-fields{grid-template-columns:minmax(0,1fr) minmax(12rem,18rem);align-items:end}.title-input{font-size:2rem}}
	@media(min-width:768px){.cms-frame{grid-template-columns:19rem minmax(0,1fr)}.post-index{display:grid!important}.editor-pane{display:grid!important}.cms-frame.editor-active .post-index{display:grid}.back-command{display:none}.editor-head{grid-template-columns:minmax(0,1fr) auto}.post-settings{grid-template-columns:repeat(2,minmax(0,1fr))}}
	@media(min-width:1024px){.cms-stage{display:grid;place-items:center;padding:1.5rem}.cms-frame{height:min(60rem,calc(100svh - 3rem));grid-template-columns:15rem 19rem minmax(0,1fr);border:1px solid var(--sf-border-strong);border-radius:var(--sf-radius-lg);box-shadow:var(--sf-shadow-surface)}.cms-nav{position:static;z-index:auto;width:auto;transform:none}.nav-backdrop,.menu-command,.close-nav{display:none}.post-index>header{grid-template-columns:minmax(0,1fr) auto}.editor-scroll{padding:2rem clamp(1.5rem,3vw,3rem)}}
	@media(min-width:1280px){.cms-frame{grid-template-columns:16rem 22rem minmax(0,1fr)}}
	@media(prefers-reduced-motion:reduce){.cms-nav,.cms-check span,.list-state span{animation:none;transition:none}}
</style>
