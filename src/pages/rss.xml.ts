import rss from "@astrojs/rss";
import { absoluteUrl } from "@lib/seo";
import { escapeXml } from "@lib/sitemap";
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
	const site = context.site ?? new URL("https://blog.silentflare.com/");

	return rss({
		title: siteConfig.title,
		description: siteConfig.subtitle || "No description",
		site,
		items: blog.map((post) => {
			const publicUrl = absoluteUrl(url(`/posts/${post.slug}/`), site);
			const link = absoluteUrl(post.canonicalUrl || publicUrl, site);
			const creators = post.authors
				.map((author) => `<dc:creator>${escapeXml(author.name)}</dc:creator>`)
				.join("");
			return {
				title: post.title,
				pubDate: post.published,
				description: post.metaDescription || post.excerpt || "",
				link,
				categories: post.tags.map((tag) => tag.name),
				commentsUrl: `${publicUrl}#discussion`,
				customData: `<guid isPermaLink="true">${escapeXml(link)}</guid>${creators}`,
				content: sanitizeHtml(stripInvalidXmlChars(post.html), {
					allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
					allowedAttributes: {
						...sanitizeHtml.defaults.allowedAttributes,
						img: ["src", "alt", "title", "width", "height", "loading"],
						a: ["href", "name", "target", "rel"],
					},
				}),
			};
		}),
		xmlns: {
			atom: "http://www.w3.org/2005/Atom",
			dc: "http://purl.org/dc/elements/1.1/",
		},
		customData: `<language>${siteConfig.lang.replace("_", "-")}</language><atom:link href="${escapeXml(absoluteUrl("/rss.xml", site))}" rel="self" type="application/rss+xml" />`,
	});
}
