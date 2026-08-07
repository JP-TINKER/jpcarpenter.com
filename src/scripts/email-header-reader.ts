/** EMAIL HEADER READER Model 1, interactive instrument for the reading-email-headers
 *  tutorial. Renders the pasted (or sample) header as a line-by-line view,
 * parses the three authentication verdicts, and shows each explanation
 * directly under its row (a <details> per verdict). Opening a row
 * highlights the matching line(s) in the header so the reader learns what
 * to look for. Nothing is transmitted; there is no server.
 */

type Verdict = 'pass' | 'fail' | 'none' | 'unknown';

interface ParsedHeader {
  spf: Verdict;
  dkim: Verdict;
  dmarc: Verdict;
  domain: string;
  hasAuthResults: boolean;
}

type LineKind = 'auth-results' | 'received-spf' | 'dkim-sig' | 'from' | 'return-path' | 'subject' | 'other';

interface HeaderLine {
  text: string;
  kind: LineKind;
}

function normalizeVerdict(raw: string): Verdict {
  const v = raw.toLowerCase();
  if (v === 'pass') return 'pass';
  if (v === 'fail' || v === 'softfail' || v === 'hardfail') return 'fail';
  if (v === 'none' || v === 'neutral' || v === 'policynone' || v === 'no-policy') return 'none';
  return 'unknown';
}

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

function verdictFromAuthResults(value: string, key: string): { verdict: Verdict | null; reason: string } | null {
  const probe = key + '=';
  const idx = value.toLowerCase().indexOf(probe);
  if (idx === -1) return null;
  const rest = value.slice(idx + probe.length);
  let token = '';
  let reason = '';
  let inParen = false;
  for (const ch of rest) {
    if (!inParen && (ch === ' ' || ch === '\t' || ch === ';' || ch === '\r')) break;
    if (ch === '(') { inParen = true; reason += ch; continue; }
    if (ch === ')') { inParen = false; reason += ch; continue; }
    if (inParen) reason += ch;
    else token += ch;
  }
  if (!token) return null;
  return { verdict: normalizeVerdict(token), reason };
}

