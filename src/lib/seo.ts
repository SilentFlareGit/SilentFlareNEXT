import type { JsonLd, JsonLdNode, SeoAuthor } from "../types/seo";
import type { BlogAuthor, BlogPost, BlogTag } from "./ghost";

export function absoluteUrl(pathOrUrl: string, site: URL): string {
	return new URL(pathOrUrl, site).toString();
}

export function pageCanonical(pathname: string, site: URL): string {
	return absoluteUrl(pathname, site);
}

export function isInternalCanonical(canonicalUrl: string, site: URL): boolean {
	try {
		return new URL(canonicalUrl, site).origin === site.origin;
	} catch {
		return false;
	}
}

export function isIndexableCollection(collection: {
	count?: number;
	description?: string;
}): boolean {
	return (
		(collection.count ?? 0) >= 2 && Boolean(collection.description?.trim())
	);
}

export function seoAuthor(author: BlogAuthor, site: URL): SeoAuthor {
	return {
		name: author.name,
		url: absoluteUrl(`/authors/${author.slug}/`, site),
	};
}

export function breadcrumbJsonLd(
	items: Array<{ name: string; url: string }>,
): JsonLdNode {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: item.url,
		})),
	};
}

export function blogPostingJsonLd(
	post: BlogPost,
	site: URL,
	publication: { name: string; logoUrl: string },
): JsonLdNode {
	const canonical = absoluteUrl(
		post.canonicalUrl || `/posts/${post.slug}/`,
		site,
	);
	return {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		"@id": `${canonical}#article`,
		url: canonical,
		mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
		headline: post.title,
		description: post.metaDescription || post.excerpt || post.title,
		keywords: post.tags.map((tag) => tag.name),
		datePublished: post.published.toISOString(),
		dateModified: (post.updated ?? post.published).toISOString(),
		image: post.featureImage,
		inLanguage: post.language,
		author: post.authors.map((author) => ({
			"@type": "Person",
			name: author.name,
			url: absoluteUrl(`/authors/${author.slug}/`, site),
		})),
		publisher: {
			"@type": "Organization",
			"@id": `${site.origin}/#publisher`,
			name: publication.name,
			logo: {
				"@type": "ImageObject",
				url: publication.logoUrl,
			},
		},
		isPartOf: { "@id": `${site.origin}/#website` },
	};
}

export function collectionDescription(
	collection: BlogTag | BlogAuthor,
	fallback: string,
): string {
	return collection.metaDescription || collection.description || fallback;
}

export function stringifyJsonLd(value: JsonLd): string {
	return JSON.stringify(value).replace(/</g, "\\u003c");
}
