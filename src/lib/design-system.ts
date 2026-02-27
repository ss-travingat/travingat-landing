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
    50:  '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
    950: '#172554',
  },

  // ── Functional: Success ────────────────────
  success: {
    50:  '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
    950: '#052E16',
  },

  // ── Functional: Danger ─────────────────────
  danger: {
    50:  '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
    950: '#450A0A',
  },

  // ── Functional: Warning ────────────────────
  warning: {
    50:  '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
    950: '#451A03',
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
