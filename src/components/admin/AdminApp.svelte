<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";

type ApiHealth = {
	status?: string;
	ok?: boolean;
};

type BotInfo = {
	id: string;
	name?: string;
	purpose?: string;
	status?: string;
	auth_method?: string;
};

type BotListResponse = {
	bots?: BotInfo[];
};

type AuthOptions = {
	methods?: string[];
};

type PublicMe = {
	user: {
		id: string;
		email: string;
		username: string;
		role: string;
	} | null;
};

let { apiBase }: { apiBase: string } = $props();

let loading = $state(true);
let lastUpdated = $state("");
let apiHealth = $state<ApiHealth | null>(null);
let bots = $state<BotInfo[]>([]);
let authOptions = $state<AuthOptions | null>(null);
let publicUser = $state<PublicMe["user"]>(null);
let errors = $state<string[]>([]);

const apiOrigin = $derived(apiBase.replace(/\/$/, ""));
const statusCards = $derived([
	{
		label: "Custom API",
		value: apiHealth ? "Reachable" : "Unknown",
		tone: apiHealth ? "good" : "warn",
		detail: apiHealth?.status ?? "Health endpoint not loaded",
		icon: "material-symbols:api-rounded",
	},
	{
		label: "Managed bots",
		value: String(bots.length),
		tone: bots.length > 0 ? "good" : "warn",
		detail: "Owner-scoped automation registry",
		icon: "material-symbols:smart-toy-outline-rounded",
	},
	{
		label: "Public account",
		value: publicUser ? publicUser.username : "Guest",
		tone: publicUser ? "good" : "neutral",
		detail: "Blog auth and comments session",
		icon: "material-symbols:account-circle-outline-rounded",
	},
	{
		label: "Article boundary",
		value: "Ghost only",
		tone: "neutral",
		detail: "Admin console excludes post editing",
		icon: "material-symbols:edit-note-outline-rounded",
	},
]);

const managementSurfaces = [
	{
		title: "Bot operations",
		description:
			"Telegram approval, backup controls, chat console, and service checks.",
		href: "/bots/",
		icon: "material-symbols:dashboard-outline-rounded",
	},
	{
		title: "Public accounts",
		description:
			"Login, registration, sessions, and comment identity live in Pages Functions plus D1.",
		href: "/api/auth/me",
		icon: "material-symbols:passkey-outline-rounded",
	},
	{
		title: "Comments API",
		description:
			"Post comments keyed by Ghost slug. Content is plain text and separate from Ghost posts.",
		href: "/api/comments?postSlug=example",
		icon: "material-symbols:forum-outline-rounded",
	},
	{
		title: "Custom API health",
		description: "FastAPI management backend on api.silentflare.com.",
		href: `${apiOrigin}/health`,
		icon: "material-symbols:monitor-heart-outline-rounded",
	},
];

function toneClass(tone: string) {
	if (tone === "good") return "border-cyan-400/25 bg-cyan-400/10 text-cyan-100";
	if (tone === "warn")
		return "border-amber-300/25 bg-amber-300/10 text-amber-100";
	return "border-white/10 bg-white/[0.055] text-slate-100";
}

async function fetchJson<T>(url: string, init: RequestInit = {}) {
	const response = await fetch(url, {
		...init,
		credentials: "include",
		headers: {
			accept: "application/json",
			...(init.headers ?? {}),
		},
	});
	if (!response.ok) {
		throw new Error(`${url} returned ${response.status}`);
	}
	return (await response.json()) as T;
}

