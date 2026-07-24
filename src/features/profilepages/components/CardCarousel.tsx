"use client";

import { useState, useEffect } from "react";
import { toLandingAssetUrl } from "@/lib/landing-assets";

export default function CardCarousel({
  images,
  alt,
  maxImages = 10,
  containerClassName = "aspect-square",
}: {
  images: string[];
  alt: string;
  maxImages?: number;
  containerClassName?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const displayImages = images.slice(0, maxImages);

  useEffect(() => {
    if (!isHovered || displayImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isHovered, displayImages.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  if (displayImages.length === 0) return null;

  return (
    <div 
      className={`relative w-full overflow-hidden rounded-[8px] md:rounded-2xl bg-[#151515] group ${containerClassName}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {displayImages.map((src, i) => (
          <div key={`${src}-${i}`} className="w-full h-full flex-shrink-0 overflow-hidden relative">
            <img
              src={toLandingAssetUrl(src)}
              alt={`${alt} ${i + 1}`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover block transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </div>
        ))}
      </div>

      {displayImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="hidden md:grid absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 place-items-center rounded-full bg-white/95 text-black shadow-md opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-white hover:scale-105 focus-visible:opacity-100 z-10"
            aria-label={`Previous photo`}
          >
            <span className="material-symbols-rounded text-[20px]">chevron_left</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="hidden md:grid absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 place-items-center rounded-full bg-white/95 text-black shadow-md opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-white hover:scale-105 focus-visible:opacity-100 z-10"
            aria-label={`Next photo`}
          >
            <span className="material-symbols-rounded text-[20px]">chevron_right</span>
          </button>

          <div className="hidden md:flex absolute bottom-3 left-1/2 -translate-x-1/2 items-center justify-center gap-1.5 z-10">
            {displayImages.map((_, i) => (
              <div
                key={i}
                className={`transition-all duration-300 rounded-full bg-white shadow-sm ${
                  i === currentIndex ? "w-1.5 h-1.5 opacity-100" : "w-1 h-1 opacity-50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
