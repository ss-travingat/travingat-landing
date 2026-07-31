"use client";
import { useRouter } from "next/navigation";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";

import { toLandingAssetUrl } from "@/lib/landing-assets";
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
        className="absolute right-3 bottom-14 z-30 w-[220px] rounded-2xl border border-[#2a2a2a] bg-[#111] py-5 pl-5 pr-8 shadow-[0_8px_40px_rgba(0,0,0,0.7)]"
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
                handleView();
              }}
              disabled={!viewHref}
              className={`flex w-full items-center gap-3 text-[14px] font-normal text-white transition ${viewHref ? "hover:text-[#d4d4d4]" : "opacity-50 cursor-not-allowed"
                }`}
            >
              <span className="material-symbols-rounded text-[20px]">folder</span>
              <span>{viewLabel}</span>
              {flagSrc ? (
                <div className="ml-auto flex items-center justify-center rounded-[4px] overflow-hidden shadow-sm w-[24px] h-[15.6px] flex-shrink-0">
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
              handleShare();
            }}
            className="flex w-full items-center gap-3 text-[14px] font-normal text-white hover:text-[#d4d4d4] transition-colors"
          >
            <span className="material-symbols-rounded text-[20px]">ios_share</span>
            <span>{shareLabel}</span>
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsWaitlistOpen(true);
            }}
            className="flex w-full items-center gap-3 text-[14px] font-normal text-white hover:text-[#d4d4d4] transition-colors"
          >
            <span className="material-symbols-rounded text-[20px]">favorite_border</span>
            <span>Add to favorites</span>
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onClose();
            }}
            className="flex w-full items-center gap-3 text-[14px] font-normal text-white hover:text-[#d4d4d4] transition-colors"
          >
            <span className="material-symbols-rounded text-[20px]">block</span>
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

const SHARE_ICON_ASSETS = {
  whatsapp: "/images/share-icons/whatsapp.svg",
  messenger: "/images/share-icons/messenger.svg",
  facebook: "/images/share-icons/facebook.svg",
  instagram: "/images/share-icons/instagram.svg",
  x: "/images/share-icons/x.svg",
} as const;

function ShareIcon({
  type,
  className = "h-10 w-10",
}: {
  type: "whatsapp" | "messenger" | "facebook" | "instagram" | "x";
  className?: string;
}) {
  return (
    <img
      src={SHARE_ICON_ASSETS[type]}
      alt=""
      aria-hidden="true"
      className={className}
    />
  );
}

