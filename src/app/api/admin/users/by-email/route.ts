import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminSessionCookieName, verifyAdminSessionToken } from "@/lib/admin-session";
import { getDrizzle } from "@/lib/drizzle";
import { users, explorerCards } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAdminSessionCookieName())?.value || "";
  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const email = url.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "missing email" }, { status: 400 });
  }

  try {
    const db = getDrizzle();
    const userList = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (userList.length === 0) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }
    
    const ecResult = await db.select().from(explorerCards).where(eq(explorerCards.userId, userList[0].id)).limit(1);
    const explorerCard = ecResult.length > 0 ? ecResult[0] : null;

    return NextResponse.json({ ...userList[0], explorerCard });
  } catch (error: any) {
    console.error("Failed to fetch user by email:", error);
    return NextResponse.json({ error: "internal server error" }, { status: 500 });
  }
}

