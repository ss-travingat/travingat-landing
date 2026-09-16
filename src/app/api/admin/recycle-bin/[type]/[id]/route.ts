import { NextResponse } from "next/server";
import { getDrizzle } from "@/lib/drizzle";
import { waitlist, users, featuredProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  getAdminSessionCookieName,
  verifyAdminSessionToken,
} from "@/lib/admin-session";
import { cookies } from "next/headers";

export async function PATCH(req: Request, context: { params: Promise<{ type: string, id: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAdminSessionCookieName())?.value || "";
  
  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { type, id } = await context.params;

  try {
    const db = getDrizzle();
    
    if (type === "waitlist") {
      await db.update(waitlist).set({ deleted_at: null }).where(eq(waitlist.id, Number(id)));
    } else if (type === "users") {
      await db.update(users).set({ deleted_at: null }).where(eq(users.id, id));
    } else if (type === "profiles") {
      await db.update(featuredProfiles).set({ deleted_at: null }).where(eq(featuredProfiles.id, id));
    } else {
      return NextResponse.json({ error: "invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to restore item:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ type: string, id: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAdminSessionCookieName())?.value || "";
  
  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { type, id } = await context.params;

  try {
    const db = getDrizzle();
    
    if (type === "waitlist") {
      await db.delete(waitlist).where(eq(waitlist.id, Number(id)));
    } else if (type === "users") {
      await db.delete(users).where(eq(users.id, id));
    } else if (type === "profiles") {
      await db.delete(featuredProfiles).where(eq(featuredProfiles.id, id));
    } else {
      return NextResponse.json({ error: "invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to permanently delete item:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
