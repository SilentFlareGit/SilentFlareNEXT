import { getCollection } from "astro:content";
import path from "node:path";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl, getTagUrl } from "@utils/url-utils.ts";
import MarkdownIt from "markdown-it";
import type { BlogAuthor, BlogPost, BlogTag } from "@/lib/ghost";
import {
	getPostBySlug,
	getPosts,
	getPostsByTag,
	getTags,
} from "@/lib/ghost-client";

export type { BlogAuthor, BlogPost, BlogTag };

const localAuthor: BlogAuthor = {
	name: "SilentFlare",
	slug: "silentflare",
	bio: "Technical practice, product thinking, and sustainable building.",
};

const markdown = new MarkdownIt({
	html: true,
	linkify: true,
	typographer: true,
});

function shouldUseLocalFallback(): boolean {
	return (
		import.meta.env.GHOST_ALLOW_EMPTY === "true" ||
		process.env.GHOST_ALLOW_EMPTY === "true"
	);
}

function stripHtml(value: string): string {
	return value.replace(/<[^>]*>/g, "").trim();
}

function slugifyHeading(value: string, seen: Map<string, number>): string {
	const base =
		stripHtml(value)
			.toLowerCase()
			.normalize("NFKD")
			.replace(/[^\p{Letter}\p{Number}]+/gu, "-")
			.replace(/^-+|-+$/g, "") || "section";
	const count = seen.get(base) ?? 0;
	seen.set(base, count + 1);
	return count === 0 ? base : `${base}-${count + 1}`;
}

function withHeadingIds(html: string): string {
	const seen = new Map<string, number>();
	return html.replace(
		/<h([2-3])([^>]*)>(.*?)<\/h\1>/gi,
		(match: string, level: string, attributes: string, content: string) => {
			if (/\sid\s*=/.test(attributes)) return match;
			return `<h${level}${attributes} id="${slugifyHeading(content, seen)}">${content}</h${level}>`;
		},
	);
}

function localImagePath(entryId: string, image?: string): string | undefined {
	if (!image) return undefined;
	if (
		image.startsWith("/") ||
		image.startsWith("http://") ||
		image.startsWith("https://") ||
		image.startsWith("data:")
	) {
		return image;
	}
	if (image.startsWith("./")) {
		const dir = path.posix.dirname(entryId.replace(/\\/g, "/"));
		return path.posix.join("content/posts", dir, image.slice(2));
	}
	return image;
}

function asLocalTag(name: string, count?: number): BlogTag {
	return {
		name,
		slug: name,
		count,
	};
}

async function getLocalPosts(): Promise<BlogPost[]> {
	const entries = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	const sorted = entries.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});

	const posts = sorted.map((entry): BlogPost => {
		const tags = (entry.data.tags ?? []).map((tag: string) => asLocalTag(tag));
		const category = entry.data.category
			? asLocalTag(String(entry.data.category).trim())
			: undefined;
		return {
			id: entry.id,
			title: entry.data.title,
			slug: entry.slug,
			html: withHeadingIds(markdown.render(entry.body ?? "")),
			excerpt: entry.data.description ?? "",
			featureImage: localImagePath(entry.id, entry.data.image),
			published: new Date(entry.data.published),
			updated: entry.data.updated ? new Date(entry.data.updated) : undefined,
			readingTime: Math.max(
				1,
				Math.ceil((entry.body ?? "").split(/\s+/).length / 180),
			),
			tags,
			authors: [localAuthor],
			primaryTag: category ?? tags[0],
			primaryAuthor: localAuthor,
			nextSlug: entry.data.nextSlug || undefined,
			nextTitle: entry.data.nextTitle || undefined,
			prevSlug: entry.data.prevSlug || undefined,
			prevTitle: entry.data.prevTitle || undefined,
		};
	});

	for (let i = 1; i < posts.length; i++) {
		posts[i].nextSlug = posts[i - 1].slug;
		posts[i].nextTitle = posts[i - 1].title;
	}
	for (let i = 0; i < posts.length - 1; i++) {
		posts[i].prevSlug = posts[i + 1].slug;
		posts[i].prevTitle = posts[i + 1].title;
	}

	return posts;
}

async function getGhostPostsOrLocalFallback(): Promise<BlogPost[]> {
	const posts = (await getPosts({ limit: "all" })).items;
	if (posts.length === 0 && shouldUseLocalFallback()) {
		return getLocalPosts();
	}
	return posts;
}

export async function getSortedPosts(): Promise<BlogPost[]> {
	return getGhostPostsOrLocalFallback();
}

export async function getSortedPostsList(): Promise<BlogPost[]> {
	return getSortedPosts();
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
	const post = await getPostBySlug(slug);
	if (post || !shouldUseLocalFallback()) return post;
	return (await getLocalPosts()).find((entry) => entry.slug === slug);
}

export type Tag = {
	name: string;
	slug: string;
	description?: string;
	featureImage?: string;
	metaTitle?: string;
	metaDescription?: string;
	count: number;
};

export async function getTagList(): Promise<Tag[]> {
	const tags = (await getTags({ limit: "all" })).items;
	if (tags.length === 0 && shouldUseLocalFallback()) {
		const countMap = new Map<string, number>();
		for (const post of await getLocalPosts()) {
			for (const tag of post.tags) {
				countMap.set(tag.name, (countMap.get(tag.name) ?? 0) + 1);
			}
		}
		return [...countMap.entries()]
			.sort(([a], [b]) => a.toLowerCase().localeCompare(b.toLowerCase()))
			.map(([name, count]) => ({
				name,
				slug: name,
				count,
			}));
	}
	return tags.map((tag) => ({
		name: tag.name,
		slug: tag.slug,
		description: tag.description,
		featureImage: tag.featureImage,
		metaTitle: tag.metaTitle,
		metaDescription: tag.metaDescription,
		count: tag.count ?? 0,
	}));
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(): Promise<Category[]> {
	const tags = await getTagList();
	if (shouldUseLocalFallback()) {
		const countMap = new Map<string, number>();
		for (const post of await getLocalPosts()) {
			const name = post.primaryTag?.name || i18n(I18nKey.uncategorized);
			countMap.set(name, (countMap.get(name) ?? 0) + 1);
		}
		if (countMap.size > 0) {
			return [...countMap.entries()]
				.sort(([a], [b]) => a.toLowerCase().localeCompare(b.toLowerCase()))
				.map(([name, count]) => ({
					name,
					count,
					url: getCategoryUrl(name),
				}));
		}
	}
	if (tags.length === 0) {
		return [
			{
				name: i18n(I18nKey.uncategorized),
				count: 0,
				url: getTagUrl(""),
			},
		];
	}
	return tags.map((tag) => ({
		name: tag.name,
		count: tag.count,
		url: getTagUrl(tag.slug),
	}));
}

export async function getPostsForTag(slug: string): Promise<BlogPost[]> {
	const posts = (await getPostsByTag(slug, { limit: "all" })).items;
	if (posts.length === 0 && shouldUseLocalFallback()) {
		return (await getLocalPosts()).filter((post) => {
			return (
				post.tags.some((tag) => tag.slug === slug || tag.name === slug) ||
				post.primaryTag?.slug === slug ||
				post.primaryTag?.name === slug
			);
		});
	}
	return posts;
}
