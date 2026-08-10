"use client";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";

import { toLandingAssetUrl } from "@/lib/landing-assets";
import { sampleProfiles, type SampleProfile } from "../data/profile-data";
import { ContextMenu } from "./ProfileComponent";
import { MediaLightbox } from "./MediaLightbox";
import { MoreOptionsButton } from "@/components/ui/MoreOptionsButton";
import { WaitlistPopup } from "@/components/ui/WaitlistPopup";
import LoadedImage from "@/components/ui/LoadedImage";
import { useMobileComingSoon } from "@/components/ui/MobileComingSoonToast";

/* eslint-disable @next/next/no-img-element */

const STATIC_LAST_UPDATED_LABEL = "27 Dec 2025";

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
  const avatarSrc = toLandingAssetUrl(profileAvatar);
  const countryFlagSrc = toFlagAssetPath(countryCode);
  const profileFlagSrc = toFlagAssetPath(profileFlagCode);

  return (
    <MediaLightbox
      items={items.map((url: string) => ({
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
              onClick={() => showComingSoonToast("featureLaunch")}
              className="h-[38px] flex-1 rounded-full bg-white text-[14px] font-medium text-black transition hover:bg-[#e8e8e8]"
            >
              Follow
            </button>
            <button
              type="button"
              onClick={() => showComingSoonToast("featureLaunch")}
              className="h-[38px] flex-1 rounded-full border border-[#2e2e2e] bg-[#1a1a1a] text-[14px] font-medium text-white transition hover:bg-[#222]"
            >
              Connect
            </button>
            <button
              type="button"
              onClick={() => showComingSoonToast("featureLaunch")}
              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border border-[#2e2e2e] bg-[#1a1a1a] text-white transition hover:bg-[#222]"
              aria-label="More options"
            >
              <span className="material-symbols-rounded text-[20px]">more_horiz</span>
            </button>
          </div>

          {/* Country + description */}
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center gap-[12px]">
              {countryFlagSrc ? (
                <img src={countryFlagSrc} alt="" className="h-[21px] w-[32px] rounded-[3.27px] object-cover shadow-sm" />
              ) : null}
              <p className="text-[24px] font-semibold tracking-[-0.5px] text-white leading-[32px]">
                {countryName}
              </p>
            </div>
            {description ? (
              <p className="text-[16px] leading-[24px] tracking-[-0.096px] font-normal text-[#dcdcdc] whitespace-pre-wrap">{description}</p>
            ) : null}
          </div>

          {/* Divider + quote */}
          {quote ? (
            <div className="border-t border-[#222] pt-6">
              <p className="text-[16px] leading-[24px] tracking-[-0.096px] font-normal text-[#dcdcdc] whitespace-pre-wrap">{quote}</p>
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
  const countryImageObj = profile.countryImages?.find(c => c.countryCode === countryCode);
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
      } catch (e) {}
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
        router.replace(url.pathname + url.search, { scroll: false });
      }
    } else if (didReadFromUrl.current && lightboxIndex === null) {
      if (url.searchParams.has("image")) {
        url.searchParams.delete("image");
        router.replace(url.pathname + url.search, { scroll: false });
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
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-[12px] min-[810px]:px-[32px] min-[1200px]:px-[48px] min-[1440px]:px-[64px]">
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
          profileHandle={profileHandle}
          profileAvatar={typeof profile.images.avatar === "string" ? profile.images.avatar : profile.images.avatar.url}
          profileFlagCode={profile.flagCode}
          countryName={countryName}
          countryCode={countryCode}
          description={profile.countryImages?.find((c) => c.countryCode === countryCode)?.about}
        />
      )}

      {/* Country Info */}
      <main className="w-full max-w-[1728px] flex flex-col items-center gap-[48px] pb-28 md:pb-20 pt-8 md:pt-10">
        <div className="flex flex-col items-center gap-[20px] w-full max-w-[600px]">
          <div className="flex flex-col items-center gap-[24px]">
            <div className="h-[80px] w-[120px] overflow-hidden rounded-[8px] shrink-0">
              <img
                src={`/flags/${countryCode}.svg`}
                alt={`${countryName} flag`}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="ds-font-display text-[52px] leading-[60px] tracking-[-1px] font-bold text-white text-center">
              {countryName}
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
              <span className="text-[16px] text-[#989898] leading-[24px] tracking-[-0.096px] font-normal">Last Updated:</span>
              <span className="text-[16px] text-[#989898] leading-[24px] tracking-[-0.096px] font-normal">
                {STATIC_LAST_UPDATED_LABEL}
              </span>
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
                  kind="country"
                  viewLabel="View country"
                  shareLabel="Share country"
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
              <h2 className="text-[24px] font-semibold text-white">About {countryName}</h2>
              <p className="text-[16px] text-[#a8a8a8] leading-relaxed whitespace-pre-wrap">
                {aboutText || "No information provided yet."}
              </p>
            </div>
          ) : displayImages.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <p className="text-[#a8a8a8] text-[16px]">No media in this category yet.</p>
            </div>
          ) : (
            <div className="w-full">
              {/* Desktop: 4 explicit flex columns — matches Figma layout */}
              <div className="hidden lg:flex gap-[20px] items-start">
                {[0, 1, 2, 3].map((colIdx) => (
                  <div key={colIdx} className="flex-1 min-w-0 flex flex-col gap-[20px]">
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
                                  alt={`${countryName} photo ${globalIndex + 1}`}
                                  className="w-full h-auto block"
                                  containerClassName="w-full"
                                  skeletonClassName="w-full aspect-[3/4]"
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
                                className="absolute right-3 bottom-14 z-30 w-[200px] rounded-2xl border border-[#2e2e2e] bg-[#1a1a1a] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.5)]"
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
                                    className="flex w-full items-center gap-3 text-[15px] font-medium tracking-[-0.3px] text-white hover:text-[#d4d4d4] transition-colors"
                                  >
                                    <span className="material-symbols-rounded text-[22px]">favorite_border</span>
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
                                    className="flex w-full items-center gap-3 text-[15px] font-medium tracking-[-0.3px] text-white hover:text-[#d4d4d4] transition-colors"
                                  >
                                    <span className="material-symbols-rounded text-[22px]">block</span>
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
              <div className="lg:hidden columns-2 gap-[6px] w-full">
                {items.map(({ url: imgUrl, globalIndex }) => {
                  const isVideo = isVideoAsset(imgUrl);
                  return (
                    <div
                      key={globalIndex}
                      className="group mb-[8px] w-full break-inside-avoid relative [-webkit-column-break-inside:avoid] inline-block"
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
                            alt={`${countryName} photo ${globalIndex + 1}`}
                            className="w-full h-auto block"
                            containerClassName="w-full"
                            skeletonClassName="w-full aspect-[3/4]"
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
                          className="absolute right-3 bottom-14 z-30 w-[200px] rounded-2xl border border-[#2e2e2e] bg-[#1a1a1a] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.5)]"
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
                              className="flex w-full items-center gap-3 text-[15px] font-medium tracking-[-0.3px] text-white hover:text-[#d4d4d4] transition-colors"
                            >
                              <span className="material-symbols-rounded text-[22px]">favorite_border</span>
                              <span>Add to favorites</span>
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={(event) => { event.preventDefault(); event.stopPropagation(); setOpenContextMenuId(null); }}
                              className="flex w-full items-center gap-3 text-[15px] font-medium tracking-[-0.3px] text-white hover:text-[#d4d4d4] transition-colors"
                            >
                              <span className="material-symbols-rounded text-[22px]">block</span>
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
