"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { forwardRef, type ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-sans font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-white-50 text-black-950 hover:bg-white-100 disabled:bg-white-200 disabled:text-white-400",
        secondary:
          "bg-black-500 text-white-50 border border-black-200 hover:bg-black-600 hover:border-black-200 disabled:bg-black-900 disabled:text-white-900 disabled:border-black-700",
        violet:
          "bg-violet-600 text-white hover:bg-violet-700 disabled:bg-violet-200 disabled:text-violet-50",
        coral:
          "bg-coral-500 text-white hover:bg-coral-600 disabled:bg-coral-300 disabled:text-coral-50",
        amber:
          "bg-amber-400 text-white hover:bg-amber-500 disabled:bg-amber-200 disabled:text-amber-50",
        cyan:
          "bg-cyan-400 text-white hover:bg-cyan-600 disabled:bg-cyan-200 disabled:text-cyan-50",
        ghost:
          "bg-transparent text-white hover:bg-transparent disabled:text-white-900",
      },
      size: {
        xs: "h-[2rem] px-[0.5rem] py-[0.5rem] text-[0.75rem] leading-[1rem] tracking-[0rem]",
        sm: "h-[2.25rem] px-[0.75rem] py-[0.5rem] text-[0.875rem] leading-[1.25rem] tracking-[-0.0375rem]",
        md: "h-[2.5rem] px-[1rem] py-[0.625rem] text-[0.875rem] leading-[1.25rem] tracking-[-0.0375rem]",
        lg: "h-[2.75rem] px-[1.125rem] py-[0.625rem] text-[1rem] leading-[1.5rem] tracking-[-0.0375rem]",
        xl: "h-[3rem] px-[1.25rem] py-[0.75rem] text-[1rem] leading-[1.5rem] tracking-[-0.0375rem]",
        "2xl": "h-[3.625rem] px-[1.5rem] py-[1rem] text-[1.125rem] leading-[1.625rem] tracking-[-0.06875rem]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, loading = false, disabled, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={clsx(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="size-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
});

export { Button, buttonVariants };
export type { ButtonProps };
