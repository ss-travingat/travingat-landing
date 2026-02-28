'use client';

import { colors, spacing, radii, shadows, transitions, animations, buttonVariants, buttonSizes } from '@/lib/design-system';
import { useState } from 'react';

// ─── Nav sections ─────────────────────────────────────────────────────────────
const SECTIONS = ['Typography', 'Colors', 'Spacing', 'Radius', 'Shadows', 'Transitions', 'Animations', 'Buttons'];

// ─── Typography rows ──────────────────────────────────────────────────────────
const TYPE_ROWS = [
  { label: 'Display',   cssBase: 'display',  sizes: '56px / 3.5rem', lh: '1.15', font: 'Inter Display', weights: ['bold', 'semibold'] },
  { label: 'Header 1',  cssBase: 'h1',       sizes: '56px / 3.5rem', lh: '1.15', font: 'Inter Display', weights: ['regular','medium','semibold','bold'] },
  { label: 'Header 2',  cssBase: 'h2',       sizes: '48px / 3rem',   lh: '1.20', font: 'Inter Display', weights: ['regular','medium','semibold','bold'] },
  { label: 'Header 3',  cssBase: 'h3',       sizes: '36px / 2.25rem',lh: '1.25', font: 'Inter',         weights: ['regular','medium','semibold','bold'] },
  { label: 'Header 4',  cssBase: 'h4',       sizes: '28px / 1.75rem',lh: '1.30', font: 'Inter',         weights: ['regular','medium','semibold','bold'] },
  { label: 'Header 5',  cssBase: 'h5',       sizes: '20px / 1.25rem',lh: '1.40', font: 'Inter',         weights: ['regular','medium','semibold','bold'] },
  { label: 'Header 6',  cssBase: 'h6',       sizes: '16px / 1rem',   lh: '1.50', font: 'Inter',         weights: ['regular','medium','semibold','bold'] },
  { label: 'Header 7',  cssBase: 'h7',       sizes: '14px / 0.875rem',lh: '1.50',font: 'Inter',         weights: ['regular','medium','semibold','bold'] },
  { label: 'Body',      cssBase: 'body',     sizes: '16px / 1rem',   lh: '1.60', font: 'Inter',         weights: ['regular','medium','semibold','bold'] },
  { label: 'Body SM',   cssBase: 'body-sm',  sizes: '14px / 0.875rem',lh: '1.60',font: 'Inter',         weights: ['regular','medium','semibold','bold'] },
  { label: 'Caption',   cssBase: 'caption',  sizes: '12px / 0.75rem',lh: '1.50', font: 'Inter',         weights: ['regular','medium','semibold','bold'] },
  { label: 'Overline',  cssBase: 'overline', sizes: '10px / 0.625rem',lh: '1.60',font: 'Inter',         weights: ['semibold'] },
] as const;

const WEIGHT_LABEL: Record<string, string> = {
  bold: '700 Bold',
  semibold: '600 SemiBold',
  medium: '500 Medium',
  regular: '400 Regular',
};

// ─── Color palettes ───────────────────────────────────────────────────────────
type ColorScale = Record<string, string>;

const PALETTES: { name: string; scale: ColorScale }[] = [
  { name: 'Coral',   scale: colors.coral   as unknown as ColorScale },
  { name: 'Amber',   scale: colors.amber   as unknown as ColorScale },
  { name: 'Violet',  scale: colors.violet  as unknown as ColorScale },
  { name: 'Cyan',    scale: colors.cyan    as unknown as ColorScale },
  { name: 'Black',   scale: colors.black   as unknown as ColorScale },
  { name: 'White',   scale: colors.white   as unknown as ColorScale },
  { name: 'Info',    scale: colors.info    as unknown as ColorScale },
  { name: 'Success', scale: colors.success as unknown as ColorScale },
  { name: 'Danger',  scale: colors.danger  as unknown as ColorScale },
  { name: 'Warning', scale: colors.warning as unknown as ColorScale },
  { name: 'Gray',    scale: colors.gray    as unknown as ColorScale },
  { name: 'Blue',    scale: colors.blue    as unknown as ColorScale },
  { name: 'Sky',     scale: colors.sky     as unknown as ColorScale },
  { name: 'Indigo',  scale: colors.indigo  as unknown as ColorScale },
  { name: 'Green',   scale: colors.green   as unknown as ColorScale },
  { name: 'Rose',    scale: colors.rose    as unknown as ColorScale },
  { name: 'Red',     scale: colors.red     as unknown as ColorScale },
  { name: 'Orange',  scale: colors.orange  as unknown as ColorScale },
  { name: 'Yellow',  scale: colors.yellow  as unknown as ColorScale },
];

