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
import { WaitlistPopup } from "@/components/ui/WaitlistPopup";
import LoadedImage from "@/components/ui/LoadedImage";
import { useMobileComingSoon } from "@/components/ui/MobileComingSoonToast";
import { COUNTRY_LIST } from "@/lib/countries";

/* eslint-disable @next/next/no-img-element */

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
  items: string[];
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
      items={items.map((url: string) => ({
        id: url,
        url,
        isVideo: isVideoAsset(url),
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
  const imageUrls = images.map((entry) => (typeof entry === "string" ? entry : entry.url));
  const countryName = COUNTRY_LIST_LOOKUP[countryCode] || countryCode;
  const [activeTab, setActiveTab] = useState<MediaTab>("all");
  const [showMenu, setShowMenu] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const didReadFromUrl = useRef(false);

  const photos = imageUrls.filter((url) => !isVideoAsset(url));
  const videos = imageUrls.filter((url) => isVideoAsset(url));
  const countryImageObj = profile.countryImages?.find(c => c.countryCode.toUpperCase() === countryCode.toUpperCase());
  const aboutText = countryImageObj?.about;

  const displayImages =
    activeTab === "photos" ? photos :
      activeTab === "videos" ? videos :
        imageUrls;

  const items = displayImages.map((url, index) => ({ url, globalIndex: index }));

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
    if (encodedImage && imageUrls.length > 0) {
      try {
        const imageUrl = decodeURIComponent(escape(atob(encodedImage)));
        // Search in the full images array regardless of active tab
        const indexInAll = imageUrls.indexOf(imageUrl);
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
      const activeUrl = displayImages[lightboxIndex];
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
    { key: "photos", label: "Photos" },
    { key: "videos", label: "Videos" },
    { key: "about", label: "About" },
  ];

  const profileHandle = profile.handle.startsWith("@") ? profile.handle : `@${profile.handle}`;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-[0.75rem] min-[50.625rem]:px-[2rem] min-[75rem]:px-[3rem] min-[90rem]:px-[4rem]">
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

      {/* Country Info */}
      <main className="w-full max-w-[108rem] flex flex-col items-center gap-[3rem] pb-28 md:pb-20 pt-8 md:pt-10">
        <div className="flex flex-col items-center gap-[1.25rem] w-full max-w-[37.5rem]">
          <div className="flex flex-col items-center gap-[1.5rem]">
            <div className="h-[5rem] w-[7.5rem] overflow-hidden rounded-[0.5rem] shrink-0">
              <img
                src={`/flags/${countryCode}.svg`}
                alt={`${countryName} flag`}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="ds-font-display text-[3.25rem] leading-[3.75rem] tracking-[-1px] font-bold text-white text-center">
              {countryName}
            </h1>
          </div>

          {/* Meta info row */}
          <div className="flex items-center gap-[0.75rem]">
            <div className="flex items-center gap-[0.5rem]">
              <span className="text-[1rem] text-white leading-[1.5rem] tracking-[-0.096px] font-normal">By</span>
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
              <Link href={`/${profile.handle.replace(/^@/, "")}`} className="text-[1rem] text-white leading-[1.5rem] tracking-[-0.096px] font-normal hover:underline">
                {profile.handle}
              </Link>
            </div>
            <div className="h-[0.1875rem] w-[0.1875rem] rounded-full bg-[#505050] shrink-0" />
            <div className="flex items-center gap-[0.5rem]">
              <span className="text-[1rem] text-[#989898] leading-[1.5rem] tracking-[-0.096px] font-normal">Last Updated:</span>
              <span className="text-[1rem] text-[#989898] leading-[1.5rem] tracking-[-0.096px] font-normal">
                {STATIC_LAST_UPDATED_LABEL}
              </span>
            </div>
            <div className="h-[0.1875rem] w-[0.1875rem] rounded-full bg-[#505050] shrink-0" />
            <div className="relative flex items-center" ref={menuRef}>
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
                  kind="country"
                  viewLabel="View main profile"
                  shareLabel="Share country"
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
        <div className="w-full flex flex-col gap-[3rem] items-center">
          {/* Tab pills */}
          <div className="flex items-center justify-center gap-[0.5rem] flex-wrap">
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

          {/* Masonry grid or About */}
          {activeTab === "about" ? (
            <div className="flex flex-col items-start gap-4 w-full max-w-[50rem] text-left mt-8 mb-20 px-4 md:px-0">
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
              {/* Desktop: 4 explicit flex columns — matches Figma layout */}
              <div className="hidden lg:flex w-full gap-[0.5rem] xl:gap-[0.75rem]">
                {[0, 1, 2, 3].map((colIdx) => (
                  <div key={colIdx} className="flex flex-col gap-[0.5rem] xl:gap-[0.75rem] flex-1 min-w-0">
                    {items
                      .filter((_, i) => i % 4 === colIdx)
                      .map(({ url: imgUrl, globalIndex }) => {
                        const isVideo = isVideoAsset(imgUrl);
                        return (
                          <div key={globalIndex} className="group relative">
                            <div
                              className="relative rounded-2xl overflow-hidden bg-[#151515] cursor-pointer"
                              onClick={(e) => {
                                if (window.innerWidth < 811) {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  showComingSoonToast();
                                } else {
                                  setLightboxIndex(globalIndex);
                                }
                              }}
                            >
                              {isVideo ? (
                                <>
                                  <video data-data-original-src={MediaResolver.getBase(imgUrl)} src={MediaResolver.getOptimized(MediaResolver.getBase(imgUrl))}
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
                                  originalSrc={MediaResolver.getBase(imgUrl)} src={MediaResolver.getOptimized(MediaResolver.getBase(imgUrl))}
                                  thumbnailSrc={MediaResolver.getThumbnail(MediaResolver.getBase(imgUrl), 720)}
                                  alt={`${countryName} photo ${globalIndex + 1}`}
                                  priority={globalIndex < 4}
                                  className="w-full h-auto block"
                                  containerClassName="w-full"
                                  skeletonClassName="w-full aspect-square"
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
              {/* Mobile/tablet: 2-column CSS columns */}
              <div className="lg:hidden columns-2 gap-[0.375rem] w-full">
                {items.map(({ url: imgUrl, globalIndex }) => {
                  const isVideo = isVideoAsset(imgUrl);
                  return (
                    <div
                      key={globalIndex}
                      className="group mb-[0.5rem] w-full break-inside-avoid relative [-webkit-column-break-inside:avoid] inline-block"
                    >
                      <div
                        className="relative rounded-2xl overflow-hidden bg-[#151515] cursor-pointer"
                        onClick={(e) => {
                          if (window.innerWidth < 811) {
                            e.preventDefault();
                            e.stopPropagation();
                            showComingSoonToast();
                          } else {
                            setLightboxIndex(globalIndex);
                          }
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
                            originalSrc={MediaResolver.getBase(imgUrl)} src={MediaResolver.getOptimized(MediaResolver.getBase(imgUrl))}
                            thumbnailSrc={MediaResolver.getThumbnail(MediaResolver.getBase(imgUrl), 720)}
                            alt={`${countryName} photo ${globalIndex + 1}`}
                            priority={globalIndex < 4}
                            className="w-full h-auto block"
                            containerClassName="w-full"
                            skeletonClassName="w-full aspect-square"
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
            </div>
          )}
        </div>

        <WaitlistPopup open={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
      </main>

      {/* Footer */}
      <ProfileFooter />
    </div>
  );
}
