# LoonLink Roadmap

## Delivery principles

- Optimize for a solo developer and a modular monolith.
- Keep development fixed infrastructure at CAD $0/month.
- Target Vercel Pro plus Supabase Free where appropriate for early production; upgrade Supabase only when usage or reliability evidence justifies it.
- Treat each phase as a gated increment. Do not pull later-phase scope forward merely because it is adjacent.
- Use synthetic fixtures clearly marked as such until approved real product, inventory, evidence, and policy data exist.
- Never publish unsupported compatibility, certification, authenticity, compliance, condition, testing, inventory, or commercial claims.
- Tax integration is required for production sales but is not a Phase 0 implementation.

## Phase 0 — Product Definition & Architecture

### Objective

Establish a consistent, implementation-ready product boundary, architecture, domain model, security posture, and delivery sequence before application code or service configuration begins.

### Scope

- `README.md`: product overview, compatibility-first approach, planned stack, and high-level architecture.
- `PRD.md`: users, journeys, MVP, non-goals, measures, assumptions, and open questions.
- `AGENTS.md`: mandatory implementation rules and definition of done.
- `ARCHITECTURE.md`: components, trust boundaries, flows, deployment, and scaling.
- `DATA_MODEL.md`: logical model including aggregate and serialized used inventory and compatibility provenance.
- `SECURITY.md`: threat model and required controls.
- `ROADMAP.md`: phase gates through production hardening.
- Cross-document terminology, scope, claims, invariants, and security review.
- Phase 0.1 hardening for single-source inventory, test events, compatibility scope/evidence, public projections, operation-level authorization, RFQ abuse controls, and commerce exceptions.

### Exclusions

- Next.js initialization, application/UI/API/authentication code, packages, service configuration, migrations, seed data, deployment, and commits.
- Actual catalog, compatibility, test, inventory, price, legal, compliance, or business-policy assertions.

### Tests/reviews

- Confirm all seven documents exist and render as Markdown/Mermaid where supported.
- Search for contradictory technology, scope, state, and cost statements.
- Verify consistent use of product, SKU, inventory quantity, serialized inventory unit, compatibility, evidence, order, payment, shipment, and RFQ.
- Trace purchase/webhook/RFQ flows against the data model and security controls.
- Confirm used inventory and provenance are first-class.
- Confirm aggregate and serialized authority cannot claim the same physical stock.
- Confirm testing claims require applicable test events and indexable output uses an allowlisted public projection.
- Confirm late-payment, refund, cancellation, and paid-but-unallocatable outcomes cannot silently oversell or restock.
- Confirm no fabricated business facts or accidental implementation artifacts exist.

### Exit criteria

- The seven documents agree on MVP scope, stack, boundaries, trust model, and roadmap.
- Major assumptions, unresolved decisions, and risks are explicit.
- Phase 1 can start without interpreting Phase 0 as authorization to configure external services or implement later-phase features.

## Phase 1 — Storefront Foundation

### Objective

Create a production-shaped, accessible Next.js storefront shell and engineering baseline using clearly synthetic local fixtures, without persistent commerce data or live integrations.

### Scope

- Initialize Next.js App Router, React, strict TypeScript, Tailwind, lint/format/type-check/build tooling, and the agreed test stack.
- Establish modular domain/folder boundaries and server-only conventions.
- Implement responsive public layout, navigation, catalog list/search/filter presentation, product detail presentation, and compatibility-status UI states using synthetic fixtures.
- Add accessible loading, empty, error, and not-found states.
- Establish environment validation patterns, security headers, CI checks, and lightweight architecture decision records as needed.

### Exclusions

- Supabase or Stripe configuration, migrations, real authentication, persistent inventory/orders/RFQs, live checkout, admin mutations, real compatibility claims, and production deployment.
- Claims that fixture products, quantities, prices, testing, or compatibility are real.

### Tests

