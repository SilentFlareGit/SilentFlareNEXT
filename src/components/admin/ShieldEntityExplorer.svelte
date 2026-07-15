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
	cursor: number;
	id: string;
	createdAt: number;
	delta: number;
	scoreBefore: number;
	scoreAfter: number;
	reasonCode: string;
	reason: string;
	source: string;
	actor: string;
	scoreKind: "raw" | "effective";
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
type Evidence = {
	id: number;
	evidenceType: string;
	displayValue: string;
	firstSeenAt: number;
	lastSeenAt: number;
	observationCount: number;
	confidence: number;
};
type LinkedSubject = {
	id: number;
	subjectType: "account" | "ip";
	displayValue: string;
	currentScore: number;
	riskLevel: string;
	firstSeenAt: number;
	lastSeenAt: number;
	requestCount: number;
	authenticatedCount: number;
	confidence: number;
};
type SubjectDetail = Subject & {
	effectiveScore: number;
	ledger: LedgerEntry[];
	ledgerTotal: number;
	ledgerHasMore: boolean;
	ledgerNextCursor?: number;
	overrides: Override[];
	evidence: Evidence[];
	linkedSubjects: LinkedSubject[];
	posture?: {
		accountLabel?: string;
		role?: string;
		countryCode?: string;
		emailVerified?: number;
		twoFactorEnabled?: number;
		disabled?: number;
		activeSessionCount?: number;
		commentCount?: number;
		lastSeenAt?: number;
	};
	intelligence?: {
		countryCode?: string;
		region?: string;
		regionCode?: string;
		city?: string;
		asn?: string;
		networkPrefix?: string;
		countrySource?: string;
		regionSource?: string;
		asnSource?: string;
		countryConfidence?: string;
		regionConfidence?: string;
		asnConfidence?: string;
		conflictFields?: string[];
		observedIps?: number;
		observedCountries?: number;
	};
};
type SubjectType = {
	key: string;
	label: string;
	total: number;
	elevated: number;
	maximumScore: number;
};

