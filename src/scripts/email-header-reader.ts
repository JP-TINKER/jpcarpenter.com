/** EMAIL HEADER READER Model 1, interactive instrument for the reading-email-headers
 *  tutorial. Parses a pasted email header locally and shows the SPF, DKIM, and
 *  DMARC verdicts in plain English. Nothing is transmitted; there is no server.
 *
 * Progressive: without JS the static SVG fallback stays visible (see
 * EmailHeaderReader.astro). With JS, the instrument comes alive and the
 * fallback is hidden.
 */

import { bindExplainDrawer } from './signal-explain';

type Verdict = 'pass' | 'fail' | 'none' | 'unknown';

interface ParsedHeader {
  spf: Verdict;
  dkim: Verdict;
  dmarc: Verdict;
  domain: string;
  hasAuthResults: boolean;
}

/** Normalize a raw verdict string from a header into one of four plain labels. */
function normalizeVerdict(raw: string): Verdict {
  const v = raw.toLowerCase();
  if (v === 'pass') return 'pass';
  if (v === 'fail' || v === 'softfail' || v === 'hardfail') return 'fail';
  if (v === 'none' || v === 'neutral' || v === 'policynone' || v === 'no-policy') return 'none';
  return 'unknown';
}

/** Unfold RFC 5322 header folding: lines beginning with whitespace continue the prior line. */
function unfold(lines: string[]): string[] {
  const out: string[] = [];
  for (const line of lines) {
    if (line.length > 0 && (line[0] === ' ' || line[0] === '\t') && out.length > 0) {
      out[out.length - 1] += ' ' + line.trim();
    } else {
      out.push(line);
    }
  }
  return out;
}

/** Pull `key=value` out of an Authentication-Results value. The value may carry a
 *  parenthetical reason like `spf=fail (smtp.mailfrom=example.co)`. */
function verdictFromAuthResults(value: string, key: string): Verdict | null {
  const probe = key + '=';
  const idx = value.toLowerCase().indexOf(probe);
  if (idx === -1) return null;
  let rest = value.slice(idx + probe.length);
  // read the token up to whitespace or '('
  let token = '';
  for (const ch of rest) {
    if (ch === ' ' || ch === '\t' || ch === '(' || ch === ';' || ch === '\r') break;
    token += ch;
  }
  if (!token) return null;
  return normalizeVerdict(token);
}

function domainFromEmail(s: string): string {
  // strip a leading '<' or whitespace
  let t = s.trim();
  if (t.startsWith('<')) t = t.slice(1);
  const at = t.indexOf('@');
  if (at === -1) return '';
  let d = t.slice(at + 1);
  const gt = d.indexOf('>');
  if (gt !== -1) d = d.slice(0, gt);
  const stop = d.search(/[\s);]/);
  if (stop !== -1) d = d.slice(0, stop);
  return d;
}

function extractDomain(lines: string[]): string {
  const joined = lines.join('\n');
  let lower = joined.toLowerCase();

  let idx = lower.indexOf('smtp.mailfrom=');
  if (idx !== -1) {
    const tail = joined.slice(idx + 'smtp.mailfrom='.length);
    const m = tail.match(/[a-z0-9][a-z0-9.-]+\.[a-z]{2,}/i);
    if (m) return m[0];
  }

  idx = lower.indexOf('return-path:');
  if (idx !== -1) {
    const line = joined.slice(idx, idx + 200);
    const lt = line.indexOf('<');
    if (lt !== -1) {
      const d = domainFromEmail(line.slice(lt));
      if (d) return d;
    }
  }

  idx = lower.indexOf('from:');
  if (idx !== -1) {
    const line = joined.slice(idx, idx + 200);
    const lt = line.indexOf('<');
    if (lt !== -1) {
      const d = domainFromEmail(line.slice(lt));
      if (d) return d;
    }
    const at = line.indexOf('@');
    if (at !== -1) {
      const d = domainFromEmail('@' + line.slice(at + 1));
      if (d) return d;
    }
  }

  return 'unknown domain';
}

function parseHeader(raw: string): ParsedHeader {
  const lines = unfold(raw.split(/\r?\n/));
  const result: ParsedHeader = {
    spf: 'unknown',
    dkim: 'unknown',
    dmarc: 'unknown',
    domain: extractDomain(lines),
    hasAuthResults: false,
  };

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.startsWith('authentication-results:')) {
      result.hasAuthResults = true;
      const value = line.slice('authentication-results:'.length);
      if (result.spf === 'unknown') {
        const v = verdictFromAuthResults(value, 'spf');
        if (v) result.spf = v;
      }
      if (result.dkim === 'unknown') {
        const v = verdictFromAuthResults(value, 'dkim');
        if (v) result.dkim = v;
      }
      if (result.dmarc === 'unknown') {
        const v = verdictFromAuthResults(value, 'dmarc');
        if (v) result.dmarc = v;
      }
    }
  }

  // Fallback: Received-SPF for SPF when Authentication-Results had none.
  if (result.spf === 'unknown') {
    for (const line of lines) {
      if (line.toLowerCase().startsWith('received-spf:')) {
        const v = line.slice('received-spf:'.length).trim().split(/[\s(]/)[0];
        if (v) result.spf = normalizeVerdict(v);
      }
    }
  }

  // DKIM-Signature presence means a signature was applied; verification is in
  // Authentication-Results. If we never saw a dkim verdict, mark none (no signature to check).
  if (result.dkim === 'unknown') {
    const hasSig = lines.some((l) => l.toLowerCase().startsWith('dkim-signature:'));
    if (hasSig) result.dkim = 'none';
  }

  return result;
}

