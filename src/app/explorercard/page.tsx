import ExplorerCardPage from "@/features/explorercard/expcard-page";
import { Metadata } from "next";
import { getSessionUser } from "@/lib/user-session";
import { getDrizzle } from "@/lib/drizzle";
import { explorerCards } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Travingat - Explorer Card",
  description: "Your travel explorer card",
};


export default async function Page() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    redirect("/join/explorercard");
  }

  let explorerCard = null;
  try {
    const db = getDrizzle();
    const cards = await db.select().from(explorerCards).where(eq(explorerCards.userId, sessionUser.id)).limit(1);
    if (cards && cards.length > 0) {
      explorerCard = cards[0];
    }
  } catch (err) {
    console.error("Failed to fetch explorer card", err);
  }

  if (!explorerCard) {
    redirect("/edit/explorercard");
  }

  return <ExplorerCardPage initialSessionUser={sessionUser} initialExplorerCard={explorerCard} />;
}
