// @vitest-environment node

import { readFile } from "node:fs/promises";
import path from "node:path";

import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const productId = "00000000-0000-4000-8000-000000000001";
const skuId = "00000000-0000-4000-8000-000000000002";
const aggregateInventoryId = "00000000-0000-4000-8000-000000000003";
const serializedInventoryId = "00000000-0000-4000-8000-000000000004";
const inventoryUnitId = "00000000-0000-4000-8000-000000000005";
const cohortTestEventId = "00000000-0000-4000-8000-000000000006";
const unitTestEventId = "00000000-0000-4000-8000-000000000007";
const operatorId = "00000000-0000-4000-8000-000000000008";

describe("initial database migration", () => {
  let database: PGlite;

  beforeAll(async () => {
    database = new PGlite();
    const migration = await readFile(
      path.join(process.cwd(), "drizzle/0000_mute_kulan_gath.sql"),
      "utf8",
    );

    await database.exec(migration);
    await database.exec(`
      insert into products (
        id, manufacturer_name, manufacturer_part_number, normalized_part_number,
        slug, title
      ) values (
        '${productId}', 'Development Manufacturer', 'DEV-PART', 'DEV-PART',
        'development-product', 'Development product'
      );

      insert into skus (
        id, product_id, sku_code, condition_class, checkout_eligible, lifecycle_status
      ) values (
        '${skuId}', '${productId}', 'DEV-SKU', 'pre_owned', false, 'draft'
      );

      insert into inventory (
        id, sku_id, location_code, cohort_code, tracking_mode, quantity_on_hand
      ) values
        ('${aggregateInventoryId}', '${skuId}', 'TEST-ONLY', 'DEV-AGGREGATE', 'aggregate', 100),
        ('${serializedInventoryId}', '${skuId}', 'TEST-ONLY', 'DEV-SERIALIZED', 'serialized', null);

      insert into inventory_units (
        id, inventory_id, internal_asset_tag, serial_number
      ) values (
        '${inventoryUnitId}', '${serializedInventoryId}', 'DEV-ASSET-1', 'DEV-SERIAL-1'
      );
    `);
  });

  afterAll(async () => {
    await database.close();
  });

  it("applies all six tables with deny-by-default RLS and no policies", async () => {
    const rls = await database.query<{
      relname: string;
      relrowsecurity: boolean;
      relforcerowsecurity: boolean;
    }>(`
      select relname, relrowsecurity, relforcerowsecurity
      from pg_class
      where relname in (
        'products', 'product_specs', 'skus', 'inventory', 'inventory_units', 'test_events'
      )
      order by relname;
    `);

    expect(rls.rows).toHaveLength(6);
    expect(rls.rows.every((row) => row.relrowsecurity && row.relforcerowsecurity)).toBe(true);

    const policies = await database.query<{ policy_count: number }>(`
      select count(*)::int as policy_count
      from pg_policies
      where tablename in (
        'products', 'product_specs', 'skus', 'inventory', 'inventory_units', 'test_events'
      );
    `);

    expect(policies.rows[0]?.policy_count).toBe(0);
  });

  it("prevents aggregate and serialized stock from overlapping", async () => {
    await expect(
      database.exec(`
        insert into inventory_units (inventory_id, internal_asset_tag)
        values ('${aggregateInventoryId}', 'INVALID-AGGREGATE-UNIT');
      `),
    ).rejects.toThrow(/serialized inventory bucket/i);

    await expect(
      database.exec(`
        update inventory
        set tracking_mode = 'aggregate', quantity_on_hand = 1
        where id = '${serializedInventoryId}';
      `),
    ).rejects.toThrow(/tracking mode is immutable/i);

    await expect(
      database.exec(`
        insert into inventory (
          sku_id, location_code, cohort_code, tracking_mode, quantity_on_hand
        ) values (
          '${skuId}', 'TEST-ONLY', 'INVALID-SERIALIZED-QUANTITY', 'serialized', 1
        );
      `),
    ).rejects.toThrow(/inventory_tracking_authority_check/i);
  });

  it("allows an unpublished SKU without a fabricated price and rejects unsafe price states", async () => {
    const storedSku = await database.query<{
      unit_price_minor: number | null;
      currency: string | null;
      checkout_eligible: boolean;
    }>(`
      select unit_price_minor, currency, checkout_eligible
      from skus
      where id = '${skuId}';
    `);

    expect(storedSku.rows[0]).toEqual({
      unit_price_minor: null,
      currency: null,
      checkout_eligible: false,
    });

    await expect(
      database.exec(`
        update skus
        set checkout_eligible = true
        where id = '${skuId}';
      `),
    ).rejects.toThrow(/skus_checkout_requires_price_check/i);

    await expect(
      database.exec(`
        update skus
        set unit_price_minor = 1000, currency = 'cad'
        where id = '${skuId}';
      `),
    ).rejects.toThrow(/skus_currency_format_check/i);
  });

  it("enforces cohort and serialized-unit test scopes", async () => {
    await database.exec(`
      insert into test_events (
        id, inventory_id, tested_at, test_method_code, test_method_version,
        result, tester_reference, quantity_tested
      ) values (
        '${cohortTestEventId}', '${aggregateInventoryId}', now(), 'DEV-METHOD', '1',
        'passed', 'TEST-OPERATOR', 10
      );

      insert into test_events (
        id, inventory_unit_id, tested_at, test_method_code, test_method_version,
        result, tester_reference, quantity_tested
      ) values (
        '${unitTestEventId}', '${inventoryUnitId}', now(), 'DEV-METHOD', '1',
        'inconclusive', 'TEST-OPERATOR', 1
      );
    `);

    await expect(
      database.exec(`
        insert into test_events (
          inventory_id, tested_at, test_method_code, test_method_version,
          result, tester_reference, quantity_tested
        ) values (
          '${serializedInventoryId}', now(), 'DEV-METHOD', '1',
          'passed', 'TEST-OPERATOR', 1
        );
      `),
    ).rejects.toThrow(/aggregate inventory bucket/i);

    await expect(
      database.exec(`
        insert into test_events (
          inventory_id, inventory_unit_id, tested_at, test_method_code, test_method_version,
          result, tester_reference, quantity_tested
        ) values (
          '${aggregateInventoryId}', '${inventoryUnitId}', now(), 'DEV-METHOD', '1',
          'passed', 'TEST-OPERATOR', 1
        );
      `),
    ).rejects.toThrow(/test_events_scope_check/i);
  });

  it("keeps test facts append-only while allowing a one-way void", async () => {
    await expect(
      database.exec(`
        update test_events
        set result = 'failed'
        where id = '${cohortTestEventId}';
      `),
    ).rejects.toThrow(/append-only/i);

    await database.exec(`
      update test_events
      set voided_at = now(), voided_by = '${operatorId}'
      where id = '${cohortTestEventId}';
    `);

    await expect(
      database.exec(`
        update test_events
        set voided_at = now() + interval '1 minute'
        where id = '${cohortTestEventId}';
      `),
    ).rejects.toThrow(/void metadata is immutable/i);

    await expect(
      database.exec(`delete from test_events where id = '${unitTestEventId}';`),
    ).rejects.toThrow(/cannot be deleted/i);
  });
});
