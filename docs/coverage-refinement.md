# Coverage scene refinement patch

The final chapter now uses both supplied assets: the full-stage `coverage-studio-background.png` and the transparent `exploded-sedan-components.png`. The previous navy-only atmosphere was replaced with the actual studio image, including its amber lighting, architectural depth and reflective floor. The old opaque car poster is not referenced.

## Composition

The transparent sedan's desktop width changed from 70% to 58%, a 17.14% linear-size reduction. It is anchored 3% from the left edge and vertically aligned at 58% within its visual layer, placing the lower mechanical components near the studio floor while preserving the roof, bumper and wheels. The right-side text area remains unchanged and has more breathing room. Tablet/mobile artwork is 18% smaller than the preceding version.

The decorative studio picture covers the entire section behind the sedan and copy. A continuous right-side navy gradient and a restrained sedan mask blend the composition into the text-safe region. There is no framed panel, image border or opaque poster containing the car. On mobile, additional top/bottom blending keeps the studio light visible around the car while protecting the title and paragraph. This was refined after actual tablet and 320px screenshots exposed bright highlights behind text.

All Persian copy, the editorial label, four indicators and the absence of a CTA are preserved. Header, footer, contact details, corporate sections and other chapters were not changed.

## Motion

The master timeline source remains unchanged. The studio picture and sedan share the existing coverage parent opacity, so they appear together; the sedan retains its subtle 1.03 → 1 entrance and upward exit. Resizing is handled by CSS rather than adding another GSAP scale owner. The existing cabin parent still reaches opacity 0 and visibility hidden before the coverage reading hold.

Forward/reverse state comparisons passed at .83, .89, .94 and .987 for the original parts, panels, coverage elements and studio layer. Equivalent computed `none` transforms are normalized to identity matrices. Reverse scrolling restores the cabin correctly. The existing normal-flow corporate handoff remains visible without an empty intermediate viewport.

## Assets and changed files

- Updated `src/components/Coverage.astro` and `src/styles/cinematic-hero.css` only in the application source.
- Added two studio WebP derivatives: 960px / 46,552 bytes and 1672px / 136,472 bytes. Responsive car delivery now reflects the smaller displayed dimensions.
- Both original artwork files remain unchanged. Studio SHA-256: `2ccb8ea38723859b72fc8048c74eefc78c6bb74b37c2beac58a5e965afbb8685`. Sedan SHA-256: `3c547df9e633910c6f68a638a409c6f82d74f7441c5a662e1711fecf3fe2add7`.
- Added `scripts/verify-coverage-refinement.mjs`, this report and screenshot evidence. No dependencies were installed.

## Validation

`npm run typecheck`, `npm run build` and `node scripts/verify-coverage-refinement.mjs` passed. All 17 local Astro imports resolve. All 53 production asset references exist; eleven original part hashes still match; 25 IDs are unique; eleven internal fragment destinations and all ARIA targets resolve. Coverage contains two image elements, four indicators, four icons and zero actions. Existing phone destinations remain unchanged.

Actual browser screenshots were inspected at 1440 × 900, 1280 × 720, 1024 × 768, 768 × 1024, 390 × 844 and 320 × 700. Both studio and sedan images loaded at every size. No horizontal overflow or browser warnings/errors were observed. At 1440px, the actual sedan visual width is 826.5px versus 997.5px previously. Static tablet/mobile output remains complete; earlier cabin content stays in normal flow above coverage rather than overlapping it.

The reduced-motion branch and cleanup architecture were preserved. OS-level reduced-motion emulation, physical-device FPS measurements and other browser engines were not tested.

## Evidence

- [Final coverage scene](screenshots/coverage-refinement/coverage-1440.png)
- [Coverage close-up](screenshots/coverage-refinement/coverage-closeup.png) — crop of the browser screenshot
- [Coverage-to-corporate handoff](screenshots/coverage-refinement/handoff-1440.png)
- [Mobile scene](screenshots/coverage-refinement/coverage-390.png)
- [Before/after comparison](screenshots/coverage-refinement/comparison.png)
- [Viewport observations](screenshots/coverage-refinement/evidence.json)
- [Reverse-scroll comparison](screenshots/coverage-refinement/reverse-validation.json)
- [Asset/markup checks](screenshots/coverage-refinement/coverage-validation.json)
- [Production asset and anchor checks](screenshots/coverage-refinement/asset-validation.json)
- [Browser console](screenshots/coverage-refinement/browser-console.json)
