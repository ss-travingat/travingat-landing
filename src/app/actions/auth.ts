'use server';

import { getDb } from '@/lib/db';
import { sendOtpEmail } from '@/lib/otp-email';
import { cookies, headers } from 'next/headers';
import { createUserSessionToken, getUserSessionCookieName, getUserSessionMaxAgeSeconds } from '@/lib/user-session';

export async function requestOtpAction(email: string, _userAgentHint?: string) {
  try {
    const sql = getDb();


    // Read User-Agent directly from the incoming request headers (works in server actions via next/headers)
    const reqHeaders = await headers();
    const userAgent = reqHeaders.get('user-agent') ?? '';

    // Generate 4 digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP with user_agent for device tracking on verification
    await sql`DELETE FROM otps WHERE email = ${email}`;
    try {
      await sql`
        INSERT INTO otps (email, otp, expires_at, user_agent)
        VALUES (${email}, ${otp}, ${expiresAt}, ${userAgent})
      `;
    } catch {
      // Fallback if user_agent column doesn't exist yet
      await sql`
        INSERT INTO otps (email, otp, expires_at)
        VALUES (${email}, ${otp}, ${expiresAt})
      `;
    }

    // Send OTP
    await sendOtpEmail(email, otp);

    return { success: true };
  } catch (error) {
    console.error('Error requesting OTP:', error);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
}

function parseDevice(ua: string): string {
  if (!ua) return 'Unknown';
  if (/iPad|tablet/i.test(ua)) return 'tablet';
  if (/Mobile|iPhone|Android.*Mobile/i.test(ua)) return 'mobile';
  return 'desktop';
}

function parseBrowser(ua: string): string {
  if (!ua) return 'Unknown';
  if (/Edg\//i.test(ua)) return 'Edge';
  if (/OPR\//i.test(ua) || /Opera/i.test(ua)) return 'Opera';
  if (/Chrome\//i.test(ua)) return 'Chrome';
  if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) return 'Safari';
  if (/Firefox\//i.test(ua)) return 'Firefox';
  return 'Other';
}

export async function verifyOtpAction(email: string, otp: string, source?: string) {
  try {
    const sql = getDb();
    const existingOtps = await sql`
      SELECT * FROM otps WHERE email = ${email} LIMIT 1
    `;
    const otpRecord = existingOtps[0];

    if (!otpRecord) {
      return { error: 'No OTP requested for this email.' };
    }

    if (otpRecord.otp !== otp) {
      return { error: 'Invalid OTP.' };
    }

    if (new Date() > new Date(otpRecord.expires_at)) {
      return { error: 'OTP has expired. Please request a new one.' };
    }

    // Create user if they don't exist yet
    const existingUsers = await sql`
      SELECT * FROM users WHERE email = ${email} LIMIT 1
    `;
    let user;
    if (existingUsers.length === 0) {
      const inserted = await sql`
        INSERT INTO users (email) VALUES (${email}) RETURNING *
      `;
      user = inserted[0];
    } else {
      user = existingUsers[0];
    }
    
    // Extract device info from the stored user_agent in the OTP record
    const ua = otpRecord.user_agent ?? '';
    const browser = parseBrowser(ua);
    const device = parseDevice(ua);

    // Get IP and geolocation from request headers (available in server actions via next/headers)
    const reqHeaders = await headers();
    const ip =
      reqHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      reqHeaders.get('x-real-ip') ??
      '0.0.0.0';

    let country = reqHeaders.get('x-vercel-ip-country') ?? '';
    let city = reqHeaders.get('x-vercel-ip-city') ?? '';

    if (city) {
      try { city = decodeURIComponent(city); } catch { /* ignore */ }
    }
    if (country) {
      try {
        const displayName = new Intl.DisplayNames(['en'], { type: 'region' }).of(country);
        country = displayName ?? country;
      } catch { /* keep iso code */ }
    }

    if (!country) {
      try {
        const isLocal = !ip || ip === '0.0.0.0' || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.');
        const geoUrl = isLocal
          ? 'http://ip-api.com/json/?fields=country,city'
          : `http://ip-api.com/json/${ip}?fields=country,city`;
        const geoRes = await fetch(geoUrl, { signal: AbortSignal.timeout(3000) });
        if (geoRes.ok) {
          const geo = await geoRes.json();
          country = geo.country ?? '';
          city = geo.city ?? '';
        }
      } catch { /* geolocation is best-effort */ }
    }

    // Set user session cookie
    const existingWaitlist = await sql`SELECT id, device FROM waitlist WHERE email = ${email} LIMIT 1`;
    const waitlistSource = source || 'Waitlist';
    if (existingWaitlist.length > 0) {
      await sql`
        UPDATE waitlist 
        SET confirmed = TRUE, 
            confirmed_at = COALESCE(confirmed_at, NOW()),
            source = CASE WHEN source = 'Waitlist' THEN ${waitlistSource} ELSE source END,
            browser = CASE WHEN browser = 'Unknown' OR browser IS NULL THEN ${browser} ELSE browser END,
            device = CASE WHEN device = 'Unknown' OR device IS NULL THEN ${device} ELSE device END,
            country = CASE WHEN country = 'Unknown' OR country IS NULL THEN ${country || 'Unknown'} ELSE country END,
            city = CASE WHEN city = 'Unknown' OR city IS NULL THEN ${city || 'Unknown'} ELSE city END,
            ip = CASE WHEN ip = '0.0.0.0' OR ip IS NULL THEN ${ip} ELSE ip END,
            explorer_card_status = CASE 
                WHEN explorer_card_status = 'Created' THEN 'Created' 
                WHEN ${waitlistSource}::text = 'Explorer Card' THEN 'incomplete' 
                ELSE explorer_card_status 
            END,
            get_featured_status = CASE 
                WHEN get_featured_status = 'Created' THEN 'Created' 
                WHEN ${waitlistSource}::text = 'Get Featured' THEN 'incomplete' 
                ELSE get_featured_status 
            END
        WHERE id = ${existingWaitlist[0].id}
      `;
    } else {
      const confirmationToken = crypto.randomUUID();
      await sql`
        INSERT INTO waitlist (email, confirmed, confirmed_at, source, created_at, browser, device, country, city, ip, confirmation_token, explorer_card_status, get_featured_status)
        VALUES (${email}, TRUE, NOW(), ${waitlistSource}, NOW(), ${browser}, ${device}, ${country || 'Unknown'}, ${city || 'Unknown'}, ${ip}, ${confirmationToken}, 
                CASE WHEN ${waitlistSource}::text = 'Explorer Card' THEN 'incomplete' ELSE 'Not created' END,
                CASE WHEN ${waitlistSource}::text = 'Get Featured' THEN 'incomplete' ELSE 'Not created' END)
      `;
    }
    
    await sql`DELETE FROM otps WHERE email = ${email}`;
    
    // Set user session cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: getUserSessionCookieName(),
      value: createUserSessionToken(user.id),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: getUserSessionMaxAgeSeconds(),
    });
    
    const explorerCards = await sql`SELECT * FROM explorer_cards WHERE user_id = ${user.id} LIMIT 1`;
    const explorerCard = explorerCards.length > 0 ? explorerCards[0] : null;
    
    return { success: true, user, explorerCard };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { error: 'Failed: ' + (error instanceof Error ? error.message : String(error)) };
  }
}

export async function submitApplicationAction(email: string, data: {
  firstName: string;
  lastName: string;
  country: string;
  visitedCount: number;
  links: string[];
}) {
  try {
    const sql = getDb();
    
    // Check if user exists
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email} LIMIT 1
    `;
    if (existingUsers.length === 0) {
      return { error: 'User not found. Please verify your email first.' };
    }

    // We can map visitedCount to a dummy string array since the main DB uses visited_countries array
    // E.g., just store array of numbers or leave it as we are just tracking the count. 
    // The user proposal was: we infer visitedCount from the length of visited_countries array.
    // Let's create an array of that size with generic country strings or empty. 
    // Actually, maybe it's better to add a visited_count column to users if we only know the number.
    // I will add visited_count to users table right now to be safe.
    
    await sql`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS visited_count INTEGER;
    `;

    await sql`
      UPDATE users
      SET
        first_name = ${data.firstName},
        last_name = ${data.lastName},
        country = ${data.country},
        visited_count = ${data.visitedCount},
        links = ${data.links}
      WHERE email = ${email}
    `;

    await sql`
      UPDATE waitlist
      SET get_featured_status = 'Created',
          countries_count = ${data.visitedCount}
      WHERE email = ${email}
    `;
      
    return { success: true };
  } catch (error) {
    console.error('Error submitting application:', error);
    return { error: 'Failed to save application data.' };
  }
}
