import ExplorerCardPage from "@/features/explorercard/expcard-page";
import { Metadata } from "next";
import { getSessionUser } from "@/lib/user-session";
import { redirect } from "next/navigation";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

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
  if (sessionUser.explorerCardId) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/explorercard/${sessionUser.explorerCardId}`, { next: { revalidate: 0 } });
      if (res.ok) {
        const data = await res.json();
        explorerCard = {
          ...data,
          profileImageUrl: data.profile_image_url,
          coverImageUrl: data.cover_image_url,
          visitedCountries: data.visited_countries
        };
      }
    } catch (err) {
      console.error("Failed to fetch explorer card", err);
    }
  }

  if (!explorerCard) {
    redirect("/edit/explorercard");
  }

  return <ExplorerCardPage initialSessionUser={sessionUser} initialExplorerCard={explorerCard} />;
}
