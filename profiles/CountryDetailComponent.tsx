"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";

import { toLandingAssetUrl } from "@/lib/landing-assets";
import type { SampleProfile } from "@/profiles/profile-data";
import { ContextMenu } from "./ProfileComponent";
import { MoreOptionsButton } from "@/components/ui/MoreOptionsButton";
import { WaitlistPopup } from "@/components/ui/WaitlistPopup";

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

function toFlagAssetPath(flagCode?: string): string | undefined {
  if (!flagCode) return undefined;
  return `/flags/${flagCode.toUpperCase()}.svg`;
}

// ─── Lightbox Modal ──────────────────────────────────────────────────────────

function PhotoLightbox({
  items,
  activeIndex,
  onClose,
  onNext,
  onPrev,
  profileName,
  profileHandle,
  profileAvatar,
  profileFlagCode,
  countryName,
  countryCode,
  description,
  quote,
}: {
  items: string[];
  activeIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  profileName: string;
  profileHandle: string;
  profileAvatar: string;
  profileFlagCode?: string;
  countryName: string;
  countryCode: string;
  description?: string;
  quote?: string;
}) {
  const activeUrl = items[activeIndex];
  const totalCount = items.length;
  const displayIndex = activeIndex + 1;
  const avatarSrc = toLandingAssetUrl(profileAvatar);
  const profileFlagSrc = toFlagAssetPath(profileFlagCode);
  const countryFlagSrc = toFlagAssetPath(countryCode);

  return (
    <div
      className="fixed inset-0 z-50 flex bg-black/95"
      onClick={onClose}
    >
      {/* Left image panel */}
      <div
        className="relative flex flex-1 flex-col min-w-0"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-10 py-6 text-[15px] tracking-[-0.4px] text-[#a8a8a8]">
          <span>{`${displayIndex} of ${totalCount}`}</span>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(window.location.href).catch(() => {})}
            className="flex h-8 w-8 items-center justify-center text-[#a8a8a8] transition hover:text-white"
            aria-label="Copy link"
          >
            <span className="material-symbols-rounded text-[22px]">photo_library</span>
          </button>
        </div>

        {/* Image + nav arrows */}
        <div className="relative flex flex-1 min-h-0 pb-8">
          {/* Main media */}
          <div className="h-full w-full overflow-hidden bg-[#0a0a0a]">
            {isVideoAsset(activeUrl) ? (
              <video
                src={toLandingAssetUrl(activeUrl)}
                controls
                autoPlay
                className="h-full w-full object-contain"
              />
            ) : (
              <img
                src={toLandingAssetUrl(activeUrl)}
                alt={`${countryName} photo ${displayIndex}`}
                className="h-full w-full object-contain"
              />
            )}
          </div>

          {/* Prev arrow */}
          <button
            type="button"
            onClick={onPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-md transition hover:bg-[#f0f0f0]"
            aria-label="Previous photo"
          >
            <span className="material-symbols-rounded text-[28px]">chevron_left</span>
          </button>

          {/* Next arrow */}
          <button
            type="button"
            onClick={onNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-md transition hover:bg-[#f0f0f0]"
            aria-label="Next photo"
          >
            <span className="material-symbols-rounded text-[28px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Right sidebar */}
      <aside
        className="flex w-[360px] shrink-0 flex-col gap-8 overflow-y-auto bg-[#111111] p-8 text-white"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
      >
        {/* Avatar + close */}
        <div className="flex items-start justify-between">
          <div className="h-[72px] w-[72px] overflow-hidden rounded-2xl">
            <img src={avatarSrc} alt={profileName} className="h-full w-full object-cover" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center text-[#666] transition hover:text-white"
            aria-label="Close"
          >
            <span className="material-symbols-rounded text-[24px]">close</span>
          </button>
        </div>

        {/* Profile info */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[13px] text-[#888]">
            {profileFlagSrc ? (
              <img src={profileFlagSrc} alt="" className="h-3 w-[18px] rounded-[2px] object-cover" />
            ) : null}
            <span>{profileName}</span>
          </div>
          <p className="text-[20px] font-semibold tracking-[-0.5px] text-white">{profileHandle}</p>
        </div>

        {/* Follow / Connect / More */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="h-[38px] flex-1 rounded-full bg-white text-[14px] font-medium text-black transition hover:bg-[#e8e8e8]"
          >
            Follow
          </button>
          <button
            type="button"
            className="h-[38px] flex-1 rounded-full border border-[#2e2e2e] bg-[#1a1a1a] text-[14px] font-medium text-white transition hover:bg-[#222]"
          >
            Connect
          </button>
          <button
            type="button"
            className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border border-[#2e2e2e] bg-[#1a1a1a] text-white transition hover:bg-[#222]"
            aria-label="More options"
          >
            <span className="material-symbols-rounded text-[20px]">more_horiz</span>
          </button>
        </div>

        {/* Country + description */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            {countryFlagSrc ? (
              <img src={countryFlagSrc} alt="" className="h-[18px] w-[26px] rounded-[3px] object-cover shadow-sm" />
            ) : null}
            <p className="text-[22px] font-semibold tracking-[-0.5px] text-[#ededed]">
              {countryName}
            </p>
          </div>
          {description ? (
            <p className="text-[15px] leading-[1.6] tracking-[-0.3px] text-[#a0a0a0] line-clamp-6">{description}</p>
          ) : null}
          <button type="button" className="self-start text-[14px] tracking-[-0.3px] text-[#555] transition hover:text-[#888]">
            Read more
          </button>
        </div>

        {/* Divider + quote */}
        {quote ? (
          <div className="border-t border-[#222] pt-6">
            <p className="text-[15px] leading-[1.6] tracking-[-0.3px] text-[#a0a0a0]">{quote}</p>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

// ─── Custom Trigger for Media ────────────────────────────────────────────────
// ─── Main Component ──────────────────────────────────────────────────────────

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
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const didReadFromUrl = useRef(false);

  const photos = images.filter((url) => !isVideoAsset(url));
  const videos = images.filter((url) => isVideoAsset(url));

  const displayImages =
    activeTab === "photos" ? photos :
    activeTab === "videos" ? videos :
    images;

  // Close lightbox on ESC, navigate on arrow keys
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (lightboxIndex === null) return;
    if (e.key === "Escape") {
      setLightboxIndex(null);
    } else if (e.key === "ArrowRight") {
      setLightboxIndex((prev) => prev === null ? null : (prev + 1) % displayImages.length);
    } else if (e.key === "ArrowLeft") {
      setLightboxIndex((prev) => prev === null ? null : (prev - 1 + displayImages.length) % displayImages.length);
    }
  }, [lightboxIndex, displayImages.length]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setOpenContextMenuId(null);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenContextMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // When tab changes, close lightbox
  useEffect(() => {
    setLightboxIndex(null);
  }, [activeTab]);

  // Read from URL on mount (runs once)
  useEffect(() => {
    if (typeof window === "undefined" || didReadFromUrl.current) return;
    didReadFromUrl.current = true;
    const url = new URL(window.location.href);
    const encodedImage = url.searchParams.get("image");
    if (encodedImage && images.length > 0) {
      try {
        const imageUrl = decodeURIComponent(escape(atob(encodedImage)));
        // Search in the full images array regardless of active tab
        const indexInAll = images.indexOf(imageUrl);
        if (indexInAll !== -1) {
          // Ensure we're on the "all" tab so the index lines up with displayImages
          setActiveTab("all");
          setLightboxIndex(indexInAll);
          return;
        }
        // Fallback: open at index 0
        setLightboxIndex(0);
      } catch (e) {}
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync lightbox state to URL (only after initial read)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (lightboxIndex !== null && displayImages.length > 0) {
      const activeUrl = displayImages[lightboxIndex];
      const encodedUrl = btoa(unescape(encodeURIComponent(activeUrl)));
      if (url.searchParams.get("image") !== encodedUrl) {
        url.searchParams.set("image", encodedUrl);
        window.history.replaceState({}, "", url.toString());
      }
    } else if (didReadFromUrl.current && lightboxIndex === null) {
      if (url.searchParams.has("image")) {
        url.searchParams.delete("image");
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, [lightboxIndex, displayImages]);

  const [openContextMenuId, setOpenContextMenuId] = useState<string | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Distribute images across 3 columns for masonry layout
  const columns: { url: string; globalIndex: number }[][] = [[], [], []];
  displayImages.forEach((img, i) => {
    columns[i % 3].push({ url: img, globalIndex: i });
  });

  const tabs: { key: MediaTab; label: string }[] = [
    { key: "all", label: "All media" },
    { key: "photos", label: "Photos" },
    { key: "videos", label: "Videos" },
  ];

  const profileHandle = profile.handle.startsWith("@") ? profile.handle : `@${profile.handle}`;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 md:px-10 xl:px-24">
      {/* Lightbox */}
      {lightboxIndex !== null && (
        <PhotoLightbox
          items={displayImages}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((prev) => prev === null ? null : (prev + 1) % displayImages.length)}
          onPrev={() => setLightboxIndex((prev) => prev === null ? null : (prev - 1 + displayImages.length) % displayImages.length)}
          profileName={profile.name}
          profileHandle={profileHandle}
          profileAvatar={profile.images.avatar}
          profileFlagCode={profile.flagCode}
          countryName={countryName}
          countryCode={countryCode}
          description={profile.bio}
        />
      )}

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
              <MoreOptionsButton
                isOpen={showMenu}
                onClick={() => setShowMenu((prev) => !prev)}
                label="More options"
                size="sm"
                showOnHover={false}
                positioned={false}
              />
              {showMenu && (
                <ContextMenu
                  kind="country"
                  viewLabel="View country"
                  shareLabel="Share country"
                  viewHref={`/profiles/${profile.id}`}
                  showViewAction={false}
                  onShare={() => {
                    navigator.clipboard.writeText(window.location.href).catch(() => {});
                    setShowMenu(false);
                  }}
                  onClose={() => setShowMenu(false)}
                  menuRef={menuRef}
                />
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
                  {col.map(({ url: imgUrl, globalIndex }) => {
                    const isVideo = isVideoAsset(imgUrl);
                    return (
                      <div
                        key={globalIndex}
                        className="group relative"
                      >
                        <div
                          className="relative rounded-2xl overflow-hidden bg-[#151515] cursor-pointer"
                          onClick={() => setLightboxIndex(globalIndex)}
                        >
                          {isVideo ? (
                            <>
                              <video
                                src={toLandingAssetUrl(imgUrl)}
                                muted
                                playsInline
                                loop
                                preload="metadata"
                                className="w-full h-auto block pointer-events-none"
                              />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                <span className="text-white text-3xl drop-shadow-lg">▶</span>
                              </div>
                            </>
                          ) : (
                            <img
                              src={toLandingAssetUrl(imgUrl)}
                              alt={`${countryName} photo ${globalIndex + 1}`}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-auto block"
                            />
                          )}
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 pointer-events-none" />
                        </div>


                        <MoreOptionsButton
                          isOpen={openContextMenuId === `media-${globalIndex}`}
                          label={`Open menu for photo ${globalIndex + 1}`}
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpenContextMenuId(openContextMenuId === `media-${globalIndex}` ? null : `media-${globalIndex}`);
                          }}
                        />

                        {openContextMenuId === `media-${globalIndex}` ? (
                          <div
                            ref={contextMenuRef}
                            role="menu"
                            className="absolute right-3 bottom-14 z-30 w-[200px] rounded-2xl border border-[#2e2e2e] bg-[#1a1a1a] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.5)]"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                            }}
                          >
                            <div className="flex flex-col gap-4">
                              <button
                                type="button"
                                role="menuitem"
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  setOpenContextMenuId(null);
                                  setIsWaitlistOpen(true);
                                }}
                                className="flex w-full items-center gap-3 text-[15px] font-medium tracking-[-0.3px] text-white hover:text-[#d4d4d4] transition-colors"
                              >
                                <span className="material-symbols-rounded text-[22px]">favorite_border</span>
                                <span>Add to favorites</span>
                              </button>

                              <button
                                type="button"
                                role="menuitem"
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  setOpenContextMenuId(null);
                                }}
                                className="flex w-full items-center gap-3 text-[15px] font-medium tracking-[-0.3px] text-white hover:text-[#d4d4d4] transition-colors"
                              >
                                <span className="material-symbols-rounded text-[22px]">block</span>
                                <span>Report</span>
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        <WaitlistPopup open={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
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
