export type InventoryAuthority =
  | { trackingMode: "aggregate"; quantityOnHand: number }
  | { trackingMode: "serialized"; quantityOnHand: null };

export function validateInventoryAuthority(input: {
  trackingMode: string;
  quantityOnHand: number | null;
}): InventoryAuthority {
  if (
    input.trackingMode === "aggregate" &&
    Number.isSafeInteger(input.quantityOnHand) &&
    input.quantityOnHand !== null &&
    input.quantityOnHand >= 0
  ) {
    return { trackingMode: "aggregate", quantityOnHand: input.quantityOnHand };
  }

  if (input.trackingMode === "serialized" && input.quantityOnHand === null) {
    return { trackingMode: "serialized", quantityOnHand: null };
  }

  throw new Error("Inventory must use exactly one aggregate or serialized stock authority.");
}

export type SkuPrice =
  | { unitPriceMinor: null; currency: null; checkoutEligible: false }
  | { unitPriceMinor: number; currency: string; checkoutEligible: boolean };

export function validateSkuPrice(input: {
  unitPriceMinor: number | null;
  currency: string | null;
  checkoutEligible: boolean;
}): SkuPrice {
  if (input.unitPriceMinor === null && input.currency === null && !input.checkoutEligible) {
    return { unitPriceMinor: null, currency: null, checkoutEligible: false };
  }

  if (
    Number.isSafeInteger(input.unitPriceMinor) &&
    input.unitPriceMinor !== null &&
    input.unitPriceMinor >= 0 &&
    input.currency !== null &&
    /^[A-Z]{3}$/.test(input.currency)
  ) {
    return {
      unitPriceMinor: input.unitPriceMinor,
      currency: input.currency,
      checkoutEligible: input.checkoutEligible,
    };
  }

  throw new Error("SKU prices require non-negative integer minor units and an ISO currency.");
}

export type TestEventScope =
  | { inventoryId: string; inventoryUnitId: null; quantityTested: number }
  | { inventoryId: null; inventoryUnitId: string; quantityTested: 1 };

export function validateTestEventScope(input: {
  inventoryId: string | null;
  inventoryUnitId: string | null;
  quantityTested: number;
}): TestEventScope {
  if (
    input.inventoryId &&
    !input.inventoryUnitId &&
    Number.isSafeInteger(input.quantityTested) &&
    input.quantityTested > 0
  ) {
    return {
      inventoryId: input.inventoryId,
      inventoryUnitId: null,
      quantityTested: input.quantityTested,
    };
  }

  if (!input.inventoryId && input.inventoryUnitId && input.quantityTested === 1) {
    return {
      inventoryId: null,
      inventoryUnitId: input.inventoryUnitId,
      quantityTested: 1,
    };
  }

  throw new Error("A test event must target one aggregate cohort or one serialized unit.");
}
