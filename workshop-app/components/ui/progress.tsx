"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    indicatorClassName?: string
    showValue?: boolean
    variant?: "default" | "success" | "warning" | "danger" | "gradient"
  }
>(({ className, value, indicatorClassName, showValue, variant = "default", ...props }, ref) => (
  <div className="relative">
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-muted",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full transition-all duration-500 ease-out",
          {
            "bg-primary": variant === "default",
            "bg-success": variant === "success",
            "bg-warning": variant === "warning",
            "bg-destructive": variant === "danger",
            "bg-gradient-to-r from-primary via-cyan-400 to-primary": variant === "gradient",
          },
          indicatorClassName
        )}
        style={{ width: `${value || 0}%` }}
      />
    </ProgressPrimitive.Root>
    {showValue && (
      <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground ml-2">
        {value}%
      </span>
    )}
  </div>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
