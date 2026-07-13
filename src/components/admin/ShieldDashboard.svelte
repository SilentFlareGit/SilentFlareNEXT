<script lang="ts">
import Icon from "@iconify/svelte";
import { onDestroy, onMount } from "svelte";

type Dashboard = {
	mode: "bypass" | "observe" | "enforce";
	rangeHours: number;
	metrics: Record<string, number>;
	series: Array<{
		timestamp: number;
		requests: number;
		highRisk: number;
		limited: number;
	}>;
	topCountries: Array<{ label: string; value: number; averageRisk: number }>;
	topAsns: Array<{ label: string; value: number; maximumRisk: number }>;
	recentEvents: Array<{
		id: string;
		created_at: number;
		risk_level: string;
		risk_score: number;
		host: string;
		path: string;
		method: string;
		ip_masked: string;
		country_code?: string;
		reasons: string[];
		actions: string[];
		review_status: string;
	}>;
	riskyAccounts: Array<{
		id: string;
		label: string;
		role: string;
		country?: string;
		emailVerified: number;
		twoFactorEnabled: number;
		disabled: number;
		activeSessions: number;
		comments: number;
		riskScore: number;
		riskLevel: string;
		riskReasons: string[];
		lastSeenAt?: number;
	}>;
	policies: Array<{
		id: number;
		name: string;
		path: string;
		dimension: string;
		algorithm: string;
		limitValue: number;
		windowSeconds: number;
		action: string;
		enabled: number;
	}>;
	services: Array<{ host: string; status: string }>;
	sync: { status: string; recordCount: number; completedAt: number };
	generatedAt: number;
};

let { csrf }: { csrf: string } = $props();
let dashboard = $state<Dashboard | null>(null);
let loading = $state(true);
let error = $state("");
let rangeHours = $state(24);
let timer: number | undefined;
const maxRequests = $derived(
	Math.max(1, ...(dashboard?.series.map((item) => item.requests) ?? [1])),
);

async function shieldApi<T>(path: string, init: RequestInit = {}) {
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
	const body = (await response.json().catch(() => ({}))) as { detail?: string };
	if (!response.ok)
		throw new Error(body.detail ?? `Shield API ${response.status}`);
	return body as T;
}

async function loadDashboard(quiet = false) {
	if (!quiet) loading = true;
	try {
		dashboard = await shieldApi<Dashboard>(
			`/dashboard?range_hours=${rangeHours}`,
		);
		error = "";
	} catch (cause) {
		error = cause instanceof Error ? cause.message : "Shield is unavailable";
	} finally {
		loading = false;
	}
}

async function syncAccounts() {
	loading = true;
	try {
		await shieldApi("/sync/accounts", { method: "POST", body: "{}" });
		await loadDashboard(true);
	} catch (cause) {
		error = cause instanceof Error ? cause.message : "Account sync failed";
	} finally {
		loading = false;
	}
}

