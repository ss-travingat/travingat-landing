"use client";

import Image from "next/image";
import { useState } from "react";

import type { MasonryItem } from "@/hooks/useMasonry";

type MasonryImageCardProps = {
  item: MasonryItem;
  alt?: string;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
};

export function MasonryImageCard({
  item,
  alt,
  className = "",
  onClick,
  children,
}: MasonryImageCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const placeholderColor = item.placeholderColor ?? "#151515";

  return (
    <div
      className={`group relative h-full w-full overflow-hidden rounded-[20px] bg-[#111111] ${className}`.trim()}
      onClick={onClick}
    >
      <div
        className="absolute inset-0 transition-opacity duration-400"
        style={{ backgroundColor: placeholderColor, opacity: isLoaded ? 0 : 1 }}
      />

      <Image
        src={item.url}
        alt={alt ?? item.alt ?? "Masonry image"}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        className={`object-cover transition-opacity duration-400 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setIsLoaded(true)}
        unoptimized
      />

      {children}
    </div>
  );
}
