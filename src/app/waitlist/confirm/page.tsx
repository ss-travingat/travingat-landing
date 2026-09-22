import { redirect } from "next/navigation";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

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
    const res = await fetch(`${BACKEND_URL}/api/waitlist/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token: token.trim() })
    });

    const data = await res.json();
    
    if (res.ok) {
      if (data.message === 'Already confirmed') {
        redirectUrl = "/waitlist/confirmed?already=true";
      } else {
        redirectUrl = "/waitlist/confirmed";
      }
    } else {
      if (data.error === 'Token expired') {
        redirectUrl = "/waitlist/confirmed?error=expired";
      } else if (data.error === 'Invalid token') {
        redirectUrl = "/waitlist/confirmed?already=true"; // or error=invalid
      }
    }
  } catch (err) {
    console.error("Confirmation error:", err);
    redirectUrl = "/waitlist/confirmed?error=server";
  }

  // Redirect must happen outside try/catch because Next.js redirect() throws an error internally
  redirect(redirectUrl);
}
