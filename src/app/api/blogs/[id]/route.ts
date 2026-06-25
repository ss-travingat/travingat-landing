import { NextResponse } from "next/server";
import { normalizeAssetHtml, toLandingAssetUrl } from "@/lib/landing-assets";
import {
  readBlogsFromStorage,
  type StoredBlogPost,
  writeBlogsToStorage,
} from "@/lib/blog-storage";

interface BlogPost extends StoredBlogPost {
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

// PUT — update a blog
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const blogs = await readBlogsFromStorage();
    const index = blogs.findIndex((b) => b.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    blogs[index] = {
      ...blogs[index],
      title: body.title ?? blogs[index].title,
      slug: body.slug ?? blogs[index].slug,
      excerpt: body.excerpt ?? blogs[index].excerpt,
      coverImage: toLandingAssetUrl(body.coverImage ?? blogs[index].coverImage),
      content: normalizeAssetHtml(body.content ?? blogs[index].content),
      author: body.author ?? blogs[index].author,
      tags: body.tags ?? blogs[index].tags,
      readTime: body.readTime ?? blogs[index].readTime,
    };

    await writeBlogsToStorage(blogs);
    return NextResponse.json(normalizeBlog(blogs[index]));
  } catch {
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

// DELETE — remove a blog
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blogs = await readBlogsFromStorage();
    const filtered = blogs.filter((b) => b.id !== id);

    if (filtered.length === blogs.length) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    await writeBlogsToStorage(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
