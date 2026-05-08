"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";

import { toLandingAssetUrl } from "@/lib/landing-assets";
import type { SampleProfile } from "@/profiles/profile-data";
import { MoreOptionsButton } from "@/components/ui/MoreOptionsButton";
import { WaitlistPopup } from "@/components/ui/WaitlistPopup";

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

function SocialIcon({ platform }: { platform: string }) {
  const cls = "w-5 h-5";
  if (platform === "x") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.745l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (platform === "instagram") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
  }
  if (platform === "linkedin") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }
  if (platform === "youtube") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }
  return null;
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
        className="absolute right-3 bottom-14 z-30 w-[220px] rounded-2xl border border-[#2a2a2a] bg-[#111] p-5 shadow-[0_8px_40px_rgba(0,0,0,0.7)]"
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
            className={`flex w-full items-center gap-3 text-[17px] font-medium tracking-[-0.3px] text-white transition ${
              viewHref ? "hover:text-[#d4d4d4]" : "opacity-50 cursor-not-allowed"
            }`}
          >
            <span className="material-symbols-rounded text-[24px]">folder_open</span>
            <span>{viewLabel}</span>
            {flagSrc ? (
              <div className="ml-auto flex items-center justify-center rounded-[5px] overflow-hidden shadow-sm w-[26px] h-[18px] flex-shrink-0">
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
          className="flex w-full items-center gap-3 text-[17px] font-medium tracking-[-0.3px] text-white hover:text-[#d4d4d4] transition-colors"
        >
          <span className="material-symbols-rounded text-[24px]">ios_share</span>
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
          className="flex w-full items-center gap-3 text-[17px] font-medium tracking-[-0.3px] text-white hover:text-[#d4d4d4] transition-colors"
        >
          <span className="material-symbols-rounded text-[24px]">favorite_border</span>
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
          className="flex w-full items-center gap-3 text-[17px] font-medium tracking-[-0.3px] text-white hover:text-[#d4d4d4] transition-colors"
        >
          <span className="material-symbols-rounded text-[24px]">block</span>
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

function ShareIcon({ type }: { type: "whatsapp" | "messenger" | "facebook" | "instagram" | "x" }) {
  if (type === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="currentColor">
        <path d="M20.52 3.48A11.77 11.77 0 0 0 12.04.25C5.57.25.31 5.5.31 11.98c0 2.1.55 4.16 1.6 5.98L.25 23.75l5.93-1.64a11.7 11.7 0 0 0 5.85 1.5h.01c6.48 0 11.73-5.25 11.73-11.73 0-3.13-1.22-6.07-3.25-8.4zm-8.48 18.1h-.01a9.72 9.72 0 0 1-4.95-1.36l-.36-.21-3.52.97.94-3.44-.23-.36a9.73 9.73 0 1 1 8.13 4.4zm5.64-7.25c-.3-.15-1.78-.88-2.06-.98-.28-.1-.49-.15-.69.15-.2.3-.79.98-.97 1.18-.18.2-.36.23-.66.08-.3-.15-1.26-.46-2.4-1.47-.88-.78-1.47-1.74-1.64-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.36.46-.54.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.54-.08-.15-.69-1.66-.94-2.27-.25-.6-.5-.52-.69-.53h-.6c-.2 0-.54.08-.83.38-.28.3-1.1 1.07-1.1 2.6 0 1.53 1.12 3.01 1.27 3.22.15.2 2.2 3.36 5.33 4.72.75.32 1.33.51 1.78.65.75.24 1.43.2 1.97.12.6-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.08-.13-.28-.2-.58-.36z" />
      </svg>
    );
  }
  if (type === "messenger") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.02 2 11c0 2.84 1.52 5.39 3.9 7.05V22l3.54-1.94c.83.23 1.7.36 2.56.36 5.52 0 10-4.02 10-9s-4.48-9-10-9zm1 12.5-2.64-2.82L5 14.5l6.02-6.5 2.63 2.82L19 8l-6 6.5z" />
      </svg>
    );
  }
  if (type === "facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="currentColor">
        <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.24c-1.22 0-1.6.76-1.6 1.54V12H16l-.4 3h-2v7A10 10 0 0 0 22 12z" />
      </svg>
    );
  }
  if (type === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="currentColor">
        <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3h10zm-5 3.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5zm0 2A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5zm4.75-4.1a1.1 1.1 0 1 0 1.1 1.1 1.1 1.1 0 0 0-1.1-1.1z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.745l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
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
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/90 px-4 py-10"
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
                { type: "whatsapp", color: "text-[#25d366]" },
                { type: "messenger", color: "text-[#0084ff]" },
                { type: "facebook", color: "text-[#1877f2]" },
                { type: "instagram", color: "text-[#f56040]" },
                { type: "x", color: "text-white" },
              ] as const
            ).map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => handleSocialShare(item.type)}
                className="flex-1 aspect-square rounded-xl bg-black-300 p-2.5 grid place-items-center hover:bg-black-200 transition"
                aria-label={`Share via ${item.type}`}
              >
                <span className={item.color}>
                  <ShareIcon type={item.type} />
                </span>
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

  return (
    <div
      className="fixed inset-0 z-50 flex bg-black/90"
      onClick={onClose}
    >
      {/* Left image panel */}
      <div
        className="relative flex flex-1 flex-col min-w-0"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
      >
        {/* Top bar: image counter + copy link */}
        <div className="flex items-center justify-between px-10 py-6 text-[15px] tracking-[-0.4px] text-[#a8a8a8]">
          <span>{`${displayIndex} of ${totalCount}`}</span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href).catch(() => {});
            }}
            className="flex h-8 w-8 items-center justify-center text-[#a8a8a8] transition hover:text-white"
            aria-label="Copy link"
          >
            <span className="material-symbols-rounded text-[22px]">photo_library</span>
          </button>
        </div>

        {/* Image + nav arrows */}
        <div className="relative flex flex-1 min-h-0 pb-8">
          {/* Main image */}
          <div className="h-full w-full overflow-hidden bg-[#0a0a0a]">
            {activeItem?.isVideo ? (
              <video
                src={toLandingAssetUrl(activeItem.fileUrl)}
                controls
                autoPlay
                className="h-full w-full object-contain"
              />
            ) : (
              <img
                src={toLandingAssetUrl(activeItem?.fileUrl)}
                alt="Carousel media"
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
          <div className="relative">
            <MoreOptionsButton
              isOpen={false}
              onClick={() => {}}
              label="More options"
              size="sm"
              showOnHover={false}
              positioned={false}
            />
          </div>
        </div>

        {/* Country + description */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            {countryFlagSrc ? (
              <img src={countryFlagSrc} alt="" className="h-[18px] w-[26px] rounded-[3px] object-cover shadow-sm" />
            ) : null}
            <p className="text-[22px] font-semibold tracking-[-0.5px] text-[#ededed]">
              {countryName || ""}
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

export default function ProfileComponent({ profile }: { profile: SampleProfile }) {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [countryPhotoIndexByCode, setCountryPhotoIndexByCode] = useState<Record<string, number>>({});
  const [collectionPhotoIndexById, setCollectionPhotoIndexById] = useState<Record<string, number>>({});
  const [openContextMenuId, setOpenContextMenuId] = useState<string | null>(null);
  const [shareCardData, setShareCardData] = useState<ShareCardData | null>(null);
  const [carouselIndex, setCarouselIndex] = useState<number | null>(null);
  const [carouselItems, setCarouselItems] = useState<MediaItem[]>([]);
  const navMenuRef = useRef<HTMLDivElement | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showNavMenu) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (navMenuRef.current && !navMenuRef.current.contains(target)) {
        setShowNavMenu(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [showNavMenu]);

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

  useEffect(() => {
    setCountryPhotoIndexByCode({});
    setCollectionPhotoIndexById({});
    setOpenContextMenuId(null);
    setShareCardData(null);
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
  const carouselCountryName = carouselCountryCode
    ? COUNTRY_LIST_LOOKUP[carouselCountryCode] || carouselCountryCode
    : basedIn;
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

  const socialRows = useMemo(() => {
    const { x, instagram, linkedin, youtube } = profile.socials;
    const rows: { key: string; label: string; url: string }[] = [];
    if (x) rows.push({ key: "x", label: `x.com/${x}`, url: `https://x.com/${x}` });
    if (instagram) rows.push({ key: "instagram", label: `instagram.com/${instagram}`, url: `https://instagram.com/${instagram}` });
    if (linkedin) rows.push({ key: "linkedin", label: `linkedin.com/in/${linkedin}`, url: `https://linkedin.com/in/${linkedin}` });
    if (youtube) rows.push({ key: "youtube", label: `youtube.com/@${youtube}`, url: `https://youtube.com/@${youtube}` });
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
      <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 md:px-10 xl:px-24">
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

            <div className="relative" ref={navMenuRef}>
              <button
                onClick={() => setShowNavMenu((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl border border-black-600 bg-[#0b0b0b] px-3 py-2"
                aria-label="Open profile menu"
              >
                <span className="material-symbols-rounded text-[#e3e3e3] text-[21px]">dehaze</span>
                <div className="hidden md:block h-7 w-7 overflow-hidden rounded-lg">
                  <img src={toLandingAssetUrl(profile.images.avatar)} alt="Profile" className="h-full w-full object-cover" />
                </div>
              </button>

              {showNavMenu ? (
                <div className="absolute right-0 top-full z-30 mt-3 w-55 rounded-2xl border border-black-400 bg-[#101010] p-2 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
                  <Link
                    href="/#featured"
                    onClick={() => setShowNavMenu(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#d8d8d8] hover:bg-[#1b1b1b]"
                  >
                    <span className="material-symbols-rounded text-[17px] text-[#9a9a9a]">arrow_back</span>
                    Back
                  </Link>
                  <a
                    href="/#join"
                    onClick={() => setShowNavMenu(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#d8d8d8] hover:bg-[#1b1b1b]"
                  >
                    <span className="material-symbols-rounded text-[17px] text-[#9a9a9a]">login</span>
                    Join now
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className="w-full max-w-372 pb-28 md:pb-20 grid gap-10">
          <section className="lg:hidden space-y-5">
            <div className="flex flex-col items-center gap-5 rounded-3xl w-full">
              <div className="w-full">
                <div className="h-50 -mb-9 rounded-xl overflow-hidden bg-[#151515]">
                  <img src={toLandingAssetUrl(profile.images.cover)} alt="Profile cover" className="w-full h-full object-cover" />
                </div>
                <div className="relative z-10 mx-auto h-20 w-20 rounded-2xl border-4 border-black overflow-hidden bg-[#151515]">
                  <img src={toLandingAssetUrl(profile.images.avatar)} alt="Profile avatar" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="pt-1 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[#696969] text-sm">
                  {profileFlagSrc ? (
                    <img
                      src={profileFlagSrc}
                      alt={`${basedIn} flag`}
                      className="h-4 w-6 rounded-xs object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span>{profileFlagCode}</span>
                  )}
                  <span>{basedIn}</span>
                </div>
                <h1 className="text-white text-[28px] leading-tight tracking-[-0.5px] font-semibold mt-2">{displayName}</h1>
                <p className="text-[#a8a8a8] text-[16px] mt-1">{handle}</p>
              </div>
            </div>

            <div className="grid grid-cols-[repeat(10,24px)] justify-center gap-1">
              {headerFlagCodes.map((code, index) => (
                <img
                  key={`${code}-${index}`}
                  src={toFlagAssetPath(code) || ""}
                  alt={`${code} flag`}
                  className="h-4 w-6 rounded-xs object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ))}
              {flagOverflowCount > 0 && (
                <div className="flex h-4 w-6 shrink-0 items-center justify-center overflow-hidden rounded-xs bg-white">
                  <span className="font-medium text-violet-600 text-[10px] text-center tracking-[-0.408px] whitespace-nowrap">
                    +{flagOverflowCount}
                  </span>
                </div>
              )}
            </div>

            <div className="w-full rounded-2xl border border-[#202020] bg-[#111] px-5 py-5">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-white text-[28px] leading-none tracking-[-0.4px] font-semibold">{profile.countries}</p>
                  <p className="text-white-400 text-[12px] mt-1">Countries</p>
                </div>
                <div>
                  <p className="text-white text-[28px] leading-none tracking-[-0.4px] font-semibold">{profile.media}</p>
                  <p className="text-white-400 text-[12px] mt-1">All media</p>
                </div>
                <div>
                  <p className="text-white text-[28px] leading-none tracking-[-0.4px] font-semibold">{profile.collections}</p>
                  <p className="text-white-400 text-[12px] mt-1">Collections</p>
                </div>
              </div>
            </div>
          </section>

          <section className="hidden lg:grid lg:grid-cols-[600px_minmax(0,1fr)] gap-20 items-end">
            <div className="space-y-10 pt-12 self-end">
              <div className="space-y-8">
                <div className="relative h-30 w-30 overflow-hidden rounded-2xl bg-[#151515]">
                  <img src={toLandingAssetUrl(profile.images.avatar)} alt="Profile avatar" loading="lazy" decoding="async" className="h-full w-full object-cover rounded-2xl" />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-white-400 text-[18px] tracking-[-0.198px] leading-6.5">
                    {profileFlagSrc ? (
                      <img
                        src={profileFlagSrc}
                        alt={`${basedIn} flag`}
                        className="h-4 w-6 rounded-sm object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <span>{profileFlagCode}</span>
                    )}
                    <span>{basedIn}</span>
                  </div>

                  <h1 className="ds-font-display text-[44px] leading-13 tracking-[-0.5px] font-semibold text-white">{displayName}</h1>

                  <p className="ds-font-display text-white-400 text-[24px] leading-8 tracking-[-0.5px] font-normal">{handle}</p>
                </div>
              </div>

              <div className="grid grid-cols-[repeat(12,30px)] gap-2">
                {headerFlagCodes.map((code, index) => (
                  <img
                    key={`${code}-${index}`}
                    src={toFlagAssetPath(code) || ""}
                    alt={`${code} flag`}
                    className="h-5 w-7.5 rounded-xs object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ))}
                {flagOverflowCount > 0 && (
                  <div className="flex h-5 w-7.5 shrink-0 items-center justify-center overflow-hidden rounded-xs bg-white">
                    <span className="font-medium text-violet-600 text-[11px] text-center tracking-[-0.408px] whitespace-nowrap">
                      +{flagOverflowCount}
                    </span>
                  </div>
                )}
              </div>

              <div className="w-full rounded-2xl border-l border-black-100 bg-linear-to-r from-[#1c1c1c] to-[rgba(0,0,0,0.1)] px-4 py-5">
                <div className="flex items-center gap-10">
                  <div className="flex items-center gap-4 rounded-xl">
                    <div className="relative h-15 w-15 shrink-0">
                      <img
                        src="/images/Globe.png"
                        alt="Globe icon"
                        className="pointer-events-none absolute top-1/2 left-1/2 h-15 w-15 -translate-x-1/2 -translate-y-1/2 object-contain"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="ds-font-display text-[24px] leading-8 tracking-[-0.5px] text-white font-semibold">{profile.countries}</p>
                      <p className="text-[14px] leading-5 tracking-[-0.084px] text-white-400 font-normal">Countries</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-xl">
                    <div className="relative h-15 w-15 shrink-0">
                      <img
                        src="/images/media.png"
                        alt="Media icon"
                        className="pointer-events-none absolute top-1/2 left-1/2 h-15 w-15 -translate-x-1/2 -translate-y-1/2 object-contain"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="ds-font-display text-[24px] leading-8 tracking-[-0.5px] text-white font-semibold">{profile.media}</p>
                      <p className="text-[14px] leading-5 tracking-[-0.084px] text-white-400 font-normal">All media</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-xl">
                    <div className="relative h-15 w-15 shrink-0">
                      <img
                        src="/images/collections.png"
                        alt="Collections icon"
                        className="pointer-events-none absolute top-1/2 left-1/2 h-15 w-15 -translate-x-1/2 -translate-y-1/2 object-contain"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="ds-font-display text-[24px] leading-8 tracking-[-0.5px] text-white font-semibold">{profile.collections}</p>
                      <p className="text-[14px] leading-5 tracking-[-0.084px] text-white-400 font-normal">Collections</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => setShowFollowModal(true)} className="w-37 rounded-full bg-white text-black px-5 py-3 text-[16px] font-medium leading-6 tracking-[-0.096px] hover:bg-[#ececec] transition">Follow</button>
                <button className="w-37 rounded-full border border-black-100 bg-black-700 text-white px-5 py-3 text-[16px] font-medium leading-6 tracking-[-0.096px] hover:bg-[#242424] transition">Connect</button>
                <button className="h-12 w-12 grid place-items-center rounded-full border border-black-100 bg-black-700 text-white hover:bg-[#242424] transition" aria-label="More options">
                  <span className="material-symbols-rounded text-[20px]">grid_view</span>
                </button>
              </div>
            </div>

            <div className="flex flex-row items-end justify-end self-stretch">
              <div className="relative aspect-640/662 h-full w-full max-w-160 overflow-hidden rounded-4xl bg-[#111]">
                <img src={toLandingAssetUrl(profile.images.cover)} alt="Profile cover" loading="lazy" decoding="async" className="w-full h-full object-cover rounded-4xl" />
              </div>
            </div>
          </section>

          {/* Desktop: pill tabs with text */}
          <div className="hidden lg:flex items-center justify-center gap-2 flex-wrap">
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
              <div className="flex lg:hidden flex-col w-full border-b border-black-400 relative">
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
                <div className="columns-2 md:columns-3 xl:columns-4 gap-5">
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
                        className="group mb-5 inline-block w-full break-inside-avoid relative [-webkit-column-break-inside:avoid]"
                      >
                        <div className="relative overflow-hidden rounded-2xl bg-[#111]">
                          {item.isVideo ? (
                            <>
                              <video
                                src={toLandingAssetUrl(item.fileUrl)}
                                muted
                                playsInline
                                loop
                                preload="metadata"
                                className="w-full object-cover rounded-2xl"
                                onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                                onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                                onClick={(e) => {
                                  const v = e.currentTarget;
                                  if (v.paused) v.play().catch(() => {});
                                  else {
                                    v.pause();
                                    v.currentTime = 0;
                                  }
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
                                className="w-full object-cover rounded-2xl cursor-pointer"
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  openCarouselAt(index);
                                }}
                              />
                              {/* Hover overlay */}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 pointer-events-none" />
                            </>
                          )}
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
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {countryCards.map((country) => {
                    const contextMenuId = `country-${country.code}`;
                    const isMenuOpen = openContextMenuId === contextMenuId;
                    const countryHref = `/profiles/${profile.id}/country/${country.flagCode.toUpperCase()}`;
                    return (
                      <Link key={country.code} href={countryHref} className="flex flex-col gap-4">
                        {/* Photo */}
                        <div className="relative group">
                          <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-[#151515]">
                            <img
                              src={toLandingAssetUrl(
                                country.previewImages[countryPhotoIndexByCode[country.code] ?? 0] || country.thumbnailUrl
                              )}
                              alt={country.name}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover block transition-transform duration-300 group-hover:scale-[1.03]"
                            />

                            {country.previewImages.length > 1 ? (
                              <>
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    setCountryPhotoIndexByCode((prev) => {
                                      const current = prev[country.code] ?? 0;
                                      const next =
                                        (current - 1 + country.previewImages.length) % country.previewImages.length;
                                      return { ...prev, [country.code]: next };
                                    });
                                  }}
                                  className="hidden md:grid absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 place-items-center rounded-full bg-white/95 text-black shadow-md opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-white hover:scale-105 focus-visible:opacity-100"
                                  aria-label={`Previous photo for ${country.name}`}
                                >
                                  <span className="material-symbols-rounded text-[20px]">chevron_left</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    setCountryPhotoIndexByCode((prev) => {
                                      const current = prev[country.code] ?? 0;
                                      const next = (current + 1) % country.previewImages.length;
                                      return { ...prev, [country.code]: next };
                                    });
                                  }}
                                  className="hidden md:grid absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 place-items-center rounded-full bg-white/95 text-black shadow-md opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-white hover:scale-105 focus-visible:opacity-100"
                                  aria-label={`Next photo for ${country.name}`}
                                >
                                  <span className="material-symbols-rounded text-[20px]">chevron_right</span>
                                </button>
                              </>
                            ) : null}
                          </div>

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
                                const previewIndex = countryPhotoIndexByCode[country.code] ?? 0;
                                const previewImage =
                                  country.previewImages[previewIndex] || country.thumbnailUrl;
                                openShareCard({
                                  kind: "country",
                                  title: `Share ${country.name}`,
                                  imageUrl: previewImage,
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
                        <div className="flex flex-col gap-2">
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
                            <span className="text-[#646464] text-[14px] leading-normal tracking-[-0.41px]">{country.photoCount} photos</span>
                            <span className="text-[#646464] text-[8px] leading-none">&bull;</span>
                            <span className="text-[#646464] text-[14px] leading-normal tracking-[-0.41px]">{country.videoCount} Videos</span>
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
                          <div className="relative aspect-357/278 overflow-hidden rounded-2xl border border-[#262626] bg-[#151515]">
                            <img
                              src={toLandingAssetUrl(
                                collection.previewImages[collectionPhotoIndexById[collection.id] ?? 0] || collection.thumbnailUrl
                              )}
                              alt={collection.title}
                              loading="lazy"
                              decoding="async"
                              className="block h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            />

                            {collection.previewImages.length > 1 ? (
                              <>
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    setCollectionPhotoIndexById((prev) => {
                                      const current = prev[collection.id] ?? 0;
                                      const next =
                                        (current - 1 + collection.previewImages.length) % collection.previewImages.length;
                                      return { ...prev, [collection.id]: next };
                                    });
                                  }}
                                  className="hidden md:grid absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 place-items-center rounded-full bg-white/95 text-black shadow-md opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-white hover:scale-105 focus-visible:opacity-100"
                                  aria-label={`Previous photo for ${collection.title}`}
                                >
                                  <span className="material-symbols-rounded text-[20px]">chevron_left</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    setCollectionPhotoIndexById((prev) => {
                                      const current = prev[collection.id] ?? 0;
                                      const next = (current + 1) % collection.previewImages.length;
                                      return { ...prev, [collection.id]: next };
                                    });
                                  }}
                                  className="hidden md:grid absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 place-items-center rounded-full bg-white/95 text-black shadow-md opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-white hover:scale-105 focus-visible:opacity-100"
                                  aria-label={`Next photo for ${collection.title}`}
                                >
                                  <span className="material-symbols-rounded text-[20px]">chevron_right</span>
                                </button>
                              </>
                            ) : null}
                          </div>

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
                                const previewIndex = collectionPhotoIndexById[collection.id] ?? 0;
                                const previewImage =
                                  collection.previewImages[previewIndex] || collection.thumbnailUrl;
                                openShareCard({
                                  kind: "collection",
                                  title: `Share ${collection.title}`,
                                  imageUrl: previewImage,
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

                        <div className="flex flex-col gap-2 px-1.5 pt-2.5">
                          <p className="text-[#646464] text-[14px] leading-normal tracking-[-0.41px]">{collection.createdLabel}</p>
                          <p className="text-white text-[16px] font-medium leading-6 tracking-[-0.096px] min-w-full w-min line-clamp-1">{collection.title}</p>
                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            {collection.countries.map((country) => (
                              <span
                                key={`${collection.id}-${country}`}
                                className="backdrop-blur-[2px] bg-black-800 border border-[#262626] border-solid flex items-center justify-center pb-1.25 pt-0.75 px-2.5 rounded-full text-[#a8a8a8] text-[12px] leading-none tracking-[-0.408px]"
                              >
                                {country}
                              </span>
                            ))}
                            {collection.countryOverflowCount > 0 ? (
                              <span className="backdrop-blur-[2px] bg-black-800 border border-[#262626] border-solid flex items-center justify-center pb-1.25 pt-0.75 px-2.5 rounded-full text-[#a8a8a8] text-[12px] leading-none tracking-[-0.408px]">
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
              <section className="grid md:grid-cols-[1fr_300px] xl:grid-cols-[1fr_360px] gap-6 items-start">
                <article className="relative rounded-2xl border border-[#1f1f1f] p-5 md:p-6 bg-black-800 space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold tracking-[-0.5px]">About</h3>
                    <p className="text-[#b7b7b7] leading-7 text-sm md:text-base">{profile.bio || "No bio yet."}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                    {aboutPhotos.length > 0 ? (
                      aboutPhotos.map((src, idx) => (
                        <div key={`${src}-${idx}`} className="rounded-xl overflow-hidden border border-[#2b2b2b] bg-[#111] aspect-[1.06]">
                          <img src={toLandingAssetUrl(src)} alt={`About photo ${idx + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full rounded-xl border border-dashed border-[#2b2b2b] bg-[#111] p-6 text-sm text-white-500 text-center">
                        No photos added yet.
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold tracking-[-0.5px]">My Interests</h4>
                    {profile.interests.length > 0 ? (
                      <div className="flex flex-wrap gap-2.5">
                        {profile.interests.map((interest) => (
                          <span key={interest} className="px-3.5 py-1.5 rounded-full border border-white-800 bg-black-800 text-[#d0d0d0] text-sm">
                            {interest}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-white-500 text-sm">No interests added yet.</p>
                    )}
                  </div>
                </article>

                <aside className="rounded-2xl border border-[#1f1f1f] p-5 md:p-6 bg-black-800">
                  <div className="space-y-1 pb-4 border-b border-black-300 mb-4">
                    <p className="text-white-500 text-xs">Username</p>
                    <p className="text-white text-lg font-medium">{handle}</p>
                    <p className="text-[#5f5f5f] text-xs truncate">travingat.com/{handle.replace(/^@/, "")}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-5">
                    <div className="space-y-1">
                      <p className="text-white-500 text-xs">Home land</p>
                      <div className="flex items-center gap-2 text-[#f0f0f0] text-sm">
                        {homelandFlagSrc ? (
                          <img
                            src={homelandFlagSrc}
                            alt={`${toLocationCountry(profile.homeland)} flag`}
                            className="h-4 w-6 shrink-0 rounded-xs object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <span>{homelandFlagCode}</span>
                        )}
                        <span className="truncate">{profile.homeland}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-white-500 text-xs">Currently in</p>
                      <div className="flex items-center gap-2 text-[#f0f0f0] text-sm">
                        {currentlyInFlagSrc ? (
                          <img
                            src={currentlyInFlagSrc}
                            alt={`${toLocationCountry(profile.currentlyIn)} flag`}
                            className="h-4 w-6 shrink-0 rounded-xs object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <span>{currentlyInFlagCode}</span>
                        )}
                        <span className="truncate">{profile.currentlyIn}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-white-500 text-xs">Speaks</p>
                      {profile.languages.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {profile.languages.map((language) => (
                            <span key={language} className="px-3 py-1 rounded-full bg-[#1f1f1f] border border-[#3a3a3a] text-[#d8d8d8] text-xs">
                              {language}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[#8a8a8a] text-sm">—</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-white-500 text-xs">Find me On</p>
                      {socialRows.length > 0 ? (
                        <div className="flex flex-col gap-1.5 min-w-0">
                          {socialRows.map((item) => (
                            <a key={item.key} href={item.url} target="_blank" rel="noopener noreferrer" className="block w-full min-w-0 truncate text-white-100 text-sm hover:text-white transition">{item.label}</a>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[#8a8a8a] text-sm">—</p>
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

          <footer className="pt-2 pb-8">
            <div className="flex flex-wrap items-center justify-center gap-8 text-[12px] text-white-500 tracking-[-0.408px] leading-normal">
              <span>Help</span>
              <span>About</span>
              <span>Careers</span>
              <span>Blog</span>
              <span>Terms of Service</span>
              <span>Privacy Policy</span>
            </div>
          </footer>
        </main>
      </div>

      <div className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-black-800 bg-black px-3 pt-3 pb-5">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFollowModal(true)} className="flex-1 rounded-full bg-white text-black px-5 py-2.5 text-[16px] font-medium tracking-[-0.41px]">Follow</button>
          <button className="h-10.75 w-10.75 rounded-full border border-[#363636] bg-[#181818] grid place-items-center text-white" aria-label="More options">
            <span className="material-symbols-rounded text-[20px]">more_horiz</span>
          </button>
          <button className="flex-1 rounded-full border border-[#363636] bg-[#181818] text-white px-5 py-2.5 text-[16px] font-medium tracking-[-0.41px]">Connect</button>
        </div>
      </div>

      {showFollowModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
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
          profileName={shareOwnerName}
          profileHandle={shareOwnerHandle}
          profileAvatar={shareOwnerAvatar}
          profileFlagCode={profileFlagCode}
          countryName={carouselCountryName}
          countryFlagCode={carouselCountryCode}
          description={carouselDescription}
          quote={carouselQuote}
        />
      ) : null}
    </>
  );
}
