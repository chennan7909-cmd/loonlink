CREATE TYPE "public"."digital_diagnostics" AS ENUM('yes', 'no', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."duplex_mode" AS ENUM('simplex', 'duplex', 'other', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."fiber_mode" AS ENUM('single_mode', 'multimode', 'other', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."inventory_physical_state" AS ENUM('on_hand', 'shipped', 'quarantined', 'retired');--> statement-breakpoint
CREATE TYPE "public"."inventory_tracking_mode" AS ENUM('aggregate', 'serialized');--> statement-breakpoint
CREATE TYPE "public"."product_lifecycle_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."sku_condition_class" AS ENUM('pre_owned', 'new');--> statement-breakpoint
CREATE TYPE "public"."sku_lifecycle_status" AS ENUM('draft', 'active', 'inactive', 'archived');--> statement-breakpoint
CREATE TYPE "public"."test_result" AS ENUM('passed', 'failed', 'inconclusive');--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sku_id" uuid NOT NULL,
	"location_code" text NOT NULL,
	"cohort_code" text NOT NULL,
	"tracking_mode" "inventory_tracking_mode" NOT NULL,
	"quantity_on_hand" integer,
	"operational_note" text,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_location_not_blank_check" CHECK (btrim("inventory"."location_code") <> ''),
	CONSTRAINT "inventory_cohort_not_blank_check" CHECK (btrim("inventory"."cohort_code") <> ''),
	CONSTRAINT "inventory_tracking_authority_check" CHECK (("inventory"."tracking_mode" = 'aggregate' and "inventory"."quantity_on_hand" is not null and "inventory"."quantity_on_hand" >= 0)
        or ("inventory"."tracking_mode" = 'serialized' and "inventory"."quantity_on_hand" is null)),
	CONSTRAINT "inventory_version_positive_check" CHECK ("inventory"."version" > 0)
);
--> statement-breakpoint
CREATE TABLE "inventory_units" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inventory_id" uuid NOT NULL,
	"internal_asset_tag" text NOT NULL,
	"serial_number" text,
	"manufacturer_label_data" jsonb,
	"condition_grade_override" text,
	"cosmetic_notes" text,
	"physical_state" "inventory_physical_state" DEFAULT 'on_hand' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_units_asset_tag_not_blank_check" CHECK (btrim("inventory_units"."internal_asset_tag") <> ''),
	CONSTRAINT "inventory_units_serial_not_blank_check" CHECK ("inventory_units"."serial_number" is null or btrim("inventory_units"."serial_number") <> '')
);
--> statement-breakpoint
CREATE TABLE "product_specs" (
	"product_id" uuid PRIMARY KEY NOT NULL,
	"form_factor" text NOT NULL,
	"data_rate_mbps" integer NOT NULL,
	"ethernet_standard" text,
	"supported_protocols" text[] DEFAULT '{}'::text[] NOT NULL,
	"connector_type" text NOT NULL,
	"fiber_mode" "fiber_mode" DEFAULT 'unknown' NOT NULL,
	"fiber_count" smallint NOT NULL,
	"max_reach_m" integer NOT NULL,
	"center_wavelength_nm" numeric(9, 3),
	"tx_wavelength_nm" numeric(9, 3),
	"rx_wavelength_nm" numeric(9, 3),
	"lane_count" smallint DEFAULT 1 NOT NULL,
	"bidirectional" boolean DEFAULT false NOT NULL,
	"duplex_mode" "duplex_mode" DEFAULT 'unknown' NOT NULL,
	"digital_diagnostics" "digital_diagnostics" DEFAULT 'unknown' NOT NULL,
	"temperature_min_c" numeric(6, 2),
	"temperature_max_c" numeric(6, 2),
	"power_budget_db" numeric(6, 2),
	"spec_notes" text,
	"extensions" jsonb,
	"source_summary" text,
	"reviewed_at" timestamp with time zone,
	"reviewed_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_specs_data_rate_positive_check" CHECK ("product_specs"."data_rate_mbps" > 0),
	CONSTRAINT "product_specs_fiber_count_positive_check" CHECK ("product_specs"."fiber_count" > 0),
	CONSTRAINT "product_specs_reach_nonnegative_check" CHECK ("product_specs"."max_reach_m" >= 0),
	CONSTRAINT "product_specs_lane_count_positive_check" CHECK ("product_specs"."lane_count" > 0),
	CONSTRAINT "product_specs_temperature_range_check" CHECK ("product_specs"."temperature_min_c" is null or "product_specs"."temperature_max_c" is null or "product_specs"."temperature_min_c" <= "product_specs"."temperature_max_c"),
	CONSTRAINT "product_specs_wavelengths_positive_check" CHECK (("product_specs"."center_wavelength_nm" is null or "product_specs"."center_wavelength_nm" > 0)
        and ("product_specs"."tx_wavelength_nm" is null or "product_specs"."tx_wavelength_nm" > 0)
        and ("product_specs"."rx_wavelength_nm" is null or "product_specs"."rx_wavelength_nm" > 0))
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"manufacturer_name" text NOT NULL,
	"manufacturer_part_number" text,
	"normalized_part_number" text,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"product_type" text DEFAULT 'optical_transceiver' NOT NULL,
	"lifecycle_status" "product_lifecycle_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"created_by" uuid,
	"updated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_part_number_pair_check" CHECK (("products"."manufacturer_part_number" is null) = ("products"."normalized_part_number" is null)),
	CONSTRAINT "products_published_at_check" CHECK ("products"."lifecycle_status" <> 'published' or "products"."published_at" is not null),
	CONSTRAINT "products_manufacturer_not_blank_check" CHECK (btrim("products"."manufacturer_name") <> ''),
	CONSTRAINT "products_slug_not_blank_check" CHECK (btrim("products"."slug") <> ''),
	CONSTRAINT "products_title_not_blank_check" CHECK (btrim("products"."title") <> '')
);
--> statement-breakpoint
CREATE TABLE "skus" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"sku_code" text NOT NULL,
	"condition_class" "sku_condition_class" NOT NULL,
	"condition_grade" text,
	"coding_profile" text,
	"packaging_type" text,
	"unit_price_minor" integer,
	"currency" varchar(3),
	"checkout_eligible" boolean DEFAULT false NOT NULL,
	"lifecycle_status" "sku_lifecycle_status" DEFAULT 'draft' NOT NULL,
	"warranty_summary" text,
	"created_by" uuid,
	"updated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "skus_code_not_blank_check" CHECK (btrim("skus"."sku_code") <> ''),
	CONSTRAINT "skus_price_pair_check" CHECK (("skus"."unit_price_minor" is null) = ("skus"."currency" is null)),
	CONSTRAINT "skus_price_nonnegative_check" CHECK ("skus"."unit_price_minor" is null or "skus"."unit_price_minor" >= 0),
	CONSTRAINT "skus_currency_format_check" CHECK ("skus"."currency" is null or "skus"."currency" ~ '^[A-Z]{3}$'),
	CONSTRAINT "skus_checkout_requires_price_check" CHECK (not "skus"."checkout_eligible" or ("skus"."unit_price_minor" is not null and "skus"."currency" is not null and "skus"."lifecycle_status" = 'active'))
);
--> statement-breakpoint
CREATE TABLE "test_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inventory_id" uuid,
	"inventory_unit_id" uuid,
	"tested_at" timestamp with time zone NOT NULL,
	"test_method_code" text NOT NULL,
	"test_method_version" text NOT NULL,
	"result" "test_result" NOT NULL,
	"tester_reference" text NOT NULL,
	"quantity_tested" integer NOT NULL,
	"notes" text,
	"measured_values" jsonb,
	"measured_values_schema_version" text,
	"public_summary" text,
	"supporting_asset_path" text,
	"supersedes_test_event_id" uuid,
	"voided_at" timestamp with time zone,
	"voided_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "test_events_scope_check" CHECK (("test_events"."inventory_id" is not null and "test_events"."inventory_unit_id" is null and "test_events"."quantity_tested" > 0)
        or ("test_events"."inventory_id" is null and "test_events"."inventory_unit_id" is not null and "test_events"."quantity_tested" = 1)),
	CONSTRAINT "test_events_measured_values_version_check" CHECK (("test_events"."measured_values" is null) = ("test_events"."measured_values_schema_version" is null)),
	CONSTRAINT "test_events_void_metadata_check" CHECK (("test_events"."voided_at" is null) = ("test_events"."voided_by" is null)),
	CONSTRAINT "test_events_not_self_superseding_check" CHECK ("test_events"."supersedes_test_event_id" is null or "test_events"."supersedes_test_event_id" <> "test_events"."id"),
	CONSTRAINT "test_events_method_not_blank_check" CHECK (btrim("test_events"."test_method_code") <> ''),
	CONSTRAINT "test_events_method_version_not_blank_check" CHECK (btrim("test_events"."test_method_version") <> ''),
	CONSTRAINT "test_events_tester_not_blank_check" CHECK (btrim("test_events"."tester_reference") <> '')
);
--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_sku_id_skus_id_fk" FOREIGN KEY ("sku_id") REFERENCES "public"."skus"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_units" ADD CONSTRAINT "inventory_units_inventory_id_inventory_id_fk" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_specs" ADD CONSTRAINT "product_specs_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skus" ADD CONSTRAINT "skus_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_events" ADD CONSTRAINT "test_events_inventory_id_inventory_id_fk" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_events" ADD CONSTRAINT "test_events_inventory_unit_id_inventory_units_id_fk" FOREIGN KEY ("inventory_unit_id") REFERENCES "public"."inventory_units"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_events" ADD CONSTRAINT "test_events_supersedes_test_event_id_test_events_id_fk" FOREIGN KEY ("supersedes_test_event_id") REFERENCES "public"."test_events"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "inventory_cohort_code_unique" ON "inventory" USING btree ("cohort_code");--> statement-breakpoint
CREATE INDEX "inventory_sku_id_idx" ON "inventory" USING btree ("sku_id");--> statement-breakpoint
CREATE UNIQUE INDEX "inventory_units_asset_tag_unique" ON "inventory_units" USING btree ("internal_asset_tag");--> statement-breakpoint
CREATE INDEX "inventory_units_inventory_id_idx" ON "inventory_units" USING btree ("inventory_id");--> statement-breakpoint
CREATE UNIQUE INDEX "inventory_units_parent_serial_unique" ON "inventory_units" USING btree ("inventory_id","serial_number") WHERE "inventory_units"."serial_number" is not null;--> statement-breakpoint
CREATE INDEX "product_specs_form_factor_idx" ON "product_specs" USING btree ("form_factor");--> statement-breakpoint
CREATE INDEX "product_specs_data_rate_idx" ON "product_specs" USING btree ("data_rate_mbps");--> statement-breakpoint
CREATE INDEX "product_specs_connector_idx" ON "product_specs" USING btree ("connector_type");--> statement-breakpoint
CREATE INDEX "product_specs_fiber_mode_idx" ON "product_specs" USING btree ("fiber_mode");--> statement-breakpoint
CREATE INDEX "product_specs_max_reach_idx" ON "product_specs" USING btree ("max_reach_m");--> statement-breakpoint
CREATE INDEX "product_specs_center_wavelength_idx" ON "product_specs" USING btree ("center_wavelength_nm");--> statement-breakpoint
CREATE UNIQUE INDEX "products_slug_unique" ON "products" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "products_manufacturer_part_unique" ON "products" USING btree (lower("manufacturer_name"),"normalized_part_number") WHERE "products"."normalized_part_number" is not null;--> statement-breakpoint
CREATE INDEX "products_normalized_part_number_idx" ON "products" USING btree ("normalized_part_number");--> statement-breakpoint
CREATE UNIQUE INDEX "skus_sku_code_unique" ON "skus" USING btree ("sku_code");--> statement-breakpoint
CREATE INDEX "skus_product_id_idx" ON "skus" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "test_events_inventory_id_idx" ON "test_events" USING btree ("inventory_id");--> statement-breakpoint
CREATE INDEX "test_events_inventory_unit_id_idx" ON "test_events" USING btree ("inventory_unit_id");--> statement-breakpoint
CREATE INDEX "test_events_tested_at_idx" ON "test_events" USING btree ("tested_at");
--> statement-breakpoint
CREATE SCHEMA IF NOT EXISTS "internal";
--> statement-breakpoint
REVOKE ALL ON SCHEMA "internal" FROM PUBLIC;
--> statement-breakpoint
CREATE FUNCTION "internal"."set_updated_at"()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $$
BEGIN
	NEW.updated_at = statement_timestamp();
	RETURN NEW;
