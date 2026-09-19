import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function run() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    throw new Error("Missing credentials");
  }

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    forcePathStyle: true,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  console.log("Fetching image from Figma MCP...");
  const res = await fetch("http://localhost:3845/assets/d0873379a495a1faa40d5e1911ad7fbed65c4077.png");
  if (!res.ok) throw new Error("Failed to fetch image");
  const buffer = Buffer.from(await res.arrayBuffer());
  
  console.log("Uploading to R2...");
  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: "landingpage-assets/emails/founding-explorer-hero.png",
      Body: buffer,
      ContentType: "image/png",
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
  
  console.log("Upload successful!");
  console.log("URL: https://cdn.travingat.com/landingpage-assets/emails/founding-explorer-hero.png");
}

run().catch(console.error);
