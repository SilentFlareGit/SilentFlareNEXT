/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
	readonly GHOST_URL?: string;
	readonly GHOST_CONTENT_API_KEY?: string;
	readonly GHOST_API_VERSION?: string;
	readonly GHOST_ALLOW_EMPTY?: string;
	readonly SITE_URL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
