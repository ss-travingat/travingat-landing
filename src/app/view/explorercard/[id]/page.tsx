import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { ClassicCard, MinimalCard, AdventureCard } from "@/features/explorercard/cards";
import countryData from "@/features/explorercard/countries.json";

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

  const sql = getDb();
  
  let cardData: any = null;
  try {
    const explorerCards = await sql`
      SELECT 
        name as first_name, /* we will split name below */
        '' as last_name,
        country, 
        visited_countries,
        profile_image_url,
        cover_image_url
      FROM explorer_cards 
      WHERE user_id = ${id}
    `;

    if (explorerCards && explorerCards.length > 0) {
      cardData = explorerCards[0];
      const nameParts = (cardData.first_name || '').split(' ');
      cardData.first_name = nameParts[0] || '';
      cardData.last_name = nameParts.slice(1).join(' ') || '';
    } else {
      // Fallback to users table
      const userRows = await sql`
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
      if (userRows && userRows.length > 0) {
        cardData = userRows[0];
      }
    }
  } catch (err) {
    console.error("DB error fetching shared card:", err);
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
    <main className="min-h-screen bg-black flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-[80px] pt-[40px] pb-[80px] lg:py-[120px] px-6 lg:px-12 w-full overflow-hidden max-w-[1400px] mx-auto">
      {/* Mobile-only Title */}
      <h1 className="lg:hidden text-[32px] sm:text-[40px] font-medium text-white tracking-[-1px] ds-font-display leading-[1.1] mb-0 text-center w-full order-0">
        <span className="capitalize">{form.fullName}</span>'s Explorer Card
      </h1>

      {/* Left Column: Text, CTA & Features */}
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left z-10 max-w-[600px] w-full order-2 lg:order-1 mt-4 lg:mt-0">
        <h1 className="hidden lg:block lg:text-[56px] font-medium text-white tracking-[-1px] ds-font-display leading-[1.1] mb-6 order-1">
          <span className="capitalize">{form.fullName}</span>'s Explorer Card
        </h1>


        {/* CTA Container */}
        <div className="flex flex-col items-center lg:items-start w-full order-3 lg:order-2 mb-0 lg:mb-12 mt-4 lg:mt-0">
          <p className="text-[16px] lg:text-[18px] text-[#989898] mb-6 lg:mb-8">
            Join Travingat to create your own!
          </p>
          <a 
            href="/join/explorercard" 
            className="bg-[#5952ff] rounded-[999px] px-[32px] py-[16px] text-[16px] lg:text-[18px] font-medium text-white hover:opacity-90 transition-opacity flex w-full items-center justify-center"
          >
            Create my card
          </a>
        </div>
      </div>

      {/* Right Column: Card */}
      <div className="relative flex items-center justify-center lg:w-[450px] lg:h-[750px] sm:mb-[60px] lg:mb-0 order-1 lg:order-2">
        <div className="scale-100 sm:scale-110 lg:scale-125 origin-top lg:origin-center transition-transform">
          {style === "minimal" ? (
            <MinimalCard form={form} sampleFlags={sampleFlags} visitedArray={visitedArray} />
          ) : style === "adventure" ? (
            <AdventureCard form={form} sampleFlags={sampleFlags} visitedArray={visitedArray} />
          ) : (
            <ClassicCard form={form} sampleFlags={sampleFlags} visitedArray={visitedArray} />
          )}
        </div>
      </div>
    </main>
  );
}
