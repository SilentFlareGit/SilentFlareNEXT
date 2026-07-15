<script lang="ts">
import Icon from "@iconify/svelte";
import { onDestroy, onMount } from "svelte";

type Subject = {
	id: number;
	subjectType: string;
	displayValue: string;
	currentScore: number;
	riskLevel: string;
	firstSeenAt: number;
	lastSeenAt: number;
	lastChangedAt: number;
};

type LedgerEntry = {
	id: string;
	createdAt: number;
	delta: number;
	scoreBefore: number;
	scoreAfter: number;
	reasonCode: string;
	reason: string;
	source: string;
	actor: string;
	expiresAt?: number;
};

type RiskOverride = {
	id: number;
	overrideType: string;
	value?: number;
	scopeHost?: string;
	scopePath?: string;
	reason: string;
	createdAt: number;
	createdBy: string;
	expiresAt?: number;
	revokedAt?: number;
};

type Detail = Subject & {
	effectiveScore: number;
	ledger: LedgerEntry[];
	overrides: RiskOverride[];
	relations: Array<{
		relationType: string;
		confidence: number;
		lastSeenAt: number;
		relatedId: number;
	}>;
};

type Count = {
	subjectType: string;
	total: number;
	elevated: number;
	maximumScore: number;
};

let { csrf }: { csrf: string } = $props();
let subjects = $state<Subject[]>([]);
let counts = $state<Count[]>([]);
let selected = $state<Detail | null>(null);
let subjectType = $state("");
let minimumScore = $state(0);
let query = $state("");
let loading = $state(true);
let loadingDetail = $state(false);
let saving = $state(false);
let error = $state("");
let success = $state("");
let adjustment = $state(0);
let adjustmentReason = $state("");
let adjustmentDuration = $state(86400);
let overrideType = $state("score_cap");
let overrideValue = $state(30);
let overrideReason = $state("");
let overrideDuration = $state(86400);
let timer: number | undefined;
let controller: AbortController | null = null;

const typeOptions = [
	["", "All"],
	["account", "Accounts"],
	["session", "Sessions"],
	["device", "Devices"],
	["ip", "IPs"],
	["cidr", "CIDRs"],
	["asn", "ASNs"],
	["email", "Email"],
	["api_key", "API keys"],
	["country", "Countries"],
];

async function api<T>(path: string, init: RequestInit = {}) {
	const response = await fetch(`/__shield/api/admin${path}`, {
		...init,
		credentials: "include",
		headers: {
			Accept: "application/json",
			...(init.body ? { "Content-Type": "application/json" } : {}),
			...(init.method && init.method !== "GET" ? { "X-CSRF-Token": csrf } : {}),
			...(init.headers ?? {}),
		},
	});
	const body = (await response.json().catch(() => ({}))) as {
		detail?: string;
	};
	if (!response.ok)
		throw new Error(body.detail ?? `Shield API ${response.status}`);
	return body as T;
}

async function loadSubjects(quiet = false) {
	if (!quiet) loading = true;
	controller?.abort();
	controller = new AbortController();
	const parameters = new URLSearchParams({
		minimum_score: String(minimumScore),
		limit: "200",
	});
	if (subjectType) parameters.set("subject_type", subjectType);
	if (query.trim()) parameters.set("query", query.trim());
	try {
		const payload = await api<{ items: Subject[]; counts: Count[] }>(
			`/entities?${parameters}`,
			{ signal: controller.signal },
		);
		subjects = payload.items;
		counts = payload.counts;
		error = "";
		if (selected) {
			const updated = subjects.find((item) => item.id === selected?.id);
			if (updated) await openSubject(updated, true);
		}
	} catch (cause) {
		if (cause instanceof DOMException && cause.name === "AbortError") return;
		error =
			cause instanceof Error ? cause.message : "Risk entities unavailable";
	} finally {
		loading = false;
	}
}

async function openSubject(subject: Subject, quiet = false) {
	if (!quiet) loadingDetail = true;
	try {
		selected = await api<Detail>(`/entities/${subject.id}`);
		error = "";
	} catch (cause) {
		error = cause instanceof Error ? cause.message : "Risk entity unavailable";
	} finally {
		loadingDetail = false;
	}
}

