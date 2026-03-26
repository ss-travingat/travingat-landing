import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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
    const file = formData.get("file");

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

    // Generate unique filename
    const originalName = file instanceof File ? file.name : "upload.png";
    const ext = path.extname(originalName) || ".png";
    const filename = `testimonial-${Date.now()}${ext}`;
    const publicDir = path.join(process.cwd(), "public");

    // Ensure public directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const publicPath = path.join(publicDir, filename);
    fs.writeFileSync(publicPath, buffer);

    return NextResponse.json({ path: `/${filename}` }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Upload error:", message);
    return NextResponse.json(
      { error: `Failed to upload file: ${message}` },
      { status: 500 }
    );
  }
}
