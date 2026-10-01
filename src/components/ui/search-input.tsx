import { Search } from "lucide-react";
import type { ComponentProps } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchInputProps = ComponentProps<"input"> & {
  label: string;
  containerClassName?: string;
};

export function SearchInput({
  className,
  containerClassName,
  label,
  ...props
}: SearchInputProps) {
  return (
    <label className={cn("relative block", containerClassName)}>
      <span className="sr-only">{label}</span>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input className={cn("pl-10", className)} type="search" {...props} />
    </label>
  );
}
