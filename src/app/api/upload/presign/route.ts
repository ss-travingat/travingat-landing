import { NextResponse } from "next/server";
import { generatePresignedUrl } from "@/lib/r2-upload";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fileName, fileType, prefix } = body;

    if (!fileName || !fileType || !prefix) {
      return NextResponse.json(
        { error: "Missing required fields: fileName, fileType, prefix" },
        { status: 400 }
      );
    }

    // Clean prefix to ensure it doesn't have leading/trailing slashes
    const cleanPrefix = prefix.replace(/^\/+|\/+$/g, "");
    const ext = path.extname(fileName) || "";
    // We generate a unique name so that uploads don't overwrite each other easily
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
      { error: `Failed to generate upload URL: ${message}` },
      { status: 500 }
    );
  }
}
