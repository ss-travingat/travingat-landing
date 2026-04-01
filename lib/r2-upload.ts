import "server-only";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getLandingAssetsCdnBase } from "@/lib/landing-assets";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getR2Client(): { client: S3Client; bucketName: string } {
  const accountId = requireEnv("R2_ACCOUNT_ID");
  const accessKeyId = requireEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = requireEnv("R2_SECRET_ACCESS_KEY");
  const bucketName = requireEnv("R2_BUCKET_NAME");

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return { client, bucketName };
}

function contentTypeFromFileName(fileName: string, fallback = "application/octet-stream"): string {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".svg")) return "image/svg+xml";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".avif")) return "image/avif";
  return fallback;
}

export async function uploadLandingAsset(params: {
  fileBuffer: Buffer;
  keySuffix: string;
  contentType?: string;
}): Promise<{ key: string; url: string }> {
  const { fileBuffer, keySuffix, contentType } = params;
  const { client, bucketName } = getR2Client();

  const cleanSuffix = keySuffix.replace(/^\/+/, "");
  const objectKey = `landingpage-assets/${cleanSuffix}`;

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: fileBuffer,
      ContentType: contentType || contentTypeFromFileName(cleanSuffix),
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  const cdnBase = getLandingAssetsCdnBase();
  return {
    key: objectKey,
    url: `${cdnBase}/${cleanSuffix}`,
  };
}

/**
 * Upload a blog image to R2 under `landingpage-assets/blogs/`.
 */
export async function uploadBlogAsset(params: {
  fileBuffer: Buffer;
  fileName: string;
  contentType?: string;
}): Promise<{ key: string; url: string }> {
  const { fileBuffer, fileName, contentType } = params;
  const cleanName = fileName.replace(/^[\/]+/, "");
  return uploadLandingAsset({
    fileBuffer,
    keySuffix: `blogs/${cleanName}`,
    contentType,
  });
}
