import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
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
    const sql = getDb();
    
    if (type === "waitlist") {
      await sql`UPDATE waitlist SET deleted_at = NULL WHERE id = ${id}`;
    } else if (type === "users") {
      await sql`UPDATE users SET deleted_at = NULL WHERE id = ${id}`;
    } else if (type === "profiles") {
      await sql`UPDATE featured_profiles SET deleted_at = NULL WHERE id = ${id}`;
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
    const sql = getDb();
    
    if (type === "waitlist") {
      await sql`DELETE FROM waitlist WHERE id = ${id}`;
    } else if (type === "users") {
      await sql`DELETE FROM users WHERE id = ${id}`;
    } else if (type === "profiles") {
      await sql`DELETE FROM featured_profiles WHERE id = ${id}`;
    } else {
      return NextResponse.json({ error: "invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to permanently delete item:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
