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

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await ensureAdminSession())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const adminKey = getAdminKey();
  if (!adminKey) {
    return NextResponse.json({ error: "admin api key not configured" }, { status: 500 });
  }

  const { id } = await context.params;
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "missing user data in request body" }, { status: 400 });
  }

  try {
    const { getDrizzle } = await import("@/lib/drizzle");
    const { users, waitlist } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    const db = getDrizzle();
    
    const now = new Date();

    // Soft delete the user in Neon DB
    await db.update(users)
      .set({ deleted_at: now })
      .where(eq(users.id, id));

    if (body.email) {
      // Clean up any associated waitlist
      await db.update(waitlist)
        .set({ deleted_at: now })
        .where(eq(waitlist.email, body.email));
    }

    const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        "X-Admin-Key": adminKey,
      },
    });
    
    // If the backend fails to delete, we don't rollback the archive, it's fine, it acts as a backup.
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json({ error: "backend unavailable or database error" }, { status: 502 });
  }
}
