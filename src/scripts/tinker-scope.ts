/** TINKER-SCOPE Model 1A — ported from Ghost tinker-theme-4 index.hbs */

export function initTinkerScope(): void {
  const canvas = document.getElementById('scopeCanvas') as HTMLCanvasElement | null;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const W = canvas.width;
  const H = canvas.height;
  const CX = W / 2;
  const CY = H / 2;
  const R = W / 2 - 4;

  let freq = 1.5;
  let targetFreq = 1.5;
  let phase = 0;
  const knobs: Record<string, number> = { vol: 0.6, time: 0.45, trig: 0.5, gain: 0.6 };
  let lastScrollY = window.scrollY;
  let lastScrollTime = Date.now();
  let scrollVelocity = 0;
  let idleTimer: ReturnType<typeof setTimeout> | null = null;
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

  Object.keys(knobs).forEach((k) => updateKnobVisual(k, knobs[k]));

  document.querySelectorAll('.scope-sticky .knob').forEach((knobEl) => {
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

  function drawFrame(animate: boolean) {
    ctx!.clearRect(0, 0, W, H);

    if (animate) {
      freq += (targetFreq - freq) * 0.06;
    }
    const displayFreq = freq * (0.3 + knobs.time * 1.4);
    if (animate) {
      phase += 0.04 + (displayFreq - 1.5) * 0.012;
    }

    const amplitude = R * 0.22 + knobs.vol * R * 0.42;
    const trigOffset = (knobs.trig - 0.5) * R * 0.5;
    const gainAlpha = 0.3 + knobs.gain * 0.7;
    const glowAlpha = knobs.gain * 0.3;

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

    ctx!.strokeStyle = 'rgba(0,110,30,0.45)';
    ctx!.lineWidth = 0.8;
    ctx!.beginPath();
    ctx!.moveTo(CX, 0);
    ctx!.lineTo(CX, H);
    ctx!.stroke();
    ctx!.beginPath();
    ctx!.moveTo(0, CY);
    ctx!.lineTo(W, CY);
    ctx!.stroke();

    const steps = 400;
    const pts: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * W;
      const t = (i / steps) * displayFreq * Math.PI * 2 + phase;
      const sq = Math.sin(t) >= 0 ? 1 : -1;
      const y = CY + trigOffset - sq * amplitude;
      pts.push([x, y]);
    }

    if (glowAlpha > 0.02) {
      ctx!.beginPath();
      ctx!.moveTo(pts[0][0], pts[0][1]);
      for (let gi = 1; gi < pts.length; gi++) ctx!.lineTo(pts[gi][0], pts[gi][1]);
      ctx!.strokeStyle = `rgba(80,220,110,${glowAlpha})`;
      ctx!.lineWidth = 10;
      ctx!.lineJoin = 'round';
      ctx!.stroke();
    }

    ctx!.beginPath();
    ctx!.moveTo(pts[0][0], pts[0][1]);
    for (let pi = 1; pi < pts.length; pi++) ctx!.lineTo(pts[pi][0], pts[pi][1]);
    const gr = Math.round(40 + gainAlpha * 18);
    const gg = Math.round(150 + gainAlpha * 70);
    const gb = Math.round(60 + gainAlpha * 20);
    ctx!.strokeStyle = `rgb(${gr},${gg},${gb})`;
    ctx!.lineWidth = 1.5 + knobs.gain * 1.2;
    ctx!.lineJoin = 'round';
    ctx!.stroke();

    const vignette = ctx!.createRadialGradient(CX, CY, R * 0.6, CX, CY, R);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx!.fillStyle = vignette;
    ctx!.beginPath();
    ctx!.arc(CX, CY, R, 0, Math.PI * 2);
    ctx!.fill();

    ctx!.restore();

    const hz = Math.round(200 + displayFreq * 280);
    const hzEl = document.getElementById('scopeHz');
    if (hzEl) hzEl.textContent = `${hz}Hz`;

    if (dragging !== 'time') {
      const el = document.getElementById('knobTime');
      if (el) el.style.transform = `rotate(${knobDeg(0.45) + (freq - 1.5) * 40}deg)`;
    }
  }

  function loop() {
    drawFrame(true);
    raf = requestAnimationFrame(loop);
  }

  if (reduceMotion) {
    drawFrame(false);
    return;
  }

  window.addEventListener(
    'scroll',
    () => {
      const now = Date.now();
      const dy = Math.abs(window.scrollY - lastScrollY);
      const dt = now - lastScrollTime || 1;
      scrollVelocity = (dy / dt) * 16;
      lastScrollY = window.scrollY;
      lastScrollTime = now;
      targetFreq = Math.min(5, 1.5 + scrollVelocity * 0.18);
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        targetFreq = 1.5;
      }, 400);
    },
    { passive: true },
  );

  loop();

  document.addEventListener('astro:before-swap', () => {
    cancelAnimationFrame(raf);
  });
}
