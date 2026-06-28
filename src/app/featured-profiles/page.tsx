import LandingHeader from "@/components/LandingHeader";
import { JoinSection } from "@/components/sections";
import { FeaturedProfiles } from "@/features/featured-profiles";

export default function FeaturedProfilesPage() {
  return (
    <main>
      <LandingHeader />
      <FeaturedProfiles />
      <JoinSection />
    </main>
  );
}