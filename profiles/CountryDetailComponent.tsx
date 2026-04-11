"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

import { toLandingAssetUrl } from "@/lib/landing-assets";
import type { SampleProfile } from "@/profiles/profile-data";

/* eslint-disable @next/next/no-img-element */

const COUNTRY_LIST_LOOKUP: Record<string, string> = {
  AF: "Afghanistan", AL: "Albania", DZ: "Algeria", AR: "Argentina", AM: "Armenia",
  AU: "Australia", AT: "Austria", AZ: "Azerbaijan", BS: "Bahamas", BD: "Bangladesh",
  BE: "Belgium", BZ: "Belize", BO: "Bolivia", BA: "Bosnia and Herzegovina", BR: "Brazil",
  BG: "Bulgaria", KH: "Cambodia", CA: "Canada", CL: "Chile", CN: "China",
  CO: "Colombia", CR: "Costa Rica", HR: "Croatia", CU: "Cuba", CY: "Cyprus",
  CZ: "Czech Republic", DK: "Denmark", DO: "Dominican Republic", EC: "Ecuador", EG: "Egypt",
  SV: "El Salvador", EE: "Estonia", ET: "Ethiopia", FI: "Finland", FR: "France",
  GE: "Georgia", DE: "Germany", GH: "Ghana", GR: "Greece", GT: "Guatemala",
  HT: "Haiti", HN: "Honduras", HK: "Hong Kong", HU: "Hungary", IS: "Iceland",
  IN: "India", ID: "Indonesia", IR: "Iran", IQ: "Iraq", IE: "Ireland",
  IL: "Israel", IT: "Italy", JM: "Jamaica", JP: "Japan", JO: "Jordan",
  KZ: "Kazakhstan", KE: "Kenya", KR: "South Korea", KW: "Kuwait", LA: "Laos",
  LV: "Latvia", LB: "Lebanon", LT: "Lithuania", LU: "Luxembourg", MY: "Malaysia",
  MV: "Maldives", MT: "Malta", MX: "Mexico", MA: "Morocco", MM: "Myanmar",
  NP: "Nepal", NL: "Netherlands", NZ: "New Zealand", NI: "Nicaragua", NG: "Nigeria",
  NO: "Norway", OM: "Oman", PK: "Pakistan", PA: "Panama", PY: "Paraguay",
  PE: "Peru", PH: "Philippines", PL: "Poland", PT: "Portugal", QA: "Qatar",
  RO: "Romania", RU: "Russia", SA: "Saudi Arabia", RS: "Serbia", SG: "Singapore",
  SK: "Slovakia", SI: "Slovenia", ZA: "South Africa", ES: "Spain", LK: "Sri Lanka",
  SE: "Sweden", CH: "Switzerland", TW: "Taiwan", TZ: "Tanzania", TH: "Thailand",
  TR: "Turkey", UA: "Ukraine", AE: "United Arab Emirates", GB: "United Kingdom",
  US: "United States", UY: "Uruguay", UZ: "Uzbekistan", VE: "Venezuela", VN: "Vietnam",
};

type MediaTab = "all" | "photos" | "videos";

function isVideoAsset(url: string) {
  return /\.(mp4|mov|webm|m4v|3gp|3g2)$/i.test(url);
}