const SEMANTIC: { name: string; value: string }[] = [
  { name: 'primary',           value: '#5A4CFF' },
  { name: 'primary-hover',     value: '#4839CC' },
  { name: 'background-light',  value: '#F3F4F6' },
  { name: 'background-dark',   value: '#000000' },
  { name: 'card-dark',         value: '#111111' },
  { name: 'card-dark-hover',   value: '#1A1A1A' },
  { name: 'surface-dark',      value: '#0A0A0A' },
  { name: 'secondary-text',    value: '#9CA3AF' },
  { name: 'tertiary-text',     value: '#6B7280' },
  { name: 'border-dark',       value: '#1F1F1F' },
  { name: 'border-dark-hover', value: '#333333' },
];

// ─── Spacing tokens ───────────────────────────────────────────────────────────
const SPACING_TOKENS = Object.entries(spacing).slice(0, 28);

// ─── Radii ────────────────────────────────────────────────────────────────────
const RADII_TOKENS = Object.entries(radii);

// ─── Shadows ─────────────────────────────────────────────────────────────────
const SHADOW_TOKENS = Object.entries(shadows).filter(([k]) => k !== 'none');

// ─── Transition tokens ────────────────────────────────────────────────────────
const TRANSITION_TOKENS = Object.entries(transitions);

// ─── Animation tokens ────────────────────────────────────────────────────────
const ANIMATION_TOKENS = Object.entries(animations) as [string, typeof animations[keyof typeof animations]][];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isLight(hex: string) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 127;
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="text-h3-semibold text-white mb-8 pt-4 border-b border-white/10 pb-4"
    >
      {children}
    </h2>
  );
}

function Token({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 text-body-sm-regular border-b border-white/5">
      <span className="text-white/50 font-mono text-[11px]">{label}</span>
      <span className="text-white/80 font-mono text-[11px]">{value}</span>
    </div>
  );
}

