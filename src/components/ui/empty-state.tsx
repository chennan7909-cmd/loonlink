import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = ComponentProps<"div"> & {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({
  action,
  className,
  description,
  title,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start rounded-lg border border-dashed border-border bg-muted/35 p-6 sm:p-8",
        className,
      )}
      data-slot="empty-state"
      {...props}
    >
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
