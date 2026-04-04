"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { toLandingAssetUrl } from "@/lib/landing-assets";
import { sampleProfiles, type SampleProfile } from "@/profiles/profile-data";

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

type TabKey = "all" | "countries" | "collections" | "about";

type MediaItem = {
  id: string;
  fileUrl: string;
  isVideo: boolean;
};

type CountryCard = {
  code: string;
  name: string;
  thumbnailUrl: string;
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

export default function ProfileComponent({ profile }: { profile: SampleProfile }) {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [showNavMenu, setShowNavMenu] = useState(false);
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
    return profile.photoUrls.map((fileUrl, index) => ({
      id: `${profile.id}-${index}`,
      fileUrl,
      isVideo: isVideoAsset(fileUrl),
    }));
  }, [profile.id, profile.photoUrls]);

  const headerFlagCodes = useMemo(() => {
    const unique = new Set<string>();
    if (profile.flagCode) unique.add(profile.flagCode.toUpperCase());

    for (const item of sampleProfiles) {
      if (item.flagCode) unique.add(item.flagCode.toUpperCase());
      if (unique.size >= 16) break;
    }

    return Array.from(unique);
  }, [profile.flagCode]);

  const countryCards = useMemo<CountryCard[]>(() => {
    const countryCandidates = [
      basedIn,
      toLocationCountry(profile.homeland),
      toLocationCountry(profile.currentlyIn),
    ]
      .map((item) => item.trim())
      .filter(Boolean);

    const uniqueCountries = Array.from(new Set(countryCandidates));
    return uniqueCountries.map((countryName, index) => {
      const fallback = allMediaItems[index % Math.max(allMediaItems.length, 1)]?.fileUrl || profile.cover;
      return {
        code: `${profile.id}-${index}`,
        name: countryName,
        thumbnailUrl: fallback,
      };
    });
  }, [allMediaItems, basedIn, profile.cover, profile.currentlyIn, profile.homeland, profile.id]);

  const collectionCards = useMemo<CollectionCard[]>(() => {
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
        thumbnailUrl: thumbnailItem ? thumbnailItem.fileUrl : profile.cover,
        countries: countryCards.map((country) => country.name).slice(0, 3),
      };
    });
  }, [allMediaItems, countryCards, profile.bio, profile.cover, profile.id, profile.interests]);

  const aboutPhotos = useMemo(() => {
    return allMediaItems
      .filter((item) => !item.isVideo)
      .map((item) => item.fileUrl)
      .slice(0, 4);
  }, [allMediaItems]);

  const socialRows = useMemo(() => {
    return profile.socials
      .map((value, index) => ({
        key: `social-${index}`,
        label: toSocialLabel(value),
      }))
      .filter((item) => Boolean(item.label));
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
        <header className="relative w-full max-w-[1488px] flex items-center justify-between py-6 md:py-8">
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
                className="flex items-center gap-2 rounded-xl border border-[#1e1e1e] bg-[#0b0b0b] px-3 py-2"
                aria-label="Open profile menu"
              >
                <span className="material-symbols-rounded text-[#e3e3e3] text-[21px]">dehaze</span>
                <div className="hidden md:block h-7 w-7 overflow-hidden rounded-lg">
                  <img src={toLandingAssetUrl(profile.avatar)} alt="Profile" className="h-full w-full object-cover" />
                </div>
              </button>

              {showNavMenu ? (
                <div className="absolute right-0 top-full z-30 mt-3 w-[220px] rounded-2xl border border-[#252525] bg-[#101010] p-2 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
                  <Link
                    href="/#featured"
                    onClick={() => setShowNavMenu(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#d8d8d8] hover:bg-[#1b1b1b]"
                  >
                    <span className="material-symbols-rounded text-[17px] text-[#9a9a9a]">arrow_back</span>
                    Back to featured
                  </Link>
                  <Link
                    href="/"
                    onClick={() => setShowNavMenu(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#d8d8d8] hover:bg-[#1b1b1b]"
                  >
                    <span className="material-symbols-rounded text-[17px] text-[#9a9a9a]">home</span>
                    Landing page
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className="w-full max-w-[1488px] pb-12 md:pb-20 grid gap-10">
          <section className="lg:hidden space-y-5">
            <div className="flex flex-col items-center gap-5 rounded-[24px] w-full">
              <div className="w-full">
                <div className="h-[200px] mb-[-36px] rounded-[12px] overflow-hidden bg-[#151515]">
                  <img src={toLandingAssetUrl(profile.cover)} alt="Profile cover" className="w-full h-full object-cover" />
                </div>
                <div className="relative z-10 mx-auto h-20 w-20 rounded-[16px] border-4 border-black overflow-hidden bg-[#151515]">
                  <img src={toLandingAssetUrl(profile.avatar)} alt="Profile avatar" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="pt-1 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[#696969] text-sm">
                  {profileFlagSrc ? (
                    <img
                      src={profileFlagSrc}
                      alt={`${basedIn} flag`}
                      className="h-4 w-6 rounded-[2px] object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span>{profileFlagCode}</span>
                  )}
                  <span>{basedIn}</span>
                </div>
                <h1 className="text-white text-[28px] leading-[1.1] tracking-[-0.5px] font-semibold mt-2">{displayName}</h1>
                <p className="text-[#a8a8a8] text-[16px] mt-1">{handle}</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-1">
              {headerFlagCodes.map((code, index) => (
                <img
                  key={`${code}-${index}`}
                  src={toFlagAssetPath(code) || ""}
                  alt={`${code} flag`}
                  className="h-4 w-6 rounded-[2px] object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>

            <div className="w-full rounded-[16px] border border-[#202020] bg-[#111] px-5 py-5">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-white text-[28px] leading-none tracking-[-0.4px] font-semibold">{profile.countries}</p>
                  <p className="text-[#989898] text-[12px] mt-1">Countries</p>
                </div>
                <div>
                  <p className="text-white text-[28px] leading-none tracking-[-0.4px] font-semibold">{profile.media}</p>
                  <p className="text-[#989898] text-[12px] mt-1">All media</p>
                </div>
                <div>
                  <p className="text-white text-[28px] leading-none tracking-[-0.4px] font-semibold">{profile.collections}</p>
                  <p className="text-[#989898] text-[12px] mt-1">Collections</p>
                </div>
              </div>
            </div>
          </section>

          <section className="hidden lg:grid lg:grid-cols-[600px_minmax(0,1fr)] gap-20 items-end">
            <div className="space-y-10 pt-12 self-end">
              <div className="space-y-8">
                <div className="relative h-[120px] w-[120px] overflow-hidden rounded-[20px] bg-[#151515]">
                  <img src={toLandingAssetUrl(profile.avatar)} alt="Profile avatar" className="h-full w-full object-cover rounded-[20px]" />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-[#989898] text-[18px] tracking-[-0.198px] leading-[26px]">
                    {profileFlagSrc ? (
                      <img
                        src={profileFlagSrc}
                        alt={`${basedIn} flag`}
                        className="h-4 w-6 rounded-[4px] object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <span>{profileFlagCode}</span>
                    )}
                    <span>{basedIn}</span>
                  </div>

                  <h1 className="ds-font-display text-[44px] leading-[52px] tracking-[-0.5px] font-semibold text-white">{displayName}</h1>

                  <p className="ds-font-display text-[#989898] text-[24px] leading-[32px] tracking-[-0.5px] font-normal">{handle}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {headerFlagCodes.map((code, index) => (
                  <img
                    key={`${code}-${index}`}
                    src={toFlagAssetPath(code) || ""}
                    alt={`${code} flag`}
                    className="h-[20px] w-[30px] rounded-[2px] object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </div>

              <div className="w-full rounded-[16px] border-l border-[#353535] bg-gradient-to-r from-[#1c1c1c] to-[rgba(0,0,0,0.1)] px-4 py-5">
                <div className="flex items-center gap-10">
                  <div className="flex items-center gap-4 rounded-xl">
                    <div className="w-[60px] h-[60px] overflow-hidden flex-shrink-0">
                      <span className="material-symbols-rounded text-[48px] text-white" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48" }}>travel_explore</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="ds-font-display text-[24px] leading-[32px] tracking-[-0.5px] text-white font-semibold">{profile.countries}</p>
                      <p className="text-[14px] leading-[20px] tracking-[-0.084px] text-[#989898] font-normal">Countries</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-xl">
                    <div className="w-[60px] h-[60px] overflow-hidden flex-shrink-0">
                      <span className="material-symbols-rounded text-[48px] text-white" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48" }}>photo_library</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="ds-font-display text-[24px] leading-[32px] tracking-[-0.5px] text-white font-semibold">{profile.media}</p>
                      <p className="text-[14px] leading-[20px] tracking-[-0.084px] text-[#989898] font-normal">All media</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-xl">
                    <div className="w-[60px] h-[60px] overflow-hidden flex-shrink-0">
                      <span className="material-symbols-rounded text-[48px] text-white" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48" }}>folder</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="ds-font-display text-[24px] leading-[32px] tracking-[-0.5px] text-white font-semibold">{profile.collections}</p>
                      <p className="text-[14px] leading-[20px] tracking-[-0.084px] text-[#989898] font-normal">Collections</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="w-[148px] rounded-full bg-white text-black px-5 py-3 text-[16px] font-medium leading-[24px] tracking-[-0.096px] hover:bg-[#ececec] transition">Follow</button>
                <button className="w-[148px] rounded-full border border-[#353535] bg-[#1a1a1a] text-white px-5 py-3 text-[16px] font-medium leading-[24px] tracking-[-0.096px] hover:bg-[#242424] transition">Connect</button>
                <button className="h-[48px] w-[48px] grid place-items-center rounded-full border border-[#353535] bg-[#1a1a1a] text-white hover:bg-[#242424] transition" aria-label="More options">
                  <span className="material-symbols-rounded text-[20px]">grid_view</span>
                </button>
              </div>
            </div>

            <div className="flex flex-row items-end justify-end self-stretch">
              <div className="relative aspect-[640/662] h-full w-full max-w-[640px] overflow-hidden rounded-[32px] bg-[#111]">
                <img src={toLandingAssetUrl(profile.cover)} alt="Profile cover" className="w-full h-full object-cover rounded-[32px]" />
              </div>
            </div>
          </section>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-full px-6 py-2 text-[16px] leading-[24px] tracking-[-0.096px] transition ${
                activeTab === "all"
                  ? "bg-[#1e1e1e] border border-white text-white font-medium"
                  : "bg-[#161616] border border-transparent text-[#bdbdbd] font-normal"
              }`}
            >
              All media
            </button>
            <button
              onClick={() => setActiveTab("countries")}
              className={`rounded-full px-6 py-2 text-[16px] leading-[24px] tracking-[-0.096px] transition ${
                activeTab === "countries"
                  ? "bg-[#1e1e1e] border border-white text-white font-medium"
                  : "bg-[#161616] border border-transparent text-[#bdbdbd] font-normal"
              }`}
            >
              Countries
            </button>
            <button
              onClick={() => setActiveTab("collections")}
              className={`rounded-full px-6 py-2 text-[16px] leading-[24px] tracking-[-0.096px] transition ${
                activeTab === "collections"
                  ? "bg-[#1e1e1e] border border-white text-white font-medium"
                  : "bg-[#161616] border border-transparent text-[#bdbdbd] font-normal"
              }`}
            >
              Collections
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`rounded-full px-6 py-2 text-[16px] leading-[24px] tracking-[-0.096px] transition ${
                activeTab === "about"
                  ? "bg-[#1e1e1e] border border-white text-white font-medium"
                  : "bg-[#161616] border border-transparent text-[#bdbdbd] font-normal"
              }`}
            >
              About me
            </button>
          </div>

          {activeTab === "all" ? (
            <section className="pb-[100px] min-h-[250px]">
              {allMediaItems.length === 0 ? (
                <div className="max-w-xl mx-auto flex flex-col items-center gap-5 text-center py-10">
                  <h2 className="text-[30px] leading-none tracking-[-0.5px] font-semibold text-white">All media</h2>
                  <p className="text-[#7c7c7c] text-[14px] leading-[1.4]">
                    Add media to a country or collection to start building your gallery.
                  </p>
                </div>
              ) : (
                <div className="columns-2 md:columns-3 xl:columns-4 gap-5 space-y-5">
                  {allMediaItems.map((item) => (
                    <div key={item.id} className="group break-inside-avoid rounded-[16px] overflow-hidden bg-[#111] relative">
                      {item.isVideo ? (
                        <>
                          <video src={toLandingAssetUrl(item.fileUrl)} muted playsInline preload="metadata" className="w-full object-cover rounded-[16px]" />
                          <div className="absolute top-4 left-4">
                            <span className="material-symbols-rounded text-[24px] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 700, 'GRAD' 200, 'opsz' 24" }}>play_arrow</span>
                          </div>
                        </>
                      ) : (
                        <img src={toLandingAssetUrl(item.fileUrl)} alt="Uploaded media" loading="lazy" decoding="async" className="w-full object-cover rounded-[16px]" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : null}

          {activeTab === "countries" ? (
            <section className="pb-16 space-y-8">
              {countryCards.length === 0 ? (
                <div className="flex items-center justify-center gap-2 text-[16px] tracking-[-0.41px]">
                  <span className="h-px flex-1 bg-[#1f1f1f]" />
                  <div className="flex items-center gap-1">
                    <span className="text-white font-medium">0</span>
                    <span className="text-[#606060]">/8</span>
                  </div>
                  <span className="text-white">Countries added</span>
                  <span className="material-symbols-rounded text-[#9a9a9a] text-[16px]">edit</span>
                  <span className="h-px flex-1 bg-[#1f1f1f]" />
                </div>
              ) : null}

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {countryCards.length === 0 ? (
                  <div className="col-span-full rounded-2xl border border-dashed border-[#2b2b2b] bg-[#0e0e0e] p-10 md:p-16">
                    <div className="max-w-[600px] mx-auto flex flex-col items-center gap-6 text-center">
                      <div className="flex items-center gap-3">
                        {COUNTRIES_EMPTY_PREVIEW_IMAGES.map((src, idx) => (
                          <div key={src} className="w-[76px] h-[76px] md:w-[100px] md:h-[100px] rounded-[10px] overflow-hidden">
                            <img src={toLandingAssetUrl(src)} alt={`Country preview ${idx + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-white text-[24px] leading-[1.4] tracking-[-0.41px] font-semibold">Add your first country</h3>
                        <p className="text-[#a8a8a8] text-[16px] leading-[1.5] tracking-[-0.41px]">
                          Start with your favorite country - you can add the rest later.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  countryCards.map((country) => (
                    <Link key={country.code} href={`/profiles/${profile.id}`} className="relative aspect-square rounded-2xl overflow-hidden bg-[#101010] block">
                      <div className="absolute inset-0 bg-[#151515]">
                        <img src={toLandingAssetUrl(country.thumbnailUrl)} alt={`${country.name} thumbnail`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[70%] to-[rgba(0,0,0,0.5)]" />
                      </div>
                      <div className="relative h-full w-full flex items-end p-3">
                        <p title={country.name} className="text-white text-[24px] font-black leading-none tracking-[-0.408px] drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)] truncate">
                          {country.name}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </section>
          ) : null}

          {activeTab === "collections" ? (
            <section className="w-full pb-8 md:pb-12 space-y-6">
              {collectionCards.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#2b2b2b] bg-[#0e0e0e] px-6 py-12 md:px-10 md:py-16">
                  <div className="max-w-[600px] mx-auto flex flex-col items-center gap-6 text-center">
                    <div className="flex items-center gap-3">
                      {COLLECTIONS_EMPTY_PREVIEW_IMAGES.map((src, idx) => (
                        <div key={src} className="w-[76px] h-[76px] md:w-[100px] md:h-[100px] rounded-[10px] overflow-hidden">
                          <img src={toLandingAssetUrl(src)} alt={`Collection preview ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-white text-[24px] leading-[1.4] tracking-[-0.41px] font-semibold">Your collections</h3>
                      <p className="text-[#a8a8a8] text-[16px] leading-[1.5] tracking-[-0.41px] max-w-[560px]">
                        Group photos and videos by theme - not location.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {collectionCards.map((collection) => (
                    <Link key={collection.id} href={`/profiles/${profile.id}`} className="group block">
                      <div className="relative aspect-[1.22] rounded-2xl overflow-hidden bg-[#151515] border border-[#1f1f1f]">
                        <img src={toLandingAssetUrl(collection.thumbnailUrl)} alt={collection.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="pt-2 px-1 space-y-1.5">
                        <p className="text-[#989898] text-[11px] leading-[1.4] tracking-[-0.3px]">{collection.createdLabel}</p>
                        <p className="text-white text-[14px] leading-[1.35] tracking-[-0.5px] font-semibold line-clamp-1">{collection.title}</p>
                        <p className="text-[#989898] text-[12px] leading-[1.4] tracking-[-0.4px] line-clamp-1">{collection.description}</p>

                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          {collection.countries.map((country) => (
                            <span key={`${collection.id}-${country}`} className="inline-flex items-center rounded-full border border-[#353535] bg-[#1e1e1e] px-2 py-[3px] text-[10px] leading-none text-[#bdbdbd]">
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
              <section className="grid xl:grid-cols-[1fr_360px] gap-6 items-start">
                <article className="relative rounded-2xl border border-[#1f1f1f] p-6 bg-[#161616] space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-[32px] text-2xl font-semibold tracking-[-0.5px]">About</h3>
                    <p className="text-[#b7b7b7] leading-7 text-sm md:text-base">{profile.bio || "No bio yet."}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {aboutPhotos.length > 0 ? (
                      aboutPhotos.map((src, idx) => (
                        <div key={`${src}-${idx}`} className="rounded-xl overflow-hidden border border-[#2b2b2b] bg-[#111] aspect-[1.06]">
                          <img src={toLandingAssetUrl(src)} alt={`About photo ${idx + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full rounded-xl border border-dashed border-[#2b2b2b] bg-[#111] p-6 text-sm text-[#7c7c7c] text-center">
                        No photos added yet.
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[28px] text-xl font-semibold tracking-[-0.5px]">My Interests</h4>
                    {profile.interests.length > 0 ? (
                      <div className="flex flex-wrap gap-2.5">
                        {profile.interests.map((interest) => (
                          <span key={interest} className="px-3.5 py-1.5 rounded-full border border-[#464646] bg-[#161616] text-[#d0d0d0] text-sm">
                            {interest}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[#7c7c7c] text-sm">No interests added yet.</p>
                    )}
                  </div>
                </article>

                <aside className="rounded-2xl border border-[#1f1f1f] p-6 bg-[#161616] space-y-6">
                  <div className="space-y-1 pb-4 border-b border-[#2a2a2a]">
                    <p className="text-[#7c7c7c] text-xs">Username</p>
                    <p className="text-white text-lg font-medium">{handle}</p>
                    <p className="text-[#5f5f5f] text-xs">travingat.com/{handle.replace(/^@/, "")}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[#7c7c7c] text-xs">Home land</p>
                    <div className="flex items-center gap-2 text-[#f0f0f0] text-sm">
                      {homelandFlagSrc ? (
                        <img
                          src={homelandFlagSrc}
                          alt={`${toLocationCountry(profile.homeland)} flag`}
                          className="h-4 w-6 rounded-[2px] object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <span>{homelandFlagCode}</span>
                      )}
                      <span>{profile.homeland}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[#7c7c7c] text-xs">Currently in</p>
                    <div className="flex items-center gap-2 text-[#f0f0f0] text-sm">
                      {currentlyInFlagSrc ? (
                        <img
                          src={currentlyInFlagSrc}
                          alt={`${toLocationCountry(profile.currentlyIn)} flag`}
                          className="h-4 w-6 rounded-[2px] object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <span>{currentlyInFlagCode}</span>
                      )}
                      <span>{profile.currentlyIn}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[#7c7c7c] text-xs">Speaks</p>
                    {profile.languages.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.languages.map((language) => (
                          <span key={language} className="px-3 py-1 rounded-full bg-[#1f1f1f] border border-[#3a3a3a] text-[#d8d8d8] text-xs">
                            {language}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[#8a8a8a] text-sm">No languages selected.</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-[#7c7c7c] text-xs">Find me On</p>
                    {socialRows.length > 0 ? (
                      <div className="space-y-1.5">
                        {socialRows.map((item) => (
                          <p key={item.key} className="text-[#efefef] text-sm truncate">{item.label}</p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[#8a8a8a] text-sm">No social links added.</p>
                    )}
                  </div>
                </aside>
              </section>
            ) : (
              <section className="w-full pb-8 md:pb-12">
                <div className="rounded-2xl border border-dashed border-[#2b2b2b] bg-[#0e0e0e] px-6 py-12 md:px-10 md:py-16">
                  <div className="max-w-[600px] mx-auto flex flex-col items-center gap-6 text-center">
                    <div className="space-y-2">
                      <h3 className="text-white text-[24px] leading-[1.4] tracking-[-0.41px] font-semibold">Tell your travel story</h3>
                      <p className="text-[#a8a8a8] text-[16px] leading-[1.5] tracking-[-0.41px] max-w-[560px]">
                        Add a short bio, your interests, languages, and links so people can understand your style and follow your journey.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )
          ) : null}

          <footer className="pt-2 pb-8">
            <div className="flex flex-wrap items-center justify-center gap-8 text-[12px] text-[#7c7c7c] tracking-[-0.408px] leading-[1.5]">
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

      <div className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-[#161616] bg-black px-3 pt-3 pb-5">
        <div className="flex items-center gap-2">
          <button className="flex-1 rounded-full bg-white text-black px-5 py-2.5 text-[16px] font-medium tracking-[-0.41px]">Follow</button>
          <button className="h-[43px] w-[43px] rounded-full border border-[#363636] bg-[#181818] grid place-items-center text-white" aria-label="More options">
            <span className="material-symbols-rounded text-[20px]">more_horiz</span>
          </button>
          <button className="flex-1 rounded-full border border-[#363636] bg-[#181818] text-white px-5 py-2.5 text-[16px] font-medium tracking-[-0.41px]">Connect</button>
        </div>
      </div>
    </>
  );
}
