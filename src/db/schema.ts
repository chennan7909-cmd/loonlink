import { sql } from "drizzle-orm";
import {
  AnyPgColumn,
  boolean,
  check,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const productLifecycleStatus = pgEnum("product_lifecycle_status", [
  "draft",
  "published",
  "archived",
]);

export const skuConditionClass = pgEnum("sku_condition_class", ["pre_owned", "new"]);

export const skuLifecycleStatus = pgEnum("sku_lifecycle_status", [
  "draft",
  "active",
  "inactive",
  "archived",
]);

export const inventoryTrackingMode = pgEnum("inventory_tracking_mode", [
  "aggregate",
  "serialized",
]);

export const inventoryPhysicalState = pgEnum("inventory_physical_state", [
  "on_hand",
  "shipped",
  "quarantined",
  "retired",
]);

export const testResult = pgEnum("test_result", ["passed", "failed", "inconclusive"]);

export const fiberMode = pgEnum("fiber_mode", [
  "single_mode",
  "multimode",
  "other",
  "unknown",
]);

export const duplexMode = pgEnum("duplex_mode", ["simplex", "duplex", "other", "unknown"]);

export const digitalDiagnostics = pgEnum("digital_diagnostics", ["yes", "no", "unknown"]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    manufacturerName: text("manufacturer_name").notNull(),
    manufacturerPartNumber: text("manufacturer_part_number"),
    normalizedPartNumber: text("normalized_part_number"),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    productType: text("product_type").default("optical_transceiver").notNull(),
    lifecycleStatus: productLifecycleStatus("lifecycle_status").default("draft").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdBy: uuid("created_by"),
    updatedBy: uuid("updated_by"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("products_slug_unique").on(table.slug),
    uniqueIndex("products_manufacturer_part_unique")
      .on(sql`lower(${table.manufacturerName})`, table.normalizedPartNumber)
      .where(sql`${table.normalizedPartNumber} is not null`),
    index("products_normalized_part_number_idx").on(table.normalizedPartNumber),
    check(
      "products_part_number_pair_check",
      sql`(${table.manufacturerPartNumber} is null) = (${table.normalizedPartNumber} is null)`,
    ),
    check(
      "products_published_at_check",
      sql`${table.lifecycleStatus} <> 'published' or ${table.publishedAt} is not null`,
    ),
    check("products_manufacturer_not_blank_check", sql`btrim(${table.manufacturerName}) <> ''`),
    check("products_slug_not_blank_check", sql`btrim(${table.slug}) <> ''`),
    check("products_title_not_blank_check", sql`btrim(${table.title}) <> ''`),
  ],
);

export const productSpecs = pgTable(
  "product_specs",
  {
    productId: uuid("product_id")
      .primaryKey()
      .references(() => products.id, { onDelete: "cascade" }),
    formFactor: text("form_factor").notNull(),
    dataRateMbps: integer("data_rate_mbps").notNull(),
    ethernetStandard: text("ethernet_standard"),
    supportedProtocols: text("supported_protocols")
      .array()
      .default(sql`'{}'::text[]`)
      .notNull(),
    connectorType: text("connector_type").notNull(),
    fiberMode: fiberMode("fiber_mode").default("unknown").notNull(),
    fiberCount: smallint("fiber_count").notNull(),
    maxReachM: integer("max_reach_m").notNull(),
    centerWavelengthNm: numeric("center_wavelength_nm", { precision: 9, scale: 3 }),
    txWavelengthNm: numeric("tx_wavelength_nm", { precision: 9, scale: 3 }),
    rxWavelengthNm: numeric("rx_wavelength_nm", { precision: 9, scale: 3 }),
    laneCount: smallint("lane_count").default(1).notNull(),
    bidirectional: boolean("bidirectional").default(false).notNull(),
    duplexMode: duplexMode("duplex_mode").default("unknown").notNull(),
    digitalDiagnostics: digitalDiagnostics("digital_diagnostics").default("unknown").notNull(),
    temperatureMinC: numeric("temperature_min_c", { precision: 6, scale: 2 }),
    temperatureMaxC: numeric("temperature_max_c", { precision: 6, scale: 2 }),
    powerBudgetDb: numeric("power_budget_db", { precision: 6, scale: 2 }),
    specNotes: text("spec_notes"),
    extensions: jsonb("extensions"),
    sourceSummary: text("source_summary"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    reviewedBy: uuid("reviewed_by"),
    ...timestamps,
  },
  (table) => [
    index("product_specs_form_factor_idx").on(table.formFactor),
    index("product_specs_data_rate_idx").on(table.dataRateMbps),
    index("product_specs_connector_idx").on(table.connectorType),
    index("product_specs_fiber_mode_idx").on(table.fiberMode),
    index("product_specs_max_reach_idx").on(table.maxReachM),
    index("product_specs_center_wavelength_idx").on(table.centerWavelengthNm),
    check("product_specs_data_rate_positive_check", sql`${table.dataRateMbps} > 0`),
    check("product_specs_fiber_count_positive_check", sql`${table.fiberCount} > 0`),
    check("product_specs_reach_nonnegative_check", sql`${table.maxReachM} >= 0`),
    check("product_specs_lane_count_positive_check", sql`${table.laneCount} > 0`),
    check(
      "product_specs_temperature_range_check",
      sql`${table.temperatureMinC} is null or ${table.temperatureMaxC} is null or ${table.temperatureMinC} <= ${table.temperatureMaxC}`,
    ),
    check(
      "product_specs_wavelengths_positive_check",
      sql`(${table.centerWavelengthNm} is null or ${table.centerWavelengthNm} > 0)
        and (${table.txWavelengthNm} is null or ${table.txWavelengthNm} > 0)
        and (${table.rxWavelengthNm} is null or ${table.rxWavelengthNm} > 0)`,
    ),
  ],
);

export const skus = pgTable(
  "skus",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    skuCode: text("sku_code").notNull(),
    conditionClass: skuConditionClass("condition_class").notNull(),
    conditionGrade: text("condition_grade"),
    codingProfile: text("coding_profile"),
    packagingType: text("packaging_type"),
    unitPriceMinor: integer("unit_price_minor"),
    currency: varchar("currency", { length: 3 }),
    checkoutEligible: boolean("checkout_eligible").default(false).notNull(),
    lifecycleStatus: skuLifecycleStatus("lifecycle_status").default("draft").notNull(),
    warrantySummary: text("warranty_summary"),
    createdBy: uuid("created_by"),
    updatedBy: uuid("updated_by"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("skus_sku_code_unique").on(table.skuCode),
    index("skus_product_id_idx").on(table.productId),
    check("skus_code_not_blank_check", sql`btrim(${table.skuCode}) <> ''`),
    check(
      "skus_price_pair_check",
      sql`(${table.unitPriceMinor} is null) = (${table.currency} is null)`,
    ),
    check(
      "skus_price_nonnegative_check",
      sql`${table.unitPriceMinor} is null or ${table.unitPriceMinor} >= 0`,
    ),
    check(
      "skus_currency_format_check",
      sql`${table.currency} is null or ${table.currency} ~ '^[A-Z]{3}$'`,
    ),
    check(
      "skus_checkout_requires_price_check",
      sql`not ${table.checkoutEligible} or (${table.unitPriceMinor} is not null and ${table.currency} is not null and ${table.lifecycleStatus} = 'active')`,
    ),
  ],
);

export const inventory = pgTable(
  "inventory",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    skuId: uuid("sku_id")
      .notNull()
      .references(() => skus.id, { onDelete: "restrict" }),
    locationCode: text("location_code").notNull(),
    cohortCode: text("cohort_code").notNull(),
    trackingMode: inventoryTrackingMode("tracking_mode").notNull(),
    quantityOnHand: integer("quantity_on_hand"),
    operationalNote: text("operational_note"),
    version: integer("version").default(1).notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("inventory_cohort_code_unique").on(table.cohortCode),
    index("inventory_sku_id_idx").on(table.skuId),
    check("inventory_location_not_blank_check", sql`btrim(${table.locationCode}) <> ''`),
    check("inventory_cohort_not_blank_check", sql`btrim(${table.cohortCode}) <> ''`),
    check(
      "inventory_tracking_authority_check",
      sql`(${table.trackingMode} = 'aggregate' and ${table.quantityOnHand} is not null and ${table.quantityOnHand} >= 0)
        or (${table.trackingMode} = 'serialized' and ${table.quantityOnHand} is null)`,
    ),
    check("inventory_version_positive_check", sql`${table.version} > 0`),
  ],
);

export const inventoryUnits = pgTable(
  "inventory_units",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    inventoryId: uuid("inventory_id")
      .notNull()
      .references(() => inventory.id, { onDelete: "restrict" }),
    internalAssetTag: text("internal_asset_tag").notNull(),
    serialNumber: text("serial_number"),
    manufacturerLabelData: jsonb("manufacturer_label_data"),
    conditionGradeOverride: text("condition_grade_override"),
    cosmeticNotes: text("cosmetic_notes"),
    physicalState: inventoryPhysicalState("physical_state").default("on_hand").notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("inventory_units_asset_tag_unique").on(table.internalAssetTag),
    index("inventory_units_inventory_id_idx").on(table.inventoryId),
    uniqueIndex("inventory_units_parent_serial_unique")
      .on(table.inventoryId, table.serialNumber)
      .where(sql`${table.serialNumber} is not null`),
    check("inventory_units_asset_tag_not_blank_check", sql`btrim(${table.internalAssetTag}) <> ''`),
    check(
      "inventory_units_serial_not_blank_check",
      sql`${table.serialNumber} is null or btrim(${table.serialNumber}) <> ''`,
    ),
  ],
);

