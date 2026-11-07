// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  i18n: { defaultLocale: 'fa', locales: ['fa', 'en'], routing: { prefixDefaultLocale: false } },
  devToolbar: { enabled: false },
  // Keep Astro's existing CSS optimization pipeline authoritative.
  vite: { plugins: [tailwindcss({ optimize: false })] },
});
