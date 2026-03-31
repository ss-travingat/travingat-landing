export default function imageLoader({
	src,
	width,
	quality,
}: {
	src: string;
	width: number;
	quality?: number;
}): string {
	// R2 CDN images are already globally cached — serve them directly.
	// Routing them through /_next/image causes timeout for large files.
	if (src.startsWith("https://")) {
		return src;
	}
	// Local / relative images still go through Next.js optimization.
	return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality ?? 75}`;
}
