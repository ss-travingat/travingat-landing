'use server';

import { getDrizzle } from '@/lib/drizzle';
import { sendOtpEmail } from '@/lib/otp-email';
import { cookies, headers } from 'next/headers';
import { createUserSessionToken, getUserSessionCookieName, getUserSessionMaxAgeSeconds } from '@/lib/user-session';
import { users, otps, waitlist, explorerCards } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function requestOtpAction(email: string, _userAgentHint?: string) {
  try {
    const db = getDrizzle();

    // Read User-Agent directly from the incoming request headers (works in server actions via next/headers)
    const reqHeaders = await headers();
    const userAgent = reqHeaders.get('user-agent') ?? '';

    // Generate 4 digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP with user_agent for device tracking on verification
    await db.delete(otps).where(eq(otps.email, email));
    
    await db.insert(otps).values({
      email,
      otp,
      expiresAt: expiresAt.toISOString(),
      userAgent
    });

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
    const db = getDrizzle();
    const existingOtps = await db.select().from(otps).where(eq(otps.email, email)).limit(1);
    const otpRecord = existingOtps[0];

    if (!otpRecord) {
      return { error: 'No OTP requested for this email.' };
    }

    if (otpRecord.otp !== otp) {
      return { error: 'Invalid OTP.' };
    }

    const expiresAtStr = otpRecord.expiresAt.includes('Z') ? otpRecord.expiresAt : otpRecord.expiresAt.replace(' ', 'T') + 'Z';
    if (new Date() > new Date(expiresAtStr)) {
      return { error: 'OTP has expired. Please request a new one.' };
    }

    // Create user if they don't exist yet
    const existingUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);
    let user;
    if (existingUsers.length === 0) {
      const inserted = await db.insert(users).values({ email }).returning();
      user = inserted[0];
    } else {
      user = existingUsers[0];
    }
    
    // Extract device info from the stored user_agent in the OTP record
    const ua = otpRecord.userAgent ?? '';
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
    const existingWaitlist = await db.select({
      id: waitlist.id,
      device: waitlist.device,
      country: waitlist.country
    }).from(waitlist).where(eq(waitlist.email, email)).limit(1);

    const waitlistSource = source || 'Waitlist';
    if (existingWaitlist.length > 0) {
      if (!country || country === 'Unknown') {
        country = existingWaitlist[0].country || country;
      }
      await db.update(waitlist)
        .set({
          confirmed: true,
          confirmed_at: sql`COALESCE(${waitlist.confirmed_at}, NOW())`,
          source: sql`CASE WHEN ${waitlist.source} = 'Waitlist' THEN ${waitlistSource} ELSE ${waitlist.source} END`,
          browser: sql`CASE WHEN ${waitlist.browser} = 'Unknown' OR ${waitlist.browser} IS NULL THEN ${browser} ELSE ${waitlist.browser} END`,
          device: sql`CASE WHEN ${waitlist.device} = 'Unknown' OR ${waitlist.device} IS NULL THEN ${device} ELSE ${waitlist.device} END`,
          country: sql`CASE WHEN ${waitlist.country} = 'Unknown' OR ${waitlist.country} IS NULL THEN ${country || 'Unknown'} ELSE ${waitlist.country} END`,
          city: sql`CASE WHEN ${waitlist.city} = 'Unknown' OR ${waitlist.city} IS NULL THEN ${city || 'Unknown'} ELSE ${waitlist.city} END`,
          ip: sql`CASE WHEN ${waitlist.ip} = '0.0.0.0' OR ${waitlist.ip} IS NULL THEN ${ip} ELSE ${waitlist.ip} END`,
          explorer_card_status: sql`CASE 
                WHEN ${waitlist.explorer_card_status} = 'Created' THEN 'Created' 
                WHEN ${waitlistSource} = 'Explorer Card' THEN 'incomplete' 
                ELSE ${waitlist.explorer_card_status} 
            END`,
          get_featured_status: sql`CASE 
                WHEN ${waitlist.get_featured_status} = 'Created' THEN 'Created' 
                WHEN ${waitlistSource} = 'Get Featured' THEN 'incomplete' 
                ELSE ${waitlist.get_featured_status} 
            END`
        })
        .where(eq(waitlist.id, existingWaitlist[0].id));
    } else {
      const confirmationToken = crypto.randomUUID();
      await db.insert(waitlist).values({
        email,
        confirmed: true,
        confirmed_at: new Date().toISOString(),
        source: waitlistSource,
        browser,
        device,
        country: country || 'Unknown',
        city: city || 'Unknown',
        ip,
        confirmation_token: confirmationToken,
        explorer_card_status: waitlistSource === 'Explorer Card' ? 'incomplete' : 'Not created',
        get_featured_status: waitlistSource === 'Get Featured' ? 'incomplete' : 'Not created'
      });
    }
    
    await db.delete(otps).where(eq(otps.email, email));
    
    // Update users table with country if missing
    if (!user.country && country && country !== 'Unknown') {
      const updatedUserRes = await db.update(users).set({ country }).where(eq(users.id, user.id)).returning();
      if (updatedUserRes.length > 0) {
        user = updatedUserRes[0];
      }
    }

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
    
    const cards = await db.select().from(explorerCards).where(eq(explorerCards.userId, user.id)).limit(1);
    const explorerCard = cards.length > 0 ? cards[0] : null;
    
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
    const db = getDrizzle();
    
    // Check if user exists
    const existingUsers = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existingUsers.length === 0) {
      return { error: 'User not found. Please verify your email first.' };
    }

    await db.update(users)
      .set({
        first_name: data.firstName,
        last_name: data.lastName,
        country: data.country,
        visited_count: data.visitedCount,
        links: data.links
      })
      .where(eq(users.email, email));

    await db.update(waitlist)
      .set({
        get_featured_status: 'Created',
        countries_count: data.visitedCount
      })
      .where(eq(waitlist.email, email));
      
    return { success: true };
  } catch (error) {
    console.error('Error submitting application:', error);
    return { error: 'Failed to save application data.' };
  }
}