function ShareCard({
  data,
  onClose,
}: {
  data: ShareCardData;
  onClose: () => void;
}) {
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const avatarSrc = toLandingAssetUrl(data.ownerAvatar);
  const flagSrc = toFlagAssetPath(data.flagCode);
  const imageClassName = data.kind === "media"
    ? "w-50 aspect-[200/194]"
    : "w-full max-w-84 aspect-[336/262]";

  const handleSocialShare = (platform: string) => {
    const text = `Check out ${data.title} by ${data.ownerName} on Travingat`;
    const url = data.shareUrl;

    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, "_blank");
        break;
      case "messenger":
        window.open(`https://www.facebook.com/dialog/send?app_id=YOUR_APP_ID&link=${encodeURIComponent(url)}&redirect_uri=${encodeURIComponent(window.location.origin)}`, "_blank");
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
        break;
      case "instagram":
        // Instagram doesn't support direct sharing from web, redirect to Instagram profile
        window.open(`https://instagram.com`, "_blank");
        break;
      case "x":
        window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
        break;
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(data.shareUrl).catch(() => { });
    setIsLinkCopied(true);
    window.setTimeout(() => setIsLinkCopied(false), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-start justify-center bg-black/90 px-4 py-10"
      onClick={onClose}
    >
      <div
        className="w-full max-w-100 rounded-2xl border border-black-300 bg-black-800 p-8 shadow-[20px_20px_10px_rgba(0,0,0,0.25)]"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex flex-col items-center pb-8">
              <div className={`relative overflow-hidden rounded-2xl bg-black-700 ${imageClassName}`}>
                <img
                  src={toLandingAssetUrl(data.imageUrl)}
                  alt={data.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="relative z-10 -mt-7 h-15 w-15 overflow-hidden rounded-xl border-2 border-[#111] shadow-[8px_8px_12px_rgba(0,0,0,0.25)]">
                <img
                  src={toLandingAssetUrl(avatarSrc)}
                  alt="Profile avatar"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-center w-full">
              <p className="ds-font-display text-[24px] leading-8 tracking-[-0.5px] text-white font-medium">
                {data.title}
              </p>
              {flagSrc ? (
                <img
                  src={flagSrc}
                  alt=""
                  className="h-4.5 w-7 rounded-xs object-cover shadow-[1.68px_1.68px_0.84px_rgba(0,0,0,0.18)]"
                />
              ) : null}
            </div>

            <div className="flex flex-col items-center gap-1 text-center w-full">
              <p className="text-[16px] leading-6 tracking-[-0.096px] text-white font-medium">{data.ownerName}</p>
              <p className="text-[14px] leading-5 tracking-[-0.084px] text-white-400">{data.ownerHandle}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 w-full">
            {(
              [
                { type: "whatsapp" },
                { type: "messenger" },
                { type: "facebook" },
                { type: "instagram" },
                { type: "x" },
              ] as const
            ).map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => handleSocialShare(item.type)}
                className="flex-1 aspect-square rounded-xl bg-black-300 p-2.5 grid place-items-center hover:bg-black-200 transition"
                aria-label={`Share via ${item.type}`}
              >
                <ShareIcon type={item.type} />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className={`w-full flex items-center justify-center rounded-full px-4 py-3 text-[14px] font-medium tracking-[-0.084px] transition-all duration-200 ${isLinkCopied ? "bg-black text-white" : "bg-white text-black hover:bg-[#ececec]"
              }`}
          >
            <span className={isLinkCopied ? "inline-flex items-center gap-2 animate-pulse" : "inline-flex items-center gap-2"}>
              <span className="material-symbols-rounded text-[18px]">{isLinkCopied ? "link" : "content_copy"}</span>
              <span>{isLinkCopied ? "Link copied" : "Copy Link"}</span>
            </span>
          </button>
        </div>
      </div>
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
  profileFlagCode?: string;
  countryName?: string;
  countryFlagCode?: string;
  description?: string;
  quote?: string;
}) {
  const avatarSrc = toLandingAssetUrl(profileAvatar);
  const profileFlagSrc = toFlagAssetPath(profileFlagCode);
  const countryFlagSrc = toFlagAssetPath(countryFlagCode);
  return (
    <MediaLightbox
      items={items.map((item) => ({
        id: item.id,
        url: item.fileUrl,
        isVideo: item.isVideo,
      }))}
      activeIndex={activeIndex}
      onClose={onClose}
      onNext={onNext}
      onPrev={onPrev}
      onSelectIndex={onSelectIndex}
      onShareClick={onShareClick}
      sidebarContent={
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
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {profileFlagSrc ? (
                <img src={profileFlagSrc} alt="" className="h-[15.6px] w-6 rounded-[2px] object-cover" />
              ) : null}
              <span className="text-[14px] font-normal leading-5 tracking-[-0.084px] text-[#989898]">{profileName}</span>
            </div>
            <p className="text-[18px] font-medium leading-6 tracking-[-0.198px] text-white">{profileHandle}</p>
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
              aria-label="More options"
              className="grid h-[38px] w-[38px] place-items-center rounded-full border border-[#2e2e2e] bg-[#1a1a1a] text-white transition hover:bg-[#222]"
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
                <img src={countryFlagSrc} alt="" className="h-[21.3px] w-8 rounded-[3.27px] object-cover" />
              ) : null}
              <p className="text-[24px] font-semibold leading-[32px] tracking-[-0.5px] text-[#ededed] font-display">
                {countryName || ""}
              </p>
            </div>
            {description ? (
              <p className="text-[16px] font-normal leading-[24px] tracking-[-0.096px] text-[#dcdcdc] whitespace-pre-wrap">{description}</p>
            ) : null}
          </div>

          {quote ? (
            <div className="border-t border-[#222] pt-6">
              <p className="text-[16px] font-normal leading-[24px] tracking-[-0.096px] text-[#dcdcdc] whitespace-pre-wrap">{quote}</p>
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
  const loadRankById = useMemo(() => {
    const rank = new Map<string, number>();
    let index = 0;
    for (const id of loadedItemIds) {
      rank.set(id, index);
      index += 1;
    }
    return rank;
  }, [loadedItemIds]);

  const sourceIndexById = useMemo(() => {
    const indexMap = new Map<string, number>();
    items.forEach((item, index) => {
      indexMap.set(item.id, index);
    });
    return indexMap;
  }, [items]);

  const orderedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aRank = loadRankById.get(a.id);
      const bRank = loadRankById.get(b.id);

      const aLoaded = typeof aRank === "number";
      const bLoaded = typeof bRank === "number";

      // Loaded media should appear first (top rows), preserving actual load order.
      if (aLoaded && bLoaded) return aRank! - bRank!;
      if (aLoaded) return -1;
      if (bLoaded) return 1;

      // Keep original source order for still-loading media.
      return (sourceIndexById.get(a.id) ?? 0) - (sourceIndexById.get(b.id) ?? 0);
    });
  }, [items, loadRankById, sourceIndexById]);

  const [resolvedImageDimensions, setResolvedImageDimensions] = useState<
    Record<string, { width: number; height: number }>
  >({});

  useEffect(() => {
    let cancelled = false;

    const unresolvedImages = orderedItems.filter(
      (item) =>
        !item.isVideo &&
        (!item.width || !item.height) &&
        !resolvedImageDimensions[item.id]
    );

    if (unresolvedImages.length === 0) return;

    unresolvedImages.forEach((item) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (cancelled) return;
        const width = img.naturalWidth || 1200;
        const height = img.naturalHeight || 1200;
        setResolvedImageDimensions((prev) => {
          if (prev[item.id]) return prev;
          return { ...prev, [item.id]: { width, height } };
        });
      };
      img.src = toLandingAssetUrl(item.fileUrl);
    });

    return () => {
      cancelled = true;
    };
  }, [orderedItems, resolvedImageDimensions]);

  // Convert media items to masonry items with dimensions.
  const masonryItems: MasonryItemWithDimensions[] = useMemo(
    () =>
      orderedItems.map((item, index) => {
        const resolved = resolvedImageDimensions[item.id];
        return {
          id: item.id,
          url: item.fileUrl,
          width: item.width || resolved?.width || 1200,
          height: item.height || resolved?.height || 1200,
          placeholderColor: "#111111",
          alt: `Image ${index + 1}`,
        };
      }),
    [orderedItems, resolvedImageDimensions]
  );

  const markItemLoaded = (id: string) => {
    setLoadedItemIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  return (
    <MasonryImageGrid
      items={masonryItems}
      gapX={8}
      gapY={8}
      minColumnWidth={200}
      initialVisibleCount={10}
      renderItem={(masonryItem, index) => {
        const mediaItem = orderedItems.find((it) => String(it.id) === String(masonryItem.id)) || orderedItems[index];
        if (!mediaItem) return null;

        const originalIndex = allMediaItems.findIndex((it) => String(it.id) === String(mediaItem?.id));
        const isMenuOpen = openContextMenuId === mediaItem.id;
        const displayCountryCode = mediaItem.countryCode || profileFlagCode;
        const collectionHref =
          typeof mediaItem.collectionIndex === "number" && profile.collectionImages?.[mediaItem.collectionIndex]
            ? `/profiles/${profile.handle.replace(/^@/, "")}/collection/${mediaItem.collectionIndex}`
            : undefined;
        const viewHref = collectionHref || (displayCountryCode
          ? `/profiles/${profile.handle.replace(/^@/, "")}/country/${displayCountryCode.toUpperCase()}`
          : undefined);
        const viewLabel = collectionHref ? "View collection" : "View country";
        const isLoaded = loadedItemIds.has(mediaItem.id);

        return (
          <div className={`group h-full w-full relative ${isMenuOpen ? "z-40" : "z-0"}`}>
            <div className="absolute inset-0 overflow-hidden rounded-lg md:rounded-2xl bg-black-800">
              {/* Skeleton placeholder with correct aspect ratio */}
              <div
                className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-300 ${isLoaded ? "opacity-0" : "opacity-100"}`}
                style={{ backgroundColor: "#1a1a1a" }}
              />

              {mediaItem.isVideo ? (
                <>
                  <video
                    src={toLandingAssetUrl(mediaItem.fileUrl)}
                    muted
                    playsInline
                    loop
                    preload="metadata"
                    className={`relative z-10 h-full w-full object-contain rounded-lg md:rounded-2xl cursor-pointer transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
                    onLoadedData={() => markItemLoaded(mediaItem.id)}
                    onCanPlay={() => markItemLoaded(mediaItem.id)}
                    onError={() => markItemLoaded(mediaItem.id)}
                    onMouseEnter={(e) => e.currentTarget.play().catch(() => { })}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      openCarouselAt(originalIndex);
                    }}
                  />
                  <div className="absolute top-3 left-3 group-hover:opacity-0 transition-opacity pointer-events-none">
                    <span
                      className="material-symbols-rounded text-[24px] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                      style={{ fontVariationSettings: "'FILL' 1, 'wght' 700, 'GRAD' 200, 'opsz' 24" }}
                    >
                      play_arrow
                    </span>
                  </div>
                </>
              ) : (
                <LoadedImage
                  src={toLandingAssetUrl(mediaItem.fileUrl)}
                  alt="Uploaded media"
                  className="h-full w-full object-contain rounded-lg md:rounded-2xl cursor-pointer"
                  containerClassName="h-full w-full rounded-lg md:rounded-2xl"
                  skeletonClassName="absolute inset-0 rounded-lg md:rounded-2xl"
                  onLoad={() => markItemLoaded(mediaItem.id)}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    openCarouselAt(originalIndex);
                  }}
                />
              )}

              {/* More options button */}
              <MoreOptionsButton
                isOpen={isMenuOpen}
                label="Open media menu"
                size="sm"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setOpenContextMenuId(isMenuOpen ? null : mediaItem.id);
                }}
              />

              {/* Flag badge (visible after image loads) */}
              {displayCountryCode && isLoaded ? (
                <div className="absolute top-3 right-3 z-20 transition-opacity duration-200 opacity-100 min-[1200px]:opacity-0 min-[1200px]:group-hover:opacity-100 pointer-events-auto group/flag">
                  <div className="flex items-center drop-shadow-md cursor-pointer">
                    <img
                      src={toFlagAssetPath(displayCountryCode)}
                      alt={displayCountryCode}
                      className="h-3.5 w-5 rounded-xs object-cover"
                    />
                  </div>
                  <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-2.5 flex flex-col items-center opacity-0 transition-all duration-200 group-hover/flag:opacity-100 pointer-events-none origin-bottom scale-95 group-hover/flag:scale-100 drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                    <div className="whitespace-nowrap rounded-xl bg-white px-3.5 py-1.5 text-[15px] font-medium tracking-tight text-black">
                      {COUNTRY_LIST_LOOKUP[displayCountryCode.toUpperCase()] || displayCountryCode}
                    </div>
                    <div className="-mt-1.5 h-3 w-3 rotate-45 bg-white rounded-xs" />
                  </div>
                </div>
              ) : null}
            </div>

            {/* Context menu */}
            {isMenuOpen ? (
              <ContextMenu
                kind="media"
                viewLabel={viewLabel}
                shareLabel="Share photo"
                flagCode={collectionHref ? undefined : displayCountryCode}
                viewHref={viewHref}
                onShare={() => {
                  const shareUrl = new URL(window.location.origin);
                  if (collectionHref?.includes("/collection/")) {
                    shareUrl.pathname = collectionHref;
                  } else if (displayCountryCode) {
                    shareUrl.pathname = `/profiles/${profile.handle.replace(/^@/, "")}/country/${displayCountryCode.toUpperCase()}`;
                  } else {
                    shareUrl.pathname = `/profiles/${profile.handle.replace(/^@/, "")}`;
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
                onClose={() => setOpenContextMenuId(null)}
                menuRef={contextMenuRef}
              />
            ) : null}
          </div>
        );
      }}
    />
  );
}

