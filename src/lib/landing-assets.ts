const DEFAULT_R2_PUBLIC_URL = "https://cdn.travingat.com";
const LANDING_ASSETS_PREFIX = "landingpage-assets";

function isBareMediaFile(path: string): boolean {
  // Many profile media records store only a filename (e.g. "la_123.webp").
  // Those files are uploaded under landingpage-assets/profiles/* on R2.
  return !path.includes("/") && /\.(avif|webp|jpe?g|png|heic|heif|mp4|mov|webm|m4v|3gp|3g2)$/i.test(path);
}

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
  if (/^https?:\/\//i.test(assetPath) || /^blob:/i.test(assetPath) || /^data:/i.test(assetPath)) return assetPath;

  const normalizedInput = assetPath.replace(/^\/+/, "");
  const assetPathWithFolder = isBareMediaFile(normalizedInput)
    ? `profiles/${normalizedInput}`
    : normalizedInput;

  const normalizedPath = assetPathWithFolder
    .replace(/^\/+/, "")
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${getLandingAssetsCdnBase()}/${normalizedPath}`;
}

export function normalizeAssetHtml(html: string): string {
  if (!html) return html;

  return html.replace(/src=(['"])\/(?!\/)([^'"]+)\1/g, (_match, quote, path) => {
    const absoluteUrl = toLandingAssetUrl(`/${path}`);
    return `src=${quote}${absoluteUrl}${quote}`;
  });
}
