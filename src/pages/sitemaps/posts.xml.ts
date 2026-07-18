import { isInternalCanonical } from "@lib/seo";
import { sitemapUrlSet, xmlResponse } from "@lib/sitemap";
import { getSortedPosts } from "@utils/content-utils";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ site }) => {
	const base = site ?? new URL("https://blog.silentflare.com/");
	const posts = await getSortedPosts();
	const entries = posts
		.filter((post) => {
			if (!post.canonicalUrl) return true;
			const publicUrl = new URL(`/posts/${post.slug}/`, base).toString();
			const canonicalUrl = new URL(post.canonicalUrl, base).toString();
			return (
				isInternalCanonical(post.canonicalUrl, base) &&
				canonicalUrl === publicUrl
			);
		})
		.map((post) => ({
			loc: (post.canonicalUrl
				? new URL(post.canonicalUrl, base)
				: new URL(`/posts/${post.slug}/`, base)
			).toString(),
			lastmod: (post.updated ?? post.published).toISOString(),
			image: post.featureImage,
		}));
	return xmlResponse(sitemapUrlSet(entries));
};
