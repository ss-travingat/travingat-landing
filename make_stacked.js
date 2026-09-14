const fs = require('fs');
const sharp = require('sharp');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const svg = fs.readFileSync('public/icons/travingat-logo-black.svg', 'utf8');
const paths = svg.match(/<path[\s\S]*?\/>/g);
const iconPaths = paths.slice(0, 5).join('\n');
const textPaths = paths.slice(5).join('\n');

const stackedSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="112" height="65" viewBox="0 0 112 65" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(41, 0)">
    ${iconPaths}
  </g>
  <g transform="translate(-38, 35)">
    ${textPaths}
  </g>
</svg>`;

fs.writeFileSync('public/icons/travingat-stacked-black.svg', stackedSvg);

async function run() {
  await sharp('public/icons/travingat-stacked-black.svg').png().toFile('public/icons/travingat-stacked-black.png');

  const accountId = process.env.R2_ACCOUNT_ID;
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });

  await client.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: "landingpage-assets/emails/travingat-stacked-black.png",
    Body: fs.readFileSync("public/icons/travingat-stacked-black.png"),
    ContentType: "image/png",
    CacheControl: "public, max-age=31536000, immutable",
  }));

  console.log("Uploaded stacked logo successfully!");
}

run().catch(console.error);
