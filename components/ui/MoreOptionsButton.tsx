import React from "react";

export interface MoreOptionsButtonProps {
  isOpen: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
  showOnHover?: boolean;
  positioned?: boolean;
}

/**
 * A reusable 3-dot menu button component with consistent styling across the application.
 *
 * @param isOpen - Whether the menu is currently open
 * @param onClick - Callback when button is clicked
 * @param label - Accessibility label (default: "More options")
 * @param size - Button size: "sm" (small), "md" (medium), "lg" (large)
 * @param showOnHover - If true, button only shows on hover on desktop (default: true)
 * @param positioned - If true, uses absolute positioning (for media items); if false, uses inline styling (default: true)
 *
 * @example
 * ```tsx
 * // For media items (with hover behavior):
 * <MoreOptionsButton
 *   isOpen={isMenuOpen}
 *   onClick={handleMenuToggle}
 *   size="sm"
 *   showOnHover={true}
 *   positioned={true}
 * />
 *
 * // For headers/inline (no hover):
 * <MoreOptionsButton
 *   isOpen={isMenuOpen}
 *   onClick={handleMenuToggle}
 *   size="sm"
 *   positioned={false}
 * />
 * ```
 */
export function MoreOptionsButton({
  isOpen,
  onClick,
  label = "More options",
  size = "md",
  showOnHover = true,
  positioned = true,
}: MoreOptionsButtonProps) {
  // Size configurations
  const sizeConfig = {
    sm: {
      button: "h-6 w-6 md:h-7 md:w-7",
      dot: "h-0.75 w-0.75",
      gap: "gap-0.5",
    },
    md: {
      button: "h-8 w-8 md:h-9 md:w-9",
      dot: "h-1 w-1",
      gap: "gap-1",
    },
    lg: {
      button: "h-8 w-8 md:h-11 md:w-11",
      dot: "h-1.5 w-1.5",
      gap: "gap-2",
    },
  };

  const config = sizeConfig[size];

  const visibilityClassName = showOnHover
    ? isOpen
      ? "opacity-100"
      : "opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
    : "opacity-100";

  const positionClassName = positioned
    ? "absolute right-3 bottom-3 z-20 hidden md:flex"
    : "hidden md:flex";

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`${positionClassName} ${config.button} items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${visibilityClassName}`}
    >
      <span className={`flex items-center ${config.gap}`}>
        <span className={`block ${config.dot} rounded-full bg-white`} />
        <span className={`block ${config.dot} rounded-full bg-white`} />
        <span className={`block ${config.dot} rounded-full bg-white`} />
      </span>
    </button>
  );
}
