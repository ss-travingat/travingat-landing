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
      <div className="pointer-events-none absolute inset-x-0 top-3 mx-auto h-55 w-full max-w-367.75 md:h-75 xl:h-119.5">
        <Image
          src={toLandingAssetUrl("/images/dotted-world-map.svg")}
          alt=""
          fill
          className="object-contain opacity-95"
          priority
        />
      </div>

      <div className="relative z-10 mx-auto max-w-384">
        {/* Image collage */}
        <div className="mb-8 flex items-center justify-center pr-[19.156px] md:mb-10 xl:mb-12">
          <div className="flex items-center justify-center mr-[-19.156px] relative shrink-0 size-[90.032px]">
            <div className="flex-none rotate-[4.28deg]">
              <div className="relative size-21 rounded-2xl border-[4.8px] border-black border-solid overflow-hidden">
                <Image src={toLandingAssetUrl("/images/join-avatar1-figma.png")} alt="Traveler" fill className="object-cover" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center mr-[-19.156px] relative shrink-0 size-[105.646px]">
            <div className="flex-none rotate-[-17.79deg]">
              <div className="relative size-21 rounded-2xl border-[4.8px] border-black border-solid overflow-hidden">
                <Image src={toLandingAssetUrl("/images/join-avatar2-figma.png")} alt="Traveler" fill className="object-cover" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center mr-[-19.156px] relative shrink-0 size-[90.687px]">
            <div className="flex-none rotate-[4.76deg]">
              <div className="relative size-21 rounded-2xl border-[4.8px] border-black border-solid overflow-hidden">
                <Image src={toLandingAssetUrl("/images/join-avatar3-figma.png")} alt="Traveler" fill className="object-cover" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center mr-[-19.156px] relative shrink-0 size-[97.453px]">
            <div className="flex-none rotate-[-10.12deg]">
              <div className="relative size-21 rounded-2xl border-[4.8px] border-black border-solid overflow-hidden">
                <Image src={toLandingAssetUrl("/images/join-avatar4-figma.png")} alt="Traveler" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* CTA content */}
        <h2 className="ds-font-display mb-3 text-[44px] font-semibold leading-13 tracking-[-0.5px] text-white md:text-[52px] md:leading-15 md:tracking-[-1px] xl:mb-6 xl:text-[64px] xl:leading-18 xl:tracking-[-1px]">
          Join travelers from around the world.
        </h2>
        <p className="mb-8 text-[18px] leading-6.5 tracking-[-0.2px] text-gray-400 md:text-[18px] md:leading-6.5 xl:mb-10 xl:text-base">
          Be first to build and share your travel profile.
        </p>

        {/* Status message */}
        {message && (
          <p className={`mb-4 text-sm ${status === "success" || status === "duplicate" ? "text-green-400" : "text-red-400"}`}>
            {message}
          </p>
        )}

        {/* Mobile: stacked input + button */}
        <form onSubmit={submit} className="mx-auto flex flex-col items-center gap-3 w-full max-w-75 md:hidden">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 rounded-full border border-white-900 bg-black px-6 text-[16px] font-medium text-white placeholder:text-white-800 focus:outline-none focus:border-gray-500 transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="ds-font-display w-full h-12 rounded-full bg-white text-[20px] font-medium leading-7 tracking-[-0.5px] text-black transition hover:bg-[#ececec] disabled:opacity-50"
          >
            {isLoading ? "Joining..." : "Get early access"}
          </button>
        </form>

        {/* Tablet/Desktop: inline pill */}
        <form onSubmit={submit} className="hidden md:flex mx-auto h-15 w-full max-w-125 items-center justify-between overflow-hidden rounded-full border border-white-900 bg-black pl-6 pr-1 py-1">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent text-[20px] font-medium leading-7 tracking-[-0.5px] text-white placeholder:text-white-800 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="ds-font-display h-13 shrink-0 rounded-full bg-white px-8 text-[20px] font-medium leading-7 tracking-[-0.5px] text-black transition hover:bg-white-100 disabled:opacity-50"
          >
            {isLoading ? "Joining..." : "Get early access"}
          </button>
        </form>
      </div>
    </section>
  );
}
