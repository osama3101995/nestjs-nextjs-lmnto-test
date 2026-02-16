import { clsx } from "clsx";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className,
  ...props
}) => {
  const base = "px-4 py-2 rounded font-medium transition-colors";
  const styles =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-gray-200 text-black hover:bg-gray-300";

  return (
    <button className={clsx(base, styles, className)} {...props}>
      {children}
    </button>
  );
};
