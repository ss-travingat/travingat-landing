import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { key, mediaType = "IMAGE" } = await request.json();

    if (!key) {
      return NextResponse.json({ error: "Missing key" }, { status: 400 });
    }

    const apiKey = process.env.MEDIA_ENGINE_API_KEY;
    if (!apiKey) {
      console.warn("MEDIA_ENGINE_API_KEY is not configured");
      return NextResponse.json({ status: "skipped" });
    }

    const bucket = process.env.R2_BUCKET_NAME;
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKey = process.env.R2_ACCESS_KEY_ID;
    const secretKey = process.env.R2_SECRET_ACCESS_KEY;

    if (!bucket || !accountId || !accessKey || !secretKey) {
      return NextResponse.json({ error: "Missing R2 credentials" }, { status: 500 });
    }

    const endpointUrl = `https://${accountId}.r2.cloudflarestorage.com`;

    const payload = {
      media_type: mediaType,
      thumbnails: [320, 480, 720],
      remote_credentials: {
        bucket,
        key,
        endpoint_url: endpointUrl,
        access_key: accessKey,
        secret_key: secretKey,
      },
    };

    const mediaEngineUrl = process.env.MEDIA_ENGINE_API_URL || "https://media-engine.switchspace.in/api/v1";
    const finalUrl = `${mediaEngineUrl}/media/remote/`;
    console.log("Calling media engine at:", finalUrl);
    
    const res = await fetch(finalUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Media Engine remote upload failed:", errorText);
      return NextResponse.json({ error: "Media Engine failed" }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error calling media engine optimize:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
