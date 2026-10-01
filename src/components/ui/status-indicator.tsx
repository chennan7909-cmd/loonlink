import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const statusIndicatorVariants = cva(
  "inline-flex w-fit items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium",
  {
    variants: {
      tone: {
        neutral: "border-border bg-muted text-foreground",
        info: "border-info-foreground/15 bg-info text-info-foreground",
        success: "border-success-foreground/15 bg-success text-success-foreground",
        warning: "border-warning-foreground/15 bg-warning text-warning-foreground",
        error: "border-error-foreground/15 bg-error text-error-foreground",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

type StatusIndicatorProps = ComponentProps<"span"> & VariantProps<typeof statusIndicatorVariants>;

export function StatusIndicator({ children, className, tone, ...props }: StatusIndicatorProps) {
  return (
    <span
      className={cn(statusIndicatorVariants({ tone }), className)}
      data-slot="status-indicator"
      {...props}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
