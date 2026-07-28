"use client";

import type { CSSProperties, ReactNode } from "react";
import { useRef } from "react";

import { useMasonry, type MasonryItem, type MasonryLayoutItem } from "@/hooks/useMasonry";
import { MasonryImageCard } from "./MasonryImageCard";

type MasonryGridProps<T extends MasonryItem> = {
  items: T[];
  className?: string;
  gap?: number;
  minColumnWidth?: number;
  renderItem?: (item: T, index: number, style: CSSProperties) => ReactNode;
  getItemKey?: (item: T, index: number) => string | number;
};

export function MasonryGrid<T extends MasonryItem>({
  items,
  className = "",
  gap = 20,
  minColumnWidth = 220,
  renderItem,
  getItemKey,
}: MasonryGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { layout, containerHeight } = useMasonry(items, containerRef, {
    gap,
    minColumnWidth,
  });

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-visible ${className}`.trim()}
      style={{ height: containerHeight, minHeight: 0 }}
    >
      {layout.map(({ item, index, x, y, width, height }) => {
        const style: CSSProperties = {
          position: "absolute",
          left: 0,
          top: 0,
          width,
          height,
          transform: `translate3d(${x}px, ${y}px, 0)`,
          willChange: "transform",
        };

        return (
          <div key={getItemKey?.(item, index) ?? `${item.id}-${index}`} style={style}>
            {renderItem ? renderItem(item, index, style) : <MasonryImageCard item={item} />}
          </div>
        );
      })}
    </div>
  );
}
