import { NextRequest, NextResponse } from "next/server";
import { getDrizzle } from "@/lib/drizzle";
import { users, featuredProfiles, explorerCards } from "@/db/schema";
import { eq, or, sql, like } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { originalUrl, optimizedUrl } = await req.json();

    if (!originalUrl || !optimizedUrl) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }
    
    // Extract filenames to search for in case the DB stores relative paths
    const originalFilename = originalUrl.split('/').pop();
    const optimizedFilename = optimizedUrl.split('/').pop();
    
    if (!originalFilename || !optimizedFilename) {
      return NextResponse.json({ error: "Invalid URLs" }, { status: 400 });
    }
    if (originalFilename === optimizedFilename) {
      return NextResponse.json({ success: true, message: "No healing needed" });
    }

    const searchPattern = `%${originalFilename}`;
    const db = getDrizzle();

    let updatedCount = 0;

    // 1. Check users table
    const userRows = await db.select().from(users).where(
      or(
        like(users.avatar_url, searchPattern),
        like(users.cover_photo_url, searchPattern),
        like(users.profile_image_url, searchPattern),
        like(users.cover_image_url, searchPattern)
      )
    );

    for (const row of userRows) {
      const updates: any = {};
      if (row.avatar_url?.includes(originalFilename)) updates.avatar_url = row.avatar_url.replace(originalFilename, optimizedFilename);
      if (row.cover_photo_url?.includes(originalFilename)) updates.cover_photo_url = row.cover_photo_url.replace(originalFilename, optimizedFilename);
      if (row.profile_image_url?.includes(originalFilename)) updates.profile_image_url = row.profile_image_url.replace(originalFilename, optimizedFilename);
      if (row.cover_image_url?.includes(originalFilename)) updates.cover_image_url = row.cover_image_url.replace(originalFilename, optimizedFilename);
      
      if (Object.keys(updates).length > 0) {
        await db.update(users).set(updates).where(eq(users.id, row.id));
        updatedCount++;
      }
    }

    // 2. Check explorerCards table
    const cardRows = await db.select().from(explorerCards).where(
      or(
        like(explorerCards.profileImageUrl, searchPattern),
        like(explorerCards.coverImageUrl, searchPattern)
      )
    );

    for (const row of cardRows) {
      const updates: any = {};
      if (row.profileImageUrl?.includes(originalFilename)) updates.profileImageUrl = row.profileImageUrl.replace(originalFilename, optimizedFilename);
      if (row.coverImageUrl?.includes(originalFilename)) updates.coverImageUrl = row.coverImageUrl.replace(originalFilename, optimizedFilename);
      
      if (Object.keys(updates).length > 0) {
        await db.update(explorerCards).set(updates).where(eq(explorerCards.id, row.id));
        updatedCount++;
      }
    }

    // 3. Check featuredProfiles table (JSONB column)
    const allProfiles = await db.select().from(featuredProfiles);
    for (const row of allProfiles) {
      let needsUpdate = false;
      const images: any = row.images ? JSON.parse(JSON.stringify(row.images)) : {};
      
      if (typeof images.avatar === 'string' && images.avatar.includes(originalFilename)) {
        images.avatar = images.avatar.replace(originalFilename, optimizedFilename);
        needsUpdate = true;
      } else if (images.avatar?.url?.includes(originalFilename)) {
        images.avatar.url = images.avatar.url.replace(originalFilename, optimizedFilename);
        needsUpdate = true;
      }

      if (typeof images.cover === 'string' && images.cover.includes(originalFilename)) {
        images.cover = images.cover.replace(originalFilename, optimizedFilename);
        needsUpdate = true;
      } else if (images.cover?.url?.includes(originalFilename)) {
        images.cover.url = images.cover.url.replace(originalFilename, optimizedFilename);
        needsUpdate = true;
      }

      if (Array.isArray(images.gallery)) {
        for (let i = 0; i < images.gallery.length; i++) {
          if (typeof images.gallery[i] === 'string' && images.gallery[i].includes(originalFilename)) {
            images.gallery[i] = images.gallery[i].replace(originalFilename, optimizedFilename);
            needsUpdate = true;
          } else if (images.gallery[i]?.url?.includes(originalFilename)) {
            images.gallery[i].url = images.gallery[i].url.replace(originalFilename, optimizedFilename);
            needsUpdate = true;
          }
        }
      }

      if (needsUpdate) {
        await db.update(featuredProfiles).set({ images }).where(eq(featuredProfiles.id, row.id));
        updatedCount++;
      }
    }

    console.info(`[heal-image] Healed ${originalFilename} -> ${optimizedFilename} across ${updatedCount} rows`);
    return NextResponse.json({ success: true, updatedCount });
  } catch (error) {
    console.error("Heal image error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
