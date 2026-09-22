import { MediaResolver } from "./media-resolver";

export function getLandingAssetsCdnBase(): string {
  // We can just expose a quick proxy if anyone needs the base CDN directly
  const envBase = process.env.NEXT_PUBLIC_LANDING_ASSETS_CDN_BASE;
  if (envBase && envBase.trim().length > 0) {
    return envBase.replace(/\/+$/, "");
  }
  const publicUrl = (process.env.R2_PUBLIC_URL || "https://cdn.travingat.com").replace(/\/+$/, "");
  return `${publicUrl}/landingpage-assets`;
}

export function toLandingAssetUrl(assetPath: string | { url: string }): string {
  return MediaResolver.getBase(assetPath);
}

export function normalizeAssetHtml(html: string): string {
  if (!html) return html;

  return html.replace(/src=(['"])\/(?!\/)([^'"]+)\1/g, (_match, quote, path) => {
    const absoluteUrl = MediaResolver.getBase(`/${path}`);
    return `src=${quote}${absoluteUrl}${quote}`;
  });
}

export function getOptimizedMediaUrl(assetUrl: string): string {
  return MediaResolver.getOptimized(assetUrl);
}
