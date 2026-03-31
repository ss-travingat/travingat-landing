export type TypeToken = {
  id: string;
  label: string;
  size: number;
  lineHeight: number;
  letterSpacing: number;
};

export const FONT_WEIGHTS = [
  { label: "Regular", value: 400 },
  { label: "Medium", value: 500 },
  { label: "Semibold", value: 600 },
  { label: "Bold", value: 700 },
] as const;

export const HEADING_TOKENS: TypeToken[] = [
  { id: "h1", label: "Header 1", size: 64, lineHeight: 72, letterSpacing: -1 },
  { id: "h2", label: "Header 2", size: 52, lineHeight: 60, letterSpacing: -1 },
  { id: "h3", label: "Header 3", size: 44, lineHeight: 52, letterSpacing: -0.5 },
  { id: "h4", label: "Header 4", size: 32, lineHeight: 40, letterSpacing: -0.5 },
  { id: "h5", label: "Header 5", size: 28, lineHeight: 36, letterSpacing: -0.5 },
  { id: "h6", label: "Header 6", size: 24, lineHeight: 32, letterSpacing: -0.5 },
  { id: "h7", label: "Header 7", size: 20, lineHeight: 28, letterSpacing: -0.5 },
];

export const TEXT_TOKENS: TypeToken[] = [
  { id: "text-lg", label: "Text lg", size: 18, lineHeight: 26, letterSpacing: -1.1 },
  { id: "text-md", label: "Text md", size: 16, lineHeight: 24, letterSpacing: -0.6 },
  { id: "text-sm", label: "Text sm", size: 14, lineHeight: 20, letterSpacing: -0.6 },
  { id: "text-xs", label: "Text xs", size: 12, lineHeight: 16, letterSpacing: 0 },
  { id: "text-xxs", label: "Text xxs", size: 10, lineHeight: 16, letterSpacing: 0 },
];

export type Swatch = {
  step: string;
  hex: string;
};

export type PaletteGroup = {
  name: string;
  swatches: Swatch[];
};

export const COLOR_GROUPS: PaletteGroup[] = [
  {
    name: "Coral",
    swatches: [
      { step: "50", hex: "#fff1f2" },
      { step: "100", hex: "#fee5e7" },
      { step: "200", hex: "#fdced3" },
      { step: "300", hex: "#faa7af" },
      { step: "400", hex: "#f77585" },
      { step: "500", hex: "#f0526a" },
      { step: "600", hex: "#db2347" },
      { step: "700", hex: "#b9173c" },
      { step: "800", hex: "#9b1638" },
      { step: "900", hex: "#851636" },
      { step: "950", hex: "#4a0719" },
    ],
  },
  {
    name: "Amber",
    swatches: [
      { step: "50", hex: "#fff8eb" },
      { step: "100", hex: "#ffebc6" },
      { step: "200", hex: "#fed789" },
      { step: "300", hex: "#febc4b" },
      { step: "400", hex: "#fda221" },
      { step: "500", hex: "#f77f09" },
      { step: "600", hex: "#db5a04" },
      { step: "700", hex: "#b63b07" },
      { step: "800", hex: "#932e0d" },
      { step: "900", hex: "#79270e" },
      { step: "950", hex: "#461102" },
    ],
  },
  {
    name: "Violet",
    swatches: [
      { step: "50", hex: "#ecf0ff" },
      { step: "100", hex: "#dce3ff" },
      { step: "200", hex: "#c0caff" },
      { step: "300", hex: "#9aa7ff" },
      { step: "400", hex: "#7278ff" },
      { step: "500", hex: "#5952ff" },
      { step: "600", hex: "#5a45f9" },
      { step: "700", hex: "#3f26dc" },
      { step: "800", hex: "#3422b1" },
      { step: "900", hex: "#2e248b" },
      { step: "950", hex: "#1d1551" },
    ],
  },
  {
    name: "Cyan",
    swatches: [
      { step: "50", hex: "#f0f9ff" },
      { step: "100", hex: "#dff2ff" },
      { step: "200", hex: "#b8e8ff" },
      { step: "300", hex: "#79d6ff" },
      { step: "400", hex: "#1fbcfe" },
      { step: "500", hex: "#07abf0" },
      { step: "600", hex: "#0088cd" },
      { step: "700", hex: "#006ca6" },
      { step: "800", hex: "#035c89" },
      { step: "900", hex: "#094c71" },
      { step: "950", hex: "#06304b" },
    ],
  },
  {
    name: "Black",
    swatches: [
      { step: "50", hex: "#404040" },
      { step: "100", hex: "#353535" },
      { step: "200", hex: "#303030" },
      { step: "300", hex: "#2a2a2a" },
      { step: "400", hex: "#252525" },
      { step: "500", hex: "#212121" },
      { step: "600", hex: "#1e1e1e" },
      { step: "700", hex: "#1a1a1a" },
      { step: "800", hex: "#161616" },
      { step: "900", hex: "#111111" },
      { step: "950", hex: "#000000" },
    ],
  },
  {
    name: "White",
    swatches: [
      { step: "50", hex: "#ffffff" },
      { step: "100", hex: "#efefef" },
      { step: "200", hex: "#dcdcdc" },
      { step: "300", hex: "#bdbdbd" },
      { step: "400", hex: "#989898" },
      { step: "500", hex: "#7c7c7c" },
      { step: "600", hex: "#656565" },
      { step: "700", hex: "#525252" },
      { step: "800", hex: "#464646" },
      { step: "900", hex: "#3d3d3d" },
      { step: "950", hex: "#292929" },
    ],
  },
];

