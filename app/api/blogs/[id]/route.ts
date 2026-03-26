import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/blogs.json");

interface BlogPost {
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

// PUT — update a blog
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const blogs = readBlogs();
    const index = blogs.findIndex((b) => b.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    blogs[index] = {
      ...blogs[index],
      title: body.title ?? blogs[index].title,
      slug: body.slug ?? blogs[index].slug,
      excerpt: body.excerpt ?? blogs[index].excerpt,
      coverImage: body.coverImage ?? blogs[index].coverImage,
      content: body.content ?? blogs[index].content,
      author: body.author ?? blogs[index].author,
      tags: body.tags ?? blogs[index].tags,
      readTime: body.readTime ?? blogs[index].readTime,
    };

    writeBlogs(blogs);
    return NextResponse.json(blogs[index]);
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
    const blogs = readBlogs();
    const filtered = blogs.filter((b) => b.id !== id);

    if (filtered.length === blogs.length) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    writeBlogs(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
