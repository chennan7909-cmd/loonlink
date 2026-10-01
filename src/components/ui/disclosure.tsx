import { ChevronDown } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

type DisclosureProps = Omit<ComponentProps<"details">, "title"> & {
  title: ReactNode;
};

export function Disclosure({ children, className, title, ...props }: DisclosureProps) {
  return (
    <details
      className={cn(
        "group rounded-lg border border-border bg-surface open:shadow-[0_1px_2px_rgb(15_23_42_/_0.04)]",
        className,
      )}
      data-slot="disclosure"
      {...props}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg px-5 py-4 text-sm font-semibold outline-none marker:hidden focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="border-t border-border px-5 py-5 text-sm leading-6 text-muted-foreground">
        {children}
      </div>
    </details>
  );
}
