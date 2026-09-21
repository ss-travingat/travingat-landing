"use client";
import React, { useState, useEffect, useRef } from "react";
import { Tooltip, TooltipProvider } from "@/components/ui/Tooltip";
import { getCountryName } from "@/lib/countries";
import Link from "next/link";
import { toLandingAssetUrl } from "@/lib/landing-assets";
import { type SampleProfile } from "../data/profile-data";
import LoadedImage from "@/components/ui/LoadedImage";
import { getOptimizedMediaUrl } from "@/lib/landing-assets";
import { useMobileComingSoon } from "@/components/ui/MobileComingSoonToast";

// Shared Types
type TabKey = "all" | "countries" | "collections" | "about";

function toFlagAssetPath(flagCode?: string): string | undefined {
  if (!flagCode) return undefined;
  return `/flags/${flagCode.toUpperCase()}.svg`;
}

// ==========================================
// CUSTOM HOOK: NAVBAR VISIBILITY
// ==========================================
export function useNavbarVisibility(menuOpen = false) {
  const lastScrollY = useRef(0);
  const offsetRef = useRef(0);

  useEffect(() => {
    const updateDOM = () => {
      const navbarEl = document.getElementById("profile-mobile-navbar");
      const tabsEl = document.getElementById("profile-mobile-tabs");
      if (navbarEl) navbarEl.style.transform = `translateY(-${offsetRef.current}px)`;
      if (tabsEl) tabsEl.style.transform = `translateY(-${offsetRef.current}px)`;
    };

    const handleScroll = () => {
      if (menuOpen) {
        offsetRef.current = 0;
        updateDOM();
        return;
      }

      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      const tabsEl = document.getElementById("profile-mobile-tabs");
      const isTabsLocked = tabsEl ? tabsEl.getBoundingClientRect().top <= (72 - offsetRef.current + 2) : false;

      if (currentScrollY <= 24) {
        offsetRef.current = 0;
      } else {
        if (delta > 0 && isTabsLocked) {
          offsetRef.current = Math.min(72, offsetRef.current + delta);
        } else if (delta < 0) {
          offsetRef.current = Math.max(0, offsetRef.current + delta);
        }
      }

      updateDOM();
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);
}

// ==========================================
// MOBILE NAVBAR COMPONENT
// ==========================================
export function MobileProfileNavbar({ profile }: { profile?: any }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fullScreenMenuRef = useRef<HTMLDivElement>(null);
  useNavbarVisibility(menuOpen);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(target) &&
        (!fullScreenMenuRef.current || !fullScreenMenuRef.current.contains(target))
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const scrollToSection = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault();
    const section = document.getElementById(sectionId);
    if (!section) {
      window.location.href = `https://travingat.com/#${sectionId}`;
      return;
    }
    setMenuOpen(false);
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div id="profile-mobile-navbar" ref={menuRef} className="fixed top-0 left-0 w-full z-[120] flex flex-col pointer-events-none">
        <div className={`flex items-center justify-between px-[1.75rem] pt-[1.25rem] pb-[1rem] pointer-events-auto transition-colors duration-300 ${(isScrolled || menuOpen) ? "bg-black shadow-[0_2px_0_0_#000]" : "bg-gradient-to-b from-black/50 to-transparent min-[50.625rem]:bg-black min-[50.625rem]:bg-none min-[50.625rem]:shadow-[0_2px_0_0_#000]"}`}>
          {isScrolled && profile ? (
            <div className="flex items-center gap-2">
              <LoadedImage
                src={toLandingAssetUrl(typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url)}
                thumbnailSrc={getOptimizedMediaUrl(toLandingAssetUrl(typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url))}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover"
                skeletonClassName="absolute inset-0 bg-[#2a2a2a]"
                containerClassName="w-8 h-8 relative shrink-0 rounded-full"
              />
              <span className="font-semibold text-[1rem] text-white tracking-tight">{profile.handle}</span>
            </div>
          ) : (
            <a href="https://travingat.com/" className="flex items-center">
              <img src="/icons/travingat-logo.svg" alt="Travingat Logo" className="h-[1.375rem] w-auto" />
            </a>
          )}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className={`relative flex h-[2.25rem] w-[2.25rem] flex-col items-center justify-center gap-[0.25rem] rounded-full transition-colors ${menuOpen ? 'bg-[#1c1c1c] text-white hover:bg-[#2a2a2a]' : ''}`}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span className={`block h-[0.125rem] w-[1.125rem] origin-center rounded-full bg-white transition-all duration-300 ease-in-out ${menuOpen ? 'translate-y-[0.375rem] rotate-45' : ''}`} />
            <span className={`block h-[0.125rem] w-[1.125rem] origin-center rounded-full bg-white transition-all duration-300 ease-in-out ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-[0.125rem] w-[1.125rem] origin-center rounded-full bg-white transition-all duration-300 ease-in-out ${menuOpen ? '-translate-y-[0.375rem] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* Fixed Full-Screen Mobile Overlay Menu */}
      <div
        ref={fullScreenMenuRef}
        className={`fixed inset-0 z-[110] min-[75rem]:hidden bg-black/95 backdrop-blur-xl transition-all duration-300 ease-in-out flex flex-col justify-start items-center px-6 pt-[6.25rem] pb-10 ${menuOpen
          ? "opacity-100 pointer-events-auto translate-y-0"
          : "opacity-0 pointer-events-none -translate-y-4"
          }`}
      >
        <div className="w-full max-w-xs flex flex-col items-center gap-[1.5rem]">
          <nav className="flex flex-col items-center justify-start gap-[1.5rem] w-full">
            <a href="https://travingat.com/" onClick={() => setMenuOpen(false)} className="text-[1.75rem] font-medium leading-[1.2] text-white hover:text-white/80 transition">Home</a>
            <a href="https://travingat.com/profiles" onClick={() => setMenuOpen(false)} className="text-[1.75rem] font-medium leading-[1.2] text-white hover:text-white/80 transition">Profiles</a>
            <a href="https://travingat.com/templates" onClick={() => setMenuOpen(false)} className="text-[1.75rem] font-medium leading-[1.2] text-white hover:text-white/80 transition">Templates</a>
            <a href="https://travingat.com/pricing" onClick={() => setMenuOpen(false)} className="text-[1.75rem] font-medium leading-[1.2] text-white hover:text-white/80 transition">Pricing</a>
            <a href="https://travingat.com/blog" onClick={() => setMenuOpen(false)} className="text-[1.75rem] font-medium leading-[1.2] text-white hover:text-white/80 transition">Blog</a>

            <a
              href="https://travingat.com/#join"
              onClick={(e) => scrollToSection(e, "join")}
              className="mt-[0.75rem] w-full text-center rounded-[62.4375rem] bg-white px-[1.75rem] py-[0.75rem] text-[0.9375rem] font-medium tracking-tight text-black hover:bg-[#ececec] transition shadow-lg shrink-0"
            >
              Join now
            </a>
          </nav>
        </div>
      </div>
    </>
  );
}

// ==========================================
// MOBILE HERO COMPONENT
// ==========================================
export interface MobileHeroProps {
  profile: SampleProfile;
  displayName: string;
  handle: string;
  basedIn: string;
  profileFlagCode: string;
  profileFlagSrc?: string;
  headerFlagCodes: string[];
  flagOverflowCount: number;
}

export function MobileHero({
  profile,
  displayName,
  handle,
  basedIn,
  profileFlagCode,
  profileFlagSrc,
  headerFlagCodes,
  flagOverflowCount,
}: MobileHeroProps) {
  const { showComingSoonToast } = useMobileComingSoon();
  const [openTooltipIndex, setOpenTooltipIndex] = useState<number | null>(null);
  const [openBioTooltip, setOpenBioTooltip] = useState(false);

  return (
    <section id="profile-mobile-hero" className="min-[75rem]:hidden space-y-[0.75rem] flex flex-col items-center w-full">
      <div className="flex flex-col items-center gap-[1.25rem] rounded-[1.5rem] w-full relative">
        <MobileProfileNavbar profile={profile} />
        <div className="w-full min-[50.625rem]:max-w-[25rem] min-[50.625rem]:mx-auto flex flex-col items-center">
          <div className="w-full aspect-[377/248] -mb-[2.25rem] rounded-2xl overflow-hidden bg-[#151515]">
            <LoadedImage
              src={toLandingAssetUrl(typeof profile.images.cover === "string" ? profile.images.cover : profile.images.cover.url)}
              thumbnailSrc={getOptimizedMediaUrl(toLandingAssetUrl(typeof profile.images.cover === "string" ? profile.images.cover : profile.images.cover.url))}
              alt="Profile cover"
              className="w-full h-full object-cover"
              skeletonClassName="absolute inset-0 bg-[#1a1a1a]"
              containerClassName="w-full h-full"
            />
          </div>
          <div className="relative z-10 mx-auto w-[5rem] h-[5rem] rounded-2xl ring-4 ring-black bg-[#151515]">
            <LoadedImage
              src={toLandingAssetUrl(typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url)}
              thumbnailSrc={getOptimizedMediaUrl(toLandingAssetUrl(typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url))}
              alt="Profile avatar"
              className="w-full h-full object-cover rounded-2xl"
              skeletonClassName="absolute inset-0 bg-[#1a1a1a] rounded-2xl"
              containerClassName="w-full h-full rounded-2xl"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-[0.5rem] w-full min-[50.625rem]:max-w-[25rem] min-[50.625rem]:mx-auto">
          <div className="flex items-center justify-center gap-1.5 text-[#696969] text-[0.875rem] leading-[1.25rem] tracking-[-0.5px] font-sans font-normal">
            {profileFlagSrc ? (
              <TooltipProvider delayDuration={100}>
                <Tooltip
                  content={basedIn}
                  theme="light"
                  side="top"
                  open={openBioTooltip}
                  onOpenChange={setOpenBioTooltip}
                >
                  <button
                    type="button"
                    className="focus:outline-none flex items-center justify-center"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenBioTooltip(!openBioTooltip);
                    }}
                  >
                    <img
                      src={profileFlagSrc}
                      alt={`${basedIn} flag`}
                      className="h-[0.625rem] w-[0.9375rem] rounded-[0.125rem] object-cover cursor-pointer"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <span>{profileFlagCode}</span>
            )}
            <span>{basedIn}</span>
          </div>
          <h1 className="text-white text-[1.25rem] leading-[1.5rem] tracking-[-0.41px] font-semibold text-center w-full">{displayName}</h1>
          <p className="text-[#a8a8a8] text-[0.875rem] leading-[1.25rem] tracking-[-0.5px] text-center w-full font-sans font-normal">{handle}</p>
        </div>

        <div className="flex flex-wrap items-start justify-center gap-[0.25rem] px-[0.375rem] w-full min-[50.625rem]:max-w-[25rem] min-[50.625rem]:mx-auto">
          <TooltipProvider delayDuration={100}>
            {headerFlagCodes.map((code, index) => {
              const countryName = getCountryName(code);
              return (
                <Tooltip
                  key={`${code}-${index}`}
                  content={countryName}
                  theme="light"
                  side="top"
                  open={openTooltipIndex === index}
                  onOpenChange={(isOpen) => setOpenTooltipIndex(isOpen ? index : null)}
                >
                  <button
                    type="button"
                    className="focus:outline-none shrink-0"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTooltipIndex(openTooltipIndex === index ? null : index);
                    }}
                  >
                    <img
                      src={toFlagAssetPath(code) || ""}
                      alt={`${countryName} flag`}
                      className="h-[1.0625rem] w-[1.625rem] rounded-[0.125rem] object-cover cursor-pointer"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                </Tooltip>
              );
            })}
          </TooltipProvider>
          {flagOverflowCount > 0 && (
            <div className="flex h-[1.0625rem] w-[1.625rem] shrink-0 items-center justify-center overflow-hidden rounded-[0.125rem] bg-white">
              <span className="font-medium text-violet-600 text-[0.625rem] text-center tracking-[-0.408px] whitespace-nowrap">
                +{flagOverflowCount}
              </span>
            </div>
          )}
        </div>

        {/* Mobile Stats Container */}
        <div className="bg-[#111] flex items-center justify-center gap-[1.25rem] rounded-[0.75rem] w-full min-[50.625rem]:max-w-[25rem] min-[50.625rem]:mx-auto pt-[1.125rem] pb-[1.25rem] px-[1.25rem]">
          <div className="flex flex-1 flex-col items-center justify-center gap-[0.25rem]">
            <p className="ds-font-display text-[1.5rem] font-semibold leading-[2rem] tracking-[-0.5px] text-white">
              {profile.countries}
            </p>
            <p className="text-[0.875rem] font-normal leading-[1.25rem] tracking-[-0.084px] text-[#989898]">
              Countries
            </p>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-[0.25rem]">
            <p className="ds-font-display text-[1.5rem] font-semibold leading-[2rem] tracking-[-0.5px] text-white">
              {profile.media}
            </p>
            <p className="text-[0.875rem] font-normal leading-[1.25rem] tracking-[-0.084px] text-[#989898]">
              All media
            </p>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-[0.25rem]">
            <p className="ds-font-display text-[1.5rem] font-semibold leading-[2rem] tracking-[-0.5px] text-white">
              {profile.collections}
            </p>
            <p className="text-[0.875rem] font-normal leading-[1.25rem] tracking-[-0.084px] text-[#989898]">
              Collections
            </p>
          </div>
        </div>

        {/* Buttons under Stats Card */}
        <div className="flex gap-[0.5rem] items-center w-full min-[50.625rem]:max-w-[25rem] min-[50.625rem]:mx-auto mt-[0.25rem]">
          <button
            onClick={() => showComingSoonToast("featureLaunch")}
            className="flex-1 rounded-full bg-white text-black px-[1.125rem] py-[0.625rem] text-[1rem] font-medium leading-[1.5rem] tracking-[-0.096px]"
          >
            Follow
          </button>
          <button
            onClick={() => showComingSoonToast("featureLaunch")}
            className="h-[2.75rem] w-[2.6875rem] shrink-0 rounded-full border border-[#353535] bg-[#1a1a1a] grid place-items-center text-white"
            aria-label="More options"
          >
            <span className="grid grid-cols-2 gap-1">
              <span className="h-[0.1875rem] w-[0.1875rem] rounded-full bg-white" />
              <span className="h-[0.1875rem] w-[0.1875rem] rounded-full bg-white" />
              <span className="h-[0.1875rem] w-[0.1875rem] rounded-full bg-white" />
              <span className="h-[0.1875rem] w-[0.1875rem] rounded-full bg-white" />
            </span>
          </button>
          <button
            onClick={() => showComingSoonToast("featureLaunch")}
            className="flex-1 rounded-full bg-[#1a1a1a] border border-[#353535] text-white px-[1.125rem] py-[0.625rem] text-[1rem] font-medium leading-[1.5rem] tracking-[-0.096px]"
          >
            Connect
          </button>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// MOBILE TABS COMPONENT
// ==========================================
export interface MobileTabsProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  swipeOffset?: number;
}

export function MobileTabs({ activeTab, setActiveTab, swipeOffset = 0 }: MobileTabsProps) {
  const mobileTabs: { key: TabKey }[] = [
    { key: "all" },
    { key: "countries" },
    { key: "collections" },
    { key: "about" },
  ];
  const activeIndex = mobileTabs.findIndex((t) => t.key === activeTab);

  let offsetPercent = 0;
  if (swipeOffset !== 0 && typeof window !== "undefined") {
    // We divide by (window.innerWidth / mobileTabs.length) so it tracks the finger 1:1
    const fraction = swipeOffset / (window.innerWidth / mobileTabs.length);
    offsetPercent = Math.max(-1, Math.min(1, fraction)) * 100;

    // Prevent dragging highlight past the edges
    if (activeIndex === 0 && offsetPercent < 0) offsetPercent = 0;
    if (activeIndex === mobileTabs.length - 1 && offsetPercent > 0) offsetPercent = 0;
  }

  const finalTranslate = activeIndex * 100 + offsetPercent;
  const isDragging = swipeOffset !== 0;

  return (
    <div id="profile-mobile-tabs" className="flex min-[75rem]:hidden flex-col w-[calc(100%+16px)] -mx-[0.5rem] border-b border-[#252525] sticky top-[4.5rem] z-header bg-black">
      <div className="flex items-center w-full">
        {mobileTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              navigator.vibrate?.(8);
              setActiveTab(tab.key);
            }}
            className="flex-1 flex items-center justify-center px-6 py-4 transition-all duration-200 opacity-100"
          >
            <img src={`/icons/tab-${tab.key}.svg`} alt={`${tab.key} tab`} className="w-[1.5rem] h-[1.5rem]" />
          </button>
        ))}
      </div>
      {/* Sliding underline */}
      <div
        className="absolute bottom-0 h-0.5 bg-white rounded-full"
        style={{
          width: `${100 / mobileTabs.length}%`,
          transform: `translateX(${finalTranslate}%)`,
          transition: isDragging ? "none" : "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  );
}

// ==========================================
// MOBILE ACTION BAR COMPONENT
// ==========================================
export interface MobileActionBarProps {
  onFollowClick: () => void;
}

export function MobileActionBar({ onFollowClick }: MobileActionBarProps) {
  return (
    <div className="md:hidden fixed left-1/2 -translate-x-1/2 bottom-[0.25rem] z-header rounded-full backdrop-blur-[0.375rem] bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.1)] px-[0.5625rem] py-[0.5rem] shadow-[0px_12px_12px_0px_rgba(0,0,0,0.12)] flex items-center overflow-clip w-[calc(100%-20px)] max-w-[37.5rem] opacity-0">
      <div className="flex gap-[0.5rem] items-center w-full">
        <button
          onClick={onFollowClick}
          className="flex-1 rounded-full bg-white text-black px-[1.125rem] py-[0.625rem] text-[1rem] font-medium leading-[1.5rem] tracking-[-0.096px]"
        >
          Follow
        </button>
        <button
          className="h-[2.75rem] w-[2.6875rem] shrink-0 rounded-full border border-[#353535] bg-[#1a1a1a] grid place-items-center text-white"
          aria-label="More options"
        >
          <span className="grid grid-cols-2 gap-1">
            <span className="h-[0.1875rem] w-[0.1875rem] rounded-full bg-white" />
            <span className="h-[0.1875rem] w-[0.1875rem] rounded-full bg-white" />
            <span className="h-[0.1875rem] w-[0.1875rem] rounded-full bg-white" />
            <span className="h-[0.1875rem] w-[0.1875rem] rounded-full bg-white" />
          </span>
        </button>
        <button className="flex-1 rounded-full border border-[#353535] bg-[#1a1a1a] text-white px-[1.125rem] py-[0.625rem] text-[1rem] font-medium leading-[1.5rem] tracking-[-0.096px]">
          Connect
        </button>
      </div>
    </div>
  );
}
