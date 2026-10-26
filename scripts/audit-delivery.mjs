import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const excluded = new Set(['node_modules', 'dist', '.astro', '.git', '.delivery-check', '.cache', '.vite']);
const files = [], findings = [], machinePaths = [];
const patterns = [
  ['private-key', 'critical', /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
  ['provider-token', 'high', /(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|AKIA[A-Z0-9]{16}|ASIA[A-Z0-9]{16}|AIza[A-Za-z0-9_-]{30,}|xox[baprs]-[A-Za-z0-9-]{24,}|sk-(?:proj-)?[A-Za-z0-9_-]{24,})/],
  ['credential-url', 'high', /(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis|https?):\/\/[^/\s:@]+:[^@\s/]+@/],
  ['bearer-token', 'high', /Bearer\s+[A-Za-z0-9._-]{24,}/],
];
function category(file) {
  if (/^src\//.test(file)) return 'required-source';
  if (/^public\//.test(file)) return 'required-static-assets-or-notices';
  if (/^(package(?:-lock)?\.json|astro\.config\.mjs|tsconfig\.json|\.gitignore)$/.test(file)) return 'required-configuration';
  if (/^(README\.md|AGENTS\.md|docs\/[^/]+\.md|docs\/licenses\/)/.test(file)) return 'required-documentation';
  if (/^docs\/screenshots\//.test(file)) return 'qa-evidence-retain-review-delivery-scope';
  if (/^scripts\//.test(file)) return 'development-and-qa-tools';
  if (/^\.vscode\//.test(file)) return 'optional-shared-editor-configuration';
  return 'manual-review';
}
async function visit(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) { findings.push({ file: path.relative(root, absolute), type: 'symlink-review', severity: 'review' }); continue; }
    if (entry.isDirectory()) { await visit(absolute); continue; }
    const file = path.relative(root, absolute).replaceAll('\\', '/');
    const data = await fs.readFile(absolute);
    files.push({ file, bytes: data.length, category: category(file), sha256: crypto.createHash('sha256').update(data).digest('hex') });
    if (/^(?:\.env(?:\..*)?|\.npmrc|\.netrc)$/.test(entry.name) || /\.(?:pem|p12|pfx|key)$/.test(entry.name)) {
      findings.push({ file, type: 'sensitive-configuration-review', severity: 'review' });
    }
    if (!/\.(?:astro|[cm]?js|ts|json|md|txt|css|ya?ml|toml|ini|env|svg|html)$/.test(file) && !entry.name.startsWith('.env')) continue;
    const text = data.toString('utf8');
    for (const [index, line] of text.split(/\r?\n/).entries()) {
      for (const [type, severity, pattern] of patterns) {
        if (pattern.test(line)) findings.push({ file, line: index + 1, type, severity });
      }
      const assignment = line.match(/(?:api[_-]?key|access[_-]?token|client[_-]?secret|password|aws_secret_access_key)\s*[:=]\s*["']([^"'\r\n]{8,})["']/i);
      if (assignment && !/example|placeholder|your[_ -]|change[_-]?me|process\.env|import\.meta\.env|<[^>]+>/i.test(assignment[1])) findings.push({ file, line: index + 1, type: 'credential-assignment-review', severity: 'review' });
      if (/(?<![A-Za-z])[A-Za-z]:[\\/](?![\\/])/.test(line)) machinePaths.push({ file, line: index + 1 });
    }
  }
}
await visit(root);
const assetPaths = { checked: 0, failures: [] };
try {
  const html = await fs.readFile(path.join(root, 'dist/index.html'), 'utf8');
  const references = [...new Set([...html.matchAll(/\/(?:images|fonts|_astro)\/[^\s"<>]+?\.(?:png|webp|woff2|js|css)/g)].map(match => match[0]))];
  for (const reference of references) {
    assetPaths.checked++;
    let parent = path.join(root, 'dist');
    for (const segment of reference.slice(1).split('/')) {
      if (!(await fs.readdir(parent)).includes(segment)) { assetPaths.failures.push(reference); break; }
      parent = path.join(parent, segment);
    }
  }
} catch (error) { assetPaths.failures.push(`Production path check unavailable: ${error.code}`); }
const report = {
  scope: 'Local deliverable files; dependencies, build output, caches and isolated install excluded. Pattern scan is not a proof that no secret exists.',
  scannedFiles: files.length,
  findings,
  machinePaths,
  assetPaths,
  assets: files.filter(file => file.file.startsWith('public/')),
  largeFiles: files.filter(file => file.bytes >= 50 * 1024 ** 2),
  largestFiles: [...files].sort((a, b) => b.bytes - a.bytes).slice(0, 12),
  categories: Object.fromEntries([...new Set(files.map(file => file.category))].map(category => [category, { count: files.filter(file => file.category === category).length, bytes: files.filter(file => file.category === category).reduce((sum, file) => sum + file.bytes, 0) }])),
};
await fs.writeFile(path.join(root, 'docs/delivery-audit.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ scannedFiles: report.scannedFiles, findings, machinePathFiles: [...new Set(machinePaths.map(item => item.file))], largeFiles: report.largeFiles }, null, 2));
