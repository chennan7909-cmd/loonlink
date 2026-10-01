# LoonLink Security

## Purpose and posture

LoonLink will handle business contact information, inventory, orders, and payment-provider references. It must protect customer separation, catalog integrity, compatibility provenance, stock accuracy, and payment state. This document defines baseline requirements; it is not a certification or claim of compliance.

Security is layered across the Next.js server, Supabase Auth/Postgres Row Level Security (RLS), database constraints and transactions, Stripe's hosted Checkout, deployment configuration, and operational review. The browser is always untrusted.

## Threat model

### Assets to protect

- Customer identity, contact details, addresses, RFQs, and order history.
- Operator accounts, roles, and administrative actions.
- Authoritative catalog, condition, price, compatibility, and evidence records.
- Inventory quantity, serialized-unit identity/test data, and reservations.
- Orders, payments, refunds, and shipment/tracking information.
- Supabase, Stripe, Vercel, database, and webhook secrets.
- Service availability, logs, backups, and audit history.

### Likely actors and failure modes

- Anonymous abuse: enumeration, scraping, spam RFQs, automated stock holds, injection, and denial of service.
- Malicious or compromised customers: cross-account access, price/quantity manipulation, replay, and object-reference attacks.
- Compromised or overprivileged operators: false compatibility claims, unauthorized price/stock changes, PII access, or destructive edits.
- Forged/replayed third-party events: fake payment success or repeated inventory mutation.
- Supply-chain compromise: malicious/vulnerable packages, CI actions, or leaked build credentials.
- Operational mistakes: publishing drafts, exposing serials/PII, stale evidence, incorrect environment targeting, or count drift.
- Concurrency/race conditions: overselling, double reservation, duplicate order/payment transitions, and late webhook conflicts.

### Main entry points

Public catalog/compatibility queries, authentication, checkout creation, order status, RFQ submission, admin mutations, file/evidence upload, Stripe webhooks, database APIs, deployment pipelines, and provider dashboards.

### Security priorities

1. Prevent unauthorized data access and privileged mutation.
2. Prevent false payment, price, inventory, and compatibility state.
3. Minimize stored sensitive data and blast radius.
4. Maintain traceability and safe recovery from retries or operator error.
5. Preserve availability without introducing infrastructure unsupported by actual risk.

## Authentication

- Use Supabase Auth when authentication is implemented; do not build custom password storage.
- Validate sessions server-side for protected routes/actions and use secure provider-supported cookie handling.
- Require verified email as appropriate before account-dependent sensitive actions.
- Configure secure, HTTP-only, same-site cookies and production HTTPS; apply CSRF protection to cookie-authenticated mutations through framework-supported origin checks/tokens as appropriate.
- Apply rate limits and generic error messages to login, recovery, and verification paths to reduce enumeration.
- Operator accounts should use phishing-resistant MFA when supported and required before production administration.
- Session invalidation, password recovery, account deletion, and email-change behavior must be tested before account features launch.

Guest checkout, if chosen, must use non-enumerable references and a narrowly scoped verification mechanism for access to order details. A guessed order number is never sufficient authentication.

## Authorization

- Authentication answers who the caller is; authorization separately determines what they may do.
- Enforce authorization on every server action, route handler, database operation, and object access. UI visibility is not a control.
- Use deny-by-default and least privilege. Public, customer, operator, and service operations receive distinct capabilities.
- Check resource ownership from trusted database relations, never from a client-supplied customer/user ID.
- Sensitive mutations use explicit application service methods and allowed state transitions.
- Reauthorize privileged actions at execution time; do not rely on stale client state.

## Admin authorization

- Store operator membership/role in a protected database table or equivalent server-controlled claim process. Never use user-editable profile metadata as authority.
- Only an already authorized role may grant, change, or revoke admin access, with audit attribution.
- Separate duties where practical: catalog/evidence publishing, inventory operations, and order/refund handling can use scoped roles even if one person initially holds several roles.
- Require server-side permission checks before all catalog publication, compatibility verification, pricing, stock, order, refund, shipment, RFQ, role, and evidence-file actions.
- Log security-relevant admin changes with actor, action, target, outcome, and safe metadata. Protect logs from routine editing.
- Consider reauthentication/MFA for role grants, refunds, secret/configuration changes, and bulk/destructive actions before those features exist.

## Supabase RLS strategy

Enable RLS on every exposed application table. The starting posture is no policies and therefore no access; add narrowly scoped policies only for required operations. Public and customer responses use allowlisted views/DTOs rather than `select *` from base tables.

