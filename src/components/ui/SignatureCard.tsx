import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SignatureCardProps {
  children: React.ReactNode;
  variant?: "coral" | "forest" | "navy" | "cream";
  className?: string;
  padding?: "md" | "lg" | "none";
}

const SignatureCard = ({
  children,
  variant = "navy",
  className,
  padding = "lg",
}: SignatureCardProps) => {
  const variants = {
    coral: "bg-signature-coral text-white",
    forest: "bg-signature-forest text-white",
    navy: "bg-signature-navy text-white",
    cream: "bg-signature-cream text-ink",
  };

  const paddings = {
    none: "p-0",
    md: "p-8",
    lg: "p-12 md:p-16",
  };

  return (
    <div
      className={cn(
        "w-full max-w-7xl mx-auto rounded-lg overflow-hidden", // 12px rounding
        variants[variant],
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  );
};

export { SignatureCard };
