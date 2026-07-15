<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";
import ShieldEntityExplorer from "./ShieldEntityExplorer.svelte";

type Factor = {
	key: string;
	label: string;
	category: string;
	subjectTypes: string[];
	weight: number;
	defaultWeight: number;
};
type FactorResponse = {
	factors: Factor[];
	currentVersion: number;
	versions: Array<{
		version: number;
		createdAt: number;
		createdBy: string;
		note: string;
	}>;
};
type Site = {
	host: string;
	enabled: boolean;
	connected: boolean;
	mode: string;
	updatedAt: number;
	updatedBy: string;
};

let { csrf }: { csrf: string } = $props();
let activeView = $state<"subjects" | "factors" | "sites">("subjects");
let factors = $state<Factor[]>([]);
let sites = $state<Site[]>([]);
let version = $state(0);
let loading = $state(false);
let saving = $state(false);
let error = $state("");
let success = $state("");
let factorReason = $state("");
let pendingSite = $state<Site | null>(null);
let siteReason = $state("");
const categories = ["Network", "Behavior", "Account", "Policy"];
const changedFactors = $derived(
	factors.filter((factor) => factor.weight !== factor.defaultWeight).length,
);

async function api<T>(path: string, init: RequestInit = {}) {
	const response = await fetch(`/__shield/api/admin${path}`, {
		...init,
		credentials: "include",
		headers: {
			Accept: "application/json",
			...(init.body ? { "Content-Type": "application/json" } : {}),
			...(init.method && init.method !== "GET" ? { "X-CSRF-Token": csrf } : {}),
		},
	});
	const body = (await response.json().catch(() => ({}))) as { detail?: string };
	if (!response.ok)
		throw new Error(body.detail ?? `Shield API ${response.status}`);
	return body as T;
}

async function loadFactors() {
	loading = true;
	try {
		const response = await api<FactorResponse>("/risk-factors");
		factors = response.factors;
		version = response.currentVersion;
		error = "";
	} catch (cause) {
		error =
			cause instanceof Error
				? cause.message
				: "Risk factors could not be loaded";
	} finally {
		loading = false;
	}
}

async function loadSites() {
	loading = true;
	try {
		const response = await api<{ sites: Site[] }>("/sites");
		sites = response.sites;
		error = "";
	} catch (cause) {
		error =
			cause instanceof Error
				? cause.message
				: "Protected sites could not be loaded";
	} finally {
		loading = false;
	}
}

async function selectView(view: "subjects" | "factors" | "sites") {
	activeView = view;
	if (view === "factors" && factors.length === 0) await loadFactors();
	if (view === "sites" && sites.length === 0) await loadSites();
}

async function refresh() {
	if (activeView === "factors") await loadFactors();
	if (activeView === "sites") await loadSites();
}

function showSuccess(message: string) {
	success = message;
	window.setTimeout(() => {
		success = "";
	}, 3000);
}

async function saveFactors() {
	if (!factorReason.trim()) return;
	saving = true;
	try {
		const response = await api<FactorResponse>("/risk-factors", {
			method: "PUT",
			body: JSON.stringify({
				weights: Object.fromEntries(
					factors.map((factor) => [factor.key, Number(factor.weight)]),
				),
				reason: factorReason.trim(),
			}),
		});
		factors = response.factors;
		version = response.currentVersion;
		factorReason = "";
		error = "";
		showSuccess(`Risk factor version ${version} published.`);
	} catch (cause) {
		error =
			cause instanceof Error
				? cause.message
				: "Risk factors could not be saved";
	} finally {
		saving = false;
	}
}

function restoreDefaults() {
	factors = factors.map((factor) => ({
		...factor,
		weight: factor.defaultWeight,
	}));
}

function requestSiteChange(site: Site) {
	pendingSite = site;
	siteReason = "";
}

async function saveSite() {
	if (!pendingSite || !siteReason.trim()) return;
	saving = true;
	const enabling = !pendingSite.enabled;
	const host = pendingSite.host;
	try {
		await api(`/sites/${encodeURIComponent(host)}`, {
			method: "PUT",
			body: JSON.stringify({ enabled: enabling, reason: siteReason.trim() }),
		});
		pendingSite = null;
		siteReason = "";
		await loadSites();
		showSuccess(
			`${enabling ? "Protection enabled for" : "Protection disabled for"} ${host}.`,
		);
	} catch (cause) {
		error =
			cause instanceof Error
				? cause.message
				: "Site protection could not be changed";
	} finally {
		saving = false;
	}
}

function formatTime(timestamp?: number) {
	if (!timestamp) return "Never";
	return new Intl.DateTimeFormat(undefined, {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	}).format(timestamp * 1000);
}

onMount(() => {
	Promise.all([loadFactors(), loadSites()]);
});
</script>

