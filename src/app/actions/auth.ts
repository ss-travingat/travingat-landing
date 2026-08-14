'use server';

import { getDb } from '@/lib/db';
import { sendOtpEmail } from '@/lib/otp-email';
import { cookies } from 'next/headers';
import { createUserSessionToken, getUserSessionCookieName, getUserSessionMaxAgeSeconds } from '@/lib/user-session';

export async function requestOtpAction(email: string) {
  try {
    const sql = getDb();
    // Check if user exists and is completed
    const existingUsers = await sql`
      SELECT * FROM users WHERE email = ${email} LIMIT 1
    `;
    
    if (existingUsers.length > 0) {
      const user = existingUsers[0];
      // A user is 'completed' if they have name, country, and links populated.
      // We check visited_countries length to act as visitedCount
      const isCompleted = user.first_name && user.last_name && user.country && user.links && user.links.length > 0;
      if (isCompleted) {
        return { error: 'An account with this email already exists. Please log in.' };
      }
    }

    // Generate 4 digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP
    // Delete existing OTPs for this email first to prevent clutter
    await sql`DELETE FROM otps WHERE email = ${email}`;
    await sql`
      INSERT INTO otps (email, otp, expires_at)
      VALUES (${email}, ${otp}, ${expiresAt})
    `;

    // Send OTP
    await sendOtpEmail(email, otp);

    return { success: true };
  } catch (error) {
    console.error('Error requesting OTP:', error);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
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
    
    // Set user session cookie
    const existingWaitlist = await sql`SELECT id FROM waitlist WHERE email = ${email} LIMIT 1`;
    const waitlistSource = source || 'Waitlist';
    if (existingWaitlist.length > 0) {
      await sql`
        UPDATE waitlist 
        SET confirmed = TRUE, 
            confirmed_at = COALESCE(confirmed_at, NOW()),
            source = ${waitlistSource},
            explorer_card_status = CASE 
                WHEN explorer_card_status = 'Created' THEN 'Created' 
                WHEN ${waitlistSource}::text = 'Explorer Card' THEN 'incomplete' 
                ELSE explorer_card_status 
            END
        WHERE id = ${existingWaitlist[0].id}
      `;
    } else {
      await sql`
        INSERT INTO waitlist (email, confirmed, confirmed_at, source, created_at, browser, device, country, city, ip, confirmation_token, explorer_card_status)
        VALUES (${email}, TRUE, NOW(), ${waitlistSource}, NOW(), 'Unknown', 'Unknown', 'Unknown', 'Unknown', '0.0.0.0', 'otp-verified', CASE WHEN ${waitlistSource}::text = 'Explorer Card' THEN 'incomplete' ELSE 'Not created' END)
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
    
    return { success: true, user };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { error: 'Failed to create user account. Please try again.' };
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
      
    return { success: true };
  } catch (error) {
    console.error('Error submitting application:', error);
    return { error: 'Failed to save application data.' };
  }
}
