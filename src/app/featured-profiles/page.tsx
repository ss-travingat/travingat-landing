import { Suspense } from "react";
import LandingHeader from "@/components/LandingHeader";
import { JoinSection } from "@/components/sections";
import { FeaturedProfiles } from "@/features/featured-profiles";

export default function FeaturedProfilesPage() {
  return (
    <main>
      <Suspense fallback={null}>
        <LandingHeader />
      </Suspense>
      <FeaturedProfiles />
      <JoinSection />
    </main>
  );
}