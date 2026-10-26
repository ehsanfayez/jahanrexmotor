# Icon import investigation

Verified on 26 October 2026.

`src/components/Header.astro` correctly imports `./Icon.astro`. The target already exists with the exact filename case. It is the shared inline-SVG component used by Header, Hero, Capabilities, Contact and Footer, supporting all nine icon names used by the page plus the current `name`, `size` and `class` props. Its Lucide paths are local, with no runtime icon-library dependency.

The reported `FailedToLoadModuleSSR` did not reproduce against the current files. A fresh background Astro development process successfully served the homepage, rendered 13 shared SVG icons, and showed no error overlay or browser console warnings/errors. Stale development module state or an earlier missing-file state is a possible explanation, not a proven historical root cause. No incorrect source import or missing component was found, so those files were preserved.

Added `scripts/check-astro-imports.mjs` to verify local Astro component imports, including exact filename casing on Windows. `package.json` now runs it before TypeScript in `npm run typecheck`, since the existing TypeScript-only command does not validate Astro component imports. All 15 local component imports passed. `npm run typecheck` and `npm run build` both passed; production generated one page.

Browser checks confirmed the header cooperation action still uses `#contact` and `messages-square`, and all five telephone links still use `tel:09373020028`. No styling, navigation, phone link or icon design changed. [Homepage evidence](screenshots/icon-import-homepage.png).

Tailwind is not installed in the project dependency tree/lockfiles, not configured in Astro or a Tailwind/PostCSS configuration, and not imported through CSS directives or a CDN. The templates use the project's custom semantic CSS classes, not Tailwind utility classes. Nothing was installed.
