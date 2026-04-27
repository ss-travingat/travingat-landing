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
} from "@landing/sections";
import LandingParallax from "@landing/components/LandingParallax";

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
