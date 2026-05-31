import type {
	BlogAuthor,
	BlogPost,
	BlogTag,
	GhostAuthor,
	GhostPost,
	GhostTag,
} from "./ghost";

function text(value?: string | null): string | undefined {
	const trimmed = value?.trim();
	return trimmed ? trimmed : undefined;
}

function toDate(value?: string | null): Date | undefined {
	if (!value) return undefined;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? undefined : date;
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

export function adaptGhostTag(tag: GhostTag): BlogTag {
	return {
		name: tag.name,
		slug: tag.slug,
		description: text(tag.description),
		featureImage: text(tag.feature_image),
		metaTitle: text(tag.meta_title),
		metaDescription: text(tag.meta_description),
		count: tag.count?.posts,
	};
}

export function adaptGhostAuthor(author: GhostAuthor): BlogAuthor {
	return {
		name: author.name,
		slug: author.slug,
		bio: text(author.bio),
		profileImage: text(author.profile_image),
		coverImage: text(author.cover_image),
		website: text(author.website),
		location: text(author.location),
		metaTitle: text(author.meta_title),
		metaDescription: text(author.meta_description),
		count: author.count?.posts,
	};
}

export function adaptGhostPost(post: GhostPost): BlogPost {
	const tags = (post.tags ?? []).map(adaptGhostTag);
	const authors = (post.authors ?? []).map(adaptGhostAuthor);
	const published = toDate(post.published_at) ?? new Date(0);

	return {
		id: post.id,
		title: post.title,
		slug: post.slug,
		html: withHeadingIds(post.html ?? ""),
		excerpt: text(post.custom_excerpt) ?? text(post.excerpt) ?? "",
		featureImage: text(post.feature_image),
		published,
		updated: toDate(post.updated_at),
		readingTime: post.reading_time ?? 1,
		tags,
		authors,
		primaryTag: post.primary_tag ? adaptGhostTag(post.primary_tag) : tags[0],
		primaryAuthor: post.primary_author
			? adaptGhostAuthor(post.primary_author)
			: authors[0],
		metaTitle: text(post.meta_title),
		metaDescription: text(post.meta_description),
	};
}

export function withAdjacentPosts(posts: BlogPost[]): BlogPost[] {
	return posts.map((post, index) => ({
		...post,
		nextSlug: index > 0 ? posts[index - 1]?.slug : undefined,
		nextTitle: index > 0 ? posts[index - 1]?.title : undefined,
		prevSlug: index < posts.length - 1 ? posts[index + 1]?.slug : undefined,
		prevTitle: index < posts.length - 1 ? posts[index + 1]?.title : undefined,
	}));
}
