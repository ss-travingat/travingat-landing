const fs = require('fs');
const content = fs.readFileSync('src/components/ui/TravingatBadge.tsx', 'utf-8');
const match = content.match(/const BADGE_SVG = `([\s\S]*?)`;/);
if (match) {
  let svg = match[1];
  let result = [];
  const regex = /<\/?([a-zA-Z0-9:]+)[^>]*>/g;
  let m;
  while ((m = regex.exec(svg)) !== null) {
      result.push(m[0]);
  }
  fs.writeFileSync('svg_tags.txt', result.map(t => {
      // return tag name and if it has id or data-figma
      let name = t.match(/<\/?([a-zA-Z0-9:]+)/)[1];
      let id = t.match(/id="([^"]+)"/);
      let data = t.match(/data-figma[^=]*="[^"]+"/);
      return `<${t.startsWith('</') ? '/' : ''}${name}${id ? ' id="'+id[1]+'"' : ''}${data ? ' ' + data[0] : ''}>`;
  }).join('\n'));
}
