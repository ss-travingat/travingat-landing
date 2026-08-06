import { NextResponse } from "next/server";
import { compressImage } from "@/lib/image-compress";
import { uploadProfileAsset } from "@/lib/r2-upload";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow more time for large images

export async function POST(request: Request) {
  try {

    const { imageUrl, prefix } = await request.json();
    if (!imageUrl || !prefix) {
      return NextResponse.json({ error: "Missing imageUrl or prefix" }, { status: 400 });
    }

    // 1. Download the large image from R2
    const fetchRes = await fetch(imageUrl);
    if (!fetchRes.ok) {
      throw new Error(`Failed to fetch image from R2: ${fetchRes.statusText}`);
    }
    
    const arrayBuffer = await fetchRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = fetchRes.headers.get("content-type") || "application/octet-stream";

    // 2. Compress & Convert to WebP using sharp
    const compressed = await compressImage(buffer, contentType, { maxDimension: 3200 });

    // 3. Upload the optimized WebP back to R2
    const cleanPrefix = prefix.replace(/^\/+|\/+$/g, "");
    const fileName = `${cleanPrefix}-optimized-${Date.now()}${compressed.ext}`;
    const uploaded = await uploadProfileAsset({
      fileBuffer: compressed.buffer,
      fileName,
      contentType: compressed.contentType,
    });

    return NextResponse.json(
      { url: uploaded.url, contentType: compressed.contentType },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Large image processing error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
