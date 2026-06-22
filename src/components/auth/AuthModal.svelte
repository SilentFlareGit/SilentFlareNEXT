<script lang="ts">
import Icon from "@iconify/svelte";
import LoginForm from "./LoginForm.svelte";
import RegisterForm from "./RegisterForm.svelte";

let {
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
} = $props();

let mode = $state<"login" | "register">("login");

function close() {
	onClose();
}
</script>

{#if open}
	<div class="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true">
		<button class="absolute inset-0 cursor-default" aria-label="Close dialog" onclick={close}></button>
		<section class="card-base relative z-[91] w-full max-w-[28rem] p-5 shadow-2xl">
			<div class="mb-5 flex items-start justify-between gap-4">
				<div>
					<p class="text-xs font-bold uppercase tracking-[0.16em] text-30">Account</p>
					<h2 class="mt-1 text-xl font-bold text-90">{mode === "login" ? "Login" : "Create account"}</h2>
				</div>
				<button class="btn-plain min-h-11 min-w-11 rounded-lg active:scale-90" aria-label="Close" onclick={close}>
					<Icon icon="material-symbols:close-rounded" class="text-[1.35rem]" />
				</button>
			</div>

			<div class="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-[var(--btn-regular-bg)] p-1">
				<button class:auth-tab-active={mode === "login"} class="auth-tab" type="button" onclick={() => { mode = "login"; }}>Login</button>
				<button class:auth-tab-active={mode === "register"} class="auth-tab" type="button" onclick={() => { mode = "register"; }}>Register</button>
			</div>

			{#if mode === "login"}
				<LoginForm onSuccess={close} />
			{:else}
				<RegisterForm onSuccess={close} />
			{/if}
		</section>
	</div>
{/if}
