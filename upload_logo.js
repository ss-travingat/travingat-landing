const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });

async function run() {
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

  const fileBuffer = fs.readFileSync("public/icons/travingat-logo.png");

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: "landingpage-assets/emails/travingat-logo.png",
      Body: fileBuffer,
      ContentType: "image/png",
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  console.log("Uploaded successfully to landingpage-assets/emails/travingat-logo.png");
}

run().catch(console.error);
