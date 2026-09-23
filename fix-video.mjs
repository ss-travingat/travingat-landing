import fs from 'fs';
import path from 'path';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let newContent = content.replace(/<video\s+([^>]*?)originalSrc=/g, '<video $1data-original-src=');
  newContent = newContent.replace(/<video\s*[\n\r]+\s*originalSrc=/g, '<video\n                              data-original-src=');

  // also fix where originalSrc is on the line below
  let lines = newContent.split('\n');
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].includes('<video')) {
      if (lines[i + 1].includes('originalSrc=')) {
        lines[i + 1] = lines[i + 1].replace('originalSrc=', 'data-original-src=');
      }
    }
  }
  newContent = lines.join('\n');

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log(`Fixed ${filePath}`);
  }
}

function traverseDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  });
}

traverseDir('./src/features');
