import { describe, expect, it } from "vitest";

import {
  filterPublicProductFixtures,
  getPublicProductFixture,
  publicProductFixtures,
} from "@/features/catalog/public-fixtures";

describe("public product fixtures", () => {
  it("uses a small stable fixture catalog and slug lookup", () => {
    expect(publicProductFixtures).toHaveLength(3);
    expect(getPublicProductFixture("cisco-glc-sx-mm")?.partNumber).toBe("GLC-SX-MM");
    expect(getPublicProductFixture("missing-product")).toBeUndefined();
  });

  it("filters by part reference and structured public specifications", () => {
    expect(filterPublicProductFixtures({ query: "FTLX1471" })).toHaveLength(1);
    expect(filterPublicProductFixtures({ manufacturer: "Cisco" })).toHaveLength(2);
    expect(filterPublicProductFixtures({ dataRate: "10 Gbps" })).toHaveLength(1);
    expect(
      filterPublicProductFixtures({ manufacturer: "Cisco", query: "740-031981" }),
    ).toHaveLength(0);
  });

  it("contains only the allowlisted public fixture projection", () => {
    const allowedProductKeys = [
      "additionalSpecs",
      "conditionDisplay",
      "essentialSpecs",
      "identity",
      "manufacturer",
      "partNumber",
      "pricingDisplay",
      "publicNotes",
      "searchTerms",
      "slug",
      "testingDisplay",
    ];

    for (const product of publicProductFixtures) {
      expect(Object.keys(product).sort()).toEqual(allowedProductKeys);
    }

    const serializedProjection = JSON.stringify(publicProductFixtures).toLocaleLowerCase("en-CA");
    for (const restrictedField of [
      "serial_number",
      "cost_price",
      "supplier_id",
      "private_notes",
      "stripe",
      "customer_pii",
      "quantity_on_hand",
      "tester_identity",
      "measured_values",
    ]) {
      expect(serializedProjection).not.toContain(restrictedField);
    }
  });
});
