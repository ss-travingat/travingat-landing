"use client";
import React, { useState, useEffect, useRef } from "react";
import { Tooltip, TooltipProvider } from "@/components/ui/Tooltip";
import { getCountryName } from "@/lib/countries";
import Link from "next/link";
import { toLandingAssetUrl } from "@/lib/landing-assets";
import { type SampleProfile } from "../data/profile-data";
import LoadedImage from "@/components/ui/LoadedImage";
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
      window.location.href = `/#${sectionId}`;
      return;
    }
    setMenuOpen(false);
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div id="profile-mobile-navbar" ref={menuRef} className="fixed top-0 left-0 w-full z-[100] flex flex-col pointer-events-none">
        <div className={`flex items-center justify-between px-[28px] pt-[20px] pb-[16px] pointer-events-auto transition-colors duration-300 ${(isScrolled || menuOpen) ? "bg-black shadow-[0_2px_0_0_#000]" : "bg-gradient-to-b from-black/50 to-transparent"}`}>
          {isScrolled && profile ? (
            <div className="flex items-center gap-2">
              <img src={toLandingAssetUrl(profile.images.avatar)} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
              <span className="font-semibold text-[16px] text-white tracking-tight">{profile.handle}</span>
            </div>
          ) : (
            <Link href="/" className="flex items-center">
              <img src="/icons/travingat-logo.svg" alt="Travingat Logo" className="h-[22px] w-auto" />
            </Link>
          )}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className={`relative flex h-[36px] w-[36px] flex-col items-center justify-center gap-[4px] rounded-full transition-colors ${menuOpen ? 'bg-[#1c1c1c] text-white hover:bg-[#2a2a2a]' : ''}`}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span className={`block h-[2px] w-[18px] origin-center rounded-full bg-white transition-all duration-300 ease-in-out ${menuOpen ? 'translate-y-[6px] rotate-45' : ''}`} />
            <span className={`block h-[2px] w-[18px] origin-center rounded-full bg-white transition-all duration-300 ease-in-out ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-[2px] w-[18px] origin-center rounded-full bg-white transition-all duration-300 ease-in-out ${menuOpen ? '-translate-y-[6px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* Fixed Full-Screen Mobile Overlay Menu */}
      <div
        ref={fullScreenMenuRef}
        className={`fixed inset-0 z-[90] min-[1200px]:hidden bg-black/95 backdrop-blur-xl transition-all duration-300 ease-in-out flex flex-col justify-start items-center px-6 pt-[100px] pb-10 ${menuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4"
          }`}
      >
        <div className="w-full max-w-xs flex flex-col items-center gap-[24px]">
          <nav className="flex flex-col items-center justify-start gap-[24px] w-full">
            <Link href="/" onClick={() => setMenuOpen(false)} className="text-[28px] font-medium leading-[1.2] text-white hover:text-white/80 transition">Home</Link>
            <Link href="/newprofiles" onClick={() => setMenuOpen(false)} className="text-[28px] font-medium leading-[1.2] text-white hover:text-white/80 transition">Profiles</Link>
            <Link href="/templates" onClick={() => setMenuOpen(false)} className="text-[28px] font-medium leading-[1.2] text-white hover:text-white/80 transition">Templates</Link>
            <Link href="/pricing" onClick={() => setMenuOpen(false)} className="text-[28px] font-medium leading-[1.2] text-white hover:text-white/80 transition">Pricing</Link>
            <Link href="/blog" onClick={() => setMenuOpen(false)} className="text-[28px] font-medium leading-[1.2] text-white hover:text-white/80 transition">Blog</Link>

            <a
              href="/#join"
              onClick={(e) => scrollToSection(e, "join")}
              className="mt-[12px] w-full text-center rounded-[999px] bg-white px-[28px] py-[12px] text-[15px] font-medium tracking-tight text-black hover:bg-[#ececec] transition shadow-lg shrink-0"
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
    <section id="profile-mobile-hero" className="min-[1200px]:hidden space-y-[12px] flex flex-col items-center w-full">
      <div className="flex flex-col items-center gap-[20px] rounded-[24px] w-full relative">
        <MobileProfileNavbar profile={profile} />
        <div className="w-full min-[810px]:max-w-[400px] min-[810px]:mx-auto flex flex-col items-center">
          <div className="w-full aspect-[377/248] -mb-[36px] rounded-2xl overflow-hidden bg-[#151515]">
            <LoadedImage
              src={toLandingAssetUrl(typeof profile.images.cover === "string" ? profile.images.cover : profile.images.cover.url)}
              alt="Profile cover"
              className="w-full h-full object-cover"
              skeletonClassName="absolute inset-0 bg-[#1a1a1a]"
              containerClassName="w-full h-full"
              priority
            />
          </div>
          <div className="relative z-10 mx-auto w-[80px] h-[80px] rounded-2xl ring-4 ring-black bg-[#151515]">
            <LoadedImage
              src={toLandingAssetUrl(typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url)}
              alt="Profile avatar"
              className="w-full h-full object-cover rounded-2xl"
              skeletonClassName="absolute inset-0 bg-[#1a1a1a] rounded-2xl"
              containerClassName="w-full h-full rounded-2xl"
              priority
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-[8px] w-full min-[810px]:max-w-[400px] min-[810px]:mx-auto">
          <div className="flex items-center justify-center gap-1.5 text-[#696969] text-[14px] leading-[20px] tracking-[-0.5px] font-[family-name:var(--font-inter-google)] font-normal">
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
                      className="h-[10px] w-[15px] rounded-[2px] object-cover cursor-pointer"
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
          <h1 className="text-white text-[20px] leading-[24px] tracking-[-0.41px] font-semibold text-center w-full">{displayName}</h1>
          <p className="text-[#a8a8a8] text-[14px] leading-[20px] tracking-[-0.5px] text-center w-full font-[family-name:var(--font-inter-google)] font-normal">{handle}</p>
        </div>

        <div className="flex flex-wrap items-start justify-center gap-[4px] px-[6px] w-full min-[810px]:max-w-[400px] min-[810px]:mx-auto">
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
                      className="h-[17px] w-[26px] rounded-[2px] object-cover cursor-pointer"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                </Tooltip>
              );
            })}
          </TooltipProvider>
          {flagOverflowCount > 0 && (
            <div className="flex h-[17px] w-[26px] shrink-0 items-center justify-center overflow-hidden rounded-[2px] bg-white">
              <span className="font-medium text-violet-600 text-[10px] text-center tracking-[-0.408px] whitespace-nowrap">
                +{flagOverflowCount}
              </span>
            </div>
          )}
        </div>

        {/* Mobile Stats Container */}
        <div className="bg-[#111] flex items-center justify-center gap-[20px] rounded-[12px] w-full min-[810px]:max-w-[400px] min-[810px]:mx-auto pt-[18px] pb-[20px] px-[20px]">
          <div className="flex flex-1 flex-col items-center justify-center gap-[4px]">
            <p className="ds-font-display text-[24px] font-semibold leading-[32px] tracking-[-0.5px] text-white">
              {profile.countries}
            </p>
            <p className="text-[14px] font-normal leading-[20px] tracking-[-0.084px] text-[#989898]">
              Countries
            </p>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-[4px]">
            <p className="ds-font-display text-[24px] font-semibold leading-[32px] tracking-[-0.5px] text-white">
              {profile.media}
            </p>
            <p className="text-[14px] font-normal leading-[20px] tracking-[-0.084px] text-[#989898]">
              All media
            </p>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-[4px]">
            <p className="ds-font-display text-[24px] font-semibold leading-[32px] tracking-[-0.5px] text-white">
              {profile.collections}
            </p>
            <p className="text-[14px] font-normal leading-[20px] tracking-[-0.084px] text-[#989898]">
              Collections
            </p>
          </div>
        </div>

        {/* Buttons under Stats Card */}
        <div className="flex gap-[8px] items-center w-full min-[810px]:max-w-[400px] min-[810px]:mx-auto mt-[4px]">
          <button
            onClick={() => showComingSoonToast("featureLaunch")}
            className="flex-1 rounded-full bg-white text-black px-[18px] py-[10px] text-[16px] font-medium leading-[24px] tracking-[-0.096px]"
          >
            Follow
          </button>
          <button
            onClick={() => showComingSoonToast("featureLaunch")}
            className="h-[44px] w-[43px] shrink-0 rounded-full border border-[#353535] bg-[#1a1a1a] grid place-items-center text-white"
            aria-label="More options"
          >
            <span className="grid grid-cols-2 gap-1">
              <span className="h-[3px] w-[3px] rounded-full bg-white" />
              <span className="h-[3px] w-[3px] rounded-full bg-white" />
              <span className="h-[3px] w-[3px] rounded-full bg-white" />
              <span className="h-[3px] w-[3px] rounded-full bg-white" />
            </span>
          </button>
          <button
            onClick={() => showComingSoonToast("featureLaunch")}
            className="flex-1 rounded-full bg-[#1a1a1a] border border-[#353535] text-white px-[18px] py-[10px] text-[16px] font-medium leading-[24px] tracking-[-0.096px]"
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
    <div id="profile-mobile-tabs" className="flex min-[1200px]:hidden flex-col w-[calc(100%+16px)] -mx-[8px] border-b border-[#252525] sticky top-[72px] z-40 bg-black">
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
            <img src={`/icons/tab-${tab.key}.svg`} alt={`${tab.key} tab`} className="w-[24px] h-[24px]" />
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
    <div className="md:hidden fixed left-1/2 -translate-x-1/2 bottom-[4px] z-40 rounded-full backdrop-blur-[6px] bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.1)] px-[9px] py-[8px] shadow-[0px_12px_12px_0px_rgba(0,0,0,0.12)] flex items-center overflow-clip w-[calc(100%-20px)] max-w-[600px] opacity-0">
      <div className="flex gap-[8px] items-center w-full">
        <button
          onClick={onFollowClick}
          className="flex-1 rounded-full bg-white text-black px-[18px] py-[10px] text-[16px] font-medium leading-[24px] tracking-[-0.096px]"
        >
          Follow
        </button>
        <button
          className="h-[44px] w-[43px] shrink-0 rounded-full border border-[#353535] bg-[#1a1a1a] grid place-items-center text-white"
          aria-label="More options"
        >
          <span className="grid grid-cols-2 gap-1">
            <span className="h-[3px] w-[3px] rounded-full bg-white" />
            <span className="h-[3px] w-[3px] rounded-full bg-white" />
            <span className="h-[3px] w-[3px] rounded-full bg-white" />
            <span className="h-[3px] w-[3px] rounded-full bg-white" />
          </span>
        </button>
        <button className="flex-1 rounded-full border border-[#353535] bg-[#1a1a1a] text-white px-[18px] py-[10px] text-[16px] font-medium leading-[24px] tracking-[-0.096px]">
          Connect
        </button>
      </div>
    </div>
  );
}
