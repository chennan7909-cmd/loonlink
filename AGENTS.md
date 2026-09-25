# AGENTS.md — Mandatory Repository Rules

These rules apply to every coding or documentation agent working in this repository. They are constraints, not suggestions. If a requested change conflicts with them, stop and surface the conflict instead of silently weakening the design.

## Product integrity

- Treat **LoonLink** as a working product/brand name only. Never state or imply trademark, registration, incorporation, or legal clearance.
- Never invent commercial facts, stock, prices, customer claims, compatibility, certification, authenticity, compliance, testing, warranty, or provenance.
- A compatibility conclusion requires recorded provenance. An uncertain, conflicting, expired, or incomplete conclusion must never be shown as verified.
- Customer-reported compatibility evidence remains unverified unless independently validated under the review policy.
- A public testing claim must derive from applicable, non-voided test events; never add a free-standing “tested” boolean to a product or SKU.
- Keep the initial focus on B2B optical transceiver discovery, evidence-backed compatibility, tested pre-owned inventory, fixed-price checkout where eligible, and RFQs.
- Do not expand the MVP without an explicit product decision recorded in `PRD.md` and `ROADMAP.md`.

## Approved technology stack

- Next.js App Router with React and strict TypeScript.
- Tailwind CSS and accessible semantic UI primitives. Add a component library only through an explicit, documented decision.
- Supabase Postgres, Auth, and Storage only when required.
- Stripe-hosted Checkout for card payments; Stripe webhook events drive authoritative payment confirmation.
- Zod for validation at untrusted application boundaries.
- Vitest for unit/service tests, React Testing Library for component behavior, Playwright for critical browser flows, and database/integration tests for constraints, RLS, and transactions.
- Vercel for application hosting. Development fixed infrastructure must target CAD $0/month; early production targets Vercel Pro plus Supabase Free where appropriate. Upgrade Supabase only when measured usage or reliability warrants it.

Do not substitute core framework, database, authentication, payment, or hosting choices without an architectural decision and corresponding documentation update.

## Architecture constraints

- Build a modular monolith: one Next.js application, one Postgres database, clear domain modules, and explicit server-only boundaries.
- Do not introduce microservices, message brokers, Kubernetes, a separate search engine, a data warehouse, or bespoke infrastructure prematurely.
- Use Server Components by default. Add Client Components only for interaction requiring browser state or APIs.
- Keep domain logic out of page components and route handlers. Use typed service/domain modules with small adapters for Supabase and Stripe.
- Access privileged data and third-party secrets only from server-only modules.
- Use Postgres transactions and constraints for business invariants; do not rely on a browser or a sequence of unrelated queries.
- Preserve the domain distinction among product, SKU, aggregate inventory, and serialized inventory unit.
- Give every physical unit one authoritative representation: aggregate cohort quantity or a serialized-unit row, never both.
- Use one inventory-commitment relationship for reservation/allocation ownership; do not duplicate order ownership on inventory units.
- Store core searchable optical properties in typed columns, not only in JSON or prose. JSON may hold non-core extensions.
- Treat compatibility and compatibility evidence as first-class, reviewable records.
- Record monetary values in integer minor units with an explicit ISO currency.
- Keep payment, order, inventory, and shipment states separate; never infer one solely from another.

## Security rules

- Treat every browser, request payload, URL parameter, webhook body, uploaded file, and external response as untrusted.
- Enforce authentication and authorization server-side. Hidden controls and client-side role checks are not authorization.
- Default Supabase tables to Row Level Security with deny-by-default policies. Service-role credentials are server-only and narrowly used.
- Never expose service-role keys, Stripe secret keys, webhook secrets, or database credentials to client bundles or public logs.
- Never store, proxy, or log raw card data. Checkout Sessions must be created server-side.
- Never trust client-supplied prices, totals, discounts, currency, tax, shipping fees, inventory, roles, ownership, or order state. Recompute from authoritative server data.
- Build Stripe Checkout line items from immutable server-side order snapshots; later catalog price changes must not alter historical orders.
- Verify Stripe webhook signatures against the raw body. Persist event IDs and process events idempotently.
- Reserve, allocate, release, and decrement inventory transactionally with row locking or an equivalent atomic database operation.
- Validate and normalize input; constrain lengths and enumerations; rate-limit abuse-sensitive endpoints.
- Minimize personal data and redact secrets, tokens, payment details, and unnecessary customer data from logs.
- Public APIs and indexable output—including product/compatibility pages, metadata, JSON-LD, sitemaps, feeds, and previews—must use explicit allowlisted projections.
- Serial numbers are never public catalog fields. Cost/supplier data, private stock data, customer PII, sensitive Stripe identifiers, and internal testing/evidence details are also excluded.
- Follow `SECURITY.md`; report suspected vulnerabilities without publishing exploit details or real secrets.

