import ExplorerCardPage from "@/features/explorercard/expcard-page";
import { Metadata } from "next";
import { getSessionUser } from "@/lib/user-session";

export const metadata: Metadata = {
  title: "Travingat - Explorer Card",
  description: "Create and share your travel explorer card",
};

export default async function Page() {
  const sessionUser = await getSessionUser();
  return <ExplorerCardPage initialSessionUser={sessionUser} />;
}
