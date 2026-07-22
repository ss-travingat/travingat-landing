import "server-only";


interface CompressResult {
  buffer: Buffer;
  contentType: string;
  /** Extension including the leading dot, e.g. ".webp" */
  ext: string;
}

/**
 * Compress an image buffer before uploading to R2.
 *
 * Strategy:
 * - Converts all raster images (JPEG, PNG, WEBP, TIFF, etc.) to AVIF with
 *   optimized lossy compression for best size-to-quality ratio.
 * - SVG and GIF files are returned as-is (SVGs are already tiny; GIFs may be
 *   animated and sharp would flatten them).
 * - Resizes images that exceed `maxDimension` on either axis while preserving
 *   aspect ratio.
 * - Strips EXIF / metadata to reduce size further.
 *
 * @param fileBuffer  Raw file bytes
 * @param mimeType    Original MIME type (e.g. "image/png")
 * @param opts        Optional overrides
 */
export async function compressImage(
  fileBuffer: Buffer,
  mimeType: string,
  opts?: {
    maxDimension?: number;
  }
): Promise<CompressResult> {
  const sharp = (await import("sharp")).default;
  const maxDimension = opts?.maxDimension ?? 2048;

  // Skip compression for non-raster or animated formats
  if (
    mimeType === "image/svg+xml" ||
    mimeType === "image/gif"
  ) {
    const ext = mimeType === "image/svg+xml" ? ".svg" : ".gif";
    return { buffer: fileBuffer, contentType: mimeType, ext };
  }

  let pipeline = sharp(fileBuffer)
    // Auto-rotate based on EXIF orientation, then strip all metadata
    .rotate()
    .resize({
      width: maxDimension,
      height: maxDimension,
      fit: "inside",
      withoutEnlargement: true, // never upscale
    })
    // Convert to AVIF with optimized lossy compression
    .avif({ quality: 65, effort: 4 });

  const outputBuffer = await pipeline.toBuffer();

  return {
    buffer: Buffer.from(outputBuffer),
    contentType: "image/avif",
    ext: ".avif",
  };
}
