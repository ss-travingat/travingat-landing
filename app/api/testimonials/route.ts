import testimonials from "@/data/testimonials.json";

export async function GET() {
  return Response.json(testimonials);
}
