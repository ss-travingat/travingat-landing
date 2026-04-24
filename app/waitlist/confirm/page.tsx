import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";

interface Props {
  searchParams: Promise<{ token?: string }>;
}

// Server component — processes the magic link token server-side and redirects
export default async function WaitlistConfirmPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token?.trim()) {
    redirect("/waitlist/confirmed?error=invalid");
  }

  let redirectUrl = "/waitlist/confirmed?error=server";

  try {
    const sql = getDb();

    const rows = await sql`
      SELECT id, confirmed, token_expires_at
      FROM waitlist
      WHERE confirmation_token = ${token.trim()}
      LIMIT 1
    `;

    if (rows.length === 0) {
      // Token not found — already confirmed (token cleared) or invalid
      redirectUrl = "/waitlist/confirmed?already=true";
    } else {
      const entry = rows[0];

      if (entry.confirmed) {
        redirectUrl = "/waitlist/confirmed?already=true";
      } else if (entry.token_expires_at && new Date(entry.token_expires_at) < new Date()) {
        // Token has expired
        redirectUrl = "/waitlist/confirmed?error=expired";
      } else {
        // Mark confirmed and clear token
        await sql`
          UPDATE waitlist
          SET confirmed = TRUE,
              confirmed_at = NOW(),
              confirmation_token = NULL
          WHERE id = ${entry.id}
        `;
        redirectUrl = "/waitlist/confirmed";
      }
    }
  } catch (err) {
    console.error("Confirmation error:", err);
    redirectUrl = "/waitlist/confirmed?error=server";
  }

  // Redirect must happen outside try/catch because Next.js redirect() throws an error internally
  redirect(redirectUrl);
}
