import { redirect } from "next/navigation";
import { getDrizzle } from "@/lib/drizzle";
import { waitlist } from "@/db/schema";
import { eq } from "drizzle-orm";

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
    const db = getDrizzle();

    const rows = await db.select({ 
      id: waitlist.id, 
      email: waitlist.email, 
      confirmed: waitlist.confirmed, 
      token_expires_at: waitlist.token_expires_at 
    }).from(waitlist).where(eq(waitlist.confirmation_token, token.trim())).limit(1);

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
        await db.update(waitlist)
          .set({
            confirmed: true,
            confirmed_at: new Date().toISOString(),
            confirmation_token: null
          })
          .where(eq(waitlist.id, entry.id));
        
        try {
          const { sendWelcomeWaitlistEmail } = await import("@/lib/waitlist-email");
          await sendWelcomeWaitlistEmail(entry.email);
        } catch (emailErr) {
          console.error("Failed to send welcome waitlist email:", emailErr);
        }
        
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
