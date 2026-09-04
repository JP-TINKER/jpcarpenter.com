#!/usr/bin/env node
/**
 * Fail CI if live (or TARGET) security headers drift from the pinned checklist.
 * Catches header drift — not a full ZAP / XSS suite.
 *
 * Usage:
 *   node scripts/headers-ci.mjs
 *   TARGET=https://jpcarpenter.com node scripts/headers-ci.mjs
 */
const TARGET = (process.env.TARGET || 'https://jpcarpenter.com').replace(/\/$/, '');

/** Required header → predicate (name is lowercased for lookup). */
const CHECKS = [
  {
    name: 'strict-transport-security',
    ok: (v) => {
      const m = v.match(/max-age\s*=\s*(\d+)/i);
      return (
        !!m &&
        Number(m[1]) >= 31536000 &&
        /includesubdomains/i.test(v) &&
        /preload/i.test(v)
      );
    },
    expect: 'max-age≥31536000; includeSubDomains; preload',
  },
  {
    name: 'x-content-type-options',
    ok: (v) => v.trim().toLowerCase() === 'nosniff',
    expect: 'nosniff',
  },
  {
    name: 'x-frame-options',
    ok: (v) => v.trim().toUpperCase() === 'DENY',
    expect: 'DENY',
  },
  {
    name: 'content-security-policy',
    ok: (v) =>
      /script-src[^;]*'self'/i.test(v) &&
      !/'unsafe-inline'/.test(v) &&
      /frame-ancestors\s+'none'/i.test(v) &&
      /form-action\s+'none'/i.test(v) &&
      /require-trusted-types-for\s+'script'/i.test(v),
    expect: "script-src 'self'; no unsafe-inline; frame-ancestors 'none'; Trusted Types",
  },
  {
    name: 'cross-origin-opener-policy',
    ok: (v) => /same-origin/i.test(v),
    expect: 'same-origin',
  },
  {
    name: 'cross-origin-resource-policy',
    ok: (v) => /same-origin/i.test(v),
    expect: 'same-origin',
  },
  {
    name: 'referrer-policy',
    ok: (v) => /strict-origin-when-cross-origin/i.test(v) || /no-referrer/i.test(v),
    expect: 'strict-origin-when-cross-origin (or stricter)',
  },
  {
    name: 'permissions-policy',
    ok: (v) => /camera=\(\)/i.test(v) && /microphone=\(\)/i.test(v) && /geolocation=\(\)/i.test(v),
    expect: 'camera/mic/geo disabled',
  },
];

async function checkPath(path) {
  const res = await fetch(TARGET + path, { method: 'HEAD', redirect: 'follow' });
  const headers = Object.fromEntries(
    [...res.headers.entries()].map(([k, v]) => [k.toLowerCase(), v]),
  );

  let failed = 0;
  console.log(`headers-ci: ${TARGET}${path}  HTTP ${res.status}`);
  for (const check of CHECKS) {
    const value = headers[check.name];
    if (!value) {
      console.error(`FAIL  ${path} missing ${check.name} (want: ${check.expect})`);
      failed++;
      continue;
    }
    if (!check.ok(value)) {
      console.error(`FAIL  ${path} ${check.name}: ${value}`);
      console.error(`      want: ${check.expect}`);
      failed++;
    } else {
      console.log(`ok    ${path} ${check.name}`);
    }
  }
  return failed;
}

async function main() {
  // Live origin only — catches production drift; does not gate deploy rsync.
  let failed = 0;
  for (const path of ['/', '/security']) {
    failed += await checkPath(path);
  }

  if (failed) {
    console.error(`\nheaders-ci: ${failed} check(s) failed (header drift).`);
    process.exit(1);
  }
  console.log('\nheaders-ci: all required headers present.');
}

main().catch((err) => {
  console.error('headers-ci: fetch failed', err);
  process.exit(1);
});
