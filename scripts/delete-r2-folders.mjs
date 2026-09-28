import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET_NAME;

const client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

async function deletePrefix(prefix) {
  let isTruncated = true;
  let continuationToken = undefined;

  console.log(`Deleting objects with prefix: ${prefix}`);

  while (isTruncated) {
    const listResponse = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      })
    );

    if (!listResponse.Contents || listResponse.Contents.length === 0) {
      console.log(`No objects found for prefix: ${prefix}`);
      break;
    }

    const deleteParams = {
      Bucket: bucket,
      Delete: {
        Objects: listResponse.Contents.map((item) => ({ Key: item.Key })),
        Quiet: false,
      },
    };

    const deleteResponse = await client.send(new DeleteObjectsCommand(deleteParams));
    console.log(`Deleted ${deleteResponse.Deleted.length} objects.`);

    isTruncated = listResponse.IsTruncated;
    continuationToken = listResponse.NextContinuationToken;
  }
}

async function main() {
  await deletePrefix("landingpage-assets/flags/");
  await deletePrefix("landingpage-assets/inter-display/");
  console.log("Done deleting.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
