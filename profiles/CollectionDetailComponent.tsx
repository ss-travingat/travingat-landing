"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";

import { toLandingAssetUrl } from "@/lib/landing-assets";
import type { SampleProfile } from "@/profiles/profile-data";
import { ContextMenu } from "./ProfileComponent";
import { MoreOptionsButton } from "@/components/ui/MoreOptionsButton";

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
  profileHandle: string;
  profileAvatar: string;
  collectionTitle: string;
  description?: string;
}) {
  const activeUrl = items[activeIndex];
  const totalCount = items.length;
  const displayIndex = activeIndex + 1;
  const avatarSrc = toLandingAssetUrl(profileAvatar);
  const [showBrowser, setShowBrowser] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current && !showBrowser) {
      const container = scrollContainerRef.current;
      setTimeout(() => {
        const containerWidth = container.clientWidth;
        if (containerWidth === 0) return;
        const itemWidth = 64; // w-16
        const gap = 8; // gap-2
        const paddingLeft = 40; // px-10
        const targetCenter = paddingLeft + (activeIndex * (itemWidth + gap)) + (itemWidth / 2);
        const targetScrollLeft = targetCenter - (containerWidth / 2);
        
        container.scrollTo({
          left: targetScrollLeft,
          behavior: 'smooth'
        });
      }, 50);
    }
  }, [activeIndex, showBrowser]);

  return (
    <div
      className="fixed inset-0 z-[100] flex bg-black/95"
      onClick={onClose}
    >
      <div
        className="relative flex flex-1 flex-col min-w-0"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
      >
        <div className="flex items-center justify-between px-10 py-6 text-[15px] tracking-[-0.4px] text-[#a8a8a8]">
          <span>{`${displayIndex} of ${totalCount}`}</span>
          <button
            type="button"
            onClick={() => setShowBrowser((prev) => !prev)}
            className="flex h-8 w-8 items-center justify-center text-[#a8a8a8] transition hover:text-white"
            aria-label="Toggle photo browser"
          >
            <span className="material-symbols-rounded text-[22px]">dashboard</span>
          </button>
        </div>

        {showBrowser ? (
          <div className="flex-1 min-h-0 overflow-y-auto px-10 pb-8">
            <div
              className="columns-4 gap-6 [column-fill:_balance]"
              style={{ columnCount: 4, columnGap: "24px" }}
            >
              {items.map((url, idx) => (
                <button
                  key={`browser-${idx}`}
                  type="button"
                  onClick={() => {
                    onSelectIndex(idx);
                    setShowBrowser(false);
                  }}
                  className="mb-6 w-full break-inside-avoid overflow-hidden rounded-[22px] bg-[#0a0a0a] text-left"
                  aria-label={`Open photo ${idx + 1}`}
                >
                  <div className="relative">
                    {isVideoAsset(url) ? (
                      <>
                        <video
                          src={toLandingAssetUrl(url)}
                          className="h-auto w-full"
                        />
                        <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/55">
                          <span className="material-symbols-rounded text-[18px] text-white">play_arrow</span>
                        </div>
                      </>
                    ) : (
                      <img
                        src={toLandingAssetUrl(url)}
                        alt={`Gallery thumbnail ${idx + 1}`}
                        className="h-auto w-full"
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="relative flex flex-1 min-h-0 pb-8">
              <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#0a0a0a]">
                <div className="relative group flex max-h-full max-w-full items-center justify-center">
                  {/* Hover Buttons */}
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white transition hover:bg-black/60"
                      aria-label="Like"
                    >
                      <span className="material-symbols-rounded text-[20px]">favorite_border</span>
                    </button>
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white transition hover:bg-black/60"
                      aria-label="Share"
                    >
                      <span className="material-symbols-rounded text-[20px] -mt-[2px]">ios_share</span>
                    </button>
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white transition hover:bg-black/60"
                      aria-label="More options"
                    >
                      <span className="flex items-center gap-1">
                        <span className="block h-1 w-1 rounded-full bg-white" />
                        <span className="block h-1 w-1 rounded-full bg-white" />
                        <span className="block h-1 w-1 rounded-full bg-white" />
                      </span>
                    </button>
                  </div>

                  {isVideoAsset(activeUrl) ? (
                    <video
                      key={`video-${activeIndex}`}
                      src={toLandingAssetUrl(activeUrl)}
                      controls
                      autoPlay
                      className="max-h-full max-w-full object-contain carousel-image"
                    />
                  ) : (
                    <img
                      key={`img-${activeIndex}`}
                      src={toLandingAssetUrl(activeUrl)}
                      alt={`${collectionTitle} photo ${displayIndex}`}
                      className="max-h-full max-w-full object-contain carousel-image"
                    />
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={onPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-md transition hover:bg-[#f0f0f0]"
                aria-label="Previous photo"
              >
                <span className="material-symbols-rounded text-[28px]">chevron_left</span>
              </button>

              <button
                type="button"
                onClick={onNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-md transition hover:bg-[#f0f0f0]"
                aria-label="Next photo"
              >
                <span className="material-symbols-rounded text-[28px]">chevron_right</span>
              </button>
            </div>

            <div
              ref={scrollContainerRef}
              className="w-full overflow-x-auto px-10 pb-4 pt-2"
            >
              <div className={`relative flex items-center gap-2 pt-3 w-max ${items.length <= 10 ? "mx-auto" : ""}`}>
                <div
                  className="absolute top-0 left-0 h-1 w-10 bg-white rounded-full transition-transform duration-300 ease-out"
                  style={{
                    transform: `translateX(calc(12px + ${activeIndex} * 72px))`,
                  }}
                />

                {items.map((url, idx) => (
                  <div key={`thumbnail-${idx}`} className="relative flex flex-col items-center gap-1 pt-2">
                    <button
                      onClick={() => onSelectIndex(idx)}
                      className={`relative h-16 w-16 shrink-0 rounded overflow-hidden transition ${
                        idx === activeIndex ? "opacity-100" : "opacity-60 hover:opacity-100"
                      }`}
                      aria-label={`View photo ${idx + 1}`}
                    >
                      {isVideoAsset(url) ? (
                        <>
                          <video
                            src={toLandingAssetUrl(url)}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <span className="material-symbols-rounded text-white text-[20px]">play_circle</span>
                          </div>
                        </>
                      ) : (
                        <img
                          src={toLandingAssetUrl(url)}
                          alt={`Carousel thumbnail ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <aside
        className="flex w-[360px] shrink-0 flex-col gap-8 overflow-y-auto bg-[#111111] p-8 text-white"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
      >
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

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[13px] text-[#888]">
            <span>{profileName}</span>
          </div>
          <p className="text-[20px] font-semibold tracking-[-0.5px] text-white">{profileHandle}</p>
        </div>

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

        <div className="flex flex-col gap-4">
          <p className="text-[22px] font-semibold tracking-[-0.5px] text-[#ededed]">
            {collectionTitle}
          </p>
          {description ? (
            <p className="text-[15px] leading-[1.6] tracking-[-0.3px] text-[#a0a0a0] line-clamp-6">{description}</p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

export default function CollectionDetailComponent({
  profile,
  title,
  images,
}: {
  profile: SampleProfile;
  title: string;
  images: string[];
}) {
  const [activeTab, setActiveTab] = useState<MediaTab>("all");
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const didReadFromUrl = useRef(false);

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

  useEffect(() => {
    setLightboxIndex(null);
  }, [activeTab]);

  useEffect(() => {
    if (typeof window === "undefined" || didReadFromUrl.current) return;
    didReadFromUrl.current = true;
    const url = new URL(window.location.href);
    const encodedImage = url.searchParams.get("image");
    if (encodedImage && images.length > 0) {
      try {
        const imageUrl = decodeURIComponent(escape(atob(encodedImage)));
        const indexInAll = images.indexOf(imageUrl);
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
        window.history.replaceState({}, "", url.toString());
      }
    } else if (didReadFromUrl.current && lightboxIndex === null) {
      if (url.searchParams.has("image")) {
        url.searchParams.delete("image");
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, [lightboxIndex, displayImages]);

  const columns: { url: string; globalIndex: number }[][] = [[], [], [], []];
  displayImages.forEach((img, i) => {
    columns[i % 4].push({ url: img, globalIndex: i });
  });

  const tabs: { key: string; label: string }[] = [
    { key: "all", label: "All media" },
    { key: "photos", label: "Photos" },
    { key: "videos", label: "Videos" },
    { key: "about", label: "About" },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 md:px-10 xl:px-24">
      {lightboxIndex !== null && (
        <CollectionLightbox
          items={displayImages}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((prev) => prev === null ? null : (prev + 1) % displayImages.length)}
          onPrev={() => setLightboxIndex((prev) => prev === null ? null : (prev - 1 + displayImages.length) % displayImages.length)}
          onSelectIndex={setLightboxIndex}
          profileName={profile.name}
          profileHandle={profile.handle.startsWith("@") ? profile.handle : `@${profile.handle}`}
          profileAvatar={profile.images.avatar}
          collectionTitle={title}
          description={profile.bio}
        />
      )}
      {/* Collection Info */}
      <main className="w-full flex flex-col items-center gap-[48px] pb-28 md:pb-20 pt-8 md:pt-10">
        <div className="flex flex-col items-center gap-[20px] w-full max-w-[600px]">
          <div className="flex flex-col items-center gap-[24px]">
            <div className="flex items-center gap-[8px] justify-center">
              {profile.visitedCountryCodes?.slice(0, 4).map((code) => (
                <div key={code} className="h-[24px] w-[34px] overflow-hidden rounded-[3px] shadow-sm">
                   <img src={`/flags/${code.toUpperCase()}.svg`} className="w-full h-full object-cover" alt={code} />
                </div>
              ))}
            </div>
            <h1 className="ds-font-display text-[52px] leading-[60px] tracking-[-1px] font-bold text-white text-center">
              {title}
            </h1>
          </div>

          {/* Meta info row */}
          <div className="flex items-center gap-[12px]">
            <div className="flex items-center gap-[8px]">
              <span className="text-[16px] text-white leading-[24px] tracking-[-0.096px] font-normal">By</span>
              <div className="h-[20px] w-[20px] overflow-hidden rounded-[6px] shrink-0">
                <img src={toLandingAssetUrl(profile.images.avatar)} alt={profile.name} className="w-full h-full object-cover" />
              </div>
              <Link href={`/profiles/${profile.id}`} className="text-[16px] text-white leading-[24px] tracking-[-0.096px] font-normal hover:underline">
                {profile.handle}
              </Link>
            </div>
            <div className="h-[3px] w-[3px] rounded-full bg-[#505050] shrink-0" />
            <div className="flex items-center gap-[8px]">
              <span className="text-[16px] text-[#989898] leading-[24px] tracking-[-0.096px] font-normal">Last Updated: 27 Dec 2025</span>
            </div>
            <div className="h-[3px] w-[3px] rounded-full bg-[#505050] shrink-0" />
            <div className="relative flex items-center" ref={menuRef}>
              <button
                type="button"
                onClick={() => setShowMenu((prev) => !prev)}
                className="flex px-[12px] py-[9px] items-center justify-center rounded-[50px] border border-[#363636] bg-[#181818] hover:bg-[#222] transition shrink-0"
                aria-label="More options"
              >
                <div className="flex items-center gap-[7px]">
                  <div className="h-[2px] w-[2px] rounded-full bg-white" />
                  <div className="h-[2px] w-[2px] rounded-full bg-white" />
                  <div className="h-[2px] w-[2px] rounded-full bg-white" />
                </div>
              </button>
              {showMenu && (
                <ContextMenu
                  kind="collection"
                  viewLabel="View collection"
                  shareLabel="Share collection"
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
        <div className="w-full flex flex-col gap-[48px] items-center max-w-[1488px]">
          {/* Tab pills */}
          <div className="flex items-center justify-center gap-[8px] flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.key as MediaTab)}
                className={`rounded-[999px] px-[24px] py-[8px] text-[16px] leading-[24px] tracking-[-0.096px] transition ${
                  activeTab === tab.key
                    ? "bg-[#1e1e1e] border border-white text-white font-medium"
                    : "bg-[#161616] border border-transparent text-[#bdbdbd] font-normal"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

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
                              alt={`${title} photo ${globalIndex + 1}`}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-auto block"
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
