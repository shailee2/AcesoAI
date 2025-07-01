import type * as React from "react"
import { cn } from "@/lib/utils"

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-2xl border shadow-xl backdrop-blur-sm", className)}
      style={{
        backgroundColor: "#1c1c1c", // Dark grey background
        borderColor: "#333333", // Dark border
      }}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 border-b", className)} style={{ borderColor: "#333333" }} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <h3 className={cn("text-xl font-bold", className)} style={{ color: "#ededed" }} {...props} />
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />
}
