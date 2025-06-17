import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
}

export const Progress = ({ value = 0, className, ...props }: ProgressProps) => {
  return (
    <div className={cn("w-full h-2 bg-gray-200 rounded-full", className)} {...props}>
      <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${value}%` }} />
    </div>
  )
}
