#!/usr/bin/env node
/**
 * Ship gate: static probe of dist/ before deploy. Dependency-free on purpose — the
 * previous browser-driven gate rotted out of the repo, and a check nobody can run is
 * the same as no check.
 *
 * Catches the two classes of bug that actually reached production:
 *   1. A Trusted Types sink in shipped JS. The site serves
 *      `require-trusted-types-for 'script'`, so an innerHTML assignment does not
 *      degrade — it throws, and the feature is silently dead for every visitor.
 *   2. Internal working files copied into the web root, because everything under
 *      public/ ships verbatim.
 *
 * Exits non-zero on any finding so `npm run deploy` can depend on it.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');

if (!existsSync(dist)) {
  console.error('FAIL: no dist/ — run `npm run build` first');
  process.exit(1);
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const files = walk(dist);
const rel = (p) => relative(dist, p);
const problems = [];
const fail = (rule, detail) => problems.push({ rule, detail });

const html = files.filter((f) => extname(f) === '.html');
const js = files.filter((f) => extname(f) === '.js');

// 1. Trusted Types sinks in shipped JS.
const SINKS = [
  [/\.innerHTML\s*=/, 'innerHTML assignment'],
  [/\.outerHTML\s*=/, 'outerHTML assignment'],
  [/insertAdjacentHTML/, 'insertAdjacentHTML'],
  [/document\.write\s*\(/, 'document.write'],
  [/\beval\s*\(/, 'eval'],
  [/new Function\s*\(/, 'new Function'],
];
for (const f of js) {
  const src = readFileSync(f, 'utf8');
  for (const [re, label] of SINKS) {
    if (re.test(src)) {
      fail('trusted-types', `${rel(f)}: ${label} — throws under require-trusted-types-for 'script'`);
    }
  }
}

// 2. Inline style/script and data: URIs — the no-'unsafe-inline' CSP depends on this.
for (const f of html) {
  const src = readFileSync(f, 'utf8');
  if (/<style[\s>]/.test(src)) fail('inline-style', `${rel(f)}: inline <style> block`);
  for (const m of src.matchAll(/<script(?![^>]*\bsrc=)[^>]*>/g)) {
    fail('inline-script', `${rel(f)}: inline <script> (${m[0].slice(0, 60)})`);
  }
  if (/["'(]data:/.test(src)) fail('data-uri', `${rel(f)}: data: URI`);
}

// 3. Internal working material that must not reach the web root.
const LEAKS = [
  [/(^|\/)(PLAN|LOCK|SAMPLER|NOTES|TODO|HANDOFF)\.md$/i, 'internal design/planning note'],
  [/(^|\/)README\.md$/i, 'README in web root'],
  [/\.(py|sh|mjs|ts|map)$/i, 'source or build script'],
  [/(^|\/)(sampler|drafts?|wip|scratch|_archive)\//i, 'working directory'],
  [/(^|\/)__pycache__\//, 'python cache'],
  [/\.(bak|orig|swp|tmp)$/i, 'editor/backup artifact'],
  [/(^|\/)\.env/, 'env file'],
];
for (const f of files) {
  const r = rel(f);
  for (const [re, label] of LEAKS) {
    if (re.test(r)) fail('web-root-leak', `${r}: ${label}`);
  }
}

// 4. Legacy admin/CMS paths from the old Ghost origin.
for (const f of files) {
  const r = rel(f);
  if (/(^|\/)(ghost|admin|wp-admin|wp-login|\.git)(\/|$)/i.test(r)) {
    fail('legacy-admin', `${r}: legacy admin path shipped`);
  }
}

// 5. Credential-shaped strings in anything text-like.
const SECRETS = [
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key'],
  [/\bssh-rsa\s+AAAA/, 'ssh public key'],
  [/\b(?:api[_-]?key|secret|passwd|password)\s*[:=]\s*["'][^"']{8,}/i, 'credential assignment'],
  [/\bBearer\s+[A-Za-z0-9._-]{20,}/, 'bearer token'],
];
const TEXTY = new Set(['.html', '.js', '.css', '.txt', '.md', '.json', '.xml', '.csv']);
for (const f of files.filter((f) => TEXTY.has(extname(f)))) {
  const src = readFileSync(f, 'utf8');
  for (const [re, label] of SECRETS) {
    if (re.test(src)) fail('secret', `${rel(f)}: possible ${label}`);
  }
}

// Report.
const byRule = new Map();
for (const p of problems) {
  if (!byRule.has(p.rule)) byRule.set(p.rule, []);
  byRule.get(p.rule).push(p.detail);
}

console.log(`probe-paths: ${html.length} pages, ${js.length} scripts, ${files.length} files in dist/`);
if (!problems.length) {
  console.log('probe-paths: clean (0 problems)');
  process.exit(0);
}
for (const [rule, details] of byRule) {
  console.error(`\n${rule} (${details.length}):`);
  for (const d of details) console.error(`  - ${d}`);
}
console.error(`\nprobe-paths: ${problems.length} problem(s)`);
process.exit(1);
