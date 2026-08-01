---
title: "Risk Gauge"
summary: "An analog risk-matrix instrument — turn Likelihood and Impact, read a real computed score, rating, and recommended action."
date: 2026-08-01
tags: ["canvas", "javascript", "grc"]
---

Risk Gauge is a second instrument built on the same chrome as [TINKER-SCOPE](/labs/tinker-scope): the same CRT-style circular housing, the same draggable-knob mechanics. Different job — this one is a working risk-matrix calculator, not a waveform toy.

## What it does

- Two knobs, `Likely` and `Impact`, each mapped to a 1–5 level — the two axes of a standard qualitative risk matrix.
- The needle sweeps to a position driven by `Score = Likelihood × Impact` (1–25), the same multiplicative heuristic behind most 5×5 risk registers.
- The digital readout below the gauge face is not decoration: `Score`, `Rating` (Low / Medium / High / Critical), and `Recommend` (Accept / Monitor / Mitigate / Escalate) all update live from the actual computed value, color-coded to match the gauge band the needle sits in.
- Respects `prefers-reduced-motion`: the needle renders at its resting position in one static frame instead of animating into place.

## What it doesn't do

This is a simplified two-factor version of a real technique — actual risk registers often weight likelihood and impact differently, break impact into sub-categories (financial, reputational, operational), or use a 3×3 or custom scale instead of 5×5. This instrument compresses that down to two knobs so the mechanic stays legible in thirty seconds. The math behind the needle is real and standard; the specific 5×5 scale and thresholds here are illustrative, not a citation of any single framework's exact numbers.

## Why it's here

The last few things I tried building for this section were text-in-a-box explainers — accurate, but nothing to actually look at or use. This is the fix: an instrument you turn and watch respond, that also happens to compute something a GRC analyst computes for real. Look and function, not one or the other.
