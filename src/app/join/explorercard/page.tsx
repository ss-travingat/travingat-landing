import ExplorerCardPage from "@/features/explorercard/expcard-page";
import { Metadata } from "next";
import { getSessionUser } from "@/lib/user-session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Travingat - Join Explorer Card",
  description: "Join and create your travel explorer card",
};

export default async function Page() {
  const sessionUser = await getSessionUser();
  if (sessionUser) {
    redirect("/edit/explorercard");
  }

  return <ExplorerCardPage />;
}
