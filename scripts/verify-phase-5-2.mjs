import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';

const output = 'docs/screenshots/phase-5-2';
const manifest = JSON.parse(await fs.readFile('public/images/parts/optimized/manifest.json', 'utf8'));
const originals = await Promise.all(manifest.map(async ({ name, sha256, width, height }) => ({
  name, width, height,
  matches: crypto.createHash('sha256').update(await fs.readFile(`public/images/parts/${name}.png`)).digest('hex') === sha256,
})));
const html = await fs.readFile('dist/index.html', 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
const refs = new Set([...html.matchAll(/(?:src|href)="(\/(?:_astro|images|fonts)\/[^"?#]+)"/g)].map(m => m[1]));
for (const match of html.matchAll(/srcset="([^"]+)"/g)) {
  for (const item of match[1].split(',')) refs.add(item.trim().split(/\s+/)[0]);
}
const missing = [];
for (const path of refs) {
  try { await fs.access(`dist${path}`); } catch { missing.push(path); }
}
const fragments = [...new Set([...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1]))];
const missingAnchors = fragments.filter(id => !ids.includes(id));
const ariaReferences = [...html.matchAll(/aria-(?:labelledby|controls)="([^"]+)"/g)].flatMap(m => m[1].split(/\s+/));
const results = {
  originals,
  webpCount: (await fs.readdir('public/images/parts/optimized')).filter(n => n.endsWith('.webp')).length,
  referencedAssets: refs.size, missing,
  idCount: ids.length, duplicateIds: ids.filter((id, i) => ids.indexOf(id) !== i),
  internalAnchors: fragments.length, missingAnchors,
  missingAriaTargets: ariaReferences.filter(id => !ids.includes(id)),
  sceneGroups: [...html.matchAll(/data-group="([^"]+)"/g)].map(m => m[1]),
  panels: [...html.matchAll(/data-panel="([^"]+)"/g)].map(m => m[1]),
};
await fs.writeFile(`${output}/asset-validation.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
if (originals.some(item => !item.matches) || missing.length || results.duplicateIds.length || missingAnchors.length || results.missingAriaTargets.length) process.exitCode = 1;

const tokens = await fs.readFile('src/styles/tokens.css', 'utf8');
const color = key => tokens.match(new RegExp(`--${key}: (#[a-f0-9]{6})`, 'i'))[1];
const luminance = hex => hex.slice(1).match(/../g).map(n => parseInt(n, 16) / 255).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4).reduce((sum, n, i) => sum + n * [.2126, .7152, .0722][i], 0);
const contrast = [['text','deep'],['text','bg'],['secondary','bg'],['muted','surface'],['accent','deep'],['accent','bg'],['cta-hover','deep']].map(([fg,bg]) => {
  const a = luminance(color(fg)), b = luminance(color(bg));
  return { foreground: fg, background: bg, ratio: +((Math.max(a,b)+.05)/(Math.min(a,b)+.05)).toFixed(2) };
});
await fs.writeFile(`${output}/contrast.json`, JSON.stringify(contrast, null, 2));

const frames = ['hero', 'powertrain', 'brakes', 'body', 'interior', 'handoff'];
const layers = [];
for (const [index, name] of frames.entries()) {
  const left = 16 + index % 3 * 496, top = 16 + Math.floor(index / 3) * 340;
  layers.push({ left, top, input: Buffer.from(`<svg width="480" height="24"><text x="0" y="18" font-family="sans-serif" font-size="14" fill="#F4F5F6">${String(index).padStart(2,'0')} / ${name.toUpperCase()}</text></svg>`) });
  layers.push({ left, top: top + 24, input: await sharp(`${output}/${name}-1440.png`).resize(480, 300).png().toBuffer() });
}
await sharp({ create: { width: 1504, height: 696, channels: 3, background: '#191F27' } }).composite(layers).png().toFile(`${output}/overview.png`);

const comparisons = [
  ['HERO', 'docs/screenshots/phase-5-1/hero-1440.png', `${output}/hero-1440.png`],
  ['BODY / LIGHTING', 'docs/screenshots/phase-5-1/normal-flow-1440.png', `${output}/body-1440.png`],
];
const comparisonLayers = [];
for (const [row, [label, before, after]] of comparisons.entries()) {
  for (const [col, file] of [before, after].entries()) {
    const left = 16 + col * 656, top = 16 + row * 440;
    comparisonLayers.push({ left, top, input: Buffer.from(`<svg width="640" height="24"><text x="0" y="18" font-family="sans-serif" font-size="14" fill="#F4F5F6">PHASE ${col ? '5.2' : '5.1'} / ${label}</text></svg>`) });
    comparisonLayers.push({ left, top: top + 24, input: await sharp(file).resize(640, 400).png().toBuffer() });
  }
}
await sharp({ create: { width: 1328, height: 896, channels: 3, background: '#191F27' } }).composite(comparisonLayers).png().toFile(`${output}/comparison.png`);
