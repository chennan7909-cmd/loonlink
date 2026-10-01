import { cn } from "@/lib/utils";

type ProductMediaPlaceholderProps = Readonly<{
  partNumber: string;
  className?: string;
}>;

export function ProductMediaPlaceholder({
  className,
  partNumber,
}: ProductMediaPlaceholderProps) {
  return (
    <div
      aria-label={`Reserved product photography area for ${partNumber}`}
      className={cn(
        "flex aspect-[5/3] items-center justify-center overflow-hidden border-b border-border bg-muted/55 p-6 text-center",
        className,
      )}
      role="img"
    >
      <div>
        <div aria-hidden="true" className="mx-auto flex w-28 items-center">
          <span className="h-8 w-4 rounded-l-sm border border-border bg-surface" />
          <span className="h-12 flex-1 rounded-r-sm border border-l-0 border-border bg-surface" />
        </div>
        <p className="mt-4 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Product photography
        </p>
      </div>
    </div>
  );
}
