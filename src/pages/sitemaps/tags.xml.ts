import { PAGE_SIZE } from "@constants/constants";
import { isIndexableCollection } from "@lib/seo";
import { paginatedUrls, sitemapUrlSet, xmlResponse } from "@lib/sitemap";
import { getTagList } from "@utils/content-utils";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ site }) => {
	const base = site ?? new URL("https://blog.silentflare.com/");
	const tags = await getTagList();
	const entries = tags
		.filter(isIndexableCollection)
		.flatMap((tag) =>
			paginatedUrls(
				base,
				`/tags/${tag.slug}/`,
				Math.ceil(tag.count / PAGE_SIZE),
			).map((loc) => ({ loc })),
		);
	return xmlResponse(sitemapUrlSet(entries));
};
