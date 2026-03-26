const DEFAULT_R2_PUBLIC_URL = "https://pub-73816168e54041228c76b8c06deb5f76.r2.dev";
const LANDING_ASSETS_PREFIX = "landingpage-assets";

export function getLandingAssetsCdnBase(): string {
  const envBase = process.env.NEXT_PUBLIC_LANDING_ASSETS_CDN_BASE;
  if (envBase && envBase.trim().length > 0) {
    return envBase.replace(/\/+$/, "");
  }

  const publicUrl = (process.env.R2_PUBLIC_URL || DEFAULT_R2_PUBLIC_URL).replace(
    /\/+$/,
    ""
  );
  return `${publicUrl}/${LANDING_ASSETS_PREFIX}`;
}

export function toLandingAssetUrl(assetPath: string): string {
  if (!assetPath) return assetPath;
  if (/^https?:\/\//i.test(assetPath)) return assetPath;

  const normalizedPath = assetPath.replace(/^\/+/, "");
  return `${getLandingAssetsCdnBase()}/${normalizedPath}`;
}

export function normalizeAssetHtml(html: string): string {
  if (!html) return html;

  return html.replace(/src=(['"])\/(?!\/)([^'"]+)\1/g, (_match, quote, path) => {
    const absoluteUrl = toLandingAssetUrl(`/${path}`);
    return `src=${quote}${absoluteUrl}${quote}`;
  });
}
