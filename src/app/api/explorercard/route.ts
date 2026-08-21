import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { uploadExplorerCardAsset } from "@/lib/r2-upload";
import { sendCardAndInviteEmail } from "@/emails/cardninvite-mailer";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const country = formData.get("country") as string;
    const visitedCountriesString = formData.get("visitedCountries") as string;
    const visitedCountries = visitedCountriesString ? JSON.parse(visitedCountriesString) : [];
    
    const profileFile = formData.get("profileImage") as File | null;
    const coverFile = formData.get("coverImage") as File | null;
    const existingProfileImage = formData.get("existingProfileImage") as string | null;
    const existingCoverImage = formData.get("existingCoverImage") as string | null;

    const sql = getDb();

    // --- Server-side validation ---
    if (!firstName?.trim()) return NextResponse.json({ error: "First name is required." }, { status: 400 });
    if (!lastName?.trim()) return NextResponse.json({ error: "Last name is required." }, { status: 400 });
    if (!country?.trim()) return NextResponse.json({ error: "Home country is required." }, { status: 400 });
    if (!email?.trim()) return NextResponse.json({ error: "Email is required." }, { status: 400 });
    if (!Array.isArray(visitedCountries) || visitedCountries.length < 5) {
      return NextResponse.json({ error: `At least 5 visited countries are required. Got ${visitedCountries.length}.` }, { status: 400 });
    }
    const hasProfileImage = !!profileFile || !!existingProfileImage;
    const hasCoverImage = !!coverFile || !!existingCoverImage;
    if (!hasProfileImage) return NextResponse.json({ error: "Profile photo is required." }, { status: 400 });
    if (!hasCoverImage) return NextResponse.json({ error: "Cover photo is required." }, { status: 400 });

    // The user record (and UUID) was already created during the OTP verification phase
    const result = await sql`
      UPDATE users 
      SET 
        first_name = ${firstName},
        last_name = ${lastName},
        country = ${country},
        visited_countries = ${visitedCountries}
      WHERE email = ${email}
      RETURNING id;
    `;
    
    if (result.length === 0) {
      return NextResponse.json({ error: "Failed to find or update user record" }, { status: 404 });
    }

    const userId = result[0].id;

    let profilePublicUrl = existingProfileImage || null;
    let coverPublicUrl = existingCoverImage || null;

    // Upload Profile Image
    if (profileFile) {
      const ext = profileFile.type.split('/')[1] || 'png';
      const arrayBuffer = await profileFile.arrayBuffer();
      const res = await uploadExplorerCardAsset({
        fileBuffer: Buffer.from(arrayBuffer),
        fileName: `profile-${Date.now()}.${ext}`,
        contentType: profileFile.type,
        userId
      });
      profilePublicUrl = res.url;
    }

    // Upload Cover Image
    if (coverFile) {
      const ext = coverFile.type.split('/')[1] || 'png';
      const arrayBuffer = await coverFile.arrayBuffer();
      const res = await uploadExplorerCardAsset({
        fileBuffer: Buffer.from(arrayBuffer),
        fileName: `cover-${Date.now()}.${ext}`,
        contentType: coverFile.type,
        userId
      });
      coverPublicUrl = res.url;
    }

    // Update user row with the uploaded URLs for general profile, preserving existing ones if empty
    await sql`
      UPDATE users 
      SET 
        profile_image_url = COALESCE(${profilePublicUrl || null}, profile_image_url),
        cover_image_url = COALESCE(${coverPublicUrl || null}, cover_image_url)
      WHERE id = ${userId};
    `;

    const cardStyle = formData.get("cardStyle") as string;

    // Check if the card already exists before upserting
    const existingCards = await sql`SELECT user_id FROM explorer_cards WHERE user_id = ${userId} LIMIT 1`;
    const isFirstTime = existingCards.length === 0;

    // Upsert into the new explorer_cards table
    await sql`
      INSERT INTO explorer_cards (
        user_id, name, email, country, visited_countries, profile_image_url, cover_image_url, card_style, card_created
      ) VALUES (
        ${userId}, ${firstName + ' ' + lastName}, ${email}, ${country}, ${JSON.stringify(visitedCountries)}::jsonb, ${profilePublicUrl}, ${coverPublicUrl}, ${cardStyle || '--'}, true
      ) ON CONFLICT (user_id) DO UPDATE SET
        name = EXCLUDED.name,
        country = EXCLUDED.country,
        visited_countries = EXCLUDED.visited_countries,
        profile_image_url = COALESCE(EXCLUDED.profile_image_url, explorer_cards.profile_image_url),
        cover_image_url = COALESCE(EXCLUDED.cover_image_url, explorer_cards.cover_image_url),
        card_style = EXCLUDED.card_style,
        card_created = true;
    `;


    await sql`
      UPDATE waitlist
      SET explorer_card_status = 'Created',
          countries_count = ${visitedCountries.length},
          card_style = ${cardStyle || '--'}
      WHERE email = ${email};
    `;

    // Only send the creation email if this is the first time the card is created
    if (isFirstTime) {
      // Send Card and Invite Email asynchronously
      const editUrl = "https://www.travingat.com/edit/explorercard";
      const fullName = `${firstName} ${lastName}`.trim();
      sendCardAndInviteEmail(email, fullName, editUrl).catch(err => {
        console.error("Failed to dispatch cardninvite email:", err);
      });
    }

    return NextResponse.json({
      success: true,
      userId,
      profilePublicUrl,
      coverPublicUrl
    });

  } catch (error: any) {
    console.error("Error creating explorer card user:", error);
    require('fs').writeFileSync('/tmp/travingat_error.log', String(error?.stack || error));
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
