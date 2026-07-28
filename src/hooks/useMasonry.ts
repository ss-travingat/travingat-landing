"use client";

import { RefObject, useCallback, useEffect, useRef, useState } from "react";

export type MasonryItem = {
  id: string | number;
  url: string;
  width: number;
  height: number;
  placeholderColor?: string;
  alt?: string;
};

export type MasonryLayoutItem<T extends MasonryItem = MasonryItem> = {
  item: T;
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

type UseMasonryOptions = {
  gap?: number;
  minColumnWidth?: number;
};

export function useMasonry<T extends MasonryItem>(
  items: T[],
  containerRef: RefObject<HTMLElement | null>,
  options: UseMasonryOptions = {}
) {
  const gap = options.gap ?? 20;
  const minColumnWidth = options.minColumnWidth ?? 220;

  const [layout, setLayout] = useState<MasonryLayoutItem<T>[]>([]);
  const [containerHeight, setContainerHeight] = useState(0);
  const [columnCount, setColumnCount] = useState(1);
  const resizeTimeoutRef = useRef<number | null>(null);

  const computeLayout = useCallback(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;

    const width = container.clientWidth;
    if (!width) return;

    const nextColumnCount = Math.max(
      1,
      Math.min(6, Math.floor((width + gap) / (minColumnWidth + gap)))
    );

    const columnWidth = (width - gap * (nextColumnCount - 1)) / nextColumnCount;
    const heights = new Array(nextColumnCount).fill(0);
    const nextLayout: MasonryLayoutItem<T>[] = [];

    items.forEach((item, index) => {
      const columnIndex = heights.indexOf(Math.min(...heights));
      const aspectRatio = item.width > 0 ? item.height / item.width : 0.75;
      const cardHeight = aspectRatio > 0 ? Math.max(120, columnWidth * aspectRatio) : columnWidth * 0.75;

      const x = columnIndex * (columnWidth + gap);
      const y = heights[columnIndex];

      nextLayout.push({
        item,
        index,
        x,
        y,
        width: columnWidth,
        height: cardHeight,
      });

      heights[columnIndex] += cardHeight + gap;
    });

    const nextHeight = Math.max(0, ...heights) + 0;
    setColumnCount(nextColumnCount);
    setLayout(nextLayout);
    setContainerHeight(nextHeight);
  }, [containerRef, gap, items, minColumnWidth]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = window.setTimeout(() => {
        computeLayout();
      }, 120);
    };

    const container = containerRef.current;
    if (!container) return;

    handleResize();

    const observer = new ResizeObserver(handleResize);
    observer.observe(container);
    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      if (resizeTimeoutRef.current) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [containerRef, computeLayout]);

  return {
    layout,
    containerHeight,
    columnCount,
  };
}
