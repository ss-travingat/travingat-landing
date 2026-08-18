import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

async function main() {
  const svgPath = path.resolve(process.cwd(), "public/designsystem/figma/imgEdit.svg");
  const pngPath = path.resolve(process.cwd(), "public/designsystem/figma/imgEdit.png");
  
  const buffer = await fs.readFile(svgPath);
  await sharp(buffer).png().toFile(pngPath);
  console.log("Converted SVG to PNG!");
}

main().catch(console.error);
