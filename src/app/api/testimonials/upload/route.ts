import { NextResponse } from "next/server";
import path from "path";
import { uploadLandingAsset } from "@/lib/r2-upload";

export const dynamic = "force-dynamic";

// POST — upload a testimonial photo
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type must be multipart/form-data" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

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

    // Generate unique filename
    const originalName = file.name || "upload.png";
    const ext = path.extname(originalName) || ".png";
    const filename = `testimonial-${Date.now()}${ext}`;
    const uploaded = await uploadLandingAsset({
      fileBuffer: buffer,
      keySuffix: filename,
      contentType: file.type || undefined,
    });

    // Keep both keys for backward compatibility with existing admin UI.
    return NextResponse.json({ path: uploaded.url, url: uploaded.url }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Upload error:", message);
    return NextResponse.json(
      { error: `Failed to upload file: ${message}` },
      { status: 500 }
    );
  }
}
