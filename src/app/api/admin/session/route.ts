import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getAdminSessionCookieName,
  verifyAdminSessionToken,
} from "@/lib/admin-session";

function clearSessionCookie() {
  const name = getAdminSessionCookieName();
  return {
    name,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAdminSessionCookieName())?.value || "";
  const authenticated = verifyAdminSessionToken(token);

  if (!authenticated && token) {
    cookieStore.set(clearSessionCookie());
  }

  return NextResponse.json({ authenticated });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set(clearSessionCookie());
  return NextResponse.json({ ok: true });
}
