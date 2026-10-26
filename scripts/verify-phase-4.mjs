import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';

const dir = 'docs/screenshots/phase-4';
const labels = ['000', '010', '020', '035', '045', '052', '060', '070', '085', '100'];
const composites = [];
for (const [i, label] of labels.entries()) {
  const left = 12 + (i % 5) * 396;
  const top = 12 + Math.floor(i / 5) * 278;
  const title = Buffer.from(`<svg width="384" height="26"><text x="10" y="19" fill="#F4F5F6" font-family="sans-serif" font-size="16">${Number(label)}%</text></svg>`);
  composites.push({ input: title, left, top });
  composites.push({ input: await sharp(`${dir}/${label}.png`).resize(384, 240).png().toBuffer(), left, top: top + 26 });
}
await sharp({ create: { width: 1992, height: 568, channels: 3, background: '#191F27' } }).composite(composites).png().toFile(`${dir}/storyboard.png`);

const manifest = JSON.parse(await fs.readFile('public/images/parts/optimized/manifest.json', 'utf8'));
const originals = await Promise.all(manifest.map(async ({ name, sha256 }) => {
  const data = await fs.readFile(`public/images/parts/${name}.png`);
  return { name, matches: crypto.createHash('sha256').update(data).digest('hex') === sha256 };
}));
const html = await fs.readFile('dist/index.html', 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
const refs = [...new Set([...html.matchAll(/(?:src|href)="(\/(?:_astro|images|fonts)\/[^"?#]+)"/g)].map(m => m[1]))];
for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
  for (const item of m[1].split(',')) {
    const path = item.trim().split(/\s+/)[0];
    if (path.startsWith('/') && !refs.includes(path)) refs.push(path);
  }
}
const missing = [];
for (const path of refs) {
  try { await fs.access(`dist${path}`); } catch { missing.push(path); }
}
const validation = {
  originals,
  webpCount: (await fs.readdir('public/images/parts/optimized')).filter(n => n.endsWith('.webp')).length,
  referencedAssets: refs.length,
  missing,
  idCount: ids.length,
  duplicateIds: ids.filter((id, i) => ids.indexOf(id) !== i),
};
await fs.writeFile(`${dir}/asset-validation.json`, JSON.stringify(validation, null, 2));
console.log(JSON.stringify(validation, null, 2));
if (originals.some(o => !o.matches) || missing.length || validation.duplicateIds.length) process.exitCode = 1;
