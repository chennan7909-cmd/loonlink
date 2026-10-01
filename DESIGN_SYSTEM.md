# LoonLink Design System

## Purpose

This document records the reusable visual and interaction decisions established in Phase 1B. It does not define live catalog content or authorize later storefront functionality. The `/design-system` route is a non-indexed development reference; all product, price, testing, and compatibility content there is explicitly illustrative.

The Phase 1B homepage is temporary presentation scaffolding. Its phase label, development-oriented call to action, and planned-experience copy are not permanent brand language. Phase 1C will replace that placeholder with approved synthetic storefront content while retaining this visual system.

The design direction is **modern, low-density B2B network infrastructure commerce**: calm, precise, trustworthy, and technically competent. Complexity belongs in the data model, not the interface.

## Interface principles

- Show only what is needed for the next decision, then reveal engineering detail progressively.
- Serve technical and non-specialist B2B buyers with the same clear information hierarchy.
- Use whitespace and hierarchy to make a small curated catalog feel intentional. Never simulate catalog breadth or business proof.
- Prefer technical accuracy and plain language over promotional language.
- Never use color alone to communicate status. The written label and supporting context are authoritative.
- Keep testing status distinct from compatibility status. A public testing statement will eventually derive from applicable, non-voided test events; a compatibility conclusion will require reviewed provenance.

## Foundations

The system uses a fast-loading platform sans-serif stack and a system monospace stack for compact technical metadata. The hierarchy comprises display, page, section, body, label/caption, and technical metadata styles.

The maximum page container is `80rem` (`max-w-7xl`) with responsive horizontal padding of `1.25rem`, `2rem`, and `2.5rem`. Standard sections use responsive vertical padding of `3.5rem`, `5rem`, and `6rem`. Cards use `1.25rem` mobile and `1.5rem` larger-screen padding.

Corners and depth are intentionally restrained: the base radius is `0.375rem`; cards use a subtle border and minimal one-pixel shadow; controls generally use the medium radius. Decorative gradients, glow effects, glass panels, and deep floating shadows are outside the system.

The neutral scale deliberately separates the cool off-white page canvas, white content surfaces, darker neutral borders, and muted technical backgrounds. This hierarchy should be adjusted through the existing semantic tokens if accessibility testing later finds a deficiency; decorative colour must not be added merely to manufacture contrast.

## Semantic color tokens

Tokens are defined in `src/app/globals.css` using OKLCH values and exposed to Tailwind through `@theme inline`.

| Token | Purpose |
| --- | --- |
| `background` / `foreground` | Default canvas and high-contrast text |
| `surface` / `surface-foreground` | Cards and contained content |
| `muted` / `muted-foreground` | Subtle backgrounds and supporting text |
| `border` / `ring` | Separation and keyboard focus |
| `primary` / `primary-foreground` | Highest-priority action |
| `secondary` / `secondary-foreground` | Supporting action |
| `success` | Positive state only when the underlying domain status warrants it |
| `warning` | Uncertain, cautionary, or unverified state |
| `error` | Error, destructive, or invalid state |
| `info` | Informational or documented state without implying verification |

## Component contracts

- `Button`: primary, secondary, outline, ghost, and link treatments with consistent focus and disabled states.
- `Input` and `SearchInput`: labelled native controls with visible focus; search is a presentation primitive only in Phase 1B.
- `Badge`: compact categorical metadata. It must not replace explanatory status text.
- `Card`: restrained surface with header/content/footer composition.
- `Container` and `Section`: shared responsive page geometry.
- `Divider`: low-emphasis structural separation.
- `TechnicalMetadataRow`: definition-list row that stacks on small screens.
- `StatusIndicator`: semantic status treatment whose visible text carries meaning.
- `EmptyState`: useful absence with an optional next action and no invented result.
- `Disclosure`: native `details`/`summary` progressive disclosure, keyboard-operable without client JavaScript.

## Product information hierarchy

1. **Purchase decision:** manufacturer, part number, concise identity, condition, record-backed testing status, authoritative price, and primary action.
2. **Essential specifications:** speed, reach, fibre type, wavelength, and connector when applicable.
3. **Detailed disclosure:** complete specifications, compatibility evidence, testing information, and approved shipping/returns information in later phases.

This hierarchy is a component design target, not evidence that product pages or commerce behavior exist.

## Product photography readiness

Future real product photography can become the primary visual focus without changing the system. Cards are composition-based and can place an approved media region before their text hierarchy; the neutral canvas, restrained borders, and low visual ornamentation are intended to defer to product imagery. Phase 1C may establish image aspect ratios, responsive loading, and empty-image behavior using synthetic assets, but it must not redesign the typography, spacing, colour, or information hierarchy to do so.

The text-only LoonLink wordmark and system font remain intentional. A logo, icon, decorative illustration, or web font is not required to support product imagery.

## Responsive and accessibility behavior

The shell uses full desktop navigation from the medium breakpoint and an explicit mobile menu below it. The mobile trigger exposes expanded state, Escape closes the panel and restores trigger focus, and selecting a link closes it. Section spacing and card grids collapse rather than merely shrinking.

All primitives preserve semantic elements, visible keyboard focus, adequate target sizes, and text labels. The disclosure uses native browser semantics. Motion is minimal, and global reduced-motion rules remove smooth scrolling and reduce transitions/animation.
