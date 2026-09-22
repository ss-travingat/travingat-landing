"use client";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";

import { toLandingAssetUrl } from "@/lib/landing-assets";
import { sampleProfiles, type SampleProfile } from "../data/profile-data";
import { ContextMenu } from "./ProfileComponent";
import { MediaLightbox } from "./MediaLightbox";
import ProfileFooter from "./ProfileFooter";
import { MoreOptionsButton } from "@/components/ui/MoreOptionsButton";
import { Tooltip, TooltipProvider } from "@/components/ui/Tooltip";
import { COUNTRY_LIST } from "@/lib/countries";
import LoadedImage from "@/components/ui/LoadedImage";
import { getOptimizedMediaUrl } from "@/lib/landing-assets";
import { getThumbnailUrl } from "@/components/ThumbnailImage";
import { useMobileComingSoon } from "@/components/ui/MobileComingSoonToast";

/* eslint-disable @next/next/no-img-element */

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
  collectionTitle: string;
  description?: string;
}) {
  const totalCount = items.length;
  const displayIndex = activeIndex + 1;
  const avatarSrc = toLandingAssetUrl(profileAvatar);

  const { showComingSoonToast } = useMobileComingSoon();

  return (
    <MediaLightbox
      items={items.map((url) => ({
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
          <div className="flex items-start justify-between">
            <div className="h-[4.5rem] w-[4.5rem] overflow-hidden rounded-2xl">
              <LoadedImage src={avatarSrc} thumbnailSrc={getOptimizedMediaUrl(avatarSrc)} alt={profileName} className="h-full w-full object-cover" />
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
  const imageUrls = images.map((entry) => (typeof entry === "string" ? entry : entry.url));
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

  const photos = imageUrls.filter((url) => !isVideoAsset(url));
  const videos = imageUrls.filter((url) => isVideoAsset(url));
  const collectionObj = profile.collectionImages?.find(c => c.title === title);
  const aboutText = collectionObj?.about;

  const displayImages =
    activeTab === "photos" ? photos :
    activeTab === "videos" ? videos :
    imageUrls;

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

  const items = displayImages.map((url, index) => ({ url, globalIndex: index }));

  useEffect(() => {
    if (typeof window === "undefined" || didReadFromUrl.current) return;
    didReadFromUrl.current = true;
    const url = new URL(window.location.href);
    const encodedImage = url.searchParams.get("image");
    if (encodedImage && imageUrls.length > 0) {
      try {
        const imageUrl = decodeURIComponent(escape(atob(encodedImage)));
        const indexInAll = imageUrls.indexOf(imageUrl);
        if (indexInAll !== -1) {
          setActiveTab("all");
          setLightboxIndex(indexInAll);
          return;
        }
        setLightboxIndex(0);
      } catch (e) {}
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-[0.75rem] min-[50.625rem]:px-[2rem] min-[75rem]:px-[3rem] min-[90rem]:px-[4rem]">
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
      {/* Collection Info */}
      <main className="w-full max-w-[108rem] flex flex-col items-center gap-[3rem] pb-28 md:pb-20 pt-8 md:pt-10">
        <div className="flex flex-col items-center gap-[1.25rem] w-full max-w-[37.5rem]">
          <div className="flex flex-col items-center gap-[1.5rem]">
            <div className="flex items-center gap-[0.5rem] justify-center">
              {headerCountryCodes.map((code) => {
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
            </div>
            <h1 className="ds-font-display text-[3.25rem] leading-[3.75rem] tracking-[-1px] font-bold text-white text-center">
              {title}
            </h1>
          </div>

          {/* Meta info row */}
          <div className="flex items-center gap-[0.75rem]">
            <div className="flex items-center gap-[0.5rem]">
              <span className="text-[1rem] text-white leading-[1.5rem] tracking-[-0.096px] font-normal">By</span>
              <div className="h-[1.25rem] w-[1.25rem] overflow-hidden rounded-[0.375rem] shrink-0">
                <LoadedImage
                  src={toLandingAssetUrl(typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url)}
                  thumbnailSrc={getOptimizedMediaUrl(toLandingAssetUrl(typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url))}
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
              <span className="text-[1rem] text-[#989898] leading-[1.5rem] tracking-[-0.096px] font-normal">Last Updated: 27 Dec 2025</span>
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
                  kind="collection"
                  viewLabel="View collection"
                  shareLabel="Share collection"
                  viewHref={`/${profile.handle.replace(/^@/, "")}`}
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
        <div className="w-full flex flex-col gap-[3rem] items-center">
          {/* Tab pills */}
          <div className="flex items-center justify-center gap-[0.5rem] flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.key as MediaTab)}
                className={`rounded-[62.4375rem] px-[1.5rem] py-[0.5rem] text-[1rem] leading-[1.5rem] tracking-[-0.096px] transition ${
                  activeTab === tab.key
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
                                <LoadedImage
                                  src={toLandingAssetUrl(imgUrl)}
                                  thumbnailSrc={getThumbnailUrl(toLandingAssetUrl(imgUrl), 720)}
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
              {/* Mobile/tablet: CSS columns */}
              <div className="lg:hidden columns-2 sm:columns-3 gap-[0.375rem] md:gap-[1.25rem] w-full">
                {items.map(({ url: imgUrl, globalIndex }) => {
                  const isVideo = isVideoAsset(imgUrl);
                  return (
                    <div
                      key={globalIndex}
                      className="group mb-[0.5rem] md:mb-[1.25rem] w-full break-inside-avoid relative [-webkit-column-break-inside:avoid] inline-block"
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
                          <LoadedImage
                            src={toLandingAssetUrl(imgUrl)}
                            thumbnailSrc={getThumbnailUrl(toLandingAssetUrl(imgUrl), 720)}
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
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <ProfileFooter />
    </div>
  );
}
