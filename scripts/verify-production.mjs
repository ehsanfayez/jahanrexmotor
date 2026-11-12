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
for (const [file, lang, dir] of [['dist/index.html', 'fa', 'rtl'], ['dist/en/index.html', 'en', 'ltr']]) {
  const page = await fs.readFile(file, 'utf8');
  if (!page.includes(`<html lang="${lang}" dir="${dir}">`)) throw new Error(`Invalid locale: ${file}`);
  const phones = [...page.matchAll(/href="(tel:[^"]+)"/g)].map(match => match[1]);
  const expected = ['tel:09373020024', 'tel:09373020024', 'tel:09373020024', 'tel:09373020024', 'tel:09373020029', 'tel:02133981738'];
  if (JSON.stringify(phones.sort()) !== JSON.stringify(expected.sort()) || page.includes('09373020028')) throw new Error(`Invalid approved contacts: ${file}`);
  if (page.includes('design-references') || page.includes('production-audit')) throw new Error(`Development artifact: ${file}`);
  const text = page.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, '');
  if (lang === 'en' && /[\u0600-\u06ff]/.test(text)) throw new Error('Untranslated English content');
  for (const domain of ['https://jahanrex.com/', 'https://rahavardtaklan.ir/', 'https://astroai.ir/']) {
    if (page.split(`href="${domain}"`).length !== 2) throw new Error(`Missing company links: ${domain}`);
  }
}
console.log(`Verified both locales, ${references.length} production asset paths, ${manifest.length} preserved originals and their responsive derivatives, approved phone links, and clean uninstrumented HTML.`);
