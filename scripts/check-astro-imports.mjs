import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../src/', import.meta.url));
const failures = [];
let count = 0;

async function visit(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await visit(file);
    } else if (/\.(astro|ts|js|css)$/.test(entry.name)) {
      const source = await fs.readFile(file, 'utf8');
      // Include Astro script blocks and side-effect CSS imports, not only components.
      for (const match of source.matchAll(/(?:\bimport\s+(?:[^;'"\n]+?\s+from\s+)?|@import\s*)['"](\.[^'"]+)['"]/g)) {
        count++;
        const target = path.resolve(directory, match[1].split(/[?#]/)[0]);
        const candidates = path.extname(target) ? [target] :
          [target, ...['.ts', '.js', '.astro', '.css'].map(extension => target + extension), path.join(target, 'index.ts'), path.join(target, 'index.js')];
        let found = false;
        for (const candidate of candidates) {
          try {
            // Check exact filename casing even on case-insensitive Windows.
            const names = await fs.readdir(path.dirname(candidate));
            if (names.includes(path.basename(candidate)) && (await fs.stat(candidate)).isFile()) { found = true; break; }
          } catch { /* Try the next supported extension. */ }
        }
        if (!found) {
          failures.push(`${path.relative(root, file)}: cannot resolve ${match[1]} (including filename case)`);
        }
      }
    }
  }
}

await visit(root);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Verified ${count} local component, stylesheet and script imports.`);
}
