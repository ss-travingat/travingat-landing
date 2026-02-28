import React from 'react';

// ─── Variant / Size maps ──────────────────────────────────────────────────────

const VARIANT_CLASSES: Record<string, string> = {
  // ── Full-color filled ──
  primary:          'bg-[#5A45F9] text-white hover:bg-[#3F26DC] active:scale-[0.98]',
  'primary-soft':   'bg-[#C0CAFF] text-[#ECF0FF] hover:bg-[#9CAAFF] active:scale-[0.98]',
  'primary-subtle': 'bg-[#ECF0FF] text-[#5A45F9] hover:bg-[#C0CAFF] active:scale-[0.98]',
  secondary:        'bg-[#1A1A1A] text-white border border-[#353535] hover:bg-[#303030] active:scale-[0.98]',
  'secondary-dark': 'bg-[#3D3D3D] text-white hover:bg-[#303030] active:scale-[0.98]',
  ghost:            'bg-transparent text-white border border-[#353535] hover:bg-white/5 active:scale-[0.98]',
  danger:           'bg-[#F0526A] text-white hover:bg-[#DB2347] active:scale-[0.98]',
  'danger-soft':    'bg-[#FAA7AF] text-[#FFF1F2] hover:bg-[#F87F8A] active:scale-[0.98]',
  'danger-subtle':  'bg-[#FFF1F2] text-[#F0526A] hover:bg-[#FAA7AF] active:scale-[0.98]',
  warning:          'bg-[#FDA221] text-white hover:bg-[#F77F09] active:scale-[0.98]',
  'warning-soft':   'bg-[#FED789] text-[#FFF8EB] hover:bg-[#FDCA55] active:scale-[0.98]',
  'warning-subtle': 'bg-[#FFF8EB] text-[#FDA221] hover:bg-[#FED789] active:scale-[0.98]',
  info:             'bg-[#1FBCFE] text-white hover:bg-[#0088CD] active:scale-[0.98]',
  'info-soft':      'bg-[#B8E8FF] text-[#F0F9FF] hover:bg-[#8DD8FF] active:scale-[0.98]',
  'info-subtle':    'bg-[#F0F9FF] text-[#1FBCFE] hover:bg-[#B8E8FF] active:scale-[0.98]',
  // ── Light / neutral ──
  light:            'bg-white text-black hover:bg-[#DCDCDC] active:scale-[0.98]',
  'light-secondary':'bg-[#DCDCDC] text-black hover:bg-[#BDBDBD] active:scale-[0.98]',
  'light-ghost':    'bg-[#EFEFEF] text-black hover:bg-[#DCDCDC] active:scale-[0.98]',
  neutral:          'bg-[#BDBDBD] text-[#1A1A1A] hover:bg-[#A0A0A0] active:scale-[0.98]',
};

const SIZE_CLASSES: Record<string, string> = {
  xs:  'h-8  px-3   text-xs  gap-1.5',
  sm:  'h-9  px-4   text-sm  gap-2',
  md:  'h-10 px-5   text-sm  gap-2',
  lg:  'h-11 px-6   text-base gap-2.5',
  xl:  'h-12 px-7   text-base gap-2.5',
  '2xl': 'h-14 px-9 text-lg  gap-3',
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant = keyof typeof VARIANT_CLASSES;
export type ButtonSize    = keyof typeof SIZE_CLASSES;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Render as a full-width block button */
  fullWidth?: boolean;
  /** Leading icon slot */
  leftIcon?: React.ReactNode;
  /** Trailing icon slot */
  rightIcon?: React.ReactNode;
  /** Show loading spinner and disable interactions */
  loading?: boolean;
  /** Render as an anchor */
  as?: 'button' | 'a';
  href?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      leftIcon,
      rightIcon,
      loading = false,
      disabled,
      className = '',
      children,
      as: Tag = 'button',
      href,
      ...props
    },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap ' +
      'transition-all duration-150 select-none focus-visible:outline-none ' +
      'focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 ' +
      'focus-visible:ring-offset-black disabled:opacity-40 disabled:pointer-events-none';

    const classes = [
      base,
      VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.primary,
      SIZE_CLASSES[size] ?? SIZE_CLASSES.md,
      fullWidth ? 'w-full' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const content = (
      <>
        {loading ? (
          <svg
            className="animate-spin-slow w-4 h-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : leftIcon ? (
          <span className="shrink-0 w-4 h-4 flex items-center justify-center">{leftIcon}</span>
        ) : null}
        {children && <span>{children}</span>}
        {rightIcon && !loading && (
          <span className="shrink-0 w-4 h-4 flex items-center justify-center">{rightIcon}</span>
        )}
      </>
    );

    if (Tag === 'a') {
      return (
        <a href={href} className={classes} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
