import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { uploadExplorerCardAsset } from "@/lib/r2-upload";

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
        fileName: `profile.${ext}`,
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
        fileName: `cover.${ext}`,
        contentType: coverFile.type,
        userId
      });
      coverPublicUrl = res.url;
    }

    // Update user row with the uploaded URLs
    await sql`
      UPDATE users 
      SET 
        profile_image_url = ${profilePublicUrl || null},
        cover_image_url = ${coverPublicUrl || null}
      WHERE id = ${userId};
    `;

    const cardStyle = formData.get("cardStyle") as string;
    await sql`
      UPDATE waitlist
      SET explorer_card_status = 'Created',
          countries_count = ${visitedCountries.length},
          card_style = ${cardStyle || '--'}
      WHERE email = ${email};
    `;

    return NextResponse.json({
      success: true,
      userId,
      profilePublicUrl,
      coverPublicUrl
    });

  } catch (error) {
    console.error("Error creating explorer card user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
