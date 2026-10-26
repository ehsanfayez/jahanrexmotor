import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const html = await fs.readFile('dist/index.html', 'utf8');
if (html.includes('production-audit')) throw new Error('Temporary performance instrumentation remains in production HTML');
const references = [...new Set([...html.matchAll(/\/(?:images|fonts|_astro)\/[^\s"<>]+?\.(?:png|webp|woff2|js|css)/g)].map(match => match[0]))];
for (const reference of references) await fs.access(path.join('dist', reference));
const manifest = JSON.parse(await fs.readFile('public/images/parts/optimized/manifest.json', 'utf8'));
for (const asset of manifest) {
  const original = await fs.readFile(`public/images/parts/${asset.name}.png`);
  if (crypto.createHash('sha256').update(original).digest('hex') !== asset.sha256) throw new Error(`Original changed: ${asset.name}`);
  for (const derivative of asset.derivatives) {
    const file = `public/images/parts/optimized/${asset.name}-${derivative.width}.webp`;
    const metadata = await sharp(file).metadata();
    if (!metadata.hasAlpha || metadata.width !== derivative.width || (await fs.stat(file)).size !== derivative.bytes) throw new Error(`Invalid derivative: ${file}`);
  }
}
const phones = [...html.matchAll(/href="(tel:[^"]+)"/g)].map(match => match[1]);
if (phones.length !== 5 || phones.some(phone => phone !== 'tel:09373020028')) throw new Error('Contact links changed');
console.log(`Verified ${references.length} production asset paths, ${manifest.length} preserved originals and their responsive derivatives, five phone links, and clean uninstrumented HTML.`);
