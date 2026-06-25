import { mkdir, readdir, copyFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, "src", "assets", "fonts", "inter-display");
const targetDir = path.join(root, "public", "inter-display");
const fontExtPattern = /\.(ttf|otf|woff|woff2)$/i;

async function main() {
  let entries;

  try {
    entries = await readdir(sourceDir, { withFileTypes: true });
  } catch {
    console.log("[fonts:sync] Source folder not found, skipping.");
    return;
  }

  const files = entries.filter((entry) => entry.isFile() && fontExtPattern.test(entry.name));

  if (files.length === 0) {
    console.log("[fonts:sync] No Inter Display font files found, skipping.");
    return;
  }

  await mkdir(targetDir, { recursive: true });

  for (const file of files) {
    const source = path.join(sourceDir, file.name);
    const target = path.join(targetDir, file.name);
    await copyFile(source, target);
  }

  console.log(`[fonts:sync] Copied ${files.length} font file(s) to public/inter-display.`);
}

main().catch((error) => {
  console.error("[fonts:sync] Failed to sync Inter Display fonts.", error);
  process.exitCode = 1;
});
