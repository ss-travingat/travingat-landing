"use client";
import { MediaResolver } from "@/lib/media-resolver";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";

import { sampleProfiles, type SampleProfile } from "../data/profile-data";
import { ContextMenu } from "./ProfileComponent";
import { MediaLightbox } from "./MediaLightbox";
import ProfileFooter from "./ProfileFooter";
import { MoreOptionsButton } from "@/components/ui/MoreOptionsButton";
import { Tooltip, TooltipProvider } from "@/components/ui/Tooltip";
import { CountriesPopup } from "@/components/ui/CountriesPopup";
import { DesktopCountriesPopup } from "@/components/ui/DesktopCountriesPopup";
import { COUNTRY_LIST } from "@/lib/countries";
import LoadedImage from "@/components/ui/LoadedImage";
import { useMobileComingSoon } from "@/components/ui/MobileComingSoonToast";
import { useNavbarVisibility } from "./MobileProfile";
import { distributeMasonryColumns } from "@/lib/masonry-utils";

/* eslint-disable @next/next/no-img-element */

const STATIC_LAST_UPDATED_LABEL = "27 Dec 2025";

type MediaTab = "all" | "photos" | "videos" | "about";

function isVideoAsset(url: string) {
  return /\.(mp4|mov|webm|m4v|3gp|3g2)$/i.test(url);
}

function CollectionLightbox({
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
  collectionTitle,
  description,
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
  collectionTitle: string;
  description?: string;
}) {
  const totalCount = items.length;
  const displayIndex = activeIndex + 1;
  const avatarSrc = MediaResolver.getBase(profileAvatar);

  const { showComingSoonToast } = useMobileComingSoon();

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
          <div className="flex items-start justify-between">
            <div className="h-[4.5rem] w-[4.5rem] overflow-hidden rounded-2xl">
              <LoadedImage src={avatarSrc} thumbnailSrc={MediaResolver.getThumbnail(avatarSrc, 720)} alt={profileName} className="h-full w-full object-cover" />
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

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-[0.375rem]">
              <span className="text-[0.875rem] font-medium leading-[1.25rem] tracking-[-0.1px] text-[#A8A8A8]">{profileCountry || profileName}</span>
            </div>
            <p className="text-[1.25rem] font-semibold tracking-[-0.5px] text-white">{profileHandle}</p>
          </div>

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

          <div className="flex flex-col gap-4">
            <p className="text-[1.375rem] font-semibold tracking-[-0.5px] text-[#ededed]">
              {collectionTitle}
            </p>
            {description ? (
              <p className="text-[0.9375rem] leading-[1.6] tracking-[-0.3px] text-[#a0a0a0]">{description}</p>
            ) : null}
          </div>
        </aside>
      }
    />
  );
}

