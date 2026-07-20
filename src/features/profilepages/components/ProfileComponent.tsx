"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";

import { toLandingAssetUrl } from "@/lib/landing-assets";
import { sampleProfiles, type SampleProfile } from "../data/profile-data";
import { MoreOptionsButton } from "@/components/ui/MoreOptionsButton";
import { WaitlistPopup } from "@/components/ui/WaitlistPopup";
import CardCarousel from "./CardCarousel";

/* eslint-disable @next/next/no-img-element */

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

function isVideoAsset(url: string) {
  return /\.(mp4|mov|webm|m4v|3gp|3g2)$/i.test(url);
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
    linkedin: "linkedin",
    youtube: "youtube",
    facebook: "facebook",
  };
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
            className={`flex w-full items-center gap-3 text-[14px] font-normal text-white transition ${
              viewHref ? "hover:text-[#d4d4d4]" : "opacity-50 cursor-not-allowed"
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
    navigator.clipboard.writeText(data.shareUrl).catch(() => {});
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
            className={`w-full flex items-center justify-center rounded-full px-4 py-3 text-[14px] font-medium tracking-[-0.084px] transition-all duration-200 ${
              isLinkCopied ? "bg-black text-white" : "bg-white text-black hover:bg-[#ececec]"
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
  const activeItem = items[activeIndex];
  const totalCount = items.length;
  const displayIndex = activeIndex + 1;
  const avatarSrc = toLandingAssetUrl(profileAvatar);
  const profileFlagSrc = toFlagAssetPath(profileFlagCode);
  const countryFlagSrc = toFlagAssetPath(countryFlagCode);
  const [showBrowser, setShowBrowser] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current && !showBrowser) {
      const container = scrollContainerRef.current;
      setTimeout(() => {
        const containerWidth = container.clientWidth;
        if (containerWidth === 0) return;
        const itemWidth = 60; // w-[60px]
        const gap = 12; // gap-3
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
      className="fixed inset-0 z-[100] flex bg-black"
      onClick={onClose}
    >
      {/* Left image panel */}
      <div
        className="relative flex flex-1 flex-col min-w-0"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
      >
        {/* Top bar: image counter + grid toggle */}
        <div className="flex items-center justify-between px-10 py-6">
          <span className="text-[14px] font-normal tracking-[-0.084px] text-[#989898]">{`${displayIndex} of ${totalCount}`}</span>
          <button
            type="button"
            onClick={() => setShowBrowser((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center text-[#989898] transition hover:text-white"
            aria-label="Toggle photo browser"
          >
            <span className="material-symbols-rounded text-[22px]">dashboard</span>
          </button>
        </div>

        {showBrowser ? (
          <div className="flex-1 min-h-0 overflow-y-auto px-10 pb-8">
            <div className="columns-2 md:columns-3 xl:columns-4 gap-6 [column-fill:_balance]">
              {items.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectIndex(idx);
                    setShowBrowser(false);
                  }}
                  className="mb-6 w-full break-inside-avoid overflow-hidden rounded-[22px] bg-[#0a0a0a] text-left"
                  aria-label={`Open photo ${idx + 1}`}
                >
                  <div className="relative">
                    {item.isVideo ? (
                      <>
                        <video
                          src={toLandingAssetUrl(item.fileUrl)}
                          className="h-auto w-full"
                        />
                        <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/55">
                          <span className="material-symbols-rounded text-[18px] text-white">play_arrow</span>
                        </div>
                      </>
                    ) : (
                      <img
                        src={toLandingAssetUrl(item.fileUrl)}
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
            {/* Image + nav arrows */}
            <div className="relative flex flex-1 min-h-0 pb-8">
              {/* Main image */}
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[12px] bg-[#0a0a0a] mx-10">
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
                      onClick={onShareClick}
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

                  {activeItem?.isVideo ? (
                    <video
                      key={`video-${activeIndex}`}
                      src={toLandingAssetUrl(activeItem.fileUrl)}
                      controls
                      autoPlay
                      className="max-h-full max-w-full object-contain carousel-image"
                    />
                  ) : (
                    <img
                      key={`img-${activeIndex}`}
                      src={toLandingAssetUrl(activeItem?.fileUrl)}
                      alt="Carousel media"
                      className="max-h-full max-w-full object-contain carousel-image"
                    />
                  )}
                </div>
              </div>

              {/* Prev arrow — left edge aligned with counter */}
              <button
                type="button"
                onClick={onPrev}
                className="absolute left-10 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-md transition hover:bg-[#f0f0f0]"
                aria-label="Previous photo"
              >
                <span className="material-symbols-rounded text-[24px]">chevron_left</span>
              </button>

              {/* Next arrow — right edge aligned with grid icon */}
              <button
                type="button"
                onClick={onNext}
                className="absolute right-10 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-md transition hover:bg-[#f0f0f0]"
                aria-label="Next photo"
              >
                <span className="material-symbols-rounded text-[24px]">chevron_right</span>
              </button>
            </div>

            {/* Carousel preview strip */}
            <div
              ref={scrollContainerRef}
              className="w-full overflow-x-auto px-10 pb-6 pt-2"
            >
              <div className={`relative flex items-center gap-3 pt-3 w-max ${items.length <= 10 ? "mx-auto" : ""}`}>
                {/* Floating sliding indicator bar */}
                <div
                  className="absolute top-0 left-0 h-[3px] w-[60px] bg-white rounded-full transition-transform duration-300 ease-out z-10"
                  style={{
                    transform: `translateX(calc(${activeIndex} * 72px))`,
                  }}
                />
                {items.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectIndex(idx)}
                    className={`relative h-[60px] w-[60px] shrink-0 rounded-[10px] overflow-hidden transition group ${
                      idx === activeIndex ? "opacity-100" : "opacity-50 hover:opacity-100"
                    }`}
                    aria-label={`View photo ${idx + 1}`}
                  >
                    {item.isVideo ? (
                      <>
                        <video
                          src={toLandingAssetUrl(item.fileUrl)}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <span className="material-symbols-rounded text-white text-[20px]">play_circle</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <img
                          src={toLandingAssetUrl(item.fileUrl)}
                          alt={`Carousel thumbnail ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200" />
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
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

        {/* Divider + quote */}
        {quote ? (
          <div className="border-t border-[#222] pt-6">
            <p className="text-[16px] font-normal leading-[24px] tracking-[-0.096px] text-[#dcdcdc] whitespace-pre-wrap">{quote}</p>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

export default function ProfileComponent({ profile }: { profile: SampleProfile }) {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [showFollowModal, setShowFollowModal] = useState(false);  // Local states for photo carousels on the cards
  const [openContextMenuId, setOpenContextMenuId] = useState<string | null>(null);
  const [shareCardData, setShareCardData] = useState<ShareCardData | null>(null);
  const [carouselIndex, setCarouselIndex] = useState<number | null>(null);
  const [carouselItems, setCarouselItems] = useState<MediaItem[]>([]);
  const contextMenuRef = useRef<HTMLDivElement>(null);


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

    profile.images.gallery.forEach((fileUrl) => {
      items.push({
        id: `media-${profile.id}-${items.length}`,
        fileUrl,
        isVideo: isVideoAsset(fileUrl),
      });
    });

    (profile.countryImages ?? []).forEach((country) => {
      country.images.forEach((fileUrl) => {
        items.push({
          id: `media-${profile.id}-${items.length}`,
          fileUrl,
          isVideo: isVideoAsset(fileUrl),
          countryCode: country.countryCode,
        });
      });
    });

    (profile.collectionImages ?? []).forEach((collection, collectionIdx) => {
      collection.images.forEach((fileUrl) => {
        items.push({
          id: `media-${profile.id}-${items.length}`,
          fileUrl,
          isVideo: isVideoAsset(fileUrl),
          collectionIndex: collectionIdx,
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

  const countryCards = useMemo<CountryCard[]>(() => {
    // Use admin-uploaded country images if available
    if (profile.countryImages && profile.countryImages.length > 0) {
      return profile.countryImages.map((ci, index) => {
        const countryName = COUNTRY_LIST_LOOKUP[ci.countryCode.toUpperCase()] || ci.countryCode;
        const photoPreviewImages = ci.images.filter((url) => !isVideoAsset(url)).slice(0, 5);
        const previewImages = (photoPreviewImages.length > 0 ? photoPreviewImages : ci.images).slice(0, 5);
        return {
          code: `${profile.id}-ci-${index}`,
          name: countryName,
          flagCode: ci.countryCode,
          thumbnailUrl: previewImages[0] || profile.images.cover,
          previewImages,
          photoCount: ci.images.filter((url) => !isVideoAsset(url)).length,
          videoCount: ci.images.filter((url) => isVideoAsset(url)).length,
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
      const fallback = defaultFallbacks[index % Math.max(defaultFallbacks.length, 1)] || profile.images.cover;
      const previewImages = defaultFallbacks.length > 0
        ? Array.from({ length: Math.min(5, defaultFallbacks.length) }, (_, imageIndex) => {
            return defaultFallbacks[(index + imageIndex) % defaultFallbacks.length];
          })
        : [profile.images.cover];
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
        window.history.replaceState({}, "", url.toString());
      }
    } else {
      if (url.searchParams.has("image")) {
        url.searchParams.delete("image");
        window.history.replaceState({}, "", url.toString());
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
            const collectionHref = `/profiles/${profile.id}/collection/${active.collectionIndex}`;
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
              window.location.replace(`/profiles/${profile.id}/country/${itemCountry.toUpperCase()}?image=${encodedImage}`);
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
      } catch (e) {}
    }
  }, [allMediaItems, carouselIndex, profile.id, profile.flagCode]);

  const shareOwnerName = profile.name;
  const shareOwnerHandle = handle;
  const shareOwnerAvatar = profile.images.avatar;

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
    const visibleCountries = allCountryNames.slice(0, 3);
    const countryOverflowCount = Math.max(0, allCountryNames.length - visibleCountries.length);

    // Use admin-uploaded collection images if available
    if (profile.collectionImages && profile.collectionImages.length > 0) {
      return profile.collectionImages.map((ci, index) => {
        const createdAt = new Date(Date.now() - index * 1000 * 60 * 60 * 24 * 19);
        const photoPreviewImages = ci.images.filter((url) => !isVideoAsset(url)).slice(0, 5);
        const previewImages = (photoPreviewImages.length > 0 ? photoPreviewImages : ci.images).slice(0, 5);
        return {
          id: `${profile.id}-collection-${index}`,
          title: ci.title,
          description: profile.bio,
          createdLabel: createdAt.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          thumbnailUrl: previewImages[0] || profile.images.cover,
          previewImages,
          countries: visibleCountries,
          countryOverflowCount,
        };
      });
    }

    const titles = profile.interests.length > 0 ? profile.interests : ["Travel moments"];
    const count = Math.min(4, Math.max(1, Math.min(titles.length, allMediaItems.length || 1)));

    return Array.from({ length: count }).map((_, index) => {
      const thumbnailItem = allMediaItems.length > 0 ? allMediaItems[index % allMediaItems.length] : null;
      const createdAt = new Date(Date.now() - index * 1000 * 60 * 60 * 24 * 19);
      const photoFallbacks = allMediaItems.filter((item) => !item.isVideo).map((item) => item.fileUrl);
      const defaultFallbacks = photoFallbacks.length > 0
        ? photoFallbacks
        : allMediaItems.map((item) => item.fileUrl);
      const previewImages = defaultFallbacks.length > 0
        ? Array.from({ length: Math.min(5, defaultFallbacks.length) }, (_, imageIndex) => {
            return defaultFallbacks[(index + imageIndex) % defaultFallbacks.length];
          })
        : [profile.images.cover];

      return {
        id: `${profile.id}-collection-${index}`,
        title: titles[index % titles.length],
        description: profile.bio,
        createdLabel: createdAt.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        thumbnailUrl: thumbnailItem ? thumbnailItem.fileUrl : profile.images.cover,
        previewImages,
        countries: visibleCountries,
        countryOverflowCount,
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
    if (x) rows.push({ key: "x", label: `@${x}`, url: `https://x.com/${x}` });
    if (instagram) rows.push({ key: "instagram", label: `@${instagram}`, url: `https://instagram.com/${instagram}` });
    if (linkedin) rows.push({ key: "linkedin", label: linkedin, url: `https://linkedin.com/in/${linkedin}` });
    if (youtube) rows.push({ key: "youtube", label: `@${youtube}`, url: `https://youtube.com/@${youtube}` });
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
      <div className="min-h-screen bg-black text-white flex flex-col items-center px-[12px] min-[810px]:px-[32px] min-[1200px]:px-[48px] min-[1440px]:px-[64px]">

        <main className="w-full max-w-[1728px] pb-28 md:pb-20 grid gap-10">
          <section className="min-[811px]:hidden space-y-[12px] flex flex-col items-center w-full">
            <div className="flex flex-col items-center gap-[20px] rounded-[24px] w-full max-w-[400px]">
              <div className="w-full flex flex-col items-center">
                <div className="w-full aspect-[377/248] -mb-[36px] rounded-2xl overflow-hidden bg-[#151515]">
                  <img src={toLandingAssetUrl(profile.images.cover)} alt="Profile cover" className="w-full h-full object-cover" />
                </div>
                <div className="relative z-10 mx-auto h-20 w-20 rounded-2xl border-4 border-black overflow-hidden bg-[#151515]">
                  <img src={toLandingAssetUrl(profile.images.avatar)} alt="Profile avatar" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="flex flex-col items-center gap-[8px] w-full">
                <div className="flex items-center justify-center gap-1.5 text-[#696969] text-[14px] leading-[20px] tracking-[-0.5px]">
                  {profileFlagSrc ? (
                    <img
                      src={profileFlagSrc}
                      alt={`${basedIn} flag`}
                      className="h-[10px] w-[15px] rounded-[2px] object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span>{profileFlagCode}</span>
                  )}
                  <span>{basedIn}</span>
                </div>
                <h1 className="text-white text-[20px] leading-normal tracking-[-0.41px] font-semibold text-center w-full">{displayName}</h1>
                <p className="text-[#a8a8a8] text-[14px] leading-normal tracking-[-0.5px] text-center w-full">{handle}</p>
              </div>

              <div className="flex flex-wrap items-start justify-center gap-[4px] px-[6px] w-full">
                {headerFlagCodes.map((code, index) => (
                  <img
                    key={`${code}-${index}`}
                    src={toFlagAssetPath(code) || ""}
                    alt={`${code} flag`}
                    className="h-[17px] w-[26px] rounded-[2px] object-cover shrink-0"
                    loading="lazy"
                    decoding="async"
                  />
                ))}
                {flagOverflowCount > 0 && (
                  <div className="flex h-[17px] w-[26px] shrink-0 items-center justify-center overflow-hidden rounded-[2px] bg-white">
                    <span className="font-medium text-violet-600 text-[10px] text-center tracking-[-0.408px] whitespace-nowrap">
                      +{flagOverflowCount}
                    </span>
                  </div>
                )}
              </div>

              {/* Mobile Stats Container */}
              <div className="bg-[#111] border-0 border-[#1e1e1e] flex items-center justify-center gap-[20px] rounded-[12px] w-full pt-[18px] pb-[20px] px-[20px]">
                <div className="flex flex-1 flex-col items-center justify-center gap-[2px]">
                  <p className="ds-font-display text-[24px] font-semibold leading-[32px] tracking-[-0.5px] text-white">
                    {profile.countries}
                  </p>
                  <p className="text-[14px] font-normal leading-[20px] tracking-[-0.084px] text-[#989898]">
                    Countries
                  </p>
                </div>
                <div className="flex flex-1 flex-col items-center justify-center gap-[2px]">
                  <p className="ds-font-display text-[24px] font-semibold leading-[32px] tracking-[-0.5px] text-white">
                    {profile.media}
                  </p>
                  <p className="text-[14px] font-normal leading-[20px] tracking-[-0.084px] text-[#989898]">
                    All media
                  </p>
                </div>
                <div className="flex flex-1 flex-col items-center justify-center gap-[2px]">
                  <p className="ds-font-display text-[24px] font-semibold leading-[32px] tracking-[-0.5px] text-white">
                    {profile.collections}
                  </p>
                  <p className="text-[14px] font-normal leading-[20px] tracking-[-0.084px] text-[#989898]">
                    Collections
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="hidden min-[811px]:flex items-end justify-between gap-6 w-full">
            <div className="w-full max-w-[48%] lg:max-w-[500px] xl:max-w-[537px] shrink flex flex-col items-start justify-start gap-[24px] lg:gap-[32px] xl:gap-[40px] pt-[24px] lg:pt-[40px] xl:pt-[48px]">
              <div className="flex flex-col items-start gap-[16px] lg:gap-[24px] xl:gap-[32px] w-full">
                <div className="flex flex-col items-start gap-[12px] lg:gap-[16px] xl:gap-[32px] w-full">
                  <div className="relative size-[64px] lg:size-[100px] xl:size-[120px] shrink-0 overflow-hidden rounded-[20px] bg-[#151515]">
                    <img src={toLandingAssetUrl(profile.images.avatar)} alt="Profile avatar" loading="lazy" decoding="async" className="h-full w-full object-cover rounded-[20px]" />
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

                <div className="flex flex-wrap items-start gap-1.5 lg:gap-2 xl:gap-[8px] w-full xl:w-[480px]">
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

                <div className="flex items-center justify-between xl:justify-start xl:gap-[40px] w-full rounded-[16px] border-l border-black-100 bg-linear-to-r from-[#1c1c1c] to-[rgba(0,0,0,0.1)] px-2 py-2 lg:px-3 lg:py-3 xl:px-[16px] xl:py-[20px]">
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

              <div className="flex items-center gap-[12px] w-full">
                  <button onClick={() => setShowFollowModal(true)} className="flex items-center justify-center flex-1 lg:flex-none w-auto lg:w-[148px] lg:h-[48px] rounded-full bg-white text-black px-3 py-1.5 text-[12px] lg:text-[16px] font-medium tracking-[-0.096px] hover:bg-[#ececec] transition">Follow</button>
                  <button className="flex items-center justify-center flex-1 lg:flex-none w-auto lg:w-[148px] lg:h-[48px] rounded-full border border-[#353535] bg-[#1a1a1a] text-white px-3 py-1.5 text-[12px] lg:text-[16px] font-medium tracking-[-0.096px] hover:bg-[#242424] transition">Connect</button>
                  <button className="size-8 lg:size-[48px] shrink-0 grid place-items-center rounded-full border border-[#353535] bg-[#1a1a1a] text-white hover:bg-[#242424] transition" aria-label="More options">
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
            <div className="w-full max-w-[48%] lg:max-w-[520px] xl:max-w-[640px] shrink-0">
              <div className="relative w-full max-w-[640px] shrink-0 overflow-hidden rounded-3xl lg:rounded-[24px] xl:rounded-[32px] aspect-[640/662]">
                <img src={toLandingAssetUrl(profile.images.cover)} alt="Profile cover" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover rounded-3xl lg:rounded-[24px] xl:rounded-[32px]" />
              </div>
            </div>
          </section>

          {/* Desktop: pill tabs with text */}
          <div className="hidden min-[811px]:flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-full px-6 py-2 text-[16px] leading-6 tracking-[-0.096px] transition ${
                activeTab === "all"
                  ? "bg-black-600 border border-white text-white font-medium"
                  : "bg-black-800 border border-transparent text-white-300 font-normal"
              }`}
            >
              All media
            </button>
            <button
              onClick={() => setActiveTab("countries")}
              className={`rounded-full px-6 py-2 text-[16px] leading-6 tracking-[-0.096px] transition ${
                activeTab === "countries"
                  ? "bg-black-600 border border-white text-white font-medium"
                  : "bg-black-800 border border-transparent text-white-300 font-normal"
              }`}
            >
              Countries
            </button>
            <button
              onClick={() => setActiveTab("collections")}
              className={`rounded-full px-6 py-2 text-[16px] leading-6 tracking-[-0.096px] transition ${
                activeTab === "collections"
                  ? "bg-black-600 border border-white text-white font-medium"
                  : "bg-black-800 border border-transparent text-white-300 font-normal"
              }`}
            >
              Collections
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`rounded-full px-6 py-2 text-[16px] leading-6 tracking-[-0.096px] transition ${
                activeTab === "about"
                  ? "bg-black-600 border border-white text-white font-medium"
                  : "bg-black-800 border border-transparent text-white-300 font-normal"
              }`}
            >
              About me
            </button>
          </div>

          {/* Mobile/iPad: icon-only tabs with sliding underline indicator */}
          {(() => {
            const mobileTabs: { key: TabKey; icon: string }[] = [
              { key: "all", icon: "photo_library" },
              { key: "countries", icon: "public" },
              { key: "collections", icon: "folder" },
              { key: "about", icon: "person" },
            ];
            const activeIndex = mobileTabs.findIndex((t) => t.key === activeTab);
            return (
              <div className="flex min-[811px]:hidden flex-col w-full border-b border-black-400 relative">
                <div className="flex items-center w-full">
                  {mobileTabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => {
                        navigator.vibrate?.(8);
                        setActiveTab(tab.key);
                      }}
                      className={`flex-1 flex items-center justify-center px-6 py-4 transition-colors duration-200 ${
                        activeTab === tab.key ? "text-white" : "text-[#666]"
                      }`}
                    >
                      <span className="material-symbols-rounded text-[24px]">{tab.icon}</span>
                    </button>
                  ))}
                </div>
                {/* Sliding underline */}
                <div
                  className="absolute bottom-0 h-0.5 bg-white rounded-full"
                  style={{
                    width: `${100 / mobileTabs.length}%`,
                    transform: `translateX(${activeIndex * 100}%)`,
                    transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              </div>
            );
          })()}

          {activeTab === "all" ? (
            <section className="pb-25 min-h-62.5">
              {allMediaItems.length === 0 ? (
                <div className="max-w-xl mx-auto flex flex-col items-center gap-5 text-center py-10">
                  <h2 className="text-[30px] leading-none tracking-[-0.5px] font-semibold text-white">All media</h2>
                  <p className="text-white-500 text-[14px] leading-[1.4]">
                    Add media to a country or collection to start building your gallery.
                  </p>
                </div>
              ) : (
                <div className="columns-2 sm:columns-3 xl:columns-4 gap-3 md:gap-5">
                  {allMediaItems.map((item, index) => {
                    const isMenuOpen = openContextMenuId === item.id;
                    const displayCountryCode = item.countryCode || profileFlagCode;
                    const collectionHref =
                      typeof item.collectionIndex === "number" && profile.collectionImages?.[item.collectionIndex]
                        ? `/profiles/${profile.id}/collection/${item.collectionIndex}`
                        : undefined;
                    const viewHref = collectionHref || (displayCountryCode
                      ? `/profiles/${profile.id}/country/${displayCountryCode.toUpperCase()}`
                      : undefined);
                    const viewLabel = collectionHref ? "View collection" : "View country";
                    const shareHref = collectionHref || viewHref;
                    return (
                      <div
                        key={item.id}
                        className="group mb-3 md:mb-5 inline-block w-full break-inside-avoid relative [-webkit-column-break-inside:avoid]"
                      >
                        <div className="relative overflow-hidden rounded-[12px] md:rounded-2xl bg-[#111]">
                          {item.isVideo ? (
                            <>
                              <video
                                src={toLandingAssetUrl(item.fileUrl)}
                                muted
                                playsInline
                                loop
                                preload="metadata"
                                className="w-full object-cover rounded-[12px] md:rounded-2xl"
                                onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                                onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  openCarouselAt(index);
                                }}
                              />
                              <div className="absolute top-4 left-4 group-hover:opacity-0 transition-opacity pointer-events-none">
                                <span
                                  className="material-symbols-rounded text-[24px] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 700, 'GRAD' 200, 'opsz' 24" }}
                                >
                                  play_arrow
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <img
                                src={toLandingAssetUrl(item.fileUrl)}
                                alt="Uploaded media"
                                loading="lazy"
                                decoding="async"
                                className="w-full object-cover rounded-[12px] md:rounded-2xl cursor-pointer"
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  openCarouselAt(index);
                                }}
                              />
                              </>
                          )}

                          <MoreOptionsButton
                            isOpen={isMenuOpen}
                            label="Open media menu"
                            size="sm"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              setOpenContextMenuId(isMenuOpen ? null : item.id);
                            }}
                          />
                        </div>

                        {/* Hover Flag */}
                        {displayCountryCode ? (
                          <div className="absolute top-3 right-3 z-20 transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-auto group/flag">
                            <div className="flex items-center drop-shadow-md cursor-pointer">
                              <img
                                src={toFlagAssetPath(displayCountryCode)}
                                alt={displayCountryCode}
                                className="h-3.5 w-5 rounded-xs object-cover"
                              />
                            </div>

                            {/* Tooltip */}
                            <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-2.5 flex flex-col items-center opacity-0 transition-all duration-200 group-hover/flag:opacity-100 pointer-events-none origin-bottom scale-95 group-hover/flag:scale-100 drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                              <div className="whitespace-nowrap rounded-xl bg-white px-3.5 py-1.5 text-[15px] font-medium tracking-tight text-black">
                                {COUNTRY_LIST_LOOKUP[displayCountryCode.toUpperCase()] || displayCountryCode}
                              </div>
                              <div className="-mt-1.5 h-3 w-3 rotate-45 bg-white rounded-[2px]" />
                            </div>
                          </div>
                        ) : null}


                        {isMenuOpen ? (
                          <ContextMenu
                            kind="media"
                            viewLabel={viewLabel}
                            shareLabel="Share photo"
                            flagCode={collectionHref ? undefined : displayCountryCode}
                            viewHref={viewHref}
                            onShare={() => {
                              const shareUrl = new URL(window.location.origin);
                              if (shareHref?.includes("/collection/")) {
                                shareUrl.pathname = shareHref;
                              } else if (displayCountryCode) {
                                shareUrl.pathname = `/profiles/${profile.id}/country/${displayCountryCode.toUpperCase()}`;
                              } else {
                                shareUrl.pathname = `/profiles/${profile.id}`;
                              }
                              shareUrl.searchParams.set("image", btoa(unescape(encodeURIComponent(item.fileUrl))));
                              openShareCard({
                                kind: "media",
                                title: "Share moment",
                                imageUrl: item.fileUrl,
                                shareUrl: shareUrl.toString(),
                                flagCode: displayCountryCode,
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
                    );
                  })}
                </div>
              )}
            </section>
          ) : null}

          {activeTab === "countries" ? (
            <section className="pb-16">
              {countryCards.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#2b2b2b] bg-[#0e0e0e] p-10 md:p-16">
                  <div className="max-w-150 mx-auto flex flex-col items-center gap-6 text-center">
                    <div className="flex items-center gap-3">
                      {COUNTRIES_EMPTY_PREVIEW_IMAGES.map((src, idx) => (
                        <div key={src} className="w-19 h-19 md:w-25 md:h-25 rounded-[10px] overflow-hidden">
                          <img src={toLandingAssetUrl(src)} alt={`Country preview ${idx + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
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
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
                  {countryCards.map((country) => {
                    const contextMenuId = `country-${country.code}`;
                    const isMenuOpen = openContextMenuId === contextMenuId;
                    const countryHref = `/profiles/${profile.id}/country/${country.flagCode.toUpperCase()}`;
                    return (
                      <Link key={country.code} href={countryHref} className="flex flex-col gap-4">
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
                        <div className="flex flex-col gap-2 px-[6px]">
                          <div className="flex items-center gap-2">
                            <div className="h-[15.6px] w-6 overflow-hidden rounded-sm shadow-[1.62px_1.62px_1.62px_0px_rgba(0,0,0,0.18)] shrink-0">
                              <img
                                src={`/flags/${country.flagCode.toUpperCase()}.svg`}
                                alt={country.name}
                                className="block w-full h-full object-cover"
                              />
                            </div>
                            <p className="text-white text-[18px] font-semibold leading-6.5 tracking-[-0.198px] truncate">
                              {country.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[#a1a1a1] text-[14px] leading-normal tracking-[-0.41px]">{country.photoCount} photos</span>
                            <span className="text-[#a1a1a1] text-[8px] leading-none">&bull;</span>
                            <span className="text-[#a1a1a1] text-[14px] leading-normal tracking-[-0.41px]">{country.videoCount} Videos</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          ) : null}

          {activeTab === "collections" ? (
            <section className="w-full pb-8 md:pb-12 space-y-6">
              {collectionCards.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#2b2b2b] bg-[#0e0e0e] px-6 py-12 md:px-10 md:py-16">
                  <div className="max-w-150 mx-auto flex flex-col items-center gap-6 text-center">
                    <div className="flex items-center gap-3">
                      {COLLECTIONS_EMPTY_PREVIEW_IMAGES.map((src, idx) => (
                        <div key={src} className="w-19 h-19 md:w-25 md:h-25 rounded-[10px] overflow-hidden">
                          <img src={toLandingAssetUrl(src)} alt={`Collection preview ${idx + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
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
                <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {collectionCards.map((collection, idx) => {
                    const collectionHref = `/profiles/${profile.id}/collection/${idx}`;
                    const contextMenuId = `collection-${collection.id}`;
                    const isMenuOpen = openContextMenuId === contextMenuId;
                    return (
                      <Link
                        key={collection.id}
                        href={collectionHref}
                        className="flex flex-col"
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

                        <div className="flex flex-col px-[6px] pt-4">
                          <div className="flex flex-col gap-1.5 mb-3">
                            <p className="text-[#a1a1a1] text-[14px] leading-normal tracking-[-0.41px]">{collection.createdLabel}</p>
                            <p className="text-white text-[18px] font-semibold leading-6.5 tracking-[-0.198px] min-w-full w-min line-clamp-1">{collection.title}</p>
                          </div>
                          {/* Hidden countries for now as per design request until Admin CMS supports collection country multi-select */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            {collection.countries.map((country) => (
                              <span
                                key={`${collection.id}-${country}`}
                                className="backdrop-blur-[2px] bg-black-800 border border-[#262626] border-solid flex items-center justify-center py-1 px-2.5 rounded-[6px] text-[#a1a1a1] text-[12px] leading-none tracking-[-0.408px]"
                              >
                                {country}
                              </span>
                            ))}
                            {collection.countryOverflowCount > 0 ? (
                              <span className="backdrop-blur-[2px] bg-black-800 border border-[#262626] border-solid flex items-center justify-center py-1 px-2.5 rounded-[6px] text-[#a1a1a1] text-[12px] leading-none tracking-[-0.408px]">
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
          ) : null}

          {activeTab === "about" ? (
            hasAboutContent ? (
              <section className="w-full max-w-[1112px] mx-auto grid md:grid-cols-[minmax(0,1fr)_320px] lg:grid-cols-[minmax(0,1fr)_360px] gap-6 lg:gap-8 items-stretch">
                <article className="relative rounded-[20px] border border-[#1e1e1e] pt-8 pb-10 px-8 bg-[#111] flex flex-col gap-8"> 
                  <div className="flex flex-col gap-4">
                    <h3 className="ds-font-display text-white text-[24px] font-semibold tracking-[-0.5px] leading-8">About</h3>
                    <p className="text-[#dcdcdc] text-[16px] leading-6 tracking-[-0.096px]">{profile.bio || "No bio yet."}</p>
                  </div>

                  <div className="flex gap-3">
                    {aboutPhotos.length > 0 ? (
                      aboutPhotos.map((src, idx) => (
                        <div key={`${src}-${idx}`} className="flex-1 min-w-0 rounded-[12px] overflow-hidden bg-[#151515] aspect-square">
                          <img src={toLandingAssetUrl(src)} alt={`About photo ${idx + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                        </div>
                      ))
                    ) : (
                      <div className="flex-1 rounded-[12px] border border-dashed border-[#1e1e1e] bg-[#111] p-6 text-sm text-[#989898] text-center">
                        No photos added yet.
                      </div>
                    )}
                  </div>

                  <hr className="border-t border-[#1e1e1e] w-full m-0" />

                  <div className="flex flex-col gap-6">
                    <h4 className="ds-font-display text-white text-[24px] font-semibold tracking-[-0.5px] leading-8">My Interests</h4>
                    {profile.interests.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest) => (
                          <span key={interest} className="flex items-center gap-1.5 pl-3 pr-4 py-2 rounded-[68px] bg-[#1e1e1e] text-white text-[16px] leading-6 tracking-[-0.096px]">
                            {interest}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[#989898] text-[14px]">No interests added yet.</p>
                    )}
                  </div>
                </article>

                <aside className="rounded-[20px] border border-[#1e1e1e] pt-8 pb-10 px-8 bg-[#111] flex flex-col gap-8">
                  <div className="flex flex-col gap-3 pb-8 border-b border-[#1e1e1e]">
                    <p className="text-[#989898] text-[14px] font-normal leading-5 tracking-[-0.084px]">Username</p>
                    <div className="flex items-center gap-2">
                      <p className="ds-font-display text-white text-[18px] font-medium leading-6.5 tracking-[-0.198px]">{handle}</p>
                      <button type="button" aria-label="Edit username" className="text-[#989898] hover:text-white transition">
                        <span className="material-symbols-rounded text-[18px]">edit</span>
                      </button>
                    </div>
                    <p className="text-[#656565] text-[14px] truncate tracking-[-0.41px]">travingat.com/{handle.replace(/^@/, "")}</p>
                  </div>

                  <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-3">
                      <p className="text-[#989898] text-[14px] font-normal leading-5 tracking-[-0.084px]">Home land</p>
                      <div className="flex items-center gap-2 text-white text-[16px] font-medium tracking-[-0.096px]">
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

                    <div className="flex flex-col gap-3">
                      <p className="text-[#989898] text-[14px] font-normal leading-5 tracking-[-0.084px]">Currently in</p>
                      <div className="flex items-center gap-2 text-white text-[16px] font-medium tracking-[-0.096px]">
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

                    <div className="flex flex-col gap-3">
                      <p className="text-[#989898] text-[14px] font-normal leading-5 tracking-[-0.084px]">Speaks</p>
                      {profile.languages.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
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
          ) : null}

        </main>
      </div>

      <div className="md:hidden fixed inset-x-2 bottom-2 z-40 rounded-full backdrop-blur-[6px] bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.1)] p-[8px] shadow-[0px_12px_12px_0px_rgba(0,0,0,0.12)] flex items-center overflow-clip">
        <div className="flex gap-[8px] items-center w-full">
          <button onClick={() => setShowFollowModal(true)} className="flex-1 rounded-full bg-white text-black px-[18px] py-[10px] text-[16px] font-medium leading-[24px] tracking-[-0.096px]">Follow</button>
          <button className="h-[44px] w-[43px] shrink-0 rounded-full border border-[#353535] bg-[#1a1a1a] grid place-items-center text-white" aria-label="More options">
            <span className="grid grid-cols-2 gap-1">
              <span className="h-[3px] w-[3px] rounded-full bg-white" />
              <span className="h-[3px] w-[3px] rounded-full bg-white" />
              <span className="h-[3px] w-[3px] rounded-full bg-white" />
              <span className="h-[3px] w-[3px] rounded-full bg-white" />
            </span>
          </button>
          <button className="flex-1 rounded-full border border-[#353535] bg-[#1a1a1a] text-white px-[18px] py-[10px] text-[16px] font-medium leading-[24px] tracking-[-0.096px]">Connect</button>
        </div>
      </div>

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
                <div className="-mb-8 h-48.5 w-50 overflow-hidden rounded-xl shrink-0">
                  <img src={toLandingAssetUrl(profile.images.cover)} alt={displayName} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </div>
                <div className="-mb-8 h-15 w-15 overflow-hidden rounded-xl shadow-[8px_8px_12px_0px_rgba(0,0,0,0.25)] shrink-0">
                  <img src={toLandingAssetUrl(profile.images.avatar)} alt={displayName} loading="lazy" decoding="async" className="w-full h-full object-cover" />
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
                navigator.clipboard.writeText(window.location.href).catch(() => {});
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
