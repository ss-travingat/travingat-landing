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
 * - Converts all raster images (JPEG, PNG, WEBP, TIFF, etc.) to WebP with
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
    /** Max width or height — images larger than this are down-scaled. Default 2048. */
    maxDimension?: number;
  }
): Promise<CompressResult> {
  const maxDimension = opts?.maxDimension ?? 2048;

  // Skip compression for non-raster or animated formats
  if (
    mimeType === "image/svg+xml" ||
    mimeType === "image/gif"
  ) {
    const ext = mimeType === "image/svg+xml" ? ".svg" : ".gif";
    return { buffer: fileBuffer, contentType: mimeType, ext };
  }

  // Dynamic import — Next.js needs serverExternalPackages: ["sharp"] in
  // next.config.ts so Vercel bundles the native binary correctly.
  const sharp = (await import("sharp")).default;

  const resized = sharp(fileBuffer)
    // Auto-rotate based on EXIF orientation, then strip all metadata
    .rotate()
    .resize({
      width: maxDimension,
      height: maxDimension,
      fit: "inside",
      withoutEnlargement: true, // never upscale
    });

  let quality = 82;
  let webpBuffer = await resized.clone().webp({ quality }).toBuffer();
  
  // If the original file was large, ensure the final WebP is under 400KB.
  // If the original was already < 500KB, don't crush the quality further just to hit 400KB.
  if (fileBuffer.byteLength > 500 * 1024) {
    if (webpBuffer.byteLength > 400 * 1024) {
      quality = 65;
      webpBuffer = await resized.clone().webp({ quality }).toBuffer();
    }
    if (webpBuffer.byteLength > 400 * 1024) {
      quality = 50;
      webpBuffer = await resized.clone().webp({ quality }).toBuffer();
    }
  }

  return {
    buffer: Buffer.from(webpBuffer),
    contentType: "image/webp",
    ext: ".webp",
  };
}
