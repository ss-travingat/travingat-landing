import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  createAdminSessionToken,
  getAdminSessionCookieName,
  getAdminSessionMaxAgeSeconds,
  isAdminPasswordValid,
} from "@/lib/admin-session";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const password = String(body?.password || "");

    if (!isAdminPasswordValid(password)) {
      return NextResponse.json({ error: "invalid password" }, { status: 401 });
    }

    const token = createAdminSessionToken();
    const cookieStore = await cookies();
    cookieStore.set({
      name: getAdminSessionCookieName(),
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: getAdminSessionMaxAgeSeconds(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "internal server error" }, { status: 500 });
  }
}
