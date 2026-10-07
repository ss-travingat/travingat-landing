import { notFound } from "next/navigation";
import Link from "next/link";

import { ClassicCard, MinimalCard, AdventureCard } from "@/features/explorercard/cards";
import countryData from "@/features/explorercard/countries.json";
import ProfileFooter from "@/features/profilepages/components/ProfileFooter";

import { ExplorerCardScaler } from "@/features/explorercard/ExplorerCardScaler";

export const dynamicParams = true;
export const fetchCache = "force-no-store";
export const revalidate = 0; // Disable cache entirely to prevent stale DB reads

// Build flag map
const sampleFlags: Record<string, string> = {};
for (const [code, name] of Object.entries(countryData)) {
  if (code.length === 2) {
    sampleFlags[name as string] = code.toUpperCase();
  }
}

export default async function ShortExplorerCardPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const searchParamsHandle = typeof resolvedSearchParams.handle === 'string' ? resolvedSearchParams.handle : '';

  // Parse shortId and style suffix
  // e.g., 916ea9de-c -> shortId = "916ea9de", suffix = "c"
  const parts = id.split("-");
  if (parts.length !== 2) {
    notFound();
  }

  const shortId = parts[0];
  const suffix = parts[1];

  if (shortId.length < 8) {
    notFound();
  }

  let style = "classic";
  if (suffix === "b") style = "minimal";
  if (suffix === "c") style = "adventure";

  const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";
  let cardData: any = null;
  try {
    const res = await fetch(`${BACKEND_URL}/api/explorercard/${shortId}`, { next: { revalidate: 0 } });
    if (res.ok) {
      const data = await res.json();
      const nameParts = (data.name || '').split(' ');
      cardData = {
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(' ') || '',
        country: data.country,
        visited_countries: data.visited_countries,
        profile_image_url: data.profile_image_url,
        cover_image_url: data.cover_image_url,
        profile_crop_data: typeof data.profile_crop_data === "string" ? JSON.parse(data.profile_crop_data) : data.profile_crop_data,
        cover_crop_data: typeof data.cover_crop_data === "string" ? JSON.parse(data.cover_crop_data) : data.cover_crop_data,
        show_badge: data.show_badge || false,
        handle: data.user?.handle || data.user?.username || data.handle || data.username || searchParamsHandle || ""
      };
    }
  } catch (err) {
    console.error("Fetch error fetching short shared card:", err);
    notFound();
  }

  if (!cardData) {
    notFound();
  }

  const user = cardData;

  // Construct form data for Cards
  const form = {
    fullName: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
    country: user.country || "",
    profileImage: user.profile_image_url || "",
    coverImage: user.cover_image_url || "",
    showBadge: user.show_badge || false,
  };

  // visited_countries is parsed automatically by postgres library if it's a JSON array
  let visitedArray: string[] = [];
  if (Array.isArray(user.visited_countries)) {
    visitedArray = user.visited_countries;
  } else if (typeof user.visited_countries === 'string') {
    try {
      visitedArray = JSON.parse(user.visited_countries);
    } catch {
      visitedArray = [];
    }
  }


  return (
    <div className="min-h-screen bg-black flex flex-col">
      <main className="flex-1 flex items-center justify-center pt-[48px] pb-[80px] lg:pb-[120px] px-6 lg:px-12 w-full max-w-[1400px] mx-auto">
        {/* Centered Card */}
        <div className="pointer-events-auto w-full flex justify-center">
          <Link href={user.handle ? `/${user.handle.replace(/^@/, '')}` : '#'} className="block hover:opacity-95 transition-opacity cursor-pointer">
            <ExplorerCardScaler>
              {style === "minimal" ? (
                <MinimalCard form={form} sampleFlags={sampleFlags} visitedArray={visitedArray} coverCropData={user.cover_crop_data?.Minimal || (user.cover_crop_data?.pixels ? user.cover_crop_data : null)} profileCropData={user.profile_crop_data} />
              ) : style === "adventure" ? (
                <AdventureCard form={form} sampleFlags={sampleFlags} visitedArray={visitedArray} coverCropData={user.cover_crop_data?.Adventure || (user.cover_crop_data?.pixels ? user.cover_crop_data : null)} profileCropData={user.profile_crop_data} />
              ) : (
                <ClassicCard form={form} sampleFlags={sampleFlags} visitedArray={visitedArray} coverCropData={user.cover_crop_data?.Classic || (user.cover_crop_data?.pixels ? user.cover_crop_data : null)} profileCropData={user.profile_crop_data} />
              )}
            </ExplorerCardScaler>
          </Link>
        </div>
      </main>

      {/* Spacer to push footer to bottom, since main is fixed */}
      <div className="flex-1" />
      <div className="relative z-20 pointer-events-auto">
        <ProfileFooter />
      </div>
    </div>
  );
}
