import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
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

    const sql = getDb();
    const existing = await sql`SELECT id, confirmed FROM waitlist WHERE email = ${email}`;
    const token = crypto.randomUUID();

    if (existing.length > 0) {
      const entry = existing[0];
      if (entry.confirmed) {
        return jsonResponse({ error: "Already on the waitlist" }, { status: 409 });
      }

      await sql`
        UPDATE waitlist
        SET confirmation_token = ${token},
            token_expires_at = NOW() + INTERVAL '24 hours',
            browser = ${browser},
            device = ${device},
            country = ${country || "Unknown"},
            city = ${city || "Unknown"},
            ip = ${ip}
        WHERE id = ${entry.id}
      `;
    } else {
      await sql`
        INSERT INTO waitlist (email, browser, device, country, city, ip, confirmed, confirmation_token, token_expires_at)
        VALUES (${email}, ${browser}, ${device}, ${country || "Unknown"}, ${city || "Unknown"}, ${ip}, FALSE, ${token}, NOW() + INTERVAL '24 hours')
      `;
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

    const sql = getDb();
    const rows = await sql`
      SELECT id, email, browser, device, country, city, ip, confirmed, confirmed_at, created_at
      FROM waitlist
      ORDER BY created_at DESC
    `;

    const countResult = await sql`SELECT COUNT(*)::int as total FROM waitlist`;
    const confirmedResult = await sql`SELECT COUNT(*)::int as confirmed FROM waitlist WHERE confirmed = TRUE`;

    const total: number = countResult[0]?.total ?? 0;
    const confirmedCount: number = confirmedResult[0]?.confirmed ?? 0;

    return jsonResponse({
      entries: rows,
      total,
      confirmed: confirmedCount,
      unconfirmed: total - confirmedCount,
    });
  } catch (err) {
    console.error("Waitlist fetch error:", err);
    return jsonResponse({ error: "Internal server error" }, { status: 500 });
  }
}