function AnimationCard({ name, meta }: { name: string; meta: { class: string; description: string; category: string } }) {
  const [key, setKey] = useState(0);
  const isLoop = meta.category === 'loop';

  const preview =
    name === 'shimmer' ? (
      <div
        className="w-12 h-12 rounded-xl animate-shimmer"
        style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 75%)' }}
      />
    ) : name === 'marquee' ? (
      <div className="w-full overflow-hidden">
        <div className="flex gap-3 animate-marquee whitespace-nowrap">
          {['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D'].map((l, i) => (
            <span key={i} className="text-white/50 font-mono text-[11px] px-2 py-1 bg-white/5 rounded">{l}</span>
          ))}
        </div>
      </div>
    ) : (
      <div
        key={key}
        className={`w-12 h-12 bg-violet-500/50 rounded-xl ${isLoop ? meta.class : key > 0 ? meta.class : ''}`}
      />
    );

  return (
    <div className="bg-card-dark border border-white/8 rounded-2xl p-6 flex flex-col gap-5">
      {/* preview area */}
      <div className="h-16 flex items-center justify-center">
        {preview}
      </div>
      {/* info */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-[13px] font-semibold text-white/80">{name}</p>
          <span className="text-[9px] font-mono uppercase tracking-widest text-white/25 bg-white/5 px-2 py-0.5 rounded-full">{meta.category}</span>
        </div>
        <p className="text-[11px] text-white/40 mb-3 leading-relaxed">{meta.description}</p>
        <code className="text-[10px] font-mono text-violet-400 bg-violet-500/10 px-2 py-1 rounded">{meta.class}</code>
      </div>
      {/* replay button (entrance only) */}
      {!isLoop && (
        <button
          onClick={() => setKey(k => k + 1)}
          className="text-[11px] font-medium text-white/30 hover:text-white/70 transition-colors self-start"
        >
          ↺ Replay
        </button>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DesignsPage() {
  const [active, setActive] = useState('Typography');

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white" style={{ fontFamily: 'var(--font-sans)' }}>

      {/* ── Top bar ── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0A0A0A]/90 backdrop-blur-sm">
        <div className="max-w-360 mx-auto px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <span
              className="text-h6-bold tracking-wider text-white uppercase text-[10px]"
              style={{ letterSpacing: '0.15em' }}
            >
              Travingat
            </span>
            <span className="w-px h-4 bg-white/20" />
            <span className="text-h6-semibold text-white">Design System</span>
          </div>
          <nav className="flex gap-1">
            {SECTIONS.map((s) => (
              <a
                key={s}
                href={`#${s}`}
                onClick={() => setActive(s)}
                className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                  active === s
                    ? 'bg-white/10 text-white'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                {s}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-360 mx-auto px-8 py-16 space-y-24">

        {/* ════════════════════ TYPOGRAPHY ════════════════════ */}
        <section id="Typography">
          <SectionHeading id="Typography">Typography</SectionHeading>

          {/* ── Font showcase cards ── */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Inter Display card */}
            <div className="bg-card-dark border border-white/8 rounded-2xl p-10 overflow-hidden">
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-8">Primary</p>
              <p
                className="text-white leading-none mb-4"
                style={{ fontFamily: 'var(--font-display)', fontSize: '5rem', fontWeight: 700, letterSpacing: '-0.02em' }}
              >
                Aa
              </p>
              <p
                className="text-white/70 font-semibold mb-3"
                style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}
              >
                Inter Display
              </p>
              <p
                className="text-white/40 leading-relaxed"
                style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: '0.04em' }}
              >
                ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                abcdefghijklmnopqrstuvwxyz<br />
                0123456789 !@#$%&
              </p>
            </div>

            {/* Inter card */}
            <div className="bg-card-dark border border-white/8 rounded-2xl p-10 overflow-hidden">
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-8">Secondary</p>
              <p
                className="text-white leading-none mb-4"
                style={{ fontFamily: 'var(--font-sans)', fontSize: '5rem', fontWeight: 700, letterSpacing: '-0.02em' }}
              >
                Aa
              </p>
              <p
                className="text-white/70 font-semibold mb-3"
                style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem' }}
              >
                Inter
              </p>
              <p
                className="text-white/40 leading-relaxed"
                style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', letterSpacing: '0.04em' }}
              >
                ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                abcdefghijklmnopqrstuvwxyz<br />
                0123456789 !@#$%&
              </p>
            </div>
          </div>

          {/* ── Type scale table ── */}
          <div className="bg-card-dark border border-white/8 rounded-2xl overflow-hidden">
            {/* table header */}
            <div className="grid grid-cols-[160px_1fr_110px_72px_80px] gap-4 px-6 py-3 border-b border-white/8 text-[10px] font-mono text-white/30 uppercase tracking-widest">
              <span>Style</span>
              <span>Specimen</span>
              <span>Size</span>
              <span>Line-h</span>
              <span>Typeface</span>
            </div>

            {TYPE_ROWS.map((row) => (
              <div key={row.label} className="border-b border-white/5 last:border-0">
                {row.weights.map((w, wi) => {
                  const cssClass =
                    row.cssBase === 'overline'
                      ? 'text-overline'
                      : `text-${row.cssBase}-${w}`;
                  return (
                    <div
                      key={w}
                      className="grid grid-cols-[160px_1fr_110px_72px_80px] gap-4 items-center px-6 py-4 hover:bg-white/2 transition-colors"
                    >
                      {/* label */}
                      <div className="flex flex-col gap-0.5">
                        {wi === 0 && (
                          <span className="text-[11px] font-semibold text-white/80">{row.label}</span>
                        )}
                        <span className="font-mono text-[10px] text-white/30">{WEIGHT_LABEL[w]}</span>
                      </div>

                      {/* specimen */}
                      <span className={`${cssClass} text-white truncate`}>
                        The quick brown fox jumps over the lazy dog
                      </span>

                      {/* size */}
                      <span className="font-mono text-[11px] text-white/30">{row.sizes}</span>

                      {/* line-height */}
                      <span className="font-mono text-[11px] text-white/30">{row.lh}</span>

                      {/* typeface */}
                      <span className="font-mono text-[11px] text-white/30 truncate">{row.font}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════ COLORS ════════════════════ */}
        <section id="Colors">
          <SectionHeading id="Colors">Colors</SectionHeading>

          {/* Semantic aliases */}
          <div className="mb-10">
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-4">Semantic Aliases</p>
            <div className="flex flex-wrap gap-3">
              {SEMANTIC.map(({ name, value }) => (
                <div key={name} className="flex flex-col items-center gap-2">
                  <div
                    className="w-14 h-14 rounded-xl border border-white/10"
                    style={{ background: value }}
                  />
                  <span className="font-mono text-[9px] text-white/40 text-center leading-tight max-w-14 truncate">{name}</span>
                  <span className="font-mono text-[9px] text-white/25 uppercase">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Palette grids */}
          <div className="space-y-8">
            {PALETTES.map(({ name, scale }) => (
              <div key={name}>
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-3">{name}</p>
                <div className="flex rounded-xl overflow-hidden border border-white/8">
                  {Object.entries(scale).map(([step, hex]) => {
                    const light = isLight(hex as string);
                    return (
                      <div
                        key={step}
                        className="flex-1 flex flex-col items-center justify-end py-3 px-1 gap-1 min-h-22 transition-transform hover:scale-y-105 hover:z-10 origin-bottom"
                        style={{ background: hex as string }}
                      >
                        <span className={`font-mono text-[9px] font-semibold ${light ? 'text-black/50' : 'text-white/60'}`}>{step}</span>
                        <span className={`font-mono text-[8px] ${light ? 'text-black/40' : 'text-white/40'} uppercase`}>
                          {(hex as string).replace('#', '')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════ SPACING ════════════════════ */}
        <section id="Spacing">
          <SectionHeading id="Spacing">Spacing</SectionHeading>
          <div className="bg-card-dark border border-white/8 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-[100px_1fr_80px] gap-4 px-6 py-3 border-b border-white/8 text-[10px] font-mono text-white/30 uppercase tracking-widest">
              <span>Token</span>
              <span>Visual</span>
              <span>Value</span>
            </div>
            {SPACING_TOKENS.map(([key, val]) => (
              <div key={key} className="grid grid-cols-[100px_1fr_80px] gap-4 items-center px-6 py-3 border-b border-white/5 last:border-0 hover:bg-white/2">
                <span className="font-mono text-[11px] text-white/50">spacing-{key}</span>
                <div className="flex items-center">
                  <div
                    className="bg-violet-500/60 rounded-sm h-4"
                    style={{ width: val === '0rem' ? '2px' : val }}
                  />
                </div>
                <span className="font-mono text-[11px] text-white/30">{val}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════ BORDER RADIUS ════════════════════ */}
        <section id="Radius">
          <SectionHeading id="Radius">Border Radius</SectionHeading>
          <div className="grid grid-cols-4 gap-4">
            {RADII_TOKENS.map(([name, val]) => (
              <div key={name} className="bg-card-dark border border-white/8 rounded-2xl p-6 flex flex-col items-center gap-4">
                <div
                  className="w-16 h-16 bg-violet-500/30 border border-violet-500/40"
                  style={{ borderRadius: val }}
                />
                <div className="text-center">
                  <p className="text-[12px] font-semibold text-white/80">radii.{name}</p>
                  <p className="font-mono text-[11px] text-white/30">{val}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════ SHADOWS ════════════════════ */}
        <section id="Shadows">
          <SectionHeading id="Shadows">Shadows</SectionHeading>
          <div className="grid grid-cols-3 gap-6">
            {SHADOW_TOKENS.map(([name, val]) => (
              <div key={name} className="bg-card-dark border border-white/8 rounded-2xl p-8 flex flex-col items-center gap-6">
                <div
                  className="w-24 h-24 bg-white/10 rounded-xl"
                  style={{ boxShadow: val }}
                />
                <div className="text-center w-full">
                  <p className="text-[13px] font-semibold text-white/80 mb-1">shadows.{name}</p>
                  <p className="font-mono text-[10px] text-white/25 break-all leading-relaxed">{val}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════ TRANSITIONS ════════════════════ */}
        <section id="Transitions">
          <SectionHeading id="Transitions">Transitions</SectionHeading>
          <div className="grid grid-cols-3 gap-4">
            {TRANSITION_TOKENS.map(([name, val]) => (
              <div key={name} className="bg-card-dark border border-white/8 rounded-2xl p-8 flex flex-col items-center gap-6 group">
                <div
                  className="w-16 h-16 bg-violet-500/40 rounded-xl group-hover:scale-110 group-hover:bg-violet-500/70 group-hover:rounded-full"
                  style={{ transition: val }}
                />
                <div className="text-center">
                  <p className="text-[13px] font-semibold text-white/80 mb-1">transitions.{name}</p>
                  <p className="font-mono text-[11px] text-white/30">{val}</p>
                  <p className="text-[10px] text-white/20 mt-1">Hover to preview</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════ ANIMATIONS ════════════════════ */}
        <section id="Animations">
          <SectionHeading id="Animations">Animations</SectionHeading>

          {/* Entrance animations */}
          <p className="text-[11px] font-mono text-white/30 uppercase tracking-widest mb-4">Entrance</p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {ANIMATION_TOKENS.filter(([, v]) => v.category === 'entrance').map(([name, meta]) => (
              <AnimationCard key={name} name={name} meta={meta} />
            ))}
          </div>

          {/* Loop animations */}
          <p className="text-[11px] font-mono text-white/30 uppercase tracking-widest mb-4">Loop</p>
          <div className="grid grid-cols-3 gap-4">
            {ANIMATION_TOKENS.filter(([, v]) => v.category === 'loop').map(([name, meta]) => (
              <AnimationCard key={name} name={name} meta={meta} />
            ))}
          </div>
        </section>

        {/* ── Buttons ──────────────────────────────────────────────────────────── */}
        <section id="Buttons">
          <SectionHeading id="Buttons">Buttons</SectionHeading>

          {(() => {
            const SIZES = ['xs','sm','md','lg','xl','2xl'] as const;
            const GROUPS: { label: string; variants: { name: string; cls: string; bg: string; text: string }[] }[] = [
              {
                label: 'Secondary',
                variants: [
                  { name: 'Secondary',      cls: 'secondary',      bg: '#1A1A1A', text: '#fff' },
                  { name: 'Secondary Dark', cls: 'secondary-dark', bg: '#3D3D3D', text: '#fff' },
                  { name: 'Ghost',          cls: 'ghost',          bg: 'transparent', text: '#fff' },
                ],
              },
              {
                label: 'Primary',
                variants: [
                  { name: 'Primary',         cls: 'primary',         bg: '#5A45F9', text: '#fff' },
                  { name: 'Primary Hover',   cls: 'primary',         bg: '#3F26DC', text: '#fff' },
                  { name: 'Primary Soft',    cls: 'primary-soft',    bg: '#C0CAFF', text: '#ECF0FF' },
                  { name: 'Primary Subtle',  cls: 'primary-subtle',  bg: '#ECF0FF', text: '#5A45F9' },
                ],
              },
              {
                label: 'Danger',
                variants: [
                  { name: 'Danger',         cls: 'danger',         bg: '#F0526A', text: '#fff' },
                  { name: 'Danger Hover',   cls: 'danger',         bg: '#DB2347', text: '#fff' },
                  { name: 'Danger Soft',    cls: 'danger-soft',    bg: '#FAA7AF', text: '#FFF1F2' },
                  { name: 'Danger Subtle',  cls: 'danger-subtle',  bg: '#FFF1F2', text: '#F0526A' },
                ],
              },
              {
                label: 'Warning',
                variants: [
                  { name: 'Warning',         cls: 'warning',         bg: '#FDA221', text: '#fff' },
                  { name: 'Warning Hover',   cls: 'warning',         bg: '#F77F09', text: '#fff' },
                  { name: 'Warning Soft',    cls: 'warning-soft',    bg: '#FED789', text: '#FFF8EB' },
                  { name: 'Warning Subtle',  cls: 'warning-subtle',  bg: '#FFF8EB', text: '#FDA221' },
                ],
              },
              {
                label: 'Info',
                variants: [
                  { name: 'Info',         cls: 'info',         bg: '#1FBCFE', text: '#fff' },
                  { name: 'Info Hover',   cls: 'info',         bg: '#0088CD', text: '#fff' },
                  { name: 'Info Soft',    cls: 'info-soft',    bg: '#B8E8FF', text: '#F0F9FF' },
                  { name: 'Info Subtle',  cls: 'info-subtle',  bg: '#F0F9FF', text: '#1FBCFE' },
                ],
              },
              {
                label: 'Light',
                variants: [
                  { name: 'Light',            cls: 'light',           bg: '#FFFFFF', text: '#000' },
                  { name: 'Light Secondary',  cls: 'light-secondary', bg: '#DCDCDC', text: '#000' },
                  { name: 'Light Ghost',      cls: 'light-ghost',     bg: '#EFEFEF', text: '#000' },
                  { name: 'Neutral',          cls: 'neutral',         bg: '#BDBDBD', text: '#1A1A1A' },
                ],
              },
            ];

            return (
              <div className="rounded-2xl overflow-hidden border border-white/8">
                {/* ── Column size headers ── */}
                <div className="grid bg-[#111]" style={{ gridTemplateColumns: '180px repeat(6, 1fr)' }}>
                  <div className="px-5 py-3 border-b border-r border-white/8" />
                  {SIZES.map(s => (
                    <div key={s} className="px-3 py-3 border-b border-r border-white/8 last:border-r-0 text-center">
                      <span className="text-[11px] font-mono font-semibold text-white/50 uppercase tracking-widest">{s}</span>
                    </div>
                  ))}
                </div>

                {/* ── Groups ── */}
                {GROUPS.map((group, gi) => (
                  <div key={group.label}>
                    {/* group label row */}
                    <div className="grid bg-[#0D0D0D]" style={{ gridTemplateColumns: '180px repeat(6, 1fr)' }}>
                      <div className="col-span-7 px-5 py-2 border-b border-white/5">
                        <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/25">{group.label}</span>
                      </div>
                    </div>
                    {/* variant rows */}
                    {group.variants.map((v, vi) => (
                      <div
                        key={v.name}
                        className="grid bg-[#0A0A0A] hover:bg-[#0F0F0F] transition-colors"
                        style={{ gridTemplateColumns: '180px repeat(6, 1fr)' }}
                      >
                        {/* variant name + color swatch */}
                        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-r border-white/5">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-white/10"
                            style={{ background: v.bg === 'transparent' ? 'transparent' : v.bg, border: v.bg === 'transparent' ? '1px solid #353535' : 'none' }}
                          />
                          <span className="text-[11px] font-mono text-white/40 leading-tight">{v.name}</span>
                        </div>
                        {/* buttons in every size */}
                        {SIZES.map(s => (
                          <div key={s} className="flex items-center justify-center px-2 py-4 border-b border-r border-white/5 last:border-r-0">
                            <button className={`btn btn-${v.cls} btn-${s}`}>Button</button>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            );
          })()}
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/8 mt-24 py-8 text-center">
        <p className="text-[11px] text-white/20 font-mono">Travingat Design System · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
