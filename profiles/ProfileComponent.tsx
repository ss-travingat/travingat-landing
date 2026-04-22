"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { toLandingAssetUrl } from "@/lib/landing-assets";
import type { SampleProfile } from "@/profiles/profile-data";

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
};

type CountryCard = {
  code: string;
  name: string;
  flagCode: string;
  thumbnailUrl: string;
  photoCount: number;
  videoCount: number;
};

type CollectionCard = {
  id: string;
  title: string;
  description: string;
  createdLabel: string;
  thumbnailUrl: string;
  countries: string[];
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

function toFlagAssetPath(flagCode?: string) {
  if (!flagCode) return null;
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

export default function ProfileComponent({ profile }: { profile: SampleProfile }) {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const navMenuRef = useRef<HTMLDivElement | null>(null);

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
    const galleryUrls = profile.images.gallery;
    const countryUrls = (profile.countryImages ?? []).flatMap((c) => c.images);
    const collectionUrls = (profile.collectionImages ?? []).flatMap((c) => c.images);
    return [...galleryUrls, ...countryUrls, ...collectionUrls].map((fileUrl, index) => ({
      id: `${profile.id}-${index}`,
      fileUrl,
      isVideo: isVideoAsset(fileUrl),
    }));
  }, [profile.id, profile.images.gallery, profile.countryImages, profile.collectionImages]);

  const headerFlagCodes = useMemo(() => {
    const codes = profile.visitedCountryCodes ?? [];
    return codes.slice(0, 30).map((c) => c.toUpperCase());
  }, [profile.visitedCountryCodes]);

  const flagOverflowCount = Math.max(0, (profile.countries ?? 0) - headerFlagCodes.length);

  const countryCards = useMemo<CountryCard[]>(() => {
    // Use admin-uploaded country images if available
    if (profile.countryImages && profile.countryImages.length > 0) {
      const totalPhotos = allMediaItems.filter((m) => !m.isVideo).length;
      const totalVideos = allMediaItems.filter((m) => m.isVideo).length;
      const count = profile.countryImages.length;
      return profile.countryImages.map((ci, index) => {
        const countryName = COUNTRY_LIST_LOOKUP[ci.countryCode.toUpperCase()] || ci.countryCode;
        return {
          code: `${profile.id}-ci-${index}`,
          name: countryName,
          flagCode: ci.countryCode,
          thumbnailUrl: ci.images[0] || profile.images.cover,
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
      const fallback = allMediaItems[index % Math.max(allMediaItems.length, 1)]?.fileUrl || profile.images.cover;
      return {
        code: `${profile.id}-${index}`,
        name,
        flagCode,
        thumbnailUrl: fallback,
        photoCount: Math.floor(totalPhotos / count),
        videoCount: Math.floor(totalVideos / count),
      };
    });
  }, [allMediaItems, basedIn, profile.images.cover, profile.currentlyIn, profile.flagCode, profile.homelandFlagCode, profile.currentlyInFlagCode, profile.homeland, profile.id, profile.countryImages]);

  const collectionCards = useMemo<CollectionCard[]>(() => {
    // Use admin-uploaded collection images if available
    if (profile.collectionImages && profile.collectionImages.length > 0) {
      return profile.collectionImages.map((ci, index) => {
        const createdAt = new Date(Date.now() - index * 1000 * 60 * 60 * 24 * 19);
        return {
          id: `${profile.id}-collection-${index}`,
          title: ci.title,
          description: profile.bio,
          createdLabel: createdAt.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          thumbnailUrl: ci.images[0] || profile.images.cover,
          countries: countryCards.map((country) => country.name).slice(0, 3),
        };
      });
    }

    const titles = profile.interests.length > 0 ? profile.interests : ["Travel moments"];
    const count = Math.min(4, Math.max(1, Math.min(titles.length, allMediaItems.length || 1)));

    return Array.from({ length: count }).map((_, index) => {
      const thumbnailItem = allMediaItems.length > 0 ? allMediaItems[index % allMediaItems.length] : null;
      const createdAt = new Date(Date.now() - index * 1000 * 60 * 60 * 24 * 19);

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
        countries: countryCards.map((country) => country.name).slice(0, 3),
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
                        className="pointer-events-none absolute top-1/2 left-1/2 h-15 w-15 -translate-x-1/2 -translate-y-1/2 -rotate-[14.68deg] object-contain"
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
                  {allMediaItems.map((item) => (
                    <div key={item.id} className="group mb-5 inline-block w-full break-inside-avoid rounded-2xl overflow-hidden bg-[#111] relative [-webkit-column-break-inside:avoid]">
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
                            onClick={(e) => { const v = e.currentTarget; if (v.paused) v.play().catch(() => {}); else { v.pause(); v.currentTime = 0; } }}
                          />
                          <div className="absolute top-4 left-4 group-hover:opacity-0 transition-opacity pointer-events-none">
                            <span className="material-symbols-rounded text-[24px] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 700, 'GRAD' 200, 'opsz' 24" }}>play_arrow</span>
                          </div>
                        </>
                      ) : (
                        <img src={toLandingAssetUrl(item.fileUrl)} alt="Uploaded media" loading="lazy" decoding="async" className="w-full object-cover rounded-2xl" />
                      )}
                    </div>
                  ))}
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
                  {countryCards.map((country) => (
                    <Link key={country.code} href={`/profiles/${profile.id}/country/${country.flagCode.toUpperCase()}`} className="flex flex-col gap-4 group">
                      {/* Photo */}
                      <div className="w-full aspect-square overflow-hidden rounded-2xl bg-[#151515]">
                        <img
                          src={toLandingAssetUrl(country.thumbnailUrl)}
                          alt={country.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover block transition-transform duration-300 group-hover:scale-[1.03]"
                        />
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
                  ))}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {collectionCards.map((collection, idx) => (
                    <Link key={collection.id} href={`/profiles/${profile.id}/collection/${idx}`} className="group block">
                      <div className="rounded-2xl overflow-hidden bg-[#151515] border border-[#1f1f1f]">
                        <img src={toLandingAssetUrl(collection.thumbnailUrl)} alt={collection.title} loading="lazy" decoding="async" className="w-full h-auto block" />
                      </div>
                      <div className="pt-2 px-1 space-y-1.5">
                        <p className="text-white-400 text-[11px] leading-[1.4] tracking-[-0.3px]">{collection.createdLabel}</p>
                        <p className="text-white text-[14px] leading-[1.35] tracking-[-0.5px] font-semibold line-clamp-1">{collection.title}</p>
                        <p className="text-white-400 text-[12px] leading-[1.4] tracking-[-0.4px] line-clamp-1">{collection.description}</p>

                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          {collection.countries.map((country) => (
                            <span key={`${collection.id}-${country}`} className="inline-flex items-center rounded-full border border-black-100 bg-black-600 px-2 py-0.75 text-[10px] leading-none text-white-300">
                              {country}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
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
    </>
  );
}
