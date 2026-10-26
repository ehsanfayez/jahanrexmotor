# Phase 5.6.3 — Production performance, stability and QA

## A. Baseline and measurement method

Inspected dependencies, Astro/Vite configuration, image manifests and actual assets, font loading, output bundles, CSS architecture, both GSAP controllers, cleanup, native navigation and production rendering. Baseline `npm run typecheck` and `npm run build` passed before application changes.

All performance samples and visual QA used **production `npm run preview`**, not development-server timings. A temporary inline observer was inserted into the built HTML by `scripts/audit-production.mjs`; it recorded browser PerformanceObserver LCP/layout shifts/long tasks and Resource Timing data into a hidden JSON script node. It never entered application source. Final build removed it, and both the offline verifier and final browser reload confirmed its absence.

Environment: Chromium/Chrome 156 on Windows, DPR 1, localhost preview, no CPU or network throttling. Desktop measurement viewport 1280×720; mobile viewport 390×844, using desktop Chromium with a viewport override. New host/port origins provided uncached resource URLs. These are **single local laboratory samples**, not real-phone or field measurements. The observer samples approximately five seconds after load; long-task blocking below is the sum of task duration above 50ms in that observation window, **not Lighthouse TBT**.

Baseline findings:

- The same parts had different `sizes` hints in reused desktop and static/mobile markup. Desktop downloaded several assets at both 384px and 768px.
- The smallest component derivative was 384px, although several phone parts render around 80–150px at DPR 1.
- Mobile coverage selected a 960px sedan for an approximately 335px visual.
- Each image completion independently invoked global ScrollTrigger refresh. Cached-image listeners were also attached unnecessarily by the desktop controller.
- Existing font setup was already efficient: one self-hosted variable WOFF2, 111,152 bytes, declared weights 100–900, preload and `font-display: swap`; OFL license retained.
- No new framework or dependency was justified. Existing GSAP/ScrollTrigger, Astro component boundaries and Tailwind configuration were retained.

## B. Optimizations and affected files

| File | Change |
| --- | --- |
| `src/data/part-delivery.ts` — new | Shared maximum-reading-size hints derived from existing desktop/mobile geometry. Reused references select consistent resolutions; conservative bounds cover static fallback too. Server-side Astro data, not an extra client framework. |
| `src/components/PartSlot.astro` | Uses shared hints while retaining responsive WebP, PNG fallback, intrinsic dimensions, async decoding, existing loading and priority behavior. |
| `src/components/Hero.astro` | Removes conflicting per-instance sizing override. Hero engine remains high priority; pinned story assets remain available early. |
| `src/components/Coverage.astro` | Adds 480w sedan candidate and accurate capped mobile sizing. Studio layer, masking, positions, fade, copy and categories unchanged. |
| `scripts/prepare-parts.mjs` | Adds 192px lossless component derivatives and a separate 480px lossless transparent sedan. Existing derivatives and original PNGs preserved. |
| `public/images/parts/optimized/manifest.json` and 12 new WebPs | Records the 11 additional component candidates; new sedan remains a separate layer. |
| `src/scripts/image-refresh.ts` — new | Coalesces image completion events into at most one refresh per animation frame. Watches incomplete images only; cleanup removes listeners and cancels pending RAF. |
| `src/scripts/cinematic-hero.ts`, `mobile-cinematic.ts` | Use the shared refresh scheduler. All authored tweens, labels, poses, scrub values, chapter order and responsive queries unchanged. |
| `scripts/image-refresh.test.mjs` — new | Tests burst coalescing, cached-image exclusion and pending callback/listener cancellation. |
| `scripts/audit-production.mjs`, `scripts/verify-production.mjs` — new | Reproducible build-output audit and clean production asset/original/contact verification; neither is imported into the website. |

All CSS files, design tokens, page content, corporate components, header/footer implementation, font, package/lockfile and Astro/Tailwind configuration remain byte-identical to baseline. No Preflight, palette, layout or animation redesign. Legacy/shared CSS was inspected and retained rather than risking an unsafe purge for an already small compressed stylesheet.

