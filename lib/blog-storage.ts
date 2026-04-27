import fs from "fs";
import path from "path";

import { readJsonFromR2, writeJsonToR2 } from "@/lib/r2-upload";

const LOCAL_BLOGS_PATH = path.join(process.cwd(), "src/data/blogs.json");
const BLOGS_R2_KEY = process.env.R2_BLOGS_JSON_KEY || "landingpage-assets/data/blogs.json";

export interface StoredBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  content: string;
  author: string;
  publishedAt: string;
  tags: string[];
  readTime: number;
}

function hasR2Config() {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET_NAME
  );
}

function readLocalBlogs(): StoredBlogPost[] {
  const raw = fs.readFileSync(LOCAL_BLOGS_PATH, "utf-8");
  return JSON.parse(raw) as StoredBlogPost[];
}

function writeLocalBlogs(data: StoredBlogPost[]) {
  fs.writeFileSync(LOCAL_BLOGS_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function isMissingObjectError(error: unknown) {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    error.name === "NoSuchKey" ||
    message.includes("nosuchkey") ||
    message.includes("not found") ||
    message.includes("the specified key does not exist")
  );
}

export async function readBlogsFromStorage(): Promise<StoredBlogPost[]> {
  const useR2 = hasR2Config();

  if (!useR2) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("R2 is not configured for blog storage in production.");
    }
    return readLocalBlogs();
  }

  try {
    const data = await readJsonFromR2<StoredBlogPost[]>(BLOGS_R2_KEY);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (!isMissingObjectError(error)) throw error;

    const seeded = readLocalBlogs();
    await writeJsonToR2(BLOGS_R2_KEY, seeded);
    return seeded;
  }
}

export async function writeBlogsToStorage(data: StoredBlogPost[]): Promise<void> {
  const useR2 = hasR2Config();

  if (!useR2) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("R2 is not configured for blog storage in production.");
    }
    writeLocalBlogs(data);
    return;
  }

  await writeJsonToR2(BLOGS_R2_KEY, data);
}