let { csrf }: { csrf: string } = $props();
let subjects = $state<Subject[]>([]);
let subjectTypes = $state<SubjectType[]>([]);
let selected = $state<SubjectDetail | null>(null);
let typeFilter = $state("");
let minimumScore = $state(0);
let query = $state("");
let loading = $state(true);
let detailLoading = $state(false);
let ledgerLoading = $state(false);
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
const subjectTypeIcons: Record<string, string> = {
	account: "material-symbols:person-outline-rounded",
	ip: "material-symbols:lan-outline-rounded",
	session: "material-symbols:login-rounded",
	device: "material-symbols:devices-outline-rounded",
	cidr: "material-symbols:lan-outline-rounded",
	asn: "material-symbols:hub-outline-rounded",
	email: "material-symbols:mail-outline-rounded",
	email_domain: "material-symbols:alternate-email-rounded",
	api_key: "material-symbols:key-outline-rounded",
	country: "material-symbols:map-outline-rounded",
	region: "material-symbols:map-outline-rounded",
};
const totalSubjects = $derived(
	subjectTypes.reduce((total, item) => total + item.total, 0),
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
		const response = await api<{ items: Subject[]; types: SubjectType[] }>(
			`/entities?${parameters}`,
		);
		subjects = response.items;
		subjectTypes = response.types;
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

async function chooseType(value: string) {
	typeFilter = value;
	selected = null;
	await loadSubjects();
}

async function chooseMinimum(value: number) {
	minimumScore = value;
	selected = null;
	await loadSubjects();
}

async function openSubject(subject: { id: number }) {
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

async function loadOlderLedger() {
	if (!selected?.ledgerHasMore || !selected.ledgerNextCursor) return;
	ledgerLoading = true;
	try {
		const page = await api<{
			items: LedgerEntry[];
			hasMore: boolean;
			nextCursor?: number;
		}>(
			`/entities/${selected.id}/ledger?before=${selected.ledgerNextCursor}&limit=100`,
		);
		selected = {
			...selected,
			ledger: [...selected.ledger, ...page.items],
			ledgerHasMore: page.hasMore,
			ledgerNextCursor: page.nextCursor,
		};
	} catch (cause) {
		error =
			cause instanceof Error
				? cause.message
				: "Older score changes could not be loaded";
	} finally {
		ledgerLoading = false;
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
	<section class="filters" aria-label="Subject filters">
		<header><strong>Subject type</strong><span>{totalSubjects} total</span></header>
		<div class="type-grid" role="group" aria-label="Subject type">
			<button class:active={typeFilter === ""} type="button" onclick={() => chooseType("")} disabled={loading}>
				<span class="type-icon"><Icon icon="material-symbols:select-all-rounded" /></span>
				<span class="type-label"><strong>All</strong><small>{totalSubjects}</small></span>
			</button>
			{#each subjectTypes as item (item.key)}
				<button class:active={typeFilter === item.key} type="button" onclick={() => chooseType(item.key)} disabled={loading}>
					<span class="type-icon"><Icon icon={subjectTypeIcons[item.key] ?? "material-symbols:category-outline-rounded"} /></span>
					<span class="type-label"><strong>{item.label}</strong><small>{item.total}</small></span>
				</button>
			{/each}
		</div>
		<div class="filter-tools">
			<div class="score-filter">
				<span>Minimum score</span>
				<div role="group" aria-label="Minimum score">
					{#each [{ value: 0, label: "All" }, { value: 30, label: "30+" }, { value: 50, label: "50+" }, { value: 65, label: "65+" }, { value: 80, label: "80+" }] as item}
						<button class:active={minimumScore === item.value} type="button" onclick={() => chooseMinimum(item.value)} disabled={loading}>{item.label}</button>
					{/each}
				</div>
			</div>
			<form
				class="search-filter"
				onsubmit={(event) => {
					event.preventDefault();
					loadSubjects();
				}}
			>
				<label><span>Search</span><input bind:value={query} placeholder="Masked value or account label" /></label>
				<button class="primary icon-command" type="submit" disabled={loading}>
					<Icon icon="material-symbols:search-rounded" />
					<span>Find</span>
				</button>
			</form>
		</div>
	</section>

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

					{#if selected.intelligence}
						<section class="intelligence" aria-label="Network intelligence">
							<div><small>Country</small><strong>{selected.intelligence.countryCode || "Unknown"}</strong><span>{selected.intelligence.countryConfidence || "unknown"} / {selected.intelligence.countrySource || "no source"}</span></div>
							<div><small>Region</small><strong>{selected.intelligence.region || "Unknown"}{selected.intelligence.regionCode ? ` (${selected.intelligence.regionCode})` : ""}</strong><span>{selected.intelligence.regionConfidence || "unknown"} / {selected.intelligence.regionSource || "no source"}</span></div>
							<div><small>ASN</small><strong>{selected.intelligence.asn || (selected.subjectType === "asn" ? selected.displayValue : "Unknown")}</strong><span>{selected.intelligence.asnConfidence || "unknown"} / {selected.intelligence.asnSource || `${selected.intelligence.observedIps || 0} observed IPs`}</span></div>
							<div><small>{selected.subjectType === "asn" ? "Coverage" : "Prefix"}</small><strong>{selected.subjectType === "asn" ? `${selected.intelligence.observedCountries || 0} countries` : selected.intelligence.networkPrefix || "Not resolved"}</strong><span>{selected.intelligence.conflictFields?.length ? `Conflict: ${selected.intelligence.conflictFields.join(", ")}` : "No source conflict"}</span></div>
						</section>
					{/if}

					{#if selected.posture}
						<section class="posture" aria-label="Account posture">
							<div><small>Account</small><strong>{selected.posture.accountLabel || selected.displayValue}</strong><span>{selected.posture.role || "user"}</span></div>
							<div><small>Email</small><strong>{selected.posture.emailVerified ? "Verified" : "Unverified"}</strong><span>{selected.posture.countryCode || "No region"}</span></div>
							<div><small>Two-factor</small><strong>{selected.posture.twoFactorEnabled ? "Enabled" : "Disabled"}</strong><span>{selected.posture.disabled ? "Account disabled" : "Account active"}</span></div>
							<div><small>Activity</small><strong>{selected.posture.activeSessionCount || 0} sessions</strong><span>{selected.posture.commentCount || 0} comments</span></div>
						</section>
					{/if}

					<section class="detail-section linked-section">
						<header><h3>{selected.subjectType === "account" ? "Linked IP addresses" : "Linked accounts"}</h3><span>{selected.linkedSubjects.length}</span></header>
						{#if selected.linkedSubjects.length === 0}
							<p class="empty-line">No authenticated relationship has been observed.</p>
						{:else}
							<div class="linked-list">
								{#each selected.linkedSubjects as linked (linked.id)}
									<button type="button" onclick={() => openSubject(linked)}>
										<span class={`score ${linked.riskLevel}`}>{linked.currentScore}</span>
										<span><strong>{linked.displayValue}</strong><small>{linked.requestCount} requests / {linked.confidence}% confidence</small></span>
										<time>{formatTime(linked.lastSeenAt)}</time>
										<Icon icon="material-symbols:chevron-right-rounded" />
									</button>
								{/each}
							</div>
						{/if}
					</section>

					<section class="detail-section evidence-section">
						<header><h3>Observed evidence</h3><span>{selected.evidence.length}</span></header>
						{#if selected.evidence.length === 0}
							<p class="empty-line">No supporting evidence has been observed.</p>
						{:else}
							<div class="evidence-list">
								{#each selected.evidence as item (item.id)}
									<div>
										<span class="evidence-icon"><Icon icon={subjectTypeIcons[item.evidenceType] ?? "material-symbols:fact-check-outline-rounded"} /></span>
										<span><strong>{item.displayValue || typeLabel(item.evidenceType)}</strong><small>{typeLabel(item.evidenceType)} / {item.observationCount} observations / {item.confidence}% confidence</small></span>
										<time>{formatTime(item.lastSeenAt)}</time>
									</div>
								{/each}
							</div>
						{/if}
					</section>

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
					<header><h3>Risk ledger</h3><span>{selected.ledger.length} of {selected.ledgerTotal}</span></header>
					{#if selected.ledger.length === 0}
						<p class="empty-line">No score changes recorded.</p>
					{:else}
						<div class="ledger">
							{#each selected.ledger as entry (entry.id)}
								<article>
									<span class:negative={entry.delta < 0} class="delta">{entry.delta > 0 ? `+${entry.delta}` : entry.delta}</span>
									<div><strong>{entry.reason}</strong><small>{entry.scoreKind} score / {entry.reasonCode.replaceAll("_", " ")} / {entry.source} / {entry.actor}</small><time>{formatTime(entry.createdAt)}</time></div>
									<b>{entry.scoreBefore} -&gt; {entry.scoreAfter}</b>
								</article>
							{/each}
						</div>
						{#if selected.ledgerHasMore}
							<button class="load-older" onclick={loadOlderLedger} disabled={ledgerLoading}>{ledgerLoading ? "Loading..." : "Load older changes"}</button>
						{/if}
					{/if}
				</section>
			{/if}
		</section>
	</div>
</section>

<style>
	:global(*) { box-sizing: border-box; }
	.subjects-workspace { min-width: 0; }
	.intelligence, .posture { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-bottom: 1px solid #d7e0e7; background: #f8fbfd; }
	.intelligence > div, .posture > div { min-width: 0; padding: .75rem; border-right: 1px solid #e2e9ee; border-bottom: 1px solid #e2e9ee; }
	.intelligence > div:nth-child(2n), .posture > div:nth-child(2n) { border-right: 0; }
	.intelligence small, .intelligence span, .posture small, .posture span { display: block; color: #63798b; font-size: .72rem; overflow-wrap: anywhere; }
	.intelligence strong, .posture strong { display: block; margin: .18rem 0; color: #183247; font-size: .86rem; overflow-wrap: anywhere; }
	.filters { display: grid; gap: .75rem; margin-bottom: 1rem; border: 1px solid #d7e0e7; background: #fff; padding: .75rem; }
	.filters > header { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; }
	.filters > header strong { font-size: .8rem; }
	.filters > header span { color: #718398; font-size: .75rem; }
	.type-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .375rem; }
	.type-grid button { display: grid; grid-template-columns: 1.25rem minmax(0, 1fr); gap: .5rem; align-items: center; min-width: 0; border: 1px solid #d4dee6; background: #f9fbfc; color: #4d6275; padding: .45rem .6rem; text-align: left; }
	.type-grid button:hover { border-color: #8dbbd9; background: #f1f8fc; }
	.type-grid button.active { border-color: #2584c4; background: #eaf5fc; color: #176fa9; box-shadow: inset 0 0 0 1px #2584c4; }
	.type-icon { display: inline-grid; width: 1.25rem; height: 1.25rem; place-items: center; }
	.type-icon :global(svg) { width: 1.15rem; height: 1.15rem; }
	.type-label { display: flex; min-width: 0; align-items: center; justify-content: space-between; gap: .35rem; }
	.type-grid button strong { overflow: hidden; font-size: .75rem; text-overflow: ellipsis; white-space: nowrap; }
	.type-grid button small { flex: 0 0 auto; color: #718398; font-size: .6875rem; font-variant-numeric: tabular-nums; }
	.filter-tools { display: grid; gap: .75rem; border-top: 1px solid #e3e9ee; padding-top: .75rem; }
	.score-filter { display: grid; gap: .35rem; }
	.score-filter > span { color: #56697c; font-size: .75rem; font-weight: 700; }
	.score-filter > div { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); border: 1px solid #cbd7e1; border-radius: .375rem; overflow: hidden; }
	.score-filter button { min-width: 0; min-height: 2.75rem; border: 0; border-right: 1px solid #d7e0e7; border-radius: 0; background: #fff; color: #5a6f82; font-size: .75rem; font-weight: 700; }
	.score-filter button:last-child { border-right: 0; }
	.score-filter button.active { background: #237fc1; color: #fff; }
	.search-filter { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: .5rem; align-items: end; }
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
	.linked-list button { width: 100%; display: grid; grid-template-columns: 2.5rem minmax(0, 1fr) auto 1.25rem; gap: .75rem; align-items: center; border: 0; border-top: 1px solid #edf1f4; border-radius: 0; background: #fff; color: #182738; padding: .75rem 1rem; text-align: left; }
	.linked-list button:hover { background: #f2f8fc; }
	.linked-list button > span:nth-child(2), .evidence-list > div > span:nth-child(2) { display: grid; min-width: 0; gap: .2rem; }
	.linked-list small, .linked-list time, .evidence-list small, .evidence-list time { color: #718398; font-size: .75rem; }
	.linked-list time { display: none; }
	.evidence-list > div { display: grid; grid-template-columns: 2.5rem minmax(0, 1fr); gap: .75rem; align-items: center; border-top: 1px solid #edf1f4; padding: .75rem 1rem; }
	.evidence-icon { display: inline-grid; width: 2.5rem; height: 2.5rem; place-items: center; border-radius: .25rem; background: #edf4f8; color: #4b6d83; }
	.evidence-icon :global(svg) { width: 1.25rem; height: 1.25rem; }
	.evidence-list time { grid-column: 2; }
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
	.load-older { width: calc(100% - 2rem); margin: .75rem 1rem; border: 1px solid #cbd7e1; background: #fff; color: #425b70; font-weight: 700; }

	@media (min-width: 48rem) {
		.filter-tools { grid-template-columns: minmax(16rem, .8fr) minmax(18rem, 1.2fr); align-items: end; }
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
		.linked-list time { display: block; }
		.evidence-list > div { grid-template-columns: 2.5rem minmax(0, 1fr) auto; }
		.evidence-list time { grid-column: 3; }
	}

	@media (min-width: 64rem) {
		.intelligence, .posture { grid-template-columns: repeat(4, minmax(0, 1fr)); }
		.intelligence > div, .posture > div { border-bottom: 0; }
		.intelligence > div:nth-child(2), .posture > div:nth-child(2) { border-right: 1px solid #e2e9ee; }
		.intelligence > div:last-child, .posture > div:last-child { border-right: 0; }
	}
</style>
