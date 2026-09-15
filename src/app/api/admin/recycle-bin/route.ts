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
    
    // Fetch soft-deleted waitlist entries
    const deletedWaitlist = await sql`
      SELECT *
      FROM waitlist
      WHERE deleted_at IS NOT NULL
      ORDER BY deleted_at DESC
    `;

    // Fetch soft-deleted users
    const deletedUsers = await sql`
      SELECT *
      FROM users
      WHERE deleted_at IS NOT NULL
      ORDER BY deleted_at DESC
    `;

    // Fetch soft-deleted featured profiles
    const deletedProfiles = await sql`
      SELECT *
      FROM featured_profiles
      WHERE deleted_at IS NOT NULL
      ORDER BY deleted_at DESC
    `;

    return NextResponse.json({ waitlist: deletedWaitlist, users: deletedUsers, profiles: deletedProfiles });
  } catch (error) {
    console.error("Failed to fetch recycle bin items:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// Used for cron job auto-deletion
export async function DELETE(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  
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
    
    // Delete items older than 30 days
    const result1 = await sql`
      DELETE FROM waitlist
      WHERE deleted_at < NOW() - INTERVAL '30 days'
      RETURNING id
    `;
    
    const result2 = await sql`
      DELETE FROM users
      WHERE deleted_at < NOW() - INTERVAL '30 days'
      RETURNING id
    `;

    const result3 = await sql`
      DELETE FROM featured_profiles
      WHERE deleted_at < NOW() - INTERVAL '30 days'
      RETURNING id
    `;
    
    return NextResponse.json({ success: true, deletedCount: result1.length + result2.length + result3.length });
  } catch (error) {
    console.error("Failed to auto-delete old items:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
