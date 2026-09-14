const fs = require('fs');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
const sharp = require('sharp');

dotenv.config({ path: ".env.local" });

async function run() {
  const originalSvg = fs.readFileSync('public/icons/travingat-logo.svg', 'utf8');
  const blackSvg = originalSvg.replace(/fill="white"/g, 'fill="#161616"');
  fs.writeFileSync('public/icons/travingat-logo-black.svg', blackSvg);
  
  await sharp('public/icons/travingat-logo-black.svg')
    .png()
    .toFile('public/icons/travingat-logo-black.png');

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    forcePathStyle: true,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const fileBuffer = fs.readFileSync("public/icons/travingat-logo-black.png");

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: "landingpage-assets/emails/travingat-logo-black.png",
      Body: fileBuffer,
      ContentType: "image/png",
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  console.log("Uploaded successfully to landingpage-assets/emails/travingat-logo-black.png");
}

run().catch(console.error);
