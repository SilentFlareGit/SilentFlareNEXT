<script lang="ts">
import Icon from "@iconify/svelte";
import { onDestroy, onMount } from "svelte";

type RiskEvent = {
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
	review_status: string;
};
type RiskAccount = {
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
	manualDelta: number;
	adjustmentReason?: string;
	adjustmentExpiresAt?: number;
	lastSeenAt?: number;
};
type RatePolicy = {
	id: number;
	name: string;
	host?: string;
	path: string;
	method?: string;
	dimension: string;
	algorithm: string;
	limitValue: number;
	windowSeconds: number;
	cooldownSeconds: number;
	action: string;
	enabled: number;
};
type ServiceControl = {
	host: string;
	protectionEnabled: number;
	mode: "observe" | "enforce";
	failPolicy: "open" | "closed" | "route";
	connected: boolean;
	status: string;
};
type GeoPolicy = {
	id: number;
	countryCode: string;
	region?: string;
	scopeHost?: string;
	action: string;
	enabled: number;
	note?: string;
	expiresAt?: number;
};
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
	recentEvents: RiskEvent[];
	riskyAccounts: RiskAccount[];
	policies: RatePolicy[];
	services: ServiceControl[];
	geoPolicies: GeoPolicy[];
	geoOptions: Array<{
		countryCode: string;
		region?: string;
		observations: number;
	}>;
	sync: { status: string; recordCount: number; completedAt: number };
	generatedAt: number;
};

let { csrf }: { csrf: string } = $props();
let dashboard = $state<Dashboard | null>(null);
let activeView = $state<
	"overview" | "automation" | "services" | "geography" | "accounts"
