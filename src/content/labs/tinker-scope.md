---
title: "TINKER-SCOPE"
summary: "A hand-built oscilloscope rendered on HTML Canvas — no charting libraries, no dependencies."
date: 2026-08-01
tags: ["canvas", "javascript", "ui"]
---

TINKER-SCOPE is a small instrument-style widget: a CRT-look oscilloscope face drawn frame-by-frame on an HTML `<canvas>` element, with a hand-rolled render loop instead of any charting or animation library.

## What it does

- Draws a square-wave trace on a circular "screen," redrawn every animation frame with a glow pass and a vignette so it reads as glass instead of a flat canvas.
- Four knobs (`Vol`, `Time`, `Trig`, `Gain`) are draggable — clicking and dragging up or down rotates a knob and changes the trace's amplitude, frequency, vertical trigger offset, and brightness/glow respectively. Dragging is implemented directly with `mousedown`/`mousemove`/`touchmove` listeners, no gesture library.
- Scroll velocity on the page feeds into the displayed frequency: scroll fast and the trace speeds up and the Hz readout climbs, then eases back down once scrolling stops.
- Respects `prefers-reduced-motion`: with it set, the scope renders one static frame instead of looping.

## What it doesn't do

Being direct about scope (no pun intended): the knobs and scroll-coupling only affect this widget's own waveform. They aren't wired to anything else on the site — no hidden settings, no easter eggs, no side effects elsewhere. What it does do is real: canvas rendering, a real-time render loop, and real pointer/touch input handling, all built without a library.

## Why it's here

This is Labs, not the homepage, on purpose — it's evidence of a specific, bounded piece of craft (drawing and driving a canvas instrument by hand), not a hero decoration. The write-up above and the live instrument below are the same artifact, side by side, so you can read the claim and check it against the thing itself.
