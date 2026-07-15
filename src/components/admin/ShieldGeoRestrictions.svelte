<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";

type Country = {
	code: string;
	name: string;
	restricted: boolean;
	policyId?: number;
	regionCount: number;
	restrictedRegionCount: number;
	observations: number;
};

type Region = {
	code: string;
	name: string;
	type: string;
	restricted: boolean;
	policyId?: number;
	observations: number;
};

type PendingRestriction = {
	countryCode: string;
	regionCode?: string;
	label: string;
	restricted: boolean;
};

let { csrf }: { csrf: string } = $props();
let countries = $state<Country[]>([]);
let regions = $state<Region[]>([]);
let selectedCountry = $state<Country | null>(null);
let countryQuery = $state("");
let regionQuery = $state("");
let restrictedOnly = $state(false);
let loadingCountries = $state(true);
let loadingRegions = $state(false);
let saving = $state(false);
let error = $state("");
let success = $state("");
let pending = $state<PendingRestriction | null>(null);
let auditReason = $state("");

const visibleCountries = $derived(
	countries.filter((country) => {
		if (
			restrictedOnly &&
			!country.restricted &&
			country.restrictedRegionCount === 0
		)
			return false;
		const needle = countryQuery.trim().toLocaleLowerCase();
		return (
			!needle ||
			country.code.toLocaleLowerCase().includes(needle) ||
			country.name.toLocaleLowerCase().includes(needle)
		);
	}),
);

const visibleRegions = $derived(
	regions.filter((region) => {
		if (restrictedOnly && !region.restricted) return false;
		const needle = regionQuery.trim().toLocaleLowerCase();
		return (
			!needle ||
			region.code.toLocaleLowerCase().includes(needle) ||
			region.name.toLocaleLowerCase().includes(needle) ||
			region.type.toLocaleLowerCase().includes(needle)
		);
	}),
);

const restrictedCountries = $derived(
	countries.filter((country) => country.restricted).length,
);
const restrictedRegions = $derived(
	countries.reduce(
		(total, country) => total + country.restrictedRegionCount,
		0,
	),
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
	const body = (await response.json().catch(() => ({}))) as {
		detail?: string;
	};
	if (!response.ok)
		throw new Error(body.detail ?? `Shield API ${response.status}`);
	return body as T;
}

async function loadCountries() {
	loadingCountries = true;
	try {
		const response = await api<{ countries: Country[] }>(
			"/geography/restrictions",
		);
		countries = response.countries;
		if (selectedCountry) {
			selectedCountry =
				countries.find((country) => country.code === selectedCountry?.code) ??
				null;
		}
		error = "";
	} catch (cause) {
		error =
			cause instanceof Error
				? cause.message
				: "Country restrictions could not be loaded";
	} finally {
		loadingCountries = false;
	}
}

async function loadRegions(country: Country) {
	selectedCountry = country;
	regionQuery = "";
	loadingRegions = true;
	try {
		const response = await api<{ regions: Region[] }>(
			`/geography/restrictions?country_code=${encodeURIComponent(country.code)}`,
		);
		regions = response.regions;
		error = "";
	} catch (cause) {
		error =
			cause instanceof Error
				? cause.message
				: "Regional restrictions could not be loaded";
	} finally {
		loadingRegions = false;
	}
}

function requestCountryChange(country: Country) {
	pending = {
		countryCode: country.code,
		label: `${country.name} (${country.code})`,
		restricted: !country.restricted,
	};
	auditReason = "";
}

function requestRegionChange(region: Region) {
	if (!selectedCountry || selectedCountry.restricted) return;
	pending = {
		countryCode: selectedCountry.code,
		regionCode: region.code,
		label: `${region.name} (${region.code})`,
		restricted: !region.restricted,
	};
	auditReason = "";
}

async function saveRestriction() {
	if (!pending || !auditReason.trim()) return;
	const target = pending;
	saving = true;
	try {
		await api("/geography/restrictions", {
			method: "PUT",
			body: JSON.stringify({
				country_code: target.countryCode,
				region_code: target.regionCode,
				restricted: target.restricted,
				reason: auditReason.trim(),
			}),
		});
		pending = null;
		auditReason = "";
		await loadCountries();
		if (target.regionCode && selectedCountry)
			await loadRegions(selectedCountry);
		success = `${target.restricted ? "Restricted" : "Restored"} ${target.label}.`;
		window.setTimeout(() => {
			success = "";
		}, 3000);
	} catch (cause) {
		error =
			cause instanceof Error
				? cause.message
				: "Geographic restriction could not be changed";
	} finally {
		saving = false;
	}
}

onMount(loadCountries);
</script>