export default function ProfileComponent({ profile }: { profile: SampleProfile }) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [visibleLimit, setVisibleLimit] = useState(10);
  const [loadedItemIds, setLoadedItemIds] = useState<Set<string>>(() => new Set());
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || !loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleLimit((prev) => prev + 10);
        }
      },
      { rootMargin: "100px" }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [visibleLimit]);

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
        router.replace(url.pathname + url.search, { scroll: false });
      }
    } else {
      if (url.searchParams.has("tab")) {
        url.searchParams.delete("tab");
        router.replace(url.pathname + url.search, { scroll: false });
      }
    }
  }, [activeTab]);
  const [showFollowModal, setShowFollowModal] = useState(false);  // Local states for photo carousels on the cards
  const [openContextMenuId, setOpenContextMenuId] = useState<string | null>(null);
  const [shareCardData, setShareCardData] = useState<ShareCardData | null>(null);
  const [carouselIndex, setCarouselIndex] = useState<number | null>(null);
  const [carouselItems, setCarouselItems] = useState<MediaItem[]>([]);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setTimeout(() => {
      const isMobile = window.innerWidth < 811;
      if (isMobile) {
        const hero = document.getElementById("profile-mobile-hero");
        if (hero) {
          // Hero offsetTop + height + 40px (gap-10) - 72px (navbar)
          const offset = hero.offsetTop + hero.offsetHeight + 40 - 72;
          if (window.scrollY > offset) {
            window.scrollTo({ top: offset, behavior: "instant" });
          }
        }
      } else {
        const desktopTabs = document.getElementById("profile-desktop-tabs");
        if (desktopTabs) {
          const offset = desktopTabs.offsetTop - 72;
          if (window.scrollY > offset) {
            window.scrollTo({ top: offset, behavior: "instant" });
          }
        }
      }
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

  useEffect(() => {
    if (!shareCardData) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShareCardData(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [shareCardData]);

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
    const items: MediaItem[] = [];

    profile.images.gallery.forEach((fileEntry) => {
      const isObj = typeof fileEntry !== "string" && fileEntry !== null && typeof fileEntry === "object";
      const url = isObj ? (fileEntry.url as string) : (fileEntry as string);
      items.push({
        id: `media-${profile.id}-${items.length}`,
        fileUrl: url,
        isVideo: isVideoAsset(url),
        width: isObj ? (fileEntry.width as number) : undefined,
        height: isObj ? (fileEntry.height as number) : undefined,
      });
    });

    (profile.countryImages ?? []).forEach((country) => {
      country.images.forEach((fileEntry) => {
        const isObj = typeof fileEntry !== "string" && fileEntry !== null && typeof fileEntry === "object";
        const url = isObj ? (fileEntry.url as string) : (fileEntry as string);
        items.push({
          id: `media-${profile.id}-${items.length}`,
          fileUrl: url,
          isVideo: isVideoAsset(url),
          countryCode: country.countryCode,
          width: isObj ? (fileEntry.width as number) : undefined,
          height: isObj ? (fileEntry.height as number) : undefined,
        });
      });
    });

    (profile.collectionImages ?? []).forEach((collection, collectionIdx) => {
      collection.images.forEach((fileEntry) => {
        const isObj = typeof fileEntry !== "string" && fileEntry !== null && typeof fileEntry === "object";
        const url = isObj ? (fileEntry.url as string) : (fileEntry as string);
        items.push({
          id: `media-${profile.id}-${items.length}`,
          fileUrl: url,
          isVideo: isVideoAsset(url),
          collectionIndex: collectionIdx,
          width: isObj ? (fileEntry.width as number) : undefined,
          height: isObj ? (fileEntry.height as number) : undefined,
        });
      });
    });

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
        const previewImages = rawPreview.map((g) => (typeof g === "string" ? g : g.url));
        return {
          code: `${profile.id}-ci-${index}`,
          name: countryName,
          flagCode: ci.countryCode,
          thumbnailUrl: previewImages[0] || (typeof profile.images.cover === "string" ? profile.images.cover : profile.images.cover.url),
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
    setShareCardData(null);
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
        router.replace(url.pathname + url.search, { scroll: false });
      }
    } else {
      if (url.searchParams.has("image")) {
        url.searchParams.delete("image");
        router.replace(url.pathname + url.search, { scroll: false });
      }
    }
  }, [carouselIndex, carouselItems]);

  // Read from URL on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const encodedImage = url.searchParams.get("image");
    if (encodedImage && allMediaItems.length > 0 && carouselIndex === null) {
      try {
        const imageUrl = decodeURIComponent(escape(atob(encodedImage)));
        const index = allMediaItems.findIndex((item) => item.fileUrl === imageUrl);
        if (index !== -1) {
          const active = allMediaItems[index];
          // If the image belongs to a collection, prefer collection route
          if (typeof active.collectionIndex === "number" && profile.collectionImages?.[active.collectionIndex]) {
            const collectionHref = `/profiles/${profile.handle.replace(/^@/, "")}/collection/${active.collectionIndex}`;
            if (!window.location.pathname.includes('/collection/')) {
              window.location.replace(`${collectionHref}?image=${encodedImage}`);
              return;
            }
            const filtered = allMediaItems.filter((it) => it.collectionIndex === active.collectionIndex);
            setCarouselItems(filtered);
            const newIndex = filtered.findIndex((it) => it.fileUrl === active.fileUrl);
            setCarouselIndex(newIndex === -1 ? 0 : newIndex);
          } else {
            const itemCountry = active.countryCode || profile.flagCode;
            if (itemCountry && !window.location.pathname.includes('/country/')) {
              window.location.replace(`/profiles/${profile.handle.replace(/^@/, "")}/country/${itemCountry.toUpperCase()}?image=${encodedImage}`);
              return;
            }
            const originCode = (itemCountry || "").toUpperCase();
            if (originCode) {
              const filtered = allMediaItems.filter((it) => ((it.countryCode || profile.flagCode) || "").toUpperCase() === originCode);
              setCarouselItems(filtered);
              const newIndex = filtered.findIndex((it) => it.fileUrl === active.fileUrl);
              setCarouselIndex(newIndex === -1 ? 0 : newIndex);
            } else {
              setCarouselItems(allMediaItems);
              setCarouselIndex(index);
            }
          }
          // Don't change tab, allow it to just open over whatever tab is active
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

  const carouselDescription = profile.bio;
  const carouselQuote = undefined;

  const toShareUrl = (url: string) => {
    if (!url) return url;
    if (/^https?:\/\//i.test(url)) return url;
    return new URL(url, window.location.origin).toString();
  };

  const openShareCard = (data: ShareCardData) => {
    setShareCardData(data);
    setOpenContextMenuId(null);
  };

  const openCarouselAt = (index: number) => {
    if (allMediaItems.length === 0) return;
    // Determine if clicked item belongs to a collection — prefer collection scope
    const active = allMediaItems[index];
    if (typeof active.collectionIndex === "number" && profile.collectionImages?.[active.collectionIndex]) {
      const filtered = allMediaItems.filter((it) => it.collectionIndex === active.collectionIndex);
      setCarouselItems(filtered);
      const newIndex = filtered.findIndex((it) => it.fileUrl === active.fileUrl);
      setCarouselIndex(newIndex === -1 ? 0 : newIndex);
    } else {
      // Fallback to country-scoped carousel (use profile flag if item has no explicit country)
      const originCode = (active.countryCode || profile.flagCode || "").toUpperCase();
      if (originCode) {
        const filtered = allMediaItems.filter((it) => ((it.countryCode || profile.flagCode) || "").toUpperCase() === originCode);
        setCarouselItems(filtered);
        const newIndex = filtered.findIndex((it) => it.fileUrl === active.fileUrl);
        setCarouselIndex(newIndex === -1 ? 0 : newIndex);
      } else {
        setCarouselItems(allMediaItems);
        setCarouselIndex(index);
      }
    }
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
        const previewImages = rawPreview.map((g) => (typeof g === "string" ? g : g.url));
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
          thumbnailUrl: previewImages[0] || (typeof profile.images.cover === "string" ? profile.images.cover : profile.images.cover.url),
          previewImages,
          countries: selectedCountries.length > 0 ? visibleCountries : fallbackVisibleCountries,
          countryOverflowCount: selectedCountries.length > 0 ? countryOverflowCount : fallbackOverflowCount,
        };
      });
    }

    const titles = profile.interests.length > 0 ? profile.interests : ["Travel moments"];
    const count = Math.min(4, Math.max(1, Math.min(titles.length, allMediaItems.length || 1)));

    return Array.from({ length: count }).map((_, index) => {
      const thumbnailItem = allMediaItems.length > 0 ? allMediaItems[index % allMediaItems.length] : null;
      const photoFallbacks = allMediaItems.filter((item) => !item.isVideo).map((item) => item.fileUrl);
      const defaultFallbacks = photoFallbacks.length > 0
        ? photoFallbacks
        : allMediaItems.map((item) => item.fileUrl);
      const previewImages = defaultFallbacks.length > 0
        ? Array.from({ length: Math.min(5, defaultFallbacks.length) }, (_, imageIndex) => {
          return defaultFallbacks[(index + imageIndex) % defaultFallbacks.length];
        })
        : [(typeof profile.images.cover === "string" ? profile.images.cover : profile.images.cover.url)];

      return {
        id: `${profile.id}-collection-${index}`,
        title: titles[index % titles.length],
        description: profile.bio,
        createdLabel: getDeterministicCreatedLabel(index),
        thumbnailUrl: thumbnailItem ? thumbnailItem.fileUrl : (typeof profile.images.cover === "string" ? profile.images.cover : profile.images.cover.url),
        previewImages,
        countries: fallbackVisibleCountries,
        countryOverflowCount: fallbackOverflowCount,
      };
    });
  }, [allMediaItems, countryCards, profile.bio, profile.images.cover, profile.id, profile.interests, profile.collectionImages]);

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

  return (
    <>
      <div
        className="bg-black text-white flex flex-col items-center px-[8px] pt-[8px] min-[810px]:pt-0 min-[810px]:px-[32px] min-[1440px]:px-[64px]"
        style={
          strictDesktopStyle
            ? {
              paddingLeft: `${interpolatedDesktopInset}px`,
              paddingRight: `${interpolatedDesktopInset}px`,
            }
            : undefined
        }
      >

        <main className="w-full max-w-[1728px] pb-[4px] md:pb-20 flex flex-col gap-[12px] min-[1200px]:gap-10">
          <MobileHero
            profile={profile}
            displayName={displayName}
            handle={handle}
            basedIn={basedIn}
            profileFlagCode={profileFlagCode}
            profileFlagSrc={profileFlagSrc}
            headerFlagCodes={headerFlagCodes}
            flagOverflowCount={flagOverflowCount}
          />


          <section className="hidden min-[1200px]:flex items-end justify-between gap-6 w-full">
            <div
              className="w-full max-w-[48%] lg:max-w-[500px] xl:max-w-[537px] shrink flex flex-col items-start justify-start gap-[24px] lg:gap-[32px] xl:gap-[40px] pt-[24px] lg:pt-[40px] xl:pt-[48px]"
              style={strictDesktopStyle ? { width: `${interpolatedLeftWidth}px`, maxWidth: `${interpolatedLeftWidth}px` } : undefined}
            >
              <div className="flex flex-col items-start gap-[16px] lg:gap-[24px] xl:gap-[32px] w-full">
                <div className="flex flex-col items-start gap-[12px] lg:gap-[16px] xl:gap-[32px] w-full">
                  <div className="relative size-[64px] lg:size-[100px] xl:size-[120px] shrink-0 overflow-hidden rounded-[20px] bg-[#151515]">
                    <LoadedImage
                      src={toLandingAssetUrl(typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url)}
                      alt="Profile avatar"
                      className="h-full w-full object-cover rounded-[20px]"
                      skeletonClassName="absolute inset-0 bg-[#1a1a1a]"
                      containerClassName="w-full h-full"
                      priority
                    />
                  </div>

                  <div className="flex flex-col items-center w-full shrink-0">
                    <div className="flex flex-col items-start w-full gap-[12px]">
                      <div className="flex items-center gap-2 text-white-400 text-[12px] lg:text-[16px] xl:text-[18px] tracking-[-0.198px] leading-[26px] w-full">
                        {profileFlagSrc ? (
                          <img
                            src={profileFlagSrc}
                            alt={`${basedIn} flag`}
                            className="h-3 w-4.5 lg:h-4 lg:w-6 xl:h-[16px] xl:w-[24px] rounded-[4px] object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <span>{profileFlagCode}</span>
                        )}
                        <span>{basedIn}</span>
                      </div>

                      <h1 className="ds-font-display text-[24px] lg:text-[36px] xl:text-[44px] leading-tight xl:leading-[52px] tracking-[-0.5px] font-semibold text-white w-full">{displayName}</h1>

                      <div className="flex items-center gap-[8px] w-full">
                        <p className="ds-font-display text-white-400 text-[16px] lg:text-[20px] xl:text-[24px] leading-normal xl:leading-[32px] tracking-[-0.5px] font-normal">{handle}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-wrap content-start items-start gap-1.5 lg:gap-2 xl:w-[480px] xl:gap-[8px]">
                  {headerFlagCodes.map((code, index) => (
                    <img
                      key={`${code}-${index}`}
                      src={toFlagAssetPath(code) || ""}
                      alt={`${code} flag`}
                      className="h-3 w-[18px] lg:h-4 lg:w-6 xl:h-5 xl:w-[30px] rounded-xs object-cover shrink-0"
                      loading="lazy"
                      decoding="async"
                    />
                  ))}
                  {flagOverflowCount > 0 && (
                    <div className="flex h-3 w-[18px] lg:h-4 lg:w-6 xl:h-5 xl:w-[30px] shrink-0 items-center justify-center overflow-hidden rounded-xs bg-white">
                      <span className="font-medium text-violet-600 text-[8px] lg:text-[10px] xl:text-[12px] text-center tracking-[-0.408px] whitespace-nowrap">
                        +{flagOverflowCount}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex min-h-[100px] items-center justify-between xl:justify-start xl:gap-[40px] w-full rounded-[16px] border-l border-black-100 bg-linear-to-r from-[#1c1c1c] to-[rgba(0,0,0,0.1)] px-2 py-2 lg:px-3 lg:py-3 xl:px-[16px] xl:py-[20px]">
                  <div className="flex items-center gap-1.5 lg:gap-2 xl:gap-[16px] rounded-xl">
                    <div className="relative size-8 lg:size-[48px] xl:size-[60px] shrink-0">
                      <img
                        src="/images/Globe.png"
                        alt="Globe icon"
                        className="pointer-events-none absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-contain"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5 xl:gap-1">
                      <p className="ds-font-display text-[16px] lg:text-[20px] xl:text-[24px] leading-tight xl:leading-[32px] tracking-[-0.5px] text-white font-semibold">{profile.countries}</p>
                      <p className="text-[10px] lg:text-[12px] xl:text-[14px] leading-tight xl:leading-[20px] tracking-[-0.084px] text-white-400 font-normal">Countries</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 lg:gap-2 xl:gap-[16px] rounded-xl">
                    <div className="relative size-8 lg:size-[48px] xl:size-[60px] shrink-0">
                      <img
                        src="/images/media.png"
                        alt="Media icon"
                        className="pointer-events-none absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-contain"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5 xl:gap-1">
                      <p className="ds-font-display text-[16px] lg:text-[20px] xl:text-[24px] leading-tight xl:leading-[32px] tracking-[-0.5px] text-white font-semibold">{profile.media}</p>
                      <p className="text-[10px] lg:text-[12px] xl:text-[14px] leading-tight xl:leading-[20px] tracking-[-0.084px] text-white-400 font-normal">All media</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 lg:gap-2 xl:gap-[16px] rounded-xl">
                    <div className="relative size-8 lg:size-[48px] xl:size-[60px] shrink-0">
                      <img
                        src="/images/collections.png"
                        alt="Collections icon"
                        className="pointer-events-none absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-contain"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5 xl:gap-1">
                      <p className="ds-font-display text-[16px] lg:text-[20px] xl:text-[24px] leading-tight xl:leading-[32px] tracking-[-0.5px] text-white font-semibold">{profile.collections}</p>
                      <p className="text-[10px] lg:text-[12px] xl:text-[14px] leading-tight xl:leading-[20px] tracking-[-0.084px] text-white-400 font-normal">Collections</p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="mt-auto flex items-center gap-[12px] w-[368px]"
                style={strictDesktopStyle ? { width: `${buttonRowWidth}px` } : undefined}
              >
                <button
                  onClick={() => setShowFollowModal(true)}
                  className="flex items-center justify-center flex-1 lg:flex-none w-auto lg:w-[148px] lg:h-[48px] rounded-full bg-white text-black px-3 py-1.5 text-[12px] lg:text-[16px] font-medium tracking-[-0.096px] hover:bg-[#ececec] transition"
                  style={strictDesktopStyle ? { width: `${buttonBaseWidth}px`, height: `${buttonIconSize}px` } : undefined}
                >
                  Follow
                </button>
                <button
                  className="flex items-center justify-center flex-1 lg:flex-none w-auto lg:w-[148px] lg:h-[48px] rounded-full border border-[#353535] bg-[#1a1a1a] text-white px-3 py-1.5 text-[12px] lg:text-[16px] font-medium tracking-[-0.096px] hover:bg-[#242424] transition"
                  style={strictDesktopStyle ? { width: `${buttonBaseWidth}px`, height: `${buttonIconSize}px` } : undefined}
                >
                  Connect
                </button>
                <button
                  className="size-8 lg:size-[48px] shrink-0 grid place-items-center rounded-full border border-[#353535] bg-[#1a1a1a] text-white hover:bg-[#242424] transition"
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
                className="relative w-full max-w-[640px] shrink-0 overflow-hidden rounded-3xl lg:rounded-[24px] xl:rounded-[32px] aspect-[640/662] bg-[#151515]"
                style={strictDesktopStyle ? { width: `${interpolatedCoverWidth}px`, maxWidth: `${interpolatedCoverWidth}px` } : undefined}
              >
                <LoadedImage
                  src={toLandingAssetUrl(typeof profile.images.cover === "string" ? profile.images.cover : profile.images.cover.url)}
                  alt="Profile cover"
                  className="absolute inset-0 w-full h-full object-cover rounded-3xl lg:rounded-[24px] xl:rounded-[32px]"
                  skeletonClassName="absolute inset-0 bg-[#1a1a1a]"
                  containerClassName="absolute inset-0 w-full h-full"
                  priority
                />
              </div>
            </div>
          </section>

          {/* Desktop: pill tabs with text */}
          <div id="profile-desktop-tabs" className="hidden min-[1200px]:flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => handleTabChange("all")}
              className={`rounded-full px-6 py-2 text-[16px] leading-6 tracking-[-0.096px] transition ${activeTab === "all"
                ? "bg-black-600 border border-white text-white font-medium"
                : "bg-black-800 border border-transparent text-white-300 font-normal"
                }`}
            >
              All media
            </button>
            <button
              onClick={() => handleTabChange("countries")}
              className={`rounded-full px-6 py-2 text-[16px] leading-6 tracking-[-0.096px] transition ${activeTab === "countries"
                ? "bg-black-600 border border-white text-white font-medium"
                : "bg-black-800 border border-transparent text-white-300 font-normal"
                }`}
            >
              Countries
            </button>
            <button
              onClick={() => handleTabChange("collections")}
              className={`rounded-full px-6 py-2 text-[16px] leading-6 tracking-[-0.096px] transition ${activeTab === "collections"
                ? "bg-black-600 border border-white text-white font-medium"
                : "bg-black-800 border border-transparent text-white-300 font-normal"
                }`}
            >
              Collections
            </button>
            <button
              onClick={() => handleTabChange("about")}
              className={`rounded-full px-6 py-2 text-[16px] leading-6 tracking-[-0.096px] transition ${activeTab === "about"
                ? "bg-black-600 border border-white text-white font-medium"
                : "bg-black-800 border border-transparent text-white-300 font-normal"
                }`}
            >
              About me
            </button>
          </div>

          <div className="flex flex-col gap-[12px] md:gap-0 w-full">
            {/* Mobile/iPad: icon-only tabs with sliding underline indicator */}
            <MobileTabs activeTab={activeTab} setActiveTab={handleTabChange} swipeOffset={swipeOffset} />

            <div
              className="flex flex-col flex-1"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className={activeTab === "all" ? "block animate-tab-dissolve" : "hidden"}>
                {
                  <section className="pb-0">
                    {allMediaItems.length === 0 ? (
                      <div className="max-w-xl mx-auto flex flex-col items-center gap-5 text-center py-10">
                        <h2 className="text-[30px] leading-none tracking-[-0.5px] font-semibold text-white">All media</h2>
                        <p className="text-white-500 text-[14px] leading-[1.4]">
                          Add media to a country or collection to start building your gallery.
                        </p>
                      </div>
                    ) : (
                      <JsMasonryGrid
                        items={allMediaItems.slice(0, visibleLimit)}
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
                    <div
                      ref={loadMoreRef}
                      className={`h-[1px] w-full ${visibleLimit < allMediaItems.length ? "block" : "hidden"}`}
                    />
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
                              <div key={src} className="w-19 h-19 md:w-25 md:h-25 rounded-[10px] overflow-hidden">
                                <img src={toLandingAssetUrl(src)} alt={`Country preview ${idx + 1}`} loading="eager" decoding="async" className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-white text-[24px] leading-[1.4] tracking-[-0.41px] font-semibold">Add your first country</h3>
                            <p className="text-[#a8a8a8] text-[16px] leading-normal tracking-[-0.41px]">
                              Start with your favorite country - you can add the rest later.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-[8px] gap-y-[16px] md:gap-x-5 md:gap-y-10">
                        {countryCards.map((country) => {
                          const contextMenuId = `country-${country.code}`;
                          const isMenuOpen = openContextMenuId === contextMenuId;
                          const countryHref = `/profiles/${profile.handle.replace(/^@/, "")}/country/${country.flagCode.toUpperCase()}`;
                          return (
                            <Link key={country.code} href={countryHref} className="flex flex-col gap-[10px]">
                              {/* Photo */}
                              <div className="relative group">
                                <CardCarousel
                                  images={country.previewImages.length > 0 ? country.previewImages : [country.thumbnailUrl]}
                                  alt={country.name}
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
                              <div className="flex flex-col gap-[4px] md:gap-[8px] px-[4px] md:px-[8px] pt-[2px] md:pt-[6px]">
                                <div className="flex items-center gap-[6px] md:gap-[10px]">
                                  <div className="h-[11px] w-[16px] md:h-[15px] md:w-[22px] overflow-hidden rounded-[2px] drop-shadow-[1.2px_1.2px_0.6px_rgba(0,0,0,0.18)] shrink-0">
                                    <img
                                      src={`/flags/${country.flagCode.toUpperCase()}.svg`}
                                      alt={country.name}
                                      className="block w-full h-full object-cover"
                                    />
                                  </div>
                                  <p className="text-white text-[14px] md:text-[18px] font-medium leading-[20px] md:leading-[24px] tracking-[-0.084px] md:tracking-[-0.2px] truncate">
                                    {country.name}
                                  </p>
                                </div>
                                <div className="flex items-center gap-[4px] md:gap-[6px]">
                                  <span className="text-[#646464] text-[12px] md:text-[14px] leading-[16px] md:leading-[20px]">{country.photoCount} photos</span>
                                  <span className="text-[#646464] text-[12px] md:text-[14px] leading-[16px] md:leading-[20px]">&bull;</span>
                                  <span className="text-[#646464] text-[12px] md:text-[14px] leading-[16px] md:leading-[20px]">{country.videoCount} Videos</span>
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
                              <div key={src} className="w-19 h-19 md:w-25 md:h-25 rounded-[10px] overflow-hidden">
                                <img src={toLandingAssetUrl(src)} alt={`Collection preview ${idx + 1}`} loading="eager" decoding="async" className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-white text-[24px] leading-[1.4] tracking-[-0.41px] font-semibold">Your collections</h3>
                            <p className="text-[#a8a8a8] text-[16px] leading-normal tracking-[-0.41px] max-w-140">
                              Group photos and videos by theme - not location.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-x-5 gap-y-[32px] sm:gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {collectionCards.map((collection, idx) => {
                          const collectionHref = `/profiles/${profile.handle.replace(/^@/, "")}/collection/${idx}`;
                          const contextMenuId = `collection-${collection.id}`;
                          const isMenuOpen = openContextMenuId === contextMenuId;
                          return (
                            <Link
                              key={collection.id}
                              href={collectionHref}
                              className="flex flex-col gap-[16px] md:gap-[20px]"
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

                              <div className="flex flex-col px-[4px] md:px-[8px] gap-[12px] md:gap-[16px]">
                                <div className="flex flex-col gap-[4px] md:gap-[8px]">
                                  <p className="text-[#646464] text-[12px] md:text-[14px] leading-[16px] md:leading-[20px] tracking-normal">{collection.createdLabel}</p>
                                  <p className="text-white text-[14px] md:text-[18px] font-medium leading-[20px] md:leading-[24px] tracking-[-0.084px] md:tracking-[-0.2px] min-w-full w-min line-clamp-1">{collection.title}</p>
                                </div>
                                {/* Hidden countries for now as per design request until Admin CMS supports collection country multi-select */}
                                <div className="flex flex-wrap items-center gap-1.5">
                                  {collection.countries.map((country) => (
                                    <span
                                      key={`${collection.id}-${country}`}
                                      className="backdrop-blur-[2px] bg-[#161616] border border-[#252525] border-solid flex items-center justify-center py-[4px] px-[8px] rounded-full text-[#989898] text-[12px] leading-[16px] font-normal tracking-normal"
                                    >
                                      {country}
                                    </span>
                                  ))}
                                  {collection.countryOverflowCount > 0 ? (
                                    <span className="backdrop-blur-[2px] bg-[#161616] border border-[#252525] border-solid flex items-center justify-center py-[4px] px-[8px] rounded-full text-[#989898] text-[12px] leading-[16px] font-normal tracking-normal">
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
                    <section className="w-full max-w-[1112px] mx-auto grid md:grid-cols-[minmax(0,1fr)_320px] lg:grid-cols-[minmax(0,1fr)_360px] gap-8 items-stretch">
                      <article className="relative min-w-0 md:rounded-[20px] md:border md:border-[#1e1e1e] md:pt-8 md:pb-10 md:px-8 md:bg-[#111] flex flex-col gap-8">
                        <div className="flex flex-col gap-[24px] px-[4px] py-[8px] md:px-0 md:py-0">
                          <div className="flex flex-col gap-[8px]">
                            <h3 className="ds-font-display text-white text-[20px] md:text-[24px] font-medium md:font-semibold tracking-[-0.5px] leading-7 md:leading-8">About</h3>
                            <p className="text-white md:text-[#dcdcdc] text-[16px] leading-6 tracking-[-0.096px]">{profile.bio || "No bio yet."}</p>
                          </div>

                          <div
                            className="flex flex-nowrap gap-2 md:gap-3 overflow-x-auto no-scrollbar snap-x w-full"
                            onTouchStart={(e) => e.stopPropagation()}
                            onTouchMove={(e) => e.stopPropagation()}
                            onTouchEnd={(e) => e.stopPropagation()}
                          >
                            {aboutPhotos.length > 0 ? (
                              aboutPhotos.map((src, idx) => (
                                <div key={`${src}-${idx}`} className="w-[160px] md:w-auto md:flex-1 shrink-0 min-w-0 rounded-[8px] md:rounded-[12px] overflow-hidden bg-[#151515] aspect-square snap-start">
                                  <img src={toLandingAssetUrl(src)} alt={`About photo ${idx + 1}`} loading="eager" decoding="async" draggable={false} className="w-full h-full object-cover pointer-events-none select-none" />
                                </div>
                              ))
                            ) : (
                              <div className="flex-1 rounded-[12px] border border-dashed border-[#1e1e1e] bg-[#111] p-6 text-sm text-[#989898] text-center">
                                No photos added yet.
                              </div>
                            )}
                          </div>
                        </div>

                        <hr className="border-t border-[#1e1e1e] w-full m-0" />

                        <div className="flex flex-col gap-3 md:gap-6">
                          <h4 className="ds-font-display text-white text-[20px] md:text-[24px] font-medium md:font-semibold tracking-[-0.5px] leading-7 md:leading-8">My Interests</h4>
                          {profile.interests.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {profile.interests.map((interest) => (
                                <span key={interest} className="flex items-center gap-1.5 pl-[10px] pr-[12px] py-[6px] md:pl-3 md:pr-4 md:py-2 rounded-[68px] bg-[#1e1e1e] text-white text-[14px] md:text-[16px] leading-[20px] md:leading-6 tracking-[-0.084px] md:tracking-[-0.096px]">
                                  {interest}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[#989898] text-[14px]">No interests added yet.</p>
                          )}
                        </div>
                      </article>

                      <aside className="rounded-[16px] border border-[#1e1e1e] p-6 bg-[#111] flex flex-col gap-5">
                        <div className="flex flex-col gap-2 pb-6 border-b border-[#1e1e1e]">
                          <p className="text-[#989898] text-[14px] font-normal leading-5 tracking-[-0.084px]">Username</p>
                          <div className="flex flex-col gap-1">
                            <p className="ds-font-display text-white text-[18px] font-medium leading-6.5 tracking-[-0.198px]">{handle}</p>
                            <div className="flex gap-1.5 items-center">
                              <p className="text-[#656565] text-[14px] truncate tracking-[-0.41px]">travingat.com/profiles/{handle.replace(/^@/, "")}</p>
                              <CopyButton text={`travingat.com/profiles/${handle.replace(/^@/, "")}`} />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-6 md:gap-5">
                          <div className="flex flex-col gap-2 md:gap-3">
                            <p className="text-[#989898] text-[14px] font-normal leading-5 tracking-[-0.084px]">Home land</p>
                            <div className="flex items-center gap-1.5 md:gap-2 text-white text-[16px] font-medium tracking-[-0.096px]">
                              {homelandFlagSrc ? (
                                <img
                                  src={homelandFlagSrc}
                                  alt={`${toLocationCountry(profile.homeland)} flag`}
                                  className="h-[15.6px] w-6 shrink-0 rounded-[2px] object-cover"
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
                            <p className="text-[#989898] text-[14px] font-normal leading-5 tracking-[-0.084px]">Currently in</p>
                            <div className="flex items-center gap-1.5 md:gap-2 text-white text-[16px] font-medium tracking-[-0.096px]">
                              {currentlyInFlagSrc ? (
                                <img
                                  src={currentlyInFlagSrc}
                                  alt={`${toLocationCountry(profile.currentlyIn)} flag`}
                                  className="h-[15.6px] w-6 shrink-0 rounded-[2px] object-cover"
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
                            <p className="text-[#989898] text-[14px] font-normal leading-5 tracking-[-0.084px]">Speaks</p>
                            {profile.languages.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5 md:gap-2">
                                {profile.languages.map((language) => (
                                  <span key={language} className="px-3.5 py-1.5 rounded-full bg-[#111] border border-[#1e1e1e] text-white text-[14px] leading-5 tracking-[-0.084px]">
                                    {language}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[#989898] text-[14px]">—</p>
                            )}
                          </div>

                          <div className="flex flex-col gap-3">
                            <p className="text-[#989898] text-[14px] font-normal leading-5 tracking-[-0.084px]">Find me On</p>
                            {socialRows.length > 0 ? (
                              <div className="flex flex-col gap-4 min-w-0">
                                {socialRows.map((item) => (
                                  <a
                                    key={item.key}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-[6px] text-white text-[16px] font-medium leading-6 tracking-[-0.096px] hover:opacity-80 transition"
                                  >
                                    <SocialIcon platform={item.key} className="h-5 w-5 shrink-0" />
                                    <span className="truncate">{item.label}</span>
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[#989898] text-[14px]">—</p>
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
                            <h3 className="text-white text-[24px] leading-[1.4] tracking-[-0.41px] font-semibold">Tell your travel story</h3>
                            <p className="text-[#a8a8a8] text-[16px] leading-normal tracking-[-0.41px] max-w-140">
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
          <ProfileFooter className="max-[810px]:hidden mt-10" />
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
                    alt={displayName}
                    className="w-full h-full object-cover"
                    skeletonClassName="absolute inset-0 bg-[#1a1a1a]"
                    containerClassName="w-full h-full"
                  />
                </div>
                <div className="-mb-8 h-15 w-15 overflow-hidden rounded-xl shadow-[8px_8px_12px_0px_rgba(0,0,0,0.25)] shrink-0 bg-[#151515]">
                  <LoadedImage
                    src={toLandingAssetUrl(typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url)}
                    alt={displayName}
                    className="w-full h-full object-cover"
                    skeletonClassName="absolute inset-0 bg-[#1a1a1a]"
                    containerClassName="w-full h-full"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 text-center w-full">
                <p className="ds-font-display font-medium text-[24px] leading-8 tracking-[-0.5px] text-white">{displayName}</p>
                <p className="text-white-400 text-[14px] leading-5 tracking-[-0.084px]">{handle}</p>
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

      {shareCardData && (
        <ShareCard
          data={shareCardData}
          onClose={() => setShareCardData(null)}
        />
      )}

      {carouselIndex !== null && activeCarouselItem ? (
        <PhotoCarouselModal
          items={carouselItems}
          activeIndex={carouselIndex}
          onClose={closeCarousel}
          onNext={goToNextCarouselItem}
          onPrev={goToPrevCarouselItem}
          onSelectIndex={setCarouselIndex}
          onShareClick={() => {
            setShareCardData({
              kind: "media",
              title: "Photo",
              imageUrl: activeCarouselItem.fileUrl,
              shareUrl: window.location.href,
              flagCode: displayCountryFlagCode,
              ownerName: shareOwnerName,
              ownerHandle: shareOwnerHandle,
              ownerAvatar: shareOwnerAvatar,
            });
          }}
          profileName={shareOwnerName}
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
