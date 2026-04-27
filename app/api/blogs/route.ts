import { NextResponse } from "next/server";
import { normalizeAssetHtml, toLandingAssetUrl } from "@/lib/landing-assets";
import {
  readBlogsFromStorage,
  type StoredBlogPost,
  writeBlogsToStorage,
} from "@/lib/blog-storage";

export interface BlogPost extends StoredBlogPost {
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

function normalizeBlog(blog: BlogPost): BlogPost {
  return {
    ...blog,
    coverImage: toLandingAssetUrl(blog.coverImage),
    content: normalizeAssetHtml(blog.content),
  };
}


// GET — return all blogs (optionally filter by slug)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const blogs = await readBlogsFromStorage();

    if (slug) {
      const blog = blogs.find((b) => b.slug === slug);
      if (!blog) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }
      return NextResponse.json(normalizeBlog(blog));
    }

    // Sort by publishedAt descending
    blogs.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    return NextResponse.json(blogs.map(normalizeBlog));
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

    const blogs = await readBlogsFromStorage();

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
      coverImage: toLandingAssetUrl(coverImage || "/images/testimonial-photo-figma.png"),
      content,
      author: author || "Travingat Team",
      publishedAt: new Date().toISOString(),
      tags: tags || [],
      readTime: readTime || Math.ceil(content.replace(/<[^>]*>/g, "").split(/\s+/).length / 200),
    };

    blogs.push(newBlog);
    await writeBlogsToStorage(blogs);

    return NextResponse.json(normalizeBlog(newBlog), { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
