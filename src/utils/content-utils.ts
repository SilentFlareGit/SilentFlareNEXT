import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getTagUrl } from "@utils/url-utils.ts";
import type { BlogAuthor, BlogPost, BlogTag } from "@/lib/ghost";
import {
	getAuthors,
	getPostBySlug,
	getPosts,
	getPostsByAuthor,
	getPostsByTag,
	getTags,
} from "@/lib/ghost-client";

export type { BlogAuthor, BlogPost, BlogTag };

export async function getSortedPosts(): Promise<BlogPost[]> {
	return (await getPosts({ limit: "all" })).items;
}

export async function getSortedPostsList(): Promise<BlogPost[]> {
	return getSortedPosts();
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
	return getPostBySlug(slug);
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
	return (await getPostsByTag(slug, { limit: "all" })).items;
}

export async function getPostsForAuthor(slug: string): Promise<BlogPost[]> {
	return (await getPostsByAuthor(slug, { limit: "all" })).items;
}

export async function getAuthorList(): Promise<BlogAuthor[]> {
	return (await getAuthors({ limit: "all" })).items;
}
