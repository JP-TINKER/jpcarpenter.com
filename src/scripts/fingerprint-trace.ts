/** FINGERPRINT TRACE Model 1, a real, working demonstration of browser fingerprinting,
 *  run only against the visitor viewing it. Canvas, WebGL, Audio, font enumeration, and
 *  math-engine probes are genuine techniques used by real fingerprinting libraries; the
 *  composite hash they produce is stored in this browser's localStorage (nothing else,
 *  nowhere else) so a repeat visit to THIS site can be recognized without a cookie.
 *  Nothing computed here is ever sent over the network. A "Forget me" control clears it.
 */

import { getPassiveSignalParts, getRawSignalString } from './browser-signals';
import { getSignalExplain } from './signal-explain';

const STORAGE_KEY = 'bench-fingerprint-demo';
const BLOCKED_LABEL = 'blocked by this browser (a good sign)';

interface RevisitStatus {
  message: string;
}

interface StoredRecord {
  id: string;
  firstSeen: string;
}

/** Small, fast, non-cryptographic string hash (FNV-1a, 32-bit). The point is a stable,
 *  deterministic fingerprint for demo purposes, not collision-resistance. */
function fnv1a(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function shortHash(str: string): string {
  const h1 = fnv1a(str);
  const h2 = fnv1a(str + h1.toString(16));
  const h3 = fnv1a(str + h2.toString(16));
  const seg = (n: number) => n.toString(16).toUpperCase().padStart(8, '0').slice(0, 4);
  return `${seg(h1)}-${seg(h2)}-${seg(h3)}`;
}

function computeCanvasFingerprint(): string | null {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.textBaseline = 'top';
    // Naming a font the site does not ship is deliberate here: the fallback the browser
    // picks is itself part of what canvas fingerprinting measures. Changing this string
    // changes every stored composite hash, so leave it alone.
    ctx.font = '14px "Space Mono", monospace';
    ctx.fillStyle = '#5aaa60';
    ctx.fillText('bench fingerprint / 0123 !@#$', 2, 2);
    ctx.strokeStyle = 'rgba(90,170,96,0.5)';
    ctx.beginPath();
    ctx.arc(200, 20, 12, 0, Math.PI * 1.5);
    ctx.stroke();
    const dataUrl = canvas.toDataURL();
    if (!dataUrl || dataUrl.length < 32) return null;
    return shortHash(dataUrl);
  } catch {
    return null;
  }
}

function computeWebglFingerprint(): { vendor: string; renderer: string } | null {
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return null;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (!ext) return null;
    const vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) as string;
    const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string;
    if (!vendor || !renderer) return null;
    return { vendor, renderer };
  } catch {
    return null;
  }
}

function computeAudioFingerprint(): Promise<number | null> {
  return new Promise((resolve) => {
    try {
      const OfflineCtx =
        window.OfflineAudioContext ||
        (window as unknown as { webkitOfflineAudioContext?: typeof OfflineAudioContext })
          .webkitOfflineAudioContext;
      if (!OfflineCtx) {
        resolve(null);
        return;
      }
      const ctx = new OfflineCtx(1, 5000, 44100);
      const oscillator = ctx.createOscillator();
      oscillator.type = 'triangle';
      oscillator.frequency.value = 10000;

      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -50;
      compressor.knee.value = 40;
      compressor.ratio.value = 12;
      compressor.attack.value = 0;
      compressor.release.value = 0.25;

      oscillator.connect(compressor);
      compressor.connect(ctx.destination);
      oscillator.start(0);

      const timeout = setTimeout(() => resolve(null), 1500);

      ctx.oncomplete = (e: OfflineAudioCompletionEvent) => {
        clearTimeout(timeout);
        try {
          const output = e.renderedBuffer.getChannelData(0);
          let sum = 0;
          for (let i = 4500; i < output.length; i++) {
            sum += Math.abs(output[i]);
          }
          resolve(sum);
        } catch {
          resolve(null);
        }
      };
      ctx.startRendering();
    } catch {
      resolve(null);
    }
  });
}

