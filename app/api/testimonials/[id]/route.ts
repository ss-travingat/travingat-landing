import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/testimonials.json");

interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  photo: string;
  socials: {
    instagram: string;
    tiktok: string;
    linkedin: string;
  };
}

function readTestimonials(): Testimonial[] {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeTestimonials(data: Testimonial[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// PUT — update a testimonial
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const testimonials = readTestimonials();
    const index = testimonials.findIndex((t) => t.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    testimonials[index] = {
      ...testimonials[index],
      name: body.name ?? testimonials[index].name,
      location: body.location ?? testimonials[index].location,
      quote: body.quote ?? testimonials[index].quote,
      photo: body.photo ?? testimonials[index].photo,
      socials: {
        instagram:
          body.socials?.instagram ?? testimonials[index].socials.instagram,
        tiktok: body.socials?.tiktok ?? testimonials[index].socials.tiktok,
        linkedin:
          body.socials?.linkedin ?? testimonials[index].socials.linkedin,
      },
    };

    writeTestimonials(testimonials);
    return NextResponse.json(testimonials[index]);
  } catch {
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

// DELETE — remove a testimonial
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const testimonials = readTestimonials();
    const filtered = testimonials.filter((t) => t.id !== id);

    if (filtered.length === testimonials.length) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    writeTestimonials(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
