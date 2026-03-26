import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getAdminSessionCookieName,
  verifyAdminSessionToken,
} from "@/lib/admin-session";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function ensureAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAdminSessionCookieName())?.value || "";
  return verifyAdminSessionToken(token);
}

function getAdminKey() {
  return process.env.ADMIN_API_KEY || process.env.ADMIN_DASHBOARD_PASSWORD || "";
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await ensureAdminSession())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const adminKey = getAdminKey();
  if (!adminKey) {
    return NextResponse.json({ error: "admin api key not configured" }, { status: 500 });
  }

  const { id } = await context.params;
  const body = await req.json().catch(() => ({}));

  try {
    const res = await fetch(`${API_URL}/api/admin/users/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Key": adminKey,
      },
      body: JSON.stringify({
        disabled: Boolean(body?.disabled),
        reason: String(body?.reason || ""),
      }),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "backend unavailable" }, { status: 502 });
  }
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await ensureAdminSession())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const adminKey = getAdminKey();
  if (!adminKey) {
    return NextResponse.json({ error: "admin api key not configured" }, { status: 500 });
  }

  const { id } = await context.params;

  try {
    const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        "X-Admin-Key": adminKey,
      },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "backend unavailable" }, { status: 502 });
  }
}
