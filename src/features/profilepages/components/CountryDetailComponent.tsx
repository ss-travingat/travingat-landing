"use client";
import { MediaResolver } from "@/lib/media-resolver";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";

import { type SampleProfile } from "../data/profile-data";
import { ContextMenu } from "./ProfileComponent";
import { MediaLightbox } from "./MediaLightbox";
import ProfileFooter from "./ProfileFooter";
import { MoreOptionsButton } from "@/components/ui/MoreOptionsButton";
import { WaitlistPopup } from "@/components/ui/WaitlistPopup";
import LoadedImage from "@/components/ui/LoadedImage";
import { useMobileComingSoon } from "@/components/ui/MobileComingSoonToast";
import { COUNTRY_LIST } from "@/lib/countries";
import { useNavbarVisibility } from "./MobileProfile";

import { distributeMasonryColumns } from "@/lib/masonry-utils";

/* eslint-disable @next/next/no-img-element */

import { MobileCountryHeader } from "./MobileCountryHeader";
import { DesktopCountryHeader } from "./DesktopCountryHeader";

const STATIC_LAST_UPDATED_LABEL = "27 Dec 2025";

const COUNTRY_LIST_LOOKUP: Record<string, string> = Object.fromEntries(
  COUNTRY_LIST.map(c => [c.code.toUpperCase(), c.name])
);

type MediaTab = "all" | "photos" | "videos" | "about";

function isVideoAsset(url: string) {
  return /\.(mp4|mov|webm|m4v|3gp|3g2)$/i.test(url);
}

function toFlagAssetPath(flagCode?: string): string | undefined {
  if (!flagCode) return undefined;
  return `/flags/${flagCode.toUpperCase()}.svg`;
}

// ─── Main Component ─────────────────────────────────────────────────────────────

// ─── Lightbox Modal ──────────────────────────────────────────────────────────

