import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transform hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default: "text-white shadow-lg hover-glow",
        outline: "border-2 text-white hover:text-white transition-all duration-200",
        ghost: "hover:bg-gray-800",
        secondary: "text-white shadow-lg",
        success: "text-white shadow-lg",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 text-lg font-bold",
        default: "h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, style, ...props }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case "default":
          return { backgroundColor: "#ff3c38", color: "#ededed" }
        case "outline":
          return { borderColor: "#ff3c38", color: "#ff3c38" }
        case "secondary":
          return { backgroundColor: "#ffc857", color: "#0f0f0f" }
        case "success":
          return { backgroundColor: "#21d375", color: "#ededed" }
        case "ghost":
          return { color: "#aaaaaa" }
        default:
          return { backgroundColor: "#ff3c38", color: "#ededed" }
      }
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        style={{ ...getVariantStyles(), ...style }}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"
