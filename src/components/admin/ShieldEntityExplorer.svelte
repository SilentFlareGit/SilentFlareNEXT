<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";

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
type Override = {
	id: number;
	overrideType: string;
	value?: number;
	reason: string;
	createdAt: number;
	createdBy: string;
	expiresAt?: number;
	revokedAt?: number;
};
type SubjectDetail = Subject & {
	effectiveScore: number;
	ledger: LedgerEntry[];
	overrides: Override[];
};

let { csrf }: { csrf: string } = $props();
let subjects = $state<Subject[]>([]);
let selected = $state<SubjectDetail | null>(null);
let typeFilter = $state("");
let minimumScore = $state(0);
let query = $state("");
let loading = $state(true);
let detailLoading = $state(false);
let saving = $state(false);
let error = $state("");
let action = $state("adjust");
let amount = $state(10);
let duration = $state(86400);
let reason = $state("");

const activeOverrides = $derived(
	selected?.overrides.filter(
		(item) =>
			!item.revokedAt &&
			(!item.expiresAt || item.expiresAt > Date.now() / 1000),
	) ?? [],
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

async function loadSubjects() {
	loading = true;
	try {
		const parameters = new URLSearchParams({
			minimum_score: String(minimumScore),
			limit: "200",
		});
		if (typeFilter) parameters.set("subject_type", typeFilter);
		if (query.trim()) parameters.set("query", query.trim());
		const response = await api<{ items: Subject[] }>(`/entities?${parameters}`);
		subjects = response.items;
		error = "";
		if (selected && !subjects.some((item) => item.id === selected?.id))
			selected = null;
	} catch (cause) {
		error =
			cause instanceof Error ? cause.message : "Subjects could not be loaded";
	} finally {
		loading = false;
	}
}

async function openSubject(subject: Subject) {
	detailLoading = true;
	try {
		selected = await api<SubjectDetail>(`/entities/${subject.id}`);
		error = "";
	} catch (cause) {
		error =
			cause instanceof Error
				? cause.message
				: "Subject details could not be loaded";
	} finally {
		detailLoading = false;
	}
}

async function saveControl() {
	if (!selected || !reason.trim()) return;
	saving = true;
	try {
		if (action === "adjust") {
			await api(`/entities/${selected.id}/adjust`, {
				method: "POST",
				body: JSON.stringify({
					delta: Number(amount),
					reason: reason.trim(),
					duration_seconds: Number(duration),
				}),
			});
		} else {
			await api(`/entities/${selected.id}/overrides`, {
				method: "POST",
				body: JSON.stringify({
					override_type: action,
					value:
						action === "response_exemption" ? null : Math.abs(Number(amount)),
					reason: reason.trim(),
					duration_seconds: Number(duration),
				}),
			});
		}
		reason = "";
		await openSubject(selected);
		await loadSubjects();
	} catch (cause) {
		error =
			cause instanceof Error
				? cause.message
				: "Subject control could not be saved";
	} finally {
		saving = false;
	}
}

async function revokeOverride(item: Override) {
	if (!selected || !window.confirm("Revoke this manual control?")) return;
	saving = true;
	try {
		await api(`/overrides/${item.id}/revoke`, {
			method: "POST",
			body: JSON.stringify({ reason: "Revoked from the subject workspace" }),
		});
		await openSubject(selected);
		await loadSubjects();
	} catch (cause) {
		error =
			cause instanceof Error
				? cause.message
				: "Manual control could not be revoked";
	} finally {
		saving = false;
	}
}

function formatTime(timestamp?: number) {
	if (!timestamp) return "Never";
	return new Intl.DateTimeFormat(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
	}).format(timestamp * 1000);
}

function typeLabel(value: string) {
	return value.replaceAll("_", " ");
}

onMount(loadSubjects);
</script>

