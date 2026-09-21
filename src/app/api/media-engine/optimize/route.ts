import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { key, mediaType = "IMAGE" } = await request.json();

    if (!key) {
      return NextResponse.json({ error: "Missing key" }, { status: 400 });
    }

    const bucket = process.env.R2_BUCKET_NAME;
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKey = process.env.R2_ACCESS_KEY_ID;
    const secretKey = process.env.R2_SECRET_ACCESS_KEY;

    if (!bucket || !accountId || !accessKey || !secretKey) {
      return NextResponse.json({ error: "Missing R2 credentials" }, { status: 500 });
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
    const finalUrl = `${backendUrl}/api/media/remote`;

    const payload = {
      media_type: mediaType,
      thumbnails: [720],
      remote_credentials: {
        bucket,
        key,
        endpoint_url: `https://${accountId}.r2.cloudflarestorage.com`,
        access_key: accessKey,
        secret_key: secretKey,
      },
    };

    console.log("[media-engine] Calling backend at:", finalUrl, "key:", key);

    const res = await fetch(finalUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[media-engine] Backend optimize failed:", errorText);
      return NextResponse.json({ error: "Backend failed" }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[media-engine] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
