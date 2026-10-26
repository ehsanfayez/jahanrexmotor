import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';

const output = 'docs/screenshots/phase-5-4-2';
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

const original = await fs.readFile('public/images/parts/exploded-sedan-components.png');
const coverage = html.match(/<article[^>]*data-panel="coverage"[^>]*>([\s\S]*?)<\/article>/)?.[1] ?? '';
const validation = {
  originalSha256: crypto.createHash('sha256').update(original).digest('hex'),
  originalUnchanged: crypto.createHash('sha256').update(original).digest('hex') === '3c547df9e633910c6f68a638a409c6f82d74f7441c5a662e1711fecf3fe2add7',
  originalBytes: original.length,
  originalHasAlpha: (await sharp(original).metadata()).hasAlpha,
  originalAlphaRange: (await sharp(original).stats()).channels[3],
  referencesOldArtwork: /exploded-sedan-coverage/.test(html),
  imageElements: [...coverage.matchAll(/<img\b/g)].length,
  categories: [...coverage.matchAll(/<li\b/g)].length,
  icons: [...coverage.matchAll(/data-icon=/g)].length,
  actions: [...coverage.matchAll(/<(?:a|button)\b/g)].length,
  exactPhoneLinks: [...html.matchAll(/href="tel:([^"]+)"/g)].every(m => m[1] === '09373020028'),
  optimized: await Promise.all([960,1672].map(async width => {
    const file = `public/images/parts/optimized/exploded-sedan-components-${width}.webp`;
    const meta = await sharp(file).metadata();
    return {file, width:meta.width,height:meta.height,hasAlpha:meta.hasAlpha,bytes:(await fs.stat(file)).size};
  })),
};
await fs.writeFile(`${output}/coverage-validation.json`, JSON.stringify(validation,null,2));
console.log(JSON.stringify(validation,null,2));
if (!validation.originalUnchanged || !validation.originalHasAlpha || validation.originalAlphaRange.min !== 0 || validation.referencesOldArtwork || validation.optimized.some(i => !i.hasAlpha) || validation.imageElements !== 1 || validation.categories !== 4 || validation.icons !== 4 || validation.actions || !validation.exactPhoneLinks || results.webpCount !== 37) process.exitCode = 1;

const frames = ['cabin-hold','cabin-departure','coverage-entrance','coverage-hold','coverage-exit','corporate-entrance'];
const layers=[];
for (const [index,name] of frames.entries()) {
  const left=16+index%3*496, top=16+Math.floor(index/3)*340;
  layers.push({left,top,input:Buffer.from(`<svg width="480" height="24"><text x="0" y="17" font-family="sans-serif" font-size="12" fill="#f4f5f6">${name.toUpperCase()}</text></svg>`)});
  layers.push({left,top:top+24,input:await sharp(`${output}/${name}-1440.png`).resize(480,300).png().toBuffer()});
}
await sharp({create:{width:1504,height:696,channels:3,background:'#191f27'}}).composite(layers).png().toFile(`${output}/overview.png`);

// Evidence crop only; the supplied automotive artwork is never edited.
await sharp(`${output}/coverage-hold-1440.png`).extract({left:640,top:170,width:760,height:550}).png().toFile(`${output}/coverage-hold-closeup.png`);

const mobileLayers=[];
for (const [index,name] of ['coverage-390','coverage-details-390'].entries()) {
  mobileLayers.push({left:16+index*406,top:16,input:await sharp(`${output}/${name}.png`).png().toBuffer()});
}
await sharp({create:{width:828,height:876,channels:3,background:'#191f27'}}).composite(mobileLayers).png().toFile(`${output}/mobile-overview.png`);



