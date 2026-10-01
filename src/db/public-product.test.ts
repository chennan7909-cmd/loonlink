import { describe, expect, it } from "vitest";

import { publicProductSelection } from "@/db/public-product";

const restrictedPublicFields = [
  "id",
  "serialNumber",
  "manufacturerLabelData",
  "cosmeticNotes",
  "operationalNote",
  "locationCode",
  "quantityOnHand",
  "testerReference",
  "notes",
  "measuredValues",
  "supportingAssetPath",
  "createdBy",
  "updatedBy",
] as const;

describe("public product projection", () => {
  it("uses an explicit stable allowlist", () => {
    expect(Object.keys(publicProductSelection)).toEqual([
      "slug",
      "manufacturer",
      "partNumber",
      "title",
      "description",
      "formFactor",
      "dataRateMbps",
      "ethernetStandard",
      "supportedProtocols",
      "connectorType",
      "fiberMode",
      "fiberCount",
      "maxReachM",
      "centerWavelengthNm",
      "txWavelengthNm",
      "rxWavelengthNm",
      "laneCount",
      "bidirectional",
      "duplexMode",
      "digitalDiagnostics",
      "temperatureMinC",
      "temperatureMaxC",
      "powerBudgetDb",
      "specNotes",
      "skuCode",
      "conditionClass",
      "conditionGrade",
      "codingProfile",
      "packagingType",
      "unitPriceMinor",
      "currency",
      "checkoutEligible",
      "warrantySummary",
    ]);
  });

  it.each(restrictedPublicFields)("excludes restricted field %s", (field) => {
    expect(publicProductSelection).not.toHaveProperty(field);
  });
});
