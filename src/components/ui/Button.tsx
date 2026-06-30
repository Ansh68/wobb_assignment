import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "ghost" | "danger" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isActive?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "ui-btn-primary",
  ghost: "ui-btn-ghost",
  danger: "ui-btn-danger",
  outline: "ui-btn-outline",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "ui-btn-sm",
  md: "ui-btn-md",
  lg: "ui-btn-lg",
};

/**
 * Reusable button component with design-system variants.
 * Uses CSS classes defined in index.css for full theming support.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "ghost", size = "md", isActive, className, children, disabled, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "ui-btn",
          variantStyles[variant],
          sizeStyles[size],
          isActive && "ui-btn-active",
          disabled && "ui-btn-disabled",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