<section class="geo-workspace">
	<header class="workspace-header">
		<div>
			<h2>Country and region access</h2>
			<p>{restrictedCountries} countries / {restrictedRegions} regions restricted</p>
		</div>
		<button
			class="icon-button"
			title="Refresh geography"
			aria-label="Refresh geography"
			onclick={loadCountries}
			disabled={loadingCountries}
		>
			<Icon icon="material-symbols:refresh-rounded" />
		</button>
	</header>

	{#if error}
		<div class="notice error" role="alert">
			<Icon icon="material-symbols:error-outline-rounded" />{error}
		</div>
	{/if}
	{#if success}
		<div class="notice success" role="status">
			<Icon icon="material-symbols:check-circle-outline-rounded" />{success}
		</div>
	{/if}

	<div class="geo-toolbar">
		<label>
			<span>Country</span>
			<div class="search-input">
				<Icon icon="material-symbols:search-rounded" />
				<input bind:value={countryQuery} placeholder="Name or ISO code" />
			</div>
		</label>
		<div class="scope-filter" role="group" aria-label="Restriction status">
			<button
				class:active={!restrictedOnly}
				type="button"
				onclick={() => (restrictedOnly = false)}>All</button
			>
			<button
				class:active={restrictedOnly}
				type="button"
				onclick={() => (restrictedOnly = true)}>Restricted</button
			>
		</div>
	</div>

	<div class="geo-layout">
		<section class="country-pane" aria-label="Countries">
			<header><strong>Countries</strong><span>{visibleCountries.length}</span></header>
			<div class="geo-list">
				{#if loadingCountries && countries.length === 0}
					<div class="empty">Loading countries...</div>
				{:else}
					{#each visibleCountries as country (country.code)}
						<div class:selected={selectedCountry?.code === country.code} class="geo-row">
							<button
								class="row-main"
								type="button"
								onclick={() => loadRegions(country)}
							>
								<span class="code">{country.code}</span>
								<span>
									<strong>{country.name}</strong>
									<small>{country.regionCount} regions / {country.observations} observations</small>
								</span>
								{#if country.restrictedRegionCount > 0}
									<b>{country.restrictedRegionCount}</b>
								{/if}
								<Icon icon="material-symbols:chevron-right-rounded" />
							</button>
							<button
								class:enabled={country.restricted}
								class="restriction-switch"
								role="switch"
								aria-checked={country.restricted}
								aria-label={`${country.restricted ? "Restore" : "Restrict"} ${country.name}`}
								title={country.restricted ? "Restore access" : "Restrict access"}
								onclick={() => requestCountryChange(country)}
								disabled={saving}
							><span></span></button>
						</div>
					{/each}
				{/if}
			</div>
		</section>

		<section class="region-pane" aria-label="Regions">
			{#if !selectedCountry}
				<div class="placeholder">
					<Icon icon="material-symbols:map-outline-rounded" />
					<strong>Select a country</strong>
				</div>
			{:else}
				<header>
					<div><strong>{selectedCountry.name}</strong><span>{selectedCountry.code}</span></div>
					{#if selectedCountry.restricted}<b>Country restricted</b>{/if}
				</header>
				<div class="region-search">
					<label>
						<span>Region</span>
						<div class="search-input">
							<Icon icon="material-symbols:search-rounded" />
							<input bind:value={regionQuery} placeholder="Name, type, or ISO code" />
						</div>
					</label>
				</div>
				<div class="region-list">
					{#if loadingRegions}
						<div class="empty">Loading regions...</div>
					{:else if visibleRegions.length === 0}
						<div class="empty">No regions match this filter.</div>
					{:else}
						{#each visibleRegions as region (region.code)}
							<div class="region-row">
								<span class="code">{region.code.split("-").at(-1)}</span>
								<span><strong>{region.name}</strong><small>{region.type} / {region.observations} observations</small></span>
								<span class:restricted={region.restricted || selectedCountry.restricted} class="restriction-state">
									{selectedCountry.restricted ? "Country" : region.restricted ? "Restricted" : "Open"}
								</span>
								<button
									class:enabled={region.restricted || selectedCountry.restricted}
									class="restriction-switch"
									role="switch"
									aria-checked={region.restricted || selectedCountry.restricted}
									aria-label={`${region.restricted ? "Restore" : "Restrict"} ${region.name}`}
									onclick={() => requestRegionChange(region)}
									disabled={selectedCountry.restricted || saving}
								><span></span></button>
							</div>
						{/each}
					{/if}
				</div>
			{/if}
		</section>
	</div>
</section>

{#if pending}
	<div
		class="modal-backdrop"
		role="presentation"
		onclick={(event) =>
			event.target === event.currentTarget && (pending = null)}
	>
		<section
			class="confirmation"
			role="dialog"
			aria-modal="true"
			aria-labelledby="geo-confirm-title"
		>
			<header>
				<span class:warning={pending.restricted}>
					<Icon
						icon={pending.restricted
							? "material-symbols:public-off-outline-rounded"
							: "material-symbols:public-rounded"}
					/>
				</span>
				<div>
					<h2 id="geo-confirm-title">{pending.restricted ? "Restrict access" : "Restore access"}</h2>
					<p>{pending.label}</p>
				</div>
			</header>
			<label>
				<span>Audit reason</span>
				<textarea
					bind:value={auditReason}
					minlength="3"
					maxlength="300"
					rows="3"
					placeholder="Required"
				></textarea>
			</label>
			<footer>
				<button
					class="secondary"
					onclick={() => (pending = null)}
					disabled={saving}>Cancel</button
				>
				<button
					class:danger={pending.restricted}
					class="primary"
					onclick={saveRestriction}
					disabled={saving || !auditReason.trim()}
					>{saving ? "Saving..." : "Confirm"}</button
				>
			</footer>
		</section>
	</div>
{/if}

<style>
	:global(*) { box-sizing: border-box; }
	.geo-workspace { min-width: 0; border: 1px solid #d7e0e7; background: #fff; }
	.workspace-header { min-height: 4rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; border-bottom: 1px solid #dfe7ed; padding: .75rem 1rem; }
	.workspace-header h2 { margin: 0; font-size: 1rem; }
	.workspace-header p { margin: .2rem 0 0; color: #6d8092; font-size: .75rem; }
	button, input, textarea { font: inherit; letter-spacing: 0; }
	button { min-height: 2.75rem; cursor: pointer; }
	button:disabled { cursor: not-allowed; opacity: .55; }
	.icon-button { display: inline-grid; place-items: center; width: 2.75rem; min-width: 2.75rem; border: 1px solid #d0dbe4; border-radius: .375rem; background: #fff; color: #50687c; }
	.icon-button :global(svg) { width: 1.2rem; height: 1.2rem; }
	.notice { display: flex; align-items: center; gap: .5rem; border-bottom: 1px solid; padding: .75rem 1rem; }
	.notice :global(svg) { flex: 0 0 auto; width: 1.2rem; height: 1.2rem; }
	.notice.error { border-color: #e7bfc4; background: #fff1f2; color: #7e2430; }
	.notice.success { border-color: #b8ddca; background: #edf8f2; color: #176640; }
	.geo-toolbar { display: grid; gap: .75rem; border-bottom: 1px solid #dfe7ed; background: #f8fafc; padding: .75rem; }
	.geo-toolbar label, .region-search label, .confirmation label { display: grid; min-width: 0; gap: .35rem; }
	.geo-toolbar label > span, .region-search label > span, .confirmation label > span { color: #596e82; font-size: .75rem; font-weight: 700; }
	.search-input { position: relative; min-width: 0; }
	.search-input :global(svg) { position: absolute; top: 50%; left: .7rem; width: 1.15rem; height: 1.15rem; color: #6b7f91; transform: translateY(-50%); pointer-events: none; }
	.search-input input, textarea { width: 100%; min-height: 2.75rem; border: 1px solid #cbd7e1; border-radius: .375rem; background: #fff; color: #172536; padding: .65rem .75rem; }
	.search-input input { padding-left: 2.35rem; }
	.search-input input:focus, textarea:focus { outline: 2px solid #2f8fd5; outline-offset: 1px; border-color: transparent; }
	.scope-filter { display: grid; grid-template-columns: 1fr 1fr; align-self: end; border: 1px solid #cbd7e1; border-radius: .375rem; overflow: hidden; }
	.scope-filter button { min-width: 0; border: 0; border-radius: 0; background: #fff; color: #566c80; padding: .6rem .8rem; font-size: .8rem; font-weight: 700; }
	.scope-filter button + button { border-left: 1px solid #cbd7e1; }
	.scope-filter button.active { background: #237fc1; color: #fff; }
	.geo-layout { display: grid; min-width: 0; }
	.country-pane, .region-pane { min-width: 0; }
	.country-pane > header, .region-pane > header { min-height: 3rem; display: flex; align-items: center; justify-content: space-between; gap: .75rem; border-bottom: 1px solid #dfe7ed; padding: .65rem .75rem; }
	.country-pane > header span, .region-pane > header span { color: #718398; font-size: .75rem; }
	.region-pane > header div { display: flex; align-items: baseline; gap: .5rem; min-width: 0; }
	.region-pane > header b { color: #a42f40; font-size: .75rem; }
	.geo-list, .region-list { max-height: 40rem; overflow: auto; }
	.geo-row { display: grid; grid-template-columns: minmax(0, 1fr) 3rem; border-bottom: 1px solid #e7edf1; }
	.geo-row.selected { background: #f1f8fc; }
	.row-main { width: 100%; display: grid; grid-template-columns: 2.5rem minmax(0, 1fr) auto 1.25rem; gap: .65rem; align-items: center; min-width: 0; border: 0; border-radius: 0; background: transparent; color: #172536; padding: .65rem .5rem .65rem .75rem; text-align: left; }
	.row-main:hover { background: #f4f9fc; }
	.row-main > span:nth-child(2), .region-row > span:nth-child(2) { display: grid; min-width: 0; gap: .15rem; }
	.row-main strong, .region-row strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.row-main small, .region-row small { color: #718398; font-size: .72rem; overflow-wrap: anywhere; }
	.row-main b { min-width: 1.5rem; border-radius: .25rem; background: #ffe0e3; color: #ad3544; padding: .2rem .35rem; text-align: center; font-size: .7rem; }
	.code { display: inline-grid; min-width: 2.5rem; height: 2rem; place-items: center; border-radius: .25rem; background: #edf4f8; color: #3d657d; font-size: .72rem; font-weight: 800; }
	.restriction-switch { position: relative; align-self: center; width: 3rem; min-width: 3rem; height: 2.75rem; border: 0; border-radius: 0; background: transparent; padding: .5rem 0; }
	.restriction-switch::before { position: absolute; top: .625rem; right: 0; left: 0; height: 1.5rem; border-radius: 1rem; background: #b9c5ce; content: ""; }
	.restriction-switch span { position: absolute; top: .8125rem; left: .25rem; width: 1.125rem; height: 1.125rem; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgb(0 0 0 / 20%); transition: transform .15s ease; }
	.restriction-switch.enabled::before { background: #c34453; }
	.restriction-switch.enabled span { transform: translateX(1.375rem); }
	.region-pane { border-top: 1px solid #d7e0e7; }
	.region-search { border-bottom: 1px solid #e2e9ee; background: #f8fafc; padding: .75rem; }
	.region-row { display: grid; grid-template-columns: 2.5rem minmax(0, 1fr) 3rem; gap: .65rem; align-items: center; border-bottom: 1px solid #e7edf1; padding: .65rem .75rem; }
	.region-row .restriction-switch { grid-column: 3; }
	.restriction-state { display: none; color: #687d8f; font-size: .7rem; font-weight: 800; text-transform: uppercase; }
	.restriction-state.restricted { color: #ad3544; }
	.empty, .placeholder { min-height: 10rem; display: grid; place-items: center; color: #718398; padding: 2rem; text-align: center; }
	.placeholder { align-content: center; gap: .75rem; }
	.placeholder :global(svg) { width: 2rem; height: 2rem; }
	.modal-backdrop { position: fixed; z-index: 100; inset: 0; display: grid; place-items: center; background: rgb(16 28 40 / 48%); padding: 1rem; }
	.confirmation { width: min(100%, 28rem); border: 1px solid #cbd7e1; border-radius: .5rem; background: #fff; box-shadow: 0 1.5rem 4rem rgb(12 30 45 / 22%); }
	.confirmation > header { display: flex; gap: .75rem; align-items: center; border-bottom: 1px solid #e1e8ed; padding: 1rem; }
	.confirmation > header > span { display: inline-grid; place-items: center; width: 2.75rem; height: 2.75rem; border-radius: .375rem; background: #e8f6ef; color: #187348; }
	.confirmation > header > span.warning { background: #fff0f1; color: #b33c4b; }
	.confirmation > header :global(svg) { width: 1.4rem; height: 1.4rem; }
	.confirmation h2 { margin: 0; font-size: 1rem; }
	.confirmation p { margin: .2rem 0 0; color: #64798b; font-size: .8rem; }
	.confirmation label { padding: 1rem; }
	textarea { resize: vertical; }
	.confirmation footer { display: flex; justify-content: flex-end; gap: .75rem; border-top: 1px solid #e1e8ed; padding: 1rem; }
	.primary, .secondary { display: inline-flex; align-items: center; justify-content: center; gap: .45rem; border-radius: .375rem; padding: .65rem 1rem; font-weight: 700; }
	.primary { border: 1px solid #237fc1; background: #237fc1; color: #fff; }
	.primary.danger { border-color: #b63b49; background: #b63b49; }
	.secondary { border: 1px solid #cbd7e1; background: #fff; color: #425b70; }

	@media (min-width: 40rem) {
		.geo-toolbar { grid-template-columns: minmax(14rem, 1fr) auto; align-items: end; }
		.scope-filter { min-width: 14rem; }
		.region-row { grid-template-columns: 2.5rem minmax(0, 1fr) auto 3rem; }
		.region-row .restriction-switch { grid-column: 4; }
		.restriction-state { display: inline; }
	}

	@media (min-width: 64rem) {
		.geo-layout { grid-template-columns: minmax(22rem, 42%) minmax(0, 58%); min-height: 34rem; }
		.country-pane { border-right: 1px solid #d7e0e7; }
		.region-pane { border-top: 0; }
	}
</style>
