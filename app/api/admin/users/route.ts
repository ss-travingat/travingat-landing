import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getAdminSessionCookieName,
  verifyAdminSessionToken,
} from "@/lib/admin-session";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAdminSessionCookieName())?.value || "";
  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const adminKey = process.env.ADMIN_API_KEY || process.env.ADMIN_DASHBOARD_PASSWORD || "";
  if (!adminKey) {
    return NextResponse.json({ error: "admin api key not configured" }, { status: 500 });
  }

  const incoming = new URL(req.url);
  const limit = incoming.searchParams.get("limit") || "300";

  try {
    const res = await fetch(`${API_URL}/api/admin/users?limit=${encodeURIComponent(limit)}`, {
      headers: {
        "X-Admin-Key": adminKey,
      },
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "backend unavailable" }, { status: 502 });
  }
}