async function submitAdjustment() {
	if (!selected || !adjustment || adjustmentReason.trim().length < 3) return;
	saving = true;
	try {
		const payload = await api<{ subject: Detail }>(
			`/entities/${selected.id}/adjust`,
			{
				method: "POST",
				body: JSON.stringify({
					delta: Number(adjustment),
					reason: adjustmentReason.trim(),
					duration_seconds: Number(adjustmentDuration),
				}),
			},
		);
		selected = payload.subject;
		adjustment = 0;
		adjustmentReason = "";
		success = "Risk adjustment applied and recorded in the ledger.";
		await loadSubjects(true);
	} catch (cause) {
		error = cause instanceof Error ? cause.message : "Risk adjustment failed";
	} finally {
		saving = false;
	}
}

async function submitOverride() {
	if (!selected || overrideReason.trim().length < 3) return;
	saving = true;
	try {
		const payload = await api<{ subject: Detail }>(
			`/entities/${selected.id}/overrides`,
			{
				method: "POST",
				body: JSON.stringify({
					override_type: overrideType,
					value:
						overrideType === "score_cap" || overrideType === "score_floor"
							? Number(overrideValue)
							: null,
					reason: overrideReason.trim(),
					duration_seconds: Number(overrideDuration),
				}),
			},
		);
		selected = payload.subject;
		overrideReason = "";
		success = "Scoped risk override activated.";
		await loadSubjects(true);
	} catch (cause) {
		error = cause instanceof Error ? cause.message : "Risk override failed";
	} finally {
		saving = false;
	}
}

async function revokeOverride(item: RiskOverride) {
	if (!selected) return;
	saving = true;
	try {
		const payload = await api<{ subject: Detail }>(
			`/overrides/${item.id}/revoke`,
			{
				method: "POST",
				body: JSON.stringify({ reason: "Revoked from entity dashboard" }),
			},
		);
		selected = payload.subject;
		success = "Risk override revoked and reversal recorded.";
		await loadSubjects(true);
	} catch (cause) {
		error =
			cause instanceof Error ? cause.message : "Override revocation failed";
	} finally {
		saving = false;
	}
}

function formatTime(value?: number) {
	return value
		? new Intl.DateTimeFormat(undefined, {
				dateStyle: "medium",
				timeStyle: "short",
			}).format(new Date(value * 1000))
		: "Not recorded";
}

function refreshWhenVisible() {
	if (document.visibilityState === "visible") void loadSubjects(true);
}

onMount(() => {
	void loadSubjects();
	timer = window.setInterval(() => {
		if (document.visibilityState === "visible" && !saving)
			void loadSubjects(true);
	}, 20_000);
	document.addEventListener("visibilitychange", refreshWhenVisible);
});

onDestroy(() => {
	if (timer) window.clearInterval(timer);
	controller?.abort();
	document.removeEventListener("visibilitychange", refreshWhenVisible);
});
</script>

