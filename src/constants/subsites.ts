export type SubsiteStatus = "live" | "external" | "placeholder";

export interface Subsite {
	name: string;
	host: string;
	path: string;
	status: SubsiteStatus;
	purpose: string;
	details: string;
	actions: string[];
}

export const subsites: Subsite[] = [
	{
		name: "Blog",
		host: "blog.silentflare.com",
		path: "/",
		status: "live",
		purpose: "Astro front end",
		details:
			"Public Fuwari/Astro site that renders Ghost posts, tags, authors, archive pages, RSS, and sitemap output.",
		actions: [
			"Read public content from Ghost Content API",
			"Render the public blog UI",
		],
	},
	{
		name: "CMS",
		host: "cms.silentflare.com",
		path: "/cms/",
		status: "external",
		purpose: "Ghost CMS",
		details:
			"Ghost remains the dedicated content system for posts, pages, tags, authors, images, and SEO metadata.",
		actions: [
			"Write and publish posts in Ghost Admin",
			"Expose public content through the Ghost Content API",
		],
	},
	{
		name: "API",
		host: "api.silentflare.com",
		path: "/api/",
		status: "placeholder",
		purpose: "Custom business API",
		details:
			"Reserved for SilentFlare-specific features such as stats, likes, comments, webhooks, users, and automation.",
		actions: [
			"Receive Ghost webhooks",
			"Store custom business data",
			"Keep Ghost Admin API keys server-side",
		],
	},
	{
		name: "Admin",
		host: "admin.silentflare.com",
		path: "/admin/",
		status: "placeholder",
		purpose: "SilentFlare admin",
		details:
			"Reserved for a future SilentFlare-owned dashboard that manages custom API data and site operations.",
		actions: [
			"Manage custom users and comments",
			"Review analytics and automation",
			"Keep separate from Ghost Admin",
		],
	},
];

export function getSubsite(name: string): Subsite {
	const subsite = subsites.find(
		(item) => item.name.toLowerCase() === name.toLowerCase(),
	);
	if (!subsite) {
		throw new Error(`Subsite not found: ${name}`);
	}
	return subsite;
}