function PhotoLightbox({
  items,
  activeIndex,
  onClose,
  onNext,
  onPrev,
  onSelectIndex,
  profileName,
  profileCountry,
  profileHandle,
  profileAvatar,
  profileFlagCode,
  countryName,
  countryCode,
  description,
  quote,
}: {
  items: Array<{ url: string; width?: number; height?: number }>;
  activeIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelectIndex: (index: number) => void;
  profileName: string;
  profileCountry?: string;
  profileHandle: string;
  profileAvatar: string;
  profileFlagCode?: string;
  countryName: string;
  countryCode: string;
  description?: string;
  quote?: string;
}) {
  const { showComingSoonToast } = useMobileComingSoon();
  const totalCount = items.length;
  const displayIndex = activeIndex + 1;
  const avatarSrc = MediaResolver.getBase(profileAvatar);
  const countryFlagSrc = toFlagAssetPath(countryCode);
  const profileFlagSrc = toFlagAssetPath(profileFlagCode);

  return (
    <MediaLightbox
      items={items.map((entry) => ({
        id: entry.url,
        url: entry.url,
        isVideo: isVideoAsset(entry.url),
      }))}
      activeIndex={activeIndex}
      onClose={onClose}
      onNext={onNext}
      onPrev={onPrev}
      onSelectIndex={onSelectIndex}
      sidebarContent={
        <aside
          className="flex w-[22.5rem] shrink-0 flex-col gap-8 overflow-y-auto bg-[#111111] p-8 text-white"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          {/* Avatar + close */}
          <div className="flex items-start justify-between">
            <div className="h-[4.5rem] w-[4.5rem] overflow-hidden rounded-2xl">
              <LoadedImage src={avatarSrc} thumbnailSrc={MediaResolver.getThumbnail(avatarSrc, 144)} alt={profileName} className="h-full w-full object-cover" />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center text-[#666] transition hover:text-white"
              aria-label="Close"
            >
              <span className="material-symbols-rounded text-[1.5rem]">close</span>
            </button>
          </div>

          {/* Profile info */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-[0.375rem]">
              {profileFlagSrc ? (
                <img src={profileFlagSrc} alt="" className="h-3 w-[1.125rem] rounded-[0.125rem] object-cover" />
              ) : null}
              <span className="text-[0.875rem] font-medium leading-[1.25rem] tracking-[-0.1px] text-[#A8A8A8]">{profileCountry || profileName}</span>
            </div>
            <p className="text-[1.25rem] font-semibold tracking-[-0.5px] text-white">{profileHandle}</p>
          </div>

          {/* Follow / Connect / More */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => showComingSoonToast("featureLaunch")}
              className="h-[2.375rem] flex-1 rounded-full bg-white text-[0.875rem] font-medium text-black transition hover:bg-[#e8e8e8]"
            >
              Follow
            </button>
            <button
              type="button"
              onClick={() => showComingSoonToast("featureLaunch")}
              className="h-[2.375rem] flex-1 rounded-full border border-[#2e2e2e] bg-[#1a1a1a] text-[0.875rem] font-medium text-white transition hover:bg-[#222]"
            >
              Connect
            </button>
            <button
              type="button"
              onClick={() => showComingSoonToast("featureLaunch")}
              className="flex h-[2.375rem] w-[2.375rem] shrink-0 items-center justify-center rounded-full border border-[#2e2e2e] bg-[#1a1a1a] text-white transition hover:bg-[#222]"
              aria-label="More options"
            >
              <span className="material-symbols-rounded text-[1.25rem]">more_horiz</span>
            </button>
          </div>

          {/* Country + description */}
          <div className="flex flex-col gap-[0.5rem]">
            <div className="flex items-center gap-[0.75rem]">
              {countryFlagSrc ? (
                <img src={countryFlagSrc} alt="" className="h-[1.3125rem] w-[2rem] rounded-[0.204375rem] object-cover shadow-sm" />
              ) : null}
              <p className="text-center font-display text-[1.5rem] font-semibold not-italic leading-[2rem] tracking-[-0.03125rem] text-white">
                {countryName}
              </p>
            </div>
            {description ? (
              <p className="text-[1rem] leading-[1.5rem] tracking-[-0.096px] font-normal text-[#dcdcdc] whitespace-pre-wrap">{description}</p>
            ) : null}
          </div>

          {/* Divider + quote */}
          {quote ? (
            <div className="border-t border-[#222] pt-6">
              <p className="text-[1rem] leading-[1.5rem] tracking-[-0.096px] font-normal text-[#dcdcdc] whitespace-pre-wrap">{quote}</p>
            </div>
          ) : null}
        </aside>
      }
    />
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
  images: Array<string | { url: string; width?: number; height?: number }>;
}) {
  const { showComingSoonToast } = useMobileComingSoon();
  const router = useRouter();


  const imageObjects = images.map((entry) => (typeof entry === "string" ? { url: entry } : entry));
  const countryName = COUNTRY_LIST_LOOKUP[countryCode] || countryCode;
  const [activeTab, setActiveTab] = useState<MediaTab>("all");
  const [showMenu, setShowMenu] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useNavbarVisibility(showMenu, 56);

  const handleTabChange = (tab: MediaTab) => {
    (window as any).__lastProgrammaticScrollTime = Date.now();
    (window as any).__isProgrammaticScroll = true;
    const scrollBefore = window.scrollY;
    setActiveTab(tab);

    setTimeout(() => {
      const isDesktop = window.innerWidth >= 768; // md breakpoint
      const sentinelId = isDesktop ? "desktop-tabs-sentinel" : "mobile-tabs-sentinel";
      const sentinelEl = document.getElementById(sentinelId);

      if (sentinelEl) {
        const rect = sentinelEl.getBoundingClientRect();
        const absoluteTop = rect.top + window.scrollY;

        let targetScrollY = 0;

        if (isDesktop) {
          let predictedTarget = absoluteTop - 0;
          if (predictedTarget > 100) {
            targetScrollY = predictedTarget;
          } else {
            targetScrollY = absoluteTop - 100;
          }
        } else {
          const navbarEl = document.getElementById("profile-mobile-navbar");
          const navbarVisualTop = navbarEl ? navbarEl.getBoundingClientRect().top : 0;
          targetScrollY = absoluteTop + 12 - 72 - navbarVisualTop;
        }

        if (scrollBefore > targetScrollY) {
          window.scrollTo({ top: targetScrollY, behavior: "instant" });
        }
      }

      setTimeout(() => {
        window.dispatchEvent(new Event("scroll"));
      }, 50);
    }, 0);
  };

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const didReadFromUrl = useRef(false);

  // Swipe gesture state
  const [swipeOffset, setSwipeOffset] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setSwipeOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
    if (touchStartX.current !== null && touchStartY.current !== null) {
      const distanceX = touchStartX.current - touchEndX.current;
      const distanceY = touchStartY.current - touchEndY.current;
      if (Math.abs(distanceX) > Math.abs(distanceY)) {
        setSwipeOffset(distanceX);
      }
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null && touchStartY.current !== null && touchEndY.current !== null) {
      const distanceX = touchStartX.current - touchEndX.current;
      const distanceY = touchStartY.current - touchEndY.current;
      const swipeThreshold = 50;

      if (Math.abs(distanceX) > Math.abs(distanceY) && Math.abs(distanceX) > swipeThreshold) {
        const tabsArr: MediaTab[] = ["all", "about"];
        const currentIndex = tabsArr.indexOf(activeTab);

        if (distanceX > 0) {
          if (currentIndex < tabsArr.length - 1) {
            const nextTab = tabsArr[currentIndex + 1];
            handleTabChange(nextTab);
          }
        } else {
          if (currentIndex > 0) {
            const prevTab = tabsArr[currentIndex - 1];
            handleTabChange(prevTab);
          }
        }
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
    touchEndX.current = null;
    touchEndY.current = null;
    setSwipeOffset(0);
  };

  const photos = imageObjects.filter((entry) => !isVideoAsset(entry.url));
  const videos = imageObjects.filter((entry) => isVideoAsset(entry.url));
  const countryImageObj = profile.countryImages?.find(c => c.countryCode.toUpperCase() === countryCode.toUpperCase());
  const aboutText = countryImageObj?.about;
  const updatedDateStr = countryImageObj?.updated_at || countryImageObj?.updatedAt;
  const updatedLabel = updatedDateStr
    ? new Date(updatedDateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace("Sept", "Sep")
    : STATIC_LAST_UPDATED_LABEL;

  const displayImages =
    activeTab === "photos" ? photos :
      activeTab === "videos" ? videos :
        imageObjects;

  const items = displayImages.map((entry, index) => ({ ...entry, globalIndex: index }));

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
    if (encodedImage && imageObjects.length > 0) {
      try {
        const imageUrl = decodeURIComponent(escape(atob(encodedImage)));
        // Search in the full images array regardless of active tab
        const indexInAll = imageObjects.findIndex((entry) => entry.url === imageUrl);
        if (indexInAll !== -1) {
          // Ensure we're on the "all" tab so the index lines up with displayImages
          setActiveTab("all");
          setLightboxIndex(indexInAll);
          return;
        }
        // Fallback: open at index 0
        setLightboxIndex(0);
      } catch (e) { }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync lightbox state to URL (only after initial read)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (lightboxIndex !== null && displayImages.length > 0) {
      const activeUrl = displayImages[lightboxIndex].url;
      const encodedUrl = btoa(unescape(encodeURIComponent(activeUrl)));
      if (url.searchParams.get("image") !== encodedUrl) {
        url.searchParams.set("image", encodedUrl);
        window.history.replaceState(null, "", url.pathname + url.search);
      }
    } else if (didReadFromUrl.current && lightboxIndex === null) {
      if (url.searchParams.has("image")) {
        url.searchParams.delete("image");
        window.history.replaceState(null, "", url.pathname + url.search);
      }
    }
  }, [lightboxIndex, displayImages]);

  const [openContextMenuId, setOpenContextMenuId] = useState<string | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const tabs: { key: string; label: string }[] = [
    { key: "all", label: "All media" },
    { key: "about", label: "About" },
  ];

  const profileHandle = profile.handle.startsWith("@") ? profile.handle : `@${profile.handle}`;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-[0.75rem] min-[50.625rem]:px-[2rem] min-[1200px]:px-[96px] relative">
      {/* Mobile Navbar */}
      <div id="profile-mobile-navbar" className="flex md:hidden fixed top-0 left-0 w-full z-[120] flex-col pointer-events-none">
        <div className="flex items-center justify-between px-[20px] h-[56px] bg-black shadow-[0_2px_0_0_#000] pointer-events-auto transition-transform duration-300">
          <button onClick={() => router.back()} className="text-white flex items-center justify-center p-2 -ml-2">
            <span className="material-symbols-rounded text-[1.75rem]">arrow_back</span>
          </button>
          <button onClick={() => showComingSoonToast()} className="text-white flex items-center justify-center p-2 -mr-2">
            <span className="material-symbols-rounded text-[1.75rem]">menu</span>
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <PhotoLightbox
          items={displayImages}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((prev) => prev === null ? null : (prev + 1) % displayImages.length)}
          onPrev={() => setLightboxIndex((prev) => prev === null ? null : (prev - 1 + displayImages.length) % displayImages.length)}
          onSelectIndex={setLightboxIndex}
          profileName={profile.name}
          profileCountry={profile.country}
          profileHandle={profileHandle}
          profileAvatar={typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url}
          profileFlagCode={profile.flagCode}
          countryName={countryName}
          countryCode={countryCode}
          description={profile.countryImages?.find((c) => c.countryCode.toUpperCase() === countryCode.toUpperCase())?.about}
        />
      )}

      <main className="w-full flex flex-col items-center gap-[1.25rem] md:gap-0 pb-28 md:pb-[100px] pt-[56px] md:pt-0">
        
        <MobileCountryHeader 
          countryCode={countryCode} 
          countryName={countryName} 
          profile={profile} 
          updatedLabel={updatedLabel} 
          menuRef={menuRef} 
          showMenu={showMenu} 
          setShowMenu={setShowMenu} 
        />
        
        <DesktopCountryHeader 
          countryCode={countryCode} 
          countryName={countryName} 
          profile={profile} 
          updatedLabel={updatedLabel} 
          menuRef={menuRef} 
          showMenu={showMenu} 
          setShowMenu={setShowMenu} 
        />

        {/* Tabs + content */}
        <div className="w-full flex flex-col items-center">
          {/* Desktop Tab pills */}
          <div id="desktop-tabs-sentinel" className="w-full h-0 hidden md:block" />
          <div className="hidden md:flex items-center justify-center gap-[0.5rem] flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => handleTabChange(tab.key as MediaTab)}
                className={`w-[7.5rem] rounded-[62.4375rem] px-[1.5rem] py-[0.5rem] text-[1rem] leading-[1.5rem] tracking-[-0.096px] transition ${activeTab === tab.key
                  ? "bg-[#1e1e1e] border border-white text-white font-medium"
                  : "bg-[#161616] border border-transparent text-[#bdbdbd] font-normal"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Mobile Tab icons */}
          {(() => {
            const mobileTabsArr = ["all", "about"] as const;
            const activeIndex = mobileTabsArr.indexOf(activeTab as any);

            let offsetPercent = 0;
            if (swipeOffset !== 0 && typeof window !== "undefined") {
              const fraction = swipeOffset / (window.innerWidth / mobileTabsArr.length);
              offsetPercent = Math.max(-1, Math.min(1, fraction)) * 100;
              if (activeIndex === 0 && offsetPercent < 0) offsetPercent = 0;
              if (activeIndex === mobileTabsArr.length - 1 && offsetPercent > 0) offsetPercent = 0;
            }
            const finalTranslate = activeIndex * 100 + offsetPercent;
            const isDragging = swipeOffset !== 0;

            return (
              <>
                <div id="mobile-tabs-sentinel" className="w-full h-0 pointer-events-none md:hidden" />
                <div id="profile-mobile-tabs" className="flex md:hidden items-center justify-between w-full border-b border-[#222] sticky top-[56px] z-[90] bg-black">
                  {[
                    { key: "all", icon: "auto_awesome_mosaic" },
                    { key: "about", icon: "chat_info" },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => {
                        handleTabChange(tab.key as MediaTab);
                      }}
                      className={`relative flex flex-col flex-1 items-center justify-center py-[1rem] transition-colors ${activeTab === tab.key ? "text-white" : "text-[#7c7c7c]"
                        }`}
                    >
                      <span className="material-symbols-rounded text-[1.5rem]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>{tab.icon}</span>
                    </button>
                  ))}
                  <div
                    className="absolute bottom-[-1px] left-0 pointer-events-none"
                    style={{
                      width: `${100 / mobileTabsArr.length}%`,
                      transform: `translateX(${finalTranslate}%)`,
                      transition: isDragging ? "none" : "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <div className="w-full h-[1px] bg-white" />
                  </div>
                </div>
              </>
            );
          })()}

          {/* Touch container for content */}
          <div
            className="w-full flex flex-col flex-1 min-h-screen mt-[0.75rem] md:mt-[48px]"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Masonry grid or About */}
            {activeTab === "about" ? (
              <div className="flex flex-col items-start gap-6 w-full max-w-[50rem] mx-auto text-left mt-8 mb-20 px-4 md:px-0">
                <h2 className="text-[1.5rem] font-semibold text-white">About {countryName}</h2>
                <p className="text-[1rem] text-[#a8a8a8] leading-relaxed whitespace-pre-wrap">
                  {aboutText || "No information provided yet."}
                </p>
              </div>
            ) : displayImages.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <p className="text-[#a8a8a8] text-[1rem]">No media in this category yet.</p>
              </div>
            ) : (
              <div className="w-full">
                {/* Desktop: 4 explicit flex columns distributed by height — matches Figma layout */}
                <div className="hidden lg:flex w-full gap-[0.5rem] xl:gap-[0.75rem]">
                  {distributeMasonryColumns(items, 4, (item) => (item.height && item.width ? item.height / item.width : 1)).map((columnItems, colIdx) => (
                    <div key={colIdx} className="flex flex-col gap-[0.5rem] xl:gap-[0.75rem] flex-1 min-w-0">
                      {columnItems.map(({ url: imgUrl, globalIndex }) => {
                          const isVideo = isVideoAsset(imgUrl);
                          return (
                            <div key={globalIndex} className="group relative">
                              <div
                                className="relative rounded-2xl overflow-hidden bg-[#151515] cursor-pointer"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setLightboxIndex(globalIndex);
                                }}
                              >
                                {isVideo ? (
                                  <>
                                    <video data-data-original-src={MediaResolver.getBase(imgUrl)} src={MediaResolver.getOptimized(MediaResolver.getBase(imgUrl))}
                                      muted
                                      playsInline
                                      loop
                                      preload="metadata"
                                      className="w-full h-full object-cover block pointer-events-none"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                      <span className="text-white text-3xl drop-shadow-lg">▶</span>
                                    </div>
                                  </>
                                ) : (
                                  <LoadedImage
                                    originalSrc={MediaResolver.getBase(imgUrl)}
                                    src={MediaResolver.getThumbnail(MediaResolver.getBase(imgUrl), 720)}
                                    thumbnailSrc={MediaResolver.getThumbnail(MediaResolver.getBase(imgUrl), 144)}
                                    alt={`${countryName} photo ${globalIndex + 1}`}
                                    priority={globalIndex < 4}
                                    className="w-full h-full object-cover block"
                                    containerClassName="w-full h-full relative"
                                    skeletonClassName="absolute inset-0 w-full h-full bg-[#1a1a1a]"
                                  />
                                )}
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
                                  className="absolute right-3 bottom-14 z-30 w-[12.5rem] rounded-2xl border border-[#2e2e2e] bg-[#1a1a1a] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.5)]"
                                  onClick={(event) => { event.preventDefault(); event.stopPropagation(); }}
                                >
                                  <div className="flex flex-col gap-4">
                                    <button
                                      type="button"
                                      role="menuitem"
                                      onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        setOpenContextMenuId(null);
                                        showComingSoonToast("featureLaunch");
                                      }}
                                      className="flex w-full items-center gap-3 text-[0.9375rem] font-medium tracking-[-0.3px] text-white hover:text-[#d4d4d4] transition-colors"
                                    >
                                      <span className="material-symbols-rounded text-[1.375rem]">favorite_border</span>
                                      <span>Add to favorites</span>
                                    </button>
                                    <button
                                      type="button"
                                      role="menuitem"
                                      onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        showComingSoonToast("featureLaunch");
                                        setOpenContextMenuId(null);
                                      }}
                                      className="flex w-full items-center gap-3 text-[0.9375rem] font-medium tracking-[-0.3px] text-white hover:text-[#d4d4d4] transition-colors"
                                    >
                                      <span className="material-symbols-rounded text-[1.375rem]">block</span>
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
                {/* Mobile/tablet: 2 explicit flex columns distributed by height */}
                <div className="flex lg:hidden w-full gap-[0.375rem]">
                  {distributeMasonryColumns(items, 2, (item) => (item.height && item.width ? item.height / item.width : 1)).map((columnItems, colIdx) => (
                    <div key={colIdx} className="flex flex-col gap-[0.375rem] flex-1 min-w-0">
                      {columnItems.map(({ url: imgUrl, globalIndex }) => {
                          const isVideo = isVideoAsset(imgUrl);
                          return (
                            <div key={globalIndex} className="group relative w-full">
                              <div
                                className="relative rounded-2xl overflow-hidden bg-[#151515] cursor-pointer"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  showComingSoonToast("desktopOnly");
                                }}
                              >
                                {isVideo ? (
                                  <>
                                    <video
                                      data-original-src={MediaResolver.getBase(imgUrl)} src={MediaResolver.getOptimized(MediaResolver.getBase(imgUrl))}
                                      muted
                                      playsInline
                                      loop
                                      preload="metadata"
                                      className="w-full h-full object-cover block pointer-events-none"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                      <span className="text-white text-3xl drop-shadow-lg">▶</span>
                                    </div>
                                  </>
                                ) : (
                                  <LoadedImage
                                    originalSrc={MediaResolver.getBase(imgUrl)}
                                    src={MediaResolver.getThumbnail(MediaResolver.getBase(imgUrl), 720)}
                                    thumbnailSrc={MediaResolver.getThumbnail(MediaResolver.getBase(imgUrl), 144)}
                                    alt={`${countryName} photo ${globalIndex + 1}`}
                                    priority={globalIndex < 4}
                                    className="w-full h-full object-cover block"
                                    containerClassName="w-full h-full relative"
                                    skeletonClassName="absolute inset-0 w-full h-full bg-[#1a1a1a]"
                                  />
                                )}
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
                                  className="absolute right-3 bottom-14 z-30 w-[12.5rem] rounded-2xl border border-[#2e2e2e] bg-[#1a1a1a] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.5)]"
                                  onClick={(event) => { event.preventDefault(); event.stopPropagation(); }}
                                >
                                  <div className="flex flex-col gap-4">
                                    <button
                                      type="button"
                                      role="menuitem"
                                      onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        setOpenContextMenuId(null);
                                        showComingSoonToast("featureLaunch");
                                      }}
                                      className="flex w-full items-center gap-3 text-[0.9375rem] font-medium tracking-[-0.3px] text-white hover:text-[#d4d4d4] transition-colors"
                                    >
                                      <span className="material-symbols-rounded text-[1.375rem]">favorite_border</span>
                                      <span>Add to favorites</span>
                                    </button>
                                    <button
                                      type="button"
                                      role="menuitem"
                                      onClick={(event) => { event.preventDefault(); event.stopPropagation(); setOpenContextMenuId(null); }}
                                      className="flex w-full items-center gap-3 text-[0.9375rem] font-medium tracking-[-0.3px] text-white hover:text-[#d4d4d4] transition-colors"
                                    >
                                      <span className="material-symbols-rounded text-[1.375rem]">block</span>
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
              </div>
            )}
          </div>
        </div>

        <WaitlistPopup open={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
      </main>

      {/* Footer */}
      <ProfileFooter />
    </div>
  );
}
