# LoonLink Product Requirements Document

## Status and purpose

This document defines the initial MVP for LoonLink, a B2B optical transceiver commerce and compatibility platform focused first on Canada. LoonLink is under development. Product, compatibility, certification, authenticity, compliance, inventory, and commercial statements must be backed by actual records before publication.

## Problem

Business buyers evaluating optical transceivers must often combine incomplete listings, vendor documentation, equipment context, and seller assertions. They need to know both whether an item meets technical requirements and what exactly is being sold, especially for pre-owned equipment. Inconsistent naming, unstructured specifications, ambiguous condition, and unevidenced compatibility statements create avoidable research and purchasing risk.

## Target users

- IT and network administrators sourcing replacement or expansion optics.
- Procurement staff who need comparable specifications, condition, quantity, and documented purchasing records.
- Managed service providers and system integrators sourcing parts for client environments.
- Small and midsize Canadian organizations that may need a quote before purchasing.
- Authorized LoonLink operators maintaining catalog, evidence, inventory, orders, and RFQs.

The MVP is not designed for consumer shopping, a multi-vendor marketplace, or automated network design.

## Value proposition

LoonLink aims to reduce the work required to discover and assess optical transceivers by combining:

- normalized, searchable optical specifications;
- clear separation of product, SKU, stock quantity, and serialized used unit;
- transparent condition and test information when recorded;
- compatibility conclusions linked to evidence and provenance;
- straightforward checkout for eligible stock; and
- an RFQ path for volume, ambiguous, or non-checkout needs.

Compatibility information is scoped evidence-based decision support, not an unconditional guarantee.

Customer-facing “Tested” or “Tested Working” terminology means that applicable, non-voided test events meet an approved method/result policy for the relevant inventory cohort or serialized unit. It is never an arbitrary product or SKU flag, and it does not by itself establish authenticity, compliance, certification, or host compatibility.

## Primary user journeys

### Browse and inspect a product

1. A buyer searches or filters by part number and optical attributes.
2. The buyer reviews product identity, structured specifications, available sellable SKUs, condition, and inventory presentation.
3. The buyer sees only published information and no unavailable private operational fields.

### Check compatibility

1. A buyer identifies target equipment using supported vendor/model/platform fields.
2. The system looks for applicable published compatibility records.
3. It returns a status with scope, caveats, last review information, and cited evidence.
4. Conflicting, incomplete, or out-of-scope evidence produces an uncertain result or no result—not a verified result.
5. The buyer may submit an RFQ or clarification request.

A customer report may be retained as evidence, but remains unverified and cannot independently produce a verified compatibility conclusion until LoonLink validates it under the review policy.

### Purchase eligible stock

1. A buyer adds an eligible SKU and quantity to a cart.
2. The server revalidates SKU status, authoritative price, currency, purchasable quantity, and any checkout rules.
3. The server creates an inventory reservation/order and a Stripe Checkout Session.
4. The buyer completes payment on Stripe-hosted Checkout.
5. A signature-verified, idempotently processed webhook advances payment/order state and finalizes inventory allocation when stock remains valid.
6. If a late payment cannot be allocated, the order enters manual review without inventing stock; otherwise the buyer receives an accurate confirmation and an authorized operator updates fulfillment.

### Request a quote

1. A buyer adds one or more requested products, SKUs, part numbers, or free-text needs.
2. The buyer supplies business contact details, quantity, and optional equipment context.
3. The server validates and rate-limits the request.
4. An operator reviews the request and follows up outside or through a later quoting workflow.

### Operate the catalog

1. An authorized operator authenticates.
2. Server-side authorization verifies the operator role for every privileged action.
3. The operator manages draft/published products, SKUs, inventory, compatibility evidence, order fulfillment, and RFQ status.
4. Material changes are attributable and validated before publication.

## MVP scope

The MVP includes:

