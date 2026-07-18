export type GhostApiVersion = "v5.0" | string;

export interface GhostTag {
	id?: string;
	name: string;
	slug: string;
	description?: string | null;
	feature_image?: string | null;
	meta_title?: string | null;
	meta_description?: string | null;
	count?: {
		posts?: number;
	};
}

export interface GhostAuthor {
	id?: string;
	name: string;
	slug: string;
	profile_image?: string | null;
	cover_image?: string | null;
	bio?: string | null;
	website?: string | null;
	location?: string | null;
	facebook?: string | null;
	twitter?: string | null;
	meta_title?: string | null;
	meta_description?: string | null;
	count?: {
		posts?: number;
	};
}

export interface GhostPost {
	id: string;
	uuid?: string;
	title: string;
	slug: string;
	html?: string | null;
	excerpt?: string | null;
	custom_excerpt?: string | null;
	feature_image?: string | null;
	feature_image_alt?: string | null;
	feature_image_caption?: string | null;
	featured?: boolean;
	published_at?: string | null;
	updated_at?: string | null;
	reading_time?: number | null;
	tags?: GhostTag[];
	authors?: GhostAuthor[];
	primary_tag?: GhostTag | null;
	primary_author?: GhostAuthor | null;
	meta_title?: string | null;
	meta_description?: string | null;
	canonical_url?: string | null;
	og_image?: string | null;
	og_title?: string | null;
	og_description?: string | null;
	twitter_image?: string | null;
	twitter_title?: string | null;
	twitter_description?: string | null;
}

export interface GhostPagination {
	page: number;
	limit: number;
	pages: number;
	total: number;
	next: number | null;
	prev: number | null;
}

export interface GhostListResponse<T> {
	data: T[];
	meta: {
		pagination: GhostPagination;
	};
}

export interface BlogTag {
	name: string;
	slug: string;
	description?: string;
	featureImage?: string;
	metaTitle?: string;
	metaDescription?: string;
	count?: number;
}

export interface BlogAuthor {
	name: string;
	slug: string;
	profileImage?: string;
	coverImage?: string;
	description?: string;
	website?: string;
	location?: string;
	facebook?: string;
	twitter?: string;
	metaTitle?: string;
	metaDescription?: string;
	count?: number;
}

export interface BlogPost {
	id: string;
	title: string;
	slug: string;
	html: string;
	excerpt: string;
	featureImage?: string;
	featureImageAlt?: string;
	featureImageCaption?: string;
	published: Date;
	updated?: Date;
	language: string;
	readingTime: number;
	tags: BlogTag[];
	authors: BlogAuthor[];
	primaryTag?: BlogTag;
	primaryAuthor?: BlogAuthor;
	metaTitle?: string;
	metaDescription?: string;
	canonicalUrl?: string;
	ogImage?: string;
	ogTitle?: string;
	ogDescription?: string;
	twitterImage?: string;
	twitterTitle?: string;
	twitterDescription?: string;
	nextSlug?: string;
	nextTitle?: string;
	prevSlug?: string;
	prevTitle?: string;
}

export interface GhostPage<T> {
	items: T[];
	pagination: GhostPagination;
}

export interface GhostCmsStatus {
	connected: boolean;
	url?: string;
	apiVersion: string;
	counts: {
		posts: number;
		tags: number;
	};
	latestPosts: BlogPost[];
}
