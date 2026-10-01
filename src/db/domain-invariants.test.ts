import { describe, expect, it } from "vitest";

import {
  validateInventoryAuthority,
  validateSkuPrice,
  validateTestEventScope,
} from "@/db/domain-invariants";

describe("database domain invariants", () => {
  it("accepts aggregate and serialized inventory authorities without overlap", () => {
    expect(validateInventoryAuthority({ trackingMode: "aggregate", quantityOnHand: 100 })).toEqual({
      trackingMode: "aggregate",
      quantityOnHand: 100,
    });
    expect(validateInventoryAuthority({ trackingMode: "serialized", quantityOnHand: null })).toEqual({
      trackingMode: "serialized",
      quantityOnHand: null,
    });

    expect(() =>
      validateInventoryAuthority({ trackingMode: "serialized", quantityOnHand: 1 }),
    ).toThrow(/exactly one aggregate or serialized/i);
    expect(() =>
      validateInventoryAuthority({ trackingMode: "aggregate", quantityOnHand: null }),
    ).toThrow(/exactly one aggregate or serialized/i);
  });

  it("keeps absent prices distinct from authoritative minor-unit prices", () => {
    expect(
      validateSkuPrice({ unitPriceMinor: null, currency: null, checkoutEligible: false }),
    ).toEqual({ unitPriceMinor: null, currency: null, checkoutEligible: false });
    expect(validateSkuPrice({ unitPriceMinor: 12_345, currency: "CAD", checkoutEligible: true })).toEqual(
      { unitPriceMinor: 12_345, currency: "CAD", checkoutEligible: true },
    );

    expect(() =>
      validateSkuPrice({ unitPriceMinor: 12.34, currency: "CAD", checkoutEligible: false }),
    ).toThrow(/integer minor units/i);
    expect(() =>
      validateSkuPrice({ unitPriceMinor: null, currency: null, checkoutEligible: true }),
    ).toThrow(/integer minor units/i);
  });

  it("requires one cohort target or one serialized-unit target per test event", () => {
    expect(
      validateTestEventScope({
        inventoryId: "cohort-id",
        inventoryUnitId: null,
        quantityTested: 10,
      }),
    ).toEqual({ inventoryId: "cohort-id", inventoryUnitId: null, quantityTested: 10 });
    expect(
      validateTestEventScope({
        inventoryId: null,
        inventoryUnitId: "unit-id",
        quantityTested: 1,
      }),
    ).toEqual({ inventoryId: null, inventoryUnitId: "unit-id", quantityTested: 1 });

    expect(() =>
      validateTestEventScope({
        inventoryId: "cohort-id",
        inventoryUnitId: "unit-id",
        quantityTested: 1,
      }),
    ).toThrow(/one aggregate cohort or one serialized unit/i);
    expect(() =>
      validateTestEventScope({
        inventoryId: null,
        inventoryUnitId: "unit-id",
        quantityTested: 2,
      }),
    ).toThrow(/one aggregate cohort or one serialized unit/i);
  });
});