<section class="subjects-workspace" class:detail-open={selected !== null}>
	<form
		class="filters"
		onsubmit={(event) => {
			event.preventDefault();
			loadSubjects();
		}}
	>
		<label>
			<span>Subject type</span>
			<select bind:value={typeFilter}>
				<option value="">All types</option>
				{#each ["account", "session", "device", "ip", "cidr", "asn", "email", "email_domain", "api_key", "country", "region"] as item}
					<option value={item}>{typeLabel(item)}</option>
				{/each}
			</select>
		</label>
		<label>
			<span>Minimum score</span>
			<select bind:value={minimumScore}>
				<option value={0}>All scores</option>
				<option value={30}>Observe, 30+</option>
				<option value={50}>Verify, 50+</option>
				<option value={65}>Restrict, 65+</option>
				<option value={80}>Block, 80+</option>
			</select>
		</label>
		<label class="search-field">
			<span>Search</span>
			<input bind:value={query} placeholder="Masked value or account label" />
		</label>
		<button class="primary icon-command" type="submit" disabled={loading}>
			<Icon icon="material-symbols:search-rounded" />
			<span>Find</span>
		</button>
	</form>

	{#if error}<div class="notice error" role="alert">{error}</div>{/if}

	<div class="subject-layout">
		<section class="subject-list" aria-label="Risk subjects">
			<header>
				<div><strong>Subjects</strong><span>{subjects.length}</span></div>
				<button class="icon-button" title="Refresh subjects" aria-label="Refresh subjects" onclick={loadSubjects} disabled={loading}>
					<Icon icon="material-symbols:refresh-rounded" />
				</button>
			</header>
			<div class="list-columns" aria-hidden="true"><span>Risk</span><span>Subject</span><span>Last change</span></div>
			<div class="rows">
				{#if loading}
					<div class="empty">Loading subjects...</div>
				{:else if subjects.length === 0}
					<div class="empty">No subjects match these filters.</div>
				{:else}
					{#each subjects as subject (subject.id)}
						<button class="subject-row" class:selected={selected?.id === subject.id} onclick={() => openSubject(subject)}>
							<span class={`score ${subject.riskLevel}`}>{subject.currentScore}</span>
							<span class="identity"><strong>{subject.displayValue}</strong><small>{typeLabel(subject.subjectType)} / {subject.riskLevel}</small></span>
							<time>{formatTime(subject.lastChangedAt)}</time>
							<Icon class="chevron" icon="material-symbols:chevron-right-rounded" />
						</button>
					{/each}
				{/if}
			</div>
		</section>

		<section class="subject-detail" aria-label="Selected subject">
			{#if detailLoading}
				<div class="empty">Loading subject history...</div>
			{:else if !selected}
				<div class="detail-placeholder">
					<Icon icon="material-symbols:manage-search-rounded" />
					<strong>Select a subject</strong>
				</div>
			{:else}
				<header class="detail-header">
					<button class="back-button" onclick={() => (selected = null)} aria-label="Back to subjects">
						<Icon icon="material-symbols:arrow-back-rounded" />
					</button>
					<span class={`score large ${selected.riskLevel}`}>{selected.effectiveScore}</span>
					<div>
						<small>{typeLabel(selected.subjectType)}</small>
						<h2>{selected.displayValue}</h2>
						<p>Raw {selected.currentScore} / Effective {selected.effectiveScore} / {selected.riskLevel}</p>
					</div>
					<button class="close-button" onclick={() => (selected = null)} aria-label="Close subject details">
						<Icon icon="material-symbols:close-rounded" />
					</button>
				</header>

				<form
					class="manual-control"
					onsubmit={(event) => {
						event.preventDefault();
						saveControl();
					}}
				>
					<h3>Manual control</h3>
					<div class="control-fields">
						<label>
							<span>Action</span>
							<select bind:value={action}>
								<option value="adjust">Adjust score</option>
								<option value="score_cap">Maximum score</option>
								<option value="score_floor">Minimum score</option>
								<option value="response_exemption">Response exemption</option>
							</select>
						</label>
						{#if action !== "response_exemption"}
							<label>
								<span>{action === "adjust" ? "Adjustment" : "Score"}</span>
								<input type="number" min={action === "adjust" ? -100 : 0} max="100" bind:value={amount} required />
							</label>
						{/if}
						<label>
							<span>Duration</span>
							<select bind:value={duration}>
								<option value={3600}>1 hour</option>
								<option value={21600}>6 hours</option>
								<option value={86400}>24 hours</option>
								<option value={604800}>7 days</option>
								<option value={2592000}>30 days</option>
							</select>
						</label>
						<label class="reason-field">
							<span>Audit reason</span>
							<input bind:value={reason} minlength="3" maxlength="300" required placeholder="Required" />
						</label>
						<button class="primary" type="submit" disabled={saving || !reason.trim()}>
							{saving ? "Saving..." : "Apply"}
						</button>
					</div>
				</form>

				<section class="detail-section">
					<header><h3>Active controls</h3><span>{activeOverrides.length}</span></header>
					{#if activeOverrides.length === 0}
						<p class="empty-line">No active manual controls.</p>
					{:else}
						<div class="override-list">
							{#each activeOverrides as item (item.id)}
								<div>
									<span><strong>{typeLabel(item.overrideType)}</strong><small>{item.value === null || item.value === undefined ? "Exempt" : item.value}</small></span>
									<p>{item.reason}</p>
									<time>{item.expiresAt ? `Until ${formatTime(item.expiresAt)}` : "No expiry"}</time>
									<button class="icon-button" title="Revoke control" aria-label="Revoke control" onclick={() => revokeOverride(item)} disabled={saving}>
										<Icon icon="material-symbols:delete-outline-rounded" />
									</button>
								</div>
							{/each}
						</div>
					{/if}
				</section>

				<section class="detail-section ledger-section">
					<header><h3>Risk ledger</h3><span>{selected.ledger.length}</span></header>
					{#if selected.ledger.length === 0}
						<p class="empty-line">No score changes recorded.</p>
					{:else}
						<div class="ledger">
							{#each selected.ledger as entry (entry.id)}
								<article>
									<span class:negative={entry.delta < 0} class="delta">{entry.delta > 0 ? `+${entry.delta}` : entry.delta}</span>
									<div><strong>{entry.reason}</strong><small>{entry.reasonCode.replaceAll("_", " ")} / {entry.source} / {entry.actor}</small><time>{formatTime(entry.createdAt)}</time></div>
									<b>{entry.scoreBefore} -&gt; {entry.scoreAfter}</b>
								</article>
							{/each}
						</div>
					{/if}
				</section>
			{/if}
		</section>
	</div>
</section>

<style>
	:global(*) { box-sizing: border-box; }
	.subjects-workspace { min-width: 0; }
	.filters { display: grid; grid-template-columns: 1fr; gap: .75rem; margin-bottom: 1rem; }
	label { display: grid; gap: .35rem; min-width: 0; }
	label > span { color: #56697c; font-size: .75rem; font-weight: 700; }
	input, select, button { font: inherit; letter-spacing: 0; }
	input, select { width: 100%; min-height: 2.75rem; border: 1px solid #cbd7e1; border-radius: .375rem; background: #fff; color: #172536; padding: .65rem .75rem; }
	input:focus, select:focus { outline: 2px solid #2f8fd5; outline-offset: 1px; border-color: transparent; }
	button { min-height: 2.75rem; border-radius: .375rem; cursor: pointer; }
	button:disabled { cursor: not-allowed; opacity: .55; }
	.primary { border: 1px solid #237fc1; background: #237fc1; color: #fff; font-weight: 700; padding: .65rem 1rem; }
	.icon-command { display: inline-flex; align-items: center; justify-content: center; gap: .45rem; align-self: end; }
	.icon-command :global(svg), .icon-button :global(svg), .back-button :global(svg), .close-button :global(svg) { width: 1.2rem; height: 1.2rem; }
	.notice { margin-bottom: 1rem; border-left: .25rem solid #c74452; background: #fff1f2; color: #7e2430; padding: .75rem 1rem; }
	.subject-layout { display: grid; min-width: 0; border: 1px solid #d7e0e7; background: #fff; }
	.subject-list, .subject-detail { min-width: 0; }
	.subject-list > header { min-height: 3.25rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8ed; padding: 0 .75rem 0 1rem; }
	.subject-list > header div { display: flex; align-items: center; gap: .5rem; }
	.subject-list > header span, .detail-section > header span { color: #74879a; font-size: .75rem; }
	.icon-button, .back-button, .close-button { display: inline-grid; place-items: center; min-width: 2.75rem; width: 2.75rem; border: 1px solid #d2dde5; background: #fff; color: #536a7e; }
	.list-columns { display: none; }
	.rows { max-height: 46rem; overflow: auto; }
	.subject-row { position: relative; width: 100%; display: grid; grid-template-columns: 2.5rem minmax(0, 1fr) auto; gap: .75rem; align-items: center; border: 0; border-bottom: 1px solid #e8edf1; border-radius: 0; background: #fff; color: #182738; padding: .75rem 2.25rem .75rem .75rem; text-align: left; }
	.subject-row:hover, .subject-row.selected { background: #f2f8fc; }
	.score { display: inline-grid; place-items: center; width: 2.5rem; height: 2.5rem; border-radius: .25rem; background: #e5f3ea; color: #187348; font-weight: 800; font-variant-numeric: tabular-nums; }
	.score.observe { background: #fff3cd; color: #735b00; }
	.score.verify, .score.restrict { background: #ffe6d2; color: #9a4512; }
	.score.block { background: #ffe0e3; color: #b52f40; }
	.score.large { width: 3.5rem; height: 3.5rem; font-size: 1.125rem; }
	.identity { display: grid; min-width: 0; gap: .2rem; }
	.identity strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.identity small, .subject-row time { color: #718398; font-size: .75rem; }
	.subject-row time { display: none; }
	.chevron { position: absolute; right: .75rem; width: 1.15rem; color: #8293a4; }
	.empty, .detail-placeholder { min-height: 12rem; display: grid; place-items: center; color: #718398; padding: 2rem; text-align: center; }
	.detail-placeholder { align-content: center; gap: .75rem; }
	.detail-placeholder :global(svg) { width: 2rem; height: 2rem; }
	.subject-detail { display: none; }
	.detail-open .subject-list { display: none; }
	.detail-open .subject-detail { display: block; }
	.detail-header { display: grid; grid-template-columns: auto auto minmax(0, 1fr) auto; gap: .75rem; align-items: center; border-bottom: 1px solid #dfe7ed; padding: 1rem; }
	.detail-header h2 { margin: .1rem 0; overflow-wrap: anywhere; font-size: 1.125rem; }
	.detail-header small, .detail-header p { margin: 0; color: #6c7e91; font-size: .75rem; text-transform: capitalize; }
	.close-button { display: none; }
	.manual-control { border-bottom: 1px solid #dfe7ed; background: #f7fafc; padding: 1rem; }
	h3 { margin: 0; font-size: .875rem; }
	.control-fields { display: grid; grid-template-columns: 1fr; gap: .75rem; margin-top: .75rem; }
	.detail-section { border-bottom: 1px solid #dfe7ed; }
	.detail-section > header { min-height: 3rem; display: flex; align-items: center; justify-content: space-between; padding: 0 1rem; }
	.empty-line { margin: 0; border-top: 1px solid #edf1f4; color: #718398; padding: 1rem; }
	.override-list > div { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: .35rem 1rem; border-top: 1px solid #edf1f4; padding: .75rem 1rem; }
	.override-list span { display: flex; gap: .5rem; align-items: baseline; text-transform: capitalize; }
	.override-list small, .override-list p, .override-list time { color: #718398; font-size: .75rem; }
	.override-list p, .override-list time { grid-column: 1; margin: 0; }
	.override-list .icon-button { grid-column: 2; grid-row: 1 / 4; align-self: center; }
	.ledger article { display: grid; grid-template-columns: 2.75rem minmax(0, 1fr); gap: .75rem; border-top: 1px solid #edf1f4; padding: .875rem 1rem; }
	.delta { display: inline-grid; place-items: center; align-self: start; min-height: 2rem; border-radius: .25rem; background: #ffe0e3; color: #b52f40; font-weight: 800; }
	.delta.negative { background: #e5f3ea; color: #187348; }
	.ledger article div { display: grid; min-width: 0; gap: .2rem; }
	.ledger strong { overflow-wrap: anywhere; }
	.ledger small, .ledger time, .ledger b { color: #718398; font-size: .75rem; font-weight: 500; }
	.ledger b { grid-column: 2; }

	@media (min-width: 48rem) {
		.filters { grid-template-columns: minmax(9rem, .8fr) minmax(9rem, .8fr) minmax(14rem, 2fr) auto; align-items: end; }
		.subject-layout { grid-template-columns: minmax(20rem, 40%) minmax(0, 60%); min-height: 38rem; }
		.subject-list { display: block !important; border-right: 1px solid #d7e0e7; }
		.subject-detail { display: block !important; }
		.list-columns { display: grid; grid-template-columns: 2.5rem minmax(0, 1fr) 7rem; gap: .75rem; border-bottom: 1px solid #e2e8ed; background: #f7f9fb; color: #718398; padding: .55rem .75rem; font-size: .6875rem; font-weight: 700; text-transform: uppercase; }
		.subject-row { grid-template-columns: 2.5rem minmax(0, 1fr) 7rem; }
		.subject-row time { display: block; }
		.back-button { display: none; }
		.close-button { display: inline-grid; }
		.detail-header { grid-template-columns: auto minmax(0, 1fr) auto; }
		.control-fields { grid-template-columns: minmax(8rem, 1fr) minmax(6rem, .7fr) minmax(8rem, .9fr) minmax(12rem, 1.6fr) auto; align-items: end; }
		.reason-field { min-width: 0; }
		.ledger article { grid-template-columns: 2.75rem minmax(0, 1fr) auto; align-items: center; }
		.ledger b { grid-column: 3; grid-row: 1; }
	}
</style>
