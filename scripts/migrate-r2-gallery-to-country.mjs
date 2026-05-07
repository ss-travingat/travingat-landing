/**
 * Reads profiles.json from R2, migrates gallery images → home country bucket,
 * then writes the result back to R2.
 *
 * Run with: node --env-file=.env.local scripts/migrate-r2-gallery-to-country.mjs
 */

import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

const R2_KEY = "landingpage-assets/data/profiles.json";

function getR2Client() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    throw new Error("Missing R2 environment variables. Use: node --env-file=.env.local ...");
  }

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  return { client, bucketName };
}

async function readProfiles() {
  const { client, bucketName } = getR2Client();
  const res = await client.send(new GetObjectCommand({ Bucket: bucketName, Key: R2_KEY }));
  const body = await res.Body.transformToString("utf-8");
  return JSON.parse(body);
}

async function writeProfiles(profiles) {
  const { client, bucketName } = getR2Client();
  await client.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: R2_KEY,
    Body: JSON.stringify(profiles, null, 2),
    ContentType: "application/json",
    CacheControl: "no-cache",
  }));
}

const profiles = await readProfiles();
console.log(`Read ${profiles.length} profiles from R2.\n`);

let totalMoved = 0;

const updated = profiles.map((profile) => {
  const galleryImages = profile.images?.gallery ?? [];
  if (galleryImages.length === 0) return profile;

  const targetCode = profile.flagCode;
  if (!targetCode) {
    console.warn(`  [SKIP] Profile ${profile.id} (${profile.name}) — no flagCode`);
    return profile;
  }

  let countryImages = profile.countryImages ? [...profile.countryImages] : [];
  const existingIdx = countryImages.findIndex((c) => c.countryCode === targetCode);

  if (existingIdx >= 0) {
    const existing = new Set(countryImages[existingIdx].images);
    const toAdd = galleryImages.filter((u) => !existing.has(u));
    countryImages[existingIdx] = {
      ...countryImages[existingIdx],
      images: [...countryImages[existingIdx].images, ...toAdd],
    };
    totalMoved += toAdd.length;
    if (toAdd.length > 0) {
      console.log(`  [${profile.id}] ${profile.name}: moved ${toAdd.length} image(s) → ${targetCode}`);
    } else {
      console.log(`  [${profile.id}] ${profile.name}: all gallery images already in ${targetCode}, skipping`);
    }
  } else {
    countryImages = [{ countryCode: targetCode, images: galleryImages }, ...countryImages];
    totalMoved += galleryImages.length;
    console.log(`  [${profile.id}] ${profile.name}: created country ${targetCode} with ${galleryImages.length} image(s)`);
  }

  return {
    ...profile,
    images: { ...profile.images, gallery: [] },
    countryImages,
  };
});

console.log(`\nWriting ${updated.length} profiles back to R2...`);
await writeProfiles(updated);
console.log(`✓ Done. Moved ${totalMoved} images total.`);
