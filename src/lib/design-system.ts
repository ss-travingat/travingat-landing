/**
 * Travingat Design System
 * ======================
 * Primary Typeface: Inter Display
 * Secondary Typeface: Inter
 *
 * All values in rems (1rem = 16px base)
 *
 * Usage:
 *   import { typography, colors, spacing, radii, shadows } from '@/lib/design-system'
 */

// ─── Typography Scale ────────────────────────────────────────────────────────

export const fontFamily = {
  display: '"Inter Display", "Inter", sans-serif', // Primary – headings, hero text
  sans: '"Inter", sans-serif',                     // Secondary – body, UI elements
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

/**
 * Typography scale – all sizes in rem
 *
 * Header 1:  3.5rem   / 56px   – line-height 1.15
 * Header 2:  3rem     / 48px   – line-height 1.2
 * Header 3:  2.25rem  / 36px   – line-height 1.25
 * Header 4:  1.75rem  / 28px   – line-height 1.3
 * Header 5:  1.25rem  / 20px   – line-height 1.4
 * Header 6:  1rem     / 16px   – line-height 1.5
 * Header 7:  0.875rem / 14px   – line-height 1.5
 * Body:      1rem     / 16px   – line-height 1.6
 * Body sm:   0.875rem / 14px   – line-height 1.6
 * Caption:   0.75rem  / 12px   – line-height 1.5
 * Overline:  0.625rem / 10px   – line-height 1.6  (uppercase, letter-spacing 0.1em)
 */
export const fontSize = {
  'h1': '3.5rem',     // 56px
  'h2': '3rem',       // 48px
  'h3': '2.25rem',    // 36px
  'h4': '1.75rem',    // 28px
  'h5': '1.25rem',    // 20px
  'h6': '1rem',       // 16px
  'h7': '0.875rem',   // 14px
  'body': '1rem',     // 16px
  'body-sm': '0.875rem', // 14px
  'caption': '0.75rem',  // 12px
  'overline': '0.625rem', // 10px
} as const;

export const lineHeight = {
  'h1': '1.15',
  'h2': '1.2',
  'h3': '1.25',
  'h4': '1.3',
  'h5': '1.4',
  'h6': '1.5',
  'h7': '1.5',
  'body': '1.6',
  'body-sm': '1.6',
  'caption': '1.5',
  'overline': '1.6',
} as const;

export const letterSpacing = {
  tight: '-0.02em',    // headings
  normal: '0em',       // body
  wide: '0.05em',      // buttons, labels
  wider: '0.1em',      // overline / uppercase
} as const;

/**
 * Pre-composed typography styles for convenience.
 * Each entry: [fontSize, lineHeight, fontWeight, fontFamily, letterSpacing?]
 */
export const typography = {
  // ── Display / Hero ──────────────────────────
  'display-bold': {
    fontFamily: fontFamily.display,
    fontSize: fontSize.h1,
    lineHeight: lineHeight.h1,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.tight,
  },
  'display-semibold': {
    fontFamily: fontFamily.display,
    fontSize: fontSize.h1,
    lineHeight: lineHeight.h1,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.tight,
  },

  // ── Header 1 ───────────────────────────────
  'h1-regular': { fontFamily: fontFamily.display, fontSize: fontSize.h1, lineHeight: lineHeight.h1, fontWeight: fontWeight.regular, letterSpacing: letterSpacing.tight },
  'h1-medium':  { fontFamily: fontFamily.display, fontSize: fontSize.h1, lineHeight: lineHeight.h1, fontWeight: fontWeight.medium,  letterSpacing: letterSpacing.tight },
  'h1-semibold':{ fontFamily: fontFamily.display, fontSize: fontSize.h1, lineHeight: lineHeight.h1, fontWeight: fontWeight.semibold, letterSpacing: letterSpacing.tight },
  'h1-bold':    { fontFamily: fontFamily.display, fontSize: fontSize.h1, lineHeight: lineHeight.h1, fontWeight: fontWeight.bold,     letterSpacing: letterSpacing.tight },

  // ── Header 2 ───────────────────────────────
  'h2-regular': { fontFamily: fontFamily.display, fontSize: fontSize.h2, lineHeight: lineHeight.h2, fontWeight: fontWeight.regular, letterSpacing: letterSpacing.tight },
  'h2-medium':  { fontFamily: fontFamily.display, fontSize: fontSize.h2, lineHeight: lineHeight.h2, fontWeight: fontWeight.medium,  letterSpacing: letterSpacing.tight },
  'h2-semibold':{ fontFamily: fontFamily.display, fontSize: fontSize.h2, lineHeight: lineHeight.h2, fontWeight: fontWeight.semibold, letterSpacing: letterSpacing.tight },
  'h2-bold':    { fontFamily: fontFamily.display, fontSize: fontSize.h2, lineHeight: lineHeight.h2, fontWeight: fontWeight.bold,     letterSpacing: letterSpacing.tight },

  // ── Header 3 ───────────────────────────────
  'h3-regular': { fontFamily: fontFamily.sans, fontSize: fontSize.h3, lineHeight: lineHeight.h3, fontWeight: fontWeight.regular },
  'h3-medium':  { fontFamily: fontFamily.sans, fontSize: fontSize.h3, lineHeight: lineHeight.h3, fontWeight: fontWeight.medium },
  'h3-semibold':{ fontFamily: fontFamily.sans, fontSize: fontSize.h3, lineHeight: lineHeight.h3, fontWeight: fontWeight.semibold },
  'h3-bold':    { fontFamily: fontFamily.sans, fontSize: fontSize.h3, lineHeight: lineHeight.h3, fontWeight: fontWeight.bold },

  // ── Header 4 ───────────────────────────────
  'h4-regular': { fontFamily: fontFamily.sans, fontSize: fontSize.h4, lineHeight: lineHeight.h4, fontWeight: fontWeight.regular },
  'h4-medium':  { fontFamily: fontFamily.sans, fontSize: fontSize.h4, lineHeight: lineHeight.h4, fontWeight: fontWeight.medium },
  'h4-semibold':{ fontFamily: fontFamily.sans, fontSize: fontSize.h4, lineHeight: lineHeight.h4, fontWeight: fontWeight.semibold },
  'h4-bold':    { fontFamily: fontFamily.sans, fontSize: fontSize.h4, lineHeight: lineHeight.h4, fontWeight: fontWeight.bold },

  // ── Header 5 ───────────────────────────────
  'h5-regular': { fontFamily: fontFamily.sans, fontSize: fontSize.h5, lineHeight: lineHeight.h5, fontWeight: fontWeight.regular },
  'h5-medium':  { fontFamily: fontFamily.sans, fontSize: fontSize.h5, lineHeight: lineHeight.h5, fontWeight: fontWeight.medium },
  'h5-semibold':{ fontFamily: fontFamily.sans, fontSize: fontSize.h5, lineHeight: lineHeight.h5, fontWeight: fontWeight.semibold },
  'h5-bold':    { fontFamily: fontFamily.sans, fontSize: fontSize.h5, lineHeight: lineHeight.h5, fontWeight: fontWeight.bold },

  // ── Header 6 ───────────────────────────────
  'h6-regular': { fontFamily: fontFamily.sans, fontSize: fontSize.h6, lineHeight: lineHeight.h6, fontWeight: fontWeight.regular },
  'h6-medium':  { fontFamily: fontFamily.sans, fontSize: fontSize.h6, lineHeight: lineHeight.h6, fontWeight: fontWeight.medium },
  'h6-semibold':{ fontFamily: fontFamily.sans, fontSize: fontSize.h6, lineHeight: lineHeight.h6, fontWeight: fontWeight.semibold },
  'h6-bold':    { fontFamily: fontFamily.sans, fontSize: fontSize.h6, lineHeight: lineHeight.h6, fontWeight: fontWeight.bold },

  // ── Header 7 ───────────────────────────────
  'h7-regular': { fontFamily: fontFamily.sans, fontSize: fontSize.h7, lineHeight: lineHeight.h7, fontWeight: fontWeight.regular },
  'h7-medium':  { fontFamily: fontFamily.sans, fontSize: fontSize.h7, lineHeight: lineHeight.h7, fontWeight: fontWeight.medium },
  'h7-semibold':{ fontFamily: fontFamily.sans, fontSize: fontSize.h7, lineHeight: lineHeight.h7, fontWeight: fontWeight.semibold },
  'h7-bold':    { fontFamily: fontFamily.sans, fontSize: fontSize.h7, lineHeight: lineHeight.h7, fontWeight: fontWeight.bold },

  // ── Body ───────────────────────────────────
  'body-regular':  { fontFamily: fontFamily.sans, fontSize: fontSize.body, lineHeight: lineHeight.body, fontWeight: fontWeight.regular },
  'body-medium':   { fontFamily: fontFamily.sans, fontSize: fontSize.body, lineHeight: lineHeight.body, fontWeight: fontWeight.medium },
  'body-semibold': { fontFamily: fontFamily.sans, fontSize: fontSize.body, lineHeight: lineHeight.body, fontWeight: fontWeight.semibold },
  'body-bold':     { fontFamily: fontFamily.sans, fontSize: fontSize.body, lineHeight: lineHeight.body, fontWeight: fontWeight.bold },

  // ── Body Small ─────────────────────────────
  'body-sm-regular':  { fontFamily: fontFamily.sans, fontSize: fontSize['body-sm'], lineHeight: lineHeight['body-sm'], fontWeight: fontWeight.regular },
  'body-sm-medium':   { fontFamily: fontFamily.sans, fontSize: fontSize['body-sm'], lineHeight: lineHeight['body-sm'], fontWeight: fontWeight.medium },
  'body-sm-semibold': { fontFamily: fontFamily.sans, fontSize: fontSize['body-sm'], lineHeight: lineHeight['body-sm'], fontWeight: fontWeight.semibold },
  'body-sm-bold':     { fontFamily: fontFamily.sans, fontSize: fontSize['body-sm'], lineHeight: lineHeight['body-sm'], fontWeight: fontWeight.bold },

  // ── Caption ────────────────────────────────
  'caption-regular':  { fontFamily: fontFamily.sans, fontSize: fontSize.caption, lineHeight: lineHeight.caption, fontWeight: fontWeight.regular },
  'caption-medium':   { fontFamily: fontFamily.sans, fontSize: fontSize.caption, lineHeight: lineHeight.caption, fontWeight: fontWeight.medium },
  'caption-semibold': { fontFamily: fontFamily.sans, fontSize: fontSize.caption, lineHeight: lineHeight.caption, fontWeight: fontWeight.semibold },
  'caption-bold':     { fontFamily: fontFamily.sans, fontSize: fontSize.caption, lineHeight: lineHeight.caption, fontWeight: fontWeight.bold },

  // ── Overline ───────────────────────────────
  'overline': {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.overline,
    lineHeight: lineHeight.overline,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase' as const,
  },
} as const;


// ─── Color Palette ────────────────────────────────────────────────────────────
// Scales: 50 → 950  (lightest → darkest)

export const colors = {
  // ── Coral ──────────────────────────────────
  coral: {
    50:  '#FFF5F5',
    100: '#FFE1E1',
    200: '#FFBCB3',
    300: '#FF9C8F',
    400: '#FF7B65',
    500: '#FF6347',
    600: '#E04E34',
    700: '#B83D28',
    800: '#99301E',
    900: '#7A2515',
    950: '#4C1710',
  },

  // ── Amber ──────────────────────────────────
  amber: {
    50:  '#FFFBEB',
    100: '#FFF3C4',
    200: '#FFE082',
    300: '#FFD54F',
    400: '#FFCA28',
    500: '#FFC107',
    600: '#FFB300',
    700: '#FFA000',
    800: '#FF8F00',
    900: '#FF6F00',
    950: '#7A4100',
  },

  // ── Violet ─────────────────────────────────
  violet: {
    50:  '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
    950: '#2E1065',
  },

  // ── Cyan ───────────────────────────────────
  cyan: {
    50:  '#ECFEFF',
    100: '#CFFAFE',
    200: '#A5F3FC',
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2',
    700: '#0E7490',
    800: '#155E75',
    900: '#164E63',
    950: '#083344',
  },

  // ── Black (Neutrals) ───────────────────────
  black: {
    50:  '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },

  // ── White (Tinted Neutrals) ────────────────
  white: {
    50:  '#FFFFFF',
    100: '#FAFBFC',
    200: '#F4F6F8',
    300: '#EEF1F4',
    400: '#E4E8ED',
    500: '#D7DCE2',
    600: '#C5CBD3',
    700: '#B0B8C3',
    800: '#9BA5B3',
    900: '#8591A2',
    950: '#6E7B8F',
  },

  // ── Functional: Info ───────────────────────
  info: {
    50:  '#F1F8FE',
    100: '#DEEFFD',
    200: '#BCDFFA',
    300: '#92CBF7',
    400: '#59B0F3',
    500: '#118BE8',
    600: '#1080D6',
    700: '#0E6FB9',
    800: '#0B5B98',
    900: '#08416D',
    950: '#001D38',
  },

  // ── Functional: Success ────────────────────
  success: {
    50:  '#E8FBE5',
    100: '#D4F7CF',
    200: '#A9EF9F',
    300: '#7FE76F',
    400: '#50DF3A',
    500: '#35C220',
    600: '#2A9919',
    700: '#217613',
    800: '#164F0D',
    900: '#0D3107',
    950: '#082005',
  },

  // ── Functional: Danger ─────────────────────
  danger: {
    50:  '#FEECEC',
    100: '#FCD9D9',
    200: '#F9B3B3',
    300: '#F68989',
    400: '#F36363',
    500: '#F03D3D',
    600: '#E92020',
    700: '#A60D0D',
    800: '#720909',
    900: '#4A0606',
    950: '#240000',
  },

  // ── Functional: Warning ────────────────────
  warning: {
    50:  '#FFF8E6',
    100: '#FEF2CD',
    200: '#FEE59A',
    300: '#FDD868',
    400: '#FDCB35',
    500: '#FCBF04',
    600: '#CA9802',
    700: '#977202',
    800: '#654C01',
    900: '#4A3902',
    950: '#2D2000',
  },

  // ── Gray (Charcoal Neutrals) ───────────────
  gray: {
    50:  '#F6F7F9',
    100: '#EDEEF1',
    200: '#DCDCDC',
    300: '#BDBDBD',
    400: '#989898',
    500: '#656565',
    600: '#464646',
    700: '#303030',
    800: '#1E1E1E',
    900: '#161616',
    950: '#111111',
  },

  // ── Blue (Ocean / Deep Azure) ──────────────
  blue: {
    50:  '#F0F9FF',
    100: '#DFF2FF',
    200: '#B8E8FF',
    300: '#79D6FF',
    400: '#1FBCFE',
    500: '#07ABF0',
    600: '#0088CD',
    700: '#006CA6',
    800: '#035C89',
    900: '#06304B',
    950: '#001D38',
  },

  // ── Sky (Cornflower / Royal Blue) ─────────
  sky: {
    50:  '#F1F8FE',
    100: '#DEEFFD',
    200: '#BCDFFA',
    300: '#92CBF7',
    400: '#59B0F3',
    500: '#118BE8',
    600: '#1080D6',
    700: '#0E6FB9',
    800: '#0B5B98',
    900: '#08416D',
    950: '#001D38',
  },

  // ── Indigo (Blue-Violet) ───────────────────
  indigo: {
    50:  '#ECF0FF',
    100: '#DCE3FF',
    200: '#C0CAFF',
    300: '#9AA7FF',
    400: '#7278FF',
    500: '#5952FF',
    600: '#5A45F9',
    700: '#3F26DC',
    800: '#3422B1',
    900: '#2E248B',
    950: '#1D1551',
  },

  // ── Green (Vivid Lime-Green) ───────────────
  green: {
    50:  '#E8FBE5',
    100: '#D4F7CF',
    200: '#A9EF9F',
    300: '#7FE76F',
    400: '#50DF3A',
    500: '#35C220',
    600: '#2A9919',
    700: '#217613',
    800: '#164F0D',
    900: '#0D3107',
    950: '#082005',
  },

  // ── Rose (Pink / Magenta Rose) ────────────
  rose: {
    50:  '#FFF1F2',
    100: '#FEE5E7',
    200: '#FDCED3',
    300: '#FAA7AF',
    400: '#F77585',
    500: '#F0526A',
    600: '#DB2347',
    700: '#B9173C',
    800: '#9B1638',
    900: '#851636',
    950: '#4A0719',
  },

  // ── Red (Vivid Red) ────────────────────────
  red: {
    50:  '#FFF1F2',
    100: '#FCD9D9',
    200: '#F9B3B3',
    300: '#F68989',
    400: '#F36363',
    500: '#F03D3D',
    600: '#E92020',
    700: '#A60D0D',
    800: '#720909',
    900: '#4A0606',
    950: '#240000',
  },

  // ── Orange (Warm Orange) ───────────────────
  orange: {
    50:  '#FFF8EB',
    100: '#FFEBC6',
    200: '#FED789',
    300: '#FEBC4B',
    400: '#FDA221',
    500: '#F77F09',
    600: '#DB5A04',
    700: '#B63B07',
    800: '#932E0D',
    900: '#79270E',
    950: '#461102',
  },

  // ── Yellow (Golden Yellow) ────────────────
  yellow: {
    50:  '#FFF8E6',
    100: '#FEF2CD',
    200: '#FEE59A',
    300: '#FDD868',
    400: '#FDCB35',
    500: '#FCBF04',
    600: '#CA9802',
    700: '#977202',
    800: '#654C01',
    900: '#4A3902',
    950: '#2D2000',
  },
} as const;


// ─── Spacing (rem) ───────────────────────────────────────────────────────────

export const spacing = {
  '0': '0rem',
  'px': '0.0625rem',   // 1px
  '0.5': '0.125rem',   // 2px
  '1': '0.25rem',      // 4px
  '1.5': '0.375rem',   // 6px
  '2': '0.5rem',       // 8px
  '2.5': '0.625rem',   // 10px
  '3': '0.75rem',      // 12px
  '3.5': '0.875rem',   // 14px
  '4': '1rem',         // 16px
  '5': '1.25rem',      // 20px
  '6': '1.5rem',       // 24px
  '7': '1.75rem',      // 28px
  '8': '2rem',         // 32px
  '9': '2.25rem',      // 36px
  '10': '2.5rem',      // 40px
  '12': '3rem',        // 48px
  '14': '3.5rem',      // 56px
  '16': '4rem',        // 64px
  '20': '5rem',        // 80px
  '24': '6rem',        // 96px
  '28': '7rem',        // 112px
  '32': '8rem',        // 128px
  '36': '9rem',        // 144px
  '40': '10rem',       // 160px
  '48': '12rem',       // 192px
  '56': '14rem',       // 224px
  '64': '16rem',       // 256px
  '72': '18rem',       // 288px
  '80': '20rem',       // 320px
  '96': '24rem',       // 384px
} as const;


// ─── Border Radius (rem) ─────────────────────────────────────────────────────

export const radii = {
  none: '0rem',
  sm: '0.25rem',       // 4px
  md: '0.5rem',        // 8px
  lg: '0.75rem',       // 12px
  xl: '1rem',          // 16px
  '2xl': '1.25rem',    // 20px
  '3xl': '1.5rem',     // 24px
  full: '62.5rem',     // pill
} as const;


// ─── Shadows ─────────────────────────────────────────────────────────────────

export const shadows = {
  sm: '0 0.0625rem 0.125rem rgba(0, 0, 0, 0.05)',
  md: '0 0.25rem 0.375rem rgba(0, 0, 0, 0.1)',
  lg: '0 0.625rem 0.9375rem rgba(0, 0, 0, 0.1)',
  xl: '0 1.25rem 1.5625rem rgba(0, 0, 0, 0.1)',
  '2xl': '0 1.5625rem 3.125rem rgba(0, 0, 0, 0.25)',
  glow: '0 0 1.25rem rgba(90, 76, 255, 0.3)',
  none: 'none',
} as const;


// ─── Breakpoints ─────────────────────────────────────────────────────────────

export const breakpoints = {
  sm: '40rem',         // 640px
  md: '48rem',         // 768px
  lg: '64rem',         // 1024px
  xl: '80rem',         // 1280px
  '2xl': '96rem',      // 1536px
} as const;


// ─── Z-Index ─────────────────────────────────────────────────────────────────

export const zIndex = {
  behind: -1,
  base: 0,
  raised: 1,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  popover: 50,
  toast: 60,
} as const;


// ─── Transitions ─────────────────────────────────────────────────────────────

export const transitions = {
  fast: '150ms ease',
  normal: '250ms ease',
  slow: '350ms ease',
} as const;

// ─── Buttons ─────────────────────────────────────────────────────────────────

export const buttonVariants = {
  // ── Full-color variants ──
  primary:             { bg: '#5A45F9', hover: '#3F26DC',               text: '#FFFFFF' },
  'primary-soft':      { bg: '#C0CAFF', hover: '#9CAAFF',               text: '#ECF0FF' },
  'primary-subtle':    { bg: '#ECF0FF', hover: '#C0CAFF',               text: '#5A45F9' },
  secondary:           { bg: '#1A1A1A', hover: '#303030',               text: '#FFFFFF', border: '#353535' },
  'secondary-dark':    { bg: '#3D3D3D', hover: '#303030',               text: '#FFFFFF' },
  ghost:               { bg: 'transparent', hover: 'rgba(255,255,255,0.05)', text: '#FFFFFF', border: '#353535' },
  danger:              { bg: '#F0526A', hover: '#DB2347',               text: '#FFFFFF' },
  'danger-soft':       { bg: '#FAA7AF', hover: '#F87F8A',               text: '#FFF1F2' },
  'danger-subtle':     { bg: '#FFF1F2', hover: '#FAA7AF',               text: '#F0526A' },
  warning:             { bg: '#FDA221', hover: '#F77F09',               text: '#FFFFFF' },
  'warning-soft':      { bg: '#FED789', hover: '#FDCA55',               text: '#FFF8EB' },
  'warning-subtle':    { bg: '#FFF8EB', hover: '#FED789',               text: '#FDA221' },
  info:                { bg: '#1FBCFE', hover: '#0088CD',               text: '#FFFFFF' },
  'info-soft':         { bg: '#B8E8FF', hover: '#8DD8FF',               text: '#F0F9FF' },
  'info-subtle':       { bg: '#F0F9FF', hover: '#B8E8FF',               text: '#1FBCFE' },
  // ── Light / neutral variants ──
  light:               { bg: '#FFFFFF',  hover: '#DCDCDC',              text: '#000000' },
  'light-secondary':   { bg: '#DCDCDC',  hover: '#BDBDBD',              text: '#000000' },
  'light-ghost':       { bg: '#EFEFEF',  hover: '#DCDCDC',              text: '#000000' },
  neutral:             { bg: '#BDBDBD',  hover: '#A0A0A0',              text: '#1A1A1A' },
} as const;

export const buttonSizes = {
  xs:  { height: '2rem',   px: '0.75rem', fontSize: '0.75rem',  radius: '62.5rem' },
  sm:  { height: '2.25rem',px: '1rem',    fontSize: '0.875rem', radius: '62.5rem' },
  md:  { height: '2.5rem', px: '1.25rem', fontSize: '0.875rem', radius: '62.5rem' },
  lg:  { height: '2.75rem',px: '1.5rem',  fontSize: '1rem',     radius: '62.5rem' },
  xl:  { height: '3rem',   px: '1.75rem', fontSize: '1rem',     radius: '62.5rem' },
  '2xl': { height: '3.5rem', px: '2.25rem', fontSize: '1.125rem', radius: '62.5rem' },
} as const;

// ─── Animations ──────────────────────────────────────────────────────────────

export const animations = {
  'fade-in':    { class: 'animate-fade-in',    keyframe: 'fade-in',    description: 'Fade from transparent to opaque',               category: 'entrance' },
  'fade-up':    { class: 'animate-fade-up',    keyframe: 'fade-up',    description: 'Fade in while rising from below',               category: 'entrance' },
  'fade-down':  { class: 'animate-fade-down',  keyframe: 'fade-down',  description: 'Fade in while dropping from above',             category: 'entrance' },
  'fade-left':  { class: 'animate-fade-left',  keyframe: 'fade-left',  description: 'Fade in while sliding from the right',          category: 'entrance' },
  'fade-right': { class: 'animate-fade-right', keyframe: 'fade-right', description: 'Fade in while sliding from the left',           category: 'entrance' },
  'scale-in':   { class: 'animate-scale-in',   keyframe: 'scale-in',   description: 'Fade in while scaling up from slightly smaller', category: 'entrance' },
  'float':      { class: 'animate-float',      keyframe: 'float',      description: 'Gentle up-and-down hover loop',                 category: 'loop' },
  'pulse-soft': { class: 'animate-pulse-soft', keyframe: 'pulse-soft', description: 'Soft opacity pulsing loop',                     category: 'loop' },
  'shimmer':    { class: 'animate-shimmer',    keyframe: 'shimmer',    description: 'Horizontal shine sweep for skeleton loaders',   category: 'loop' },
  'spin-slow':  { class: 'animate-spin-slow',  keyframe: 'spin-slow',  description: 'Slow full rotation loop',                       category: 'loop' },
  'bounce-y':   { class: 'animate-bounce-y',   keyframe: 'bounce-y',   description: 'Vertical bounce loop',                          category: 'loop' },
  'marquee':    { class: 'animate-marquee',    keyframe: 'marquee',    description: 'Continuous horizontal scroll (ticker)',         category: 'loop' },
} as const;
