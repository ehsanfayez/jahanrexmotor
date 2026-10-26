import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
import postcss from 'postcss';

const directory = 'docs/screenshots/phase-5-5';
const before = JSON.parse(await fs.readFile(`${directory}/before/observations.json`,'utf8'));
const after = JSON.parse(await fs.readFile(`${directory}/after/observations.json`,'utf8'));
const controlled = await fs.readFile(`${directory}/controlled-before/observations.json`,'utf8').then(JSON.parse,()=>[]);
const results=[];
for (const baseline of before) {
  const current = after.find(entry => entry.label === baseline.label);
  if (!current) throw new Error(`Missing after capture: ${baseline.label}`);
  const reference = controlled.find(entry => entry.label === baseline.label);
  const referenceStage = reference ? 'controlled-before' : 'before';
  const [a,b] = await Promise.all([referenceStage,'after'].map(stage => sharp(`${directory}/${stage}/${baseline.label}.png`).ensureAlpha().raw().toBuffer({resolveWithObject:true})));
  const original = reference ? await sharp(`${directory}/before/${baseline.label}.png`).ensureAlpha().raw().toBuffer() : a.data;
  if (a.info.width !== b.info.width || a.info.height !== b.info.height) throw new Error('Screenshot dimensions changed');
  let changedPixels=0, maximumChannelDifference=0;
  for(let offset=0;offset<a.data.length;offset+=4) {
    let changed=false;
    for(let channel=0;channel<4;channel++) {
      const delta=Math.abs(a.data[offset+channel]-b.data[offset+channel]);
      if(delta) changed=true;
      maximumChannelDifference=Math.max(maximumChannelDifference,delta);
    }
    if(changed) changedPixels++;
  }
  const elementDifferences = baseline.elements.map((element,index) => ({index,before:element,after:current.elements[index]})).filter(entry => JSON.stringify(entry.before)!==JSON.stringify(entry.after));
  results.push({label:baseline.label,referenceStage,originalPixelIdentical:original.equals(b.data),changedPixels,maximumChannelDifference,metricsEqual:JSON.stringify(baseline)===JSON.stringify(current),referenceMetricsEqual:JSON.stringify(reference??baseline)===JSON.stringify(current),elementDifferences});
}

const hashes=JSON.parse(await fs.readFile(`${directory}/source-before.json`,'utf8'));
const changedExistingSource=[];
for(const [file,hash] of Object.entries(hashes)) {
  if(crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex')!==hash) changedExistingSource.push(file);
}
const baselineCss=JSON.parse(await fs.readFile(`${directory}/css-before.json`,'utf8')).map(entry=>entry.content).join('\n');
const cssFiles=(await fs.readdir('dist/_astro')).filter(file=>file.endsWith('.css'));
const currentCss=(await Promise.all(cssFiles.map(file=>fs.readFile(`dist/_astro/${file}`,'utf8')))).join('\n');
const unlayered = css => postcss.parse(css).nodes.filter(node => node.type !== 'comment' && !(node.type==='atrule' && node.name==='layer')).map(node=>node.toString()).join('');
const entry=await fs.readFile('src/tailwind.css','utf8');
const summary={
  screenshots:results.length,
  originalPixelIdentical:results.filter(r=>r.originalPixelIdentical).length,
  warmCacheControlFrames:controlled.length,
  pixelIdentical:results.filter(r=>r.changedPixels===0).length,
  metricsIdentical:results.filter(r=>r.metricsEqual).length,
  changedExistingSource,
  onlyPageEntrypointChanged:JSON.stringify(changedExistingSource)===JSON.stringify(['src/pages/index.astro']),
  unlayeredProductionCssIdentical:unlayered(baselineCss)===unlayered(currentCss),
  preflightNotImported:!/@import\s+["']tailwindcss(?:\/preflight\.css)?["']/.test(entry),
  preflightAbsent:!currentCss.includes('text-size-adjust')&&!currentCss.includes('::-webkit-inner-spin-button'),
  fixtureRemoved:!await fs.access('src/pages/tailwind-verification.astro').then(()=>true,()=>false),
};
await fs.writeFile(`${directory}/regression-results.json`,JSON.stringify({summary,results},null,2));
console.log(JSON.stringify(summary,null,2));
if(results.length!==40||summary.pixelIdentical!==40||summary.metricsIdentical!==40||results.some(r=>!r.referenceMetricsEqual)||!summary.onlyPageEntrypointChanged||!summary.unlayeredProductionCssIdentical||!summary.preflightNotImported||!summary.preflightAbsent||!summary.fixtureRemoved) process.exitCode=1;

const layers=[];
for(const [row,label] of ['hero-1440','coverage-1440','footer-1440','coverage-390'].entries()) {
  for(const [column,stage] of ['before','after'].entries()) {
    const left=16+column*656, top=16+row*440;
    layers.push({left,top,input:Buffer.from(`<svg width="640" height="24"><text x="0" y="18" fill="#fff" font-family="sans-serif" font-size="14">${stage.toUpperCase()} / ${label.toUpperCase()}</text></svg>`)});
    const sourceStage=stage==='before'&&controlled.some(entry=>entry.label===label)?'controlled-before':stage;
    layers.push({left,top:top+24,input:await sharp(`${directory}/${sourceStage}/${label}.png`).resize(640,400,{fit:'contain',background:'#191f27'}).png().toBuffer()});
  }
}
await sharp({create:{width:1328,height:1776,channels:3,background:'#191f27'}}).composite(layers).png().toFile(`${directory}/comparison.png`);
