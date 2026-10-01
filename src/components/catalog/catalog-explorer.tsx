"use client";

import { useMemo, useState } from "react";

import { ProductCard } from "@/components/catalog/product-card";
import { Button } from "@/components/ui/button";
import { Disclosure } from "@/components/ui/disclosure";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import {
  filterPublicProductFixtures,
  publicProductFixtures,
} from "@/features/catalog/public-fixtures";

type CatalogExplorerProps = Readonly<{
  initialQuery?: string;
}>;

const selectClassName =
  "h-11 w-full rounded-md border border-border bg-surface px-3.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20";

export function CatalogExplorer({ initialQuery = "" }: CatalogExplorerProps) {
  const [query, setQuery] = useState(initialQuery);
  const [manufacturer, setManufacturer] = useState("all");
  const [dataRate, setDataRate] = useState("all");

  const filteredProducts = useMemo(
    () => filterPublicProductFixtures({ dataRate, manufacturer, query }),
    [dataRate, manufacturer, query],
  );
  const activeFilterCount =
    Number(manufacturer !== "all") + Number(dataRate !== "all");

  function clearFilters() {
    setQuery("");
    setManufacturer("all");
    setDataRate("all");
  }

  return (
    <div>
      <div className="rounded-lg border border-border bg-surface p-5 sm:p-6">
        <div className="max-w-3xl">
          <p aria-hidden="true" className="mb-2 text-sm font-medium">
            Search by part number or model
          </p>
          <SearchInput
            label="Search fixture products"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Part number, manufacturer, or model"
            value={query}
          />
        </div>
        <Disclosure
          className="mt-4 bg-background"
          title={
            <span className="flex items-center gap-2">
              Filters
              {activeFilterCount > 0 ? (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                  {activeFilterCount} active
                </span>
              ) : null}
            </span>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[13rem_11rem_auto] lg:items-end">
            <label className="grid gap-2 text-sm font-medium text-foreground">
              Manufacturer
              <select
                className={selectClassName}
                onChange={(event) => setManufacturer(event.target.value)}
                value={manufacturer}
              >
                <option value="all">All manufacturers</option>
                <option value="Cisco">Cisco</option>
                <option value="Juniper">Juniper</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-foreground">
              Data rate
              <select
                className={selectClassName}
                onChange={(event) => setDataRate(event.target.value)}
                value={dataRate}
              >
                <option value="all">All data rates</option>
                <option value="1 Gbps">1 Gbps</option>
                <option value="10 Gbps">10 Gbps</option>
              </select>
            </label>
            <Button onClick={clearFilters} type="button" variant="ghost">
              Clear all
            </Button>
          </div>
        </Disclosure>
      </div>

      <p aria-live="polite" className="mt-6 text-xs text-muted-foreground">
        Showing {filteredProducts.length} of {publicProductFixtures.length} development fixtures
      </p>

      {filteredProducts.length > 0 ? (
        <div className="mt-5 grid gap-6 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          action={
            <Button onClick={clearFilters} type="button" variant="outline">
              Reset catalog filters
            </Button>
          }
          className="mt-5"
          description="Try another part number, manufacturer, or data rate. No inventory or compatibility conclusion is implied by this fixture result."
          title="No fixture products match"
        />
      )}
    </div>
  );
}
