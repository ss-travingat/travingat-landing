import { NextResponse } from "next/server";
import { generatePresignedUrl } from "@/lib/r2-upload";

export const dynamic = "force-dynamic";

/**
 * POST — Generate a presigned URL for direct browser → R2 upload.
 * 
 * The browser compresses and converts the image (WebP) before uploading
 * directly to R2 via the presigned URL. This bypasses Vercel's serverless
 * function entirely for the actual file transfer, avoiding:
 * - Vercel's 4.5MB payload limit
 * - sharp native binary issues on Vercel
 * - Serverless function timeout issues with large files
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fileType, prefix } = body;

    if (!fileType || !prefix) {
      return NextResponse.json(
        { error: "Missing required fields: fileType, prefix" },
        { status: 400 }
      );
    }

    // Determine extension from content type
    const extMap: Record<string, string> = {
      "image/webp": ".webp",
      "image/avif": ".avif",
      "image/jpeg": ".jpeg",
      "image/png": ".png",
      "image/gif": ".gif",
      "image/svg+xml": ".svg",
      "video/mp4": ".mp4",
      "video/webm": ".webm",
      "video/quicktime": ".mov",
    };
    const ext = extMap[fileType] || ".bin";
    const cleanPrefix = prefix.replace(/^\/+|\/+$/g, "");
    const uniqueName = `${cleanPrefix}-${Date.now()}${ext}`;
    const keySuffix = `profiles/${uniqueName}`;

    const { uploadUrl, publicUrl } = await generatePresignedUrl({
      keySuffix,
      contentType: fileType,
    });

    return NextResponse.json({ uploadUrl, publicUrl }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Profile upload presign error:", message);
    return NextResponse.json(
      { error: `Failed to generate upload URL: ${message}` },
      { status: 500 }
    );
  }
}
