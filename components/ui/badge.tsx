import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary"
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const base = "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold"
  const variants = {
    default: "bg-blue-600 text-white",
    secondary: "bg-gray-200 text-gray-900",
  }

  return <div className={cn(base, variants[variant], className)} {...props} />
}
