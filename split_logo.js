const fs = require('fs');
const sharp = require('sharp');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const svg = fs.readFileSync('public/icons/travingat-logo-black.svg', 'utf8');

const paths = svg.match(/<path[\s\S]*?\/>/g);
const iconPaths = paths.slice(0, 5).join('\n');
const textPaths = paths.slice(5).join('\n');

const iconSvg = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
${iconPaths}
</svg>`;

const textSvg = `<svg width="112" height="30" viewBox="38 0 112 30" fill="none" xmlns="http://www.w3.org/2000/svg">
${textPaths}
</svg>`;

fs.writeFileSync('public/icons/travingat-icon-black.svg', iconSvg);
fs.writeFileSync('public/icons/travingat-text-black.svg', textSvg);

async function run() {
  await sharp('public/icons/travingat-icon-black.svg').png().toFile('public/icons/travingat-icon-black.png');
  await sharp('public/icons/travingat-text-black.svg').png().toFile('public/icons/travingat-text-black.png');

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
    Key: "landingpage-assets/emails/travingat-icon-black.png",
    Body: fs.readFileSync("public/icons/travingat-icon-black.png"),
    ContentType: "image/png",
    CacheControl: "public, max-age=31536000, immutable",
  }));

  await client.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: "landingpage-assets/emails/travingat-text-black.png",
    Body: fs.readFileSync("public/icons/travingat-text-black.png"),
    ContentType: "image/png",
    CacheControl: "public, max-age=31536000, immutable",
  }));

  console.log("Uploaded both parts successfully!");
}

run().catch(console.error);
