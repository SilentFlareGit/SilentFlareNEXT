import { sitemapIndex, xmlResponse } from "@lib/sitemap";
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
	const base = site ?? new URL("https://blog.silentflare.com/");
	return xmlResponse(
		sitemapIndex(base, [
			"/sitemaps/pages.xml",
			"/sitemaps/posts.xml",
			"/sitemaps/tags.xml",
			"/sitemaps/authors.xml",
		]),
	);
};