## C. Image delivery and integrity

The 11 original component PNGs total 17,728,339 bytes and remain unchanged. Their new 192px candidates total 293,010 bytes; these are smaller-resolution candidates for appropriately small rendered parts, not replacements for high-resolution assets. Existing 384/768/1254 candidates remain for larger displays and higher pixel densities.

| Example | Original PNG bytes | New candidate | Candidate bytes |
| --- | ---: | ---: | ---: |
| Engine | 2,362,047 | 192w | 40,244 |
| Gearbox | 2,026,203 | 192w | 34,824 |
| Caliper | 1,881,451 | 192w | 27,684 |
| Headlight | 1,765,564 | 192w | 28,560 |
| Mirror | 1,333,419 | 192w | 22,188 |
| Transparent sedan | 2,317,640 | 480w | 130,754 |

The previous 960w sedan is 208,254 bytes. The new 480w candidate saves 77,500 bytes where selected. Hero engine at 390px still selects 384w; it was not replaced by a low-resolution LCP image.

Integrity check of **all 53 pre-existing image/font files**: unchanged SHA-256 hashes. All 12 new images retain alpha. Compared decoded output with equivalently resized PNGs: zero different alpha samples and zero different visible RGB pixels. No crops, recoloring, flattening or destructive asset edits. Cold mobile coverage was inspected using the actual 480w candidate, with studio still selecting 1672w to cover the tall viewport.

## D. Performance comparison

| Measurement | Desktop before | Desktop after | Mobile before | Mobile after |
| --- | ---: | ---: | ---: | ---: |
| Total transferred bytes, including document | 5,111,446 | 2,511,293 | 1,535,372 | 1,012,367 |
| Image transferred bytes | 4,929,752 | 2,329,482 | 1,353,678 | 830,556 |
| Resource requests, excluding document | 24 | 17 | 17 | 17 |
| LCP | 392ms | 788ms | 1060ms | 432ms |
| CLS | 0 | 0.004054 | 0 | 0.075912 |
| Observed long-task blocking, **not TBT** | 27ms | 581ms | 600ms | 101ms |
| Failed recorded HTTP responses | 0 | 0 | 0 | 0 |

Transferred bytes fell **50.87% on desktop** and **34.06% on mobile** in these samples. This is the supported improvement; timings are not uniformly better. Desktop LCP and observed blocking worsened in the sampled run. A second uncached mobile run measured LCP 596ms and CLS 0. All observed LCP/CLS samples meet the directional 2.5s/0.1 targets under this localhost setup, but these results do not establish real-device performance or a statistically stable timing improvement.

| Production bundle | Raw before → after | Gzip before → after |
| --- | ---: | ---: |
| JavaScript | 129,056 →129,091 bytes | 48,413 →48,442 bytes |
| CSS | 57,456 →57,456 bytes | 11,225 →11,225 bytes |

Lighthouse, official TBT, field INP and real-user metrics were **not measured**. No Lighthouse/axe integration was available, and no benchmark dependency was installed. No claim of a ≥90 Lighthouse score or ≤200ms INP is made. Raw samples and conditions are preserved in the evidence directory.

## E. GSAP, responsive and visual validation

- Production baseline and matching after screenshots at 1440×900, 1280×720, 1024×768, 768×1024, 430×932, 390×844 and 320×700: **84 pairs**, stable chapter holds plus corporate handoff/About/Why/Principles/Contact/Footer.
- Additional complete production checks at 360×800 and 375×812.
- All compared element rectangles and font sizes are equal. 54/84 full screenshots are pixel-identical. Other differences are associated with responsive image resolution/raster selection; no layout changes were measured. Contact sheets and cold-image screenshots were visually inspected. This is not a claim that every image pixel is identical at different source resolutions.
- Coverage matched pixel-for-pixel in all seven regular comparisons. A separate uncached 390px test confirms the new 480w sedan works, is recognizable and retains clean transparency, separate studio lighting and navy fade.
- Full reverse sequence at 390 and 1440, including cabin→coverage and corporate handoff: 16 captured states. No ghost image, disappearing hold, overflow, missing image or stuck sticky stage.
- Fresh-load fast jump to coverage: no visible missing image; actual 480w sedan selected.
- Resize/height/orientation checks 768×1024 →1024×768 →390×720 →844×390 →390×844: mobile →desktop →mobile →static →mobile, real story-trigger counts 1→1→1→0→1. No accumulation.
- Authored animations still use transforms/opacity. No new animated filter, shadow, layout dimension, continuous loop, blanket `will-change`, touch interceptor or scroll hijacking.

