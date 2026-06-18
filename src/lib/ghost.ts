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

export interface GhostPost {
	id: string;
	uuid?: string;
	title: string;
	slug: string;
	html?: string | null;
	excerpt?: string | null;
	custom_excerpt?: string | null;
	feature_image?: string | null;
	featured?: boolean;
	published_at?: string | null;
	updated_at?: string | null;
	reading_time?: number | null;
	tags?: GhostTag[];
	primary_tag?: GhostTag | null;
	meta_title?: string | null;
	meta_description?: string | null;
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

export interface BlogPost {
	id: string;
	title: string;
	slug: string;
	html: string;
	excerpt: string;
	featureImage?: string;
	published: Date;
	updated?: Date;
	readingTime: number;
	tags: BlogTag[];
	primaryTag?: BlogTag;
	metaTitle?: string;
	metaDescription?: string;
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
