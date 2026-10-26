# Phase 5.5 — Tailwind CSS 4 infrastructure integration

Tailwind CSS **4.3.3** is installed and operational through **@tailwindcss/vite 4.3.3**. This is an opt-in infrastructure change; no existing component was converted to utilities or visually redesigned.

## Installation and configuration

Before this phase, Tailwind was absent from package.json, the lockfile, Astro/Vite configuration and application styles. The two requested packages were added as development dependencies and locked in package-lock.json. npm added their required transitive packages. Tailwind and Vite are deduplicated: the plugin shares the existing Vite 8.3.5 with Astro 7.4.2; Astro, GSAP and TypeScript versions were preserved.

`astro.config.mjs` retains `devToolbar: { enabled: false }` and adds:

```js
import tailwindcss from '@tailwindcss/vite';
// Inside defineConfig:
vite: { plugins: [tailwindcss({ optimize: false })] }
```

The supported `optimize: false` option leaves Astro's existing CSS optimization pipeline in charge. No PostCSS configuration or legacy Astro Tailwind integration was added. The method follows the [official Vite integration](https://tailwindcss.com/docs/installation/using-vite).

## CSS entrypoint and cascade

`src/tailwind.css` contains only the requested theme and utility imports:

```css
@layer theme, utilities;
@import "tailwindcss/theme.css" layer(theme) prefix(tw);
@import "tailwindcss/utilities.css" layer(utilities) prefix(tw) source(none);
@source "**/*.{astro,html,js,jsx,ts,tsx,md,mdx}";
```

Preflight is disabled by omitting both `preflight.css` and the umbrella `@import "tailwindcss"`. This matches the [official selective-import and prefix guidance](https://tailwindcss.com/docs/preflight). The prefix applies to utilities and theme variables, protecting existing names such as `--font-sans` from collisions. New utility syntax is `tw:grid`, `tw:p-4`, `tw:md:flex` and `tw:hover:bg-blue-500`.

The entrypoint is imported first in `src/pages/index.astro`; all previous imports retain their relative order. `landing.css` still imports `tokens.css`. Every existing component style and CSS file remains unchanged, unlayered and authoritative over layered utilities. No important modifier or reset was introduced. The final production stylesheet's entire unlayered content is identical to the pre-installation stylesheet; only the Tailwind banner and layer declaration were added (89 bytes).

The CSS entrypoint lives directly in `src` so the source glob stays within its scanner base. The installed Windows scanner did not discover parent-traversing globs from `src/styles`; the in-root explicit glob was tested successfully. Limiting detection to src also prevents documentation and test evidence from generating production utilities.

## Utility verification and temporary UI cleanup

`node scripts/verify-tailwind-utilities.mjs` creates an isolated temporary Astro route, runs the actual Vite production build, and checks generated CSS for grid, padding, gap, color, responsive and hover utilities plus namespaced theme variables. All seven checks passed. The reader includes Astro's inlined stylesheet output as well as external CSS.

The script removes the temporary route in a finally block and rebuilds the real site. The final build has one page, no fixture route and no demonstration UI. No current production element has a `tw:` class, as intended. Generated-rule proof is saved in [utility-verification.json](screenshots/phase-5-5/utility-verification.json) and [utility-fixture.css](screenshots/phase-5-5/utility-fixture.css).

## Before/after visual regression results

Forty baseline screenshots were captured **before installation** at 1440 × 900, 1280 × 720, 390 × 844 and 320 × 700. Desktop captures cover hero, all four original chapters, coverage, stage release, company, Why, principles, contact and footer. Mobile captures cover hero, coverage, each corporate section, contact, footer and the expanded menu. Matching after screenshots use the recorded baseline scroll pixels and stable rendered states.

All **40/40 original computed-style/layout observations match** after integration, including typography, colors, dimensions, image positions, borders, buttons, transforms and inert states. All legacy source files remain byte-identical except the page's single new CSS import.

Initial raw screenshot comparison was 25/40 identical. Remaining differences were investigated rather than hidden: responsive-image sampling after warming the browser cache, keyboard focus on two recaptured menu buttons, and a small compositor rasterization difference in a transition frame. The original baseline and initial result remain in the evidence folder. Fifteen affected views were replayed with Tailwind temporarily disabled, the original CSS configuration restored, the same warm image cache and matched focus/scroll state. The final enabled configuration was then restored and relevant frames rechecked.

The final comparison uses those fifteen controlled no-Tailwind references plus the unchanged original references for the other views: **40/40 pixel-identical, zero changed pixels**, with all 40 original style/layout records still equal. A direct comparison to the original cold/earlier-cache images is also retained separately in the result (29/40 identical after state alignment). [regression-results.json](screenshots/phase-5-5/regression-results.json) identifies the reference used for every view; no original baseline was overwritten.

See the [before/after comparison sheet](screenshots/phase-5-5/comparison.png), [original before observations](screenshots/phase-5-5/before/observations.json), [after observations](screenshots/phase-5-5/after/observations.json), [controlled references](screenshots/phase-5-5/controlled-before/observations.json) and [initial raw result](screenshots/phase-5-5/initial-regression-results.json).

## Behavior and final validation

- `npm run typecheck` passed: all 17 local Astro component imports resolve and TypeScript reports no errors.
- `npm run build` passed: one production page, fixture removed. `node scripts/compare-tailwind-regression.mjs` passed all strict evidence checks.
- ScrollTrigger initializes and the rendered master timeline progresses normally. Forward/reverse rendered states match at .83, .89, .94 and .987; the sticky-stage release into corporate content is intact. Animation source was not changed. [GSAP evidence](screenshots/phase-5-5/gsap-validation.json).
- Enhancement is active at 1024 × 768 and reverts cleanly at 768 × 1024. Every fallback panel is visible and non-inert, and coverage inline animation styles are removed. No horizontal overflow at any tested size. [Responsive evidence](screenshots/phase-5-5/responsive-validation.json).
- Mobile menu expansion was pixel-compared at both mobile sizes. Escape closes it and returns focus to the menu button.
- Vazirmatn is loaded; the original font token remains `Vazirmatn, Tahoma, sans-serif`. Persian RTL, LTR phone numbers and all five `tel:09373020028` links are unchanged. [Health checks](screenshots/phase-5-5/health-validation.json).
- A fresh final browser page recorded zero warnings/errors. [Console evidence](screenshots/phase-5-5/browser-console.json).

No unresolved integration incompatibility was observed. Validation limits: OS-level reduced-motion emulation is not exposed by this browser. The unchanged preference guard and reduced-motion CSS were checked, and their shared static/cleanup path was exercised through responsive switching; an actual OS preference toggle was not tested. Other browser engines and physical-device FPS were not measured.

## Files and repeatable checks

Changed package.json, package-lock.json, astro.config.mjs and the CSS import in src/pages/index.astro. Added src/tailwind.css, the two verification scripts, this report and evidence. README links this report. No existing design tokens, component CSS, HTML content, image assets, navigation or animation code was changed.

```sh
npm run typecheck
node scripts/verify-tailwind-utilities.mjs # isolated build fixture, then cleanup + production build
npm run build
node scripts/compare-tailwind-regression.mjs # verifies saved comparison evidence and current source/CSS
```

Future UI may opt into `tw:` utilities. Keep Preflight disabled and the legacy styles unlayered; avoid replacing the existing design-token system or enabling global important rules.