## Testing requirements

- Every behavior change needs tests at the lowest effective level, plus integration or end-to-end coverage when a boundary or critical journey is involved.
- Unit-test compatibility status derivation/display rules, pricing calculations, validation, and state-machine transitions.
- Integration-test RLS, admin authorization, database constraints, inventory reservation/allocation/release, order creation, and webhook idempotency/concurrency.
- Test the aggregate-versus-serialized exclusivity rule and ensure public projections cannot leak restricted fields.
- End-to-end test catalog discovery, compatibility status presentation, eligible checkout handoff with Stripe test mode or mocks, RFQ submission, and essential admin authorization paths.
- Add regression tests for each fixed defect where practical.
- Tests must be deterministic. Do not call live payment or production services in the test suite.
- Before completion, run formatting, linting, type checking, unit/integration tests, relevant end-to-end tests, and a production build. Document anything that could not run.

## Coding conventions

- Enable strict TypeScript; avoid `any`. Use `unknown` and narrow it at boundaries.
- Prefer explicit domain types and discriminated unions for lifecycle/status values.
- Use descriptive names, small focused functions, and dependency injection at external-service seams.
- Keep server/client imports unambiguous and mark sensitive modules server-only.
- Use UTC timestamps in persistence and ISO 8601 at interfaces; localize only for display.
- Use integer minor units for money and avoid floating-point arithmetic.
- Use database-generated UUIDs (or one documented consistent identifier strategy).
- Write accessible HTML: keyboard operation, visible focus, labels, useful alternative text, and sufficient contrast.
- Keep documentation synchronized with architectural or domain decisions.
- Prefer the simplest design that meets current requirements.

## Forbidden shortcuts

- No hard-coded or client-controlled prices, discounts, inventory, compatibility verdicts, permissions, or order/payment success.
- No physical stock represented simultaneously by an aggregate count and a serialized unit.
- No public “tested” claim without applicable test events.
- No public query or SEO renderer that selects unrestricted base-table records.
- No mutation through a privileged database client without explicit authorization checks.
- No disabling RLS as a convenience.
- No webhook processing without signature verification, event deduplication, and transaction-safe state changes.
- No decrementing inventory only after redirect success, and no treating the success page as proof of payment.
- No compatibility claim without evidence, scope, review state, and provenance.
- No unstructured JSON as the only home for core searchable optical specifications.
- No production secrets, personal data, or realistic card data in source, fixtures, screenshots, or logs.
- No silent swallowing of payment, inventory, compatibility, or authorization errors.
- No scraping, generated evidence, or fabricated seed data presented as real.
- No dependency added without a concrete need and basic maintenance/security review.
- No broad refactors, infrastructure, or features unrelated to the requested phase.

## Definition of done

A change is done only when:

- acceptance criteria and the active roadmap phase are satisfied without expanding scope;
- security boundaries and authorization are explicit and tested;
- database changes, when phases permit them, have reviewed migrations, constraints, indexes, and RLS policies;
- relevant unit, integration, RLS, concurrency, and end-to-end tests pass;
- formatting, linting, strict type checking, and production build pass;
- accessibility and failure/empty/loading states appropriate to the change are addressed;
- logs and errors do not expose secrets or unnecessary personal data;
- documentation and diagrams match the implementation;
- no unsupported claims or placeholder data can be mistaken for real facts;
- the diff contains no unrelated changes; and
- any residual risk, manual step, or unverified assumption is documented.

Phase 0 is complete only when the seven requested documents exist and agree. It explicitly excludes initializing Next.js, installing packages, configuring services, creating migrations or UI, implementing APIs/authentication, committing, or beginning Phase 1.
