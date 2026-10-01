import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-semibold leading-none",
  {
    variants: {
      variant: {
        neutral: "border-border bg-muted text-muted-foreground",
        info: "border-info-foreground/15 bg-info text-info-foreground",
        success: "border-success-foreground/15 bg-success text-success-foreground",
        warning: "border-warning-foreground/15 bg-warning text-warning-foreground",
        error: "border-error-foreground/15 bg-error text-error-foreground",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} data-slot="badge" {...props} />;
}

export { badgeVariants };
