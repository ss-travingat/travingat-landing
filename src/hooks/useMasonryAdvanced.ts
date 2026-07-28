"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_COLUMNS = 4;
// Responsive breakpoints for column counts.
// Enforce 4 columns for viewports between 1200px and 1728px inclusive.
const BREAKPOINTS = [
  // Mobile: prefer 2 columns per design spec
  { maxWidth: 640, columns: 2 },
  { maxWidth: 1024, columns: 2 },
  { maxWidth: 1199, columns: 3 },
  { maxWidth: 1728, columns: 4 },
  { maxWidth: Infinity, columns: 4 },
];

function debounce(fn: () => void, delay = 80) {
  let timeoutId: NodeJS.Timeout;

  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(), delay);
  };
}

export type MasonryItemWithDimensions = {
  id: string | number;
  url: string;
  width: number;
  height: number;
  placeholderColor?: string;
  alt?: string;
};

export type PositionedMasonryItem<T extends MasonryItemWithDimensions> = T & {
  x: number;
  y: number;
  displayWidth: number;
  displayHeight: number;
};

export type MasonryLayout<T extends MasonryItemWithDimensions = MasonryItemWithDimensions> = {
  columns: number;
  columnWidth: number;
  gutter: number;
  items: PositionedMasonryItem<T>[];
  height: number;
};

export function useMasonryAdvanced<T extends MasonryItemWithDimensions>(
  items: T[],
  gapX = 20,
  gapY = 20,
  minColumnWidth = 240
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<MasonryLayout<T>>({
    columns: DEFAULT_COLUMNS,
    columnWidth: 0,
    gutter: gapX,
    items: [],
    height: 0,
  });

  // Remember column assignment for items so they remain in the same column
  // across reflows (prevents items from switching columns when measurements
  // or container size changes). Keyed by item id.
  const itemColumnMapRef = useRef<Record<string | number, number>>({});

  const normalizedItems = useMemo(() => {
    return items.map((item) => ({
      ...item,
      aspectRatio: item.width > 0 && item.height > 0 ? item.width / item.height : 1,
    }));
  }, [items]);

  useEffect(() => {
    if (!containerRef.current) return;

    const measure = () => {
      const containerWidth = containerRef.current?.clientWidth || 0;
      if (!containerWidth) return;

      let columns =
        BREAKPOINTS.find(({ maxWidth }) => containerWidth <= maxWidth)?.columns ?? DEFAULT_COLUMNS;
      const availableWidth = Math.max(containerWidth, 0);

      // Compute column width. On mobile breakpoints we allow smaller column widths
      // to preserve the requested column count (eg. 2 columns on narrow devices).
      const mobileMaxWidth = 640;
      const MOBILE_GAP_X = 6; // mobile horizontal spacing
      const MOBILE_GAP_Y = 8; // mobile vertical spacing
      let columnWidth = (availableWidth - gapX * (columns - 1)) / columns;
      const isMobile = containerWidth <= mobileMaxWidth;
      const gapToUseX = isMobile ? MOBILE_GAP_X : gapX;
      const gapToUseY = isMobile ? MOBILE_GAP_Y : gapY;

      if (!isMobile) {
        // Ensure the columns actually fit the container by respecting `minColumnWidth`.
        if (columnWidth < minColumnWidth) {
          // Try reducing columns to fit the minColumnWidth constraint
          while (columns > 1) {
            columnWidth = (availableWidth - gapToUseX * (columns - 1)) / columns;
            if (columnWidth >= minColumnWidth) break;
            columns -= 1;
          }
          // If still smaller than minColumnWidth, clamp to available space per column
          columnWidth = Math.max(columnWidth, (availableWidth - gapToUseX * (columns - 1)) / columns);
        }
      }
      // Finally ensure columnWidth is non-negative
      columnWidth = Math.max(columnWidth, 0);
      const columnHeights = Array(columns).fill(0);

      const positionedItems = normalizedItems.map((item) => {
        // Prefer the previous column assignment if it still fits.
        const prevAssigned = itemColumnMapRef.current[item.id];
        let chosenColumn = -1;

        if (typeof prevAssigned === "number" && prevAssigned >= 0 && prevAssigned < columns) {
          chosenColumn = prevAssigned;
        } else {
          // Fallback: pick the current shortest column
          chosenColumn = columnHeights.indexOf(Math.min(...columnHeights));
        }

        // If chosen column would create a very tall layout imbalance because another
        // column is much shorter, still allow placing into shortest column to avoid
        // pathological stacking when columns count changed drastically.
        const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
        const heightIfPlaced = columnHeights[chosenColumn];
        const heightIfShortest = columnHeights[shortestColumnIndex];
        if (heightIfPlaced - heightIfShortest > 200) {
          chosenColumn = shortestColumnIndex;
        }

        // Persist assignment
        itemColumnMapRef.current[item.id] = chosenColumn;

        const x = chosenColumn * (columnWidth + gapToUseX);
        const y = columnHeights[chosenColumn];
        const displayHeight = columnWidth / item.aspectRatio;
        const nextHeight = y + displayHeight + gapToUseY;

        columnHeights[chosenColumn] = nextHeight;

        return {
          ...item,
          x,
          y,
          displayWidth: columnWidth,
          displayHeight,
        } as PositionedMasonryItem<T>;
      });

      const maxHeight = Math.max(...columnHeights, 0);
      setLayout({
        columns,
        columnWidth,
        gutter: gapToUseX,
        items: positionedItems,
        height: maxHeight,
      });
    };

    measure();

    const resizeObserver = new ResizeObserver(() => measure());
    resizeObserver.observe(containerRef.current);

    const debouncedMeasure = debounce(measure, 120);
    window.addEventListener("resize", debouncedMeasure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", debouncedMeasure);
    };
  }, [gapX, gapY, minColumnWidth, normalizedItems]);

  return { containerRef, ...layout };
}
