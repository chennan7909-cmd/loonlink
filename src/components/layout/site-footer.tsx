import Link from "next/link";

import { Container } from "@/components/ui/container";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <Container className="grid gap-8 py-10 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <Link className="text-base font-semibold tracking-tight" href="/">
            LoonLink
          </Link>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Compatibility-first optical transceiver commerce. Storefront preview only.
          </p>
        </div>
        <div className="text-sm text-muted-foreground sm:text-right">
          <p>Initial focus: Canadian B2B buyers</p>
          <p className="mt-1">No purchasing services are available yet.</p>
        </div>
      </Container>
    </footer>
  );
}
