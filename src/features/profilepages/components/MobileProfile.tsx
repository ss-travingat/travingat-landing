"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toLandingAssetUrl } from "@/lib/landing-assets";
import { type SampleProfile } from "../data/profile-data";

// Shared Types
type TabKey = "all" | "countries" | "collections" | "about";

function toFlagAssetPath(flagCode?: string): string | undefined {
  if (!flagCode) return undefined;
  return `/flags/${flagCode.toUpperCase()}.svg`;
}

// ==========================================
// MOBILE NAVBAR COMPONENT
// ==========================================
export function MobileProfileNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div className="fixed top-0 left-0 w-full z-50 flex flex-col pointer-events-none">
      <div className={`flex items-center justify-between px-[28px] py-[16px] pointer-events-auto transition-colors duration-300 ${isScrolled ? "bg-black" : "bg-gradient-to-b from-black/60 to-transparent"}`}>
        <Link href="/" className="font-['Righteous'] text-[23.14px] text-white tracking-[-0.41px] leading-normal">
          travingat
        </Link>
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="relative flex h-9 w-9 items-center justify-center rounded-xl"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`absolute h-0.5 w-5 rounded-full bg-[#e3e3e3] transition-all duration-300 ${menuOpen ? "translate-y-0 rotate-45" : "-translate-y-1.5"
              }`}
          />
          <span
            className={`absolute h-0.5 w-5 rounded-full bg-[#e3e3e3] transition-all duration-300 ${menuOpen ? "opacity-0" : "opacity-100"
              }`}
          />
          <span
            className={`absolute h-0.5 w-5 rounded-full bg-[#e3e3e3] transition-all duration-300 ${menuOpen ? "translate-y-0 -rotate-45" : "translate-y-1.5"
              }`}
          />
        </button>
      </div>

      <nav
        className={`px-[12px] pointer-events-auto overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-[500px] pb-5 opacity-100" : "max-h-0 pb-0 opacity-0"
          }`}
      >
        <div
          className={`rounded-2xl border border-black-400 bg-[#101010]/95 backdrop-blur-md p-2 shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-transform duration-300 ${menuOpen ? "translate-y-0" : "-translate-y-2"
            }`}
        >
          <Link
            href="/newprofiles"
            onClick={() => setMenuOpen(false)}
            className="block rounded-xl px-3 py-2 text-sm text-[#d8d8d8] hover:bg-[#1b1b1b]"
          >
            Featured Profiles
          </Link>
          <Link
            href="/templates"
            onClick={() => setMenuOpen(false)}
            className="block rounded-xl px-3 py-2 text-sm text-[#d8d8d8] hover:bg-[#1b1b1b]"
          >
            Templates
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMenuOpen(false)}
            className="block rounded-xl px-3 py-2 text-sm text-[#d8d8d8] hover:bg-[#1b1b1b]"
          >
            Pricing
          </Link>
          <Link href="/blog" onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-2 text-sm text-[#d8d8d8] hover:bg-[#1b1b1b]">
            Blog
          </Link>
          <a
            href="/#join"
            onClick={(e) => scrollToSection(e, "join")}
            className="block rounded-xl px-3 py-2 text-sm text-[#d8d8d8] hover:bg-[#1b1b1b]"
          >
            Join now
          </a>
        </div>
      </nav>
    </div>
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
  return (
    <section className="min-[811px]:hidden space-y-[12px] flex flex-col items-center w-full">
      <div className="flex flex-col items-center gap-[20px] rounded-[24px] w-full relative">
        <MobileProfileNavbar />
        <div className="w-full flex flex-col items-center">
          <div className="w-full aspect-[377/248] -mb-[36px] rounded-2xl overflow-hidden bg-[#151515]">
            <img src={toLandingAssetUrl(profile.images.cover)} alt="Profile cover" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10 mx-auto h-20 w-20 rounded-2xl border-4 border-black overflow-hidden bg-[#151515]">
            <img src={toLandingAssetUrl(profile.images.avatar)} alt="Profile avatar" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-[8px] w-full">
          <div className="flex items-center justify-center gap-1.5 text-[#696969] text-[14px] leading-[20px] tracking-[-0.5px]">
            {profileFlagSrc ? (
              <img
                src={profileFlagSrc}
                alt={`${basedIn} flag`}
                className="h-[10px] w-[15px] rounded-[2px] object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <span>{profileFlagCode}</span>
            )}
            <span>{basedIn}</span>
          </div>
          <h1 className="text-white text-[20px] leading-normal tracking-[-0.41px] font-semibold text-center w-full">{displayName}</h1>
          <p className="text-[#a8a8a8] text-[14px] leading-normal tracking-[-0.5px] text-center w-full">{handle}</p>
        </div>

        <div className="flex flex-wrap items-start justify-center gap-[4px] px-[6px] w-full">
          {headerFlagCodes.map((code, index) => (
            <img
              key={`${code}-${index}`}
              src={toFlagAssetPath(code) || ""}
              alt={`${code} flag`}
              className="h-[17px] w-[26px] rounded-[2px] object-cover shrink-0"
              loading="lazy"
              decoding="async"
            />
          ))}
          {flagOverflowCount > 0 && (
            <div className="flex h-[17px] w-[26px] shrink-0 items-center justify-center overflow-hidden rounded-[2px] bg-white">
              <span className="font-medium text-violet-600 text-[10px] text-center tracking-[-0.408px] whitespace-nowrap">
                +{flagOverflowCount}
              </span>
            </div>
          )}
        </div>

        {/* Mobile Stats Container */}
        <div className="bg-[#111] border-0 border-[#1e1e1e] flex items-center justify-center gap-[20px] rounded-[12px] w-full pt-[18px] pb-[20px] px-[20px]">
          <div className="flex flex-1 flex-col items-center justify-center gap-[2px]">
            <p className="ds-font-display text-[24px] font-semibold leading-[32px] tracking-[-0.5px] text-white">
              {profile.countries}
            </p>
            <p className="text-[14px] font-normal leading-[20px] tracking-[-0.084px] text-[#989898]">
              Countries
            </p>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-[2px]">
            <p className="ds-font-display text-[24px] font-semibold leading-[32px] tracking-[-0.5px] text-white">
              {profile.media}
            </p>
            <p className="text-[14px] font-normal leading-[20px] tracking-[-0.084px] text-[#989898]">
              All media
            </p>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-[2px]">
            <p className="ds-font-display text-[24px] font-semibold leading-[32px] tracking-[-0.5px] text-white">
              {profile.collections}
            </p>
            <p className="text-[14px] font-normal leading-[20px] tracking-[-0.084px] text-[#989898]">
              Collections
            </p>
          </div>
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
}

export function MobileTabs({ activeTab, setActiveTab }: MobileTabsProps) {
  const mobileTabs: { key: TabKey; icon: string }[] = [
    { key: "all", icon: "photo_library" },
    { key: "countries", icon: "public" },
    { key: "collections", icon: "folder" },
    { key: "about", icon: "person" },
  ];
  const activeIndex = mobileTabs.findIndex((t) => t.key === activeTab);

  return (
    <div className="flex min-[811px]:hidden flex-col w-full border-b border-black-400 relative">
      <div className="flex items-center w-full">
        {mobileTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              navigator.vibrate?.(8);
              setActiveTab(tab.key);
            }}
            className={`flex-1 flex items-center justify-center px-6 py-4 transition-colors duration-200 ${activeTab === tab.key ? "text-white" : "text-[#666]"
              }`}
          >
            <span className="material-symbols-rounded text-[24px]">{tab.icon}</span>
          </button>
        ))}
      </div>
      {/* Sliding underline */}
      <div
        className="absolute bottom-0 h-0.5 bg-white rounded-full"
        style={{
          width: `${100 / mobileTabs.length}%`,
          transform: `translateX(${activeIndex * 100}%)`,
          transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
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
    <div className="md:hidden fixed left-1/2 -translate-x-1/2 bottom-[25px] z-40 rounded-full backdrop-blur-[6px] bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.1)] px-[9px] py-[8px] shadow-[0px_12px_12px_0px_rgba(0,0,0,0.12)] flex items-center overflow-clip w-[calc(100%-20px)] max-w-[600px]">
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
