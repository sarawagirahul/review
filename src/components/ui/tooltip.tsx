"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TooltipProps {
  children: React.ReactNode
  content: string
  className?: string
}

export function Tooltip({ children, content, className }: TooltipProps) {
  return (
    <span className="relative group inline-flex">
      {children}
      <span
        className={cn(
          "pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50",
          "whitespace-nowrap rounded-md bg-ink px-2.5 py-1.5 text-xs text-white shadow-md",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-150",
          className
        )}
      >
        {content}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-ink" />
      </span>
    </span>
  )
}
