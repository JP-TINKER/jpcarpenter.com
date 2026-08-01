/** RISK GAUGE Model 1 — analog risk-matrix instrument.
 *  Job: turn two knobs (Likelihood, Impact), read a real computed score/rating/action —
 *  not a toy readout. Score = Likelihood x Impact, the standard 5x5 risk-matrix heuristic.
 */

interface RiskResult {
  likelihood: number;
  impact: number;
  score: number;
  rating: string;
  action: string;
  band: 'low' | 'medium' | 'high' | 'critical';
}

export function initRiskGauge(): void {
  const canvas = document.getElementById('riskGaugeCanvas') as HTMLCanvasElement | null;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const W = canvas.width;
  const H = canvas.height;
  const CX = W / 2;
  const CY = H / 2;
  const R = W / 2 - 4;

  const startAngle = (135 * Math.PI) / 180;
  const sweepAngle = (270 * Math.PI) / 180;

  const knobs: Record<string, number> = { likelihood: 0.5, impact: 0.5 };
  let needleFraction = 0;
  let targetFraction = 0;
  let dragging: string | null = null;
  let dragStartY = 0;
  let dragStartVal = 0;
  let raf = 0;

  function clamp(v: number, lo: number, hi: number) {
    return Math.max(lo, Math.min(hi, v));
  }

  function knobDeg(v: number) {
    return -135 + v * 270;
  }

  function updateKnobVisual(name: string, v: number) {
    const el = document.getElementById('knob' + name.charAt(0).toUpperCase() + name.slice(1));
    if (el) el.style.transform = `rotate(${knobDeg(v)}deg)`;
  }

  function levelFromKnob(v: number) {
    return clamp(Math.round(v * 4) + 1, 1, 5);
  }

  function computeRisk(): RiskResult {
    const likelihood = levelFromKnob(knobs.likelihood);
    const impact = levelFromKnob(knobs.impact);
    const score = likelihood * impact;
    let rating: string;
    let action: string;
    let band: RiskResult['band'];
    if (score <= 4) {
      rating = 'LOW';
      action = 'Accept';
      band = 'low';
    } else if (score <= 9) {
      rating = 'MEDIUM';
      action = 'Monitor';
      band = 'medium';
    } else if (score <= 15) {
      rating = 'HIGH';
      action = 'Mitigate';
      band = 'high';
    } else {
      rating = 'CRITICAL';
      action = 'Escalate';
      band = 'critical';
    }
    return { likelihood, impact, score, rating, action, band };
  }

  Object.keys(knobs).forEach((k) => updateKnobVisual(k, knobs[k]));

  function updateReadout() {
    const r = computeRisk();
    targetFraction = (r.score - 1) / 24;

    const scoreEl = document.getElementById('gaugeScore');
    const ratingEl = document.getElementById('gaugeRating');
    const actionEl = document.getElementById('gaugeAction');
    if (scoreEl) scoreEl.textContent = `${r.score}/25`;
    if (ratingEl) {
      ratingEl.textContent = r.rating;
      ratingEl.className = `gauge-readout-val gauge-band-${r.band}`;
    }
    if (actionEl) actionEl.textContent = r.action;
  }

  updateReadout();
  if (!reduceMotion) {
    needleFraction = targetFraction;
  }

  document.querySelectorAll('.gauge-knobs .knob').forEach((knobEl) => {
    const name = knobEl.getAttribute('data-knob');
    if (!name || reduceMotion) return;
    (knobEl as HTMLElement).style.cursor = 'ns-resize';

    function onDown(e: Event) {
      e.preventDefault();
      const ev = e as MouseEvent & TouchEvent;
      dragging = name;
      dragStartY = ev.touches ? ev.touches[0].clientY : ev.clientY;
      dragStartVal = knobs[name!];
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onUp);
    }

    function onMove(e: Event) {
      if (!dragging) return;
      e.preventDefault();
      const ev = e as MouseEvent & TouchEvent;
      const y = ev.touches ? ev.touches[0].clientY : ev.clientY;
      const delta = (dragStartY - y) / 120;
      knobs[dragging] = clamp(dragStartVal + delta, 0, 1);
      updateKnobVisual(dragging, knobs[dragging]);
      updateReadout();
    }

    function onUp() {
      dragging = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    }

    knobEl.addEventListener('mousedown', onDown);
    knobEl.addEventListener('touchstart', onDown, { passive: false });
  });

  const bandColors = ['#5aaa60', '#c8be50', '#dc8c3c', '#d24646'];

  function drawFrame(animate: boolean) {
    ctx!.clearRect(0, 0, W, H);

    if (animate) {
      needleFraction += (targetFraction - needleFraction) * 0.1;
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

    ctx!.font = '9px "Space Mono", monospace';
    ctx!.fillStyle = 'rgba(200,196,182,0.55)';
    ctx!.textAlign = 'center';
    ctx!.textBaseline = 'middle';
    const labelR = R * 0.92;
    ctx!.fillText('LOW', CX + Math.cos(startAngle) * labelR, CY + Math.sin(startAngle) * labelR);
    ctx!.fillText(
      'CRIT',
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
    raf = requestAnimationFrame(loop);
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
