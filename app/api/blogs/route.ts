import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/blogs.json");

export interface BlogPost {
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

function readBlogs(): BlogPost[] {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeBlogs(data: BlogPost[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// GET — return all blogs (optionally filter by slug)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const blogs = readBlogs();

    if (slug) {
      const blog = blogs.find((b) => b.slug === slug);
      if (!blog) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }
      return NextResponse.json(blog);
    }

    // Sort by publishedAt descending
    blogs.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    return NextResponse.json(blogs);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

// POST — add a new blog
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, coverImage, content, author, tags, readTime } =
      body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const blogs = readBlogs();

    // Auto-generate slug if not provided
    const generatedSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    // Check for duplicate slug
    if (blogs.some((b) => b.slug === generatedSlug)) {
      return NextResponse.json(
        { error: "A blog with this slug already exists" },
        { status: 409 }
      );
    }

    const newId = String(
      Math.max(0, ...blogs.map((b) => Number(b.id))) + 1
    );

    const newBlog: BlogPost = {
      id: newId,
      title,
      slug: generatedSlug,
      excerpt: excerpt || "",
      coverImage: coverImage || "/testimonial-photo.png",
      content,
      author: author || "Travingat Team",
      publishedAt: new Date().toISOString(),
      tags: tags || [],
      readTime: readTime || Math.ceil(content.replace(/<[^>]*>/g, "").split(/\s+/).length / 200),
    };

    blogs.push(newBlog);
    writeBlogs(blogs);

    return NextResponse.json(newBlog, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
