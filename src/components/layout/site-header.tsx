import { Search } from "lucide-react";
import Link from "next/link";

import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { primaryNavigation } from "@/components/layout/navigation";
import { Container } from "@/components/ui/container";

const navigationLinkClassName =
  "rounded-sm text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:ring-offset-4";

export function SiteHeader() {
  return (
    <header className="relative z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link
          className="rounded-sm text-lg font-semibold tracking-[-0.025em] outline-none focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:ring-offset-4"
          href="/"
        >
          LoonLink
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <nav aria-label="Primary" className="flex items-center gap-6">
            {primaryNavigation.map((item) => (
              <Link className={navigationLinkClassName} href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            aria-label="Search"
            className={`${navigationLinkClassName} inline-flex size-9 items-center justify-center`}
            href="/products"
          >
            <Search aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <MobileNavigation />
      </Container>
    </header>
  );
}
