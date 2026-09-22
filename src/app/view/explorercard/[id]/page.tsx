import { notFound } from "next/navigation";

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

export default async function SharedExplorerCardPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const { style } = await searchParams;
  
  // Validate UUID format roughly to avoid DB errors on bad input
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    notFound();
  }

  const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";
  let cardData: any = null;
  try {
    const res = await fetch(`${BACKEND_URL}/api/explorercard/${id}`, { next: { revalidate: 0 } });
    if (res.ok) {
      const data = await res.json();
      const nameParts = (data.name || '').split(' ');
      cardData = {
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(' ') || '',
        country: data.country,
        visited_countries: data.visited_countries,
        profile_image_url: data.profile_image_url,
        cover_image_url: data.cover_image_url
      };
    }
  } catch (err) {
    console.error("Fetch error for shared card:", err);
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
      <main className="flex-1 flex items-center justify-center px-6 lg:px-12 w-full overflow-hidden max-w-[1400px] mx-auto">
        {/* Centered Card */}
        <ExplorerCardScaler>
          {style === "minimal" ? (
            <MinimalCard form={form} sampleFlags={sampleFlags} visitedArray={visitedArray} />
          ) : style === "adventure" ? (
            <AdventureCard form={form} sampleFlags={sampleFlags} visitedArray={visitedArray} />
          ) : (
            <ClassicCard form={form} sampleFlags={sampleFlags} visitedArray={visitedArray} />
          )}
        </ExplorerCardScaler>
      </main>
      <ProfileFooter />
    </div>
  );
}