/** Width-based font presence check (Lalit Patel / FingerprintJS pattern). Subset of
 *  distinctive fonts only: enough entropy for the demo, short enough to finish on load. */
function computeFontFingerprint(): { count: number; hash: string } | null {
  try {
    const testString = 'mmMwWLliI0O&1';
    const baseFonts = ['monospace', 'sans-serif', 'serif'] as const;
    const candidates = [
      'Arial Unicode MS',
      'Calibri',
      'Century Gothic',
      'Franklin Gothic',
      'Gill Sans',
      'Helvetica Neue',
      'Lucida Sans',
      'Menlo',
      'MS Mincho',
      'Meiryo UI',
      'Monotype Corsiva',
      'PMingLiU',
      'Segoe UI Light',
      'SimHei',
      'Futura Md BT',
      'Agency FB',
      'Bitstream Vera Sans Mono',
      'Marlett',
      'Pristina',
      'TRAJAN PRO',
    ];

    const holder = document.createElement('div');
    holder.style.cssText =
      'position:absolute;left:-9999px;top:-9999px;visibility:hidden;font-size:48px';
    document.body.appendChild(holder);

    const measure = (fontFamily: string): { w: number; h: number } => {
      const span = document.createElement('span');
      span.style.fontFamily = fontFamily;
      span.textContent = testString;
      holder.appendChild(span);
      const size = { w: span.offsetWidth, h: span.offsetHeight };
      return size;
    };

    const defaults: Record<string, { w: number; h: number }> = {};
    for (const base of baseFonts) {
      defaults[base] = measure(base);
    }

    const found: string[] = [];
    for (const font of candidates) {
      const hit = baseFonts.some((base) => {
        const size = measure(`'${font}',${base}`);
        return size.w !== defaults[base].w || size.h !== defaults[base].h;
      });
      if (hit) found.push(font);
    }

    holder.remove();
    return { count: found.length, hash: shortHash(found.join('|')) };
  } catch {
    return null;
  }
}

/** JS-engine math quirks (FingerprintJS-style). Same inputs, different float results
 *  across engines and platforms. */
function computeMathFingerprint(): string | null {
  try {
    const M = Math;
    const values = [
      M.acos(0.123124234234234242),
      M.acosh?.(1e308) ?? 0,
      M.asin(0.123124234234234242),
      M.asinh?.(1) ?? 0,
      M.atanh?.(0.5) ?? 0,
      M.atan(0.5),
      M.sin(-1e300),
      M.sinh?.(1) ?? 0,
      M.cos(10.000000000123),
      M.cosh?.(1) ?? 0,
      M.tan(-1e300),
      M.tanh?.(1) ?? 0,
      M.exp(1),
      M.expm1?.(1) ?? 0,
      M.log1p?.(10) ?? 0,
      M.pow(M.PI, -100),
    ];
    return shortHash(values.map((v) => String(v)).join(','));
  } catch {
    return null;
  }
}

function readStored(): StoredRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.id === 'string' && typeof parsed.firstSeen === 'string') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function writeStored(record: StoredRecord): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // localStorage unavailable (private mode, blocked), degrade silently.
  }
}

function checkRevisit(currentId: string): RevisitStatus {
  const stored = readStored();

  if (!stored) {
    writeStored({ id: currentId, firstSeen: new Date().toISOString() });
    return {
      message:
        'First visit recorded on this device. No cookies used. Reload this page and it should recognize you.',
    };
  }

  if (stored.id === currentId) {
    const since = new Date(stored.firstSeen).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    return {
      message: `Recognized. Matches the fingerprint stored since ${since}. Still no cookies.`,
    };
  }

  writeStored({ id: currentId, firstSeen: new Date().toISOString() });
  return {
    message:
      "This signature doesn't match what was stored before. Different browser, device, or cleared storage.",
  };
}

