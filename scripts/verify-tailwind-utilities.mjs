import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import postcss from 'postcss';

const root = fileURLToPath(new URL('../', import.meta.url));
const fixture = path.join(root, 'src/pages/tailwind-verification.astro');
const evidence = path.join(root, 'docs/screenshots/phase-5-5');
const astroPackage = JSON.parse(await fs.readFile(path.join(root, 'node_modules/astro/package.json'), 'utf8'));
const astro = path.resolve(root, 'node_modules/astro', astroPackage.bin.astro);
function build() {
  const result = spawnSync(process.execPath, [astro, 'build'], { cwd: root, stdio: 'inherit' });
  if (result.status !== 0) throw new Error('Astro build failed');
}
async function compiledCss() {
  const directory = path.join(root, 'dist/_astro');
  const external = await Promise.all((await fs.readdir(directory)).filter(f => f.endsWith('.css')).map(f => fs.readFile(path.join(directory,f),'utf8')));
  // Astro inlines small page-specific stylesheets; include the fixture's styles.
  const html = await fs.readFile(path.join(root,'dist/tailwind-verification/index.html'),'utf8');
  const inline = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(match => match[1]);
  return [...external,...inline].join('\n');
}

if (await fs.access(fixture).then(() => true, () => false)) throw new Error('Refusing to overwrite an existing fixture');
let created = false;
try {
  await fs.writeFile(fixture, `---
import '../tailwind.css';
---
<!doctype html><html><head><title>Temporary utility verification</title></head><body>
<div class="tw:grid tw:gap-4 tw:p-4 tw:text-red-500 tw:md:flex tw:hover:bg-blue-500">Isolated build fixture</div>
</body></html>\n`);
  created = true;
  build();
  const css = await compiledCss();
  const ast = postcss.parse(css);
  const rules = [];
  ast.walkRules(rule => rules.push({ selector: rule.selector, declarations: rule.nodes.filter(n => n.type === 'decl').map(n => [n.prop,n.value]) }));
  const has = (selector, property, value) => rules.some(rule => rule.selector.includes(selector) && rule.declarations.some(([p,v]) => p === property && (value === undefined || v === value)));
  const checks = {
    grid: has('.tw\\:grid','display','grid'),
    padding: has('.tw\\:p-4','padding'),
    spacing: has('.tw\\:gap-4','gap'),
    color: has('.tw\\:text-red-500','color','var(--tw-color-red-500)'),
    responsive: has('.tw\\:md\\:flex','display','flex') && /@media[^{}]*48rem/.test(css),
    hover: has('.tw\\:hover\\:bg-blue-500','background-color','var(--tw-color-blue-500)'),
    namespacedTheme: css.includes('--tw-spacing') && css.includes('--tw-color-red-500'),
  };
  await fs.mkdir(evidence,{recursive:true});
  await fs.writeFile(path.join(evidence,'utility-fixture.css'),css);
  await fs.writeFile(path.join(evidence,'utility-verification.json'),JSON.stringify({checks,rules:rules.filter(r => r.selector.includes('.tw\\:'))},null,2));
  if (Object.values(checks).some(v => !v)) throw new Error(`Utility verification failed: ${JSON.stringify(checks)}`);
  console.log('Prefixed utility, responsive, hover and theme checks passed.');
} finally {
  if (created) await fs.unlink(fixture);
  // Always finish with the real production site, without the temporary route.
  build();
}
const html = await fs.readFile(path.join(root,'dist/index.html'),'utf8');
if (html.includes('Isolated build fixture') || await fs.access(path.join(root,'dist/tailwind-verification/index.html')).then(() => true, () => false)) throw new Error('Temporary fixture leaked into production');
console.log('Temporary fixture removed; final production build contains only the real site.');