<section class="entity-workspace">
	<header class="entity-heading">
		<div>
			<p>RISK ENTITIES</p>
			<h2>Subject posture and score history</h2>
		</div>
		<button class="icon-button" title="Refresh entities" aria-label="Refresh entities" onclick={() => loadSubjects()}>
			<Icon icon="material-symbols:refresh-rounded" />
		</button>
	</header>

	<div class="entity-metrics">
		{#each counts.slice(0, 6) as count}
			<button class:active={subjectType === count.subjectType} onclick={() => { subjectType = count.subjectType; void loadSubjects(); }}>
				<span>{count.subjectType.replaceAll("_", " ")}</span>
				<strong>{count.total}</strong>
				<small>{count.elevated} elevated / peak {count.maximumScore}</small>
			</button>
		{/each}
	</div>

	<form class="entity-filters" onsubmit={(event) => { event.preventDefault(); void loadSubjects(); }}>
		<label>
			<span>Type</span>
			<select bind:value={subjectType}>
				{#each typeOptions as option}<option value={option[0]}>{option[1]}</option>{/each}
			</select>
		</label>
		<label>
			<span>Minimum risk</span>
			<select bind:value={minimumScore}>
				<option value={0}>All scores</option>
				<option value={30}>30+ Observe</option>
				<option value={50}>50+ Verify</option>
				<option value={65}>65+ Restrict</option>
				<option value={80}>80+ Block</option>
			</select>
		</label>
		<label class="search-field">
			<span>Search</span>
			<input bind:value={query} placeholder="Masked value or operator label" />
		</label>
		<button class="apply-button" type="submit"><Icon icon="material-symbols:filter-alt-outline-rounded" />Apply</button>
	</form>

	{#if error}<div class="entity-notice error" aria-live="polite"><Icon icon="material-symbols:warning-outline-rounded" />{error}</div>{/if}
	{#if success}<div class="entity-notice success" aria-live="polite"><Icon icon="material-symbols:check-circle-outline-rounded" />{success}</div>{/if}

	<div class="entity-layout">
		<section class="entity-list" aria-busy={loading}>
			<div class="list-header"><span>Risk</span><span>Subject</span><span>Last change</span><span></span></div>
			{#if loading && subjects.length === 0}
				<div class="empty-state">Loading risk entities...</div>
			{:else}
				{#each subjects as subject}
					<button class:selected={selected?.id === subject.id} class="subject-row" onclick={() => openSubject(subject)}>
						<span class={`score ${subject.riskLevel}`}>{subject.currentScore}</span>
						<span class="subject-name"><strong>{subject.displayValue}</strong><small>{subject.subjectType.replaceAll("_", " ")} / {subject.riskLevel}</small></span>
						<time>{formatTime(subject.lastChangedAt)}</time>
						<Icon icon="material-symbols:chevron-right-rounded" />
					</button>
				{:else}
					<div class="empty-state">No risk entities match these filters.</div>
				{/each}
			{/if}
		</section>

		<aside class="entity-detail" aria-busy={loadingDetail}>
			{#if selected}
				<header class="detail-head">
					<div class={`score large ${selected.riskLevel}`}>{selected.effectiveScore}</div>
					<div><span>{selected.subjectType.replaceAll("_", " ")}</span><h3>{selected.displayValue}</h3><small>Raw {selected.currentScore} / effective {selected.effectiveScore}</small></div>
					<button class="icon-button" title="Close subject" aria-label="Close subject" onclick={() => (selected = null)}><Icon icon="material-symbols:close-rounded" /></button>
				</header>

				<div class="quick-controls">
					<label><span>Adjustment</span><input type="number" min="-100" max="100" bind:value={adjustment} /></label>
					<label><span>Duration</span><select bind:value={adjustmentDuration}><option value={3600}>1 hour</option><option value={21600}>6 hours</option><option value={86400}>24 hours</option><option value={604800}>7 days</option></select></label>
					<label class="reason-input"><span>Reason</span><input bind:value={adjustmentReason} placeholder="Required audit reason" /></label>
					<button onclick={submitAdjustment} disabled={saving || !adjustment || adjustmentReason.trim().length < 3}><Icon icon="material-symbols:add-chart-rounded" />Apply score</button>
				</div>

				<div class="quick-controls override-controls">
					<label><span>Override</span><select bind:value={overrideType}><option value="score_cap">Score cap</option><option value="score_floor">Score floor</option><option value="response_exemption">Response exemption</option><option value="rule_exemption">Rule exemption</option></select></label>
					{#if overrideType === "score_cap" || overrideType === "score_floor"}<label><span>Value</span><input type="number" min="0" max="100" bind:value={overrideValue} /></label>{/if}
					<label><span>Duration</span><select bind:value={overrideDuration}><option value={3600}>1 hour</option><option value={21600}>6 hours</option><option value={86400}>24 hours</option><option value={604800}>7 days</option></select></label>
					<label class="reason-input"><span>Reason</span><input bind:value={overrideReason} placeholder="Required audit reason" /></label>
					<button onclick={submitOverride} disabled={saving || overrideReason.trim().length < 3}><Icon icon="material-symbols:verified-user-outline-rounded" />Activate</button>
				</div>

				<section class="active-overrides">
					<header><h4>Active overrides</h4><span>{selected.overrides.filter((item) => !item.revokedAt).length}</span></header>
					{#each selected.overrides.filter((item) => !item.revokedAt) as item}
						<div><span><strong>{item.overrideType.replaceAll("_", " ")}{item.value !== undefined && item.value !== null ? ` ${item.value}` : ""}</strong><small>{item.reason} / {item.expiresAt ? formatTime(item.expiresAt) : "Permanent"}</small></span><button class="icon-button" title="Revoke override" onclick={() => revokeOverride(item)} disabled={saving}><Icon icon="material-symbols:undo-rounded" /></button></div>
					{:else}<p>No active overrides.</p>{/each}
				</section>

				<section class="risk-timeline">
					<header><h4>Risk ledger</h4><span>{selected.ledger.length} entries</span></header>
					{#each selected.ledger as entry}
						<article>
							<i class:negative={entry.delta < 0}>{entry.delta > 0 ? "+" : ""}{entry.delta}</i>
							<div><strong>{entry.reason}</strong><small>{entry.reasonCode} / {entry.source} / {formatTime(entry.createdAt)}</small></div>
							<span>{entry.scoreBefore} → {entry.scoreAfter}</span>
						</article>
					{:else}<p>No score changes have been recorded.</p>{/each}
				</section>
			{:else}
				<div class="detail-empty"><Icon icon="material-symbols:hub-outline-rounded" /><strong>Select a risk entity</strong><span>Score changes and operator controls appear here.</span></div>
			{/if}
		</aside>
	</div>
</section>

<style>
.entity-workspace{container-type:inline-size;display:grid;gap:1rem;color:#182230}.entity-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:1rem}.entity-heading p{margin:0;color:#287dbf;font-size:.75rem;font-weight:800}.entity-heading h2{margin:.25rem 0 0;font-size:1.15rem}.icon-button{display:inline-grid;width:2.75rem;height:2.75rem;flex:0 0 auto;place-items:center;border:1px solid #cfdbe5;border-radius:6px;background:#fff;color:#526575;cursor:pointer}.entity-metrics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));border:1px solid #d5e0e8;border-radius:8px;background:#fff}.entity-metrics button{min-width:0;min-height:5.5rem;border:0;border-right:1px solid #e4ebf0;border-bottom:1px solid #e4ebf0;background:#fff;padding:.8rem;text-align:left;cursor:pointer}.entity-metrics button.active{box-shadow:inset 0 -3px #318bd0}.entity-metrics span,.entity-metrics strong,.entity-metrics small{display:block}.entity-metrics span{color:#617487;font-size:.875rem;text-transform:capitalize}.entity-metrics strong{margin:.3rem 0;font-size:1.4rem}.entity-metrics small{overflow:hidden;color:#718096;font-size:.875rem;text-overflow:ellipsis;white-space:nowrap}.entity-filters{display:grid;grid-template-columns:1fr;gap:.65rem}.entity-filters label,.quick-controls label{display:flex;min-height:2.75rem;align-items:center;gap:.5rem;border:1px solid #d4dfe8;border-radius:6px;background:#fff;padding:0 .7rem}.entity-filters label span,.quick-controls label span{color:#687b8d;font-size:.875rem;font-weight:700;white-space:nowrap}.entity-filters select,.entity-filters input,.quick-controls select,.quick-controls input{width:100%;min-width:0;border:0;background:#fff;color:#182230;font:inherit;font-weight:700;outline:0}.apply-button,.quick-controls button{display:inline-flex;min-height:2.75rem;align-items:center;justify-content:center;gap:.4rem;border:1px solid #318bd0;border-radius:6px;background:#318bd0;padding:0 .9rem;color:#fff;font-weight:800;cursor:pointer}.entity-notice{display:flex;min-height:3rem;align-items:center;gap:.55rem;border:1px solid #bde3cf;border-radius:6px;background:#effaf4;padding:.75rem;color:#237047}.entity-notice.error{border-color:#efc9c9;background:#fff4f4;color:#a73333}.entity-layout{display:grid;grid-template-columns:1fr;gap:1rem;align-items:start}.entity-list,.entity-detail{min-width:0;overflow:hidden;border:1px solid #d5e0e8;border-radius:8px;background:#fff}.list-header,.subject-row{display:grid;grid-template-columns:3rem minmax(0,1fr) 8rem 1.5rem;align-items:center;gap:.75rem;padding:.75rem 1rem}.list-header{background:#f7fafc;color:#687b8d;font-size:.75rem;font-weight:800;text-transform:uppercase}.subject-row{width:100%;min-height:4.35rem;border:0;border-top:1px solid #edf1f4;background:#fff;color:inherit;text-align:left;cursor:pointer}.subject-row:hover,.subject-row.selected{background:#f3f8fc}.score{display:inline-grid;width:2.5rem;height:2.5rem;place-items:center;border-radius:4px;background:#e4f4ea;color:#237047;font-size:.875rem;font-weight:900}.score.observe{background:#fff2ce;color:#825c08}.score.verify{background:#ffe8ce;color:#9a5310}.score.restrict,.score.block{background:#ffe0e2;color:#ae3039}.subject-name{min-width:0}.subject-name strong,.subject-name small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.subject-name small,.subject-row time{margin-top:.2rem;color:#718096;font-size:.875rem}.detail-head{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:.85rem;border-bottom:1px solid #e6edf2;padding:1rem}.score.large{width:3.3rem;height:3.3rem;font-size:1rem}.detail-head span,.detail-head small{color:#718096;font-size:.875rem;text-transform:capitalize}.detail-head h3{margin:.15rem 0;overflow-wrap:anywhere;font-size:1rem}.quick-controls{display:grid;grid-template-columns:1fr;gap:.55rem;border-bottom:1px solid #e6edf2;padding:1rem}.quick-controls .reason-input{grid-column:1/-1}.quick-controls button{grid-column:1/-1}.override-controls{background:#f8fafc}.active-overrides,.risk-timeline{display:grid}.active-overrides header,.risk-timeline header{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e6edf2;padding:.8rem 1rem}.active-overrides h4,.risk-timeline h4{margin:0;font-size:.95rem}.active-overrides header span,.risk-timeline header span{color:#718096;font-size:.875rem}.active-overrides>div{display:flex;min-height:4rem;align-items:center;justify-content:space-between;gap:1rem;border-bottom:1px solid #edf1f4;padding:.7rem 1rem}.active-overrides strong,.active-overrides small{display:block}.active-overrides small{margin-top:.25rem;color:#718096;font-size:.875rem}.active-overrides p,.risk-timeline>p{margin:0;padding:1rem;color:#718096}.risk-timeline article{display:grid;grid-template-columns:2.75rem minmax(0,1fr) auto;align-items:center;gap:.75rem;border-bottom:1px solid #edf1f4;padding:.75rem 1rem}.risk-timeline article>i{display:inline-grid;min-height:2.1rem;place-items:center;border-radius:4px;background:#ffe0e2;color:#ae3039;font-style:normal;font-weight:900}.risk-timeline article>i.negative{background:#e4f4ea;color:#237047}.risk-timeline strong,.risk-timeline small{display:block}.risk-timeline small{margin-top:.2rem;color:#718096;font-size:.875rem}.risk-timeline article>span{color:#526575;font-size:.875rem;font-weight:800}.detail-empty,.empty-state{display:grid;min-height:12rem;place-content:center;justify-items:center;gap:.5rem;padding:1rem;color:#718096;text-align:center}.detail-empty :global(svg){font-size:2rem}.detail-empty span{font-size:.875rem}button:disabled{cursor:not-allowed;opacity:.5}
@container(min-width:40rem){.entity-metrics{grid-template-columns:repeat(3,minmax(0,1fr))}.entity-filters{grid-template-columns:11rem 12rem minmax(12rem,1fr) auto}.quick-controls{grid-template-columns:minmax(7rem,.6fr) minmax(9rem,.8fr) minmax(12rem,1.6fr) auto}.quick-controls .reason-input,.quick-controls button{grid-column:auto}}
@container(min-width:70rem){.entity-metrics{grid-template-columns:repeat(6,minmax(0,1fr))}.entity-layout{grid-template-columns:minmax(26rem,.9fr) minmax(31rem,1.1fr)}.entity-detail{position:sticky;top:1rem;max-height:calc(100vh - 2rem);overflow:auto}}
@container(max-width:32rem){.list-header{display:none}.subject-row{grid-template-columns:2.5rem minmax(0,1fr) 1.5rem}.subject-row time{grid-column:2}.risk-timeline article{grid-template-columns:2.75rem minmax(0,1fr)}.risk-timeline article>span{grid-column:2}.entity-metrics small{white-space:normal}}
</style>
