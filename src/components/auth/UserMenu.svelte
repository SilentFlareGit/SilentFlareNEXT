<script lang="ts">
import Icon from "@iconify/svelte";

let { hydrated = false } = $props<{ hydrated?: boolean }>();
</script>

<div class="relative z-50" data-hydrated={hydrated}>
	<a class="btn-plain scale-animation min-h-11 rounded-lg px-3 font-bold active:scale-95" href="/account/">
		<Icon icon="material-symbols:account-circle-outline-rounded" class="md:mr-2 text-[1.25rem]" />
		<span class="hidden md:inline">Account</span>
	</a>
</div>
