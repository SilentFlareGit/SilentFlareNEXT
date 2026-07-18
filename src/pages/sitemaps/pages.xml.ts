import { PAGE_SIZE } from "@constants/constants";
import { paginatedUrls, sitemapUrlSet, xmlResponse } from "@lib/sitemap";
import { getSortedPosts } from "@utils/content-utils";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ site }) => {
	const base = site ?? new URL("https://blog.silentflare.com/");
	const posts = await getSortedPosts();
	const entries = [
		...paginatedUrls(base, "/", Math.ceil(posts.length / PAGE_SIZE)).map(
			(loc) => ({ loc }),
		),
		...["/about/", "/archive/"].map((path) => ({
			loc: new URL(path, base).toString(),
		})),
	];
	return xmlResponse(sitemapUrlSet(entries));
};