export default function CountryDetailComponent({
  profile,
  countryCode,
  images,
}: {
  profile: SampleProfile;
  countryCode: string;
  images: string[];
}) {
  const countryName = COUNTRY_LIST_LOOKUP[countryCode] || countryCode;
  const [activeTab, setActiveTab] = useState<MediaTab>("all");
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const photos = images.filter((url) => !isVideoAsset(url));
  const videos = images.filter((url) => isVideoAsset(url));

  const displayImages =
    activeTab === "photos" ? photos :
    activeTab === "videos" ? videos :
    images;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Distribute images across 3 columns for masonry layout
  const columns: string[][] = [[], [], []];
  displayImages.forEach((img, i) => {
    columns[i % 3].push(img);
  });

  const tabs: { key: MediaTab; label: string }[] = [
    { key: "all", label: "All media" },
    { key: "photos", label: "Photos" },
    { key: "videos", label: "Videos" },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 md:px-10 xl:px-24">
      {/* Header */}
      <header className="relative w-full max-w-372 flex items-center justify-between py-6 md:py-8">
        <Link href="/" className="ds-font-logo text-[28px] font-normal text-white tracking-[-0.41px] leading-normal">
          travingat
        </Link>

        <div className="flex items-center gap-3 md:gap-5">
          <button className="text-[#e3e3e3] hover:text-white transition" aria-label="Favorites">
            <span className="material-symbols-rounded text-[22px]">favorite</span>
          </button>
          <button className="hidden md:inline-flex text-[#e3e3e3] hover:text-white transition" aria-label="Notifications">
            <span className="material-symbols-rounded text-[22px]">notifications</span>
          </button>

          <Link
            href={`/profiles/${profile.id}`}
            className="flex items-center gap-2 rounded-xl border border-black-600 bg-[#0b0b0b] px-3 py-2"
          >
            <span className="material-symbols-rounded text-[#e3e3e3] text-[21px]">dehaze</span>
            <div className="hidden md:block h-7 w-7 overflow-hidden rounded-lg">
              <img src={toLandingAssetUrl(profile.images.avatar)} alt="Profile" className="h-full w-full object-cover" />
            </div>
          </Link>
        </div>
      </header>

      {/* Country Info */}
      <main className="w-full max-w-372 flex flex-col items-center gap-12 pb-28 md:pb-20">
        <div className="flex flex-col items-center gap-5 w-full max-w-150">
          <div className="flex flex-col items-center gap-4">
            <div className="h-15.5 w-25 overflow-hidden">
              <img
                src={`/flags/${countryCode}.svg`}
                alt={`${countryName} flag`}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="ds-font-display text-[48px] leading-[1.2] tracking-[-0.41px] font-bold text-white text-center">
              {countryName}
            </h1>
          </div>

          {/* Meta info row */}
          <div className="flex items-center gap-4 text-[16px] tracking-[-0.5px]">
            <div className="flex items-center gap-2">
              <span className="text-[#505050]">By</span>
              <div className="h-5 w-5 overflow-hidden rounded-full">
                <img src={toLandingAssetUrl(profile.images.avatar)} alt={profile.name} className="w-full h-full object-cover" />
              </div>
              <Link href={`/profiles/${profile.id}`} className="text-white hover:underline">
                {profile.handle}
              </Link>
            </div>
            <span className="text-[#505050]">|</span>
            <div className="flex items-center gap-2">
              <span className="text-[#505050]">Last Updated</span>
              <span className="text-[#a8a8a8]">
                {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </span>
            </div>
            <span className="text-[#505050]">|</span>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu((prev) => !prev)}
                className="flex items-center gap-1.75 rounded-full border border-[#363636] bg-[#181818] px-3 py-2"
                aria-label="More options"
              >
                <span className="block w-0.75 h-0.75 rounded-full bg-[#a8a8a8]" />
                <span className="block w-0.75 h-0.75 rounded-full bg-[#a8a8a8]" />
                <span className="block w-0.75 h-0.75 rounded-full bg-[#a8a8a8]" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-2 z-20 w-40 rounded-xl border border-black-300 bg-[#101010] p-1.5 shadow-lg">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href).catch(() => {});
                      setShowMenu(false);
                    }}
                    className="w-full text-left rounded-lg px-3 py-2 text-sm text-[#d8d8d8] hover:bg-[#1b1b1b]"
                  >
                    Copy link
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs + content */}
        <div className="w-full flex flex-col gap-10">
          {/* Tab pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full px-6 py-2.5 text-[16px] leading-normal tracking-[-0.408px] transition ${
                  activeTab === tab.key
                    ? "bg-[#1d1d1d] border-[0.6px] border-white text-white font-medium"
                    : "bg-black-800 border border-transparent text-[#a8a8a8] font-normal"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-black-300" />

          {/* Masonry grid */}
          {displayImages.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <p className="text-[#a8a8a8] text-[16px]">No media in this category yet.</p>
            </div>
          ) : (
            <div className="flex gap-5 w-full pb-25">
              {columns.map((col, colIdx) => (
                <div key={colIdx} className="flex-1 flex flex-col gap-5">
                  {col.map((imgUrl, imgIdx) => {
                    const isVideo = isVideoAsset(imgUrl);
                    // Vary heights for visual interest
                    const heights = [362, 278, 289, 392, 237, 255, 311, 406, 262, 249, 276, 411, 230, 405, 236, 418];
                    const height = heights[(colIdx * 6 + imgIdx) % heights.length];
                    return (
                      <div
                        key={imgIdx}
                        className="group relative rounded-2xl overflow-hidden bg-[#151515]"
                        style={{ height: `${height}px` }}
                      >
                        {isVideo ? (
                          <>
                            <video
                              src={toLandingAssetUrl(imgUrl)}
                              muted
                              playsInline
                              loop
                              preload="metadata"
                              className="absolute inset-0 w-full h-full object-cover"
                              onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                              onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                              onClick={(e) => { const v = e.currentTarget; if (v.paused) v.play().catch(() => {}); else { v.pause(); v.currentTime = 0; } }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                              <span className="text-white text-3xl drop-shadow-lg">▶</span>
                            </div>
                          </>
                        ) : (
                          <img
                            src={toLandingAssetUrl(imgUrl)}
                            alt={`${countryName} photo ${colIdx * col.length + imgIdx + 1}`}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-372 py-8 flex items-center justify-center gap-8 text-[12px] text-white-500 tracking-[-0.408px]">
        <a href="#" className="hover:text-white transition">Help</a>
        <a href="#" className="hover:text-white transition">About</a>
        <a href="#" className="hover:text-white transition">Careers</a>
        <Link href="/blog" className="hover:text-white transition">Blog</Link>
        <a href="#" className="hover:text-white transition">Terms of Service</a>
        <a href="#" className="hover:text-white transition">Privacy Policy</a>
      </footer>
    </div>
  );
}