END;
$$;
--> statement-breakpoint
CREATE FUNCTION "internal"."enforce_inventory_tracking_mode_immutable"()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $$
BEGIN
	IF NEW.tracking_mode <> OLD.tracking_mode THEN
		RAISE EXCEPTION 'inventory tracking mode is immutable; use an authorized conversion transaction';
	END IF;

	RETURN NEW;
END;
$$;
--> statement-breakpoint
CREATE FUNCTION "internal"."enforce_serialized_inventory_parent"()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $$
BEGIN
	PERFORM 1
	FROM public.inventory
	WHERE id = NEW.inventory_id
		AND tracking_mode = 'serialized'
	FOR UPDATE;

	IF NOT FOUND THEN
		RAISE EXCEPTION 'inventory units require a serialized inventory bucket';
	END IF;

	RETURN NEW;
END;
$$;
--> statement-breakpoint
CREATE FUNCTION "internal"."validate_test_event_relationships"()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $$
DECLARE
	prior_inventory_id uuid;
	prior_inventory_unit_id uuid;
BEGIN
	IF NEW.inventory_id IS NOT NULL THEN
		PERFORM 1
		FROM public.inventory
		WHERE id = NEW.inventory_id
			AND tracking_mode = 'aggregate';

		IF NOT FOUND THEN
			RAISE EXCEPTION 'cohort test events require an aggregate inventory bucket';
		END IF;
	END IF;

	IF NEW.supersedes_test_event_id IS NOT NULL THEN
		SELECT inventory_id, inventory_unit_id
		INTO prior_inventory_id, prior_inventory_unit_id
		FROM public.test_events
		WHERE id = NEW.supersedes_test_event_id;

		IF NOT FOUND
			OR prior_inventory_id IS DISTINCT FROM NEW.inventory_id
			OR prior_inventory_unit_id IS DISTINCT FROM NEW.inventory_unit_id THEN
			RAISE EXCEPTION 'a test event may supersede only an event for the same inventory target';
		END IF;
	END IF;

	RETURN NEW;
