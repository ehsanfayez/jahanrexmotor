# Phase 5.4 — Complete coverage cinematic chapter

Implemented and visually reviewed on 26 October 2026. The final supplied `exploded-sedan-coverage.png` is used directly; artwork was not regenerated or edited. The approved header, contact information, footer and corporate introduction content remain unchanged.

## Root cause and implementation

The previous master deliberately ended the cabin group's animation at `autoAlpha: .35`. Its two child parts therefore remained visible behind the concluding statement. The cabin parent now exits to `autoAlpha: 0`, which also hides the seat and steering assembly, with the text exiting slightly earlier. The same master restores these states during reverse scrolling; no permanent `display:none` workaround was added.

`Coverage.astro` replaces the former handoff panel. One responsive picture provides the full-stage desktop visual; HTML copy sits in the supplied image's empty right-hand region. It includes the requested editorial label, two-line off-white/gold heading, supplied description and four lightweight category indicators. There are no links or buttons in the coverage chapter. Four official Lucide paths extend the existing shared icon allowlist and attribution.

Desktop uses `object-fit: contain` without filters or an opaque overlay. Mobile/tablet use a vertical title → image → description → categories layout. The image preserves its proportions and trims only unused right-side negative space. During visual QA, an intrinsic Grid sizing problem that clipped the left edge on tablet was corrected with `minmax(0, 1fr)` and explicit minimum sizing.

The supplied studio lighting remains the visual treatment. The existing diagonal corporate boundary now begins with the coverage background color, connecting naturally to the preserved light introduction.

## Master timeline

| Label | Progress | Behavior |
| --- | --- | --- |
| cabinHold | .80 | Stable cabin reading frame |
| cabinExit | .85 | Coordinated cabin departure, complete by .89 |
| coverageEntrance | .86 | Restrained dissolve with image 1.03 → 1.00, small translation |
| coverageHold | .92 | Image, copy and indicators fully settled |
| coverageExit | .975 | Image rises 18px; copy rises and fades partially |
| corporateHandoff | .99 | Closing transition approaches natural stage release |
| complete | 1 | Sticky stage releases through normal document flow |

The picture stays visible at release so the stage does not turn into a blank viewport. The first three chapter exchanges remain unchanged. Stage travel increased from 900 to 1000svh to accommodate the final chapter. The existing cabin link now navigates to the coverage reading interval, and the story navigation includes the fifth chapter. A single shared master still owns all narrative motion; scrolling remains native.

## Asset delivery

- Original PNG: 1672 × 941, 2,528,902 bytes. SHA-256 remains `6c099cb8a3d4adeb7865dacaba0fa77f5ac94a01b28121836199c9297da0ee6c`.
- Derived 960px WebP: 112,508 bytes; 1672px WebP: 294,842 bytes, both quality 90.
- One image element with responsive sources and reserved width/height. Low fetch priority allows preparation before the late cinematic entrance without competing with the hero.
- All eleven preceding original PNG hashes remain unchanged. Production contains all 50 referenced asset URLs and 35 optimized WebPs.

## Validation

`npm run typecheck`, `npm run build` and `node scripts/verify-phase-5-4.mjs` passed. All 17 local Astro imports resolve. Production has 25 unique IDs, eleven valid fragment destinations and no missing ARIA targets. Coverage contains one image, four icons, four indicators and zero actions. Telephone destinations remain unchanged.

| Viewport | Actual browser review |
| --- | --- |
| 1440 × 900 | Cabin hold/departure, coverage entrance/hold/exit and corporate entrance inspected |
| 1280 × 720 | Full sedan frame with readable safe-area copy |
| 1024 × 768 | Compact desktop typography and complete component silhouettes |
| 768 × 1024 | Vertical image/copy layout, two-column indicators; left-edge sizing issue fixed and rechecked |
| 390 × 844 | Vertical composition and complete copy/categories inspected across two viewport captures |
| 320 × 700 | Readable heading/body, recognizable sedan, four single-column category rows |

No horizontal overflow was observed at any required size. Forward/reverse checkpoints at .83, .865, .89, .94 and .987 matched group/child transforms, opacity, visibility, accessible panel state and coverage transforms. Equivalent computed `none`/identity matrices are normalized in the comparison. Cabin opacity is zero and visibility hidden during coverage hold. Large native scroll jumps and reverse passage across the stage release were also reviewed. Browser warnings/errors: zero.

Switching from enhanced desktop to the static fallback restores all panel and coverage inline styles, removes inert states and displays all essential content. The same no-enhancement path is used for reduced motion. OS-level reduced-motion emulation was unavailable; physical-device FPS and other browser engines were not tested.

## Files

Changed `src/components/Hero.astro`, `Icon.astro`, `src/scripts/cinematic-hero.ts`, `src/data/cinematic-story.ts`, `src/styles/cinematic-hero.css` and `public/licenses/lucide.txt`. Added `src/components/Coverage.astro`, two optimized coverage WebPs, `scripts/verify-phase-5-4.mjs`, this report and visual evidence. No dependencies were installed.

## Evidence

- [Six-stage overview](screenshots/phase-5-4/overview.png)
- [Mobile overview](screenshots/phase-5-4/mobile-overview.png) — two actual 390 × 844 viewport captures
- [Final desktop coverage](screenshots/phase-5-4/coverage-hold-1440.png)
- [Viewport observations](screenshots/phase-5-4/evidence.json)
- [Forward/reverse comparison](screenshots/phase-5-4/reverse-validation.json)
- [Coverage asset and markup checks](screenshots/phase-5-4/coverage-validation.json)
- [Production asset/anchor checks](screenshots/phase-5-4/asset-validation.json)
- [Browser console](screenshots/phase-5-4/browser-console.json)

The evidence folder also contains individual cabin hold, cabin departure, coverage entrance, coverage exit, corporate entrance, desktop-size and tablet/mobile screenshots. All required views were visually inspected.
