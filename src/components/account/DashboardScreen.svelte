<script lang="ts">
import MemberNavPanel from "./panels/MemberNavPanel.svelte";
import MemberSummaryPanel from "./panels/MemberSummaryPanel.svelte";
import ProfileTab from "./tabs/ProfileTab.svelte";
import SecurityTab from "./tabs/SecurityTab.svelte";

let {
	user,
	logout,

	displayName = $bindable(),
	avatarUrl = $bindable(),
	bio = $bindable(),
	saving,
	saveProfile,
	error,
	notice,
} = $props();

let currentTab = $state("profile");
</script>

<div class="relative mx-auto mt-4 pb-8">
	<div id="main-grid" class="transition duration-700 mx-auto grid w-full grid-cols-1 gap-4 lg:grid-cols-[17.5rem_minmax(0,1fr)]">
		<aside class="onload-animation lg:max-w-[17.5rem]">
			<div class="mb-4 flex w-full flex-col gap-4">
				<MemberSummaryPanel {user} {logout} {displayName} {avatarUrl} />
			</div>

			<div class="transition-all duration-700 flex w-full flex-col gap-4 lg:sticky lg:top-4">
				<MemberNavPanel bind:currentTab />
			</div>
		</aside>

		<div class="min-w-0 space-y-4">
			<!-- Personalized hero -->
			<section class="card-base px-6 py-6 md:px-10 md:py-8 onload-animation">
				<div class="font-bold transition text-lg text-neutral-900 dark:text-neutral-100 relative ml-6 mb-4 before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)] before:absolute before:left-[-16px] before:top-[5px]">
					Welcome back
				</div>
				<div class="flex items-center gap-4">
					<!-- Mini avatar -->
					<div
						class="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[var(--btn-regular-bg)] bg-cover bg-center"
						style="
							background-image: {avatarUrl ? `url('${(avatarUrl as string).replaceAll("'", "%27")}')` : 'none'};
							box-shadow: 0 0 0 2px var(--card-bg), 0 0 0 3px var(--primary);
						"
					>
						{#if !avatarUrl}
							<div class="flex h-full w-full items-center justify-center text-[1.5rem]">
								<span class="leading-none text-[var(--primary)]">
									{(displayName || user.username || "?")[0].toUpperCase()}
								</span>
							</div>
						{/if}
					</div>
					<h1 class="text-3xl font-extrabold leading-[1.1] text-black/90 dark:text-white/90 sm:text-4xl">
						{displayName || user.username}
					</h1>
				</div>
				<p class="mt-3 max-w-[58ch] text-base leading-7 text-black/50 dark:text-white/50">
					Your account is active. Manage your public profile and review security settings below.
				</p>
			</section>

			<div class="card-base min-h-[500px] px-6 py-6 md:px-10 md:py-8 onload-animation" style="animation-delay: 120ms">
				{#if currentTab === "profile"}
					<ProfileTab
						{user}
						bind:displayName
						bind:avatarUrl
						bind:bio
						{saving}
						{saveProfile}
						{error}
						{notice}
					/>
				{:else if currentTab === "security"}
					<SecurityTab {user} />
				{/if}
			</div>
		</div>
	</div>
</div>
