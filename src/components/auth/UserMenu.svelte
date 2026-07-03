<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";

type SessionUser = {
	displayName?: string;
	username?: string;
	avatarUrl?: string;
};

let { hydrated = false } = $props<{ hydrated?: boolean }>();
let user = $state<SessionUser | null>(null);
let loginHref = $state("https://auth.silentflare.com/");

const accountHref = "https://accounts.silentflare.com/";
const registerHref = "https://accounts.silentflare.com/?register=1";

onMount(async () => {
	loginHref = `https://auth.silentflare.com/?return_url=${encodeURIComponent(window.location.href)}`;
	try {
		const response = await fetch("https://api.silentflare.com/auth/session", {
			credentials: "include",
		});
		if (!response.ok) return;

		const data = (await response.json()) as {
			authenticated?: boolean;
			user?: SessionUser;
		};
		if (data.authenticated && data.user) user = data.user;
	} catch {
		// Keep the safe signed-out entries when session status cannot be loaded.
	}
});

const accountLabel = $derived(user?.displayName || user?.username || "Account");
const accountInitial = $derived(accountLabel.slice(0, 1).toUpperCase());
</script>

<div class="account-nav" data-hydrated={hydrated}>
	{#if user}
		<a
			class="account-link scale-animation"
			href={accountHref}
			aria-label={`Open ${accountLabel}'s account`}
			title="My account"
		>
			<span class="avatar" aria-hidden="true">
				{#if user.avatarUrl}
					<img src={user.avatarUrl} alt="" />
				{:else}
					<span>{accountInitial}</span>
				{/if}
			</span>
			<span class="account-name">{accountLabel}</span>
			<Icon icon="material-symbols:chevron-right-rounded" class="account-chevron" />
		</a>
	{:else}
		<a class="guest-link login-link scale-animation" href={loginHref} title="Sign in">
			<span class="guide-icon login-icon" aria-hidden="true">
				<Icon icon="material-symbols:login-rounded" />
			</span>
			<span class="guest-label">Sign in</span>
		</a>
		<a class="guest-link register-link scale-animation" href={registerHref} title="Create account">
			<span class="guide-icon register-icon" aria-hidden="true">
				<Icon icon="material-symbols:person-add-rounded" />
			</span>
			<span class="guest-label">Join</span>
		</a>
	{/if}
</div>

<style>
	.account-nav {
		position: relative;
		z-index: 50;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.guest-link,
	.account-link {
		display: inline-flex;
		min-width: 2.75rem;
		min-height: 2.75rem;
		align-items: center;
		justify-content: center;
		border-radius: 0.5rem;
		font-weight: 700;
		letter-spacing: 0;
		transition:
			background-color 150ms ease,
			color 150ms ease,
			box-shadow 150ms ease;
	}

	.guest-link:active,
	.account-link:active {
		transform: scale(0.95);
	}

	.login-link {
		color: color-mix(in srgb, currentColor 78%, transparent);
	}

	.login-link:hover {
		background: var(--btn-plain-bg-hover);
		color: var(--primary);
	}

	.register-link {
		background: color-mix(in srgb, var(--primary) 13%, transparent);
		color: var(--primary);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary) 18%, transparent);
	}

	.register-link:hover {
		background: color-mix(in srgb, var(--primary) 20%, transparent);
	}

	.guide-icon {
		display: grid;
		width: 1.25rem;
		height: 1.25rem;
		place-items: center;
		font-size: 1.15rem;
	}

	.register-icon {
		position: relative;
	}

	.register-icon::after {
		position: absolute;
		top: -0.14rem;
		right: -0.18rem;
		width: 0.35rem;
		height: 0.35rem;
		border: 2px solid var(--card-bg);
		border-radius: 999px;
		background: var(--primary);
		content: "";
	}

	.guest-label,
	.account-name,
	.account-chevron {
		display: none;
	}

	.account-link {
		max-width: 11rem;
		gap: 0.5rem;
		padding: 0 0.35rem;
		background: color-mix(in srgb, var(--primary) 9%, transparent);
	}

	.account-link:hover {
		background: color-mix(in srgb, var(--primary) 15%, transparent);
	}

	.avatar {
		display: grid;
		width: 2rem;
		height: 2rem;
		flex: 0 0 2rem;
		place-items: center;
		overflow: hidden;
		border: 2px solid color-mix(in srgb, var(--primary) 22%, transparent);
		border-radius: 999px;
		background: color-mix(in srgb, var(--primary) 14%, var(--card-bg));
		color: var(--primary);
		font-size: 0.8rem;
	}

	.avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	@media (min-width: 768px) {
		.guest-link {
			gap: 0.4rem;
			padding: 0 0.7rem;
		}

		.guest-label,
		.account-name,
		.account-chevron {
			display: inline;
		}

		.account-link {
			padding: 0 0.55rem;
		}

		.account-name {
			overflow: hidden;
			max-width: 6.5rem;
			text-overflow: ellipsis;
			white-space: nowrap;
	}

		.account-chevron {
			flex: 0 0 auto;
			color: var(--primary);
			font-size: 1.1rem;
		}
	}
</style>
