import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

type TechnicalMetadataRowProps = ComponentProps<"div"> & {
  label: string;
  value: ReactNode;
};

export function TechnicalMetadataRow({
  className,
  label,
  value,
  ...props
}: TechnicalMetadataRowProps) {
  return (
    <div
      className={cn(
        "grid gap-1 border-b border-border py-3 last:border-b-0 sm:grid-cols-[minmax(8rem,0.65fr)_1fr] sm:gap-6",
        className,
      )}
      data-slot="technical-metadata-row"
      {...props}
    >
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="m-0 text-sm font-medium text-foreground sm:text-right">{value}</dd>
    </div>
  );
}
