// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  devToolbar: { enabled: false },
  // Keep Astro's existing CSS optimization pipeline authoritative.
  vite: { plugins: [tailwindcss({ optimize: false })] },
});
