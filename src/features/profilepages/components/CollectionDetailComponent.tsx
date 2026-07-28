"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";

import { toLandingAssetUrl } from "@/lib/landing-assets";
import { sampleProfiles, type SampleProfile } from "../data/profile-data";
import { ContextMenu } from "./ProfileComponent";
import { MediaLightbox } from "./MediaLightbox";
import { MoreOptionsButton } from "@/components/ui/MoreOptionsButton";
import LoadedImage from "@/components/ui/LoadedImage";

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
  const totalCount = items.length;
  const displayIndex = activeIndex + 1;
  const avatarSrc = toLandingAssetUrl(profileAvatar);

  return (
    <MediaLightbox
      items={items.map((url) => ({
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
      }
    />
  );
}

export default function CollectionDetailComponent({
  profile,
  title,
  images,
}: {
  profile: SampleProfile;
  title: string;
  images: Array<string | { url: string; width?: number; height?: number }>;
}) {
  const imageUrls = images.map((entry) => (typeof entry === "string" ? entry : entry.url));
  const [activeTab, setActiveTab] = useState<MediaTab>("all");
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
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
    setLightboxIndex(null);
  }, [activeTab]);

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
        window.history.replaceState({}, "", url.toString());
      }
    } else if (didReadFromUrl.current && lightboxIndex === null) {
      if (url.searchParams.has("image")) {
        url.searchParams.delete("image");
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, [lightboxIndex, displayImages]);

  const tabs: { key: string; label: string }[] = [
    { key: "all", label: "All media" },
    { key: "photos", label: "Photos" },
    { key: "videos", label: "Videos" },
    { key: "about", label: "About" },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-[12px] min-[810px]:px-[32px] min-[1200px]:px-[48px] min-[1440px]:px-[64px]">
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
          profileAvatar={typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url}
          collectionTitle={title}
          description={profile.bio}
        />
      )}
      {/* Collection Info */}
      <main className="w-full max-w-[1728px] flex flex-col items-center gap-[48px] pb-28 md:pb-20 pt-8 md:pt-10">
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
                <img src={toLandingAssetUrl(typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url)} alt={profile.name} className="w-full h-full object-cover" />
              </div>
              <Link href={`/profiles/${profile.handle.replace(/^@/, "")}`} className="text-[16px] text-white leading-[24px] tracking-[-0.096px] font-normal hover:underline">
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
                  viewHref={`/profiles/${profile.handle.replace(/^@/, "")}`}
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
        <div className="w-full flex flex-col gap-[48px] items-center">
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

          {/* Masonry grid or About */}
          {activeTab === "about" ? (
            <div className="flex flex-col items-start gap-4 w-full max-w-[800px] text-left mt-8 mb-20 px-4 md:px-0">
              <h2 className="text-[24px] font-semibold text-white">About {title}</h2>
              <p className="text-[16px] text-[#a8a8a8] leading-relaxed whitespace-pre-wrap">
                {aboutText || "No information provided yet."}
              </p>
            </div>
          ) : displayImages.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <p className="text-[#a8a8a8] text-[16px]">No media in this category yet.</p>
            </div>
          ) : (
            <div className="columns-2 sm:columns-3 xl:columns-4 gap-[6px] md:gap-[20px]">
              {items.map(({ url: imgUrl, globalIndex }) => {
                const isVideo = isVideoAsset(imgUrl);
                return (
                  <div
                    key={globalIndex}
                    className="group mb-[8px] md:mb-[20px] w-full break-inside-avoid relative [-webkit-column-break-inside:avoid] inline-block"
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
                        <LoadedImage
                          src={toLandingAssetUrl(imgUrl)}
                          alt={`${title} photo ${globalIndex + 1}`}
                          className="w-full h-auto block"
                          containerClassName="w-full"
                          skeletonClassName="w-full aspect-[3/4]"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 pointer-events-none" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-[1728px] py-8 flex items-center justify-center gap-8 text-[12px] text-white-500 tracking-[-0.408px]">
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