| Operation/data | Anonymous | Authenticated customer | Authorized operator | Service role/server |
| --- | --- | --- | --- | --- |
| Public catalog `SELECT` | Allowlisted published view only | Same | Full fields only within role | Controlled maintenance/read |
| Public compatibility/evidence `SELECT` | Published conclusion plus visibility-approved evidence summary only | Same | Review fields within role | Controlled maintenance/read |
| Customer profile `SELECT` | Deny | Own allowlisted fields | Need-to-know | Controlled support/checkout |
| Customer profile `INSERT/UPDATE` | Deny except validated signup path | Own non-authoritative fields only | Need-to-know | Controlled workflows |
| Customer order/item/payment/shipment `SELECT` | Deny except a separately verified guest mechanism | Own sanitized projection only | Role-scoped | Webhook/reconciliation |
| Order creation | Validated server checkout endpoint only | Validated server checkout endpoint only | Approved assisted workflow if implemented | Transaction service |
| Order/payment lifecycle mutation | Deny | Deny | Only explicit permitted operator actions; never forge provider success | Verified webhook/reconciliation |
| Safe availability `SELECT` | Derived public projection only | Same | Exact operational view within role | Transaction service |
| Inventory/unit/commitment `INSERT/UPDATE/DELETE` | Deny | Deny | Explicit transaction functions within role | Narrow checkout/reconciliation functions |
| Compatibility/evidence `INSERT/UPDATE/DELETE` | Deny | Deny | Role-scoped review/publish functions | Controlled maintenance |
| Test-event `SELECT` | Approved derived public claim/summary only | Purchased-unit projection only if later approved | Role-scoped complete record | Controlled maintenance |
| Test-event `INSERT/UPDATE/DELETE` | Deny | Deny | Append/void/supersede functions within role; no destructive history rewrite | Controlled maintenance |
| RFQ creation | Validated, rate-limited server endpoint only | Same | Approved operator workflow | Controlled intake |
| RFQ `SELECT/UPDATE` | Deny | Own projection only if explicitly supported | Role-scoped | Controlled intake/support |
| Admin membership/role mutation | Deny | Deny, including self-assignment | Restricted grant/revoke operation with audit | Bootstrap/recovery only |
| Audit/webhook event access | Deny | Deny | Restricted read where required; no routine rewrite | Required backend operations |

Implementation rules:

- Prefer safe database views or server-created projections for public data rather than granting broad table access.
- Policies must use trusted `auth.uid()` relationships and protected role membership.
- Do not embed a service-role key in browser code. Service-role access bypasses RLS and therefore requires explicit server authorization and narrow functions.
- Use `SECURITY DEFINER` database functions only where a transaction/invariant requires them; fix `search_path`, validate the caller/arguments, limit grants, and test abuse cases.
- Test policies with anonymous, customer A, customer B, operator roles, inactive operators, and service paths.
- Database constraints remain necessary even with RLS; RLS is not input validation or concurrency control.
- Compatibility review state, payment success, inventory state, test history, and admin membership are never customer-writable.

## Public data and indexable output

Public product APIs, product/compatibility pages, SEO metadata, JSON-LD, sitemaps, feeds, and previews must use the allowlisted public catalog projection defined in `DATA_MODEL.md` or an equally strict allowlist. They must never contain serial numbers, cost or supplier information, private inventory counts/locations/notes, customer data, Stripe identifiers, internal evidence, tester identity, raw measured values, or restricted test assets.

Serial numbers are never public catalog data. A future purchaser-specific disclosure, if approved, requires ownership authorization and does not change the public rule. Hiding a field in UI code, excluding it from visible HTML, or setting `noindex` is not authorization.

## Stripe Checkout security

- Use Stripe-hosted Checkout so LoonLink never receives or stores card numbers or CVCs.
- Create Checkout Sessions only on the server after validating active SKU, checkout eligibility, quantity, currency, authoritative unit price, discount policy, shipping/tax inputs, and inventory reservation.
- Accept SKU IDs and quantities from the client, not authoritative amounts. Recompute all totals server-side in integer minor units.
- Use a server-generated internal order ID/reference in Stripe metadata. Metadata assists correlation; it does not authorize a transition by itself.
- Restrict success/cancel URLs to approved origins and never put secrets or sensitive data in URLs/metadata.
- Use Stripe idempotency keys when creating sessions/payment operations where appropriate.
- Do not mark an order paid from the browser redirect, query string, or client callback.
- Before production payments, resolve tax configuration, shipping rules, refund operations, business/legal settings, and supported geography. Tax integration is not a Phase 0 implementation.

## Webhook signature verification