function buildLogModel(
  sections: { heading: string; parts: { label: string; value: string }[] }[],
  status: RevisitStatus,
): { kind: 'head' | 'row' | 'blank' | 'status'; label?: string; value?: string; text: string }[] {
  const rows: { kind: 'head' | 'row' | 'blank' | 'status'; label?: string; value?: string; text: string }[] =
    [];
  for (const section of sections) {
    rows.push({ kind: 'head', text: `> ${section.heading}` });
    for (const p of section.parts) {
      rows.push({
        kind: 'row',
        label: p.label,
        value: p.value,
        text: `>   ${p.label.padEnd(18, ' ')} ${p.value}`,
      });
    }
  }
  rows.push({ kind: 'blank', text: '>' });
  rows.push({ kind: 'status', text: `> STATUS: ${status.message}` });
  return rows;
}

function buildUnderRowPlate(key: string): HTMLElement | null {
  const expl = getSignalExplain(key);
  if (!expl) return null;

  const plate = document.createElement('aside');
  plate.className = 'trace-row-plate';
  plate.setAttribute('aria-label', expl.title);

  const inner = document.createElement('div');
  inner.className = 'trace-row-plate-inner';

  const rail = document.createElement('div');
  rail.className = 'instr-drawer-rail';
  rail.setAttribute('aria-hidden', 'true');

  const head = document.createElement('header');
  head.className = 'instr-drawer-head';

  const title = document.createElement('h3');
  title.className = 'instr-drawer-title';
  title.textContent = expl.title;

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'instr-drawer-close';
  closeBtn.setAttribute('aria-label', 'Close explanation');
  closeBtn.textContent = 'stow';

  head.append(title, closeBtn);

  const dl = document.createElement('dl');
  dl.className = 'instr-drawer-copy';

  const entries: [string, string][] = [
    ['What', expl.what],
    ['How', expl.how],
    ['Means', expl.means],
  ];
  for (const [dtText, ddText] of entries) {
    const wrap = document.createElement('div');
    const dt = document.createElement('dt');
    dt.textContent = dtText;
    const dd = document.createElement('dd');
    dd.textContent = ddText;
    wrap.append(dt, dd);
    dl.appendChild(wrap);
  }

  inner.append(rail, head, dl);
  plate.appendChild(inner);
  return plate;
}

