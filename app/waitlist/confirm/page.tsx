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
      SELECT id, confirmed
      FROM waitlist
      WHERE confirmation_token = ${token.trim()}
      LIMIT 1
    `;

    if (rows.length === 0) {
      // Token not found — already confirmed (token cleared) or invalid
      redirect("/waitlist/confirmed?already=true");
    }

    if (rows[0].confirmed) {
      redirect("/waitlist/confirmed?already=true");
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