- a public product catalog for a curated set of optical transceivers;
- keyword/part-number search and filters over core structured optical specifications;
- product detail pages with SKUs, condition, and appropriate availability display;
- allowlisted public catalog and indexable output that excludes operational and customer-sensitive data;
- evidence-backed compatibility lookup for explicitly curated equipment targets;
- clear verified, unsupported, uncertain, and unknown/no-record outcomes;
- cart and server-created Stripe Checkout for eligible fixed-price inventory;
- order, payment, reservation, and basic shipment state tracking;
- a manual paid-but-unallocatable exception path that prevents silent overselling;
- an RFQ form supporting multiple requested items;
- authenticated operator functions for essential catalog, inventory, evidence, order, and RFQ administration; and
- baseline security, accessibility, testing, logging, and deployment controls.

The storefront should support Canadian-market presentation and CAD pricing initially. Tax integration must be completed before production sales wherever required; Phase 0 does not select or implement a tax solution.

## Explicit non-goals

- A multi-vendor marketplace or seller onboarding.
- Microservices, Kubernetes, a separate search cluster, event bus, or data warehouse.
- Automated scraping or unreviewed generation of compatibility claims.
- An AI-generated compatibility verdict.
- A network configurator, bill-of-materials optimizer, or full asset-management system.
- Consumer-focused merchandising, loyalty, subscriptions, or native mobile apps.
- Customer-negotiated price lists, purchase-order payment, credit terms, or automated quote acceptance in the initial MVP.
- Internationalization, multi-currency selling, or international tax/shipping automation in the initial MVP.
- Real-time carrier integration, returns automation, or a full warehouse-management system.
- Storing card data.
- Claims of certification, authenticity, compliance, compatibility, or testing that are not supported by recorded evidence.

## Success metrics

Initial targets must be calibrated after baseline traffic and operational data exist. The MVP will measure:

- catalog coverage: proportion of published SKUs with all required core specification and condition fields;
- provenance coverage: 100% of published verified or unsupported compatibility records have at least one active evidence record and a reviewer/review date;
- decision clarity: compatibility pages expose status, scope, and source references without presenting uncertain records as verified;
- discovery effectiveness: search-to-product-detail engagement and zero-result query rate;
- commerce reliability: successful paid orders are recorded once, inventory is not oversold, and webhook replays do not duplicate transitions;
- funnel performance: product-to-cart, checkout-start, and completed-checkout rates, interpreted only after adequate volume;
- RFQ usefulness: valid RFQ completion rate and operator response time; and
- quality: no known critical authorization, payment, or inventory-consistency defects at launch.

No revenue, conversion, compatibility-accuracy, or inventory-volume claim is assumed in Phase 0.

## Assumptions

- A solo developer operates the initial product and favors managed services and a modular monolith.
- Initial catalog volume and traffic fit Vercel plus Supabase Free for development and early validation; Vercel Pro is planned for early production.
- Initial products are tested pre-owned enterprise optical transceivers, with possible later expansion to new optical networking products.
- Some used stock can be managed as interchangeable quantities; higher-risk or uniquely documented units may be serialized.
- Each physical unit is represented either by an aggregate cohort quantity or by a serialized-unit record, never both.
- Catalog and compatibility records are curated by authorized operators.
- CAD is the initial storefront currency; other currencies are out of MVP scope.
- Shipping and tax details require validation before production launch.
- Stripe Checkout is available and appropriate for eligible fixed-price orders, subject to account and market requirements.

## Unresolved product questions

- Which exact equipment vendors, platforms, product families, and evidence sources form the launch compatibility corpus?
- What review policy and evidence threshold qualify a compatibility record as verified or unsupported?
- Should public availability be exact quantity, a threshold label, or a mixed policy by SKU?
- Which conditions and grading rubric will be customer-visible, and which test results are mandatory per grade?
- Which used units require serial-level tracking, and should an authenticated purchaser later see the serial of an allocated unit? Serial numbers are never public catalog data by default.
- What reservation lifetime and recovery policy should apply to abandoned Checkout Sessions?
- Which provinces will be served initially, and what tax provider/configuration is required before production sales?
- Which carriers, delivery regions, shipping fees, and fulfillment service levels are supported?
- Are guest checkout and account-based order history both required at first launch?
- What returns, warranty, dead-on-arrival, privacy, and terms policies will be approved before launch?
- When should an inquiry remain an RFQ instead of being eligible for checkout?
- What business verification, fraud review, and manual order-review rules are needed?
