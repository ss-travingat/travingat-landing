import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  getAdminSessionCookieName,
  verifyAdminSessionToken,
} from "@/lib/admin-session";
import { cookies } from "next/headers";
import { sendConfirmationEmail } from "@/lib/waitlist-email";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAdminSessionCookieName())?.value || "";
  
  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const { id, type } = await req.json();
    const sql = getDb();
    
    // Fetch the waitlist entry
    const existing = await sql`SELECT * FROM waitlist WHERE id = ${id} LIMIT 1`;
    if (existing.length === 0) {
      return NextResponse.json({ error: "Waitlist entry not found" }, { status: 404 });
    }
    
    const entry = existing[0];
    
    if (type === 'waitlist') {
      await sendConfirmationEmail(entry.email, entry.confirmation_token);
      return NextResponse.json({ success: true, message: "Waitlist email sent" });
    } else if (type === 'explorer') {
      // TODO: implement explorer card resend
      return NextResponse.json({ success: true, message: "Explorer card email sent" });
    } else if (type === 'profile') {
      // TODO: implement profile resend
      return NextResponse.json({ success: true, message: "Profile email sent" });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Failed to resend email:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