function domainFromEmail(s: string): string {
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
  const lower = joined.toLowerCase();
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

function classifyLine(text: string): LineKind {
  const lower = text.toLowerCase();
  if (lower.startsWith('authentication-results:')) return 'auth-results';
  if (lower.startsWith('received-spf:')) return 'received-spf';
  if (lower.startsWith('dkim-signature:')) return 'dkim-sig';
  if (lower.startsWith('from:')) return 'from';
  if (lower.startsWith('return-path:')) return 'return-path';
  if (lower.startsWith('subject:')) return 'subject';
  return 'other';
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
    if (line.toLowerCase().startsWith('authentication-results:')) {
      result.hasAuthResults = true;
      const value = line.slice('authentication-results:'.length);
      if (result.spf === 'unknown') { const r = verdictFromAuthResults(value, 'spf'); if (r?.verdict) result.spf = r.verdict; }
      if (result.dkim === 'unknown') { const r = verdictFromAuthResults(value, 'dkim'); if (r?.verdict) result.dkim = r.verdict; }
      if (result.dmarc === 'unknown') {
        const r = verdictFromAuthResults(value, 'dmarc');
        if (r?.verdict) {
          // dmarc=fail with a "no policy" / "p=none" reason means the domain
          // published no DMARC rule to break. That is the "unauthenticated
          // domain" case, not the "spoofed defended domain" case.
          if (r.verdict === 'fail' && (/no policy/i.test(r.reason) || /p=none/i.test(r.reason))) {
            result.dmarc = 'none';
          } else {
            result.dmarc = r.verdict;
          }
        }
      }
    }
  }
  if (result.spf === 'unknown') {
    for (const line of lines) {
      if (line.toLowerCase().startsWith('received-spf:')) {
        const v = line.slice('received-spf:'.length).trim().split(/[\s(]/)[0];
        if (v) result.spf = normalizeVerdict(v);
      }
    }
  }
  if (result.dkim === 'unknown') {
    const hasSig = lines.some((l) => l.toLowerCase().startsWith('dkim-signature:'));
    if (hasSig) result.dkim = 'none';
  }
  return result;
}

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

/** Lines a given verdict row should highlight in the header view. */
const HIGHLIGHT: Record<'spf' | 'dkim' | 'dmarc', LineKind[]> = {
  spf: ['auth-results', 'received-spf'],
  dkim: ['auth-results', 'dkim-sig'],
  dmarc: ['auth-results'],
};

export function initEmailHeaderReader(): void {
  const root = document.getElementById('emailReaderRoot');
  const fallback = document.getElementById('emailFallback');
  if (!root) return;
  root.classList.add('is-live');
  if (fallback) fallback.classList.add('is-hidden');

  const pre = document.getElementById('emailHeaderPre');
  const view = document.getElementById('emailHeaderView');
  const input = document.getElementById('emailHeaderInput') as HTMLTextAreaElement | null;
  const pasteBtn = document.getElementById('emailPasteToggle');
  const readBtn = document.getElementById('emailReadBtn');
  const spfVal = document.getElementById('emailSpfVal');
  const dkimVal = document.getElementById('emailDkimVal');
  const dmarcVal = document.getElementById('emailDmarcVal');
  const domainEl = document.getElementById('emailDomain');
  const actionEl = document.getElementById('emailAction');
  const spfRow = document.getElementById('emailSpfRow');
  const dkimRow = document.getElementById('emailDkimRow');
  const dmarcRow = document.getElementById('emailDmarcRow');

  let rawHeader = input?.value ?? '';

  /** Render the raw header into the <pre> as one span per line, tagged by kind. */
  function renderHeader(raw: string): void {
    if (!pre) return;
    pre.textContent = '';
    const lines = raw.split(/\r?\n/);
    for (const line of lines) {
      const span = document.createElement('span');
      span.className = 'email-header-line';
      span.dataset.line = classifyLine(line);
      span.textContent = line === '' ? ' ' : line;
      pre.appendChild(span);
      if (line !== lines[lines.length - 1]) {
        pre.appendChild(document.createTextNode('\n'));
      }
    }
  }

  function clearHighlight(): void {
    root?.querySelectorAll('.email-header-line.is-hit').forEach((el) => el.classList.remove('is-hit'));
  }

  function highlightFor(kind: 'spf' | 'dkim' | 'dmarc'): void {
    clearHighlight();
    const wanted = HIGHLIGHT[kind];
    root?.querySelectorAll('.email-header-line').forEach((el) => {
      const lineKind = el.getAttribute('data-line');
      if (lineKind && wanted.includes(lineKind as LineKind)) el.classList.add('is-hit');
    });
  }

  function render(h: ParsedHeader): void {
    setText(spfVal, h.spf); if (spfVal) spfVal.className = verdictClass(h.spf);
    setText(dkimVal, h.dkim); if (dkimVal) dkimVal.className = verdictClass(h.dkim);
    setText(dmarcVal, h.dmarc); if (dmarcVal) dmarcVal.className = verdictClass(h.dmarc);
    setText(domainEl, h.domain);
    setText(actionEl, actionFor(h));
  }

  function clearRender(): void {
    setText(spfVal, '-');
    setText(dkimVal, '-');
    setText(dmarcVal, '-');
    setText(domainEl, '-');
    setText(actionEl, 'Tap Read it to read the loaded sample, or clear it and paste your own.');
  }

  function readCurrent(): void {
    const raw = rawHeader.trim();
    if (!raw) { clearRender(); setText(actionEl, 'Paste a header first.'); return; }
    const parsed = parseHeader(raw);
    render(parsed);
    renderHeader(raw);
    if (view && input) { view.classList.remove('is-paste'); input.classList.add('is-paste'); }
    if (pasteBtn) pasteBtn.textContent = 'Paste your own';
    clearHighlight();
  }

  // Toggle between the rendered view and a paste textarea.
  if (pasteBtn && view && input) {
    pasteBtn.addEventListener('click', () => {
      if (view.classList.contains('is-paste')) {
        // Currently in paste mode -> switch back to rendered view.
        view.classList.remove('is-paste');
        input.classList.add('is-paste');
        pasteBtn.textContent = 'Paste your own';
        renderHeader(rawHeader);
        clearHighlight();
      } else {
        // Currently rendered -> switch to paste textarea.
        view.classList.add('is-paste');
        input.classList.remove('is-paste');
        pasteBtn.textContent = 'Show rendered';
        if (input) input.value = rawHeader;
        input.focus();
      }
    });
  }

  if (readBtn) {
    readBtn.addEventListener('click', () => {
      if (input && !view?.classList.contains('is-paste')) {
        rawHeader = input.value;
      }
      readCurrent();
    });
  }

  // Opening a verdict row highlights the matching line(s); closing clears.
  const wireRow = (row: Element | null, kind: 'spf' | 'dkim' | 'dmarc'): void => {
    if (!row) return;
    row.addEventListener('toggle', () => {
      if (row instanceof HTMLDetailsElement && row.open) highlightFor(kind);
      else clearHighlight();
    });
  };
  wireRow(spfRow, 'spf');
  wireRow(dkimRow, 'dkim');
  wireRow(dmarcRow, 'dmarc');

  readCurrent();
}
