import { NextRequest } from "next/server";
import {
  getAdminSessionCookieName,
  verifyAdminSessionToken,
} from "@/lib/admin-session";
import { getDrizzle } from "@/lib/drizzle";
import { waitlist } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PATCH,OPTIONS",
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

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get(getAdminSessionCookieName())?.value || "";
    if (!verifyAdminSessionToken(token)) {
      return jsonResponse({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, status } = await req.json();

    if (!email || !status) {
      return jsonResponse({ error: "Missing email or status" }, { status: 400 });
    }

    if (!['Created', 'Approved', 'Archived'].includes(status)) {
      return jsonResponse({ error: "Invalid status" }, { status: 400 });
    }

    const db = getDrizzle();
    
    await db
      .update(waitlist)
      .set({ get_featured_status: status })
      .where(eq(waitlist.email, email));

    return jsonResponse({ success: true });
  } catch (err) {
    console.error("Featured requests status update error:", err);
    return jsonResponse({ error: "Internal server error" }, { status: 500 });
  }
}
