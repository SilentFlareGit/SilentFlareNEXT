export type SeoPageType = "article" | "profile" | "website";

export type SeoImage = {
	url: string;
	alt?: string;
	width?: number;
	height?: number;
};

export type SeoAuthor = {
	name: string;
	url?: string;
};

export type JsonLdNode = Record<string, unknown>;
export type JsonLd = JsonLdNode | JsonLdNode[];

export type SeoData = {
	title?: string;
	titleTemplate?: boolean;
	description?: string;
	canonicalUrl?: string;
	noindex?: boolean;
	type?: SeoPageType;
	image?: SeoImage;
	ogTitle?: string;
	ogDescription?: string;
	twitterTitle?: string;
	twitterDescription?: string;
	publishedTime?: string;
	modifiedTime?: string;
	authors?: SeoAuthor[];
	tags?: string[];
	jsonLd?: JsonLd;
};
