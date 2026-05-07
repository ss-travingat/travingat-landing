import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const profilesPath = resolve(__dirname, "../profiles/profiles.json");

const profiles = JSON.parse(readFileSync(profilesPath, "utf-8"));

let totalMoved = 0;

const updated = profiles.map((profile) => {
  const galleryImages = profile.images?.gallery ?? [];
  if (galleryImages.length === 0) return profile;

  // Target country: use flagCode (home country) as the bucket
  const targetCode = profile.flagCode;
  if (!targetCode) {
    console.warn(`  [SKIP] Profile ${profile.id} (${profile.name}) has no flagCode — skipping`);
    return profile;
  }

  // Find existing country entry or create one
  let countryImages = profile.countryImages ? [...profile.countryImages] : [];
  const existingIdx = countryImages.findIndex((c) => c.countryCode === targetCode);

  if (existingIdx >= 0) {
    // Append gallery images, avoiding duplicates
    const existing = new Set(countryImages[existingIdx].images);
    const toAdd = galleryImages.filter((u) => !existing.has(u));
    countryImages[existingIdx] = {
      ...countryImages[existingIdx],
      images: [...countryImages[existingIdx].images, ...toAdd],
    };
    totalMoved += toAdd.length;
    console.log(`  [${profile.id}] ${profile.name}: moved ${toAdd.length} images → ${targetCode}`);
  } else {
    // Create new country entry
    countryImages = [{ countryCode: targetCode, images: galleryImages }, ...countryImages];
    totalMoved += galleryImages.length;
    console.log(`  [${profile.id}] ${profile.name}: created country ${targetCode} with ${galleryImages.length} images`);
  }

  return {
    ...profile,
    images: {
      ...profile.images,
      gallery: [], // clear the standalone gallery
    },
    countryImages,
  };
});

writeFileSync(profilesPath, JSON.stringify(updated, null, 2));
console.log(`\n✓ Done. Moved ${totalMoved} images total across ${profiles.length} profiles.`);
