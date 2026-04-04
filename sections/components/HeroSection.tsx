"use client";

import Image from "next/image";
import { toLandingAssetUrl } from "@/lib/landing-assets";
import { useWaitlistForm } from "@/lib/use-waitlist-form";

export default function HeroSection() {
  const { email, setEmail, status, message, submit } = useWaitlistForm();
  const isLoading = status === "loading";

  return (
    <section className="px-3 py-12 md:px-12 md:pt-16 md:pb-10 xl:px-24 xl:pt-16 xl:pb-8">
      {/* Text content */}
      <div className="mb-6 md:mb-8 xl:mb-10 xl:text-center xl:max-w-250 xl:mx-auto">
        <h1 className="ds-font-display text-[44px] leading-13 font-semibold text-white mb-3 text-center tracking-[-0.5px] md:text-[64px] md:leading-18 md:tracking-[-1px] xl:text-[72px] xl:leading-20 xl:tracking-[0.5px] xl:mb-4">
          Build your travel profile
        </h1>
        <p className="text-[16px] leading-normal text-gray-400 text-center md:text-[18px] xl:text-[18px]">
          Turn your journeys into a beautiful personal archive.
        </p>
      </div>

      {/* Email input + CTA */}
      <div className="flex flex-col items-center gap-3 mb-12 px-2 md:mb-14 xl:mb-16">
        {/* Status message */}
        {message && (
          <p className={`text-sm ${status === "success" || status === "duplicate" ? "text-green-400" : "text-red-400"}`}>
            {message}
          </p>
        )}
        {/* Mobile: stacked */}
        <form onSubmit={submit} className="w-full max-w-85 flex flex-col gap-3 md:hidden">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 rounded-full border border-white-900 px-6 bg-black text-white text-[16px] font-medium placeholder:text-white-800 focus:outline-none focus:border-gray-500 transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-full bg-white text-black font-medium text-[16px] hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Joining..." : "Get early access"}
          </button>
        </form>

        {/* Tablet/Desktop: inline input with button */}
        <form onSubmit={submit} className="hidden md:flex items-center w-full max-w-125 h-15 rounded-full border border-white-900 bg-transparent pl-6 pr-1 focus-within:border-gray-400 transition-colors">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-transparent text-white text-[16px] placeholder:text-gray-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="h-13 px-8 rounded-full bg-white text-black font-semibold text-[15px] hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Joining..." : "Get early access"}
          </button>
        </form>
      </div>

      {/* Phone mockups — iPad: single composed image */}
      <div className="hidden md:block md:mx-auto md:max-w-184.5 xl:hidden">
        <Image
          src={toLandingAssetUrl("/assets/ipad_hero.png")}
          alt="Travingat hero preview"
          width={1472}
          height={898}
          className="w-full h-auto"
          priority
        />
      </div>

      {/* Phone mockups — Desktop: single SVG composite */}
      <div className="hidden xl:block xl:max-w-314 xl:mx-auto">
        <div className="relative w-full" style={{ aspectRatio: '1256 / 802' }}>
          <Image
            src={toLandingAssetUrl("/images/hero-phones.svg")}
            alt="Phone mockups showing travel profiles"
            fill
            className="object-contain"
            sizes="(min-width: 1280px) 1256px, 100vw"
            priority
          />
        </div>
      </div>

      {/* Phone mockups — Mobile: single image from Figma */}
      <div className="relative mx-auto overflow-hidden md:hidden xl:hidden">
        <Image
          src={toLandingAssetUrl("/images/hero-mobile-mockup.png")}
          alt="Phone mockups showing travel profiles"
          width={369}
          height={351}
          className="w-full h-auto"
          priority
        />
      </div>
    </section>
  );
}
