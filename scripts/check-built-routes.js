import { access, readdir } from "node:fs/promises";
import path from "node:path";

const requireContent = process.argv.includes("--require-content");

const requiredFiles = [
	"index.html",
	"404.html",
	"about/index.html",
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

if (requireContent) {
	const contentRoutes = [
		["posts", "post"],
		["tags", "tag"],
	];
	const missingContentRoutes = [];

	for (const [directory, label] of contentRoutes) {
		let entries = [];
		try {
			entries = await readdir(path.join("dist", directory), {
				withFileTypes: true,
			});
		} catch {
			missingContentRoutes.push(label);
			continue;
		}

		const hasBuiltRoute = entries.some((entry) => entry.isDirectory());
		if (!hasBuiltRoute) {
			missingContentRoutes.push(label);
		}
	}

	if (missingContentRoutes.length > 0) {
		throw new Error(
			`Ghost content verification failed. Missing generated routes for: ${missingContentRoutes.join(", ")}. Confirm Ghost is reachable and contains at least one published post with a tag.`,
		);
	}

	console.log("Verified generated Ghost post and tag routes.");
}
