"use client";
import React, { useState, useEffect, ImgHTMLAttributes } from 'react';

interface ThumbnailImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  originalSrc: string;
  size?: 720;
}

import { MediaResolver } from "@/lib/media-resolver";

export function getThumbnailUrl(originalUrl: string, size: number = 720): string {
  return MediaResolver.getThumbnail(originalUrl, size);
}

export function ThumbnailImage({ originalSrc, size = 720, ...props }: ThumbnailImageProps) {
  const [src, setSrc] = useState<string>(getThumbnailUrl(originalSrc, size));
  const [prevOriginalSrc, setPrevOriginalSrc] = useState(originalSrc);
  const [prevSize, setPrevSize] = useState(size);

  if (originalSrc !== prevOriginalSrc || size !== prevSize) {
    setPrevOriginalSrc(originalSrc);
    setPrevSize(size);
    setSrc(getThumbnailUrl(originalSrc, size));
  }

  const handleError = () => {
    if (src !== originalSrc) {
      console.log(`Fallback to original image for: ${originalSrc}`);
      setSrc(originalSrc);
    }
  };

  return (
    <img 
      src={src} 
      loading="lazy"
      decoding="async"
      onError={handleError} 
      {...props} 
    />
  );
}
