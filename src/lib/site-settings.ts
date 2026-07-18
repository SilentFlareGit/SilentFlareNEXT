import { siteConfig } from "@/config";

export type SiteBackground = {
	id: string;
	type: "image" | "video";
	url: string;
	position?: string;
};

export type PublicSiteSettings = {
	name: string;
	bio: string;
	avatarUrl: string;
	aboutMarkdown: string;
	backgrounds: SiteBackground[];
	updatedAt?: string;
};

const DEFAULT_ABOUT = `# About SilentFlare

SilentFlare records technical practice, product thinking, and sustainable building.`;

function fallbackSettings(): PublicSiteSettings {
	return {
		name: siteConfig.title,
		bio: siteConfig.subtitle,
		avatarUrl: "",
		aboutMarkdown: DEFAULT_ABOUT,
		backgrounds: [
			{
				id: "fallback-banner",
				type: "image",
				url: siteConfig.banner.src,
				position: siteConfig.banner.position,
			},
		],
	};
}

let settingsPromise: Promise<PublicSiteSettings> | undefined;

async function loadSiteSettings(): Promise<PublicSiteSettings> {
	const apiBase =
		import.meta.env.PUBLIC_API_BASE_URL ?? "https://api.silentflare.com";
	try {
		const response = await fetch(
			`${apiBase.replace(/\/+$/, "")}/site/settings`,
			{
				headers: { Accept: "application/json" },
				signal: AbortSignal.timeout(5000),
			},
		);
		if (!response.ok) return fallbackSettings();
		const body = (await response.json()) as {
			settings?: {
				name?: string;
				bio?: string;
				avatar_url?: string;
				about_markdown?: string;
				backgrounds?: SiteBackground[];
				updated_at?: string | null;
			};
		};
		const settings = body.settings;
		if (!settings?.name) return fallbackSettings();
		return {
			name: settings.name.trim(),
			bio: settings.bio?.trim() || siteConfig.subtitle,
			avatarUrl: settings.avatar_url?.trim() || "",
			aboutMarkdown: settings.about_markdown?.trim() || DEFAULT_ABOUT,
			backgrounds:
				settings.backgrounds?.filter((background) => background.url) ??
				fallbackSettings().backgrounds,
			updatedAt: settings.updated_at ?? undefined,
		};
	} catch {
		return fallbackSettings();
	}
}

export function getSiteSettings(): Promise<PublicSiteSettings> {
	settingsPromise ??= loadSiteSettings();
	return settingsPromise;
}
