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

  // Dynamic import so that a missing/incompatible sharp native binary only
  // fails inside this function (caught by callers) rather than crashing the
  // entire route module at load time.
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

  // Try AVIF first; fall back to WebP if AVIF encoding fails (e.g. missing
  // codec support in some environments).
  try {
    const avifBuffer = await resized.clone().avif({ 
      quality: 55,           // Optimal quality sweet-spot for AVIF (50-60)
      effort: 5,             // CPU effort 0-9 (5 balances speed and size efficiency)
      chromaSubsampling: '4:2:0', // Essential for lossy web compression savings
      lossless: false,
    }).toBuffer();

    // Strict Budget Check: If compressed size exceeds source size, fall back
    if (avifBuffer.byteLength >= fileBuffer.byteLength) {
      const metadata = await sharp(fileBuffer).metadata();
      const format = metadata.format || mimeType.split('/')[1] || 'bin';
      return {
        buffer: fileBuffer,
        contentType: metadata.format ? `image/${metadata.format}` : mimeType,
        ext: `.${format}`,
      };
    }

    return {
      buffer: Buffer.from(avifBuffer),
      contentType: "image/avif",
      ext: ".avif",
    };
  } catch {
    // AVIF encoding unavailable — use WebP as a reliable fallback.
  }

  const webpBuffer = await resized.clone().webp({ quality: 82 }).toBuffer();
  
  // Strict Budget Check for WebP as well
  if (webpBuffer.byteLength >= fileBuffer.byteLength) {
    const metadata = await sharp(fileBuffer).metadata();
    const format = metadata.format || mimeType.split('/')[1] || 'bin';
    return {
      buffer: fileBuffer,
      contentType: metadata.format ? `image/${metadata.format}` : mimeType,
      ext: `.${format}`,
    };
  }

  return {
    buffer: Buffer.from(webpBuffer),
    contentType: "image/webp",
    ext: ".webp",
  };
}
