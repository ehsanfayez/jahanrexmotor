import fs from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

// Build-output-only instrumentation; never imported by the application.
// Run after build, before preview. Restore using the matching saved index.html.
const stage = process.argv[2];
if (!['before', 'after'].includes(stage)) throw new Error('Expected before or after');
const directory = `docs/screenshots/phase-5-6-3/${stage}`;
await fs.mkdir(directory, { recursive: true });
const html = await fs.readFile('dist/index.html', 'utf8');
if (html.includes('id="production-audit"')) throw new Error('Build a clean output before instrumenting');
await fs.writeFile(`${directory}/index-original.html`, html);
const bundles = [];
for (const file of await fs.readdir('dist/_astro')) {
  const data = await fs.readFile(`dist/_astro/${file}`);
  bundles.push({ file, bytes: data.length, gzipBytes: zlib.gzipSync(data).length, brotliBytes: zlib.brotliCompressSync(data).length });
}
const assets = [];
async function visit(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await visit(file);
    else if (/\.(png|webp|woff2)$/.test(file)) {
      const data = await fs.readFile(file);
      assets.push({ file: file.replaceAll('\\', '/'), bytes: data.length, sha256: crypto.createHash('sha256').update(data).digest('hex') });
    }
  }
}
await visit('public');
await fs.writeFile(`${directory}/inventory.json`, JSON.stringify({ bundles, assets }, null, 2));
const instrument = `<script id="production-audit">
(()=>{const sample={environment:{userAgent:navigator.userAgent,dpr:devicePixelRatio,width:innerWidth,height:innerHeight,throttling:'none; localhost preview'},lcp:null,cls:0,longTaskBlockingMs:0};
const publish=()=>{let node=document.getElementById('production-audit-results');if(!node){node=document.createElement('script');node.type='application/json';node.id='production-audit-results';document.head.append(node)}sample.resources=performance.getEntriesByType('resource').map(e=>({name:e.name,transferSize:e.transferSize,encodedBodySize:e.encodedBodySize,duration:e.duration,responseStatus:e.responseStatus}));sample.paint=performance.getEntriesByType('paint').map(e=>({name:e.name,time:e.startTime}));const n=performance.getEntriesByType('navigation')[0];sample.navigation=n?{duration:n.duration,transferSize:n.transferSize}:null;sample.elapsed=performance.now();node.textContent=JSON.stringify(sample)};
for(const type of ['largest-contentful-paint','layout-shift','longtask']){try{new PerformanceObserver(list=>{for(const e of list.getEntries()){if(type==='largest-contentful-paint')sample.lcp={time:e.startTime,url:e.url||null,element:e.element?.tagName||null};if(type==='layout-shift'&&!e.hadRecentInput){sample.cls+=e.value;(sample.shifts??=[]).push({time:e.startTime,value:e.value,sources:e.sources.map(s=>({element:s.node?.className||s.node?.tagName,previous:s.previousRect,current:s.currentRect}))})}if(type==='longtask')sample.longTaskBlockingMs+=Math.max(0,e.duration-50)}publish()}).observe({type,buffered:true})}catch{sample[type]='unsupported'}}
addEventListener('load',()=>{publish();setTimeout(publish,2000);setTimeout(()=>{sample.ready=true;publish()},5000)},{once:true});
})();</script>`;
await fs.writeFile('dist/index.html', html.replace('<head>', `<head>${instrument}`));
console.log(`Recorded ${bundles.length} bundles, ${assets.length} assets; temporary output-only audit enabled for ${stage}.`);