async function eventAction(eventId: string, action: "block_ip" | "dismiss") {
	try {
		await shieldApi(`/events/${encodeURIComponent(eventId)}/action`, {
			method: "POST",
			body: JSON.stringify({ action, duration_seconds: 21600 }),
		});
		await loadDashboard(true);
	} catch (cause) {
		error = cause instanceof Error ? cause.message : "Risk action failed";
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

function compact(value = 0) {
	return new Intl.NumberFormat(undefined, {
		notation: "compact",
		maximumFractionDigits: 1,
	}).format(value);
}

onMount(() => {
	void loadDashboard();
	timer = window.setInterval(() => void loadDashboard(true), 30_000);
});
onDestroy(() => timer && window.clearInterval(timer));
</script>

<section class="shield-workspace">
	<div class="shield-toolbar">
		<div><p class="eyebrow">LIVE RISK CONTROL</p><h1>Security</h1><p>Automated gateway decisions, account posture, and active policies.</p></div>
		<div class="commands">
			<label>Window<select bind:value={rangeHours} onchange={() => loadDashboard()}><option value={24}>24 hours</option><option value={72}>3 days</option><option value={168}>7 days</option></select></label>
			<button class="secondary" onclick={syncAccounts} disabled={loading}><Icon icon="material-symbols:sync-rounded"/>Sync accounts</button>
			<button class="icon-command" title="Refresh dashboard" aria-label="Refresh dashboard" onclick={() => loadDashboard()}><Icon icon="material-symbols:refresh-rounded"/></button>
		</div>
	</div>

	{#if error}<div class="shield-notice"><Icon icon="material-symbols:warning-outline-rounded"/>{error}</div>{/if}
	{#if loading && !dashboard}<div class="loading"><span></span>Loading live risk telemetry...</div>{:else if dashboard}
		<div class="status-line"><span class:observe={dashboard.mode === "observe"} class:enforce={dashboard.mode === "enforce"}>{dashboard.mode}</span><p>{dashboard.sync.recordCount} accounts synchronized · updated {formatTime(dashboard.generatedAt)}</p></div>
		<div class="metric-grid">
			<div><span>Requests</span><strong>{compact(dashboard.metrics.requests)}</strong><small>Observed in this window</small></div>
			<div><span>High risk</span><strong>{compact(dashboard.metrics.highRisk)}</strong><small>Score 60 or higher</small></div>
			<div><span>Blocked</span><strong>{compact(dashboard.metrics.blocked)}</strong><small>Automatic decisions</small></div>
			<div><span>Unique IPs</span><strong>{compact(dashboard.metrics.uniqueIps)}</strong><small>{dashboard.metrics.activeBans} active bans</small></div>
			<div><span>Accounts</span><strong>{compact(dashboard.metrics.accounts)}</strong><small>{dashboard.metrics.riskyAccounts} need attention</small></div>
		</div>

		<section class="panel trend-panel"><div class="panel-head"><div><h2>Traffic and risk trend</h2><p>Hourly requests with high-risk activity highlighted.</p></div><span>{dashboard.rangeHours}h</span></div><div class="trend" aria-label="Hourly request volume">{#each dashboard.series as point}<div class="bar-slot" title={`${formatTime(point.timestamp)} · ${point.requests} requests · ${point.highRisk} high risk`}><i style={`height:${Math.max(3, (point.requests / maxRequests) * 100)}%`}><b style={`height:${point.requests ? (point.highRisk / point.requests) * 100 : 0}%`}></b></i></div>{/each}</div><div class="legend"><span><i></i>Requests</span><span><i class="risk"></i>High risk</span></div></section>

		<div class="two-column">
			<section class="panel"><div class="panel-head"><div><h2>Risk geography</h2><p>Highest traffic countries and network risk.</p></div></div><div class="rank-list">{#each dashboard.topCountries as item}<div><strong>{item.label}</strong><i><b style={`width:${Math.min(100, item.value / Math.max(1, dashboard.topCountries[0]?.value ?? 1) * 100)}%`}></b></i><span>{item.value}</span><small>avg {item.averageRisk}</small></div>{/each}</div></section>
			<section class="panel"><div class="panel-head"><div><h2>Service coverage</h2><p>Current Shield routing state.</p></div></div><div class="service-list">{#each dashboard.services as service}<div><i class:live={service.status === "protected"}></i><strong>{service.host}</strong><span>{service.status}</span></div>{/each}</div></section>
		</div>

		<section class="panel"><div class="panel-head"><div><h2>Recent risk decisions</h2><p>Actions use event context; no IP or account value needs to be entered.</p></div></div><div class="table-scroll"><table><thead><tr><th>Risk</th><th>Request</th><th>Source</th><th>Reason</th><th>Status</th><th></th></tr></thead><tbody>{#each dashboard.recentEvents as event}<tr><td><span class={`risk-score ${event.risk_level}`}>{event.risk_score}</span></td><td><strong>{event.method} {event.path}</strong><small>{event.host} · {formatTime(event.created_at)}</small></td><td><strong>{event.country_code || "Unknown"}</strong><small>{event.ip_masked}</small></td><td><span class="reason">{event.reasons[0] || "Telemetry observation"}</span></td><td><span class="review">{event.review_status}</span></td><td><div class="row-actions"><button title="Block this event IP for 6 hours" aria-label="Block this event IP for 6 hours" onclick={() => eventAction(event.id, "block_ip")}><Icon icon="material-symbols:block-rounded"/></button><button title="Dismiss event" aria-label="Dismiss event" onclick={() => eventAction(event.id, "dismiss")}><Icon icon="material-symbols:check-rounded"/></button></div></td></tr>{/each}</tbody></table></div></section>

		<div class="two-column">
			<section class="panel"><div class="panel-head"><div><h2>Account posture</h2><p>Automatically synchronized from FastAPI.</p></div></div><div class="account-list">{#each dashboard.riskyAccounts as account}<div><span class={`risk-score ${account.riskLevel}`}>{account.riskScore}</span><div><strong>@{account.label}</strong><small>{account.riskReasons[0] || "Normal account posture"}</small></div><div class="account-flags"><i class:ok={account.emailVerified}>Email</i><i class:ok={account.twoFactorEnabled}>2FA</i></div></div>{/each}</div></section>
			<section class="panel"><div class="panel-head"><div><h2>Automated policies</h2><p>Active protections run without manual targets.</p></div></div><div class="policy-list">{#each dashboard.policies as policy}<div><i class:enabled={policy.enabled}></i><div><strong>{policy.name}</strong><small>{policy.limitValue} per {policy.windowSeconds}s · {policy.dimension} · {policy.action.replaceAll("_", " ")}</small></div><span>{policy.enabled ? "Running" : "Paused"}</span></div>{/each}</div></section>
		</div>
	{/if}
</section>

<style>
.shield-workspace{display:grid;gap:1rem}.shield-toolbar{display:flex;flex-direction:column;gap:1rem}.shield-toolbar h1{margin:.2rem 0;font-size:1.75rem}.shield-toolbar p{margin:0;color:#718096}.eyebrow{font-size:.7rem!important;font-weight:800;color:#287dbf!important}.commands{display:flex;flex-wrap:wrap;gap:.5rem}.commands label{display:flex;min-height:2.75rem;align-items:center;gap:.5rem;border:1px solid #d4dfe8;border-radius:6px;background:white;padding:0 .7rem;color:#718096;font-size:.8rem}.commands select{border:0;background:white;font:inherit;font-weight:700}.commands button{display:inline-flex;min-height:2.75rem;align-items:center;justify-content:center;gap:.4rem;border:1px solid #cfdbe5;border-radius:6px;background:white;padding:0 .8rem;color:#304356;font-weight:700}.icon-command{width:2.75rem;padding:0!important}.shield-notice,.loading{display:flex;min-height:3rem;align-items:center;gap:.6rem;border:1px solid #efc9c9;border-radius:6px;background:#fff4f4;padding:.75rem;color:#a73333}.loading{border-color:#dce5ed;background:white;color:#617487}.loading span{width:1.2rem;height:1.2rem;border:2px solid #d5e1ea;border-top-color:#4b9fe8;border-radius:50%;animation:spin .8s linear infinite}.status-line{display:flex;align-items:center;gap:.7rem}.status-line>span{border-radius:4px;background:#eef2f5;padding:.3rem .5rem;color:#526575;font-size:.7rem;font-weight:800;text-transform:uppercase}.status-line>span.observe{background:#fff5d8;color:#8a6516}.status-line>span.enforce{background:#e5f5eb;color:#247047}.status-line p{margin:0;color:#718096;font-size:.78rem}.metric-grid{display:grid;grid-template-columns:1fr;border:1px solid #dce5ed;border-radius:8px;background:white}.metric-grid>div{padding:1rem;border-bottom:1px solid #e5ebf0}.metric-grid>div:last-child{border:0}.metric-grid span,.metric-grid strong,.metric-grid small{display:block}.metric-grid span{color:#718096;font-size:.75rem}.metric-grid strong{margin:.3rem 0;font-size:1.45rem}.metric-grid small{color:#82909d}.panel{min-width:0;border:1px solid #dce5ed;border-radius:8px;background:white}.panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;border-bottom:1px solid #e8edf2;padding:1rem}.panel-head h2{margin:0;font-size:1rem}.panel-head p{margin:.3rem 0 0;color:#718096;font-size:.78rem}.panel-head>span{color:#718096;font-size:.75rem}.trend{display:flex;height:11rem;align-items:end;gap:2px;padding:1rem}.bar-slot{display:flex;height:100%;min-width:2px;flex:1;align-items:end}.bar-slot>i{position:relative;display:block;width:100%;min-height:3px;overflow:hidden;border-radius:2px 2px 0 0;background:#8dc7ec}.bar-slot b{position:absolute;right:0;bottom:0;left:0;background:#e35d67}.legend{display:flex;gap:1rem;padding:0 1rem 1rem;color:#718096;font-size:.72rem}.legend span{display:flex;align-items:center;gap:.35rem}.legend i{width:.65rem;height:.65rem;border-radius:2px;background:#8dc7ec}.legend i.risk{background:#e35d67}.two-column{display:grid;grid-template-columns:1fr;gap:1rem}.rank-list,.service-list,.account-list,.policy-list{display:grid;padding:.5rem 1rem}.rank-list>div{display:grid;grid-template-columns:3.5rem minmax(3rem,1fr) 2rem 3rem;align-items:center;gap:.5rem;min-height:2.4rem;font-size:.75rem}.rank-list>div>i{height:.4rem;overflow:hidden;border-radius:2px;background:#e8eef2}.rank-list b{display:block;height:100%;background:#4b9fe8}.rank-list small{color:#718096}.service-list>div,.policy-list>div,.account-list>div{display:flex;min-height:3.25rem;align-items:center;gap:.7rem;border-bottom:1px solid #edf1f4}.service-list>div:last-child,.policy-list>div:last-child,.account-list>div:last-child{border:0}.service-list>div>i,.policy-list>div>i{width:.55rem;height:.55rem;flex:0 0 auto;border-radius:50%;background:#aab5bf}.service-list>div>i.live,.policy-list>div>i.enabled{background:#40a66b}.service-list span,.policy-list span{margin-left:auto;color:#718096;font-size:.7rem;text-transform:capitalize}.policy-list div>div,.account-list div>div{min-width:0}.policy-list strong,.policy-list small,.account-list strong,.account-list small{display:block}.policy-list small,.account-list small{margin-top:.2rem;overflow:hidden;color:#718096;font-size:.7rem;text-overflow:ellipsis;white-space:nowrap}.table-scroll{overflow:auto}table{width:100%;border-collapse:collapse;white-space:nowrap}th,td{padding:.75rem;border-bottom:1px solid #edf1f4;text-align:left;font-size:.75rem}th{background:#f8fafc;color:#718096;font-size:.68rem;text-transform:uppercase}td strong,td small{display:block}td small{margin-top:.2rem;color:#718096}.reason{display:block;max-width:18rem;overflow:hidden;text-overflow:ellipsis}.risk-score{display:inline-grid;width:2rem;height:2rem;place-items:center;border-radius:4px;background:#e8f4ec;color:#237047;font-size:.75rem;font-weight:800}.risk-score.observe{background:#fff5d8;color:#8a6516}.risk-score.verify{background:#ffeed8;color:#a15a14}.risk-score.restrict,.risk-score.block{background:#ffe4e5;color:#b3343d}.review{border-radius:4px;background:#eef3f7;padding:.25rem .4rem;color:#617487;font-size:.68rem;text-transform:capitalize}.row-actions{display:flex;gap:.3rem}.row-actions button{display:grid;width:2.75rem;height:2.75rem;place-items:center;border:1px solid #d7e1e8;border-radius:6px;background:white;color:#526575;font-size:1rem}.account-flags{display:flex;gap:.25rem;margin-left:auto}.account-flags i{border-radius:4px;background:#fff0f0;padding:.2rem .35rem;color:#a73333;font-size:.65rem;font-style:normal}.account-flags i.ok{background:#e8f5ed;color:#237047}@keyframes spin{to{transform:rotate(360deg)}}
@media(min-width:640px){.metric-grid{grid-template-columns:repeat(2,1fr)}.metric-grid>div{border-right:1px solid #e5ebf0}.metric-grid>div:last-child{grid-column:1/-1}.shield-toolbar{align-items:flex-end;justify-content:space-between;flex-direction:row}}
@media(min-width:1024px){.metric-grid{grid-template-columns:repeat(5,1fr)}.metric-grid>div,.metric-grid>div:last-child{grid-column:auto;border-bottom:0}.two-column{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}}
@media(prefers-reduced-motion:reduce){.loading span{animation:none}}
</style>
