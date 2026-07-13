const state = { csrf: "", view: "overview", mode: "observe" };

const $ = (selector) => document.querySelector(selector);
const e = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
const formatTime = (value) => value ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value * 1000)) : "Never";

async function api(path, options = {}) {
	const headers = { ...(options.headers || {}) };
	if (options.body && typeof options.body !== "string") {
		headers["Content-Type"] = "application/json";
		options.body = JSON.stringify(options.body);
	}
	if (options.method && options.method !== "GET") headers["X-CSRF-Token"] = state.csrf;
	const response = await fetch(`/__shield/api/admin${path}`, { ...options, headers });
	const payload = await response.json().catch(() => ({}));
	if (response.status === 401) return showLogin();
	if (!response.ok) throw new Error(payload.detail || `Request failed (${response.status})`);
	return payload;
}

function showLogin() {
	$("#login").hidden = false;
	$("#workspace").hidden = true;
}

function showWorkspace(session) {
	state.csrf = session.csrfToken;
	state.mode = session.mode;
	$("#mode").value = session.mode;
	$("#login").hidden = true;
	$("#workspace").hidden = false;
	loadView(state.view);
}

function notice(message, type = "warning") {
	const element = $("#notice");
	element.hidden = !message;
	element.textContent = message;
	element.dataset.type = type;
}

function bars(rows) {
	if (!rows?.length) return '<div class="empty">No activity recorded</div>';
	const max = Math.max(...rows.map((row) => Number(row.value) || 0), 1);
	return rows.map((row) => `<div class="bar-row"><span>${e(row.label)}</span><div class="bar"><i style="width:${Math.max(3, (Number(row.value) / max) * 100)}%"></i></div><strong>${e(row.value)}</strong></div>`).join("");
}

async function overview() {
	const data = await api("/overview");
	state.mode = data.mode;
	$("#mode").value = data.mode;
	return `<div class="metric-grid">
		<div class="metric"><span>Risk events today</span><strong>${e(data.events)}</strong></div>
		<div class="metric"><span>High-risk blocks</span><strong>${e(data.blocked)}</strong></div>
		<div class="metric"><span>Verification decisions</span><strong>${e(data.challenged)}</strong></div>
		<div class="metric"><span>Active bans</span><strong>${e(data.activeBans)}</strong></div>
	</div>
	<div class="split"><section class="panel"><div class="panel-head"><h2>Highest-risk countries</h2></div>${bars(data.topCountries)}</section><section class="panel"><div class="panel-head"><h2>Top matched rules</h2></div>${bars(data.topRules)}</section></div>
	<section class="panel" style="margin-top:1rem"><div class="panel-head"><h2>Protected services</h2></div><div class="health-list">${data.hosts.map((host) => `<div class="health-row">${e(host)}</div>`).join("")}</div></section>`;
}

function scoreClass(score) { return score >= 60 ? "high" : score >= 40 ? "medium" : "low"; }

async function events() {
	const rows = await api("/events?limit=200");
	if (!rows.length) return '<div class="table-wrap"><div class="empty">No risk events recorded</div></div>';
	return `<div class="table-wrap"><table><thead><tr><th>Score</th><th>Time</th><th>Service</th><th>Request</th><th>Network</th><th>Location</th><th>Action</th></tr></thead><tbody>${rows.map((row) => `<tr><td><span class="score ${scoreClass(row.risk_score)}">${e(row.risk_score)}</span></td><td>${e(formatTime(row.created_at))}</td><td>${e(row.host)}</td><td class="path">${e(row.method)} ${e(row.path)}</td><td>${e(row.ip_masked)}<br>${e(row.asn || row.ip_type || "Unknown")}</td><td>${e(row.country_code || "Unknown")}</td><td>${e(JSON.parse(row.actions_json || "[]").join(", "))}</td></tr>`).join("")}</tbody></table></div>`;
}

