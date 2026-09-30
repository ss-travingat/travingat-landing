import fs from 'fs';

let mobileContent = fs.readFileSync('src/components/ui/CountriesPopup.tsx', 'utf-8');

mobileContent = mobileContent.replace(
  `style={{ ...fontRenderingStyles, transform: typeof window !== 'undefined' && window.innerWidth >= 768 ? 'translate(-50%, -50%)' : 'none' }}`,
  `style={{ ...fontRenderingStyles }}`
);

// We add a custom class `md-center-popup` and define it in the style block
mobileContent = mobileContent.replace(
  `className="fixed bottom-0 left-0 right-0 z-50 flex w-full flex-col outline-none md:bottom-auto md:left-[50%] md:top-[50%] md:w-full md:max-w-[400px]"`,
  `className="fixed bottom-0 left-0 right-0 z-50 flex w-full flex-col outline-none md:bottom-auto md:left-[50%] md:top-[50%] md:w-full md:max-w-[400px] md-center-popup"`
);

mobileContent = mobileContent.replace(
  `@media (min-width: 768px) {`,
  `@media (min-width: 768px) {\n            .md-center-popup { transform: translate(-50%, -50%); }`
);

fs.writeFileSync('src/components/ui/CountriesPopup.tsx', mobileContent);
