import { NextResponse } from "next/server";
import { generatePresignedUrl } from "@/lib/r2-upload";

export const dynamic = "force-dynamic";

function extensionFromMimeType(mimeType: string): string {
  const extMap: Record<string, string> = {
    "image/avif": ".avif",
    "image/jpeg": ".jpeg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/heic": ".heic",
    "image/heif": ".heif",
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "video/quicktime": ".mov",
  };
  return extMap[mimeType.toLowerCase()] || ".bin";
}

/**
 * POST — Generate a presigned URL for direct browser → R2 upload.
 * 
 * The client requests a presigned URL and uploads directly to R2.
 * After upload, the client triggers the Media Engine to process and optimize the media.
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

    const normalizedFileType = String(fileType).toLowerCase();
    const ext = extensionFromMimeType(normalizedFileType);
    const cleanPrefix = prefix.replace(/^\/+|\/+$/g, "");
    const uniqueName = `${cleanPrefix}-${Date.now()}${ext}`;
    const keySuffix = `profiles/${uniqueName}`;

    const { uploadUrl, publicUrl } = await generatePresignedUrl({
      keySuffix,
      contentType: normalizedFileType,
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
