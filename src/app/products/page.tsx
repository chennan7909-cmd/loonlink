import type { Metadata } from "next";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Catalog coming soon",
  description:
    "LoonLink's reviewed optical transceiver catalog is being prepared and is not yet published.",
  openGraph: {
    title: "LoonLink catalog coming soon",
    description:
      "The LoonLink optical transceiver catalog is being prepared for a future release.",
    type: "website",
  },
};

export default function ProductsPage() {
  return (
    <Section>
      <Container>
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Catalog status
          </p>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
            Catalog coming soon.
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            LoonLink is preparing its initial optical transceiver catalog. Product identity, condition, technical specifications, testing records, and compatibility evidence must be reviewed before anything is published here.
          </p>
          <div className="mt-10 rounded-lg border border-border bg-surface p-6 sm:p-8">
            <h2 className="text-xl font-semibold tracking-tight">Nothing is offered for sale yet</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              This public preview contains no live inventory, prices, stock quantities, test results, compatibility conclusions, checkout, or purchasing services.
            </p>
          </div>
          <Link className={`${buttonVariants({ variant: "outline" })} mt-8`} href="/compatibility">
            Preview compatibility approach
          </Link>
        </div>
      </Container>
    </Section>
  );
}
