/** FINGERPRINT TRACE Model 1 — a real, working demonstration of browser fingerprinting,
 *  run only against the visitor viewing it. Canvas, WebGL, and Audio probes are genuine
 *  techniques used by real fingerprinting libraries; the composite hash they produce is
 *  stored in this browser's localStorage (nothing else, nowhere else) so a repeat visit
 *  to THIS site can be recognized without a cookie — the exact mechanism that makes
 *  cross-site fingerprinting possible, demonstrated honestly and scoped to one origin.
 *  Nothing computed here is ever sent over the network. A "Forget me" control clears it.
 */

import { getRawSignalString } from './browser-signals';

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
    ctx.font = '14px "Space Mono", monospace';
    ctx.fillStyle = '#5aaa60';
    ctx.fillText('bench fingerprint \u2014 0123 !@#$', 2, 2);
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
    // localStorage unavailable (private mode, blocked) — degrade silently; the read above
    // still happened and is still shown, only the "recognized on repeat visit" part is lost.
  }
}

function checkRevisit(currentId: string): RevisitStatus {
  const stored = readStored();

  if (!stored) {
    writeStored({ id: currentId, firstSeen: new Date().toISOString() });
    return {
      message:
        'First visit recorded on this device \u2014 no cookies used. Reload this page and it should recognize you.',
    };
  }

  if (stored.id === currentId) {
    const since = new Date(stored.firstSeen).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    return {
      message: `Recognized \u2014 matches the fingerprint stored since ${since}. Still no cookies.`,
    };
  }

  writeStored({ id: currentId, firstSeen: new Date().toISOString() });
  return {
    message:
      "This signature doesn't match what was stored before \u2014 different browser, device, or cleared storage.",
  };
}

function buildLines(
  parts: { label: string; value: string }[],
  status: RevisitStatus,
): string[] {
  const lines = ['> SCANNING PASSIVE SIGNALS\u2026'];
  parts.forEach((p) => {
    lines.push(`> ${p.label.padEnd(16, ' ')} ${p.value}`);
  });
  lines.push('>');
  lines.push(`> STATUS: ${status.message}`);
  return lines;
}

function renderLog(container: HTMLElement, lines: string[], reduceMotion: boolean): void {
  container.replaceChildren();

  if (reduceMotion) {
    lines.forEach((text) => {
      const el = document.createElement('div');
      el.className = 'trace-line';
      el.textContent = text;
      container.appendChild(el);
    });
    return;
  }

  let i = 0;
  function addLine() {
    if (i >= lines.length) return;
    const el = document.createElement('div');
    el.className = 'trace-line';
    el.textContent = lines[i];
    container.appendChild(el);
    i += 1;
    if (i < lines.length) setTimeout(addLine, 130);
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

    const parts = [
      { label: 'canvas.render', value: canvasHash ?? BLOCKED_LABEL },
      {
        label: 'webgl.renderer',
        value: webgl ? `${webgl.vendor} \u2014 ${webgl.renderer}` : BLOCKED_LABEL,
      },
      { label: 'audio.context', value: audioValue !== null ? audioValue.toFixed(10) : BLOCKED_LABEL },
    ];

    const compositeInput = [
      canvasHash ?? 'nc',
      webgl ? `${webgl.vendor}${webgl.renderer}` : 'nw',
      audioValue !== null ? audioValue.toFixed(10) : 'na',
      getRawSignalString(),
    ].join('::');

    const compositeId = shortHash(compositeInput);
    parts.push({ label: 'composite.hash', value: compositeId });

    const status = checkRevisit(compositeId);
    const lines = buildLines(parts, status);

    renderLog(logEl!, lines, reduceMotion);
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