async function intel() {
	const rows = await api("/intel");
	if (!rows.length) return '<div class="table-wrap"><div class="empty">No IP intelligence cached</div></div>';
	return `<div class="table-wrap"><table><thead><tr><th>Network</th><th>Location</th><th>ASN / ISP</th><th>Type</th><th>Signals</th><th>Last seen</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${e(row.ip_masked)}</td><td>${e([row.city, row.region, row.country_code].filter(Boolean).join(", ") || "Unknown")}</td><td>${e(row.asn || "Unknown")}<br>${e(row.isp || row.organization || "")}</td><td>${e(row.ip_type)}</td><td>${[row.is_vpn && "VPN", row.is_proxy && "Proxy", row.is_tor && "Tor", row.is_malicious && "Malicious"].filter(Boolean).map(e).join(", ") || "None"}</td><td>${e(formatTime(row.last_seen_at))}</td></tr>`).join("")}</tbody></table></div>`;
}

async function lists() {
	const rows = await api("/lists");
	return `<div class="table-toolbar"><span>${rows.length} list entries</span><button data-action="new-list">Add entry</button></div><div class="table-wrap">${rows.length ? `<table><thead><tr><th>Disposition</th><th>Subject</th><th>Value</th><th>Scope</th><th>Expiry</th><th></th></tr></thead><tbody>${rows.map((row) => `<tr><td>${e(row.kind)}</td><td>${e(row.subject_type)}</td><td>${e(row.subject_value)}</td><td>${e(row.scope_host || "All services")} ${e(row.scope_path || "")}</td><td>${e(formatTime(row.expires_at))}</td><td><button class="danger" data-disable-list="${row.id}">Disable</button></td></tr>`).join("")}</tbody></table>` : '<div class="empty">No access-list entries</div>'}</div>`;
}

async function limits() {
	const rows = await api("/rate-policies");
	return `<div class="table-wrap"><table><thead><tr><th>Policy</th><th>Scope</th><th>Dimension</th><th>Algorithm</th><th>Budget</th><th>Action</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${e(row.name)}</td><td>${e(row.host || "All services")} ${e(row.path_pattern)}</td><td>${e(row.dimension)}</td><td>${e(row.algorithm.replaceAll("_", " "))}</td><td>${e(row.limit_value)} / ${e(row.window_seconds)}s${row.burst ? ` + ${e(row.burst)} burst` : ""}</td><td>${e(row.action)}</td></tr>`).join("")}</tbody></table></div>`;
}

async function rules() {
	const rows = await api("/rules");
	return `<div class="table-toolbar"><span>${rows.length} rules</span><button data-action="new-rule">Create rule</button></div><div class="table-wrap">${rows.length ? `<table><thead><tr><th>Priority</th><th>Rule</th><th>Mode</th><th>Conditions</th><th>Actions</th><th>Hits</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${e(row.priority)}</td><td><strong>${e(row.name)}</strong><br>v${e(row.version)}</td><td>${row.enabled ? e(row.mode) : "disabled"}</td><td class="path"><code>${e(JSON.stringify(row.conditions))}</code></td><td>${e(row.actions.join(", "))}</td><td>${e(row.hit_count)}</td></tr>`).join("")}</tbody></table>` : '<div class="empty">No custom rules</div>'}</div>`;
}

async function bans() {
	const rows = await api("/bans");
	return `<div class="table-toolbar"><span>${rows.length} ban records</span><button data-action="new-ban">Create ban</button></div><div class="table-wrap">${rows.length ? `<table><thead><tr><th>Subject</th><th>Restriction</th><th>Reason</th><th>Created</th><th>Expiry</th><th>Status</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${e(row.subject_type)}: ${e(row.subject_display)}</td><td>${e(row.restriction)}</td><td>${e(row.reason)}</td><td>${e(formatTime(row.created_at))}</td><td>${e(formatTime(row.expires_at))}</td><td>${row.revoked_at ? "Revoked" : `<button class="danger" data-revoke-ban="${row.id}">Revoke</button>`}</td></tr>`).join("")}</tbody></table>` : '<div class="empty">No bans recorded</div>'}</div>`;
}