- The webhook route must read the raw, unmodified request body and verify the Stripe signature using the correct environment's webhook secret and Stripe library.
- Reject missing, invalid, or stale signatures according to Stripe's supported verification behavior.
- Accept only explicitly handled event types and schema/API versions. Ignore unknown types safely.
- Return success only after durable processing or durable enqueueing; the MVP should prefer short transactional handling when within runtime limits.
- Use separate webhook secrets and endpoints/configuration for test and production environments.
- Never log the signing secret or an unrestricted raw payload.

## Webhook idempotency and ordering

- Persist the Stripe event ID under a unique constraint before applying effects.
- Process the event, related payment/order transition, inventory allocation/release, and processed marker atomically where possible.
- Lock affected records and validate the current state so retries and out-of-order events cannot regress a terminal state or double-apply effects.
- Verify expected order, Checkout Session/PaymentIntent references, amount, and currency before success.
- Treat duplicates as successful no-ops. Record sanitized failures for retry/reconciliation.
- Do not assume delivery order or exactly-once delivery. Add scheduled/manual reconciliation before production if missed events could leave material state inconsistent.

## Transaction-safe inventory handling

- Availability is server/database derived. Aggregate availability is physical `quantity_on_hand` minus active commitment quantities; serialized availability is on-hand units without an active commitment.
- Use one Postgres transaction to lock the applicable bucket/unit rows, recheck derived availability, and create or transition the commitment.
- Enforce non-negative aggregate quantity, mutually exclusive aggregate/serialized authority, and commitment quantities that cannot exceed locked available stock.
- A partial/conditional unique constraint or equivalent transactional invariant prevents a serialized unit from having more than one active commitment.
- Each bucket uses one physical-stock authority: aggregate quantity or serialized units. The database rejects aggregate/unit overlap.
- The single inventory-commitment relationship owns reservation/allocation linkage; unit/order ownership is not duplicated elsewhere.
- Commitment creation, allocation, release, consumption, and expiry require unique idempotency identifiers and current-state checks.
- Expiry workers/actions must lock and recheck payment/order status so a late successful payment cannot race with stock release.
- If a verified payment arrives after release, atomically attempt a new commitment. When stock is unavailable, record the payment but place the order in `requires_review`/`paid_unallocatable`; never manufacture an allocation or silently oversell.
- Refund is not a restock operation. Any restock is a separate authorized, auditable physical-inventory action after cancellation-before-shipment or received-return inspection as applicable.
- Stripe API calls cannot participate in a Postgres transaction. Model recoverable intermediate states, expirations, and reconciliation rather than holding a database transaction over a network call.
- Concurrency tests must demonstrate that competing checkouts cannot oversell aggregate or serialized stock.

## Server-side pricing authority

- The database/server owns SKU price, currency, checkout eligibility, discounts, shipping charges, tax inputs/results, and order totals.
- Store purchase-time line and total snapshots on the order; later catalog price changes do not rewrite history.
- Validate arithmetic and currency consistency. Use integers in minor units, never floating-point money.
- Reject or restart checkout when the submitted cart no longer matches active authoritative terms; show the buyer an accurate change message.
- Promotions or negotiated pricing, if later introduced, need server-owned eligibility and audit rules. A coupon string or client total is never sufficient authority.
- Checkout line items must be built from the immutable server-side order snapshot. Stored Stripe Price IDs, if used, must be verified for amount and currency; promotion codes remain disabled unless server-authorized and reconciled.

## Input validation and output safety

- Define Zod schemas at HTTP/server-action boundaries and database constraints underneath them.
- Normalize identifiers and search values carefully; constrain strings, arrays, quantities, enum values, URLs, and uploaded file type/size.
- Reject unknown fields on sensitive mutations to reduce mass-assignment risk.
- Encode output through framework defaults; sanitize any intentionally rendered rich text. Do not render operator/customer HTML directly.
- Parameterize database queries through supported clients; do not concatenate SQL.
- Protect redirect targets against open redirects and protect remote fetches against SSRF with allowlists and timeouts if such fetching is introduced.
- Store evidence files only after authorization, type/size validation, safe naming, and malware/content handling proportionate to risk. Avoid public buckets for restricted evidence.
- Customer-supplied equipment descriptions and RFQ text are untrusted even when seen only by operators.

## Rate limiting and abuse prevention

Apply rate limits by an appropriate combination of IP, session, account, normalized contact, endpoint, and resource to:

- authentication/recovery;
- search and compatibility lookup when abuse affects availability;
- checkout/reservation creation and order-status polling;
- RFQ/contact submission;
- file uploads; and
- admin authentication and sensitive mutations.

