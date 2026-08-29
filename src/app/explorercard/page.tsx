import ExplorerCardPage from "@/features/explorercard/expcard-page";
import { Metadata } from "next";
import { getSessionUser } from "@/lib/user-session";
import { getDb } from "@/lib/db";
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
    const sql = getDb();
    const cards = await sql`SELECT * FROM explorer_cards WHERE user_id = ${sessionUser.id}`;
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
