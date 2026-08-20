import { NextRequest } from "next/server";
import {
  getAdminSessionCookieName,
  verifyAdminSessionToken,
} from "@/lib/admin-session";
import { getDrizzle } from "@/lib/drizzle";
import { users, waitlist } from "@/db/schema";
import { eq, inArray, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Origin, Accept, Authorization, X-Requested-With",
};

function corsHeaders() {
  return new Headers(CORS_HEADERS);
}

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  const headers = corsHeaders();
  headers.set("Content-Type", "application/json; charset=utf-8");

  if (init.headers) {
    const extra = new Headers(init.headers);
    extra.forEach((value, key) => headers.set(key, value));
  }

  return new Response(JSON.stringify(body), {
    ...init,
    headers,
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(getAdminSessionCookieName())?.value || "";
    if (!verifyAdminSessionToken(token)) {
      return jsonResponse({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDrizzle();
    
    // We want all users who have get_featured_status is not null in waitlist.
    const rows = await db
      .select({
        id: users.id,
        email: users.email,
        first_name: users.first_name,
        last_name: users.last_name,
        country: users.country,
        visited_count: users.visited_count,
        links: users.links,
        created_at: waitlist.created_at,
        status: waitlist.get_featured_status,
      })
      .from(waitlist)
      .innerJoin(users, eq(waitlist.email, users.email))
      .where(inArray(waitlist.get_featured_status, ['Created', 'Approved', 'Archived']))
      .orderBy(desc(waitlist.created_at));

    return jsonResponse({
      requests: rows,
      total: rows.length,
    });
  } catch (err) {
    console.error("Featured requests fetch error:", err);
    return jsonResponse({ error: "Internal server error" }, { status: 500 });
  }
}