export const FUNCTIONAL_GROUPS: PaletteGroup[] = [
  {
    name: "Info",
    swatches: [
      { step: "50", hex: "#F1F8FE" },
      { step: "100", hex: "#DEEFFD" },
      { step: "200", hex: "#BCDFFA" },
      { step: "300", hex: "#92CBF7" },
      { step: "400", hex: "#59B0F3" },
      { step: "500", hex: "#118BE8" },
      { step: "600", hex: "#1080D6" },
      { step: "700", hex: "#0E6FB9" },
      { step: "800", hex: "#0B5B98" },
      { step: "900", hex: "#08416D" },
      { step: "950", hex: "#001D38" },
    ],
  },
  {
    name: "Success",
    swatches: [
      { step: "50", hex: "#E8FBE5" },
      { step: "100", hex: "#D4F7CF" },
      { step: "200", hex: "#A9EF9F" },
      { step: "300", hex: "#7FE76F" },
      { step: "400", hex: "#50DF3A" },
      { step: "500", hex: "#35C220" },
      { step: "600", hex: "#2A9919" },
      { step: "700", hex: "#217613" },
      { step: "800", hex: "#164F0D" },
      { step: "900", hex: "#0D3107" },
      { step: "950", hex: "#082005" },
    ],
  },
  {
    name: "Danger",
    swatches: [
      { step: "50", hex: "#FFFFFF" },
      { step: "100", hex: "#FCD9D9" },
      { step: "200", hex: "#F9B3B3" },
      { step: "300", hex: "#F68989" },
      { step: "400", hex: "#F36363" },
      { step: "500", hex: "#F03D3D" },
      { step: "600", hex: "#E92020" },
      { step: "700", hex: "#A60D0D" },
      { step: "800", hex: "#720909" },
      { step: "900", hex: "#4A0606" },
      { step: "950", hex: "#240000" },
    ],
  },
  {
    name: "Warning",
    swatches: [
      { step: "50", hex: "#FFF8E6" },
      { step: "100", hex: "#FEF2CD" },
      { step: "200", hex: "#FEE59A" },
      { step: "300", hex: "#FDD868" },
      { step: "400", hex: "#FDCB35" },
      { step: "500", hex: "#FCBF04" },
      { step: "600", hex: "#CA9802" },
      { step: "700", hex: "#977202" },
      { step: "800", hex: "#654C01" },
      { step: "900", hex: "#4A3902" },
      { step: "950", hex: "#2D2000" },
    ],
  },
];

export type ButtonSizeToken = {
  id: string;
  height: number;
  paddingX: number;
  paddingY: number;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
};

export const BUTTON_SIZES: ButtonSizeToken[] = [
  { id: "xs", height: 32, paddingX: 8, paddingY: 8, fontSize: 12, lineHeight: 16, letterSpacing: 0 },
  { id: "sm", height: 36, paddingX: 12, paddingY: 8, fontSize: 14, lineHeight: 20, letterSpacing: -0.6 },
  { id: "md", height: 40, paddingX: 16, paddingY: 10, fontSize: 14, lineHeight: 20, letterSpacing: -0.6 },
  { id: "lg", height: 44, paddingX: 18, paddingY: 10, fontSize: 16, lineHeight: 24, letterSpacing: -0.6 },
  { id: "xl", height: 48, paddingX: 20, paddingY: 12, fontSize: 16, lineHeight: 24, letterSpacing: -0.6 },
  { id: "2xl", height: 58, paddingX: 24, paddingY: 16, fontSize: 18, lineHeight: 26, letterSpacing: -1.1 },
];

export type ButtonTheme = {
  id: string;
  label: string;
  states: {
    default: { bg: string; text: string; border?: string };
    hover: { bg: string; text: string; border?: string };
    disabled: { bg: string; text: string; border?: string };
  };
};

export const BUTTON_THEMES: ButtonTheme[] = [
  {
    id: "primary",
    label: "Primary",
    states: {
      default: { bg: "#ffffff", text: "#000000" },
      hover: { bg: "#efefef", text: "#000000" },
      disabled: { bg: "#dcdcdc", text: "#989898" },
    },
  },
  {
    id: "secondary",
    label: "Secondary",
    states: {
      default: { bg: "#212121", text: "#ffffff", border: "#303030" },
      hover: { bg: "#1e1e1e", text: "#ffffff", border: "#303030" },
      disabled: { bg: "#111111", text: "#3d3d3d", border: "#1a1a1a" },
    },
  },
  {
    id: "violet",
    label: "Violet",
    states: {
      default: { bg: "#5A45F9", text: "#FFFFFF" },
      hover: { bg: "#3F26DC", text: "#FFFFFF" },
      disabled: { bg: "#C0CAFF", text: "#ECF0FF" },
    },
  },
  {
    id: "coral",
    label: "Coral",
    states: {
      default: { bg: "#F0526A", text: "#FFFFFF" },
      hover: { bg: "#DB2347", text: "#FFFFFF" },
      disabled: { bg: "#FAA7AF", text: "#FFF1F2" },
    },
  },
  {
    id: "amber",
    label: "Amber",
    states: {
      default: { bg: "#FDA221", text: "#FFFFFF" },
      hover: { bg: "#F77F09", text: "#FFFFFF" },
      disabled: { bg: "#FED789", text: "#FFF8EB" },
    },
  },
  {
    id: "cyan",
    label: "Cyan",
    states: {
      default: { bg: "#1FBCFE", text: "#FFFFFF" },
      hover: { bg: "#0088CD", text: "#FFFFFF" },
      disabled: { bg: "#B8E8FF", text: "#F0F9FF" },
    },
  },
  {
    id: "ghost",
    label: "Ghost",
    states: {
      default: { bg: "transparent", text: "#FFFFFF" },
      hover: { bg: "transparent", text: "#FFFFFF" },
      disabled: { bg: "transparent", text: "#3D3D3D" },
    },
  },
];