END;
$$;
--> statement-breakpoint
CREATE FUNCTION "internal"."enforce_test_event_append_only"()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $$
BEGIN
	IF NEW.inventory_id IS DISTINCT FROM OLD.inventory_id
		OR NEW.inventory_unit_id IS DISTINCT FROM OLD.inventory_unit_id
		OR NEW.tested_at IS DISTINCT FROM OLD.tested_at
		OR NEW.test_method_code IS DISTINCT FROM OLD.test_method_code
		OR NEW.test_method_version IS DISTINCT FROM OLD.test_method_version
		OR NEW.result IS DISTINCT FROM OLD.result
		OR NEW.tester_reference IS DISTINCT FROM OLD.tester_reference
		OR NEW.quantity_tested IS DISTINCT FROM OLD.quantity_tested
		OR NEW.notes IS DISTINCT FROM OLD.notes
		OR NEW.measured_values IS DISTINCT FROM OLD.measured_values
		OR NEW.measured_values_schema_version IS DISTINCT FROM OLD.measured_values_schema_version
		OR NEW.supersedes_test_event_id IS DISTINCT FROM OLD.supersedes_test_event_id
		OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
		RAISE EXCEPTION 'test event facts are append-only; create a superseding event instead';
	END IF;

	IF OLD.voided_at IS NOT NULL
		AND (NEW.voided_at IS DISTINCT FROM OLD.voided_at OR NEW.voided_by IS DISTINCT FROM OLD.voided_by) THEN
		RAISE EXCEPTION 'test event void metadata is immutable once set';
	END IF;

	RETURN NEW;