export const testEvents = pgTable(
  "test_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    inventoryId: uuid("inventory_id").references(() => inventory.id, { onDelete: "restrict" }),
    inventoryUnitId: uuid("inventory_unit_id").references(() => inventoryUnits.id, {
      onDelete: "restrict",
    }),
    testedAt: timestamp("tested_at", { withTimezone: true }).notNull(),
    testMethodCode: text("test_method_code").notNull(),
    testMethodVersion: text("test_method_version").notNull(),
    result: testResult("result").notNull(),
    testerReference: text("tester_reference").notNull(),
    quantityTested: integer("quantity_tested").notNull(),
    notes: text("notes"),
    measuredValues: jsonb("measured_values"),
    measuredValuesSchemaVersion: text("measured_values_schema_version"),
    publicSummary: text("public_summary"),
    supportingAssetPath: text("supporting_asset_path"),
    supersedesTestEventId: uuid("supersedes_test_event_id").references(
      (): AnyPgColumn => testEvents.id,
      { onDelete: "restrict" },
    ),
    voidedAt: timestamp("voided_at", { withTimezone: true }),
    voidedBy: uuid("voided_by"),
    ...timestamps,
  },
  (table) => [
    index("test_events_inventory_id_idx").on(table.inventoryId),
    index("test_events_inventory_unit_id_idx").on(table.inventoryUnitId),
    index("test_events_tested_at_idx").on(table.testedAt),
    check(
      "test_events_scope_check",
      sql`(${table.inventoryId} is not null and ${table.inventoryUnitId} is null and ${table.quantityTested} > 0)
        or (${table.inventoryId} is null and ${table.inventoryUnitId} is not null and ${table.quantityTested} = 1)`,
    ),
    check(
      "test_events_measured_values_version_check",
      sql`(${table.measuredValues} is null) = (${table.measuredValuesSchemaVersion} is null)`,
    ),
    check(
      "test_events_void_metadata_check",
      sql`(${table.voidedAt} is null) = (${table.voidedBy} is null)`,
    ),
    check(
      "test_events_not_self_superseding_check",
      sql`${table.supersedesTestEventId} is null or ${table.supersedesTestEventId} <> ${table.id}`,
    ),
    check("test_events_method_not_blank_check", sql`btrim(${table.testMethodCode}) <> ''`),
    check("test_events_method_version_not_blank_check", sql`btrim(${table.testMethodVersion}) <> ''`),
    check("test_events_tester_not_blank_check", sql`btrim(${table.testerReference}) <> ''`),
  ],
);
