<script lang="ts">
import RegistrationPanel from "../auth/panels/RegistrationPanel.svelte";

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

<div class="registration-stage">
	<main class="registration-main">
		<section class="registration-shell">
			<div class="registration-story">
				<a class="story-wordmark" href="https://blog.silentflare.com/" aria-label="SilentFlare Blog"><span>S</span><strong>SilentFlare</strong></a>
				<div><h1>Create the identity behind your byline.</h1><p>Verify your email, choose how you sign in, then shape the profile shown across SilentFlare.</p></div>
				<a class="story-link" href={authUrl}>Return to sign in</a>
			</div>
			<div class="registration-form">
				<RegistrationPanel
					{apiBase}
					{emailConfigured}
					{tosVersion}
					{verifyToken}
					onBack={() => window.location.assign(authUrl)}
					onComplete={finishRegistration}
				/>
			</div>
		</section>
		<p class="registration-legal">By continuing, you agree to the <a href="https://tos.silentflare.com/">SilentFlare Terms of Service</a>.</p>
	</main>
</div>

<style>
	.registration-stage { min-height: 100svh; padding: 1rem; color: #182230; background: #edf3f8; }
	.registration-main { width: min(100%, 62rem); margin: 0 auto; padding: 1rem 0; }
	.registration-shell { display: grid; overflow: hidden; border: 1px solid rgba(70,100,130,.14); border-radius: .5rem; background: white; box-shadow: 0 1rem 3rem rgba(28,53,79,.09); }
	.registration-story { order: 2; display: flex; flex-direction: column; justify-content: space-between; gap: 1.5rem; padding: 1.5rem; border-top: 1px solid #dce6ee; background: #f4f8fb; }
	.story-wordmark { min-height: 2.75rem; display: inline-flex; align-items: center; gap: .65rem; width: max-content; color: #182230; }
	.story-wordmark span { width: 2rem; height: 2rem; display: grid; place-items: center; border-radius: .5rem; background: #4b9fe8; color: white; font-weight: 800; }
	.registration-story h1 { max-width: 15ch; margin: 0; font-size: 2rem; line-height: 1.08; letter-spacing: 0; }
	.registration-story p { max-width: 30rem; margin: 1rem 0 0; color: #68798a; line-height: 1.65; }
	.story-link { min-height: 2.75rem; display: inline-flex; align-items: center; width: max-content; color: #176db8; font-weight: 700; text-decoration: underline; }
	.registration-form { min-width: 0; min-height: 30rem; display: flex; align-items: center; padding: 1.5rem; }
	.registration-legal { margin: 1rem 0 0; text-align: center; color: #68798a; font-size: .8rem; }
	.registration-legal a { text-decoration: underline; }
	:global(.dark) .registration-stage { color: #edf3f8; background: #111923; }
	:global(.dark) .registration-shell { border-color: #2a3948; background: #19232f; }
	:global(.dark) .registration-story { border-color: #2a3948; color: #edf3f8; background: #19232f; }
	:global(.dark) .story-wordmark { color: #edf3f8; }
	@media (min-width: 768px) { .registration-stage { padding: 1.5rem; } .registration-main { padding: 2rem 0; } .registration-form { padding: 2.5rem; } }
	@media (min-width: 1024px) { .registration-main { padding: 3rem 0 2rem; } .registration-shell { grid-template-columns: minmax(17rem,2fr) minmax(0,3fr); } .registration-story { order: 1; min-height: 28rem; padding: 2.5rem; border-top: 0; border-right: 1px solid #dce6ee; box-shadow: inset .25rem 0 #4b9fe8; } .registration-story h1 { font-size: 2.4rem; } .registration-form { order: 2; padding: 3rem; } }
</style>
