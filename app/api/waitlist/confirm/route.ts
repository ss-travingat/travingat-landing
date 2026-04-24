import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ?? "https://travingat.com";

// GET /api/waitlist/confirm?token=<TOKEN>
// Called when a user clicks the magic link in their confirmation email.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")?.trim();

  if (!token) {
    return NextResponse.redirect(`${BASE_URL}/waitlist/confirmed?error=invalid`);
  }

  try {
    const sql = getDb();

    // Look up the token
    const rows = await sql`
      SELECT id, confirmed
      FROM waitlist
      WHERE confirmation_token = ${token}
      LIMIT 1
    `;

    if (rows.length === 0) {
      // Token not found — could be invalid or already consumed
      return NextResponse.redirect(`${BASE_URL}/waitlist/confirmed?already=true`);
    }

    const entry = rows[0];

    if (entry.confirmed) {
      // Already confirmed — just redirect to success
      return NextResponse.redirect(`${BASE_URL}/waitlist/confirmed?already=true`);
    }

    // Mark as confirmed and clear the token
    await sql`
      UPDATE waitlist
      SET confirmed = TRUE,
          confirmed_at = NOW(),
          confirmation_token = NULL
      WHERE id = ${entry.id}
    `;

    return NextResponse.redirect(`${BASE_URL}/waitlist/confirmed`);
  } catch (err) {
    console.error("Waitlist confirm error:", err);
    return NextResponse.redirect(`${BASE_URL}/waitlist/confirmed?error=server`);
  }
}
