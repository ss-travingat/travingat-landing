"use client";

import Image from "next/image";

import { demoProfiles } from "@/data/demo-profiles";
import { toLandingAssetUrl } from "@/lib/landing-assets";

export default function FeaturedProfiles() {
  // Pick the first profile as the featured one
  const profile = demoProfiles[0];
  return (
    <section id="featured" className="py-12 md:py-16 xl:py-28 overflow-hidden">
      <div className="flex flex-col xl:flex-row items-center justify-center gap-12 xl:gap-24 px-4 xl:px-0">
        {/* Phone mockup left */}
        <div className="flex-shrink-0 flex items-center justify-center w-full xl:w-[420px]">
          <Image
            src={toLandingAssetUrl("/images/hero-phone-center.png")}
            alt="Phone mockup"
            width={360}
            height={720}
            className="w-[260px] h-[520px] xl:w-[360px] xl:h-[720px] object-contain drop-shadow-2xl"
            priority
          />
        </div>
        {/* Profile summary right */}
        <div className="flex flex-col items-center xl:items-start gap-8 w-full max-w-[400px]">
          <div className="flex flex-col items-center xl:items-start gap-4 w-full">
            <div className="flex gap-2 items-center">
              <span className="text-2xl">{profile.flag}</span>
              <span className="text-base text-[#a8a8a8]">{profile.country}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-[#181818]">
                <Image
                  src={toLandingAssetUrl(profile.avatar)}
                  alt={profile.name}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <div className="text-2xl font-semibold text-white leading-tight">{profile.name}</div>
                <div className="text-[#a8a8a8] text-base">{profile.handle}</div>
              </div>
            </div>
          </div>
          <div className="flex gap-6 w-full justify-center xl:justify-start">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">{profile.countries}</span>
              <span className="text-xs text-[#8c8c8c]">Countries</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">{profile.media}</span>
              <span className="text-xs text-[#8c8c8c]">All media</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">{profile.collections}</span>
              <span className="text-xs text-[#8c8c8c]">Collections</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