/** The action line from the three verdicts combined (mirrors the tutorial's decision table,
 *  with an AI-era honesty fix: a clean auth pass means the mail came from the domain it
 * claims, not that it is safe). */
function actionFor(h: ParsedHeader): string {
  const { spf, dkim, dmarc } = h;
  if (spf === 'fail' && dkim === 'fail' && (dmarc === 'none' || dmarc === 'fail')) {
    if (dmarc === 'none') return 'Unauthenticated domain: block or quarantine.';
    return 'Spoofed defended domain: block, and it is a reportable event.';
  }
  if (spf === 'pass' && dkim === 'pass' && dmarc === 'pass') {
    return 'Authenticated to this domain. That means it came from there, not that it is safe. For money or credentials, confirm out-of-band.';
  }
  if (spf === 'pass' && dkim === 'pass' && dmarc === 'none') {
    return 'Signed and allowed by SPF, but the domain publishes no DMARC rule. Confirm the sender another way.';
  }
  if (spf === 'unknown' && dkim === 'unknown' && dmarc === 'unknown') {
    return 'No Authentication-Results line found. Check the raw header includes it.';
  }
  return 'Mixed verdicts: read the three rows, then confirm the domain with dig.';
}

function verdictClass(v: Verdict): string {
  return `email-verdict-val email-verdict--${v}`;
}

function setText(el: Element | null, text: string): void {
  if (el) el.textContent = text;
}

export function initEmailHeaderReader(): void {
  const root = document.getElementById('emailReaderRoot');
  const fallback = document.getElementById('emailFallback');
  if (!root) return;

  // Progressive enhancement: show the instrument, hide the static fallback.
  root.classList.add('is-live');
  if (fallback) fallback.classList.add('is-hidden');

  const input = document.getElementById('emailHeaderInput') as HTMLTextAreaElement | null;
  const readBtn = document.getElementById('emailReadBtn');
  const spfVal = document.getElementById('emailSpfVal');
  const dkimVal = document.getElementById('emailDkimVal');
  const dmarcVal = document.getElementById('emailDmarcVal');
  const domainEl = document.getElementById('emailDomain');
  const actionEl = document.getElementById('emailAction');
  const drawer = document.getElementById('emailDrawer');
  const titleEl = document.getElementById('emailDrawerTitle');
  const whatEl = document.getElementById('emailDrawerWhat');
  const howEl = document.getElementById('emailDrawerHow');
  const meansEl = document.getElementById('emailDrawerMeans');
  const closeBtn = document.getElementById('emailDrawerClose');

  if (drawer && titleEl && whatEl && howEl && meansEl && closeBtn) {
    const drawerApi = bindExplainDrawer({
      root,
      drawer,
      titleEl,
      whatEl,
      howEl,
      meansEl,
      closeBtn,
      direction: 'down',
    });
    root.querySelectorAll<HTMLElement>('[data-explain]').forEach((el) => {
      el.addEventListener('click', () => {
        const key = el.getAttribute('data-explain');
        if (key) drawerApi.open(key);
      });
    });
  }

  function render(h: ParsedHeader): void {
    setText(spfVal, h.spf);
    if (spfVal) spfVal.className = verdictClass(h.spf);
    setText(dkimVal, h.dkim);
    if (dkimVal) dkimVal.className = verdictClass(h.dkim);
    setText(dmarcVal, h.dmarc);
    if (dmarcVal) dmarcVal.className = verdictClass(h.dmarc);
    setText(domainEl, h.domain);
    setText(actionEl, actionFor(h));
  }

  function clearRender(): void {
    setText(spfVal, '-');
    setText(dkimVal, '-');
    setText(dmarcVal, '-');
    setText(domainEl, '-');
    setText(actionEl, 'Paste a header and tap Read it.');
  }

  if (readBtn && input) {
    readBtn.addEventListener('click', () => {
      const raw = input.value.trim();
      if (!raw) {
        clearRender();
        setText(actionEl, 'Paste a header first.');
        return;
      }
      render(parseHeader(raw));
    });
  }

  // If a sample is pre-loaded in the markup (the worked phishing header), read it
  // immediately so the page opens with the verdicts already shown.
  if (input && input.value.trim()) {
    render(parseHeader(input.value.trim()));
  } else {
    clearRender();
  }
}
