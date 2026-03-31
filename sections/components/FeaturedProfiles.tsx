"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { demoProfiles } from "@/data/demo-profiles";
import { toLandingAssetUrl } from "@/lib/landing-assets";

type DemoProfile = (typeof demoProfiles)[0];

function toFlagAssetPath(flagCode: string) {
  return `/flags/${flagCode.toUpperCase()}.svg`;
}

function TravellerCard({ profile }: { profile: DemoProfile }) {
  return (
    <article className="flex w-[240px] flex-shrink-0 flex-col items-center gap-[17px] rounded-[20px] border border-[#262626] bg-black px-[5px] pb-[19px] pt-[5px] xl:w-[360px] xl:gap-[26px] xl:px-2 xl:pb-7 xl:pt-2">
      <div className="w-full">
        <div className="flex w-full flex-col items-center pb-9">
          <div className="relative -mb-9 h-[107px] w-full overflow-hidden rounded-[14px] xl:h-[160px]">
            <Image
              src={toLandingAssetUrl(profile.cover)}
              alt={`${profile.name} cover`}
              fill
              className="rounded-[14px] object-cover"
              sizes="(min-width: 1280px) 360px, 240px"
            />
          </div>
          <div className="relative z-10 -mb-9 h-[53px] w-[53px] overflow-hidden rounded-2xl border-[5px] border-black xl:h-[80px] xl:w-[80px] xl:border-8">
            <Image
              src={toLandingAssetUrl(profile.avatar)}
              alt={profile.name}
              fill
              className="rounded-2xl object-cover"
              sizes="(min-width: 1280px) 80px, 53px"
            />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-6 px-3">
        <div className="flex w-full flex-col items-center gap-3">
          <div className="flex w-full items-center justify-center gap-1.5">
            <Image
              src={toFlagAssetPath(profile.flagCode)}
              alt={`${profile.country} flag`}
              width={24}
              height={16}
              className="h-4 w-6 rounded-[2px] object-cover"
            />
            <p className="text-sm font-normal leading-5 tracking-[-0.5px] whitespace-nowrap text-[#696969]">
              {profile.country}
            </p>
          </div>
          <p className="w-full text-center text-xl font-semibold leading-normal tracking-[-0.41px] text-white">
            {profile.name}
          </p>
          <p className="w-full text-center text-base font-normal leading-normal tracking-[-0.5px] text-[#a8a8a8]">
            {profile.handle}
          </p>
        </div>

        <div className="flex w-full items-center justify-center gap-10 rounded-xl bg-[#111] px-5 py-4">
          <div className="flex flex-1 flex-col items-center gap-1">
            <p className="text-xl font-semibold leading-normal tracking-[-0.41px] text-white">
              {profile.countries}
            </p>
            <p className="text-xs font-normal leading-[1.5] tracking-[-0.5px] text-[#8c8c8c]">
              Countries
            </p>
          </div>
          <div className="flex flex-1 flex-col items-center gap-1">
            <p className="text-xl font-semibold leading-normal tracking-[-0.41px] text-white">
              {profile.media}
            </p>
            <p className="text-xs font-normal leading-[1.5] tracking-[-0.5px] text-[#8c8c8c]">
              All media
            </p>
          </div>
          <div className="flex flex-1 flex-col items-center gap-1">
            <p className="text-xl font-semibold leading-normal tracking-[-0.41px] text-white">
              {profile.collections}
            </p>
            <p className="text-xs font-normal leading-[1.5] tracking-[-0.5px] text-[#8c8c8c]">
              Collections
            </p>
          </div>
        </div>

        <div className="flex w-full items-center gap-3">
          <span className="flex-1 overflow-hidden rounded-full bg-white p-2.5 text-center text-sm font-medium leading-normal tracking-[-0.408px] text-black">
            Follow
          </span>
          <span className="flex-1 overflow-hidden rounded-full border border-[#363636] bg-[#181818] p-2.5 text-center text-sm font-medium leading-normal tracking-[-0.408px] text-white">
            Connect
          </span>
        </div>
      </div>
    </article>
  );
}

export default function FeaturedProfiles() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const scrollPositionRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);

  const allCards = [...demoProfiles, ...demoProfiles];

  useEffect(() => {
    const tick = () => {
      const element = scrollRef.current;
      if (!element) {
        animationRef.current = requestAnimationFrame(tick);
        return;
      }

      const singleSetWidth = element.scrollWidth / 2;

      if (!isPaused && singleSetWidth > 0) {
        scrollPositionRef.current += 0.5;
        if (scrollPositionRef.current >= singleSetWidth) {
          scrollPositionRef.current -= singleSetWidth;
        }
        element.scrollLeft = scrollPositionRef.current;
      }

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused]);

  const handleMouseEnter = () => setIsPaused(true);

  const handleMouseLeave = () => {
    if (scrollRef.current) {
      scrollPositionRef.current = scrollRef.current.scrollLeft;
    }
    setIsPaused(false);
  };

  return (
    <section id="featured" className="py-12 md:py-16 xl:py-28 overflow-hidden">
      <div className="mb-8 flex items-start justify-center px-3 md:mb-12 md:px-12 xl:mb-[108px]">
        <h2 className="max-w-[800px] text-center text-[32px] font-semibold leading-[1.1] tracking-[-1px] text-white md:text-[42px] xl:text-[64px] xl:leading-[72px]">
          Featured travel profiles &mdash; a look at what&apos;s coming
        </h2>
      </div>

      <div
        ref={scrollRef}
        className="hide-scrollbar overflow-x-hidden overflow-y-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseEnter}
        onTouchEnd={handleMouseLeave}
      >
        <div className="flex w-max items-center gap-4 px-4 xl:gap-8">
          {allCards.map((profile, index) => {
            const isCardUp = index % 2 === 0;

            return (
              <Link
                key={`${profile.id}-${index}`}
                href={`/profiles/${profile.id}`}
                aria-label={`Open ${profile.name} profile`}
                className={`flex h-[390px] flex-shrink-0 flex-col items-center xl:h-[600px] ${
                  isCardUp ? "justify-start" : "justify-end"
                }`}
              >
                <TravellerCard profile={profile} />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
