import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sendConfirmationEmail } from "@/lib/waitlist-email";
import {
  getAdminSessionCookieName,
  verifyAdminSessionToken,
} from "@/lib/admin-session";

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

// POST — join waitlist (unconfirmed; sends confirmation email)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email ?? "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const ua = req.headers.get("user-agent") ?? "";
    const browser = parseBrowser(ua);
    const device = parseDevice(ua);

    // Get IP from headers (works behind Vercel/CF proxies)
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    // Geo: prefer Vercel's geo headers (free, zero-latency), fall back to ip-api.com for local dev
    let country = req.headers.get("x-vercel-ip-country") ?? "";
    let city = req.headers.get("x-vercel-ip-city") ?? "";

    // Decode percent-encoded Vercel header values (e.g. "S%C3%A3o%20Paulo" → "São Paulo")
    if (city) try { city = decodeURIComponent(city); } catch {}

    // Vercel returns ISO 2-letter country codes — convert to full name
    if (country) {
      try {
        const displayName = new Intl.DisplayNames(["en"], { type: "region" }).of(country);
        country = displayName ?? country;
      } catch {
        // keep the ISO code if conversion fails
      }
    }

    if (!country) {
      // Fallback for local dev / non-Vercel hosts
      try {
        const isLocal = !ip || ip === "unknown" || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.");
        const geoUrl = isLocal
          ? "http://ip-api.com/json/?fields=country,city"
          : `http://ip-api.com/json/${ip}?fields=country,city`;
        const geoRes = await fetch(geoUrl, {
          signal: AbortSignal.timeout(3000),
        });
        if (geoRes.ok) {
          const geo = await geoRes.json();
          country = geo.country ?? "";
          city = geo.city ?? "";
        }
      } catch {
        // Geo lookup failed — not critical
      }
    }

    country = country || "Unknown";
    city = city || "Unknown";

    const sql = getDb();

    // Check for existing email
    const existing = await sql`SELECT id, confirmed FROM waitlist WHERE email = ${email}`;
    
    // Generate a unique confirmation token
    const token = crypto.randomUUID();

    if (existing.length > 0) {
      const entry = existing[0];
      if (entry.confirmed) {
        return NextResponse.json({ error: "Already on the waitlist" }, { status: 409 });
      }

      // If unconfirmed, generate a new token and extend expiry by 24 hours, then resend email
      await sql`
        UPDATE waitlist
        SET confirmation_token = ${token},
            token_expires_at = NOW() + INTERVAL '24 hours',
            browser = ${browser},
            device = ${device},
            country = ${country},
            city = ${city},
            ip = ${ip}
        WHERE id = ${entry.id}
      `;
    } else {
      // New user
      await sql`
        INSERT INTO waitlist (email, browser, device, country, city, ip, confirmed, confirmation_token, token_expires_at)
        VALUES (${email}, ${browser}, ${device}, ${country}, ${city}, ${ip}, FALSE, ${token}, NOW() + INTERVAL '24 hours')
      `;
    }

    // Send confirmation email — must await on serverless (function terminates after response)
    try {
      await sendConfirmationEmail(email, token);
    } catch (err) {
      console.error("Failed to send confirmation email:", err);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Waitlist signup error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET — list waitlist entries (admin use)
export async function GET(req: NextRequest) {
  try {
    // Verify admin session
    const token = req.cookies.get(getAdminSessionCookieName())?.value || "";
    if (!verifyAdminSessionToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    return NextResponse.json({
      entries: rows,
      total,
      confirmed: confirmedCount,
      unconfirmed: total - confirmedCount,
    });
  } catch (err) {
    console.error("Waitlist fetch error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

