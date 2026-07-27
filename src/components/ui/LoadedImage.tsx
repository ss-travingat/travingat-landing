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
  fetchPriority,
  loading,
  deferLoad,
}: { 
  src: string; 
  alt: string; 
  className?: string;
  containerClassName?: string;
  skeletonClassName?: string;
  onClick?: (event: React.MouseEvent<HTMLImageElement>) => void;
  onLoad?: () => void;
  fetchPriority?: "high" | "low" | "auto";
  loading?: "eager" | "lazy";
  deferLoad?: boolean;
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

      {/* Real image — hidden from layout until loaded, then pops into flow */}
      {!deferLoad && (
        <img
          src={src}
          alt={alt}
          className={`${className} ${loaded ? '' : 'absolute w-0 h-0 opacity-0 pointer-events-none'}`}
          ref={(el) => {
            if (el?.complete && !loaded) {
              handleLoad();
            }
          }}
          onLoad={handleLoad}
          onClick={onClick}
          fetchPriority={fetchPriority}
          loading={loading}
        />
      )}
    </div>
  );
}
