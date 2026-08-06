import { NextResponse } from "next/server";

export async function GET() {
  try {
    const imported = await import("sharp");
    const sharp = imported.default || imported;
    
    // Test if sharp actually works by creating a 1x1 buffer
    const buf = await sharp({
      create: { width: 1, height: 1, channels: 4, background: { r: 255, g: 0, b: 0, alpha: 1 } }
    }).webp().toBuffer();
    
    return NextResponse.json({ success: true, size: buf.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message });
  }
}
