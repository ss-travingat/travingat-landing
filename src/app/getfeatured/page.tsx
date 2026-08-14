import EmailVerificationForm from "@/components/getfeatured/EmailVerificationForm";
import { Metadata } from "next";
import { getSessionUser } from "@/lib/user-session";

export const metadata: Metadata = {
  title: "Get Featured - Travingat",
  description: "Apply to be a featured traveler on Travingat",
};

export default async function GetFeaturedPage() {
  const sessionUser = await getSessionUser();
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-black font-sans p-4 sm:p-8">
      <div className="w-full max-w-md">
        <EmailVerificationForm source="Get Featured" initialSessionUser={sessionUser} />
      </div>
    </div>
  );
}
