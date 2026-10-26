# Phase 5.6.2 — Focused visual and responsive refinement

## Initial audit

Before application edits, inspected tokens, global/component CSS, Astro hierarchy, both GSAP controllers, responsive poses, coverage layers, corporate sections, CTAs, footer and keyboard/menu behavior. Captured six stable cinematic states, corporate handoff and five corporate/footer views at 1440×900, 1280×720, 1024×768, 768×1024, 390×844 and 320×700. Baseline directory contains 72 primary screenshots plus two menu/anchor checks.

Confirmed issues:

1. At 768px the powertrain transmission visually merged into the engine. Both assets needed clearer separation, rather than a different scene.
2. With the mobile menu open, a wheel gesture on the background advanced the page from scrollY 893 to 1243, moving the cinematic story behind the navigation.
3. Corporate anchor spacing doubled the shared 100px scroll padding with an additional 80px scroll margin. At 320px, About started 180px below the viewport top and its heading at 273.64px, despite a 66px header.
4. Menu links appeared abruptly, while the toggle already had a restrained transition.

The existing palette, Persian typography, corporate grids, dividers, icon design, footer, hero and protected coverage composition already looked appropriate. They were retained. No new claims, copy, imagery, decorative UI or corporate reveals were introduced.

## Implemented refinements and files

| File | Change |
| --- | --- |
| `src/data/mobile-story.ts` | Powertrain engine width 72→66%, left 4→3%; transmission width 33→30%, left 63→68%, top 52→58%. Existing coordinated group motion uses these positions consistently in both directions. |
| `src/styles/header.css` | Stop background scrolling only while the existing mobile menu is open. Preserve scrollbar space with temporary compensation. Give the menu a bounded, independently scrollable height for short screens and a 220ms opacity/6px entrance. Reduced motion disables the entrance. |
| `src/scripts/landing.ts` | Measure scrollbar width before opening; remove its CSS variable on close, Escape, desktop resize and existing lifecycle disposal. No cinematic-controller changes. |
| `src/styles/editorial.css` | Remove redundant corporate section scroll margin; shared html scroll padding remains authoritative. |
| `src/styles/closing.css` | Apply the same correction to Contact and its action anchor. CTA design and telephone destination remain unchanged. |

During comparison, a trial permanent `scrollbar-gutter: stable` changed viewport-unit typography slightly. That trial was removed. The final compensation runs only while the menu is open; measured logo coordinates are exactly equal before and during opening.

No dependency or package version changes. Tailwind 4, `tw:` prefix, disabled Preflight, stylesheet order, tokens, Vazirmatn and RTL remain unchanged. `cinematic-hero.ts`, `mobile-cinematic.ts`, both cinematic stylesheets and the coverage markup/assets were not modified. No unnecessary Tailwind migration.

## Actual validation

### Visual/responsive

- Before/after comparison at all six baseline viewports and the same hold positions: 72 pairs. Additional full-page section/scene checks at 360×800, 375×812 and 430×932 (12 screenshots each).
- All captured checks report no horizontal overflow or missing images. Reading headings, controls and image separation inspected in screenshots. Existing small-screen benefit stacking, three-principle stacking and footer layout retained.
- Powertrain is now visibly separated at tablet and phone widths. Other chapters retain their previous poses.
- Coverage is pixel-identical before/after at **all six baseline viewports**: studio light, transparent car, right-side navy fade, copy and four category indicators preserved. No CTA added.
- 43/72 full-frame comparisons are pixel-identical. Other frames include the intended mobile powertrain change and raster/rendering differences in automotive images. This is not a claim of zero-pixel differences across the whole website. Selected desktop right-side text regions are identical in 14/15 comparisons; the 1440px hero crop differs. See the raw comparisons rather than interpreting these counts as a blanket visual-equivalence guarantee.
- Stable corporate views are overwhelmingly unchanged; native anchor destinations intentionally have less excess top space.

### Interaction/accessibility

- Menu at 390px: background scroll stays at 1077 after a half-page wheel gesture. Logo rectangle is unchanged: `[207.03125, 13.203125, 147.96875, 39.59375]` both closed and open.
- Tab enters navigation with a visible solid focus outline. Escape closes the menu and returns focus to its toggle. Overflow and temporary scrollbar compensation are removed.
- Opening at mobile and resizing to desktop also closes/unlocks the menu and removes compensation.
- About now starts at y=100; heading y=193.64, clear of the 66px fixed header. Contact starts at approximately y=100.22 and also clears the header. Clicking a menu destination closes/unlocks it before native navigation.
- Chapter navigation from cabin reaches coverage. All five telephone links remain `tel:09373020028`. No duplicate IDs or broken internal anchors; RTL and computed Vazirmatn verified.
- Existing semantic headings and image alternatives retained. No essential content removed from static markup.

### Motion/runtime

- Forward sequence captured at nine widths. Reverse sequence captured through hero, powertrain, brakes, body, cabin, cabin-to-coverage, coverage and corporate handoff at both 390 and 1440.
- No stuck scene or leftover image observed. Exactly one story ScrollTrigger remains active.
- Resize sequence 768→1024→390→844×390→390: mobile→desktop→mobile→static→mobile, story counts 1→1→1→0→1. No accumulation, missing images or overflow.
- Existing reduced-motion guard and no-JS static content remain intact; new menu entrance has its own reduced-motion override.
- Homepage loads on the project's existing development server without `FailedToLoadModuleSSR`. Captured browser console has no errors or warnings.
- `npm run typecheck`: PASS (44 local imports and TypeScript).
- `npm run build`: PASS (static homepage generated).

## Evidence

All paths below are relative to `docs/screenshots/phase-5-6-2/`:

- `before/` and `after/`: full screenshots. Final captures replace earlier trial captures with the same filename.
- `comparison-powertrain-768.png`: matched before/after tablet composition.
- `comparison-anchor-about-320.png`: native About anchor spacing comparison.
- `after-story-320.png`, `after-story-390.png`, `after-story-768.png`, `after-story-1440.png`: six-chapter contact sheets.
- `pixel-comparison.json`: all 72 comparisons.
- `desktop-text-comparison.json`: measured desktop crop comparison.
- `interaction-checks.json`: actual menu, keyboard, logo, anchors, resize modes and console results.
- `reverse-checks.json`: reverse traversal states and trigger counts.
- `source-before.json`, `summary.json`, `observations.json`: source hashes and browser observations. Observations preserve earlier trial entries; filenames contain the final screenshots.

## Limits

Tests used the real in-app browser with native wheel/keyboard input and viewport overrides. Actual phone touch inertia, GPU/FPS and Safari-specific behavior were not tested on physical hardware. The browser does not expose OS reduced-motion emulation or disabling JavaScript; those paths were inspected in source, and the shared static teardown was exercised through short landscape. No unsupported hardware-performance or OS-accessibility certification is claimed. Existing project development server was reused and left running.
