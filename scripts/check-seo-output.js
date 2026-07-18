import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";
import { parse } from "parse5";

const DIST = path.resolve("dist");
const SITE_ORIGIN = "https://blog.silentflare.com";
const failures = [];

function walk(node, visit) {
	visit(node);
	for (const child of node.childNodes ?? []) walk(child, visit);
	if (node.content) walk(node.content, visit);
}

function attributes(node) {
	return Object.fromEntries((node.attrs ?? []).map((attr) => [attr.name, attr.value]));
}

function textContent(node) {
	let value = "";
	walk(node, (child) => {
		if (child.nodeName === "#text") value += child.value ?? "";
	});
	return value.trim();
}

function elements(document, tagName) {
	const matches = [];
	walk(document, (node) => {
		if (node.tagName === tagName) matches.push(node);
	});
	return matches;
}

function metaContent(document, name) {
	return elements(document, "meta")
		.map((node) => attributes(node))
		.find((attrs) => attrs.name?.toLowerCase() === name.toLowerCase())?.content;
}

function linksByRel(document, rel) {
	return elements(document, "link").filter((node) =>
		(attributes(node).rel ?? "").split(/\s+/).includes(rel),
	);
}

function flattenJsonLd(value) {
	if (Array.isArray(value)) return value.flatMap(flattenJsonLd);
	if (!value || typeof value !== "object") return [];
	return [value, ...Object.values(value).flatMap(flattenJsonLd)];
}

async function htmlFiles(directory) {
	const files = [];
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const fullPath = path.join(directory, entry.name);
		if (entry.isDirectory()) files.push(...(await htmlFiles(fullPath)));
		else if (entry.name.endsWith(".html")) files.push(fullPath);
	}
	return files;
}

function routeForFile(file) {
	const relative = path.relative(DIST, file).replace(/\\/g, "/");
	if (relative === "index.html") return "/";
	if (relative === "404.html") return "/404.html";
	return `/${relative.replace(/index\.html$/, "")}`;
}

function fileForUrl(url) {
	const parsed = new URL(url, SITE_ORIGIN);
	if (parsed.origin !== SITE_ORIGIN) return undefined;
	const pathname = decodeURIComponent(parsed.pathname);
	if (pathname === "/") return path.join(DIST, "index.html");
	if (path.extname(pathname)) return path.join(DIST, pathname.slice(1));
	return path.join(DIST, pathname.slice(1), "index.html");
}

function fail(route, message) {
	failures.push(`${route}: ${message}`);
}

const records = [];
for (const file of await htmlFiles(DIST)) {
	const route = routeForFile(file);
	const html = await readFile(file, "utf8");
	const document = parse(html);
	const titles = elements(document, "title");
	const descriptions = elements(document, "meta").filter(
		(node) => attributes(node).name?.toLowerCase() === "description",
	);
	const canonicalLinks = linksByRel(document, "canonical");
	const robots = metaContent(document, "robots") ?? "";
	const noindex = robots.toLowerCase().includes("noindex");
	const htmlElement = elements(document, "html")[0];
	const h1s = elements(document, "h1").filter((node) => textContent(node));
	const jsonLd = [];

	for (const script of elements(document, "script")) {
		if (attributes(script).type !== "application/ld+json") continue;
		try {
			jsonLd.push(JSON.parse(textContent(script)));
		} catch (error) {
			fail(route, `invalid JSON-LD (${error.message})`);
		}
	}

	if (titles.length !== 1 || !textContent(titles[0])) fail(route, "must have one non-empty title");
	if (descriptions.length !== 1 || !attributes(descriptions[0]).content?.trim()) {
		fail(route, "must have one non-empty meta description");
	}
	if (!attributes(htmlElement ?? {}).lang?.trim()) fail(route, "missing html lang");
	if (!robots) fail(route, "missing robots meta");
	if (!noindex) {
		if (canonicalLinks.length !== 1) fail(route, "indexable page must have one canonical");
		if (h1s.length !== 1) fail(route, `indexable page must have one H1, found ${h1s.length}`);
		if (jsonLd.length === 0) fail(route, "indexable page must have JSON-LD");
	}
	const canonical = canonicalLinks[0] ? attributes(canonicalLinks[0]).href : undefined;
	if (canonical) {
		try {
			const canonicalUrl = new URL(canonical);
			if (canonicalUrl.protocol !== "https:" || canonical.includes("example.com")) {
				fail(route, `invalid canonical ${canonical}`);
			}
		} catch {
			fail(route, `invalid canonical ${canonical}`);
		}
	}
	if (html.includes("example.com")) fail(route, "contains example.com");

	if (route.startsWith("/posts/") && !noindex) {
		const nodes = jsonLd.flatMap(flattenJsonLd);
		const article = nodes.find((node) => node["@type"] === "BlogPosting");
		if (!article) fail(route, "missing BlogPosting JSON-LD");
		else {
			if (!article.author || (Array.isArray(article.author) && article.author.length === 0)) {
				fail(route, "BlogPosting is missing author");
			}
			if (!article.datePublished || !article.dateModified) fail(route, "BlogPosting is missing dates");
			if (!article.mainEntityOfPage) fail(route, "BlogPosting is missing mainEntityOfPage");
		}
		const cover = elements(document, "div").find((node) => attributes(node).id === "post-cover");
		const coverImage = cover ? elements(cover, "img")[0] : undefined;
		if (coverImage) {
			const imageAttrs = attributes(coverImage);
			if (!imageAttrs.alt?.trim()) fail(route, "post cover is missing alt text");
			if (!imageAttrs.width || !imageAttrs.height) fail(route, "post cover is missing dimensions");
		}
	}

	records.push({ route, file, document, noindex, canonical });
}