<div class="shield-shell">
	<header class="shell-header">
		<div>
			<span class="product-label">SilentFlare Shield</span>
			<h1>Security</h1>
		</div>
		<div class="header-status">
			{#if activeView !== "subjects"}
				<button class="icon-button" title="Refresh workspace" aria-label="Refresh workspace" onclick={refresh} disabled={loading}>
					<Icon icon="material-symbols:refresh-rounded" />
				</button>
			{/if}
		</div>
	</header>

	<nav class="workspace-tabs" aria-label="Shield workspaces">
		<button class:active={activeView === "subjects"} onclick={() => selectView("subjects")}>
			<Icon icon="material-symbols:person-search-outline-rounded" />
			<span>Subjects</span>
		</button>
		<button class:active={activeView === "factors"} onclick={() => selectView("factors")}>
			<Icon icon="material-symbols:tune-rounded" />
			<span>Risk factors</span>
		</button>
		<button class:active={activeView === "sites"} onclick={() => selectView("sites")}>
			<Icon icon="material-symbols:domain-verification-outline-rounded" />
			<span>Sites</span>
		</button>
	</nav>

	{#if error}<div class="notice error" role="alert"><Icon icon="material-symbols:error-outline-rounded" />{error}</div>{/if}
	{#if success}<div class="notice success" role="status"><Icon icon="material-symbols:check-circle-outline-rounded" />{success}</div>{/if}

	{#if activeView === "subjects"}
		<ShieldEntityExplorer {csrf} />
	{:else if activeView === "factors"}
		<section class="workspace factors-workspace">
			<header class="workspace-header">
				<div><h2>Risk factors</h2><p>Version {version || "default"}</p></div>
				<button class="secondary icon-command" onclick={restoreDefaults} disabled={loading || saving}>
					<Icon icon="material-symbols:restart-alt-rounded" />
					<span>Defaults</span>
				</button>
			</header>
			{#if loading && factors.length === 0}
				<div class="empty">Loading risk factors...</div>
			{:else}
				<form
					onsubmit={(event) => {
						event.preventDefault();
						saveFactors();
					}}
				>
					{#each categories as category}
						<section class="factor-group">
							<h3>{category}</h3>
							<div class="factor-columns" aria-hidden="true"><span>Factor</span><span>Subjects</span><span>Weight</span></div>
							{#each factors.filter((factor) => factor.category === category) as factor (factor.key)}
								<div class="factor-row">
									<div><strong>{factor.label}</strong><small>{factor.key.replaceAll("_", " ")}</small></div>
									<span class="subject-types">{factor.subjectTypes.join(" / ")}</span>
									<label>
										<span>Weight</span>
										<input class:negative={factor.weight < 0} type="number" min="-100" max="100" step="1" bind:value={factor.weight} />
									</label>
								</div>
							{/each}
						</section>
					{/each}
					<footer class="save-bar">
						<div><strong>{changedFactors}</strong><span>factors differ from defaults</span></div>
						<label>
							<span>Audit reason</span>
							<input bind:value={factorReason} required minlength="3" maxlength="300" placeholder="Required" />
						</label>
						<button class="primary" type="submit" disabled={saving || !factorReason.trim()}>{saving ? "Publishing..." : "Publish weights"}</button>
					</footer>
				</form>
			{/if}
		</section>
	{:else}
		<section class="workspace sites-workspace">
			<header class="workspace-header"><div><h2>Site protection</h2><p>{sites.filter((site) => site.enabled).length} of {sites.length} protected</p></div></header>
			{#if loading && sites.length === 0}
				<div class="empty">Loading protected sites...</div>
			{:else}
				<div class="site-list">
					{#each sites as site (site.host)}
						<div class="site-row">
							<span class="site-icon"><Icon icon="material-symbols:language-rounded" /></span>
							<div><strong>{site.host}</strong><small>Updated {formatTime(site.updatedAt)}</small></div>
							<span class:enabled={site.enabled} class="site-state">{!site.connected ? "Not connected" : site.enabled ? "Protected" : "Off"}</span>
							<button
								class:enabled={site.enabled}
								class="switch"
								role="switch"
								aria-checked={site.enabled}
								aria-label={`${site.enabled ? "Disable" : "Enable"} protection for ${site.host}`}
								onclick={() => requestSiteChange(site)}
								disabled={!site.connected || saving}
							><span></span></button>
						</div>
					{/each}
				</div>
			{/if}
		</section>
	{/if}
</div>

{#if pendingSite}
	<div class="modal-backdrop" role="presentation" onclick={(event) => event.target === event.currentTarget && (pendingSite = null)}>
		<section class="confirmation" role="dialog" aria-modal="true" aria-labelledby="site-confirm-title">
			<header>
				<span class:warning={pendingSite.enabled}><Icon icon={pendingSite.enabled ? "material-symbols:shield-outline-rounded" : "material-symbols:verified-user-outline-rounded"} /></span>
				<div><h2 id="site-confirm-title">{pendingSite.enabled ? "Disable protection" : "Enable protection"}</h2><p>{pendingSite.host}</p></div>
			</header>
			<label>
				<span>Audit reason</span>
				<textarea bind:value={siteReason} minlength="3" maxlength="300" rows="3" placeholder="Required"></textarea>
			</label>
			<footer>
				<button class="secondary" onclick={() => (pendingSite = null)} disabled={saving}>Cancel</button>
				<button class:danger={pendingSite.enabled} class="primary" onclick={saveSite} disabled={saving || !siteReason.trim()}>{saving ? "Saving..." : "Confirm"}</button>
			</footer>
		</section>
	</div>
{/if}

<style>
	:global(*) { box-sizing: border-box; }
	.shield-shell { width: 100%; max-width: 80rem; min-width: 0; margin: 0 auto; color: #172536; }
	.shell-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
	.product-label { color: #2b87c8; font-size: .6875rem; font-weight: 800; text-transform: uppercase; }
	h1 { margin: .2rem 0 0; font-size: 1.5rem; letter-spacing: 0; }
	.header-status { display: flex; align-items: center; gap: .75rem; }
	button, input, textarea { font: inherit; letter-spacing: 0; }
	button { min-height: 2.75rem; border-radius: .375rem; cursor: pointer; }
	button:disabled { cursor: not-allowed; opacity: .55; }
	.icon-button { display: inline-grid; place-items: center; width: 2.75rem; min-width: 2.75rem; border: 1px solid #d0dbe4; background: #fff; color: #50687c; }
	.icon-button :global(svg), .icon-command :global(svg) { width: 1.2rem; height: 1.2rem; }
	.workspace-tabs { display: grid; grid-template-columns: repeat(3, 1fr); border-bottom: 1px solid #cad7e1; margin-bottom: 1rem; }
	.workspace-tabs button { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: .4rem; min-width: 0; border: 0; border-radius: 0; background: transparent; color: #617588; padding: .7rem .4rem; font-weight: 700; }
	.workspace-tabs button::after { position: absolute; right: 0; bottom: -1px; left: 0; height: .1875rem; background: transparent; content: ""; }
	.workspace-tabs button.active { color: #197cbd; }
	.workspace-tabs button.active::after { background: #2a8ed0; }
	.workspace-tabs :global(svg) { flex: 0 0 auto; width: 1.15rem; height: 1.15rem; }
	.notice { display: flex; align-items: center; gap: .5rem; margin-bottom: 1rem; border-left: .25rem solid; padding: .75rem 1rem; }
	.notice :global(svg) { flex: 0 0 auto; width: 1.2rem; height: 1.2rem; }
	.notice.error { border-color: #c74452; background: #fff1f2; color: #7e2430; }
	.notice.success { border-color: #27865a; background: #edf8f2; color: #176640; }
	.workspace { border: 1px solid #d7e0e7; background: #fff; }
	.workspace-header { min-height: 4rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; border-bottom: 1px solid #dfe7ed; padding: .75rem 1rem; }
	.workspace-header h2 { margin: 0; font-size: 1rem; }
	.workspace-header p { margin: .2rem 0 0; color: #6d8092; font-size: .75rem; }
	.primary, .secondary { display: inline-flex; align-items: center; justify-content: center; gap: .45rem; padding: .65rem 1rem; font-weight: 700; }
	.primary { border: 1px solid #237fc1; background: #237fc1; color: #fff; }
	.secondary { border: 1px solid #cbd7e1; background: #fff; color: #425b70; }
	.primary.danger { border-color: #b63b49; background: #b63b49; }
	.empty { min-height: 12rem; display: grid; place-items: center; color: #718398; padding: 2rem; }
	.factor-group + .factor-group { border-top: 1px solid #dfe7ed; }
	.factor-group h3 { margin: 0; background: #f6f9fb; color: #4d6377; padding: .7rem 1rem; font-size: .75rem; text-transform: uppercase; }
	.factor-columns { display: none; }
	.factor-row { display: grid; grid-template-columns: minmax(0, 1fr) 5.5rem; gap: .75rem; align-items: center; border-top: 1px solid #e8edf1; padding: .75rem 1rem; }
	.factor-row > div { display: grid; min-width: 0; gap: .2rem; }
	.factor-row strong { overflow-wrap: anywhere; }
	.factor-row small { color: #718398; font-size: .75rem; text-transform: capitalize; }
	.subject-types { grid-column: 1 / -1; grid-row: 2; color: #65798c; font-size: .75rem; }
	.factor-row label { grid-column: 2; grid-row: 1; display: grid; gap: .25rem; }
	.factor-row label span, .save-bar label span, .confirmation label span { color: #596e82; font-size: .75rem; font-weight: 700; }
	.factor-row input, .save-bar input, textarea { width: 100%; min-height: 2.75rem; border: 1px solid #cbd7e1; border-radius: .375rem; background: #fff; color: #a13442; padding: .6rem .7rem; font-weight: 800; }
	.factor-row input.negative { color: #187348; }
	.factor-row input:focus, .save-bar input:focus, textarea:focus { outline: 2px solid #2f8fd5; outline-offset: 1px; border-color: transparent; }
	.save-bar { display: grid; grid-template-columns: 1fr; gap: .75rem; border-top: 1px solid #ccd9e2; background: #f6f9fb; padding: 1rem; }
	.save-bar > div { display: flex; align-items: baseline; gap: .4rem; }
	.save-bar > div strong { font-size: 1.125rem; }
	.save-bar > div span { color: #6c7f92; font-size: .75rem; }
	.save-bar label { display: grid; gap: .3rem; }
	.site-list { display: grid; }
	.site-row { display: grid; grid-template-columns: 2.75rem minmax(0, 1fr) auto auto; gap: .75rem; align-items: center; border-bottom: 1px solid #e2e8ed; padding: .875rem 1rem; }
	.site-row:last-child { border-bottom: 0; }
	.site-icon { display: inline-grid; place-items: center; width: 2.75rem; height: 2.75rem; border-radius: .375rem; background: #edf4f8; color: #3b718f; }
	.site-icon :global(svg) { width: 1.35rem; height: 1.35rem; }
	.site-row > div { display: grid; min-width: 0; gap: .2rem; }
	.site-row strong { overflow-wrap: anywhere; }
	.site-row small { color: #718398; font-size: .75rem; }
	.site-state { display: none; color: #738598; font-size: .75rem; font-weight: 800; text-transform: uppercase; }
	.site-state.enabled { color: #187348; }
	.switch { position: relative; width: 3rem; min-width: 3rem; height: 1.75rem; min-height: 2.75rem; border: 0; background: transparent; padding: .5rem 0; }
	.switch::before { position: absolute; top: .625rem; right: 0; left: 0; height: 1.5rem; border-radius: 1rem; background: #b9c5ce; content: ""; }
	.switch span { position: absolute; top: .8125rem; left: .25rem; width: 1.125rem; height: 1.125rem; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgb(0 0 0 / 20%); transition: transform .15s ease; }
	.switch.enabled::before { background: #278d5d; }
	.switch.enabled span { transform: translateX(1.375rem); }
	.modal-backdrop { position: fixed; z-index: 100; inset: 0; display: grid; place-items: center; background: rgb(16 28 40 / 48%); padding: 1rem; }
	.confirmation { width: min(100%, 28rem); border: 1px solid #cbd7e1; border-radius: .5rem; background: #fff; box-shadow: 0 1.5rem 4rem rgb(12 30 45 / 22%); }
	.confirmation > header { display: flex; gap: .75rem; align-items: center; border-bottom: 1px solid #e1e8ed; padding: 1rem; }
	.confirmation > header > span { display: inline-grid; place-items: center; width: 2.75rem; height: 2.75rem; border-radius: .375rem; background: #e8f6ef; color: #187348; }
	.confirmation > header > span.warning { background: #fff0f1; color: #b33c4b; }
	.confirmation > header :global(svg) { width: 1.4rem; height: 1.4rem; }
	.confirmation h2 { margin: 0; font-size: 1rem; }
	.confirmation p { margin: .2rem 0 0; color: #64798b; font-size: .8rem; }
	.confirmation label { display: grid; gap: .35rem; padding: 1rem; }
	textarea { resize: vertical; font-weight: 500; }
	.confirmation footer { display: flex; justify-content: flex-end; gap: .75rem; border-top: 1px solid #e1e8ed; padding: 1rem; }

	@media (min-width: 40rem) {
		.workspace-tabs { display: flex; gap: 1.5rem; }
		.workspace-tabs button { padding-inline: .25rem; }
		.factor-row { grid-template-columns: minmax(14rem, 1.6fr) minmax(9rem, 1fr) 6rem; }
		.factor-row label { grid-column: 3; }
		.subject-types { grid-column: 2; grid-row: 1; }
		.save-bar { grid-template-columns: auto minmax(14rem, 1fr) auto; align-items: end; }
		.site-state { display: inline; }
	}

	@media (min-width: 64rem) {
		.factor-columns { display: grid; grid-template-columns: minmax(14rem, 1.6fr) minmax(9rem, 1fr) 6rem; gap: .75rem; border-top: 1px solid #e2e8ed; background: #fbfcfd; color: #718398; padding: .5rem 1rem; font-size: .6875rem; font-weight: 700; text-transform: uppercase; }
	}
</style>
