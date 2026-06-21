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
	? "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-900/30 dark:text-sky-300"
	: "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";
</script>

<div class="flex h-fit flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
	<div class="flex items-center justify-between gap-3 border-b border-zinc-100 bg-zinc-50/50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/30">
		<div>
			<h2 class="font-semibold text-sm">GitHub status</h2>
			<p class="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">Encrypted release upload visibility.</p>
		</div>
		<span class="shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium {badgeClass}">
			{badgeText}
		</span>
	</div>

	<div class="flex flex-col gap-4 p-4">
		<div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
			<div class="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
				<span class="text-xs font-medium text-zinc-500">Latest release</span>
				<strong class="mt-1 block truncate text-sm text-zinc-900 dark:text-zinc-100">{latest?.tagName ?? (github?.configured ? "None" : "Local only")}</strong>
			</div>
			<div class="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
				<span class="text-xs font-medium text-zinc-500">Published at</span>
				<strong class="mt-1 block truncate text-sm text-zinc-900 dark:text-zinc-100">{latest?.publishedAt ?? "Unavailable"}</strong>
			</div>
			<div class="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
				<span class="text-xs font-medium text-zinc-500">Upload status</span>
				<strong class="mt-1 block truncate text-sm text-zinc-900 dark:text-zinc-100">{!github?.configured ? "Disabled" : latest ? "Uploaded" : "Unknown"}</strong>
			</div>
		</div>

		{#if githubMessageTone !== "neutral" || github?.error}
			<div class="text-sm p-3 rounded-lg border {toneToClass(githubMessageTone)}">
				{githubMessage}
			</div>
		{/if}
	</div>
</div>
