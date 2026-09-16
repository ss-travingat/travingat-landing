import { NextResponse } from "next/server";
import { getDrizzle } from "@/lib/drizzle";
import { waitlist, users, featuredProfiles } from "@/db/schema";
import { isNotNull, desc, sql } from "drizzle-orm";
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
    const db = getDrizzle();
    
    // Fetch soft-deleted waitlist entries
    const deletedWaitlist = await db.select()
      .from(waitlist)
      .where(isNotNull(waitlist.deleted_at))
      .orderBy(desc(waitlist.deleted_at));

    // Fetch soft-deleted users
    const deletedUsers = await db.select()
      .from(users)
      .where(isNotNull(users.deleted_at))
      .orderBy(desc(users.deleted_at));

    // Fetch soft-deleted featured profiles
    const deletedProfiles = await db.select()
      .from(featuredProfiles)
      .where(isNotNull(featuredProfiles.deleted_at))
      .orderBy(desc(featuredProfiles.deleted_at));

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
    const db = getDrizzle();
    
    // Delete items older than 30 days
    const result1 = await db.delete(waitlist)
      .where(sql`${waitlist.deleted_at} < NOW() - INTERVAL '30 days'`)
      .returning({ id: waitlist.id });
    
    const result2 = await db.delete(users)
      .where(sql`${users.deleted_at} < NOW() - INTERVAL '30 days'`)
      .returning({ id: users.id });

    const result3 = await db.delete(featuredProfiles)
      .where(sql`${featuredProfiles.deleted_at} < NOW() - INTERVAL '30 days'`)
      .returning({ id: featuredProfiles.id });
    
    return NextResponse.json({ success: true, deletedCount: result1.length + result2.length + result3.length });
  } catch (error) {
    console.error("Failed to auto-delete old items:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
