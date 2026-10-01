import type { Metadata } from "next";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ProductCard } from "@/components/catalog/product-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SearchInput } from "@/components/ui/search-input";
import { Section } from "@/components/ui/section";
import {
  fixtureCatalogNotice,
  publicProductFixtures,
} from "@/features/catalog/public-fixtures";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Optical transceiver storefront preview",
  description:
    "Explore LoonLink's fixture storefront for optical transceiver discovery, structured specifications, and evidence-aware compatibility information.",
};

const buyingPrinciples = [
  {
    title: "Condition made explicit",
    description:
      "Product offers are designed to state condition clearly instead of leaving buyers to infer it from a generic listing.",
  },
  {
    title: "Specifications, structured",
    description:
      "Essential optical properties appear first, with complete engineering detail available progressively.",
  },
  {
    title: "Evidence-aware compatibility",
    description:
      "Future compatibility conclusions will show their scope and provenance; uncertain evidence will not be presented as verified.",
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
              Discover optical transceivers through clear technical specifications, transparent condition information, and compatibility evidence where it is available.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="border-y border-border bg-surface py-10 sm:py-14" aria-labelledby="search-title">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.65fr)_minmax(26rem,1.35fr)] lg:items-end lg:gap-16">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.02em]" id="search-title">
                Find a part
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Search the development fixture catalog by part number, manufacturer, or model reference.
              </p>
            </div>
            <form action="/products" className="flex flex-col gap-3 sm:flex-row" method="get">
              <SearchInput
                containerClassName="flex-1"
                label="Search by part number or model"
                name="q"
                placeholder="Search by part number or model"
              />
              <Button className="sm:self-stretch" type="submit">
                Search products
              </Button>
            </form>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Fixture examples: Cisco GLC-SX-MM · Juniper 740-031981
          </p>
        </Container>
      </Section>

      <Section aria-labelledby="inventory-title" id="products">
        <Container>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Available inventory · fixture preview
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.025em] sm:text-4xl" id="inventory-title">
                A focused starting point.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                A small catalog, presented with the information needed to compare products clearly.
              </p>
            </div>
            <Link className={buttonVariants({ variant: "outline" })} href="/products">
              View all fixture products
            </Link>
          </div>
          <p className="mt-8 inline-flex rounded-md border border-border bg-muted/55 px-3 py-2 text-xs font-medium text-muted-foreground">
            {fixtureCatalogNotice}. Availability, pricing, and testing are not connected.
          </p>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {publicProductFixtures.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-y border-border bg-surface" aria-labelledby="clarity-title" id="about">
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

      <Section aria-labelledby="sourcing-title">
        <Container>
          <div className="rounded-lg border border-border bg-primary px-6 py-10 text-primary-foreground sm:px-10 sm:py-12 lg:flex lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-[-0.025em]" id="sourcing-title">
                Can&apos;t find your part?
              </h2>
              <p className="mt-4 text-base leading-7 text-primary-foreground/80">
                Tell us the part number and quantity you&apos;re looking for. The sourcing request workflow is preview-only in this phase.
              </p>
            </div>
            <Link
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "mt-7 border-primary-foreground/25 bg-primary-foreground text-primary hover:bg-primary-foreground/90 lg:mt-0",
              )}
              href="/request-quote"
            >
              Preview request sourcing
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
