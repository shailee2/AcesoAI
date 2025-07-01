import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-xl border-2 px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all duration-200",
        className,
      )}
      style={{
        backgroundColor: "#1c1c1c",
        borderColor: "#333333",
        color: "#ededed",
        ["--placeholder-color" as any]: "#aaaaaa",
      }}
      {...props}
    />
  )
})
Input.displayName = "Input"
