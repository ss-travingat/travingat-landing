const DEFAULT_R2_PUBLIC_URL = "https://cdn.travingat.com";
const LANDING_ASSETS_PREFIX = "landingpage-assets";

export class MediaResolver {
  /**
   * Internal helper to determine if an asset is a "bare" media file from dummy data.
   */
  private static isBareMediaFile(path: string): boolean {
    return !path.includes("/") && /\.(avif|webp|jpe?g|png|heic|heif|mp4|mov|webm|m4v|3gp|3g2)$/i.test(path);
  }

  /**
   * Internal helper to get the CDN base for legacy landing-assets.
   */
  private static getLandingAssetsCdnBase(): string {
    const envBase = process.env.NEXT_PUBLIC_LANDING_ASSETS_CDN_BASE;
    if (envBase && envBase.trim().length > 0) {
      return envBase.replace(/\/+$/, "");
    }
    const publicUrl = (process.env.R2_PUBLIC_URL || DEFAULT_R2_PUBLIC_URL).replace(/\/+$/, "");
    return `${publicUrl}/${LANDING_ASSETS_PREFIX}`;
  }

  /**
   * Resolves the base, un-optimized URL for any asset. 
   * If it's a full URL, returns it as-is.
   * If it's a bare dummy data file (e.g., `la_123.jpg`), prepends the landingpage-assets folder.
   * If it's a real backend path (e.g., `uploads/...` or `<uuid>/media/...`), returns it from the root CDN.
   */
  public static getBase(assetPath: string | { url: string } | undefined | null): string {
    if (!assetPath) return "";
    
    const urlStr = typeof assetPath === "string" ? assetPath : assetPath.url;
    if (!urlStr) return "";
    if (/^https?:\/\//i.test(urlStr) || /^blob:/i.test(urlStr) || /^data:/i.test(urlStr)) {
      return urlStr;
    }

    const normalizedInput = urlStr.replace(/^\/+/, "");
    
    // Support dummy data from profile-data.ts which are just bare filenames
    if (this.isBareMediaFile(normalizedInput)) {
      return `${this.getLandingAssetsCdnBase()}/profiles/${encodeURIComponent(normalizedInput)}`;
    }

    // If the path belongs to dummy data (e.g., assets/...), route it through landing-assets
    if (normalizedInput.startsWith("assets/") || normalizedInput.startsWith("designsystem/") || normalizedInput.startsWith("emails/") || normalizedInput.startsWith("blogs/") || normalizedInput.startsWith("explorercard/")) {
      const parts = normalizedInput.split("/").map(segment => encodeURIComponent(segment)).join("/");
      return `${this.getLandingAssetsCdnBase()}/${parts}`;
    }

    // Real backend path (e.g., `uploads/123.jpg` or `uuid/media/US/123.jpg`)
    const publicUrl = (process.env.R2_PUBLIC_URL || DEFAULT_R2_PUBLIC_URL).replace(/\/+$/, "");
    
    // URL encode the path segments safely
    const pathParts = normalizedInput.split("/").map(segment => encodeURIComponent(segment)).join("/");
    return `${publicUrl}/${pathParts}`;
  }

  /**
   * Generates the optimized URL (.webp or .webm) based on the base URL.
   * Backend converts all images to .webp and videos to .webm.
   */
  public static getOptimized(assetPath: string | { url: string } | undefined | null): string {
    const baseUrl = this.getBase(assetPath);
    if (!baseUrl) return "";

    try {
      const urlObj = new URL(baseUrl);
      // Don't modify URLs outside our CDN
      if (!urlObj.hostname.includes('travingat.com') && !urlObj.hostname.includes('r2.cloudflarestorage.com')) {
        return baseUrl;
      }
    } catch (e) {
      return baseUrl;
    }

    const isVideo = /\.(mp4|mov|m4v|3gp|3g2|webm)$/i.test(baseUrl);
    return baseUrl.replace(/\.[^/.]+$/, isVideo ? ".webm" : ".avif");
  }

  /**
   * Generates the thumbnail URL (e.g., 720p .webp) for an asset.
   * Backend puts thumbnails in `/thumbnails/` relative to the root bucket.
   */
  public static getThumbnail(assetPath: string | { url: string } | undefined | null, size: number = 720): string {
    const baseUrl = this.getBase(assetPath);
    if (!baseUrl) return "";

    try {
      const urlObj = new URL(baseUrl);
      if (!urlObj.hostname.includes('travingat.com') && !urlObj.hostname.includes('r2.cloudflarestorage.com')) {
        return baseUrl;
      }
      
      const path = urlObj.pathname.replace(/^\/+/, "");
      
      // If it's a dummy asset under landingpage-assets, just return the optimized URL since no thumbnails exist there
      if (path.startsWith(LANDING_ASSETS_PREFIX)) {
        return this.getOptimized(baseUrl);
      }

      const pathWithoutExt = path.replace(/\.[^/.]+$/, "");
      urlObj.pathname = `/thumbnails/${pathWithoutExt}_${size}.avif`;
      return urlObj.toString();
    } catch (e) {
      return baseUrl;
    }
  }
}
