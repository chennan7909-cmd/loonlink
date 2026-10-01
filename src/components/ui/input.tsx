import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Input({ className, type = "text", ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-border bg-surface px-3.5 text-base text-foreground shadow-[0_1px_1px_rgb(15_23_42_/_0.03)] outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70 aria-invalid:border-error aria-invalid:ring-3 aria-invalid:ring-error/15 sm:text-sm",
        className,
      )}
      data-slot="input"
      type={type}
      {...props}
    />
  );
}
