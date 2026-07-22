# Handoff Document

## User Instructions Track Record
- 2026-07-22: "create a a mobileprofile.tsx component for mobile breakpoint all the mobile breakpoint code and changes to it and also create a handoff.md file that keeps a track of the isntructions I give and my coding and prompting style update it after every prompt"
- 2026-07-22: "create mobile breakpoint like from this figma https://www.figma.com/design/akF49LpNU6mvr6q2J14zVR/Travingat?node-id=13547-48712&m=dev strictly double check the padding, and radius, font, font weight, font size"
- 2026-07-22: "the navabar and cover image part is not matching if you see the image which is from figma design the navbar on mobile breakpoint is transparent and is on top of cover image"
- 2026-07-22: "on sides i see lot of space and it should be responsive based on the screen width"
- 2026-07-22: "make the navbar fixed and also add a top to bottom gradient bg to navabar that goes from black to transparent"
- 2026-07-22: "remove black bg for navabra button and when scrolled past 24px mak navbar bg solid black"
- 2026-07-22: "On few mobile screen I see more gap on seides of cover image and make sure cover image corner radius is 16px"
- 2026-07-22: "also make the browser color to black when this application is being used"
- 2026-07-22: "the current web is not matching the section where contry, media and collection count... use the same shade and try to extract and reuse the exact icons from figma and on the desktop if you check on hover on image we show the flag of te country on top right as there will be no hover action on mobile breakpoint alwasys show country flag on top of image"
- 2026-07-22: "stats container bg color should be Shades/Black/900"
- 2026-07-22: "change tab icons, extract it from Figma... store them in a icons folder or where ever the icons are stored in this code base and i noticed you are not updating handoff.md and codecontext.md file"

## Coding & Prompting Style Notes
- **Figma Fidelity**: Prefers pixel-perfect implementation and separation of desktop/mobile views into isolated components when complexity arises (e.g. `ProfileDesktopHero.tsx` and now `MobileProfile.tsx`).
- **Communication**: Prefers clear updates, direct tracking of instructions, and immediate documentation of style.
- **Strictness**: Emphasizes strict double-checking of padding, border radius, font family, font weight, and font size directly against Figma references.
- **Responsiveness**: Wants fluid responsiveness on mobile breakpoints (removing hardcoded max-widths) while strictly maintaining requested paddings (e.g., 10px on sides).
- **Design Tokens**: Strongly prefers using design system tokens (e.g., `Shades/Black/900`) and expects them to match perfectly.
- **Assets**: Wants precise asset extraction directly from Figma (SVGs) rather than approximating with material icons when exact assets exist.

## Current Context
- Task: Extracted SVG icons from Figma node `13547-48791` and stored them in `public/icons/`. Updated `MobileTabs` to use these icons and updated `handoff.md` and `codecontext.md` per the user's reminder.
