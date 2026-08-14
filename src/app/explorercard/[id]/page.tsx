import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { ClassicCard, MinimalCard, AdventureCard } from "@/features/explorercard/cards";
import countryData from "@/features/explorercard/countries.json";

export const dynamicParams = true;
export const revalidate = 60; // Cache for 60 seconds

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

  const sql = getDb();
  
  let userRows;
  try {
    userRows = await sql`
      SELECT 
        first_name, 
        last_name, 
        country, 
        visited_countries,
        profile_image_url,
        cover_image_url
      FROM users 
      WHERE id = ${id}
    `;
  } catch (err) {
    console.error("DB error fetching shared card:", err);
    notFound();
  }

  if (!userRows || userRows.length === 0) {
    notFound();
  }

  const user = userRows[0];
  
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
    <main className="min-h-screen bg-black flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-[32px] font-medium text-white tracking-[-0.5px]">
          {form.fullName}'s Explorer Card
        </h1>
        <p className="text-[14px] text-[#989898] mt-2">
          Join Travingat to create your own!
        </p>
      </div>

      <div className="scale-100 sm:scale-110 md:scale-125 origin-top transition-transform">
        {style === "minimal" ? (
          <MinimalCard form={form} sampleFlags={sampleFlags} visitedArray={visitedArray} />
        ) : style === "adventure" ? (
          <div className="w-[360px]">
            <AdventureCard form={form} sampleFlags={sampleFlags} visitedArray={visitedArray} />
          </div>
        ) : (
          <ClassicCard form={form} sampleFlags={sampleFlags} visitedArray={visitedArray} />
        )}
      </div>
      
      <div className="mt-[120px]">
        <a 
          href="/explorercard" 
          className="bg-[#5952ff] rounded-[999px] px-[24px] py-[12px] text-[16px] font-medium text-white hover:opacity-90 transition-opacity"
        >
          Create your Explorer Card
        </a>
      </div>
    </main>
  );
}
