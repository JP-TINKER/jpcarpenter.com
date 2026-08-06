#!/usr/bin/env node
/**
 * Render a tutorial's `.cast` to a CSP-clean animated SVG and inject a
 * `prefers-reduced-motion` guard (svg-term-cli v2.x doesn't add one).
 *
 * The guard freezes the animation on its first frame for readers who request reduced
 * motion. The full command text is also written out in the tutorial body, so a frozen
 * poster plus the body copy is an honest fallback — no information is lost.
 *
 * Usage:
 *   node scripts/render-tutorial-svg.mjs <slug>
 *   node scripts/render-tutorial-svg.mjs reading-email-headers
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: node scripts/render-tutorial-svg.mjs <slug>');
  process.exit(1);
}

const cast = `src/content/tutorials/${slug}/demo.cast`;
const svg = `public/tutorials/${slug}/demo.svg`;

if (!existsSync(cast)) {
  console.error(`Cast not found: ${cast}`);
  process.exit(1);
}

const bin = 'node_modules/.bin/svg-term';
// No --window: that flag stamps a macOS title bar with red/yellow/green traffic-light
// dots. Joe is on Linux; render a clean, chrome-less dark terminal instead.
execFileSync(bin, ['--in', cast, '--out', svg, '--padding', '12'], {
  stdio: 'inherit',
});

let out = readFileSync(svg, 'utf8');

const guard =
  '@media (prefers-reduced-motion:reduce){[style*="animation-name"]{animation:none!important}}';

if (!out.includes('prefers-reduced-motion')) {
  out = out.replace('<style>', '<style>' + guard);
}

writeFileSync(svg, out, 'utf8');
console.log(`rendered ${svg} (${out.length} bytes, reduced-motion guard injected)`);
