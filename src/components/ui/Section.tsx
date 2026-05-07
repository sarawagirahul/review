import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: React.ElementType;
}

const Section = ({ children, className, id, as: Component = "section" }: SectionProps) => {
  return (
    <Component
      id={id}
      className={cn("py-section px-6 md:px-12 w-full", className)}
    >
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </Component>
  );
};

export { Section };
