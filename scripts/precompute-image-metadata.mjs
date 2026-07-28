#!/usr/bin/env node
import fs from "fs";
import path from "path";
import sharp from "sharp";

const dataPath = path.join(process.cwd(), "src/features/profilepages/data/profiles.json");
const outPath = dataPath; // overwrite original with metadata

async function fetchBuffer(url) {
  try {
    if (url.startsWith("/")) {
      const localPath = path.join(process.cwd(), "public", url.replace(/^\//, ""));
      try {
        return await fs.promises.readFile(localPath);
      } catch (err) {
        // local file missing — skip and return null so we leave URL as-is
        return null;
      }
    }
    const res = await fetch(url);
    if (!res.ok) return null;
    const ab = await res.arrayBuffer();
    return Buffer.from(ab);
  } catch (err) {
    return null;
  }
}

async function measureUrl(url) {
  const buf = await fetchBuffer(url);
  if (!buf) return null;
  try {
    const meta = await sharp(buf).metadata();
    return { width: meta.width || null, height: meta.height || null };
  } catch (err) {
    return null;
  }
}

async function main() {
  const raw = fs.readFileSync(dataPath, "utf8");
  const profiles = JSON.parse(raw);

  for (const profile of profiles) {
    // cover and avatar
    for (const key of ["cover", "avatar"]) {
      const url = profile.images?.[key];
      if (typeof url === "string") {
        const m = await measureUrl(url);
        if (m && m.width && m.height) profile.images[key] = { url, width: m.width, height: m.height };
      }
    }

    // gallery
    if (Array.isArray(profile.images?.gallery)) {
      const out = [];
      for (const img of profile.images.gallery) {
        if (typeof img === "string") {
          const m = await measureUrl(img);
          out.push(m && m.width && m.height ? { url: img, width: m.width, height: m.height } : img);
        } else {
          out.push(img);
        }
      }
      profile.images.gallery = out;
    }

    // countryImages
    if (Array.isArray(profile.countryImages)) {
      for (const c of profile.countryImages) {
        if (!Array.isArray(c.images)) continue;
        const out = [];
        for (const img of c.images) {
          if (typeof img === "string") {
            const m = await measureUrl(img);
            out.push(m && m.width && m.height ? { url: img, width: m.width, height: m.height } : img);
          } else {
            out.push(img);
          }
        }
        c.images = out;
      }
    }

    // collectionImages
    if (Array.isArray(profile.collectionImages)) {
      for (const col of profile.collectionImages) {
        if (!Array.isArray(col.images)) continue;
        const out = [];
        for (const img of col.images) {
          if (typeof img === "string") {
            const m = await measureUrl(img);
            out.push(m && m.width && m.height ? { url: img, width: m.width, height: m.height } : img);
          } else {
            out.push(img);
          }
        }
        col.images = out;
      }
    }
  }

  fs.writeFileSync(outPath, JSON.stringify(profiles, null, 2), "utf8");
  console.log("Wrote metadata to", outPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
