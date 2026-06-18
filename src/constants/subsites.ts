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
		status: "external",
		purpose: "Ghost CMS",
		details:
			"Ghost remains the dedicated content system for posts, tags, images, and SEO metadata.",
		actions: [
			"Write and publish posts in Ghost Admin",
			"Expose public content through the Ghost Content API",
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
