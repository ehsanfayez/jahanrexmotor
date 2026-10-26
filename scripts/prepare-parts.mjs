import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import sharp from 'sharp';

// Derivatives only: never overwrite, crop, recolor or composite the supplied PNGs.
const names = ['engine-main', 'gearbox-main', 'brake-disc', 'brake-caliper', 'headlight-main', 'side-mirror', 'suspension-main', 'front-bumper', 'front-fender', 'car-seat', 'steering-assembly'];
const source = new URL('../public/images/parts/', import.meta.url);
const output = new URL('optimized/', source);
await mkdir(output, { recursive: true });
let previous = [];
try { previous = JSON.parse(await readFile(new URL('manifest.json', output), 'utf8')); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
const manifest = [];
for (const name of names) {
  const original = await readFile(new URL(`${name}.png`, source));
  const metadata = await sharp(original).metadata();
  if (!metadata.width || !metadata.height || !metadata.hasAlpha) throw new Error(`Expected transparent image: ${name}`);
  const sha256 = createHash('sha256').update(original).digest('hex');
  const cached = previous.find(entry => entry.name === name && entry.sha256 === sha256 && entry.width === metadata.width && entry.height === metadata.height);
  const derivatives = [];
  const widths = [...new Set([192, 384, 768, metadata.width].map(width => Math.min(width, metadata.width)))];
  for (const width of widths) {
    const target = new URL(`${name}-${width}.webp`, output);
    const existing = cached?.derivatives.find(derivative => derivative.width === width);
    if (existing) {
      try {
        const file = await stat(target);
        if (file.size === existing.bytes) { derivatives.push(existing); continue; }
      } catch (error) { if (error.code !== 'ENOENT') throw error; }
    }
    const bytes = await sharp(original).resize({ width, withoutEnlargement: true })
      .webp({ lossless: true, effort: 6 }).toBuffer();
    await writeFile(target, bytes);
    derivatives.push({ width, bytes: bytes.length });
  }
  manifest.push({ name, sha256, width: metadata.width, height: metadata.height, originalBytes: original.length, derivatives });
  console.log(`${name}: ${original.length} PNG bytes → ${derivatives.map(d => `${d.width}px/${d.bytes}B`).join(', ')}`);
}
await writeFile(new URL('manifest.json', output), JSON.stringify(manifest, null, 2) + '\n');

// Keep the protected studio and transparent sedan as separate layers.
const sedan = await readFile(new URL('exploded-sedan-components.png', source));
const sedanSmall = await sharp(sedan).resize({ width: 480, withoutEnlargement: true })
  .webp({ lossless: true, effort: 6 }).toBuffer();
await writeFile(new URL('exploded-sedan-components-480.webp', output), sedanSmall);
console.log(`exploded-sedan-components: ${sedan.length} PNG bytes → 480px/${sedanSmall.length}B`);