- Unit tests for formatting and compatibility presentation rules, especially unknown/uncertain versus verified.
- Component tests for search/filter controls, product cards/details, condition/availability labels, and accessibility behavior.
- Playwright smoke tests for navigation, synthetic catalog discovery, responsive behavior, keyboard access, and error/empty states.
- Public-projection tests for product pages, compatibility presentation, metadata, JSON-LD, sitemaps, feeds/previews if present, proving restricted fields cannot enter indexable output.
- Lint, strict type check, test suite, and production build in CI.

### Exit criteria

- The application shell and synthetic storefront flows work accessibly across supported viewport/browser targets.
- Client/server boundaries follow `AGENTS.md`; no sensitive or authoritative logic is embedded in the client.
- CI gates are green and no live-service configuration or misleading fixture content exists.

## Phase 2 — Product & Inventory Persistence

### Objective

Persist the catalog, structured optical specifications, sellable SKUs, and transaction-safe aggregate/serialized inventory in Supabase Postgres.

### Phase 2A boundary

Phase 2A establishes Drizzle schema definitions, reproducible SQL migrations, the six core product/inventory/testing tables, database-enforced authority rules, deny-by-default RLS, a server-only connection boundary, and a typed public projection. It does not configure or deploy a Supabase project, seed inventory, connect storefront routes to PostgreSQL, or implement repositories and stock operations. Those remaining Phase 2 objectives are gated follow-on work.

### Scope

- Configure isolated Supabase development/preview environments within the cost target.
- Create reviewed migrations for products, product specs, SKUs, authoritative inventory cohorts, optional serialized inventory units, first-class test events, operator-role foundation, and necessary audit fields.
- Add constraints, indexes, publication states, safe public projections, and deny-by-default RLS.
- Implement typed server-side repositories/services and catalog reads.
- Implement atomic physical stock adjustment and serialized-unit selection primitives. Order-linked reservation/allocation begins in Phase 4.
- Add synthetic development seeds that are unmistakably non-commercial test data.

### Exclusions

- Compatibility conclusions/evidence persistence, customer checkout, Stripe, orders/payments/shipments, RFQ workflow, and complete admin UI.
- Public exposure of raw counts unless separately approved, and any public catalog exposure of serial numbers.

### Tests

- Migration up/down or reset validation in disposable environments.
- Constraint tests for identifiers, money, condition/status values, non-negative stock, aggregate-versus-serialized exclusivity, cohort semantics, and serialized-unit identity.
- RLS tests for anonymous, customer, operator, and unauthorized access.
- Repository/integration tests for published catalog queries and structured filtering.
- Test-event applicability/history tests, including that public testing claims cannot exist without qualifying evidence.
- Public-projection tests proving serials, supplier/cost data, private inventory, test internals, and admin metadata are excluded.

### Exit criteria

- Catalog pages read from Postgres through safe server paths and expose only published/customer-safe fields.
- Structured specifications support the agreed filters without JSON-only core data.
- Each physical unit has exactly one authoritative aggregate or serialized representation; public testing statements derive from applicable events.
- Migrations, RLS, indexes, and data dictionary match `DATA_MODEL.md` or the docs are deliberately updated.

## Phase 3 — Compatibility Engine

### Objective

Deliver curated, evidence-backed compatibility lookup that communicates scope and uncertainty accurately.

### Scope

- Migrations and RLS for compatibility and compatibility evidence, with review/publication/supersession metadata.
- Normalization and lookup by supported target vendor/platform/model/OEM part, hardware revision, firmware/software constraint, and optional SKU/coding scope.
- Server-side rules for verified compatible, verified unsupported/incompatible, uncertain, expired, and unknown/no-record presentation.
- Evidence citations/provenance display with scope, caveats, review timing, and safe source handling.
- Authorized minimal curation path needed to load/review records; full admin experience remains Phase 6.

### Exclusions

- Automated scraping, AI-generated verdicts, claims inferred only from optical spec similarity, exhaustive vendor coverage, and unconditional compatibility guarantees.
- A separate search engine or knowledge graph without measured need.

### Tests

