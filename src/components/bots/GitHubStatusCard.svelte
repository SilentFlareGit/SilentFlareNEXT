<script lang="ts">
type GitHubStatus = {
	configured?: boolean;
	error?: string;
	latest?: {
		tagName?: string;
		publishedAt?: string;
	};
};

type BackupStatus = {
	github?: GitHubStatus;
};

export let backupStatus: BackupStatus | null = null;
export let githubMessage = "";
export let githubMessageTone = "neutral";
export let toneToClass: (tone: string) => string;

$: github = backupStatus?.github;
$: latest = github?.latest;
$: badgeText = github?.configured
	? latest
		? "Connected"
		: "No release"
	: "Not configured";
$: badgeClass = latest
	? "border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-800/70 dark:bg-cyan-950/40 dark:text-cyan-200"
	: "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400";
</script>

<div class="flex h-fit flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#101b2b]">
	<div class="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-[#0d1828]">
		<div>
			<p class="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Release mirror</p>
			<h2 class="mt-1 text-base font-semibold text-slate-950 dark:text-white">GitHub backup status</h2>
			<p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Encrypted release upload visibility.</p>
		</div>
		<span class="shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium {badgeClass}">
			{badgeText}
		</span>
	</div>

	<div class="flex flex-col gap-4 p-4">
		<div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
			<div class="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
				<span class="text-xs font-medium text-slate-500">Latest release</span>
				<strong class="mt-1 block truncate text-sm text-slate-950 dark:text-slate-100">{latest?.tagName ?? (github?.configured ? "None" : "Local only")}</strong>
			</div>
			<div class="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
				<span class="text-xs font-medium text-slate-500">Published at</span>
				<strong class="mt-1 block truncate text-sm text-slate-950 dark:text-slate-100">{latest?.publishedAt ?? "Unavailable"}</strong>
			</div>
			<div class="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
				<span class="text-xs font-medium text-slate-500">Upload status</span>
				<strong class="mt-1 block truncate text-sm text-slate-950 dark:text-slate-100">{!github?.configured ? "Disabled" : latest ? "Uploaded" : "Unknown"}</strong>
			</div>
		</div>

		{#if githubMessageTone !== "neutral" || github?.error}
			<div class="text-sm p-3 rounded-lg border {toneToClass(githubMessageTone)}">
				{githubMessage}
			</div>
		{/if}
	</div>
</div>
