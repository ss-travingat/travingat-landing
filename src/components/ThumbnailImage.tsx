import React, { useState, useEffect, ImgHTMLAttributes } from 'react';

interface ThumbnailImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  originalSrc: string;
  size?: 320 | 480 | 720;
}

export function getThumbnailUrl(originalUrl: string, size: number = 320): string {
  if (!originalUrl) return originalUrl;
  try {
    const urlObj = new URL(originalUrl);
    // If it's a relative URL or not on our CDN, just return original
    if (!urlObj.hostname.includes('travingat.com') && !urlObj.hostname.includes('r2.cloudflarestorage.com')) {
      return originalUrl;
    }
    const path = urlObj.pathname.replace(/^\/+/, "");
    const pathWithoutExt = path.replace(/\.[^/.]+$/, "");
    urlObj.pathname = `/thumbnails/${pathWithoutExt}_${size}.webp`;
    return urlObj.toString();
  } catch (e) {
    return originalUrl;
  }
}

export function ThumbnailImage({ originalSrc, size = 320, ...props }: ThumbnailImageProps) {
  const [src, setSrc] = useState<string>(getThumbnailUrl(originalSrc, size));

  useEffect(() => {
    setSrc(getThumbnailUrl(originalSrc, size));
  }, [originalSrc, size]);

  const handleError = () => {
    if (src !== originalSrc) {
      console.log(`Fallback to original image for: ${originalSrc}`);
      setSrc(originalSrc);
    }
  };

  return (
    <img 
      src={src} 
      onError={handleError} 
      {...props} 
    />
  );
}