async function audit() {
	const rows = await api("/audit?limit=200");
	return `<div class="table-wrap">${rows.length ? `<table><thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Target</th><th>Details</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${e(formatTime(row.created_at))}</td><td>${e(row.actor)}</td><td>${e(row.action)}</td><td>${e(row.target_type)} ${e(row.target_id || "")}</td><td class="path"><code>${e(row.details_json)}</code></td></tr>`).join("")}</tbody></table>` : '<div class="empty">No administrative actions recorded</div>'}</div>`;
}

async function settings() {
	const data = await api("/settings/risk");
	const weightLabels = { vpn: "VPN", proxy: "Proxy", tor: "Tor", datacenter: "Data center", malicious_ip: "Known malicious IP", new_device: "New device", automation: "Automation browser", missing_headers: "Missing browser headers", abnormal_origin: "Abnormal origin", rate_exceeded: "Rate exceeded", deny_list: "Deny list", allow_list: "Allow list" };
	return `<div class="split"><section class="panel"><div class="panel-head"><h2>Risk weights</h2></div>${Object.entries(data.weights).map(([key, value]) => `<label>${e(weightLabels[key] || key)}<input data-risk-weight="${e(key)}" type="number" min="-100" max="100" value="${e(value)}" /></label>`).join("")}</section><section class="panel"><div class="panel-head"><h2>Risk thresholds</h2></div>${Object.entries(data.thresholds).map(([key, value]) => `<label>${e(key[0].toUpperCase() + key.slice(1))}<input data-risk-threshold="${e(key)}" type="number" min="1" max="100" value="${e(value)}" /></label>`).join("")}<button data-action="save-risk">Save risk model</button></section></div>`;
}

function placeholder(title, description) {
	return `<div class="placeholder"><h2>${e(title)}</h2><p>${e(description)}</p><div class="panel"><strong>Independent integration boundary</strong><p>Data is accepted only through Shield decisions, signed adapter metadata, and dedicated Shield APIs. Business databases remain untouched.</p></div></div>`;
}

const views = {
	overview,
	events,
	intel,
	regions: lists,
	limits,
	rules,
	bans,
	audit,
	accounts: () => placeholder("Account risk", "Account correlation becomes available when the FastAPI adapter supplies stable user IDs and security-state metadata."),
	devices: () => placeholder("Device risk", "Minimal browser signals are pseudonymized and used only as supporting evidence alongside IP and behavior."),
	content: () => placeholder("Content review", "Moderation decisions can be submitted through the dedicated content-evaluation API without copying Ghost content ownership."),
	sessions: () => placeholder("Session management", "Shield records token digests only and requests revocation through a signed FastAPI webhook."),
	admins: () => placeholder("Administrator security", "The console requires password plus TOTP, short sessions, CSRF validation, and append-only auditing."),
	alerts: () => placeholder("Alerts", "High-risk event notifications are delivered through configured webhooks with redacted payloads."),
	settings,
};

const titles = Object.fromEntries([...document.querySelectorAll(".nav-item")].map((item) => [item.dataset.view, item.textContent]));

async function loadView(view) {
	state.view = view;
	$("#view-title").textContent = titles[view] || "Overview";
	$("#content").innerHTML = '<div class="empty">Loading…</div>';
	document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === view));
	try {
		$("#content").innerHTML = await views[view]();
		$("#updated").textContent = `Updated ${new Intl.DateTimeFormat("en", { timeStyle: "medium" }).format(new Date())}`;
		notice("");
	} catch (error) {
		$("#content").innerHTML = '<div class="empty">Unable to load this view</div>';
		notice(error.message);
	}
}

function openEditor(kind) {
	const dialog = $("#editor");
	const fields = $("#editor-fields");
	dialog.dataset.kind = kind;
	if (kind === "list") {
		$("#editor-title").textContent = "Add access-list entry";
		fields.innerHTML = '<label>Disposition<select name="kind"><option value="deny">Deny</option><option value="allow">Allow</option></select></label><label>Subject type<select name="subject_type"><option>ip</option><option>cidr</option><option>asn</option><option>country</option><option>region</option><option>account</option></select></label><label>Value<input name="subject_value" required /></label><label>Service host<input name="scope_host" placeholder="All protected services" /></label><label>Path pattern<input name="scope_path" placeholder="/*" /></label><label>Note<input name="note" /></label>';
	} else if (kind === "rule") {
		$("#editor-title").textContent = "Create rule";
		fields.innerHTML = '<label>Name<input name="name" required /></label><label>Priority<input name="priority" type="number" value="100" required /></label><label>Mode<select name="mode"><option value="observe">Observe</option><option value="enforce">Enforce</option></select></label><label>Conditions (JSON)<textarea name="conditions" required>{"all":[{"field":"country","op":"not_in","value":["US"]},{"field":"risk_score","op":"gte","value":40}]}</textarea></label><label>Actions (comma separated)<input name="actions" value="turnstile, log" required /></label>';
	} else {
		$("#editor-title").textContent = "Create ban";
		fields.innerHTML = '<label>Subject type<select name="subject_type"><option>ip</option><option>account</option><option>device</option><option>session</option><option>email</option><option>api_key</option></select></label><label>Value<input name="subject_value" required /></label><label>Restriction<select name="restriction"><option value="all">All access</option><option value="login">Login</option><option value="register">Registration</option><option value="comment">Comments</option><option value="api">API</option><option value="read_only">Read only</option><option value="review">Force review</option></select></label><label>Reason<input name="reason" required /></label><label>Expires at<input name="expires" type="datetime-local" /></label>';
	}
	dialog.showModal();
}

$("#login-form").addEventListener("submit", async (event) => {
	event.preventDefault();
	const data = Object.fromEntries(new FormData(event.currentTarget));
	try {
		const response = await fetch("/__shield/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
		const payload = await response.json();
		if (!response.ok) throw new Error(payload.detail || "Sign in failed");
		showWorkspace({ ...payload, mode: "observe" });
	} catch (error) { $("#login-error").textContent = error.message; }
});

$("#nav").addEventListener("click", (event) => {
	const button = event.target.closest("[data-view]");
	if (button) { loadView(button.dataset.view); $(".sidebar").classList.remove("open"); }
});
$("#menu").addEventListener("click", () => $(".sidebar").classList.toggle("open"));
$("#refresh").addEventListener("click", () => loadView(state.view));
$("#logout").addEventListener("click", async () => { await api("/logout", { method: "POST" }); showLogin(); });
$("#mode").addEventListener("change", async (event) => {
	const previous = state.mode;
	if (event.target.value === "bypass" && !confirm("Enable global bypass mode? Shield will stop enforcing decisions.")) { event.target.value = previous; return; }
	try { const result = await api("/mode", { method: "POST", body: { mode: event.target.value } }); state.mode = result.mode; notice(`Global mode changed to ${result.mode}.`); } catch (error) { event.target.value = previous; notice(error.message); }
});

$("#content").addEventListener("click", async (event) => {
	if (event.target.closest('[data-action="new-list"]')) return openEditor("list");
	if (event.target.closest('[data-action="new-rule"]')) return openEditor("rule");
	if (event.target.closest('[data-action="new-ban"]')) return openEditor("ban");
	if (event.target.closest('[data-action="save-risk"]')) {
		try {
			const weights = Object.fromEntries([...document.querySelectorAll("[data-risk-weight]")].map((input) => [input.dataset.riskWeight, Number(input.value)]));
			const thresholds = Object.fromEntries([...document.querySelectorAll("[data-risk-threshold]")].map((input) => [input.dataset.riskThreshold, Number(input.value)]));
			await api("/settings/risk", { method: "PUT", body: { weights, thresholds } });
			notice("Risk model saved.");
		} catch (error) { notice(error.message); }
		return;
	}
	const listId = event.target.closest("[data-disable-list]")?.dataset.disableList;
	const banId = event.target.closest("[data-revoke-ban]")?.dataset.revokeBan;
	try {
		if (listId && confirm("Disable this access-list entry?")) await api(`/lists/${listId}`, { method: "DELETE" });
		if (banId && confirm("Revoke this ban?")) await api(`/bans/${banId}/revoke`, { method: "POST", body: { reason: "Revoked from console" } });
		if (listId || banId) await loadView(state.view);
	} catch (error) { notice(error.message); }
});

$("#editor-form").addEventListener("submit", async (event) => {
	if (event.submitter?.value === "cancel") return;
	event.preventDefault();
	const data = Object.fromEntries(new FormData(event.currentTarget));
	try {
		if ($("#editor").dataset.kind === "list") await api("/lists", { method: "POST", body: { ...data, scope_host: data.scope_host || null, scope_path: data.scope_path || null } });
		else if ($("#editor").dataset.kind === "rule") await api("/rules", { method: "POST", body: { name: data.name, priority: Number(data.priority), mode: data.mode, conditions: JSON.parse(data.conditions), actions: data.actions.split(",").map((value) => value.trim()).filter(Boolean) } });
		else await api("/bans", { method: "POST", body: { subject_type: data.subject_type, subject_value: data.subject_value, restriction: data.restriction, reason: data.reason, expires_at: data.expires ? Math.floor(new Date(data.expires).getTime() / 1000) : null } });
		$("#editor").close();
		await loadView(state.view);
	} catch (error) { notice(error.message); }
});

api("/session").then(showWorkspace).catch(showLogin);
