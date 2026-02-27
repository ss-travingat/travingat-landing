import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import OrganizeFeatures from "@/components/OrganizeFeatures";
import CreateCollections from "@/components/CreateCollections";
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
      {/* Wrapper for connected sections with decorative line */}
      <div className="relative bg-black">
        <OrganizeFeatures />
        <CreateCollections />
        {/* Connecting line - desktop only, centered within content container */}
        <div className="absolute inset-0 hidden lg:flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
          <div className="w-full max-w-7xl mx-auto px-10 lg:px-16 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/line.svg"
              alt=""
              style={{ width: 'min(480px, 38%)', height: 'auto' }}
            />
          </div>
        </div>
      </div>
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
