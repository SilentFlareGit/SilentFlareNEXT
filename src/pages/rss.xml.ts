import rss from "@astrojs/rss";
import { getSortedPosts } from "@utils/content-utils";
import { url } from "@utils/url-utils";
import type { APIContext } from "astro";
import sanitizeHtml from "sanitize-html";
import { siteConfig } from "@/config";

function stripInvalidXmlChars(str: string): string {
	return str.replace(
		// biome-ignore lint/suspicious/noControlCharactersInRegex: https://www.w3.org/TR/xml/#charsets
		/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]/g,
		"",
	);
}

export async function GET(context: APIContext) {
	const blog = await getSortedPosts();

	return rss({
		title: siteConfig.title,
		description: siteConfig.subtitle || "No description",
		site: context.site ?? "https://example.com",
		items: blog.map((post) => ({
			title: post.title,
			pubDate: post.published,
			description: post.metaDescription || post.excerpt || "",
			link: url(`/posts/${post.slug}/`),
			content: sanitizeHtml(stripInvalidXmlChars(post.html), {
				allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
				allowedAttributes: {
					...sanitizeHtml.defaults.allowedAttributes,
					img: ["src", "alt", "title", "width", "height", "loading"],
					a: ["href", "name", "target", "rel"],
				},
			}),
		})),
		customData: `<language>${siteConfig.lang}</language>`,
	});
}
