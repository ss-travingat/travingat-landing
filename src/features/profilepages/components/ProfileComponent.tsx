"use client";
import { useRouter } from "next/navigation";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";

import { toLandingAssetUrl, normalizeAssetHtml, getOptimizedMediaUrl } from "@/lib/landing-assets";
import { ThumbnailImage, getThumbnailUrl } from "@/components/ThumbnailImage";
import { sampleProfiles, type SampleProfile } from "../data/profile-data";
import { MediaLightbox, type LightboxItem } from "./MediaLightbox";
import { MoreOptionsButton } from "@/components/ui/MoreOptionsButton";
import { WaitlistPopup } from "@/components/ui/WaitlistPopup";
import { MobileHero, MobileTabs, MobileActionBar } from "./MobileProfile";
import ProfileFooter from "./ProfileFooter";
import CardCarousel from "./CardCarousel";
import LoadedImage from "@/components/ui/LoadedImage";
import { MasonryImageGrid } from "@/components/ui/MasonryImageGrid";
import type { MasonryItemWithDimensions } from "@/hooks/useMasonryAdvanced";
import { useMobileComingSoon } from "@/components/ui/MobileComingSoonToast";
import { COUNTRY_LIST } from "@/lib/countries";
import { Tooltip, TooltipProvider } from "@/components/ui/Tooltip";
import { getCountryName } from "@/lib/countries";
import { CountriesPopup } from "@/components/ui/CountriesPopup";

/* eslint-disable @next/next/no-img-element */

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="text-[#656565] hover:text-white transition-colors flex-shrink-0" aria-label="Copy URL">
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
      )}
    </button>
  );
};

const COUNTRIES_EMPTY_PREVIEW_IMAGES = [
  "/images/country-thailand-figma.png",
  "/images/country-greece-figma.png",
  "/images/country-switzerland-figma.png",
] as const;

const COLLECTIONS_EMPTY_PREVIEW_IMAGES = [
  "/images/collection-europe-figma.png",
  "/images/collection-portraits-figma.jpg",
  "/images/collection-hiking-figma.png",
] as const;

const COUNTRY_LIST_LOOKUP: Record<string, string> = Object.fromEntries(
  COUNTRY_LIST.map(c => [c.code.toUpperCase(), c.name])
);

type TabKey = "all" | "countries" | "collections" | "about";

type MediaItem = {
  id: string;
  fileUrl: string;
  isVideo: boolean;
  countryCode?: string;
  collectionIndex?: number;
  width?: number;
  height?: number;
};

type CountryCard = {
  code: string;
  name: string;
  flagCode: string;
  thumbnailUrl: string;
  previewImages: string[];
  photoCount: number;
  videoCount: number;
};

type CollectionCard = {
  id: string;
  title: string;
  description: string;
  createdLabel: string;
  thumbnailUrl: string;
  previewImages: string[];
  countries: string[];
  countryOverflowCount: number;
};

export type ContextMenuKind = "media" | "country" | "collection";

type ShareCardData = {
  kind: ContextMenuKind;
  title: string;
  imageUrl: string;
  shareUrl: string;
  flagCode?: string;
  ownerName: string;
  ownerHandle: string;
  ownerAvatar: string;
};

const CREATED_AT_BASE_UTC_MS = Date.UTC(2025, 11, 27);
const CREATED_AT_STEP_DAYS = 19;

