"use client";

import { useEffect, useState, useRef } from "react";
import { useMasonryAdvanced, type MasonryItemWithDimensions } from "@/hooks/useMasonryAdvanced";

type MasonryImageGridProps<T extends MasonryItemWithDimensions> = {
  items: T[];
  gap?: number;
  gapX?: number;
  gapY?: number;
  minColumnWidth?: number;
  renderItem: (
    item: T,
    index: number,
    position: { x: number; y: number; width: number; height: number }
  ) => React.ReactNode;
  onItemsRendered?: (visibleCount: number, totalCount: number) => void;
  initialVisibleCount?: number;
};

export function MasonryImageGrid<T extends MasonryItemWithDimensions>({
  items,
  gap = 20,
  gapX,
  gapY,
  minColumnWidth = 240,
  renderItem,
  onItemsRendered,
  initialVisibleCount = 10,
}: MasonryImageGridProps<T>) {
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
  const visibleItems = items.slice(0, visibleCount);
  
  const effectiveGapX = typeof gapX === "number" ? gapX : gap;
  const effectiveGapY = typeof gapY === "number" ? gapY : gap;

  const { containerRef, items: positionedItems, height } = useMasonryAdvanced(
    visibleItems,
    effectiveGapX,
    effectiveGapY,
    minColumnWidth
  );

  useEffect(() => {
    setVisibleCount(Math.min(initialVisibleCount, items.length));
  }, [items.length, initialVisibleCount]);

  useEffect(() => {
    if (visibleCount >= items.length) return;

    const handleScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 400;

      if (nearBottom) {
        setVisibleCount((current) => Math.min(items.length, current + 10));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount, items.length]);

  useEffect(() => {
    onItemsRendered?.(visibleCount, items.length);
  }, [visibleCount, items.length, onItemsRendered]);
  return (
    <div ref={containerRef} className="relative w-full" style={{ height, minHeight: 480 }}>
      {positionedItems.map((item, index) => (
        <div
          key={item.id}
          style={{
            position: "absolute",
            width: item.displayWidth,
            height: item.displayHeight,
            transform: `translate3d(${item.x}px, ${item.y}px, 0)`,
          }}
        >
          
          {renderItem(
            item as T,
            index,
            {
              x: item.x,
              y: item.y,
              width: item.displayWidth,
              height: item.displayHeight,
            }
          )}
        </div>
      ))}
    </div>
  );
}
