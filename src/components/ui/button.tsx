import * as React from "react";
import { clsx } from "clsx";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        className={clsx(
          "inline-flex items-center justify-center rounded-xl border transition-colors",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/15",
          "disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-white/5 border-white/12 text-white/80 hover:bg-white/10 hover:text-white":
              variant === "default",
            "border-white/12 text-white/80 hover:bg-white/10 hover:text-white":
              variant === "outline",
            "border-transparent text-white/80 hover:bg-white/10 hover:text-white":
              variant === "ghost",
            "h-8 px-3 text-xs": size === "sm",
            "h-10 px-4 text-sm": size === "md",
            "h-12 px-6 text-base": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

