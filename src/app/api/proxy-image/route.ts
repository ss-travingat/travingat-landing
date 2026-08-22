import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return new NextResponse("Missing url parameter", { status: 400 });

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
    
    const buffer = await res.arrayBuffer();
    const headers = new Headers();
    headers.set("Content-Type", res.headers.get("Content-Type") || "image/jpeg");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    // Add CORS headers so html-to-image can access it if needed
    headers.set("Access-Control-Allow-Origin", "*");
    
    return new NextResponse(buffer, { headers });
  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse("Error proxying image", { status: 500 });
  }
}
