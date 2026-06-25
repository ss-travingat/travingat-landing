# WaitlistBar (Framer-ready React)

Desktop-only version that matches the Figma desktop pill, plus the backend API route it posts to.

```tsx
import * as React from "react";

function useWaitlistForm(apiUrl: string) {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState("idle"); // idle | loading | success | error | duplicate
  const [message, setMessage] = React.useState("");

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      if (res.status === 409) {
        setStatus("duplicate");
        setMessage("You're already on the waitlist!");
        return;
      }

      if (!res.ok) throw new Error("Signup failed");

      setStatus("success");
      setMessage("Check your email to confirm your spot.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return { email, setEmail, status, message, submit };
}

export function WaitlistBar({
  apiUrl = "https://www.travingat.com/api/waitlist",
  inputPlaceholder = "Enter your email",
  submitLabel = "Get early access",
  loadingLabel = "Joining...",
  showMessage = true,
  onSuccess,
}: {
  apiUrl?: string;
  inputPlaceholder?: string;
  submitLabel?: string;
  loadingLabel?: string;
  showMessage?: boolean;
  onSuccess?: () => void;
}) {
  const { email, setEmail, status, message, submit } = useWaitlistForm(apiUrl);
  const isLoading = status === "loading";

  React.useEffect(() => {
    if (status === "success") onSuccess?.();
  }, [onSuccess, status]);

  const formStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: 60,
    padding: "4px 4px 4px 24px",
    borderRadius: 9999,
    border: "1px solid #3d3d3d",
    background: "#000000",
  };

  const inputStyle: React.CSSProperties = {
    flex: "1 1 auto",
    minWidth: 0,
    background: "transparent",
    border: "none",
    outline: "none",
    appearance: "none",
    fontSize: 20,
    fontWeight: 500,
    lineHeight: "28px",
    letterSpacing: "-0.5px",
    color: "#ffffff",
    fontFamily: '"Inter", sans-serif',
  };

  const buttonStyle: React.CSSProperties = {
    height: 52,
    padding: "0 32px",
    borderRadius: 9999,
    border: "none",
    background: "#ffffff",
    color: "#000000",
    fontSize: 20,
    fontWeight: 500,
    lineHeight: "28px",
    letterSpacing: "-0.5px",
    cursor: isLoading ? "default" : "pointer",
    opacity: isLoading ? 0.6 : 1,
    fontFamily: '"Inter", sans-serif',
    whiteSpace: "nowrap",
  };

  const messageStyle: React.CSSProperties = {
    marginTop: 12,
    fontSize: 14,
    color: status === "success" || status === "duplicate" ? "#4ade80" : "#f87171",
    fontFamily: '"Inter", sans-serif',
  };

  return (
    <div style={{ width: "100%", fontFamily: '"Inter", sans-serif' }}>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
        .waitlistbar-input::placeholder { color: #464646; }
      `}</style>

      <form onSubmit={submit} style={formStyle}>
        <input
          type="email"
          placeholder={inputPlaceholder}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          style={inputStyle}
          className="waitlistbar-input"
        />
        <button type="submit" disabled={isLoading} style={buttonStyle}>
          {isLoading ? loadingLabel : submitLabel}
        </button>
      </form>

      {showMessage && message ? <p style={messageStyle}>{message}</p> : null}
    </div>
  );
}
```

## Backend API

Use this Next.js route on your site. The Framer component above already posts to it.

```ts
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sendConfirmationEmail } from "@/lib/waitlist-email";
import {
  getAdminSessionCookieName,
  verifyAdminSessionToken,
} from "@/lib/admin-session";

const BASE_CORS_HEADERS = {
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function parseAllowedOrigins(): string[] {
  return (process.env.WAITLIST_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function isOriginAllowed(origin: string | null, allowed: string[]): boolean {
  if (!origin) return true;
  if (allowed.length === 0) return true;
  return allowed.includes(origin);
}

function getCorsHeaders(origin: string | null, allowed: string[]) {
  if (origin && allowed.length > 0 && allowed.includes(origin)) {
    return { ...BASE_CORS_HEADERS, "Access-Control-Allow-Origin": origin, Vary: "Origin" };
  }

  if (allowed.length === 0) {
    return { ...BASE_CORS_HEADERS, "Access-Control-Allow-Origin": "*" };
  }

  return { ...BASE_CORS_HEADERS };
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  const allowed = parseAllowedOrigins();
  if (!isOriginAllowed(origin, allowed)) {
    return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
  }

  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin, allowed),
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

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const allowed = parseAllowedOrigins();
  const corsHeaders = getCorsHeaders(origin, allowed);
  if (!isOriginAllowed(origin, allowed)) {
    return NextResponse.json({ error: "Origin not allowed" }, { status: 403, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const email = (body.email ?? "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400, headers: corsHeaders });
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

    if (city) try { city = decodeURIComponent(city); } catch {}

    if (country) {
      try {
        const displayName = new Intl.DisplayNames(["en"], { type: "region" }).of(country);
        country = displayName ?? country;
      } catch {
      }
    }

    if (!country) {
      try {
        const isLocal = !ip || ip === "unknown" || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.");
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
      }
    }

    country = country || "Unknown";
    city = city || "Unknown";

    const sql = getDb();
    const existing = await sql`SELECT id, confirmed FROM waitlist WHERE email = ${email}`;
    const token = crypto.randomUUID();

    if (existing.length > 0) {
      const entry = existing[0];
      if (entry.confirmed) {
        return NextResponse.json({ error: "Already on the waitlist" }, { status: 409, headers: corsHeaders });
      }

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
      await sql`
        INSERT INTO waitlist (email, browser, device, country, city, ip, confirmed, confirmation_token, token_expires_at)
        VALUES (${email}, ${browser}, ${device}, ${country}, ${city}, ${ip}, FALSE, ${token}, NOW() + INTERVAL '24 hours')
      `;
    }

    try {
      await sendConfirmationEmail(email, token);
    } catch (err) {
      console.error("Failed to send confirmation email:", err);
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (err) {
    console.error("Waitlist signup error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders });
  }
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin");
  const allowed = parseAllowedOrigins();
  const corsHeaders = getCorsHeaders(origin, allowed);
  if (!isOriginAllowed(origin, allowed)) {
    return NextResponse.json({ error: "Origin not allowed" }, { status: 403, headers: corsHeaders });
  }

  try {
    const token = req.cookies.get(getAdminSessionCookieName())?.value || "";
    if (!verifyAdminSessionToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
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

    return NextResponse.json(
      {
        entries: rows,
        total,
        confirmed: confirmedCount,
        unconfirmed: total - confirmedCount,
      },
      { headers: corsHeaders },
    );
  } catch (err) {
    console.error("Waitlist fetch error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders });
  }
}
```

### Framer setup

Set `apiUrl` to `https://travingat.com/api/waitlist` when you add the component in Framer.
