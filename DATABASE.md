# LoonLink Database Foundation

## Phase 2A status and boundary

Phase 2A defines a production-oriented PostgreSQL foundation for Supabase using Drizzle ORM and committed SQL migrations. It creates schema for products, structured optical specifications, SKUs, aggregate inventory cohorts, optional serialized units, and append-oriented test events.

No Supabase project has been configured or modified by this repository change. No product, inventory, price, serial number, or test record is seeded. The storefront remains on clearly labelled development fixtures. Compatibility, customers, orders, payments, shipments, inventory reservations, RFQs, and admin persistence are outside Phase 2A.

## Connections and environment variables

Copy `.env.example` to an ignored `.env.local` only when database work is required. Supply values through the local environment or the appropriate deployment secret store:

- `DATABASE_URL`: server-only pooled PostgreSQL connection for future application queries. For a serverless Supabase deployment, use the provider-recommended pooler configuration.
- `DATABASE_MIGRATION_URL`: server-only direct or session-mode PostgreSQL connection used only for controlled migration execution.

Neither variable is browser-safe. Never prefix it with `NEXT_PUBLIC_`, commit its value, print it, or place it in screenshots/logs. Phase 2A does not require a Supabase URL, anonymous key, or service-role key because it introduces no browser-side Supabase client.

Ordinary development, CI, fixture storefront tests, and production builds require neither database variable. Only commands that connect to PostgreSQL require credentials.

## Schema and migration workflow

The source schema is `src/db/schema.ts`. Generated migrations and Drizzle snapshots live under `drizzle/`.

1. Change the Drizzle schema and relevant invariant/projection tests.
2. Run `npm run db:generate`.
3. Review every generated SQL statement, constraint, index, trigger, privilege, and RLS change. Cross-table trigger logic may require a deliberate reviewed SQL addition because Drizzle cannot express every PostgreSQL invariant.
4. Run `npm run db:check`, the full test suite, and `git diff --check`.
5. Set `DATABASE_MIGRATION_URL` for the intended non-production environment.
6. Run `npm run db:migrate` only after confirming the target. Production migration requires explicit approval and an operational backup/rollback decision.

Do not use schema push as the production workflow. Do not manually alter a deployed schema without adding a reproducible migration that reconciles source control.

The initial migration is tested in ordinary CI by applying it to a disposable PostgreSQL-compatible PGlite database. This verifies migration syntax and the core checks/triggers without Supabase credentials or persistent infrastructure. Provider-specific configuration and role-policy testing still require an isolated Supabase/PostgreSQL environment before public database access is enabled.

## Inventory authority

Every cohort chooses one immutable tracking mode:

- `aggregate`: `quantity_on_hand` is required and non-negative; serialized-unit rows are rejected.
- `serialized`: `quantity_on_hand` must be null; each physical item is represented once in `inventory_units`.

Direct tracking-mode changes are rejected in Phase 2A. A later authorized conversion operation must lock the bucket, prove there is no physical stock overlap or active commitment, and convert it atomically. Order-linked commitments do not exist until Phase 4.

## Test-event history

A test event targets exactly one aggregate cohort or one serialized unit. Cohort targets must be aggregate buckets, and serialized-unit events always have `quantity_tested = 1`. Test facts are append-oriented; corrections create same-target superseding events. Voiding records attribution while retaining the original observed result. Internal tester references, notes, measurements, serials, and asset paths are not public fields.

## Public data boundary and RLS

All six Phase 2A tables enable and force RLS with no policies, so anonymous and authenticated access is denied by default. Base-table grants are revoked from public-facing Supabase roles when those roles exist. No public database policy is introduced yet.

`src/db/public-product.ts` defines the explicit field allowlist and publication/active-SKU predicate for future catalog reads. It excludes raw inventory, location, operational notes, serialized-unit data, testing internals, attribution, cost/supplier data, and internal IDs. Phase 2C/2D must query through this boundary or an equally strict reviewed projection rather than selecting unrestricted base records.

## Free-tier and production caveats

The design requires one Supabase PostgreSQL project and no separate database server, queue, cache, or paid development service. The fixed development infrastructure target remains CAD $0/month, subject to current provider limits.

Supabase Free may be suitable for development and early validation, but it is not automatically sufficient for production reliability, retention, backup, recovery, connection, or capacity requirements. Before production data or sales, document the chosen project's limits, establish and test backup/restore and migration rollback procedures, separate preview from production, restrict provider access, and upgrade only when measured requirements justify it.

## Dependency review note

The runtime database packages have no known audit findings in the current lockfile. The full development audit reports four moderate findings through Drizzle Kit's deprecated `@esbuild-kit` loader and its nested legacy `esbuild`; the installed Drizzle Kit release is current. The affected development-server behavior is not exposed by LoonLink, and Drizzle Kit runs only as a local/CI migration CLI, so this is a documented temporary tooling risk rather than a runtime exposure. Recheck upstream releases during dependency updates instead of forcing the audit tool's incompatible downgrade.