- Unit/property tests for normalization, exact-versus-family scope precedence, SKU/coding applicability, hardware/firmware/software constraints, customer reports, status derivation, conflicts, expiry, and missing evidence.
- Integration/RLS tests preventing draft/rejected/restricted evidence leakage and unauthorized publication.
- Component/E2E tests that uncertain, expired, conflicting, or absent results never appear verified.
- Regression fixtures for model/revision/software boundaries and superseded evidence.
- Public-projection/SEO tests proving restricted evidence, internal notes, device output, and customer reports do not leak into indexable output.

### Exit criteria

- Every public verified or unsupported conclusion has qualifying active evidence, reviewer attribution, scope, and review date.
- Unknown and uncertain states are explicit and safe.
- No UI or API path can promote incomplete evidence to verified status.
- Launch-corpus and evidence-threshold questions are documented or resolved before real records are published.

## Phase 4 — Cart & Stripe Checkout

### Objective

Enable secure fixed-price purchasing for eligible inventory without storing card data or trusting client prices/stock.

### Scope

- Cart behavior that submits only identifiers/quantities for server revalidation.
- Migrations/services for customers as needed, orders, order items, payments, shipments foundation, inventory commitments, and Stripe event deduplication.
- Server-authoritative price/currency/eligibility/stock calculation and immutable order snapshots.
- Transaction-safe expiring commitments/reservations for aggregate and serialized inventory.
- Server-created Stripe Checkout Sessions using test mode first.
- Raw-body signature-verified, idempotent webhook processing with state locks and amount/currency verification.
- Checkout status, cancellation/expiry release, reconciliation path, and baseline checkout abuse limits.
- A `requires_review`/`paid_unallocatable` path that records genuine payment without inventing stock and requires operator resolution.
- Explicit refund-without-restock, authorized restock, and pre-/post-payment cancellation behavior.

### Exclusions

- Stored card data, custom card forms, client-authoritative totals, purchase orders/credit terms, negotiated pricing, subscriptions, multi-currency, international sales automation, and full returns portal.
- Production payment acceptance before Phase 7 launch requirements—including tax—are met.

### Tests

- Unit tests for totals, minor-unit money, validation, state machines, and change detection.
- Integration tests for immutable order/price snapshots, reservation expiry, webhook signature failure, duplicate and out-of-order events, amount/currency mismatch, and reconciliation.
- Concurrent last-unit checkout tests proving no oversell for aggregate and serialized stock.
- Late-payment tests covering successful reacquisition and the paid-but-unallocatable manual exception.
- Refund/restock and pre-/post-payment cancellation tests proving refund does not automatically create stock.
- Playwright test-mode/mocked flows for success, cancellation, processing delay, price/stock change, and unavailable inventory.
- Confirmation that success redirects cannot mark orders paid.

### Exit criteria

- Only the server creates Checkout Sessions from authoritative data.
- Duplicate/reordered webhooks and concurrent buyers cannot double-charge application state or oversell inventory.
- Abandoned, expired, failed, late-paid, refunded, cancelled, and paid-but-unallocatable outcomes are deterministic and operator-manageable.
- Card data never enters LoonLink systems or logs.
- Failure, expiry, late payment, and reconciliation behaviors are documented and tested.

## Phase 5 — B2B RFQ

### Objective

Provide a safe, low-friction quote-request path for volume, unavailable, ambiguous, or non-checkout needs.

### Scope

- RFQ request/item migrations, RLS, validation, public reference, and operator-visible lifecycle.
- Multi-item form with optional catalog references, free-text part needs, quantity, equipment context, and business contact details.
- Rate limiting, spam controls proportionate to observed abuse, privacy-conscious receipt, and operational notification if justified.
- Clear language that submission is not an accepted quote, stock reservation, price, or compatibility guarantee.

### Exclusions

- Automated pricing/quote generation, quote acceptance, purchase orders, credit approval, CRM platform, contractual workflow, and inventory reservation by RFQ.

### Tests

- Schema and database constraint tests, including meaningful-item requirement and positive quantity.
- RLS/cross-customer privacy tests and admin-role tests.
- Rate-limit, replay/spam, payload-size, injection/output-encoding, and notification-failure tests.
- Playwright tests for valid, invalid, inaccessible, and confirmation flows.

