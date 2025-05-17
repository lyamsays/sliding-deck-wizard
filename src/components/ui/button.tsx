
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case "outline":
          return "border border-gray-300 bg-transparent hover:bg-gray-100";
        case "ghost":
          return "bg-transparent hover:bg-gray-100";
        default:
          return "bg-blue-600 text-white hover:bg-blue-700";
      }
    };

    const getSizeClasses = () => {
      switch (size) {
        case "sm":
          return "py-1 px-3 text-sm";
        case "lg":
          return "py-3 px-6 text-lg";
        default:
          return "py-2 px-4";
      }
    };

    return (
      <button
        ref={ref}
        className={`rounded font-medium transition-colors ${getVariantClasses()} ${getSizeClasses()} ${className || ""}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
