"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

import { toLandingAssetUrl } from "@/lib/landing-assets";
import type { SampleProfile } from "@/profiles/profile-data";
import { ContextMenu } from "./ProfileComponent";
import { MoreOptionsButton } from "@/components/ui/MoreOptionsButton";

/* eslint-disable @next/next/no-img-element */

type MediaTab = "all" | "photos" | "videos";

function isVideoAsset(url: string) {
  return /\.(mp4|mov|webm|m4v|3gp|3g2)$/i.test(url);
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

  // Distribute images across 3 columns for masonry layout
  const columns: string[][] = [[], [], []];
  displayImages.forEach((img, i) => {
    columns[i % 3].push(img);
  });

  const tabs: { key: MediaTab; label: string }[] = [
    { key: "all", label: "All media" },
    { key: "photos", label: "Photos" },
    { key: "videos", label: "Videos" },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 md:px-10 xl:px-24">
      {/* Header */}
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

          <Link
            href={`/profiles/${profile.id}`}
            className="flex items-center gap-2 rounded-xl border border-black-600 bg-[#0b0b0b] px-3 py-2"
          >
            <span className="material-symbols-rounded text-[#e3e3e3] text-[21px]">dehaze</span>
            <div className="hidden md:block h-7 w-7 overflow-hidden rounded-lg">
              <img src={toLandingAssetUrl(profile.images.avatar)} alt="Profile" className="h-full w-full object-cover" />
            </div>
          </Link>
        </div>
      </header>

      {/* Collection Info */}
      <main className="w-full max-w-372 flex flex-col items-center gap-12 pb-28 md:pb-20">
        <div className="flex flex-col items-center gap-5 w-full max-w-150">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1d1d1d] border border-black-300">
              <span className="material-symbols-rounded text-[32px] text-white">folder</span>
            </div>
            <h1 className="ds-font-display text-[48px] leading-[1.2] tracking-[-0.41px] font-bold text-white text-center">
              {title}
            </h1>
          </div>

          {/* Meta info row */}
          <div className="flex items-center gap-4 text-[16px] tracking-[-0.5px]">
            <div className="flex items-center gap-2">
              <span className="text-[#505050]">By</span>
              <div className="h-5 w-5 overflow-hidden rounded-full">
                <img src={toLandingAssetUrl(profile.images.avatar)} alt={profile.name} className="w-full h-full object-cover" />
              </div>
              <Link href={`/profiles/${profile.id}`} className="text-white hover:underline">
                {profile.handle}
              </Link>
            </div>
            <span className="text-[#505050]">|</span>
            <div className="flex items-center gap-2">
              <span className="text-[#505050]">{images.length} {images.length === 1 ? "item" : "items"}</span>
            </div>
            <span className="text-[#505050]">|</span>
            <div className="relative" ref={menuRef}>
              <MoreOptionsButton
                isOpen={showMenu}
                onClick={() => setShowMenu((prev) => !prev)}
                label="More options"
                size="sm"
                showOnHover={false}
                positioned={false}
              />
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
        <div className="w-full flex flex-col gap-10">
          {/* Tab pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full px-6 py-2.5 text-[16px] leading-normal tracking-[-0.408px] transition ${
                  activeTab === tab.key
                    ? "bg-[#1d1d1d] border-[0.6px] border-white text-white font-medium"
                    : "bg-black-800 border border-transparent text-[#a8a8a8] font-normal"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-black-300" />

          {/* Masonry grid */}
          {displayImages.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <p className="text-[#a8a8a8] text-[16px]">No media in this category yet.</p>
            </div>
          ) : (
            <div className="flex gap-5 w-full pb-25">
              {columns.map((col, colIdx) => (
                <div key={colIdx} className="flex-1 flex flex-col gap-5">
                  {col.map((imgUrl, imgIdx) => {
                    const isVideo = isVideoAsset(imgUrl);
                    return (
                      <div
                        key={imgIdx}
                        className="group relative rounded-2xl overflow-hidden bg-[#151515]"
                      >
                        {isVideo ? (
                          <>
                            <video
                              src={toLandingAssetUrl(imgUrl)}
                              muted
                              playsInline
                              loop
                              preload="metadata"
                              className="w-full h-auto block"
                              onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                              onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                              onClick={(e) => { const v = e.currentTarget; if (v.paused) v.play().catch(() => {}); else { v.pause(); v.currentTime = 0; } }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                              <span className="text-white text-3xl drop-shadow-lg">▶</span>
                            </div>
                          </>
                        ) : (
                          <img
                            src={toLandingAssetUrl(imgUrl)}
                            alt={`${title} photo ${colIdx * col.length + imgIdx + 1}`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-auto block"
                          />
                        )}
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
