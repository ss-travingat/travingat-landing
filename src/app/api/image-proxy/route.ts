import { NextRequest, NextResponse } from "next/server";

// Allowlist of hosts we'll proxy — prevents open-proxy abuse
const ALLOWED_HOSTS = [
  "cdn.travingat.com",
  "r2.cloudflarestorage.com",
];

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return new NextResponse("Missing url param", { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return new NextResponse("Invalid url", { status: 400 });
  }

  const isAllowed = ALLOWED_HOSTS.some(
    (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`)
  );
  if (!isAllowed) {
    return new NextResponse("Host not allowed", { status: 403 });
  }

  try {
    const upstream = await fetch(url, { cache: "force-cache" });
    if (!upstream.ok) {
      return new NextResponse("Upstream fetch failed", { status: upstream.status });
    }

    const contentType = upstream.headers.get("content-type") ?? "image/avif";
    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err) {
    console.error("[image-proxy] fetch error", err);
    return new NextResponse("Proxy error", { status: 500 });
  }
}
