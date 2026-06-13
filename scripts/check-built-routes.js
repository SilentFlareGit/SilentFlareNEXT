import { access } from "node:fs/promises";
import path from "node:path";

const requiredFiles = [
	"index.html",
	"404.html",
	"about/index.html",
	"admin/index.html",
	"api/index.html",
	"archive/index.html",
	"cms/index.html",
	"robots.txt",
	"rss.xml",
	"sitemap-index.xml",
	"pagefind/pagefind.js",
];

const missingFiles = [];

for (const relativePath of requiredFiles) {
	try {
		await access(path.join("dist", relativePath));
	} catch {
		missingFiles.push(relativePath);
	}
}

if (missingFiles.length > 0) {
	throw new Error(
		`Missing required build output:\n${missingFiles.map((file) => `- ${file}`).join("\n")}`,
	);
}

console.log(`Verified ${requiredFiles.length} required build outputs.`);
