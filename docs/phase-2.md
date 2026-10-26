# Phase 2 — final artwork and cinematic hero

This phase evolves the Phase 1 landing page rather than replacing the website. Later narrative chapters, company content, contact and footer keep their existing structure.

## Verified cleanup

Before removal, all project source, scripts, documentation, package configuration and public assets were inventoried. The active dependency graph is `index.astro` → Phase 1 components → `landing.ts`, `landing.css`, and `landing.ts` content configuration. None of the historical experiments was imported by that graph. The historical GLB source referenced by the preparation script was already absent; the `assets/` directory was empty. No Git history, editor configuration or unrelated project files was removed.

| Removed file | Reason |
| --- | --- |
| `src/scripts/vehicle-preview.ts` | Unreferenced Three.js model viewer; only consumer of the historical vehicle manifest. |
| `src/scripts/assembly-test.ts` | Unreferenced experiment controller for the archived assembly page. |
| `src/scripts/cinematic.ts` | Old sedan slideshow controller; no active page uses its selectors or imports. |
| `src/styles/preview.css` | Styles for the unused model viewer. |
| `src/styles/assembly-test.css` | Styles for the unused assembly experiment. |
| `src/styles/cinematic.css` | Styles for the old sedan slideshow. |
| `src/data/vehicle-manifest.json` | Consumed only by the deleted historical viewer/preparation tool. |
| `scripts/prepare-vehicle.mjs` | Obsolete GLB preprocessing; its original model was absent. |
| `scripts/check-assembly-assets.mjs` | Validator for absent historical assembly assets. |
| `docs/archive/assembly-test.astro` | Historical experiment outside the active pages directory, referencing missing assets. |
| `public/images/parts/ring.svg` | Replaced abstract placeholder; no remaining active references. |
| `public/images/parts/block.svg` | Replaced abstract placeholder; no remaining active references. |
| `public/images/parts/blade.svg` | Replaced abstract placeholder; no remaining active references. |
| `docs/phase-1.md` | Superseded placeholder instructions; replaced by this guide. |
| `docs/screenshots/phase-1-desktop.png` | Superseded visual test artifact; replaced by Phase 2 captures. |

Removed dependencies: `three`, `@types/three`, and their now-unused transitive packages. Removed npm tasks: `prepare:vehicle` and `check:assembly-assets`. `package-lock.json` was regenerated offline and installed packages pruned. Remaining top-level packages are Astro, GSAP and TypeScript.

## Preserved Phase 1 foundation

- `src/pages/index.astro`: RTL document, metadata, self-hosted font preload and page composition.
- `src/components/Header.astro`, `Brand.astro`, `Capabilities.astro`, `Contact.astro`, `Footer.astro`: retained.
- `src/components/Hero.astro`: evolved into the cinematic hero plus first narrative chapter.
- `src/components/Narrative.astro`: retains the three subsequent chapters and the four chapter links. The first chapter is now rendered with the hero so its images can remain continuous.
- `src/components/PartSlot.astro`: retained as the reusable image layer, extended with responsive picture sources and separate scroll/float wrappers.
- `src/data/landing.ts`: retained; now points to all seven real PNGs, supplies accurate image alt text and the first chapter's corporate introduction.
- `src/scripts/landing.ts`: retains header, mobile navigation, later chapter timelines and lifecycle cleanup. Shared hero logic is isolated in `cinematic-hero.ts`.
- `src/styles/landing.css`: retains the global visual system, typography and responsive later sections. Unused Phase 1 hero selectors were removed; scoped hero styling lives in `cinematic-hero.css`.
- Fonts, font license, favicon, Astro/TypeScript configuration, editor configuration and AGENTS.md remain.

## Artwork and loading

All seven supplied images were verified: `engine-main.png`, `gearbox-main.png`, `brake-disc.png`, `brake-caliper.png`, `headlight-main.png`, `side-mirror.png`, `suspension-main.png`. Each is 1254×1254 with an alpha channel.

Original PNG bytes remain untouched. `npm run prepare:parts` generates aspect-preserving 384px, 768px and 1254px **lossless WebP** variants under `public/images/parts/optimized/`. It never crops, retouches, recolors or composites the originals. `manifest.json` records source SHA-256 hashes and output sizes. Run preparation when source images change; generated outputs are served as static assets and require no production image processing service. Sharp is the image processor already supplied by Astro.

