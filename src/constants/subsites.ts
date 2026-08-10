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
			"Public Fuwari/Astro site that renders Ghost posts, tags, archive pages, RSS, and sitemap output.",
		actions: [
			"Read public content from Ghost Content API",
			"Render the public blog UI",
		],
	},
	{
		name: "CMS",
		host: "cms.silentflare.com",
		path: "/cms/",
		status: "live",
		purpose: "SilentFlare publishing workspace",
		details:
			"The Owner-only CMS frontend uses the FastAPI CMS API while Ghost remains the content engine.",
		actions: [
			"Write and publish through the SilentFlare CMS",
			"Expose public content through the Ghost Content API",
		],
	},
	{
		name: "Admin",
		host: "admin.silentflare.com",
		path: "/admin/",
		status: "live",
		purpose: "Custom API management",
		details:
			"SilentFlare-owned control surface for accounts, comments, bots, backups, health checks, and other non-article operations.",
		actions: [
			"Inspect custom API health and bot registry",
			"Route operators to bot and backup management",
			"Keep article editing inside the CMS workspace",
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