### Exit criteria

- Valid RFQs are durably captured with private contact data and usable item context.
- Abuse controls and operator workflow are functional without exposing request/customer data.
- RFQs cannot mutate inventory or masquerade as orders or compatibility conclusions.

## Phase 6 — Admin

### Objective

Give authorized operators the minimum safe tools to curate and operate the MVP without direct routine database editing.

### Scope

- Supabase Auth integration and protected operator experience.
- Server-enforced roles for catalog, compatibility/evidence, inventory, order/shipment, RFQ, and access administration as required.
- Draft/review/publish/archive flows; evidence supersession and compatibility review controls.
- Inventory receipt/adjustment/quarantine and serialized-unit/test record management.
- Order/payment read views, permitted fulfillment/refund operations, RFQ triage, and audit events.
- An authorized queue and resolution action for `requires_review` orders, including paid-but-unallocatable refund or approved fulfillment resolution.
- Validation, confirmation, optimistic/concurrency handling, and safe file management if evidence assets are supported.

### Exclusions

- General ERP/WMS/CRM replacement, bulk automation without safeguards, arbitrary SQL, analytics warehouse, multi-vendor seller portal, and unreviewed compatibility publishing.

### Tests

- Authentication/session tests and complete role/permission matrix tests at server and RLS layers.
- Cross-role and inactive/revoked-operator denial tests.
- Workflow/state transition, audit attribution, concurrent edit, file validation, and destructive-action safeguard tests.
- Playwright coverage for essential catalog, evidence, inventory, fulfillment, and RFQ workflows.

### Exit criteria

- Operators can run the defined MVP workflows through least-privilege tools.
- Every privileged mutation is server-authorized, validated, and attributable.
- No ordinary admin workflow requires a service-role credential in the browser or manual production database edits.
- Compatibility cannot be published without the required evidence/review gates.

## Phase 7 — Production Hardening & Deployment

### Objective

Validate operational, legal, security, reliability, and deployment readiness, then launch only the approved Canadian scope.

### Scope

- Separate production configuration on Vercel Pro and an appropriate Supabase tier (Free only if measured reliability/capacity requirements are met).
- Domain/TLS, environment isolation, secret rotation, least-privilege provider access, deployment controls, and rollback strategy.
- Production tax integration/configuration and validation for served jurisdictions.
- Approved privacy, terms, returns, warranty, shipping, fulfillment, payment/refund, and compatibility-disclaimer policies.
- Monitoring, alerting, structured log redaction/retention, payment/inventory reconciliation, backup/restore testing, incident response, and runbooks.
- Performance, accessibility, SEO, browser/device, security, privacy, and recovery reviews.
- Launch-data review for accuracy, evidence, condition, price, stock, and public presentation.

### Exclusions

- New geographies, currencies, marketplaces, mobile apps, recommendation AI, microservices, or major features unrelated to launch readiness.
- Automatic Supabase upgrade without a demonstrated capacity, backup, support, or reliability requirement.

### Tests

- Full unit/integration/E2E suite against production-like isolated environments.
- Load and query-plan testing for expected catalog, compatibility, checkout, webhook, and RFQ patterns.
- Authorization/RLS, dependency, secret, header/cookie/CSRF, upload, webhook, and client-manipulation security verification.
- Accessibility audit of critical journeys and supported-browser/device checks.
- Backup restore, rollback, webhook/reconciliation recovery, inventory correction, incident tabletop, and alert tests.
- Tax/shipping/refund calculations and operational acceptance testing for the approved launch jurisdictions.

### Exit criteria

- No open critical security, privacy, payment, inventory, compatibility-integrity, accessibility, or data-loss issue.
- Tax and other required production policies/configuration are approved and tested for the actual launch scope.
- Monitoring, backups/restores, reconciliation, incident response, fulfillment, refund, and rollback procedures have named ownership and have been exercised.
- Launch catalog and compatibility evidence have been reviewed; no fabricated or unsupported claims are present.
- Production go/no-go is explicitly approved based on measured readiness, not roadmap completion alone.
