import { PAGE_SIZE } from "@constants/constants";
import { paginatedUrls, sitemapUrlSet, xmlResponse } from "@lib/sitemap";
import { getAuthorList } from "@utils/content-utils";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ site }) => {
	const base = site ?? new URL("https://blog.silentflare.com/");
	const authors = await getAuthorList();
	const entries = authors
		.filter(
			(author) =>
				author.count > 0 &&
				Boolean(author.description?.trim() || author.metaDescription?.trim()),
		)
		.flatMap((author) =>
			paginatedUrls(
				base,
				`/authors/${author.slug}/`,
				Math.ceil(author.count / PAGE_SIZE),
			).map((loc) => ({ loc })),
		);
	return xmlResponse(sitemapUrlSet(entries));
};