## F. Functional/accessibility and browser checks

- Mobile menu locks background scrolling; Tab enters links with visible outline; Escape closes and restores toggle focus.
- Hero CTA and every chapter link reach their expected scene. Desktop About/Approach anchors clear the header near y=100; Parts returns to the hero.
- Five phone links remain `tel:09373020028`. No duplicate IDs; one h1; all images have alt attributes and intrinsic dimensions. Existing decorative studio image remains hidden from assistive technology. RTL and computed Vazirmatn verified.
- Existing reduced-motion media guards and static semantic markup retained. Shared static teardown exercised in short landscape; no permanently hidden panels there.
- Production preview console: no errors or warnings. No SSR import error. No visible missing images or horizontal overflow in recorded states.
- Available browser was Chromium 156. Firefox and Safari/WebKit were not available through the browser tools. No Safari compatibility certification is inferred.
- Actual phone touch inertia/GPU/FPS, real browser-toolbar collapse, DPR 2/3 rendering, OS reduced-motion switching and no-JS browser emulation were not directly tested. Their responsive/fallback code was inspected; native wheel/keyboard and viewport/height tests are the actual performed interactions. This is not a full accessibility compliance audit.

## G. Final production checks

- `node --experimental-strip-types --test scripts/image-refresh.test.mjs`: PASS.
- `npm run typecheck`: PASS, including 49 local imports and TypeScript.
- `npm run build`: PASS, including final clean rebuild after performance instrumentation.
- `node scripts/verify-production.mjs`: PASS — 65 production asset paths, preserved originals/derivatives, five contact links, no temporary audit code.
- `npm run preview`: rendered the full optimized production site; final uninstrumented HTML reloaded and mobile enhancement reconfirmed. No console/SSR/missing-image/overflow error.

## H. Evidence

Directory: `docs/screenshots/phase-5-6-3/`.

- `before/`, `after/`: screenshots and raw lab samples; saved original built HTML is evidence, not the shipping entrypoint.
- `performance-comparison.json`, `after/performance-mobile-repeat.json`: actual measurements, including nonzero CLS and worse desktop timing rather than omitting them.
- `visual-comparison.json`: all 84 geometry/font/pixel comparisons.
- `image-verification.json`: unchanged old assets and decoded lossless/alpha comparisons.
- `motion-checks.json`, `functional-checks.json`, `fast-scroll.json`: real scene, cleanup, menu, keyboard and navigation results.
- `final-production-check.json`: clean final browser state and console.
- `source-before.json`, `summary.json`, `observations.json`: source hashes and recorded states.
- `after-story-320.png`, `after-story-390.png`, `after-story-768.png`, `after-story-1440.png`: visual contact sheets.

## I. Repository preparation judgment

**Ready with minor issues.** Build, local production rendering, assets and core interactions pass; the approved visuals and original assets are preserved. Before client handoff, perform physical-phone/Firefox/Safari checks and a repeatable throttled Lighthouse/field performance assessment. The single-run timing variability and observed CLS up to 0.075912 remain documented limits, not a certified production SLA.

The project has no `.git` directory. No repository, branch, commit, push, pull request or merge was created or modified. Build output/dependencies are already ignored. QA screenshots currently occupy roughly 68MB across all phases; decide which evidence belongs in the client repository. The image tooling imports Sharp through Astro's installed dependency tree; retain the lockfile and consider making tooling dependency ownership explicit in repository preparation. Existing English editorial labels contain both JAHANREXAN and JAHANROKSAN spellings; left untouched under the content-preservation requirement, to confirm before delivery. Uncertain legacy assets were retained.