const parser = new XMLParser({ ignoreAttributes: false });
const indexXml = await readFile(path.join(DIST, "sitemap-index.xml"), "utf8");
const indexData = parser.parse(indexXml);
const sitemapNodes = indexData.sitemapindex?.sitemap ?? [];
const sitemapLocations = (Array.isArray(sitemapNodes) ? sitemapNodes : [sitemapNodes]).map(
	(node) => node.loc,
);
const sitemapUrls = new Set();

for (const sitemapLocation of sitemapLocations) {
	const sitemapFile = fileForUrl(sitemapLocation);
	if (!sitemapFile) {
		fail("sitemap-index.xml", `external sitemap ${sitemapLocation}`);
		continue;
	}
	try {
		const xml = await readFile(sitemapFile, "utf8");
		const data = parser.parse(xml);
		const urlNodes = data.urlset?.url ?? [];
		for (const node of Array.isArray(urlNodes) ? urlNodes : [urlNodes]) {
			if (!node?.loc) continue;
			if (sitemapUrls.has(node.loc)) fail("sitemap", `duplicate URL ${node.loc}`);
			sitemapUrls.add(node.loc);
		}
	} catch {
		fail("sitemap-index.xml", `missing child sitemap ${sitemapLocation}`);
	}
}

for (const url of sitemapUrls) {
	const target = fileForUrl(url);
	if (!target) {
		fail("sitemap", `external URL ${url}`);
		continue;
	}
	try {
		await access(target);
	} catch {
		fail("sitemap", `URL has no build output ${url}`);
		continue;
	}
	const record = records.find((item) => item.file === target);
	if (!record) fail("sitemap", `URL is not HTML ${url}`);
	else {
		if (record.noindex) fail(record.route, "noindex page is present in sitemap");
		if (record.canonical !== url) fail(record.route, `sitemap URL does not match canonical ${url}`);
	}
}

for (const record of records) {
	if (record.noindex || record.route === "/404.html") continue;
	const selfCanonical = new URL(record.route, SITE_ORIGIN).toString();
	if (
		!record.canonical ||
		(record.canonical === selfCanonical && !sitemapUrls.has(record.canonical))
	) {
		fail(record.route, "indexable canonical is missing from sitemap");
	}
	for (const anchor of elements(record.document, "a")) {
		const href = attributes(anchor).href;
		if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("http")) continue;
		const target = fileForUrl(href.split("#", 1)[0]);
		if (!target) continue;
		try {
			await access(target);
		} catch {
			fail(record.route, `broken internal link ${href}`);
		}
	}
}

for (const directory of ["posts", "tags", "authors"]) {
	try {
		const entries = await readdir(path.join(DIST, directory), { withFileTypes: true });
		if (!entries.some((entry) => entry.isDirectory())) fail(directory, "missing generated content route");
	} catch {
		fail(directory, "missing generated content directory");
	}
}

if (failures.length > 0) {
	throw new Error(`SEO verification failed:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
}

console.log(`Verified SEO for ${records.length} HTML pages and ${sitemapUrls.size} sitemap URLs.`);
