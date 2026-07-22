const fs = require('fs');
const path = 'src/features/profilepages/components/ProfileComponent.tsx';
let code = fs.readFileSync(path, 'utf8');

// The block to start wrapping is at:
// {/* Desktop: pill tabs with text */}
// <div className="hidden min-[811px]:flex items-center justify-center gap-2 flex-wrap">
const startIndex = code.indexOf('{/* Desktop: pill tabs with text */}');

// The block ends at the end of the main tag.
const mainEndIndex = code.lastIndexOf('</main>');

if (startIndex !== -1 && mainEndIndex !== -1) {
  const before = code.substring(0, startIndex);
  const toWrap = code.substring(startIndex, mainEndIndex);
  const after = code.substring(mainEndIndex);
  
  // Wrap the content in a div with flex-col and gap-10 (to match main's gap)
  const wrapped = `<div className="flex flex-col w-full gap-10">\n          ${toWrap.trimEnd()}\n        </div>\n        `;
  
  fs.writeFileSync(path, before + wrapped + after);
  console.log('Successfully wrapped tabs and content!');
} else {
  console.log('Could not find start or end markers.');
}
