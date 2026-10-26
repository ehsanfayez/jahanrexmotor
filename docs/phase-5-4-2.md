# Phase 5.4.2 — Transparent sedan and navy integration

The final coverage scene now uses the supplied `public/images/parts/exploded-sedan-components.png` as a floating transparent visual. The previous opaque studio image and its derivatives are no longer referenced by the rendered page. The existing heading, description, four category indicators and absence of a CTA are preserved.

## Scene integration

The section itself provides the continuous navy background: #071423, #09192A and #0E2236 with restrained graphite/amber ambient gradients. There is no opaque image panel behind the car. On desktop, the visual is absolutely anchored at left: 0 and occupies 70% of the stage; real HTML copy occupies a separate 28% safe region on the right. The entire image uses contain sizing and preserves its aspect ratio.

A standard and WebKit CSS mask preserves the left side, gently attenuates the right side and reaches transparency at the visual's right edge. This blends rear components into the section's navy instead of displaying a rectangular boundary. A bottom background blend joins the existing diagonal corporate transition. No blur, filter, border or poster container is applied to the image.

Tablet/mobile use the dedicated vertical label → heading → transparent image → description → indicators layout. The mobile image reaches the left viewport edge and retains the full automotive composition. Its right-side mask is gentler to preserve recognizability at small sizes. All copy remains selectable HTML with Vazirmatn.

## Motion and cabin exit

The existing Phase 5.4 master already contains the complete cabin exit: its parent reaches opacity 0 and visibility hidden by progress .89, with both seat and steering children retained for reversal. That working timeline was inspected, preserved and retested rather than rewritten. Coverage still enters through restrained translation/scale, holds fully settled at .92–.975, then rises into normal page release. There is no separate autoplay or new ScrollTrigger.

Forward/reverse comparisons passed at .83, .865, .89, .94 and .987 for all group/part transforms, visibility, opacity, coverage elements and panel inert states. Computed `none` transforms are normalized to the equivalent identity matrix. At coverage hold the cabin group is hidden, coverage and copy are fully opaque, and the image is anchored at x = 0. Switching to static layout restores all inline animation styles and removes panel inert states. In static layouts, earlier chapters remain in normal flow above coverage rather than overlapping it.

## Assets and scope

- Original: 1672 × 941 PNG, 2,317,640 bytes, verified RGBA with alpha range 0–255. SHA-256 remains `3c547df9e633910c6f68a638a409c6f82d74f7441c5a662e1711fecf3fe2add7`.
- Responsive WebPs: 960 × 540 / 208,254 bytes and 1672 × 941 / 497,678 bytes; quality 92, alpha quality 100. Both retain transparency. One picture/img element selects the appropriate source and reserves its dimensions.
- Source edits: `src/components/Coverage.astro` and `src/styles/cinematic-hero.css` only. Added the two optimized derivatives, `scripts/verify-phase-5-4-2.mjs`, this report and evidence.
- Header, footer, contact information, company content, shared icons and the master timeline source remain unchanged. No artwork was regenerated, original files edited, dependencies installed or Tailwind added.

## Validation

`npm run typecheck`, `npm run build` and `node scripts/verify-phase-5-4-2.mjs` passed. All 17 local Astro imports resolve. All 50 production asset references exist; 25 IDs are unique, eleven fragment destinations resolve, and no ARIA targets are missing. All eleven preceding PNG hashes remain unchanged. Coverage contains one image, four indicators, four icons and zero actions. No old studio-artwork reference appears in production HTML. Existing telephone links retain the official destination.

Actual screenshots were inspected at 1440 × 900, 1280 × 720, 1024 × 768, 768 × 1024, 390 × 844 and 320 × 700. No horizontal overflow was observed. Desktop text clearance was refined after checking the 1280px composition. The navy background is visible through the supplied image's transparent areas with no rectangular boundary; the right-side mask remains visible and the main car components stay recognizable. Browser warnings/errors: zero.

The shared reduced-motion/static path is preserved and static content/style cleanup was verified through responsive switching. OS-level reduced-motion emulation, physical-device FPS measurements and other browser engines were not tested.

## Visual evidence

- [Full desktop hold](screenshots/phase-5-4-2/coverage-hold-1440.png)
- [Hold close-up showing right-side blend](screenshots/phase-5-4-2/coverage-hold-closeup.png) — crop of the actual browser screenshot, not an artwork edit
- [Cabin final hold](screenshots/phase-5-4-2/cabin-hold-1440.png)
- [Cabin departure](screenshots/phase-5-4-2/cabin-departure-1440.png)
- [Coverage entrance](screenshots/phase-5-4-2/coverage-entrance-1440.png)
- [Coverage-to-corporate handoff](screenshots/phase-5-4-2/corporate-entrance-1440.png)
- [Mobile coverage](screenshots/phase-5-4-2/coverage-390.png)
- [Six-stage overview](screenshots/phase-5-4-2/overview.png)
- [Mobile overview](screenshots/phase-5-4-2/mobile-overview.png) — two actual viewport captures

Machine-readable evidence: [viewport observations](screenshots/phase-5-4-2/evidence.json), [reverse comparison](screenshots/phase-5-4-2/reverse-validation.json), [static cleanup](screenshots/phase-5-4-2/fallback-validation.json), [asset/alpha checks](screenshots/phase-5-4-2/coverage-validation.json), [production references](screenshots/phase-5-4-2/asset-validation.json), [browser console](screenshots/phase-5-4-2/browser-console.json).