export default function CollectionDetailComponent({
  profile,
  title,
  images,
  collectionCountryCodes = [],
}: {
  profile: SampleProfile;
  title: string;
  images: Array<string | { url: string; width?: number; height?: number }>;
  collectionCountryCodes?: string[];
}) {
  const router = useRouter();
  const { showComingSoonToast } = useMobileComingSoon();
  const imageObjects = images.map((entry) => (typeof entry === "string" ? { url: entry } : entry));
  const [activeTab, setActiveTab] = useState<MediaTab>("all");
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [prevActiveTab, setPrevActiveTab] = useState<MediaTab>("all");

  if (activeTab !== prevActiveTab) {
    setPrevActiveTab(activeTab);
    setLightboxIndex(null);
  }
  const didReadFromUrl = useRef(false);

  // Swipe gesture state
  const [swipeOffset, setSwipeOffset] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  useNavbarVisibility(showMenu);

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
    }, 10);
  };

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
        const tabsArr: MediaTab[] = ["all", "photos", "videos", "about"];
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
    setSwipeOffset(0);
    touchStartX.current = null;
    touchStartY.current = null;
    touchEndX.current = null;
    touchEndY.current = null;
  };

  const photos = imageObjects.filter((entry) => !isVideoAsset(entry.url));
  const videos = imageObjects.filter((entry) => isVideoAsset(entry.url));
  const collectionObj = profile.collectionImages?.find(c => c.title === title);
  const aboutText = collectionObj?.about;
  const updatedDateStr = collectionObj?.updated_at || collectionObj?.updatedAt;
  const updatedLabel = updatedDateStr
    ? new Date(updatedDateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : STATIC_LAST_UPDATED_LABEL;

  const displayImages =
    activeTab === "photos" ? photos :
      activeTab === "videos" ? videos :
        imageObjects;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  const items = displayImages.map((entry, index) => ({ ...entry, globalIndex: index }));

  useEffect(() => {
    if (typeof window === "undefined" || didReadFromUrl.current) return;
    didReadFromUrl.current = true;
    const url = new URL(window.location.href);
    const encodedImage = url.searchParams.get("image");
    if (encodedImage && imageObjects.length > 0) {
      try {
        const imageUrl = decodeURIComponent(escape(atob(encodedImage)));
        const indexInAll = imageObjects.findIndex((entry) => entry.url === imageUrl);
        if (indexInAll !== -1) {
          setActiveTab("all");
          setLightboxIndex(indexInAll);
          return;
        }
        setLightboxIndex(0);
      } catch (e) { }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const tabs: { key: string; label: string }[] = [
    { key: "all", label: "All media" },
    { key: "photos", label: "Photos" },
    { key: "videos", label: "Videos" },
    { key: "about", label: "About" },
  ];
  const headerCountryCodes =
    collectionCountryCodes.length > 0
      ? collectionCountryCodes
      : (profile.visitedCountryCodes ?? []);

  const flagOverflowCount = headerCountryCodes.length > 4 ? headerCountryCodes.length - 4 : 0;
  const allVisitedCountries = headerCountryCodes.map((code) => {
    const countryEntry = COUNTRY_LIST.find((c) => c.code.toLowerCase() === code.toLowerCase());
    return { name: countryEntry ? countryEntry.name : code, code };
  });

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-[0.75rem] min-[50.625rem]:px-[2rem] min-[75rem]:px-[3rem] min-[90rem]:px-[4rem] relative">
      {/* Mobile Navbar */}
      <div id="profile-mobile-navbar" className="flex md:hidden fixed top-0 left-0 w-full z-[120] flex-col pointer-events-none">
        <div className="flex items-center justify-between px-[0.75rem] h-[4.5rem] bg-black shadow-[0_2px_0_0_#000] pointer-events-auto transition-transform duration-300">
          <button onClick={() => router.back()} className="text-white flex items-center justify-center p-2 -ml-2">
            <span className="material-symbols-rounded text-[1.75rem]">arrow_back</span>
          </button>
          <button onClick={() => showComingSoonToast()} className="text-white flex items-center justify-center p-2 -mr-2">
            <span className="material-symbols-rounded text-[1.75rem]">menu</span>
          </button>
        </div>
      </div>
      {lightboxIndex !== null && (
        <CollectionLightbox
          items={displayImages}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((prev) => prev === null ? null : (prev + 1) % displayImages.length)}
          onPrev={() => setLightboxIndex((prev) => prev === null ? null : (prev - 1 + displayImages.length) % displayImages.length)}
          onSelectIndex={setLightboxIndex}
          profileName={profile.name}
          profileCountry={profile.country}
          profileHandle={profile.handle.startsWith("@") ? profile.handle : `@${profile.handle}`}
          profileAvatar={typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url}
          collectionTitle={title}
          description={aboutText}
        />
      )}
      <main className="w-full max-w-[108rem] flex flex-col items-center gap-[1.25rem] md:gap-[3rem] pb-28 md:pb-20 pt-[6.5rem] md:pt-10">
        <div className="flex flex-col items-center gap-[1.25rem] w-full max-w-[37.5rem]">
          <div className="flex flex-col items-center gap-[1.5rem]">
            <div className="flex items-center gap-[0.5rem] justify-center flex-wrap">
              {headerCountryCodes.slice(0, 4).map((code) => {
                const countryEntry = COUNTRY_LIST.find((c) => c.code.toLowerCase() === code.toLowerCase());
                const countryName = countryEntry ? countryEntry.name : code;
                return (
                  <TooltipProvider key={code} delayDuration={100}>
                    <Tooltip content={countryName} theme="light" side="top">
                      <div className="h-[1.5rem] w-[2.125rem] overflow-hidden rounded-[0.1875rem] shadow-sm cursor-pointer">
                        <img src={`/flags/${code.toUpperCase()}.svg`} className="w-full h-full object-cover" alt={countryName} />
                      </div>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
              {flagOverflowCount > 0 && (
                <>
                  <div className="hidden md:block">
                    <DesktopCountriesPopup
                      countries={allVisitedCountries}
                      trigger={
                        <div className="flex h-[1.5rem] w-[2.125rem] shrink-0 items-center justify-center overflow-hidden rounded-[0.1875rem] bg-white cursor-pointer hover:opacity-80 transition-opacity">
                          <span className="font-medium text-violet-600 text-[0.75rem] text-center tracking-[-0.408px] whitespace-nowrap">
                            +{flagOverflowCount}
                          </span>
                        </div>
                      }
                    />
                  </div>
                  <div className="block md:hidden">
                    <CountriesPopup
                      countries={allVisitedCountries}
                      trigger={
                        <div className="flex h-[1.5rem] w-[2.125rem] shrink-0 items-center justify-center overflow-hidden rounded-[0.1875rem] bg-white cursor-pointer hover:opacity-80 transition-opacity">
                          <span className="font-medium text-violet-600 text-[0.75rem] text-center tracking-[-0.408px] whitespace-nowrap">
                            +{flagOverflowCount}
                          </span>
                        </div>
                      }
                    />
                  </div>
                </>
              )}
            </div>
            <h1 className="ds-font-display text-[1.75rem] leading-[2.25rem] tracking-[-0.5px] font-semibold md:text-[3.25rem] md:leading-[3.75rem] md:tracking-[-1px] md:font-bold text-white text-center">
              {title}
            </h1>
          </div>

          {/* Meta info row */}
          <div className="flex flex-col md:flex-row items-center gap-[0.5rem] md:gap-[0.75rem]">
            <div className="flex items-center gap-[0.5rem]">
              <span className="text-[0.875rem] md:text-[1rem] text-white leading-[1.5rem] tracking-[-0.096px] font-normal">By</span>
              <div className="h-[1.25rem] w-[1.25rem] overflow-hidden rounded-[0.375rem] shrink-0">
                <LoadedImage
                  originalSrc={MediaResolver.getBase(typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url)} src={MediaResolver.getOptimized(MediaResolver.getBase(typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url))}
                  thumbnailSrc={MediaResolver.getThumbnail(MediaResolver.getBase(typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url), 720)}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  skeletonClassName="absolute inset-0 bg-[#2a2a2a]"
                  containerClassName="w-full h-full relative"
                />
              </div>
              <Link href={`/${profile.handle.replace(/^@/, "")}`} className="text-[0.875rem] md:text-[1rem] text-white leading-[1.5rem] tracking-[-0.096px] font-normal hover:underline">
                {profile.handle}
              </Link>
            </div>
            
            <div className="hidden md:block h-[0.1875rem] w-[0.1875rem] rounded-full bg-[#505050] shrink-0" />
            
            <div className="flex items-center gap-[0.5rem]">
              <span className="text-[0.875rem] md:text-[1rem] text-[#989898] leading-[1.5rem] tracking-[-0.096px] font-normal">Last Updated:</span>
              <span className="text-[0.875rem] md:text-[1rem] text-[#989898] leading-[1.5rem] tracking-[-0.096px] font-normal">
                {updatedLabel}
              </span>
              
              <div className="md:hidden ml-1 relative flex items-center" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setShowMenu((prev) => !prev)}
                  className="flex px-[0.5rem] py-[0.25rem] items-center justify-center rounded-[3.125rem] bg-[#181818] hover:bg-[#222] transition shrink-0"
                  aria-label="More options"
                >
                  <div className="flex items-center gap-[0.25rem]">
                    <div className="h-[0.125rem] w-[0.125rem] rounded-full bg-[#989898]" />
                    <div className="h-[0.125rem] w-[0.125rem] rounded-full bg-[#989898]" />
                    <div className="h-[0.125rem] w-[0.125rem] rounded-full bg-[#989898]" />
                  </div>
                </button>
                {showMenu && (
                  <ContextMenu
                    kind="collection"
                    viewLabel="View collection"
                    shareLabel="Share collection"
                    viewHref={`/${profile.handle.replace(/^@/, "")}`}
                    showViewAction={false}
                    onShare={() => {
                      navigator.clipboard.writeText(window.location.href).catch(() => { });
                      setShowMenu(false);
                    }}
                    onClose={() => setShowMenu(false)}
                    menuRef={menuRef}
                  />
                )}
              </div>
            </div>

            <div className="hidden md:block h-[0.1875rem] w-[0.1875rem] rounded-full bg-[#505050] shrink-0" />
            <div className="hidden md:flex relative items-center" ref={menuRef}>
              <button
                type="button"
                onClick={() => setShowMenu((prev) => !prev)}
                className="flex px-[0.75rem] py-[0.5625rem] items-center justify-center rounded-[3.125rem] border border-[#363636] bg-[#181818] hover:bg-[#222] transition shrink-0"
                aria-label="More options"
              >
                <div className="flex items-center gap-[0.4375rem]">
                  <div className="h-[0.125rem] w-[0.125rem] rounded-full bg-white" />
                  <div className="h-[0.125rem] w-[0.125rem] rounded-full bg-white" />
                  <div className="h-[0.125rem] w-[0.125rem] rounded-full bg-white" />
                </div>
              </button>
              {showMenu && (
                <ContextMenu
                  kind="collection"
                  viewLabel="View collection"
                  shareLabel="Share collection"
                  viewHref={`/${profile.handle.replace(/^@/, "")}`}
                  showViewAction={false}
                  onShare={() => {
                    navigator.clipboard.writeText(window.location.href).catch(() => { });
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
        <div className="w-full flex flex-col gap-[0.75rem] md:gap-[3rem] items-center">
          {/* Mobile Tab icons */}
          {(() => {
            const mobileTabsArr = ["all", "photos", "videos", "about"] as const;
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
                <div id="mobile-tabs-sentinel" className="w-full h-0 md:hidden" />
                <div id="profile-mobile-tabs" className="flex md:hidden items-center justify-between w-full border-b border-[#222] sticky top-[4.5rem] z-[90] bg-black relative">
                  {[
                  { key: "all", icon: "auto_awesome_mosaic" },
                  { key: "photos", icon: "imagesmode" },
                  { key: "videos", icon: "slideshow" },
                  { key: "about", icon: "chat_info" },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => handleTabChange(tab.key as MediaTab)}
                    className={`relative flex flex-col flex-1 items-center justify-center py-[1rem] transition-colors ${
                      activeTab === tab.key ? "text-white" : "text-[#7c7c7c]"
                    }`}
                  >
                    <span className="material-symbols-rounded text-[1.5rem]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>{tab.icon}</span>
                  </button>
                ))}
                <div
                  className="absolute bottom-[-1px] left-0 pointer-events-none"
                  style={{
                    width: `25%`,
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

          {/* Desktop Tab pills */}
          <div className="hidden md:flex items-center justify-center gap-[0.5rem] flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.key as MediaTab)}
                className={`rounded-[62.4375rem] px-[1.5rem] py-[0.5rem] text-[1rem] leading-[1.5rem] tracking-[-0.096px] transition ${activeTab === tab.key
                    ? "bg-[#1e1e1e] border border-white text-white font-medium"
                    : "bg-[#161616] border border-transparent text-[#bdbdbd] font-normal"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Touch container for content */}
          <div
            className="w-full flex flex-col flex-1 min-h-screen"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Masonry grid or About */}
          {activeTab === "about" ? (
            <div className="flex flex-col items-start gap-4 w-full max-w-[50rem] text-left mt-8 mb-20 px-4 md:px-0">
              <h2 className="text-[1.5rem] font-semibold text-white">About {title}</h2>
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
                                  <video
                                    data-original-src={MediaResolver.getBase(imgUrl)} src={MediaResolver.getOptimized(MediaResolver.getBase(imgUrl))}
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
                                <LoadedImage
                                  originalSrc={MediaResolver.getBase(imgUrl)}
                                  src={MediaResolver.getThumbnail(MediaResolver.getBase(imgUrl), 720)}
                                  thumbnailSrc={MediaResolver.getThumbnail(MediaResolver.getBase(imgUrl), 360)}
                                  alt={`${title} photo ${globalIndex + 1}`}
                                  className="w-full h-auto block"
                                  containerClassName="w-full"
                                  skeletonClassName="w-full aspect-square"
                                />
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 pointer-events-none" />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
              {/* Mobile/tablet: 2 explicit flex columns distributed by height */}
              <div className="flex lg:hidden w-full gap-[0.375rem] md:gap-[1.25rem]">
                {distributeMasonryColumns(items, 2, (item) => (item.height && item.width ? item.height / item.width : 1)).map((columnItems, colIdx) => (
                  <div key={colIdx} className="flex flex-col gap-[0.375rem] md:gap-[1.25rem] flex-1 min-w-0">
                    {columnItems.map(({ url: imgUrl, globalIndex }) => {
                        const isVideo = isVideoAsset(imgUrl);
                        return (
                          <div key={globalIndex} className="group relative w-full">
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
                                  <video
                                    data-original-src={MediaResolver.getBase(imgUrl)} src={MediaResolver.getOptimized(MediaResolver.getBase(imgUrl))}
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
                                <LoadedImage
                                  originalSrc={MediaResolver.getBase(imgUrl)}
                                  src={MediaResolver.getThumbnail(MediaResolver.getBase(imgUrl), 720)}
                                  thumbnailSrc={MediaResolver.getThumbnail(MediaResolver.getBase(imgUrl), 360)}
                                  alt={`${title} photo ${globalIndex + 1}`}
                                  className="w-full h-auto block"
                                  containerClassName="w-full"
                                  skeletonClassName="w-full aspect-square"
                                />
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 pointer-events-none" />
                            </div>
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
      </main>

      {/* Footer */}
      <ProfileFooter />
    </div>
  );
}
