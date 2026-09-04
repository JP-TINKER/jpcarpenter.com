#!/usr/bin/env node
/**
 * spec-w3-02: drawer motion stays in external CSS; CSP file strength unchanged.
 * Also greps built HTML for inline style/script (Trusted Types / no unsafe-inline).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const headersPath = join(root, 'public/_headers');

const headers = readFileSync(headersPath, 'utf8');
const csp = [...headers.matchAll(/Content-Security-Policy:\s*(.+)/g)].map((m) => m[1]);
if (!csp.length) {
  console.error('FAIL spec-w3-02: no Content-Security-Policy in public/_headers');
  process.exit(1);
}
for (const policy of csp) {
  if (policy.includes("'unsafe-inline'")) {
    console.error('FAIL spec-w3-02: unsafe-inline in CSP');
    process.exit(1);
  }
  if (!policy.includes("script-src 'self'") || !policy.includes("style-src 'self'")) {
    console.error('FAIL spec-w3-02: script-src/style-src self missing');
    process.exit(1);
  }
  if (!policy.includes("require-trusted-types-for 'script'")) {
    console.error('FAIL spec-w3-02: Trusted Types missing');
    process.exit(1);
  }
}

const htmlFiles = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (extname(p) === '.html') htmlFiles.push(p);
  }
}
walk(dist);

const inlineStyle = /<style[\s>]/i;
const inlineScript = /<script(?![^>]*\bsrc=)[^>]*>/i;
let bad = 0;
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  if (inlineStyle.test(html)) {
    console.error(`FAIL spec-w3-02: inline <style> in ${file}`);
    bad++;
  }
  if (inlineScript.test(html)) {
    console.error(`FAIL spec-w3-02: inline <script> in ${file}`);
    bad++;
  }
}
if (!htmlFiles.length) {
  console.error('FAIL: dist has no HTML — run npm run build first');
  process.exit(1);
}
if (bad) process.exit(1);

const sample = readFileSync(htmlFiles[0], 'utf8');
if (!sample.includes('>Menu<') || !sample.includes('>Close<')) {
  console.error('FAIL: Menu/Close labels missing from built HTML');
  process.exit(1);
}
if (!sample.includes('Site security')) {
  console.error('FAIL: Site security label missing');
  process.exit(1);
}

console.log(`ok spec-w3-02 — ${htmlFiles.length} html, CSP self, no inline style/script`);
