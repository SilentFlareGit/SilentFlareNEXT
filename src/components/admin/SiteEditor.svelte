<script lang="ts">
import Icon from "@iconify/svelte";
import MarkdownIt from "markdown-it";
import { onMount } from "svelte";

type Background = {
	id: string;
	type: "image" | "video";
	url: string;
	position: string;
	credit_text: string;
	credit_url: string;
};
type Settings = {
	name: string;
	bio: string;
	avatar_url: string;
	about_markdown: string;
	backgrounds: Background[];
};
let {
	apiOrigin,
	csrf,
	fallbackAssets,
}: {
	apiOrigin: string;
	csrf: string;
	fallbackAssets: { avatar: string; banner: string };
} = $props();
const markdown = new MarkdownIt({
	html: false,
	linkify: true,
	typographer: true,
});
let settings = $state<Settings>({
	name: "",
	bio: "",
	avatar_url: "",
	about_markdown: "",
	backgrounds: [],
});
let loading = $state(true);
let saving = $state(false);
let message = $state("");
let isError = $state(false);
let activePreview = $state<"profile" | "about" | "banner">("profile");
const aboutPreview = $derived(markdown.render(settings.about_markdown));
const avatarPreview = $derived(
	settings.avatar_url.startsWith("/assets/images/")
		? fallbackAssets.avatar
		: settings.avatar_url,
);
const backgroundPreview = $derived(
	settings.backgrounds.map((background) => ({
		...background,
		url: background.url.startsWith("/assets/images/")
			? fallbackAssets.banner
			: background.url,
	})),
);
async function request(path: string, init: RequestInit = {}) {
	const response = await fetch(`${apiOrigin}${path}`, {
		...init,
		credentials: "include",
		headers: {
			Accept: "application/json",
			"X-CSRF-Token": csrf,
			...(init.headers ?? {}),
		},
	});
	const body = await response.json().catch(() => ({}));
	if (!response.ok) throw new Error(body.detail ?? `API ${response.status}`);
	return body;
}
async function load() {
	loading = true;
	try {
		settings = (await request("/admin/site-settings")).settings;
		if (settings.avatar_url.startsWith("/assets/images/")) {
			settings.avatar_url = fallbackAssets.avatar;
		}
		settings.backgrounds = settings.backgrounds.map((background) => ({
			...background,
			url: background.url.startsWith("/assets/images/")
				? fallbackAssets.banner
				: background.url,
		}));
	} catch (e) {
		fail(e);
	} finally {
		loading = false;
	}
}
function fail(e: unknown) {
	isError = true;
	message = e instanceof Error ? e.message : "Request failed.";
}
function addBackground() {
	settings.backgrounds = [
		...settings.backgrounds,
		{
			id: crypto.randomUUID(),
			type: "image",
			url: "",
			position: "center",
			credit_text: "",
			credit_url: "",
		},
	];
}
function move(index: number, offset: number) {
	const target = index + offset;
	if (target < 0 || target >= settings.backgrounds.length) return;
	const next = [...settings.backgrounds];
	[next[index], next[target]] = [next[target], next[index]];
	settings.backgrounds = next;
}
function remove(index: number) {
	settings.backgrounds = settings.backgrounds.filter((_, i) => i !== index);
}
async function upload(file: File, background?: Background) {
	try {
		const body = await request("/admin/site-assets", {
			method: "POST",
			headers: { "Content-Type": file.type },
			body: file,
		});
		if (background) {
			background.url = body.url;
			background.type = body.type;
			settings.backgrounds = [...settings.backgrounds];
		} else settings.avatar_url = body.url;
		isError = false;
		message = "Upload ready. Publish to apply.";
	} catch (e) {
		fail(e);
	}
}
async function save() {
	saving = true;
	message = "";
	try {
		const body = await request("/admin/site-settings", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(settings),
		});
		settings = body.settings;
		isError = false;
		message = "Blog appearance published.";
	} catch (e) {
		fail(e);
	} finally {
		saving = false;
	}
}
onMount(() => void load());
</script>
{#if loading}<p>Loading site appearance...</p>{:else}
<form onsubmit={(e)=>{e.preventDefault();void save()}}>
{#if message}<div class:error={isError} class="notice">{message}</div>{/if}
<section class="studio-preview">
	<div class="preview-toolbar"><div><span>LIVE PREVIEW</span><strong>Public blog canvas</strong></div><div class="preview-tabs"><button type="button" class:active={activePreview === "profile"} onclick={() => activePreview = "profile"}>Profile</button><button type="button" class:active={activePreview === "about"} onclick={() => activePreview = "about"}>About</button><button type="button" class:active={activePreview === "banner"} onclick={() => activePreview = "banner"}>Banner</button></div></div>
	<div class="preview-canvas">
		{#if activePreview === "profile"}<div class="profile-preview"><img src={avatarPreview} alt="Profile preview"/><h3>{settings.name || "Site name"}</h3><i></i><p>{settings.bio || "Your short introduction appears here."}</p><span><Icon icon="fa6-brands:github"/> GitHub</span></div>
		{:else if activePreview === "about"}<article class="about-preview">{@html aboutPreview}</article>
		{:else}<div class="banner-preview">{#each backgroundPreview as bg,index (bg.id)}{#if index === 0}{#if bg.type === "video"}<video src={bg.url} muted autoplay loop playsinline style:object-position={bg.position}></video>{:else}<img src={bg.url} alt="Banner preview" style:object-position={bg.position}/>{/if}<div class="banner-label"><span>01</span><strong>{backgroundPreview.length} scene{backgroundPreview.length === 1 ? "" : "s"} in sequence</strong></div>{/if}{/each}</div>{/if}
	</div>
</section>
<section class="panel"><header><div><span>PROFILE</span><h2>Blog identity</h2></div><p>Used by the public profile card.</p></header><div class="identity"><label class="avatar"><img src={settings.avatar_url} alt="Current avatar"/><b>Replace avatar<input type="file" accept="image/*" onchange={(e)=>{const f=e.currentTarget.files?.[0];if(f)void upload(f)}}/></b></label><div class="fields"><label>Name<input bind:value={settings.name} maxlength="80" required/></label><label>Short introduction<textarea bind:value={settings.bio} maxlength="300" rows="3"></textarea></label><label>Avatar URL<input bind:value={settings.avatar_url} required/></label></div></div></section>
<section class="panel"><header><div><span>ABOUT</span><h2>About article</h2></div><p>Markdown uses the same prose styling as blog articles.</p></header><label>Markdown<textarea class="editor" bind:value={settings.about_markdown} rows="16"></textarea></label><div class="help"><code># Heading</code><code>## Section</code><code>- List item</code><code>[Link](https://...)</code></div></section>
<section class="panel"><header><div><span>BACKGROUNDS</span><h2>Banner sequence</h2></div><button type="button" class="secondary" onclick={addBackground}><Icon icon="material-symbols:add-rounded"/> Add</button></header><div class="list">{#each settings.backgrounds as bg,index (bg.id)}<article><div class="preview">{#if bg.type==="video"}<video src={bg.url} muted autoplay loop playsinline></video>{:else if bg.url}<img src={bg.url} alt=""/>{:else}<Icon icon="material-symbols:image-outline-rounded"/>{/if}<strong>{index+1}</strong></div><div class="fields"><div class="row"><label>Type<select bind:value={bg.type}><option value="image">Image</option><option value="video">Video</option></select></label><label>Position<select bind:value={bg.position}><option value="top">Top</option><option value="center">Center</option><option value="bottom">Bottom</option></select></label></div><label>Media URL<input bind:value={bg.url} required/></label><label class="upload">Upload image or video<input type="file" accept="image/*,video/mp4,video/webm" onchange={(e)=>{const f=e.currentTarget.files?.[0];if(f)void upload(f,bg)}}/></label></div><div class="order"><button type="button" title="Move up" disabled={index===0} onclick={()=>move(index,-1)}><Icon icon="material-symbols:arrow-upward-rounded"/></button><button type="button" title="Move down" disabled={index===settings.backgrounds.length-1} onclick={()=>move(index,1)}><Icon icon="material-symbols:arrow-downward-rounded"/></button><button type="button" title="Remove" disabled={settings.backgrounds.length===1} onclick={()=>remove(index)}><Icon icon="material-symbols:delete-outline-rounded"/></button></div></article>{/each}</div></section>
<div class="savebar"><span>Changes appear without rebuilding the blog.</span><button class="primary" disabled={saving}>{saving?"Publishing...":"Publish changes"}</button></div>
</form>{/if}
<style>
form{display:grid;width:100%;max-width:76rem;gap:1rem}.studio-preview{overflow:hidden;border:1px solid #cbdbe7;border-radius:8px;background:#172637;color:white}.preview-toolbar{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.8rem 1rem;border-bottom:1px solid #ffffff1c}.preview-toolbar>div:first-child{display:grid;gap:.1rem}.preview-toolbar span{color:#87c5f5;font-size:.65rem;font-weight:800}.preview-toolbar strong{font-size:.95rem}.preview-tabs{display:flex;gap:.25rem;padding:.2rem;border-radius:6px;background:#0e1b28}.preview-tabs button{min-height:2.25rem;border:0;border-radius:4px;padding:0 .8rem;background:transparent;color:#9fb3c5;font-weight:700;cursor:pointer}.preview-tabs button.active{background:#fff;color:#244158}.preview-canvas{display:grid;min-height:20rem;place-items:center;padding:1.25rem;background:#dfeaf2}.profile-preview{box-sizing:border-box;width:14rem;padding:1rem;border-radius:8px;background:white;color:#182230;text-align:center;box-shadow:0 18px 40px #16334b20}.profile-preview img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:6px}.profile-preview h3{margin:.7rem 0 .3rem;font-size:1.05rem}.profile-preview i{display:block;width:1.2rem;height:.2rem;margin:0 auto .45rem;border-radius:2px;background:#4b9fe8}.profile-preview p{margin:.4rem 0 .8rem;color:#718096;line-height:1.5}.profile-preview span{display:inline-flex;align-items:center;gap:.35rem;border-radius:5px;background:#e8f3fc;color:#287dbf;padding:.45rem .65rem;font-weight:800}.about-preview{box-sizing:border-box;width:min(42rem,100%);min-height:15rem;border-radius:8px;background:white;color:#233242;padding:1.5rem 1.75rem;box-shadow:0 18px 40px #16334b16}.about-preview :global(h1){margin:0 0 1rem;font-size:1.55rem}.about-preview :global(h2){margin:1.5rem 0 .6rem;font-size:1.15rem}.about-preview :global(p),.about-preview :global(li){color:#526575;line-height:1.7}.about-preview :global(a){color:#368ed2}.banner-preview{position:relative;overflow:hidden;width:100%;aspect-ratio:16/5;border-radius:6px;background:#b9cad6}.banner-preview img,.banner-preview video{width:100%;height:100%;object-fit:cover}.banner-label{position:absolute;left:1rem;bottom:1rem;display:flex;align-items:center;gap:.6rem;border-radius:6px;background:#101a24cc;padding:.5rem .65rem}.banner-label span{display:grid;width:1.6rem;height:1.6rem;place-items:center;border-radius:4px;background:#58a9e8;font-size:.7rem;font-weight:800}.banner-label strong{font-size:.75rem}.panel{border:1px solid var(--sf-border);border-radius:var(--sf-radius-md);background:var(--sf-surface);padding:1.25rem}.panel>header{display:flex;height:auto;align-items:start;justify-content:space-between;gap:1rem;border:0;padding:0;margin-bottom:1.2rem}.panel h2{margin:.2rem 0;font-size:1.1rem}.panel header span{color:var(--sf-accent-strong);font-size:.68rem;font-weight:800}.panel header p{margin:0;color:var(--sf-text-muted);font-size:.82rem}.identity{display:grid;grid-template-columns:10rem 1fr;gap:1.25rem}.avatar{display:grid;align-content:start;gap:.6rem}.avatar img{width:10rem;height:10rem;border-radius:var(--sf-radius-md);object-fit:cover}.avatar b,.upload{display:grid;min-height:var(--sf-control-height);place-items:center;border:1px solid var(--sf-border-strong);border-radius:var(--sf-radius-md);background:var(--sf-surface-subtle);cursor:pointer}.avatar input,.upload input{display:none}.fields{display:grid;gap:.75rem}label{display:grid;gap:.4rem;color:var(--sf-text-muted);font-size:.78rem;font-weight:700}input,textarea,select{box-sizing:border-box;width:100%;min-height:var(--sf-control-height);border:1px solid var(--sf-border-strong);border-radius:var(--sf-radius-md);padding:.7rem .8rem;background:var(--sf-surface);color:var(--sf-text);font:inherit}textarea{resize:vertical;line-height:1.55}.editor{font-family:"JetBrains Mono",monospace}.help{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.7rem}.help code{border-radius:var(--sf-radius-sm);background:var(--sf-surface-muted);padding:.25rem .4rem}.list{display:grid;gap:.75rem}.list article{display:grid;grid-template-columns:9rem 1fr auto;gap:1rem;border:1px solid var(--sf-border);border-radius:var(--sf-radius-md);padding:1rem}.preview{position:relative;overflow:hidden;aspect-ratio:16/9;border-radius:var(--sf-radius-md);background:var(--sf-surface-muted)}.preview img,.preview video{width:100%;height:100%;object-fit:cover}.preview strong{position:absolute;top:.3rem;left:.3rem;display:grid;width:1.4rem;height:1.4rem;place-items:center;border-radius:var(--sf-radius-sm);background:var(--sf-text);color:var(--sf-surface)}.row{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}.order{display:flex;gap:.4rem}.order button,.secondary{min-width:var(--sf-control-height);height:var(--sf-control-height);border:1px solid var(--sf-border-strong);border-radius:var(--sf-radius-md);background:var(--sf-surface);color:var(--sf-text-muted)}.savebar{position:sticky;z-index:3;bottom:0;display:flex;align-items:center;justify-content:space-between;gap:1rem;border:1px solid var(--sf-border-strong);border-radius:var(--sf-radius-md);background:color-mix(in srgb,var(--sf-surface) 95%,transparent);padding:.9rem 1rem;box-shadow:0 -.5rem 1.8rem rgb(31 52 72 / 7%)}.primary{min-height:var(--sf-control-height);border:0;border-radius:var(--sf-radius-md);background:var(--sf-accent);color:white;padding:0 1.1rem;font-weight:800}.notice{border:1px solid color-mix(in srgb,var(--sf-success) 30%,var(--sf-border));border-radius:var(--sf-radius-md);background:var(--sf-success-soft);color:var(--sf-success);padding:.75rem}.notice.error{border-color:color-mix(in srgb,var(--sf-danger) 30%,var(--sf-border));background:var(--sf-danger-soft);color:var(--sf-danger)}@media(max-width:768px){.preview-toolbar{align-items:stretch;flex-direction:column}.preview-tabs{display:grid;grid-template-columns:repeat(3,1fr)}.preview-canvas{min-height:17rem;padding:1rem}.banner-preview{aspect-ratio:16/8}.panel>header{flex-direction:column}.identity{grid-template-columns:1fr}.list article{grid-template-columns:1fr}.preview{max-width:18rem}.order{justify-content:flex-end}.savebar{align-items:stretch;flex-direction:column}.primary{width:100%}}@media(max-width:480px){.row{grid-template-columns:1fr}.panel{padding:1rem}.avatar img{width:8rem;height:8rem}.about-preview{padding:1rem}.preview-tabs button{padding:0 .35rem}}
</style>