function getDeterministicCreatedLabel(index: number): string {
  const createdAtMs = CREATED_AT_BASE_UTC_MS - index * CREATED_AT_STEP_DAYS * 24 * 60 * 60 * 1000;
  return new Date(createdAtMs).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function isVideoAsset(url: string) {
  return /\.(mp4|mov|webm|m4v|3gp|3g2)$/i.test(url);
}

/**
 * Returns the number of masonry columns that should be rendered at the
 * current viewport width, matching the breakpoints used in the grid:
 *   < 640 px  → 2 cols
 *   640–1280px → 3 cols
 *   ≥ 1280 px  → 4 cols
 */
function useColumnCount(): number {
  const getCount = () => {
    if (typeof window === "undefined") return 2;
    if (window.innerWidth >= 1280) return 4;
    if (window.innerWidth >= 640) return 3;
    return 2;
  };
  const [count, setCount] = useState(getCount);
  useEffect(() => {
    const handler = () => setCount(getCount());
    window.addEventListener("resize", handler, { passive: true });
    return () => window.removeEventListener("resize", handler);
  }, []);
  return count;
}

function toSocialLabel(value: string) {
  return value.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
}

function toLocationCountry(value: string) {
  const parts = value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.length > 0 ? parts[parts.length - 1] : value;
}

function toFlagAssetPath(flagCode?: string): string | undefined {
  if (!flagCode) return undefined;
  return `/flags/${flagCode.toUpperCase()}.svg`;
}

function SocialIcon({ platform, className = "w-5 h-5" }: { platform: string; variant?: "filled" | "outline"; className?: string }) {
  const slugByPlatform: Record<string, string> = {
    x: "x",
    instagram: "instagram",
    youtube: "youtube",
    facebook: "facebook",
  };

  if (platform === "linkedin") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }

  const slug = slugByPlatform[platform];
  if (!slug) return null;
  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}/ffffff`}
      alt={platform}
      aria-hidden="true"
      className={className}
      draggable={false}
    />
  );
}

export function ContextMenu({
  kind,
  viewLabel,
  shareLabel,
  flagCode,
  viewHref,
  showViewAction = true,
  onShare,
  onClose,
  menuRef,
}: {
  kind: ContextMenuKind;
  viewLabel: string;
  shareLabel: string;
  flagCode?: string;
  viewHref?: string;
  showViewAction?: boolean;
  onShare: () => void;
  onClose: () => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { showComingSoonToast } = useMobileComingSoon();
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const flagSrc = toFlagAssetPath(flagCode);
  const handleView = () => {
    if (viewHref) {
      window.location.assign(viewHref);
    }
    onClose();
  };

  const handleShare = () => {
    onShare();
    onClose();
  };

  return (
    <div ref={menuRef}>
      <div
        role="menu"
        className="absolute right-3 bottom-14 z-30 w-[13.75rem] rounded-2xl border border-[#2a2a2a] bg-[#111] py-5 pl-5 pr-8 shadow-[0_8px_40px_rgba(0,0,0,0.7)]"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <div className="flex flex-col gap-5">
          {showViewAction && (kind === "media" || kind === "country" || kind === "collection") && (
            <button
              type="button"
              role="menuitem"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                const lowerLabel = viewLabel.toLowerCase();
                if (lowerLabel !== "view country" && lowerLabel !== "view collection") {
                  showComingSoonToast("featureLaunch");
                  onClose();
                } else {
                  handleView();
                }
              }}
              disabled={!viewHref}
              className={`flex w-full items-center gap-3 text-sm font-normal text-white transition ${viewHref ? "hover:text-[#d4d4d4]" : "opacity-50 cursor-not-allowed"
                }`}
            >
              <span className="material-symbols-rounded text-xl">folder</span>
              <span>{viewLabel}</span>
              {flagSrc ? (
                <div className="ml-auto flex items-center justify-center rounded-[0.25rem] overflow-hidden shadow-sm w-6 h-[0.975rem] flex-shrink-0">
                  <img
                    src={flagSrc}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}
            </button>
          )}

          <button
            type="button"
            role="menuitem"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              showComingSoonToast("featureLaunch");
              onClose();
            }}
            className="flex w-full items-center gap-3 text-sm font-normal text-white hover:text-[#d4d4d4] transition-colors"
          >
            <span className="material-symbols-rounded text-xl">ios_share</span>
            <span>{shareLabel}</span>
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              showComingSoonToast("featureLaunch");
              onClose();
            }}
            className="flex w-full items-center gap-3 text-sm font-normal text-white hover:text-[#d4d4d4] transition-colors"
          >
            <span className="material-symbols-rounded text-xl">favorite_border</span>
            <span>Add to favorites</span>
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              showComingSoonToast("featureLaunch");
              onClose();
            }}
            className="flex w-full items-center gap-3 text-sm font-normal text-white hover:text-[#d4d4d4] transition-colors"
          >
            <span className="material-symbols-rounded text-xl">block</span>
            <span>Report</span>
          </button>
        </div>
      </div>

      <WaitlistPopup
        open={isWaitlistOpen}
        onClose={() => {
          setIsWaitlistOpen(false);
          onClose();
        }}
      />
    </div>
  );
}


function PhotoCarouselModal({
  items,
  activeIndex,
  onClose,
  onNext,
  onPrev,
  onSelectIndex,
  onShareClick,
  profileName,
  profileCountry,
  profileHandle,
  profileAvatar,
  profileFlagCode,
  countryName,
  countryFlagCode,
  description,
  quote,
}: {
  items: MediaItem[];
  activeIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelectIndex: (index: number) => void;
  onShareClick: () => void;
  profileName: string;
  profileHandle: string;
  profileAvatar: string;
  profileCountry?: string;
  profileFlagCode?: string;
  countryName?: string;
  countryFlagCode?: string;
  description?: string;
  quote?: string;
}) {
  const { showComingSoonToast } = useMobileComingSoon();
  const avatarSrc = toLandingAssetUrl(profileAvatar);
  const profileFlagSrc = toFlagAssetPath(profileFlagCode);
  const countryFlagSrc = toFlagAssetPath(countryFlagCode);
  return (
    <MediaLightbox
      items={items.map((item) => ({
        id: item.id,
        url: item.fileUrl,
        isVideo: item.isVideo,
        width: item.width,
        height: item.height,
      }))}
      activeIndex={activeIndex}
      onClose={onClose}
      onNext={onNext}
      onPrev={onPrev}
      onSelectIndex={onSelectIndex}
      onShareClick={onShareClick}
      sidebarContent={
        <aside
          className="flex w-[22.5rem] shrink-0 flex-col gap-8 overflow-y-auto bg-[#111111] p-8 text-white"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          {/* Avatar + close */}
          <div className="flex items-start justify-between">
            <div className="h-18 w-18 overflow-hidden rounded-2xl">
              <LoadedImage src={avatarSrc} thumbnailSrc={getOptimizedMediaUrl(avatarSrc)} alt={profileName} className="h-full w-full object-cover" />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center text-[#666] transition hover:text-white"
              aria-label="Close"
            >
              <span className="material-symbols-rounded text-2xl">close</span>
            </button>
          </div>

          {/* Profile info */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              {profileFlagSrc ? (
                <img src={profileFlagSrc} alt="" className="h-[0.975rem] w-6 rounded-[0.125rem] object-cover" />
              ) : null}
              <span className="text-sm font-medium leading-[1.25rem] tracking-[-0.1px] text-[#A8A8A8]">{profileCountry || profileName}</span>
            </div>
            <p className="text-lg font-medium leading-6 tracking-[-0.198px] text-white">{profileHandle}</p>
          </div>

          {/* Follow / Connect / More */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => showComingSoonToast("featureLaunch")}
              className="h-9.5 flex-1 rounded-full bg-white text-sm font-medium text-black transition hover:bg-[#e8e8e8]"
            >
              Follow
            </button>
            <button
              type="button"
              onClick={() => showComingSoonToast("featureLaunch")}
              className="h-9.5 flex-1 rounded-full border border-[#2e2e2e] bg-[#1a1a1a] text-sm font-medium text-white transition hover:bg-[#222]"
            >
              Connect
            </button>
            <button
              type="button"
              onClick={() => showComingSoonToast("featureLaunch")}
              aria-label="More options"
              className="grid h-9.5 w-9.5 place-items-center rounded-full border border-[#2e2e2e] bg-[#1a1a1a] text-white transition hover:bg-[#222]"
            >
              <span className="grid grid-cols-2 gap-1.5">
                <span className="h-1 w-1 rounded-full bg-white" />
                <span className="h-1 w-1 rounded-full bg-white" />
                <span className="h-1 w-1 rounded-full bg-white" />
                <span className="h-1 w-1 rounded-full bg-white" />
              </span>
            </button>
          </div>

          {/* Country + description */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              {countryFlagSrc ? (
                <img src={countryFlagSrc} alt="" className="h-[1.33125rem] w-8 rounded-[0.204375rem] object-cover" />
              ) : null}
              <p className="text-center font-display text-[1.5rem] font-semibold not-italic leading-[2rem] tracking-[-0.03125rem] text-white">
                {countryName || ""}
              </p>
            </div>
            {description ? (
              <p className="text-base font-normal leading-[1.5rem] tracking-[-0.096px] text-[#dcdcdc] whitespace-pre-wrap">{description}</p>
            ) : null}
          </div>

          {quote ? (
            <div className="border-t border-[#222] pt-6">
              <p className="text-base font-normal leading-[1.5rem] tracking-[-0.096px] text-[#dcdcdc] whitespace-pre-wrap">{quote}</p>
            </div>
          ) : null}
        </aside>
      }
    />
  );
}

// ---------------------------------------------------------------------------
// JsMasonryGrid — CSS columns with stable loading & natural aspect ratios
// ---------------------------------------------------------------------------
type JsMasonryGridProps = {
  items: MediaItem[];
  allMediaItems: MediaItem[];
  profileFlagCode: string;
  profile: SampleProfile;
  openContextMenuId: string | null;
  setOpenContextMenuId: (id: string | null) => void;
  loadedItemIds: Set<string>;
  setLoadedItemIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  openCarouselAt: (index: number) => void;
  openShareCard: (data: ShareCardData) => void;
  contextMenuRef: React.RefObject<HTMLDivElement>;
  shareOwnerName: string;
  shareOwnerHandle: string;
  shareOwnerAvatar: string;
};

function JsMasonryGrid({
  items,
  allMediaItems,
  profileFlagCode,
  profile,
  openContextMenuId,
  setOpenContextMenuId,
  loadedItemIds,
  setLoadedItemIds,
  openCarouselAt,
  openShareCard,
  contextMenuRef,
  shareOwnerName,
  shareOwnerHandle,
  shareOwnerAvatar,
}: JsMasonryGridProps) {
  const { showComingSoonToast } = useMobileComingSoon();
  const orderedItems = items;

  const markItemLoaded = (id: string) => {
    setLoadedItemIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const renderMediaItem = (mediaItem: MediaItem, isMobile = false) => {
    const originalIndex = allMediaItems.findIndex((it) => String(it.id) === String(mediaItem?.id));
    const isMenuOpen = openContextMenuId === mediaItem.id;
    const displayCountryCode = mediaItem.countryCode || profileFlagCode;
    const collectionHref =
      typeof mediaItem.collectionIndex === "number" && profile.collectionImages?.[mediaItem.collectionIndex]
        ? `/${profile.handle.replace(/^@/, "")}/collection/${mediaItem.collectionIndex}`
        : undefined;
    const viewHref = collectionHref || (displayCountryCode
      ? `/${profile.handle.replace(/^@/, "")}/country/${displayCountryCode.toUpperCase()}`
      : undefined);
    const viewLabel = collectionHref ? "View collection" : "View country";
    const isLoaded = loadedItemIds.has(mediaItem.id);

    return (
      <div key={mediaItem.id} className={`group relative w-full ${isMobile ? "mb-[0.375rem] break-inside-avoid [-webkit-column-break-inside:avoid] inline-block" : ""}`}>
        <div
          className="relative rounded-lg md:rounded-2xl overflow-hidden bg-[#151515] cursor-pointer"
          style={{ aspectRatio: mediaItem.width && mediaItem.height ? `${mediaItem.width}/${mediaItem.height}` : "1/1" }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (window.innerWidth < 811) {
              showComingSoonToast();
            } else {
              openCarouselAt(originalIndex);
            }
          }}
        >
          {mediaItem.isVideo ? (
            <>
              <video
                src={toLandingAssetUrl(mediaItem.fileUrl)}
                muted
                playsInline
                loop
                preload="metadata"
                className="w-full h-auto block pointer-events-none"
                onLoadedData={() => markItemLoaded(mediaItem.id)}
                onCanPlay={() => markItemLoaded(mediaItem.id)}
                onError={() => markItemLoaded(mediaItem.id)}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <span className="text-white text-3xl drop-shadow-lg">▶</span>
              </div>
            </>
          ) : (
            <LoadedImage
              src={toLandingAssetUrl(mediaItem.fileUrl)}
              thumbnailSrc={getThumbnailUrl(toLandingAssetUrl(mediaItem.fileUrl), 720)}
              alt="Uploaded media"
              className="w-full h-auto block"
              containerClassName="w-full h-full relative"
              skeletonClassName="absolute inset-0 w-full h-full bg-[#1a1a1a]"
              onLoad={() => markItemLoaded(mediaItem.id)}
            />
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 pointer-events-none" />
        </div>

        <MoreOptionsButton
          isOpen={isMenuOpen}
          label="Open context menu"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpenContextMenuId(isMenuOpen ? null : mediaItem.id);
          }}
        />

        {/* Flag badge (visible after image loads) */}
        {displayCountryCode && isLoaded ? (
          <div className="absolute top-2 right-2 md:top-3 md:right-3 z-20 transition-opacity duration-200 opacity-100 pointer-events-auto">
            <TooltipProvider delayDuration={100}>
              <Tooltip
                content={getCountryName(displayCountryCode.toUpperCase()) || displayCountryCode}
                theme="light"
                side="top"
              >
                <div className="flex items-center drop-shadow-md cursor-pointer">
                  <img
                    src={toFlagAssetPath(displayCountryCode)}
                    alt={displayCountryCode}
                    className="h-3.5 w-5 rounded-xs object-cover"
                  />
                </div>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : null}

        {isMenuOpen && (
          <div
            ref={contextMenuRef}
            role="menu"
            className="absolute right-3 bottom-14 z-50 w-[12.5rem] rounded-2xl border border-[#2e2e2e] bg-[#1a1a1a] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.5)]"
            onClick={(event) => { event.preventDefault(); event.stopPropagation(); }}
          >
            <div className="flex flex-col gap-4">
              {viewHref && (
                <Link
                  href={viewHref}
                  role="menuitem"
                  className="flex w-full items-center gap-3 text-[0.9375rem] font-medium tracking-[-0.3px] text-white hover:text-[#d4d4d4] transition-colors"
                  onClick={(event) => {
                    if (window.innerWidth < 811) {
                      event.preventDefault();
                      showComingSoonToast("featureLaunch");
                    } else {
                      setOpenContextMenuId(null);
                    }
                  }}
                >
                  <span className="material-symbols-rounded text-[1.375rem]">{collectionHref ? "collections" : "public"}</span>
                  <span>{viewLabel}</span>
                </Link>
              )}
              <button
                type="button"
                role="menuitem"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setOpenContextMenuId(null);
                  const shareUrl = new URL(window.location.origin);
                  if (collectionHref?.includes("/collection/")) {
                    shareUrl.pathname = collectionHref;
                  } else if (displayCountryCode) {
                    shareUrl.pathname = `/${profile.handle.replace(/^@/, "")}/country/${displayCountryCode.toUpperCase()}`;
                  } else {
                    shareUrl.pathname = `/${profile.handle.replace(/^@/, "")}`;
                  }
                  shareUrl.searchParams.set("image", btoa(unescape(encodeURIComponent(mediaItem.fileUrl))));
                  openShareCard({
                    kind: "media",
                    title: "Share moment",
                    imageUrl: mediaItem.fileUrl,
                    shareUrl: shareUrl.toString(),
                    flagCode: displayCountryCode,
                    ownerName: shareOwnerName,
                    ownerHandle: shareOwnerHandle,
                    ownerAvatar: shareOwnerAvatar,
                  });
                }}
                className="flex w-full items-center gap-3 text-[0.9375rem] font-medium tracking-[-0.3px] text-white hover:text-[#d4d4d4] transition-colors"
              >
                <span className="material-symbols-rounded text-[1.375rem]">share</span>
                <span>Share media</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Desktop: 4 explicit flex columns */}
      <div className="hidden lg:flex w-full gap-[0.5rem] xl:gap-[0.75rem]">
        {[0, 1, 2, 3].map((colIdx) => (
          <div key={colIdx} className="flex flex-col gap-[0.5rem] xl:gap-[0.75rem] flex-1 min-w-0">
            {orderedItems
              .filter((_, i) => i % 4 === colIdx)
              .map((mediaItem) => renderMediaItem(mediaItem, false))}
          </div>
        ))}
      </div>
      {/* Mobile/tablet: 2-column CSS columns */}
      <div className="lg:hidden columns-2 gap-[0.375rem] w-full">
        {orderedItems.map((mediaItem) => renderMediaItem(mediaItem, true))}
      </div>
    </div>
  );
}

export default function ProfileComponent({ profile }: { profile: SampleProfile }) {
  const { showComingSoonToast } = useMobileComingSoon();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [loadedItemIds, setLoadedItemIds] = useState<Set<string>>(() => new Set());
  const [swipeOffset, setSwipeOffset] = useState(0);

  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateHeaderHeight = () => {
      const header = document.querySelector(".trv-header");
      if (header) {
        setHeaderHeight(header.clientHeight);
      }
    };
    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  // Read initial tab from URL on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const tabParam = url.searchParams.get("tab") as TabKey;
    if (tabParam && ["all", "countries", "collections", "about"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  // Sync tab to URL when it changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (activeTab !== "all") {
      if (url.searchParams.get("tab") !== activeTab) {
        url.searchParams.set("tab", activeTab);
        window.history.replaceState(null, "", url.pathname + url.search);
      }
    } else {
      if (url.searchParams.has("tab")) {
        url.searchParams.delete("tab");
        window.history.replaceState(null, "", url.pathname + url.search);
      }
    }
  }, [activeTab]);
  const [showFollowModal, setShowFollowModal] = useState(false);  // Local states for photo carousels on the cards
  const [openContextMenuId, setOpenContextMenuId] = useState<string | null>(null);

  const [carouselIndex, setCarouselIndex] = useState<number | null>(null);
  const [carouselItems, setCarouselItems] = useState<MediaItem[]>([]);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tab: TabKey) => {
    (window as any).__isProgrammaticScroll = true;
    const scrollBefore = window.scrollY;
    setActiveTab(tab);

    setTimeout(() => {
      const isDesktop = window.innerWidth >= 1200;
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
            targetScrollY = absoluteTop - 120;
          }
        } else {
          // Mobile/iPad
          // The tabs are sticky at 72px, but they might be visually translated UP by the navbar hook.
          // We can find the exact translation by checking the navbar's position.
          const navbarEl = document.getElementById("profile-mobile-navbar");
          const navbarVisualTop = navbarEl ? navbarEl.getBoundingClientRect().top : 0;
          // If navbar is translated up by 72px, navbarVisualTop is -72.
          // The formula: absoluteTop - 72 (sticky offset) - navbarVisualTop.
          targetScrollY = absoluteTop - 72 - navbarVisualTop;
        }

        // Only jump if the user was scrolled past the tabs BEFORE the tab change triggered native browser scrolling
        if (scrollBefore > targetScrollY) {
          window.scrollTo({ top: targetScrollY, behavior: "instant" });
        }
      }

      setTimeout(() => {
        (window as any).__isProgrammaticScroll = false;
        // Dispatch a final scroll event so Desktop LandingHeader re-evaluates the absolute scroll position
        // and correctly applies or removes the 'header-hidden' class, preventing the tabs from moving down incorrectly.
        window.dispatchEvent(new Event('scroll'));
      }, 50);
    }, 10);
  };

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

      // Only track if it's mostly a horizontal swipe
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

      // Ensure it's mostly a horizontal swipe, not a vertical scroll
      if (Math.abs(distanceX) > Math.abs(distanceY) && Math.abs(distanceX) > swipeThreshold) {
        const tabs: TabKey[] = ["all", "countries", "collections", "about"];
        const currentIndex = tabs.indexOf(activeTab);

        if (distanceX > 0) {
          // Swipe left (next tab)
          if (currentIndex < tabs.length - 1) {
            handleTabChange(tabs[currentIndex + 1]);
          }
        } else {
          // Swipe right (previous tab)
          if (currentIndex > 0) {
            handleTabChange(tabs[currentIndex - 1]);
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

  useEffect(() => {
    if (!openContextMenuId) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (contextMenuRef.current && !contextMenuRef.current.contains(target)) {
        setOpenContextMenuId(null);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenContextMenuId(null);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openContextMenuId]);



  const displayName = profile.name;
  const handle = profile.handle.startsWith("@") ? profile.handle : `@${profile.handle}`;
  const basedIn = profile.country;
  const profileFlagCode = profile.flagCode;
  const profileFlagSrc = toFlagAssetPath(profileFlagCode);
  const homelandFlagCode = profile.homelandFlagCode || profile.flagCode;
  const currentlyInFlagCode = profile.currentlyInFlagCode || profile.flagCode;
  const homelandFlagSrc = toFlagAssetPath(homelandFlagCode);
  const currentlyInFlagSrc = toFlagAssetPath(currentlyInFlagCode);

  const allMediaItems = useMemo<MediaItem[]>(() => {
    const buckets: MediaItem[][] = [];

    // Gallery bucket
    if (profile.images.gallery.length > 0) {
      const bucket: MediaItem[] = [];
      profile.images.gallery.forEach((fileEntry) => {
        const isObj = typeof fileEntry !== "string" && fileEntry !== null && typeof fileEntry === "object";
        const url = isObj ? (fileEntry.url as string) : (fileEntry as string);
        bucket.push({
          id: `media-${profile.id}-gallery-${bucket.length}`,
          fileUrl: url,
          isVideo: isVideoAsset(url),
          width: isObj ? (fileEntry.width as number) : undefined,
          height: isObj ? (fileEntry.height as number) : undefined,
        });
      });
      buckets.push(bucket);
    }

    // Country buckets
    (profile.countryImages ?? []).forEach((country, countryIdx) => {
      if (country.images.length > 0) {
        const bucket: MediaItem[] = [];
        country.images.forEach((fileEntry) => {
          const isObj = typeof fileEntry !== "string" && fileEntry !== null && typeof fileEntry === "object";
          const url = isObj ? (fileEntry.url as string) : (fileEntry as string);
          bucket.push({
            id: `media-${profile.id}-country-${countryIdx}-${bucket.length}`,
            fileUrl: url,
            isVideo: isVideoAsset(url),
            countryCode: country.countryCode,
            width: isObj ? (fileEntry.width as number) : undefined,
            height: isObj ? (fileEntry.height as number) : undefined,
          });
        });
        buckets.push(bucket);
      }
    });

    // Collection buckets
    (profile.collectionImages ?? []).forEach((collection, collectionIdx) => {
      if (collection.images.length > 0) {
        const bucket: MediaItem[] = [];
        collection.images.forEach((fileEntry) => {
          const isObj = typeof fileEntry !== "string" && fileEntry !== null && typeof fileEntry === "object";
          const url = isObj ? (fileEntry.url as string) : (fileEntry as string);
          bucket.push({
            id: `media-${profile.id}-collection-${collectionIdx}-${bucket.length}`,
            fileUrl: url,
            isVideo: isVideoAsset(url),
            collectionIndex: collectionIdx,
            width: isObj ? (fileEntry.width as number) : undefined,
            height: isObj ? (fileEntry.height as number) : undefined,
          });
        });
        buckets.push(bucket);
      }
    });

    // 1. Extract the first item from each bucket to defer it
    const deferredItems: MediaItem[] = [];
    for (let i = 0; i < buckets.length; i++) {
      if (buckets[i].length > 0) {
        deferredItems.push(buckets[i].shift()!);
      }
    }

    // 2. Round-robin interleave the remaining items exactly (A2, B2, C2, A3, B3, C3...)
    const items: MediaItem[] = [];
    let found = true;
    while (found) {
      found = false;
      for (let i = 0; i < buckets.length; i++) {
        if (buckets[i].length > 0) {
          items.push(buckets[i].shift()!);
          found = true;
        }
      }
    }

    // 3. Append the deferred first items at the end
    items.push(...deferredItems);

    return items;
  }, [profile.id, profile.images.gallery, profile.countryImages, profile.collectionImages]);

  useEffect(() => {
    if (carouselIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCarouselIndex(null);
      }
      if (event.key === "ArrowLeft") {
        setCarouselIndex((prev) => {
          if (prev === null) return prev;
          return (prev - 1 + carouselItems.length) % Math.max(carouselItems.length, 1);
        });
      }
      if (event.key === "ArrowRight") {
        setCarouselIndex((prev) => {
          if (prev === null) return prev;
          return (prev + 1) % Math.max(carouselItems.length, 1);
        });
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [carouselIndex, carouselItems.length]);

  const headerFlagCodes = useMemo(() => {
    const codes = profile.visitedCountryCodes ?? [];
    return codes.slice(0, 30).map((c) => c.toUpperCase());
  }, [profile.visitedCountryCodes]);

  const allVisitedCountries = useMemo(() => {
    const codes = profile.visitedCountryCodes ?? [];
    return codes.map((c) => ({
      code: c.toUpperCase(),
      name: getCountryName(c) || c
    }));
  }, [profile.visitedCountryCodes]);

  const flagOverflowCount = Math.max(0, (profile.countries ?? 0) - headerFlagCodes.length);

  const desktopRenderedFlagCount = headerFlagCodes.length + (flagOverflowCount > 0 ? 1 : 0);
  const desktopFlagRowCount = Math.ceil(desktopRenderedFlagCount / 12);

  const [viewportWidth, setViewportWidth] = useState<number>(1728);

  useEffect(() => {
    const updateViewport = () => setViewportWidth(window.innerWidth);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
  const progress1200To1440 = clamp((viewportWidth - 1200) / (1440 - 1200), 0, 1);
  const progress1440To1728 = clamp((viewportWidth - 1440) / (1728 - 1440), 0, 1);

  const lerp = (min: number, max: number, t: number) => min + (max - min) * t;

  const shouldUseStrictDesktopGeometry = viewportWidth >= 1200 && viewportWidth <= 1728;

  // Figma anchors:
  // 1200: inset 48, left 500, cover 520.1208 x 538
  // 1440: inset 64, left 600, cover 640 x 662
  // 1728: inset 64, left 537, cover 640 x 662
  const interpolatedDesktopInset = viewportWidth <= 1440
    ? Math.round(lerp(48, 64, progress1200To1440))
    : 64;

  const interpolatedLeftWidth = viewportWidth <= 1440
    ? Math.round(lerp(500, 600, progress1200To1440))
    : Math.round(lerp(600, 537, progress1440To1728));

  const coverBaseWidth = viewportWidth <= 1440
    ? lerp(520.120849609375, 640, progress1200To1440)
    : 640;

  // Keep diagonal scaling by rows only below 1440.
  // At 1440 and above, Figma uses a fixed 640x662 hero cover.
  const rowScaleFactor = viewportWidth >= 1440
    ? 1
    : desktopFlagRowCount >= 3
      ? 1.0625
      : desktopFlagRowCount >= 2
        ? 1
        : 0.9375;
  const interpolatedCoverWidth = Math.round(coverBaseWidth * rowScaleFactor);

  const buttonBaseWidth = viewportWidth <= 1440
    ? Math.round(lerp(132, 148, progress1200To1440))
    : 148;
  const buttonIconSize = viewportWidth <= 1440
    ? Math.round(lerp(44, 48, progress1200To1440))
    : 48;
  const buttonRowWidth = buttonBaseWidth * 2 + buttonIconSize + 24;

  const strictDesktopStyle = shouldUseStrictDesktopGeometry;

  const countryCards = useMemo<CountryCard[]>(() => {
    // Use admin-uploaded country images if available
    if (profile.countryImages && profile.countryImages.length > 0) {
      return profile.countryImages.map((ci, index) => {
        const countryName = COUNTRY_LIST_LOOKUP[ci.countryCode.toUpperCase()] || ci.countryCode;
        const photoPreviewImages = ci.images.filter((url) => !isVideoAsset(typeof url === "string" ? url : url.url)).slice(0, 5);
        const rawPreview = (photoPreviewImages.length > 0 ? photoPreviewImages : ci.images).slice(0, 5);
        let previewImages = rawPreview.map((g) => (typeof g === "string" ? g : g.url));
        if (ci.coverPhoto) {
          previewImages = [ci.coverPhoto, ...previewImages.filter((url) => url !== ci.coverPhoto)];
        }
        return {
          code: `${profile.id}-ci-${index}`,
          name: countryName,
          flagCode: ci.countryCode,
          thumbnailUrl: ci.coverPhoto || previewImages[0] || (typeof profile.images.cover === "string" ? profile.images.cover : profile.images.cover.url),
          previewImages,
          photoCount: ci.images.filter((entry) => !isVideoAsset(typeof entry === "string" ? entry : entry.url)).length,
          videoCount: ci.images.filter((entry) => isVideoAsset(typeof entry === "string" ? entry : entry.url)).length,
        };
      });
    }

    const candidates: { name: string; flagCode: string }[] = [
      { name: basedIn, flagCode: profile.flagCode },
      { name: toLocationCountry(profile.homeland), flagCode: profile.homelandFlagCode || profile.flagCode },
      { name: toLocationCountry(profile.currentlyIn), flagCode: profile.currentlyInFlagCode || profile.flagCode },
    ]
      .map((item) => ({ ...item, name: item.name.trim() }))
      .filter((item) => Boolean(item.name));

    const seen = new Set<string>();
    const unique = candidates.filter(({ name }) => {
      if (seen.has(name)) return false;
      seen.add(name);
      return true;
    });

    const totalPhotos = allMediaItems.filter((m) => !m.isVideo).length;
    const totalVideos = allMediaItems.filter((m) => m.isVideo).length;
    const count = unique.length || 1;

    return unique.map(({ name, flagCode }, index) => {
      const photoFallbacks = allMediaItems.filter((item) => !item.isVideo).map((item) => item.fileUrl);
      const defaultFallbacks = photoFallbacks.length > 0
        ? photoFallbacks
        : allMediaItems.map((item) => item.fileUrl);
      const fallback = defaultFallbacks[index % Math.max(defaultFallbacks.length, 1)] || (typeof profile.images.cover === "string" ? profile.images.cover : profile.images.cover.url);
      const previewImages = defaultFallbacks.length > 0
        ? Array.from({ length: Math.min(5, defaultFallbacks.length) }, (_, imageIndex) => {
          return defaultFallbacks[(index + imageIndex) % defaultFallbacks.length];
        })
        : [(typeof profile.images.cover === "string" ? profile.images.cover : profile.images.cover.url)];
      return {
        code: `${profile.id}-${index}`,
        name,
        flagCode,
        thumbnailUrl: fallback,
        previewImages,
        photoCount: Math.floor(totalPhotos / count),
        videoCount: Math.floor(totalVideos / count),
      };
    });
  }, [allMediaItems, basedIn, profile.images.cover, profile.currentlyIn, profile.flagCode, profile.homelandFlagCode, profile.currentlyInFlagCode, profile.homeland, profile.id, profile.countryImages]);

  const closeAllOverlays = () => {
    setOpenContextMenuId(null);
  };

  useEffect(() => {
    closeAllOverlays();
  }, [profile.id, activeTab]);

  // Sync carousel state to URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (carouselIndex !== null && carouselItems.length > 0) {
      const activeUrl = carouselItems[carouselIndex].fileUrl;
      const encodedUrl = btoa(unescape(encodeURIComponent(activeUrl)));
      if (url.searchParams.get("image") !== encodedUrl) {
        url.searchParams.set("image", encodedUrl);
        window.history.replaceState(null, "", url.pathname + url.search);
      }
    } else {
      if (url.searchParams.has("image")) {
        url.searchParams.delete("image");
        window.history.replaceState(null, "", url.pathname + url.search);
      }
    }
  }, [carouselIndex, carouselItems]);

  const hasReadUrlImage = useRef(false);

  // Read from URL on mount
  useEffect(() => {
    if (typeof window === "undefined" || hasReadUrlImage.current) return;
    if (allMediaItems.length === 0) return;
    hasReadUrlImage.current = true;

    const url = new URL(window.location.href);
    const encodedImage = url.searchParams.get("image");
    if (encodedImage && carouselIndex === null) {
      try {
        const imageUrl = decodeURIComponent(escape(atob(encodedImage)));
        const index = allMediaItems.findIndex((item) => item.fileUrl === imageUrl);
        if (index !== -1) {
          setCarouselItems(allMediaItems);
          setCarouselIndex(index);
        }
      } catch (e) { }
    }
  }, [allMediaItems, carouselIndex, profile.id, profile.flagCode]);

  const shareOwnerName = profile.name;
  const shareOwnerHandle = handle;
  const shareOwnerAvatar = typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url;

  const activeCarouselItem = carouselIndex !== null ? carouselItems[carouselIndex] : null;
  const carouselCountryCode = activeCarouselItem?.countryCode?.toUpperCase();
  const isCollectionItem = activeCarouselItem?.collectionIndex !== undefined;

  const carouselCountryName = carouselCountryCode
    ? COUNTRY_LIST_LOOKUP[carouselCountryCode] || carouselCountryCode
    : isCollectionItem
      ? profile.collectionImages?.[activeCarouselItem.collectionIndex!]?.title
      : basedIn;

  const displayCountryFlagCode = carouselCountryCode
    ? carouselCountryCode
    : isCollectionItem
      ? undefined
      : profile.flagCode;

  const carouselDescription = isCollectionItem
    ? profile.collectionImages?.[activeCarouselItem.collectionIndex!]?.about
    : carouselCountryCode
      ? profile.countryImages?.find((ci) => ci.countryCode.toUpperCase() === carouselCountryCode)?.about
      : profile.bio;
  const carouselQuote = undefined;

  const toShareUrl = (url: string) => {
    if (!url) return url;
    if (/^https?:\/\//i.test(url)) return url;
    return new URL(url, window.location.origin).toString();
  };

  const openShareCard = (data: ShareCardData) => {
    showComingSoonToast("featureLaunch");
    setOpenContextMenuId(null);
  };

  const openCarouselAt = (index: number) => {
    if (allMediaItems.length === 0) return;
    setCarouselItems(allMediaItems);
    setCarouselIndex(index);
    setOpenContextMenuId(null);
  };

  const closeCarousel = () => {
    setCarouselIndex(null);
    setCarouselItems([]);
  };

  const goToNextCarouselItem = () => {
    setCarouselIndex((prev) => {
      if (prev === null) return prev;
      return (prev + 1) % Math.max(carouselItems.length, 1);
    });
  };

  const goToPrevCarouselItem = () => {
    setCarouselIndex((prev) => {
      if (prev === null) return prev;
      return (prev - 1 + Math.max(carouselItems.length, 1)) % Math.max(carouselItems.length, 1);
    });
  };

  const collectionCards = useMemo<CollectionCard[]>(() => {
    const allCountryNames = countryCards.map((country) => country.name);
    const fallbackVisibleCountries = allCountryNames.slice(0, 3);
    const fallbackOverflowCount = Math.max(0, allCountryNames.length - fallbackVisibleCountries.length);

    // Use admin-uploaded collection images if available
    if (profile.collectionImages && profile.collectionImages.length > 0) {
      return profile.collectionImages.map((ci, index) => {
        const photoPreviewImages = ci.images.filter((entry) => !isVideoAsset(typeof entry === "string" ? entry : entry.url)).slice(0, 5);
        const rawPreview = (photoPreviewImages.length > 0 ? photoPreviewImages : ci.images).slice(0, 5);
        let previewImages = rawPreview.map((g) => (typeof g === "string" ? g : g.url));
        if (ci.coverPhoto) {
          previewImages = [ci.coverPhoto, ...previewImages.filter((url) => url !== ci.coverPhoto)];
        }
        const selectedCountries = (ci.countryCodes ?? [])
          .map((code) => COUNTRY_LIST_LOOKUP[code.toUpperCase()] || code.toUpperCase())
          .filter(Boolean);
        const visibleCountries = selectedCountries.slice(0, 3);
        const countryOverflowCount = Math.max(0, selectedCountries.length - visibleCountries.length);
        return {
          id: `${profile.id}-collection-${index}`,
          title: ci.title,
          description: profile.bio,
          createdLabel: getDeterministicCreatedLabel(index),
          thumbnailUrl: ci.coverPhoto || previewImages[0] || (typeof profile.images.cover === "string" ? profile.images.cover : profile.images.cover.url),
          previewImages,
          countries: selectedCountries.length > 0 ? visibleCountries : fallbackVisibleCountries,
          countryOverflowCount: selectedCountries.length > 0 ? countryOverflowCount : fallbackOverflowCount,
        };
      });
    }

    return [];
  }, [countryCards, profile.bio, profile.images.cover, profile.id, profile.collectionImages]);

  const aboutPhotos = useMemo(() => {
    return (profile.aboutImages ?? [])
      .filter((url) => Boolean(url) && !isVideoAsset(url))
      .slice(0, 4);
  }, [profile.aboutImages]);

  const featuredProfiles = useMemo(() => {
    const candidates = sampleProfiles.filter((item) => item.id !== profile.id);
    if (candidates.length === 0) return [];

    const normalizedInterests = new Set(
      (profile.interests ?? [])
        .map((interest) => interest.trim().toLowerCase())
        .filter(Boolean)
    );

    const scored = candidates.map((candidate) => {
      const score = (candidate.interests ?? []).reduce((acc, interest) => {
        const normalized = interest.trim().toLowerCase();
        return acc + (normalizedInterests.has(normalized) ? 1 : 0);
      }, 0);
      return { candidate, score };
    });

    const sorted = [...scored].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.candidate.name.localeCompare(b.candidate.name);
    });

    const preferred = normalizedInterests.size > 0
      ? sorted.filter((item) => item.score > 0)
      : sorted;

    const list = (preferred.length > 0 ? preferred : sorted)
      .slice(0, 3)
      .map((item) => item.candidate);

    return list;
  }, [profile.id, profile.interests]);

  const socialRows = useMemo(() => {
    const { x, instagram, linkedin, youtube } = profile.socials;
    const rows: { key: string; label: string; url: string }[] = [];
    if (x) rows.push({ key: "x", label: x, url: `https://x.com/${x}` });
    if (instagram) rows.push({ key: "instagram", label: instagram, url: `https://instagram.com/${instagram}` });
    if (linkedin) rows.push({ key: "linkedin", label: linkedin, url: `https://linkedin.com/in/${linkedin}` });
    if (youtube) rows.push({ key: "youtube", label: youtube, url: `https://youtube.com/@${youtube}` });
    return rows;
  }, [profile.socials]);

  const hasAboutContent =
    Boolean(profile.bio) ||
    aboutPhotos.length > 0 ||
    profile.interests.length > 0 ||
    profile.languages.length > 0 ||
    socialRows.length > 0 ||
    Boolean(profile.homeland) ||
    Boolean(profile.currentlyIn);

  const fixedProfile = {
    ...profile,
    collections: collectionCards.length,
  };

  return (
    <>
      <div
        className="bg-black text-white flex flex-col items-center px-2 pt-2 min-[50.625rem]:pt-23 min-[75rem]:pt-0 min-[50.625rem]:px-8 min-[90rem]:px-16"
        style={
          strictDesktopStyle
            ? {
              paddingLeft: `${interpolatedDesktopInset}px`,
              paddingRight: `${interpolatedDesktopInset}px`,
            }
            : undefined
        }
      >

        <main className="w-full max-w-[108rem] pb-1 md:pb-20 flex flex-col gap-3 min-[75rem]:gap-0">
          <MobileHero
            profile={fixedProfile}
            displayName={displayName}
            handle={handle}
            basedIn={basedIn}
            profileFlagCode={profileFlagCode}
            profileFlagSrc={profileFlagSrc}
            headerFlagCodes={headerFlagCodes}
            flagOverflowCount={flagOverflowCount}
          />


          <section className="hidden min-[75rem]:flex items-end justify-between gap-6 w-full pb-8">
            <div
              className="w-full max-w-[48%] lg:max-w-[31.25rem] xl:max-w-[33.5625rem] shrink flex flex-col items-start justify-start gap-6 lg:gap-8 xl:gap-10 pt-6 lg:pt-10 xl:pt-12"
              style={strictDesktopStyle ? { width: `${interpolatedLeftWidth}px`, maxWidth: `${interpolatedLeftWidth}px` } : undefined}
            >
              <div className="flex flex-col items-start gap-4 lg:gap-6 xl:gap-8 w-full">
                <div className="flex flex-col items-start gap-3 lg:gap-4 xl:gap-8 w-full">
                  <div className="relative size-16 lg:size-[6.25rem] xl:size-[7.5rem] shrink-0 overflow-hidden rounded-[1.25rem] bg-[#151515]">
                    <LoadedImage
                      src={toLandingAssetUrl(typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url)}
                      thumbnailSrc={getOptimizedMediaUrl(toLandingAssetUrl(typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url))}
                      alt="Profile avatar"
                      className="h-full w-full object-cover rounded-[1.25rem]"
                      skeletonClassName="absolute inset-0 bg-[#1a1a1a]"
                      containerClassName="w-full h-full"
                    />
                  </div>

                  <div className="flex flex-col items-center w-full shrink-0">
                    <div className="flex flex-col items-start w-full gap-3">
                      <div className="flex items-center gap-2 text-white-400 text-xs lg:text-base xl:text-lg tracking-[-0.198px] leading-[1.625rem] w-full">
                        {profileFlagSrc ? (
                          <img
                            src={profileFlagSrc}
                            alt={`${basedIn} flag`}
                            className="h-3 w-4.5 lg:h-4 lg:w-6 xl:h-4 xl:w-6 rounded-[0.25rem] object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <span>{profileFlagCode}</span>
                        )}
                        <span>{basedIn}</span>
                      </div>

                      <h1 className="ds-font-display text-2xl lg:text-4xl xl:text-[2.75rem] leading-tight xl:leading-[3.25rem] tracking-[-0.5px] font-semibold text-white w-full">{displayName}</h1>

                      <div className="flex items-center gap-2 w-full">
                        <p className="ds-font-display text-white-400 text-base lg:text-xl xl:text-2xl leading-normal xl:leading-[2rem] tracking-[-0.5px] font-normal">{handle}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-wrap content-start items-start gap-1.5 lg:gap-2 xl:w-[30rem] xl:gap-2">
                  <TooltipProvider delayDuration={100}>
                    {headerFlagCodes.map((code, index) => {
                      const countryName = getCountryName(code);
                      return (
                        <Tooltip key={`${code}-${index}`} content={countryName} theme="light" side="top">
                          <img
                            src={toFlagAssetPath(code) || ""}
                            alt={`${countryName} flag`}
                            className="h-3 w-4.5 lg:h-4 lg:w-6 xl:h-5 xl:w-7.5 rounded-xs object-cover shrink-0 cursor-pointer"
                            loading="lazy"
                            decoding="async"
                          />
                        </Tooltip>
                      );
                    })}
                  </TooltipProvider>
                  {flagOverflowCount > 0 && (
                    <CountriesPopup
                      countries={allVisitedCountries}
                      trigger={
                        <div className="flex h-3 w-4.5 lg:h-4 lg:w-6 xl:h-5 xl:w-7.5 shrink-0 items-center justify-center overflow-hidden rounded-xs bg-white cursor-pointer hover:opacity-80 transition-opacity">
                          <span className="font-medium text-violet-600 text-[0.5rem] lg:text-[0.625rem] xl:text-xs text-center tracking-[-0.408px] whitespace-nowrap">
                            +{flagOverflowCount}
                          </span>
                        </div>
                      }
                    />
                  )}
                </div>

                <div className="flex min-h-[6.25rem] items-center justify-between xl:justify-start xl:gap-10 w-full rounded-[1rem] border-l border-black-100 bg-linear-to-r from-[#1c1c1c] to-[rgba(0,0,0,0.1)] px-2 py-2 lg:px-3 lg:py-3 xl:px-4 xl:py-5">
                  <div className="flex items-center gap-1.5 lg:gap-2 xl:gap-4 rounded-xl">
                    <div className="relative size-8 lg:size-12 xl:size-15 shrink-0">
                      <img
                        src="/images/Globe.png"
                        alt="Globe icon"
                        className="pointer-events-none absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-contain"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5 xl:gap-1">
                      <p className="ds-font-display text-base lg:text-xl xl:text-2xl leading-tight xl:leading-[2rem] tracking-[-0.5px] text-white font-semibold">{profile.countries}</p>
                      <p className="text-[0.625rem] lg:text-xs xl:text-sm leading-tight xl:leading-[1.25rem] tracking-[-0.084px] text-white-400 font-normal">Countries</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 lg:gap-2 xl:gap-4 rounded-xl">
                    <div className="relative size-8 lg:size-12 xl:size-15 shrink-0">
                      <img
                        src="/images/media.png"
                        alt="Media icon"
                        className="pointer-events-none absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-contain"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5 xl:gap-1">
                      <p className="ds-font-display text-base lg:text-xl xl:text-2xl leading-tight xl:leading-[2rem] tracking-[-0.5px] text-white font-semibold">{profile.media}</p>
                      <p className="text-[0.625rem] lg:text-xs xl:text-sm leading-tight xl:leading-[1.25rem] tracking-[-0.084px] text-white-400 font-normal">All media</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 lg:gap-2 xl:gap-4 rounded-xl">
                    <div className="relative size-8 lg:size-12 xl:size-15 shrink-0">
                      <img
                        src="/images/collections.png"
                        alt="Collections icon"
                        className="pointer-events-none absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-contain"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5 xl:gap-1">
                      <p className="ds-font-display text-base lg:text-xl xl:text-2xl leading-tight xl:leading-[2rem] tracking-[-0.5px] text-white font-semibold">{fixedProfile.collections}</p>
                      <p className="text-[0.625rem] lg:text-xs xl:text-sm leading-tight xl:leading-[1.25rem] tracking-[-0.084px] text-white-400 font-normal">Collections</p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="mt-auto flex items-center gap-3 w-[23rem]"
                style={strictDesktopStyle ? { width: `${buttonRowWidth}px` } : undefined}
              >
                <button
                  onClick={() => showComingSoonToast("featureLaunch")}
                  className="flex items-center justify-center flex-1 lg:flex-none w-auto lg:w-[9.25rem] lg:h-12 rounded-full bg-white text-black px-3 py-1.5 text-xs lg:text-base font-medium tracking-[-0.096px] hover:bg-[#ececec] transition"
                  style={strictDesktopStyle ? { width: `${buttonBaseWidth}px`, height: `${buttonIconSize}px` } : undefined}
                >
                  Follow
                </button>
                <button
                  onClick={() => showComingSoonToast("featureLaunch")}
                  className="flex items-center justify-center flex-1 lg:flex-none w-auto lg:w-[9.25rem] lg:h-12 rounded-full border border-[#353535] bg-[#1a1a1a] text-white px-3 py-1.5 text-xs lg:text-base font-medium tracking-[-0.096px] hover:bg-[#242424] transition"
                  style={strictDesktopStyle ? { width: `${buttonBaseWidth}px`, height: `${buttonIconSize}px` } : undefined}
                >
                  Connect
                </button>
                <button
                  onClick={() => showComingSoonToast("featureLaunch")}
                  className="size-8 lg:size-12 shrink-0 grid place-items-center rounded-full border border-[#353535] bg-[#1a1a1a] text-white hover:bg-[#242424] transition"
                  aria-label="More options"
                  style={strictDesktopStyle ? { width: `${buttonIconSize}px`, height: `${buttonIconSize}px` } : undefined}
                >
                  <span className="grid grid-cols-2 gap-1 lg:gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-white" />
                    <span className="h-1 w-1 rounded-full bg-white" />
                    <span className="h-1 w-1 rounded-full bg-white" />
                    <span className="h-1 w-1 rounded-full bg-white" />
                  </span>
                </button>
              </div>
            </div>

            {/* Cover image — maintains exact aspect ratio */}
            <div className="w-full max-w-[48%] shrink-0 flex justify-end self-end">
              <div
                className="relative w-full max-w-[40rem] shrink-0 overflow-visible rounded-3xl lg:rounded-[1.5rem] xl:rounded-[2rem] aspect-[640/662] bg-[#151515]"
                style={strictDesktopStyle ? { width: `${interpolatedCoverWidth}px`, maxWidth: `${interpolatedCoverWidth}px` } : undefined}
              >
                <div className="absolute inset-0 overflow-hidden rounded-3xl lg:rounded-[1.5rem] xl:rounded-[2rem]">
                  <LoadedImage
                    src={toLandingAssetUrl(typeof profile.images.cover === "string" ? profile.images.cover : profile.images.cover.url)}
                    thumbnailSrc={getOptimizedMediaUrl(toLandingAssetUrl(typeof profile.images.cover === "string" ? profile.images.cover : profile.images.cover.url))}
                    alt="Profile cover"
                    className="absolute inset-0 w-full h-full object-cover rounded-3xl lg:rounded-[1.5rem] xl:rounded-[2rem]"
                    skeletonClassName="absolute inset-0 bg-[#1a1a1a]"
                    containerClassName="absolute inset-0 w-full h-full"
                  />
                </div>
                {/* Founding Explorer badge — half outside the left edge of the cover */}
                {profile.showBadge && (
                  <img
                    src="/icons/badge.svg"
                    alt="Founding Explorer"
                    className="absolute z-10 w-[9.375rem] h-[9.375rem] pointer-events-none select-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
                    style={{ top: "40px", left: "0", transform: "translateX(-50%)" }}
                    draggable={false}
                  />
                )}
                
                {/* Sample Profile Indicator */}
                {profile.isSampleProfile && (
                  <div
                    className="absolute z-10 text-white pointer-events-none select-none font-medium leading-none whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
                    style={{
                      fontSize: "14px",
                      bottom: "20px",
                      right: "20px",
                    }}
                  >
                    Sample Profile
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Desktop: pill tabs with text */}
          <div id="desktop-tabs-sentinel" className="w-full h-0" />
          <div
            id="profile-desktop-tabs"
            className={`hidden min-[75rem]:flex items-center justify-center gap-2 flex-wrap sticky z-header pt-8 pb-8 -mx-4 px-4 lg:-mx-8 lg:px-8 xl:-mx-10 xl:px-10 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] top-[7.5rem] [.header-hidden_&]:top-0`}
          >
            {/* Background gradient and progressive blur */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                zIndex: -1,
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.00) 100%)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)'
              }}
            />
            <button
              onClick={() => handleTabChange("all")}
              className={`rounded-full px-6 py-2 text-base leading-6 tracking-[-0.096px] transition ${activeTab === "all"
                ? "bg-black-600 border border-white text-white font-medium"
                : "bg-black-800 border border-transparent text-white-300 font-normal"
                }`}
            >
              All media
            </button>
            <button
              onClick={() => handleTabChange("countries")}
              className={`rounded-full px-6 py-2 text-base leading-6 tracking-[-0.096px] transition ${activeTab === "countries"
                ? "bg-black-600 border border-white text-white font-medium"
                : "bg-black-800 border border-transparent text-white-300 font-normal"
                }`}
            >
              Countries
            </button>
            <button
              onClick={() => handleTabChange("collections")}
              className={`rounded-full px-6 py-2 text-base leading-6 tracking-[-0.096px] transition ${activeTab === "collections"
                ? "bg-black-600 border border-white text-white font-medium"
                : "bg-black-800 border border-transparent text-white-300 font-normal"
                }`}
            >
              Collections
            </button>
            <button
              onClick={() => handleTabChange("about")}
              className={`rounded-full px-6 py-2 text-base leading-6 tracking-[-0.096px] transition ${activeTab === "about"
                ? "bg-black-600 border border-white text-white font-medium"
                : "bg-black-800 border border-transparent text-white-300 font-normal"
                }`}
            >
              About me
            </button>
          </div>

          <div className="flex flex-col gap-3 w-full">
            {/* Mobile/iPad: icon-only tabs with sliding underline indicator */}
            <div id="mobile-tabs-sentinel" className="w-full h-0" />
            <MobileTabs activeTab={activeTab} setActiveTab={handleTabChange} swipeOffset={swipeOffset} />

            <div
              className="flex flex-col flex-1 min-h-screen"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className={activeTab === "all" ? "block animate-tab-dissolve" : "hidden"}>
                {
                  <section className="pb-0">
                    {allMediaItems.length === 0 ? (
                      <div className="max-w-xl mx-auto flex flex-col items-center gap-5 text-center py-10">
                        <h2 className="text-3xl leading-none tracking-[-0.5px] font-semibold text-white">All media</h2>
                        <p className="text-white-500 text-sm leading-[1.4]">
                          Add media to a country or collection to start building your gallery.
                        </p>
                      </div>
                    ) : (
                      <JsMasonryGrid
                        items={allMediaItems}
                        allMediaItems={allMediaItems}
                        profileFlagCode={profileFlagCode}
                        profile={profile}
                        openContextMenuId={openContextMenuId}
                        setOpenContextMenuId={setOpenContextMenuId}
                        loadedItemIds={loadedItemIds}
                        setLoadedItemIds={setLoadedItemIds}
                        openCarouselAt={openCarouselAt}
                        openShareCard={openShareCard}
                        contextMenuRef={contextMenuRef as React.RefObject<HTMLDivElement>}
                        shareOwnerName={shareOwnerName}
                        shareOwnerHandle={shareOwnerHandle}
                        shareOwnerAvatar={shareOwnerAvatar}
                      />
                    )}

                  </section>
                }
              </div>

              <div className={activeTab === "countries" ? "block animate-tab-dissolve" : "hidden"}>
                {
                  <section className="pb-0">
                    {countryCards.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-[#2b2b2b] bg-[#0e0e0e] p-10 md:p-16">
                        <div className="max-w-150 mx-auto flex flex-col items-center gap-6 text-center">
                          <div className="flex items-center gap-3">
                            {COUNTRIES_EMPTY_PREVIEW_IMAGES.map((src, idx) => (
                              <div key={src} className="w-19 h-19 md:w-25 md:h-25 rounded-[0.625rem] overflow-hidden">
                                <LoadedImage
                                  src={toLandingAssetUrl(src)}
                                  thumbnailSrc={getThumbnailUrl(toLandingAssetUrl(src), 720)}
                                  alt={`Country preview ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                  containerClassName="w-full h-full"
                                  skeletonClassName="absolute inset-0"
                                />
                              </div>
                            ))}
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-white text-2xl leading-[1.4] tracking-[-0.41px] font-semibold">Add your first country</h3>
                            <p className="text-[#a8a8a8] text-base leading-normal tracking-[-0.41px]">
                              Start with your favorite country - you can add the rest later.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-4 md:gap-x-5 md:gap-y-10">
                        {countryCards.map((country, index) => {
                          const contextMenuId = `country-${country.code}`;
                          const isMenuOpen = openContextMenuId === contextMenuId;
                          const countryHref = `/${profile.handle.replace(/^@/, "")}/country/${country.flagCode.toUpperCase()}`;
                          return (
                            <Link
                              key={country.code}
                              href={countryHref}
                              className="flex flex-col gap-2.5"
                              onClick={(e) => {
                                if (window.innerWidth < 811) {
                                  e.preventDefault();
                                  showComingSoonToast();
                                }
                              }}
                            >
                              {/* Photo */}
                              <div className="relative group">
                                <CardCarousel
                                  images={country.previewImages.length > 0 ? country.previewImages : [country.thumbnailUrl]}
                                  alt={country.name}
                                  priority={index < 4}
                                />

                                <MoreOptionsButton
                                  isOpen={isMenuOpen}
                                  label={`Open menu for ${country.name}`}
                                  size="sm"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    setOpenContextMenuId(isMenuOpen ? null : contextMenuId);
                                  }}
                                />

                                {isMenuOpen ? (
                                  <ContextMenu
                                    kind="country"
                                    viewLabel="View country"
                                    shareLabel="Share country"
                                    flagCode={country.flagCode}
                                    viewHref={countryHref}
                                    onShare={() => {
                                      openShareCard({
                                        kind: "country",
                                        title: `Share ${country.name}`,
                                        imageUrl: toLandingAssetUrl(country.previewImages[0] || country.thumbnailUrl),
                                        shareUrl: toShareUrl(countryHref),
                                        flagCode: country.flagCode,
                                        ownerName: shareOwnerName,
                                        ownerHandle: shareOwnerHandle,
                                        ownerAvatar: shareOwnerAvatar,
                                      });
                                    }}
                                    onClose={() => setOpenContextMenuId(null)}
                                    menuRef={contextMenuRef as React.RefObject<HTMLDivElement>}
                                  />
                                ) : null}
                              </div>

                              {/* Country info */}
                              <div className="flex flex-col gap-1 md:gap-2 px-1 md:px-2 pt-0.5 md:pt-1.5">
                                <div className="flex items-center gap-1.5 md:gap-2.5">
                                  <div className="h-[0.6875rem] w-4 md:h-[0.9375rem] md:w-5.5 overflow-hidden rounded-[0.125rem] drop-shadow-[1.2px_1.2px_0.6px_rgba(0,0,0,0.18)] shrink-0">
                                    <img
                                      src={`/flags/${country.flagCode.toUpperCase()}.svg`}
                                      alt={country.name}
                                      className="block w-full h-full object-cover"
                                    />
                                  </div>
                                  <p className="text-white text-sm md:text-lg font-medium leading-[1.25rem] md:leading-[1.5rem] tracking-[-0.084px] md:tracking-[-0.2px] truncate">
                                    {country.name}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 md:gap-1.5">
                                  <span className="text-[#646464] text-xs md:text-sm leading-[1rem] md:leading-[1.25rem]">{country.photoCount} photos</span>
                                  <span className="text-[#646464] text-xs md:text-sm leading-[1rem] md:leading-[1.25rem]">&bull;</span>
                                  <span className="text-[#646464] text-xs md:text-sm leading-[1rem] md:leading-[1.25rem]">{country.videoCount} Videos</span>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </section>
                }
              </div>

              <div className={activeTab === "collections" ? "block animate-tab-dissolve" : "hidden"}>
                {
                  <section className="w-full pb-8 md:pb-12 space-y-6">
                    {collectionCards.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-[#2b2b2b] bg-[#0e0e0e] px-6 py-12 md:px-10 md:py-16">
                        <div className="max-w-150 mx-auto flex flex-col items-center gap-6 text-center">
                          <div className="flex items-center gap-3">
                            {COLLECTIONS_EMPTY_PREVIEW_IMAGES.map((src, idx) => (
                              <div key={src} className="w-19 h-19 md:w-25 md:h-25 rounded-[0.625rem] overflow-hidden">
                                <LoadedImage
                                  src={toLandingAssetUrl(src)}
                                  thumbnailSrc={getThumbnailUrl(toLandingAssetUrl(src), 720)}
                                  alt={`Collection preview ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                  containerClassName="w-full h-full"
                                  skeletonClassName="absolute inset-0"
                                />
                              </div>
                            ))}
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-white text-2xl leading-[1.4] tracking-[-0.41px] font-semibold">Your collections</h3>
                            <p className="text-[#a8a8a8] text-base leading-normal tracking-[-0.41px] max-w-140">
                              Group photos and videos by theme - not location.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {collectionCards.map((collection, idx) => {
                          const collectionHref = `/${profile.handle.replace(/^@/, "")}/collection/${idx}`;
                          const contextMenuId = `collection-${collection.id}`;
                          const isMenuOpen = openContextMenuId === contextMenuId;
                          return (
                            <Link
                              key={collection.id}
                              href={collectionHref}
                              className="flex flex-col gap-4 md:gap-5"
                              onClick={(e) => {
                                if (window.innerWidth < 811) {
                                  e.preventDefault();
                                  showComingSoonToast();
                                }
                              }}
                            >
                              <div className="relative group">
                                <CardCarousel
                                  images={collection.previewImages.length > 0 ? collection.previewImages : [collection.thumbnailUrl]}
                                  alt={collection.title}
                                  containerClassName="aspect-[357/278] border border-[#262626]"
                                />

                                <MoreOptionsButton
                                  isOpen={isMenuOpen}
                                  label={`Open menu for ${collection.title}`}
                                  size="sm"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    setOpenContextMenuId(isMenuOpen ? null : contextMenuId);
                                  }}
                                />

                                {isMenuOpen ? (
                                  <ContextMenu
                                    kind="collection"
                                    viewLabel="View collection"
                                    shareLabel="Share collection"
                                    viewHref={collectionHref}
                                    onShare={() => {
                                      openShareCard({
                                        kind: "collection",
                                        title: `Share ${collection.title}`,
                                        imageUrl: toLandingAssetUrl(collection.previewImages[0] || collection.thumbnailUrl),
                                        shareUrl: toShareUrl(collectionHref),
                                        ownerName: shareOwnerName,
                                        ownerHandle: shareOwnerHandle,
                                        ownerAvatar: shareOwnerAvatar,
                                      });
                                    }}
                                    onClose={() => setOpenContextMenuId(null)}
                                    menuRef={contextMenuRef as React.RefObject<HTMLDivElement>}
                                  />
                                ) : null}
                              </div>

                              <div className="flex flex-col px-1 md:px-2 gap-3 md:gap-4">
                                <div className="flex flex-col gap-1 md:gap-2">
                                  <p className="text-[#646464] text-xs md:text-sm leading-[1rem] md:leading-[1.25rem] tracking-normal">{collection.createdLabel}</p>
                                  <p className="text-white text-sm md:text-lg font-medium leading-[1.25rem] md:leading-[1.5rem] tracking-[-0.084px] md:tracking-[-0.2px] min-w-full w-min line-clamp-1">{collection.title}</p>
                                </div>
                                {/* Hidden countries for now as per design request until Admin CMS supports collection country multi-select */}
                                <div className="flex flex-wrap items-center gap-1.5">
                                  {collection.countries.map((country) => (
                                    <span
                                      key={`${collection.id}-${country}`}
                                      className="backdrop-blur-[0.125rem] bg-[#161616] border border-[#252525] border-solid flex items-center justify-center py-1 px-2 rounded-full text-[#989898] text-xs leading-[1rem] font-normal tracking-normal"
                                    >
                                      {country}
                                    </span>
                                  ))}
                                  {collection.countryOverflowCount > 0 ? (
                                    <span className="backdrop-blur-[0.125rem] bg-[#161616] border border-[#252525] border-solid flex items-center justify-center py-1 px-2 rounded-full text-[#989898] text-xs leading-[1rem] font-normal tracking-normal">
                                      +{collection.countryOverflowCount}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </section>
                }
              </div>

              <div className={activeTab === "about" ? "block animate-tab-dissolve" : "hidden"}>
                {
                  hasAboutContent ? (
                    <section className="w-full max-w-[69.5rem] mx-auto grid md:grid-cols-[minmax(0,1fr)_320px] lg:grid-cols-[minmax(0,1fr)_360px] gap-8 items-stretch">
                      <article className="relative min-w-0 md:rounded-[1.25rem] md:border md:border-[#1e1e1e] md:pt-8 md:pb-10 md:px-8 md:bg-[#111] flex flex-col gap-8">
                        <div className="flex flex-col gap-6 px-1 py-2 md:px-0 md:py-0">
                          <div className="flex flex-col gap-2">
                            <h3 className="ds-font-display text-white text-xl md:text-2xl font-medium md:font-semibold tracking-[-0.5px] leading-7 md:leading-8">About</h3>
                            <p className="text-white md:text-[#dcdcdc] text-base leading-6 tracking-[-0.096px]">{profile.bio || "No bio yet."}</p>
                          </div>

                          <div
                            className="flex flex-nowrap gap-2 md:gap-3 overflow-x-auto no-scrollbar snap-x w-full"
                            onTouchStart={(e) => e.stopPropagation()}
                            onTouchMove={(e) => e.stopPropagation()}
                            onTouchEnd={(e) => e.stopPropagation()}
                          >
                            {aboutPhotos.length > 0 ? (
                              aboutPhotos.map((src, idx) => (
                                <div key={`${src}-${idx}`} className="w-[10rem] md:w-auto md:flex-1 shrink-0 min-w-0 rounded-[0.5rem] md:rounded-[0.75rem] overflow-hidden bg-[#151515] aspect-square snap-start">
                                  <ThumbnailImage originalSrc={toLandingAssetUrl(src)} size={720} alt={`About photo ${idx + 1}`} loading="eager" decoding="async" draggable={false} className="w-full h-full object-cover pointer-events-none select-none" />
                                </div>
                              ))
                            ) : (
                              <div className="flex-1 rounded-[0.75rem] border border-dashed border-[#1e1e1e] bg-[#111] p-6 text-sm text-[#989898] text-center">
                                No photos added yet.
                              </div>
                            )}
                          </div>
                        </div>

                        <hr className="border-t border-[#1e1e1e] w-full m-0" />

                        <div className="flex flex-col gap-3 md:gap-6">
                          <h4 className="ds-font-display text-white text-xl md:text-2xl font-medium md:font-semibold tracking-[-0.5px] leading-7 md:leading-8">My Interests</h4>
                          {profile.interests.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {profile.interests.map((interest) => (
                                <span key={interest} className="flex items-center gap-1.5 pl-2.5 pr-3 py-1.5 md:pl-3 md:pr-4 md:py-2 rounded-[4.25rem] bg-[#1e1e1e] text-white text-sm md:text-base leading-[1.25rem] md:leading-6 tracking-[-0.084px] md:tracking-[-0.096px]">
                                  {interest}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[#989898] text-sm">No interests added yet.</p>
                          )}
                        </div>
                      </article>

                      <aside className="rounded-[1rem] border border-[#1e1e1e] p-6 bg-[#111] flex flex-col gap-5">
                        <div className="flex flex-col gap-2 pb-6 border-b border-[#1e1e1e]">
                          <p className="text-[#989898] text-sm font-normal leading-5 tracking-[-0.084px]">Username</p>
                          <div className="flex flex-col gap-1">
                            <p className="ds-font-display text-white text-lg font-medium leading-6.5 tracking-[-0.198px]">{handle}</p>
                            <div className="flex gap-1.5 items-center">
                              <p className="text-[#656565] text-sm truncate tracking-[-0.41px]">travingat.com/{handle.replace(/^@/, "")}</p>
                              <CopyButton text={`travingat.com/${handle.replace(/^@/, "")}`} />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-6 md:gap-5">
                          <div className="flex flex-col gap-2 md:gap-3">
                            <p className="text-[#989898] text-sm font-normal leading-5 tracking-[-0.084px]">Home land</p>
                            <div className="flex items-center gap-1.5 md:gap-2 text-white text-base font-medium tracking-[-0.096px]">
                              {homelandFlagSrc ? (
                                <img
                                  src={homelandFlagSrc}
                                  alt={`${toLocationCountry(profile.homeland)} flag`}
                                  className="h-[0.975rem] w-6 shrink-0 rounded-[0.125rem] object-cover"
                                  loading="lazy"
                                  decoding="async"
                                />
                              ) : (
                                <span>{homelandFlagCode}</span>
                              )}
                              <span className="truncate">{profile.homeland}</span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 md:gap-3">
                            <p className="text-[#989898] text-sm font-normal leading-5 tracking-[-0.084px]">Currently in</p>
                            <div className="flex items-center gap-1.5 md:gap-2 text-white text-base font-medium tracking-[-0.096px]">
                              {currentlyInFlagSrc ? (
                                <img
                                  src={currentlyInFlagSrc}
                                  alt={`${toLocationCountry(profile.currentlyIn)} flag`}
                                  className="h-[0.975rem] w-6 shrink-0 rounded-[0.125rem] object-cover"
                                  loading="lazy"
                                  decoding="async"
                                />
                              ) : (
                                <span>{currentlyInFlagCode}</span>
                              )}
                              <span className="truncate">{profile.currentlyIn}</span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 md:gap-3">
                            <p className="text-[#989898] text-sm font-normal leading-5 tracking-[-0.084px]">Speaks</p>
                            {profile.languages.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5 md:gap-2">
                                {profile.languages.map((language) => (
                                  <span key={language} className="px-3.5 py-1.5 rounded-full bg-[#111] border border-[#1e1e1e] text-white text-sm leading-5 tracking-[-0.084px]">
                                    {language}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[#989898] text-sm">—</p>
                            )}
                          </div>

                          <div className="flex flex-col gap-3">
                            <p className="text-[#989898] text-sm font-normal leading-5 tracking-[-0.084px]">Find me On</p>
                            {socialRows.length > 0 ? (
                              <div className="flex flex-col gap-4 min-w-0">
                                {socialRows.map((item) => (
                                  <a
                                    key={item.key}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-white text-base font-medium leading-6 tracking-[-0.096px] hover:opacity-80 transition"
                                  >
                                    <SocialIcon platform={item.key} className="h-5 w-5 shrink-0" />
                                    <span className="truncate">{item.label}</span>
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[#989898] text-sm">—</p>
                            )}
                          </div>
                        </div>
                      </aside>
                    </section>
                  ) : (
                    <section className="w-full pb-8 md:pb-12">
                      <div className="rounded-2xl border border-dashed border-[#2b2b2b] bg-[#0e0e0e] px-6 py-12 md:px-10 md:py-16">
                        <div className="max-w-150 mx-auto flex flex-col items-center gap-6 text-center">
                          <div className="space-y-2">
                            <h3 className="text-white text-2xl leading-[1.4] tracking-[-0.41px] font-semibold">Tell your travel story</h3>
                            <p className="text-[#a8a8a8] text-base leading-normal tracking-[-0.41px] max-w-140">
                              Add a short bio, your interests, languages, and links so people can understand your style and follow your journey.
                            </p>
                          </div>
                        </div>
                      </div>
                    </section>
                  )
                }
              </div>
            </div>
          </div>
          <ProfileFooter className="max-[50.625rem]:hidden mt-10" />
        </main>
      </div>

      {/* <MobileActionBar onFollowClick={() => setShowFollowModal(true)} /> */}

      {showFollowModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60"
          onClick={() => setShowFollowModal(false)}
        >
          <div
            className="bg-black-800 border border-black-300 rounded-2xl p-8 w-full max-w-75 flex flex-col gap-8 shadow-[20px_20px_20px_0px_rgba(0,0,0,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cover + Avatar + Name */}
            <div className="flex flex-col gap-5 items-center">
              <div className="flex flex-col items-center pb-8 w-full">
                <div className="-mb-8 h-48.5 w-50 overflow-hidden rounded-xl shrink-0 bg-[#151515]">
                  <LoadedImage
                    src={toLandingAssetUrl(typeof profile.images.cover === "string" ? profile.images.cover : profile.images.cover.url)}
                    thumbnailSrc={getOptimizedMediaUrl(toLandingAssetUrl(typeof profile.images.cover === "string" ? profile.images.cover : profile.images.cover.url))}
                    alt="Cover preview"
                    className="h-full w-full object-cover"
                    skeletonClassName="absolute inset-0 bg-[#1a1a1a]"
                    containerClassName="absolute inset-0"
                  />
                </div>
                <div className="-mb-8 h-15 w-15 overflow-hidden rounded-xl shadow-[8px_8px_12px_0px_rgba(0,0,0,0.25)] shrink-0 bg-[#151515]">
                  <LoadedImage
                    src={toLandingAssetUrl(typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url)}
                    thumbnailSrc={getOptimizedMediaUrl(toLandingAssetUrl(typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url))}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                    skeletonClassName="absolute inset-0 bg-[#1a1a1a]"
                    containerClassName="w-full h-full"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 text-center w-full">
                <p className="ds-font-display font-medium text-2xl leading-8 tracking-[-0.5px] text-white">{displayName}</p>
                <p className="text-white-400 text-sm leading-5 tracking-[-0.084px]">{handle}</p>
              </div>
            </div>

            {/* Social icon buttons */}
            {socialRows.length > 0 && (
              <div className="flex gap-3 items-center justify-center">
                {socialRows.map((item) => (
                  <a
                    key={item.key}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center aspect-square bg-black-300 rounded-xl p-2.5 text-white hover:bg-[#3a3a3a] transition"
                    aria-label={item.key}
                  >
                    <SocialIcon platform={item.key} />
                  </a>
                ))}
              </div>
            )}

            {/* Copy Link */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href).catch(() => { });
                setShowFollowModal(false);
              }}
              className="w-full bg-white text-black rounded-full px-4 py-2.5 text-sm font-medium tracking-[-0.084px] hover:bg-[#ececec] transition"
            >
              Copy Link
            </button>
          </div>
        </div>
      )}



      {carouselIndex !== null && activeCarouselItem ? (
        <PhotoCarouselModal
          items={carouselItems}
          activeIndex={carouselIndex}
          onClose={closeCarousel}
          onNext={goToNextCarouselItem}
          onPrev={goToPrevCarouselItem}
          onSelectIndex={setCarouselIndex}
          onShareClick={() => showComingSoonToast("featureLaunch")}
          profileName={shareOwnerName}
          profileCountry={profile.country}
          profileHandle={shareOwnerHandle}
          profileAvatar={shareOwnerAvatar}
          profileFlagCode={profileFlagCode}
          countryName={carouselCountryName}
          countryFlagCode={displayCountryFlagCode}
          description={carouselDescription}
          quote={carouselQuote}
        />
      ) : null}
    </>
  );
}
