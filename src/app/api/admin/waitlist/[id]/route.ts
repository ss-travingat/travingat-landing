import { NextResponse } from "next/server";
import { getDrizzle } from "@/lib/drizzle";
import { waitlist, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  getAdminSessionCookieName,
  verifyAdminSessionToken,
} from "@/lib/admin-session";
import { cookies } from "next/headers";

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAdminSessionCookieName())?.value || "";

  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const db = getDrizzle();

    // Fetch the waitlist entry
    const existing = await db.select().from(waitlist).where(eq(waitlist.id, Number(id)));
    if (existing.length === 0) {
      return NextResponse.json({ error: "Waitlist entry not found" }, { status: 404 });
    }

    const entry = existing[0];
    const now = new Date();

    // Soft delete the waitlist entry
    await db.update(waitlist)
      .set({ deleted_at: now })
      .where(eq(waitlist.id, Number(id)));

    // Also soft delete associated user if email exists
    if (entry.email) {
      await db.update(users)
        .set({ deleted_at: now })
        .where(eq(users.email, entry.email));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete waitlist entry:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
