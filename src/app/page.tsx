import type { Metadata } from "next";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Optical transceiver sourcing preview",
  description:
    "LoonLink is preparing a compatibility-first optical transceiver catalog for Canadian business buyers.",
  openGraph: {
    title: "LoonLink optical transceiver sourcing preview",
    description:
      "A public preview of LoonLink's planned compatibility-first optical transceiver experience.",
    type: "website",
  },
};

const buyingPrinciples = [
  {
    title: "Condition made explicit",
    description:
      "Future product offers are intended to state condition clearly instead of leaving buyers to infer it from a generic listing.",
  },
  {
    title: "Specifications, structured",
    description:
      "Essential optical properties will appear first, with complete engineering detail available progressively.",
  },
  {
    title: "Evidence-aware compatibility",
    description:
      "Compatibility conclusions will require recorded scope and provenance; uncertain evidence will not be presented as verified.",
  },
] as const;

export default function Home() {
  return (
    <>
      <Section className="pb-12 sm:pb-16 lg:pb-20">
        <Container>
          <div className="max-w-4xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Optical transceiver commerce
            </p>
            <h1 className="mt-6 text-balance text-5xl font-semibold tracking-[-0.04em] sm:text-6xl lg:text-7xl lg:leading-[1.02]">
              The right optic.
              <br />
              Without the guesswork.
            </h1>
            <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
              LoonLink is being developed to help businesses evaluate optical transceivers through clear technical specifications, transparent condition information, and evidence-aware compatibility.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="border-y border-border bg-surface py-12 sm:py-16" aria-labelledby="catalog-title">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
            <div className="max-w-3xl">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Public preview
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.025em] sm:text-4xl" id="catalog-title">
                Catalog coming soon.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                The initial catalog is being prepared and reviewed. No products, prices, stock levels, test results, or compatibility conclusions are published in this preview.
              </p>
            </div>
            <Link className={buttonVariants({ variant: "outline" })} href="/products">
              View catalog status
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </Section>

      <Section aria-labelledby="clarity-title" id="about">
        <Container>
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Buying clarity
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.025em] sm:text-4xl" id="clarity-title">
              Information before assumptions.
            </h2>
          </div>
          <div className="mt-10 grid gap-8 border-t border-border pt-8 md:grid-cols-3 md:gap-10">
            {buyingPrinciples.map((principle) => (
              <div key={principle.title}>
                <h3 className="text-base font-semibold">{principle.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-t border-border bg-surface" aria-labelledby="sourcing-title">
        <Container>
          <div className="rounded-lg border border-border bg-primary px-6 py-10 text-primary-foreground sm:px-10 sm:py-12 lg:flex lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-[-0.025em]" id="sourcing-title">
                Sourcing workflow preview
              </h2>
              <p className="mt-4 text-base leading-7 text-primary-foreground/80">
                See how a future request-for-quote path will be explained. The preview cannot submit information, reserve inventory, or establish a price.
              </p>
            </div>
            <Link
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "mt-7 border-primary-foreground/25 bg-primary-foreground text-primary hover:bg-primary-foreground/90 lg:mt-0",
              )}
              href="/request-quote"
            >
              View sourcing preview
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
