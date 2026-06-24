<script lang="ts">
import Icon from "@iconify/svelte";

let { user } = $props();
</script>

<div class="flex flex-col gap-8">
    <div>
        <h2 class="text-2xl font-extrabold text-black/90 dark:text-white/90 mb-2">Security & Access</h2>
        <p class="text-black/50 dark:text-white/50 text-[0.95rem]">
            Manage your account's security credentials and active sessions.
        </p>
    </div>

    <!-- Email Address Info -->
    <div class="card-base card-shadow border border-[var(--line-divider)] p-6 md:p-8">
        <h3 class="text-lg font-bold text-black/90 dark:text-white/90 mb-4">Email Address</h3>
        <p class="text-black/75 dark:text-white/75 text-[0.95rem] mb-6">
            Your current email address is linked to your SilentFlare identity. Email change is not currently supported.
        </p>
        <div class="flex items-center gap-3">
            <div class="auth-input bg-black/5 dark:bg-white/5 opacity-70 cursor-not-allowed max-w-sm flex items-center font-medium text-[0.95rem]">
                <Icon icon="material-symbols:mail-outline-rounded" class="mr-3 text-lg text-black/50 dark:text-white/50" />
                {user.email}
            </div>
            <span class="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">Verified</span>
        </div>
    </div>

    <div class="card-base card-shadow border border-[var(--line-divider)] p-6 md:p-8">
        <h3 class="text-lg font-bold text-black/90 dark:text-white/90 mb-4">Password Management</h3>
        <p class="text-black/75 dark:text-white/75 text-[0.95rem] mb-6">
            Login and registration require Cloudflare verification. Password rotation is not exposed in the current API yet.
        </p>
        <div class="rounded-xl border border-[var(--line-divider)] bg-black/5 p-4 text-[0.95rem] text-black/70 dark:bg-white/5 dark:text-white/70">
            Password change UI will stay unavailable until the backend exposes a real authenticated password update endpoint.
        </div>
    </div>
</div>
