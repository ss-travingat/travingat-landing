import {
  HeroSection,
  DesignSystemPreviewSection,
  OrganizeSection,
  CollectionsSection,
  WorldMapSection,
  TestimonialSection,
  FeaturedProfiles,
  TemplatesSection,
  PricingSection,
  JoinSection,
} from "@/components/sections";
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
