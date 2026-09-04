/** EXPOSURE GAUGE Model 1, passive instrument. Reads signals any site already gets
 *  on load and shows how identifying that combination is. Tap the face or a readout
 *  to slide a plain-English plate down the bay. Nothing leaves this browser.
 */

import { getBasicSignals, parseUserAgent } from './browser-signals';
import { bindExplainDrawer } from './signal-explain';

export function initExposureGauge(): void {
  const canvas = document.getElementById('exposureCanvas') as HTMLCanvasElement | null;
  const detectedLine = document.getElementById('exposureDetected');
  const root = document.getElementById('gaugeRoot');
  const drawer = document.getElementById('gaugeDrawer');
  const titleEl = document.getElementById('gaugeDrawerTitle');
  const whatEl = document.getElementById('gaugeDrawerWhat');
  const howEl = document.getElementById('gaugeDrawerHow');
  const meansEl = document.getElementById('gaugeDrawerMeans');
  const closeBtn = document.getElementById('gaugeDrawerClose');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (root && drawer && titleEl && whatEl && howEl && meansEl && closeBtn) {
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

  const W = canvas.width;
  const H = canvas.height;
  const CX = W / 2;
  const CY = H / 2;
  const R = W / 2 - 4;

  const startAngle = (135 * Math.PI) / 180;
  const sweepAngle = (270 * Math.PI) / 180;

  const { signals, privacyCredits } = getBasicSignals();
  const rawScore = signals.filter((s) => s.present).length - privacyCredits * 1.5;
  const maxScore = signals.length;
  const score = Math.max(0, Math.min(maxScore, rawScore));
  const targetFraction = score / maxScore;

  let rating: string;
  let note: string;
  let band: 'low' | 'medium' | 'high' | 'critical';
  const pct = targetFraction;
  if (pct <= 0.3) {
    rating = 'LOW';
    note = 'Already fairly quiet';
    band = 'low';
  } else if (pct <= 0.6) {
    rating = 'TYPICAL';
    note = 'Ordinary for most browsers';
    band = 'medium';
  } else if (pct <= 0.85) {
    rating = 'NOTABLE';
    note = 'A fairly specific combination';
    band = 'high';
  } else {
    rating = 'DISTINCTIVE';
    note = 'A highly specific combination';
    band = 'critical';
  }

  const { browser, os } = parseUserAgent(navigator.userAgent);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const lang = navigator.languages?.[0] ?? navigator.language ?? 'unknown locale';
  const cores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency}-core` : 'unknown-core';

  const detectedText = `${browser} on ${os} · ${lang} · ${tz} · ${cores} · ${screen.width}\u00d7${screen.height}`;

  const scoreEl = document.getElementById('gaugeScore2');
  const ratingEl = document.getElementById('gaugeRating2');
  const noteEl = document.getElementById('gaugeAction2');
  if (scoreEl) scoreEl.textContent = `${Math.round(score)}/${maxScore}`;
  if (ratingEl) {
    ratingEl.textContent = rating;
    ratingEl.className = `gauge-readout-val gauge-band-${band}`;
  }
  if (noteEl) noteEl.textContent = note;
  if (detectedLine) detectedLine.textContent = `Detected: ${detectedText}`;

  let needleFraction = reduceMotion ? targetFraction : 0;
  let raf = 0;

  const bandColors = ['#5aaa60', '#c8be50', '#dc8c3c', '#d24646'];

  function drawFrame(animate: boolean) {
    ctx!.clearRect(0, 0, W, H);

    if (animate) {
      needleFraction += (targetFraction - needleFraction) * 0.08;
    } else {
      needleFraction = targetFraction;
    }

    ctx!.save();
    ctx!.beginPath();
    ctx!.arc(CX, CY, R, 0, Math.PI * 2);
    ctx!.clip();

    ctx!.fillStyle = '#030b04';
    ctx!.fillRect(0, 0, W, H);

    ctx!.strokeStyle = 'rgba(0,80,20,0.22)';
    ctx!.lineWidth = 0.5;
    const gridStep = R / 3.5;
    for (let gx = CX - R; gx <= CX + R; gx += gridStep) {
      ctx!.beginPath();
      ctx!.moveTo(gx, 0);
      ctx!.lineTo(gx, H);
      ctx!.stroke();
    }
    for (let gy = CY - R; gy <= CY + R; gy += gridStep) {
      ctx!.beginPath();
      ctx!.moveTo(0, gy);
      ctx!.lineTo(W, gy);
      ctx!.stroke();
    }

    for (let i = 0; i < 4; i++) {
      const a0 = startAngle + (sweepAngle / 4) * i;
      const a1 = startAngle + (sweepAngle / 4) * (i + 1);
      ctx!.beginPath();
      ctx!.arc(CX, CY, R * 0.8, a0, a1);
      ctx!.strokeStyle = bandColors[i];
      ctx!.globalAlpha = 0.8;
      ctx!.lineWidth = R * 0.14;
      ctx!.stroke();
      ctx!.globalAlpha = 1;
    }

    ctx!.font = '9px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx!.fillStyle = 'rgba(200,196,182,0.55)';
    ctx!.textAlign = 'center';
    ctx!.textBaseline = 'middle';
    const labelR = R * 0.92;
    ctx!.fillText('QUIET', CX + Math.cos(startAngle) * labelR, CY + Math.sin(startAngle) * labelR);
    ctx!.fillText(
      'LOUD',
      CX + Math.cos(startAngle + sweepAngle) * labelR,
      CY + Math.sin(startAngle + sweepAngle) * labelR,
    );

    const angle = startAngle + needleFraction * sweepAngle;
    const needleLen = R * 0.62;
    const nx = CX + Math.cos(angle) * needleLen;
    const ny = CY + Math.sin(angle) * needleLen;

    ctx!.beginPath();
    ctx!.moveTo(CX, CY);
    ctx!.lineTo(nx, ny);
    ctx!.strokeStyle = 'rgba(90,200,100,0.35)';
    ctx!.lineWidth = 9;
    ctx!.lineCap = 'round';
    ctx!.stroke();

    ctx!.beginPath();
    ctx!.moveTo(CX, CY);
    ctx!.lineTo(nx, ny);
    ctx!.strokeStyle = '#8fe89a';
    ctx!.lineWidth = 2.5;
    ctx!.lineCap = 'round';
    ctx!.stroke();

    ctx!.beginPath();
    ctx!.arc(CX, CY, 5, 0, Math.PI * 2);
    ctx!.fillStyle = '#8fe89a';
    ctx!.fill();

    const vignette = ctx!.createRadialGradient(CX, CY, R * 0.6, CX, CY, R);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx!.fillStyle = vignette;
    ctx!.beginPath();
    ctx!.arc(CX, CY, R, 0, Math.PI * 2);
    ctx!.fill();

    ctx!.restore();
  }

  function loop() {
    drawFrame(true);
    if (Math.abs(needleFraction - targetFraction) > 0.001) {
      raf = requestAnimationFrame(loop);
    }
  }

  if (reduceMotion) {
    drawFrame(false);
    return;
  }

  loop();

  document.addEventListener('astro:before-swap', () => {
    cancelAnimationFrame(raf);
  });
}
