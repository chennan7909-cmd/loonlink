import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Section({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn("py-14 sm:py-20 lg:py-24", className)} data-slot="section" {...props} />;
}
