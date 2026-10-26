# Phase 5.6.1 — Dedicated mobile cinematic story

Implemented on 2026-10-26. No dependency, asset, desktop animation, corporate-section, header, footer, design-token, or Tailwind configuration changes.

## Files

- `src/data/mobile-story.ts` — mobile chapter labels, reading positions, copy and independent composition coordinates.
- `src/scripts/mobile-cinematic.ts` — reversible mobile master timeline, native anchor positions, active-scene accessibility and lifecycle cleanup.
- `src/styles/mobile-cinematic.css` — mobile stage, copy, image groups, controls and coverage composition, scoped to `.is-mobile-enhanced`.
- `src/scripts/landing.ts` — registers the mobile controller in the existing GSAP matchMedia lifecycle; reports the actual number of story triggers for inspection.
- `src/components/Hero.astro`, `Narrative.astro`, `Coverage.astro` — reuse existing semantic panels and images; add asset hooks and short mobile copy without duplicate IDs or a second website.

## Behavior and architecture

Previously mobile displayed the existing chapters as a static vertical sequence. Desktop still uses the original `cinematic-hero.ts`, `cinematic-story.ts` and `cinematic-hero.css`, unchanged by SHA-256 comparison.

Mobile now uses one `automotive-mobile` ScrollTrigger and a separate GSAP timeline. It animates group containers and text with transforms and opacity. There are no wheel/touch handlers, scroll interception, snapping or per-frame layout changes. The sticky stage uses `100svh`; travel is 5.8 stage heights. Images retain their existing responsive WebP sources and dimensions. Positions are authored once, outside animation updates.

| Chapter | Entrance | Reading hold | Mobile composition |
| --- | ---: | ---: | --- |
| Hero | 0 | 0 | Engine, small bumper and seat |
| Powertrain | .10 | .22 | Engine and transmission |
| Brakes | .28 | .40 | Disc, caliper and suspension |
| Body | .46 | .58 | Smaller bumper, headlight and mirror; fender excluded |
| Cabin | .64 | .76 | Seat and steering wheel |
| Coverage | .82 | .93 | Existing transparent exploded sedan and studio background, HTML copy and categories |

Each exchange has coordinated entrance, hold and exit. Cabin exits before the coverage reading hold. Coverage releases naturally into the existing company section and has no new CTA. Existing chapter links use native browser anchors positioned at reading holds, including direct hash loads and browser history. Inactive panels are inert and excluded from the accessibility tree; cleanup restores their original attributes, styles and anchor parents.

Modes are mutually exclusive: desktop at width ≥1024 and height ≥600; mobile at widths 320–1023 and height ≥600; both require `prefers-reduced-motion: no-preference`. Short landscape, smaller widths and reduced-motion retain the original accessible static sequence. Mobile styling never applies without its enhancement class.

## Actual validation

- `npm run typecheck`: PASS, including 17 local Astro component imports and TypeScript.
- `npm run build`: PASS, static homepage generated successfully.
- Browser homepage: loads successfully; captured console contains no errors or warnings.
- Six viewport sizes: 320×700, 360×800, 375×812, 390×844, 430×932 and 768×1024. All 12 requested checkpoints captured at each size (72 PNGs in `screenshots/phase-5-6-1/mobile/`). No horizontal overflow, missing images or empty chapter holds observed. Reviewed reading compositions and transition contact sheets.
- Entire 12-checkpoint sequence captured in reverse at 320 and 390 (24 additional PNGs). All groups returned; no persistent hidden group or stale scene remained.
- Six native chapter links land on the expected reading scene. Hero CTA reaches powertrain; direct `#interior` reload reaches cabin. Browser back/forward restores the chapter. Menu opens, Escape closes it and restores focus to its toggle.
- Resize sequence: 390 →768 →1024 →390 →844×390 →390. Actual story-trigger count stays one in enhanced modes and zero in short-landscape static mode. Static panels restore opacity 1 and remove animation transforms. No horizontal overflow.
- All five phone links remain `tel:09373020028`. No duplicate IDs, broken internal anchors or missing images. RTL and Vazirmatn verified in computed browser styles.

### Desktop regression

Seven 1440×900 frames captured before and after: hero, powertrain, brakes, body, cabin, coverage and corporate handoff. Computed typography, color, display, visibility and opacity are equal across all 66 measured elements at each checkpoint. Maximum rectangle difference is 0.0013px (GSAP transform rounding after resizing); five checkpoints have exactly equal rectangles. Desktop source files remain byte-identical. Coverage and handoff screenshots are pixel-identical.

The first five screenshots are **not pixel-identical**: responsive image selections changed as the browser cache warmed during the mobile/desktop resize tests. The selected `currentSrc` differences are recorded rather than claiming a zero-pixel comparison. Visual inspection found no desktop composition or styling change. See `desktop-comparison.json`, `desktop-metrics.json`, and `regression-summary.json` for actual measurements.

## Evidence and limits

- `screenshots/phase-5-6-1/overview-320.png`, `overview-390.png`, `overview-768.png`: six reading states.
- `screenshots/phase-5-6-1/transitions-320.png`: five exchanges and corporate handoff.
- `before/`, `after/`, `mobile/`: full screenshots; observation JSON records browser geometry, scene state and overflow.
- `interaction-checks.json`: resize modes, live trigger counts, native anchors and direct-hash reload.
- `console.json`: captured browser errors/warnings (empty).
- `source-before.json`: original source hashes; `regression-summary.json` lists preserved sources.

The browser supports native wheel input and viewport resizing, but provides no physical touch-device profiling, OS reduced-motion emulation or video recording. Consequently actual phone GPU/FPS, touch inertia and OS reduced-motion switching have not been certified. The same static teardown path was exercised through short-landscape mode; the reduced-motion media guard was inspected in source. Screenshots are the available motion evidence, not a video or a hardware-performance claim.
