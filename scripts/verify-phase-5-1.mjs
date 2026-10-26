import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';

const output = 'docs/screenshots/phase-5-1';
const manifest = JSON.parse(await fs.readFile('public/images/parts/optimized/manifest.json', 'utf8'));
const originals = await Promise.all(manifest.map(async ({ name, sha256 }) => ({
  name,
  matches: crypto.createHash('sha256').update(await fs.readFile(`public/images/parts/${name}.png`)).digest('hex') === sha256,
})));
const html = await fs.readFile('dist/index.html', 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
const refs = new Set([...html.matchAll(/(?:src|href)="(\/(?:_astro|images|fonts)\/[^"?#]+)"/g)].map(m => m[1]));
for (const match of html.matchAll(/srcset="([^"]+)"/g)) {
  for (const item of match[1].split(',')) {
    const path = item.trim().split(/\s+/)[0];
    if (path.startsWith('/')) refs.add(path);
  }
}
const missing = [];
for (const path of refs) {
  try { await fs.access(`dist${path}`); } catch { missing.push(path); }
}
const results = {
  originals,
  webpCount: (await fs.readdir('public/images/parts/optimized')).filter(n => n.endsWith('.webp')).length,
  referencedAssets: refs.size, missing,
  idCount: ids.length,
  duplicateIds: ids.filter((id, i) => ids.indexOf(id) !== i),
};
await fs.writeFile(`${output}/asset-validation.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
if (originals.some(item => !item.matches) || missing.length || results.duplicateIds.length) process.exitCode = 1;

async function sheet(rows, target) {
  const layers = [];
  for (const [r, row] of rows.entries()) {
    for (const [c, item] of row.entries()) {
      const left = 16 + c * 656;
      const top = 16 + r * 440;
      layers.push({ left, top, input: Buffer.from(`<svg width="640" height="24"><text x="0" y="18" font-family="sans-serif" font-size="14" fill="#F4F5F6">${item.label}</text></svg>`) });
      layers.push({ left, top: top + 24, input: await sharp(item.file).resize(640, 400).png().toBuffer() });
    }
  }
  await sharp({ create: { width: 1328, height: rows.length * 440 + 16, channels: 3, background: '#191F27' } }).composite(layers).png().toFile(`${output}/${target}`);
}
await sheet([
  [{ label: 'PHASE 4 / HERO', file: 'docs/screenshots/phase-4/000.png' }, { label: 'PHASE 5.1 / HERO', file: `${output}/hero-1440.png` }],
  [{ label: 'PHASE 4 / ENGINE', file: 'docs/screenshots/phase-4/035.png' }, { label: 'PHASE 5.1 / ENGINE', file: `${output}/engine-1440.png` }],
  [{ label: 'PHASE 4 / BRAKES', file: 'docs/screenshots/phase-4/070.png' }, { label: 'PHASE 5.1 / BRAKES', file: `${output}/brakes-1440.png` }],
], 'comparison.png');
await sheet([
  [{ label: '01 / HERO', file: `${output}/hero-1440.png` }, { label: '02 / ENGINE', file: `${output}/engine-1440.png` }],
  [{ label: '03 / BRAKES', file: `${output}/brakes-1440.png` }, { label: '04 / NORMAL FLOW', file: `${output}/normal-flow-1440.png` }],
], 'overview.png');
