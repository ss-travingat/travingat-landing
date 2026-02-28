import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import OrganizeFeaturesMobile from "@/components/OrganizeFeaturesMobile";
import OrganizeFeaturesDesktop from "@/components/OrganizeFeaturesDesktop";
import OnePlace from "@/components/OnePlace";
import Testimonial from "@/components/Testimonial";
import PremiumTemplates from "@/components/PremiumTemplates";
import CTA from "@/components/CTA";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <div style={{ marginTop: '6rem' }} />
      <OrganizeFeaturesMobile />
      <OrganizeFeaturesDesktop />
      <OnePlace />
      <Testimonial />
      <div id="templates">
        <PremiumTemplates />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
      <div id="join">
        <CTA />
      </div>
      <Footer />
    </>
  );
}
