const fs = require('fs');
const files = [
  'src/features/profilepages/components/ProfileComponent.tsx',
  'src/features/profilepages/components/CountryDetailComponent.tsx',
  'src/features/profilepages/components/CollectionDetailComponent.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/router\.replace\(url\.toString\(\), \{ scroll: false \}\);/g, 'router.replace(url.pathname + url.search, { scroll: false });');
  fs.writeFileSync(file, content);
  console.log(`Fixed ${file}`);
}
