# Phase 5.3 — Corporate refinement and automotive art direction

Implemented locally on 26 October 2026. Astro, TypeScript, the existing GSAP master, Vazirmatn and all eleven supplied PNG originals remain in place. Corporate wording is editable draft content; no business statistics, certifications, photography, email, address or social profiles were invented.

## Delivered changes

- Header navigation has clean Persian labels without numeric prefixes. The cooperation CTA retains `#contact` and uses `messages-square`.
- The hero direct-call action, closing CTA and footer contact links use `tel:09373020028`. The official number is visible and directionally isolated for RTL. Informational links continue to navigate within the page.
- Seven desktop hero components have deliberate depth and scale. The engine is the anchor, with a visible seat and smaller supporting parts. Bumper width changed from 39 to 24 composition units (38% reduction); the engine increased from 58 to 62 and shifted to balance the heading.
- The body chapter bumper changed from 88 to 62 units, headlight from 25 to 22, and fender from 44 to 38. Fender, bumper and mirror occupy separate silhouettes. Brake caliper and suspension are smaller; cabin steering changed from 48 to 36 while the seat remains dominant.
- The short concluding statement now shares the departing cabin imagery. Cabin exit begins at .94, handoff at .97 and completion at 1; the retained cabin group ends at .35 opacity. The earlier chapter exchanges and reading holds remain on the same reversible master. A short angled gradient connects to the company section without an added scroll scene.
- A warm greige environment contains an asymmetric company introduction, a dedicated four-feature Why section, and three compact principles with distinct operating-philosophy copy. Open grids, thin separators and consistent line icons replace oversized rows.
- A dark closing cooperation section and three-region corporate footer finish the page. The subdued English wordmark scales within the viewport.
- Inline Lucide icons use a shared allowlisted component with consistent strokes and accessible decorative SVG attributes. Attribution is included in `public/licenses/lucide.txt`; no dependency was installed.

## Main implementation files

`src/components/Header.astro`, `Hero.astro`, `Capabilities.astro`, `Contact.astro`, `Footer.astro`, `Icon.astro`; `src/data/landing.ts`, `cinematic-story.ts`; `src/scripts/cinematic-hero.ts`; `src/styles/tokens.css`, `header.css`, `cinematic-hero.css`, `editorial.css`, `closing.css`.

## Validation

`npm run typecheck`, `npm run build` and `node scripts/verify-phase-5-3.mjs` passed. The production build generates one static page.

| Viewport | Observed result |
| --- | --- |
| 1440 × 900 | One-line hero heading; seven-part composition; four Why columns; three principles |
| 1280 × 720 | One-line heading and balanced compact desktop layout |
| 1024 × 768 | One-line heading; four Why columns retained |
| 768 × 1024 | Static narrative; two Why columns; three principle columns |
| 390 × 844 | Three-part hero; two Why columns; compact principle rows; complete stacked footer |
| 320 × 700 | Intentional two-line hero heading; single-column Why rows; readable call CTA |

No horizontal overflow was observed at any of these sizes. All eleven desktop evidence views and mobile section captures were visually inspected. A mobile closing-heading orphan was corrected by grouping “شروع کنیم.” before final capture. Mobile buttons are 48px high. Menu expansion, Escape closure with focus return, section-link closure, footer navigation and keyboard focus on the hero call link were checked.

Forward/backward states at progress .35, .55 and .75 matched exactly for group transforms, all eleven part transforms/opacities, panel visibility/inert state and lighting. Native fast scrolling and the closing handoff were also inspected. Tablet/mobile fallback panels remain visible and non-inert.

Production validation found 47 available asset references, 33 optimized WebPs, eleven unchanged original SHA-256 hashes, 25 unique IDs, eleven valid fragment destinations and no broken ARIA targets. Browser verification loaded all eleven scene images and recorded zero warnings/errors. Five telephone links have the exact official destination; actual OS dialing was not initiated.

Contrast calculations include charcoal on warm paper at 13.4:1, secondary text at 5.57:1 and light-environment icon/focus gold at 3.48:1. Dark text and CTA pairs retain the previous passing ratios. This is a targeted check rather than a full accessibility certification.

The reduced-motion/static implementation was preserved and responsive static output inspected. OS-level reduced-motion emulation, physical-device performance/FPS measurements and cross-browser testing were not available in this run.

## Evidence

- [Cinematic overview](screenshots/phase-5-3/cinematic-overview.png)
- [Corporate overview](screenshots/phase-5-3/corporate-overview.png)
- [Mobile overview](screenshots/phase-5-3/mobile-overview.png) — six actual viewport captures assembled into a contact sheet
- [Viewport measurements](screenshots/phase-5-3/evidence.json)
- [Reverse-scroll state comparison](screenshots/phase-5-3/reverse-validation.json)
- [Assets and anchors](screenshots/phase-5-3/asset-validation.json)
- [Corporate production checks](screenshots/phase-5-3/corporate-validation.json)
- [Rendered functional checks](screenshots/phase-5-3/functional-checks.json)
- [Browser console](screenshots/phase-5-3/browser-console.json)
- [Contrast calculations](screenshots/phase-5-3/contrast.json)

Individual required desktop screenshots are `hero-1440`, `engine-1440`, `brakes-1440`, `body-1440`, `cabin-1440`, `handoff-1440`, `company-1440`, `why-1440`, `principles-1440`, `contact-1440` and `footer-1440` in the evidence folder. Earlier phase evidence is retained.
