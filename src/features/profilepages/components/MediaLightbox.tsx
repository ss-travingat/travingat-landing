"use client";

import { useState, useRef, useEffect } from "react";
import { toLandingAssetUrl } from "@/lib/landing-assets";
import { useMobileComingSoon } from "@/components/ui/MobileComingSoonToast";

export type LightboxItem = {
  id?: string;
  url: string;
  isVideo: boolean;
};

export type MediaLightboxProps = {
  items: LightboxItem[];
  activeIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelectIndex: (index: number) => void;
  onShareClick?: () => void;
  sidebarContent: React.ReactNode;
};

export function MediaLightbox({
  items,
  activeIndex,
  onClose,
  onNext,
  onPrev,
  onSelectIndex,
  onShareClick,
  sidebarContent,
}: MediaLightboxProps) {
  const { showComingSoonToast } = useMobileComingSoon();
  const [showBrowser, setShowBrowser] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeItem = items[activeIndex];
  const totalCount = items.length;
  const displayIndex = activeIndex + 1;

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
                  key={item.id || `item-${idx}`}
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
                          src={toLandingAssetUrl(item.url)}
                          className="h-auto w-full"
                        />
                        <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/55">
                          <span className="material-symbols-rounded text-[18px] text-white">play_arrow</span>
                        </div>
                      </>
                    ) : (
                      <img
                        src={toLandingAssetUrl(item.url)}
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
              <div className="relative flex flex-1 items-center justify-center px-10 min-h-0">
                <div className="relative group inline-block h-full max-w-full text-center">
                  {/* Hover Buttons */}
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => showComingSoonToast("featureLaunch")}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white transition hover:bg-black/60"
                      aria-label="Like"
                    >
                      <span className="material-symbols-rounded text-[20px]">favorite_border</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        showComingSoonToast("featureLaunch");
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white transition hover:bg-black/60"
                      aria-label="Share"
                    >
                      <span className="material-symbols-rounded text-[20px] -mt-[2px]">ios_share</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => showComingSoonToast("featureLaunch")}
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
                      src={toLandingAssetUrl(activeItem.url)}
                      controls
                      autoPlay
                      className="block h-full w-auto max-w-full object-contain carousel-image rounded-[12px] mx-auto"
                    />
                  ) : (
                    <img
                      key={`img-${activeIndex}`}
                      src={toLandingAssetUrl(activeItem?.url)}
                      alt="Carousel media"
                      className="block h-full w-auto max-w-full object-contain carousel-image rounded-[12px] mx-auto"
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

              {/* Next arrow — right edge matching right column margin */}
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
                    transform: `translate3d(calc(${activeIndex} * 72px), 0, 0)`,
                  }}
                />
                {items.map((item, idx) => (
                  <button
                    key={item.id || `thumb-${idx}`}
                    onClick={() => onSelectIndex(idx)}
                    className={`relative h-[60px] w-[60px] shrink-0 rounded-[10px] overflow-hidden transition group ${
                      idx === activeIndex ? "opacity-100" : "opacity-50 hover:opacity-100"
                    }`}
                    aria-label={`View photo ${idx + 1}`}
                  >
                    {item.isVideo ? (
                      <>
                        <video
                          src={toLandingAssetUrl(item.url)}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <span className="material-symbols-rounded text-white text-[20px]">play_circle</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <img
                          src={toLandingAssetUrl(item.url)}
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

      {sidebarContent}
    </div>
  );
}
