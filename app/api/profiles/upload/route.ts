import { NextResponse } from "next/server";
import path from "path";
import { uploadProfileAsset } from "@/lib/r2-upload";

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

    const file = formData.get("file");
    const imageType = formData.get("type") as string | null; // "avatar", "cover", or "gallery"

    if (!file || !(file instanceof Blob)) {
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

    const isVideo = file instanceof File && file.type.startsWith("video/");
    const maxBytes = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (buffer.length > maxBytes) {
      return NextResponse.json(
        { error: isVideo ? "Video too large. Max 50MB." : "Image too large. Max 5MB." },
        { status: 400 }
      );
    }

    const originalName = file instanceof File ? file.name : "upload.png";
    const ext = path.extname(originalName) || ".png";
    const prefix = imageType || "profile";
    const filename = `${prefix}-${Date.now()}${ext}`;

    const uploaded = await uploadProfileAsset({
      fileBuffer: buffer,
      fileName: filename,
      contentType: file instanceof File ? file.type : undefined,
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
