import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
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
    const sql = getDb();
    
    // Fetch the waitlist entry
    const existing = await sql`SELECT * FROM waitlist WHERE id = ${id}`;
    if (existing.length === 0) {
      return NextResponse.json({ error: "Waitlist entry not found" }, { status: 404 });
    }
    
    const entry = existing[0];
    
    // Archive the entry
    await sql`
      INSERT INTO archived_users (original_id, email, source, data)
      VALUES (${String(entry.id)}, ${entry.email}, 'waitlist', ${JSON.stringify(entry)}::jsonb)
    `;
    
    // Delete from waitlist and other related local tables
    await sql`DELETE FROM waitlist WHERE id = ${id}`;
    if (entry.email) {
      await sql`DELETE FROM explorer_cards WHERE email = ${entry.email}`;
      await sql`DELETE FROM users WHERE email = ${entry.email}`;
      await sql`DELETE FROM otps WHERE email = ${entry.email}`;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete waitlist entry:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
