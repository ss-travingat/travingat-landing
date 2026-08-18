import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  getAdminSessionCookieName,
  verifyAdminSessionToken,
} from "@/lib/admin-session";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAdminSessionCookieName())?.value || "";
  
  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, original_id, email, source, deleted_at, data
      FROM archived_users
      ORDER BY deleted_at DESC
    `;
    return NextResponse.json({ archived_users: rows });
  } catch (error) {
    console.error("Failed to fetch archived users:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// Used for cron job auto-deletion
export async function DELETE(req: Request) {
  // Check for cron authorization (using a secret header or Vercel cron header)
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  
  // Note: For simplicity if CRON_SECRET is not set we might allow manual admin trigger or rely on Vercel's protections.
  // We'll require either a valid admin session or the correct CRON_SECRET.
  let isAuthorized = false;
  
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    isAuthorized = true;
  } else {
    const cookieStore = await cookies();
    const token = cookieStore.get(getAdminSessionCookieName())?.value || "";
    if (verifyAdminSessionToken(token)) {
      isAuthorized = true;
    }
  }

  if (!isAuthorized) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const sql = getDb();
    // Delete users older than 30 days
    const result = await sql`
      DELETE FROM archived_users
      WHERE deleted_at < NOW() - INTERVAL '30 days'
      RETURNING id
    `;
    
    return NextResponse.json({ success: true, deletedCount: result.length });
  } catch (error) {
    console.error("Failed to auto-delete archived users:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
