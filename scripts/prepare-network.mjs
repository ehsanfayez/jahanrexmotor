import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
const directory = new URL('../public/images/network/optimized/', import.meta.url);
await fs.mkdir(directory, { recursive: true });
const manifest = [];
for (const name of ['rahavard-taklan', 'astroai', 'jahanrex', 'hyco']) {
  const source = new URL('../public/images/network/' + name + '.png', import.meta.url);
  const original = await fs.readFile(source);
  const derivatives = [];
  for (const width of [480, 768, 1024]) {
    const filename = name + '-' + width + '.webp';
    await sharp(original).resize({ width, withoutEnlargement: true }).webp({ quality: 85 }).toFile(fileURLToPath(new URL(filename, directory)));
    derivatives.push({ width, filename, bytes: (await fs.stat(new URL(filename, directory))).size });
  }
  manifest.push({ name, sourceSha256: crypto.createHash('sha256').update(original).digest('hex'), derivatives });
}
const logo = await fs.readFile(new URL('../public/images/brand/jahanrexan-logo.png', import.meta.url));
await sharp(logo).resize({ width: 384 }).webp({ quality: 90 }).toFile(fileURLToPath(new URL('jahanrexan-logo-384.webp', directory)));
await fs.writeFile(new URL('manifest.json', directory), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ preservedSources: manifest.length + 1, derivativeCount: 13, productBytes: manifest.flatMap(item => item.derivatives).reduce((total, item) => total + item.bytes, 0) }));
