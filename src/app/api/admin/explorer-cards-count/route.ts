import { NextRequest } from "next/server";
import { getAdminSessionCookieName, verifyAdminSessionToken } from "@/lib/admin-session";
import { getDrizzle } from "@/lib/drizzle";
import { explorerCards } from "@/db/schema";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(getAdminSessionCookieName())?.value || "";
    if (!verifyAdminSessionToken(token)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    const db = getDrizzle();
    const result = await db.select({ count: sql<number>`count(*)` }).from(explorerCards);
    return new Response(JSON.stringify({ count: Number(result[0].count) }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
