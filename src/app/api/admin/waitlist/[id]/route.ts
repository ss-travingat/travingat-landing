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
    
    // Soft delete the waitlist entry
    await sql`
      UPDATE waitlist 
      SET deleted_at = NOW() 
      WHERE id = ${id}
    `;
    
    // Also soft delete associated user if email exists
    if (entry.email) {
      await sql`
        UPDATE users 
        SET deleted_at = NOW() 
        WHERE email = ${entry.email}
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete waitlist entry:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