>("overview");
let loading = $state(true);
let saving = $state("");
let error = $state("");
let success = $state("");
let rangeHours = $state(24);
let geoCountry = $state("");
let geoRegion = $state("");
let geoHost = $state("");
let geoAction = $state("turnstile");
let timer: number | undefined;
const maxRequests = $derived(
	Math.max(1, ...(dashboard?.series.map((item) => item.requests) ?? [1])),
);
const countryOptions = $derived([
	...new Set(
		dashboard?.geoOptions.map((item) => item.countryCode).filter(Boolean) ?? [],
	),
]);
const regionOptions = $derived(
	dashboard?.geoOptions
		.filter((item) => item.countryCode === geoCountry && item.region)
		.map((item) => item.region as string) ?? [],
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

async function mutate(
	key: string,
	operation: () => Promise<unknown>,
	message: string,
) {
	saving = key;
	try {
		await operation();
		await loadDashboard(true);
		error = "";
		success = message;
		window.setTimeout(() => {
			success = "";
		}, 3000);
	} catch (cause) {
		error = cause instanceof Error ? cause.message : "Shield update failed";
	} finally {
		saving = "";
	}
}

async function syncAccounts() {
	await mutate(
		"sync",
		() => shieldApi("/sync/accounts", { method: "POST", body: "{}" }),
		"Account projection synchronized.",
	);
}

async function eventAction(eventId: string, action: "block_ip" | "dismiss") {
	await mutate(
		`event-${eventId}`,
		() =>
			shieldApi(`/events/${encodeURIComponent(eventId)}/action`, {
				method: "POST",
				body: JSON.stringify({ action, duration_seconds: 21600 }),
			}),
		action === "block_ip"
			? "Source IP blocked for six hours."
			: "Risk event dismissed.",
	);
}

async function saveService(service: ServiceControl) {
	if (
		service.connected &&
		service.protectionEnabled &&
		service.mode === "enforce" &&
		!window.confirm(
			`Enable enforcement for ${service.host}? Live requests can be blocked.`,
		)
	)
		return;
	await mutate(
		`service-${service.host}`,
		() =>
			shieldApi(`/services/${encodeURIComponent(service.host)}`, {
				method: "PUT",
				body: JSON.stringify({
					protection_enabled: Boolean(service.protectionEnabled),
					mode: service.mode,
					fail_policy: service.failPolicy,
				}),
			}),
		`${service.host} protection updated.`,
	);
}

async function savePolicy(policy: RatePolicy) {
	await mutate(
		`policy-${policy.id}`,
		() =>
			shieldApi(`/rate-policies/${policy.id}`, {
				method: "PUT",
				body: JSON.stringify({
					enabled: Boolean(policy.enabled),
					limit_value: Number(policy.limitValue),
					window_seconds: Number(policy.windowSeconds),
					action: policy.action,
					cooldown_seconds: Number(policy.cooldownSeconds),
				}),
			}),
		`${policy.name} updated.`,
	);
}

async function createGeoPolicy() {
	if (!geoCountry) return;
	await mutate(
		"geo-create",
		() =>
			shieldApi("/geo-policies", {
				method: "POST",
				body: JSON.stringify({
					country_code: geoCountry,
					region: geoRegion || null,
					scope_host: geoHost || null,
					action: geoAction,
					note: "Created from Security geography control",
				}),
			}),
		"Geographic policy activated.",
	);
	geoRegion = "";
}

async function disableGeoPolicy(policy: GeoPolicy) {
	await mutate(
		`geo-${policy.id}`,
		() => shieldApi(`/geo-policies/${policy.id}`, { method: "DELETE" }),
		"Geographic policy disabled.",
	);
}

async function adjustAccount(account: RiskAccount, delta: number) {
	const reason =
		delta === 0
			? "Manual adjustment cleared"
			: delta > 0
				? "Administrator risk escalation"
				: "Administrator trusted-history adjustment";
	await mutate(
		`account-${account.id}`,
		() =>
			shieldApi(`/accounts/${encodeURIComponent(account.id)}/risk`, {
				method: "PUT",
				body: JSON.stringify({ delta, reason, duration_seconds: 86400 }),
			}),
		`@${account.label} risk adjusted.`,
	);
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
	<header class="shield-toolbar">
		<div><p class="eyebrow">SILENTFLARE SHIELD</p><h1>Security operations</h1><p>Live posture · {dashboard?.metrics.uniqueIps ?? 0} sources · {dashboard?.metrics.activeBans ?? 0} active bans</p></div>
		<div class="commands"><label>Window<select bind:value={rangeHours} onchange={() => loadDashboard()}><option value={24}>24 hours</option><option value={72}>3 days</option><option value={168}>7 days</option></select></label><button class="secondary" onclick={syncAccounts} disabled={saving === "sync"}><Icon icon="material-symbols:sync-rounded"/>Sync</button><button class="icon-command" title="Refresh" aria-label="Refresh" onclick={() => loadDashboard()}><Icon icon="material-symbols:refresh-rounded"/></button></div>
	</header>
	<nav class="security-tabs" aria-label="Security views">
		<button class:active={activeView === "overview"} onclick={() => (activeView = "overview")}><Icon icon="material-symbols:visibility-lock-outline-rounded"/>Overview</button>
		<button class:active={activeView === "automation"} onclick={() => (activeView = "automation")}><Icon icon="material-symbols:shield-lock-outline-rounded"/>Automation</button>
		<button class:active={activeView === "services"} onclick={() => (activeView = "services")}><Icon icon="material-symbols:devices-outline-rounded"/>Services</button>
		<button class:active={activeView === "geography"} onclick={() => (activeView = "geography")}><Icon icon="material-symbols:travel-explore-rounded"/>Geography</button>
		<button class:active={activeView === "accounts"} onclick={() => (activeView = "accounts")}><Icon icon="material-symbols:group-outline-rounded"/>Accounts</button>
	</nav>
	{#if error}<div class="notice error"><Icon icon="material-symbols:warning-outline-rounded"/>{error}</div>{/if}
	{#if success}<div class="notice success"><Icon icon="material-symbols:check-circle-outline-rounded"/>{success}</div>{/if}
	{#if loading && !dashboard}<div class="loading"><span></span>Loading security telemetry...</div>{:else if dashboard}
		<div class="status-line"><span class:observe={dashboard.mode === "observe"} class:enforce={dashboard.mode === "enforce"}>{dashboard.mode}</span><p>Account projection {dashboard.sync.status} · {formatTime(dashboard.generatedAt)}</p></div>

		{#if activeView === "overview"}
			<div class="metric-grid"><div><span>Requests</span><strong>{compact(dashboard.metrics.requests)}</strong><small>Current window</small></div><div><span>High risk</span><strong>{compact(dashboard.metrics.highRisk)}</strong><small>Score 60+</small></div><div><span>Blocked</span><strong>{compact(dashboard.metrics.blocked)}</strong><small>Policy decisions</small></div><div><span>Challenges</span><strong>{compact(dashboard.metrics.challenged)}</strong><small>Verification required</small></div><div><span>Risky accounts</span><strong>{compact(dashboard.metrics.riskyAccounts)}</strong><small>{dashboard.metrics.accounts} synchronized</small></div></div>
			<section class="panel trend-panel"><div class="panel-head"><div><h2>Traffic and risk</h2><p>Hourly gateway activity</p></div><span>{dashboard.rangeHours}h</span></div><div class="trend">{#each dashboard.series as point}<div class="bar-slot" title={`${formatTime(point.timestamp)} · ${point.requests} requests`}><i style={`height:${Math.max(3, (point.requests / maxRequests) * 100)}%`}><b style={`height:${point.requests ? (point.highRisk / point.requests) * 100 : 0}%`}></b></i></div>{/each}</div><div class="legend"><span><i></i>Requests</span><span><i class="risk"></i>High risk</span></div></section>
			<div class="two-column"><section class="panel"><div class="panel-head"><div><h2>Risk geography</h2><p>Traffic concentration</p></div><button class="text-command" onclick={() => (activeView = "geography")}>Manage</button></div><div class="rank-list">{#each dashboard.topCountries as item}<div><strong>{item.label}</strong><i><b style={`width:${Math.min(100, item.value / Math.max(1, dashboard.topCountries[0]?.value ?? 1) * 100)}%`}></b></i><span>{item.value}</span><small>risk {item.averageRisk}</small></div>{/each}</div></section><section class="panel"><div class="panel-head"><div><h2>Service posture</h2><p>Gateway coverage</p></div><button class="text-command" onclick={() => (activeView = "services")}>Manage</button></div><div class="service-summary">{#each dashboard.services as service}<div><i class:live={service.status === "protected"} class:staged={service.status === "staged"}></i><strong>{service.host}</strong><span>{service.status}</span></div>{/each}</div></section></div>
			<section class="panel"><div class="panel-head"><div><h2>Risk decisions</h2><p>Latest evaluated requests</p></div></div><div class="table-scroll"><table><thead><tr><th>Risk</th><th>Request</th><th>Source</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead><tbody>{#each dashboard.recentEvents as event}<tr><td><span class={`risk-score ${event.risk_level}`}>{event.risk_score}</span></td><td><strong>{event.method} {event.path}</strong><small>{event.host} · {formatTime(event.created_at)}</small></td><td><strong>{event.country_code || "Unknown"}</strong><small>{event.ip_masked}</small></td><td><span class="reason">{event.reasons[0] || "Telemetry observation"}</span></td><td><span class="review">{event.review_status}</span></td><td><div class="row-actions"><button class="danger-action" title="Block source for 6 hours" onclick={() => eventAction(event.id, "block_ip")} disabled={saving === `event-${event.id}`}><Icon icon="material-symbols:delete-forever-outline-rounded"/>Ban</button><button title="Dismiss event" onclick={() => eventAction(event.id, "dismiss")} disabled={saving === `event-${event.id}`}><Icon icon="material-symbols:check-circle-outline-rounded"/>Dismiss</button></div></td></tr>{/each}</tbody></table></div></section>
		{:else if activeView === "automation"}
			<div class="section-heading"><div><p class="eyebrow">AUTOMATED RESPONSE</p><h2>Rate and abuse policies</h2></div><span>{dashboard.policies.filter((item) => item.enabled).length} active</span></div>
			<section class="panel policy-editor"><div class="policy-header"><span>Policy</span><span>Threshold</span><span>Window</span><span>Response</span><span>Cooldown</span><span>State</span><span></span></div>{#each dashboard.policies as policy}<div class="policy-row"><div><strong>{policy.name}</strong><small>{policy.dimension} · {policy.path}</small></div><label><span>Threshold</span><input type="number" min="1" bind:value={policy.limitValue}/></label><label><span>Window</span><select bind:value={policy.windowSeconds}><option value={60}>1 minute</option><option value={300}>5 minutes</option><option value={900}>15 minutes</option><option value={3600}>1 hour</option><option value={86400}>1 day</option></select></label><label><span>Response</span><select bind:value={policy.action}><option value="log">Log</option><option value="delay">Delay</option><option value="turnstile">Turnstile</option><option value="rate_limit">Rate limit</option><option value="temporary_ban">Temporary ban</option><option value="block">Block</option></select></label><label><span>Cooldown</span><select bind:value={policy.cooldownSeconds}><option value={60}>1 minute</option><option value={300}>5 minutes</option><option value={1800}>30 minutes</option><option value={21600}>6 hours</option><option value={86400}>1 day</option></select></label><label class="toggle"><input type="checkbox" bind:checked={policy.enabled}/><span>{policy.enabled ? "On" : "Off"}</span></label><button class="save-command" title={`Save ${policy.name}`} onclick={() => savePolicy(policy)} disabled={saving === `policy-${policy.id}`}><Icon icon="material-symbols:save-outline-rounded"/></button></div>{/each}</section>
		{:else if activeView === "services"}
			<div class="section-heading"><div><p class="eyebrow">SERVICE PERIMETER</p><h2>Protected services</h2></div><span>{dashboard.services.filter((item) => item.protectionEnabled).length} enabled</span></div>
			<section class="panel service-controls">{#each dashboard.services as service}<div class="service-control"><div class="service-identity"><i class:connected={service.connected}></i><div><strong>{service.host}</strong><small>{service.connected ? "Traffic connected to Shield" : "Upstream configured · routing not connected"}</small></div></div><label class="toggle"><input type="checkbox" bind:checked={service.protectionEnabled}/><span>{service.protectionEnabled ? "Protection on" : "Bypass"}</span></label><label><span>Mode</span><select bind:value={service.mode}><option value="observe">Observe</option><option value="enforce">Enforce</option></select></label><label><span>Failure</span><select bind:value={service.failPolicy}><option value="open">Fail open</option><option value="closed">Fail closed</option><option value="route">Route policy</option></select></label><button class="save-command" title={`Save ${service.host}`} onclick={() => saveService(service)} disabled={saving === `service-${service.host}`}><Icon icon="material-symbols:save-outline-rounded"/></button></div>{/each}</section>
		{:else if activeView === "geography"}
			<div class="section-heading"><div><p class="eyebrow">LOCATION POLICY</p><h2>Countries and regions</h2></div><span>{dashboard.geoPolicies.filter((item) => item.enabled).length} active</span></div>
			<section class="panel geo-create"><label><span>Country</span><select bind:value={geoCountry} onchange={() => (geoRegion = "")}><option value="">Select observed country</option>{#each countryOptions as country}<option value={country}>{country}</option>{/each}</select></label><label><span>Region</span><select bind:value={geoRegion} disabled={!geoCountry}><option value="">All regions</option>{#each regionOptions as region}<option value={region}>{region}</option>{/each}</select></label><label><span>Service</span><select bind:value={geoHost}><option value="">All protected services</option>{#each dashboard.services as service}<option value={service.host}>{service.host}</option>{/each}</select></label><label><span>Action</span><select bind:value={geoAction}><option value="turnstile">Require Turnstile</option><option value="block">Block all access</option><option value="read_only">Read-only access</option><option value="block_login">Block login</option><option value="block_register">Block registration</option><option value="block_comment">Block comments</option><option value="block_api">Block API</option><option value="block_admin">Block Admin</option></select></label><button class="primary-command" onclick={createGeoPolicy} disabled={!geoCountry || saving === "geo-create"}><Icon icon="material-symbols:add-rounded"/>Add policy</button></section>
			<section class="panel"><div class="table-scroll"><table><thead><tr><th>Location</th><th>Service</th><th>Action</th><th>Status</th><th>Expires</th><th></th></tr></thead><tbody>{#each dashboard.geoPolicies as policy}<tr><td><strong>{policy.countryCode}{policy.region ? ` · ${policy.region}` : ""}</strong></td><td>{policy.scopeHost || "All services"}</td><td>{policy.action.replaceAll("_", " ")}</td><td><span class="review">{policy.enabled ? "active" : "disabled"}</span></td><td>{policy.expiresAt ? formatTime(policy.expiresAt) : "Permanent"}</td><td><button class="icon-command" title="Disable policy" onclick={() => disableGeoPolicy(policy)} disabled={!policy.enabled || saving === `geo-${policy.id}`}><Icon icon="material-symbols:do-not-disturb-on-outline-rounded"/></button></td></tr>{/each}</tbody></table></div></section>
		{:else if activeView === "accounts"}
			<div class="section-heading"><div><p class="eyebrow">ACCOUNT RISK</p><h2>Synchronized account posture</h2></div><span>{dashboard.riskyAccounts.length} accounts</span></div>
			<section class="panel account-controls">{#each dashboard.riskyAccounts as account}<div class="account-row"><span class={`risk-score ${account.riskLevel}`}>{account.riskScore}</span><div class="account-identity"><strong>@{account.label}</strong><small>{account.riskReasons[0] || "Normal account posture"}</small></div><div class="account-facts"><span class:ok={account.emailVerified}>Email</span><span class:ok={account.twoFactorEnabled}>2FA</span><span>{account.activeSessions} sessions</span><span>{account.comments} comments</span></div><div class="risk-actions"><button title="Reduce risk by 20 for 24 hours" onclick={() => adjustAccount(account, -20)} disabled={saving === `account-${account.id}`}><Icon icon="material-symbols:do-not-disturb-on-outline-rounded"/>20</button><button class="danger-action" title="Increase risk by 20 for 24 hours" onclick={() => adjustAccount(account, 20)} disabled={saving === `account-${account.id}`}><Icon icon="material-symbols:add-rounded"/>20</button><button title="Clear manual adjustment" onclick={() => adjustAccount(account, 0)} disabled={saving === `account-${account.id}`}><Icon icon="material-symbols:refresh-rounded"/>Reset</button></div></div>{/each}</section>
		{/if}
	{/if}
</section>

<style>
.shield-workspace{display:grid;gap:1rem;color:#182230}.shield-toolbar{display:flex;flex-direction:column;gap:1rem}.shield-toolbar h1{margin:.2rem 0;font-size:1.65rem}.shield-toolbar p{margin:0;color:#687b8d;font-size:.875rem}.eyebrow{margin:0!important;color:#287dbf!important;font-size:.7rem!important;font-weight:800}.commands{display:flex;flex-wrap:wrap;gap:.5rem}.commands label,.geo-create label,.service-control>label,.policy-row label{display:flex;min-height:2.75rem;align-items:center;gap:.45rem;border:1px solid #d4dfe8;border-radius:6px;background:white;padding:0 .7rem;color:#687b8d;font-size:.78rem}.commands select,.geo-create select,.service-control select,.policy-row select,.policy-row input{min-width:0;border:0;background:white;font:inherit;font-weight:700;outline:0}.commands button,.text-command,.save-command,.primary-command,.row-actions button,.risk-actions button{display:inline-flex;min-height:2.75rem;align-items:center;justify-content:center;gap:.35rem;border:1px solid #cfdbe5;border-radius:6px;background:white;padding:0 .75rem;color:#304356;font-weight:700;cursor:pointer}.icon-command,.save-command{width:2.75rem;padding:0!important;border:1px solid #cfdbe5;border-radius:6px;background:white;color:#526575}.security-tabs{display:flex;overflow-x:auto;border-bottom:1px solid #cad8e3;gap:.25rem}.security-tabs button{display:inline-flex;min-width:max-content;min-height:2.9rem;align-items:center;gap:.4rem;border:0;border-bottom:3px solid transparent;background:transparent;padding:0 .85rem;color:#627587;font-weight:700}.security-tabs button.active{border-bottom-color:#318bd0;color:#196fae}.notice,.loading{display:flex;min-height:3rem;align-items:center;gap:.6rem;border:1px solid #efc9c9;border-radius:6px;background:#fff4f4;padding:.75rem;color:#a73333}.notice.success{border-color:#bde3cf;background:#effaf4;color:#237047}.loading{border-color:#dce5ed;background:white;color:#617487}.loading span{width:1.2rem;height:1.2rem;border:2px solid #d5e1ea;border-top-color:#4b9fe8;border-radius:50%;animation:spin .8s linear infinite}.status-line{display:flex;align-items:center;gap:.7rem}.status-line>span{border-radius:4px;background:#eef2f5;padding:.3rem .5rem;color:#526575;font-size:.68rem;font-weight:800;text-transform:uppercase}.status-line>span.observe{background:#fff1c7;color:#825c08}.status-line>span.enforce{background:#ddf3e6;color:#1d6a40}.status-line p{margin:0;color:#718096;font-size:.76rem}.metric-grid{display:grid;grid-template-columns:1fr;border:1px solid #d5e0e8;border-radius:8px;background:white}.metric-grid>div{padding:1rem;border-bottom:1px solid #e4ebf0}.metric-grid>div:last-child{border:0}.metric-grid span,.metric-grid strong,.metric-grid small{display:block}.metric-grid span{color:#617487;font-size:.75rem}.metric-grid strong{margin:.3rem 0;font-size:1.55rem}.metric-grid small{color:#82909d;font-size:.72rem}.panel{min-width:0;border:1px solid #d5e0e8;border-radius:8px;background:white}.panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;border-bottom:1px solid #e6edf2;padding:1rem}.panel-head h2,.section-heading h2{margin:0;font-size:1rem}.panel-head p{margin:.3rem 0 0;color:#718096;font-size:.76rem}.panel-head>span,.section-heading>span{color:#718096;font-size:.72rem}.text-command{min-height:2rem!important;border:0!important;padding:0!important;color:#287dbf!important}.trend{display:flex;height:12rem;align-items:end;gap:2px;padding:1rem}.bar-slot{display:flex;height:100%;min-width:2px;flex:1;align-items:end}.bar-slot>i{position:relative;display:block;width:100%;min-height:3px;overflow:hidden;border-radius:2px 2px 0 0;background:#73b8e5}.bar-slot b{position:absolute;right:0;bottom:0;left:0;background:#df5964}.legend{display:flex;gap:1rem;padding:0 1rem 1rem;color:#718096;font-size:.72rem}.legend span{display:flex;align-items:center;gap:.35rem}.legend i{width:.65rem;height:.65rem;border-radius:2px;background:#73b8e5}.legend i.risk{background:#df5964}.two-column{display:grid;grid-template-columns:1fr;gap:1rem}.rank-list,.service-summary{display:grid;padding:.55rem 1rem}.rank-list>div{display:grid;grid-template-columns:3.5rem minmax(3rem,1fr) 2rem 3.2rem;align-items:center;gap:.5rem;min-height:2.5rem;font-size:.75rem}.rank-list>div>i{height:.42rem;overflow:hidden;border-radius:2px;background:#e8eef2}.rank-list b{display:block;height:100%;background:#318bd0}.rank-list small{color:#718096}.service-summary>div{display:flex;min-height:2.8rem;align-items:center;gap:.6rem;border-bottom:1px solid #edf1f4}.service-summary>div:last-child{border:0}.service-summary i,.service-identity>i{width:.55rem;height:.55rem;flex:0 0 auto;border-radius:50%;background:#aab5bf}.service-summary i.live,.service-identity>i.connected{background:#32a064}.service-summary i.staged{background:#e5a52c}.service-summary span{margin-left:auto;color:#718096;font-size:.7rem;text-transform:capitalize}.table-scroll{overflow:auto}table{width:100%;border-collapse:collapse;white-space:nowrap}th,td{padding:.72rem .8rem;border-bottom:1px solid #edf1f4;text-align:left;font-size:.75rem}th{background:#f7fafc;color:#687b8d;font-size:.68rem;text-transform:uppercase}td strong,td small{display:block}td small{margin-top:.2rem;color:#718096}.reason{display:block;max-width:17rem;overflow:hidden;text-overflow:ellipsis}.risk-score{display:inline-grid;width:2.2rem;height:2.2rem;flex:0 0 auto;place-items:center;border-radius:4px;background:#e4f4ea;color:#237047;font-size:.76rem;font-weight:800}.risk-score.observe{background:#fff2ce;color:#825c08}.risk-score.verify{background:#ffe8ce;color:#9a5310}.risk-score.restrict,.risk-score.block{background:#ffe0e2;color:#ae3039}.review{border-radius:4px;background:#eef3f7;padding:.25rem .4rem;color:#617487;font-size:.68rem;text-transform:capitalize}.row-actions,.risk-actions{display:flex;gap:.35rem}.row-actions button,.risk-actions button{min-height:2.5rem;padding:0 .6rem;font-size:.72rem}.danger-action{border-color:#efcaca!important;background:#fff4f4!important;color:#aa3038!important}.section-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:1rem;padding:.35rem 0}.section-heading h2{margin-top:.25rem;font-size:1.15rem}.policy-editor{overflow:hidden}.policy-header,.policy-row{display:grid;grid-template-columns:minmax(12rem,2fr) repeat(5,minmax(7rem,1fr)) 2.75rem;align-items:center;gap:.65rem;padding:.75rem 1rem}.policy-header{background:#f7fafc;color:#687b8d;font-size:.68rem;font-weight:800;text-transform:uppercase}.policy-row{border-top:1px solid #e7edf2}.policy-row>div strong,.policy-row>div small{display:block}.policy-row>div small{margin-top:.2rem;color:#718096;font-size:.7rem}.policy-row label>span,.service-control>label>span{display:none}.policy-row input{width:4rem}.toggle{justify-content:center}.toggle input{width:1rem}.service-controls{overflow:hidden}.service-control{display:grid;grid-template-columns:minmax(15rem,2fr) minmax(8rem,1fr) minmax(7rem,1fr) minmax(7rem,1fr) 2.75rem;align-items:center;gap:.7rem;padding:1rem;border-bottom:1px solid #e7edf2}.service-control:last-child{border:0}.service-identity{display:flex;align-items:center;gap:.7rem}.service-identity strong,.service-identity small{display:block}.service-identity small{margin-top:.25rem;color:#718096;font-size:.72rem}.geo-create{display:grid;grid-template-columns:1fr;gap:.65rem;padding:1rem}.geo-create label{justify-content:space-between}.geo-create label>span{font-weight:700}.primary-command{border-color:#318bd0!important;background:#318bd0!important;color:white!important}.account-controls{overflow:hidden}.account-row{display:grid;grid-template-columns:2.2rem minmax(10rem,1.5fr) minmax(14rem,1fr) auto;align-items:center;gap:.8rem;padding:1rem;border-bottom:1px solid #e7edf2}.account-row:last-child{border:0}.account-identity strong,.account-identity small{display:block}.account-identity small{margin-top:.25rem;color:#718096;font-size:.72rem}.account-facts{display:flex;flex-wrap:wrap;gap:.3rem}.account-facts span{border-radius:4px;background:#f0f3f6;padding:.2rem .4rem;color:#687b8d;font-size:.66rem}.account-facts span.ok{background:#e3f4e9;color:#237047}button:disabled{cursor:not-allowed;opacity:.5}@keyframes spin{to{transform:rotate(360deg)}}
@media(min-width:640px){.metric-grid{grid-template-columns:repeat(2,1fr)}.metric-grid>div{border-right:1px solid #e4ebf0}.metric-grid>div:last-child{grid-column:1/-1}.shield-toolbar{align-items:flex-end;justify-content:space-between;flex-direction:row}.geo-create{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1024px){.metric-grid{grid-template-columns:repeat(5,1fr)}.metric-grid>div,.metric-grid>div:last-child{grid-column:auto;border-bottom:0}.two-column{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.geo-create{grid-template-columns:repeat(4,minmax(0,1fr)) auto}}
@media(max-width:1100px){.policy-header{display:none}.policy-row{grid-template-columns:1fr 1fr}.policy-row>div{grid-column:1/-1}.policy-row label>span,.service-control>label>span{display:block}.policy-row .save-command{justify-self:end}.service-control{grid-template-columns:1fr 1fr}.service-identity{grid-column:1/-1}.service-control .save-command{justify-self:end}.account-row{grid-template-columns:2.2rem 1fr}.account-facts,.risk-actions{grid-column:2}}
@media(max-width:600px){.commands{display:grid;grid-template-columns:1fr auto auto}.commands label{min-width:0}.security-tabs button{padding:0 .65rem}.metric-grid{grid-template-columns:1fr 1fr}.metric-grid>div:last-child{grid-column:1/-1}.account-row{grid-template-columns:2.2rem minmax(0,1fr)}.risk-actions{flex-wrap:wrap}.geo-create{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){.loading span{animation:none}}
</style>
