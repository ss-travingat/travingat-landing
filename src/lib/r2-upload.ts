import "server-only";

import {
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getLandingAssetsCdnBase } from "@/lib/landing-assets";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getR2Client(bucketOverride?: string, accountIdOverride?: string): { client: S3Client; bucketName: string } {
  const accountId = accountIdOverride || requireEnv("R2_ACCOUNT_ID");
  const accessKeyId = requireEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = requireEnv("R2_SECRET_ACCESS_KEY");
  const bucketName = bucketOverride || requireEnv("R2_BUCKET_NAME");

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
 * Generate a presigned URL for direct upload to R2 from the browser.
 */
export async function generatePresignedUrl(params: {
  keySuffix: string;
  contentType: string;
}): Promise<{ uploadUrl: string; publicUrl: string }> {
  const { keySuffix, contentType } = params;
  const { client, bucketName } = getR2Client();

  const cleanSuffix = keySuffix.replace(/^\/+/, "");
  const objectKey = `landingpage-assets/${cleanSuffix}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
  });

  // URL expires in 15 minutes
  // @ts-expect-error aws-sdk version mismatch workaround
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 900 });
  const cdnBase = getLandingAssetsCdnBase();

  return {
    uploadUrl,
    publicUrl: `${cdnBase}/${cleanSuffix}`,
  };
}

/**
 * Generate a presigned URL for direct upload to R2 explorercard bucket from the browser.
 */
export async function uploadExplorerCardAsset(params: {
  fileBuffer: Buffer;
  fileName: string;
  contentType?: string;
  userId: string;
}): Promise<{ key: string; url: string }> {
  const { fileBuffer, fileName, contentType, userId } = params;
  const cleanName = fileName.replace(/^[\/]+/, "");
  return uploadLandingAsset({
    fileBuffer,
    keySuffix: `explorercard/users/${userId}/${cleanName}`,
    contentType,
  });
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

/**
 * Upload a profile image to R2 under `landingpage-assets/profiles/`.
 */
export async function uploadProfileAsset(params: {
  fileBuffer: Buffer;
  fileName: string;
  contentType?: string;
}): Promise<{ key: string; url: string }> {
  const { fileBuffer, fileName, contentType } = params;
  const cleanName = fileName.replace(/^[\/]+/, "");
  return uploadLandingAsset({
    fileBuffer,
    keySuffix: `profiles/${cleanName}`,
    contentType,
  });
}

/**
 * Read a JSON file from R2.
 */
export async function readJsonFromR2<T>(objectKey: string): Promise<T> {
  const { client, bucketName } = getR2Client();
  const res = await client.send(
    new GetObjectCommand({ Bucket: bucketName, Key: objectKey })
  );
  const body = await res.Body!.transformToString("utf-8");
  return JSON.parse(body) as T;
}

/**
 * Write a JSON file to R2.
 */
export async function writeJsonToR2(
  objectKey: string,
  data: unknown
): Promise<void> {
  const { client, bucketName } = getR2Client();
  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: JSON.stringify(data, null, 2),
      ContentType: "application/json",
      CacheControl: "no-cache",
    })
  );
}

/**
 * List all object keys under a given prefix in R2.
 */
export async function listR2Objects(prefix: string): Promise<{ key: string; size: number; lastModified: Date }[]> {
  const { client, bucketName } = getR2Client();
  const results: { key: string; size: number; lastModified: Date }[] = [];
  let continuationToken: string | undefined;

  do {
    const res = await client.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: prefix,
        ContinuationToken: continuationToken,
        MaxKeys: 1000,
      })
    );

    for (const obj of res.Contents ?? []) {
      if (obj.Key) {
        results.push({
          key: obj.Key,
          size: obj.Size ?? 0,
          lastModified: obj.LastModified ?? new Date(),
        });
      }
    }

    continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (continuationToken);

  return results;
}

/**
 * Delete objects from R2 by key.
 */
export async function deleteR2Objects(keys: string[]): Promise<number> {
  const { client, bucketName } = getR2Client();
  let deleted = 0;

  for (const key of keys) {
    await client.send(
      new DeleteObjectCommand({ Bucket: bucketName, Key: key })
    );
    deleted++;
  }

  return deleted;
}
