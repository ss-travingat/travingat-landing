import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// POST — upload a blog image
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

    const originalName = file instanceof File ? file.name : "upload.png";
    const ext = path.extname(originalName) || ".png";
    const filename = `blog-${Date.now()}${ext}`;
    const publicDir = path.join(process.cwd(), "public", "images");

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const filePath = path.join(publicDir, filename);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ url: `/images/${filename}` }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Blog image upload error:", message);
    return NextResponse.json(
      { error: `Failed to upload: ${message}` },
      { status: 500 }
    );
  }
}
