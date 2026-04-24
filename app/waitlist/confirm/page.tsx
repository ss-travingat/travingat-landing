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
      redirect("/waitlist/confirmed?already=true");
    }

    const entry = rows[0];

    if (entry.confirmed) {
      redirect("/waitlist/confirmed?already=true");
    }

    if (entry.token_expires_at && new Date(entry.token_expires_at) < new Date()) {
      // Token has expired
      redirect("/waitlist/confirmed?error=expired");
    }

    // Mark confirmed and clear token
    await sql`
      UPDATE waitlist
      SET confirmed = TRUE,
          confirmed_at = NOW(),
          confirmation_token = NULL
      WHERE id = ${rows[0].id}
    `;

    redirect("/waitlist/confirmed");
  } catch {
    redirect("/waitlist/confirmed?error=server");
  }
}
