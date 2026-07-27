"use client";

import { useState } from "react";

export default function LoadedImage({ 
  src, 
  alt, 
  className = "",
  containerClassName = "",
  skeletonClassName = "absolute inset-0",
  onClick,
  onLoad,
}: { 
  src: string; 
  alt: string; 
  className?: string;
  containerClassName?: string;
  skeletonClassName?: string;
  onClick?: (event: React.MouseEvent<HTMLImageElement>) => void;
  onLoad?: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Skeleton placeholder — sits in flow to hold space (e.g. aspect-[3/4]) or overlays absolutely */}
      {!loaded && (
        <div className={`bg-[#1a1a1a] animate-pulse rounded-[inherit] ${skeletonClassName}`} />
      )}

      {/* 
        Hidden 0×0 preloader: starts the browser download without affecting layout.
        Once the URL resolves, handleLoad fires → browser has image in cache.
      */}
      {!loaded && (
        <img
          src={src}
          alt=""
          aria-hidden
          className="absolute w-0 h-0 opacity-0 pointer-events-none"
          onLoad={handleLoad}
        />
      )}

      {/* Real image — only rendered after load, always in normal flow at natural size */}
      {loaded && (
        <img
          src={src}
          alt={alt}
          className={className}
          onClick={onClick}
        />
      )}
    </div>
  );
}