`PartSlot` uses WebP `srcset`/`sizes` with the original PNG as browser fallback. Only the main engine has high fetch priority. Primary hero layers load eagerly; the two decorative layers hidden on mobile and subsequent chapter images load lazily. Explicit intrinsic dimensions and reserved square layer boxes prevent image layout shift. All artwork uses `object-fit: contain`; there are no perspective transforms or nonuniform image scaling.

## Composition and scroll

The RTL copy and CTAs occupy the right column. A large engine anchors the left column; the gearbox sits behind it, with smaller brake, lighting, mirror and suspension layers arranged around it. Each is a separate picture/img in its own DOM figure. Charcoal, a restrained orange glow, a fine industrial grid and light shadow treatment provide atmosphere without WebGL or a flattened background composite.

On desktop at least 900px wide and 680px high, with reduced motion disabled, a 265svh document section contains a native CSS sticky stage. One `cinematic-bridge` GSAP timeline scrubs over its 165svh travel:

- Opening hold: 0–12%.
- Hero copy exit: 12–32%.
- Engine and gearbox recompose continuously: 0–57%.
- Supporting parts travel at different depths and fade gradually: 0–45%.
- Corporate chapter copy enters: 34–57%.
- First chapter reading hold: 57–100%, before the sticky stage naturally leaves with the document.

The exact same hero engine/gearbox DOM elements remain visible for the first chapter; no image swap or slideshow occurs. The `#powertrain` marker lands inside its readable interval. A small vertical rail exposes scroll progress. Scrolling upward reverses the same timeline.

Each image has a scroll wrapper and an inner float wrapper. Gentle 4–5px idle motion affects only the inner wrapper; scroll transforms never compete with it. Idle tweens pause when the story is offscreen. Motion uses transforms/opacity, without animated filters or continuous rendering loops. The inactive text panel is inert and hidden from assistive technology, preventing invisible links from receiving keyboard focus.

Mobile, short viewports and reduced-motion preference use natural document flow: the hero, a separately readable first chapter and its engine/gearbox visuals. Mirror and suspension decoration are omitted from the narrow hero composition. Without JavaScript both text sections remain visible. MatchMedia teardown restores layout, styles, focusability and attributes; the page's existing Astro cleanup disposes of timelines, ScrollTriggers and listeners.

## Validation and remaining content

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed. |
| `npm run build` | Passed; one static page generated. |
| Static asset references | All 32 emitted image/font/script/stylesheet/favicon paths exist; no placeholder or historical runtime references. |
| Source artwork integrity | All seven source SHA-256 hashes unchanged. Full-size lossless WebP has identical alpha and visible RGB pixels to each PNG. |
| Responsive assets | All 21 variants have the expected square dimensions and alpha channel. All seven hero images loaded successfully in the browser. |
| Phase 1 preservation | 17 expected source/configuration/font files verified present, including every existing component. |
| Desktop | 1280×720, 1440×900 and the 900×680 motion boundary inspected. No horizontal overflow; first-chapter copy stays below the header and within the stage. |
| Mobile | 390×844 and 320×740 inspected. No horizontal or heading overflow. Menu expansion/Escape closing and first-chapter CTA work. |
| Static fallback | 1280×650 inspected: enhancement class removed, first chapter visible, inert/ARIA state restored and native-flow fragment marker restored. |
| Scroll | Half-page slow scroll, three-page fast jumps, reverse scroll and fragment navigation tested. Reverse to zero restored all seven scroll-layer matrices to identity and opacity 1. First chapter retains one shared engine and one shared gearbox layer. |
| Console | No runtime errors observed. |

Reduced-motion preference is implemented through the media query gate; explicit preference emulation was not available in the browser controls. Its shared unenhanced layout/cleanup path was exercised through mobile and short-height viewport changes. Hardware performance profiling and cross-browser certification are outside this phase's validation.

Captures: [initial hero](screenshots/phase-2-hero.png), [first chapter transition](screenshots/phase-2-transition.png), [mobile hero](screenshots/phase-2-mobile.png).

Official contact information is still pending and remains clearly marked; no invented email or phone number was introduced. The brand symbol remains the provisional Phase 1 mark. Later chapters intentionally retain Phase 1 art direction while using the real images.