async function refresh() {
	loading = true;
	errors = [];
	const tasks = [
		fetchJson<ApiHealth>(`${apiOrigin}/health`)
			.then((data) => {
				apiHealth = data;
			})
			.catch((error: Error) => {
				apiHealth = null;
				errors = [...errors, error.message];
			}),
		fetchJson<BotListResponse>(`${apiOrigin}/bots`)
			.then((data) => {
				bots = data.bots ?? [];
			})
			.catch((error: Error) => {
				bots = [];
				errors = [...errors, error.message];
			}),
		fetchJson<AuthOptions>(`${apiOrigin}/auth/options`)
			.then((data) => {
				authOptions = data;
			})
			.catch((error: Error) => {
				authOptions = null;
				errors = [...errors, error.message];
			}),
		fetchJson<PublicMe>("/api/auth/me")
			.then((data) => {
				publicUser = data.user;
			})
			.catch(() => {
				publicUser = null;
			}),
	];

	await Promise.all(tasks);
	lastUpdated = new Intl.DateTimeFormat(undefined, {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	}).format(new Date());
	loading = false;
}

onMount(() => {
	void refresh();
});
</script>

<main class="min-h-screen bg-[#0b111c] text-slate-100">
	<section class="border-b border-white/10 bg-[#101827]">
		<div class="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-8 lg:flex-row lg:items-center lg:justify-between">
			<div>
				<div class="mb-3 flex flex-wrap items-center gap-2">
					<span class="rounded-md border border-cyan-300/25 bg-cyan-300/10 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">Custom API</span>
					<span class="text-sm text-slate-400">admin.silentflare.com</span>
				</div>
				<h1 class="text-3xl font-bold tracking-normal text-white md:text-4xl">SilentFlare Admin</h1>
				<p class="mt-2 max-w-2xl text-base leading-7 text-slate-300">
					Manage SilentFlare-owned systems outside Ghost articles: accounts, comments, bots, backups, and service health.
				</p>
			</div>
			<div class="flex flex-wrap gap-3">
				<a class="admin-button" href="/">
					<Icon icon="material-symbols:home-outline-rounded" class="text-[1.25rem]" />
					Blog
				</a>
				<a class="admin-button" href="/bots/">
					<Icon icon="material-symbols:smart-toy-outline-rounded" class="text-[1.25rem]" />
					Bots
				</a>
				<button class="admin-button-primary" type="button" disabled={loading} onclick={() => void refresh()}>
					<Icon icon="material-symbols:refresh-rounded" class="text-[1.25rem]" />
					{loading ? "Refreshing" : "Refresh"}
				</button>
			</div>
		</div>
	</section>

	<div class="mx-auto grid w-full max-w-7xl gap-5 px-4 py-6 md:px-8 lg:grid-cols-[1fr_22rem]">
		<section class="grid gap-5">
			<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
				{#each statusCards as card}
					<div class="rounded-lg border p-4 {toneClass(card.tone)}">
						<div class="mb-4 flex items-center justify-between gap-3">
							<span class="text-sm font-medium text-slate-300">{card.label}</span>
							<Icon icon={card.icon} class="text-[1.45rem]" />
						</div>
						<strong class="block truncate text-2xl font-bold text-white">{card.value}</strong>
						<p class="mt-2 text-sm leading-6 text-slate-300">{card.detail}</p>
					</div>
				{/each}
			</div>

			<section class="rounded-lg border border-white/10 bg-white/[0.045]">
				<div class="border-b border-white/10 px-5 py-4">
					<h2 class="text-lg font-bold text-white">Management surfaces</h2>
					<p class="mt-1 text-sm text-slate-400">Entry points for non-article SilentFlare operations.</p>
				</div>
				<div class="grid gap-3 p-4 md:grid-cols-2">
					{#each managementSurfaces as surface}
						<a class="group rounded-lg border border-white/10 bg-[#101827] p-4 transition hover:border-cyan-300/40 hover:bg-[#132033]" href={surface.href}>
							<div class="mb-4 flex items-center justify-between gap-4">
								<Icon icon={surface.icon} class="text-[1.7rem] text-cyan-100" />
								<Icon icon="material-symbols:arrow-forward-rounded" class="text-[1.25rem] text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-cyan-100" />
							</div>
							<h3 class="font-bold text-white">{surface.title}</h3>
							<p class="mt-2 text-sm leading-6 text-slate-400">{surface.description}</p>
						</a>
					{/each}
				</div>
			</section>

			<section class="rounded-lg border border-white/10 bg-white/[0.045]">
				<div class="border-b border-white/10 px-5 py-4">
					<h2 class="text-lg font-bold text-white">Bot registry</h2>
					<p class="mt-1 text-sm text-slate-400">Read-only overview from the custom API.</p>
				</div>
				<div class="divide-y divide-white/10">
					{#if bots.length > 0}
						{#each bots as bot}
							<div class="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
								<div>
									<h3 class="font-bold text-white">{bot.name ?? bot.id}</h3>
									<p class="mt-1 text-sm leading-6 text-slate-400">{bot.purpose ?? "Managed automation"}</p>
								</div>
								<div class="flex flex-wrap gap-2">
									<span class="rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-1 text-sm text-slate-200">{bot.status ?? "unknown"}</span>
									<span class="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-sm text-cyan-100">{bot.auth_method ?? "auth"}</span>
								</div>
							</div>
						{/each}
					{:else}
						<p class="px-5 py-5 text-sm text-slate-400">Bot registry is unavailable or empty.</p>
					{/if}
				</div>
			</section>
		</section>

		<aside class="grid h-fit gap-5">
			<section class="rounded-lg border border-white/10 bg-white/[0.045] p-5">
				<h2 class="text-lg font-bold text-white">Scope boundary</h2>
				<div class="mt-4 grid gap-3 text-sm leading-6 text-slate-300">
					<p>Ghost owns articles, tags, authors, media, and SEO metadata.</p>
					<p>SilentFlare Admin owns custom API surfaces such as accounts, comments, bot operations, and backup checks.</p>
				</div>
			</section>

			<section class="rounded-lg border border-white/10 bg-white/[0.045] p-5">
				<h2 class="text-lg font-bold text-white">Auth options</h2>
				<p class="mt-2 text-sm text-slate-400">Custom API owner-console methods currently advertised by the backend.</p>
				<div class="mt-4 flex flex-wrap gap-2">
					{#if authOptions?.methods?.length}
						{#each authOptions.methods as method}
							<span class="rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-1 text-sm text-slate-200">{method}</span>
						{/each}
					{:else}
						<span class="rounded-md border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-sm text-amber-100">unavailable</span>
					{/if}
				</div>
			</section>

			<section class="rounded-lg border border-white/10 bg-white/[0.045] p-5">
				<h2 class="text-lg font-bold text-white">Refresh state</h2>
				<p class="mt-2 text-sm text-slate-400">Last checked: {lastUpdated || "not yet"}</p>
				{#if errors.length > 0}
					<div class="mt-4 rounded-lg border border-amber-300/20 bg-amber-300/10 p-3">
						<p class="font-medium text-amber-100">Some checks failed</p>
						<ul class="mt-2 grid gap-1 text-sm text-amber-100/80">
							{#each errors as error}
								<li>{error}</li>
							{/each}
						</ul>
					</div>
				{/if}
			</section>
		</aside>
	</div>
</main>

<style>
	.admin-button,
	.admin-button-primary {
		display: inline-flex;
		min-height: 2.75rem;
		align-items: center;
		gap: 0.5rem;
		border-radius: 0.5rem;
		padding: 0 1rem;
		font-weight: 700;
		transition:
			transform 160ms ease,
			background-color 160ms ease,
			border-color 160ms ease;
	}

	.admin-button {
		border: 1px solid rgb(255 255 255 / 0.1);
		background: rgb(255 255 255 / 0.055);
		color: rgb(226 232 240);
	}

	.admin-button:hover {
		border-color: rgb(103 232 249 / 0.35);
		background: rgb(255 255 255 / 0.085);
	}

	.admin-button-primary {
		border: 1px solid rgb(103 232 249 / 0.35);
		background: rgb(34 211 238 / 0.16);
		color: white;
	}

	.admin-button-primary:disabled {
		cursor: not-allowed;
		opacity: 0.65;
	}

	.admin-button:active,
	.admin-button-primary:active {
		transform: scale(0.98);
	}
</style>
