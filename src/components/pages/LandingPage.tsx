import {
  HeroSection,
  DesignSystemPreviewSection,
  OrganizeSection,
  CollectionsSection,
  WorldMapSection,
  TestimonialSection,

  TemplatesSection,
  PricingSection,
  JoinSection,
} from "@/components/sections";
import { FeaturedProfiles } from "@/features/featured-profiles";
import LandingParallax from "@/components/LandingParallax";

export default function LandingPage() {
  return (
    <LandingParallax>
      <main>
        <HeroSection />
        {/* <DesignSystemPreviewSection /> */}
        <OrganizeSection />
        <CollectionsSection />
        <WorldMapSection />
        <TestimonialSection />
        <FeaturedProfiles />
        <TemplatesSection />
        <PricingSection />
        <JoinSection />
      </main>
    </LandingParallax>
  );
}
