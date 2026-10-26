import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';

const output = 'docs/screenshots/phase-5-3';
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
const contrast = [['text','deep'],['text','bg'],['secondary','bg'],['muted','surface'],['accent','deep'],['accent','bg'],['cta-hover','deep'],['ink','paper-soft'],['ink-secondary','paper'],['accent-depth','paper-soft']].map(([fg,bg]) => {
  const a = luminance(color(fg)), b = luminance(color(bg));
  return { foreground: fg, background: bg, ratio: +((Math.max(a,b)+.05)/(Math.min(a,b)+.05)).toFixed(2) };
});
await fs.writeFile(`${output}/contrast.json`, JSON.stringify(contrast, null, 2));

const phones = [...html.matchAll(/href="(tel:[^"]+)"/g)].map(m => m[1]);
const corporate = {
  phones,
  allPhoneDestinationsCorrect: phones.length === 5 && phones.every(p => p === 'tel:09373020028'),
  whyFeatures: [...html.matchAll(/class="corporate-reason"/g)].length,
  principles: [...html.matchAll(/class="corporate-principle"/g)].length,
  lucideLicense: await fs.access('dist/licenses/lucide.txt').then(() => true, () => false),
};
await fs.writeFile(`${output}/corporate-validation.json`, JSON.stringify(corporate, null, 2));
console.log(JSON.stringify(corporate, null, 2));
if (!corporate.allPhoneDestinationsCorrect || corporate.whyFeatures !== 4 || corporate.principles !== 3 || !corporate.lucideLicense || results.webpCount !== 33 || originals.length !== 11) process.exitCode = 1;

async function overview(name, frames, mobile = false) {
  const width = mobile ? 195 : 480;
  const height = mobile ? 422 : 300;
  const gap = 16, cellHeight = height + 24 + gap;
  const layers = [];
  for (const [index, [label, file]] of frames.entries()) {
    const left = gap + index % 3 * (width + gap);
    const top = gap + Math.floor(index / 3) * cellHeight;
    layers.push({ left, top, input: Buffer.from(`<svg width="${width}" height="24"><text x="0" y="17" font-family="sans-serif" font-size="12" fill="#F4F5F6">${label.toUpperCase()}</text></svg>`) });
    layers.push({ left, top: top + 24, input: await sharp(`${output}/${file}.png`).resize(width, height).png().toBuffer() });
  }
  await sharp({ create: { width: 3 * (width + gap) + gap, height: 2 * cellHeight + gap, channels: 3, background: '#191F27' } }).composite(layers).png().toFile(`${output}/${name}.png`);
}
await overview('cinematic-overview', ['hero','engine','brakes','body','cabin','handoff'].map(n => [n, `${n}-1440`]));
await overview('corporate-overview', ['company','why','principles','contact','footer'].map(n => [n, `${n}-1440`]).concat([['transition','dark-light-transition']]));
await overview('mobile-overview', ['hero','company','why','principles','contact','footer'].map(n => [n, `${n}-390`]), true);


