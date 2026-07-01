import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const requireContent = process.argv.includes("--require-content");

const requiredFiles = [
	"index.html",
	"404.html",
	"about/index.html",
	"accounts/index.html",
	"auth/index.html",
	"archive/index.html",
	"admin/index.html",
	"bots/index.html",
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

const botsHtml = await readFile(path.join("dist", "bots", "index.html"), "utf8");
const requiredBotNeedles = [
	"Owner-approved operations",
	"Send approval request",
	"SilentFlare DB Backup",
	"console",
];
const missingBotNeedles = requiredBotNeedles.filter(
	(needle) => !botsHtml.includes(needle),
);
if (missingBotNeedles.length > 0) {
	throw new Error(
		`Bot management page verification failed. Missing content: ${missingBotNeedles.join(", ")}`,
	);
}
if (botsHtml.includes("login-username")) {
	throw new Error(
		"Bot management page verification failed. Username/password login marker is present.",
	);
}

console.log("Verified bot management page content.");

const adminHtml = await readFile(
	path.join("dist", "admin", "index.html"),
	"utf8",
);
const requiredAdminNeedles = [
	"SilentFlare Admin",
	"public users and comments",
	"SilentFlare user and comment control",
];
const missingAdminNeedles = requiredAdminNeedles.filter(
	(needle) => !adminHtml.includes(needle),
);
if (missingAdminNeedles.length > 0) {
	throw new Error(
		`Admin page verification failed. Missing content: ${missingAdminNeedles.join(", ")}`,
	);
}

console.log("Verified admin management page content.");

const accountHtml = await readFile(
	path.join("dist", "accounts", "index.html"),
	"utf8",
);
const requiredAccountNeedles = [
	"SilentFlare Accounts",
	"SilentFlare accounts center",
	"unified login register email verification profile avatar upload IP region country city two factor security",
];
const missingAccountNeedles = requiredAccountNeedles.filter(
	(needle) => !accountHtml.includes(needle),
);
if (missingAccountNeedles.length > 0) {
	throw new Error(
		`Account page verification failed. Missing content: ${missingAccountNeedles.join(", ")}`,
	);
}

console.log("Verified accounts center page content.");

const authHtml = await readFile(path.join("dist", "auth", "index.html"), "utf8");
for (const needle of ["Sign in", "SilentFlare unified login authentication"]) {
	if (!authHtml.includes(needle)) {
		throw new Error(`Unified auth page verification failed. Missing content: ${needle}`);
	}
}

console.log("Verified unified auth page content.");

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
