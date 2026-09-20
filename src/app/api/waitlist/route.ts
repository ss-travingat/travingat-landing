import { NextRequest } from "next/server";
import { getDrizzle } from "@/lib/drizzle";
import { waitlist, users } from "@/db/schema";
import { eq, isNull, desc, count, and } from "drizzle-orm";
import { sendConfirmationEmail } from "@/lib/waitlist-email";
import {
  getAdminSessionCookieName,
  verifyAdminSessionToken,
} from "@/lib/admin-session";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Origin, Accept, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400",
  "Cache-Control": "no-store, max-age=0",
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

function parseDevice(ua: string): string {
  if (/iPad|tablet/i.test(ua)) return "tablet";
  if (/Mobile|iPhone|Android.*Mobile/i.test(ua)) return "mobile";
  return "desktop";
}

function parseBrowser(ua: string): string {
  if (/Edg\//i.test(ua)) return "Edge";
  if (/OPR\//i.test(ua) || /Opera/i.test(ua)) return "Opera";
  if (/Chrome\//i.test(ua)) return "Chrome";
  if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) return "Safari";
  if (/Firefox\//i.test(ua)) return "Firefox";
  return "Other";
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const source = String(body?.source ?? "Waitlist").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ error: "Invalid email" }, { status: 400 });
    }

    const ua = req.headers.get("user-agent") ?? "";
    const browser = parseBrowser(ua);
    const device = parseDevice(ua);
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    let country = req.headers.get("x-vercel-ip-country") ?? "";
    let city = req.headers.get("x-vercel-ip-city") ?? "";

    if (city) {
      try {
        city = decodeURIComponent(city);
      } catch {
        // ignore decode failure
      }
    }

    if (country) {
      try {
        const displayName = new Intl.DisplayNames(["en"], { type: "region" }).of(country);
        country = displayName ?? country;
      } catch {
        // keep the ISO code if conversion fails
      }
    }

    if (!country) {
      try {
        const isLocal =
          !ip ||
          ip === "unknown" ||
          ip === "127.0.0.1" ||
          ip === "::1" ||
          ip.startsWith("192.168.") ||
          ip.startsWith("10.");
        const geoUrl = isLocal
          ? "http://ip-api.com/json/?fields=country,city"
          : `http://ip-api.com/json/${ip}?fields=country,city`;
        const geoRes = await fetch(geoUrl, { signal: AbortSignal.timeout(3000) });
        if (geoRes.ok) {
          const geo = await geoRes.json();
          country = geo.country ?? "";
          city = geo.city ?? "";
        }
      } catch {
        // geolocation is best effort only
      }
    }

    const db = getDrizzle();
    const existing = await db.select({ id: waitlist.id, confirmed: waitlist.confirmed })
      .from(waitlist)
      .where(eq(waitlist.email, email));
      
    const token = crypto.randomUUID();

    if (existing.length > 0) {
      const entry = existing[0];
      if (entry.confirmed) {
        return jsonResponse({ error: "Already on the waitlist" }, { status: 409 });
      }

      await db.update(waitlist).set({
        confirmation_token: token,
        token_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        browser,
        device,
        country: country || "Unknown",
        city: city || "Unknown",
        ip
      }).where(eq(waitlist.id, entry.id));
    } else {
      await db.insert(waitlist).values({
        email,
        browser,
        device,
        country: country || "Unknown",
        city: city || "Unknown",
        ip,
        confirmed: false,
        confirmation_token: token,
        token_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        source
      });
    }
    
    // Also create user account if it doesn't exist
    const existingUser = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length === 0) {
      await db.insert(users).values({ email });
    }

    try {
      await sendConfirmationEmail(email, token);
    } catch (err) {
      console.error("Failed to send confirmation email:", err);
    }

    return jsonResponse({ success: true });
  } catch (err) {
    console.error("Waitlist signup error:", err);
    return jsonResponse({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(getAdminSessionCookieName())?.value || "";
    if (!verifyAdminSessionToken(token)) {
      return jsonResponse({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDrizzle();
    const rows = await db.select({
        id: waitlist.id,
        email: waitlist.email,
        browser: waitlist.browser,
        device: waitlist.device,
        country: waitlist.country,
        city: waitlist.city,
        ip: waitlist.ip,
        confirmed: waitlist.confirmed,
        confirmed_at: waitlist.confirmed_at,
        created_at: waitlist.created_at,
        source: waitlist.source,
        explorer_card_status: waitlist.explorer_card_status,
        get_featured_status: waitlist.get_featured_status,
        countries_count: waitlist.countries_count,
        card_style: waitlist.card_style,
        user_uuid: users.id
      })
      .from(waitlist)
      .leftJoin(users, eq(waitlist.email, users.email))
      .where(isNull(waitlist.deleted_at))
      .orderBy(desc(waitlist.created_at));

    const countResult = await db.select({ total: count() }).from(waitlist).where(isNull(waitlist.deleted_at));
    const confirmedResult = await db.select({ confirmed: count() }).from(waitlist).where(and(eq(waitlist.confirmed, true), isNull(waitlist.deleted_at)));
    const explorerCardCreatedResult = await db.select({ count: count() }).from(waitlist).where(and(eq(waitlist.explorer_card_status, 'Created'), isNull(waitlist.deleted_at)));
    const getFeaturedCreatedResult = await db.select({ count: count() }).from(waitlist).where(and(eq(waitlist.get_featured_status, 'Created'), isNull(waitlist.deleted_at)));

    const total: number = countResult[0]?.total ?? 0;
    const confirmedCount: number = confirmedResult[0]?.confirmed ?? 0;
    const explorerCardCount: number = explorerCardCreatedResult[0]?.count ?? 0;
    const getFeaturedCount: number = getFeaturedCreatedResult[0]?.count ?? 0;

    return jsonResponse({
      entries: rows,
      total,
      confirmed: confirmedCount,
      unconfirmed: total - confirmedCount,
      explorerCardCount,
      getFeaturedCount
    });
  } catch (err) {
    console.error("Waitlist fetch error:", err);
    return jsonResponse({ error: "Internal server error" }, { status: 500 });
  }
}
