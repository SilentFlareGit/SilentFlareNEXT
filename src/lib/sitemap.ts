export type SitemapEntry = {
	loc: string;
	lastmod?: string;
	image?: string;
};

export function escapeXml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

export function xmlResponse(xml: string): Response {
	return new Response(xml, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=300, must-revalidate",
		},
	});
}

export function sitemapIndex(site: URL, paths: string[]): string {
	const items = paths
		.map(
			(path) =>
				`<sitemap><loc>${escapeXml(new URL(path, site).toString())}</loc></sitemap>`,
		)
		.join("");
	return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</sitemapindex>`;
}

export function sitemapUrlSet(entries: SitemapEntry[]): string {
	const hasImages = entries.some((entry) => entry.image);
	const namespace = hasImages
		? ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'
		: "";
	const items = entries
		.map((entry) => {
			const lastmod = entry.lastmod
				? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>`
				: "";
			const image = entry.image
				? `<image:image><image:loc>${escapeXml(entry.image)}</image:loc></image:image>`
				: "";
			return `<url><loc>${escapeXml(entry.loc)}</loc>${lastmod}${image}</url>`;
		})
		.join("");
	return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${namespace}>${items}</urlset>`;
}

export function paginatedUrls(
	site: URL,
	rootPath: string,
	pages: number,
): string[] {
	const normalizedRoot = `/${rootPath.replace(/^\/+|\/+$/g, "")}/`.replace(
		"//",
		"/",
	);
	return Array.from({ length: Math.max(1, pages) }, (_, index) => {
		const page = index + 1;
		return new URL(
			page === 1 ? normalizedRoot : `${normalizedRoot}${page}/`,
			site,
		).toString();
	});
}
