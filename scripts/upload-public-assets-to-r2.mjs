import fs from "node:fs";
import path from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const PREFIX = "landingpage-assets";

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function contentTypeFor(filePath) {
  const lower = filePath.toLowerCase();
  if (lower.endsWith(".svg")) return "image/svg+xml";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".avif")) return "image/avif";
  return "application/octet-stream";
}

function walkFiles(dir, result = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(absolutePath, result);
      continue;
    }
    result.push(absolutePath);
  }
  return result;
}

async function main() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    throw new Error(`public directory not found: ${PUBLIC_DIR}`);
  }

  const accountId = requiredEnv("R2_ACCOUNT_ID");
  const accessKeyId = requiredEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = requiredEnv("R2_SECRET_ACCESS_KEY");
  const bucket = requiredEnv("R2_BUCKET_NAME");
  const publicBase = (process.env.R2_PUBLIC_URL || "https://cdn.travingat.com").replace(/\/+$/, "");

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  const files = walkFiles(PUBLIC_DIR);
  if (files.length === 0) {
    console.log("No files found in public directory.");
    return;
  }

  console.log(`Uploading ${files.length} assets to r2://${bucket}/${PREFIX}/ ...`);

  let uploaded = 0;
  for (const file of files) {
    const relative = path.relative(PUBLIC_DIR, file).split(path.sep).join("/");
    const key = `${PREFIX}/${relative}`;
    const body = fs.readFileSync(file);

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentTypeFor(file),
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    uploaded += 1;
    if (uploaded % 25 === 0 || uploaded === files.length) {
      console.log(`Uploaded ${uploaded}/${files.length}`);
    }
  }

  console.log("Upload complete.");
  console.log(`CDN base: ${publicBase}/${PREFIX}/`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
