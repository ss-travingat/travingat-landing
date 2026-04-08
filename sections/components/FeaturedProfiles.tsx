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
    <article className="flex w-60 shrink-0 flex-col items-center gap-4.25 rounded-[20px] border border-black-400 bg-black px-1.25 pb-4.75 pt-1.25 xl:w-90 xl:gap-6.5 xl:rounded-2xl xl:px-2 xl:pb-7 xl:pt-2">
      <div className="w-full">
        <div className="flex w-full flex-col items-center pb-6 xl:pb-9">
          <div className="relative -mb-6 h-26.75 w-full overflow-hidden rounded-[14px] xl:-mb-9 xl:h-40 xl:rounded-2xl">
            <Image
              src={toLandingAssetUrl(profile.images.cover)}
              alt={`${profile.name} cover`}
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 360px, 240px"
            />
          </div>
          <div className="relative z-10 -mb-6 size-13.25 overflow-hidden rounded-[13px] border-[5.333px] border-black xl:-mb-9 xl:size-20 xl:rounded-2xl xl:border-8">
            <Image
              src={toLandingAssetUrl(profile.images.avatar)}
              alt={profile.name}
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 80px, 53px"
            />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-4 px-2 xl:gap-6 xl:px-3">
        <div className="flex w-full flex-col items-center gap-[5.333px] xl:gap-3">
          <div className="flex w-full items-center justify-center gap-1">
            <img
              src={toFlagAssetPath(profile.flagCode)}
              alt={`${profile.country} flag`}
              className="h-1.5 w-2.5 shrink-0 rounded-xs object-cover xl:h-4 xl:w-6"
            />
            <p className="text-[9.33px] font-normal leading-none tracking-[-0.056px] whitespace-nowrap text-white-600 xl:text-sm xl:leading-5 xl:tracking-[-0.084px]">
              {profile.country}
            </p>
          </div>
          <p className="w-full text-center text-[13.33px] font-semibold leading-[18.667px] tracking-[-0.0667px] text-white ds-font-display xl:text-xl xl:leading-normal xl:tracking-[-0.41px]">
            {profile.name}
          </p>
          <p className="w-full text-center text-[10.67px] font-normal leading-4 tracking-[-0.064px] text-white-400 xl:text-base xl:leading-normal xl:tracking-[-0.096px]">
            {profile.handle}
          </p>
        </div>

        <div className="flex w-full items-center justify-center gap-[26.667px] rounded-xl bg-black-900 px-[13.333px] py-[10.667px] xl:gap-10 xl:px-5 xl:py-4">
          <div className="flex flex-1 flex-col items-center gap-1">
            <p className="text-[13.33px] font-semibold leading-normal tracking-[-0.41px] text-white ds-font-display xl:text-xl">
              {profile.countries}
            </p>
            <p className="text-[8px] font-normal leading-[10.667px] text-white-500 xl:text-xs xl:leading-normal xl:tracking-[-0.5px]">
              Countries
            </p>
          </div>
          <div className="flex flex-1 flex-col items-center gap-1">
            <p className="text-[13.33px] font-semibold leading-normal tracking-[-0.41px] text-white ds-font-display xl:text-xl">
              {profile.media}
            </p>
            <p className="text-[8px] font-normal leading-[10.667px] text-white-500 xl:text-xs xl:leading-normal xl:tracking-[-0.5px]">
              All media
            </p>
          </div>
          <div className="flex flex-1 flex-col items-center gap-1">
            <p className="text-[13.33px] font-semibold leading-normal tracking-[-0.41px] text-white ds-font-display xl:text-xl">
              {profile.collections}
            </p>
            <p className="text-[8px] font-normal leading-[10.667px] text-white-500 xl:text-xs xl:leading-normal xl:tracking-[-0.5px]">
              Collections
            </p>
          </div>
        </div>

        <div className="flex w-full items-center gap-2 xl:gap-3">
          <span className="flex-1 overflow-hidden rounded-full bg-white-50 px-[10.667px] py-[6.667px] text-center text-[9.33px] font-medium leading-[13.333px] tracking-[-0.056px] text-black-950 xl:p-2.5 xl:text-sm xl:leading-normal xl:tracking-[-0.084px]">
            Follow
          </span>
          <span className="flex-1 overflow-hidden rounded-full border border-black-100 bg-black-700 px-[10.667px] py-[6.667px] text-center text-[9.33px] font-medium leading-[13.333px] tracking-[-0.056px] text-white-50 xl:p-2.5 xl:text-sm xl:leading-normal xl:tracking-[-0.084px]">
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

  // Mouse drag
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const mouseHasDraggedRef = useRef(false);

  // Touch swipe
  const touchStartXRef = useRef(0);
  const touchStartScrollRef = useRef(0);
  const isSwipingRef = useRef(false);
  const touchHasDraggedRef = useRef(false);

  const allCards = [...demoProfiles, ...demoProfiles];

  // Auto-scroll animation loop
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
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPaused]);

  // Imperative touchmove with {passive: false} to preventDefault during horizontal swipe
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const onTouchMove = (e: TouchEvent) => {
      if (!isSwipingRef.current) return;
      e.preventDefault();

      const deltaX = touchStartXRef.current - e.touches[0].clientX;
      if (Math.abs(deltaX) > 5) touchHasDraggedRef.current = true;

      const singleSetWidth = element.scrollWidth / 2;
      let newPosition = touchStartScrollRef.current + deltaX;
      if (singleSetWidth > 0) {
        if (newPosition < 0) newPosition += singleSetWidth;
        if (newPosition >= singleSetWidth) newPosition -= singleSetWidth;
      }
      scrollPositionRef.current = newPosition;
      element.scrollLeft = newPosition;
    };

    element.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => element.removeEventListener("touchmove", onTouchMove);
  }, []);

  // Keep scrollPositionRef in sync when native scroll happens (mousewheel etc.)
  const handleScroll = () => {
    if (scrollRef.current) scrollPositionRef.current = scrollRef.current.scrollLeft;
  };

  // ── Mouse drag ──────────────────────────────────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    mouseHasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartScrollRef.current = scrollPositionRef.current;
    setIsPaused(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const element = scrollRef.current;
    if (!element) return;

    const deltaX = dragStartXRef.current - e.clientX;
    if (Math.abs(deltaX) > 4) mouseHasDraggedRef.current = true;

    const singleSetWidth = element.scrollWidth / 2;
    let newPosition = dragStartScrollRef.current + deltaX;
    if (singleSetWidth > 0) {
      if (newPosition < 0) newPosition += singleSetWidth;
      if (newPosition >= singleSetWidth) newPosition -= singleSetWidth;
    }
    scrollPositionRef.current = newPosition;
    element.scrollLeft = newPosition;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    if (scrollRef.current) scrollPositionRef.current = scrollRef.current.scrollLeft;
    setTimeout(() => setIsPaused(false), 40);
    setTimeout(() => { mouseHasDraggedRef.current = false; }, 200);
  };

  // ── Hover (no drag) ─────────────────────────────────────────────────────────
  const handleMouseEnter = () => {
    if (!isDraggingRef.current) setIsPaused(true);
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
    if (scrollRef.current) scrollPositionRef.current = scrollRef.current.scrollLeft;
    setIsPaused(false);
  };

  // ── Touch ───────────────────────────────────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartScrollRef.current = scrollPositionRef.current;
    touchHasDraggedRef.current = false;
    isSwipingRef.current = true;
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    isSwipingRef.current = false;
    if (scrollRef.current) scrollPositionRef.current = scrollRef.current.scrollLeft;
    setTimeout(() => setIsPaused(false), 60);
    setTimeout(() => { touchHasDraggedRef.current = false; }, 200);
  };

  // Block link navigation when finger/mouse actually dragged
  const handleClickCapture = (e: React.MouseEvent) => {
    if (mouseHasDraggedRef.current || touchHasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section id="featured" className="py-12 md:py-16 xl:py-28 overflow-hidden">
      <div className="mb-8 flex items-start justify-center px-3 md:mb-12 md:px-12 xl:mb-27">
        <h2 className="ds-font-display max-w-200 text-center text-[32px] font-semibold leading-tight tracking-[-1px] text-white md:text-[42px] xl:text-[64px] xl:leading-18">
          Featured travel profiles &mdash; a look at what&apos;s coming
        </h2>
      </div>

      {/* overflow-x-scroll (scrollbar hidden by hide-scrollbar) ensures scrollLeft
          works in all browsers — overflow-x-hidden silently blocks it in some. */}
      <div
        ref={scrollRef}
        className={`hide-scrollbar overflow-x-scroll overflow-y-hidden select-none ${isDraggingRef.current ? "cursor-grabbing" : "cursor-grab"}`}
        onScroll={handleScroll}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClickCapture={handleClickCapture}
      >
        <div className="flex w-max items-center gap-4 px-4 xl:gap-8">
          {allCards.map((profile, index) => {
            const isCardUp = index % 2 === 0;

            return (
              <Link
                key={`${profile.id}-${index}`}
                href={`/profiles/${profile.id}`}
                aria-label={`Open ${profile.name} profile`}
                className={`flex h-97.5 shrink-0 flex-col items-center xl:h-150 ${
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
