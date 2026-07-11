<script lang="ts">
import RegistrationPanel from "../auth/panels/RegistrationPanel.svelte";
import IdentityShell from "../shells/IdentityShell.svelte";

let {
	apiBase,
	emailConfigured,
	tosVersion,
	verifyToken = "",
} = $props<{
	apiBase: string;
	emailConfigured: boolean;
	tosVersion: string;
	verifyToken?: string;
}>();

const authUrl =
	"https://auth.silentflare.com/?return_url=https%3A%2F%2Faccounts.silentflare.com%2F";

function finishRegistration() {
	window.location.assign(`${authUrl}&registration=complete`);
}
</script>

<IdentityShell
	headline="Create the identity behind your byline."
	description="Verify your email, choose how you sign in, then shape the profile shown across SilentFlare."
	backHref={authUrl}
	backLabel="Return to sign in"
>
	<RegistrationPanel
		{apiBase}
		{emailConfigured}
		{tosVersion}
		{verifyToken}
		onBack={() => window.location.assign(authUrl)}
		onComplete={finishRegistration}
	/>
</IdentityShell>
