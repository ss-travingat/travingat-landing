"use client";

import Image from "next/image";
import { toLandingAssetUrl } from "@/lib/landing-assets";
import { useWaitlistForm } from "@/lib/use-waitlist-form";

export default function JoinSection() {
  const { email, setEmail, status, message, submit } = useWaitlistForm();
  const isLoading = status === "loading";

  return (
    <section id="join" className="relative overflow-hidden px-3 py-12 text-center md:px-12 md:py-16 xl:px-24 xl:py-20">
      {/* Full-width map background from Figma Section 16 */}
      <div className="pointer-events-none absolute inset-x-0 top-3 mx-auto h-[220px] w-full max-w-[1471px] md:h-[300px] xl:h-[478px]">
        <Image
          src={toLandingAssetUrl("/images/dotted-world-map.svg")}
          alt=""
          fill
          className="object-contain opacity-95"
          priority
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1536px]">
        {/* Image collage */}
        <div className="mb-8 flex justify-center gap-1 md:gap-2 xl:mb-12 xl:gap-3">
          <div className="relative h-[55px] w-[55px] rotate-[-3deg] overflow-hidden rounded-xl md:h-[65px] md:w-[65px] xl:h-[80px] xl:w-[80px]">
          <Image src={toLandingAssetUrl("/images/join-avatar1-figma.png")} alt="Traveler" fill className="object-cover" />
          </div>
          <div className="relative z-10 -mt-1 h-[65px] w-[65px] overflow-hidden rounded-xl md:h-[75px] md:w-[75px] xl:h-[90px] xl:w-[90px]">
          <Image src={toLandingAssetUrl("/images/join-avatar2-figma.png")} alt="Traveler" fill className="object-cover" />
          </div>
          <div className="relative h-[55px] w-[55px] rotate-[2deg] overflow-hidden rounded-xl md:h-[65px] md:w-[65px] xl:h-[80px] xl:w-[80px]">
          <Image src={toLandingAssetUrl("/images/join-avatar3-figma.png")} alt="Traveler" fill className="object-cover" />
          </div>
          <div className="relative -mt-0.5 h-[60px] w-[60px] rotate-[-1deg] overflow-hidden rounded-xl md:h-[70px] md:w-[70px] xl:h-[85px] xl:w-[85px]">
          <Image src={toLandingAssetUrl("/images/join-avatar4-figma.png")} alt="Traveler" fill className="object-cover" />
          </div>
        </div>

        {/* CTA content */}
        <h2 className="mb-3 text-[44px] font-semibold leading-[52px] tracking-[-0.5px] text-white md:text-[64px] md:leading-[72px] md:tracking-[-1px] xl:mb-6 xl:text-[64px] xl:leading-[72px] xl:tracking-[-1px]">
          Join travelers from around the world.
        </h2>
        <p className="mb-8 text-[18px] leading-[26px] tracking-[-0.2px] text-gray-400 md:text-[16px] xl:mb-10 xl:text-base">
          Be first to build and share your travel profile.
        </p>

        {/* Status message */}
        {message && (
          <p className={`mb-4 text-sm ${status === "success" || status === "duplicate" ? "text-green-400" : "text-red-400"}`}>
            {message}
          </p>
        )}

        {/* Mobile: stacked input + button */}
        <form onSubmit={submit} className="mx-auto flex flex-col items-center gap-3 w-full max-w-[300px] md:hidden">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 rounded-full border border-[#3d3d3d] bg-black px-6 text-[16px] font-medium text-white placeholder:text-[#464646] focus:outline-none focus:border-gray-500 transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-full bg-white text-[16px] font-medium text-black transition hover:bg-[#ececec] disabled:opacity-50"
          >
            {isLoading ? "Joining..." : "Get early access"}
          </button>
        </form>

        {/* Tablet/Desktop: inline pill */}
        <form onSubmit={submit} className="hidden md:flex mx-auto h-[60px] w-full max-w-[500px] items-center justify-between overflow-hidden rounded-full border border-[#3d3d3d] bg-black pl-6 pr-1 py-1">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent text-[20px] font-medium leading-7 tracking-[-0.5px] text-white placeholder:text-[#464646] focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="h-[52px] shrink-0 rounded-full bg-white px-8 text-[20px] font-medium leading-7 tracking-[-0.5px] text-black transition hover:bg-[#ececec] disabled:opacity-50"
          >
            {isLoading ? "Joining..." : "Get early access"}
          </button>
        </form>
      </div>
    </section>
  );
}
