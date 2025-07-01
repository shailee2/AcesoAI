import type * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  variant?: "workout" | "progress" | "nutrition" | "default"
}

export const Progress = ({ value = 0, variant = "default", className, style, ...props }: ProgressProps) => {
  const getProgressColor = () => {
    switch (variant) {
      case "workout":
        return "linear-gradient(90deg, #ff3c38, #ff8c42)"
      case "progress":
        return "linear-gradient(90deg, #3b82f6, #8b5cf6)"
      case "nutrition":
        return "linear-gradient(90deg, #21d375, #228b22)"
      default:
        return "linear-gradient(90deg, #ff3c38, #ff8c42)"
    }
  }

  return (
    <div
      className={cn("w-full h-3 rounded-full overflow-hidden", className)}
      style={{ backgroundColor: "#333333", ...style }}
      {...props}
    >
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          background: getProgressColor(),
        }}
      />
    </div>
  )
}
