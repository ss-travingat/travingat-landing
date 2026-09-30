import fs from 'fs';

// 1. Fix DesktopCountriesPopup
let desktopContent = fs.readFileSync('src/components/ui/DesktopCountriesPopup.tsx', 'utf-8');

// Replace the problematic classes and add style
desktopContent = desktopContent.replace(
  `className="fixed left-[50%] top-[50%] z-[999] flex w-full max-w-[400px] max-h-[85vh] translate-x-[-50%] translate-y-[-50%] flex-col overflow-hidden rounded-[24px] bg-[#111111] border border-white/5 shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"`,
  `className="fixed left-[50%] top-[50%] z-[999] flex w-full max-w-[400px] max-h-[85vh] flex-col overflow-hidden rounded-[24px] bg-[#111111] border border-white/5 shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          style={{ transform: 'translate(-50%, -50%)' }}`
);

// Add keyframes for animation since tailwindcss-animate is missing
const keyframes = `
        <style dangerouslySetInnerHTML={{__html: \`
          @keyframes fadeInDesktop { from { opacity: 0; transform: translate(-50%, -48%) scale(0.95); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
          @keyframes fadeOutDesktop { from { opacity: 1; transform: translate(-50%, -50%) scale(1); } to { opacity: 0; transform: translate(-50%, -48%) scale(0.95); } }
          .animate-in { animation: fadeInDesktop 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .animate-out { animation: fadeOutDesktop 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        \`}} />
`;
desktopContent = desktopContent.replace(
  `<Dialog.Portal>`,
  `<Dialog.Portal>${keyframes}`
);

fs.writeFileSync('src/components/ui/DesktopCountriesPopup.tsx', desktopContent);

// 2. Fix CountriesPopup
let mobileContent = fs.readFileSync('src/components/ui/CountriesPopup.tsx', 'utf-8');

mobileContent = mobileContent.replace(
  `className="fixed bottom-0 left-0 right-0 z-50 flex w-full flex-col outline-none data-[state=open]:animate-dialog-content-open data-[state=closed]:animate-dialog-content-closed md:bottom-auto md:left-[50%] md:top-[50%] md:w-full md:max-w-[400px] md:-translate-x-1/2 md:-translate-y-1/2 md:data-[state=open]:animate-dialog-desktop-open md:data-[state=closed]:animate-dialog-desktop-closed"`,
  `className="fixed bottom-0 left-0 right-0 z-50 flex w-full flex-col outline-none md:bottom-auto md:left-[50%] md:top-[50%] md:w-full md:max-w-[400px]"\n          style={{ ...fontRenderingStyles, transform: typeof window !== 'undefined' && window.innerWidth >= 768 ? 'translate(-50%, -50%)' : 'none' }}`
);

mobileContent = mobileContent.replace(
  `          style={fontRenderingStyles}`,
  `` // we merged it into the class above
);

const mobileKeyframes = `
        <style dangerouslySetInnerHTML={{__html: \`
          @keyframes slideUpMobile { from { transform: translateY(100%); } to { transform: translateY(0); } }
          @keyframes slideDownMobile { from { transform: translateY(0); } to { transform: translateY(100%); } }
          @keyframes fadeInMobile { from { opacity: 0; } to { opacity: 1; } }
          @keyframes fadeOutMobile { from { opacity: 1; } to { opacity: 0; } }
          @media (max-width: 767px) {
            .data\\\\[state\\\\=open\\\\]\\\\:animate-dialog-content-open[data-state="open"] > div { animation: slideUpMobile 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards; }
            .data\\\\[state\\\\=closed\\\\]\\\\:animate-dialog-content-closed[data-state="closed"] > div { animation: slideDownMobile 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards; }
          }
          @media (min-width: 768px) {
            @keyframes fadeInDesktopPop { from { opacity: 0; transform: translate(-50%, -48%) scale(0.95); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
            @keyframes fadeOutDesktopPop { from { opacity: 1; transform: translate(-50%, -50%) scale(1); } to { opacity: 0; transform: translate(-50%, -48%) scale(0.95); } }
            [data-state="open"].md\\\\[left-\\\\[50\\\\%\\\\]\\\\] { animation: fadeInDesktopPop 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards !important; }
            [data-state="closed"].md\\\\[left-\\\\[50\\\\%\\\\]\\\\] { animation: fadeOutDesktopPop 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards !important; }
          }
        \`}} />
`;
mobileContent = mobileContent.replace(
  `<Dialog.Portal>`,
  `<Dialog.Portal>${mobileKeyframes}`
);

fs.writeFileSync('src/components/ui/CountriesPopup.tsx', mobileContent);
