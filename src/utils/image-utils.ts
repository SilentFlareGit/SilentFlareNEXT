const GHOST_IMAGE_PATH = "/content/images/";

export function ghostImageUrl(source: string, width: number): string {
	try {
		const image = new URL(source);
		if (!image.pathname.includes(GHOST_IMAGE_PATH)) return source;
		if (image.pathname.includes("/content/images/size/")) {
			image.pathname = image.pathname.replace(
				/\/content\/images\/size\/w\d+\//,
				`/content/images/size/w${width}/`,
			);
		} else {
			image.pathname = image.pathname.replace(
				GHOST_IMAGE_PATH,
				`/content/images/size/w${width}/`,
			);
		}
		return image.toString();
	} catch {
		return source;
	}
}

export function ghostImageSrcset(source: string): string | undefined {
	if (!source.startsWith("http") || !source.includes(GHOST_IMAGE_PATH)) {
		return undefined;
	}
	return [480, 800, 1200, 1600]
		.map((width) => `${ghostImageUrl(source, width)} ${width}w`)
		.join(", ");
}
