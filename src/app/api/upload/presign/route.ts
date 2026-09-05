import { NextResponse } from "next/server";
import { generatePresignedUrl, uploadLandingAsset } from "@/lib/r2-upload";
import path from "path";

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

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const prefixValue = formData.get("prefix");
      const prefix = typeof prefixValue === "string" ? prefixValue : "uploads";

      if (!file || typeof file.arrayBuffer !== "function") {
        return NextResponse.json({ error: "No valid file found in upload" }, { status: 400 });
      }

      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Only image uploads are supported" }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      if (buffer.length === 0) {
        return NextResponse.json({ error: "Uploaded file is empty" }, { status: 400 });
      }

      const uploadBuffer: Buffer = buffer;
      const uploadContentType = file.type;
      const uploadExt = extensionFromMimeType(file.type);

      const cleanPrefix = prefix.replace(/^\/+|\/+$/g, "");
      const fileName = `${cleanPrefix}-${Date.now()}${uploadExt}`;
      const keySuffix = `${cleanPrefix}/${fileName}`;

      const uploaded = await uploadLandingAsset({
        fileBuffer: uploadBuffer,
        keySuffix,
        contentType: uploadContentType,
      });

      // Trigger Media Engine async optimization
      try {
        const urlObj = new URL(uploaded.url);
        const optimizeKey = urlObj.pathname.substring(1);
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/media-engine/optimize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: optimizeKey, mediaType: "IMAGE" }),
        });
      } catch (err) {
        console.warn("Media engine optimization trigger failed", err);
      }

      return NextResponse.json(
        { publicUrl: uploaded.url, uploadUrl: uploaded.url }, // Backwards compatibility for callers expecting publicUrl
        { status: 201 }
      );
    }

    // Standard presign path
    const body = await request.json();
    const { fileName, fileType, prefix } = body;

    if (!fileName || !fileType || !prefix) {
      return NextResponse.json(
        { error: "Missing required fields: fileName, fileType, prefix" },
        { status: 400 }
      );
    }

    const cleanPrefix = prefix.replace(/^\/+|\/+$/g, "");
    const ext = path.extname(fileName) || "";
    const uniqueName = `${cleanPrefix}-${Date.now()}${ext}`;
    const keySuffix = `${cleanPrefix}/${uniqueName}`;

    const { uploadUrl, publicUrl } = await generatePresignedUrl({
      keySuffix,
      contentType: fileType,
    });

    return NextResponse.json({ uploadUrl, publicUrl }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Presign URL generation error:", message);
    return NextResponse.json(
      { error: `Failed to process upload: ${message}` },
      { status: 500 }
    );
  }
}