END;
$$;
--> statement-breakpoint
CREATE FUNCTION "internal"."prevent_test_event_delete"()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $$
BEGIN
	RAISE EXCEPTION 'test events are append-only and cannot be deleted';
END;
$$;
--> statement-breakpoint
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA "internal" FROM PUBLIC;
--> statement-breakpoint
CREATE TRIGGER "products_set_updated_at"
BEFORE UPDATE ON "products"
FOR EACH ROW EXECUTE FUNCTION "internal"."set_updated_at"();
--> statement-breakpoint
CREATE TRIGGER "product_specs_set_updated_at"
BEFORE UPDATE ON "product_specs"
FOR EACH ROW EXECUTE FUNCTION "internal"."set_updated_at"();
--> statement-breakpoint
CREATE TRIGGER "skus_set_updated_at"
BEFORE UPDATE ON "skus"
FOR EACH ROW EXECUTE FUNCTION "internal"."set_updated_at"();
--> statement-breakpoint
CREATE TRIGGER "inventory_enforce_tracking_mode_immutable"
BEFORE UPDATE ON "inventory"
FOR EACH ROW EXECUTE FUNCTION "internal"."enforce_inventory_tracking_mode_immutable"();
--> statement-breakpoint
CREATE TRIGGER "inventory_set_updated_at"
BEFORE UPDATE ON "inventory"
FOR EACH ROW EXECUTE FUNCTION "internal"."set_updated_at"();
--> statement-breakpoint
CREATE TRIGGER "inventory_units_enforce_serialized_parent"
BEFORE INSERT OR UPDATE OF "inventory_id" ON "inventory_units"
FOR EACH ROW EXECUTE FUNCTION "internal"."enforce_serialized_inventory_parent"();
--> statement-breakpoint
CREATE TRIGGER "inventory_units_set_updated_at"
BEFORE UPDATE ON "inventory_units"
FOR EACH ROW EXECUTE FUNCTION "internal"."set_updated_at"();
--> statement-breakpoint
CREATE TRIGGER "test_events_validate_relationships"
BEFORE INSERT ON "test_events"
FOR EACH ROW EXECUTE FUNCTION "internal"."validate_test_event_relationships"();
--> statement-breakpoint
CREATE TRIGGER "test_events_enforce_append_only"
BEFORE UPDATE ON "test_events"
FOR EACH ROW EXECUTE FUNCTION "internal"."enforce_test_event_append_only"();
--> statement-breakpoint
CREATE TRIGGER "test_events_set_updated_at"
BEFORE UPDATE ON "test_events"
FOR EACH ROW EXECUTE FUNCTION "internal"."set_updated_at"();
--> statement-breakpoint
CREATE TRIGGER "test_events_prevent_delete"
BEFORE DELETE ON "test_events"
FOR EACH ROW EXECUTE FUNCTION "internal"."prevent_test_event_delete"();
--> statement-breakpoint
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "products" FORCE ROW LEVEL SECURITY;
ALTER TABLE "product_specs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_specs" FORCE ROW LEVEL SECURITY;
ALTER TABLE "skus" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "skus" FORCE ROW LEVEL SECURITY;
ALTER TABLE "inventory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "inventory" FORCE ROW LEVEL SECURITY;
ALTER TABLE "inventory_units" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "inventory_units" FORCE ROW LEVEL SECURITY;
ALTER TABLE "test_events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "test_events" FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
REVOKE ALL ON TABLE "products", "product_specs", "skus", "inventory", "inventory_units", "test_events" FROM PUBLIC;
--> statement-breakpoint
DO $$
BEGIN
	IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
		REVOKE ALL ON TABLE public.products, public.product_specs, public.skus,
			public.inventory, public.inventory_units, public.test_events FROM anon;
	END IF;

	IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
		REVOKE ALL ON TABLE public.products, public.product_specs, public.skus,
			public.inventory, public.inventory_units, public.test_events FROM authenticated;
	END IF;
END;
$$;