Limits need safe proxy/IP configuration, bounded request bodies, clear retry responses, and monitoring. Add bot challenges only when measured abuse warrants their accessibility and privacy cost. Reservation limits and short expiries reduce stock-hold abuse; rate limiting alone does not.

For unauthenticated RFQs specifically:

- accept only the expected content type and strict schema; reject unknown fields;
- start with a configurable 32 KiB body cap, at most 20 items, and explicit field caps (for example 320 characters for email and 4,000 for free-text context); keep quantities within a documented business maximum;
- accept no attachments in the MVP;
- start with conservative configurable per-IP and normalized-email/contact throttles, plus an idempotency token or duplicate window; tune from observed legitimate traffic rather than adding a new service;
- use an opaque public reference and provide no unauthenticated enumeration/list endpoint;
- return generic safe responses that do not confirm an existing customer, email, or prior RFQ;
- render submitted text as encoded plain text, never trusted HTML;
- send operator notifications only to fixed configured recipients with a fixed template;
- never allow requester-controlled sender, recipient, subject, HTML, or arbitrary email forwarding; and
- use a honeypot/minimum-submit-time check first; add CAPTCHA or another service only after measured abuse justifies it.

## Secret management

- Store secrets in local ignored environment files and Vercel/Supabase/Stripe secret stores as appropriate; never commit them.
- Phase 2A uses `DATABASE_URL` for server-only runtime access and `DATABASE_MIGRATION_URL` for controlled migration execution. Neither name may use the `NEXT_PUBLIC_` prefix, and neither value is required by ordinary lint, typecheck, unit, browser, or build CI jobs.
- `.env.example` contains variable names with empty values only. `.env.local` and all other populated environment files remain ignored.
- Clearly separate development, preview, and production keys/projects. Preview deployments must not access production commerce data.
- Expose only intentionally public configuration (for example a Supabase anonymous key protected by RLS); treat all other keys as server-only.
- Validate required server environment variables at startup/build boundaries without printing their values.
- Rotate on exposure or staff/access change and document ownership. Scope keys to minimum permissions where providers support it.
- Secret scanning should run in development/CI; example files contain placeholders only.

## Privacy and logging

- Collect only data needed for purchasing, fulfillment, support, RFQ handling, security, and legal/accounting needs.
- Define privacy notice, retention/deletion rules, data access handling, cookie/analytics choices, and Canadian-market legal review before production.
- Do not log raw card data, secrets, auth tokens, session cookies, full webhook bodies, full addresses, unnecessary email/phone values, or full hardware serial numbers.
- Use structured logs with request/correlation IDs, event type, safe entity ID, outcome, and sanitized error codes.
- Restrict production log access and retention; avoid transferring PII to extra vendors without a documented need.
- Error responses should be useful without exposing stack traces, policy details, existence of other users' records, or provider secrets.
- Backups and exports inherit the sensitivity of source data and require access, retention, and deletion controls.

## Dependency and supply-chain security

- Keep dependencies minimal and pin them with a committed lockfile once application work begins.
- Review a package's maintenance, provenance, permissions, transitive footprint, license suitability, and necessity before adding it.
- Run automated dependency/security scanning and framework advisories in CI; promptly assess high-impact issues in internet-facing, auth, database, payment, parsing, and build dependencies.
- Use supported Node.js/framework releases and planned upgrade windows.
- Pin third-party CI actions to trusted immutable versions/commits where practical and minimize workflow permissions.
- Protect the main branch with review/status requirements when collaboration begins; restrict deployment credentials and audit provider access.
- Do not run untrusted scripts, fixtures, or scraped data in privileged production contexts.

## Security verification before production

- Threat model reviewed against implemented routes and data flows.
- RLS/authorization matrix tested, including cross-customer and inactive-operator denial.
- Webhook signature, replay, duplicate, out-of-order, amount mismatch, and environment mismatch tests pass.
- Concurrent reservation/allocation/release tests pass for aggregate and serialized inventory.
- Client manipulation of price, currency, quantity, role, ownership, and status is rejected.
- Secrets and personal data are absent from client bundles, source, fixtures, and logs.
- Security headers, cookie settings, CSRF protections, upload restrictions, rate limits, and error behavior are verified.
- Dependency and secret scans pass or have documented accepted risk.
- Backup/restore, incident response contacts, provider access, tax, privacy, terms, refund, shipping, and operational procedures are ready for the chosen launch scope.

## Reporting and response

Until a public security contact and response process are approved, suspected vulnerabilities should be reported privately to the repository owner. Do not include real credentials, personal data, or destructive proof in an issue. A production launch requires a documented triage, containment, rotation, notification, recovery, and post-incident process.