function renderLog(
  container: HTMLElement,
  rows: ReturnType<typeof buildLogModel>,
  reduceMotion: boolean,
): void {
  container.replaceChildren();

  let openKey: string | null = null;
  let openWrap: HTMLElement | null = null;

  function closeOpen(): void {
    if (!openWrap) return;
    openWrap.classList.remove('is-open');
    const btn = openWrap.querySelector('.trace-line-hit');
    btn?.setAttribute('aria-pressed', 'false');
    btn?.setAttribute('aria-expanded', 'false');
    const plate = openWrap.querySelector('.trace-row-plate');
    plate?.remove();
    openWrap = null;
    openKey = null;
  }

  function openRow(key: string, wrap: HTMLElement, btn: HTMLElement): void {
    if (openKey === key) {
      closeOpen();
      return;
    }
    closeOpen();
    const plate = buildUnderRowPlate(key);
    if (!plate) return;

    const closeBtn = plate.querySelector('.instr-drawer-close');
    closeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      closeOpen();
    });

    wrap.appendChild(plate);
    if (!reduceMotion) {
      void plate.offsetHeight;
    }
    wrap.classList.add('is-open');
    btn.setAttribute('aria-pressed', 'true');
    btn.setAttribute('aria-expanded', 'true');
    openWrap = wrap;
    openKey = key;
    plate.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  const appendRow = (row: (typeof rows)[number]) => {
    if (row.kind === 'row' && row.label) {
      const wrap = document.createElement('div');
      wrap.className = 'trace-row';
      wrap.dataset.explain = row.label;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'trace-line trace-line-hit';
      btn.dataset.explain = row.label;
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-expanded', 'false');
      btn.title = `Explain ${row.label}`;

      const prefix = document.createElement('span');
      prefix.className = 'trace-line-prefix';
      prefix.textContent = '>';

      const label = document.createElement('span');
      label.className = 'trace-line-label';
      label.textContent = row.label;

      const value = document.createElement('span');
      value.className = 'trace-line-value';
      value.textContent = row.value ?? '';

      const chevron = document.createElement('span');
      chevron.className = 'trace-line-chevron';
      chevron.setAttribute('aria-hidden', 'true');
      chevron.textContent = '▸';

      btn.append(prefix, label, value, chevron);
      btn.addEventListener('click', () => {
        openRow(row.label!, wrap, btn);
        btn.setAttribute('aria-expanded', openKey === row.label ? 'true' : 'false');
      });

      wrap.appendChild(btn);
      container.appendChild(wrap);
      return;
    }

    const el = document.createElement('div');
    el.className = 'trace-line';
    if (row.kind === 'status') el.classList.add('trace-line-status');
    if (row.kind === 'head') el.classList.add('trace-line-head');
    el.textContent = row.text;
    container.appendChild(el);
  };

  type TraceLog = HTMLElement & { _traceEsc?: (e: KeyboardEvent) => void };
  const log = container as TraceLog;
  if (log._traceEsc) document.removeEventListener('keydown', log._traceEsc);
  const onDocEscape = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && openKey) closeOpen();
  };
  log._traceEsc = onDocEscape;
  document.addEventListener('keydown', onDocEscape);

  if (reduceMotion) {
    rows.forEach(appendRow);
    return;
  }

  let i = 0;
  function addLine() {
    if (i >= rows.length) return;
    appendRow(rows[i]);
    i += 1;
    if (i < rows.length) setTimeout(addLine, 90);
  }
  addLine();
}

export function initFingerprintTrace(): void {
  const logEl = document.getElementById('traceLog');
  const forgetBtn = document.getElementById('traceForgetBtn');
  if (!logEl) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  async function runScan() {
    logEl!.setAttribute('aria-busy', 'true');

    const canvasHash = computeCanvasFingerprint();
    const webgl = computeWebglFingerprint();
    const audioValue = await computeAudioFingerprint();
    const fonts = computeFontFingerprint();
    const mathHash = computeMathFingerprint();
    const passive = getPassiveSignalParts();

    const activeParts = [
      { label: 'canvas.render', value: canvasHash ?? BLOCKED_LABEL },
      {
        label: 'webgl.renderer',
        value: webgl ? `${webgl.vendor} / ${webgl.renderer}` : BLOCKED_LABEL,
      },
      { label: 'audio.context', value: audioValue !== null ? audioValue.toFixed(10) : BLOCKED_LABEL },
      {
        label: 'fonts.detected',
        value: fonts ? `${fonts.count} hits · ${fonts.hash}` : BLOCKED_LABEL,
      },
      { label: 'math.engine', value: mathHash ?? BLOCKED_LABEL },
    ];

    const compositeInput = [
      canvasHash ?? 'nc',
      webgl ? `${webgl.vendor}${webgl.renderer}` : 'nw',
      audioValue !== null ? audioValue.toFixed(10) : 'na',
      fonts ? fonts.hash : 'nf',
      mathHash ?? 'nm',
      getRawSignalString(),
    ].join('::');

    const compositeId = shortHash(compositeInput);

    const sections = [
      { heading: 'PASSIVE SIGNALS', parts: passive },
      { heading: 'ACTIVE PROBES', parts: activeParts },
      { heading: 'COMPOSITE', parts: [{ label: 'composite.hash', value: compositeId }] },
    ];

    const status = checkRevisit(compositeId);
    const rows = buildLogModel(sections, status);

    renderLog(logEl!, rows, reduceMotion);
    logEl!.removeAttribute('aria-busy');
  }

  if (forgetBtn) {
    forgetBtn.addEventListener('click', () => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      runScan();
    });
  }

  runScan();
}
