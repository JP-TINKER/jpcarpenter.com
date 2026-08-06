#!/usr/bin/env node
/**
 * Generate the asciicast v2 `.cast` for the "Reading email authentication headers"
 * tutorial. Fully synthetic, redacted: neutral `$` prompt, the same spoofed domain used
 * in the published phishing lab (dalimnthefoob.co), no real hostnames/IPs/accounts.
 *
 * Output is line-delimited JSON: a header object, then [time, "o", data] events.
 * Run: node scripts/gen-email-auth-cast.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const out = 'src/content/tutorials/reading-email-headers/demo.cast';
mkdirSync(dirname(out), { recursive: true });

const header = {
  version: 2,
  width: 96,
  height: 22,
  timestamp: 1722975600,
  env: { SHELL: '/bin/bash', TERM: 'xterm-256color' },
};

// Each step: [text, holdSeconds]. Text is emitted as terminal output (incl. the `$ ` prompt
// + command), then we hold before the next so the reader can read it.
const steps = [
  ['$ # Reading email authentication headers — a walkthrough\r\n', 0.9],
  ['$ cat sample-header.txt\r\n', 0.25],
  [
    [
      'Authentication-Results: mx.outlook.com;',
      '    dkim=fail (no signature for key);',
      '    spf=fail (smtp.mailfrom=dalimnthefoob.co);',
      '    dmarc=fail (p=none - no policy published)',
      'Received-SPF: fail (dalimnthefoob.co: domain not designated as permitted sender)',
      'Return-Path: <alerts@dalimnthefoob.co>',
      'From: "Account Security" <alerts@dalimnthefoob.co>',
      '',
      '',
    ].join('\r\n'),
    1.6,
  ],
  ['$ # Three verdicts: SPF fail, DKIM fail, DMARC fail\r\n', 0.8],
  ['$ dig +short TXT dalimnthefoob.co\r\n', 0.25],
  ['(no SPF record published)\r\n\r\n', 1.0],
  ['$ dig +short TXT _dmarc.dalimnthefoob.co\r\n', 0.25],
  ['(no DMARC record published)\r\n\r\n', 1.2],
  ['$ # SPF fail + DKIM fail + no DMARC posture = unauthenticated domain\r\n', 0.8],
  ['$ # not a spoofed legitimate sender — an unauthenticated one\r\n', 0.8],
  ['$ # verdict: block or quarantine; reportable upstream\r\n', 0.8],
  ['$ ', 0.4],
];

let t = 0.3;
const events = [];
for (const [text, hold] of steps) {
  events.push([round(t), 'o', text]);
  t += hold;
}

const lines = [JSON.stringify(header), ...events.map((e) => JSON.stringify(e))];
writeFileSync(out, lines.join('\n') + '\n', 'utf8');
console.log(`wrote ${out} (${events.length} events, ${round(t)}s)`);

function round(n) {
  return Math.round(n * 1000) / 1000;
}
