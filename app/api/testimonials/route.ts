import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/testimonials.json");

function readTestimonials() {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeTestimonials(data: unknown[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// GET — return all testimonials
export async function GET() {
  try {
    const testimonials = readTestimonials();
    return NextResponse.json(testimonials);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

// POST — add a new testimonial
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, location, quote, photo, socials } = body;

    if (!name || !quote) {
      return NextResponse.json(
        { error: "Name and quote are required" },
        { status: 400 }
      );
    }

    const testimonials = readTestimonials();
    const newId = String(
      Math.max(0, ...testimonials.map((t: { id: string }) => Number(t.id))) + 1
    );

    const newTestimonial = {
      id: newId,
      name,
      location: location || "",
      quote,
      photo: photo || "/testimonial-photo.png",
      socials: {
        instagram: socials?.instagram || "",
        tiktok: socials?.tiktok || "",
        linkedin: socials?.linkedin || "",
      },
    };

    testimonials.push(newTestimonial);
    writeTestimonials(testimonials);

    return NextResponse.json(newTestimonial, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
