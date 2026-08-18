import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

const COMPRESS_FILES = [
  "public/emails/hero-cover.png",
  "public/designsystem/figma/imgTraveler.png",
  "public/designsystem/figma/imgB.png",
  "public/designsystem/figma/img3.png",
  "public/designsystem/figma/img4.png"
];

async function main() {
  for (const relativePath of COMPRESS_FILES) {
    const fullPath = path.resolve(process.cwd(), relativePath);
    try {
      const stats = await fs.stat(fullPath);
      const originalSize = (stats.size / 1024).toFixed(2);
      
      const buffer = await fs.readFile(fullPath);
      
      // Compress the PNG
      const compressedBuffer = await sharp(buffer)
        .png({ quality: 60, compressionLevel: 9, effort: 10 })
        .toBuffer();
        
      await fs.writeFile(fullPath, compressedBuffer);
      const newSize = (compressedBuffer.length / 1024).toFixed(2);
      
      console.log(`Compressed ${relativePath}: ${originalSize}KB -> ${newSize}KB`);
    } catch (err) {
      console.error(`Error compressing ${relativePath}:`, err);
    }
  }
}

main().catch(console.error);
