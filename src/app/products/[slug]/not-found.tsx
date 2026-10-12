import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export default function ProductNotFound() {
  return (
    <Section>
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Catalog status
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
            Catalog item unavailable.
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Individual product listings are not published in this preview. The reviewed catalog is coming soon.
          </p>
          <Link className={`${buttonVariants({ variant: "outline" })} mt-8`} href="/products">
            View catalog status
          </Link>
        </div>
      </Container>
    </Section>
  );
}
