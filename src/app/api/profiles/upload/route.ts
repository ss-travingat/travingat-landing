import { NextResponse } from "next/server";
import { generatePresignedUrl } from "@/lib/r2-upload";
import { uploadProfileAsset } from "@/lib/r2-upload";
import { compressImage } from "@/lib/image-compress";

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
 * The browser compresses and converts images to AVIF before uploading
 * directly to R2 via the presigned URL. This bypasses Vercel's serverless
 * function entirely for the actual file transfer, avoiding:
 * - Vercel's 4.5MB payload limit
 * - sharp native binary issues on Vercel
 * - Serverless function timeout issues with large files
 */
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    // Multipart path: server-side AVIF conversion fallback for browsers
    // that cannot reliably produce AVIF client-side.
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const prefixValue = formData.get("prefix");
      const prefix = typeof prefixValue === "string" ? prefixValue : "gallery";

      if (!file || typeof file.arrayBuffer !== "function") {
        return NextResponse.json({ error: "No valid file found in upload" }, { status: 400 });
      }

      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Only image uploads are supported" }, { status: 400 });
      }

      if (file.type === "image/svg+xml" || file.type === "image/gif") {
        return NextResponse.json(
          { error: "SVG and GIF are not supported for profile image uploads" },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      if (buffer.length === 0) {
        return NextResponse.json({ error: "Uploaded file is empty" }, { status: 400 });
      }

      let uploadBuffer: Buffer;
      let uploadContentType: string;
      let uploadExt: string;

      try {
        const compressed = await compressImage(buffer, file.type, { maxDimension: 3200 });
        uploadBuffer = compressed.buffer;
        uploadContentType = compressed.contentType;
        uploadExt = compressed.ext;
      } catch (compressionErr) {
        // Production safety fallback: if AVIF conversion fails for a specific
        // browser/image codec, keep the upload working with original bytes.
        console.warn("Profile upload AVIF conversion failed; uploading original image:", compressionErr);
        uploadBuffer = buffer;
        uploadContentType = file.type;
        uploadExt = extensionFromMimeType(file.type);
      }

      const cleanPrefix = prefix.replace(/^\/+|\/+$/g, "");
      const fileName = `${cleanPrefix}-${Date.now()}${uploadExt}`;
      const uploaded = await uploadProfileAsset({
        fileBuffer: uploadBuffer,
        fileName,
        contentType: uploadContentType,
      });

      return NextResponse.json(
        { url: uploaded.url, contentType: uploadContentType },
        { status: 201 }
      );
    }

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
