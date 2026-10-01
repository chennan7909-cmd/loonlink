import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Link from "next/link";

import { ProductMediaPlaceholder } from "@/components/catalog/product-media-placeholder";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Disclosure } from "@/components/ui/disclosure";
import { Section } from "@/components/ui/section";
import { TechnicalMetadataRow } from "@/components/ui/technical-metadata-row";
import {
  getPublicProductFixture,
  publicProductFixtures,
} from "@/features/catalog/public-fixtures";
import { cn } from "@/lib/utils";

type ProductDetailPageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export const dynamicParams = false;

export function generateStaticParams() {
  return publicProductFixtures.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const product = getPublicProductFixture((await params).slug);

  if (!product) return { title: "Product not found" };

  return {
    title: `${product.manufacturer} ${product.partNumber}`,
    description: `${product.identity} development fixture with essential optical specifications. Not a live inventory listing.`,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = getPublicProductFixture((await params).slug);
  if (!product) notFound();

  return (
    <>
      <Section className="pb-12 sm:pb-16">
        <Container>
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <ol className="flex items-center gap-2">
              <li><Link className="hover:text-foreground" href="/products">Products</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{product.partNumber}</li>
            </ol>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(20rem,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-16">
            <ProductMediaPlaceholder
              className="rounded-lg border border-border lg:aspect-[4/3]"
              partNumber={product.partNumber}
            />
            <div>
              <p className="text-sm font-medium text-muted-foreground">{product.manufacturer}</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
                {product.partNumber}
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">{product.identity}</p>
              <p className="mt-5 inline-flex rounded-md border border-border bg-muted/55 px-3 py-2 text-xs font-medium text-muted-foreground">
                Development fixture · not live inventory
              </p>
              <div className="mt-8 border-y border-border py-6">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Condition
                </p>
                <p className="mt-2 text-base font-semibold">{product.conditionDisplay}</p>
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Pricing
                </p>
                <p className="mt-2 text-lg font-semibold">{product.pricingDisplay}</p>
              </div>
              <Link
                className={cn(buttonVariants({ size: "lg" }), "mt-8")}
                href="/request-quote"
              >
                View sourcing preview
              </Link>
              <p className="mt-4 max-w-lg text-xs leading-5 text-muted-foreground">
                {product.testingDisplay}. No request is submitted, and no stock or price is established in this preview.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="border-y border-border bg-surface" aria-labelledby="essential-specs-title">
        <Container className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Essential specifications
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.025em]" id="essential-specs-title">
              The decision-level details.
            </h2>
          </div>
          <dl>
            <TechnicalMetadataRow label="Data rate" value={product.essentialSpecs.dataRate} />
            <TechnicalMetadataRow label="Reach" value={product.essentialSpecs.reach} />
            <TechnicalMetadataRow label="Fiber" value={product.essentialSpecs.fiberType} />
            <TechnicalMetadataRow label="Wavelength" value={product.essentialSpecs.wavelength} />
            <TechnicalMetadataRow label="Connector" value={product.essentialSpecs.connector} />
          </dl>
        </Container>
      </Section>

      <Section aria-labelledby="details-title">
        <Container>
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Progressive detail
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.025em]" id="details-title">
              Review more when you need it.
            </h2>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <Disclosure title="Additional technical specifications">
              <dl>
                <TechnicalMetadataRow label="Form factor" value={product.essentialSpecs.formFactor} />
                {product.additionalSpecs.map((spec) => (
                  <TechnicalMetadataRow key={spec.label} label={spec.label} value={spec.value} />
                ))}
              </dl>
            </Disclosure>
            <Disclosure title="Testing information">
              <p>
                Illustrative fixture only. No test event, method, measured value, result, or tester record is connected in Phase 1C, so this page makes no testing claim.
              </p>
            </Disclosure>
            <Disclosure title="Compatibility evidence">
              <p>
                No compatibility conclusion or evidence record is connected in Phase 1C. Shared optical specifications do not establish host compatibility.
              </p>
              <Link className="mt-4 inline-flex font-semibold text-primary hover:underline" href="/compatibility">
                Preview the compatibility workflow
              </Link>
            </Disclosure>
            <Disclosure title="Product notes">
              <p>{product.publicNotes}</p>
            </Disclosure>
          </div>
        </Container>
      </Section>
    </>
  );
}
