# Phase 5.6.1 runtime hotfix

2026-10-26

The reported import is correct: `Hero.astro` imports `../styles/mobile-cinematic.css`, resolving to the existing 5,843-byte stylesheet in `src/styles/`. It contains the actual mobile grid, sticky stage, composition, chapter navigation and coverage rules. No duplicate stylesheet or confirmed missing Phase 5.6.1 module was found.

The SSR error did not reproduce on a freshly started development server. A stale development-server resolution state is consistent with the earlier missing-file error and recovery after restart; its exact original cause cannot be established from the current filesystem. No CSS placeholder, path workaround or animation removal was necessary.

## Changes

- `scripts/check-astro-imports.mjs`: extend the existing typecheck guard beyond Astro frontmatter component imports to local CSS and script imports, including Astro script blocks and extensionless TypeScript imports. Exact filename casing is checked. This closes the verification gap that previously omitted the reported stylesheet.
- This report and `screenshots/phase-5-6-1/hotfix/` evidence.
- No application component, mobile CSS, GSAP timeline, desktop CSS, Tailwind configuration or package changes.

## Validation

- `npm run typecheck`: passed; 44 local component, stylesheet and script imports resolved, TypeScript passed.
- `npm run build`: passed; homepage generated.
- Fresh development server launched with `astro dev --background --host 127.0.0.1 --port 4325`.
- Homepage loaded in the real browser without `FailedToLoadModuleSSR`.
- At 390×844 the imported CSS is present, stage is sticky and 844px tall, panels use grid, and the mobile enhancement is active.
- Native scroll advances hero to powertrain; exactly one story trigger remains active. No horizontal overflow or missing browser images; no console errors or warnings.
- Screenshots: `hotfix/hero-390.png`, `hotfix/powertrain-390.png`; browser results: `hotfix/validation.json`.

If an already-open browser still shows the old error, reload it against the fresh server. There is no missing stylesheet to recreate in this checkout.
