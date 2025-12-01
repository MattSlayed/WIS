import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/10 text-primary",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive/10 text-destructive",
        success:
          "border-transparent bg-success/10 text-success",
        warning:
          "border-transparent bg-warning/10 text-warning",
        outline:
          "border-border text-foreground",
        glow:
          "border-primary/30 bg-primary/10 text-primary shadow-glow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
  dotColor?: "default" | "success" | "warning" | "destructive"
}

function Badge({ className, variant, dot, dotColor = "default", children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "mr-1.5 h-1.5 w-1.5 rounded-full",
            {
              "bg-primary": dotColor === "default",
              "bg-success animate-pulse": dotColor === "success",
              "bg-warning animate-pulse": dotColor === "warning",
              "bg-destructive animate-pulse": dotColor === "destructive",
            }
          )}
        />
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
