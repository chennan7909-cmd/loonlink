import { and, eq, isNotNull, lte } from "drizzle-orm";

import { products, productSpecs, skus } from "@/db/schema";

export const publicProductSelection = {
  slug: products.slug,
  manufacturer: products.manufacturerName,
  partNumber: products.manufacturerPartNumber,
  title: products.title,
  description: products.description,
  formFactor: productSpecs.formFactor,
  dataRateMbps: productSpecs.dataRateMbps,
  ethernetStandard: productSpecs.ethernetStandard,
  supportedProtocols: productSpecs.supportedProtocols,
  connectorType: productSpecs.connectorType,
  fiberMode: productSpecs.fiberMode,
  fiberCount: productSpecs.fiberCount,
  maxReachM: productSpecs.maxReachM,
  centerWavelengthNm: productSpecs.centerWavelengthNm,
  txWavelengthNm: productSpecs.txWavelengthNm,
  rxWavelengthNm: productSpecs.rxWavelengthNm,
  laneCount: productSpecs.laneCount,
  bidirectional: productSpecs.bidirectional,
  duplexMode: productSpecs.duplexMode,
  digitalDiagnostics: productSpecs.digitalDiagnostics,
  temperatureMinC: productSpecs.temperatureMinC,
  temperatureMaxC: productSpecs.temperatureMaxC,
  powerBudgetDb: productSpecs.powerBudgetDb,
  specNotes: productSpecs.specNotes,
  skuCode: skus.skuCode,
  conditionClass: skus.conditionClass,
  conditionGrade: skus.conditionGrade,
  codingProfile: skus.codingProfile,
  packagingType: skus.packagingType,
  unitPriceMinor: skus.unitPriceMinor,
  currency: skus.currency,
  checkoutEligible: skus.checkoutEligible,
  warrantySummary: skus.warrantySummary,
} as const;

export function publicProductEligibility(now: Date) {
  return and(
    eq(products.lifecycleStatus, "published"),
    isNotNull(products.publishedAt),
    lte(products.publishedAt, now),
    eq(skus.lifecycleStatus, "active"),
  );
}

export type PublicProductRow = {
  slug: string;
  manufacturer: string;
  partNumber: string | null;
  title: string;
  description: string | null;
  formFactor: string;
  dataRateMbps: number;
  ethernetStandard: string | null;
  supportedProtocols: string[];
  connectorType: string;
  fiberMode: "single_mode" | "multimode" | "other" | "unknown";
  fiberCount: number;
  maxReachM: number;
  centerWavelengthNm: string | null;
  txWavelengthNm: string | null;
  rxWavelengthNm: string | null;
  laneCount: number;
  bidirectional: boolean;
  duplexMode: "simplex" | "duplex" | "other" | "unknown";
  digitalDiagnostics: "yes" | "no" | "unknown";
  temperatureMinC: string | null;
  temperatureMaxC: string | null;
  powerBudgetDb: string | null;
  specNotes: string | null;
  skuCode: string;
  conditionClass: "pre_owned" | "new";
  conditionGrade: string | null;
  codingProfile: string | null;
  packagingType: string | null;
  unitPriceMinor: number | null;
  currency: string | null;
  checkoutEligible: boolean;
  warrantySummary: string | null;
};

type PublicSelectionKey = keyof typeof publicProductSelection;
type PublicRowKey = keyof PublicProductRow;

const publicSelectionCoversRow: PublicSelectionKey extends PublicRowKey
  ? PublicRowKey extends PublicSelectionKey
    ? true
    : never
  : never = true;

void publicSelectionCoversRow;
