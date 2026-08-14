import crypto from "crypto";

const SESSION_COOKIE_NAME = "travingat_user_session";
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

function getSessionSecret() {
  return process.env.USER_SESSION_SECRET || "change-this-user-session-secret";
}

function signPayload(payload: string) {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("hex");
}

export function getUserSessionCookieName() {
  return SESSION_COOKIE_NAME;
}

export function getUserSessionMaxAgeSeconds() {
  return SESSION_TTL_SECONDS;
}

export function createUserSessionToken(userId: string) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  // payload format: exp.userId
  const payload = `${exp}.${userId}`;
  const sig = signPayload(payload);
  return `${payload}.${sig}`;
}

export function verifyUserSessionToken(token: string): string | null {
  if (!token) return null;
  
  // parts: exp.userId.sig
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const expRaw = parts[0];
  const userId = parts[1];
  const providedSig = parts[2];

  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp <= Math.floor(Date.now() / 1000)) {
    return null; // Expired
  }

  const payload = `${expRaw}.${userId}`;
  const expectedSig = signPayload(payload);

  const providedBuf = Buffer.from(providedSig, "hex");
  const expectedBuf = Buffer.from(expectedSig, "hex");
  
  if (providedBuf.length !== expectedBuf.length) return null;

  if (crypto.timingSafeEqual(providedBuf, expectedBuf)) {
    return userId;
  }
  return null;
}

import { cookies } from "next/headers";
import { getDb } from "./db";

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const userId = verifyUserSessionToken(token);
  if (!userId) return null;

  try {
    const sql = getDb();
    const rows = await sql`SELECT * FROM users WHERE id = ${userId} LIMIT 1`;
    return rows[0] || null;
  } catch (error) {
    console.error("Error fetching session user:", error);
    return null;
  }
}
