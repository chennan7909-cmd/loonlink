import type { Metadata } from "next";

import { CatalogExplorer } from "@/components/catalog/catalog-explorer";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { fixtureCatalogNotice } from "@/features/catalog/public-fixtures";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse LoonLink's development fixture catalog by part number and essential optical specifications.",
};

type ProductsPageProps = Readonly<{
  searchParams: Promise<{ q?: string | string[] }>;
}>;

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const query = (await searchParams).q;
  const initialQuery = Array.isArray(query) ? (query[0] ?? "") : (query ?? "");

  return (
    <Section>
      <Container>
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Curated catalog preview
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
            Products
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Find a fixture product by part number, manufacturer, or a small set of useful technical attributes.
          </p>
          <p className="mt-5 inline-flex rounded-md border border-border bg-muted/55 px-3 py-2 text-xs font-medium text-muted-foreground">
            {fixtureCatalogNotice}. Results do not represent current stock.
          </p>
        </div>
        <div className="mt-10">
          <CatalogExplorer initialQuery={initialQuery} />
        </div>
      </Container>
    </Section>
  );
}
