<script lang="ts">
import Icon from "@iconify/svelte";
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
let { apiOrigin, csrf }: { apiOrigin: string; csrf: string } = $props();
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
<section class="panel"><header><div><span>PROFILE</span><h2>Blog identity</h2></div><p>Used by the public profile card.</p></header><div class="identity"><label class="avatar"><img src={settings.avatar_url} alt="Current avatar"/><b>Replace avatar<input type="file" accept="image/*" onchange={(e)=>{const f=e.currentTarget.files?.[0];if(f)void upload(f)}}/></b></label><div class="fields"><label>Name<input bind:value={settings.name} maxlength="80" required/></label><label>Short introduction<textarea bind:value={settings.bio} maxlength="300" rows="3"></textarea></label><label>Avatar URL<input bind:value={settings.avatar_url} required/></label></div></div></section>
<section class="panel"><header><div><span>ABOUT</span><h2>About article</h2></div><p>Markdown uses the same prose styling as blog articles.</p></header><label>Markdown<textarea class="editor" bind:value={settings.about_markdown} rows="16"></textarea></label><div class="help"><code># Heading</code><code>## Section</code><code>- List item</code><code>[Link](https://...)</code></div></section>
<section class="panel"><header><div><span>BACKGROUNDS</span><h2>Banner sequence</h2></div><button type="button" class="secondary" onclick={addBackground}><Icon icon="material-symbols:add-rounded"/> Add</button></header><div class="list">{#each settings.backgrounds as bg,index (bg.id)}<article><div class="preview">{#if bg.type==="video"}<video src={bg.url} muted autoplay loop playsinline></video>{:else if bg.url}<img src={bg.url} alt=""/>{:else}<Icon icon="material-symbols:image-outline-rounded"/>{/if}<strong>{index+1}</strong></div><div class="fields"><div class="row"><label>Type<select bind:value={bg.type}><option value="image">Image</option><option value="video">Video</option></select></label><label>Position<select bind:value={bg.position}><option value="top">Top</option><option value="center">Center</option><option value="bottom">Bottom</option></select></label></div><label>Media URL<input bind:value={bg.url} required/></label><label class="upload">Upload image or video<input type="file" accept="image/*,video/mp4,video/webm" onchange={(e)=>{const f=e.currentTarget.files?.[0];if(f)void upload(f,bg)}}/></label></div><div class="order"><button type="button" title="Move up" disabled={index===0} onclick={()=>move(index,-1)}><Icon icon="material-symbols:arrow-upward-rounded"/></button><button type="button" title="Move down" disabled={index===settings.backgrounds.length-1} onclick={()=>move(index,1)}><Icon icon="material-symbols:arrow-downward-rounded"/></button><button type="button" title="Remove" disabled={settings.backgrounds.length===1} onclick={()=>remove(index)}><Icon icon="material-symbols:delete-outline-rounded"/></button></div></article>{/each}</div></section>
<div class="savebar"><span>Changes appear without rebuilding the blog.</span><button class="primary" disabled={saving}>{saving?"Publishing...":"Publish changes"}</button></div>
</form>{/if}
<style>
form{display:grid;gap:1rem}.panel{border:1px solid #dce5ed;border-radius:8px;background:#fff;padding:1.25rem}.panel>header{display:flex;height:auto;align-items:start;justify-content:space-between;gap:1rem;border:0;padding:0;margin-bottom:1.2rem}.panel h2{margin:.2rem 0;font-size:1.1rem}.panel header span{color:#438fd0;font-size:.68rem;font-weight:800}.panel header p{margin:0;color:#718096;font-size:.82rem}.identity{display:grid;grid-template-columns:10rem 1fr;gap:1.25rem}.avatar{display:grid;align-content:start;gap:.6rem}.avatar img{width:10rem;height:10rem;border-radius:8px;object-fit:cover}.avatar b,.upload{display:grid;min-height:2.75rem;place-items:center;border:1px solid #cfdbe5;border-radius:6px;background:#f8fafc;cursor:pointer}.avatar input,.upload input{display:none}.fields{display:grid;gap:.65rem}label{display:grid;gap:.35rem;color:#526575;font-size:.78rem;font-weight:700}input,textarea,select{box-sizing:border-box;width:100%;min-height:2.75rem;border:1px solid #cfdbe5;border-radius:6px;padding:.65rem .75rem;background:white;font:inherit}textarea{resize:vertical;line-height:1.55}.editor{font-family:"JetBrains Mono",monospace}.help{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.7rem}.help code{border-radius:4px;background:#edf3f8;padding:.25rem .4rem}.list{display:grid;gap:.75rem}.list article{display:grid;grid-template-columns:9rem 1fr auto;gap:1rem;border:1px solid #e1e8ee;border-radius:8px;padding:.8rem}.preview{position:relative;overflow:hidden;aspect-ratio:16/9;border-radius:6px;background:#edf3f8}.preview img,.preview video{width:100%;height:100%;object-fit:cover}.preview strong{position:absolute;top:.3rem;left:.3rem;display:grid;width:1.4rem;height:1.4rem;place-items:center;border-radius:4px;background:#182230;color:#fff}.row{display:grid;grid-template-columns:1fr 1fr;gap:.6rem}.order{display:flex;gap:.3rem}.order button,.secondary{min-width:2.75rem;height:2.75rem;border:1px solid #cfdbe5;border-radius:6px;background:white;color:#526575}.savebar{position:sticky;bottom:0;display:flex;align-items:center;justify-content:space-between;gap:1rem;border:1px solid #d3e0e9;border-radius:8px;background:#fffffff5;padding:.8rem 1rem;box-shadow:0 -8px 30px #1f344812}.primary{min-height:2.75rem;border:0;border-radius:6px;background:#438fd0;color:white;padding:0 1.1rem;font-weight:800}.notice{border:1px solid #bde3cf;border-radius:6px;background:#effaf4;color:#237047;padding:.75rem}.notice.error{border-color:#f0caca;background:#fff1f1;color:#a73333}@media(max-width:768px){.panel>header{flex-direction:column}.identity{grid-template-columns:1fr}.list article{grid-template-columns:1fr}.preview{max-width:18rem}.order{justify-content:flex-end}.savebar{align-items:stretch;flex-direction:column}.primary{width:100%}}@media(max-width:480px){.row{grid-template-columns:1fr}.panel{padding:1rem}.avatar img{width:8rem;height:8rem}}
</style>
