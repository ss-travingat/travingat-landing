import { NextResponse } from "next/server";
import { uploadProfileAsset } from "@/lib/r2-upload";
import { compressImage } from "@/lib/image-compress";

export const dynamic = "force-dynamic";

// POST — upload a profile image (avatar, cover, or gallery)
export async function POST(request: Request) {
  try {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: "Request must be multipart/form-data" },
        { status: 400 }
      );
    }

    const file = formData.get("file") as File | null;
    const imageType = formData.get("type") as string | null; // "avatar", "cover", or "gallery"

    if (!file || typeof file !== "object" || typeof file.arrayBuffer !== "function") {
      return NextResponse.json(
        { error: "No valid file found in upload" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      return NextResponse.json(
        { error: "Uploaded file is empty" },
        { status: 400 }
      );
    }

    const isVideo = typeof file.type === "string" && file.type.startsWith("video/");
    const isImage = typeof file.type === "string" && file.type.startsWith("image/");
    const maxBytes = isVideo ? 50 * 1024 * 1024 : 20 * 1024 * 1024;
    if (buffer.length > maxBytes) {
      return NextResponse.json(
        { error: isVideo ? "Video too large. Max 50MB." : "Image too large. Max 20MB." },
        { status: 400 }
      );
    }

    const prefix = imageType || "profile";
    let uploadBuffer: Buffer = buffer;
    let uploadContentType: string | undefined = file.type || undefined;
    let uploadFilename: string;

    if (isImage) {
      // ── Compress images before uploading ──
      const mimeType = file.type || "image/png";
      const compressed = await compressImage(uploadBuffer, mimeType);
      uploadBuffer = compressed.buffer;
      uploadContentType = compressed.contentType;
      uploadFilename = `${prefix}-${Date.now()}${compressed.ext}`;

      console.log(
        `[image-compress] ${prefix}: ${(buffer.length / 1024).toFixed(0)}KB → ${(uploadBuffer.length / 1024).toFixed(0)}KB (${((1 - uploadBuffer.length / buffer.length) * 100).toFixed(0)}% smaller)`
      );
    } else {
      // Videos and other files pass through uncompressed
      const originalName = file.name || "upload.bin";
      const dotIdx = originalName.lastIndexOf(".");
      const ext = dotIdx >= 0 ? originalName.slice(dotIdx) : ".bin";
      uploadFilename = `${prefix}-${Date.now()}${ext}`;
    }

    const uploaded = await uploadProfileAsset({
      fileBuffer: uploadBuffer,
      fileName: uploadFilename,
      contentType: uploadContentType,
    });

    return NextResponse.json({ url: uploaded.url }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Profile image upload error:", message);
    return NextResponse.json(
      { error: `Failed to upload file: ${message}` },
      { status: 500 }
    );
  }
}
