import type { MasonryItemWithDimensions } from "@/hooks/useMasonryAdvanced";

type ImageWithMetadata = {
  url: string;
  width?: number;
  height?: number;
};

/**
 * Common aspect ratios for portrait images
 * Fallback ratios when actual dimensions aren't available
 */
const DEFAULT_ASPECT_RATIOS = [0.66, 0.75, 0.8, 1, 1.2, 1.5]; // portrait to landscape

/**
 * Converts an image URL with optional metadata into a masonry item
 * Uses provided dimensions, falls back to a default portrait ratio
 */
export function createMasonryItem(
  id: string | number,
  image: ImageWithMetadata | string,
  index?: number,
  placeholderColor = "#111111"
): MasonryItemWithDimensions {
  const isString = typeof image === "string";
  const url = isString ? image : image.url;
  const width = !isString && image.width ? image.width : 1200;
  const height = !isString && image.height ? image.height : Math.round(1200 / (DEFAULT_ASPECT_RATIOS[index ? index % DEFAULT_ASPECT_RATIOS.length : 0]));

  return {
    id,
    url,
    width,
    height,
    placeholderColor,
    alt: `Image ${id}`,
  };
}

/**
 * Converts an array of image URLs into masonry items with optional metadata
 */
export function createMasonryItems(
  images: (ImageWithMetadata | string)[],
  baseId: string,
  placeholderColor = "#111111"
): MasonryItemWithDimensions[] {
  return images.map((image, index) =>
    createMasonryItem(`${baseId}-${index}`, image, index, placeholderColor)
  );
}
